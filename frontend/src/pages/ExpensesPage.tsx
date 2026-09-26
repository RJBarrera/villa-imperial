import AddOutlined from "@mui/icons-material/AddOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useMemo, useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { getExpenses } from "../api/expenses";

import ExpenseDialog from "../components/expenses/ExpenseDialog";

dayjs.locale("es");

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export default function ExpensesPage() {
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  const [dialogOpen, setDialogOpen] = useState(false);

  const dateFrom = dayjs(`${selectedMonth}-01`)
    .startOf("month")
    .format("YYYY-MM-DD");

  const dateTo = dayjs(`${selectedMonth}-01`)
    .endOf("month")
    .format("YYYY-MM-DD");

  const {
    data: expenses = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["expenses", selectedMonth],

    queryFn: () =>
      getExpenses({
        date_from: dateFrom,

        date_to: dateTo,
      }),
  });

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + Number(expense.amount), 0),
    [expenses],
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
        sx={{
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
            Gastos
          </Typography>

          <Typography
            sx={{
              mt: 0.7,

              fontSize: 13,

              color: "text.secondary",
            }}
          >
            Registra y controla los egresos de Villa Imperial.
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
              sm: "auto",
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
            onClick={() => setDialogOpen(true)}
          >
            Registrar gasto
          </Button>
        </Stack>
      </Stack>

      {/* RESUMEN */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md: "repeat(2, 1fr)",
          },

          gap: 2,

          mb: 2,
        }}
      >
        <Card>
          <CardContent>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,

                    color: "text.secondary",
                  }}
                >
                  Gastos del mes
                </Typography>

                <Typography
                  sx={{
                    mt: 0.7,

                    fontSize: 28,

                    fontWeight: 700,
                  }}
                >
                  {currency(total)}
                </Typography>
              </Box>

              <AccountBalanceWalletOutlined
                sx={{
                  fontSize: 36,

                  color: "error.main",
                }}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,

                    color: "text.secondary",
                  }}
                >
                  Movimientos
                </Typography>

                <Typography
                  sx={{
                    mt: 0.7,

                    fontSize: 28,

                    fontWeight: 700,
                  }}
                >
                  {expenses.length}
                </Typography>
              </Box>

              <ReceiptLongOutlined
                sx={{
                  fontSize: 36,

                  color: "primary.main",
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* LISTADO */}

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

              mb: 2,
            }}
          >
            Movimientos del mes
          </Typography>

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
              No fue posible consultar los gastos.
            </Typography>
          )}

          {!isLoading && !isError && expenses.length === 0 && (
            <Box
              sx={{
                py: 8,

                textAlign: "center",
              }}
            >
              <ReceiptLongOutlined
                sx={{
                  fontSize: 50,

                  color: "#98A2B3",
                }}
              />

              <Typography
                sx={{
                  mt: 1,

                  fontWeight: 700,
                }}
              >
                Sin gastos registrados
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,

                  fontSize: 12,

                  color: "text.secondary",
                }}
              >
                Los gastos del mes aparecerán aquí.
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            {expenses.map((expense) => (
              <Box
                key={expense.id}
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

                  "&:hover": {
                    bgcolor: "#FAFBFC",
                  },
                }}
              >
                <Box>
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", flexWrap: "wrap" }}
                    spacing={1}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,

                        fontWeight: 700,
                      }}
                    >
                      {expense.concept}
                    </Typography>

                    {expense.category && (
                      <Chip
                        size="small"
                        label={expense.category}
                        sx={{
                          height: 21,

                          fontSize: 9.5,
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    sx={{
                      mt: 0.4,

                      fontSize: 10.5,

                      color: "text.secondary",
                    }}
                  >
                    {dayjs(expense.spent_at).format("DD MMM YYYY")}

                    {expense.payment_method
                      ? ` · ${expense.payment_method}`
                      : ""}
                  </Typography>

                  {expense.notes && (
                    <Typography
                      sx={{
                        mt: 0.4,

                        fontSize: 10.5,

                        color: "#98A2B3",
                      }}
                    >
                      {expense.notes}
                    </Typography>
                  )}
                </Box>

                <Typography
                  sx={{
                    fontSize: 17,

                    fontWeight: 700,

                    color: "error.main",
                  }}
                >
                  -{currency(expense.amount)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <ExpenseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={() =>
          queryClient.invalidateQueries({
            queryKey: ["expenses"],
          })
        }
      />
    </Box>
  );
}
