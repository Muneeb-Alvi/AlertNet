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

interface AlertListProps {
  alerts: Alert[];
}

export default function AlertList({ alerts }: AlertListProps) {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Recent Alerts</h2>
      <ul className='space-y-4'>
        {alerts.map((alert) => (
          <li key={alert.id} className='bg-muted p-4 rounded'>
            <h3 className='text-lg font-semibold'>{alert.title}</h3>
            <p className='text-muted-foreground'>{alert.description}</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Location: {alert.locationDescription}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
