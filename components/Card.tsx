import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  href: string;
  imageUrl?: string | null;
};

export default function Card({ title, href, imageUrl }: Props) {
  const src = (imageUrl && imageUrl.trim()) || "/images/cards/placeholder.png";

  return (
    <Link
      href={href}
      title={title}
      className="group relative block rounded-[24px] p-[2px] bg-gradient-to-b from-[#7B3FF3]/60 via-[#C0437A]/45 to-[#F27121]/45 shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] transition"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#2A0B4E]/80">
        <div className="relative aspect-[4/3]">
          <Image
            src={src}
            alt={title}
            fill
            className="object-contain p-8"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
            priority={false}
          />
        </div>
        <div className="bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121]">
          <div className="px-6 py-3 text-center text-base font-semibold text-white">
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
}