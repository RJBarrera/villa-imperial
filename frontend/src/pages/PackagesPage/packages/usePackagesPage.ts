import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from "../../../api/packages";
import { getServices } from "../../../api/services";
import type {
  PackageFeedback,
  PackageFormMode,
  PackageFormSubmitData,
  RentalPackageListItem,
} from "./packages.types";
import { getApiErrorMessage } from "./packages.utils";

export function usePackagesPage() {
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<PackageFormMode>("create");
  const [selectedPackage, setSelectedPackage] =
    useState<RentalPackageListItem | null>(null);
  const [packageToDelete, setPackageToDelete] =
    useState<RentalPackageListItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<PackageFeedback | null>(null);

  const packagesQuery = useQuery<RentalPackageListItem[]>({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const createMutation = useMutation({
    mutationFn: createPackage,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      packageId,
      data,
    }: {
      packageId: string;
      data: PackageFormSubmitData["update"];
    }) => updatePackage(packageId, data),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
  });

  async function refreshPackages() {
    await queryClient.invalidateQueries({
      queryKey: ["packages"],
    });
  }

  function openCreate() {
    setSelectedPackage(null);
    setFormMode("create");
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(rentalPackage: RentalPackageListItem) {
    setSelectedPackage(rentalPackage);
    setFormMode("edit");
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setFormOpen(false);
    setFormError(null);
  }

  async function savePackage(data: PackageFormSubmitData) {
    setFormError(null);

    try {
      if (formMode === "create") {
        await createMutation.mutateAsync(data.create);
      } else if (selectedPackage) {
        await updateMutation.mutateAsync({
          packageId: selectedPackage.id,
          data: data.update,
        });
      }

      await refreshPackages();

      setFormOpen(false);
      setSelectedPackage(null);
      setFeedback({
        severity: "success",
        message:
          formMode === "create"
            ? "Paquete creado correctamente."
            : "Paquete actualizado correctamente.",
      });
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          formMode === "create"
            ? "No fue posible crear el paquete."
            : "No fue posible actualizar el paquete.",
        ),
      );
    }
  }

  function requestDelete(rentalPackage: RentalPackageListItem) {
    setDeleteError(null);
    setPackageToDelete(rentalPackage);
  }

  function closeDelete() {
    if (deleteMutation.isPending) {
      return;
    }

    setPackageToDelete(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!packageToDelete) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync(packageToDelete.id);
      await refreshPackages();

      setPackageToDelete(null);
      setFeedback({
        severity: "success",
        message: "Paquete eliminado correctamente.",
      });
    } catch (error) {
      setDeleteError(
        getApiErrorMessage(
          error,
          "No fue posible eliminar el paquete.",
        ),
      );
    }
  }

  return {
    packages: packagesQuery.data ?? [],
    services: servicesQuery.data ?? [],
    isLoading: packagesQuery.isLoading,
    isError: packagesQuery.isError,
    servicesLoading: servicesQuery.isLoading,
    servicesError: servicesQuery.isError,
    formOpen,
    formMode,
    selectedPackage,
    formError,
    isSaving:
      createMutation.isPending ||
      updateMutation.isPending,
    packageToDelete,
    deleteError,
    isDeleting: deleteMutation.isPending,
    feedback,
    openCreate,
    openEdit,
    closeForm,
    savePackage,
    requestDelete,
    closeDelete,
    confirmDelete,
    clearFeedback: () => setFeedback(null),
  };
}
