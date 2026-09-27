import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getBusinessSettings,
  updateBusinessSettings,
} from "../../../api/settings";
import { EMPTY_SETTINGS_FORM } from "./settings.constants";
import type {
  BusinessSettingsResponse,
  SettingsFormField,
  SettingsFormState,
} from "./settings.types";
import {
  buildSettingsPayload,
  mapSettingsToForm,
} from "./settings.utils";

export function useSettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SettingsFormState>(
    EMPTY_SETTINGS_FORM,
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery<BusinessSettingsResponse>({
    queryKey: ["business-settings"],
    queryFn: getBusinessSettings,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setForm(mapSettingsToForm(data));
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateBusinessSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["business-settings"],
      });
    },
  });

  const handleChange = (
    field: SettingsFormField,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!form.business_name.trim() || mutation.isPending) {
      return;
    }

    mutation.mutate(buildSettingsPayload(form));
  };

  return {
    form,
    isLoading,
    isError,
    isSaving: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isSaveError: mutation.isError,
    canSave: Boolean(form.business_name.trim()),
    handleChange,
    handleSave,
  };
}
