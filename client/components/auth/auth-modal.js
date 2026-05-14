"use client";

import { useState } from "react";
import { X, Mail } from "lucide-react";
import GoogleProvider from "./google-provider";
import GoogleLoginButton from "./google-login-button";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal({ isOpen, onClose, mode, setMode }) {
  const { login } = useAuth();
  const [view, setView] = useState("options"); // "options" | "email" | "otp"
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setView("options"); // Reset state on close
    setMode("signup");
    setName("");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    onClose();
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "signup" ? "login" : "signup"));
    setView("options");
    setError("");
  };

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^\d+$/.test(value)) return;
    
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError("");
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setView("otp");
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (!email || otpString.length !== 6) return;

    try {
      setIsVerifying(true);
      setError("");
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { 
        email, 
        otp: otpString 
      });
      console.log("Login successful:", res.data);
      login(res.data.user, res.data.accessToken);
      handleClose(); // Close the modal upon success
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please check and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 sm:bg-[#F3F4F6]/80 sm:backdrop-blur-sm">
      <div className="relative flex w-full max-w-[570px] flex-col items-center justify-center rounded bg-white p-10 shadow-2xl sm:p-14">
        <GoogleProvider>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 text-gray-400 transition-colors hover:text-gray-800 sm:right-6 sm:top-6 cursor-pointer"
            aria-label="Close"
          >
            <X className="h-6 w-6 stroke-[1.5]" />
          </button>

          {view === "options" && (
            <div className="flex w-full max-w-[320px] flex-col items-center mt-2">
              <h2 className="mb-12 font-serif text-[32px] sm:text-[40px] text-gray-900">
                {mode === "signup" ? "Join WriteNova." : "Welcome back."}
              </h2>

              <div className="flex w-full flex-col gap-3">
                <GoogleLoginButton mode={mode} onClose={handleClose} />

                <button
                  onClick={() => setView("email")}
                  className="flex w-full items-center rounded-full border border-gray-400 bg-white px-4 py-2.5 transition-colors cursor-pointer hover:border-black"
                >
                  <div className="flex w-6 justify-center">
                    <Mail className="h-[22px] w-[22px] text-gray-800 stroke-[1.5]" />
                  </div>
                  <span className="flex-1 text-center text-[15px] font-medium text-gray-800">
                    Sign {mode === "signup" ? "up" : "in"} with email
                  </span>
                </button>
              </div>

              <p className="mt-8 text-[15px] text-gray-800">
                {mode === "signup" ? "Already have an account? " : "No account? "}
                <button
                  onClick={toggleMode}
                  className="font-bold text-[#1a8917] cursor-pointer hover:text-[#105c0f] hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create one"}
                </button>
              </p>

              {mode === "signup" && (
                <p className="mt-10 text-center text-[13px] text-gray-500 max-w-[480px]">
                  By clicking "Sign up", you accept WriteNova's{" "}
                  <a href="#" className="underline hover:text-gray-800">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-gray-800">
                    Privacy Policy
                  </a>
                  .
                </p>
              )}
            </div>
          )}

          {view === "email" && (
            <div className="flex w-full max-w-[320px] flex-col items-center">
              <Mail className="mb-6 h-[38px] w-[38px] text-gray-800 stroke-[1]" />
              <h2 className="mb-10 text-center font-serif text-[32px] leading-[1.2] text-gray-900">
                Sign {mode === "signup" ? "up" : "in"} with email
              </h2>

              <form className="w-full" onSubmit={handleSendOTP}>
                {mode === "signup" && (
                  <div className="mb-5 w-full">
                    <label
                      className="mb-1.5 block text-[13px] text-gray-800"
                      htmlFor="name"
                    >
                      Your full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded border border-transparent bg-gray-50 px-3 py-2 text-[15px] outline-none transition-colors hover:bg-gray-100 focus:border-black focus:bg-white"
                    />
                  </div>
                )}

                <div className="mb-8 w-full">
                  <label
                    className="mb-1.5 block text-[13px] text-gray-800"
                    htmlFor="email"
                  >
                    Your email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded border border-transparent bg-gray-50 px-3 py-2 text-[15px] outline-none transition-colors hover:bg-gray-100 focus:border-black focus:bg-white"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mb-8 w-full rounded-full bg-black py-[10px] text-[15px] font-medium text-white transition-opacity cursor-pointer hover:bg-black/80 disabled:opacity-50"
                >
                  {loading ? "Sending OTP..." : (mode === "signup" ? "Create account" : "Sign in")}
                </button>
              </form>

              <button
                onClick={() => {
                  setView("options");
                  setError("");
                }}
                className="mb-8 text-[15px] font-medium text-gray-800 underline cursor-pointer hover:text-black"
              >
                Back to sign {mode === "signup" ? "up" : "in"} options
              </button>

              <p className="text-[15px] text-gray-800">
                {mode === "signup" ? "Already have an account? " : "No account? "}
                <button
                  onClick={toggleMode}
                  className="font-bold cursor-pointer text-[#1a8917] hover:text-[#105c0f] hover:underline"
                >
                  {mode === "signup" ? "Sign in" : "Create one"}
                </button>
              </p>

              {mode === "signup" && (
                <p className="mt-12 text-center text-[13px] text-gray-500 max-w-[480px]">
                  By clicking "Create Account", you accept WriteNova's{" "}
                  <a href="#" className="underline hover:text-gray-800">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-gray-800">
                    Privacy Policy
                  </a>
                  .
                </p>
              )}
            </div>
          )}

          {view === "otp" && (
            <div className="flex w-full max-w-[420px] flex-col items-center">
              <Mail className="mb-6 h-[48px] w-[48px] text-gray-800 stroke-[1]" />
              <h2 className="mb-6 text-center font-serif text-[32px] sm:text-[36px] leading-[1.2] text-gray-900">
                Check your email inbox
              </h2>
              <p className="mb-10 text-center text-[15px] text-gray-800 leading-relaxed">
                To sign {mode === "signup" ? "up" : "in"}, enter the code we sent to:<br />
                <strong>{email}</strong>
              </p>

              <form className="w-full flex flex-col items-center" onSubmit={handleVerifyOTP}>
                <div className="mb-10 flex w-full justify-between gap-2 sm:gap-3 px-2 sm:px-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg border border-gray-300 bg-gray-50 text-center text-xl sm:text-2xl outline-none transition-all focus:border-black focus:bg-white"
                      maxLength={1}
                    />
                  ))}
                </div>

                {error && <p className="text-red-500 text-sm mb-6 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={isVerifying || otp.join("").length !== 6 || loading}
                  className="mb-8 rounded-full bg-black px-10 py-[10px] text-[15px] font-medium text-white transition-opacity cursor-pointer hover:bg-black/80 disabled:bg-[#E5E5E5] disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-[#E5E5E5]"
                >
                  {isVerifying ? "Verifying..." : "Submit"}
                </button>
              </form>

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="text-[15px] font-medium text-gray-800 underline cursor-pointer hover:text-black disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          )}
        </GoogleProvider>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
