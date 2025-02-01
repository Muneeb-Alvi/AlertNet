"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { submitVote, getUserVote } from "../actions/votes";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { cn } from "../lib/utils";

interface VoteProps {
  alertId: string;
  initialAffirmativeCount?: number;
  initialNegativeCount?: number;
  className?: string;
}

export function Vote({
  alertId,
  initialAffirmativeCount = 0,
  initialNegativeCount = 0,
  className,
}: VoteProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [affirmativeCount, setAffirmativeCount] = useState(initialAffirmativeCount);
  const [negativeCount, setNegativeCount] = useState(initialNegativeCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserVote = async () => {
      if (user?.uid) {
        const vote = await getUserVote(alertId, user.uid);
        setUserVote(vote);
      }
    };
    fetchUserVote();
  }, [alertId, user]);

  const handleVote = async (affirmative: boolean) => {
    if (!user?.uid) {
      toast({
        title: "Authentication required",
        description: "Please login to vote",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      // Optimistic update
      const isRemovingVote = userVote === affirmative;

      if (userVote !== null) {
        // Remove previous vote
        if (userVote) {
          setAffirmativeCount((prev) => prev - 1);
        } else {
          setNegativeCount((prev) => prev - 1);
        }
      }

      if (!isRemovingVote) {
        // Add new vote
        if (affirmative) {
          setAffirmativeCount((prev) => prev + 1);
        } else {
          setNegativeCount((prev) => prev + 1);
        }
      }

      setUserVote(isRemovingVote ? null : affirmative);

      const result = await submitVote(alertId, affirmative, user.uid);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      // Revert optimistic updates
      setUserVote(null);
      setAffirmativeCount(initialAffirmativeCount);
      setNegativeCount(initialNegativeCount);

      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center space-x-4", className)}>
      <Button
        onClick={() => handleVote(true)}
        variant={userVote === true ? "default" : "outline"}
        className={cn("flex items-center", userVote === true && "bg-green-600 hover:bg-green-700")}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <ThumbsUp className='mr-2 h-4 w-4' />
        )}
        Confirm ({affirmativeCount})
      </Button>
      <Button
        onClick={() => handleVote(false)}
        variant={userVote === false ? "default" : "outline"}
        className={cn("flex items-center", userVote === false && "bg-red-600 hover:bg-red-700")}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <ThumbsDown className='mr-2 h-4 w-4' />
        )}
        Dispute ({negativeCount})
      </Button>
    </div>
  );
}
