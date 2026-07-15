function ApplySection() {
  return (
    <section className="section apply" id="apply">
      <div className="container apply__layout">
        <div>
          <p className="section-label">С кем мы работаем</p>
          <h2>Ваш проект в надежных руках</h2>
        </div>

        <div className="apply__criteria">
          <p>
            Мы работаем с широким кругом заказчиков — от стартапов на стадии
            идеи до крупных корпораций, которым требуется усиление экспертизы
            или разработка сложных модулей.
          </p>
          <ul>
            <li>Стартапы (первая версия продукта и вывод на рынок)</li>
            <li>Малый и средний бизнес (автоматизация и веб-сервисы)</li>
            <li>Крупные компании (корпоративные и исследовательские проекты)</li>
            <li>Индивидуальные предприниматели (личные бренды и блоги)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ApplySection;
