import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { FoodTruckFinder } from "@/components/FoodTruckFinder";

export const metadata: Metadata = {
  title: "SF Food Truck Finder",
  description: "Find nearby food trucks in San Francisco using your current location.",
  keywords: ["food trucks", "San Francisco", "street food", "local food", "food finder"],
};

export default function Page() {
  return (
    <PageLayout>
      <FoodTruckFinder />
    </PageLayout>
  );
}
