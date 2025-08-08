"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Map } from "./Map";
import type { FoodTruck } from "@/types/food-truck";
import type { Coordinates } from "@/types/coordinates";

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
    fooditems: "tacos, burritos",
    latitude: 37.7749,
    longitude: -122.4194,
    locationdescription: "123 Main St",
  },
];

const mockUserLocation: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

describe("Map", () => {
  let originalApiKey: string;

  beforeEach(() => {
    jest.resetModules();
    originalApiKey = mockApiKey;
  });

  afterEach(() => {
    mockApiKey = originalApiKey;
  });

  describe("when API key is missing", () => {
    beforeEach(() => {
      mockApiKey = "";
    });

    it("renders a message", () => {
      render(<Map trucks={[]} userLocation={mockUserLocation} />);
      
      // Check for the error message container
      const container = screen.getByRole('alert', { name: /api key/i });
      expect(container).toHaveTextContent('Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to display the map');
    });
  });

  describe("when API key is present", () => {
    it("renders the map with markers", () => {
      render(<Map trucks={mockTrucks} userLocation={mockUserLocation} />);
  
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
      render(<Map trucks={mockTrucks} userLocation={mockUserLocation} />);
  
      const marker = screen.getByTitle("Truck A — 123 Main St");
      fireEvent.click(marker);
  
      expect(screen.getByText("Truck A")).toBeInTheDocument();
      expect(screen.getByText("tacos, burritos")).toBeInTheDocument();
    });
  });
});

