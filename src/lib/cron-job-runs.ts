import type { SupabaseClient } from "@supabase/supabase-js";

export const WEEKLY_RECAP_JOB = "weekly-recap";

type ClaimResult =
  | { ok: true; claimed: true }
  | { ok: true; claimed: false; reason: "already_ran"; existing: CronJobRunRow }
  | { ok: false; message: string };

export type CronJobRunRow = {
  job: string;
  run_date: string;
  issue_slug: string | null;
  attempted: number;
  sent: number;
  failed: number;
  status: string;
};

/** Atomically claim today's run. Second caller gets claimed: false. */
export async function claimCronJobRun(
  supabase: SupabaseClient,
  job: string,
  runDate: string,
  issueSlug: string | null,
): Promise<ClaimResult> {
  const { error } = await supabase.from("cron_job_runs").insert({
    job,
    run_date: runDate,
    issue_slug: issueSlug,
    status: "claimed",
  });

  if (!error) return { ok: true, claimed: true };

  // Unique violation: already claimed/completed today.
  if (error.code === "23505") {
    const { data } = await supabase
      .from("cron_job_runs")
      .select("job, run_date, issue_slug, attempted, sent, failed, status")
      .eq("job", job)
      .eq("run_date", runDate)
      .maybeSingle();
    return {
      ok: true,
      claimed: false,
      reason: "already_ran",
      existing: (data as CronJobRunRow | null) ?? {
        job,
        run_date: runDate,
        issue_slug: issueSlug,
        attempted: 0,
        sent: 0,
        failed: 0,
        status: "claimed",
      },
    };
  }

  return { ok: false, message: error.message || "Could not claim cron run." };
}

export async function completeCronJobRun(
  supabase: SupabaseClient,
  job: string,
  runDate: string,
  stats: { issueSlug: string | null; attempted: number; sent: number; failed: number },
): Promise<void> {
  const { error } = await supabase
    .from("cron_job_runs")
    .update({
      issue_slug: stats.issueSlug,
      attempted: stats.attempted,
      sent: stats.sent,
      failed: stats.failed,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("job", job)
    .eq("run_date", runDate);

  if (error) {
    console.error(`Failed to mark ${job} complete for ${runDate}:`, error);
  }
}
