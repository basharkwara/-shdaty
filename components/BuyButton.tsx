import React from "react";

type Props = {
  onClick?: () => void;
  variant?: "primary" | "glass" | "outline" | "danger";
  fullWidth?: boolean;
  className?: string;
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60",
  glass:
    "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/15 hover:border-white/30 disabled:opacity-60",
  outline:
    "border border-yellow-400 text-yellow-300 hover:bg-yellow-400/10 disabled:opacity-60",
  danger:
    "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-[0_10px_30px_rgba(239,68,68,.4)] hover:shadow-[0_16px_40px_rgba(239,68,68,.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60",
};

export default function BuyButton({
  onClick,
  variant = "primary",
  fullWidth,
  className = "",
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-semibold transition-transform duration-200
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      شراء
    </button>
  );
}