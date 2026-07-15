import { useEffect, useState, type CSSProperties } from "react";
import { capabilities, type Capability } from "../data/capabilities";

function getColumnCount() {
  if (window.matchMedia("(max-width: 640px)").matches) {
    return 1;
  }

  if (window.matchMedia("(max-width: 980px)").matches) {
    return 2;
  }

  return 3;
}

function useColumnCount() {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const tabletQuery = window.matchMedia("(max-width: 980px)");
    const updateColumnCount = () => setColumnCount(getColumnCount());

    updateColumnCount();
    mobileQuery.addEventListener("change", updateColumnCount);
    tabletQuery.addEventListener("change", updateColumnCount);

    return () => {
      mobileQuery.removeEventListener("change", updateColumnCount);
      tabletQuery.removeEventListener("change", updateColumnCount);
    };
  }, []);

  return columnCount;
}

function splitIntoRows(items: Capability[], columnCount: number) {
  const rows: Capability[][] = [];

  for (let index = 0; index < items.length; index += columnCount) {
    rows.push(items.slice(index, index + columnCount));
  }

  return rows;
}

function PartnersSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const columnCount = useColumnCount();
  const rows = splitIntoRows(capabilities, columnCount);
  const rowStyle = { "--capability-columns": columnCount } as CSSProperties;

  return (
    <section className="section capabilities" id="capabilities">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="section-label">Наши возможности</p>
            <h2>Что мы можем создать для вашего бизнеса</h2>
          </div>
          <p className="section-summary">
            Выберите направление, чтобы узнать, какую задачу оно решает и что
            получит ваша компания.
          </p>
        </div>

        <div className="capabilities__matrix">
          {rows.map((row, rowIndex) => {
            const activeCapability = row.find(({ id }) => id === activeId);
            const isExpanded = Boolean(activeCapability);

            return (
              <div
                className={`capability-row${isExpanded ? " capability-row--expanded" : ""}`}
                key={row.map(({ id }) => id).join("-")}
              >
                <div className="capability-row__cards" style={rowStyle}>
                  {row.map((capability, cellIndex) => {
                    const capabilityIndex = rowIndex * columnCount + cellIndex;
                    const isActive = capability.id === activeId;

                    return (
                      <button
                        className={`capability-card${isActive ? " capability-card--active" : ""}`}
                        type="button"
                        key={capability.id}
                        aria-expanded={isActive}
                        aria-controls={`capability-detail-${capability.id}`}
                        onClick={() =>
                          setActiveId(isActive ? null : capability.id)
                        }
                      >
                        <span className="capability-card__number">
                          {String(capabilityIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="capability-card__body">
                          <strong>{capability.title}</strong>
                          <span>{capability.teaser}</span>
                        </span>
                        <span
                          className="capability-card__toggle"
                          aria-hidden="true"
                        >
                          {isActive ? "−" : "+"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeCapability && (
                  <article
                    className="capability-detail"
                    id={`capability-detail-${activeCapability.id}`}
                  >
                    <div className="capability-detail__intro">
                      <p className="section-label">Подробнее</p>
                      <h3>{activeCapability.title}</h3>
                      <p>{activeCapability.description}</p>
                      <a href="#apply">Обсудить задачу →</a>
                    </div>

                    <div className="capability-detail__column">
                      <span>Что вы получите</span>
                      <ul>
                        {activeCapability.results.map((result) => (
                          <li key={result}>{result}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="capability-detail__column">
                      <span>Примеры</span>
                      <div className="capability-detail__tags">
                        {activeCapability.examples.map((example) => (
                          <span key={example}>{example}</span>
                        ))}
                      </div>
                      <p className="capability-detail__tech">
                        <strong>Технологии:</strong>{" "}
                        {activeCapability.technologies}
                      </p>
                    </div>
                  </article>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;
