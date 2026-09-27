interface HighlightsSectionProps {
  packageCount: number;
}

const Highlight = ({ value, label }: { value: string; label: string }) => (
  <div className="vi-highlight">
    <strong>{value}</strong>
    <span>{label}</span>
  </div>
);

export default function HighlightsSection({ packageCount }: HighlightsSectionProps) {
  return (
    <section className="vi-highlights">
      <div className="vi-container vi-highlights__grid">
        <Highlight value="8 horas" label="Duración de la renta" />
        <Highlight value={packageCount.toString()} label="Paquetes disponibles" />
        <Highlight value="En línea" label="Consulta de disponibilidad" />
      </div>
    </section>
  );
}
