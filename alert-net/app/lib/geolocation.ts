type GeolocationRequest = {
  homeMobileCountryCode?: number;
  homeMobileNetworkCode?: number;
  radioType?: "gsm" | "cdma" | "wcdma" | "lte" | "nr";
  carrier?: string;
  considerIp?: boolean;
  cellTowers?: Array<{
    cellId: number;
    locationAreaCode: number;
    mobileCountryCode: number;
    mobileNetworkCode: number;
    age?: number;
    signalStrength?: number;
    timingAdvance?: number;
  }>;
  wifiAccessPoints?: Array<{
    macAddress: string;
    signalStrength?: number;
    age?: number;
    channel?: number;
    signalToNoiseRatio?: number;
  }>;
};

type GeolocationResponse = {
  location: {
    lat: number;
    lng: number;
  };
  accuracy: number;
  error?: {
    message: string;
    code: number;
  };
};

export async function getGeolocation(data: GeolocationRequest): Promise<GeolocationResponse> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const result = await response.json();
    return {
      location: result.location,
      accuracy: result.accuracy,
    };
  } catch (error) {
    return {
      location: { lat: 0, lng: 0 },
      accuracy: 0,
      error: {
        message: error instanceof Error ? error.message : "Unknown error occurred",
        code: 500,
      },
    };
  }
}
