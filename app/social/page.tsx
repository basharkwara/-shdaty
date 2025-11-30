"use client";

export default function SocialPage() {
  type Card = { href: string; title: string; img: string; imgClassName?: string };

  const socials: Card[] = [
    { href: "/social/youtube", title: "YouTube Premium", img: "/images/social/youtube.png" },
    { href: "/social/discord", title: "Discord Nitro", img: "/images/social/nitro.png" },
    { href: "/social/instagram", title: "Instagram Followers", img: "/images/social/insta.png" },
    { href: "/social/tiktok", title: "TikTok Coins", img: "/images/social/tiktok.png" },
  ];

  function SocialCard({ href, title, img, imgClassName }: Card) {
    return (
      <a
        href={href}
        title={title}
        className="relative rounded-xl overflow-hidden shadow-md transition shadow-lg shadow-yellow-500/30"
      >
        <div className="p-[3px] rounded-xl bg-gradient-to-br from-red-600 to-yellow-400">
          <div className="backdrop-blur-md bg-white/10 hover:bg-white/20 rounded-xl border border-transparent transition-transform duration-300 transform hover:-translate-y-2">
            <img
              src={img}
              alt={title}
              className={`w-full h-44 rounded-t-xl ${imgClassName ?? "object-cover"}`}
            />
            <div className="p-6 text-center text-white">
              <h3 className="text-xl font-bold mb-1">{title}</h3>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <section
      className="relative z-10 overflow-hidden text-white min-h-screen pt-[120px] pb-16"
      style={{ background: "linear-gradient(to left, #41295a, #2F0743)" }}
    >
      {/* SVG الخلفية */}
      <div className="absolute right-0 top-0 z-0 opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear)" />
          <circle cx="18" cy="182" r="18" fill="url(#paint1_radial)" />
          <circle cx="77" cy="288" r="34" fill="url(#paint2_radial)" />
          <circle cx="325" cy="303" r="180" transform="rotate(-38 325 303)" fill="url(#paint3_linear)" />
          <circle opacity="0.8" cx="185" cy="316" r="133" transform="rotate(115 185 316)" stroke="url(#paint4_linear)" />
          <circle opacity="0.8" cx="356" cy="290" r="180" transform="rotate(-30 356 290)" stroke="url(#paint5_linear)" />
          <circle opacity="0.8" cx="192" cy="303" r="133" transform="rotate(133 192 303)" fill="url(#paint6_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="-54.5003" y1="-178" x2="222" y2="288" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 182) rotate(90) scale(18)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="paint2_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(77 288) rotate(90) scale(34)">
              <stop offset="0.145833" stopColor="#FF0000" stopOpacity="0" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="paint3_linear" x1="226.775" y1="-66.1548" x2="292.157" y2="351.421" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint4_linear" x1="185" y1="182" x2="185" y2="449" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint5_linear" x1="356" y1="110" x2="356" y2="470" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint6_linear" x1="119" y1="29" x2="167" y2="339" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="wow fadeInUp mx-auto max-w-[800px] text-center" data-wow-delay=".2s">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {socials.map((c, i) => (
              <SocialCard key={i} {...c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}