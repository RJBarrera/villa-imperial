import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAuth } from "../../../context/AuthContext";
import type { LoginError } from "./login.types";

export function useLoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [user, navigate]);

  const mutation = useMutation({
    mutationFn: () =>
      login({
        username: username.trim(),
        password,
      }),
    onSuccess: () => {
      navigate("/admin", {
        replace: true,
      });
    },
  });

  const error = mutation.error as AxiosError<LoginError> | null;

  const errorMessage = useMemo(() => {
    if (!mutation.isError) {
      return null;
    }

    return (
      error?.response?.data?.detail ??
      "No fue posible iniciar sesión."
    );
  }, [error, mutation.isError]);

  const canSubmit = Boolean(username.trim() && password);

  const submit = () => {
    if (!canSubmit || mutation.isPending) {
      return;
    }

    mutation.mutate();
  };

  return {
    username,
    password,
    errorMessage,
    isPending: mutation.isPending,
    canSubmit,
    setUsername,
    setPassword,
    submit,
  };
}
