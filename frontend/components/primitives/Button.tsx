import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-[#272727]",
  secondary:
    "bg-transparent text-ink border border-border hover:border-ink hover:bg-white/40",
  ghost: "text-ink hover:bg-black/[0.04]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px]",
  md: "h-9 px-4 text-[13px]",
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
