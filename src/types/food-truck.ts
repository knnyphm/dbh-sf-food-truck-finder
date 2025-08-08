export interface FoodTruck {
  applicant: string;
  locationdescription: string;
  latitude: number;
  longitude: number;
  fooditems?: string;
}

export interface RawFoodTruck {
  applicant: string;
  locationdescription: string;
  latitude: string;
  longitude: string;
  fooditems?: string;
}
