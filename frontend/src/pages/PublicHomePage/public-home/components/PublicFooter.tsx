import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Brand from "./Brand";

interface PublicFooterProps {
  businessName: string;
  logoUrl: string;
}

export default function PublicFooter({ businessName, logoUrl }: PublicFooterProps) {
  return (
    <footer className="vi-footer">
      <div className="vi-container vi-footer__content">
        <Brand businessName={businessName} logoUrl={logoUrl} dark />
        <p>© {dayjs().year()} {businessName}. Todos los derechos reservados.</p>
        <Link className="vi-footer__admin" to="/admin/login">Administración</Link>
      </div>
    </footer>
  );
}
