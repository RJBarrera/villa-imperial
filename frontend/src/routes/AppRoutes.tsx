import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import PublicHomePage from "../pages/PublicHomePage";

import LoginPage from "../pages/LoginPage";

import DashboardPage from "../pages/DashboardPage";

import CalendarPage from "../pages/CalendarPage";

import BookingsPage from "../pages/BookingsPage";

import ClientsPage from "../pages/ClientsPage";

import PaymentsPage from "../pages/PaymentsPage";

import PackagesPage from "../pages/PackagesPage";

import ExpensesPage from "../pages/ExpensesPage";

import ReportsPage from "../pages/ReportsPage";

import SettingsPage from "../pages/SettingsPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ====================== */}
      {/* SITIO PÚBLICO         */}
      {/* ====================== */}

      <Route path="/" element={<PublicHomePage />} />

      {/* ====================== */}
      {/* LOGIN ADMIN           */}
      {/* ====================== */}

      <Route path="/admin/login" element={<LoginPage />} />

      {/* Compatibilidad temporal */}

      <Route path="/login" element={<Navigate to="/admin/login" replace />} />

      {/* ====================== */}
      {/* ADMIN PROTEGIDO       */}
      {/* ====================== */}

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="calendario" element={<CalendarPage />} />

          <Route path="reservaciones" element={<BookingsPage />} />

          <Route path="clientes" element={<ClientsPage />} />

          <Route path="pagos" element={<PaymentsPage />} />

          <Route path="paquetes" element={<PackagesPage />} />

          <Route path="gastos" element={<ExpensesPage />} />

          <Route path="reportes" element={<ReportsPage />} />

          <Route path="configuracion" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ====================== */}
      {/* RUTA DESCONOCIDA      */}
      {/* ====================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
