export const getGoogleMapsApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in environment variables"
    );
  }
  return apiKey;
};

export const getDefaultMapCenter = (): { lat: number; lng: number } => {
  return {
    lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || "-38.0055"),
    lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || "-57.5426"),
  };
};

export const getDefaultZoom = (): number => {
  return parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM || "12", 10);
};
