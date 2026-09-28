import dayjs from "dayjs";
// import { Link } from "react-router-dom";
import Brand from "./Brand";

interface PublicFooterProps {
  businessName: string;
  logoUrl: string;
}

export default function PublicFooter({
  businessName,
  logoUrl,
}: PublicFooterProps) {
  return (
    <footer className="vi-footer">
      <div className="vi-container">
        <div className="vi-footer__content">
          <div className="vi-footer__brand">
            <Brand businessName={businessName} logoUrl={logoUrl} dark />

            <p className="vi-footer__tagline">
              Un espacio para celebrar momentos inolvidables.
            </p>
          </div>

          <div className="vi-footer__right">
            <p className="vi-footer__copyright">
              © {dayjs().year()} {businessName}.
              <span> Todos los derechos reservados.</span>
            </p>

            {/* <Link className="vi-footer__admin" to="/admin/login">
              Administración
            </Link> */}
          </div>
        </div>

        <div className="vi-footer__bottom">
          <span>Villa Imperial</span>
          <span className="vi-footer__dot">•</span>
          <span>Eventos y celebraciones</span>
        </div>
      </div>
    </footer>
  );
}
