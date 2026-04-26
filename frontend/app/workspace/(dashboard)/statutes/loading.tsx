import { PageHeaderSkeleton, Skeleton } from "@/components/primitives/Skeleton";

export default function StatutesLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-[72px] rounded-[8px]" />
            ))}
          </div>
          <Skeleton className="h-9 w-full rounded-[10px] sm:w-[280px]" />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[16px] border border-neutral-200/70 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <Skeleton className="h-3 w-[120px]" />
                  <Skeleton className="h-4 w-[260px]" />
                </div>
                <Skeleton className="h-5 w-[60px] rounded-md" />
              </div>
              <div className="mt-4 space-y-2.5">
                <Skeleton className="h-2.5 w-[60px]" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="mt-3 h-2.5 w-[60px]" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <Skeleton className="h-2.5 w-[120px]" />
                <Skeleton className="h-2.5 w-[40px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
