import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Spin = {
  x: number;
  y: number;
  polarity: "up" | "down";
};

type SpinPair = {
  id: number;
  angle: number;
  gap: number;
  first: Spin;
  second: Spin;
};

const pairSeeds = [
  { x: 24, y: 19, angle: 16, gap: 42 },
  { x: 43, y: 18, angle: -42, gap: 50 },
  { x: 78, y: 22, angle: 34, gap: 38 },
  { x: 25, y: 51, angle: -28, gap: 52 },
  { x: 58, y: 43, angle: 52, gap: 34 },
  { x: 75, y: 56, angle: -12, gap: 48 },
  { x: 18, y: 77, angle: 36, gap: 40 },
  { x: 69, y: 78, angle: -38, gap: 50 },
];

function makePair(id: number, x: number, y: number, angle: number, gap = 12): SpinPair {
  const radians = (angle * Math.PI) / 180;
  const halfGap = gap / 2;
  const dx = Math.cos(radians) * halfGap;
  const dy = Math.sin(radians) * halfGap;

  return {
    id,
    angle,
    gap,
    first: { x: x - dx, y: y - dy, polarity: "up" },
    second: { x: x + dx, y: y + dy, polarity: "down" },
  };
}

function makeRandomPair(id: number): SpinPair {
  return makePair(
    id,
    28 + Math.random() * 44,
    28 + Math.random() * 44,
    -60 + Math.random() * 120,
    34 + Math.random() * 18,
  );
}

const initialPairs = pairSeeds.map((seed, index) =>
  makePair(index, seed.x, seed.y, seed.angle, seed.gap),
);

function QuantumField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const observingRef = useRef(new Set<number>());
  const [pairs, setPairs] = useState<SpinPair[]>(initialPairs);
  const [observedIds, setObservedIds] = useState<number[]>([]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPairs((current) =>
        current.map((pair) =>
          observingRef.current.has(pair.id) ? pair : makeRandomPair(pair.id),
        ),
      );
    }, 6800);

    return () => window.clearInterval(intervalId);
  }, []);

  const observePair = (id: number) => {
    if (observingRef.current.has(id)) {
      return;
    }

    observingRef.current.add(id);
    setObservedIds((current) => [...current, id]);

    window.setTimeout(() => {
      setPairs((current) =>
        current.map((pair) => (pair.id === id ? makeRandomPair(id) : pair)),
      );
      setObservedIds((current) => current.filter((pairId) => pairId !== id));
      observingRef.current.delete(id);
    }, 820);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current;

    if (!field) {
      return;
    }

    const bounds = field.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
    const nearestPair = pairs.find((pair) => {
      const centerX = (pair.first.x + pair.second.x) / 2;
      const centerY = (pair.first.y + pair.second.y) / 2;

      return Math.hypot(centerX - pointerX, centerY - pointerY) < 22;
    });

    if (nearestPair) {
      observePair(nearestPair.id);
    }
  };

  const spinStyle = (spin: Spin, observed: boolean): CSSProperties => ({
    left: `${spin.x}%`,
    top: `${spin.y}%`,
    "--spin-angle": `${spin.polarity === "up" ? -42 : 42}deg`,
    "--spin-delay": `${Math.round((spin.x + spin.y) * 18)}ms`,
    ...(observed ? { "--spin-delay": "0ms" } : {}),
  } as CSSProperties);

  return (
    <div
      ref={fieldRef}
      className="v2-quantum-field"
      onPointerMove={handlePointerMove}
      aria-label="Квантовое поле пар спинов"
      role="img"
    >
      <svg className="v2-quantum-field__links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {pairs.map((pair) => (
          <line
            key={pair.id}
            className={`v2-quantum-field__link ${observedIds.includes(pair.id) ? "is-observed" : ""}`}
            x1={pair.first.x}
            y1={pair.first.y}
            x2={pair.second.x}
            y2={pair.second.y}
          />
        ))}
      </svg>

      {pairs.map((pair) => {
        const observed = observedIds.includes(pair.id);

        return (
          <div key={pair.id} className={`v2-quantum-field__pair ${observed ? "is-observed" : ""}`}>
            <span className="v2-quantum-field__spin" style={spinStyle(pair.first, observed)} />
            <span className="v2-quantum-field__spin" style={spinStyle(pair.second, observed)} />
          </div>
        );
      })}

    </div>
  );
}

export default QuantumField;
