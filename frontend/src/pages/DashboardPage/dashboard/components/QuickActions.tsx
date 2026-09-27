import { Typography } from "@mui/material";

interface QuickActionsProps {
  onBookings: () => void;
  onCalendar: () => void;
  onPayments: () => void;
  onExpenses: () => void;
}

export default function QuickActions({
  onBookings,
  onCalendar,
  onPayments,
  onExpenses,
}: QuickActionsProps) {
  const actions = [
    {
      title: "Reservaciones",
      description: "Administrar eventos",
      onClick: onBookings,
    },
    {
      title: "Calendario",
      description: "Consultar disponibilidad",
      onClick: onCalendar,
    },
    {
      title: "Pagos",
      description: "Ver movimientos",
      onClick: onPayments,
    },
    {
      title: "Gastos",
      description: "Registrar egresos",
      onClick: onExpenses,
    },
  ];

  return (
    <section className="dashboard-panel dashboard-quick-actions">
      <Typography className="dashboard-panel__title">
        Acciones rápidas
      </Typography>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="quick-action"
            onClick={action.onClick}
          >
            <Typography className="quick-action__title">
              {action.title}
            </Typography>
            <Typography className="quick-action__description">
              {action.description}
            </Typography>
          </button>
        ))}
      </div>
    </section>
  );
}
