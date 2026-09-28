import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import { Chip, Typography } from "@mui/material";
import type { RentalPackageListItem } from "../packages.types";
import {
  formatCurrency,
  formatShortDate,
  getActivePromotion,
  getDayPriceGroups,
  getRegularStartingPrice,
} from "../packages.utils";
import PackageMenu from "./PackageMenu";

interface PackageCardProps {
  rentalPackage: RentalPackageListItem;
  onEdit: (rentalPackage: RentalPackageListItem) => void;
  onDelete: (rentalPackage: RentalPackageListItem) => void;
}

export default function PackageCard({
  rentalPackage,
  onEdit,
  onDelete,
}: PackageCardProps) {
  const promotion = getActivePromotion(rentalPackage);
  const regularStartingPrice = getRegularStartingPrice(rentalPackage);
  const dayPriceGroups = getDayPriceGroups(rentalPackage);

  return (
    <article className="package-card">
      <div className="package-card__top">
        <div className="package-card__icon">
          <Inventory2Outlined />
        </div>

        <PackageMenu
          packageName={rentalPackage.name}
          onEdit={() => onEdit(rentalPackage)}
          onDelete={() => onDelete(rentalPackage)}
        />
      </div>

      <div className="package-card__heading-row">
        <div>
          <Typography className="package-card__code">
            {rentalPackage.code}
          </Typography>

          <Typography className="package-card__name">
            {rentalPackage.name}
          </Typography>
        </div>

        {promotion && (
          <Chip
            size="small"
            icon={<LocalOfferOutlined />}
            label="Promo activa"
            className="package-card__promo-chip"
          />
        )}
      </div>

      <Typography className="package-card__description">
        {rentalPackage.description ?? "Sin descripción"}
      </Typography>

      <div className="package-card__pricing">
        {promotion ? (
          <>
            <Typography className="package-card__old-price">
              Desde {formatCurrency(regularStartingPrice)}
            </Typography>

            <Typography className="package-card__price package-card__price--promo">
              {formatCurrency(promotion.promotional_price)}
            </Typography>

            <Typography className="package-card__promo-period">
              {promotion.name} · hasta {formatShortDate(promotion.ends_on)}
            </Typography>
          </>
        ) : (
          <>
            <Typography className="package-card__price-label">
              Desde
            </Typography>

            <Typography className="package-card__price">
              {formatCurrency(regularStartingPrice)}
            </Typography>
          </>
        )}
      </div>

      <div className="package-card__duration">
        <AccessTimeOutlined />
        <Typography>
          {rentalPackage.duration_hours} horas de renta
        </Typography>
      </div>

      <div className="package-card__day-prices">
        <Typography className="package-card__day-prices-title">
          Precios por día
        </Typography>

        <div className="package-card__day-prices-list">
          {dayPriceGroups.map((group) => (
            <div
              key={`${group.label}-${group.price}`}
              className="package-card__day-price-row"
            >
              <Typography>{group.label}</Typography>
              <Typography>{formatCurrency(group.price)}</Typography>
            </div>
          ))}
        </div>
      </div>

      <div className="package-card__divider" />

      <Typography className="package-card__includes-title">
        Incluye
      </Typography>

      <div className="package-card__services">
        {rentalPackage.services.map((service) => (
          <div key={service.id} className="package-card__service">
            <CheckCircleOutlined />
            <Typography>{service.name}</Typography>
          </div>
        ))}

        {rentalPackage.services.length === 0 && (
          <Typography className="package-card__without-services">
            Sin servicios configurados.
          </Typography>
        )}
      </div>

      <div className="package-card__status">
        <Chip
          size="small"
          label={rentalPackage.is_active ? "Activo" : "Inactivo"}
          className={
            rentalPackage.is_active
              ? "package-card__status-chip package-card__status-chip--active"
              : "package-card__status-chip package-card__status-chip--inactive"
          }
        />
      </div>
    </article>
  );
}
