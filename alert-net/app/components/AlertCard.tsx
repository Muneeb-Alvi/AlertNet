"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "@/app/context/AuthContext";
import { submitVote } from "@/app/actions/votes";
import { useToast } from "../components/ui/use-toast";
import type { Alert } from "@/app/types/alerts";

interface AlertCardProps {
  alert: Alert;
  className?: string;
}

export function AlertCard({ alert, className }: AlertCardProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(alert.votes?.userVote || null);
  const [upvotes, setUpvotes] = useState(alert.votes?.upvotes || 0);
  const [downvotes, setDownvotes] = useState(alert.votes?.downvotes || 0);

  const handleVote = async (voteType: "up" | "down") => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isVoting || userVote === voteType) return;

    try {
      setIsVoting(true);

      // Optimistically update UI
      if (userVote) {
        // Remove previous vote
        if (userVote === "up") {
          setUpvotes((prev) => prev - 1);
        } else {
          setDownvotes((prev) => prev - 1);
        }
      }
      setUserVote(voteType);
      if (voteType === "up") {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }

      // Submit vote to server
      const result = await submitVote(alert.id, voteType, "user_id"); // Replace with actual user ID

      if (!result.success) {
        throw new Error(result.error || "Failed to submit vote");
      }
    } catch (error) {
      // Revert optimistic update on error
      setUserVote(alert.votes?.userVote || null);
      setUpvotes(alert.votes?.upvotes || 0);
      setDownvotes(alert.votes?.downvotes || 0);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit vote. Please try again.",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className={cn("bg-background border rounded-lg shadow-lg p-4", className)}>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <h4 className='font-semibold'>{alert.title}</h4>
          <p className='text-sm text-muted-foreground mt-1'>{alert.description}</p>
          <p className='text-xs text-muted-foreground mt-1'>{alert.locationDescription}</p>
        </div>
        <div className='flex items-center gap-2 ml-4'>
          <button
            onClick={() => handleVote("up")}
            disabled={isVoting || userVote === "up"}
            className={cn(
              "p-1.5 rounded-full transition-colors relative",
              userVote === "up"
                ? "bg-green-900 text-green-100"
                : "hover:bg-green-900/10 text-muted-foreground hover:text-green-900"
            )}
          >
            {isVoting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ThumbsUp className='h-4 w-4' />
            )}
            <span className='sr-only'>Upvote</span>
          </button>
          <button
            onClick={() => handleVote("down")}
            disabled={isVoting || userVote === "down"}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              userVote === "down"
                ? "bg-red-900 text-red-100"
                : "hover:bg-red-900/10 text-muted-foreground hover:text-red-900"
            )}
          >
            {isVoting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ThumbsDown className='h-4 w-4' />
            )}
            <span className='sr-only'>Downvote</span>
          </button>
        </div>
      </div>
    </div>
  );
}
