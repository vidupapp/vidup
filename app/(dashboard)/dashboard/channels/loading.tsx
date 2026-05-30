export default function Loading() {
  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-7 w-36 bg-[#F0F0F0] rounded-lg animate-pulse" />
        <div className="h-9 w-32 bg-[#F0F0F0] rounded-lg animate-pulse" />
      </div>
      <div className="flex flex-col gap-5 max-w-2xl">
        <div className="bg-white rounded-2xl border border-[#F0F0F0] h-[160px] animate-pulse"
          style={{ borderLeft: "3px solid #F0F0F0" }} />
        <div className="rounded-2xl h-[120px] animate-pulse" style={{ border: "2px dashed #F0F0F0" }} />
      </div>
    </div>
  );
}
