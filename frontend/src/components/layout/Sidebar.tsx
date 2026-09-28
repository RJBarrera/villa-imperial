import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import PaidOutlined from "@mui/icons-material/PaidOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import type { CSSProperties, ReactNode } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import "./Sidebar.css";

export const DRAWER_WIDTH = 270;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: "Panel principal",
    path: "/admin",
    icon: <DashboardOutlined />,
  },
  {
    label: "Calendario",
    path: "/admin/calendario",
    icon: <CalendarMonthOutlined />,
  },
  {
    label: "Reservaciones",
    path: "/admin/reservaciones",
    icon: <EventAvailableOutlined />,
  },
  {
    label: "Clientes",
    path: "/admin/clientes",
    icon: <GroupsOutlined />,
  },
  {
    label: "Pagos",
    path: "/admin/pagos",
    icon: <PaidOutlined />,
  },
  {
    label: "Paquetes",
    path: "/admin/paquetes",
    icon: <Inventory2Outlined />,
  },
  {
    label: "Gastos",
    path: "/admin/gastos",
    icon: <AccountBalanceWalletOutlined />,
  },
  {
    label: "Reportes",
    path: "/admin/reportes",
    icon: <AssessmentOutlined />,
  },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }

    if (!isDesktop) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const settingsActive = isActive("/admin/configuracion");

  const drawerContent = (
    <Box className="sidebar">
      {/* LOGO */}

      <Box className="sidebar__header">
        <Box
          component="img"
          src="/villa/logo.png"
          alt="Villa Imperial"
          className="sidebar__logo"
        />

        <Box className="sidebar__brand">
          <Typography className="sidebar__brand-name">
            Villa Imperial
          </Typography>

          <Typography className="sidebar__brand-subtitle">
            Administración
          </Typography>
        </Box>
      </Box>

      {/* MENÚ */}

      <Box
        component="nav"
        className="sidebar__navigation"
        aria-label="Menú principal"
      >
        <Typography className="sidebar__section-title">
          Menú principal
        </Typography>

        <List disablePadding className="sidebar__menu">
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => handleNavigation(item.path)}
                className="sidebar__menu-item"
              >
                <ListItemIcon className="sidebar__menu-icon">
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  className="sidebar__menu-text"
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* CONFIGURACIÓN */}

      <Box className="sidebar__footer">
        <Divider className="sidebar__footer-divider" />

        <ListItemButton
          selected={settingsActive}
          onClick={() => handleNavigation("/admin/configuracion")}
          className="sidebar__menu-item sidebar__settings"
        >
          <ListItemIcon className="sidebar__menu-icon">
            <SettingsOutlined />
          </ListItemIcon>

          <ListItemText
            primary="Configuración"
            className="sidebar__menu-text"
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  const drawerStyle = {
    "--sidebar-width": `${DRAWER_WIDTH}px`,
  } as CSSProperties;

  return (
    <>
      {/* DESKTOP */}

      <Drawer
        variant="permanent"
        open
        className="sidebar__drawer sidebar__drawer--desktop"
        style={drawerStyle}
      >
        {drawerContent}
      </Drawer>

      {/* MOBILE */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        className="sidebar__drawer sidebar__drawer--mobile"
        style={drawerStyle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
