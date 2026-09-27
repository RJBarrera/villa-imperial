import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";
import { useEffect, useMemo, useState } from "react";
import {
  checkPublicAvailability,
  getPublicBusiness,
  getPublicCalendar,
  getPublicPackages,
} from "../../../api/public";
import type { PublicPackage } from "../../../types/public";
import { PHOTOS, type GalleryPhoto } from "./publicHome.data";
import {
  buildFullAddress,
  buildReservationWhatsappMessage,
  buildWhatsappUrl,
} from "./publicHome.utils";

dayjs.locale("es");

export function usePublicHome() {
  const { data: business, isLoading: businessLoading } = useQuery({
    queryKey: ["public-business"],
    queryFn: getPublicBusiness,
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["public-packages"],
    queryFn: getPublicPackages,
  });

  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [eventDate, setEventDate] = useState(dayjs().add(1, "day").format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("16:00");
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf("month"));
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) setSelectedPackageId(packages[0].id);
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
    calendar?.days.forEach((item) => result.set(item.date, item.bookings_count));
    return result;
  }, [calendar]);

  const calendarStart = useMemo(() => {
    const first = currentMonth.startOf("month");
    const mondayIndex = (first.day() + 6) % 7;
    return first.subtract(mondayIndex, "day");
  }, [currentMonth]);

  const calendarDays = useMemo(
    () => Array.from({ length: 42 }, (_, index) => calendarStart.add(index, "day")),
    [calendarStart],
  );

  const availabilityMutation = useMutation({
    mutationFn: () => checkPublicAvailability(selectedPackageId, eventDate, startTime),
  });

  const resetAvailability = () => availabilityMutation.reset();

  const handlePackageSelect = (rentalPackage: PublicPackage) => {
    setSelectedPackageId(rentalPackage.id);
    resetAvailability();
    document.getElementById("disponibilidad")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePackageChange = (packageId: string) => {
    setSelectedPackageId(packageId);
    resetAvailability();
  };

  const handleDateChange = (date: string) => {
    setEventDate(date);
    setCurrentMonth(dayjs(date).startOf("month"));
    resetAvailability();
  };

  const handleTimeChange = (time: string) => {
    setStartTime(time);
    resetAvailability();
  };

  const handleCalendarDaySelect = (calendarDay: Dayjs) => {
    if (calendarDay.endOf("day").isBefore(dayjs())) return;
    const dateKey = calendarDay.format("YYYY-MM-DD");
    setEventDate(dateKey);
    if (calendarDay.month() !== currentMonth.month()) setCurrentMonth(calendarDay.startOf("month"));
    resetAvailability();
  };

  const whatsappMessage = buildReservationWhatsappMessage(selectedPackage, eventDate, startTime);
  const whatsappUrl = buildWhatsappUrl(business?.whatsapp, whatsappMessage);
  const generalWhatsappUrl = buildWhatsappUrl(
    business?.whatsapp,
    "Hola, me gustaría solicitar información sobre Villa Imperial.",
  );
  const fullAddress = buildFullAddress(business?.address, business?.city, business?.state);
  const businessLogo = business?.logo_url || PHOTOS.logo;

  return {
    business,
    packages,
    selectedPackage,
    selectedPackageId,
    eventDate,
    startTime,
    currentMonth,
    calendarDays,
    busyDates,
    selectedGalleryPhoto,
    availability: availabilityMutation.data,
    isLoading: businessLoading || packagesLoading,
    isAvailabilityPending: availabilityMutation.isPending,
    isAvailabilityError: availabilityMutation.isError,
    whatsappUrl,
    generalWhatsappUrl,
    fullAddress,
    businessLogo,
    setSelectedGalleryPhoto,
    handlePackageSelect,
    handlePackageChange,
    handleDateChange,
    handleTimeChange,
    handleCalendarDaySelect,
    previousMonth: () => setCurrentMonth((current) => current.subtract(1, "month")),
    nextMonth: () => setCurrentMonth((current) => current.add(1, "month")),
    checkAvailability: () => availabilityMutation.mutate(),
  };
}
