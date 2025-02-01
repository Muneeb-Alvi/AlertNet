"use server";

import { getGeolocation } from "../lib/geolocation";

export async function getLocationData(data: {
  considerIp?: boolean;
  wifiAccessPoints?: Array<{
    macAddress: string;
    signalStrength?: number;
  }>;
}) {
  try {
    const geolocationData = await getGeolocation({
      considerIp: data.considerIp ?? true,
      wifiAccessPoints: data.wifiAccessPoints,
    });

    return geolocationData;
  } catch (error) {
    console.error("Geolocation error:", error);
    throw new Error("Failed to get location data");
  }
}
