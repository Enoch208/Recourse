import Image from "next/image";
import { brand } from "@/lib/content";

type Size = "sm" | "md";
type Variant = "full" | "mark";

type Props = {
  size?: Size;
  variant?: Variant;
  className?: string;
};

const fullSizes: Record<Size, { h: number; w: number }> = {
  sm: { h: 22, w: 132 },
  md: { h: 26, w: 156 },
};

const markSizes: Record<Size, number> = {
  sm: 24,
  md: 28,
};

export function Wordmark({
  size = "md",
  variant = "full",
  className = "",
}: Props) {
  if (variant === "mark") {
    const s = markSizes[size];
    return (
      <Image
        src="/logo.png"
        alt={brand.name}
        width={593}
        height={644}
        priority
        className={className}
        style={{ height: s, width: "auto" }}
      />
    );
  }

  const { h, w } = fullSizes[size];
  return (
    <Image
      src="/logo_with_text.png"
      alt={brand.name}
      width={1167}
      height={194}
      priority
      className={className}
      style={{ height: h, width: w }}
    />
  );
}
