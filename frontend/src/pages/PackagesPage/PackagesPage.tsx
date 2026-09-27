import PackageGrid from "./packages/components/PackageGrid";
import PackagesHeader from "./packages/components/PackagesHeader";
import PackagesState from "./packages/components/PackagesState";
import { usePackagesPage } from "./packages/usePackagesPage";
import "./PackagesPage.css";

export default function PackagesPage() {
  const packagesPage = usePackagesPage();

  return (
    <main className="packages-page">
      <PackagesHeader />

      <PackagesState
        isLoading={packagesPage.isLoading}
        isError={packagesPage.isError}
      />

      {!packagesPage.isLoading && !packagesPage.isError && (
        <PackageGrid packages={packagesPage.packages} />
      )}
    </main>
  );
}
