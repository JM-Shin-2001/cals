import { describe, it, expect } from 'vitest';
import {
  calculateSalary,
  calculateRentConvert,
  calculateLoan,
  calculateUnitPrice,
  calculateDutchPay,
  calculateSavings,
  calculateCagr,
  calculateDateDiff,
  calculateBrokerage,
  calculateBmrTdee,
} from '@/lib/calculators';

describe('1. 실수령액(월급) 계산기 (Salary Net Pay Calculator)', () => {
  it('월급 3,000,000원, 비과세 200,000원 기본 계산', () => {
    const result = calculateSalary({
      grossSalary: 3000000,
      isAnnual: false,
      nonTaxableAmount: 200000,
      dependentsCount: 1,
    });

    expect(result.grossMonthly).toBe(3000000);
    expect(result.nationalPension).toBe(126000);
    expect(result.healthInsurance).toBe(99260);
    expect(result.longTermCare).toBe(12854);
    expect(result.employmentInsurance).toBe(25200);
    expect(result.netPay).toBeLessThan(3000000);
    expect(result.netPay + result.totalDeductions).toBe(result.grossMonthly);
  });

  it('국민연금 상한액(271,350원) 적용 확인', () => {
    const result = calculateSalary({
      grossSalary: 10000000,
      isAnnual: false,
      nonTaxableAmount: 200000,
      dependentsCount: 1,
    });
    expect(result.nationalPension).toBe(271350);
  });
});

describe('2. 전월세 변환 계산기 (Rent vs Jeonse)', () => {
  it('전세에서 월세로 전환 계산', () => {
    const result = calculateRentConvert({
      currentDeposit: 100000000,
      currentMonthlyRent: 0,
      targetDeposit: 50000000,
      conversionRate: 5.5,
    });
    expect(result.convertedMonthlyRent).toBe(229167);
    expect(result.convertedDeposit).toBe(50000000);
  });

  it('월세에서 전세로 전환 계산', () => {
    const result = calculateRentConvert({
      currentDeposit: 50000000,
      currentMonthlyRent: 300000,
      targetMonthlyRent: 0,
      conversionRate: 6.0,
    });
    expect(result.convertedDeposit).toBe(110000000);
    expect(result.convertedMonthlyRent).toBe(0);
  });
});

describe('3. 대출 원리금 상환 계산기 (Loan Repayment)', () => {
  it('원리금균등상환(AMORTIZING) 1,000만원, 12개월, 5%', () => {
    const result = calculateLoan({
      principal: 10000000,
      annualRate: 5,
      termMonths: 12,
      repaymentType: 'AMORTIZING',
    });
    expect(result.schedule.length).toBe(12);
    expect(result.schedule[11].remainingPrincipal).toBe(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('만기일시상환(BULLET) 마지막 달에 원금 일시상환 확인', () => {
    const result = calculateLoan({
      principal: 10000000,
      annualRate: 6,
      termMonths: 12,
      repaymentType: 'BULLET',
    });
    expect(result.schedule[0].principalPayment).toBe(0);
    expect(result.schedule[0].interestPayment).toBe(50000);
    expect(result.schedule[11].principalPayment).toBe(10000000);
    expect(result.totalInterest).toBe(600000);
  });
});

describe('4. 단위당 단가 비교 계산기 (Unit Price)', () => {
  it('g과 kg 단위 정규화 및 가성비 정렬', () => {
    const result = calculateUnitPrice({
      items: [
        { id: '1', name: '상품 A (500g)', price: 5000, quantity: 500, unit: 'g' },
        { id: '2', name: '상품 B (1kg)', price: 8000, quantity: 1, unit: 'kg' },
        { id: '3', name: '상품 C (200g)', price: 3000, quantity: 200, unit: 'g' },
      ],
    });
    expect(result.rankedItems[0].id).toBe('2');
    expect(result.rankedItems[0].pricePerStandardUnit).toBe(800);
    expect(result.rankedItems[2].id).toBe('3');
    expect(result.rankedItems[2].pricePerStandardUnit).toBe(1500);
    expect(result.rankedItems[0].savingsPercentageVsWorst).toBeGreaterThan(0);
  });
});

describe('5. 더치페이 계산기 (Dutch Pay)', () => {
  it('기본 N빵 및 차등 금액(주류 등), 절사 확인', () => {
    const result = calculateDutchPay({
      totalAmount: 100000,
      participants: [
        { name: '철수', isIncludedInExtra: true },
        { name: '영희', isIncludedInExtra: true },
        { name: '민수', isIncludedInExtra: false },
        { name: '지훈', isIncludedInExtra: false },
      ],
      extraAmount: 20000,
      roundUnit: 100,
      roundType: 'ROUND',
    });
    expect(result.splits.find((s) => s.name === '철수')?.amount).toBe(30000);
    expect(result.splits.find((s) => s.name === '민수')?.amount).toBe(20000);
    expect(result.discrepancy).toBe(0);
  });
});

describe('6. 예적금 이자 및 과세 계산기 (Savings)', () => {
  it('정기예금 1,000만원, 12개월, 4%, 일반과세(15.4%)', () => {
    const result = calculateSavings({
      productType: 'DEPOSIT',
      amount: 10000000,
      annualRate: 4,
      periodMonths: 12,
      taxType: 'NORMAL',
    });
    expect(result.totalPrincipal).toBe(10000000);
    expect(result.grossInterest).toBe(400000);
    expect(result.taxAmount).toBe(61600);
    expect(result.netPayout).toBe(10000000 + 400000 - 61600);
  });
});

describe('7. 복리 투자(CAGR) 계산기', () => {
  it('초기 1,000만원, 매월 50만원, 5년, 연 8%', () => {
    const result = calculateCagr({
      initialPrincipal: 10000000,
      monthlyContribution: 500000,
      expectedAnnualReturn: 8,
      years: 5,
    });
    expect(result.totalInvested).toBe(10000000 + 500000 * 60);
    expect(result.finalBalance).toBeGreaterThan(result.totalInvested);
    expect(result.yearlyProjections.length).toBe(5);
  });
});

describe('8. D-Day 및 영업일 계산기', () => {
  it('주말 제외 영업일 계산', () => {
    const result = calculateDateDiff({
      startDate: '2026-09-01',
      endDate: '2026-09-08',
      excludeWeekends: true,
    });
    expect(result.dayDifference).toBe(7);
    expect(result.businessDays).toBe(5);
    expect(result.formattedDDayString).toBe('D-7');
  });
});

describe('9. 부동산 중개보수 계산기', () => {
  it('주택 매매 4억원 (상한요율 0.4%)', () => {
    const result = calculateBrokerage({
      propertyType: 'HOUSING',
      transactionType: 'TRADE',
      tradeAmount: 400000000,
      isVatIncluded: true,
    });
    expect(result.maxBrokerageFee).toBe(1600000);
    expect(result.vat).toBe(160000);
    expect(result.totalFeeWithVat).toBe(1760000);
  });

  it('5천만원 미만 임대차 보정식 적용', () => {
    const result = calculateBrokerage({
      propertyType: 'HOUSING',
      transactionType: 'RENT',
      tradeAmount: 10000000,
      monthlyRent: 300000,
      isVatIncluded: false,
    });
    expect(result.transactionAmount).toBe(31000000);
    expect(result.appliedRate).toBe(0.5);
    expect(result.maxBrokerageFee).toBe(155000);
  });
});

describe('10. BMR & TDEE 계산기', () => {
  it('남성 BMR 및 TDEE 정상 계산', () => {
    const result = calculateBmrTdee({
      gender: 'MALE',
      weightKg: 70,
      heightCm: 175,
      age: 25,
      activityLevel: 1.55,
      goal: 'MAINTAIN',
    });
    expect(result.bmr).toBe(1674);
    expect(result.tdee).toBe(Math.round(1674 * 1.55));
    expect(result.macroNutrients.carbsGrams).toBeGreaterThan(0);
  });
});
