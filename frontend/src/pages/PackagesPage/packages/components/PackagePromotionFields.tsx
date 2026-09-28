import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { PromotionFormItem } from "../packages.types";
import { createPromotionFormItem } from "../packages.utils";

interface PackagePromotionFieldsProps {
  promotions: PromotionFormItem[];
  onChange: (promotions: PromotionFormItem[]) => void;
}

export default function PackagePromotionFields({
  promotions,
  onChange,
}: PackagePromotionFieldsProps) {
  function addPromotion() {
    onChange([
      ...promotions,
      createPromotionFormItem(),
    ]);
  }

  function updatePromotion(
    key: string,
    field: keyof PromotionFormItem,
    value: string | boolean,
  ) {
    onChange(
      promotions.map((promotion) =>
        promotion.key === key
          ? {
              ...promotion,
              [field]: value,
            }
          : promotion,
      ),
    );
  }

  function removePromotion(key: string) {
    onChange(
      promotions.filter(
        (promotion) => promotion.key !== key,
      ),
    );
  }

  return (
    <section className="package-form-section">
      <div className="package-form-section__heading package-form-section__heading--inline">
        <div>
          <Typography className="package-form-section__title">
            Promociones
          </Typography>
          <Typography className="package-form-section__description">
            Define descuentos con precio y periodo de vigencia.
          </Typography>
        </div>

        <Button
          size="small"
          startIcon={<AddOutlined />}
          onClick={addPromotion}
        >
          Agregar promoción
        </Button>
      </div>

      {promotions.length === 0 && (
        <div className="package-promotions-empty">
          <Typography>
            Este paquete no tiene promociones configuradas.
          </Typography>
        </div>
      )}

      <div className="package-promotions-list">
        {promotions.map((promotion, index) => (
          <div
            key={promotion.key}
            className="package-promotion-editor"
          >
            <div className="package-promotion-editor__header">
              <Typography>
                Promoción {index + 1}
              </Typography>

              <IconButton
                size="small"
                aria-label={`Eliminar promoción ${index + 1}`}
                onClick={() => removePromotion(promotion.key)}
              >
                <DeleteOutlined />
              </IconButton>
            </div>

            <div className="package-form-grid package-form-grid--promotion">
              <TextField
                fullWidth
                label="Nombre de la promoción"
                value={promotion.name}
                onChange={(event) =>
                  updatePromotion(
                    promotion.key,
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Especial octubre"
              />

              <TextField
                fullWidth
                label="Precio promocional"
                type="number"
                value={promotion.promotional_price}
                onChange={(event) =>
                  updatePromotion(
                    promotion.key,
                    "promotional_price",
                    event.target.value,
                  )
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Inicio"
                type="date"
                value={promotion.starts_on}
                onChange={(event) =>
                  updatePromotion(
                    promotion.key,
                    "starts_on",
                    event.target.value,
                  )
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                fullWidth
                label="Fin"
                type="date"
                value={promotion.ends_on}
                onChange={(event) =>
                  updatePromotion(
                    promotion.key,
                    "ends_on",
                    event.target.value,
                  )
                }
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <div className="package-form-grid__full">
                <FormControlLabel
                  control={
                    <Switch
                      checked={promotion.is_active}
                      onChange={(event) =>
                        updatePromotion(
                          promotion.key,
                          "is_active",
                          event.target.checked,
                        )
                      }
                    />
                  }
                  label="Promoción activa"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
