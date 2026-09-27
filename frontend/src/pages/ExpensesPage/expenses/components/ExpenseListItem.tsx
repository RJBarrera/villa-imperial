import { Chip, Typography } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { ExpenseListItem as ExpenseItem } from "../expenses.types";
import { formatCurrency } from "../expenses.utils";

dayjs.locale("es");

interface ExpenseListItemProps {
  expense: ExpenseItem;
}

export default function ExpenseListItem({
  expense,
}: ExpenseListItemProps) {
  return (
    <article className="expense-item">
      <div className="expense-item__content">
        <div className="expense-item__title-row">
          <Typography className="expense-item__title">
            {expense.concept}
          </Typography>

          {expense.category && (
            <Chip
              size="small"
              label={expense.category}
              className="expense-item__category"
            />
          )}
        </div>

        <Typography className="expense-item__meta">
          {dayjs(expense.spent_at).format("DD MMM YYYY")}
          {expense.payment_method
            ? ` · ${expense.payment_method}`
            : ""}
        </Typography>

        {expense.notes && (
          <Typography className="expense-item__notes">
            {expense.notes}
          </Typography>
        )}
      </div>

      <Typography className="expense-item__amount">
        -{formatCurrency(expense.amount)}
      </Typography>
    </article>
  );
}
