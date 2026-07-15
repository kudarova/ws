function TracksSection() {
  return (
    <section className="section tracks" id="tracks">
      <div className="container">
        <div className="section-head">
          <p className="section-label">Результат для бизнеса</p>
          <h2>Не просто разрабатываем — решаем задачу</h2>
        </div>

        <div className="tracks__grid">
          <article className="accent-card">
            <h3>Запускаем новые продукты</h3>
            <p>
              Помогаем превратить идею в работающий сервис: проверяем подход,
              проектируем, разрабатываем и выводим первую версию на рынок.
            </p>
          </article>
          <article>
            <h3>Упрощаем ежедневную работу</h3>
            <p>
              Автоматизируем повторяющиеся операции, связываем системы и
              помогаем сотрудникам быстрее получать нужную информацию.
            </p>
          </article>
          <article className="muted-card">
            <h3>Поддерживаем и развиваем</h3>
            <p>
              Следим за стабильностью после запуска, устраняем проблемы и
              последовательно добавляем возможности по мере роста проекта.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default TracksSection;
