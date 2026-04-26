import { PageHeaderSkeleton, Skeleton } from "@/components/primitives/Skeleton";

export default function SummaryLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-[280px] rounded-[16px]" />
          <Skeleton className="h-[260px] rounded-[16px]" />
        </div>
        <Skeleton className="h-[560px] rounded-[16px]" />
      </div>
    </>
  );
}
