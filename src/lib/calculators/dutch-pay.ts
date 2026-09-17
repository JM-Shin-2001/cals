import { DutchPayInput, DutchPayOutput, RoundType } from './types';

function applyRounding(value: number, unit: number, type: RoundType): number {
  if (unit <= 1) return Math.round(value);
  switch (type) {
    case 'FLOOR':
      return Math.floor(value / unit) * unit;
    case 'CEIL':
      return Math.ceil(value / unit) * unit;
    case 'ROUND':
    default:
      return Math.round(value / unit) * unit;
  }
}

export function calculateDutchPay(input: DutchPayInput): DutchPayOutput {
  const { totalAmount, participants, extraAmount = 0, roundUnit = 100, roundType = 'ROUND' } = input;

  const totalMembers = participants.length;
  if (totalMembers === 0) {
    return { splits: [], discrepancy: 0 };
  }

  const validExtra = Math.min(extraAmount, totalAmount);
  const commonTotal = totalAmount - validExtra;
  const commonPerPerson = commonTotal / totalMembers;

  const extraParticipantsCount = participants.filter((p) => p.isIncludedInExtra).length;
  const extraPerPerson = extraParticipantsCount > 0 ? validExtra / extraParticipantsCount : 0;

  let sumSplits = 0;
  const splits = participants.map((p) => {
    const rawAmount = commonPerPerson + (p.isIncludedInExtra ? extraPerPerson : 0);
    const amount = applyRounding(rawAmount, roundUnit, roundType);
    sumSplits += amount;
    return {
      name: p.name,
      amount,
    };
  });

  const discrepancy = totalAmount - sumSplits;

  return {
    splits,
    discrepancy,
  };
}
