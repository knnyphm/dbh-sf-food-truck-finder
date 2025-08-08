import { getDistance, orderByDistance } from "geolib";
import type { FoodTruck, RawFoodTruck } from "@/types/food-truck";
import type { Coordinates } from "@/types/coordinates";

const METERS_PER_MILE = 1609.344;

function milesToMeters(miles: number): number {
  return Math.max(0, miles) * METERS_PER_MILE;
}

function parseRawFoodTruck(rawTruckData: RawFoodTruck): FoodTruck | null {
  const latitude = parseFloat(rawTruckData.latitude);
  const longitude = parseFloat(rawTruckData.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    applicant: rawTruckData.applicant,
    locationdescription: rawTruckData.locationdescription,
    latitude,
    longitude,
    fooditems: rawTruckData.fooditems,
  };
}

function filterTrucksWithinRadius(
  trucks: FoodTruck[],
  center: Coordinates,
  maxDistanceMeters: number
): FoodTruck[] {
  return trucks.filter((truck) => {
    const distance = getDistance(center, {
      latitude: truck.latitude,
      longitude: truck.longitude,
    });
    return distance <= maxDistanceMeters;
  });
}

export async function fetchNearbyTrucks(
  latitude: number,
  longitude: number,
  radiusMiles: number = 1
): Promise<FoodTruck[]> {
  // Fetch the cached raw dataset from the server route
  const res = await fetch(`/api/food-trucks`);
  if (!res.ok) {
    throw new Error(`Failed to fetch food trucks: ${res.status} ${res.statusText}`);
  }
  const data: RawFoodTruck[] = await res.json();

  const userLocation: Coordinates = { latitude, longitude };
  const maxDistanceMeters = milesToMeters(radiusMiles);

  const parsedTrucks: FoodTruck[] = data
    .map(parseRawFoodTruck)
    .filter((truck): truck is FoodTruck => truck !== null);

  const validTrucks = filterTrucksWithinRadius(
    parsedTrucks,
    userLocation,
    maxDistanceMeters
  );

  const sorted = orderByDistance(userLocation, validTrucks);
  return sorted as FoodTruck[];
}
