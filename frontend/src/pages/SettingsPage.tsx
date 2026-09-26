import SaveOutlined from "@mui/icons-material/SaveOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { getBusinessSettings, updateBusinessSettings } from "../api/settings";

interface FormState {
  business_name: string;

  phone: string;

  whatsapp: string;

  email: string;

  address: string;

  city: string;

  state: string;

  timezone: string;

  minimum_deposit: string;

  logo_url: string;

  receipt_footer: string;
}

const EMPTY_FORM: FormState = {
  business_name: "Villa Imperial",

  phone: "",

  whatsapp: "",

  email: "",

  address: "",

  city: "",

  state: "",

  timezone: "America/Mazatlan",

  minimum_deposit: "0",

  logo_url: "",

  receipt_footer: "",
};

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["business-settings"],

    queryFn: getBusinessSettings,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setForm({
      business_name: data.business_name,

      phone: data.phone ?? "",

      whatsapp: data.whatsapp ?? "",

      email: data.email ?? "",

      address: data.address ?? "",

      city: data.city ?? "",

      state: data.state ?? "",

      timezone: data.timezone,

      minimum_deposit: data.minimum_deposit,

      logo_url: data.logo_url ?? "",

      receipt_footer: data.receipt_footer ?? "",
    });
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateBusinessSettings,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business-settings"],
      });
    },
  });

  const handleChange = (
    field: keyof FormState,

    value: string,
  ) => {
    setForm((current) => ({
      ...current,

      [field]: value,
    }));
  };

  const handleSave = () => {
    mutation.mutate({
      business_name: form.business_name.trim(),

      phone: form.phone.trim() || null,

      whatsapp: form.whatsapp.trim() || null,

      email: form.email.trim() || null,

      address: form.address.trim() || null,

      city: form.city.trim() || null,

      state: form.state.trim() || null,

      timezone: form.timezone,

      minimum_deposit: Number(form.minimum_deposit || 0),

      logo_url: form.logo_url.trim() || null,

      receipt_footer: form.receipt_footer.trim() || null,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",

        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", marginBottom: 3 }}
      >
        <Box
          sx={{
            width: 45,

            height: 45,

            borderRadius: "13px",

            bgcolor: "#EDF3F7",

            color: "primary.main",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >
          <SettingsOutlined />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 24,

                md: 28,
              },

              fontWeight: 700,
            }}
          >
            Configuración
          </Typography>

          <Typography
            sx={{
              mt: 0.3,

              fontSize: 13,

              color: "text.secondary",
            }}
          >
            Información general de Villa Imperial.
          </Typography>
        </Box>
      </Stack>

      {isLoading && (
        <Card>
          <CardContent
            sx={{
              py: 10,

              display: "flex",

              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </CardContent>
        </Card>
      )}

      {isError && (
        <Alert severity="error">
          No fue posible consultar la configuración.
        </Alert>
      )}

      {!isLoading && !isError && (
        <Card>
          <CardContent
            sx={{
              p: {
                xs: 2,

                md: 3,
              },

              "&:last-child": {
                pb: {
                  xs: 2,

                  md: 3,
                },
              },
            }}
          >
            <Stack spacing={3}>
              {mutation.isSuccess && (
                <Alert severity="success">
                  Configuración actualizada correctamente.
                </Alert>
              )}

              {mutation.isError && (
                <Alert severity="error">
                  No fue posible guardar la configuración.
                </Alert>
              )}

              <Typography
                sx={{
                  fontSize: 13,

                  fontWeight: 700,

                  textTransform: "uppercase",

                  letterSpacing: 0.7,

                  color: "text.secondary",
                }}
              >
                Información del negocio
              </Typography>

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    md: "1fr 1fr",
                  },

                  gap: 2,
                }}
              >
                <TextField
                  label="Nombre del negocio"
                  value={form.business_name}
                  onChange={(event) =>
                    handleChange("business_name", event.target.value)
                  }
                  required
                />

                <TextField
                  label="Teléfono"
                  value={form.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                />

                <TextField
                  label="WhatsApp"
                  value={form.whatsapp}
                  onChange={(event) =>
                    handleChange("whatsapp", event.target.value)
                  }
                />

                <TextField
                  label="Correo"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                />

                <TextField
                  label="Dirección"
                  value={form.address}
                  onChange={(event) =>
                    handleChange("address", event.target.value)
                  }
                  sx={{
                    gridColumn: {
                      md: "1 / -1",
                    },
                  }}
                />

                <TextField
                  label="Ciudad"
                  value={form.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                />

                <TextField
                  label="Estado"
                  value={form.state}
                  onChange={(event) =>
                    handleChange("state", event.target.value)
                  }
                />
              </Box>

              <Typography
                sx={{
                  fontSize: 13,

                  fontWeight: 700,

                  textTransform: "uppercase",

                  letterSpacing: 0.7,

                  color: "text.secondary",
                }}
              >
                Reservaciones
              </Typography>

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",

                    md: "1fr 1fr",
                  },

                  gap: 2,
                }}
              >
                <TextField
                  select
                  label="Zona horaria"
                  value={form.timezone}
                  onChange={(event) =>
                    handleChange("timezone", event.target.value)
                  }
                >
                  <MenuItem value="America/Mazatlan">America/Mazatlan</MenuItem>

                  <MenuItem value="America/Mexico_City">
                    America/Mexico_City
                  </MenuItem>
                </TextField>

                <TextField
                  label="Anticipo mínimo"
                  type="number"
                  value={form.minimum_deposit}
                  onChange={(event) =>
                    handleChange("minimum_deposit", event.target.value)
                  }
                />
              </Box>

              <Typography
                sx={{
                  fontSize: 13,

                  fontWeight: 700,

                  textTransform: "uppercase",

                  letterSpacing: 0.7,

                  color: "text.secondary",
                }}
              >
                Comprobantes
              </Typography>

              <TextField
                label="URL del logo"
                value={form.logo_url}
                onChange={(event) =>
                  handleChange("logo_url", event.target.value)
                }
                fullWidth
              />

              <TextField
                label="Texto al pie del comprobante"
                value={form.receipt_footer}
                onChange={(event) =>
                  handleChange("receipt_footer", event.target.value)
                }
                multiline
                minRows={3}
                fullWidth
              />

              <Box
                sx={{
                  display: "flex",

                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveOutlined />}
                  onClick={handleSave}
                  disabled={mutation.isPending || !form.business_name.trim()}
                >
                  {mutation.isPending
                    ? "Guardando..."
                    : "Guardar configuración"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
