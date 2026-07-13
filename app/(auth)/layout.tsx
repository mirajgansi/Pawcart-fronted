import { ToastContainer } from "react-toastify";
import Image from "next/image";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerLinks = ["Privacy Policy", "Terms of Service", "Contact Support", "Returns"];

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#ffdad7] selection:text-[#410004]"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)" }}
    >
      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--color-primary-100)" }}
        />
        <div
          className="absolute top-1/2 -right-24 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--color-tertiary-300)" }}
        />
      </div>

      {/* Logo header */}
      <header className="pt-10 pb-1 text-center">
  <div className="flex items-center justify-center gap-3">
    <Image
      src="/paw.png"
      alt="PawCart Logo"
      width={48}
      height={48}
      priority
      className="object-contain"
    />

    <h1
      className="text-3xl font-extrabold tracking-tight"
      style={{ color: "var(--interactive-primary)" }}
    >
      PawCart
    </h1>
  </div>

  <p
    className="text-sm mt-2"
    style={{ color: "var(--text-secondary)" }}
  >
    Premium Provisions for Your Finest Friends
  </p>
</header>

      {/* Main content — card is rendered by each page */}
      <main className="grow flex items-center justify-center px-4 py-11">
        <div
          className="w-full max-w-120 rounded-2xl p-8 md:p-10 relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            boxShadow: "0 32px 64px -16px rgba(0,0,0,0.08)",
          }}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full px-8 md:px-20 py-10 flex flex-col md:flex-row justify-between items-center gap-6 rounded-t-2xl"
        style={{ backgroundColor: "var(--color-neutral-100)" }}
      >
        <div className="flex flex-col items-center md:items-start gap-1">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--interactive-primary)" }}
          >
            PawCart
          </span>
       
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs underline underline-offset-4 transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              {link}
            </a>
          ))}
        </nav>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}