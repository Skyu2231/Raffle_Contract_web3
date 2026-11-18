type AvatarProps = {
  address: string;
  size?: number;
  className?: string;
};

function hueFor(address: string): number {
  let hash = 0;
  for (let i = 2; i < address.length; i++) {
    hash = (hash * 31 + address.charCodeAt(i)) % 360;
  }
  return hash;
}

export function Avatar({ address, size = 32, className = "" }: AvatarProps) {
  const hue = hueFor(address.toLowerCase());
  return (
    <span
      className={`inline-block shrink-0 rounded-full ring-2 ring-white dark:ring-uni-surface ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 92% 66%), hsl(${(hue + 68) % 360} 88% 56%))`,
      }}
      aria-hidden="true"
    />
  );
}
