"use client";

import { useMemo, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import type { MapProps, MapTruckMarker } from "./FoodTruckMap.types";
import { mapsConfig } from "@/config/maps";

export const FoodTruckMap = ({ trucks, userLocation }: MapProps) => {
  const { apiKey, mapId } = mapsConfig;

  const mapCenter = useMemo(
    () => ({ lat: userLocation.latitude, lng: userLocation.longitude }),
    [userLocation.latitude, userLocation.longitude]
  );

  const [selectedTruck, setSelectedTruck] = useState<MapTruckMarker | null>(null);

  if (!apiKey) {
    return (
      <div
        className="p-4 border rounded bg-yellow-50 text-yellow-900"
        role="alert"
        aria-label="API key missing"
      >
        Set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to display the map.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-80 lg:h-[80vh] w-full">
        <GoogleMap
          key={`${mapCenter.lat}-${mapCenter.lng}`}
          style={{ height: "100%", width: "100%", borderRadius: 8 }}
          defaultZoom={16}
          defaultCenter={mapCenter}
          gestureHandling="greedy"
          mapId={mapId as string}
          clickableIcons={false}
          keyboardShortcuts={true}
          zoomControl={true}
        >
          {userLocation && (
            <AdvancedMarker
              position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
              title="Your location"
            >
              <Pin
                background="#10b981"
                glyphColor="#ffffff"
                borderColor="#059669"
              />
            </AdvancedMarker>
          )}
          {trucks.map((t, idx) => (
            <AdvancedMarker
              key={`${t.applicant}-${idx}`}
              position={{ lat: t.latitude, lng: t.longitude }}
              title={`${t.applicant} — ${t.locationdescription}`}
              onClick={() => setSelectedTruck(t)}
            >
              <Pin background="#dc2626" glyphColor="#ffffff" borderColor="#dc2626" />
            </AdvancedMarker>
          ))}

          {selectedTruck && (
            <InfoWindow
              position={{ lat: selectedTruck.latitude, lng: selectedTruck.longitude }}
              onCloseClick={() => setSelectedTruck(null)}
              headerContent={<div className="font-semibold text-lg">{selectedTruck.applicant}</div>}
            >
              <div className="max-w-[240px] text-black">
                <div className="text-xs">{selectedTruck.locationdescription}</div>
                {selectedTruck.fooditems && (
                  <div className="text-xs italic mt-1 whitespace-pre-wrap break-words">
                    {selectedTruck.fooditems}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </APIProvider>
  );
}
