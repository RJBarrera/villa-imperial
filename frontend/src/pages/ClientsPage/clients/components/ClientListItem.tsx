import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";

import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import {
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import type { ClientListItem as ClientItem } from "../clients.types";
import { getInitials } from "../clients.utils";

interface ClientListItemProps {
  client: ClientItem;
  onEdit: (client: ClientItem) => void;
  onDelete: (client: ClientItem) => void;
}

export default function ClientListItem({
  client,
  onEdit,
  onDelete,
}: ClientListItemProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    onEdit(client);
  };

  const handleDelete = () => {
    handleCloseMenu();
    onDelete(client);
  };

  return (
    <article className="client-item">
      <Avatar className="client-item__avatar">
        {getInitials(client.full_name)}
      </Avatar>

      <div className="client-item__content">
        <Typography className="client-item__name">
          {client.full_name}
        </Typography>

        <div className="client-item__contact">
          <ContactItem
            icon={<PhoneOutlined />}
            value={client.phone}
          />

          {client.email && (
            <ContactItem
              icon={<EmailOutlined />}
              value={client.email}
            />
          )}
        </div>
      </div>

      <IconButton
        id={`client-menu-button-${client.id}`}
        size="small"
        className="client-item__menu"
        aria-label={`Opciones de ${client.full_name}`}
        aria-controls={menuOpen ? `client-menu-${client.id}` : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={handleOpenMenu}
      >
        <MoreHorizOutlined />
      </IconButton>

      <Menu
        id={`client-menu-${client.id}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{
          "aria-labelledby": `client-menu-button-${client.id}`,
        }}
        className="client-item-menu"
      >
        <MenuItem
          onClick={handleEdit}
          className="client-item-menu__item"
        >
          <ListItemIcon className="client-item-menu__icon">
            <EditOutlined />
          </ListItemIcon>
          Editar cliente
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          className="client-item-menu__item client-item-menu__item--delete"
        >
          <ListItemIcon className="client-item-menu__icon">
            <DeleteOutlineOutlined />
          </ListItemIcon>
          Eliminar cliente
        </MenuItem>
      </Menu>
    </article>
  );
}

interface ContactItemProps {
  icon: ReactNode;
  value: string;
}

function ContactItem({
  icon,
  value,
}: ContactItemProps) {
  return (
    <div className="client-item__contact-item">
      {icon}
      <Typography>{value}</Typography>
    </div>
  );
}
