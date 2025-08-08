"use client";

import { render, screen } from "@testing-library/react";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders with default values", () => {
    render(<Slider />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
  });

  it("renders with a given value", () => {
    render(<Slider value={[50]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders with custom min and max", () => {
    render(<Slider min={10} max={90} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "10");
    expect(slider).toHaveAttribute("aria-valuemax", "90");
  });
});

