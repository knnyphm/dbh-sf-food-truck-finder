"use client";

import { useCallback, useState } from "react";
import { fetchNearbyTrucks, type FoodTruck, type Coordinates } from "@/utils/foodTruckLocator";

export const useFoodTruckFinder = () => {
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [radiusMiles, setRadiusMiles] = useState<number>(1);
  const [locating, setLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<Coordinates> => {
    setLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocating(false);
      setLocationError("Geolocation is not supported by your browser");
      throw new Error("Geolocation not supported");
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const coords = { 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude 
      };
      setUserLocation(coords);
      setLocating(false);
      return coords;
    } catch (error: unknown) {
      console.error("Geolocation error:", error);
      setLocating(false);
      
      setLocationError("Unable to get your location. Please check your browser settings and try again.");
      
      throw error;
    }
  }, []);

  const getNearbyTrucks = useCallback(async (coordinates?: Coordinates, radius?: number) => {
    setLoading(true);
    try {
      let coords: Coordinates;
      
      if (coordinates) {
        // Use provided coordinates
        coords = coordinates;
      } else {
        // Get current location if no coordinates provided
        coords = await getCurrentLocation();
      }
      
      const nearby = await fetchNearbyTrucks(
        coords.latitude,
        coords.longitude,
        radius ?? radiusMiles
      );
      setTrucks(nearby);
      return nearby;
    } catch (error) {
      console.error("Error fetching food trucks:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getCurrentLocation, radiusMiles]);

  const clearLocationError = () => {
    setLocationError(null);
  };

  return {
    trucks,
    loading,
    locating,
    userLocation,
    locationError,
    getNearbyTrucks,
    radiusMiles,
    setRadiusMiles,
    clearLocationError,
  };
}
