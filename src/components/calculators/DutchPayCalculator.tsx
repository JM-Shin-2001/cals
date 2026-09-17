'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateDutchPay, DutchPayParticipant, RoundType } from '@/lib/calculators';

export function DutchPayCalculator() {
  const [totalAmount, setTotalAmount] = useState(120000);
  const [extraAmount, setExtraAmount] = useState(30000);
  const [roundUnit, setRoundUnit] = useState(100);
  const [roundType, setRoundType] = useState<RoundType>('ROUND');
  const [participants, setParticipants] = useState<DutchPayParticipant[]>([
    { name: '참여자 1', isIncludedInExtra: true },
    { name: '참여자 2', isIncludedInExtra: true },
    { name: '참여자 3', isIncludedInExtra: false },
    { name: '참여자 4', isIncludedInExtra: false },
  ]);

  const result = calculateDutchPay({
    totalAmount,
    participants,
    extraAmount,
    roundUnit,
    roundType,
  });

  const updateParticipant = (index: number, field: keyof DutchPayParticipant, val: any) => {
    setParticipants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      { name: `참여자 ${prev.length + 1}`, isIncludedInExtra: false },
    ]);
  };

  const removeParticipant = (index: number) => {
    if (participants.length <= 1) return;
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>더치페이(N빵) & 정산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            차등 정산 및 단위 절사 지원
          </span>
        </CardTitle>
        <CardDescription>
          주류 등 특정 참여자만 부담할 차등 금액을 분리하고, 10원/100원 단위 잔돈을 깔끔하게 절사 정산합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>총 결제 금액 (원)</Label>
            <Input
              type="number"
              step="1000"
              value={totalAmount || ''}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>차등 지출액 (원, 예: 술값/2차비용)</Label>
            <Input
              type="number"
              step="1000"
              value={extraAmount || ''}
              onChange={(e) => setExtraAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>절사 단위</Label>
            <div className="flex gap-2">
              {[1, 10, 100, 1000].map((unit) => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setRoundUnit(unit)}
                  className={`flex-1 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                    roundUnit === unit
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {unit === 1 ? '정액(1원)' : `${unit}원`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>끝전 처리 방식</Label>
            <div className="flex gap-2">
              {[
                { id: 'ROUND', label: '반올림' },
                { id: 'FLOOR', label: '내림(절사)' },
                { id: 'CEIL', label: '올림' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRoundType(t.id as RoundType)}
                  className={`flex-1 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                    roundType === t.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">참여자 명단 ({participants.length}명)</Label>
            <button
              type="button"
              onClick={addParticipant}
              className="text-xs text-primary font-semibold hover:underline"
            >
              + 참여자 추가
            </button>
          </div>
          <div className="space-y-2">
            {participants.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 border rounded-lg bg-card">
                <Input
                  value={p.name}
                  onChange={(e) => updateParticipant(idx, 'name', e.target.value)}
                  className="max-w-[160px] h-8 text-sm"
                />
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={p.isIncludedInExtra}
                    onChange={(e) => updateParticipant(idx, 'isIncludedInExtra', e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>차등 금액 부담 (술값 등)</span>
                </label>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    disabled={participants.length <= 1}
                    onClick={() => removeParticipant(idx)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm font-semibold text-primary">정산 결과 분배표</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.splits.map((s, idx) => (
              <div key={idx} className="p-3 bg-card border rounded-lg flex justify-between items-center">
                <span className="font-medium text-sm">{s.name}</span>
                <span className="font-bold text-primary">{s.amount.toLocaleString()} 원</span>
              </div>
            ))}
          </div>
          {result.discrepancy !== 0 && (
            <div className="text-xs text-muted-foreground pt-2 border-t border-primary/10 flex justify-between">
              <span>절사로 인한 차액(주최자 정산 권장):</span>
              <span className="font-semibold text-foreground">{result.discrepancy.toLocaleString()} 원</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
