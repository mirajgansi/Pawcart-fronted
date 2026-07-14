"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse the products you want, add them to your cart, and proceed to checkout. Once your order is confirmed, you'll receive a confirmation with your order details.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Yes, you can cancel an order as long as it's still in a pending state. Go to your orders page and click 'Cancel Order' next to the relevant order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit/debit cards and other common payment options available at checkout.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times vary depending on your location, but most orders arrive within 3-5 business days.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot password?' on the login page and follow the instructions sent to your registered email.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team through the contact page, and we'll get back to you as soon as possible.",
  },
];

function FaqAccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg border"
      style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className="text-sm font-semibold sm:text-base"
          style={{ color: "var(--text-primary)" }}
        >
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden px-5 pb-4">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          Find answers to common questions below.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item) => (
          <FaqAccordionItem key={item.question} item={item} />
        ))}
      </div>
    </div>
  );
}