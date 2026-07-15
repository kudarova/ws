import { useEffect, useRef, useState, type CSSProperties } from "react";
import { capabilities } from "../../data/capabilities";
import HeroCube from "./HeroCube";
import QuantumCanvas, { type QuantumCanvasPalette } from "./QuantumCanvas";
import QuantumNetworkVisual from "./QuantumNetworkVisual";
import ServiceVisual from "./ServiceVisual";
import ZoneRail, { type Zone } from "./ZoneRail";
import "./NewVersionPage.scss";

const zones: Zone[] = [
  { id: "v2-top", label: "Начало" },
  { id: "v2-services", label: "Услуги" },
  { id: "v2-method", label: "Подход" },
  { id: "v2-results", label: "Результат" },
  { id: "v2-contact", label: "Контакты" },
];

const facts = [
  "Работаем с ИИ",
  "Создаём цифровые продукты",
  "Полный цикл разработки",
  "Всегда на связи",
  "Интегрируем сложные системы",
  "Фокусируемся на результате",
];

const processSteps = [
  {
    title: "Анализ и проектирование",
    description: "Фиксируем бизнес-цель, ограничения и архитектуру будущего решения.",
  },
  {
    title: "Разработка и итерации",
    description: "Показываем промежуточный результат и уточняем продукт по обратной связи.",
  },
  {
    title: "Проверка качества",
    description: "Проверяем функциональность, безопасность и устойчивость под нагрузкой.",
  },
  {
    title: "Запуск и поддержка",
    description: "Вводим продукт в работу, наблюдаем за ним и последовательно развиваем.",
  },
];

const outcomes = [
  {
    title: "Запускаем новые продукты",
    description: "Проверяем подход, проектируем и выводим первую работающую версию на рынок.",
    className: "launch",
  },
  {
    title: "Упрощаем ежедневную работу",
    description: "Связываем процессы и системы, чтобы нужная информация всегда была под рукой.",
    className: "process",
  },
  {
    title: "Поддерживаем и развиваем",
    description: "Следим за стабильностью и добавляем возможности по мере роста проекта.",
    className: "support",
  },
];

type AccentId = "verdant" | "quantum" | "azure" | "amber";

type AccentPalette = {
  id: AccentId;
  label: string;
  primary: string;
  secondary: string;
  highlight: string;
  canvas: QuantumCanvasPalette;
};

const accentPalettes: AccentPalette[] = [
  {
    id: "verdant",
    label: "Интенсивный зелёный",
    primary: "#18f2a3",
    secondary: "#00c978",
    highlight: "#caffea",
    canvas: {
      anchor: "#d9eee6",
      staticLine: "rgba(24, 242, 163, 0.17)",
      streakTailRgb: "45, 207, 145",
      streakMidRgb: "151, 237, 201",
      streakHeadRgb: "245, 255, 251",
    },
  },
  {
    id: "quantum",
    label: "Бирюзовый компромисс",
    primary: "#00e7b8",
    secondary: "#00bfea",
    highlight: "#c8fff5",
    canvas: {
      anchor: "#d9ecea",
      staticLine: "rgba(0, 231, 184, 0.17)",
      streakTailRgb: "28, 194, 187",
      streakMidRgb: "139, 229, 224",
      streakHeadRgb: "246, 255, 254",
    },
  },
  {
    id: "azure",
    label: "Интенсивный синий",
    primary: "#22c9ff",
    secondary: "#3568ff",
    highlight: "#d4f6ff",
    canvas: {
      anchor: "#dce9ed",
      staticLine: "rgba(34, 201, 255, 0.17)",
      streakTailRgb: "61, 157, 226",
      streakMidRgb: "155, 211, 244",
      streakHeadRgb: "249, 252, 253",
    },
  },
  {
    id: "amber",
    label: "Янтарно-оранжевый",
    primary: "#f4c65e",
    secondary: "#eb764b",
    highlight: "#fff1c8",
    canvas: {
      anchor: "#ebe6dc",
      staticLine: "rgba(244, 198, 94, 0.13)",
      streakTailRgb: "190, 151, 100",
      streakMidRgb: "228, 208, 174",
      streakHeadRgb: "253, 251, 247",
    },
  },
];

const accentStorageKey = "kubiteks-v2-accent";
const enableCompactCubeRelocation = false;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function NewVersionPage() {
  const servicesExperienceRef = useRef<HTMLDivElement>(null);
  const floatingBrandRef = useRef<HTMLAnchorElement>(null);
  const brandShieldRef = useRef<HTMLDivElement>(null);
  const floatingCubeRef = useRef<HTMLAnchorElement>(null);
  const heroBrandAnchorRef = useRef<HTMLSpanElement>(null);
  const heroCubeAnchorRef = useRef<HTMLDivElement>(null);
  const [accentId, setAccentId] = useState<AccentId>(() => {
    try {
      const storedAccent = window.localStorage.getItem(accentStorageKey);
      return accentPalettes.some(({ id }) => id === storedAccent)
        ? (storedAccent as AccentId)
        : "quantum";
    } catch {
      return "quantum";
    }
  });
  const [activeZone, setActiveZone] = useState(zones[0].id);
  const [serviceProgress, setServiceProgress] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const activeCapability = capabilities[activeServiceIndex] ?? capabilities[0];
  const activePalette = accentPalettes.find(({ id }) => id === accentId) ?? accentPalettes[0];
  const projectsUrl = import.meta.env.VITE_PROJECTS_URL || "./#cases";

  useEffect(() => {
    try {
      window.localStorage.setItem(accentStorageKey, accentId);
    } catch {
      // The selected mood still works when browser storage is unavailable.
    }
  }, [accentId]);

  useEffect(() => {
    let frame = 0;

    const updateActiveZone = () => {
      frame = 0;
      const viewportTarget = window.innerHeight * 0.46;
      let nearestId = zones[0].id;
      let nearestDistance = Number.POSITIVE_INFINITY;

      zones.forEach((zone) => {
        const section = document.getElementById(zone.id);
        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const sectionTarget = clamp(viewportTarget, rect.top, rect.bottom);
        const distance = Math.abs(sectionTarget - viewportTarget);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestId = zone.id;
        }
      });

      setActiveZone((current) => (current === nearestId ? current : nearestId));
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateActiveZone);
      }
    };

    updateActiveZone();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const brand = floatingBrandRef.current;
    const brandShield = brandShieldRef.current;
    const cube = floatingCubeRef.current;
    const brandAnchor = heroBrandAnchorRef.current;
    const cubeAnchor = heroCubeAnchorRef.current;
    if (!brand || !brandShield || !cube || !brandAnchor || !cubeAnchor) {
      return;
    }

    let frame = 0;

    const updateBrandLockup = () => {
      frame = 0;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth <= 640;
      const isStacked = viewportWidth <= 900;
      const brandAnchorRect = brandAnchor.getBoundingClientRect();
      const cubeAnchorRect = cubeAnchor.getBoundingClientRect();
      const startBrandSize = isMobile
        ? clamp(viewportWidth * 0.16, 56, 82)
        : isStacked
          ? clamp(viewportWidth * 0.105, 68, 88)
          : clamp(viewportWidth * 0.072, 76, 112);
      const startBrandTop = brandAnchorRect.top + window.scrollY;
      const sharedContentLeft = brandAnchor.closest(".v2-shell")?.getBoundingClientRect().left
        ?? brandAnchorRect.left;
      const stickyBrandLeft = sharedContentLeft - 5;
      const stickyInset = isStacked ? clamp(viewportHeight * 0.12, 48, 96) : 54.84;
      const stickyBrandTop = Math.max(stickyInset, startBrandTop - window.scrollY);

      brand.style.fontSize = `${startBrandSize}px`;
      brand.style.letterSpacing = "-0.075em";
      brand.style.transform = `translate3d(${stickyBrandLeft}px, ${stickyBrandTop}px, 0px)`;
      const brandLineHeight = brand.getBoundingClientRect().height;

      const brandPinnedScrollY = Math.max(0, startBrandTop - stickyInset);
      const shieldDistance = clamp(viewportHeight * 0.2, 150, 230);
      const shieldProgress = clamp((window.scrollY - brandPinnedScrollY) / shieldDistance, 0, 1);
      const easedShieldProgress = shieldProgress * shieldProgress * (3 - 2 * shieldProgress);
      const brandWidth = brand.getBoundingClientRect().width;
      const shieldCenterX = stickyBrandLeft + brandWidth / 2;
      const shieldCenterY = stickyBrandTop + brandLineHeight / 2;
      const shieldRadiusX = brandWidth * 0.62 + (isMobile ? 24 : 40);
      const shieldRadiusY = brandLineHeight * 0.9 + 18;

      brandShield.style.setProperty("--v2-shield-center-x", `${shieldCenterX}px`);
      brandShield.style.setProperty("--v2-shield-center-y", `${shieldCenterY}px`);
      brandShield.style.setProperty("--v2-shield-radius-x", `${shieldRadiusX}px`);
      brandShield.style.setProperty("--v2-shield-radius-y", `${shieldRadiusY}px`);
      brandShield.style.opacity = easedShieldProgress.toFixed(3);

      const cubeOuterSize = 346.667;
      const cubeInnerMargin = 43.333;
      const startCubeScale = isMobile ? 0.64 : isStacked ? 0.8 : 1;
      const startCubeLeft = cubeAnchorRect.left + (cubeAnchorRect.width - cubeOuterSize * startCubeScale) / 2;
      const startCubeTop = cubeAnchorRect.top + window.scrollY + (cubeAnchorRect.height - cubeOuterSize * startCubeScale) / 2;
      const targetCubeToBrandRatio = 0.352856;
      const compactCubeScaleMultiplier = 1.4;
      const baseTargetCubeScale = clamp(
        (startBrandSize * targetCubeToBrandRatio) / 260,
        isMobile ? 0.055 : 0.075,
        0.13,
      );
      const targetCubeScale = baseTargetCubeScale * compactCubeScaleMultiplier;
      const targetGap = (isMobile ? 8 : isStacked ? 16 : 24) * compactCubeScaleMultiplier;
      const targetCubeBodySize = 260 * targetCubeScale;
      const cubeOpticalLift = clamp(brandLineHeight * 0.1, 4, 9);
      const targetCubeLeft = stickyBrandLeft
        - targetGap
        - targetCubeBodySize
        - cubeInnerMargin * targetCubeScale;
      const targetCubeTop = stickyBrandTop
        + (brandLineHeight - targetCubeBodySize) / 2
        - cubeInnerMargin * targetCubeScale
        - cubeOpticalLift;
      const cubeCenterScrollY = startCubeTop + (cubeOuterSize * startCubeScale) / 2;
      const relocationStartScrollY = Math.max(cubeCenterScrollY, brandPinnedScrollY);
      const transitionDistance = clamp(viewportHeight * 0.17, 120, 180);
      const sequenceProgress = clamp(
        (window.scrollY - relocationStartScrollY) / transitionDistance,
        0,
        1,
      );

      if (!enableCompactCubeRelocation) {
        cube.classList.remove("is-compact");
        cube.style.opacity = "1";
        cube.style.pointerEvents = "auto";
        cube.style.transform = `translate3d(${startCubeLeft}px, ${startCubeTop - window.scrollY}px, 0px) scale(${startCubeScale})`;
        return;
      }

      const isRelocated = sequenceProgress >= 0.5;
      const phaseProgress = isRelocated
        ? (sequenceProgress - 0.5) * 2
        : sequenceProgress * 2;
      const easedPhase = phaseProgress * phaseProgress * (3 - 2 * phaseProgress);
      const cubeOpacity = isRelocated ? easedPhase : 1 - easedPhase;
      const cubeLeft = isRelocated ? targetCubeLeft : startCubeLeft;
      const cubeTop = isRelocated ? targetCubeTop : startCubeTop;
      const cubeScale = isRelocated ? targetCubeScale : startCubeScale;

      cube.classList.toggle("is-compact", isRelocated);
      cube.style.opacity = cubeOpacity.toFixed(3);
      cube.style.pointerEvents = cubeOpacity < 0.05 ? "none" : "auto";
      cube.style.transform = `translate3d(${cubeLeft}px, ${cubeTop}px, 0px) scale(${cubeScale})`;
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateBrandLockup);
      }
    };

    updateBrandLockup();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    const experience = servicesExperienceRef.current;
    if (!experience) {
      return;
    }

    let frame = 0;

    const updateServiceProgress = () => {
      frame = 0;
      const rect = experience.getBoundingClientRect();
      const scrollableDistance = Math.max(1, rect.height - window.innerHeight);
      const normalizedProgress = clamp(-rect.top / scrollableDistance, 0, 1);
      const nextProgress = normalizedProgress * (capabilities.length - 1);
      const nextIndex = clamp(Math.round(nextProgress), 0, capabilities.length - 1);

      setServiceProgress((current) =>
        Math.abs(current - nextProgress) > 0.001 ? nextProgress : current,
      );
      setActiveServiceIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateServiceProgress);
      }
    };

    updateServiceProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const moveToService = (index: number) => {
    const experience = servicesExperienceRef.current;
    if (!experience) {
      return;
    }

    const rect = experience.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = Math.max(1, experience.offsetHeight - window.innerHeight);
    const serviceRatio = index / Math.max(1, capabilities.length - 1);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: sectionTop + scrollableDistance * serviceRatio,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const getServiceCardStyle = (index: number): CSSProperties => {
    const relativePosition = index - serviceProgress;
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

  const servicesHeight = `${100 + (capabilities.length - 1) * 72}svh`;
  const accentStyle = {
    "--v2-accent-a": activePalette.primary,
    "--v2-accent-b": activePalette.secondary,
    "--v2-accent-highlight": activePalette.highlight,
  } as CSSProperties;

  return (
    <div className="v2-page" data-accent={accentId} style={accentStyle}>
      <QuantumCanvas palette={activePalette.canvas} />

      <div className="v2-atmosphere" aria-hidden="true">
        <span className="v2-atmosphere__shape v2-atmosphere__shape--one" />
        <span className="v2-atmosphere__shape v2-atmosphere__shape--two" />
        <span className="v2-atmosphere__shape v2-atmosphere__shape--three" />
        <span className="v2-atmosphere__ray" />
      </div>

      <a
        ref={floatingBrandRef}
        className="v2-floating-brand"
        href="#v2-top"
        aria-label="Кубитэкс — перейти в начало"
      >
        КУБИТЭКС
      </a>
      <div ref={brandShieldRef} className="v2-brand-shield" aria-hidden="true" />
      <a
        ref={floatingCubeRef}
        className="v2-floating-cube"
        href="#v2-top"
        aria-label="Кубитэкс — перейти в начало"
      >
        <HeroCube />
      </a>

      <ZoneRail zones={zones} activeId={activeZone} />

      <header className="v2-topbar">
        <div className="v2-topbar__actions">
          <div className="v2-accent-picker" role="group" aria-label="Цветовое настроение сайта">
            {accentPalettes.map((palette) => (
              <button
                className="v2-accent-picker__swatch"
                type="button"
                key={palette.id}
                title={palette.label}
                aria-label={palette.label}
                aria-pressed={palette.id === accentId}
                style={{
                  "--v2-swatch-a": palette.primary,
                  "--v2-swatch-b": palette.secondary,
                } as CSSProperties}
                onClick={() => setAccentId(palette.id)}
              />
            ))}
          </div>
          <a className="v2-topbar__projects" href={projectsUrl}>
            Наши проекты <span aria-hidden="true">↗</span>
          </a>
          <a className="v2-topbar__contact" href="#v2-contact">
            Обсудить проект <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main>
        <section className="v2-hero" id="v2-top" data-zone>
          <div className="v2-shell v2-hero__layout">
            <div className="v2-hero__copy">
              <p className="v2-eyebrow">Цифровые продукты для бизнеса</p>
              <h1>
                <span ref={heroBrandAnchorRef} className="v2-hero__brand-space" aria-hidden="true" />
                <span className="v2-hero__claim">Превращаем неопределённость в работающий продукт</span>
              </h1>
              <p className="v2-hero__summary">
                Проектируем сайты, сервисы и ИИ-решения, которые соединяют задачу бизнеса с понятным результатом.
              </p>
              <div className="v2-hero__actions">
                <a className="v2-action v2-action--primary" href="#v2-contact">
                  Обсудить проект <span aria-hidden="true">↗</span>
                </a>
                <a className="v2-action v2-action--quiet" href="#v2-services">
                  Смотреть услуги <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div ref={heroCubeAnchorRef} className="v2-hero__visual" aria-hidden="true" />
          </div>

          <div className="v2-shell v2-facts" aria-label="Коротко о Кубитэкс">
            {facts.map((fact, index) => (
              <span key={fact}>
                <i>0{index + 1}</i>
                {fact}
              </span>
            ))}
          </div>
        </section>

        <section className="v2-services" id="v2-services" data-zone>
          <div className="v2-shell v2-section-intro">
            <p className="v2-eyebrow">Что создаём</p>
            <h2>Технология следует за задачей</h2>
            <p>
              Восемь направлений — от первого интерфейса до сложной системы, которая выдерживает рост.
            </p>
          </div>

          <div
            ref={servicesExperienceRef}
            className="v2-services__experience"
            style={{ height: servicesHeight }}
          >
            <div className="v2-services__sticky">
              <div className="v2-shell v2-services__stage">
                <div className="v2-service-deck" aria-label="Направления разработки">
                  <div className="v2-service-deck__guide" aria-hidden="true">
                    <span>Прокрутите</span>
                    <i />
                    <strong>0{activeServiceIndex + 1}</strong>
                    <small>/ 08</small>
                  </div>

                  <div className="v2-service-deck__cards">
                    {capabilities.map((capability, index) => (
                      <button
                        className={`v2-service-card ${index === activeServiceIndex ? "is-active" : ""}`}
                        type="button"
                        key={capability.id}
                        style={getServiceCardStyle(index)}
                        onClick={() => moveToService(index)}
                        tabIndex={Math.abs(index - activeServiceIndex) <= 1 ? 0 : -1}
                        aria-label={`${index + 1}. ${capability.title}`}
                        aria-current={index === activeServiceIndex ? "step" : undefined}
                      >
                        <ServiceVisual id={capability.id} />
                        <span className="v2-service-card__number">0{index + 1}</span>
                        <span className="v2-service-card__copy">
                          <strong>{capability.title}</strong>
                          <small>{capability.teaser}</small>
                        </span>
                        <span className="v2-service-card__corner" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>

                <article className="v2-service-detail" aria-live="polite">
                  <div className="v2-service-detail__content" key={activeCapability.id}>
                    <div className="v2-service-detail__head">
                      <span>Направление · 0{activeServiceIndex + 1}</span>
                      <i aria-hidden="true" />
                    </div>
                    <p className="v2-service-detail__teaser">{activeCapability.teaser}</p>
                    <h3>{activeCapability.title}</h3>
                    <p className="v2-service-detail__description">{activeCapability.description}</p>

                    <div className="v2-service-detail__results">
                      <span>Что меняется</span>
                      <ul>
                        {activeCapability.results.map((result) => (
                          <li key={result}>{result}</li>
                        ))}
                      </ul>
                    </div>

                    <dl className="v2-service-detail__meta">
                      <div>
                        <dt>Форматы</dt>
                        <dd>{activeCapability.examples.join(" · ")}</dd>
                      </div>
                      <div>
                        <dt>Среда</dt>
                        <dd>{activeCapability.technologies}</dd>
                      </div>
                    </dl>

                    <a className="v2-text-link" href="#v2-contact">
                      Обсудить задачу <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="v2-method" id="v2-method" data-zone>
          <div className="v2-section-line" aria-hidden="true" />
          <div className="v2-shell v2-method__layout">
            <div className="v2-method__copy">
              <p className="v2-eyebrow">Как работаем</p>
              <h2>Сначала понимаем задачу<br />Потом выбираем технологию</h2>
              <p>
                Начинаем с целей заказчика и будущих пользователей. Не усложняем решение ради стека и остаёмся рядом после запуска.
              </p>
            </div>

            <ol className="v2-method__steps">
              {processSteps.map((step, index) => (
                <li key={step.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="v2-results" id="v2-results" data-zone>
          <div className="v2-section-line" aria-hidden="true" />
          <div className="v2-shell">
            <div className="v2-results__heading">
              <p className="v2-eyebrow">Результат для бизнеса</p>
              <h2>Не просто разрабатываем — снимаем неопределённость</h2>
            </div>

            <div className="v2-results__grid">
              {outcomes.map((outcome, index) => (
                <article className={`v2-result-card v2-result-card--${outcome.className}`} key={outcome.title}>
                  {outcome.className === "launch" && <QuantumNetworkVisual />}
                  <span className="v2-result-card__number">0{index + 1}</span>
                  <div>
                    <h3>{outcome.title}</h3>
                    <p>{outcome.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="v2-contact" id="v2-contact" data-zone>
        <div className="v2-section-line" aria-hidden="true" />
        <div className="v2-shell v2-contact__panel">
          <div className="v2-contact__heading">
            <p className="v2-eyebrow">Контакты</p>
            <h2>Есть задача?<br />Давайте разберём</h2>
            <p>Опишите идею или проблему — ответим по существу и предложим следующий шаг.</p>
          </div>

          <div className="v2-contact__links">
            <a href="mailto:kubiteks@mail.ru">
              <span>Почта</span>
              <strong>kubiteks@mail.ru</strong>
              <i aria-hidden="true">↗</i>
            </a>
            <a href="https://t.me/cubitex_dev">
              <span>Telegram</span>
              <strong>@cubitex_dev</strong>
              <i aria-hidden="true">↗</i>
            </a>
            <a href="tel:+79493276561">
              <span>Телефон</span>
              <strong>+7 (949) 327-65-61</strong>
              <i aria-hidden="true">↗</i>
            </a>
          </div>

          <div className="v2-contact__bottom">
            <span>© 2026 КУБИТЭКС</span>
            <a href="https://kubiteks.ru">kubiteks.ru</a>
            <a href="#v2-top">Наверх ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NewVersionPage;
