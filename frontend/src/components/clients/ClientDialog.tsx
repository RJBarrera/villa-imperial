import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";

import { createClient } from "../../api/clients";

import type { CreateClientPayload } from "../../types/client";

interface ClientDialogProps {
  open: boolean;

  onClose: () => void;

  onCreated: () => void;
}

const INITIAL_FORM: CreateClientPayload = {
  full_name: "",
  phone: "",
  email: "",
  notes: "",
};

export default function ClientDialog({
  open,
  onClose,
  onCreated,
}: ClientDialogProps) {
  const [form, setForm] = useState<CreateClientPayload>(INITIAL_FORM);

  const mutation = useMutation({
    mutationFn: createClient,

    onSuccess: () => {
      setForm(INITIAL_FORM);

      onCreated();

      onClose();
    },
  });

  const handleChange = (field: keyof CreateClientPayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.full_name.trim() || !form.phone.trim()) {
      return;
    }

    mutation.mutate({
      full_name: form.full_name.trim(),

      phone: form.phone.trim(),

      email: form.email?.trim() || null,

      notes: form.notes?.trim() || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Nuevo cliente
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nombre completo"
            value={form.full_name}
            onChange={(event) => handleChange("full_name", event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Teléfono"
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Correo electrónico"
            type="email"
            value={form.email ?? ""}
            onChange={(event) => handleChange("email", event.target.value)}
            fullWidth
          />

          <TextField
            label="Observaciones"
            value={form.notes ?? ""}
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
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            mutation.isPending || !form.full_name.trim() || !form.phone.trim()
          }
        >
          {mutation.isPending ? "Guardando..." : "Guardar cliente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
