import { PageHeaderSkeleton, Skeleton } from "@/components/primitives/Skeleton";

function SectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="grid gap-6 border-b border-neutral-200/70 py-7 first:pt-0 last:border-b-0 lg:grid-cols-[260px_1fr]">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-[8px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[180px]" />
          <Skeleton className="h-3 w-[140px]" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: rows * 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-2.5 w-[80px]" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-7 rounded-[16px] border border-neutral-200/70 bg-white px-7">
        <SectionSkeleton rows={2} />
        <SectionSkeleton rows={1} />
        <SectionSkeleton rows={1} />
      </div>
    </>
  );
}
