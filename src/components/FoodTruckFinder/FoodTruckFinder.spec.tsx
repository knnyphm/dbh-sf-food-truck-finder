"use client";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FoodTruckFinder } from "./FoodTruckFinder";
import { useFoodTrucks } from "@/hooks/useFoodTrucks";
import type { FoodTruck } from "@/types/food-truck";

jest.mock("@/hooks/useFoodTrucks", () => ({
  useFoodTrucks: jest.fn(),
}));

const mockTrucks: FoodTruck[] = [
  {
    applicant: "Truck A",
    fooditems: "tacos, burritos",
    latitude: 37.7749,
    longitude: -122.4194,
    locationdescription: "123 Main St",
  },
  {
    applicant: "Truck B",
    fooditems: "burgers, fries",
    latitude: 37.7749,
    longitude: -122.4194,
    locationdescription: "456 Oak St",
  },
];

describe("FoodTruckFinder", () => {
  const mockUseFoodTrucks = useFoodTrucks as jest.Mock;

  beforeEach(() => {
    mockUseFoodTrucks.mockReturnValue({
      trucks: mockTrucks,
      loading: false,
      userLocation: null,
      getNearbyTrucks: jest.fn().mockResolvedValue(mockTrucks),
      radiusMiles: 1,
      setRadiusMiles: jest.fn(),
      loadTrucks: jest.fn().mockResolvedValue(mockTrucks),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    render(<FoodTruckFinder />);
    expect(screen.getByText("Use My Location")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. taco, burger, coffee...")
    ).toBeInTheDocument();
  });

  it('shows a message to use location when userLocation is not available', () => {
    render(<FoodTruckFinder />);
    expect(screen.getByText(/To view nearby food trucks/)).toBeInTheDocument();
  });

  it("filters trucks by food item", async () => {
    mockUseFoodTrucks.mockReturnValue({
      trucks: mockTrucks,
      loading: false,
      userLocation: { latitude: 37.7749, longitude: -122.4194 },
      getNearbyTrucks: jest.fn().mockResolvedValue(mockTrucks),
      radiusMiles: 1,
      setRadiusMiles: jest.fn(),
      loadTrucks: jest.fn().mockResolvedValue(mockTrucks),
    });

    render(<FoodTruckFinder />);
    const filterInput = screen.getByPlaceholderText(
      "e.g. taco, burger, coffee..."
    );

    fireEvent.change(filterInput, { target: { value: "taco" } });

    await waitFor(() => {
      expect(screen.getByText("Truck A")).toBeInTheDocument();
      expect(screen.queryByText("Truck B")).not.toBeInTheDocument();
    });
  });

  it('calls getNearbyTrucks when "Use My Location" is clicked', async () => {
    const getNearbyTrucks = jest.fn().mockResolvedValue(mockTrucks);
    mockUseFoodTrucks.mockReturnValue({
      trucks: [],
      loading: false,
      userLocation: null,
      getNearbyTrucks,
      radiusMiles: 1,
      setRadiusMiles: jest.fn(),
      loadTrucks: jest.fn(),
    });

    render(<FoodTruckFinder />);
    const useLocationButton = screen.getByText("Use My Location");

    fireEvent.click(useLocationButton);

    await waitFor(() => {
      expect(getNearbyTrucks).toHaveBeenCalled();
    });
  });
});

