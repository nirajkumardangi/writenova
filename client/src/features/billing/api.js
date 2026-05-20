import api from "@/lib/api";

export async function checkoutSession() {
  return api.post("/billing/checkout");
}
