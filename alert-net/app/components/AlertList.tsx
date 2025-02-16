import type { Alert } from "@/app/types/alerts";

interface AlertListProps {
  alerts: Alert[];
}

export default function AlertList({ alerts }: AlertListProps) {
  // Sort the alerts by entry_date_time in ascending order (earliest first)
  const sortedAlerts = alerts
    .filter((alert) => alert.entry_date_time !== null)
    .sort((a, b) => {
      const getTime = (entry: any) => {
        // If entry_date_time has a toDate method, use it.
        if (entry && typeof entry.toDate === "function") {
          return entry.toDate().getTime();
        }
        // Otherwise, assume it's a valid date string or number.
        return new Date(entry).getTime();
      };

      return getTime(b.entry_date_time) - getTime(a.entry_date_time);
    });

  // Slice the first 5 alerts after sorting
  const topAlerts = sortedAlerts.slice(0, 3);

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Recent Alerts</h2>
      <ul className='space-y-4'>
        {topAlerts.map((alert) => (
          <li key={alert.id} className='bg-muted p-4 rounded'>
            <h3 className='text-lg font-semibold'>{alert.title}</h3>
            <p className='text-muted-foreground'>{alert.description}</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Location: {alert.locationDescription}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Date: {alert.entry_date_time?.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
