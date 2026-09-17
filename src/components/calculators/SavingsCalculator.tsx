'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateSavings, ProductType, TaxType } from '@/lib/calculators';

export function SavingsCalculator() {
  const [productType, setProductType] = useState<ProductType>('DEPOSIT');
  const [amount, setAmount] = useState(10000000);
  const [annualRate, setAnnualRate] = useState(3.8);
  const [periodMonths, setPeriodMonths] = useState(12);
  const [taxType, setTaxType] = useState<TaxType>('NORMAL');

  const result = calculateSavings({
    productType,
    amount,
    annualRate,
    periodMonths,
    taxType,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>예적금 이자 및 과세 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            단리 및 이자소득세 산출
          </span>
        </CardTitle>
        <CardDescription>
          정기예금(목돈 굴리기) 및 정기적금(목돈 모으기)의 세전/세후 만기 수령액을 계산합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>상품 유형</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setProductType('DEPOSIT')}
              className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
                productType === 'DEPOSIT' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
              }`}
            >
              정기예금 (한 번에 거치)
            </button>
            <button
              type="button"
              onClick={() => setProductType('SAVINGS')}
              className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
                productType === 'SAVINGS' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
              }`}
            >
              정기적금 (매달 일정액 적립)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{productType === 'DEPOSIT' ? '예치금 (원)' : '월 납입액 (원)'}</Label>
            <Input
              type="number"
              step="100000"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>연이율 (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={annualRate || ''}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>가입 기간 (개월)</Label>
            <Input
              type="number"
              min="1"
              max="120"
              value={periodMonths || ''}
              onChange={(e) => setPeriodMonths(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>과세 구분</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'NORMAL', label: '일반과세 (15.4%)' },
              { id: 'PREFERENTIAL', label: '세금우대 (9.5%)' },
              { id: 'TAX_FREE', label: '비과세 (0%)' },
            ].map((tax) => (
              <button
                key={tax.id}
                type="button"
                onClick={() => setTaxType(tax.id as TaxType)}
                className={`py-2 text-xs sm:text-sm rounded-md border font-medium transition-colors ${
                  taxType === tax.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                {tax.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm text-muted-foreground">만기 예상 실수령액</div>
          <div className="text-3xl font-extrabold text-primary">
            {result.netPayout.toLocaleString()} 원
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-primary/10">
            <div>
              <span className="text-muted-foreground block">총 원금:</span>
              <span className="font-semibold">{result.totalPrincipal.toLocaleString()}원</span>
            </div>
            <div>
              <span className="text-muted-foreground block">세전 이자:</span>
              <span className="font-semibold">{result.grossInterest.toLocaleString()}원</span>
            </div>
            <div>
              <span className="text-muted-foreground block">차감 세금:</span>
              <span className="font-semibold text-destructive">-{result.taxAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
