import type { ClientListItem as ClientItem } from "../clients.types";
import ClientListItem from "./ClientListItem";

interface ClientListProps {
  clients: ClientItem[];
  onEdit: (client: ClientItem) => void;
  onDelete: (client: ClientItem) => void;
}

export default function ClientList({
  clients,
  onEdit,
  onDelete,
}: ClientListProps) {
  return (
    <div className="clients-list">
      {clients.map((client) => (
        <ClientListItem
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
