"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import MapComponent from "../components/MapComponent";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../components/ui/use-toast";

export default function CreateAlert() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDescription, setLocationDescription] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // Calculate the minimum time (3 hours ago)
  const minTime = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const maxTime = new Date().toISOString().slice(0, 16);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    // Here you would typically send the alert data to your backend
    console.log({ title, description, time, location, locationDescription });
    router.push("/");
  };

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    setLocation(coords);
    // Here you would typically use a reverse geocoding service to get a human-readable address
    setLocationDescription(`Near ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // Update state in CreateAlert
          setLocation(coords);
          setLocationDescription(`Near ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
          // Optionally, call handleLocationSelect to trigger marker creation
          handleLocationSelect(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please select on the map.",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Geolocation Unavailable",
        description: "Your browser doesn't support geolocation. Please select on the map.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // or a loading indicator if you prefer
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8 mt-16'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8'>Create Alert</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium mb-2'>
                Title
              </label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder='Brief description of the incident'
              />
            </div>

            <div>
              <label htmlFor='description' className='block text-sm font-medium mb-2'>
                Description
              </label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder='Detailed description of what happened'
              />
            </div>

            <div>
              <label htmlFor='time' className='block text-sm font-medium mb-2'>
                Time of Incident
              </label>
              <Input
                type='datetime-local'
                id='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                min={minTime}
                max={maxTime}
                required
              />
              <p className='text-sm text-muted-foreground mt-1'>
                You can report incidents that occurred up to 3 hours ago
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Location</label>
              <Button
                type='button'
                variant='secondary'
                onClick={getCurrentLocation}
                className='mb-4'
              >
                Use Current Location
              </Button>

              <MapComponent
                interactive
                onLocationSelect={handleLocationSelect}
                initialLocation={location || undefined}
              />

              {location && (
                <p className='text-sm text-muted-foreground mt-2'>
                  Selected location: {locationDescription}
                </p>
              )}

              {!location && (
                <p className='text-sm text-muted-foreground mt-2'>
                  Please select a location on the map or use your current location
                </p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={!location}>
              Submit Alert
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
