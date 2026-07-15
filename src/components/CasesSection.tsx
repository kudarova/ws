function CasesSection() {
  return (
    <section className="section cases" id="cases">
      <div className="container cases__layout">
        <div className="section-head">
          <p className="section-label">Кейсы</p>
          <h2>Блок с кейсами, историями клиентов или заметными результатами.</h2>
        </div>

        <div className="cases__list">
          <article className="case-card case-card--dark">
            <div className="case-card__meta">
              <span>Кейс 01</span>
              <span>Сегмент / ниша</span>
            </div>
            <h3>Название кейса или компании</h3>
            <p>
              Краткое описание задачи, с которой пришел клиент, и контекста
              проекта.
            </p>
            <div className="case-card__stats">
              <div>
                <strong>+48%</strong>
                <span>метрика результата</span>
              </div>
              <div>
                <strong>12 wk</strong>
                <span>срок / формат работы</span>
              </div>
            </div>
          </article>

          <article className="case-card">
            <div className="case-card__meta">
              <span>Кейс 02</span>
              <span>Сегмент / ниша</span>
            </div>
            <h3>Название кейса или компании</h3>
            <p>
              Второй кейс можно использовать для другой категории проектов или
              другого типа результата.
            </p>
            <div className="case-card__line" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </article>

          <article className="case-card">
            <div className="case-card__meta">
              <span>Кейс 03</span>
              <span>Сегмент / ниша</span>
            </div>
            <h3>Название кейса или компании</h3>
            <p>
              Третий кейс можно отдать под пилот, рост, масштабирование или
              партнерский запуск.
            </p>
            <div className="case-card__stats case-card__stats--compact">
              <div>
                <strong>3x</strong>
                <span>ключевой результат</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CasesSection;
