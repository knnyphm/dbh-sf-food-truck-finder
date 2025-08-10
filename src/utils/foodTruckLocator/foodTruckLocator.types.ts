export interface FoodTruck {
  applicant: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  foodItems?: string;
}

export interface RawFoodTruck {
  applicant: string;
  locationdescription: string;
  address: string;
  latitude: string;
  longitude: string;
  fooditems?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
