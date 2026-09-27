interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="vi-section-header">
      <span className="vi-section-header__eyebrow">{eyebrow}</span>
      <h2 className="vi-section-header__title">{title}</h2>
      <p className="vi-section-header__description">{description}</p>
    </div>
  );
}
