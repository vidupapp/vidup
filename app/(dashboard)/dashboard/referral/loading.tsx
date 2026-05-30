export default function Loading() {
  return (
    <div className="p-6 sm:p-8 max-w-[680px]">
      <div className="h-7 w-40 bg-[#F0F0F0] rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-72 bg-[#F0F0F0] rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#F0F0F0] h-[90px] animate-pulse" />
        <div className="bg-white rounded-2xl border border-[#F0F0F0] h-[90px] animate-pulse" />
      </div>
      <div className="bg-white rounded-2xl border border-[#F0F0F0] h-[100px] animate-pulse mb-6" />
      <div className="bg-white rounded-2xl border border-[#F0F0F0] h-[180px] animate-pulse" />
    </div>
  );
}
