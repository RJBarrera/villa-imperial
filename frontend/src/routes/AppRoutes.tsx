import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import PublicHomePage from "../pages/PublicHomePage/PublicHomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import BookingsPage from "../pages/BookingsPage/BookingsPage";
import ClientsPage from "../pages/ClientsPage/ClientsPage";
import PaymentsPage from "../pages/PaymentsPage/PaymentsPage";
import PackagesPage from "../pages/PackagesPage/PackagesPage";
import ExpensesPage from "../pages/ExpensesPage/ExpensesPage";
import ReportsPage from "../pages/ReportsPage/ReportsPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
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
