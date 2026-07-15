function ProcessSection() {
  return (
    <section className="section process">
      <div className="container process__layout">
        <div className="section-head">
          <p className="section-label">Как мы работаем</p>
          <h2>Этапы реализации вашего проекта</h2>
        </div>

        <ol className="process__list">
          <li>
            <span>01</span>
            <div>
              <h3>Анализ и проектирование</h3>
              <p>
                Изучаем ваши бизнес-цели, формируем техническое задание и
                проектируем архитектуру будущего решения.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Разработка и итерации</h3>
              <p>
                Пишем чистый и масштабируемый код, регулярно демонстрируя
                промежуточные результаты и собирая обратную связь.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Проверка качества</h3>
              <p>
                Проводим тщательную проверку функционала, безопасности и
                производительности перед запуском.
              </p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Запуск и поддержка</h3>
              <p>
                Запускаем продукт, следим за его работой и обеспечиваем
                дальнейшее техническое сопровождение.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default ProcessSection;
