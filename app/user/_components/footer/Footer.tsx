import Link from "next/link";

export default function Footer() {
  const footerColumns = [
    {
      heading: "Shop",
      links: [
        { label: "Dog Food", href: "/user/category/dogs/food" },
        { label: "Cat Food", href: "/user/category/cats/food" },
        { label: "Grooming", href: "/user/groomingkits" },
        { label: "Trending", href: "/user/trending" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track Order", href: "/user/orders" },
        { label: "FAQ", href: "/user/faq" },
        { label: "Contact Us", href: "/user/contact" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/user/about" },
        { label: "Blog", href: "/user/blog" },
        { label: "Careers", href: "/user/careers" },
        { label: "Press", href: "/user/press" },
      ],
    },
  ];

  return (
    <footer className="mt-12 bg-[var(--color-primary-900)] text-[var(--color-primary-200)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🐾</span>
            <span className="text-white font-bold text-lg">PawCart</span>
          </div>
          <p className="text-xs leading-relaxed">
            Premium pet care products delivered with love. Trusted by over 50,000 pet owners.
          </p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.heading}>
            <h4 className="text-white text-sm font-semibold mb-3">{col.heading}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs hover:text-[var(--color-primary-100)] transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-primary-800)] py-4 text-center text-xs text-[var(--color-primary-400)]">
        © {new Date().getFullYear()} PawCart. All rights reserved.
      </div>
    </footer>
  );
}