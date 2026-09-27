import { PHOTOS } from "../publicHome.data";

export default function NightExperienceSection() {
  return (
    <section className="vi-night">
      <img className="vi-night__image" src={PHOTOS.nightGreen} alt="Villa Imperial durante la noche" loading="lazy" />
      <div className="vi-night__overlay" />
      <div className="vi-container vi-night__content">
        <div className="vi-night__copy">
          <span>Eventos de noche</span>
          <h2>Un ambiente diferente cuando cae la noche</h2>
          <p>La iluminación de las instalaciones y de la alberca crea un ambiente ideal para continuar disfrutando tu celebración.</p>
        </div>
      </div>
    </section>
  );
}
