/** Scannable Mon–Sun dinner cards for grocery-week and similar printables. */
export function WeekMealPlan({
  days,
}: {
  days: { day: string; plan: string }[];
}) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2">
      {days.map((row) => (
        <article
          key={row.day}
          className="break-inside-avoid rounded-xl border border-rule bg-paper-2/40 p-4 print:border-black/30 print:bg-white"
        >
          <p className="font-stamp text-xs uppercase tracking-[0.18em] text-rust">
            {row.day}
          </p>
          <p className="mt-2 text-base leading-7 text-ink">{row.plan}</p>
        </article>
      ))}
    </div>
  );
}
