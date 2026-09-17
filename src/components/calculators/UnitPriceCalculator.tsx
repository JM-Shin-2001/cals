'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateUnitPrice, ProductUnit, UnitPriceItemInput } from '@/lib/calculators';

export function UnitPriceCalculator() {
  const [items, setItems] = useState<UnitPriceItemInput[]>([
    { id: '1', name: '상품 A (소용량)', price: 4500, quantity: 400, unit: 'g' },
    { id: '2', name: '상품 B (대용량 1kg)', price: 8900, quantity: 1, unit: 'kg' },
    { id: '3', name: '상품 C (번들 팩)', price: 12000, quantity: 1500, unit: 'g' },
  ]);

  const result = calculateUnitPrice({ items });

  const updateItem = (id: string, field: keyof UnitPriceItemInput, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const newId = String(Date.now());
    setItems((prev) => [
      ...prev,
      { id: newId, name: `비교 상품 ${prev.length + 1}`, price: 5000, quantity: 500, unit: 'g' },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>단위당 단가 비교 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            가성비 랭킹 자동 정렬
          </span>
        </CardTitle>
        <CardDescription>
          용량과 포장 단위가 제각각인 상품들의 100g/100ml/1개당 단가를 환산하여 최저가를 비교합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="p-3 border rounded-lg bg-card/60 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
              <div className="space-y-1">
                <Label className="text-xs">상품명</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">가격 (원)</Label>
                <Input
                  type="number"
                  value={item.price || ''}
                  onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">용량 / 수량</Label>
                <Input
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">단위</Label>
                <select
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, 'unit', e.target.value as ProductUnit)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                >
                  <option value="g">그램 (g)</option>
                  <option value="kg">킬로그램 (kg)</option>
                  <option value="ml">밀리리터 (ml)</option>
                  <option value="l">리터 (L)</option>
                  <option value="ea">개수 (개/ea)</option>
                </select>
              </div>
              <div>
                <button
                  type="button"
                  disabled={items.length <= 1}
                  onClick={() => removeItem(item.id)}
                  className="w-full h-9 text-xs text-destructive hover:bg-destructive/10 rounded-md border border-destructive/30 font-medium transition-colors disabled:opacity-50"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full py-2 border border-dashed rounded-lg text-sm text-primary hover:bg-primary/5 font-medium transition-colors"
          >
            + 비교 상품 추가하기
          </button>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">가성비 순위 (단위당 가격 기준)</Label>
          <div className="grid grid-cols-1 gap-2.5">
            {result.rankedItems.map((item, index) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-lg border flex items-center justify-between ${
                  index === 0
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-secondary/40 border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      기준: {item.normalizedUnit} 당 {item.pricePerStandardUnit.toLocaleString()}원
                    </div>
                  </div>
                </div>
                {index === 0 ? (
                  <span className="text-xs font-bold text-primary bg-primary/20 px-2.5 py-1 rounded-full">
                    최고 가성비 ({item.savingsPercentageVsWorst}% 절약)
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    최고가 대비 {item.savingsPercentageVsWorst}% 절감
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
