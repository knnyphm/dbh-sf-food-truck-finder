import type { FoodTruck } from "@/utils/foodTruckLocator";

export interface FoodTruckListProps {
  trucks: FoodTruck[];
  loading: boolean;
  selectedTruck: FoodTruck | null;
  onTruckSelect: (truck: FoodTruck | null) => void;
}
