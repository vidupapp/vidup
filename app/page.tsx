export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        background: [
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,25,44,0.10) 0%, transparent 70%)",
          "#0D0D0D",
        ].join(", "),
      }}
    >
      <p
        className="font-black text-white leading-none tracking-tight mb-6 select-none"
        style={{ fontSize: "clamp(72px, 18vw, 200px)", letterSpacing: "-6px", opacity: 0.95 }}
      >
        vid<span style={{ color: "#E8192C" }}>up</span>
      </p>

      <p
        className="text-[#555555] font-semibold uppercase tracking-[4px]"
        style={{ fontSize: "clamp(11px, 2vw, 14px)" }}
      >
        Coming Soon
      </p>
    </div>
  );
}
