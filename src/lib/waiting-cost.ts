/** Weekly contribution future-value helpers for the waiting-cost illustration. */

export const WAITING_COST_HORIZON_YEARS = 30;

export const WAITING_COST_SCENARIOS = [
  { id: "now", label: "Start this week", delayYears: 0 },
  { id: "wait-1", label: "Wait 1 year", delayYears: 1 },
  { id: "wait-5", label: "Wait 5 years", delayYears: 5 },
  { id: "wait-10", label: "Wait 10 years", delayYears: 10 },
] as const;

export type WaitingCostScenarioId = (typeof WAITING_COST_SCENARIOS)[number]["id"];

/** Future value of end-of-week contributions over `years`, at `annualReturn`. */
export function futureValueWeekly(
  weeklyAmount: number,
  years: number,
  annualReturn: number,
): number {
  if (!Number.isFinite(weeklyAmount) || weeklyAmount <= 0 || years <= 0) {
    return 0;
  }
  const r = (1 + annualReturn) ** (1 / 52) - 1;
  const n = years * 52;
  if (r === 0) return weeklyAmount * n;
  return weeklyAmount * (((1 + r) ** n - 1) / r);
}

export function totalDeposits(weeklyAmount: number, years: number): number {
  if (!Number.isFinite(weeklyAmount) || weeklyAmount <= 0 || years <= 0) {
    return 0;
  }
  return weeklyAmount * 52 * years;
}

export type WaitingCostRow = {
  id: WaitingCostScenarioId;
  label: string;
  years: number;
  deposits: number;
  nestEgg: number;
  missed: number;
};

export function buildWaitingCostRows(
  weeklyAmount: number,
  annualReturn: number,
  horizonYears = WAITING_COST_HORIZON_YEARS,
): WaitingCostRow[] {
  const baseline = futureValueWeekly(weeklyAmount, horizonYears, annualReturn);
  return WAITING_COST_SCENARIOS.map((scenario) => {
    const years = horizonYears - scenario.delayYears;
    const nestEgg = futureValueWeekly(weeklyAmount, years, annualReturn);
    return {
      id: scenario.id,
      label: scenario.label,
      years,
      deposits: totalDeposits(weeklyAmount, years),
      nestEgg,
      missed: Math.max(0, baseline - nestEgg),
    };
  });
}

export function formatDollars(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function clampWeeklyAmount(value: number): number {
  if (!Number.isFinite(value)) return 25;
  return Math.min(1000, Math.max(1, Math.round(value)));
}
