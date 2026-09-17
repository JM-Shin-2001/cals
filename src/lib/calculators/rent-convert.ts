import { RentConvertInput, RentConvertOutput } from './types';

export function calculateRentConvert(input: RentConvertInput): RentConvertOutput {
  const { currentDeposit, currentMonthlyRent, targetDeposit, targetMonthlyRent, conversionRate } = input;
  const rateDecimal = conversionRate / 100;

  if (rateDecimal <= 0) {
    throw new Error('전월세전환율은 0보다 커야 합니다.');
  }

  let convertedMonthlyRent = currentMonthlyRent;
  let convertedDeposit = currentDeposit;

  if (targetDeposit !== undefined) {
    // 전세 -> 월세 전환 또는 보증금 조정에 따른 월세 산출
    const deltaDeposit = currentDeposit - targetDeposit;
    const monthlyDifference = (deltaDeposit * rateDecimal) / 12;
    convertedMonthlyRent = Math.max(0, Math.round(currentMonthlyRent + monthlyDifference));
    convertedDeposit = targetDeposit;
  } else if (targetMonthlyRent !== undefined) {
    // 월세 -> 전세 전환 또는 월세 조정에 따른 보증금 산출
    const deltaRent = currentMonthlyRent - targetMonthlyRent;
    const depositDifference = (deltaRent * 12) / rateDecimal;
    convertedDeposit = Math.max(0, Math.round(currentDeposit + depositDifference));
    convertedMonthlyRent = targetMonthlyRent;
  }

  return {
    convertedMonthlyRent,
    convertedDeposit,
    appliedRate: conversionRate,
  };
}
