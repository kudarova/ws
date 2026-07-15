import { useEffect, useState } from "react";
import DigitalCoreVisual from "./DigitalCoreVisual";

const heroPhrases = ["ваш продукт", "ваш рост", "ваше решение"];

function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setPhraseIndex((currentIndex) =>
        currentIndex === heroPhrases.length - 1 ? 0 : currentIndex + 1,
      );
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="hero section">
      <div className="hero__grid" aria-hidden="true"></div>
      <div className="container hero__layout">
        <div className="hero__content">
          <h1 aria-label="Наши знания — ваш продукт, ваш рост, ваше решение">
            <span className="hero__title-line">Наши знания —</span>
            <span className="hero__rotator" aria-hidden="true">
              <span className="hero__rotator-item" key={heroPhrases[phraseIndex]}>
                {heroPhrases[phraseIndex]}
              </span>
            </span>
          </h1>
          <p className="lead">
            Решение цифровых задач для государства и бизнеса
          </p>

          <div className="hero__actions">
            <a className="button button--accent" href="#apply">
              Обсудить проект
            </a>
            <a className="button button--ghost" href="#about">
              О компании
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <DigitalCoreVisual />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
