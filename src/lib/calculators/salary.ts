import { SalaryInput, SalaryOutput } from './types';

/**
 * 근로소득 간이세액 추정 함수 (월 과세소득 및 부양가족 수 반영 근사 모델)
 */
function estimateIncomeTax(taxableMonthly: number, dependents: number): number {
  if (taxableMonthly <= 1060000) return 0;

  // 부양가족 공제 가산 (부양가족 1인당 과세표준 약 100,000원 감면 효과)
  const adjustedTaxable = Math.max(0, taxableMonthly - (dependents - 1) * 100000);

  let tax = 0;
  if (adjustedTaxable <= 14000000 / 12) {
    tax = adjustedTaxable * 0.06;
  } else if (adjustedTaxable <= 50000000 / 12) {
    tax = (14000000 / 12) * 0.06 + (adjustedTaxable - 14000000 / 12) * 0.15;
  } else if (adjustedTaxable <= 88000000 / 12) {
    tax = (14000000 / 12) * 0.06 + ((50000000 - 14000000) / 12) * 0.15 + (adjustedTaxable - 50000000 / 12) * 0.24;
  } else {
    tax = (14000000 / 12) * 0.06 + ((50000000 - 14000000) / 12) * 0.15 + ((88000000 - 50000000) / 12) * 0.24 + (adjustedTaxable - 88000000 / 12) * 0.35;
  }

  // 근로소득세액공제 근사 적용 (약 55% 공제, 한도 적용)
  const earnedIncomeTaxCredit = Math.min(tax * 0.55, 740000 / 12);
  const finalTax = Math.max(0, tax - earnedIncomeTaxCredit);

  return Math.floor(finalTax);
}

export function calculateSalary(input: SalaryInput): SalaryOutput {
  const nonTaxable = input.nonTaxableAmount ?? 200000;
  const dependents = input.dependentsCount ?? 1;

  const grossMonthly = input.isAnnual
    ? Math.floor(input.grossSalary / 12)
    : input.grossSalary;

  const taxableMonthly = Math.max(0, grossMonthly - nonTaxable);

  // 국민연금: 4.5% (상한액 271,350원 기준)
  const nationalPension = Math.floor(Math.min(Math.round(taxableMonthly * 0.045), 271350));

  // 건강보험: 3.545%
  const healthInsurance = Math.floor(Math.round(taxableMonthly * 0.03545));

  // 장기요양보험: 건강보험료의 12.95%
  const longTermCare = Math.floor(Math.round(healthInsurance * 0.1295));

  // 고용보험: 0.9%
  const employmentInsurance = Math.floor(Math.round(taxableMonthly * 0.009));

  // 소득세 & 지방소득세(소득세의 10%)
  const incomeTax = estimateIncomeTax(taxableMonthly, dependents);
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  const totalDeductions =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  const netPay = grossMonthly - totalDeductions;

  return {
    grossMonthly,
    totalDeductions,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    netPay,
  };
}
