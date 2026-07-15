import { useEffect, useRef } from "react";

export type Zone = {
  id: string;
  label: string;
};

type ZoneRailProps = {
  zones: Zone[];
  activeId: string;
};

function ZoneRail({ zones, activeId }: ZoneRailProps) {
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    const updateProximity = () => {
      frame = 0;
      railRef.current
        ?.querySelectorAll<HTMLElement>(".v2-zone-rail__item")
        .forEach((item) => {
          const rect = item.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.hypot(pointerX - centerX, pointerY - centerY);
          const proximity = Math.max(0, 1 - distance / 112);
          item.style.setProperty("--zone-scale", (1 + proximity * 3.25).toFixed(3));
          item.style.setProperty("--zone-label-offset", `${48 + proximity * 32}px`);
        });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) {
        frame = window.requestAnimationFrame(updateProximity);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <nav
      ref={railRef}
      className="v2-zone-rail"
      aria-label="Зоны страницы"
    >
      {zones.map((zone, index) => (
        <a
          className={`v2-zone-rail__item ${activeId === zone.id ? "is-active" : ""}`}
          href={`#${zone.id}`}
          key={zone.id}
          aria-label={`Перейти к зоне «${zone.label}»`}
          aria-current={activeId === zone.id ? "location" : undefined}
        >
          <span className="v2-zone-rail__index">0{index + 1}</span>
          <span className="v2-zone-rail__line" />
          <span className="v2-zone-rail__label">{zone.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default ZoneRail;
