function SnapshotSection() {
  return (
    <section className="section snapshot">
      <div className="container snapshot__layout">
        <div className="snapshot__card">
          <p className="section-label">Показатели</p>
          <h3>
            Технологическая база и опыт внедрения современных решений.
          </h3>
          <div className="snapshot__rows">
            <div>
              <span>Инструменты разработки</span>
              <b>50+ инструментов</b>
            </div>
            <div>
              <span>Решения с ИИ</span>
              <b>20+ проектов</b>
            </div>
            <div>
              <span>Полный цикл работ</span>
              <b>От идеи до поддержки</b>
            </div>
          </div>
        </div>
        <div className="snapshot__text">
          <p className="section-label">Приоритеты</p>
          <h2>Технологии для развития бизнеса</h2>
          <p>
            Мы не просто следим за ИТ-трендами, а внедряем решения, которые 
            помогают оптимизировать процессы и создавать новые конкурентные 
            преимущества. Наш подход основан на надежности и масштабируемости.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SnapshotSection;
