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

export default function UserMenu() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) {
    return null;
  }

  const initials = user.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setAnchorEl(null);

    await logout();

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <>
      <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
        <Box
          sx={{
            display: {
              xs: "none",

              sm: "block",
            },

            textAlign: "right",
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              fontWeight: 600,
              lineHeight: 1.2,

              whiteSpace: "nowrap",

              maxWidth: 180,

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {user.full_name}
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: 9.5,
              lineHeight: 1.2,
              color: "text.secondary",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {user.role === "admin" ? "Administrador" : user.role}
          </Typography>
        </Box>

        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <Avatar
            sx={{
              width: 36,

              height: 36,

              bgcolor: "primary.main",

              fontSize: 11,

              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);

            navigate("/admin/configuracion");
          }}
        >
          <ListItemIcon>
            <PersonOutlineOutlined fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
