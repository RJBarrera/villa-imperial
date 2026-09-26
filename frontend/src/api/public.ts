import { http } from "./http";

import type {
  PublicAvailability,
  PublicBusiness,
  PublicCalendar,
  PublicPackage,
} from "../types/public";

export async function getPublicBusiness(): Promise<PublicBusiness> {
  const response = await http.get<PublicBusiness>("/public/business");

  return response.data;
}

export async function getPublicPackages(): Promise<PublicPackage[]> {
  const response = await http.get<PublicPackage[]>("/public/packages");

  return response.data;
}

export async function getPublicCalendar(
  month: string,
): Promise<PublicCalendar> {
  const response = await http.get<PublicCalendar>("/public/calendar", {
    params: {
      month,
    },
  });

  return response.data;
}

export async function checkPublicAvailability(
  packageId: string,
  eventDate: string,
  startTime: string,
): Promise<PublicAvailability> {
  const response = await http.get<PublicAvailability>("/public/availability", {
    params: {
      package_id: packageId,

      event_date: eventDate,

      start_time: startTime,
    },
  });

  return response.data;
}
