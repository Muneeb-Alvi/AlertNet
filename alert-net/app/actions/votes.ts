"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "../firebaseConfig"
import { doc, getDoc, setDoc, deleteDoc, runTransaction, serverTimestamp } from "firebase/firestore"

interface VoteData {
  affirmative: boolean
  alert_id: string
  user_id: string
  time: any // Firebase Timestamp
}

export async function submitVote(alertId: string, affirmative: boolean, userId: string | null) {
  if (!userId) {
    redirect("/login")
  }

  try {
    const voteRef = doc(db, "votes", `${alertId}_${userId}`)
    
    await runTransaction(db, async (transaction) => {
      const voteDoc = await transaction.get(voteRef)
      const alertRef = doc(db, "alerts", alertId)
      const alertDoc = await transaction.get(alertRef)

      if (!alertDoc.exists()) {
        throw new Error("Alert not found")
      }

      const alertData = alertDoc.data()
      const affirmativeCount = alertData.affirmativeCount || 0
      const negativeCount = alertData.negativeCount || 0
      
      if (voteDoc.exists()) {
        const existingVote = voteDoc.data() as VoteData
        if (existingVote.affirmative === affirmative) {
          // Remove vote if clicking same button
          transaction.delete(voteRef)
          transaction.update(alertRef, {
            [affirmative ? "affirmativeCount" : "negativeCount"]: 
              affirmative ? affirmativeCount - 1 : negativeCount - 1
          })
        } else {
          // Update vote if changing from affirmative to negative or vice versa
          transaction.set(voteRef, { 
            affirmative, 
            alert_id: alertId,
            user_id: userId,
            time: serverTimestamp()
          })
          transaction.update(alertRef, {
            affirmativeCount: affirmative ? affirmativeCount + 1 : affirmativeCount - 1,
            negativeCount: affirmative ? negativeCount - 1 : negativeCount + 1
          })
        }
      } else {
        // Create new vote
        transaction.set(voteRef, {
          affirmative,
          alert_id: alertId,
          user_id: userId,
          time: serverTimestamp()
        })
        transaction.update(alertRef, {
          [affirmative ? "affirmativeCount" : "negativeCount"]: 
            affirmative ? affirmativeCount + 1 : negativeCount + 1
        })
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error submitting vote:", error)
    return { success: false, error: "Failed to submit vote" }
  }
}

export async function getUserVote(alertId: string, userId: string | null) {
  if (!userId) return null

  try {
    const voteRef = doc(db, "votes", `${alertId}_${userId}`)
    const voteDoc = await getDoc(voteRef)

    if (voteDoc.exists()) {
      const voteData = voteDoc.data() as VoteData
      return voteData.affirmative
    }

    return null
  } catch (error) {
    console.error("Error fetching user vote:", error)
    return null
  }
}