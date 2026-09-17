'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateCagr } from '@/lib/calculators';

export function CagrCalculator() {
  const [initialPrincipal, setInitialPrincipal] = useState(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState(500000);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(8.0);
  const [years, setYears] = useState(5);

  const result = calculateCagr({
    initialPrincipal,
    monthlyContribution,
    expectedAnnualReturn,
    years,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>복리 투자 수익률(CAGR) 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            월 적립식 복리 시뮬레이션
          </span>
        </CardTitle>
        <CardDescription>
          초기 자본과 매월 추가 투자금의 복리 증식 효과 및 연평균 성장률을 시뮬레이션합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>초기 투자 원금 (원)</Label>
            <Input
              type="number"
              step="1000000"
              value={initialPrincipal || ''}
              onChange={(e) => setInitialPrincipal(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>매월 추가 적립금 (원)</Label>
            <Input
              type="number"
              step="100000"
              value={monthlyContribution || ''}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>연간 기대 수익률 (%)</Label>
            <Input
              type="number"
              step="0.5"
              value={expectedAnnualReturn || ''}
              onChange={(e) => setExpectedAnnualReturn(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>투자 기간 (년)</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={years || ''}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm text-muted-foreground">{years}년 후 예상 최종 자산</div>
          <div className="text-3xl font-extrabold text-primary">
            {result.finalBalance.toLocaleString()} 원
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-primary/10">
            <div>
              <span className="text-muted-foreground block">총 원금 투자액:</span>
              <span className="font-semibold">{result.totalInvested.toLocaleString()}원</span>
            </div>
            <div>
              <span className="text-muted-foreground block">예상 복리 수익금:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">+{result.totalProfit.toLocaleString()}원</span>
            </div>
            <div>
              <span className="text-muted-foreground block">총 수익률:</span>
              <span className="font-semibold">{result.profitRate}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">연도별 자산 성장 추이</Label>
          <div className="overflow-x-auto border rounded-lg max-h-56">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                <tr>
                  <th className="p-2.5">연차</th>
                  <th className="p-2.5">누적 원금</th>
                  <th className="p-2.5">누적 수익</th>
                  <th className="p-2.5 font-bold">예상 총자산</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {result.yearlyProjections.map((item) => (
                  <tr key={item.year} className="hover:bg-muted/30">
                    <td className="p-2.5">{item.year}년차</td>
                    <td className="p-2.5">{item.investedSum.toLocaleString()}원</td>
                    <td className="p-2.5 text-emerald-600 dark:text-emerald-400">+{item.accumulatedInterest.toLocaleString()}원</td>
                    <td className="p-2.5 font-semibold text-primary">{item.projectedBalance.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
