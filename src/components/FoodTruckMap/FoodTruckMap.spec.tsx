"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FoodTruckMap } from "./FoodTruckMap";
import type { FoodTruck } from "@/utils/foodTruckLocator";
import type { Coordinates } from "./FoodTruckMap.types";

// Mock config state
let mockApiKey = "test-api-key";
const mockMapId = "test-map-id";

// Mock the maps config
jest.mock("@/config/maps", () => ({
  get mapsConfig() {
    return {
      apiKey: mockApiKey,
      mapId: mockMapId
    };
  }
}));

jest.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AdvancedMarker: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  Pin: () => <div data-testid="map-pin" />,
  InfoWindow: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
];

const mockUserLocation: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

const mockOnTruckSelect = jest.fn();

describe("FoodTruckMap", () => {
  let originalApiKey: string;

  beforeEach(() => {
    jest.resetModules();
    originalApiKey = mockApiKey;
    mockOnTruckSelect.mockClear();
  });

  afterEach(() => {
    mockApiKey = originalApiKey;
  });

  describe("when API key is missing", () => {
    beforeEach(() => {
      mockApiKey = "";
    });

    it("renders a message", () => {
      render(
        <FoodTruckMap 
          trucks={[]} 
          userLocation={mockUserLocation} 
          selectedTruck={null}
          onTruckSelect={mockOnTruckSelect}
        />
      );
      
      // Check for the error message container
      const container = screen.getByRole('alert', { name: /api key/i });
      expect(container).toHaveTextContent('Please set the required API key to display the map');
    });
  });

  describe("when API key is present", () => {
    it("renders the map with markers", () => {
      render(
        <FoodTruckMap 
          trucks={mockTrucks} 
          userLocation={mockUserLocation} 
          selectedTruck={null}
          onTruckSelect={mockOnTruckSelect}
        />
      );
  
      // Check user location marker
      const userMarker = screen.getByTitle("Your location");
      expect(userMarker).toBeInTheDocument();
      expect(userMarker.querySelector('[data-testid="map-pin"]')).toBeInTheDocument();
  
      // Check food truck marker
      const truckMarker = screen.getByTitle("Truck A — 123 Main St");
      expect(truckMarker).toBeInTheDocument();
      expect(truckMarker.querySelector('[data-testid="map-pin"]')).toBeInTheDocument();
    });
  
    it("shows an info window when a marker is clicked", () => {
      render(
        <FoodTruckMap 
          trucks={mockTrucks} 
          userLocation={mockUserLocation} 
          selectedTruck={null}
          onTruckSelect={mockOnTruckSelect}
        />
      );
  
      const marker = screen.getByTitle("Truck A — 123 Main St");
      fireEvent.click(marker);
  
      expect(mockOnTruckSelect).toHaveBeenCalledWith(mockTrucks[0]);
    });

    it("shows info window when a truck is selected", () => {
      render(
        <FoodTruckMap 
          trucks={mockTrucks} 
          userLocation={mockUserLocation} 
          selectedTruck={mockTrucks[0]}
          onTruckSelect={mockOnTruckSelect}
        />
      );
  
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("tacos, burritos")).toBeInTheDocument();
    });
  });
});
