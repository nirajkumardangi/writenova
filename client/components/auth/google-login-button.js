"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function GoogleLoginButton({ mode = "signup", onClose }) {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("Google auth response:", res.data);
      if (res.data.success) {
        login(res.data.user, res.data.accessToken);
        if (onClose) onClose();
      } else {
        console.warn("Login failed:", res.data);
      }
    } catch (error) {
      console.error("Google login error:", error.response?.data || error);
    }
  };

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
        text={mode === "signup" ? "signup_with" : "signin_with"}
        shape="pill"
        width="320"
      />
    </div>
  );
}
