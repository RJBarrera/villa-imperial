import type { ReactNode } from "react";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import SavingsOutlined from "@mui/icons-material/SavingsOutlined";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import { useMemo, useState } from "react";

import dayjs from "dayjs";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getReportSummary } from "../api/reports";

import StatCard from "../components/common/StatCard";

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function compactCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function ReportsPage() {
  const currentYear = dayjs().year();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports", selectedYear],

    queryFn: () => getReportSummary(selectedYear),
  });

  const years = useMemo(
    () =>
      Array.from(
        {
          length: 6,
        },
        (_, index) => currentYear - 4 + index,
      ).reverse(),
    [currentYear],
  );

  const monthlyData = useMemo(
    () =>
      data?.monthly.map((item) => ({
        month: item.label,

        income: Number(item.income),

        expenses: Number(item.expenses),

        profit: Number(item.profit),

        bookings: item.bookings,
      })) ?? [],
    [data],
  );

  const packageData = useMemo(
    () =>
      data?.packages.map((item) => ({
        name: item.name,

        bookings: item.bookings,

        value: Number(item.booked_value),
      })) ?? [],
    [data],
  );

  const expenseCategoryData = useMemo(
    () =>
      data?.expense_categories.map((item) => ({
        name: item.name,

        total: Number(item.total),

        count: item.count,
      })) ?? [],
    [data],
  );

  const eventData = useMemo(
    () =>
      data?.event_types.map((item) => ({
        name: item.name,

        bookings: item.bookings,
      })) ?? [],
    [data],
  );

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

          sm: "row",
        }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", sm: "center" }, mb: 3 }}
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
            Reportes
          </Typography>

          <Typography
            sx={{
              mt: 0.7,

              fontSize: 13,

              color: "text.secondary",
            }}
          >
            Analiza ingresos, gastos, rentabilidad y comportamiento de las
            reservaciones.
          </Typography>
        </Box>

        <TextField
          select
          label="Año"
          value={selectedYear}
          onChange={(event) => setSelectedYear(Number(event.target.value))}
          sx={{
            ml: {
              sm: "auto",
            },

            minWidth: 130,
          }}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

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

      {isError && (
        <Card>
          <CardContent>
            <Typography color="error" sx={{ fontWeight: 600 }}>
              No fue posible cargar los reportes.
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
                title="Ingresos"
                value={currency(data.income_total)}
                subtitle={`Recibidos durante ${selectedYear}`}
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
                title="Gastos"
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
                title="Utilidad"
                value={currency(data.profit_total)}
                subtitle="Ingresos menos gastos"
                icon={<SavingsOutlined />}
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
                title="Por cobrar"
                value={currency(data.pending_balance)}
                subtitle="Saldo de reservaciones"
                icon={<AccountBalanceWalletOutlined />}
                iconBackground="#FFF5E7"
                iconColor="#E69B32"
              />
            </Grid>
          </Grid>

          {/* SEGUNDO RESUMEN */}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid
              size={{
                xs: 12,

                sm: 4,
              }}
            >
              <MiniStatCard
                label="Reservaciones"
                value={data.bookings_total.toString()}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,

                sm: 4,
              }}
            >
              <MiniStatCard
                label="Valor reservado"
                value={currency(data.booked_value_total)}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,

                sm: 4,
              }}
            >
              <MiniStatCard
                label="Ticket promedio"
                value={currency(data.average_booking_value)}
              />
            </Grid>
          </Grid>

          {/* INGRESOS / GASTOS / UTILIDAD */}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid
              size={{
                xs: 12,

                xl: 8,
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
                    Comportamiento financiero
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,

                      fontSize: 11.5,

                      color: "text.secondary",
                    }}
                  >
                    Ingresos, gastos y utilidad por mes.
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,

                      width: "100%",

                      height: 330,
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 5,

                          right: 15,

                          left: 5,

                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis dataKey="month" fontSize={11} />

                        <YAxis fontSize={10} tickFormatter={compactCurrency} />

                        <Tooltip
                          formatter={(value) => currency(Number(value))}
                        />

                        <Legend />

                        <Line
                          type="monotone"
                          dataKey="income"
                          name="Ingresos"
                          stroke="#17875D"
                          strokeWidth={3}
                        />

                        <Line
                          type="monotone"
                          dataKey="expenses"
                          name="Gastos"
                          stroke="#D64545"
                          strokeWidth={3}
                        />

                        <Line
                          type="monotone"
                          dataKey="profit"
                          name="Utilidad"
                          stroke="#377DFF"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* RESERVACIONES POR MES */}

            <Grid
              size={{
                xs: 12,

                xl: 4,
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
                    Reservaciones
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,

                      fontSize: 11.5,

                      color: "text.secondary",
                    }}
                  >
                    Eventos reservados por mes.
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,

                      height: 330,
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                        <XAxis dataKey="month" fontSize={10} />

                        <YAxis allowDecimals={false} fontSize={10} />

                        <Tooltip />

                        <Bar
                          dataKey="bookings"
                          name="Reservaciones"
                          fill="#173B57"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* PAQUETES + GASTOS */}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid
              size={{
                xs: 12,

                lg: 6,
              }}
            >
              <ReportListCard
                title="Paquetes más rentados"
                subtitle="Cantidad de reservaciones por paquete."
              >
                {packageData.length === 0 ? (
                  <EmptyMessage />
                ) : (
                  <Stack spacing={1}>
                    {packageData.map((item, index) => (
                      <RankingRow
                        key={item.name}
                        position={index + 1}
                        title={item.name}
                        subtitle={`${item.bookings} reservaciones`}
                        value={currency(item.value)}
                      />
                    ))}
                  </Stack>
                )}
              </ReportListCard>
            </Grid>

            <Grid
              size={{
                xs: 12,

                lg: 6,
              }}
            >
              <ReportListCard
                title="Gastos por categoría"
                subtitle="Distribución de egresos."
              >
                {expenseCategoryData.length === 0 ? (
                  <EmptyMessage />
                ) : (
                  <Stack spacing={1}>
                    {expenseCategoryData.map((item, index) => (
                      <RankingRow
                        key={item.name}
                        position={index + 1}
                        title={item.name}
                        subtitle={`${item.count} movimientos`}
                        value={currency(item.total)}
                      />
                    ))}
                  </Stack>
                )}
              </ReportListCard>
            </Grid>
          </Grid>

          {/* TIPOS DE EVENTO */}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid
              size={{
                xs: 12,

                lg: 7,
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
                    Tipos de evento
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,

                      fontSize: 11.5,

                      color: "text.secondary",
                    }}
                  >
                    Eventos que más se realizan.
                  </Typography>

                  {eventData.length === 0 ? (
                    <EmptyMessage />
                  ) : (
                    <Box
                      sx={{
                        mt: 3,

                        height: Math.max(240, eventData.length * 55),
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={eventData}
                          layout="vertical"
                          margin={{
                            left: 20,

                            right: 20,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                          />

                          <XAxis type="number" allowDecimals={false} />

                          <YAxis
                            type="category"
                            dataKey="name"
                            width={110}
                            fontSize={10}
                          />

                          <Tooltip />

                          <Bar
                            dataKey="bookings"
                            name="Reservaciones"
                            fill="#C6A15B"
                            radius={[0, 5, 5, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* ESTADOS */}

            <Grid
              size={{
                xs: 12,

                lg: 5,
              }}
            >
              <ReportListCard
                title="Estado de reservaciones"
                subtitle="Distribución anual por estado."
              >
                {data.statuses.length === 0 ? (
                  <EmptyMessage />
                ) : (
                  <Stack spacing={1}>
                    {data.statuses.map((item) => (
                      <Box
                        key={item.status}
                        sx={{
                          p: 1.5,

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "space-between",

                          border: "1px solid #EAECF0",

                          borderRadius: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,

                            fontWeight: 600,

                            textTransform: "capitalize",
                          }}
                        >
                          {item.status}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 18,

                            fontWeight: 700,

                            color: "primary.main",
                          }}
                        >
                          {item.count}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </ReportListCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

interface MiniStatCardProps {
  label: string;

  value: string;
}

function MiniStatCard({ label, value }: MiniStatCardProps) {
  return (
    <Card>
      <CardContent
        sx={{
          p: 2,

          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 11,

            color: "text.secondary",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,

            fontSize: 21,

            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface ReportListCardProps {
  title: string;

  subtitle: string;

  children: ReactNode;
}

function ReportListCard({ title, subtitle, children }: ReportListCardProps) {
  return (
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
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,

            mb: 2.5,

            fontSize: 11.5,

            color: "text.secondary",
          }}
        >
          {subtitle}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

interface RankingRowProps {
  position: number;

  title: string;

  subtitle: string;

  value: string;
}

function RankingRow({ position, title, subtitle, value }: RankingRowProps) {
  return (
    <Box
      sx={{
        p: 1.4,

        display: "flex",

        alignItems: "center",

        gap: 1.3,

        border: "1px solid #EAECF0",

        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          width: 31,

          minWidth: 31,

          height: 31,

          borderRadius: "9px",

          bgcolor: "#EDF3F7",

          color: "primary.main",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          fontSize: 11,

          fontWeight: 700,
        }}
      >
        {position}
      </Box>

      <Box
        sx={{
          minWidth: 0,

          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,

            fontWeight: 600,

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.2,

            fontSize: 10.5,

            color: "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 12,

          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function EmptyMessage() {
  return (
    <Box
      sx={{
        py: 5,

        textAlign: "center",
      }}
    >
      <CalendarMonthOutlined
        sx={{
          fontSize: 40,

          color: "#98A2B3",
        }}
      />

      <Typography
        sx={{
          mt: 1,

          fontSize: 12,

          color: "text.secondary",
        }}
      >
        No existen datos para este periodo.
      </Typography>
    </Box>
  );
}
