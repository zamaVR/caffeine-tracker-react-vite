// src/components/GeometricOverlay.tsx
export function GeometricOverlay() {
    return (
      <svg
        className="geometric-overlay"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="overlayGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2E9E4" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <path
          d="M 200 100 Q 400 0, 600 150 T 800 100 L 800 600 L 0 600 Z"
          fill="url(#overlayGradient)"
          opacity="0.5"
        />
        <circle cx="650" cy="450" r="120" fill="#F2E9E4" opacity="0.3" />
        <circle cx="150" cy="500" r="200" fill="#F2E9E4" opacity="0.15" />
      </svg>
    )
  }
  