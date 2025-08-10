export interface FoodTruck {
  applicant: string;
  locationdescription: string;
  latitude: number;
  longitude: number;
  fooditems?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
