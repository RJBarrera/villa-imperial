import LockOutlined from "@mui/icons-material/LockOutlined";
import { Typography } from "@mui/material";

export default function LoginBrand() {
  return (
    <div className="login-brand">
      <div className="login-brand__icon">
        <LockOutlined />
      </div>

      <Typography component="h1" className="login-brand__title">
        Villa Imperial
      </Typography>

      <Typography className="login-brand__subtitle">
        Panel administrativo
      </Typography>
    </div>
  );
}
