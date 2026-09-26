import LockOutlined from "@mui/icons-material/LockOutlined";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import type { AxiosError } from "axios";

import { useAuth } from "../context/AuthContext";

interface LoginError {
  detail?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const { user, login } = useAuth();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const mutation = useMutation({
    mutationFn: () =>
      login({
        username: username.trim(),

        password,
      }),

    onSuccess: () => {
      navigate("/admin", {
        replace: true,
      });
    },
  });

  const error = mutation.error as AxiosError<LoginError> | null;

  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        px: 2,

        bgcolor: "#F4F6F8",

        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(23,59,87,.08), transparent 35%), radial-gradient(circle at 85% 75%, rgba(198,161,91,.10), transparent 30%)",
      }}
    >
      <Card
        sx={{
          width: "100%",

          maxWidth: 430,

          borderRadius: "20px",

          boxShadow: "0 20px 60px rgba(16,24,40,.10)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,

              sm: 4,
            },

            "&:last-child": {
              pb: {
                xs: 3,

                sm: 4,
              },
            },
          }}
        >
          <Stack sx={{ alignItems: "center", mb: 3.5 }}>
            <Box
              sx={{
                width: 58,

                height: 58,

                borderRadius: "17px",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                bgcolor: "primary.main",

                color: "#FFFFFF",
              }}
            >
              <LockOutlined />
            </Box>

            <Typography
              sx={{
                mt: 2,

                fontSize: 24,

                fontWeight: 700,

                color: "primary.main",
              }}
            >
              Villa Imperial
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: 12,

                color: "text.secondary",

                textAlign: "center",
              }}
            >
              Panel administrativo
            </Typography>
          </Stack>

          {mutation.isError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
              }}
            >
              {error?.response?.data?.detail ??
                "No fue posible iniciar sesión."}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              fullWidth
              required
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  mutation.mutate();
                }
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !username.trim() || !password}
              sx={{
                minHeight: 48,

                mt: 1,
              }}
            >
              {mutation.isPending ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </Stack>

          <Typography
            sx={{
              mt: 3,

              fontSize: 10.5,

              color: "#98A2B3",

              textAlign: "center",
            }}
          >
            Acceso exclusivo para administración de Villa Imperial.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
