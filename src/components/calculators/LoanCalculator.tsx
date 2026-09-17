'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateLoan, RepaymentType } from '@/lib/calculators';

export function LoanCalculator() {
  const [principal, setPrincipal] = useState(50000000);
  const [annualRate, setAnnualRate] = useState(4.5);
  const [termMonths, setTermMonths] = useState(24);
  const [repaymentType, setRepaymentType] = useState<RepaymentType>('AMORTIZING');

  const result = calculateLoan({
    principal,
    annualRate,
    termMonths,
    repaymentType,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>대출 원리금 상환 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            월별 상환 스케줄
          </span>
        </CardTitle>
        <CardDescription>
          상환 방식별 월 납입금, 총 이자 비용 및 상환 스케줄을 한눈에 파악합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>상환 방식 선택</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'AMORTIZING', label: '원리금균등' },
              { id: 'EQUAL_PRINCIPAL', label: '원금균등' },
              { id: 'BULLET', label: '만기일시' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setRepaymentType(type.id as RepaymentType)}
                className={`py-2 text-sm rounded-md border font-medium transition-colors ${
                  repaymentType === type.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>대출 원금 (원)</Label>
            <Input
              type="number"
              step="1000000"
              value={principal || ''}
              onChange={(e) => setPrincipal(Number(e.target.value))}
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
            <Label>대출 기간 (개월)</Label>
            <Input
              type="number"
              min="1"
              max="600"
              value={termMonths || ''}
              onChange={(e) => setTermMonths(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">1회차 상환액</div>
              <div className="text-2xl font-bold text-primary mt-1">
                {result.schedule[0]?.totalPayment.toLocaleString() ?? 0} 원
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">총 이자액</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {result.totalInterest.toLocaleString()} 원
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">총 상환금액 (원금+이자)</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {result.totalRepayment.toLocaleString()} 원
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">월별 상환 스케줄 (상위 5개월 미리보기)</Label>
          <div className="overflow-x-auto border rounded-lg max-h-56">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                <tr>
                  <th className="p-2.5">회차</th>
                  <th className="p-2.5">납입원금</th>
                  <th className="p-2.5">이자</th>
                  <th className="p-2.5 font-bold">월 납입액</th>
                  <th className="p-2.5">남은 원금</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {result.schedule.slice(0, 12).map((item) => (
                  <tr key={item.month} className="hover:bg-muted/30">
                    <td className="p-2.5">{item.month}회차</td>
                    <td className="p-2.5">{item.principalPayment.toLocaleString()}원</td>
                    <td className="p-2.5">{item.interestPayment.toLocaleString()}원</td>
                    <td className="p-2.5 font-semibold text-primary">{item.totalPayment.toLocaleString()}원</td>
                    <td className="p-2.5 text-muted-foreground">{item.remainingPrincipal.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.schedule.length > 12 && (
            <p className="text-xs text-muted-foreground text-center">전체 {result.schedule.length}개월 중 초기 12개월 표시됨</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
