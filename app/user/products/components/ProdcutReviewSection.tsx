"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  handleRateProduct,
  handleAddProductComment,
  handleGetProductComments,
} from "@/lib/actions/product-action";
import ReviewModal from "./Comments";
import CustomerReviews from "./customerReviews";

type Comment = {
  _id: string;
  comment: string;
  userId?: string;
  username?: string;
  createdAt?: string;
};

type Product = {
  _id: string;
  name: string;
  averageRating?: number;
  reviewCount?: number;
};

export default function ProductReviewsSection({
  product,
  initialImage,
}: {
  product: Product;
  initialImage?: string;
}) {
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [avgRating, setAvgRating] = useState(Number(product.averageRating ?? 0));
  const [ratingCount, setRatingCount] = useState(Number(product.reviewCount ?? 0));

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product?._id) return;
    (async () => {
      const res = await handleGetProductComments(product._id);
      if (res?.success) {
        const list = (res?.data?.comments as Comment[]) ?? (res?.data as Comment[]) ?? [];
        setComments(list);
      }
    })();
  }, [product?._id]);

  async function submitRating(rating: number) {
    const res = await handleRateProduct(product._id, { rating });
    if (!res?.success) {
      toast.error(res?.message || "Failed to rate");
      return false;
    }
    const nextAvg = Number(res?.data?.averageRating ?? NaN);
    const nextCount = Number(res?.data?.reviewCount ?? NaN);
    if (Number.isFinite(nextAvg)) setAvgRating(nextAvg);
    if (Number.isFinite(nextCount)) setRatingCount(nextCount);
    return true;
  }

  async function submitComment(text: string) {
    const res = await handleAddProductComment(product._id, { comment: text });
    if (!res?.success) {
      toast.error(res?.message || "Failed to add comment");
      return false;
    }
    const latest = await handleGetProductComments(product._id);
    if (latest?.success) {
      const list = (latest?.data?.comments as Comment[]) ?? (latest?.data as Comment[]) ?? [];
      setComments(list);
    }
    return true;
  }

  const onSubmitReview = async (rating: number, text: string) => {
    setSubmittingReview(true);
    const rateOk = await submitRating(rating);
    if (text) await submitComment(text);
    setSubmittingReview(false);

    if (rateOk) {
      toast.success("Review submitted — thank you!");
      setReviewModalOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <CustomerReviews
        comments={comments}
        avgRating={avgRating}
        ratingCount={ratingCount}
        onWriteReview={() => setReviewModalOpen(true)}
      />

      <ReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productName={product.name}
        productImage={initialImage}
        pending={submittingReview}
        onSubmit={onSubmitReview}
      />
    </>
  );
}