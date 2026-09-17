import { SavingsInput, SavingsOutput } from './types';

export function calculateSavings(input: SavingsInput): SavingsOutput {
  const { productType, amount, annualRate, periodMonths, taxType } = input;
  const rateDecimal = annualRate / 100;

  let totalPrincipal = 0;
  let grossInterest = 0;

  if (productType === 'DEPOSIT') {
    // 정기예금 (단리): P * r * (n/12)
    totalPrincipal = amount;
    grossInterest = Math.floor(amount * rateDecimal * (periodMonths / 12));
  } else {
    // 정기적금 (단리, 매월초 납입): P * r * (n*(n+1) / 24)
    totalPrincipal = amount * periodMonths;
    grossInterest = Math.floor(amount * rateDecimal * ((periodMonths * (periodMonths + 1)) / 24));
  }

  let taxRate = 0.154; // NORMAL
  if (taxType === 'PREFERENTIAL') {
    taxRate = 0.095;
  } else if (taxType === 'TAX_FREE') {
    taxRate = 0;
  }

  const taxAmount = Math.floor(grossInterest * taxRate);
  const netPayout = totalPrincipal + grossInterest - taxAmount;

  return {
    totalPrincipal,
    grossInterest,
    taxAmount,
    netPayout,
  };
}
