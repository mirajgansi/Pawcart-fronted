type HeroData = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

const PET_HERO: Record<string, HeroData> = {
  dogs: {
    badge: "Premium Canine Collection",
    title: "Elite Care for Your Best",
    subtitle: "Friend.",
    description: "Discover our curated selection of high-performance nutrition and luxury lifestyle essentials designed for discerning dogs.",
    image: "/pet.jpg",
  },
  cats: {
    badge: "Premium Feline Collection",
    title: "Luxury Living for Your",
    subtitle: "Cat.",
    description: "Everything your feline companion needs — from gourmet food to cozy beds and playful toys.",
    image: "/pet.jpg",
  },
  birds: {
    badge: "Premium Avian Collection",
    title: "The Best for Your",
    subtitle: "Bird.",
    description: "Premium seeds, perches, and accessories for happy, healthy birds.",
    image: "/pet.jpg",
  },
  fish: {
    badge: "Premium Aquatic Collection",
    title: "Create the Perfect",
    subtitle: "Aquarium.",
    description: "Everything you need to build a thriving aquatic environment for your fish.",
    image: "/pet.jpg",
  },
};

export default function CategoryHero({ petSlug }: { petSlug: string }) {
  const hero = PET_HERO[petSlug];
  if (!hero) return null;

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-center min-h-[280px] relative  mb-6"
      style={{
        background: `
          
        `,
      }}
    >
      <div className="flex-1 p-8 md:p-10 z-10">
        <span className="inline-block bg-[var(--color-primary-500)] text-white text-xs font-semibold rounded-full px-3 py-1 mb-4">
          {hero.badge}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          {hero.title}<br />
          <span className="text-[var(--text-brand)]">{hero.subtitle}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
          {hero.description}
        </p>
      </div>

      <div className="flex-1 flex items-end justify-center h-48 md:h-[280px]">
       
      </div>
    </div>
  );
}