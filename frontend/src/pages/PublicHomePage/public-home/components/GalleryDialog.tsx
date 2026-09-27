import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import type { GalleryPhoto } from "../publicHome.data";

interface GalleryDialogProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
}

export default function GalleryDialog({ photo, onClose }: GalleryDialogProps) {
  return (
    <Dialog open={photo !== null} onClose={onClose} maxWidth="lg" fullWidth className="vi-gallery-dialog">
      {photo && (
        <DialogContent className="vi-gallery-dialog__content">
          <IconButton className="vi-gallery-dialog__close" onClick={onClose} aria-label="Cerrar fotografía">
            <CloseOutlined />
          </IconButton>
          <img className="vi-gallery-dialog__image" src={photo.src} alt={photo.title} />
          <div className="vi-gallery-dialog__caption">
            <strong>{photo.title}</strong>
            <p>{photo.description}</p>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
