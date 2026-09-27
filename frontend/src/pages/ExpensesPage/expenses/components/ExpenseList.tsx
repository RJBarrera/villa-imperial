import type { ExpenseListItem as ExpenseItem } from "../expenses.types";
import ExpenseListItem from "./ExpenseListItem";

interface ExpenseListProps {
  expenses: ExpenseItem[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div className="expenses-list">
      {expenses.map((expense) => (
        <ExpenseListItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
