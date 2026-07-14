"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@pawcart.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+977 984-1234567",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Bhaktapur, Kathmandu Valley, Nepal",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    // No backend wired up yet — simulate a submit.
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          Contact Us
        </h1>
        <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          Have a question? Reach out and we'll get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Contact info */}
        <div className="space-y-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-lg border p-4"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-primary-900)" }}
              >
                <Icon size={18} color="white" />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {label}
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border p-6"
          style={{
            borderColor: "var(--border-default)",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="h-10 w-full rounded-md border px-3 text-sm outline-none"
              style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="h-10 w-full rounded-md border px-3 text-sm outline-none"
              style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help?"
              rows={4}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-md font-semibold text-sm transition-colors disabled:opacity-60"
            style={{
              backgroundColor: "var(--interactive-primary)",
              color: "var(--interactive-primary-text)",
            }}
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}