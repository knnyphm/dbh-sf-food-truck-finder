import { render, screen } from "@testing-library/react";
import { LocationLoading } from "./LocationLoading";

describe("LocationLoading", () => {
  it("renders the loading message", () => {
    render(<LocationLoading />);
    
    expect(screen.getByText("Getting your location...")).toBeInTheDocument();
  });

  it("renders the spinner", () => {
    render(<LocationLoading />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin", "rounded-full", "h-4", "w-4", "border-b-2", "border-blue-600");
  });

  it("applies correct styling classes", () => {
    render(<LocationLoading />);
    
    const container = document.querySelector('.rounded.border.border-blue-200');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("rounded", "border", "border-blue-200", "bg-blue-50", "text-blue-900", "p-4");
    
    const innerContainer = document.querySelector('.flex.items-center.gap-2');
    expect(innerContainer).toBeInTheDocument();
    expect(innerContainer).toHaveClass("flex", "items-center", "gap-2");
  });
});
