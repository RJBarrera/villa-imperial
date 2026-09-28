import {
  Alert,
  Snackbar,
} from "@mui/material";
import DeletePackageDialog from "./packages/components/DeletePackageDialog";
import PackageFormDialog from "./packages/components/PackageFormDialog";
import PackageGrid from "./packages/components/PackageGrid";
import PackagesHeader from "./packages/components/PackagesHeader";
import PackagesState from "./packages/components/PackagesState";
import { usePackagesPage } from "./packages/usePackagesPage";
import "./PackagesPage.css";

export default function PackagesPage() {
  const packagesPage = usePackagesPage();

  return (
    <main className="packages-page">
      <PackagesHeader
        onCreate={packagesPage.openCreate}
      />

      <PackagesState
        isLoading={packagesPage.isLoading}
        isError={packagesPage.isError}
        isEmpty={
          !packagesPage.isLoading &&
          !packagesPage.isError &&
          packagesPage.packages.length === 0
        }
      />

      {!packagesPage.isLoading &&
        !packagesPage.isError &&
        packagesPage.packages.length > 0 && (
          <PackageGrid
            packages={packagesPage.packages}
            onEdit={packagesPage.openEdit}
            onDelete={packagesPage.requestDelete}
          />
        )}

      <PackageFormDialog
        open={packagesPage.formOpen}
        mode={packagesPage.formMode}
        rentalPackage={packagesPage.selectedPackage}
        services={packagesPage.services}
        servicesLoading={packagesPage.servicesLoading}
        servicesError={packagesPage.servicesError}
        isSaving={packagesPage.isSaving}
        serverError={packagesPage.formError}
        onClose={packagesPage.closeForm}
        onSubmit={packagesPage.savePackage}
      />

      <DeletePackageDialog
        rentalPackage={packagesPage.packageToDelete}
        isDeleting={packagesPage.isDeleting}
        error={packagesPage.deleteError}
        onClose={packagesPage.closeDelete}
        onConfirm={packagesPage.confirmDelete}
      />

      <Snackbar
        open={Boolean(packagesPage.feedback)}
        autoHideDuration={3500}
        onClose={packagesPage.clearFeedback}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={packagesPage.feedback?.severity ?? "success"}
          onClose={packagesPage.clearFeedback}
          variant="filled"
        >
          {packagesPage.feedback?.message}
        </Alert>
      </Snackbar>
    </main>
  );
}
