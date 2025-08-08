"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { FoodTruck } from "@/types/food-truck";
import { useFoodTrucks } from "@/hooks/useFoodTrucks";
import { FoodTruckList } from "@/components/FoodTruckList";
import { Slider } from "@/components/ui/slider";
import { MapSkeleton } from "@/components/Map";

export const FoodTruckFinder = () => {
  const { trucks, loading, userLocation, getNearbyTrucks, radiusMiles, setRadiusMiles, loadTrucks } = useFoodTrucks();
  const [filteredTrucks, setFilteredTrucks] = useState<FoodTruck[]>([]);
  const [foodItemFilter, setFoodItemFilter] = useState("");

  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map").then((m) => m.Map), {
        ssr: false,
        loading: () => <MapSkeleton />,
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
      </div>

      <div className="mb-6">
        {userLocation ? (
          <Map trucks={filteredTrucks} userLocation={userLocation} />
        ) : (
          <div className="rounded border border-blue-200 bg-blue-50 text-blue-900 p-4">
            To view nearby food trucks, click &quot;Use My Location&quot; above and allow location access.
          </div>
        )}
      </div>

      <div>
        {userLocation && <FoodTruckList trucks={filteredTrucks} loading={loading} />}
      </div>
    </>
  );
}
