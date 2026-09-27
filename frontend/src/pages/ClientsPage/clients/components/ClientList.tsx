import type { ClientListItem as ClientItem } from "../clients.types";
import ClientListItem from "./ClientListItem";

interface ClientListProps {
  clients: ClientItem[];
}

export default function ClientList({ clients }: ClientListProps) {
  return (
    <div className="clients-list">
      {clients.map((client) => (
        <ClientListItem key={client.id} client={client} />
      ))}
    </div>
  );
}
