'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateDateDiff } from '@/lib/calculators';

export function DateCalculator() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  const result = calculateDateDiff({
    startDate,
    endDate,
    excludeWeekends,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>D-Day 및 영업일 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            UTC 표준 시간대 처리
          </span>
        </CardTitle>
        <CardDescription>
          기념일 D-Day 카운트다운과 주말(토/일)을 제외한 실제 근무/영업일 수를 도출합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>시작 날짜</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>종료(목표) 날짜</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm text-muted-foreground">계산 결과</div>
          <div className="text-4xl font-extrabold text-primary">
            {result.formattedDDayString}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-primary/10">
            <div>
              <span className="text-muted-foreground block">총 일수 차이:</span>
              <span className="font-semibold">{Math.abs(result.dayDifference)} 일</span>
            </div>
            <div>
              <span className="text-muted-foreground block">주말 제외 영업일:</span>
              <span className="font-semibold text-primary">{result.businessDays} 일</span>
            </div>
            <div>
              <span className="text-muted-foreground block">총 주(Week):</span>
              <span className="font-semibold">{result.totalWeeks} 주</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
