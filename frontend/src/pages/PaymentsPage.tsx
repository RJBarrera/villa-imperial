import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { getPayments } from "../api/payments";

import StatCard from "../components/common/StatCard";

import type { PaymentType } from "../types/payment";

dayjs.locale("es");

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

function paymentTypeConfig(type: PaymentType) {
  switch (type) {
    case "anticipo":
      return {
        label: "Anticipo",

        bgcolor: "#FFF5E7",

        color: "#A76714",
      };

    case "abono":
      return {
        label: "Abono",

        bgcolor: "#E8F1FF",

        color: "#2867C8",
      };

    case "liquidacion":
      return {
        label: "Liquidación",

        bgcolor: "#E9F8F1",

        color: "#14724F",
      };

    case "reembolso":
      return {
        label: "Reembolso",

        bgcolor: "#FDECEC",

        color: "#B42318",
      };
  }
}

export default function PaymentsPage() {
  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments"],

    queryFn: () => getPayments(),
  });

  const totalReceived = payments.reduce((total, payment) => {
    const amount = Number(payment.amount);

    if (payment.payment_type === "reembolso") {
      return total - amount;
    }

    return total + amount;
  }, 0);

  const deposits = payments
    .filter((payment) => payment.payment_type === "anticipo")
    .reduce((total, payment) => total + Number(payment.amount), 0);

  const installments = payments
    .filter((payment) => payment.payment_type === "abono")
    .reduce((total, payment) => total + Number(payment.amount), 0);

  const settlements = payments
    .filter((payment) => payment.payment_type === "liquidacion")
    .reduce((total, payment) => total + Number(payment.amount), 0);

  return (
    <Box
      sx={{
        width: "100%",

        minWidth: 0,
      }}
    >
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 24,
              md: 28,
            },

            fontWeight: 700,
          }}
        >
          Pagos
        </Typography>

        <Typography
          sx={{
            mt: 0.7,

            fontSize: 13,

            color: "text.secondary",
          }}
        >
          Consulta anticipos, abonos y liquidaciones de Villa Imperial.
        </Typography>
      </Box>

      {/* RESUMEN */}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid
          size={{
            xs: 12,
            sm: 6,
            xl: 3,
          }}
        >
          <StatCard
            title="Total recibido"
            value={currency(totalReceived)}
            subtitle={`${payments.length} movimientos`}
            icon={<PaidOutlined />}
            iconBackground="#E9F8F1"
            iconColor="#17875D"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            xl: 3,
          }}
        >
          <StatCard
            title="Anticipos"
            value={currency(deposits)}
            subtitle="Pagos iniciales"
            icon={<AccountBalanceWalletOutlined />}
            iconBackground="#FFF5E7"
            iconColor="#E69B32"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            xl: 3,
          }}
        >
          <StatCard
            title="Abonos"
            value={currency(installments)}
            subtitle="Pagos parciales"
            icon={<AttachMoneyOutlined />}
            iconBackground="#E8F1FF"
            iconColor="#377DFF"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            xl: 3,
          }}
        >
          <StatCard
            title="Liquidaciones"
            value={currency(settlements)}
            subtitle="Pagos finales"
            icon={<ReceiptLongOutlined />}
            iconBackground="#F2ECFF"
            iconColor="#8155C7"
          />
        </Grid>
      </Grid>

      {/* MOVIMIENTOS */}

      <Card>
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
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 16,

                  fontWeight: 700,
                }}
              >
                Movimientos
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,

                  fontSize: 11.5,

                  color: "text.secondary",
                }}
              >
                Historial financiero de reservaciones.
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 12,

                color: "text.secondary",
              }}
            >
              {payments.length} registros
            </Typography>
          </Stack>

          {isLoading && (
            <Box
              sx={{
                py: 8,

                display: "flex",

                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Typography color="error">
              No fue posible consultar los pagos.
            </Typography>
          )}

          {!isLoading && !isError && payments.length === 0 && (
            <Box
              sx={{
                py: 8,

                textAlign: "center",
              }}
            >
              <PaidOutlined
                sx={{
                  fontSize: 52,

                  color: "#98A2B3",
                }}
              />

              <Typography
                sx={{
                  mt: 1,

                  fontWeight: 700,
                }}
              >
                Sin movimientos
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,

                  fontSize: 12,

                  color: "text.secondary",
                }}
              >
                Los pagos de las reservaciones aparecerán aquí.
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            {payments.map((payment) => {
              const config = paymentTypeConfig(payment.payment_type);

              return (
                <Box
                  key={payment.id}
                  sx={{
                    p: 1.7,

                    border: "1px solid #EAECF0",

                    borderRadius: "13px",

                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",

                      sm: "1fr auto",
                    },

                    gap: 2,

                    alignItems: "center",

                    transition: "background-color .2s",

                    "&:hover": {
                      bgcolor: "#FAFBFC",
                    },
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,

                          fontWeight: 700,
                        }}
                      >
                        {payment.client.full_name}
                      </Typography>

                      <Chip
                        label={config.label}
                        size="small"
                        sx={{
                          height: 22,

                          bgcolor: config.bgcolor,

                          color: config.color,

                          fontWeight: 600,

                          fontSize: 9.5,
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        mt: 0.4,

                        fontSize: 11.5,

                        color: "text.secondary",
                      }}
                    >
                      {payment.booking.event_type}

                      {" · "}

                      {payment.booking.folio}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.3,

                        fontSize: 10.5,

                        color: "#98A2B3",

                        textTransform: "capitalize",
                      }}
                    >
                      {dayjs(payment.paid_at).format("DD MMM YYYY · h:mm A")}

                      {" · "}

                      {payment.payment_method}

                      {payment.reference ? ` · ${payment.reference}` : ""}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 17,

                      fontWeight: 700,

                      textAlign: {
                        xs: "left",

                        sm: "right",
                      },

                      color:
                        payment.payment_type === "reembolso"
                          ? "error.main"
                          : "success.main",
                    }}
                  >
                    {payment.payment_type === "reembolso" ? "-" : "+"}

                    {currency(payment.amount)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
