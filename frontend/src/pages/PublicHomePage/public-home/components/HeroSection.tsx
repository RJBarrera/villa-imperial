import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { PHOTOS } from "../publicHome.data";

interface HeroSectionProps {
  businessName: string;
}

interface HeroPhotoProps {
  src: string;
  title: string;
  subtitle: string;
  large?: boolean;
}

function HeroPhoto({ src, title, subtitle, large = false }: HeroPhotoProps) {
  return (
    <article className={`vi-hero-photo${large ? " vi-hero-photo--large" : ""}`}>
      <img src={src} alt={title} loading={large ? "eager" : "lazy"} />
      <div className="vi-hero-photo__overlay" />
      <div className="vi-hero-photo__caption">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </article>
  );
}

function HeroFeature({ text }: { text: string }) {
  return (
    <div className="vi-hero__feature">
      <CheckCircleOutlined fontSize="small" />
      <span>{text}</span>
    </div>
  );
}

export default function HeroSection({ businessName }: HeroSectionProps) {
  return (
    <section id="inicio" className="vi-hero">
      <div className="vi-hero__glow" />
      <div className="vi-container vi-hero__content">
        <div className="vi-hero__copy">
          <span className="vi-hero__badge">Salón de eventos</span>
          <h1 className="vi-hero__title">Celebra momentos que merecen ser <span>inolvidables</span></h1>
          <p className="vi-hero__description">
            {businessName} te ofrece alberca, áreas exteriores, espacios refrigerados, cocina y asador para disfrutar tu celebración durante 8 horas.
          </p>
          <div className="vi-hero__actions">
            <a className="vi-button vi-button--gold" href="#disponibilidad">
              Consultar disponibilidad
              <ArrowForwardOutlined fontSize="small" />
            </a>
            <a className="vi-button vi-button--outline-light" href="#paquetes">Ver paquetes</a>
          </div>
          <div className="vi-hero__features">
            <HeroFeature text="Renta por 8 horas" />
            <HeroFeature text="Disponibilidad en línea" />
            <HeroFeature text="Atención por WhatsApp" />
          </div>
        </div>
        <div className="vi-hero__photos">
          <HeroPhoto src={PHOTOS.heroMain} title="Alberca" subtitle="Área exterior" large />
          <HeroPhoto src={PHOTOS.heroTop} title="Espacios" subtitle="Amplias instalaciones" />
          <HeroPhoto src={PHOTOS.heroBottom} title="De noche" subtitle="Iluminación especial" />
        </div>
      </div>
    </section>
  );
}
