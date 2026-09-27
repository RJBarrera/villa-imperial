import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import WhatsApp from "@mui/icons-material/WhatsApp";
import type { PublicBusiness } from "../../../types/public";
import { PHOTOS } from "../publicHome.data";

interface ContactSectionProps {
  business: PublicBusiness | undefined;
  fullAddress: string;
  whatsappUrl: string | null;
}

export default function ContactSection({ business, fullAddress, whatsappUrl }: ContactSectionProps) {
  return (
    <section id="contacto" className="vi-section vi-contact-section">
      <div className="vi-container">
        <div className="vi-contact">
          <div className="vi-contact__content">
            <h2>¿Listo para organizar tu evento?</h2>
            <p>Consulta una fecha disponible y comunícate con nosotros para continuar con tu reservación.</p>
            {fullAddress && (
              <div className="vi-contact__row">
                <LocationOnOutlined fontSize="small" />
                <span>{fullAddress}</span>
              </div>
            )}
            {business?.phone && <p className="vi-contact__detail">Teléfono: {business.phone}</p>}
            {business?.email && <p className="vi-contact__detail">Correo: {business.email}</p>}
            {whatsappUrl && (
              <a className="vi-button vi-button--gold vi-contact__button" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsApp fontSize="small" />
                Contactar por WhatsApp
              </a>
            )}
          </div>
          <img className="vi-contact__image" src={PHOTOS.poolWaterfall} alt="Alberca de Villa Imperial" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
