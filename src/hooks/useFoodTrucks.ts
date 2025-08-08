"use client";

import { useCallback, useState } from "react";
import type { FoodTruck } from "@/types/food-truck";
import type { Coordinates } from "@/types/coordinates";
import { fetchNearbyTrucks } from "@/lib/foodTrucks";

export function useFoodTrucks() {
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

  const getCurrentLocation = useCallback(() => {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      return Promise.reject(new Error("Geolocation not supported"));
    }

    return new Promise<Coordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          resolve({ latitude, longitude }),
        (error) => reject(error)
      );
    })
      .then((coords) => {
        setUserLocation(coords);
        return coords;
      })
      .catch((error) => {
        console.error("Geolocation error:", error);
        throw error;
      })
      .finally(() => {
        setLocating(false);
      });
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
