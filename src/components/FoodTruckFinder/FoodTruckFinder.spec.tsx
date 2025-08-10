"use client";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FoodTruckFinder } from "./FoodTruckFinder";
import { useFoodTruckFinder } from "@/hooks/useFoodTruckFinder";
import type { FoodTruck } from "@/utils/foodTruckLocator";

jest.mock("@/hooks/useFoodTruckFinder", () => ({
  useFoodTruckFinder: jest.fn(),
}));

const mockTrucks: FoodTruck[] = [
  {
    applicant: "Truck A",
    foodItems: "tacos, burritos",
    latitude: 37.7749,
    longitude: -122.4194,
    description: "123 Main St",
    address: "123 Main St",
  },
  {
    applicant: "Truck B",
    foodItems: "burgers, fries",
    latitude: 37.7749,
    longitude: -122.4194,
    description: "456 Oak St",
    address: "456 Oak St",
  },
];

describe("FoodTruckFinder", () => {
  const mockUseFoodTruckFinder = useFoodTruckFinder as jest.Mock;

  beforeEach(() => {
    mockUseFoodTruckFinder.mockReturnValue({
      trucks: mockTrucks,
      loading: false,
      locating: false,
      userLocation: null,
      locationError: null,
      getNearbyTrucks: jest.fn().mockResolvedValue(mockTrucks),
      radiusMiles: 1,
      setRadiusMiles: jest.fn(),
      loadTrucks: jest.fn().mockResolvedValue(mockTrucks),
      clearLocationError: jest.fn(),
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
    mockUseFoodTruckFinder.mockReturnValue({
      trucks: mockTrucks,
      loading: false,
      locating: false,
      userLocation: { latitude: 37.7749, longitude: -122.4194 },
      locationError: null,
      getNearbyTrucks: jest.fn().mockResolvedValue(mockTrucks),
      radiusMiles: 1,
      setRadiusMiles: jest.fn(),
      loadTrucks: jest.fn().mockResolvedValue(mockTrucks),
      clearLocationError: jest.fn(),
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
    mockUseFoodTruckFinder.mockReturnValue({
      trucks: [],
      loading: false,
      locating: false,
      userLocation: null,
      locationError: null,
      getNearbyTrucks,
      radiusMiles: 1,
      setRadiusMiles: jest.fn(),
      loadTrucks: jest.fn(),
      clearLocationError: jest.fn(),
    });

    render(<FoodTruckFinder />);
    const useLocationButton = screen.getByText("Use My Location");

    fireEvent.click(useLocationButton);

    await waitFor(() => {
      expect(getNearbyTrucks).toHaveBeenCalled();
    });
  });
});

