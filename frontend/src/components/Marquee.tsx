type MarqueeProps = {
  items: string[];
  className?: string;
  mono?: boolean;
  inverse?: boolean;
};

/** Seamless infinite ticker; the track is rendered twice and translated 50%. */
export function Marquee({ items, className = "", mono = false, inverse = false }: MarqueeProps) {
  const track = [...items, ...items];
  const text = mono
    ? "font-mono text-[11px] tracking-[0.22em]"
    : "font-semibold text-[13px] uppercase tracking-[0.14em]";
  const tone = inverse ? "text-white/45" : "text-uni-muted";

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <div className="mask-fade-x">
        <div className="flex w-max animate-marquee items-center pause-on-hover">
          {track.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`flex shrink-0 items-center gap-8 pr-8 ${text} ${tone}`}
            >
              {item}
              <span className={`h-1.5 w-1.5 rounded-full ${inverse ? "bg-fox/70" : "bg-fox/60"}`} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
