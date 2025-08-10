"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { FoodTruck } from "./FoodTruckFinder.types";
import { useFoodTruckFinder } from "@/hooks/useFoodTruckFinder";
import { FoodTruckList } from "@/components/FoodTruckList";
import { Slider } from "@/components/ui/Slider";
import { FoodTruckMapSkeleton } from "@/components/FoodTruckMap";

export const FoodTruckFinder = () => {
  const { trucks, loading, userLocation, getNearbyTrucks, radiusMiles, setRadiusMiles, loadTrucks } = useFoodTruckFinder();
  const [filteredTrucks, setFilteredTrucks] = useState<FoodTruck[]>([]);
  const [foodItemFilter, setFoodItemFilter] = useState("");

  const Map = useMemo(
    () =>
      dynamic(async () => {
        const m = await import("@/components/FoodTruckMap");
        return m.FoodTruckMap;
      }, {
        ssr: false,
        loading: () => <FoodTruckMapSkeleton />,
      }),
    []
  );

  const handleUseCurrentLocation = async () => {
    const fetchedTrucks = await getNearbyTrucks();
    setFilteredTrucks(fetchedTrucks);
  };

  const handleRadiusChange = async (value: number[]) => {
    const miles = value[0] ?? 1;
    setRadiusMiles(miles);
    if (userLocation) {
      const fetched = await loadTrucks(userLocation.latitude, userLocation.longitude, miles);
      setFilteredTrucks(fetched);
    }
  };

  useEffect(() => {
    if (!foodItemFilter) {
      setFilteredTrucks(trucks);
      return;
    }

    const searchTermLowerCase = foodItemFilter.toLowerCase();
    setFilteredTrucks(
      trucks.filter((truck) =>
        (truck.fooditems || "").toLowerCase().includes(searchTermLowerCase)
      )
    );
  }, [foodItemFilter, trucks]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="bg-green-600 text-white px-4 py-2 rounded shadow w-full min-w-40 sm:w-auto"
          >
            Use My Location
          </button>

          <label htmlFor="filter" className="block font-medium mb-1">
            Filter by food item:
          </label>
          <input
            id="filter"
            type="text"
            value={foodItemFilter}
            onChange={(e) => setFoodItemFilter(e.target.value)}
            placeholder="e.g. taco, burger, coffee..."
            className="w-full p-2 border rounded shadow-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Distance (miles)</label>
            <span className="text-sm text-gray-600">{radiusMiles.toFixed(1)} mi</span>
          </div>
          <Slider
            min={0.5}
            max={5}
            step={0.5}
            value={[radiusMiles]}
            onValueChange={handleRadiusChange}
          />
        </div>

        {!userLocation && (
          <div className="rounded border border-blue-200 bg-blue-50 text-blue-900 p-4">
            To view nearby food trucks, click &quot;Use My Location&quot; above and allow location access.
          </div>
        )}
      </div>

      {userLocation && (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="lg:w-2/3">
            <Map trucks={filteredTrucks} userLocation={userLocation} />
          </div>

          <div className="lg:w-1/3">
            <div className="h-[calc(100vh-28rem)] lg:h-[80vh] overflow-y-auto">
              <FoodTruckList trucks={filteredTrucks} loading={loading} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
