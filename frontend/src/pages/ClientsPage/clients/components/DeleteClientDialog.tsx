import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { useMutation } from "@tanstack/react-query";

import { deleteClient } from "../../../../api/clients";
import type { ClientListItem } from "../clients.types";

interface DeleteClientDialogProps {
  open: boolean;
  client: ClientListItem | null;
  onClose: () => void;
  onDeleted: () => void | Promise<void>;
}

export default function DeleteClientDialog({
  open,
  client,
  onClose,
  onDeleted,
}: DeleteClientDialogProps) {
  const mutation = useMutation({
    mutationFn: async () => {
      if (!client) {
        throw new Error("No se seleccionó un cliente.");
      }

      return deleteClient(client.id);
    },

    onSuccess: async () => {
      await onDeleted();
      onClose();
    },
  });

  const handleClose = () => {
    if (mutation.isPending) {
      return;
    }

    mutation.reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      className="client-delete-dialog"
    >
      <DialogTitle className="client-delete-dialog__title">
        Eliminar cliente
      </DialogTitle>

      <DialogContent className="client-delete-dialog__content">
        <div className="client-delete-dialog__icon">
          <DeleteOutlineOutlined />
        </div>

        <Typography className="client-delete-dialog__question">
          ¿Deseas eliminar a{" "}
          <strong>{client?.full_name}</strong>?
        </Typography>

        <Typography className="client-delete-dialog__description">
          El cliente dejará de aparecer en el listado, pero su historial
          de reservaciones se conservará.
        </Typography>

        {mutation.isError && (
          <Alert
            severity="error"
            className="client-delete-dialog__alert"
          >
            No fue posible eliminar el cliente.
          </Alert>
        )}
      </DialogContent>

      <DialogActions className="client-delete-dialog__actions">
        <Button
          onClick={handleClose}
          disabled={mutation.isPending}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || !client}
        >
          {mutation.isPending
            ? "Eliminando..."
            : "Eliminar cliente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
