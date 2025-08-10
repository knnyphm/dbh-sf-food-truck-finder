import type { FoodTruck } from "@/utils/foodTruckLocator";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapProps {
  trucks: FoodTruck[];
  userLocation: Coordinates;
  selectedTruck: FoodTruck | null;
  onTruckSelect: (truck: FoodTruck | null) => void;
}
