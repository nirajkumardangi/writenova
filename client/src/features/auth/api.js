import api from "@/lib/api";

export async function loginWithEmail(email) {
  return api.post("/auth/send-otp", { email });
}

export async function verifyOtp(email, otp) {
  return api.post("/auth/verify-otp", { email, otp });
}
