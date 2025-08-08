"use client";

import { useMemo, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import type { MapProps, MapTruckMarker } from "../../types/map";
import { mapsConfig } from "@/config/maps";

export const Map = ({ trucks, userLocation }: MapProps) => {
  const { apiKey, mapId } = mapsConfig;

  const mapCenter = useMemo(
    () => ({ lat: userLocation.latitude, lng: userLocation.longitude }),
    [userLocation.latitude, userLocation.longitude]
  );

  const [selected, setSelected] = useState<MapTruckMarker | null>(null);

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
      <div style={{ height: "50vh", width: "100%" }}>
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
              onClick={() => setSelected(t)}
            >
              <Pin background="#dc2626" glyphColor="#ffffff" borderColor="#dc2626" />
            </AdvancedMarker>
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="max-w-[240px] text-black">
                <div className="font-semibold">{selected.applicant}</div>
                <div className="text-xs">{selected.locationdescription}</div>
                {selected.fooditems && (
                  <div className="text-xs italic mt-1 whitespace-pre-wrap break-words">
                    {selected.fooditems}
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


