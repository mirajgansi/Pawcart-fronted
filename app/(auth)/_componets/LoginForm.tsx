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
            if (msg.includes("email")) setError("email", { type: "manual", message });
            else setError("password", { type: "manual", message });
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
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            {/* Google SVG */}
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            {/* Apple SVG */}
            <svg width="15" height="15" viewBox="0 0 814 1000" fill="currentColor">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.8 8 271.4 8 143.1 8 85.3 29.8 30.4 70.6 0c37.7-27.5 87.5-42.5 134.5-42.5 51.2 0 100.5 17.3 137.5 41.6 35.4 23.5 68.8 45.5 113.3 45.5 43 0 82.3-24.4 127.7-51.2 45.9-27.2 97.8-47.5 154.3-47.5 44.2 0 104.8 10.5 148.5 53.7z"/>
            </svg>
            Apple
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