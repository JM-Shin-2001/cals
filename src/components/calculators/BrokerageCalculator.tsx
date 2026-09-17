'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateBrokerage, PropertyType, TransactionType } from '@/lib/calculators';

export function BrokerageCalculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>('HOUSING');
  const [transactionType, setTransactionType] = useState<TransactionType>('TRADE');
  const [tradeAmount, setTradeAmount] = useState(400000000);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [isVatIncluded, setIsVatIncluded] = useState(true);

  const result = calculateBrokerage({
    propertyType,
    transactionType,
    tradeAmount,
    monthlyRent,
    isVatIncluded,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>부동산 중개보수(복비) 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            공인중개사법 개정 요율
          </span>
        </CardTitle>
        <CardDescription>
          주택 매매/교환 및 임대차(전월세), 오피스텔 상한 요율 및 한도액을 계산합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>부동산 종류</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'HOUSING', label: '주택' },
                { id: 'OFFICETEL', label: '오피스텔' },
                { id: 'NON_HOUSING', label: '상가/토지' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPropertyType(p.id as PropertyType)}
                  className={`py-2 text-xs rounded-md border font-medium transition-colors ${
                    propertyType === p.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>거래 구분</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTransactionType('TRADE')}
                className={`flex-1 py-2 text-xs rounded-md border font-medium transition-colors ${
                  transactionType === 'TRADE' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                매매 / 분양권
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('RENT')}
                className={`flex-1 py-2 text-xs rounded-md border font-medium transition-colors ${
                  transactionType === 'RENT' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                전세 / 월세
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{transactionType === 'TRADE' ? '매매가 (원)' : '보증금 (원)'}</Label>
            <Input
              type="number"
              step="10000000"
              value={tradeAmount || ''}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
            />
          </div>

          {transactionType === 'RENT' && (
            <div className="space-y-2">
              <Label>월세 (원, 전세인 경우 0)</Label>
              <Input
                type="number"
                step="50000"
                value={monthlyRent || ''}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isVatIncluded}
            onChange={(e) => setIsVatIncluded(e.target.checked)}
            className="rounded border-input text-primary focus:ring-primary h-4 w-4"
          />
          <span>부가세 10% 포함하여 계산</span>
        </label>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm text-muted-foreground">법정 최대 중개보수 (한도 내 상한)</div>
          <div className="text-3xl font-extrabold text-primary">
            {result.totalFeeWithVat.toLocaleString()} 원
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-2 border-t border-primary/10">
            <div>
              <span className="text-muted-foreground block">거래/환산금액:</span>
              <span className="font-semibold">{result.transactionAmount.toLocaleString()}원</span>
            </div>
            <div>
              <span className="text-muted-foreground block">적용 상한 요율:</span>
              <span className="font-semibold">{result.appliedRate}%</span>
            </div>
            <div>
              <span className="text-muted-foreground block">법정 한도액:</span>
              <span className="font-semibold">{result.limitAmount ? `${result.limitAmount.toLocaleString()}원` : '한도 없음'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">부가세(10%):</span>
              <span className="font-semibold">{result.vat.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
