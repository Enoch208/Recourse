type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer" | "main";
};

export function Container({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[1120px] px-5 sm:px-8 lg:px-10 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
