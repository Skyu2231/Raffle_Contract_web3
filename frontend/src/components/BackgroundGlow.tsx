export function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-[12%] -top-[18%] h-[560px] w-[560px] animate-drift rounded-full bg-[#ffd9c2] blur-[110px] dark:bg-[#3a2115]" />
      <div
        className="absolute -right-[10%] top-[2%] h-[520px] w-[520px] animate-drift rounded-full bg-[#ffe9d6] blur-[120px] dark:bg-[#2b1a12]"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="absolute bottom-[-22%] left-[22%] h-[460px] w-[680px] animate-drift rounded-full bg-[#fff3e4] blur-[130px] dark:bg-[#211812]"
        style={{ animationDelay: "-13s" }}
      />
    </div>
  );
}
