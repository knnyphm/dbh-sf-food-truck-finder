"use client";

import { render, screen } from "@testing-library/react";
import { FoodTruckList } from "./FoodTruckList";
import type { FoodTruck } from "./FoodTruckList.types";

const mockTrucks: FoodTruck[] = [
  {
    applicant: "Truck A",
    locationdescription: "123 Main St",
    fooditems: "tacos, burritos",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    applicant: "Truck B",
    locationdescription: "456 Oak St", 
    fooditems: "burgers, fries",
    latitude: 37.7749,
    longitude: -122.4194,
  },
];

describe("FoodTruckList", () => {
  it("renders skeleton loader when loading", () => {
    render(<FoodTruckList trucks={[]} loading={true} />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it("renders a message when no trucks are found", () => {
    render(<FoodTruckList trucks={[]} loading={false} />);
    expect(screen.getByText("No nearby food trucks found.")).toBeInTheDocument();
  });

  it("renders a list of food trucks", () => {
    render(<FoodTruckList trucks={mockTrucks} loading={false} />);
    expect(screen.getByText("Truck A")).toBeInTheDocument();
    expect(screen.getByText("tacos, burritos")).toBeInTheDocument();
    expect(screen.getByText("Truck B")).toBeInTheDocument();
    expect(screen.getByText("burgers, fries")).toBeInTheDocument();
  });
});

