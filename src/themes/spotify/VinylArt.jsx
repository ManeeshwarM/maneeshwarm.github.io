import AlbumArt from "./AlbumArt";

// Wraps the generated album art in a circular vinyl record that spins while
// a track is "playing" and eases to a stop when paused — the label is the
// album art itself, cropped to a circle, with grooves etched around it.
export default function VinylArt({ project, size = 56, playing = false }) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          animation: playing ? "vinylSpin 3.2s linear infinite" : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {/* Grooves */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "#0a0a0a",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 3px rgba(255,255,255,0.03), inset 0 0 0 6px rgba(255,255,255,0.05), inset 0 0 0 9px rgba(255,255,255,0.03)",
          }}
        />
        {/* Label (the actual generated album art), inset so grooves show at the rim */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{ inset: size * 0.22 }}
        >
          <AlbumArt project={project} size={size * 0.56} rounded="rounded-full" />
        </div>
        {/* Spindle hole */}
        <div
          className="absolute rounded-full bg-black"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </div>
  );
}
