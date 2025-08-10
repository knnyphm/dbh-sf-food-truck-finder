"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { FoodTruck } from "./FoodTruckFinder.types";
import { useFoodTruckFinder } from "@/hooks/useFoodTruckFinder";
import { FoodTruckList } from "@/components/FoodTruckList";
import { Slider } from "@/components/ui/Slider";
import { FoodTruckMapSkeleton } from "@/components/FoodTruckMap";
import { LocationError } from "@/components/LocationError";
import { LocationLoading } from "@/components/LocationLoading";

export const FoodTruckFinder = () => {
  const { 
    trucks, 
    loading, 
    locating,
    userLocation, 
    locationError,
    getNearbyTrucks, 
    radiusMiles, 
    setRadiusMiles, 
    loadTrucks,
    clearLocationError
  } = useFoodTruckFinder();
  
  const [filteredFoodTrucks, setFilteredFoodTrucks] = useState<FoodTruck[]>([]);
  const [foodItemSearchTerm, setFoodItemSearchTerm] = useState("");
  const [selectedTruck, setSelectedTruck] = useState<FoodTruck | null>(null);

  const FoodTruckMap = useMemo(
    () =>
      dynamic(async () => {
        const mapModule = await import("@/components/FoodTruckMap");
        return mapModule.FoodTruckMap;
      }, {
        ssr: false,
        loading: () => <FoodTruckMapSkeleton />,
      }),
    []
  );

  const handleUseCurrentLocation = async () => {
    clearLocationError();
    const nearbyFoodTrucks = await getNearbyTrucks();
    setFilteredFoodTrucks(nearbyFoodTrucks);
  };

  const handleDistanceRadiusChange = async (radiusValues: number[]) => {
    const selectedRadiusMiles = radiusValues[0] ?? 1;
    setRadiusMiles(selectedRadiusMiles);
    if (userLocation) {
      const trucksInRadius = await loadTrucks(userLocation.latitude, userLocation.longitude, selectedRadiusMiles);
      setFilteredFoodTrucks(trucksInRadius);
    }
  };

  useEffect(() => {
    if (!foodItemSearchTerm) {
      setFilteredFoodTrucks(trucks);
      return;
    }

    const normalizedSearchTerm = foodItemSearchTerm.toLowerCase();
    setFilteredFoodTrucks(
      trucks.filter((truck) =>
        (truck.fooditems || "").toLowerCase().includes(normalizedSearchTerm)
      )
    );
  }, [foodItemSearchTerm, trucks]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-4">
        {locating && (
          <LocationLoading />
        )}

        {locationError && (
          <LocationError 
            error={locationError} 
            onRetry={handleUseCurrentLocation} 
          />
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="bg-green-600 text-white px-4 py-2 rounded shadow w-full min-w-40 sm:w-auto hover:bg-green-700 transition-colors"
          >
            Use My Location
          </button>

          <label htmlFor="foodItemFilter" className="block font-medium mb-1">
            Filter by food item:
          </label>
          <input
            id="foodItemFilter"
            type="text"
            value={foodItemSearchTerm}
            onChange={(event) => setFoodItemSearchTerm(event.target.value)}
            placeholder="e.g. taco, burger, coffee..."
            className="w-full p-2 border rounded shadow-sm"
          />
        </div>

        {userLocation && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Filter by distance (miles)</label>
              <span className="text-sm text-gray-600">{radiusMiles.toFixed(1)} mi</span>
            </div>
            <Slider
              min={0.5}
              max={5}
              step={0.5}
              value={[radiusMiles]}
              onValueChange={handleDistanceRadiusChange}
            />
          </div>
        )}

        {!userLocation && !locationError && (
          <div className="rounded border border-blue-200 bg-blue-50 text-blue-900 p-4">
            To view nearby food trucks, click &quot;Use My Location&quot; above and allow location access.
          </div>
        )}
      </div>

      {userLocation && (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="lg:w-2/3">
            <FoodTruckMap 
              trucks={filteredFoodTrucks} 
              userLocation={userLocation} 
              selectedTruck={selectedTruck}
              onTruckSelect={setSelectedTruck}
            />
          </div>

          <div className="lg:w-1/3">
            <div className="h-[calc(100vh-28rem)] lg:h-[80vh] overflow-y-auto">
              <FoodTruckList 
                trucks={filteredFoodTrucks} 
                loading={loading}
                selectedTruck={selectedTruck}
                onTruckSelect={setSelectedTruck}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
