export interface GalleryPhoto {
  src: string;
  title: string;
  description: string;
}

export interface Facility {
  title: string;
  description: string;
  image: string;
}

export const PHOTOS = {
  logo: "/villa/logo.jpg",
  heroMain: "/villa/14.jpg",
  heroTop: "/villa/5.jpg",
  heroBottom: "/villa/10.jpg",
  poolPalm: "/villa/1.jpg",
  kitchenWhite: "/villa/2.jpg",
  generalView: "/villa/3.jpg",
  courtyard: "/villa/4.jpg",
  building: "/villa/5.jpg",
  poolGarden: "/villa/6.jpg",
  grill: "/villa/7.jpg",
  hall: "/villa/8.jpg",
  kitchenBlack: "/villa/9.jpg",
  nightBlue: "/villa/10.jpg",
  nightGreen: "/villa/11.jpg",
  coveredPatio: "/villa/12.jpg",
  poolWaterfall: "/villa/13.jpg",
  coveredPool: "/villa/14.jpg",
  poolFront: "/villa/15.jpg",
  glassArea: "/villa/16.jpg",
} as const;

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: PHOTOS.coveredPool,
    title: "Alberca",
    description: "Vista principal del área de alberca y sus espacios exteriores.",
  },
  {
    src: PHOTOS.generalView,
    title: "Vista general",
    description: "Amplio espacio exterior para recibir y distribuir a tus invitados.",
  },
  {
    src: PHOTOS.nightBlue,
    title: "Alberca de noche",
    description: "Iluminación nocturna para darle un ambiente diferente a tu celebración.",
  },
  {
    src: PHOTOS.hall,
    title: "Área interior",
    description: "Espacio interior amplio y climatizado para tus eventos.",
  },
  {
    src: PHOTOS.grill,
    title: "Asador",
    description: "Área de asador disponible para complementar tu reunión.",
  },
  {
    src: PHOTOS.kitchenBlack,
    title: "Área de cocina y barra",
    description: "Área equipada para apoyar la preparación y servicio durante tu evento.",
  },
  {
    src: PHOTOS.poolFront,
    title: "Alberca techada",
    description: "Zona de alberca con cubierta para una experiencia más cómoda.",
  },
  {
    src: PHOTOS.coveredPatio,
    title: "Área exterior techada",
    description: "Espacio cubierto con vista directa hacia la alberca.",
  },
  {
    src: PHOTOS.poolPalm,
    title: "Alberca y jardín",
    description: "Espacio exterior rodeado de áreas verdes.",
  },
  {
    src: PHOTOS.glassArea,
    title: "Instalaciones",
    description: "Arquitectura moderna con amplios ventanales.",
  },
  {
    src: PHOTOS.nightGreen,
    title: "Vista nocturna",
    description: "Villa Imperial cuenta con iluminación para eventos por la noche.",
  },
  {
    src: PHOTOS.poolWaterfall,
    title: "Cascada y alberca",
    description: "Detalles de agua que complementan el área exterior.",
  },
  {
    src: PHOTOS.building,
    title: "Patio principal",
    description: "Área abierta con espacio suficiente para configurar tu evento.",
  },
  {
    src: PHOTOS.courtyard,
    title: "Área de convivencia",
    description: "Amplios espacios exteriores conectados con las áreas interiores.",
  },
  {
    src: PHOTOS.poolGarden,
    title: "Alberca y chapoteadero",
    description: "Área acuática disponible para disfrutar durante tu celebración.",
  },
  {
    src: PHOTOS.kitchenWhite,
    title: "Cocina",
    description: "Área adicional para preparación y apoyo durante los eventos.",
  },
];

export const FACILITIES: Facility[] = [
  {
    title: "Alberca y chapoteadero",
    description: "Área exterior para disfrutar con familia y amigos durante tu evento.",
    image: PHOTOS.poolPalm,
  },
  {
    title: "Amplio patio exterior",
    description: "Espacio abierto que puedes adaptar de acuerdo con el tipo de celebración.",
    image: PHOTOS.generalView,
  },
  {
    title: "Área refrigerada",
    description: "Espacio interior amplio y climatizado para mayor comodidad de tus invitados.",
    image: PHOTOS.hall,
  },
  {
    title: "Cocina",
    description: "Área disponible para apoyar la preparación y organización de alimentos.",
    image: PHOTOS.kitchenBlack,
  },
  {
    title: "Asador",
    description: "Asador integrado para reuniones, convivios y celebraciones.",
    image: PHOTOS.grill,
  },
  {
    title: "Ambiente nocturno",
    description: "Iluminación decorativa para que Villa Imperial también luzca durante la noche.",
    image: PHOTOS.nightBlue,
  },
];

export const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
