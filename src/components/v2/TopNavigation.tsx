import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import type { Zone } from "./ZoneRail";

type TopNavigationProps = {
  zones: Zone[];
  activeId: string;
};

function TopNavigation({ zones, activeId }: TopNavigationProps) {
  const navigationRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1181px) and (hover: hover) and (pointer: fine)");
    let frame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    const updateProximity = () => {
      frame = 0;
      navigationRef.current
        ?.querySelectorAll<HTMLElement>(".v2-top-navigation__item")
        .forEach((item) => {
          const rect = item.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.hypot(pointerX - centerX, pointerY - centerY);
          const proximity = Math.max(0, 1 - distance / 150);
          const restingOpacity = item.classList.contains("is-active") ? 0.54 : 0.08;

          item.style.setProperty("--top-nav-stretch", (1 + proximity * 1.35).toFixed(3));
          item.style.setProperty("--top-nav-shadow-height", `${1 + proximity * 2}px`);
          item.style.setProperty(
            "--top-nav-shadow-opacity",
            (restingOpacity + proximity * (1 - restingOpacity)).toFixed(3),
          );
        });
    };

    const resetProximity = () => {
      pointerX = -1000;
      pointerY = -1000;
      updateProximity();
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

    const handlePointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
      if (!frame) {
        frame = window.requestAnimationFrame(updateProximity);
      }
    };

    const handleMediaChange = () => {
      if (!mediaQuery.matches) {
        resetProximity();
      }
    };

    if (mediaQuery.matches) {
      updateProximity();
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [activeId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1181px)");
    const closeOnWide = () => {
      if (mediaQuery.matches) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    closeOnWide();
    mediaQuery.addEventListener("change", closeOnWide);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      mediaQuery.removeEventListener("change", closeOnWide);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="v2-top-navigation">
      <nav ref={navigationRef} className="v2-top-navigation__inline" aria-label="Основная навигация">
        {zones.map((zone) => (
          <a className={`v2-top-navigation__item ${activeId === zone.id ? "is-active" : ""}`} href={`#${zone.id}`} key={zone.id} aria-current={activeId === zone.id ? "location" : undefined}>
            {zone.label}
          </a>
        ))}
      </nav>
      <button ref={triggerRef} className="v2-top-navigation__trigger" type="button" aria-expanded={open} aria-controls="v2-top-navigation-menu" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen((current) => !current)}>
        <Icon name={open ? "close" : "menu"} className="v2-icon" />
      </button>
      {open && (
        <nav id="v2-top-navigation-menu" className="v2-top-navigation__panel" aria-label="Основная навигация">
          {zones.map((zone) => (
            <a className={activeId === zone.id ? "is-active" : ""} href={`#${zone.id}`} key={zone.id} aria-current={activeId === zone.id ? "location" : undefined} onClick={() => setOpen(false)}>
              {zone.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}

export default TopNavigation;
