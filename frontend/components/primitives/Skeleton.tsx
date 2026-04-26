type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-[6px] bg-neutral-200/70 ${className}`}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <span className={`flex flex-col gap-1.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 && lines > 1 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </span>
  );
}

export function PageHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-[180px] sm:h-8 sm:w-[220px]" />
        <Skeleton className="h-3 w-[260px]" />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Skeleton className="h-9 w-9 rounded-[10px]" />
        <Skeleton className="h-9 w-9 rounded-[10px]" />
        <Skeleton className="h-9 w-[120px] rounded-[12px]" />
      </div>
    </header>
  );
}
