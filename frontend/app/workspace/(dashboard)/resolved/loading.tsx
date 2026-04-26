import { PageHeaderSkeleton, Skeleton } from "@/components/primitives/Skeleton";

export default function ResolvedLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-7 space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[16px] border border-neutral-200/70 bg-white p-5"
            >
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="mt-3 h-7 w-[140px]" />
              <Skeleton className="mt-2 h-3 w-[180px]" />
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[16px] border border-neutral-200/70 bg-white">
          <div className="border-b border-neutral-100 px-5 py-3">
            <Skeleton className="h-3 w-[200px]" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-neutral-100 px-5 py-3.5 last:border-b-0"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3 w-[200px]" />
                <Skeleton className="h-2.5 w-[120px]" />
              </div>
              <Skeleton className="hidden h-3 w-[70px] sm:block" />
              <Skeleton className="hidden h-3 w-[80px] sm:block" />
              <Skeleton className="hidden h-6 w-[64px] rounded-md sm:block" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
