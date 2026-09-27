interface BrandProps {
  businessName: string;
  logoUrl: string;
  dark?: boolean;
}

export default function Brand({ businessName, logoUrl, dark = false }: BrandProps) {
  return (
    <div className={`vi-brand${dark ? " vi-brand--dark" : ""}`}>
      <img className="vi-brand__logo" src={logoUrl} alt={businessName} />
      <div className="vi-brand__text">
        <span className="vi-brand__name">{businessName}</span>
        <span className="vi-brand__subtitle">Salón de eventos</span>
      </div>
    </div>
  );
}
