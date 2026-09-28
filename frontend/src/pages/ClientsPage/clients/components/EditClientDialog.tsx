import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { updateClient } from "../../../../api/clients";
import type { ClientListItem } from "../clients.types";

interface EditClientDialogProps {
  open: boolean;
  client: ClientListItem | null;
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

interface FormState {
  full_name: string;
  phone: string;
  email: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  full_name: "",
  phone: "",
  email: "",
  notes: "",
};

export default function EditClientDialog({
  open,
  client,
  onClose,
  onUpdated,
}: EditClientDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (!open || !client) {
      return;
    }

    setForm({
      full_name: client.full_name,
      phone: client.phone,
      email: client.email ?? "",
      notes: client.notes ?? "",
    });
  }, [open, client]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!client) {
        throw new Error("No se seleccionó un cliente.");
      }

      return updateClient(client.id, {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        notes: form.notes.trim() || null,
      });
    },

    onSuccess: async () => {
      await onUpdated();
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

  const handleClose = () => {
    if (mutation.isPending) {
      return;
    }

    mutation.reset();
    onClose();
  };

  const isValid =
    form.full_name.trim().length >= 2 &&
    form.phone.trim().length >= 7;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      className="client-dialog"
    >
      <DialogTitle className="client-dialog__title">
        Editar cliente
      </DialogTitle>

      <DialogContent className="client-dialog__content">
        <div className="client-dialog__fields">
          <TextField
            label="Nombre completo"
            value={form.full_name}
            onChange={(event) =>
              handleChange("full_name", event.target.value)
            }
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Teléfono"
            value={form.phone}
            onChange={(event) =>
              handleChange("phone", event.target.value)
            }
            required
            fullWidth
          />

          <TextField
            label="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(event) =>
              handleChange("email", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Notas"
            value={form.notes}
            onChange={(event) =>
              handleChange("notes", event.target.value)
            }
            multiline
            minRows={3}
            fullWidth
          />

          {mutation.isError && (
            <Alert severity="error">
              No fue posible guardar los cambios del cliente.
            </Alert>
          )}
        </div>
      </DialogContent>

      <DialogActions className="client-dialog__actions">
        <Button
          onClick={handleClose}
          disabled={mutation.isPending}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !client || !isValid}
        >
          {mutation.isPending
            ? "Guardando..."
            : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
