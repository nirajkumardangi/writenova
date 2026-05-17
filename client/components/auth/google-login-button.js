"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

import { useCallback } from "react";

export default function GoogleLoginButton({ mode = "signup", onClose }) {
  const { login } = useAuth();

  const handleSuccess = useCallback(async (credentialResponse) => {
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
  }, [login, onClose]);

  const handleError = useCallback(() => {
    console.log("Login Failed");
  }, []);

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text="continue_with"
        shape="pill"
        width="320"
      />
    </div>
  );
}
