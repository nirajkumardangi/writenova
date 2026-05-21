import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
          <CreditCard className="h-8 w-8 stroke-[1.5]" />
          Billing & Plans
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your subscription plans and billing information.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Current Plan</h3>
        <p className="text-sm text-gray-500 mb-4">
          You are currently on the Free tier.
        </p>
        <button className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 active:scale-95 transition-all shadow-sm">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}
