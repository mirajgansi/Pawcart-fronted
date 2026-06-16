type SpaProductCardProps = {
  title: string;
  description: string;
  price: number;
  badge?: string;
  eyebrow?: string;
  image: string; // you pass this manually
  onShopNow?: () => void;
};

export default function SpaProductCard({
  title,
  description,
  price,
  badge = "Best Value",
  eyebrow = "Premium Care",
  image,
  onShopNow,
}: SpaProductCardProps) {
  return (
    <div
      className="relative flex min-h-[210px] w-full overflow-hidden rounded-[20px]"
      style={{ background: "#f2e9e1", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Background image ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      />

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(242,233,225,1) 0%, rgba(242,233,225,0.96) 35%, rgba(242,233,225,0.75) 55%, rgba(242,233,225,0.08) 100%)",
        }}
      />

      {/* ── Badge ── */}
      {badge && (
        <span
          className="absolute right-4 top-4 z-10 rounded-full px-3.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white"
          style={{ background: "#b5332a" }}
        >
          {badge}
        </span>
      )}

      {/* ── Content ── */}
      <div className="relative z-10 flex w-[58%] flex-col justify-between px-7 py-7">
        <div>
          {eyebrow && (
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.12em]"
              style={{ color: "#a07858" }}>
              {eyebrow}
            </p>
          )}
          <h2
            className="mb-2.5 text-[21px] leading-[1.2]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#221108" }}
          >
            {title}
          </h2>
          <p className="mb-5 text-[12px] font-light italic leading-relaxed"
            style={{ color: "#7a5c47" }}>
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <span
            className="text-[26px]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#221108" }}
          >
            ${price.toFixed(2)}
          </span>
          {onShopNow && (
            <button
              onClick={onShopNow}
              className="h-[34px] rounded-full px-4 text-[11px] font-medium uppercase tracking-widest text-[#f2e9e1] transition-opacity hover:opacity-80"
              style={{ background: "#221108" }}
            >
              Shop Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}