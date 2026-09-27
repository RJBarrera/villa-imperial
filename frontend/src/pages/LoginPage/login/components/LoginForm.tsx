import { Alert, Button, TextField } from "@mui/material";

interface LoginFormProps {
  username: string;
  password: string;
  errorMessage: string | null;
  isPending: boolean;
  canSubmit: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

export default function LoginForm({
  username,
  password,
  errorMessage,
  isPending,
  canSubmit,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="login-form">
      {errorMessage && (
        <Alert severity="error" className="login-form__alert">
          {errorMessage}
        </Alert>
      )}

      <TextField
        label="Usuario"
        value={username}
        onChange={(event) => onUsernameChange(event.target.value)}
        autoComplete="username"
        fullWidth
        required
        autoFocus
      />

      <TextField
        label="Contraseña"
        type="password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        autoComplete="current-password"
        fullWidth
        required
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
      />

      <Button
        variant="contained"
        size="large"
        onClick={onSubmit}
        disabled={isPending || !canSubmit}
        className="login-form__button"
      >
        {isPending ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </div>
  );
}
