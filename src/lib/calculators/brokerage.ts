import { BrokerageInput, BrokerageOutput } from './types';

export function calculateBrokerage(input: BrokerageInput): BrokerageOutput {
  const { propertyType, transactionType, tradeAmount, monthlyRent = 0, isVatIncluded = false } = input;

  let transactionAmount = tradeAmount;

  // 임대차일 경우 환산 거래금액 계산: 보증금 + (월세 * 100), 5천만원 미만 시 보증금 + (월세 * 70)
  if (transactionType === 'RENT') {
    let converted = tradeAmount + monthlyRent * 100;
    if (converted < 50000000) {
      converted = tradeAmount + monthlyRent * 70;
    }
    transactionAmount = converted;
  }

  let appliedRate = 0.004;
  let limitAmount: number | null = null;

  if (propertyType === 'HOUSING') {
    if (transactionType === 'TRADE') {
      if (transactionAmount < 50000000) {
        appliedRate = 0.006;
        limitAmount = 250000;
      } else if (transactionAmount < 200000000) {
        appliedRate = 0.005;
        limitAmount = 800000;
      } else if (transactionAmount < 900000000) {
        appliedRate = 0.004;
        limitAmount = null;
      } else if (transactionAmount < 1200000000) {
        appliedRate = 0.005;
        limitAmount = null;
      } else if (transactionAmount < 1500000000) {
        appliedRate = 0.006;
        limitAmount = null;
      } else {
        appliedRate = 0.007;
        limitAmount = null;
      }
    } else {
      // 주택 임대차
      if (transactionAmount < 50000000) {
        appliedRate = 0.005;
        limitAmount = 200000;
      } else if (transactionAmount < 100000000) {
        appliedRate = 0.004;
        limitAmount = 300000;
      } else if (transactionAmount < 600000000) {
        appliedRate = 0.003;
        limitAmount = null;
      } else if (transactionAmount < 1200000000) {
        appliedRate = 0.004;
        limitAmount = null;
      } else if (transactionAmount < 1500000000) {
        appliedRate = 0.005;
        limitAmount = null;
      } else {
        appliedRate = 0.006;
        limitAmount = null;
      }
    }
  } else if (propertyType === 'OFFICETEL') {
    // 주거용 오피스텔 (전용 85m2 이하 기준)
    appliedRate = transactionType === 'TRADE' ? 0.005 : 0.004;
  } else {
    // NON_HOUSING (상가, 토지 등)
    appliedRate = 0.009;
  }

  let calculatedFee = Math.floor(transactionAmount * appliedRate);
  if (limitAmount !== null && calculatedFee > limitAmount) {
    calculatedFee = limitAmount;
  }

  const vat = isVatIncluded ? Math.floor(calculatedFee * 0.1) : 0;
  const totalFeeWithVat = calculatedFee + vat;

  return {
    transactionAmount,
    appliedRate: appliedRate * 100, // % 표시용
    limitAmount,
    maxBrokerageFee: calculatedFee,
    vat,
    totalFeeWithVat,
  };
}
