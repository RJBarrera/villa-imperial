import MenuOutlined from "@mui/icons-material/MenuOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";

import {
  AppBar,
  // Badge,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import type { CSSProperties } from "react";

import { DRAWER_WIDTH } from "./Sidebar";
import UserMenu from "./UserMenu";

import "./Topbar.css";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      className="topbar"
      style={
        {
          "--topbar-drawer-width": `${DRAWER_WIDTH}px`,
        } as CSSProperties
      }
    >
      <Toolbar className="topbar__toolbar">
        {/* IZQUIERDA */}

        <Stack direction="row" className="topbar__left">
          <IconButton
            onClick={onMenuClick}
            edge="start"
            aria-label="Abrir menú"
            className="topbar__menu-button"
          >
            <MenuOutlined />
          </IconButton>

          <Box className="topbar__brand">
            <Typography className="topbar__title">Villa Imperial</Typography>

            <Typography className="topbar__subtitle">
              Sistema de administración
            </Typography>
          </Box>
        </Stack>

        {/* DERECHA */}

        <Stack direction="row" className="topbar__right">
          {/* NOTIFICACIONES */}

          <IconButton
            aria-label="Notificaciones"
            className="topbar__notification-button"
          >
            {/* <Badge
              badgeContent={2}
              color="error"
              overlap="circular"
              className="topbar__notification-badge"
            > */}
              <NotificationsNoneOutlined />
            {/* </Badge> */}
          </IconButton>

          {/* SEPARADOR */}

          <Box className="topbar__divider" />

          {/* USUARIO */}

          <UserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
