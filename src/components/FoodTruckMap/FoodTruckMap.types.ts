export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapTruckMarker extends Coordinates {
  applicant: string;
  locationdescription: string;
  fooditems?: string;
}

export interface MapProps {
  trucks: MapTruckMarker[];
  userLocation: Coordinates;
  selectedTruck: MapTruckMarker | null;
  onTruckSelect: (truck: MapTruckMarker | null) => void;
}
