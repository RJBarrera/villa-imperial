import type { ReactNode } from "react";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { getDashboardSummary } from "../api/dashboard";

import StatCard from "../components/common/StatCard";

dayjs.locale("es");

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", selectedMonth],

    queryFn: () => getDashboardSummary(selectedMonth),
  });

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* HEADER */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        sx={{
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          mb: 3,
        }}
        spacing={2}
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
            Dashboard
          </Typography>

          <Typography
            sx={{
              mt: 0.7,

              fontSize: 13,

              color: "text.secondary",
            }}
          >
            Resumen financiero y operativo de Villa Imperial.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          sx={{
            ml: {
              md: "auto",
            },
          }}
        >
          <TextField
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />

          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => navigate("/admin/reservaciones")}
          >
            Nueva reservación
          </Button>
        </Stack>
      </Stack>

      {/* CARGANDO */}

      {isLoading && (
        <Card>
          <CardContent
            sx={{
              py: 10,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* ERROR */}

      {isError && (
        <Card>
          <CardContent>
            <Typography color="error" sx={{ fontWeight: 600 }}>
              No fue posible cargar el Dashboard.
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: 12,

                color: "text.secondary",
              }}
            >
              Verifica que FastAPI y PostgreSQL estén disponibles.
            </Typography>
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          {/* INDICADORES */}

          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                xl: 3,
              }}
            >
              <StatCard
                title="Reservaciones del mes"
                value={data.bookings_count.toString()}
                subtitle={`${data.occupied_days} días ocupados`}
                icon={<EventAvailableOutlined />}
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
                title="Ingresos recibidos"
                value={currency(data.income_received)}
                subtitle="Pagos recibidos en el mes"
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
                title="Gastos del mes"
                value={currency(data.expenses_total)}
                subtitle="Egresos registrados"
                icon={<ReceiptLongOutlined />}
                iconBackground="#FDECEC"
                iconColor="#D64545"
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
                title="Utilidad del mes"
                value={currency(data.profit)}
                subtitle="Ingresos menos gastos"
                icon={<AccountBalanceWalletOutlined />}
                iconBackground="#F2ECFF"
                iconColor="#8155C7"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {/* PRÓXIMOS EVENTOS */}

            <Grid
              size={{
                xs: 12,
                lg: 8,
              }}
            >
              <Card
                sx={{
                  height: "100%",
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
                    sx={{
                      flexDirection: "row",
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
                        Próximos eventos
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.3,

                          fontSize: 11.5,

                          color: "text.secondary",
                        }}
                      >
                        Las siguientes reservaciones programadas.
                      </Typography>
                    </Box>

                    <Button
                      size="small"
                      onClick={() => navigate("/admin/calendario")}
                    >
                      Ver calendario
                    </Button>
                  </Stack>

                  {data.upcoming_bookings.length === 0 ? (
                    <Box
                      sx={{
                        py: 6,

                        textAlign: "center",
                      }}
                    >
                      <CalendarMonthOutlined
                        sx={{
                          fontSize: 44,

                          color: "#98A2B3",
                        }}
                      />

                      <Typography
                        sx={{
                          mt: 1,

                          fontSize: 13,

                          fontWeight: 600,
                        }}
                      >
                        No hay próximos eventos
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.3}>
                      {data.upcoming_bookings.map((booking) => (
                        <Box
                          key={booking.id}
                          sx={{
                            p: 1.6,

                            display: "flex",

                            gap: 1.5,

                            alignItems: "center",

                            border: "1px solid #EAECF0",

                            borderRadius: "13px",

                            cursor: "pointer",

                            "&:hover": {
                              bgcolor: "#FAFBFC",
                            },
                          }}
                          onClick={() => navigate("/admin/reservaciones")}
                        >
                          <Box
                            sx={{
                              width: 56,

                              minWidth: 56,

                              height: 56,

                              borderRadius: "12px",

                              bgcolor: "#F3F6F8",

                              display: "flex",

                              flexDirection: "column",

                              alignItems: "center",

                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 18,

                                fontWeight: 700,

                                lineHeight: 1,
                              }}
                            >
                              {dayjs(booking.starts_at).format("DD")}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.4,

                                fontSize: 9,

                                fontWeight: 600,

                                textTransform: "uppercase",

                                color: "text.secondary",
                              }}
                            >
                              {dayjs(booking.starts_at).format("MMM")}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              minWidth: 0,

                              flex: 1,
                            }}
                          >
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
                                {booking.event_type}
                              </Typography>

                              <Chip
                                size="small"
                                label={booking.status}
                                sx={{
                                  height: 21,

                                  fontSize: 9,

                                  textTransform: "capitalize",
                                }}
                              />
                            </Stack>

                            <Typography
                              sx={{
                                mt: 0.3,

                                fontSize: 11.5,

                                color: "text.secondary",
                              }}
                            >
                              {booking.client_name}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.2,

                                fontSize: 10.5,

                                color: "#98A2B3",
                              }}
                            >
                              {booking.package_name}

                              {" · "}

                              {dayjs(booking.starts_at).format("h:mm A")}
                            </Typography>
                          </Box>

                          {Number(booking.balance) > 0 && (
                            <Typography
                              sx={{
                                fontSize: 11,

                                fontWeight: 600,

                                color: "warning.main",

                                display: {
                                  xs: "none",

                                  sm: "block",
                                },
                              }}
                            >
                              Pendiente {currency(booking.balance)}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* CONTROL OPERATIVO */}

            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <Card
                sx={{
                  height: "100%",
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
                  <Typography
                    sx={{
                      fontSize: 16,

                      fontWeight: 700,
                    }}
                  >
                    Control operativo
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,

                      fontSize: 11.5,

                      color: "text.secondary",
                    }}
                  >
                    Estado general del negocio.
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,

                      p: 2.5,

                      borderRadius: "16px",

                      bgcolor: "#F7F9FB",

                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 30,

                        fontWeight: 700,

                        color: "primary.main",
                      }}
                    >
                      {data.occupancy_rate}%
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.4,

                        fontSize: 11,

                        color: "text.secondary",
                      }}
                    >
                      Ocupación del mes
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={Math.min(data.occupancy_rate, 100)}
                      sx={{
                        mt: 2,

                        height: 7,

                        borderRadius: 999,

                        bgcolor: "#E8ECEF",

                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                        },
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,

                        fontSize: 10.5,

                        color: "#98A2B3",
                      }}
                    >
                      {data.occupied_days}
                      {" de "}
                      {data.days_in_month}
                      {" días"}
                    </Typography>
                  </Box>

                  <Stack spacing={1.3} sx={{ mt: 2.5 }}>
                    <SummaryRow
                      icon={<AccountBalanceWalletOutlined />}
                      label="Saldo por cobrar"
                      value={currency(data.pending_balance)}
                    />

                    <SummaryRow
                      icon={<GroupsOutlined />}
                      label="Clientes activos"
                      value={data.active_clients.toString()}
                    />

                    <SummaryRow
                      icon={<ReceiptLongOutlined />}
                      label="Gastos del mes"
                      value={currency(data.expenses_total)}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* ACCIONES RÁPIDAS */}

            <Grid
              size={{
                xs: 12,
              }}
            >
              <Card>
                <CardContent
                  sx={{
                    p: 2.5,

                    "&:last-child": {
                      pb: 2.5,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,

                      fontWeight: 700,
                    }}
                  >
                    Acciones rápidas
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,

                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr",

                        sm: "repeat(2, 1fr)",

                        lg: "repeat(4, 1fr)",
                      },

                      gap: 1.5,
                    }}
                  >
                    <QuickAction
                      title="Reservaciones"
                      description="Administrar eventos"
                      onClick={() => navigate("/admin/reservaciones")}
                    />

                    <QuickAction
                      title="Calendario"
                      description="Consultar disponibilidad"
                      onClick={() => navigate("/admin/calendario")}
                    />

                    <QuickAction
                      title="Pagos"
                      description="Ver movimientos"
                      onClick={() => navigate("/admin/pagos")}
                    />

                    <QuickAction
                      title="Gastos"
                      description="Registrar egresos"
                      onClick={() => navigate("/admin/gastos")}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

interface SummaryRowProps {
  icon: ReactNode;

  label: string;

  value: string;
}

function SummaryRow({ icon, label, value }: SummaryRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1.3,
      }}
    >
      <Box
        sx={{
          width: 38,

          height: 38,

          borderRadius: "11px",

          bgcolor: "#EDF3F7",

          color: "primary.main",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 10.5,

            color: "text.secondary",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,

            fontSize: 13,

            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

interface QuickActionProps {
  title: string;

  description: string;

  onClick: () => void;
}

function QuickAction({ title, description, onClick }: QuickActionProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1.8,

        border: "1px solid #EAECF0",

        borderRadius: "13px",

        cursor: "pointer",

        transition: "all .2s ease",

        "&:hover": {
          borderColor: "primary.light",

          bgcolor: "#F8FAFC",

          transform: "translateY(-1px)",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 12.5,

          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.4,

          fontSize: 10.5,

          color: "text.secondary",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
