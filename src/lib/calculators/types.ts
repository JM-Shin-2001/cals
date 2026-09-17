/**
 * 생활밀착형 다목적 계산기 엔진 타입 정의
 */

// 1. 실수령액(월급) 계산기
export interface SalaryInput {
  grossSalary: number;
  isAnnual: boolean;
  nonTaxableAmount?: number; // 기본값: 200,000 (식대 등)
  dependentsCount?: number;  // 기본값: 1 (본인 포함 부양가족 수)
}

export interface SalaryOutput {
  grossMonthly: number;
  totalDeductions: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  netPay: number;
}

// 2. 전월세 변환 계산기
export interface RentConvertInput {
  currentDeposit: number;
  currentMonthlyRent: number;
  targetDeposit?: number;
  targetMonthlyRent?: number;
  conversionRate: number; // % (예: 5.5)
}

export interface RentConvertOutput {
  convertedMonthlyRent: number;
  convertedDeposit: number;
  appliedRate: number;
}

// 3. 대출 원리금 상환 계산기
export type RepaymentType = 'AMORTIZING' | 'EQUAL_PRINCIPAL' | 'BULLET';

export interface LoanInput {
  principal: number;
  annualRate: number; // %
  termMonths: number;
  repaymentType: RepaymentType;
}

export interface LoanScheduleItem {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingPrincipal: number;
}

export interface LoanOutput {
  totalInterest: number;
  totalRepayment: number;
  schedule: LoanScheduleItem[];
}

// 4. 단위당 단가 비교 계산기
export type ProductUnit = 'g' | 'kg' | 'ml' | 'l' | 'ea';

export interface UnitPriceItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
}

export interface UnitPriceInput {
  items: UnitPriceItemInput[];
}

export interface RankedUnitPriceItem {
  id: string;
  name: string;
  normalizedUnit: string;
  pricePerStandardUnit: number;
  savingsPercentageVsWorst: number;
}

export interface UnitPriceOutput {
  rankedItems: RankedUnitPriceItem[];
}

// 5. N빵(더치페이) 계산기
export type RoundType = 'FLOOR' | 'CEIL' | 'ROUND';

export interface DutchPayParticipant {
  name: string;
  isIncludedInExtra: boolean;
}

export interface DutchPayInput {
  totalAmount: number;
  participants: DutchPayParticipant[];
  extraAmount?: number;
  roundUnit?: number; // 10, 100, 1000 (기본값: 100)
  roundType?: RoundType; // 기본값: 'ROUND'
}

export interface DutchPaySplit {
  name: string;
  amount: number;
}

export interface DutchPayOutput {
  splits: DutchPaySplit[];
  discrepancy: number;
}

// 6. 예적금 이자 및 과세 계산기
export type ProductType = 'DEPOSIT' | 'SAVINGS';
export type TaxType = 'NORMAL' | 'PREFERENTIAL' | 'TAX_FREE';

export interface SavingsInput {
  productType: ProductType;
  amount: number;
  annualRate: number;
  periodMonths: number;
  taxType: TaxType;
}

export interface SavingsOutput {
  totalPrincipal: number;
  grossInterest: number;
  taxAmount: number;
  netPayout: number;
}

// 7. 복리 투자 수익률(CAGR) 계산기
export interface CagrInput {
  initialPrincipal: number;
  monthlyContribution: number;
  expectedAnnualReturn: number;
  years: number;
}

export interface YearlyProjection {
  year: number;
  investedSum: number;
  projectedBalance: number;
  accumulatedInterest: number;
}

export interface CagrOutput {
  totalInvested: number;
  finalBalance: number;
  totalProfit: number;
  profitRate: number;
  yearlyProjections: YearlyProjection[];
}

// 8. D-Day 및 영업일 계산기
export interface DateDiffInput {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  excludeWeekends?: boolean;
}

export interface DateDiffOutput {
  dayDifference: number;
  businessDays: number;
  totalWeeks: number;
  formattedDDayString: string;
}

// 9. 부동산 중개보수 계산기
export type PropertyType = 'HOUSING' | 'OFFICETEL' | 'NON_HOUSING';
export type TransactionType = 'TRADE' | 'RENT';

export interface BrokerageInput {
  propertyType: PropertyType;
  transactionType: TransactionType;
  tradeAmount: number;
  monthlyRent?: number;
  isVatIncluded?: boolean;
}

export interface BrokerageOutput {
  transactionAmount: number;
  appliedRate: number;
  limitAmount: number | null;
  maxBrokerageFee: number;
  vat: number;
  totalFeeWithVat: number;
}

// 10. 기초대사량(BMR) 및 TDEE 계산기
export type Gender = 'MALE' | 'FEMALE';
export type DietGoal = 'MAINTAIN' | 'LOSE' | 'GAIN';

export interface BmrTdeeInput {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: number;
  goal: DietGoal;
}

export interface BmrTdeeOutput {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macroNutrients: {
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
}
