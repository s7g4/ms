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
      // Mock reset trigger
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
    <div className="min-h-screen flex items-center justify-center p-6 md:p-8 bg-bg-primary text-text-primary">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card p-6 md:p-8 border border-[oklch(0.4_0.1_350_/_0.15)] shadow-xl bg-[oklch(0.985_0.012_30_/_0.85)]">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/login"
              className="p-2 rounded-xl text-text-muted hover:text-accent-pink hover:bg-bg-secondary transition-colors focus-ring"
              aria-label="Back to login"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-jakarta">Reset Password 🔐</h1>
          </div>

          {!isSent ? (
            <>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                Enter the email address associated with your account and we&apos;ll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className="input-field pl-11 focus-ring"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-accent-pink mt-1.5 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Instructions"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
                <KeyRound className="w-8 h-8 text-accent-purple" />
              </div>
              <h2 className="text-xl font-bold text-text-primary font-jakarta">Check your email</h2>
              <p className="text-sm text-text-muted max-w-xs mx-auto leading-relaxed">
                We have sent password recovery instructions to your email address. If you don&apos;t receive it within a few minutes, check your spam folder.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-sm font-bold text-accent-pink hover:underline focus-ring rounded"
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
