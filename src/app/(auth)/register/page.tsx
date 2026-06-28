"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Gift, ArrowLeft } from "lucide-react";
import axios from "axios";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referralCode: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterPageInner() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referredBy, setReferredBy] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Prefill referral code if present in URL query (?ref=CODE)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      if (refCode) {
        setValue("referralCode", refCode);
        // Verify code
        axios
          .get(`/api/referral?code=${refCode}`)
          .then((res) => {
            if (res.data.referrerName) {
              setReferredBy(res.data.referrerName);
            }
          })
          .catch(() => {});
      }
    }
  }, [setValue]);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/register", data);
      if (res.data.success) {
        toast.success("Welcome aboard! Account created successfully ✨");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      {/* Left Panel — Kawaii Art */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-bg-card border-r border-[oklch(0.4_0.1_350_/_0.08)]">
        {/* Animated gradient orbs */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(176, 108, 240, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(255, 110, 180, 0.1) 0%, transparent 60%)",
          }}
        />

        {/* Center content */}
        <motion.div
          className="relative z-10 text-center px-12 max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-8xl mb-6 select-none"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🎁
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 font-jakarta text-accent-purple">
            Join the Magic!
          </h2>
          <p className="text-lg mb-2 text-text-muted font-medium">
            Unbox Happiness every month ✨
          </p>
          <p className="text-sm text-text-muted leading-relaxed">
            Earn Stardust loyalty points, redeem rare boxes, and share referral rewards with your friends!
          </p>
        </motion.div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-8 py-12 min-h-screen">
        <motion.div
          className="w-full max-w-md mx-auto my-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Mobile branding header */}
          <div className="lg:hidden text-center mb-6">
            <span className="text-3xl mb-1 select-none">✨</span>
            <h2 className="text-2xl font-bold text-accent-purple font-grotesk tracking-tight">
              MysteryScoop
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Unbox the Magic</p>
          </div>

          {/* Back button */}
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-accent-pink transition-colors focus-ring p-2 rounded-lg">
              <ArrowLeft size={14} /> Back to storefront
            </Link>
          </div>

          {/* Card */}
          <div className="glass-card p-6 md:p-8 border border-[oklch(0.4_0.1_350_/_0.15)] shadow-xl bg-[oklch(0.985_0.012_30_/_0.85)]">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-1.5 font-jakarta">Create Account ✨</h1>
              <p className="text-text-muted text-sm font-medium">Sign up to start your mystery adventure</p>
            </div>

            {referredBy && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl mb-5 text-xs border border-accent-teal/30 bg-accent-teal/10 text-accent-teal">
                <Gift className="w-4 h-4 shrink-0" />
                <span>You were invited by <strong>{referredBy}</strong>! Earn 500 bonus points upon checkout.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Your name"
                    className="input-field pl-11 focus-ring"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-accent-pink mt-1.5 font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="input-field pl-11 pr-12 focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus-ring p-1 rounded"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-accent-pink mt-1.5 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Referral Code (Optional)
                </label>
                <div className="relative">
                  <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    {...register("referralCode")}
                    type="text"
                    placeholder="Enter referral code"
                    className="input-field pl-11 uppercase focus-ring"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-4 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Register
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm text-text-muted font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-accent-pink hover:underline focus-ring rounded">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterPageInner />;
}
