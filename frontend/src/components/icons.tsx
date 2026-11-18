type IconProps = {
  className?: string;
};

/** Original fox-inspired mark, painted in the MetaMask orange family. */
export function Fox({ className }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M4.5 4.5 15 10h10l10.5-5.5-1.9 13.2C33.6 26 27.6 32 20 32s-13.6-6-13.6-14.3L4.5 4.5Z"
        fill="#ff5c16"
        stroke="#e2470a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5.5 6.5 15 10.5h10l9.5-4-1.2 8.5-18.9-.1L5.5 6.5Z" fill="#ff7a2f" />
      <path
        d="M12 19.4c1.9-1.6 4.6-2.1 5.9.4l-1.4 3.6-3.6-1.3-0.9-2.7Zm16 0c-1.9-1.6-4.6-2.1-5.9.4l1.4 3.6 3.6-1.3 0.9-2.7Z"
        fill="#fff1e8"
      />
      <path d="M20 24.2 22.7 26l-1.3 1.6h-2.8L17.3 26 20 24.2Z" fill="#ffe0cc" />
      <path d="M20 27.2c-1.6 0-3.2.5-4.4 1.4 1.2 1.6 2.7 2.4 4.4 2.4s3.2-.8 4.4-2.4c-1.2-.9-2.8-1.4-4.4-1.4Z" fill="#171310" />
    </svg>
  );
}

export function Logo({ className }: IconProps) {
  return (
    <span className={`${className ?? ""} flex items-center justify-center`}>
      <Fox className="h-full w-full" />
    </span>
  );
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Moon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wallet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7.5Z" strokeLinejoin="round" />
      <path d="M3 8h14.5a2.5 2.5 0 0 1 0 5H3" strokeLinejoin="round" />
      <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Ticket({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 9.5V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.5a2.5 2.5 0 0 0 0 5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5a2.5 2.5 0 0 0 0-5Z" strokeLinejoin="round" />
      <path d="M14 6v2m0 3v2m0 3v2" strokeLinecap="round" strokeDasharray="1 3" />
    </svg>
  );
}

export function Trophy({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3m10-5h3v2a3 3 0 0 1-3 3M12 14v4m-3 2h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5l1.7 5.3a4 4 0 0 0 2.5 2.5l5.3 1.7-5.3 1.7a4 4 0 0 0-2.5 2.5L12 21.5l-1.7-5.3a4 4 0 0 0-2.5-2.5L2.5 12l5.3-1.7a4 4 0 0 0 2.5-2.5L12 2.5Z" />
    </svg>
  );
}

export function Copy({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6a3 3 0 0 0-3 3v6.5A2.5 2.5 0 0 0 5.5 15" strokeLinecap="round" />
    </svg>
  );
}

export function Check({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m5 13 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function Plus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function Minus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function Clock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Shield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l7 3v5.5c0 4.2-2.8 7.9-7 9.5-4.2-1.6-7-5.3-7-9.5V6l7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h15m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v15m-6-6 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Bolt({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M13.5 2.5 5 13.5h5.5L9.5 21.5 19 10.5h-5.5l0-8Z" strokeLinejoin="round" />
    </svg>
  );
}

export function Lock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="4.5" y="10" width="15" height="10.5" rx="3" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Globe({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.5 3.9 5.6 3.9 9S14.6 18.5 12 21c-2.6-2.5-3.9-5.6-3.9-9S9.4 5.5 12 3Z" />
    </svg>
  );
}

export function Coins({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <ellipse cx="12" cy="6.5" rx="7.5" ry="3.2" />
      <path d="M4.5 6.5v5c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-5" />
      <path d="M4.5 11.5v5c0 1.8 3.4 3.2 7.5 3.2s7.5-1.4 7.5-3.2v-5" />
    </svg>
  );
}

export function Menu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function Github({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.92-2.35 4.79-4.58 5.04.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function XSocial({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.3 3h3.3l-7.2 8.2L21.8 21h-6.6l-4.6-6-5.3 6H2l7.7-8.8L2.4 3H9l4.2 5.5L17.3 3Zm-1.2 16h1.8L7.9 4.8H6L16.1 19Z" />
    </svg>
  );
}

export function Discord({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.3 5.3A16.4 16.4 0 0 0 15.2 4l-.3.6a12 12 0 0 1 3.7 1.7 12.9 12.9 0 0 0-11.2 0A12 12 0 0 1 11.1 4.6L10.8 4a16.4 16.4 0 0 0-4.1 1.3C3.9 9.2 3.2 13 3.5 16.7a16 16 0 0 0 4.9 2.5l1-1.6a10.6 10.6 0 0 1-1.7-.8l.4-.3a11.6 11.6 0 0 0 9.8 0l.4.3c-.5.3-1.1.6-1.7.8l1 1.6a16 16 0 0 0 4.9-2.5c.4-4.3-.6-8-2.2-11.4ZM9.3 14.4c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Zm5.4 0c-.9 0-1.7-.9-1.7-1.9s.8-1.9 1.7-1.9 1.7.9 1.7 1.9-.8 1.9-1.7 1.9Z" />
    </svg>
  );
}

export function Spinner({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
