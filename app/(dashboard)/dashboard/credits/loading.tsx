export default function Loading() {
  return (
    <div className="p-6 sm:p-8">
      <div className="h-7 w-32 bg-[#F0F0F0] rounded-lg animate-pulse mb-2" />
      <div className="h-5 w-64 bg-[#F0F0F0] rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8E8E8] h-[280px] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
