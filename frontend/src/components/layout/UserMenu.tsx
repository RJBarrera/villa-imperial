import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlined from "@mui/icons-material/PersonOutlineOutlined";

import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./UserMenu.css";

export default function UserMenu() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) {
    return null;
  }

  const menuOpen = Boolean(anchorEl);

  const initials = user.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const roleLabel = user.role === "admin" ? "Administrador" : user.role;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleConfiguration = () => {
    handleCloseMenu();

    navigate("/admin/configuracion");
  };

  const handleLogout = async () => {
    handleCloseMenu();

    await logout();

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <>
      <Stack direction="row" className="user-menu">
        {/* INFORMACIÓN */}

        <Box className="user-menu__info">
          <Typography className="user-menu__name">{user.full_name}</Typography>

          <Typography className="user-menu__role">{roleLabel}</Typography>
        </Box>

        {/* AVATAR */}

        <IconButton
          id="user-menu-button"
          aria-label="Abrir menú de usuario"
          aria-controls={menuOpen ? "user-menu-dropdown" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          onClick={handleOpenMenu}
          className="user-menu__button"
        >
          <Avatar className="user-menu__avatar">{initials}</Avatar>
        </IconButton>
      </Stack>

      {/* MENÚ */}

      <Menu
        id="user-menu-dropdown"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        slotProps={{
          list: {
            "aria-labelledby": "user-menu-button",
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="user-menu__dropdown"
      >
        <Box className="user-menu__dropdown-header">
          <Typography className="user-menu__dropdown-name">
            {user.full_name}
          </Typography>

          <Typography className="user-menu__dropdown-role">
            {roleLabel}
          </Typography>
        </Box>

        <MenuItem onClick={handleConfiguration} className="user-menu__item">
          <ListItemIcon className="user-menu__item-icon">
            <PersonOutlineOutlined />
          </ListItemIcon>
          Configuración
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          className="user-menu__item user-menu__item--logout"
        >
          <ListItemIcon className="user-menu__item-icon">
            <LogoutOutlined />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
