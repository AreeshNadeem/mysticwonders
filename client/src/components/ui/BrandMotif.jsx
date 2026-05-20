/** Decorative SVG brand motif — hearts, stars, circles — for dark hero sections */
export default function BrandMotif({ dark = true }) {
  const strokeColor  = dark ? '#6B1A2E' : '#D4919F';
  const accentColor  = dark ? '#8B3545' : '#C47080';
  const heartFill    = dark ? '#C47080' : '#D4919F';

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 390 300"
      fill="none"
    >
      {/* Background circles */}
      <circle cx="350" cy="60"  r="110" stroke={strokeColor} strokeWidth="0.5" opacity="0.2" />
      <circle cx="40"  cy="240" r="80"  stroke={strokeColor} strokeWidth="0.4" opacity="0.15" />

      {/* Bow / heart knot top-left */}
      <path d="M60 70 C70 61,86 63,82 72 C78 81,64 78,60 70 Z"  fill="none" stroke={accentColor} strokeWidth="0.9" opacity="0.45" />
      <path d="M60 70 C50 61,34 63,38 72 C42 81,56 78,60 70 Z"  fill="none" stroke={accentColor} strokeWidth="0.9" opacity="0.45" />
      <line x1="60" y1="70" x2="60" y2="86" stroke={accentColor} strokeWidth="0.9" opacity="0.45" />

      {/* Small heart top-right */}
      <path
        d="M330 150 C330 145,324 141,324 147 C324 152,330 156,330 156 C330 156,336 152,336 147 C336 141,330 145,330 150"
        fill={heartFill}
        opacity="0.3"
      />

      {/* Star */}
      <path
        d="M320 80 L322 87 L329 87 L324 91 L326 98 L320 94 L314 98 L316 91 L311 87 L318 87 Z"
        fill={accentColor}
        opacity="0.25"
      />
    </svg>
  );
}
