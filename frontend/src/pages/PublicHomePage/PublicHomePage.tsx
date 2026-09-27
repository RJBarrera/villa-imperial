import { CircularProgress } from "@mui/material";
import AvailabilitySection from "./public-home/components/AvailabilitySection";
import ContactSection from "./public-home/components/ContactSection";
import FacilitiesSection from "./public-home/components/FacilitiesSection";
import FloatingWhatsApp from "./public-home/components/FloatingWhatsApp";
import GalleryDialog from "./public-home/components/GalleryDialog";
import GallerySection from "./public-home/components/GallerySection";
import HeroSection from "./public-home/components/HeroSection";
import HighlightsSection from "./public-home/components/HighlightsSection";
import NightExperienceSection from "./public-home/components/NightExperienceSection";
import PackagesSection from "./public-home/components/PackagesSection";
import PublicFooter from "./public-home/components/PublicFooter";
import PublicHeader from "./public-home/components/PublicHeader";
import { usePublicHome } from "./public-home/usePublicHome";
import "./PublicHomePage.css";

export default function PublicHomePage() {
  const page = usePublicHome();

  if (page.isLoading) {
    return (
      <main className="public-home public-home--loading">
        <CircularProgress />
      </main>
    );
  }

  const businessName = (page.business as { business_name?: string } | null)?.business_name ?? "Villa Imperial";

  return (
    <main className="public-home">
      <PublicHeader businessName={businessName} logoUrl={page.businessLogo} whatsappUrl={page.generalWhatsappUrl} />
      <HeroSection businessName={businessName} />
      <HighlightsSection packageCount={Array.isArray(page.packages) ? page.packages.length : 0} />
      <FacilitiesSection />
      <GallerySection onSelectPhoto={page.setSelectedGalleryPhoto} />
      <NightExperienceSection />
      <PackagesSection
        packages={Array.isArray(page.packages) ? page.packages : []}
        minimumDeposit={
          (page.business as { minimum_deposit?: unknown } | null)?.minimum_deposit !== undefined
            ? String((page.business as { minimum_deposit?: unknown } | null)?.minimum_deposit)
            : undefined
        }
        onSelectPackage={page.handlePackageSelect}
      />
      <AvailabilitySection
        currentMonth={page.currentMonth}
        calendarDays={page.calendarDays}
        busyDates={page.busyDates}
        eventDate={page.eventDate}
        startTime={page.startTime}
        packages={Array.isArray(page.packages) ? page.packages : []}
        selectedPackageId={page.selectedPackageId}
        selectedPackage={page.selectedPackage}
        availability={page.availability}
        isPending={page.isAvailabilityPending}
        isError={page.isAvailabilityError}
        whatsappUrl={page.whatsappUrl}
        onPreviousMonth={page.previousMonth}
        onNextMonth={page.nextMonth}
        onSelectDay={page.handleCalendarDaySelect}
        onPackageChange={page.handlePackageChange}
        onDateChange={page.handleDateChange}
        onTimeChange={page.handleTimeChange}
        onCheckAvailability={page.checkAvailability}
      />
      <ContactSection business={page.business} fullAddress={page.fullAddress} whatsappUrl={page.generalWhatsappUrl} />
      <PublicFooter businessName={businessName} logoUrl={page.businessLogo} />
      <FloatingWhatsApp url={page.generalWhatsappUrl} />
      <GalleryDialog photo={page.selectedGalleryPhoto} onClose={() => page.setSelectedGalleryPhoto(null)} />
    </main>
  );
}
