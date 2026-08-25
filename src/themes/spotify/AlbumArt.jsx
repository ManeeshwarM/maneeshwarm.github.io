// Rich, deterministic "cover art" generated from the project id + accent color.
// Each project gets a unique pattern that looks like a real album cover.
export default function AlbumArt({ project, size = 160, rounded = "rounded-md" }) {
  const seed = [...project.id].reduce((a, c) => a + c.charCodeAt(0), 0);

  // Derive a secondary color from the accent
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const [r, g, b] = hexToRgb(project.accent);
  const complementR = (b * 0.5 + r * 0.5) | 0;
  const complementG = (r * 0.3 + g * 0.7) | 0;
  const complementB = (g * 0.4 + b * 0.6) | 0;
  const accent2 = `rgb(${complementR},${complementG},${complementB})`;

  // Determine pattern type from seed
  const patternType = seed % 5;

  const patterns = {
    // Circular waveform
    0: (
      <>
        <defs>
          <radialGradient id={`rg0-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={project.accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#rg0-${seed})`} />
        {Array.from({ length: 8 }).map((_, i) => {
          const r2 = 10 + i * 6;
          const sw = 0.5 + ((seed * (i + 1)) % 5) * 0.3;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r2}
              fill="none"
              stroke={project.accent}
              strokeWidth={sw}
              opacity={0.3 + i * 0.08}
            />
          );
        })}
        <circle cx="50" cy="50" r="6" fill={project.accent} opacity="1" />
      </>
    ),

    // Grid blocks
    1: (
      <>
        <defs>
          <linearGradient id={`lg1-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={project.accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="#0d0d0d" />
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => {
            const n = (seed * (row + 1) * (col + 2)) % 100;
            if (n % 2 === 0) return null;
            return (
              <rect
                key={`${row}-${col}`}
                x={col * 20 + 1}
                y={row * 20 + 1}
                width={18}
                height={18}
                rx={2}
                fill={project.accent}
                opacity={0.15 + (n % 7) * 0.1}
              />
            );
          })
        )}
        <rect width="100" height="100" fill={`url(#lg1-${seed})`} />
        <rect x="40" y="40" width="20" height="20" rx="4" fill={project.accent} opacity="0.9" />
      </>
    ),

    // Waveform bars
    2: (
      <>
        <defs>
          <linearGradient id={`lg2-${seed}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={project.accent} stopOpacity="0" />
            <stop offset="100%" stopColor={project.accent} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="#0d0d0d" />
        {Array.from({ length: 20 }).map((_, i) => {
          const h = 10 + ((seed * (i + 3)) % 60);
          const x = i * 5;
          return (
            <rect
              key={i}
              x={x}
              y={100 - h}
              width={4}
              height={h}
              fill={`url(#lg2-${seed})`}
              opacity={0.5 + (i % 3) * 0.15}
            />
          );
        })}
      </>
    ),

    // Diagonal stripes + circle
    3: (
      <>
        <defs>
          <pattern
            id={`stripe-${seed}`}
            x="0"
            y="0"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="12" fill={project.accent} opacity="0.12" />
          </pattern>
          <radialGradient id={`rg3-${seed}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={project.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="#0d0d0d" />
        <rect width="100" height="100" fill={`url(#stripe-${seed})`} />
        <rect width="100" height="100" fill={`url(#rg3-${seed})`} />
        <circle cx="50" cy="50" r="24" fill="none" stroke={project.accent} strokeWidth="1" opacity="0.6" />
        <circle cx="50" cy="50" r="14" fill="none" stroke={project.accent} strokeWidth="1" opacity="0.4" />
        <circle cx="50" cy="50" r="6" fill={project.accent} opacity="0.9" />
      </>
    ),

    // Diamond/polygon pattern
    4: (
      <>
        <defs>
          <radialGradient id={`rg4-${seed}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor={accent2} stopOpacity="0.8" />
            <stop offset="60%" stopColor={project.accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#rg4-${seed})`} />
        {Array.from({ length: 4 }).map((_, i) => {
          const s = 20 + i * 12;
          const x = 50 - s / 2;
          const y = 50 - s / 2;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={s}
              height={s}
              fill="none"
              stroke={project.accent}
              strokeWidth="0.8"
              opacity={0.2 + i * 0.15}
              transform={`rotate(${45 + i * 10} 50 50)`}
            />
          );
        })}
        <rect
          x="44"
          y="44"
          width="12"
          height="12"
          fill={project.accent}
          opacity="1"
          transform="rotate(45 50 50)"
        />
      </>
    ),
  };

  return (
    <div
      className={`overflow-hidden shrink-0 ${rounded}`}
      style={{
        width: size,
        height: size,
        background: "#0d0d0d",
        boxShadow: typeof size === "number" && size > 80 ? `0 8px 24px rgba(0,0,0,0.6)` : undefined,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {patterns[patternType]}
      </svg>
    </div>
  );
}
