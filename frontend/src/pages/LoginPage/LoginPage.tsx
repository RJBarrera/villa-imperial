import LoginBrand from "./login/components/LoginBrand";
import LoginForm from "./login/components/LoginForm";
import { useLoginPage } from "./login/useLoginPage";
import "./LoginPage.css";

export default function LoginPage() {
  const loginPage = useLoginPage();

  return (
    <main className="login-page">
      <section className="login-card">
        <LoginBrand />

        <LoginForm
          username={loginPage.username}
          password={loginPage.password}
          errorMessage={loginPage.errorMessage}
          isPending={loginPage.isPending}
          canSubmit={loginPage.canSubmit}
          onUsernameChange={loginPage.setUsername}
          onPasswordChange={loginPage.setPassword}
          onSubmit={loginPage.submit}
        />

        <p className="login-card__footer">
          Acceso exclusivo para administración de Villa Imperial.
        </p>
      </section>
    </main>
  );
}
