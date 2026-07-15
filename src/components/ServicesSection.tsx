function ServicesSection() {
  return (
    <section className="section services" id="services">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="section-label">Услуги</p>
            <h2>Цифровые продукты под задачи вашей компании</h2>
          </div>
          <p className="section-summary">
            Берем на себя весь путь: от анализа задачи и первого прототипа до
            запуска, развития и поддержки готового решения.
          </p>
        </div>

        <div className="services__grid">
          <article className="service-card service-card--featured">
            <div className="service-card__index">01</div>
            <h3>Веб-сервисы и мобильные приложения</h3>
            <p>
              Создаем сайты, личные кабинеты и приложения, которыми удобно
              пользоваться клиентам и сотрудникам на любом устройстве.
            </p>
            <div className="service-card__tags">
              <span>Личные кабинеты</span>
              <span>iOS и Android</span>
              <span>Удобный интерфейс</span>
            </div>
          </article>
          <article className="service-card">
            <div className="service-card__index">02</div>
            <h3>Решения на основе ИИ</h3>
            <p>
              Помогаем быстрее работать с документами и данными, создаем
              цифровых помощников для клиентов и сотрудников.
            </p>
          </article>
          <article className="service-card">
            <div className="service-card__index">03</div>
            <h3>Бизнес-системы и интеграции</h3>
            <p>
              Объединяем сервисы и данные компании, автоматизируем процессы и
              создаем надежную основу для дальнейшего роста.
            </p>
          </article>
          <article className="service-card service-card--outline">
            <div className="service-card__index">04</div>
            <h3>Решения для оборудования</h3>
            <p>
              Связываем программное обеспечение с устройствами, датчиками и
              оборудованием, создаем интерфейсы контроля и управления.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
