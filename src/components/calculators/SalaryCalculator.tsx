'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateSalary } from '@/lib/calculators';

export function SalaryCalculator() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [grossSalary, setGrossSalary] = useState(40000000);
  const [nonTaxableAmount, setNonTaxableAmount] = useState(200000);
  const [dependentsCount, setDependentsCount] = useState(1);

  const result = calculateSalary({
    grossSalary,
    isAnnual,
    nonTaxableAmount,
    dependentsCount,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>실수령액(월급) 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            2026 간이세액표 & 4대보험 반영
          </span>
        </CardTitle>
        <CardDescription>
          연봉 또는 월 기본급에서 4대 보험과 근로소득세를 차감한 실제 수령액을 계산합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>급여 형태</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
                  isAnnual ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                연봉 기준
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
                  !isAnnual ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                월급 기준
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{isAnnual ? '계약 연봉 (원)' : '월 기본급 (원)'}</Label>
            <Input
              type="number"
              step="100000"
              value={grossSalary || ''}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              placeholder="예: 40,000,000"
            />
          </div>

          <div className="space-y-2">
            <Label>월 비과세액 (원, 식대 등 기본 20만원)</Label>
            <Input
              type="number"
              step="50000"
              value={nonTaxableAmount || ''}
              onChange={(e) => setNonTaxableAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>부양가족 수 (본인 포함)</Label>
            <Input
              type="number"
              min="1"
              max="11"
              value={dependentsCount}
              onChange={(e) => setDependentsCount(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>예상 월 실수령액</span>
            <span>월 지급 총액: {result.grossMonthly.toLocaleString()}원</span>
          </div>
          <div className="text-3xl font-extrabold text-primary tracking-tight">
            {result.netPay.toLocaleString()} 원
          </div>
          <div className="text-xs text-muted-foreground">
            총 공제 예상액: <span className="font-semibold text-foreground">{result.totalDeductions.toLocaleString()}원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-secondary/50 rounded-lg border">
            <div className="text-muted-foreground text-xs">국민연금 (4.5%)</div>
            <div className="font-semibold mt-1">{result.nationalPension.toLocaleString()}원</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg border">
            <div className="text-muted-foreground text-xs">건강보험 (3.545%)</div>
            <div className="font-semibold mt-1">{result.healthInsurance.toLocaleString()}원</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg border">
            <div className="text-muted-foreground text-xs">장기요양 (12.95%)</div>
            <div className="font-semibold mt-1">{result.longTermCare.toLocaleString()}원</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg border">
            <div className="text-muted-foreground text-xs">고용보험 (0.9%)</div>
            <div className="font-semibold mt-1">{result.employmentInsurance.toLocaleString()}원</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg border">
            <div className="text-muted-foreground text-xs">근로소득세</div>
            <div className="font-semibold mt-1">{result.incomeTax.toLocaleString()}원</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg border">
            <div className="text-muted-foreground text-xs">지방소득세 (10%)</div>
            <div className="font-semibold mt-1">{result.localIncomeTax.toLocaleString()}원</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
