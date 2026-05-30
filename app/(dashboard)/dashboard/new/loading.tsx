export default function Loading() {
  return (
    <div className="p-6 sm:p-8">
      <div className="h-5 w-16 bg-[#F0F0F0] rounded animate-pulse mb-8" />
      <div className="h-7 w-28 bg-[#F0F0F0] rounded-lg animate-pulse mb-8" />
      <div className="max-w-[680px]">
        <div className="bg-white rounded-2xl border border-[#F0F0F0] p-8 flex flex-col gap-6 animate-pulse">
          <div className="h-5 w-24 bg-[#F0F0F0] rounded" />
          <div className="h-[96px] bg-[#F0F0F0] rounded-[10px]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[46px] bg-[#F0F0F0] rounded-[10px]" />
            <div className="h-[46px] bg-[#F0F0F0] rounded-[10px]" />
          </div>
          <div className="h-[46px] bg-[#F0F0F0] rounded-[10px]" />
          <div className="h-[46px] bg-[#F0F0F0] rounded-[10px]" />
          <div className="h-[46px] bg-[#F0F0F0] rounded-[10px]" />
          <div className="h-[52px] bg-[#F0F0F0] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
