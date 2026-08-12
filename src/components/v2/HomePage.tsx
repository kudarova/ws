import { useEffect, useRef, useState, type CSSProperties } from "react";
import { capabilities } from "../../data/capabilities";
import HeroCube from "./HeroCube";
import AccentPicker from "./AccentPicker";
import Icon from "./Icon";
import QuantumCanvas, { type QuantumCanvasPalette } from "./QuantumCanvas";
import QuantumNetworkVisual from "./QuantumNetworkVisual";
import ServiceDeck from "./ServiceDeck";
import TopNavigation from "./TopNavigation";
import ZoneRail, { type Zone } from "./ZoneRail";
import useMediaQuery from "./useMediaQuery";
import "./HomePage.scss";

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
    },
  },
];

const accentStorageKey = "kubiteks-accent";
function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function HomePage() {
  const servicesExperienceRef = useRef<HTMLDivElement>(null);
  const floatingBrandRef = useRef<HTMLAnchorElement>(null);
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
  const compactMotion = useMediaQuery("(max-width: 900px)");
  const activeCapability = capabilities[activeServiceIndex] ?? capabilities[0];
  const activePalette = accentPalettes.find(({ id }) => id === accentId) ?? accentPalettes[0];
  const projectsUrl = import.meta.env.VITE_PROJECTS_URL || "#v2-results";

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
    const zoneTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-zone]"));
    const floatingCube = floatingCubeRef.current;

    const setInView = (target: HTMLElement, inView: boolean) => {
      const value = inView ? "true" : "false";
      target.dataset.inView = value;

      if (target.id === "v2-top" && floatingCube) {
        floatingCube.dataset.inView = value;
      }
    };

    if (!("IntersectionObserver" in window)) {
      zoneTargets.forEach((target) => setInView(target, true));

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.target as HTMLElement, entry.isIntersecting);
        });
      },
      { rootMargin: "20% 0px 20% 0px", threshold: 0.01 },
    );

    zoneTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const brand = floatingBrandRef.current;
    const cube = floatingCubeRef.current;
    const brandAnchor = heroBrandAnchorRef.current;
    const cubeAnchor = heroCubeAnchorRef.current;
    if (!brand || !cube || !brandAnchor || !cubeAnchor) {
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
      const stickyInset = isMobile ? 16 : 22;
      const stickyBrandTop = Math.max(stickyInset, startBrandTop - window.scrollY);
      const brandPinnedScrollY = Math.max(0, startBrandTop - stickyInset);
      const transitionDistance = clamp(viewportHeight * 0.12, 96, 150);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = reducedMotion
        ? (window.scrollY >= brandPinnedScrollY ? 1 : 0)
        : clamp((window.scrollY - brandPinnedScrollY) / transitionDistance, 0, 1);
      const isCompact = progress >= 0.5;
      const compactLeft = isMobile ? 16 : Math.max(16, stickyBrandLeft);
      const brandOpacity = isCompact ? (progress - 0.5) * 2 : 1 - progress * 2;

      brand.style.fontSize = `${isCompact ? startBrandSize * 0.5 : startBrandSize}px`;
      brand.style.letterSpacing = "-0.075em";
      brand.style.opacity = brandOpacity.toFixed(3);
      brand.style.transform = `translate3d(${isCompact ? compactLeft : stickyBrandLeft}px, ${isCompact ? stickyInset : stickyBrandTop}px, 0)`;

      const cubeOuterSize = 346.667;
      const startCubeScale = isMobile ? 0.64 : isStacked ? 0.8 : 1;
      const startCubeLeft = cubeAnchorRect.left + (cubeAnchorRect.width - cubeOuterSize * startCubeScale) / 2;
      const startCubeTop = cubeAnchorRect.top + window.scrollY + (cubeAnchorRect.height - cubeOuterSize * startCubeScale) / 2;
      cube.style.opacity = "1";
      cube.style.pointerEvents = "auto";
      cube.style.transform = `translate3d(${startCubeLeft}px, ${startCubeTop - window.scrollY}px, 0px) scale(${startCubeScale})`;
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
    if (!experience || compactMotion) {
      setServiceProgress(activeServiceIndex);
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
  }, [compactMotion]);

  const moveToService = (index: number) => {
    if (compactMotion) {
      setActiveServiceIndex((current) => (current === index ? current : index));
      setServiceProgress(index);
      return;
    }

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
      <a
        ref={floatingCubeRef}
        className="v2-floating-cube"
        href="#v2-top"
        aria-label="Кубитэкс — перейти в начало"
      >
        <HeroCube active={activeZone === "v2-top"} />
      </a>

      <ZoneRail zones={zones} activeId={activeZone} />

      <header className="v2-topbar">
        <TopNavigation zones={zones} activeId={activeZone} />
        <div className="v2-topbar__actions">
          <AccentPicker palettes={accentPalettes} value={accentId} onChange={(id) => setAccentId(id as AccentId)} />
          <a className="v2-topbar__projects" href={projectsUrl}>
            Наши проекты <Icon name="arrow-up-right" className="v2-icon" />
          </a>
          <a className="v2-topbar__contact" href="#v2-contact">
            Обсудить проект <Icon name="arrow-up-right" className="v2-icon" />
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
                  Обсудить проект <Icon name="arrow-up-right" className="v2-icon" />
                </a>
                <a className="v2-action v2-action--quiet" href="#v2-services">
                  Смотреть услуги <Icon name="arrow-down" className="v2-icon" />
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
            <nav className="v2-service-quick-links" aria-label="Быстрый переход по направлениям">
              {capabilities.map((capability, index) => (
                <button type="button" key={capability.id} onClick={() => moveToService(index)}>
                  {capability.title}
                </button>
              ))}
            </nav>
          </div>

          <div
            ref={servicesExperienceRef}
            className="v2-services__experience"
            style={compactMotion ? undefined : { height: servicesHeight }}
          >
            <div className="v2-services__sticky">
              <div className="v2-shell v2-services__stage">
                <ServiceDeck capabilities={capabilities} activeIndex={activeServiceIndex} progress={serviceProgress} mobile={compactMotion} onSelect={moveToService} />

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
                      Обсудить задачу <Icon name="arrow-up-right" className="v2-icon" />
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
                  <span className="v2-result-card__number">0{index + 1}</span>
                  <div>
                    <h3>{outcome.title}</h3>
                    <p>{outcome.description}</p>
                  </div>
                </article>
              ))}
              <QuantumNetworkVisual />
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
              <Icon name="mail" className="v2-contact__icon" />
              <span className="v2-contact__content">
                <span>Почта</span>
                <strong>kubiteks@mail.ru</strong>
              </span>
              <Icon name="arrow-up-right" className="v2-contact__arrow" />
            </a>
            <a href="tel:+79493276561">
              <Icon name="phone" className="v2-contact__icon" />
              <span className="v2-contact__content">
                <span>Телефон</span>
                <strong>+7 (949) 327-65-61</strong>
              </span>
              <Icon name="arrow-up-right" className="v2-contact__arrow" />
            </a>
          </div>

          <div className="v2-contact__bottom">
            <span>© 2026 КУБИТЭКС</span>
            <a href="https://kubitex.ru"><Icon name="globe" className="v2-icon" /> kubitex.ru</a>
            <a href="#v2-top">Наверх <Icon name="arrow-up" className="v2-icon" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
