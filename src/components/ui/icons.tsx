// Minimal inline icon set — 1.5px line strokes, currentColor.

interface IconProps {
  size?: number;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
}

export function SunIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function MenuIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className="check-icon-svg">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function ArrowIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExternalIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function UploadIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 16V4M7 9l5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowDownIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}
