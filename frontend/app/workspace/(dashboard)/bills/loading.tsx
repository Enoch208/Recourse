import { PageHeaderSkeleton, Skeleton } from "@/components/primitives/Skeleton";

export default function BillsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-[72px] rounded-[8px]" />
            ))}
          </div>
          <Skeleton className="h-9 w-full rounded-[10px] sm:w-[280px]" />
        </div>

        <div className="mt-5 overflow-hidden rounded-[16px] border border-neutral-200/70 bg-white">
          <div className="border-b border-neutral-100 px-5 py-3">
            <Skeleton className="h-3 w-[200px]" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3.5 last:border-b-0"
            >
              <Skeleton className="h-8 w-8 shrink-0 rounded-[8px]" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3 w-[180px]" />
                <Skeleton className="h-2.5 w-[100px]" />
              </div>
              <Skeleton className="hidden h-3 w-[80px] sm:block" />
              <Skeleton className="hidden h-3 w-[70px] sm:block" />
              <Skeleton className="hidden h-6 w-[60px] rounded-md sm:block" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
