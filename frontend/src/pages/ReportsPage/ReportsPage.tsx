import BookingStatuses from "./reports/components/BookingStatuses";
import EventTypesChart from "./reports/components/EventTypesChart";
import FinancialChart from "./reports/components/FinancialChart";
import MonthlyBookingsChart from "./reports/components/MonthlyBookingsChart";
import RankingSection from "./reports/components/RankingSection";
import ReportsHeader from "./reports/components/ReportsHeader";
import ReportsMiniStats from "./reports/components/ReportsMiniStats";
import ReportsState from "./reports/components/ReportsState";
import ReportsStats from "./reports/components/ReportsStats";
import { useReportsPage } from "./reports/useReportsPage";
import "./ReportsPage.css";

export default function ReportsPage() {
  const reports = useReportsPage();

  return (
    <main className="reports-page">
      <ReportsHeader
        selectedYear={reports.selectedYear}
        years={reports.years}
        onYearChange={reports.setSelectedYear}
      />

      <ReportsState
        isLoading={reports.isLoading}
        isError={reports.isError}
      />

      {reports.data && (
        <>
          <ReportsStats
            data={reports.data}
            selectedYear={reports.selectedYear}
          />

          <ReportsMiniStats data={reports.data} />

          <section className="reports-main-grid">
            <FinancialChart data={reports.monthlyData} />
            <MonthlyBookingsChart data={reports.monthlyData} />
          </section>

          <section className="reports-double-grid">
            <RankingSection
              title="Paquetes más rentados"
              subtitle="Cantidad de reservaciones por paquete."
              items={reports.packageData.map((item, index) => ({
                position: index + 1,
                title: item.name,
                subtitle: `${item.bookings} reservaciones`,
                value: reports.formatCurrency(item.value),
              }))}
            />

            <RankingSection
              title="Gastos por categoría"
              subtitle="Distribución de egresos."
              items={reports.expenseCategoryData.map((item, index) => ({
                position: index + 1,
                title: item.name,
                subtitle: `${item.count} movimientos`,
                value: reports.formatCurrency(item.total),
              }))}
            />
          </section>

          <section className="reports-bottom-grid">
            <EventTypesChart data={reports.eventData} />
            <BookingStatuses statuses={reports.data.statuses} />
          </section>
        </>
      )}
    </main>
  );
}
