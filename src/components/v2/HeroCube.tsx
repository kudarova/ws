import { useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";

const faces = [
  { letter: "К", position: "front" },
  { letter: "У", position: "top" },
  { letter: "Б", position: "right" },
  { letter: "И", position: "bottom" },
  { letter: "Т", position: "left" },
  { letter: "X", position: "back" },
] as const;

type FacePosition = (typeof faces)[number]["position"];

type Point3D = {
  x: number;
  y: number;
  z: number;
};

type CubeComet = {
  id: number;
  face: FacePosition;
  start: Point3D;
  end: Point3D;
  impactX: number;
  impactY: number;
  roll: number;
  yaw: number;
};

type CubeImpact = Pick<CubeComet, "id" | "face" | "impactX" | "impactY">;

type HeroCubeProps = {
  active: boolean;
};

const randomBetween = (minimum: number, maximum: number) => (
  minimum + Math.random() * (maximum - minimum)
);

const getImpactPosition = (face: FacePosition, point: Point3D) => {
  let horizontal = point.x;
  let vertical = point.y;

  if (face === "back") {
    horizontal = -point.x;
  } else if (face === "right") {
    horizontal = -point.z;
  } else if (face === "left") {
    horizontal = point.z;
  } else if (face === "top") {
    horizontal = point.x;
    vertical = point.z;
  } else if (face === "bottom") {
    horizontal = point.x;
    vertical = -point.z;
  }

  return {
    impactX: 50 + horizontal * 50,
    impactY: 50 + vertical * 50,
  };
};

const createComet = (id: number): CubeComet => {
  const face = (faces[Math.floor(Math.random() * faces.length)] ?? faces[0]).position;
  const end: Point3D = {
    x: randomBetween(-0.58, 0.58),
    y: randomBetween(-0.58, 0.58),
    z: randomBetween(-0.58, 0.58),
  };
  const start: Point3D = {
    x: randomBetween(-0.48, 0.48),
    y: randomBetween(-0.48, 0.48),
    z: randomBetween(-0.48, 0.48),
  };

  if (face === "front" || face === "back") {
    const direction = face === "front" ? 1 : -1;
    end.z = direction;
    start.z = -direction * randomBetween(0.45, 0.76);
  } else if (face === "right" || face === "left") {
    const direction = face === "right" ? 1 : -1;
    end.x = direction;
    start.x = -direction * randomBetween(0.45, 0.76);
  } else {
    const direction = face === "bottom" ? 1 : -1;
    end.y = direction;
    start.y = -direction * randomBetween(0.45, 0.76);
  }

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const deltaZ = end.z - start.z;
  const distance = Math.hypot(deltaX, deltaY, deltaZ);
  const roll = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  const yaw = -Math.asin(deltaZ / distance) * (180 / Math.PI);
  const impactPosition = getImpactPosition(face, end);

  return {
    id,
    face,
    start,
    end,
    roll,
    yaw,
    ...impactPosition,
  };
};

const coordinate = (value: number) => `calc(var(--cube-depth) * ${value.toFixed(3)})`;

function HeroCube({ active }: HeroCubeProps) {
  const [comet, setComet] = useState<CubeComet | null>(null);
  const [impact, setImpact] = useState<CubeImpact | null>(null);
  const impactTimerRef = useRef<number>(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cometId = 0;
    let spawnTimer = 0;

    const clearMotion = () => {
      window.clearTimeout(spawnTimer);
      window.clearTimeout(impactTimerRef.current);
      setComet(null);
      setImpact(null);
    };

    const canAnimate = () => (
      active && !motionQuery.matches && !document.hidden
    );

    const scheduleComet = (initial = false) => {
      window.clearTimeout(spawnTimer);

      if (!canAnimate()) {
        return;
      }

      const delay = initial ? randomBetween(650, 1050) : randomBetween(1000, 2000);
      spawnTimer = window.setTimeout(() => {
        if (!canAnimate()) {
          return;
        }

        cometId += 1;
        setComet(createComet(cometId));
        scheduleComet();
      }, delay);
    };

    const resetAndSchedule = () => {
      clearMotion();
      scheduleComet(true);
    };

    const handleVisibilityChange = () => {
      resetAndSchedule();
    };

    scheduleComet(true);
    motionQuery.addEventListener("change", resetAndSchedule);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearMotion();
      motionQuery.removeEventListener("change", resetAndSchedule);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active]);

  const handleCometAnimationEnd = (event: AnimationEvent<HTMLSpanElement>, finishedComet: CubeComet) => {
    if (event.target !== event.currentTarget || event.animationName !== "v2-cube-comet-flight") {
      return;
    }

    setComet((current) => (current?.id === finishedComet.id ? null : current));

    if (
      !active
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || document.hidden
    ) {
      return;
    }

    setImpact({
      id: finishedComet.id,
      face: finishedComet.face,
      impactX: finishedComet.impactX,
      impactY: finishedComet.impactY,
    });

    window.clearTimeout(impactTimerRef.current);
    impactTimerRef.current = window.setTimeout(() => setImpact(null), 820);
  };

  const cometStyle = comet ? {
    "--comet-start-x": coordinate(comet.start.x),
    "--comet-start-y": coordinate(comet.start.y),
    "--comet-start-z": coordinate(comet.start.z),
    "--comet-end-x": coordinate(comet.end.x),
    "--comet-end-y": coordinate(comet.end.y),
    "--comet-end-z": coordinate(comet.end.z),
    "--comet-roll": `${comet.roll.toFixed(2)}deg`,
    "--comet-yaw": `${comet.yaw.toFixed(2)}deg`,
  } as CSSProperties : undefined;

  return (
    <div className="v2-cube" role="img" aria-label="Прозрачный куб с буквами К, У, Б, И, Т, X на шести гранях">
      <div className="v2-cube__look" aria-hidden="true">
        {faces.map((face) => {
          const faceImpact = impact?.face === face.position ? impact : null;
          const impactStyle = faceImpact ? {
            "--impact-x": `${faceImpact.impactX.toFixed(2)}%`,
            "--impact-y": `${faceImpact.impactY.toFixed(2)}%`,
          } as CSSProperties : undefined;

          return (
            <div
              className={`v2-cube__face v2-cube__face--${face.position}${faceImpact ? " is-impacted" : ""}`}
              key={face.letter}
              style={impactStyle}
            >
              <span className="v2-cube__letter">{face.letter}</span>
              {faceImpact && <span className="v2-cube__impact" key={faceImpact.id} />}
            </div>
          );
        })}

        <span className="v2-cube__comets">
          {comet && (
            <span
              className="v2-cube__comet"
              key={comet.id}
              style={cometStyle}
              onAnimationEnd={(event) => handleCometAnimationEnd(event, comet)}
            >
              <span className="v2-cube__comet-trail" />
              <span className="v2-cube__comet-head" />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default HeroCube;
