import vkIcon from "../assets/vk.svg";
import tgIcon from "../assets/tg.svg";

function FooterSection() {
  return (
    <footer className="site-footer section" id="contacts">
      <div className="container site-footer__layout">
        <div>
          <p className="section-label">Контакты</p>
          <h2>Готовы обсудить ваш проект?</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-block">
            <a href="mailto:kubiteks@mail.ru">kubiteks@mail.ru</a>
            <a className="contact-block__site" href="https://kubiteks.ru">
              kubiteks.ru
            </a>
            <p>
              Пишите, если есть идеи для проекта или технические вопросы. Обычно
              отвечаем быстро и сразу по делу.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon-placeholder" title="VK">
                <img src={vkIcon} alt="VK" width="24" height="24" />
              </a>
              <a href="#" className="social-icon-placeholder" title="Telegram">
                <img src={tgIcon} alt="Telegram" width="24" height="24" />
              </a>
            </div>
          </div>
          <div className="contact-panel">
            <div>
              <span>Telegram</span>
              <strong>@cubitex_dev</strong>
            </div>
            <div>
              <span>Позвонить</span>
              <a href="tel:+79493276561">
                <strong>+7 (949) 327-65-61</strong>
              </a>
            </div>
          </div>
        </div>

        <div className="map-placeholder" aria-label="Место под карту">
          <div className="map-placeholder__inner">
            <iframe
              src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab3ba30b8db717519f201b72dfded57c7d4bdb392d19154984bf4639a489e617f&amp;source=constructor"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
