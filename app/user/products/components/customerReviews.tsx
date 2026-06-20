"use client";

type Comment = {
  _id: string;
  comment: string;
  userId?: string;
  username?: string;
  createdAt?: string;
};

type CustomerReviewsProps = {
  comments: Comment[];
  avgRating: number;
  ratingCount: number;
  onWriteReview: () => void;
};

export default function CustomerReviews({
  comments,
  avgRating,
  ratingCount,
  onWriteReview,
}: CustomerReviewsProps) {
  return (
    <div className="rounded-2xl border p-5 shadow-sm" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
            Customer Reviews
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {avgRating.toFixed(1)}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ color: s <= Math.round(avgRating) ? "#f59e0b" : "#d1d5db" }}>★</span>
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Based on {ratingCount} Verified Review{ratingCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onWriteReview}
          className="rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition"
          style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
        >
          Write a Review
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {comments.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No reviews yet — be the first to share your experience.
          </p>
        ) : (
          comments.slice(0, 10).map((c) => (
            <div key={c._id} className="border-b pb-4 last:border-0" style={{ borderColor: "var(--border-default)" }}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.username ?? "User"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {c.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}