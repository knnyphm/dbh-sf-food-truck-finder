import type { Coordinates } from "./coordinates";

export interface MapTruckMarker extends Coordinates {
  applicant: string;
  locationdescription: string;
  fooditems?: string;
}

export interface MapProps {
  trucks: MapTruckMarker[];
  userLocation: Coordinates;
}
