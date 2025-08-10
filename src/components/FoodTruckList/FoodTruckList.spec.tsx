"use client";

import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
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

const mockOnTruckSelect = jest.fn();

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: mockScrollIntoView,
});

// Mock setTimeout
jest.useFakeTimers();

describe("FoodTruckList", () => {
  beforeEach(() => {
    mockOnTruckSelect.mockClear();
    mockScrollIntoView.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders skeleton loader when loading", () => {
    render(
      <FoodTruckList 
        trucks={[]} 
        loading={true} 
        selectedTruck={null}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it("renders a message when no trucks are found", () => {
    render(
      <FoodTruckList 
        trucks={[]} 
        loading={false} 
        selectedTruck={null}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    expect(screen.getByText("No nearby food trucks found.")).toBeInTheDocument();
  });

  it("renders a list of food trucks", () => {
    render(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={null}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    expect(screen.getByText("Truck A")).toBeInTheDocument();
    expect(screen.getByText("tacos, burritos")).toBeInTheDocument();
    expect(screen.getByText("Truck B")).toBeInTheDocument();
    expect(screen.getByText("burgers, fries")).toBeInTheDocument();
  });

  it("highlights selected truck", () => {
    render(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={mockTrucks[0]}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    
    const selectedTruckElement = screen.getByText("Truck A").closest('li');
    expect(selectedTruckElement).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it("calls onTruckSelect when a truck is clicked", () => {
    render(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={null}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    
    const truckElement = screen.getByText("Truck A").closest('li');
    fireEvent.click(truckElement!);
    
    expect(mockOnTruckSelect).toHaveBeenCalledWith(mockTrucks[0]);
  });

  it("deselects truck when clicking the same truck again", () => {
    render(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={mockTrucks[0]}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    
    const truckElement = screen.getByText("Truck A").closest('li');
    fireEvent.click(truckElement!);
    
    expect(mockOnTruckSelect).toHaveBeenCalledWith(null);
  });

  it("selects new truck when clicking different truck", () => {
    render(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={mockTrucks[0]}
        onTruckSelect={mockOnTruckSelect}
      />
    );
    
    const truckBElement = screen.getByText("Truck B").closest('li');
    fireEvent.click(truckBElement!);
    
    expect(mockOnTruckSelect).toHaveBeenCalledWith(mockTrucks[1]);
  });

  it("auto-scrolls to selected truck when selection changes", async () => {
    const { rerender } = render(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={null}
        onTruckSelect={mockOnTruckSelect}
      />
    );

    // Initially no scroll should happen
    expect(mockScrollIntoView).not.toHaveBeenCalled();

    // Now select a truck
    rerender(
      <FoodTruckList 
        trucks={mockTrucks} 
        loading={false} 
        selectedTruck={mockTrucks[0]}
        onTruckSelect={mockOnTruckSelect}
      />
    );

    // Should not call scrollIntoView immediately due to timeout
    expect(mockScrollIntoView).not.toHaveBeenCalled();

    // Fast-forward timers to trigger the scroll
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Should now call scrollIntoView with smooth behavior
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });
  });
});

