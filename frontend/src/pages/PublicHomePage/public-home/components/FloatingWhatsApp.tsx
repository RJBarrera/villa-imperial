import WhatsApp from "@mui/icons-material/WhatsApp";

export default function FloatingWhatsApp({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a className="vi-floating-whatsapp" href={url} target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
      <WhatsApp />
      <span>WhatsApp</span>
    </a>
  );
}
