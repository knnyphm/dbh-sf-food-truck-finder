import { render, screen, fireEvent } from "@testing-library/react";
import { LocationError } from "./LocationError";

describe("LocationError", () => {
  const mockOnRetry = jest.fn();
  const mockError = "Unable to get your location. Please check your browser settings and try again.";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the error message", () => {
    render(<LocationError error={mockError} onRetry={mockOnRetry} />);
    
    expect(screen.getByText("Location Error")).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it("renders the retry button", () => {
    render(<LocationError error={mockError} onRetry={mockOnRetry} />);
    
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    render(<LocationError error={mockError} onRetry={mockOnRetry} />);
    
    const retryButton = screen.getByText("Try Again");
    fireEvent.click(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it("applies correct styling classes", () => {
    render(<LocationError error={mockError} onRetry={mockOnRetry} />);
    
    const container = screen.getByText("Location Error").parentElement?.parentElement;
    expect(container).toHaveClass("rounded", "border", "border-red-200", "bg-red-50", "text-red-900", "p-4");
    
    const button = screen.getByText("Try Again");
    expect(button).toHaveClass("bg-green-600", "text-white", "px-4", "py-2", "rounded", "shadow", "hover:bg-green-700", "transition-colors");
  });
});
