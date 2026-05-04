# 🤖 AI Content SaaS — MERN Stack

> A full-stack AI-powered content generation platform built with Next.js, Node.js/Express, MongoDB, and Google Gemini. Subscriptions via Stripe. Deployed on Vercel + Railway.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)

**[Live Demo](#)** · **[Blueprint Doc](#)** · **[Report Bug](#)** · **[Request Feature](#)**

</div>

---

## 📸 Screenshots

### Home Page

![Landing Page UI](docs/ui-screenshots/landing-page.png)

---

## 📐 System Architecture

The app follows a **fully separated MERN architecture** — frontend and backend are independent deployments that communicate only via HTTP REST API.

![AI SaaS Architecture](docs/system-design/ai_saas_system_architecture_diagram.png)

### Architecture Overview

```
User (Browser)
     │
     ▼
Frontend (Next.js 14) ──── REST API ────► Backend API (Node.js / Express)
  Vercel Edge                                    Railway
                                          ┌──────┴──────┐
                                          │             │
                                    MongoDB Atlas    External Services
                                    (User, Content,  ┌── Gemini AI
                                     Subscription)   ├── Stripe
                                                     └── Upstash Redis
```

| Layer              | Technology                                        | Deployment   |
| ------------------ | ------------------------------------------------- | ------------ |
| Frontend           | Next.js 14 · App Router · TailwindCSS · shadcn/ui | Vercel       |
| Backend            | Node.js · Express.js · JWT · Passport.js          | Railway      |
| Database           | MongoDB Atlas · Mongoose ODM                      | Atlas Cloud  |
| AI                 | Google Gemini 1.5 Pro                             | Gemini API   |
| Payments           | Stripe (Checkout + Webhooks)                      | Stripe Cloud |
| Cache / Rate Limit | Upstash Redis                                     | Upstash Edge |

---

## 🔐 Auth Flow

Login and signup support both **Email/Password credentials** and **Google OAuth**.

![Auth Flow](docs/system-design/auth_flow_whiteboard_diagram_1.png)

### How it works

```
User → Login Form → POST /api/v1/auth/login
                         │
              Backend verifies (OAuth / bcrypt)
                    │              │
              JWT created     User stored in DB
                    │
              Frontend gets JWT (HttpOnly cookie)
                    │
              Dashboard Access ✓
```

1. User submits credentials or clicks "Sign in with Google"
2. Backend verifies via Passport.js (credentials or Google OAuth strategy)
3. JWT signed with `userId + plan + credits`, stored as HttpOnly cookie (7-day expiry)
4. Next.js `middleware.ts` guards all `/dashboard/*` routes — redirects to `/login` if no valid JWT
5. Frontend reads user data via `GET /api/v1/user/me` on every session start

![Auth Flow Detail](docs/system-design/auth_flow_whiteboard_diagram_2.png)

---

## 🤖 AI Generation Data Flow

All AI calls happen **server-side only**. The Gemini API key is never exposed to the browser.

![AI Generation Flow](docs/system-design/ai_generation_data_flow_whiteboard.png)

```
1. User enters prompt
        │
2. Frontend → POST /api/v1/generate  (with JWT cookie)
        │
3. Backend checks auth + credits (atomic MongoDB query)
        │
4. Backend calls Gemini API (server-side only 🔒)
        │
5. Gemini returns generated content
        │
6. Backend stores result in MongoDB (Content collection)
        │
7. Backend returns response → Frontend displays content ✓
```

**Credit Deduction (race-condition safe):**

```js
// Atomic update — prevents double-spending
User.findOneAndUpdate(
  { _id: userId, credits: { $gte: cost } },
  { $inc: { credits: -cost } },
);
// Returns null if insufficient credits → 402 response
```

---

## 💳 Stripe Payment Flow

![Stripe Payment Flow](docs/system-design/saas_stripe_payment_flow_whiteboard.png)

```
User clicks "Upgrade"
        │
Frontend → POST /api/v1/payments/checkout
        │
Backend creates Stripe Checkout Session
        │
Stripe Checkout Page (hosted by Stripe — PCI compliant)
        │
Payment Success
        │
Stripe Webhook → POST /api/v1/webhooks/stripe
        │
Backend verifies signature → Updates DB (user becomes PRO) ✓
```

**Handled Webhook Events:**
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate Pro plan, add 1000 credits |
| `customer.subscription.deleted` | Downgrade to Free plan |
| `invoice.payment_failed` | Email alert, mark past_due |

> ⚠️ **Critical:** The webhook route uses `express.raw()` — NOT the JSON body parser. Stripe signature verification requires the raw request body.

---

## 🗄️ Database Schema

### Users Collection

![User Schema](docs/system-design/user_schema_whiteboard_diagram.png)

```ts
// User.model.ts
{
  _id:                ObjectId,
  name:               String,
  email:              String (unique),
  password:           String (bcrypt, optional — null for OAuth),
  image:              String (avatar URL),
  role:               "FREE" | "PRO",
  credits:            Number (default: 10),
  stripeCustomerId:   String,
  subscriptionStatus: String,
  createdAt:          Date
}
```

### Content (Generation) Collection

![Content Schema](docs/system-design/auth_flow_whiteboard_diagram_2.png)

```ts
// Content.model.ts (Generation)
{
  _id:       ObjectId,
  userId:    ObjectId → ref: Users,   // FK
  type:      Enum: "blog" | "caption" | "idea",
  prompt:    String,
  result:    String,
  createdAt: Date
}
// Index: { userId: 1, createdAt: -1 }
```

### Subscriptions Collection

![Subscription Schema Whiteboard](docs/system-design/subscription_schema_whiteboard_diagram.png)

```ts
// Subscription.model.ts
{
  userId:                 ObjectId → ref: Users,   // FK
  stripeSubscriptionId:   String (Unique),
  plan:                   "monthly" | "yearly",
  status:                 "active" | "cancelled",
  currentPeriodEnd:       Date
}
```

**Collection Relationships:**

```
Users (1) ──────────────── (many) Content
Users (1) ──────────────── (1)    Subscriptions
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier works)
- Google Cloud Console project (for OAuth)
- Stripe account
- Google AI Studio (Gemini API key)
- Upstash account (Redis)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-content-saas.git
cd ai-content-saas
```

### 2. Setup the Backend (`/server`)

```bash
cd server
npm install
cp .env.example .env
# Fill in .env values (see Environment Variables section below)
npm run dev
# Server runs at http://localhost:5000
```

### 3. Setup the Frontend (`/client`)

```bash
cd client
npm install
cp .env.example .env.local
# Fill in .env.local values
npm run dev
# Client runs at http://localhost:3000
```

### 4. Setup Stripe Webhook (Local Dev)

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe
# Copy the webhook signing secret → add to server .env as STRIPE_WEBHOOK_SECRET
```

---

## ⚙️ Environment Variables

### `/client/.env.local`

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# App URL (for OG images, redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (publishable key only — safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google OAuth (client ID only)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

### `/server/.env`

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-saas

# JWT
JWT_SECRET=your-super-secret-32-char-key-here
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Google Gemini AI
GEMINI_API_KEY=AIza...
GEMINI_MODEL=gemini-1.5-pro

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

> 🔒 **Never commit `.env` or `.env.local`** — only `.env.example` with empty values.

---

## 📁 Project Structure

```
ai-content-saas/
│
├── /client                     # Next.js 14 Frontend (Vercel)
│   ├── app/
│   │   ├── (auth)/             # Login, Register pages
│   │   ├── (dashboard)/        # Protected: Generate, History, Settings
│   │   ├── (marketing)/        # Landing page, Pricing
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/               # LoginForm, GoogleButton
│   │   ├── dashboard/          # Sidebar, StatsCard, CreditsBar
│   │   ├── generate/           # GenerateForm, OutputCard, TemplateSelector
│   │   └── shared/             # ErrorBoundary, LoadingSkeleton, UpgradeModal
│   ├── hooks/                  # useUser, useGenerate, useCredits
│   ├── lib/                    # Axios instance, Zod schemas
│   ├── store/                  # Zustand: authStore, uiStore
│   └── middleware.ts            # Edge auth guard
│
├── /server                     # Express.js Backend (Railway)
│   └── src/
│       ├── routes/             # auth, user, generate, payment, webhook
│       ├── controllers/        # Business logic per route
│       ├── middleware/         # auth, rateLimit, validate, error
│       ├── models/             # User, Content, Subscription (Mongoose)
│       ├── services/           # gemini.service, stripe.service, redis.service
│       ├── config/             # db.ts, passport.ts, constants.ts
│       ├── app.ts              # Express setup
│       └── server.ts           # Entry point
│
├── README.md
└── .gitignore
```

---

## 🔌 API Reference

All endpoints prefixed with `/api/v1`. Protected routes require JWT cookie.

### Auth

| Method | Endpoint         | Auth | Description                        |
| ------ | ---------------- | ---- | ---------------------------------- |
| `POST` | `/auth/register` | ❌   | Email + password signup            |
| `POST` | `/auth/login`    | ❌   | Credentials login, sets JWT cookie |
| `GET`  | `/auth/google`   | ❌   | Google OAuth redirect              |
| `POST` | `/auth/logout`   | ✅   | Clear JWT cookie                   |

### User

| Method | Endpoint        | Auth | Description                  |
| ------ | --------------- | ---- | ---------------------------- |
| `GET`  | `/user/me`      | ✅   | Get profile + credits + plan |
| `PUT`  | `/user/profile` | ✅   | Update name / avatar         |

### AI Generate

| Method   | Endpoint            | Auth               | Description                            |
| -------- | ------------------- | ------------------ | -------------------------------------- |
| `POST`   | `/generate`         | ✅ 🔒 Rate limited | Generate content (deducts credits)     |
| `GET`    | `/generate/history` | ✅                 | Paginated history (`?page=1&limit=20`) |
| `DELETE` | `/generate/:id`     | ✅                 | Delete a generation (owner only)       |

### Payments

| Method | Endpoint             | Auth        | Description                    |
| ------ | -------------------- | ----------- | ------------------------------ |
| `POST` | `/payments/checkout` | ✅          | Create Stripe Checkout Session |
| `GET`  | `/payments/portal`   | ✅          | Stripe billing portal URL      |
| `POST` | `/webhooks/stripe`   | ❌ Raw body | Handle Stripe events           |

---

## 🌿 Git Workflow

This project follows a strict **GitFlow-inspired** branching strategy.

```
main          ← production (protected, tag each release)
  └── develop ← integration (all features merge here first)
        ├── feature/auth-system
        ├── feature/ai-generate
        ├── feature/stripe-billing
        ├── fix/credits-bug
        └── chore/security-audit
```

### Branch Rules

- **Never push directly to `main`** — always via PR from `develop`
- **Feature branches** branch from `develop`, merge back via Squash PR
- **Hotfixes** branch from `main`, merge to `main` AND `develop`
- **Delete branch** after every PR merge

### Commit Convention

```
feat(auth): add google oauth passport strategy
fix(api): resolve credits not deducting on generate
chore(security): add helmet.js and strict cors config
docs: add complete setup guide to README
perf(db): add compound index on userId + createdAt
```

---

## 📦 Tech Stack

| Category          | Technology                                                  |
| ----------------- | ----------------------------------------------------------- |
| **Frontend**      | Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui |
| **State**         | Zustand (global), TanStack Query (server state)             |
| **Backend**       | Node.js, Express.js, TypeScript                             |
| **Auth**          | JWT (HttpOnly cookie), Passport.js (Google OAuth), bcrypt   |
| **Database**      | MongoDB Atlas, Mongoose ODM                                 |
| **AI**            | Google Gemini 1.5 Pro (`@google/generative-ai`)             |
| **Payments**      | Stripe (Checkout Sessions + Webhooks)                       |
| **Rate Limiting** | Upstash Redis (sliding window)                              |
| **Validation**    | Zod (shared schemas frontend + backend)                     |
| **Deploy**        | Vercel (client), Railway (server)                           |

---

## 🗓️ 30-Day Build Roadmap

| Phase         | Days  | Focus                                                     |
| ------------- | ----- | --------------------------------------------------------- |
| 🟢 Foundation | 01–05 | Monorepo setup, MongoDB models, Auth (JWT + Google OAuth) |
| 🔵 Core       | 06–12 | Dashboard UI, Gemini integration, Credits system, History |
| 🟣 Payments   | 13–19 | Stripe checkout, Webhooks, Pricing UI, Plan gating        |
| 🟡 Polish     | 20–24 | Landing page, Settings, SEO, Theme toggle                 |
| 🔴 Security   | 25–28 | Security audit, Performance, PDF export bonus             |
| 🩷 Launch     | 29–30 | Vercel + Railway deploy, smoke test, v1.0.0 tag           |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel Dashboard → Settings → Env Variables
NEXT_PUBLIC_API_URL=https://your-server.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Backend → Railway

```bash
# Connect GitHub repo to Railway
# Set all server .env vars in Railway Dashboard → Variables
# Railway auto-deploys on push to main
```

### Post-Deploy Checklist

- [ ] Update `GOOGLE_CALLBACK_URL` to Railway production URL
- [ ] Update Stripe webhook endpoint to Railway production URL
- [ ] Update `CLIENT_URL` to Vercel production URL
- [ ] Test auth flow (register → login → dashboard)
- [ ] Test AI generate (prompt → Gemini → credit deducted → stored in DB)
- [ ] Test Stripe checkout (upgrade → webhook → user becomes PRO)
- [ ] Verify mobile responsive on iOS Safari
- [ ] Check no `console.log` leaking in production

---

## 🔒 Security Notes

- **API keys** are server-side only — never in `/client` env vars except `NEXT_PUBLIC_*` safe keys
- **JWT** stored as HttpOnly cookie — not accessible via JavaScript (XSS protection)
- **Stripe webhook** verified with `constructEvent()` — raw body required, no JSON parser override
- **Helmet.js** sets secure HTTP headers on all Express routes
- **CORS** configured with strict origin allowlist (only your Vercel domain)
- **Input sanitization** via `express-validator` before any DB writes
- **Rate limiting** via Upstash Redis — 10 req/hour (Free), 100 req/hour (Pro)
- **Credit deduction** uses atomic MongoDB `$inc` to prevent race conditions

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat(ui): add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request → `develop` branch

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ by **Niraj** · AI SaaS MERN Blueprint · v1.0.0

</div>
