import type { RentalPackageListItem } from "../packages.types";
import PackageCard from "./PackageCard";

interface PackageGridProps {
  packages: RentalPackageListItem[];
}

export default function PackageGrid({ packages }: PackageGridProps) {
  return (
    <section className="packages-grid">
      {packages.map((rentalPackage) => (
        <PackageCard
          key={rentalPackage.id}
          rentalPackage={rentalPackage}
        />
      ))}
    </section>
  );
}
