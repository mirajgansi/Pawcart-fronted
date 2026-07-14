"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { handleLogin } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";
import AnimatedTextField from "./AnimatedTextFeild";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      try {
        const response = await handleLogin(values);
        if (!response || response.success !== true) {
          const field = response?.field as keyof LoginData | undefined;
          const message = response?.message || "Invalid email or password";

          if (field) {
            setError(field, { type: "manual", message });
          } else {
            const msg = message.toLowerCase();
            // Treat "user not found" / "no account" style messages as email errors,
            // everything else (wrong password etc.) as password errors.
            const isEmailIssue =
              msg.includes("email") ||
              msg.includes("user") ||
              msg.includes("account") ||
              msg.includes("not found") ||
              msg.includes("no user");

            if (isEmailIssue) {
              setError("email", { type: "manual", message });
            } else {
              setError("password", { type: "manual", message });
            }
          }
          return;
        }
        toast.success("Login successful");
        if (response.data?.role === "admin") router.replace("/admin");
        else if (response.data?.role === "user") router.replace("/user/dashboard");
        else if (response.data?.role === "driver") router.replace("/driver");
      } catch (err: any) {
        const msg = err?.message || "Something went wrong";
        setError("root", { type: "manual", message: msg });
        toast.error(msg);
      }
    });
  };

  return (
    <div className="space-y-1">
      <form onSubmit={handleSubmit(submit)} className="space-y-4 pt-4">

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Email address
          </label>
          <AnimatedTextField
            id="email"
            type="email"
            placeholder="name@example.com"
            register={register("email")}
            error={errors.email}
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password" style={{ color: "var(--text-primary)" }}>
              Password
            </label>
            <Link
              href="/request-reset-password"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--interactive-primary)" }}
            >
              Forgot password?
            </Link>
          </div>
          <AnimatedTextField
            id="password"
            type="password"
            placeholder="••••••••"
            register={register("password")}
            error={errors.password}
            showToggle
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="h-11 w-full rounded-md font-semibold text-sm transition-colors disabled:opacity-60 "
          style={{
            backgroundColor: "var(--interactive-primary)",
            color: "var(--interactive-primary-text)",
          }}
        >
          {isSubmitting || pending ? "Logging in..." : "Log in"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-default)" }} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            OR CONTINUE WITH
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-default)" }} />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-1">
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold hover:underline"
            style={{ color: "var(--interactive-primary)" }}
          >
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
}