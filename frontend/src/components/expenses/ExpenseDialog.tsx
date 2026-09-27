import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { createExpense } from "../../api/expenses";

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface FormState {
  concept: string;
  category: string;
  amount: string;
  spent_on: string;
  payment_method: string;
  notes: string;
}

const INITIAL_FORM: FormState = {
  concept: "",
  category: "",
  amount: "",
  spent_on: dayjs().format("YYYY-MM-DD"),
  payment_method: "",
  notes: "",
};

export default function ExpenseDialog({
  open,
  onClose,
  onCreated,
}: ExpenseDialogProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  useEffect(() => {
    if (open) {
      setForm({
        ...INITIAL_FORM,

        spent_on: dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: createExpense,

    onSuccess: () => {
      onCreated();
      onClose();
    },
  });

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,

      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !form.concept.trim() ||
      !form.amount ||
      Number(form.amount) <= 0 ||
      !form.spent_on
    ) {
      return;
    }

    mutation.mutate({
      concept: form.concept.trim(),
      category: form.category || null,
      amount: Number(form.amount),
      spent_on: form.spent_on,
      payment_method: form.payment_method || null,
      notes: form.notes.trim() || null,
    });
  };

  const errorDetail = (mutation.error as any)?.response?.data?.detail;

  return (
    <Dialog
      open={open}
      onClose={mutation.isPending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Registrar gasto
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {mutation.isError && (
            <Alert severity="error">
              {typeof errorDetail === "string"
                ? errorDetail
                : "No fue posible registrar el gasto."}
            </Alert>
          )}

          <TextField
            label="Concepto"
            placeholder="Ej. Limpieza después de evento"
            value={form.concept}
            onChange={(event) => handleChange("concept", event.target.value)}
            required
            fullWidth
          />

          <TextField
            select
            label="Categoría"
            value={form.category}
            onChange={(event) => handleChange("category", event.target.value)}
            fullWidth
          >
            <MenuItem value="">Sin categoría</MenuItem>
            <MenuItem value="Limpieza">Limpieza</MenuItem>
            <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
            <MenuItem value="Alberca">Alberca</MenuItem>
            <MenuItem value="Electricidad">Electricidad</MenuItem>
            <MenuItem value="Insumos">Insumos</MenuItem>
            <MenuItem value="Reparación">Reparación</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </TextField>

          <TextField
            label="Importe"
            type="number"
            value={form.amount}
            onChange={(event) => handleChange("amount", event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Fecha"
            type="date"
            value={form.spent_on}
            onChange={(event) => handleChange("spent_on", event.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            required
            fullWidth
          />

          <TextField
            select
            label="Forma de pago"
            value={form.payment_method}
            onChange={(event) =>
              handleChange("payment_method", event.target.value)
            }
            fullWidth
          >
            <MenuItem value="">No especificada</MenuItem>
            <MenuItem value="Efectivo">Efectivo</MenuItem>
            <MenuItem value="Transferencia">Transferencia</MenuItem>
            <MenuItem value="Tarjeta">Tarjeta</MenuItem>
            <MenuItem value="Otro">Otro</MenuItem>
          </TextField>

          <TextField
            label="Observaciones"
            value={form.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button color="inherit" onClick={onClose} disabled={mutation.isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            mutation.isPending ||
            !form.concept.trim() ||
            !form.amount ||
            Number(form.amount) <= 0 ||
            !form.spent_on
          }
        >
          {mutation.isPending ? "Guardando..." : "Registrar gasto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
