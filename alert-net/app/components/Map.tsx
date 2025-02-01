"use client";

import { useState } from "react";

type Alert = {
  id: number;
  title: string;
  description: string;
  location: string;
};

export default function Map() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Suspicious activity",
      description: "Saw someone trying to break into a car",
      location: "Downtown",
    },
    {
      id: 2,
      title: "Lost pet",
      description: "Golden retriever last seen in the park",
      location: "Central Park",
    },
  ]);

  return (
    <div className='bg-muted h-[400px] relative'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <p className='text-muted-foreground'>Interactive map placeholder</p>
      </div>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className='absolute cursor-pointer'
          style={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%` }}
          onMouseEnter={() => setSelectedAlert(alert)}
          onMouseLeave={() => setSelectedAlert(null)}
          onClick={() => setSelectedAlert(alert)}
        >
          <div className='w-4 h-4 bg-destructive rounded-full' />
          {selectedAlert === alert && (
            <div className='absolute z-10 bg-background border border-border p-2 rounded shadow-lg mt-2 w-48'>
              <h4 className='font-semibold'>{alert.title}</h4>
              {selectedAlert && (
                <p className='text-sm text-muted-foreground'>{alert.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
