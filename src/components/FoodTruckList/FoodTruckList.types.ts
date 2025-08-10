export interface FoodTruck {
  applicant: string;
  locationdescription: string;
  latitude: number;
  longitude: number;
  fooditems?: string;
}

export interface FoodTruckListProps {
  trucks: FoodTruck[];
  loading: boolean;
  selectedTruck: FoodTruck | null;
  onTruckSelect: (truck: FoodTruck | null) => void;
}
