"use client";

import { useState } from "react";
import { CreditCard, Check, Sparkles, Zap, ShieldCheck } from "lucide-react";

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | annual
  const [selectedPlan, setSelectedPlan] = useState("free"); // free | pro
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSelectPlan = (planKey) => {
    if (planKey === selectedPlan) return;
    setLoading(true);
    setTimeout(() => {
      setSelectedPlan(planKey);
      setLoading(false);
      setSuccessMsg(
        planKey === "pro"
          ? "Successfully upgraded to WriteNova Pro! Enjoy unlimited AI article generation."
          : "Plan switched to Free tier."
      );
      setTimeout(() => setSuccessMsg(""), 5000);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-4xl py-8 px-4 sm:px-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-black stroke-[1.5]" />
            Billing & Plans
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 font-sans">
            Manage your subscription, change plans, and unlock advanced AI publishing capabilities.
          </p>
        </div>

        {/* Monthly / Annual Billing Toggle */}
        <div className="flex items-center bg-gray-100 p-1 rounded-full self-start sm:self-auto select-none">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              billingCycle === "monthly" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              billingCycle === "annual" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
            }`}
          >
            Annual <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-extrabold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in zoom-in-95 duration-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Free Plan Card */}
        <div
          className={`border rounded-3xl p-6 transition-all flex flex-col justify-between ${
            selectedPlan === "free"
              ? "border-gray-300 bg-white shadow-sm ring-2 ring-black/5"
              : "border-gray-100 bg-gray-50/50 hover:bg-white"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic</span>
              {selectedPlan === "free" && (
                <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Current Plan
                </span>
              )}
            </div>

            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">Free Writer</h3>
            <p className="text-xs text-gray-500 mb-6">Ideal for casual writers starting out.</p>

            <div className="mb-6">
              <span className="text-4xl font-serif font-extrabold text-gray-900">$0</span>
              <span className="text-xs text-gray-400 font-medium"> / month forever</span>
            </div>

            <ul className="space-y-3 text-xs text-gray-600 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Up to 5 draft stories
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Basic rich-text editor
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Standard public profile page
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" /> 3 AI story generation prompts/day
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan("free")}
            disabled={selectedPlan === "free" || loading}
            className={`w-full py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedPlan === "free"
                ? "bg-gray-100 text-gray-400 cursor-default"
                : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
            }`}
          >
            {selectedPlan === "free" ? "Active Plan" : "Downgrade to Free"}
          </button>
        </div>

        {/* Pro Plan Card */}
        <div
          className={`border rounded-3xl p-6 transition-all flex flex-col justify-between relative overflow-hidden ${
            selectedPlan === "pro"
              ? "border-black bg-gradient-to-b from-neutral-900 to-black text-white shadow-xl"
              : "border-neutral-900 bg-neutral-950 text-white hover:border-black"
          }`}
        >
          {/* Subtle gradient glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 fill-indigo-400" /> Pro Edition
              </span>
              {selectedPlan === "pro" ? (
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Active Plan
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Recommended
                </span>
              )}
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-1">WriteNova Pro</h3>
            <p className="text-xs text-neutral-400 mb-6">For serious writers, creators & publishers.</p>

            <div className="mb-6">
              <span className="text-4xl font-serif font-extrabold text-white">
                {billingCycle === "monthly" ? "$12" : "$9.60"}
              </span>
              <span className="text-xs text-neutral-400 font-medium"> / month</span>
            </div>

            <ul className="space-y-3 text-xs text-neutral-300 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" /> Unlimited drafts & published stories
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" /> Unlimited AI Article Streaming Generation
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" /> Custom domain & SEO metadata tags
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" /> Advanced reader engagement analytics
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-indigo-400 flex-shrink-0" /> Priority AI response queue
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan("pro")}
            disabled={selectedPlan === "pro" || loading}
            className={`w-full py-3 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              selectedPlan === "pro"
                ? "bg-neutral-800 text-neutral-400 cursor-default"
                : "bg-white text-black hover:bg-neutral-100 shadow-md active:scale-95"
            }`}
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            {loading ? "Processing..." : selectedPlan === "pro" ? "Current Subscription" : "Upgrade to Pro"}
          </button>
        </div>
      </div>

      {/* Security note */}
      <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-gray-400" />
        <span>Secure 256-bit SSL encrypted transactions. Cancel anytime with one click.</span>
      </div>
    </div>
  );
}
