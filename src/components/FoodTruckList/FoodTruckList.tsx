import type { FoodTruckListProps } from "./FoodTruckList.types";
import { FoodTruckListSkeleton } from "./FoodTruckList.skeleton";

export const FoodTruckList = ({ trucks, loading }: FoodTruckListProps) => {
  if (loading) {
    return <FoodTruckListSkeleton />;
  }

  if (trucks.length === 0) {
    return <p>No nearby food trucks found.</p>;
  }

  return (
    <ul className="space-y-3">
      {trucks.map((truck, index) => (
        <li key={`${truck.applicant}-${index}`} className="border p-4 rounded shadow">
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
