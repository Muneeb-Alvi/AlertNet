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
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function CreateAlert() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationDescription, setLocationDescription] = useState("");
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const minTime = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const maxTime = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    try {
      if (!db) {
        throw new Error("Database connection not available");
      }
      const alertData = {
        title,
        description,
        time,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        location_description: locationDescription,
        createdAt: serverTimestamp(),
        userId: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        status: "active",
      };

      const alertsRef = collection(db, "alerts");
      await addDoc(alertsRef, alertData);

      toast({
        title: "Success",
        description: "Alert has been created successfully",
      });

      router.push("/");
    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    setLocation(coords);
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
          setLocation(coords);
          // setLocationDescription(`Near ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
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
    return null;
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
              <label htmlFor='locationDescription' className='block text-sm font-medium mb-2'>
                Location Description
              </label>
              <Textarea
                id='locationDescription'
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                required
                rows={4}
                placeholder='Description of the area where it happened'
              />
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
