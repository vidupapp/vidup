export default function Loading() {
  return (
    <div className="p-6 sm:p-8 max-w-[760px]">
      <div className="flex items-center justify-between mb-8">
        <div className="h-5 w-16 bg-[#F0F0F0] rounded animate-pulse" />
        <div className="h-9 w-28 bg-[#F0F0F0] rounded-lg animate-pulse" />
      </div>
      <div className="h-5 w-32 bg-[#F0F0F0] rounded-full animate-pulse mb-3" />
      <div className="h-8 w-3/4 bg-[#F0F0F0] rounded-lg animate-pulse mb-10" />

      {/* Titles skeleton */}
      <div className="h-5 w-16 bg-[#F0F0F0] rounded animate-pulse mb-4" />
      <div className="flex flex-col gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#F0F0F0] h-[100px] animate-pulse"
            style={{ borderLeft: "3px solid #F0F0F0" }} />
        ))}
      </div>

      {/* Hook skeleton */}
      <div className="h-5 w-24 bg-[#F0F0F0] rounded animate-pulse mb-4" />
      <div className="bg-white rounded-2xl border border-[#F0F0F0] h-[200px] animate-pulse mb-8"
        style={{ borderLeft: "3px solid #F0F0F0" }} />

      {/* Thumbnails skeleton */}
      <div className="h-5 w-32 bg-[#F0F0F0] rounded animate-pulse mb-4" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#F0F0F0] h-[160px] animate-pulse"
            style={{ borderLeft: "3px solid #F0F0F0" }} />
        ))}
      </div>
    </div>
  );
}
