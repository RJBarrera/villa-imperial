import type { Dayjs } from "dayjs";
import type { PublicAvailability, PublicPackage } from "../../../types/public";
import AvailabilityCalendar from "./AvailabilityCalendar";
import AvailabilityForm from "./AvailabilityForm";
import SectionHeader from "./SectionHeader";

interface AvailabilitySectionProps {
  currentMonth: Dayjs;
  calendarDays: Dayjs[];
  busyDates: Map<string, number>;
  eventDate: string;
  startTime: string;
  packages: PublicPackage[];
  selectedPackageId: string;
  selectedPackage: PublicPackage | undefined;
  availability: PublicAvailability | undefined;
  isPending: boolean;
  isError: boolean;
  whatsappUrl: string | null;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: Dayjs) => void;
  onPackageChange: (packageId: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onCheckAvailability: () => void;
}

export default function AvailabilitySection(props: AvailabilitySectionProps) {
  return (
    <section id="disponibilidad" className="vi-section vi-section--soft">
      <div className="vi-container">
        <SectionHeader
          eyebrow="Disponibilidad"
          title="Consulta tu fecha antes de contactarnos"
          description="El calendario te permite identificar fechas con eventos. La disponibilidad exacta se valida utilizando el paquete, fecha y horario seleccionado."
        />
        <div className="vi-availability">
          <AvailabilityCalendar
            currentMonth={props.currentMonth}
            calendarDays={props.calendarDays}
            busyDates={props.busyDates}
            eventDate={props.eventDate}
            onPreviousMonth={props.onPreviousMonth}
            onNextMonth={props.onNextMonth}
            onSelectDay={props.onSelectDay}
          />
          <AvailabilityForm
            packages={props.packages}
            selectedPackageId={props.selectedPackageId}
            selectedPackage={props.selectedPackage}
            eventDate={props.eventDate}
            startTime={props.startTime}
            availability={props.availability}
            isPending={props.isPending}
            isError={props.isError}
            whatsappUrl={props.whatsappUrl}
            onPackageChange={props.onPackageChange}
            onDateChange={props.onDateChange}
            onTimeChange={props.onTimeChange}
            onCheckAvailability={props.onCheckAvailability}
          />
        </div>
      </div>
    </section>
  );
}
