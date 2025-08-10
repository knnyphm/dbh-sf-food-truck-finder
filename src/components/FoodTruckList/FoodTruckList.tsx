import { useRef, useEffect } from "react";
import type { FoodTruckListProps, FoodTruck } from "./FoodTruckList.types";
import { FoodTruckListSkeleton } from "./FoodTruckList.skeleton";

export const FoodTruckList = ({ trucks, loading, selectedTruck, onTruckSelect }: FoodTruckListProps) => {
  const selectedTruckRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (selectedTruck && selectedTruckRef.current) {
      const frameId = requestAnimationFrame(() => {
        if (selectedTruckRef.current) {
          selectedTruckRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [selectedTruck]);

  if (loading) {
    return <FoodTruckListSkeleton />;
  }

  if (trucks.length === 0) {
    return <p>No nearby food trucks found.</p>;
  }

  const isTruckSelected = (truck: FoodTruck) => {
    return selectedTruck &&
      selectedTruck.applicant === truck.applicant &&
      selectedTruck.latitude === truck.latitude &&
      selectedTruck.longitude === truck.longitude;
  };

  const handleTruckClick = (truck: FoodTruck) => {
    if (isTruckSelected(truck)) {
      onTruckSelect(null);
    } else {
      onTruckSelect(truck);
    }
  };

  return (
    <ul className="space-y-3">
      {trucks.map((truck, index) => (
        <li
          key={`${truck.applicant}-${index}`}
          ref={isTruckSelected(truck) ? selectedTruckRef : null}
          className={`border p-4 rounded shadow cursor-pointer transition-all duration-200 hover:shadow-md ${isTruckSelected(truck)
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300'
            }`}
          onClick={() => handleTruckClick(truck)}
        >
          <h2 className="text-lg font-semibold">{truck.applicant}</h2>
          <p className="text-sm text-gray-600">{truck.locationdescription}</p>
          {truck.fooditems && (
            <p className="mt-2 text-sm italic text-gray-500">{truck.fooditems}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
