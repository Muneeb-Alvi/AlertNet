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
  category: string;
  prob_true_llm_news: number;
  // ... other fields if needed
};
