import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { SubstackAutomation } from "@/lib/substack-automation"

export async function POST(request: NextRequest) {
  try {
    const { email, success, error: syncError, action } = await request.json()

    if (action === "sync-all") {
      // Trigger sync of all pending subscribers
      const automation = SubstackAutomation.getInstance()
      const result = await automation.syncPendingSubscribers()

      return NextResponse.json({
        success: true,
        message: `Sync completed: ${result.successful} successful, ${result.failed} failed`,
        stats: result,
      })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Update sync status for specific email
    const { error } = await supabase
      .from("email_subscribers")
      .update({
        substack_synced: success,
        sync_attempts: supabase.raw("sync_attempts + 1"),
        last_sync_attempt: new Date().toISOString(),
        sync_error: syncError || null,
      })
      .eq("email", email)

    if (error) {
      console.error("Error updating sync status:", error)
      return NextResponse.json({ error: "Failed to update sync status" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in subscribers sync:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
