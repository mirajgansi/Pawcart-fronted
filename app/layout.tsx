import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
// @ts-ignore: side-effect CSS import without module declarations
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ToastProvider from "./_componets/ToastProvider";
import { Toaster } from "sonner";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PawCart",
  description:
    "This is an online pet store built with Next.js 13, Tailwind CSS, and TypeScript. It features user authentication, product browsing, shopping cart functionality, and a seamless checkout process. The application is designed to provide a smooth and enjoyable shopping experience for users looking to purchase groceries online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            expand
            duration={3500}
          />
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}