"use client";

import { render, screen } from "@testing-library/react";
import { FoodTruckList } from "./FoodTruckList";
import type { FoodTruck } from "@/types/food-truck";

const mockTrucks: FoodTruck[] = [
  {
    objectid: "1",
    applicant: "Truck A",
    fooditems: "tacos, burritos",
    latitude: "37.7749",
    longitude: "-122.4194",
    schedule: "http://example.com/schedule-a",
    address: "123 Main St",
  },
  {
    objectid: "2",
    applicant: "Truck B",
    fooditems: "burgers, fries",
    latitude: "37.7749",
    longitude: "-122.4194",
    schedule: "http://example.com/schedule-b",
    address: "456 Oak St",
  },
];

describe("FoodTruckList", () => {
  it("renders a loading message when loading", () => {
    render(<FoodTruckList trucks={[]} loading={true} />);
    expect(screen.getByText("Loading nearby food trucks…")).toBeInTheDocument();
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

