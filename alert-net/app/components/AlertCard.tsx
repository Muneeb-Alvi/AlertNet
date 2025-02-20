"use client";

import { cn } from "../lib/utils";
import type { Alert } from "@/app/types/alerts";
import { Vote } from "./Vote";

interface AlertCardProps {
  alert: Alert;
  className?: string;
}

export function AlertCard({ alert, className }: AlertCardProps) {
  return (
    <div className={cn("bg-background border rounded-lg shadow-lg p-4", className)}>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <h4 className='font-semibold'>{alert.title}</h4>
          <p className='text-sm text-muted-foreground mt-1'>{alert.description}</p>
          <p className='text-xs text-muted-foreground mt-1'>City: {alert.locationDescription}</p>
          <p className='text-xs text-muted-foreground mt-1'>Category: {alert.category}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Credibility Score (out of 1): {Number(alert.prob_true_random_forrest).toFixed(2)}
          </p>
        </div>
        <Vote
          alertId={alert.id}
          initialAffirmativeCount={alert.num_affirmatives}
          initialNegativeCount={alert.num_responses - alert.num_affirmatives || 0}
          className='ml-4'
        />
      </div>
    </div>
  );
}
