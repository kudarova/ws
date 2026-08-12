import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Icon from "./Icon";

type AccentPaletteOption = {
  id: string;
  label: string;
  primary: string;
  secondary: string;
};

type AccentPickerProps = {
  palettes: AccentPaletteOption[];
  value: string;
  onChange: (id: string) => void;
};

function AccentPicker({ palettes, value, onChange }: AccentPickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();
  const selected = palettes.find((palette) => palette.id === value) ?? palettes[0];

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  const focusOption = (index: number) => {
    const nextIndex = (index + palettes.length) % palettes.length;
    optionRefs.current[nextIndex]?.focus();
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index + (event.key === "ArrowDown" ? 1 : -1));
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  };

  return (
    <div ref={rootRef} className="v2-accent-picker">
      <button
        ref={triggerRef}
        className="v2-accent-picker__trigger"
        type="button"
        aria-controls={panelId}
        aria-expanded={open}
        aria-label="Выбрать цветовое настроение сайта"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            close(true);
          }
        }}
      >
        <span
          className="v2-accent-picker__current-swatch"
          style={{ "--v2-swatch-a": selected.primary, "--v2-swatch-b": selected.secondary } as CSSProperties}
        />
        <span className="v2-accent-picker__label">{selected.label}</span>
        <Icon name="chevron-down" className="v2-icon" />
      </button>
      {open && (
        <div id={panelId} className="v2-accent-picker__panel" role="group" aria-label="Варианты палитры">
          {palettes.map((palette, index) => (
            <button
              ref={(element) => { optionRefs.current[index] = element; }}
              className="v2-accent-picker__option"
              type="button"
              key={palette.id}
              aria-pressed={palette.id === value}
              onClick={() => {
                onChange(palette.id);
                close(true);
              }}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              <span
                className="v2-accent-picker__option-swatch"
                style={{ "--v2-swatch-a": palette.primary, "--v2-swatch-b": palette.secondary } as CSSProperties}
              />
              <span>{palette.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AccentPicker;
