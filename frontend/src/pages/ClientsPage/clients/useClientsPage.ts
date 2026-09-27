import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getClients } from "../../../api/clients";
import type { ClientListItem } from "./clients.types";

export function useClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: clients = [],
    isLoading,
    isError,
  } = useQuery<ClientListItem[]>({
    queryKey: ["clients", search],
    queryFn: () => getClients(search),
  });

  const handleClientCreated = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["clients"],
    });
  };

  return {
    search,
    dialogOpen,
    clients,
    isLoading,
    isError,
    setSearch,
    setDialogOpen,
    handleClientCreated,
  };
}
