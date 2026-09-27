import {
  AccountBalanceWalletOutlined,
  AssessmentOutlined,
  CalendarMonthOutlined,
  DashboardOutlined,
  EventAvailableOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  PaidOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

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

import { useLocation, useNavigate } from "react-router-dom";

export const DRAWER_WIDTH = 270;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
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
    navigate(path);

    if (!isDesktop) {
      onClose();
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #173B57 0%, #102B40 100%)",
        color: "#FFFFFF",
      }}
    >
      {/* Logo */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.4,
          px: 2.2,
          py: 2.2,

          borderBottom: "1px solid rgba(255,255,255,.10)",
        }}
      >
        <Box
          component="img"
          src="/villa/logo.jpg"
          alt="Villa Imperial"
          sx={{
            width: 48,
            height: 48,
            objectFit: "cover",
            borderRadius: "50%",
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,.18)",
            boxShadow: "0 4px 14px rgba(0,0,0,.18)",
          }}
        />

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.2,
            }}
          >
            Villa Imperial
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: 10,
              color: "rgba(255,255,255,.62)",
            }}
          >
            Administración
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2 }}>
        <Divider
          sx={{
            borderColor: "rgba(255,255,255,.10)",
          }}
        />
      </Box>

      {/* Menu */}

      <Box
        sx={{
          px: 1.5,
          mt: 2,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            px: 2,
            mb: 1,
            fontSize: 10.5,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 1.3,
            color: "rgba(255,255,255,.45)",
          }}
        >
          Menú principal
        </Typography>

        <List disablePadding>
          {menuItems.map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: "12px",
                  mb: 0.6,
                  px: 2,
                  minHeight: 48,
                  color: active ? "#FFFFFF" : "rgba(255,255,255,.72)",
                  "& .MuiListItemIcon-root": {
                    color: active ? "#D7B66F" : "rgba(255,255,255,.65)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,.10)",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(255,255,255,.13)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,.07)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 39,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Settings */}

      <Box sx={{ px: 1.5, pb: 2 }}>
        <Divider
          sx={{
            mb: 1.5,
            borderColor: "rgba(255,255,255,.10)",
          }}
        />

        <ListItemButton
          selected={location.pathname.startsWith("/admin/configuracion")}
          onClick={() => handleNavigation("/admin/configuracion")}
          sx={{
            borderRadius: "12px",
            color: "rgba(255,255,255,.72)",
            "& .MuiListItemIcon-root": {
              color: "rgba(255,255,255,.65)",
            },
            "&.Mui-selected": {
              color: "#FFFFFF",
              backgroundColor: "rgba(255,255,255,.10)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 39,
            }}
          >
            <SettingsOutlined />
          </ListItemIcon>

          <ListItemText
            primary="Configuración"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: 14,
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop */}

      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
