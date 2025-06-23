"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Gift } from "lucide-react";
import axios from "axios";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  referralCode: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

const floatingElements = [
  { emoji: "🌸", x: "10%", y: "15%", delay: 0, size: "text-3xl" },
  { emoji: "⭐", x: "80%", y: "10%", delay: 0.5, size: "text-2xl" },
  { emoji: "🎁", x: "15%", y: "70%", delay: 1, size: "text-4xl" },
  { emoji: "✨", x: "75%", y: "65%", delay: 1.5, size: "text-2xl" },
  { emoji: "🌙", x: "50%", y: "85%", delay: 0.8, size: "text-3xl" },
  { emoji: "🎀", x: "5%", y: "45%", delay: 1.2, size: "text-2xl" },
];

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const refCode = searchParams.get("ref");
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
  }, [searchParams, setValue]);

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
    <div className="min-h-screen flex" style={{ background: "#0d0118" }}>
      {/* Left Panel — Kawaii Art */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a0533 0%, #0d0118 40%, #0a1f3d 100%)",
        }}
      >
        {/* Animated gradient orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(176, 108, 240, 0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(255, 110, 180, 0.2) 0%, transparent 60%), radial-gradient(ellipse at 50% 10%, rgba(0, 212, 170, 0.15) 0%, transparent 50%)",
          }}
        />

        {/* Floating emoji elements */}
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            className={`absolute ${el.size} select-none`}
            style={{ left: el.x, top: el.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              delay: el.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {el.emoji}
          </motion.div>
        ))}

        {/* Center content */}
        <motion.div
          className="relative z-10 text-center px-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            🎁
          </motion.div>
          <h2
            className="text-4xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #ff6eb4, #b06cf0, #00d4aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Join the Magic!
          </h2>
          <p className="text-lg mb-2" style={{ color: "#c9b3e8" }}>
            Unbox Happiness every month ✨
          </p>
          <p className="text-sm" style={{ color: "#7a5f99" }}>
            Earn Stardust loyalty points, redeem rare boxes, and share referrals!
          </p>
        </motion.div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(176, 108, 240, 0.25)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account ✨</h1>
              <p style={{ color: "#9b7fd4" }}>Sign up to start your mystery adventure</p>
            </div>

            {referredBy && (
              <div
                className="flex items-center gap-2 p-3.5 rounded-2xl mb-5 text-sm border"
                style={{
                  background: "rgba(0, 212, 170, 0.1)",
                  borderColor: "rgba(0, 212, 170, 0.3)",
                  color: "#00d4aa",
                }}
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>You were invited by <strong>{referredBy}</strong>! Earn 500 bonus points upon checkout.</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#c9b3e8" }}>
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#7a5f99" }}
                  />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${errors.name ? "#ff6eb4" : "rgba(176, 108, 240, 0.25)"}`,
                      color: "#ffffff",
                    }}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs mt-1" style={{ color: "#ff6eb4" }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#c9b3e8" }}>
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
                  <p className="text-xs mt-1" style={{ color: "#ff6eb4" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#c9b3e8" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#7a5f99" }}
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full pl-11 pr-12 py-3 rounded-2xl text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${errors.password ? "#ff6eb4" : "rgba(176, 108, 240, 0.25)"}`,
                      color: "#ffffff",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#7a5f99" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs mt-1" style={{ color: "#ff6eb4" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#c9b3e8" }}>
                  Referral Code (Optional)
                </label>
                <div className="relative">
                  <Gift
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#7a5f99" }}
                  />
                  <input
                    {...register("referralCode")}
                    type="text"
                    placeholder="Enter referral code"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all uppercase"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(176, 108, 240, 0.25)",
                      color: "#ffffff",
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-4"
                style={{
                  background: isLoading
                    ? "rgba(176, 108, 240, 0.5)"
                    : "linear-gradient(135deg, #ff6eb4, #b06cf0)",
                  color: "#ffffff",
                  boxShadow: isLoading ? "none" : "0 8px 24px rgba(176, 108, 240, 0.35)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Register
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: "#7a5f99" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "#ff6eb4" }}>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-text-muted">Loading...</span></div>}>
      <RegisterPageInner />
    </Suspense>
  );
}
