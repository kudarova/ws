import type { CSSProperties } from "react";

const faces = [
  { letter: "К", position: "front" },
  { letter: "У", position: "top" },
  { letter: "Б", position: "right" },
  { letter: "И", position: "bottom" },
  { letter: "Т", position: "left" },
  { letter: "X", position: "back" },
];

function HeroCube() {
  return (
    <div className="v2-cube" role="img" aria-label="Прозрачный куб с буквами К, У, Б, И, Т, X на шести гранях">
      <div className="v2-cube__look" aria-hidden="true">
        {faces.map((face, index) => (
          <div className={`v2-cube__face v2-cube__face--${face.position}`} key={face.letter}>
            <span
              className="v2-cube__letter"
              style={{ "--letter-delay": `${index * 2}s` } as CSSProperties}
            >
              {face.letter}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroCube;
