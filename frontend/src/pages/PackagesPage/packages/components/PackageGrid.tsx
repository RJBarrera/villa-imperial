import type { RentalPackageListItem } from "../packages.types";
import PackageCard from "./PackageCard";

interface PackageGridProps {
  packages: RentalPackageListItem[];
  onEdit: (rentalPackage: RentalPackageListItem) => void;
  onDelete: (rentalPackage: RentalPackageListItem) => void;
}

export default function PackageGrid({
  packages,
  onEdit,
  onDelete,
}: PackageGridProps) {
  return (
    <section className="packages-grid">
      {packages.map((rentalPackage) => (
        <PackageCard
          key={rentalPackage.id}
          rentalPackage={rentalPackage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
