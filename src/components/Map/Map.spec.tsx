"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Map } from "./Map";
import type { FoodTruck } from "@/types/food-truck";
import type { Coordinates } from "@/types/coordinates";

interface MockComponentProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface PinProps {
  background?: string;
  glyphColor?: string;
  borderColor?: string;
  [key: string]: unknown;
}

jest.mock("@vis.gl/react-google-maps", () => {
  const BaseComponent = ({ children, ...props }: MockComponentProps) => {
    // Filter out problematic props
    const {
      apiKey: _apiKey,
      mapId: _mapId,
      defaultZoom: _defaultZoom,
      defaultCenter: _defaultCenter,
      gestureHandling: _gestureHandling,
      clickableIcons: _clickableIcons,
      keyboardShortcuts: _keyboardShortcuts,
      zoomControl: _zoomControl,
      onCloseClick: _onCloseClick,
      ...rest
    } = props;
    return <div {...rest}>{children}</div>;
  };
  BaseComponent.displayName = 'MockComponent';

  const PinComponent = ({ background: _bg, glyphColor: _gc, borderColor: _bc, ...props }: PinProps) => {
    // Render pin without passing custom props to DOM
    return <div data-testid="map-pin" {...props} />;
  };
  PinComponent.displayName = 'MockPin';

  return {
    APIProvider: BaseComponent,
    Map: BaseComponent,
    AdvancedMarker: BaseComponent,
    Pin: PinComponent,
    InfoWindow: BaseComponent,
  };
});

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
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: "test-api-key",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("renders a message if API key is missing", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    render(<Map trucks={[]} userLocation={mockUserLocation} />);
    expect(
      screen.getByText(/Set/i)
    ).toBeInTheDocument();
  });

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

