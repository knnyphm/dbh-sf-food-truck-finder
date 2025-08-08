import type { ReactNode } from "react";
import type { FoodTruck } from "./food-truck";

export interface FoodTruckListProps {
  trucks: FoodTruck[];
  loading: boolean;
}

export interface PageLayoutProps {
  children: ReactNode;
}
