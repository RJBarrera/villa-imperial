export const PACKAGE_DAYS = [
  { value: 0, label: "Lunes", shortLabel: "Lun" },
  { value: 1, label: "Martes", shortLabel: "Mar" },
  { value: 2, label: "Miércoles", shortLabel: "Mié" },
  { value: 3, label: "Jueves", shortLabel: "Jue" },
  { value: 4, label: "Viernes", shortLabel: "Vie" },
  { value: 5, label: "Sábado", shortLabel: "Sáb" },
  { value: 6, label: "Domingo", shortLabel: "Dom" },
] as const;

export const EMPTY_DAY_PRICES: Record<number, string> = {
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
};
