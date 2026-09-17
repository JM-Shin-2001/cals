import { LoanInput, LoanOutput, LoanScheduleItem } from './types';

export function calculateLoan(input: LoanInput): LoanOutput {
  const { principal, annualRate, termMonths, repaymentType } = input;

  if (principal <= 0 || termMonths <= 0) {
    return { totalInterest: 0, totalRepayment: 0, schedule: [] };
  }

  const monthlyRate = annualRate / 100 / 12;
  const schedule: LoanScheduleItem[] = [];
  let remainingPrincipal = principal;
  let totalInterest = 0;

  if (repaymentType === 'BULLET') {
    // 만기일시상환
    for (let m = 1; m <= termMonths; m++) {
      const interestPayment = Math.round(principal * monthlyRate);
      const principalPayment = m === termMonths ? principal : 0;
      const totalPayment = principalPayment + interestPayment;
      remainingPrincipal = m === termMonths ? 0 : principal;
      totalInterest += interestPayment;

      schedule.push({
        month: m,
        principalPayment,
        interestPayment,
        totalPayment,
        remainingPrincipal,
      });
    }
  } else if (repaymentType === 'EQUAL_PRINCIPAL') {
    // 원금균등분할상환
    const monthlyPrincipal = Math.floor(principal / termMonths);
    let principalSum = 0;

    for (let m = 1; m <= termMonths; m++) {
      const isLast = m === termMonths;
      const principalPayment = isLast ? principal - principalSum : monthlyPrincipal;
      principalSum += principalPayment;

      const interestPayment = Math.round(remainingPrincipal * monthlyRate);
      const totalPayment = principalPayment + interestPayment;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);
      totalInterest += interestPayment;

      schedule.push({
        month: m,
        principalPayment,
        interestPayment,
        totalPayment,
        remainingPrincipal,
      });
    }
  } else {
    // 원리금균등분할상환 (AMORTIZING)
    let fixedMonthlyPayment = 0;
    if (monthlyRate === 0) {
      fixedMonthlyPayment = Math.floor(principal / termMonths);
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      fixedMonthlyPayment = Math.round((principal * monthlyRate * factor) / (factor - 1));
    }

    for (let m = 1; m <= termMonths; m++) {
      const interestPayment = Math.round(remainingPrincipal * monthlyRate);
      let principalPayment = fixedMonthlyPayment - interestPayment;

      if (m === termMonths || remainingPrincipal <= principalPayment) {
        principalPayment = remainingPrincipal;
      }

      const totalPayment = principalPayment + interestPayment;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);
      totalInterest += interestPayment;

      schedule.push({
        month: m,
        principalPayment,
        interestPayment,
        totalPayment,
        remainingPrincipal,
      });
    }
  }

  return {
    totalInterest,
    totalRepayment: principal + totalInterest,
    schedule,
  };
}
