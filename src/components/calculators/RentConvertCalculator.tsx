'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateRentConvert } from '@/lib/calculators';

export function RentConvertCalculator() {
  const [mode, setMode] = useState<'TO_RENT' | 'TO_DEPOSIT'>('TO_RENT');
  const [currentDeposit, setCurrentDeposit] = useState(100000000);
  const [currentMonthlyRent, setCurrentMonthlyRent] = useState(0);
  const [targetDeposit, setTargetDeposit] = useState(50000000);
  const [targetMonthlyRent, setTargetMonthlyRent] = useState(250000);
  const [conversionRate, setConversionRate] = useState(5.5);

  const result = calculateRentConvert({
    currentDeposit,
    currentMonthlyRent,
    targetDeposit: mode === 'TO_RENT' ? targetDeposit : undefined,
    targetMonthlyRent: mode === 'TO_DEPOSIT' ? targetMonthlyRent : undefined,
    conversionRate,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>전월세 변환 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            전월세전환율 적용
          </span>
        </CardTitle>
        <CardDescription>
          보증금 조절에 따른 적정 월세 변환 및 월세 조절에 따른 전세 보증금을 환산합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('TO_RENT')}
            className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
              mode === 'TO_RENT' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
            }`}
          >
            전세 ➔ 월세 (보증금 인하 후 월세 계산)
          </button>
          <button
            type="button"
            onClick={() => setMode('TO_DEPOSIT')}
            className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
              mode === 'TO_DEPOSIT' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
            }`}
          >
            월세 ➔ 전세 (월세 인하 후 보증금 계산)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>현재 보증금 (원)</Label>
            <Input
              type="number"
              step="5000000"
              value={currentDeposit || ''}
              onChange={(e) => setCurrentDeposit(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>현재 월세 (원)</Label>
            <Input
              type="number"
              step="50000"
              value={currentMonthlyRent || ''}
              onChange={(e) => setCurrentMonthlyRent(Number(e.target.value))}
            />
          </div>

          {mode === 'TO_RENT' ? (
            <div className="space-y-2">
              <Label>조정 희망 보증금 (원)</Label>
              <Input
                type="number"
                step="5000000"
                value={targetDeposit || ''}
                onChange={(e) => setTargetDeposit(Number(e.target.value))}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>조정 희망 월세 (원)</Label>
              <Input
                type="number"
                step="50000"
                value={targetMonthlyRent || ''}
                onChange={(e) => setTargetMonthlyRent(Number(e.target.value))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>전월세전환율 (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={conversionRate || ''}
              onChange={(e) => setConversionRate(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm text-muted-foreground">변환 결과 안내</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">환산된 보증금</div>
              <div className="text-2xl font-bold text-foreground mt-0.5">
                {result.convertedDeposit.toLocaleString()} 원
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">환산된 월세</div>
              <div className="text-2xl font-bold text-primary mt-0.5">
                {result.convertedMonthlyRent.toLocaleString()} 원
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-1 border-t border-primary/10">
            적용 전월세전환율: <span className="font-semibold">{result.appliedRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
