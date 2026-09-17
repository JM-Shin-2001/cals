import { UnitPriceInput, UnitPriceOutput, RankedUnitPriceItem, ProductUnit } from './types';

function getStandardUnitInfo(unit: ProductUnit): { standardUnit: string; multiplierToStandard: number } {
  switch (unit) {
    case 'g':
      return { standardUnit: '100g', multiplierToStandard: 100 };
    case 'kg':
      return { standardUnit: '100g', multiplierToStandard: 100 / 1000 };
    case 'ml':
      return { standardUnit: '100ml', multiplierToStandard: 100 };
    case 'l':
      return { standardUnit: '100ml', multiplierToStandard: 100 / 1000 };
    case 'ea':
      return { standardUnit: '1개', multiplierToStandard: 1 };
  }
}

export function calculateUnitPrice(input: UnitPriceInput): UnitPriceOutput {
  const { items } = input;
  if (!items || items.length === 0) {
    return { rankedItems: [] };
  }

  const calculatedItems = items.map((item) => {
    const { standardUnit, multiplierToStandard } = getStandardUnitInfo(item.unit);
    // 기준 단위(100g, 100ml, 1개) 당 가격
    const pricePerStandard = item.quantity > 0
      ? (item.price / item.quantity) * multiplierToStandard
      : 0;

    return {
      id: item.id,
      name: item.name,
      normalizedUnit: standardUnit,
      pricePerStandardUnit: Math.round(pricePerStandard * 100) / 100,
    };
  });

  // 단가 낮은 순(오름차순) 정렬
  calculatedItems.sort((a, b) => a.pricePerStandardUnit - b.pricePerStandardUnit);

  const maxPrice = calculatedItems[calculatedItems.length - 1]?.pricePerStandardUnit || 0;

  const rankedItems: RankedUnitPriceItem[] = calculatedItems.map((item) => {
    const savings = maxPrice > 0 ? ((maxPrice - item.pricePerStandardUnit) / maxPrice) * 100 : 0;
    return {
      ...item,
      savingsPercentageVsWorst: Math.round(savings * 10) / 10,
    };
  });

  return { rankedItems };
}
