export type Alert = {
  id: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  locationDescription: string;
};
