import { useQuery } from "@tanstack/react-query";
import { getPackages } from "../../../api/packages";
import type { RentalPackageListItem } from "./packages.types";

export function usePackagesPage() {
  const {
    data: packages = [],
    isLoading,
    isError,
  } = useQuery<RentalPackageListItem[]>({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  return {
    packages,
    isLoading,
    isError,
  };
}
