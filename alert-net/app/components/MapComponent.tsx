"use client";

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

// Remove the incorrect import of google-maps

interface Alert {
  id: number;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  locationDescription: string;
}

interface MapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  interactive?: boolean;
  initialLocation?: { lat: number; lng: number };
  alerts?: Array<Alert>;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 25.2048, // Dubai coordinates
  lng: 55.2708,
};

declare global {
  interface Window {
    initMap?: () => void; // Change this line to make initMap optional
    google: typeof google;
  }
}

export default function MapComponent({
  onLocationSelect,
  interactive = false,
  initialLocation,
  alerts = [],
}: MapComponentProps) {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const selectedAlert = alerts.find((alert) => alert.id === selectedPin);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize the map
  const initializeMap = useCallback(() => {
    console.log("initializeMap called, mapContainerRef:", mapContainerRef.current);
    if (!mapContainerRef.current || !window.google) {
      console.warn("Map container or google not available");
      return (
        <div className='relative w-full h-[400px] rounded-lg overflow-hidden border border-border'>
          {/* Always render the map container */}
          <div ref={mapContainerRef} style={mapContainerStyle} />

          {/* Overlay loading indicator until the map is loaded */}
          {!mapLoaded && (
            <div className='absolute inset-0 flex items-center justify-center bg-muted/80'>
              <div className='animate-pulse'>Loading maps...</div>
            </div>
          )}

          {/* Other overlays for alerts or interactive UI */}
          {selectedPin !== null && (
            <div className='absolute z-10 bottom-4 left-4 right-4 bg-background border rounded-lg shadow-lg p-4'>
              <h4 className='font-semibold'>{alerts[selectedPin].title}</h4>
              <p className='text-sm text-muted-foreground mt-1'>
                {alerts[selectedPin].description}
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                {alerts[selectedPin].locationDescription}
              </p>
            </div>
          )}
          {interactive && (
            <div className='absolute top-4 left-4 right-4 bg-background border rounded-lg shadow-lg p-4'>
              <p className='text-sm text-muted-foreground'>
                {selectedLocation
                  ? `Selected location: ${selectedLocation.lat.toFixed(
                      4
                    )}, ${selectedLocation.lng.toFixed(4)}`
                  : "Click on the map to select a location"}
              </p>
            </div>
          )}
        </div>
      );
    }

    try {
      const mapOptions: google.maps.MapOptions = {
        center: selectedLocation || defaultCenter,
        zoom: 10,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
      };

      const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      mapRef.current = map;

      // Add click listener for interactive mode
      if (interactive) {
        map.addListener("click", (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;

          const newLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          setSelectedLocation(newLocation);
          if (onLocationSelect) {
            onLocationSelect(newLocation);
          }

          // Update or create marker for selected location
          updateSelectedLocationMarker(newLocation);
        });
      }

      // Add markers for alerts
      alerts.forEach((alert) => {
        const marker = new window.google.maps.Marker({
          position: alert.location,
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
              ),
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });

        marker.addListener("click", () => {
          setSelectedPin(alert.id);
        });

        markersRef.current.push(marker);
      });

      // Add marker for selected location if it exists
      if (selectedLocation) {
        updateSelectedLocationMarker(selectedLocation);
      }

      setMapLoaded(true);
    } catch (error) {
      console.error("Map initialization error:", error);
      setLoadError("Failed to initialize Google Maps");
    }
  }, [interactive, onLocationSelect, selectedLocation, alerts]);

  const updateSelectedLocationMarker = useCallback((location: { lat: number; lng: number }) => {
    // Remove existing selected location marker
    markersRef.current = markersRef.current.filter((marker) => {
      if (marker.getTitle() === "selected-location") {
        marker.setMap(null);
        return false;
      }
      return true;
    });

    // Add new marker
    if (mapRef.current && window.google) {
      const marker = new window.google.maps.Marker({
        position: location,
        map: mapRef.current,
        title: "selected-location",
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
            ),
          scaledSize: new window.google.maps.Size(30, 30),
        },
      });
      markersRef.current.push(marker);
    }
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;

      // Define callback
      // Inside your useEffect where you create the script:
      window.initMap = () => {
        console.log("initMap callback called");
        initializeMap();
      };

      // Handle errors
      script.onerror = () => {
        setLoadError("Failed to load Google Maps");
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        if (window.initMap) {
          delete window.initMap;
        }
      };
    } else {
      console.log("window.google already exists, calling initializeMap directly");
      initializeMap();
    }
  }, [initializeMap]);

  useLayoutEffect(() => {
    if (mapContainerRef.current && window.google && !mapLoaded) {
      console.log("useLayoutEffect: map container is available, initializing map");
      initializeMap();
    }
  }, [mapLoaded, initializeMap]);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  if (loadError) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error loading Google Maps</AlertTitle>
        <AlertDescription>
          Please make sure you have:
          <ul className='list-disc pl-4 mt-2'>
            <li>Added a valid Google Maps API key to your environment variables</li>
            <li>Enabled the Maps JavaScript API in your Google Cloud Console</li>
            <li>Set up proper billing for your Google Cloud Project</li>
            <li>Configured appropriate API key restrictions</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  // if (!mapLoaded) {
  //   return (
  //     <div className='flex items-center justify-center h-[400px] bg-muted text-muted-foreground'>
  //       <div className='animate-pulse'>Loading maps...</div>
  //     </div>
  //   );
  // }

  return (
    <div className='relative w-full h-[400px] rounded-lg overflow-hidden border border-border'>
      <div ref={mapContainerRef} style={mapContainerStyle} />

      {!mapLoaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-muted/80'>
          <div className='animate-pulse'>Loading maps...</div>
        </div>
      )}

      {selectedAlert && (
        <div className='absolute z-10 bottom-4 left-4 right-4 bg-background border rounded-lg shadow-lg p-4'>
          <h4 className='font-semibold'>{selectedAlert.title}</h4>
          <p className='text-sm text-muted-foreground mt-1'>{selectedAlert.description}</p>
          <p className='text-xs text-muted-foreground mt-1'>{selectedAlert.locationDescription}</p>
        </div>
      )}

      {interactive && (
        <div className='absolute top-4 left-4 right-4 bg-background border rounded-lg shadow-lg p-4'>
          <p className='text-sm text-muted-foreground'>
            {selectedLocation
              ? `Selected location: ${selectedLocation.lat.toFixed(
                  4
                )}, ${selectedLocation.lng.toFixed(4)}`
              : "Click on the map to select a location"}
          </p>
        </div>
      )}
    </div>
  );
}
