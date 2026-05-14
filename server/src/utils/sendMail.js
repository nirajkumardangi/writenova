import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

const sendMail = async (email, otp) => {
  await transporter.sendMail({
    from: env.SMTP_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Email Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="background:#ffffff; border:1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 20px 20px;">
              <h1 style="margin:0; font-size:38px; color:#111111; font-weight:700;">
                Write Nova AI
              </h1>
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td align="center" style="padding:10px 20px 20px;">
              <div style="
                width:70px;
                height:70px;
                background:#000;
                clip-path: polygon(0 0, 100% 15%, 100% 85%, 0 100%);
                display:flex;
                align-items:center;
                justify-content:center;
                color:#fff;
                font-size:28px;
                margin:auto;
              ">
                ✨
              </div>
            </td>
          </tr>

          <!-- OTP -->
          <tr>
            <td align="center" style="padding:10px 30px;">
              <p style="font-size:40px; margin:0; color:#111; font-weight:bold;">
                Your code is ${otp}
              </p>
            </td>
          </tr>

          <!-- Description -->
          <tr>
            <td style="padding:30px 50px 10px; color:#444444; font-size:16px; line-height:26px;">
              Use this code to sign in to your Write Nova AI account.
            </td>
          </tr>

          <tr>
            <td style="padding:10px 50px 20px; color:#444444; font-size:16px; line-height:26px;">
              This code will expire in 5 minutes and can only be used once.
              Alternatively, you can use the magic link below, which is valid
              for two hours:
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:20px;">
              <a href="https://yourdomain.com/login"
                style="
                  background:#111111;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:30px;
                  display:inline-block;
                  font-size:16px;
                  font-weight:bold;
                ">
                Sign in to Write Nova AI
              </a>
            </td>
          </tr>

          <!-- Fallback Link -->
          <tr>
            <td style="padding:10px 50px; color:#444444; font-size:14px; line-height:24px;">
              If the button above doesn't work, copy and paste this link into your browser:
            </td>
          </tr>

          <tr>
            <td style="padding:0 50px 30px;">
              <a href="https://yourdomain.com/login"
                style="color:#000000; font-size:14px; word-break:break-all;">
                https://writenova.com/login
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #e5e5e5; padding:30px 40px; text-align:center; color:#777777; font-size:12px; line-height:20px;">
              If you did not make this request, you can safely ignore this email.
              <br /><br />
              The Write Nova AI Team
              <br /><br />
              © 2026 Write Nova AI. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
    `,
  });
};

export default sendMail;
