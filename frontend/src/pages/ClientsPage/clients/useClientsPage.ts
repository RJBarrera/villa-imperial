import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useState } from "react";

import { getClients } from "../../../api/clients";
import type { ClientListItem } from "./clients.types";

export function useClientsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingClient, setEditingClient] =
    useState<ClientListItem | null>(null);

  const [deletingClient, setDeletingClient] =
    useState<ClientListItem | null>(null);

  const {
    data: clients = [],
    isLoading,
    isError,
  } = useQuery<ClientListItem[]>({
    queryKey: ["clients", search],
    queryFn: () => getClients(search),
  });

  const refreshClients = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["clients"],
    });
  };

  const handleOpenEdit = (client: ClientListItem) => {
    setEditingClient(client);
  };

  const handleCloseEdit = () => {
    setEditingClient(null);
  };

  const handleOpenDelete = (client: ClientListItem) => {
    setDeletingClient(client);
  };

  const handleCloseDelete = () => {
    setDeletingClient(null);
  };

  return {
    search,
    dialogOpen,
    clients,
    isLoading,
    isError,
    editingClient,
    deletingClient,
    setSearch,
    setDialogOpen,
    handleClientCreated: refreshClients,
    handleClientUpdated: refreshClients,
    handleClientDeleted: refreshClients,
    handleOpenEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
  };
}
