import DashboardHeader from "./dashboard/components/DashboardHeader";
import DashboardState from "./dashboard/components/DashboardState";
import DashboardStats from "./dashboard/components/DashboardStats";
import OperationalControl from "./dashboard/components/OperationalControl";
import QuickActions from "./dashboard/components/QuickActions";
import UpcomingBookings from "./dashboard/components/UpcomingBookings";
import { useDashboardPage } from "./dashboard/useDashboardPage";
import "./DashboardPage.css";

export default function DashboardPage() {
  const dashboard = useDashboardPage();

  return (
    <main className="dashboard-page">
      <DashboardHeader
        selectedMonth={dashboard.selectedMonth}
        onMonthChange={dashboard.setSelectedMonth}
        onCreateBooking={dashboard.goToBookings}
      />

      <DashboardState
        isLoading={dashboard.isLoading}
        isError={dashboard.isError}
      />

      {dashboard.data && (
        <>
          <DashboardStats data={dashboard.data} />

          <section className="dashboard-main-grid">
            <UpcomingBookings
              bookings={dashboard.data.upcoming_bookings}
              onOpenCalendar={dashboard.goToCalendar}
              onOpenBookings={dashboard.goToBookings}
            />

            <OperationalControl data={dashboard.data} />
          </section>

          <QuickActions
            onBookings={dashboard.goToBookings}
            onCalendar={dashboard.goToCalendar}
            onPayments={dashboard.goToPayments}
            onExpenses={dashboard.goToExpenses}
          />
        </>
      )}
    </main>
  );
}
