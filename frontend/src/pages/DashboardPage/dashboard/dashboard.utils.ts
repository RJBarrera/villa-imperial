export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function formatBookingStatus(status: string) {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    apartado: "Apartado",
    confirmado: "Confirmado",
    liquidado: "Liquidado",
    cancelado: "Cancelado",
    concluido: "Concluido",
    bloqueado: "Bloqueado",
  };

  return labels[status] ?? status;
}

export function getBookingStatusClass(status: string) {
  return `dashboard-status dashboard-status--${status}`;
}
