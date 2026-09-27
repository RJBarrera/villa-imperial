import WhatsApp from "@mui/icons-material/WhatsApp";
import Brand from "./Brand";

interface PublicHeaderProps {
  businessName: string;
  logoUrl: string;
  whatsappUrl: string | null;
}

const NAV_ITEMS = [
  ["#inicio", "Inicio"],
  ["#instalaciones", "Instalaciones"],
  ["#galeria", "Galería"],
  ["#paquetes", "Paquetes"],
  ["#disponibilidad", "Disponibilidad"],
  ["#contacto", "Contacto"],
] as const;

export default function PublicHeader({ businessName, logoUrl, whatsappUrl }: PublicHeaderProps) {
  return (
    <header className="vi-header">
      <div className="vi-container vi-header__content">
        <Brand businessName={businessName} logoUrl={logoUrl} />
        <nav className="vi-header__nav" aria-label="Navegación principal">
          {NAV_ITEMS.map(([href, label]) => (
            <a key={href} className="vi-header__link" href={href}>{label}</a>
          ))}
        </nav>
        {whatsappUrl && (
          <a className="vi-button vi-button--primary vi-header__whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <WhatsApp fontSize="small" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </header>
  );
}
