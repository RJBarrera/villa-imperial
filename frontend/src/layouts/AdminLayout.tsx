import { useState } from "react";

import { Box, Toolbar } from "@mui/material";

import { Outlet } from "react-router-dom";

import Sidebar, { DRAWER_WIDTH } from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Topbar onMenuClick={() => setMobileOpen(true)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            xs: "100%",
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },

          minWidth: 0,
        }}
      >
        <Toolbar
          sx={{
            minHeight: {
              xs: "68px !important",
              md: "76px !important",
            },
          }}
        />

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 2.5,
              lg: 4,
            },

            py: {
              xs: 2.5,
              lg: 3.5,
            },

            maxWidth: 1700,
            mx: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
