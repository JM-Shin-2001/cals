import { CagrInput, CagrOutput, YearlyProjection } from './types';

export function calculateCagr(input: CagrInput): CagrOutput {
  const { initialPrincipal, monthlyContribution, expectedAnnualReturn, years } = input;

  if (years <= 0) {
    return {
      totalInvested: initialPrincipal,
      finalBalance: initialPrincipal,
      totalProfit: 0,
      profitRate: 0,
      yearlyProjections: [],
    };
  }

  const monthlyRate = expectedAnnualReturn / 100 / 12;
  const totalMonths = years * 12;

  let currentBalance = initialPrincipal;
  let totalInvested = initialPrincipal;
  const yearlyProjections: YearlyProjection[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
    totalInvested += monthlyContribution;

    if (m % 12 === 0) {
      const year = m / 12;
      yearlyProjections.push({
        year,
        investedSum: Math.round(totalInvested),
        projectedBalance: Math.round(currentBalance),
        accumulatedInterest: Math.round(currentBalance - totalInvested),
      });
    }
  }

  const finalBalance = Math.round(currentBalance);
  const totalProfit = finalBalance - totalInvested;
  const profitRate = totalInvested > 0 ? Math.round((totalProfit / totalInvested) * 10000) / 100 : 0;

  return {
    totalInvested,
    finalBalance,
    totalProfit,
    profitRate,
    yearlyProjections,
  };
}
