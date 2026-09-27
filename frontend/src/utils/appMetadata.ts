export function configureAppMetadata() {
  const isAdmin = window.location.pathname.startsWith("/admin");

  document.title = isAdmin ? "Villa Imperial Admin" : "Villa Imperial";

  const appleIcon = document.querySelector<HTMLLinkElement>(
    'link[rel="apple-touch-icon"]',
  );

  if (appleIcon) {
    appleIcon.href = isAdmin
      ? "/apple-touch-icon-admin.png"
      : "/apple-touch-icon.png";
  }

  const manifest = document.querySelector<HTMLLinkElement>(
    'link[rel="manifest"]',
  );

  if (manifest) {
    manifest.href = isAdmin ? "/admin.webmanifest" : "/site.webmanifest";
  }
}
