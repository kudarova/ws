import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import type { Zone } from "./ZoneRail";

type TopNavigationProps = {
  zones: Zone[];
  activeId: string;
  projectsUrl: string;
};

function TopNavigation({ zones, activeId, projectsUrl }: TopNavigationProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="v2-top-navigation">
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
          <a className="v2-top-navigation__projects" href={projectsUrl} onClick={() => setOpen(false)}>
            Наши проекты <Icon name="arrow-up-right" className="v2-icon" />
          </a>
        </nav>
      )}
    </div>
  );
}

export default TopNavigation;
