"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleWhoami } from "@/lib/actions/auth-actions";
import { handleGetMyOrders } from "@/lib/actions/order-action"; 
import OrderCard, { Order } from "./_components/OrderCard";
import ProfileSidebar, { ProfileUser } from "./_components/ProfileSidebar";

function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border p-5 animate-pulse" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
      <div className="h-3 w-24 rounded mb-2" style={{ backgroundColor: "var(--color-tertiary)" }} />
      <div className="h-5 w-2/3 rounded mb-2" style={{ backgroundColor: "var(--color-tertiary)" }} />
      <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--color-tertiary)" }} />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<ProfileUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    handleWhoami()
      .then((res: any) => {
        const u = res?.data ?? res;
        if (u) {
          setUser({
            name: u.userName ?? u.username ?? "Pet Parent",
            subtitle: u.city ? `Pet Parent • ${u.city}` : undefined,
            avatarUrl: u.avatar ?? u.profileImage,
          });
        }
      })
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    handleGetMyOrders()
      .then((res: any) => {
        if (res?.success) {
          const list = res.data?.orders ?? res.data ?? [];
          setOrders(list);
        }
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  const onLogout = () => {
    // wire to your actual logout action/cookie clear
    router.push("/login");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {loadingUser ? (
            <div className="rounded-2xl border h-80 animate-pulse" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }} />
          ) : (
            <ProfileSidebar
              user={user ?? { name: "Pet Parent" }}
              onUpdateProfile="/user/updateProfile"
              onLogout={onLogout}
              orderHistoryHref="/user/orders"
            />
          )}

          <div>
            <h2
              className="text-lg font-bold border-b-2 pb-2 inline-block"
              style={{ color: "var(--text-brand)", borderColor: "var(--color-primary-700)" }}
            >
              Recent Orders
            </h2>

            <div className="mt-5 space-y-4">
              {loadingOrders ? (
                <>
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                </>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onViewDetails={(id) => router.push(`/user/orders/${id}`)}
                    onTrackPackage={(id) => router.push(`/user/orders/${id}/track`)}
                    onReorder={() => toast.success("Items added to cart")}
                  />
                ))
              ) : (
                <p className="text-sm py-10 text-center" style={{ color: "var(--text-secondary)" }}>
                  No orders yet — start shopping to see them here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}