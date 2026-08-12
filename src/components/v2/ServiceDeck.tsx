import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Capability } from "../../data/capabilities";
import ServiceVisual from "./ServiceVisual";

type ServiceDeckProps = {
  capabilities: Capability[];
  activeIndex: number;
  progress: number;
  mobile: boolean;
  onSelect: (index: number) => void;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startedAt: number;
  locked: boolean;
};

const normalizeIndex = (index: number, length: number) => (index + length) % length;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function ServiceDeck({ capabilities, activeIndex, progress, mobile, onSelect }: ServiceDeckProps) {
  const [dragX, setDragX] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitioning, setTransitioning] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const length = capabilities.length;

  if (length === 0) {
    return null;
  }

  const desktopIndices = length < 3
    ? capabilities.map((_, index) => index)
    : Array.from({ length: 3 }, (_, offset) => clamp(activeIndex - 1, 0, length - 3) + offset);
  const neighbourIndex = normalizeIndex(activeIndex + direction, length);
  const renderIndices = mobile ? [activeIndex, neighbourIndex] : desktopIndices;

  const getDesktopStyle = (index: number): CSSProperties => {
    const relativePosition = index - progress;
    let translate = 0;
    let scale = 1;
    let opacity = 1;

    if (relativePosition < 0) {
      const passed = -relativePosition;
      translate = -Math.min(passed, 1.25) * 34;
      scale = 1 - Math.min(passed, 1) * 0.085;
      opacity = clamp(1 - Math.max(0, passed - 0.76) * 3.8, 0, 1);
    } else {
      translate = Math.min(relativePosition, 1.08) * 112;
      const fadeProgress = clamp((1.08 - relativePosition) / 0.34, 0, 1);
      opacity = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
    }

    return {
      zIndex: 20 + index,
      opacity,
      pointerEvents: relativePosition >= -0.55 && relativePosition <= 1.08 ? "auto" : "none",
      transform: `translate3d(0, ${translate}%, 0) scale(${scale})`,
    };
  };

  const cancelDrag = () => {
    dragRef.current = null;
    setDragX(0);
    setDirection(1);
  };

  const commitMobileSelection = () => {
    const nextIndex = normalizeIndex(activeIndex + direction, length);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onSelect(nextIndex);
      cancelDrag();
      return;
    }

    setTransitioning(true);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!mobile || transitioning || event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startedAt: event.timeStamp,
      locked: false,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!mobile || !drag || drag.pointerId !== event.pointerId || transitioning) {
      return;
    }

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.locked) {
      if (Math.abs(dx) <= Math.abs(dy) + 8) {
        return;
      }

      drag.locked = true;
      setDirection(dx < 0 ? 1 : -1);
    }

    event.preventDefault();
    setDragX(dx);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - drag.startX;
    const elapsed = Math.max(1, event.timeStamp - drag.startedAt);
    const velocity = Math.abs(dx) / elapsed;
    const width = viewportRef.current?.clientWidth ?? 0;
    const shouldCommit = !cancelled
      && drag.locked
      && (Math.abs(dx) >= Math.max(48, width * 0.2) || velocity >= 0.45);
    dragRef.current = null;

    if (shouldCommit) {
      commitMobileSelection();
    } else {
      cancelDrag();
    }
  };

  return (
    <div className={`v2-service-deck${mobile ? " is-mobile" : ""}`} aria-label="Направления разработки">
      <div className="v2-service-deck__guide">
        <span>Прокрутите</span>
        <i aria-hidden="true" />
        <strong aria-live="polite">0{activeIndex + 1}</strong>
        <small>/ {String(length).padStart(2, "0")}</small>
      </div>
      {mobile &&
        <div className="v2-service-deck__status" role="group" aria-label="Выбор направления">
          {capabilities.map((capability, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              key={capability.id}
              aria-label={`Направление ${index + 1}: ${capability.title}`}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => !transitioning && onSelect(index)}
            />
          ))}
        </div>
      }
      <div
        ref={viewportRef}
        className={`v2-service-deck__cards${dragX !== 0 && !transitioning ? " is-dragging" : ""}${transitioning ? " is-committing" : ""}${direction === -1 ? " is-previous" : " is-next"}`}
        style={{ "--service-drag-x": `${dragX}px` } as CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={(event) => handlePointerEnd(event, true)}
        onLostPointerCapture={(event) => handlePointerEnd(event, true)}
        onKeyDown={(event) => {
          if (!mobile || transitioning || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
            return;
          }

          event.preventDefault();
          onSelect(normalizeIndex(activeIndex + (event.key === "ArrowRight" ? 1 : -1), length));
        }}
      >
        {renderIndices.map((index, slot) => {
          const capability = capabilities[index];
          const isActive = index === activeIndex;
          const tabIndex = mobile ? (isActive ? 0 : -1) : (isActive || index === activeIndex + 1 ? 0 : -1);
          const cardStyle = mobile
            ? { "--service-slot": slot, zIndex: isActive ? 2 : 1 } as CSSProperties
            : getDesktopStyle(index);

          return (
            <button
              className={`v2-service-card${isActive ? " is-active" : ""}`}
              type="button"
              key={capability.id}
              style={cardStyle}
              onClick={() => !mobile && onSelect(index)}
              onTransitionEnd={(event) => {
                if (event.target === event.currentTarget && mobile && transitioning && isActive) {
                  onSelect(normalizeIndex(activeIndex + direction, length));
                  setTransitioning(false);
                  cancelDrag();
                }
              }}
              tabIndex={tabIndex}
              aria-label={`${index + 1}. ${capability.title}`}
              aria-current={isActive ? "step" : undefined}
            >
              <ServiceVisual id={capability.id} />
              <span className="v2-service-card__number">0{index + 1}</span>
              <span className="v2-service-card__copy">
                <strong>{capability.title}</strong>
                <small>{capability.teaser}</small>
              </span>
              <span className="v2-service-card__corner" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceDeck;
