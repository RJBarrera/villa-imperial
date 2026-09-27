import PaymentList from "./payments/components/PaymentList";
import PaymentsHeader from "./payments/components/PaymentsHeader";
import PaymentsState from "./payments/components/PaymentsState";
import PaymentsSummary from "./payments/components/PaymentsSummary";
import { usePaymentsPage } from "./payments/usePaymentsPage";
import "./PaymentsPage.css";

export default function PaymentsPage() {
  const paymentsPage = usePaymentsPage();

  return (
    <main className="payments-page">
      <PaymentsHeader />

      <PaymentsSummary
        totalReceived={paymentsPage.totalReceived}
        deposits={paymentsPage.deposits}
        installments={paymentsPage.installments}
        settlements={paymentsPage.settlements}
        movements={paymentsPage.payments.length}
      />

      <section className="payments-card">
        <div className="payments-card__header">
          <div>
            <h2 className="payments-card__title">Movimientos</h2>
            <p className="payments-card__subtitle">
              Historial financiero de reservaciones.
            </p>
          </div>

          <span className="payments-card__count">
            {paymentsPage.payments.length} registros
          </span>
        </div>

        <PaymentsState
          isLoading={paymentsPage.isLoading}
          isError={paymentsPage.isError}
          isEmpty={
            !paymentsPage.isLoading &&
            !paymentsPage.isError &&
            paymentsPage.payments.length === 0
          }
        />

        {!paymentsPage.isLoading &&
          !paymentsPage.isError &&
          paymentsPage.payments.length > 0 && (
            <PaymentList payments={paymentsPage.payments} />
          )}
      </section>
    </main>
  );
}
