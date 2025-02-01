export type Alert = {
  id: number;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  locationDescription: string;
};
