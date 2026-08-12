import { useEffect, useRef, useState } from "react";

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
  const [nearestIndex, setNearestIndex] = useState<number | null>(null);

  useEffect(() => {
    let frame = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    const mediaQuery = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");

    const updateProximity = () => {
      frame = 0;
      const rail = railRef.current;
      if (!rail || !mediaQuery.matches) {
        setNearestIndex(null);
        return;
      }

      const railRect = rail.getBoundingClientRect();
      const horizontalDistance = pointerX < railRect.left
        ? railRect.left - pointerX
        : pointerX > railRect.right
          ? pointerX - railRect.right
          : 0;
      if (horizontalDistance > 112) {
        setNearestIndex(null);
        return;
      }

      let nextNearestIndex: number | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;
      rail.querySelectorAll<HTMLElement>(".v2-zone-rail__item")
        .forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.hypot(pointerX - centerX, pointerY - centerY);
          if (distance <= 112 && distance < nearestDistance) {
            nearestDistance = distance;
            nextNearestIndex = index;
          }
        });
      setNearestIndex((current) => current === nextNearestIndex ? current : nextNearestIndex);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!mediaQuery.matches || event.pointerType !== "mouse") {
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) {
        frame = window.requestAnimationFrame(updateProximity);
      }
    };

    const handleMediaChange = () => {
      if (!mediaQuery.matches) {
        pointerX = -1000;
        pointerY = -1000;
        setNearestIndex(null);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      mediaQuery.removeEventListener("change", handleMediaChange);
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
          className={`v2-zone-rail__item ${activeId === zone.id ? "is-active" : ""}${nearestIndex === index ? " is-nearest" : ""}${nearestIndex !== null && Math.abs(nearestIndex - index) === 1 ? " is-neighbour" : ""}`}
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
