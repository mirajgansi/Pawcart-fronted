"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, UserCog, LogOut, History } from "lucide-react";

export type ProfileUser = {
  name: string;
  subtitle?: string;
  avatarUrl?: string;
};

export default function ProfileSidebar({
  user,
  onUpdateProfile = "/user/updateProfile",
  onLogout,
  orderHistoryHref = "/user/orders",
  onEditAvatar,
}: {
  user: ProfileUser;
  onUpdateProfile?: string;
  onLogout?: () => void;
  orderHistoryHref?: string;
  onEditAvatar?: () => void;
}) {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl border p-6 text-center"
      style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="relative mx-auto h-28 w-28">
        <div
          className="relative h-28 w-28 overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--color-tertiary)" }}
        >
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" unoptimized />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-2xl font-bold"
              style={{ color: "var(--color-primary-700)" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {onEditAvatar && (
          <button
            type="button"
            onClick={onEditAvatar}
            aria-label="Edit avatar"
            className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h2 className="mt-4 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        {user.name}
      </h2>
      {user.subtitle && (
        <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
          {user.subtitle}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => router.push(onUpdateProfile)}
          className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition"
          style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
        >
          <UserCog className="h-4 w-4" /> Update Profile
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition"
          style={{ backgroundColor: "var(--color-tertiary)", color: "var(--text-primary)" }}
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>

        <Link
          href={orderHistoryHref}
          className="flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition"
          style={{ borderColor: "var(--color-primary-700)", color: "var(--color-primary-700)" }}
        >
          <History className="h-4 w-4" /> Order History
        </Link>
      </div>
    </div>
  );
}