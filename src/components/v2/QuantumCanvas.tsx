import { useEffect, useRef } from "react";

type Streak = {
  x: number;
  y: number;
  angle: number;
  speed: number;
  age: number;
  life: number;
  length: number;
  tone: "white" | "silver";
};

type Anchor = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

const TAU = Math.PI * 2;

export type QuantumCanvasPalette = {
  anchor: string;
  staticLine: string;
  streakTailRgb: string;
  streakMidRgb: string;
  streakHeadRgb: string;
};

type QuantumCanvasProps = {
  palette: QuantumCanvasPalette;
};

function QuantumCanvas({ palette }: QuantumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let previousTime = performance.now();
    let timeToNextStreak = 240;
    let streaks: Streak[] = [];
    let anchors: Anchor[] = [];

    const makeAnchors = () => {
      const count = Math.max(12, Math.min(28, Math.round((width * height) / 76000)));
      anchors = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() > 0.84 ? 1.1 : 0.55,
        opacity: 0.035 + Math.random() * 0.055,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      makeAnchors();
    };

    const createStreak = (): Streak => {
      const goesRight = Math.random() > 0.34;
      const baseAngle = goesRight ? 0 : Math.PI;
      const angle = baseAngle + (-0.34 + Math.random() * 0.68);

      return {
        x: Math.random() * width,
        y: 40 + Math.random() * Math.max(80, height - 80),
        angle,
        speed: 480 + Math.random() * 640,
        age: 0,
        life: 0.52 + Math.random() * 0.62,
        length: 82 + Math.random() * 118,
        tone: Math.random() > 0.36 ? "silver" : "white",
      };
    };

    const drawAnchors = () => {
      context.fillStyle = palette.anchor;
      for (const anchor of anchors) {
        context.globalAlpha = anchor.opacity;
        context.beginPath();
        context.arc(anchor.x, anchor.y, anchor.radius, 0, TAU);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const drawStaticFrame = () => {
      context.clearRect(0, 0, width, height);
      drawAnchors();
      context.strokeStyle = palette.staticLine;
      context.lineWidth = 0.7;
      context.beginPath();
      context.moveTo(width * 0.72, height * 0.23);
      context.lineTo(width * 0.79, height * 0.205);
      context.stroke();
    };

    const drawFrame = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;
      context.clearRect(0, 0, width, height);
      drawAnchors();

      timeToNextStreak -= delta * 1000;
      if (timeToNextStreak <= 0 && streaks.length < 6) {
        streaks.push(createStreak());
        timeToNextStreak = 480 + Math.random() * 1180;
      }

      streaks = streaks.filter((streak) => {
        streak.age += delta;
        if (streak.age >= streak.life) {
          return false;
        }

        const progress = streak.age / streak.life;
        const acceleration = progress * progress;
        const distance = streak.speed * streak.life * acceleration;
        const headX = streak.x + Math.cos(streak.angle) * distance;
        const headY = streak.y + Math.sin(streak.angle) * distance;
        const currentLength = streak.length * (0.14 + progress * 3.86);
        const tailX = headX - Math.cos(streak.angle) * currentLength;
        const tailY = headY - Math.sin(streak.angle) * currentLength;
        const appear = Math.min(1, progress / 0.075);
        const disappear = Math.pow(1 - progress, 1.6);
        const alpha = appear * disappear * (streak.tone === "white" ? 0.52 : 0.3);
        const gradient = context.createLinearGradient(tailX, tailY, headX, headY);

        gradient.addColorStop(0, `rgba(${palette.streakTailRgb}, 0)`);
        gradient.addColorStop(0.64, `rgba(${palette.streakMidRgb}, ${alpha * 0.62})`);
        gradient.addColorStop(1, `rgba(${palette.streakHeadRgb}, ${alpha})`);

        context.strokeStyle = gradient;
        context.lineWidth = streak.tone === "white" ? 0.92 : 0.62;
        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(headX, headY);
        context.stroke();

        return true;
      });

      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      previousTime = performance.now();
      if (motionQuery.matches) {
        drawStaticFrame();
      } else {
        animationFrame = window.requestAnimationFrame(drawFrame);
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else {
        start();
      }
    };

    const handleResize = () => {
      resize();
      if (motionQuery.matches) {
        drawStaticFrame();
      }
    };

    resize();
    start();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", start);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", start);
    };
  }, [palette]);

  return <canvas ref={canvasRef} className="v2-quantum-canvas" aria-hidden="true" />;
}

export default QuantumCanvas;
