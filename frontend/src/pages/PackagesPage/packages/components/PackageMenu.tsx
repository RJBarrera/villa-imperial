import { useState } from "react";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

interface PackageMenuProps {
  packageName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PackageMenu({
  packageName,
  onEdit,
  onDelete,
}: PackageMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function closeMenu() {
    setAnchorEl(null);
  }

  function handleEdit() {
    closeMenu();
    onEdit();
  }

  function handleDelete() {
    closeMenu();
    onDelete();
  }

  return (
    <>
      <IconButton
        size="small"
        aria-label={`Opciones de ${packageName}`}
        aria-controls={anchorEl ? "package-options-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreHorizOutlined />
      </IconButton>

      <Menu
        id="package-options-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar paquete</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          className="package-menu__delete"
        >
          <ListItemIcon>
            <DeleteOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Eliminar paquete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
