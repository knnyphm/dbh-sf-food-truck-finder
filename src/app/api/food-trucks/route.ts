import { NextResponse } from "next/server";
import type { RawFoodTruck } from "./types";

const ENDPOINT_URL =
  "https://data.sfgov.org/resource/rqzj-sfat.json";

export async function GET() {
  try {
    const res = await fetch(ENDPOINT_URL, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Upstream error: ${res.status}`);
    }
    const data = (await res.json()) as RawFoodTruck[];
    return NextResponse.json(data);
  } catch (error) {
    console.error("food-trucks route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch food trucks" },
      { status: 500 }
    );
  }
}


