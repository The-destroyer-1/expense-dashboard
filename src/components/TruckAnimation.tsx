type Props = {
  duration?: string; // e.g. '12s'
  wheelRotate?: boolean;
};

export default function TruckAnimation({ duration = "12s", wheelRotate = true }: Props) {
  const wheelClass = wheelRotate ? "wheel-rotate" : "";

  return (
    <div className="truck-animation fixed inset-x-0 bottom-6 pointer-events-none z-40">
      <div className="truck-track relative w-full h-14 overflow-hidden">
        <div
          className="truck absolute -left-40 h-14 pointer-events-auto"
          aria-hidden
          title="Truck (hover to pause)"
          style={{ ['--truck-duration' as any]: duration }}
        >
          <svg
            width="160"
            height="56"
            viewBox="0 0 160 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <rect x="0" y="12" width="100" height="32" rx="4" fill="#1F2937" />
            <rect x="100" y="4" width="44" height="36" rx="4" fill="#111827" />
            <rect x="8" y="8" width="64" height="16" rx="2" fill="#10B981" />
            <g className={wheelClass}>
              <circle cx="36" cy="48" r="6" fill="#0F172A" />
              <circle cx="124" cy="48" r="6" fill="#0F172A" />
              <circle cx="36" cy="48" r="3" fill="#9CA3AF" />
              <circle cx="124" cy="48" r="3" fill="#9CA3AF" />
            </g>
            <rect x="4" y="20" width="92" height="8" rx="1" fill="#111827" opacity="0.08" />
          </svg>
        </div>
      </div>
    </div>
  );
}
