import { FACILITIES } from "../publicHome.data";
import SectionHeader from "./SectionHeader";

export default function FacilitiesSection() {
  return (
    <section id="instalaciones" className="vi-section vi-section--soft">
      <div className="vi-container">
        <SectionHeader
          eyebrow="Instalaciones"
          title="Conoce los espacios de Villa Imperial"
          description="Áreas exteriores e interiores diseñadas para adaptarse a diferentes tipos de celebraciones."
        />
        <div className="vi-facilities">
          {FACILITIES.map((facility) => (
            <article key={facility.title} className="vi-facility-card">
              <img src={facility.image} alt={facility.title} loading="lazy" />
              <div className="vi-facility-card__overlay" />
              <div className="vi-facility-card__content">
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
