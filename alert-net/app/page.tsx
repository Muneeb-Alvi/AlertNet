"use client";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MapComponent from "./components/MapComponent";
import AlertList from "./components/AlertList";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Shield, Bell, Users, Brain, BarChartIcon as ChartBar } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Alert } from "./types/alerts";

// interface Alert {
//   id: string;
//   title: string;
//   description: string;
//   location: { lat: number; lng: number };
//   locationDescription: string;
// }

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsCollection = collection(db, "alerts");
        const alertSnapshot = await getDocs(alertsCollection);
        const alertList: Alert[] = alertSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? "Untitled", // Provide default if missing
            description: data.description ?? "",
            location: data.location ?? { lat: 0, lng: 0 }, // You might want to handle this more gracefully
            locationDescription: data.locationDescription ?? "",
          };
        });
        setAlerts(alertList);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground'>
      <Header />

      {/* Hero Section */}
      <section className='pt-24 pb-12 bg-gradient-to-b from-primary/10 to-background'>
        <div className='container px-4 mx-auto'>
          <div className='max-w-3xl mx-auto text-center mb-12'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-6'>
              Community-Driven Incident Reporting for a Safer MENA Region
            </h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Join our network of vigilant citizens helping to create safer communities through
              real-time incident reporting and AI-powered analytics.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/create-alert'>
                <Button size='lg'>Report Incident</Button>
              </Link>
              <Link href='/login'>
                <Button variant='outline' size='lg'>
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Map and Alerts Section */}
      <section className='py-12'>
        <div className='container px-4 mx-auto'>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h2 className='text-2xl font-bold mb-4'>Live Incident Map</h2>
              <MapComponent alerts={alerts} />
            </div>
            <AlertList alerts={alerts} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-12 bg-card'>
        <div className='container px-4 mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>Why Choose AlertNet?</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <Bell className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Real-Time Alerts</h3>
              <p className='text-muted-foreground'>
                Stay informed about incidents in your area as they happen with our real-time
                reporting system.
              </p>
            </div>
            <div className='flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <Users className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Community Validation</h3>
              <p className='text-muted-foreground'>
                Our unique validation system ensures the accuracy of reports through community
                verification.
              </p>
            </div>
            <div className='flex flex-col items-center text-center'>
              <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                <Brain className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>AI-Powered Analytics</h3>
              <p className='text-muted-foreground'>
                Advanced AI algorithms analyze patterns and provide insights for better community
                safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='how-it-works' className='py-12'>
        <div className='container px-4 mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>How It Works</h2>
          <div className='grid md:grid-cols-4 gap-8'>
            {[
              {
                step: 1,
                title: "Sign Up",
                description: "Create your account to join our community of vigilant citizens",
                icon: Shield,
              },
              {
                step: 2,
                title: "Report Incidents",
                description: "Submit detailed reports about incidents in your area",
                icon: Bell,
              },
              {
                step: 3,
                title: "Community Validation",
                description: "Other users verify and validate reported incidents",
                icon: Users,
              },
              {
                step: 4,
                title: "Stay Informed",
                description: "Receive alerts and analytics about your community",
                icon: ChartBar,
              },
            ].map((item) => (
              <div key={item.step} className='text-center'>
                <div className='w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4'>
                  {item.step}
                </div>
                <h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
                <p className='text-muted-foreground'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-12 bg-card'>
        <div className='container px-4 mx-auto'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-3xl font-bold mb-6'>About AlertNet</h2>
            <p className='text-lg text-muted-foreground mb-8'>
              AlertNet is a community-driven platform designed to enhance safety and security in the
              MENA region through crowd-sourced incident reporting and AI-powered analytics. Our
              mission is to create safer communities by enabling citizens to actively participate in
              community safety initiatives.
            </p>
            <div className='grid sm:grid-cols-2 gap-6'>
              <div className='p-6 bg-background rounded-lg'>
                <h3 className='text-xl font-semibold mb-2'>Our Mission</h3>
                <p className='text-muted-foreground'>
                  To empower communities with real-time information and tools for creating safer
                  neighborhoods through collective vigilance and cooperation.
                </p>
              </div>
              <div className='p-6 bg-background rounded-lg'>
                <h3 className='text-xl font-semibold mb-2'>Our Vision</h3>
                <p className='text-muted-foreground'>
                  To become the leading platform for community safety and incident reporting in the
                  MENA region, fostering safer and more connected communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-12 bg-primary text-primary-foreground'>
        <div className='container px-4 mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Make Your Community Safer?</h2>
          <p className='text-xl mb-8 text-primary-foreground/80'>
            Join AlertNet today and be part of the solution.
          </p>
          <Link href='/login'>
            <Button size='lg' variant='secondary'>
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
