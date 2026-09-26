import {
  AddOutlined,
  EmailOutlined,
  GroupsOutlined,
  MoreHorizOutlined,
  PhoneOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

import { getClients } from "../api/clients";

import ClientDialog from "../components/clients/ClientDialog";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function ClientsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: clients = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clients", search],

    queryFn: () => getClients(search),
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
            Clientes
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            Consulta y administra los clientes de Villa Imperial.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setDialogOpen(true)}
        >
          Nuevo cliente
        </Button>
      </Stack>

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
              mb: 2.5,
            }}
          >
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, teléfono o correo..."
              sx={{
                width: {
                  xs: "100%",
                  sm: 360,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              {clients.length} clientes
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
              No fue posible cargar los clientes.
            </Typography>
          )}

          {!isLoading && !isError && clients.length === 0 && (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <GroupsOutlined
                sx={{
                  fontSize: 52,
                  color: "#98A2B3",
                }}
              />

              <Typography
                sx={{
                  mt: 1,
                  fontWeight: 600,
                }}
              >
                No hay clientes
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 12,
                  color: "text.secondary",
                }}
              >
                Registra tu primer cliente para comenzar.
              </Typography>
            </Box>
          )}

          <Stack spacing={1}>
            {clients.map((client) => (
              <Box
                key={client.id}
                sx={{
                  p: 1.5,

                  border: "1px solid #EAECF0",

                  borderRadius: "13px",

                  display: "flex",

                  alignItems: "center",

                  gap: 1.5,

                  transition: "background-color .2s",

                  "&:hover": {
                    backgroundColor: "#FAFBFC",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#EDF3F7",
                    color: "primary.main",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {initials(client.full_name)}
                </Avatar>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {client.full_name}
                  </Typography>

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={{
                      xs: 0.3,
                      sm: 2,
                    }}
                    sx={{ mt: 0.4 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <PhoneOutlined
                        sx={{
                          fontSize: 14,
                          color: "text.secondary",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "text.secondary",
                        }}
                      >
                        {client.phone}
                      </Typography>
                    </Box>

                    {client.email && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <EmailOutlined
                          sx={{
                            fontSize: 14,
                            color: "text.secondary",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "text.secondary",
                          }}
                        >
                          {client.email}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <IconButton size="small">
                  <MoreHorizOutlined />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <ClientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={() =>
          queryClient.invalidateQueries({
            queryKey: ["clients"],
          })
        }
      />
    </Box>
  );
}
