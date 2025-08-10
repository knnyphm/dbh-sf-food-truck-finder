"use client";

import { useCallback, useState } from "react";
import type { FoodTruck, Coordinates } from "./useFoodTruckFinder.types";
import { fetchNearbyTrucks } from "@/utils/foodTruckLocator";

export const useFoodTruckFinder = () => {
  const [trucks, setTrucks] = useState<FoodTruck[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [radiusMiles, setRadiusMiles] = useState<number>(1);
  const [locating, setLocating] = useState<boolean>(false);

  const loadTrucks = useCallback(
    async (latitude: number, longitude: number, radius?: number) => {
      setLoading(true);
      try {
        const nearby = await fetchNearbyTrucks(
          latitude,
          longitude,
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
    },
    [radiusMiles]
  );

  const getCurrentLocation = useCallback(async (): Promise<Coordinates> => {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
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
    } catch (error) {
      console.error("Geolocation error:", error);
      setLocating(false);
      throw error;
    }
  }, []);

  const getNearbyTrucks = useCallback(async () => {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      return loadTrucks(latitude, longitude);
    } catch (error) {
      console.error("Failed to use current location:", error);
      return [];
    }
  }, [getCurrentLocation, loadTrucks]);

  return {
    trucks,
    loading,
    locating,
    userLocation,
    loadTrucks,
    getNearbyTrucks,
    radiusMiles,
    setRadiusMiles,
  };
}
