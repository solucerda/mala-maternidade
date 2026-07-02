const CORACOES = [
  { x: '8%', y: '15%', s: 18, o: 0.5 },
  { x: '85%', y: '10%', s: 24, o: 0.4 },
  { x: '15%', y: '75%', s: 14, o: 0.45 },
  { x: '90%', y: '65%', s: 20, o: 0.35 },
  { x: '50%', y: '5%', s: 12, o: 0.4 },
  { x: '70%', y: '85%', s: 16, o: 0.3 },
  { x: '30%', y: '40%', s: 10, o: 0.3 },
];

export default function HeartsBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-rose-light to-base" aria-hidden="true" />
      <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden="true">
        {CORACOES.map((h, i) => (
          <g key={i} transform={`translate(${h.x}, ${h.y})`} opacity={h.o}>
            <path
              d="M0,7 L-1.5,5.5 C-3.8,3.4 -5,1.6 -5,-0.4 C-5,-2.1 -3.7,-3.5 -2,-3.5 C-1,-3.5 -0.1,-3 0,-2.4 C0.1,-3 1,-3.5 2,-3.5 C3.7,-3.5 5,-2.1 5,-0.4 C5,1.6 3.8,3.4 1.5,5.5 Z"
              fill="#C97B84"
              transform={`scale(${h.s / 8})`}
            />
          </g>
        ))}
      </svg>
    </>
  );
}
