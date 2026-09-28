import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import type { PublicPackage } from "../../../../types/public";
import {
  currency,
  formatPublicDate,
  getPublicDayPriceGroups,
  getPublicRelevantPromotion,
  getPublicStartingPrice,
} from "../publicHome.utils";
import SectionHeader from "./SectionHeader";
import "../PublicPricing.css";

interface PackagesSectionProps {
  packages: PublicPackage[];
  minimumDeposit: string | undefined;
  onSelectPackage: (rentalPackage: PublicPackage) => void;
}

export default function PackagesSection({
  packages,
  minimumDeposit,
  onSelectPackage,
}: PackagesSectionProps) {
  return (
    <section id="paquetes" className="vi-section">
      <div className="vi-container">
        <SectionHeader
          eyebrow="Paquetes"
          title="Elige la opción ideal para tu evento"
          description="Consulta nuestros paquetes, precios por día y promociones vigentes. El precio exacto se calcula de acuerdo con la fecha seleccionada."
        />

        <div className="vi-packages">
          {packages.map((rentalPackage, index) => {
            const highlighted = index === packages.length - 1;
            const startingPrice = getPublicStartingPrice(rentalPackage);
            const dayPriceGroups = getPublicDayPriceGroups(rentalPackage);
            const {
              promotion,
              status: promotionStatus,
            } = getPublicRelevantPromotion(rentalPackage);

            return (
              <article
                key={rentalPackage.id}
                className={`vi-package-card${
                  highlighted
                    ? " vi-package-card--featured"
                    : ""
                }`}
              >
                {highlighted && (
                  <span className="vi-package-card__badge">
                    Paquete más completo
                  </span>
                )}

                <h3>{rentalPackage.name}</h3>

                {promotionStatus === "active" && promotion ? (
                  <div className="vi-public-price">
                    <span className="vi-public-price__label">
                      Promoción vigente
                    </span>

                    <span className="vi-public-price__old">
                      Desde {currency(startingPrice)}
                    </span>

                    <div className="vi-package-card__price vi-package-card__price--promo">
                      <strong>
                        {currency(promotion.promotional_price)}
                      </strong>
                      <span>
                        / {rentalPackage.duration_hours} horas
                      </span>
                    </div>

                    <div className="vi-public-promotion vi-public-promotion--active">
                      <strong>{promotion.name}</strong>
                      <span>
                        Válida hasta {formatPublicDate(promotion.ends_on)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="vi-public-price">
                    <span className="vi-public-price__label">
                      Desde
                    </span>

                    <div className="vi-package-card__price">
                      <strong>{currency(startingPrice)}</strong>
                      <span>
                        / {rentalPackage.duration_hours} horas
                      </span>
                    </div>

                    {promotionStatus === "scheduled" && promotion && (
                      <div className="vi-public-promotion vi-public-promotion--scheduled">
                        <span>Próxima promoción</span>
                        <strong>
                          {promotion.name} ·{" "}
                          {currency(promotion.promotional_price)}
                        </strong>
                        <small>
                          Del {formatPublicDate(promotion.starts_on)} al{" "}
                          {formatPublicDate(promotion.ends_on)}
                        </small>
                      </div>
                    )}
                  </div>
                )}

                {rentalPackage.description && (
                  <p className="vi-package-card__description">
                    {rentalPackage.description}
                  </p>
                )}

                {rentalPackage.day_prices.length > 0 && (
                  <div className="vi-public-day-prices">
                    <span className="vi-public-day-prices__title">
                      Precios por día
                    </span>

                    <div className="vi-public-day-prices__list">
                      {dayPriceGroups.map((group) => (
                        <div
                          key={`${group.label}-${group.price}`}
                          className="vi-public-day-prices__row"
                        >
                          <span>{group.label}</span>
                          <strong>{currency(group.price)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="vi-package-card__divider" />

                <div className="vi-package-card__services">
                  {rentalPackage.services.map((service) => (
                    <div
                      key={service}
                      className="vi-package-card__service"
                    >
                      <CheckCircleOutlined fontSize="small" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>

                {Number(minimumDeposit ?? 0) > 0 && (
                  <div className="vi-package-card__deposit">
                    <span>Anticipo mínimo</span>
                    <strong>
                      {currency(minimumDeposit ?? 0)}
                    </strong>
                  </div>
                )}

                <button
                  type="button"
                  className={`vi-button vi-package-card__button${
                    highlighted
                      ? " vi-button--primary"
                      : " vi-button--outline"
                  }`}
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
