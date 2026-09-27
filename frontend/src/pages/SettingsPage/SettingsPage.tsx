import SettingsForm from "./settings/components/SettingsForm";
import SettingsHeader from "./settings/components/SettingsHeader";
import SettingsState from "./settings/components/SettingsState";
import { useSettingsPage } from "./settings/useSettingsPage";
import "./SettingsPage.css";

export default function SettingsPage() {
  const settingsPage = useSettingsPage();

  return (
    <main className="settings-page">
      <SettingsHeader />

      <SettingsState
        isLoading={settingsPage.isLoading}
        isError={settingsPage.isError}
      />

      {!settingsPage.isLoading && !settingsPage.isError && (
        <SettingsForm
          form={settingsPage.form}
          isSaving={settingsPage.isSaving}
          isSuccess={settingsPage.isSuccess}
          isSaveError={settingsPage.isSaveError}
          canSave={settingsPage.canSave}
          onChange={settingsPage.handleChange}
          onSave={settingsPage.handleSave}
        />
      )}
    </main>
  );
}
