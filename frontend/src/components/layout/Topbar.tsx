import MenuOutlined from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { DRAWER_WIDTH } from "./Sidebar";
import UserMenu from "./UserMenu";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: {
          xs: "100%",
          md: `calc(100% - ${DRAWER_WIDTH}px)`,
        },

        ml: {
          xs: 0,
          md: `${DRAWER_WIDTH}px`,
        },

        backgroundColor: "rgba(255,255,255,.96)",

        backdropFilter: "blur(12px)",

        borderBottom: "1px solid #EAECF0",

        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: "68px !important",
            md: "76px !important",
          },

          px: {
            xs: 2,
            sm: 2.5,
            md: 3.5,
          },

          display: "flex",

          alignItems: "center",

          width: "100%",
        }}
      >
        {/* IZQUIERDA */}

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <IconButton
            onClick={onMenuClick}
            edge="start"
            aria-label="Abrir menú"
            sx={{
              display: {
                xs: "inline-flex",
                md: "none",
              },
            }}
          >
            <MenuOutlined />
          </IconButton>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,

                fontSize: {
                  xs: 16,
                  sm: 17,
                },

                lineHeight: 1.2,

                color: "text.primary",

                whiteSpace: "nowrap",
              }}
            >
              Villa Imperial
            </Typography>

            <Typography
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },

                mt: 0.25,

                fontSize: 11,

                lineHeight: 1.2,

                color: "text.secondary",

                whiteSpace: "nowrap",
              }}
            >
              Sistema de administración
            </Typography>
          </Box>
        </Stack>

        {/* DERECHA */}

        <Stack
          direction="row"
          spacing={{
            xs: 0.5,
            sm: 1.2,
          }}
          sx={{
            ml: "auto",

            alignItems: "center",

            flexShrink: 0,
          }}
        >
          {/* NOTIFICACIONES */}

          <IconButton
            aria-label="Notificaciones"
            sx={{
              width: 40,
              height: 40,
            }}
          >
            <Badge
              badgeContent={2}
              color="error"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 9,
                  minWidth: 17,
                  height: 17,
                  fontWeight: 700,
                },
              }}
            >
              <NotificationsNoneOutlined
                sx={{
                  fontSize: 22,
                }}
              />
            </Badge>
          </IconButton>

          {/* SEPARADOR */}

          <Box
            sx={{
              width: "1px",
              height: 32,

              backgroundColor: "#EAECF0",

              mx: {
                xs: 0.25,
                sm: 0.5,
              },

              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          {/* USUARIO */}

          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
