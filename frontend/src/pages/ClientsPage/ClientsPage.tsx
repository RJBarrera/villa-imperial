import ClientDialog from "../../components/clients/ClientDialog";

import ClientList from "./clients/components/ClientList";
import ClientsHeader from "./clients/components/ClientsHeader";
import ClientsState from "./clients/components/ClientsState";
import ClientsToolbar from "./clients/components/ClientsToolbar";
import DeleteClientDialog from "./clients/components/DeleteClientDialog";
import EditClientDialog from "./clients/components/EditClientDialog";

import { useClientsPage } from "./clients/useClientsPage";

import "./ClientsPage.css";

export default function ClientsPage() {
  const clientsPage = useClientsPage();

  return (
    <main className="clients-page">
      <ClientsHeader
        onCreate={() => clientsPage.setDialogOpen(true)}
      />

      <section className="clients-card">
        <ClientsToolbar
          search={clientsPage.search}
          total={clientsPage.clients.length}
          onSearchChange={clientsPage.setSearch}
        />

        <ClientsState
          isLoading={clientsPage.isLoading}
          isError={clientsPage.isError}
          isEmpty={
            !clientsPage.isLoading &&
            !clientsPage.isError &&
            clientsPage.clients.length === 0
          }
        />

        {!clientsPage.isLoading &&
          !clientsPage.isError &&
          clientsPage.clients.length > 0 && (
            <ClientList
              clients={clientsPage.clients}
              onEdit={clientsPage.handleOpenEdit}
              onDelete={clientsPage.handleOpenDelete}
            />
          )}
      </section>

      <ClientDialog
        open={clientsPage.dialogOpen}
        onClose={() => clientsPage.setDialogOpen(false)}
        onCreated={clientsPage.handleClientCreated}
      />

      <EditClientDialog
        open={Boolean(clientsPage.editingClient)}
        client={clientsPage.editingClient}
        onClose={clientsPage.handleCloseEdit}
        onUpdated={clientsPage.handleClientUpdated}
      />

      <DeleteClientDialog
        open={Boolean(clientsPage.deletingClient)}
        client={clientsPage.deletingClient}
        onClose={clientsPage.handleCloseDelete}
        onDeleted={clientsPage.handleClientDeleted}
      />
    </main>
  );
}
