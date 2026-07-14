"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { handleCancelMyOrder } from "@/lib/actions/order-action";

export default function CancelOrderButton({
  orderId,
  status,
}: {
  orderId: string;
  status?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const canCancel = (status ?? "").toLowerCase() === "pending";

  const openConfirm = () => {
    if (!canCancel) {
      toast.info("You can only cancel a pending order.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    startTransition(async () => {
      const res = await handleCancelMyOrder(orderId);

      if (!res.success) {
        toast.error(res.message || "Cancel failed");
        setShowConfirm(false);
        return;
      }

      toast.success(res.message || "Order cancelled");
      setShowConfirm(false);
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openConfirm}
        disabled={!canCancel || pending}
        className={[
          "h-10 rounded-lg px-4 text-sm font-semibold transition",
          canCancel
            ? "bg-red-600 text-white hover:opacity-90"
            : "bg-gray-200 text-gray-500 cursor-not-allowed",
          pending ? "opacity-60" : "",
        ].join(" ")}
        title={!canCancel ? "Only pending orders can be cancelled" : "Cancel this order"}
      >
        {pending ? "Cancelling..." : "Cancel Order"}
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !pending && setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Cancel this order?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. Are you sure you want to cancel
              this order?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={pending}
                className="h-10 rounded-lg px-4 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                Keep order
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={pending}
                className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "Cancelling..." : "Yes, cancel it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}