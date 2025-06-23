"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      // In a real production environment, you would call a backend API that uses Better Auth / Resend
      // to send a password reset link. Here we mock it successfully.
      setTimeout(() => {
        setIsSent(true);
        toast.success("✨ Recovery instructions sent to your email!");
      }, 1500);
    } catch {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: "linear-gradient(135deg, #1a0533 0%, #0d0118 40%, #0a1f3d 100%)",
      }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(176, 108, 240, 0.25)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/login"
              className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Reset Password 🔐</h1>
          </div>

          {!isSent ? (
            <>
              <p className="text-sm mb-6" style={{ color: "#9b7fd4" }}>
                Enter the email address associated with your account and we&apos;ll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#c9b3e8" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "#7a5f99" }}
                    />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: `1px solid ${errors.email ? "#ff6eb4" : "rgba(176, 108, 240, 0.25)"}`,
                        color: "#ffffff",
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs mt-1.5" style={{ color: "#ff6eb4" }}>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #ff6eb4, #b06cf0)",
                    color: "#ffffff",
                    boxShadow: "0 8px 24px rgba(176, 108, 240, 0.35)",
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isLoading ? "Sending..." : "Send Instructions"}
                </motion.button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
                <KeyRound className="w-8 h-8 text-accent-purple" />
              </div>
              <h2 className="text-xl font-bold text-white">Check your email</h2>
              <p className="text-sm max-w-xs mx-auto" style={{ color: "#9b7fd4" }}>
                We have sent password recovery instructions to your email address. If you don&apos;t receive it within a few minutes, check your spam folder.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-sm font-semibold hover:underline"
                style={{ color: "#ff6eb4" }}
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
