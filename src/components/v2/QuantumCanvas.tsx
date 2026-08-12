import { useEffect, useRef } from "react";

type Anchor = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

const TAU = Math.PI * 2;

export type QuantumCanvasPalette = {
  anchor: string;
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

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
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
      drawStaticFrame();
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [palette]);

  return <canvas ref={canvasRef} className="v2-quantum-canvas" aria-hidden="true" />;
}

export default QuantumCanvas;
