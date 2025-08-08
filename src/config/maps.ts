/**
 * Google Maps configuration
 */
export const mapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
} as const;