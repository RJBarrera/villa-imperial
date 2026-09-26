import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import KeyboardArrowLeftOutlined from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlined from "@mui/icons-material/KeyboardArrowRightOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import WhatsApp from "@mui/icons-material/WhatsApp";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/es";

import {
  checkPublicAvailability,
  getPublicBusiness,
  getPublicCalendar,
  getPublicPackages,
} from "../api/public";

import type { PublicAvailability, PublicPackage } from "../types/public";

dayjs.locale("es");

const BRAND_BLUE = "#173B57";

const BRAND_BLUE_DARK = "#102D43";

const BRAND_GOLD = "#C6A15B";

const BRAND_GOLD_LIGHT = "#E4CA8B";

const PHOTOS = {
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
};

interface GalleryPhoto {
  src: string;

  title: string;

  description: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: PHOTOS.coveredPool,

    title: "Alberca",

    description:
      "Vista principal del área de alberca y sus espacios exteriores.",
  },

  {
    src: PHOTOS.generalView,

    title: "Vista general",

    description:
      "Amplio espacio exterior para recibir y distribuir a tus invitados.",
  },

  {
    src: PHOTOS.nightBlue,

    title: "Alberca de noche",

    description:
      "Iluminación nocturna para darle un ambiente diferente a tu celebración.",
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

    description:
      "Área equipada para apoyar la preparación y servicio durante tu evento.",
  },

  {
    src: PHOTOS.poolFront,

    title: "Alberca techada",

    description:
      "Zona de alberca con cubierta para una experiencia más cómoda.",
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

    description:
      "Villa Imperial cuenta con iluminación para eventos por la noche.",
  },

  {
    src: PHOTOS.poolWaterfall,

    title: "Cascada y alberca",

    description: "Detalles de agua que complementan el área exterior.",
  },

  {
    src: PHOTOS.building,

    title: "Patio principal",

    description:
      "Área abierta con espacio suficiente para configurar tu evento.",
  },

  {
    src: PHOTOS.courtyard,

    title: "Área de convivencia",

    description:
      "Amplios espacios exteriores conectados con las áreas interiores.",
  },

  {
    src: PHOTOS.poolGarden,

    title: "Alberca y chapoteadero",

    description:
      "Área acuática disponible para disfrutar durante tu celebración.",
  },

  {
    src: PHOTOS.kitchenWhite,

    title: "Cocina",

    description: "Área adicional para preparación y apoyo durante los eventos.",
  },
];

const FACILITIES = [
  {
    title: "Alberca y chapoteadero",

    description:
      "Área exterior para disfrutar con familia y amigos durante tu evento.",

    image: PHOTOS.poolPalm,
  },

  {
    title: "Amplio patio exterior",

    description:
      "Espacio abierto que puedes adaptar de acuerdo con el tipo de celebración.",

    image: PHOTOS.generalView,
  },

  {
    title: "Área refrigerada",

    description:
      "Espacio interior amplio y climatizado para mayor comodidad de tus invitados.",

    image: PHOTOS.hall,
  },

  {
    title: "Cocina",

    description:
      "Área disponible para apoyar la preparación y organización de alimentos.",

    image: PHOTOS.kitchenBlack,
  },

  {
    title: "Asador",

    description: "Asador integrado para reuniones, convivios y celebraciones.",

    image: PHOTOS.grill,
  },

  {
    title: "Ambiente nocturno",

    description:
      "Iluminación decorativa para que Villa Imperial también luzca durante la noche.",

    image: PHOTOS.nightBlue,
  },
];

function currency(value: string | number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",

    currency: "MXN",

    minimumFractionDigits: 0,

    maximumFractionDigits: 0,
  }).format(Number(value));
}

function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

function buildWhatsappUrl(
  whatsapp: string | null | undefined,

  message: string,
) {
  if (!whatsapp) {
    return null;
  }

  const phone = cleanPhone(whatsapp);

  if (!phone) {
    return null;
  }

  return `https://wa.me/${phone}` + `?text=${encodeURIComponent(message)}`;
}

export default function PublicHomePage() {
  const {
    data: business,

    isLoading: businessLoading,
  } = useQuery({
    queryKey: ["public-business"],

    queryFn: getPublicBusiness,
  });

  const {
    data: packages = [],

    isLoading: packagesLoading,
  } = useQuery({
    queryKey: ["public-packages"],

    queryFn: getPublicPackages,
  });

  const [selectedPackageId, setSelectedPackageId] = useState("");

  const [eventDate, setEventDate] = useState(
    dayjs().add(1, "day").format("YYYY-MM-DD"),
  );

  const [startTime, setStartTime] = useState("16:00");

  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));

  const [selectedGalleryPhoto, setSelectedGalleryPhoto] =
    useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [packages, selectedPackageId]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === selectedPackageId),

    [packages, selectedPackageId],
  );

  const monthKey = currentMonth.format("YYYY-MM");

  const { data: calendar } = useQuery({
    queryKey: ["public-calendar", monthKey],

    queryFn: () => getPublicCalendar(monthKey),
  });

  const busyDates = useMemo(() => {
    const result = new Map<string, number>();

    calendar?.days.forEach((item) => {
      result.set(item.date, item.bookings_count);
    });

    return result;
  }, [calendar]);

  const calendarStart = useMemo(() => {
    const first = currentMonth.startOf("month");

    const mondayIndex = (first.day() + 6) % 7;

    return first.subtract(mondayIndex, "day");
  }, [currentMonth]);

  const calendarDays = useMemo(
    () =>
      Array.from(
        {
          length: 42,
        },

        (_, index) => calendarStart.add(index, "day"),
      ),

    [calendarStart],
  );

  const availabilityMutation = useMutation({
    mutationFn: () =>
      checkPublicAvailability(
        selectedPackageId,

        eventDate,

        startTime,
      ),
  });

  const resetAvailability = () => {
    availabilityMutation.reset();
  };

  const handlePackageSelect = (rentalPackage: PublicPackage) => {
    setSelectedPackageId(rentalPackage.id);

    resetAvailability();

    document.getElementById("disponibilidad")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const availability = availabilityMutation.data;

  const whatsappMessage = selectedPackage
    ? [
        "Hola, me interesa reservar Villa Imperial.",

        "",

        `Paquete: ${selectedPackage.name}`,

        `Fecha: ${dayjs(eventDate).format("DD/MM/YYYY")}`,

        `Hora de inicio: ${dayjs(`2000-01-01T${startTime}`).format("h:mm A")}`,

        `Duración: ${selectedPackage.duration_hours} horas`,

        `Precio: ${currency(selectedPackage.base_price)}`,

        "",

        "¿Me pueden apoyar para continuar con la reservación?",
      ].join("\n")
    : "Hola, me interesa solicitar " + "información sobre Villa Imperial.";

  const whatsappUrl = buildWhatsappUrl(
    business?.whatsapp,

    whatsappMessage,
  );

  const generalWhatsappUrl = buildWhatsappUrl(
    business?.whatsapp,

    "Hola, me gustaría solicitar información sobre Villa Imperial.",
  );

  const fullAddress = [business?.address, business?.city, business?.state]
    .filter(Boolean)
    .join(", ");

  const businessLogo = business?.logo_url || PHOTOS.logo;

  if (businessLoading || packagesLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          bgcolor: "#F8FAFC",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#FFFFFF",

        color: "#17202A",

        overflowX: "hidden",
      }}
    >
      {/* ================================ */}
      {/* HEADER                           */}
      {/* ================================ */}

      <Box
        component="header"
        sx={{
          position: "sticky",

          top: 0,

          zIndex: 30,

          bgcolor: "rgba(255,255,255,.94)",

          backdropFilter: "blur(16px)",

          borderBottom: "1px solid rgba(234,236,240,.9)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 78,

              display: "flex",

              alignItems: "center",

              gap: 2,
            }}
          >
            <Brand
              businessName={business?.business_name ?? "Villa Imperial"}
              logoUrl={businessLogo}
            />

            <Stack
              direction="row"
              spacing={0.3}
              sx={{
                ml: "auto",

                display: {
                  xs: "none",

                  md: "flex",
                },
              }}
            >
              <PublicNavLink href="#inicio" label="Inicio" />

              <PublicNavLink href="#instalaciones" label="Instalaciones" />

              <PublicNavLink href="#galeria" label="Galería" />

              <PublicNavLink href="#paquetes" label="Paquetes" />

              <PublicNavLink href="#disponibilidad" label="Disponibilidad" />

              <PublicNavLink href="#contacto" label="Contacto" />
            </Stack>

            {generalWhatsappUrl && (
              <Button
                component="a"
                href={generalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<WhatsApp />}
                sx={{
                  ml: {
                    md: 1,
                  },

                  minHeight: 42,

                  borderRadius: "12px",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: "none",

                      sm: "inline",
                    },
                  }}
                >
                  WhatsApp
                </Box>
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}

      <Box
        id="inicio"
        component="section"
        sx={{
          scrollMarginTop: "90px",

          position: "relative",

          overflow: "hidden",

          bgcolor: BRAND_BLUE_DARK,

          color: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            position: "absolute",

            width: 600,

            height: 600,

            borderRadius: "50%",

            bgcolor: "rgba(198,161,91,.12)",

            top: -330,

            right: -180,

            filter: "blur(2px)",
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",

            py: {
              xs: 7,

              md: 10,

              xl: 12,
            },
          }}
        >
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                lg: "minmax(0, 1fr) minmax(500px, .9fr)",
              },

              gap: {
                xs: 5,

                lg: 7,
              },

              alignItems: "center",
            }}
          >
            {/* TEXTO */}

            <Box>
              <Typography
                sx={{
                  display: "inline-flex",

                  px: 1.5,

                  py: 0.7,

                  mb: 2.5,

                  borderRadius: 999,

                  bgcolor: "rgba(198,161,91,.14)",

                  border: "1px solid rgba(198,161,91,.35)",

                  color: BRAND_GOLD_LIGHT,

                  fontSize: 10.5,

                  fontWeight: 700,

                  letterSpacing: 0.9,

                  textTransform: "uppercase",
                }}
              >
                Salón de eventos
              </Typography>

              <Typography
                component="h1"
                sx={{
                  maxWidth: 720,

                  fontSize: {
                    xs: 38,

                    sm: 50,

                    lg: 59,

                    xl: 66,
                  },

                  lineHeight: 1.04,

                  fontWeight: 800,

                  letterSpacing: "-1.8px",
                }}
              >
                Celebra momentos que merecen ser{" "}
                <Box
                  component="span"
                  sx={{
                    color: BRAND_GOLD_LIGHT,
                  }}
                >
                  inolvidables
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.5,

                  maxWidth: 620,

                  fontSize: {
                    xs: 14,

                    md: 16,
                  },

                  lineHeight: 1.8,

                  color: "rgba(255,255,255,.72)",
                }}
              >
                {business?.business_name ?? "Villa Imperial"} te ofrece alberca,
                áreas exteriores, espacios refrigerados, cocina y asador para
                disfrutar tu celebración durante 8 horas.
              </Typography>

              <Stack
                direction={{
                  xs: "column",

                  sm: "row",
                }}
                spacing={1.4}
                sx={{ mt: 4 }}
              >
                <Button
                  component="a"
                  href="#disponibilidad"
                  variant="contained"
                  endIcon={<ArrowForwardOutlined />}
                  sx={{
                    minHeight: 49,

                    px: 3,

                    borderRadius: "13px",

                    bgcolor: BRAND_GOLD,

                    color: "#16232D",

                    fontWeight: 700,

                    "&:hover": {
                      bgcolor: "#D5B56D",
                    },
                  }}
                >
                  Consultar disponibilidad
                </Button>

                <Button
                  component="a"
                  href="#paquetes"
                  variant="outlined"
                  sx={{
                    minHeight: 49,

                    px: 3,

                    borderRadius: "13px",

                    color: "#FFFFFF",

                    borderColor: "rgba(255,255,255,.28)",

                    "&:hover": {
                      borderColor: "#FFFFFF",

                      bgcolor: "rgba(255,255,255,.05)",
                    },
                  }}
                >
                  Ver paquetes
                </Button>
              </Stack>

              <Stack
                direction={{
                  xs: "column",

                  sm: "row",
                }}
                spacing={{
                  xs: 1,

                  sm: 2.6,
                }}
                sx={{ mt: 4 }}
              >
                <HeroFeature text="Renta por 8 horas" />

                <HeroFeature text="Disponibilidad en línea" />

                <HeroFeature text="Atención por WhatsApp" />
              </Stack>
            </Box>

            {/* MOSAICO DE FOTOS */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: "1.35fr .85fr",

                gridTemplateRows: {
                  xs: "190px 150px",

                  sm: "230px 190px",

                  lg: "245px 205px",
                },

                gap: 1.4,

                minWidth: 0,
              }}
            >
              <HeroPhoto
                src={PHOTOS.heroMain}
                title="Alberca"
                subtitle="Área exterior"
                large
              />

              <HeroPhoto
                src={PHOTOS.heroTop}
                title="Espacios"
                subtitle="Amplias instalaciones"
              />

              <HeroPhoto
                src={PHOTOS.heroBottom}
                title="De noche"
                subtitle="Iluminación especial"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* INTRO                            */}
      {/* ================================ */}

      <Box
        sx={{
          py: {
            xs: 5,

            md: 6,
          },

          borderBottom: "1px solid #EEF0F2",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                sm: "repeat(3, 1fr)",
              },

              gap: 3,
            }}
          >
            <Highlight value="8 horas" label="Duración de la renta" />

            <Highlight
              value={packages.length.toString()}
              label="Paquetes disponibles"
            />

            <Highlight value="En línea" label="Consulta de disponibilidad" />
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* INSTALACIONES                    */}
      {/* ================================ */}

      <Box
        id="instalaciones"
        component="section"
        sx={{
          scrollMarginTop: "90px",

          py: {
            xs: 7,

            md: 10,
          },

          bgcolor: "#F8FAFC",
        }}
      >
        <Container maxWidth="xl">
          <SectionHeader
            eyebrow="Instalaciones"
            title="Conoce los espacios de Villa Imperial"
            description="Áreas exteriores e interiores diseñadas para adaptarse a diferentes tipos de celebraciones."
          />

          <Box
            sx={{
              mt: 5,

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                sm: "repeat(2, 1fr)",

                lg: "repeat(3, 1fr)",
              },

              gap: 2,
            }}
          >
            {FACILITIES.map((facility) => (
              <FacilityCard
                key={facility.title}
                title={facility.title}
                description={facility.description}
                image={facility.image}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* GALERÍA                          */}
      {/* ================================ */}

      <Box
        id="galeria"
        component="section"
        sx={{
          scrollMarginTop: "90px",

          py: {
            xs: 7,

            md: 10,
          },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              alignItems: {
                xs: "flex-start",
                md: "flex-end",
              },
              gap: 2,
            }}
          >
            <SectionHeader
              eyebrow="Galería"
              title="Villa Imperial de día y de noche"
              description="Explora nuestras instalaciones y conoce los diferentes espacios disponibles para tu evento."
            />

            <Typography
              sx={{
                ml: {
                  md: "auto",
                },

                pb: {
                  md: 0.7,
                },

                fontSize: 11.5,

                color: "text.secondary",
              }}
            >
              Haz clic en una fotografía para ampliarla.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 5,

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr 1fr",

                md: "repeat(4, 1fr)",
              },

              gridAutoRows: {
                xs: 150,

                sm: 190,

                md: 205,
              },

              gap: 1.3,
            }}
          >
            {GALLERY_PHOTOS.slice(0, 10).map((photo, index) => (
              <GalleryItem
                key={photo.src}
                photo={photo}
                featured={index === 0 || index === 5}
                onClick={() => setSelectedGalleryPhoto(photo)}
              />
            ))}
          </Box>

          {GALLERY_PHOTOS.length > 10 && (
            <Box
              sx={{
                mt: 3,

                display: "flex",

                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setSelectedGalleryPhoto(GALLERY_PHOTOS[10])}
              >
                Ver más fotografías
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* ================================ */}
      {/* EXPERIENCIA NOCTURNA             */}
      {/* ================================ */}

      <Box
        sx={{
          mx: {
            xs: 2,

            md: 4,
          },

          borderRadius: {
            xs: "22px",

            md: "30px",
          },

          minHeight: {
            xs: 390,

            md: 500,
          },

          position: "relative",

          overflow: "hidden",

          display: "flex",

          alignItems: "flex-end",

          backgroundImage: `linear-gradient(
              90deg,
              rgba(10,25,36,.88) 0%,
              rgba(10,25,36,.57) 48%,
              rgba(10,25,36,.10) 100%
            ),
            url("${PHOTOS.nightGreen}")`,

          backgroundSize: "cover",

          backgroundPosition: "center",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",

            py: {
              xs: 4,

              md: 6,
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 580,

              color: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,

                fontWeight: 800,

                letterSpacing: 1.1,

                color: BRAND_GOLD_LIGHT,

                textTransform: "uppercase",
              }}
            >
              Eventos de noche
            </Typography>

            <Typography
              sx={{
                mt: 1,

                fontSize: {
                  xs: 30,

                  md: 43,
                },

                fontWeight: 800,

                lineHeight: 1.1,
              }}
            >
              Un ambiente diferente cuando cae la noche
            </Typography>

            <Typography
              sx={{
                mt: 1.7,

                maxWidth: 520,

                fontSize: 14,

                lineHeight: 1.8,

                color: "rgba(255,255,255,.72)",
              }}
            >
              La iluminación de las instalaciones y de la alberca crea un
              ambiente ideal para continuar disfrutando tu celebración.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* PAQUETES                         */}
      {/* ================================ */}

      <Box
        id="paquetes"
        component="section"
        sx={{
          scrollMarginTop: "90px",

          py: {
            xs: 7,

            md: 10,
          },
        }}
      >
        <Container maxWidth="xl">
          <SectionHeader
            eyebrow="Paquetes"
            title="Elige la opción ideal para tu evento"
            description="Todos nuestros paquetes cuentan con una renta de 8 horas. Los precios y servicios se obtienen directamente de nuestro sistema."
          />

          <Box
            sx={{
              mt: 5,

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                md: "repeat(3, 1fr)",
              },

              gap: 2.5,
            }}
          >
            {packages.map((rentalPackage, index) => {
              const highlighted = index === packages.length - 1;

              return (
                <Card
                  key={rentalPackage.id}
                  sx={{
                    position: "relative",

                    overflow: "visible",

                    borderRadius: "22px",

                    border: highlighted
                      ? `2px solid ${BRAND_GOLD}`
                      : "1px solid #EAECF0",

                    boxShadow: highlighted
                      ? "0 20px 55px rgba(23,59,87,.10)"
                      : "0 6px 24px rgba(16,24,40,.04)",

                    transition: "transform .2s ease, box-shadow .2s ease",

                    "&:hover": {
                      transform: "translateY(-4px)",

                      boxShadow: "0 22px 55px rgba(16,24,40,.10)",
                    },
                  }}
                >
                  {highlighted && (
                    <Box
                      sx={{
                        position: "absolute",

                        top: -13,

                        left: "50%",

                        transform: "translateX(-50%)",

                        px: 1.6,

                        py: 0.65,

                        borderRadius: 999,

                        bgcolor: BRAND_GOLD,

                        color: "#17202A",

                        fontSize: 9.5,

                        fontWeight: 800,

                        textTransform: "uppercase",

                        letterSpacing: 0.6,

                        whiteSpace: "nowrap",
                      }}
                    >
                      Paquete más completo
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      p: {
                        xs: 2.5,

                        md: 3,
                      },

                      "&:last-child": {
                        pb: {
                          xs: 2.5,

                          md: 3,
                        },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 18,

                        fontWeight: 700,
                      }}
                    >
                      {rentalPackage.name}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={0.7}
                      sx={{ alignItems: "baseline", mt: 2 }}
                    >
                      <Typography
                        sx={{
                          fontSize: 35,

                          lineHeight: 1,

                          fontWeight: 800,

                          color: BRAND_BLUE,
                        }}
                      >
                        {currency(rentalPackage.base_price)}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10.5,

                          color: "text.secondary",
                        }}
                      >
                        / {rentalPackage.duration_hours} horas
                      </Typography>
                    </Stack>

                    {rentalPackage.description && (
                      <Typography
                        sx={{
                          mt: 2,

                          fontSize: 12.5,

                          lineHeight: 1.7,

                          color: "text.secondary",
                        }}
                      >
                        {rentalPackage.description}
                      </Typography>
                    )}

                    <Divider
                      sx={{
                        my: 2.5,
                      }}
                    />

                    <Stack spacing={1.2}>
                      {rentalPackage.services.map((service) => (
                        <Stack
                          key={service}
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: "center" }}
                        >
                          <CheckCircleOutlined
                            sx={{
                              fontSize: 17,

                              color: BRAND_GOLD,
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 12.5,
                            }}
                          >
                            {service}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    {Number(business?.minimum_deposit ?? 0) > 0 && (
                      <Box
                        sx={{
                          mt: 2.5,

                          p: 1.3,

                          borderRadius: "11px",

                          bgcolor: "#F9F6EE",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 10.5,

                            color: "text.secondary",
                          }}
                        >
                          Anticipo mínimo
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.2,

                            fontSize: 14,

                            fontWeight: 700,

                            color: BRAND_BLUE,
                          }}
                        >
                          {currency(business?.minimum_deposit ?? 0)}
                        </Typography>
                      </Box>
                    )}

                    <Button
                      fullWidth
                      variant={highlighted ? "contained" : "outlined"}
                      onClick={() => handlePackageSelect(rentalPackage)}
                      sx={{
                        mt: 3,

                        minHeight: 46,

                        borderRadius: "12px",
                      }}
                    >
                      Consultar disponibilidad
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* DISPONIBILIDAD                   */}
      {/* ================================ */}

      <Box
        id="disponibilidad"
        component="section"
        sx={{
          scrollMarginTop: "90px",

          py: {
            xs: 7,

            md: 10,
          },

          bgcolor: "#F8FAFC",
        }}
      >
        <Container maxWidth="xl">
          <SectionHeader
            eyebrow="Disponibilidad"
            title="Consulta tu fecha antes de contactarnos"
            description="El calendario te permite identificar fechas con eventos. La disponibilidad exacta se valida utilizando el paquete, fecha y horario seleccionado."
          />

          <Box
            sx={{
              mt: 5,

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                lg: "1.12fr .88fr",
              },

              gap: 3,
            }}
          >
            {/* CALENDARIO */}

            <Card
              sx={{
                borderRadius: "22px",

                boxShadow: "none",

                border: "1px solid #EAECF0",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2,

                    sm: 3,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 2,

                      sm: 3,
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <IconButton
                    onClick={() =>
                      setCurrentMonth((current) =>
                        current.subtract(
                          1,

                          "month",
                        ),
                      )
                    }
                  >
                    <KeyboardArrowLeftOutlined />
                  </IconButton>

                  <Typography
                    sx={{
                      fontSize: 17,

                      fontWeight: 700,

                      textTransform: "capitalize",
                    }}
                  >
                    {currentMonth.format("MMMM YYYY")}
                  </Typography>

                  <IconButton
                    onClick={() =>
                      setCurrentMonth((current) =>
                        current.add(
                          1,

                          "month",
                        ),
                      )
                    }
                  >
                    <KeyboardArrowRightOutlined />
                  </IconButton>
                </Stack>

                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: "repeat(7, 1fr)",
                  }}
                >
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                    (item) => (
                      <Typography
                        key={item}
                        sx={{
                          py: 1,

                          textAlign: "center",

                          fontSize: 10,

                          fontWeight: 700,

                          color: "text.secondary",
                        }}
                      >
                        {item}
                      </Typography>
                    ),
                  )}

                  {calendarDays.map((calendarDay) => {
                    const dateKey = calendarDay.format("YYYY-MM-DD");

                    const bookingCount = busyDates.get(dateKey) ?? 0;

                    const belongsToMonth =
                      calendarDay.month() === currentMonth.month();

                    const selected = dateKey === eventDate;

                    const past = calendarDay.endOf("day").isBefore(dayjs());

                    return (
                      <Box
                        key={dateKey}
                        onClick={() => {
                          if (past) {
                            return;
                          }

                          setEventDate(dateKey);

                          if (!belongsToMonth) {
                            setCurrentMonth(calendarDay.startOf("month"));
                          }

                          resetAvailability();
                        }}
                        sx={{
                          position: "relative",

                          minHeight: {
                            xs: 57,

                            sm: 70,
                          },

                          m: 0.35,

                          borderRadius: "12px",

                          display: "flex",

                          flexDirection: "column",

                          alignItems: "center",

                          justifyContent: "center",

                          cursor: past ? "default" : "pointer",

                          border: selected
                            ? `2px solid ${BRAND_BLUE}`
                            : "1px solid transparent",

                          bgcolor: selected
                            ? "#EDF3F7"
                            : bookingCount > 0
                              ? "#FFF7E7"
                              : "transparent",

                          opacity: !belongsToMonth || past ? 0.35 : 1,

                          transition: "background-color .15s ease",

                          "&:hover": past
                            ? {}
                            : {
                                bgcolor: "#F0F4F7",
                              },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,

                            fontWeight: selected ? 700 : 500,
                          }}
                        >
                          {calendarDay.format("D")}
                        </Typography>

                        {bookingCount > 0 && (
                          <Box
                            sx={{
                              width: 5,

                              height: 5,

                              mt: 0.55,

                              borderRadius: "50%",

                              bgcolor: "#D99A2B",
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>

                <Stack
                  direction={{
                    xs: "column",

                    sm: "row",
                  }}
                  spacing={1.5}
                  sx={{
                    mt: 2,
                    justifyContent: "center",
                    alignItems: {
                      xs: "center",
                      sm: "flex-start",
                    },
                  }}
                >
                  <LegendItem color="#D99A2B" label="Fecha con evento" />

                  <LegendItem color={BRAND_BLUE} label="Fecha seleccionada" />
                </Stack>
              </CardContent>
            </Card>

            {/* FORMULARIO */}

            <Card
              sx={{
                borderRadius: "22px",

                border: "1px solid #EAECF0",

                boxShadow: "0 18px 48px rgba(16,24,40,.06)",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2.5,

                    sm: 3,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 2.5,

                      sm: 3,
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 21,

                    fontWeight: 700,

                    color: BRAND_BLUE,
                  }}
                >
                  Consulta tu horario
                </Typography>

                <Typography
                  sx={{
                    mt: 0.7,

                    mb: 3,

                    fontSize: 12.5,

                    lineHeight: 1.7,

                    color: "text.secondary",
                  }}
                >
                  Selecciona los datos de tu evento y consultaremos la
                  disponibilidad en tiempo real.
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    select
                    label="Paquete"
                    value={selectedPackageId}
                    onChange={(event) => {
                      setSelectedPackageId(event.target.value);

                      resetAvailability();
                    }}
                    fullWidth
                  >
                    {packages.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}

                        {" — "}

                        {currency(item.base_price)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Fecha"
                    type="date"
                    value={eventDate}
                    onChange={(event) => {
                      setEventDate(event.target.value);

                      setCurrentMonth(
                        dayjs(event.target.value).startOf("month"),
                      );

                      resetAvailability();
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },

                      htmlInput: {
                        min: dayjs().format("YYYY-MM-DD"),
                      },
                    }}
                    fullWidth
                  />

                  <TextField
                    label="Hora de inicio"
                    type="time"
                    value={startTime}
                    onChange={(event) => {
                      setStartTime(event.target.value);

                      resetAvailability();
                    }}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                  />

                  {selectedPackage && (
                    <Box
                      sx={{
                        p: 2,

                        borderRadius: "14px",

                        bgcolor: "#F8FAFC",

                        border: "1px solid #EAECF0",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,

                              fontWeight: 700,
                            }}
                          >
                            {selectedPackage.name}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.3,

                              fontSize: 10.5,

                              color: "text.secondary",
                            }}
                          >
                            {selectedPackage.duration_hours} horas
                          </Typography>
                        </Box>

                        <Typography
                          sx={{
                            fontSize: 19,

                            fontWeight: 800,

                            color: BRAND_BLUE,
                          }}
                        >
                          {currency(selectedPackage.base_price)}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<CalendarMonthOutlined />}
                    disabled={
                      availabilityMutation.isPending ||
                      !selectedPackageId ||
                      !eventDate ||
                      !startTime
                    }
                    onClick={() => availabilityMutation.mutate()}
                    sx={{
                      minHeight: 50,

                      borderRadius: "13px",
                    }}
                  >
                    {availabilityMutation.isPending
                      ? "Consultando..."
                      : "Consultar disponibilidad"}
                  </Button>

                  {availabilityMutation.isError && (
                    <Alert severity="error">
                      No fue posible consultar la disponibilidad.
                    </Alert>
                  )}

                  {availability && (
                    <AvailabilityResult
                      availability={availability}
                      whatsappUrl={whatsappUrl}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* CONTACTO                         */}
      {/* ================================ */}

      <Box
        id="contacto"
        component="section"
        sx={{
          scrollMarginTop: "90px",

          py: {
            xs: 7,

            md: 9,
          },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              overflow: "hidden",

              borderRadius: "28px",

              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",

                lg: "1fr .72fr",
              },

              bgcolor: BRAND_BLUE_DARK,

              color: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                p: {
                  xs: 3,

                  md: 5,
                },

                display: "flex",

                flexDirection: "column",

                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 28,

                    md: 39,
                  },

                  fontWeight: 800,

                  lineHeight: 1.1,
                }}
              >
                ¿Listo para organizar tu evento?
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,

                  maxWidth: 590,

                  fontSize: 14,

                  lineHeight: 1.8,

                  color: "rgba(255,255,255,.68)",
                }}
              >
                Consulta una fecha disponible y comunícate con nosotros para
                continuar con tu reservación.
              </Typography>

              {fullAddress && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2.7, alignItems: "flex-start" }}
                >
                  <LocationOnOutlined
                    sx={{
                      mt: 0.1,

                      fontSize: 19,

                      color: BRAND_GOLD_LIGHT,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 12.5,

                      lineHeight: 1.6,

                      color: "rgba(255,255,255,.78)",
                    }}
                  >
                    {fullAddress}
                  </Typography>
                </Stack>
              )}

              {business?.phone && (
                <Typography
                  sx={{
                    mt: 1.5,

                    fontSize: 12.5,

                    color: "rgba(255,255,255,.78)",
                  }}
                >
                  Teléfono: {business.phone}
                </Typography>
              )}

              {business?.email && (
                <Typography
                  sx={{
                    mt: 0.5,

                    fontSize: 12.5,

                    color: "rgba(255,255,255,.78)",
                  }}
                >
                  Correo: {business.email}
                </Typography>
              )}

              {generalWhatsappUrl && (
                <Button
                  component="a"
                  href={generalWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<WhatsApp />}
                  sx={{
                    mt: 3,

                    alignSelf: "flex-start",

                    minHeight: 50,

                    px: 3,

                    borderRadius: "13px",

                    bgcolor: BRAND_GOLD,

                    color: "#17202A",

                    fontWeight: 700,

                    "&:hover": {
                      bgcolor: "#D4B36A",
                    },
                  }}
                >
                  Contactar por WhatsApp
                </Button>
              )}
            </Box>

            <Box
              component="img"
              src={PHOTOS.poolWaterfall}
              alt="Alberca de Villa Imperial"
              loading="lazy"
              sx={{
                width: "100%",

                height: {
                  xs: 320,

                  lg: "100%",
                },

                minHeight: {
                  lg: 460,
                },

                objectFit: "cover",

                objectPosition: "center",
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* ================================ */}
      {/* FOOTER                           */}
      {/* ================================ */}

      <Box
        component="footer"
        sx={{
          py: 4,

          bgcolor: "#0B2334",

          color: "#FFFFFF",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{
              xs: "column",

              md: "row",
            }}
            spacing={2}
            sx={{
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
            }}
          >
            <Brand
              businessName={business?.business_name ?? "Villa Imperial"}
              logoUrl={businessLogo}
              dark
            />

            <Typography
              sx={{
                ml: {
                  md: "auto",
                },

                fontSize: 10.5,

                color: "rgba(255,255,255,.45)",
              }}
            >
              © {dayjs().year()} {business?.business_name ?? "Villa Imperial"}.
              Todos los derechos reservados.
            </Typography>

            <Button
              component={Link}
              to="/admin/login"
              size="small"
              sx={{
                color: "rgba(255,255,255,.45)",

                fontSize: 10,
              }}
            >
              Administración
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ================================ */}
      {/* WHATSAPP FLOTANTE                */}
      {/* ================================ */}

      {generalWhatsappUrl && (
        <Button
          component="a"
          href={generalWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<WhatsApp />}
          sx={{
            position: "fixed",

            right: {
              xs: 16,

              md: 25,
            },

            bottom: {
              xs: 16,

              md: 25,
            },

            zIndex: 40,

            minHeight: 50,

            px: {
              xs: 2,

              sm: 2.5,
            },

            borderRadius: 999,

            bgcolor: "#25D366",

            color: "#FFFFFF",

            boxShadow: "0 10px 30px rgba(0,0,0,.20)",

            fontWeight: 700,

            "&:hover": {
              bgcolor: "#1EBE5D",
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: {
                xs: "none",

                sm: "inline",
              },
            }}
          >
            WhatsApp
          </Box>
        </Button>
      )}

      {/* ================================ */}
      {/* VISOR DE GALERÍA                 */}
      {/* ================================ */}

      <GalleryDialog
        photo={selectedGalleryPhoto}
        onClose={() => setSelectedGalleryPhoto(null)}
      />
    </Box>
  );
}

/* ================================================= */
/* COMPONENTES AUXILIARES                            */
/* ================================================= */

function PublicNavLink({
  href,
  label,
}: {
  href: string;

  label: string;
}) {
  return (
    <Button
      component="a"
      href={href}
      color="inherit"
      sx={{
        px: 1.4,

        fontSize: 11.5,

        fontWeight: 600,

        color: "#475467",

        "&:hover": {
          color: BRAND_BLUE,

          bgcolor: "#F5F7F9",
        },
      }}
    >
      {label}
    </Button>
  );
}

function Brand({
  businessName,
  logoUrl,
  dark = false,
}: {
  businessName: string;

  logoUrl?: string | null;

  dark?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1.2,
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={logoUrl || PHOTOS.logo}
        alt={businessName}
        sx={{
          width: 48,

          height: 48,

          objectFit: "cover",

          borderRadius: "50%",

          bgcolor: "#FFFFFF",

          border: dark
            ? "1px solid rgba(255,255,255,.15)"
            : "1px solid #EAECF0",

          boxShadow: dark ? "none" : "0 4px 12px rgba(16,24,40,.08)",
        }}
      />

      <Box>
        <Typography
          sx={{
            fontSize: 14,

            fontWeight: 800,

            color: dark ? "#FFFFFF" : BRAND_BLUE,

            lineHeight: 1.1,

            whiteSpace: "nowrap",
          }}
        >
          {businessName}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,

            fontSize: 9.5,

            color: dark ? "rgba(255,255,255,.48)" : "text.secondary",
          }}
        >
          Salón de eventos
        </Typography>
      </Box>
    </Box>
  );
}

function HeroPhoto({
  src,
  title,
  subtitle,
  large = false,
}: {
  src: string;

  title: string;

  subtitle: string;

  large?: boolean;
}) {
  return (
    <Box
      sx={{
        gridRow: large ? "1 / 3" : undefined,

        position: "relative",

        overflow: "hidden",

        borderRadius: "22px",

        border: "1px solid rgba(255,255,255,.13)",

        boxShadow: "0 18px 40px rgba(0,0,0,.18)",

        "&:hover img": {
          transform: "scale(1.035)",
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={title}
        loading={large ? "eager" : "lazy"}
        sx={{
          width: "100%",

          height: "100%",

          objectFit: "cover",

          transition: "transform .6s ease",

          display: "block",
        }}
      />

      <Box
        sx={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(180deg, transparent 45%, rgba(5,18,28,.78) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",

          left: 18,

          right: 18,

          bottom: 17,
        }}
      >
        <Typography
          sx={{
            fontSize: 15,

            fontWeight: 700,

            color: "#FFFFFF",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.15,

            fontSize: 9.5,

            color: "rgba(255,255,255,.68)",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

function HeroFeature({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
      <CheckCircleOutlined
        sx={{
          fontSize: 17,

          color: BRAND_GOLD_LIGHT,
        }}
      />

      <Typography
        sx={{
          fontSize: 11.5,

          color: "rgba(255,255,255,.70)",
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

function Highlight({
  value,
  label,
}: {
  value: string;

  label: string;
}) {
  return (
    <Box
      sx={{
        textAlign: {
          xs: "left",

          sm: "center",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 22,

          fontWeight: 800,

          color: BRAND_BLUE,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          mt: 0.3,

          fontSize: 10.5,

          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;

  title: string;

  description: string;
}) {
  return (
    <Box
      sx={{
        maxWidth: 740,
      }}
    >
      <Typography
        sx={{
          color: "#9A772B",

          fontSize: 10.5,

          fontWeight: 800,

          textTransform: "uppercase",

          letterSpacing: 1.1,
        }}
      >
        {eyebrow}
      </Typography>

      <Typography
        sx={{
          mt: 1,

          fontSize: {
            xs: 28,

            md: 39,
          },

          fontWeight: 800,

          lineHeight: 1.14,

          letterSpacing: "-.6px",

          color: BRAND_BLUE,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 1.5,

          maxWidth: 680,

          fontSize: 14,

          lineHeight: 1.8,

          color: "text.secondary",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

function FacilityCard({
  title,
  description,
  image,
}: {
  title: string;

  description: string;

  image: string;
}) {
  return (
    <Box
      sx={{
        minHeight: 310,

        position: "relative",

        overflow: "hidden",

        borderRadius: "20px",

        cursor: "default",

        boxShadow: "0 8px 25px rgba(16,24,40,.07)",

        "&:hover img": {
          transform: "scale(1.045)",
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        loading="lazy"
        sx={{
          position: "absolute",

          inset: 0,

          width: "100%",

          height: "100%",

          objectFit: "cover",

          transition: "transform .55s ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(180deg, rgba(5,18,28,.02) 25%, rgba(5,18,28,.85) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",

          left: 0,

          right: 0,

          bottom: 0,

          p: 2.5,

          color: "#FFFFFF",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,

            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.7,

            maxWidth: 370,

            fontSize: 11.5,

            lineHeight: 1.65,

            color: "rgba(255,255,255,.70)",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

function GalleryItem({
  photo,
  featured,
  onClick,
}: {
  photo: GalleryPhoto;

  featured: boolean;

  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",

        overflow: "hidden",

        borderRadius: "16px",

        cursor: "pointer",

        gridColumn: {
          xs: featured ? "span 2" : "span 1",

          md: featured ? "span 2" : "span 1",
        },

        gridRow: featured ? "span 2" : "span 1",

        bgcolor: "#EEF1F3",

        "&:hover img": {
          transform: "scale(1.045)",
        },

        "&:hover .gallery-overlay": {
          opacity: 1,
        },
      }}
    >
      <Box
        component="img"
        src={photo.src}
        alt={photo.title}
        loading="lazy"
        sx={{
          width: "100%",

          height: "100%",

          objectFit: "cover",

          display: "block",

          transition: "transform .45s ease",
        }}
      />

      <Box
        className="gallery-overlay"
        sx={{
          position: "absolute",

          inset: 0,

          display: "flex",

          alignItems: "flex-end",

          p: 2,

          opacity: {
            xs: 1,

            md: 0,
          },

          transition: "opacity .25s ease",

          background:
            "linear-gradient(180deg, transparent 45%, rgba(7,20,30,.72) 100%)",
        }}
      >
        <Typography
          sx={{
            color: "#FFFFFF",

            fontSize: 12,

            fontWeight: 700,
          }}
        >
          {photo.title}
        </Typography>
      </Box>
    </Box>
  );
}

function GalleryDialog({
  photo,
  onClose,
}: {
  photo: GalleryPhoto | null;

  onClose: () => void;
}) {
  return (
    <Dialog
      open={photo !== null}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#0A1720",
            borderRadius: "20px",
            overflow: "hidden",
          },
        },
      }}
    >
      {photo && (
        <DialogContent
          sx={{
            p: 0,

            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",

              top: 15,

              right: 15,

              zIndex: 3,

              bgcolor: "rgba(0,0,0,.48)",

              color: "#FFFFFF",

              "&:hover": {
                bgcolor: "rgba(0,0,0,.68)",
              },
            }}
          >
            <CloseOutlined />
          </IconButton>

          <Box
            component="img"
            src={photo.src}
            alt={photo.title}
            sx={{
              display: "block",

              width: "100%",

              maxHeight: "78vh",

              objectFit: "contain",

              bgcolor: "#071118",
            }}
          />

          <Box
            sx={{
              p: {
                xs: 2,

                md: 2.5,
              },

              color: "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: 16,

                fontWeight: 700,
              }}
            >
              {photo.title}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,

                fontSize: 11.5,

                lineHeight: 1.6,

                color: "rgba(255,255,255,.62)",
              }}
            >
              {photo.description}
            </Typography>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;

  label: string;
}) {
  return (
    <Stack direction="row" spacing={0.7} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          width: 7,

          height: 7,

          borderRadius: "50%",

          bgcolor: color,
        }}
      />

      <Typography
        sx={{
          fontSize: 9.5,

          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

function AvailabilityResult({
  availability,
  whatsappUrl,
}: {
  availability: PublicAvailability;

  whatsappUrl: string | null;
}) {
  if (!availability.available) {
    return (
      <Alert severity="warning">
        <Typography
          sx={{
            fontSize: 12.5,

            fontWeight: 700,
          }}
        >
          Ese horario no está disponible.
        </Typography>

        <Typography
          sx={{
            mt: 0.4,

            fontSize: 11.5,
          }}
        >
          Intenta con otra hora o selecciona una fecha diferente.
        </Typography>
      </Alert>
    );
  }

  return (
    <Alert severity="success" icon={<CheckCircleOutlined />}>
      <Typography
        sx={{
          fontSize: 13,

          fontWeight: 700,
        }}
      >
        ¡Horario disponible!
      </Typography>

      <Typography
        sx={{
          mt: 0.5,

          fontSize: 11.5,
        }}
      >
        {dayjs(availability.starts_at).format("DD/MM/YYYY · h:mm A")}

        {" - "}

        {dayjs(availability.ends_at).format("h:mm A")}
      </Typography>

      {whatsappUrl && (
        <Button
          component="a"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="small"
          startIcon={<WhatsApp />}
          sx={{
            mt: 1.5,

            borderRadius: "10px",
          }}
        >
          Solicitar reservación
        </Button>
      )}
    </Alert>
  );
}
