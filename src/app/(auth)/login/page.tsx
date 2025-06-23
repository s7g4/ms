"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Sparkles, Star } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const floatingElements = [
  { emoji: "🌸", x: "10%", y: "15%", delay: 0, size: "text-3xl" },
  { emoji: "⭐", x: "80%", y: "10%", delay: 0.5, size: "text-2xl" },
  { emoji: "🎁", x: "15%", y: "70%", delay: 1, size: "text-4xl" },
  { emoji: "✨", x: "75%", y: "65%", delay: 1.5, size: "text-2xl" },
  { emoji: "🌙", x: "50%", y: "85%", delay: 0.8, size: "text-3xl" },
  { emoji: "💜", x: "85%", y: "40%", delay: 0.3, size: "text-xl" },
  { emoji: "🎀", x: "5%", y: "45%", delay: 1.2, size: "text-2xl" },
  { emoji: "🔮", x: "60%", y: "20%", delay: 0.7, size: "text-3xl" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/profile",
      });

      if (error) {
        toast.error(error.message ?? "Invalid email or password");
        return;
      }

      toast.success("Welcome back! ✨");
      router.push("/profile");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });
    } catch {
      toast.error("Google login failed. Please try again.");
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
            MysteryScoop
          </h2>
          <p className="text-lg mb-2" style={{ color: "#c9b3e8" }}>
            Unbox the Magic ✨
          </p>
          <p className="text-sm" style={{ color: "#7a5f99" }}>
            Curated kawaii mystery boxes delivered to your door
          </p>

          {/* Star rating decoration */}
          <div className="flex items-center justify-center gap-1 mt-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <Star className="w-5 h-5 fill-current" style={{ color: "#ff6eb4" }} />
              </motion.div>
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: "#7a5f99" }}>
            Loved by 50,000+ kawaii fans worldwide
          </p>

          {/* Glassmorphism stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { label: "Happy Customers", value: "50K+" },
              { label: "Boxes Shipped", value: "200K+" },
              { label: "Happy Rating", value: "4.9★" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(176, 108, 240, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-lg font-bold" style={{ color: "#ff6eb4" }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "#7a5f99" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">✨</div>
            <h1
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #ff6eb4, #b06cf0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MysteryScoop
            </h1>
          </div>

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
              <p style={{ color: "#9b7fd4" }}>Sign in to your account to continue</p>
            </div>

            {/* Google OAuth */}
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl font-medium text-sm mb-6 transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#e8d5ff",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </motion.button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: "rgba(176, 108, 240, 0.2)" }} />
              <span className="text-sm" style={{ color: "#7a5f99" }}>
                or
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(176, 108, 240, 0.2)" }} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
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
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${errors.email ? "#ff6eb4" : "rgba(176, 108, 240, 0.25)"}`,
                      color: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid rgba(176, 108, 240, 0.6)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(176, 108, 240, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = errors.email
                        ? "1px solid #ff6eb4"
                        : "1px solid rgba(176, 108, 240, 0.25)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs mt-1.5" style={{ color: "#ff6eb4" }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: "#c9b3e8" }}>
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs transition-colors hover:underline"
                    style={{ color: "#b06cf0" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#7a5f99" }}
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3 rounded-2xl text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${errors.password ? "#ff6eb4" : "rgba(176, 108, 240, 0.25)"}`,
                      color: "#ffffff",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "1px solid rgba(176, 108, 240, 0.6)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(176, 108, 240, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = errors.password
                        ? "1px solid #ff6eb4"
                        : "1px solid rgba(176, 108, 240, 0.25)";
                      e.target.style.boxShadow = "none";
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
                  <p className="text-xs mt-1.5" style={{ color: "#ff6eb4" }}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: "#7a5f99" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "#ff6eb4" }}>
              Create one — it&apos;s free!
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
