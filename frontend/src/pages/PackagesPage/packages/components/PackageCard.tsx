import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import { Chip, IconButton, Typography } from "@mui/material";
import type { RentalPackageListItem } from "../packages.types";
import { formatCurrency } from "../packages.utils";

interface PackageCardProps {
  rentalPackage: RentalPackageListItem;
}

export default function PackageCard({
  rentalPackage,
}: PackageCardProps) {
  return (
    <article className="package-card">
      <div className="package-card__top">
        <div className="package-card__icon">
          <Inventory2Outlined />
        </div>

        <IconButton
          size="small"
          aria-label={`Opciones de ${rentalPackage.name}`}
        >
          <MoreHorizOutlined />
        </IconButton>
      </div>

      <Typography className="package-card__code">
        {rentalPackage.code}
      </Typography>

      <Typography className="package-card__name">
        {rentalPackage.name}
      </Typography>

      <Typography className="package-card__description">
        {rentalPackage.description ?? "Sin descripción"}
      </Typography>

      <Typography className="package-card__price">
        {formatCurrency(rentalPackage.base_price)}
      </Typography>

      <div className="package-card__duration">
        <AccessTimeOutlined />
        <Typography>
          {rentalPackage.duration_hours} horas de renta
        </Typography>
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
