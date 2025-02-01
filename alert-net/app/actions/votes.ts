"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

interface VoteData {
  affirmative: boolean;
  alert_id: string;
  user_id: string;
  time: any;
}

export async function submitVote(alertId: string, affirmative: boolean, userId: string | null) {
  if (!userId) {
    redirect("/login");
  }

  try {
    const voteRef = doc(db, "votes", `${alertId}_${userId}`);

    await runTransaction(db, async (transaction) => {
      const voteDoc = await transaction.get(voteRef);
      const alertRef = doc(db, "alerts", alertId);
      const alertDoc = await transaction.get(alertRef);

      if (!alertDoc.exists()) {
        throw new Error("Alert not found");
      }

      const alertData = alertDoc.data();
      if (voteDoc.exists()) {
        const existingVote = voteDoc.data() as VoteData;
        if (existingVote.affirmative === affirmative) {
          transaction.delete(voteRef);
              if (affirmative) {
                transaction.update(alertRef, {
              num_responses: alertData.num_responses - 1,
              num_affirmatives: alertData.num_affirmatives - 1
                });
          } else {
            transaction.update(alertRef, {
              num_responses: alertData.num_responses - 1
          });
        }
      } else {
        transaction.set(voteRef, {
          affirmative,
          alert_id: alertId,
          user_id: userId,
          time: serverTimestamp(),
        });
        transaction.update(alertRef, {
            num_affirmatives: affirmative 
              ? alertData.num_affirmatives + 1 
              : alertData.num_affirmatives - 1
        });
      }
      } else {
        transaction.set(voteRef, {
          affirmative,
          alert_id: alertId,
          user_id: userId,
          time: serverTimestamp(),
    });
        if (affirmative) {
          transaction.update(alertRef, {
            num_responses: alertData.num_responses + 1,
            num_affirmatives: alertData.num_affirmatives + 1
          });
        } else {
          transaction.update(alertRef, {
            num_responses: alertData.num_responses + 1
          });
        }
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error submitting vote:", error);
    return { success: false, error: "Failed to submit vote" };
  }
}

export async function getUserVote(alertId: string, userId: string | null) {
  if (!userId) return null;

  try {
    const voteRef = doc(db, "votes", `${alertId}_${userId}`);
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
      const voteData = voteDoc.data() as VoteData;
      return voteData.affirmative;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return null;
  }
}
