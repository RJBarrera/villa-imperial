import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import { getPackages } from "../api/packages";

const formatCurrency = (value: string | number) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
};

export default function PackagesPage() {
  const {
    data: packages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          mb: 3,
        }}
      >
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
            Paquetes
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            Administra precios, duración y servicios incluidos en cada renta.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          sx={{
            minHeight: 42,
          }}
        >
          Nuevo paquete
        </Button>
      </Stack>

      {isLoading && (
        <Box
          sx={{
            minHeight: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Card>
          <CardContent>
            <Typography color="error" sx={{ fontWeight: 600 }}>
              No fue posible consultar los paquetes.
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              Verifica que el backend se encuentre ejecutándose.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <Grid container spacing={2}>
          {packages.map((rentalPackage) => (
            <Grid
              key={rentalPackage.id}
              size={{
                xs: 12,
                md: 6,
                xl: 4,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",

                  transition: "transform .2s ease, box-shadow .2s ease",

                  "&:hover": {
                    transform: "translateY(-3px)",

                    boxShadow: "0 12px 30px rgba(16,24,40,.08)",
                  },

                  "&::before": {
                    content: '""',

                    position: "absolute",

                    top: 0,

                    left: 0,

                    width: "100%",

                    height: 4,

                    background: "linear-gradient(90deg, #173B57, #C6A15B)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 2.5,

                    "&:last-child": {
                      pb: 2.5,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        width: 46,
                        height: 46,

                        borderRadius: "13px",

                        bgcolor: "#EDF3F7",

                        color: "primary.main",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Inventory2Outlined />
                    </Box>

                    <IconButton size="small">
                      <MoreHorizOutlined />
                    </IconButton>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: 11,
                      color: "text.secondary",
                      fontWeight: 600,
                      letterSpacing: 0.5,
                    }}
                  >
                    {rentalPackage.code}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {rentalPackage.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      minHeight: 36,
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    {rentalPackage.description ?? "Sin descripción"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2.5,
                      fontSize: 30,
                      lineHeight: 1,
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    {formatCurrency(rentalPackage.base_price)}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", mt: 1 }}
                    spacing={0.7}
                  >
                    <AccessTimeOutlined
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: "text.secondary",
                      }}
                    >
                      {rentalPackage.duration_hours} horas de renta
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      my: 2.3,
                      height: "1px",
                      bgcolor: "#EAECF0",
                    }}
                  />

                  <Typography
                    sx={{
                      mb: 1.2,
                      fontSize: 11,
                      color: "text.secondary",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                    }}
                  >
                    Incluye
                  </Typography>

                  <Stack spacing={0.9}>
                    {rentalPackage.services.map((service) => (
                      <Stack
                        key={service.id}
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        <CheckCircleOutlined
                          sx={{
                            fontSize: 17,
                            color: "success.main",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 12,
                          }}
                        >
                          {service.name}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Box sx={{ mt: 2.5 }}>
                    <Chip
                      size="small"
                      label={rentalPackage.is_active ? "Activo" : "Inactivo"}
                      sx={{
                        bgcolor: rentalPackage.is_active
                          ? "#E9F8F1"
                          : "#F2F4F7",

                        color: rentalPackage.is_active ? "#14724F" : "#667085",

                        fontWeight: 600,
                        fontSize: 10,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
