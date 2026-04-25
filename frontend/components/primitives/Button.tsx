import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[5px] font-semibold tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/10 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white shadow-[0_10px_22px_rgb(0_0_0/0.12)] hover:bg-[#272727]",
  secondary:
    "bg-white/78 text-ink border border-white/80 shadow-[0_8px_18px_rgb(14_116_144/0.08)] backdrop-blur hover:border-border-strong hover:bg-white",
  ghost: "text-ink hover:bg-black/[0.04]",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-3 text-[11px]",
  md: "h-8 px-3.5 text-[11px]",
};

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
