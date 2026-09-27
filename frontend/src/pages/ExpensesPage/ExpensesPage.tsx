import ExpenseDialog from "../../components/expenses/ExpenseDialog";
import ExpenseList from "./expenses/components/ExpenseList";
import ExpensesHeader from "./expenses/components/ExpensesHeader";
import ExpensesState from "./expenses/components/ExpensesState";
import ExpensesSummary from "./expenses/components/ExpensesSummary";
import { useExpensesPage } from "./expenses/useExpensesPage";
import "./ExpensesPage.css";

export default function ExpensesPage() {
  const expensesPage = useExpensesPage();

  return (
    <main className="expenses-page">
      <ExpensesHeader
        selectedMonth={expensesPage.selectedMonth}
        onMonthChange={expensesPage.setSelectedMonth}
        onCreate={() => expensesPage.setDialogOpen(true)}
      />

      <ExpensesSummary
        total={expensesPage.total}
        movements={expensesPage.expenses.length}
      />

      <section className="expenses-card">
        <h2 className="expenses-card__title">Movimientos del mes</h2>

        <ExpensesState
          isLoading={expensesPage.isLoading}
          isError={expensesPage.isError}
          isEmpty={
            !expensesPage.isLoading &&
            !expensesPage.isError &&
            expensesPage.expenses.length === 0
          }
        />

        {!expensesPage.isLoading &&
          !expensesPage.isError &&
          expensesPage.expenses.length > 0 && (
            <ExpenseList expenses={expensesPage.expenses} />
          )}
      </section>

      <ExpenseDialog
        open={expensesPage.dialogOpen}
        onClose={() => expensesPage.setDialogOpen(false)}
        onCreated={expensesPage.handleExpenseCreated}
      />
    </main>
  );
}
