"use client";

import { render, screen } from "@testing-library/react";
import { PageLayout } from "./PageLayout";

describe("PageLayout", () => {
  it("renders the header and children", () => {
    render(
      <PageLayout>
        <div>Child Content</div>
      </PageLayout>
    );

    expect(
      screen.getByRole("heading", { name: "Find SF Food Trucks" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discover nearby food trucks in San Francisco using your current location"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });
});

