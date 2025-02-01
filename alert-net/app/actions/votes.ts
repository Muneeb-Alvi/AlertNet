"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type VoteType = "up" | "down";

export async function submitVote(alertId: number, voteType: VoteType, userId: string | null) {
  if (!userId) {
    // Store the intended vote in the session or URL params when implementing
    // the return-to-previous-page functionality
    redirect("/login");
  }

  try {
    // Here you would typically:
    // 1. Check if user has already voted
    // 2. Remove previous vote if exists
    // 3. Add new vote
    // 4. Update alert vote counts

    // Example SQL (adjust according to your database schema):
    /*
    // Check existing vote
    const existingVote = await db.vote.findFirst({
      where: {
        alertId,
        userId,
      },
    })

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Remove vote if clicking same button
        await db.vote.delete({
          where: {
            id: existingVote.id,
          },
        })
      } else {
        // Update vote if changing from up to down or vice versa
        await db.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            type: voteType,
          },
        })
      }
    } else {
      // Create new vote
      await db.vote.create({
        data: {
          alertId,
          userId,
          type: voteType,
        },
      })
    }
    */

    // For now, just log the vote (replace with actual database calls)
    console.log(`Vote submitted: Alert ${alertId}, Type ${voteType}, User ${userId}`);

    // Revalidate the page to reflect the new vote counts
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { success: false, error: "Failed to submit vote" };
  }
}

export async function getUserVote(alertId: number, userId: string | null) {
  if (!userId) return null;

  try {
    // Example SQL (adjust according to your database schema):
    /*
    const vote = await db.vote.findFirst({
      where: {
        alertId,
        userId,
      },
    })
    return vote?.type || null
    */

    // For now, return null (replace with actual database query)
    return null;
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return null;
  }
}
