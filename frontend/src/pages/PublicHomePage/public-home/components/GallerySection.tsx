import { GALLERY_PHOTOS, type GalleryPhoto } from "../publicHome.data";
import SectionHeader from "./SectionHeader";

interface GallerySectionProps {
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export default function GallerySection({ onSelectPhoto }: GallerySectionProps) {
  return (
    <section id="galeria" className="vi-section">
      <div className="vi-container">
        <div className="vi-gallery__header">
          <SectionHeader
            eyebrow="Galería"
            title="Villa Imperial de día y de noche"
            description="Explora nuestras instalaciones y conoce los diferentes espacios disponibles para tu evento."
          />
          <p className="vi-gallery__hint">Haz clic en una fotografía para ampliarla.</p>
        </div>
        <div className="vi-gallery__grid">
          {GALLERY_PHOTOS.slice(0, 10).map((photo, index) => {
            const featured = index === 0 || index === 5;
            return (
              <button
                key={photo.src}
                type="button"
                className={`vi-gallery-card${featured ? " vi-gallery-card--featured" : ""}`}
                onClick={() => onSelectPhoto(photo)}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <span className="vi-gallery-card__overlay" />
                <strong>{photo.title}</strong>
              </button>
            );
          })}
        </div>
        {GALLERY_PHOTOS.length > 10 && (
          <div className="vi-gallery__more">
            <button type="button" className="vi-button vi-button--outline" onClick={() => onSelectPhoto(GALLERY_PHOTOS[10])}>
              Ver más fotografías
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
