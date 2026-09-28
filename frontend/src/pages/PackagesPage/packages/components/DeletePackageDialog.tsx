import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { RentalPackageListItem } from "../packages.types";

interface DeletePackageDialogProps {
  rentalPackage: RentalPackageListItem | null;
  isDeleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePackageDialog({
  rentalPackage,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeletePackageDialogProps) {
  return (
    <Dialog
      open={Boolean(rentalPackage)}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Eliminar paquete
      </DialogTitle>

      <DialogContent>
        <Typography>
          ¿Deseas eliminar <strong>{rentalPackage?.name}</strong>?
        </Typography>

        <Typography className="delete-package-dialog__description">
          Se ocultará del catálogo, pero se conservará en la base de
          datos para mantener el historial de reservaciones.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteOutlined />}
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting
            ? "Eliminando..."
            : "Eliminar paquete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
