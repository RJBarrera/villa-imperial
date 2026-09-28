import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import WhatsApp from "@mui/icons-material/WhatsApp";
import {
  Alert,
  MenuItem,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getPublicPackagePrice } from "../../../../api/public";
import type {
  PublicAvailability,
  PublicPackage,
} from "../../../../types/public";
import {
  currency,
  getPublicPackagePriceDescription,
} from "../publicHome.utils";
import "../PublicPricing.css";

interface AvailabilityFormProps {
  packages: PublicPackage[];
  selectedPackageId: string;
  selectedPackage: PublicPackage | undefined;
  eventDate: string;
  startTime: string;
  availability: PublicAvailability | undefined;
  isPending: boolean;
  isError: boolean;
  whatsappUrl: string | null;
  onPackageChange: (packageId: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onCheckAvailability: () => void;
}

export default function AvailabilityForm({
  packages,
  selectedPackageId,
  selectedPackage,
  eventDate,
  startTime,
  availability,
  isPending,
  isError,
  whatsappUrl,
  onPackageChange,
  onDateChange,
  onTimeChange,
  onCheckAvailability,
}: AvailabilityFormProps) {
  const {
    data: packagePrice,
    isLoading: packagePriceLoading,
    isError: packagePriceError,
  } = useQuery({
    queryKey: [
      "public-package-price",
      selectedPackageId,
      eventDate,
    ],
    queryFn: () =>
      getPublicPackagePrice(
        selectedPackageId,
        eventDate,
      ),
    enabled: Boolean(
      selectedPackageId &&
        eventDate,
    ),
  });

  const priceDescription =
    getPublicPackagePriceDescription(packagePrice);

  const regularPrice = packagePrice
    ? Number(
        packagePrice.day_price ??
          packagePrice.base_price,
      )
    : Number(selectedPackage?.base_price ?? 0);

  return (
    <div className="vi-availability-card vi-availability-form">
      <h3>Consulta tu horario</h3>

      <p>
        Selecciona los datos de tu evento y consultaremos la disponibilidad
        y el precio correspondiente a esa fecha.
      </p>

      <div className="vi-availability-form__fields">
        <TextField
          select
          label="Paquete"
          value={selectedPackageId}
          onChange={(event) =>
            onPackageChange(event.target.value)
          }
          fullWidth
        >
          {packages.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
            >
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Fecha"
          type="date"
          value={eventDate}
          onChange={(event) =>
            onDateChange(event.target.value)
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
            htmlInput: {
              min: dayjs().format("YYYY-MM-DD"),
            },
          }}
          fullWidth
        />

        <TextField
          label="Hora de inicio"
          type="time"
          value={startTime}
          onChange={(event) =>
            onTimeChange(event.target.value)
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
        />
      </div>

      {selectedPackage && (
        <div className="vi-availability-form__package vi-public-selected-package">
          <div>
            <strong>{selectedPackage.name}</strong>
            <span>
              {selectedPackage.duration_hours} horas
            </span>

            {!packagePriceLoading && priceDescription && (
              <small
                className={
                  packagePrice?.source === "promotion"
                    ? "vi-public-selected-package__source vi-public-selected-package__source--promo"
                    : "vi-public-selected-package__source"
                }
              >
                {priceDescription}
              </small>
            )}
          </div>

          <div className="vi-public-selected-package__price">
            {packagePrice?.source === "promotion" && (
              <span>
                {currency(regularPrice)}
              </span>
            )}

            <b>
              {packagePriceLoading
                ? "Calculando..."
                : currency(
                    packagePrice?.effective_price ??
                      selectedPackage.base_price,
                  )}
            </b>
          </div>
        </div>
      )}

      {packagePriceError && (
        <Alert
          severity="error"
          className="vi-availability-form__alert"
        >
          No fue posible consultar el precio para la fecha seleccionada.
        </Alert>
      )}

      <button
        type="button"
        className="vi-button vi-button--primary vi-availability-form__submit"
        disabled={
          isPending ||
          packagePriceLoading ||
          packagePriceError ||
          !selectedPackageId ||
          !eventDate ||
          !startTime
        }
        onClick={onCheckAvailability}
      >
        <CalendarMonthOutlined fontSize="small" />
        {isPending
          ? "Consultando..."
          : "Consultar disponibilidad"}
      </button>

      {isError && (
        <Alert
          severity="error"
          className="vi-availability-form__alert"
        >
          No fue posible consultar la disponibilidad.
        </Alert>
      )}

      {availability && (
        <AvailabilityResult
          availability={availability}
          whatsappUrl={whatsappUrl}
        />
      )}
    </div>
  );
}

function AvailabilityResult({
  availability,
  whatsappUrl,
}: {
  availability: PublicAvailability;
  whatsappUrl: string | null;
}) {
  if (!availability.available) {
    return (
      <Alert
        severity="warning"
        className="vi-availability-form__alert"
      >
        <strong>Ese horario no está disponible.</strong>
        <span>
          Intenta con otra hora o selecciona una fecha diferente.
        </span>
      </Alert>
    );
  }

  return (
    <Alert
      severity="success"
      icon={<CheckCircleOutlined />}
      className="vi-availability-form__alert"
    >
      <strong>¡Horario disponible!</strong>

      <span>
        {dayjs(availability.starts_at).format(
          "DD/MM/YYYY · h:mm A",
        )}{" "}
        -{" "}
        {dayjs(availability.ends_at).format(
          "h:mm A",
        )}
      </span>

      {whatsappUrl && (
        <a
          className="vi-button vi-button--primary vi-availability-form__whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsApp fontSize="small" />
          Solicitar reservación
        </a>
      )}
    </Alert>
  );
}
