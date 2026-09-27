import EmailOutlined from "@mui/icons-material/EmailOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import { Avatar, IconButton, Typography } from "@mui/material";
import type { ClientListItem as ClientItem } from "../clients.types";
import { getInitials } from "../clients.utils";

interface ClientListItemProps {
  client: ClientItem;
}

export default function ClientListItem({ client }: ClientListItemProps) {
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
          <ContactItem icon={<PhoneOutlined />} value={client.phone} />

          {client.email && (
            <ContactItem icon={<EmailOutlined />} value={client.email} />
          )}
        </div>
      </div>

      <IconButton
        size="small"
        className="client-item__menu"
        aria-label={`Opciones de ${client.full_name}`}
      >
        <MoreHorizOutlined />
      </IconButton>
    </article>
  );
}

interface ContactItemProps {
  icon: React.ReactNode;
  value: string;
}

function ContactItem({ icon, value }: ContactItemProps) {
  return (
    <div className="client-item__contact-item">
      {icon}
      <Typography>{value}</Typography>
    </div>
  );
}
