import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import type { PublicPackage } from "../../../types/public";
import { currency } from "../publicHome.utils";
import SectionHeader from "./SectionHeader";

interface PackagesSectionProps {
  packages: PublicPackage[];
  minimumDeposit: string | undefined;
  onSelectPackage: (rentalPackage: PublicPackage) => void;
}

export default function PackagesSection({ packages, minimumDeposit, onSelectPackage }: PackagesSectionProps) {
  return (
    <section id="paquetes" className="vi-section">
      <div className="vi-container">
        <SectionHeader
          eyebrow="Paquetes"
          title="Elige la opción ideal para tu evento"
          description="Todos nuestros paquetes cuentan con una renta de 8 horas. Los precios y servicios se obtienen directamente de nuestro sistema."
        />
        <div className="vi-packages">
          {packages.map((rentalPackage, index) => {
            const highlighted = index === packages.length - 1;
            return (
              <article key={rentalPackage.id} className={`vi-package-card${highlighted ? " vi-package-card--featured" : ""}`}>
                {highlighted && <span className="vi-package-card__badge">Paquete más completo</span>}
                <h3>{rentalPackage.name}</h3>
                <div className="vi-package-card__price">
                  <strong>{currency(rentalPackage.base_price)}</strong>
                  <span>/ {rentalPackage.duration_hours} horas</span>
                </div>
                {rentalPackage.description && <p className="vi-package-card__description">{rentalPackage.description}</p>}
                <div className="vi-package-card__divider" />
                <div className="vi-package-card__services">
                  {rentalPackage.services.map((service) => (
                    <div key={service} className="vi-package-card__service">
                      <CheckCircleOutlined fontSize="small" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
                {Number(minimumDeposit ?? 0) > 0 && (
                  <div className="vi-package-card__deposit">
                    <span>Anticipo mínimo</span>
                    <strong>{currency(minimumDeposit ?? 0)}</strong>
                  </div>
                )}
                <button
                  type="button"
                  className={`vi-button vi-package-card__button${highlighted ? " vi-button--primary" : " vi-button--outline"}`}
                  onClick={() => onSelectPackage(rentalPackage)}
                >
                  Consultar disponibilidad
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
