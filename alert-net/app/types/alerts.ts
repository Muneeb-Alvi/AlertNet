// types/alerts.ts
export type Alert = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  location_description: string;
  cluster: number;
  num_affirmatives: number;
  num_responses: number;
  prob_true_logistic: number;
  // ... other fields if needed
};
