import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Spin = {
  x: number;
  y: number;
  angle: number;
  polarity: number;
};

const initialSpins: Spin[] = [
  { x: 112, y: 190, angle: -24, polarity: 0 },
  { x: 504, y: 174, angle: 38, polarity: 0 },
  { x: 104, y: 430, angle: 52, polarity: 1 },
  { x: 512, y: 448, angle: -36, polarity: 1 },
];

const spinZones = [
  { x: [82, 148], y: [154, 252] },
  { x: [472, 538], y: [150, 248] },
  { x: [82, 148], y: [370, 468] },
  { x: [472, 538], y: [374, 472] },
];

function randomBetween([minimum, maximum]: number[]) {
  return minimum + Math.random() * (maximum - minimum);
}

function createSpinLayout(): Spin[] {
  return spinZones.map((zone, index) => ({
    x: randomBetween(zone.x),
    y: randomBetween(zone.y),
    angle: Math.round(Math.random() * 150 - 75),
    polarity: index < 2 ? 0 : 1,
  }));
}

function DigitalCoreVisual() {
  const [spins, setSpins] = useState(initialSpins);
  const [isMeasured, setIsMeasured] = useState(false);
  const [measurementAngle, setMeasurementAngle] = useState(-28);
  const [isTouchMode, setIsTouchMode] = useState(false);
  const relocationTimer = useRef<number | null>(null);

  useEffect(() => {
    const touchQuery = window.matchMedia("(hover: none)");
    const updateTouchMode = () => setIsTouchMode(touchQuery.matches);

    updateTouchMode();
    touchQuery.addEventListener("change", updateTouchMode);

    return () => touchQuery.removeEventListener("change", updateTouchMode);
  }, []);

  useEffect(() => {
    if (
      !isTouchMode ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let measureTimer: number;
    let resetTimer: number;

    const runCycle = () => {
      measureTimer = window.setTimeout(() => {
        setMeasurementAngle(Math.round(Math.random() * 110 - 55));
        setIsMeasured(true);

        resetTimer = window.setTimeout(() => {
          setIsMeasured(false);
          setSpins(createSpinLayout());
          runCycle();
        }, 1200);
      }, 2800);
    };

    runCycle();

    return () => {
      window.clearTimeout(measureTimer);
      window.clearTimeout(resetTimer);
    };
  }, [isTouchMode]);

  useEffect(
    () => () => {
      if (relocationTimer.current !== null) {
        window.clearTimeout(relocationTimer.current);
      }
    },
    [],
  );

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;

    setMeasurementAngle(Math.atan2(y, x) * (180 / Math.PI));
    setIsMeasured(true);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      return;
    }

    setIsMeasured(false);

    if (relocationTimer.current !== null) {
      window.clearTimeout(relocationTimer.current);
    }

    relocationTimer.current = window.setTimeout(() => {
      setSpins(createSpinLayout());
    }, 360);
  };

  return (
    <div
      className={`digital-core${isMeasured ? " digital-core--measured" : ""}`}
      aria-hidden="true"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <svg viewBox="0 0 620 620" role="presentation">
        <defs>
          <linearGradient id="cube-line" x1="170" y1="120" x2="470" y2="490">
            <stop offset="0" stopColor="#8ffcf2" />
            <stop offset="0.58" stopColor="#64a1ff" />
            <stop offset="1" stopColor="#8d7aff" />
          </linearGradient>
          <linearGradient id="cube-face" x1="160" y1="160" x2="460" y2="460">
            <stop offset="0" stopColor="#8ffcf2" stopOpacity="0.1" />
            <stop offset="1" stopColor="#7157ff" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <g className="digital-core__axes">
          <path d="M310 80v52M310 492v48M80 310h74M466 310h74" />
          <circle cx="310" cy="68" r="3" />
          <circle cx="310" cy="552" r="3" />
          <circle cx="68" cy="310" r="3" />
          <circle cx="552" cy="310" r="3" />
        </g>

        <g className="digital-core__correlations">
          <path d={`M${spins[0].x} ${spins[0].y}L${spins[1].x} ${spins[1].y}`} />
          <path d={`M${spins[2].x} ${spins[2].y}L${spins[3].x} ${spins[3].y}`} />
        </g>

        <g className="digital-core__cube">
          <path className="digital-core__face" d="M310 132 466 222 310 312 154 222Z" />
          <path className="digital-core__face" d="M154 222 310 312 310 492 154 402Z" />
          <path className="digital-core__face" d="M466 222 310 312 310 492 466 402Z" />
          <path d="M310 132 466 222 310 312 154 222 310 132Z" />
          <path d="M154 222v180l156 90 156-90V222" />
          <path d="M310 312v180" />
        </g>

        <g className="digital-core__spins">
          {spins.map((spin, index) => {
            const spinStyle = {
              "--spin-angle": `${spin.angle}deg`,
              "--measurement-angle": `${measurementAngle + spin.polarity * 180}deg`,
              "--spin-delay": `${index * -0.42}s`,
            } as CSSProperties;

            return (
              <g
                className="digital-core__spin-position"
                transform={`translate(${spin.x} ${spin.y})`}
                key={index}
              >
                <g className="digital-core__spin" style={spinStyle}>
                  <circle r="4" />
                  <path className="digital-core__spin-trace" d="M-16-12A20 20 0 0 1 17 11" />
                  <path className="digital-core__spin-vector" d="M-22 0H21" />
                  <path className="digital-core__spin-tip" d="m21 0-7-5v10Z" />
                </g>
              </g>
            );
          })}
        </g>

        <g className="digital-core__stars">
          <path d="M86 110v22M75 121h22" />
          <path d="M526 500v18M517 509h18" />
        </g>
      </svg>
    </div>
  );
}

export default DigitalCoreVisual;
