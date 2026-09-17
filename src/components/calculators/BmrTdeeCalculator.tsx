'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateBmrTdee, DietGoal, Gender } from '@/lib/calculators';

export function BmrTdeeCalculator() {
  const [gender, setGender] = useState<Gender>('MALE');
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(26);
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [goal, setGoal] = useState<DietGoal>('LOSE');

  const result = calculateBmrTdee({
    gender,
    weightKg,
    heightCm,
    age,
    activityLevel,
    goal,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>기초대사량(BMR) & TDEE 다이어트 계산기</span>
          <span className="text-xs font-normal text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            Mifflin-St Jeor 공식
          </span>
        </CardTitle>
        <CardDescription>
          체중/신장/나이 및 활동량을 기반으로 유지 칼로리와 감량/증량 맞춤 탄단지 식단을 설계합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>성별</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender('MALE')}
                className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
                  gender === 'MALE' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setGender('FEMALE')}
                className={`flex-1 py-2 text-sm rounded-md border font-medium transition-colors ${
                  gender === 'FEMALE' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                여성
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>나이 (만 나이)</Label>
            <Input
              type="number"
              min="10"
              max="120"
              value={age || ''}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>체중 (kg)</Label>
            <Input
              type="number"
              step="0.5"
              value={weightKg || ''}
              onChange={(e) => setWeightKg(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>신장 (cm)</Label>
            <Input
              type="number"
              step="0.5"
              value={heightCm || ''}
              onChange={(e) => setHeightCm(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>평소 활동량</Label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(Number(e.target.value))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
          >
            <option value="1.2">거의 운동하지 않음 (좌식 생활, 사무직)</option>
            <option value="1.375">가벼운 활동 (주 1~3일 가벼운 운동)</option>
            <option value="1.55">보통 활동 (주 3~5일 보통 운동)</option>
            <option value="1.725">강한 활동 (주 6~7일 고강도 운동)</option>
            <option value="1.9">매우 강한 활동 (선수급 트레이닝)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>다이어트 목표</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'LOSE', label: '체중 감량 (-20%)' },
              { id: 'MAINTAIN', label: '현재 체중 유지' },
              { id: 'GAIN', label: '근육량/체중 증량 (+15%)' },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id as DietGoal)}
                className={`py-2 text-xs sm:text-sm rounded-md border font-medium transition-colors ${
                  goal === g.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 space-y-3">
          <div className="text-sm text-muted-foreground">목표 일일 섭취 칼로리</div>
          <div className="text-3xl font-extrabold text-primary">
            {result.targetCalories.toLocaleString()} kcal
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-primary/10">
            <div>
              <span className="text-muted-foreground block">기초대사량 (BMR):</span>
              <span className="font-semibold">{result.bmr.toLocaleString()} kcal</span>
            </div>
            <div>
              <span className="text-muted-foreground block">일일 유지칼로리 (TDEE):</span>
              <span className="font-semibold">{result.tdee.toLocaleString()} kcal</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">권장 탄·단·지 영양소 배분 (5:3:2)</Label>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 border rounded-lg bg-secondary/50 text-center">
              <div className="text-xs text-muted-foreground">탄수화물 (50%)</div>
              <div className="text-lg font-bold text-foreground mt-0.5">{result.macroNutrients.carbsGrams}g</div>
            </div>
            <div className="p-3 border rounded-lg bg-secondary/50 text-center">
              <div className="text-xs text-muted-foreground">단백질 (30%)</div>
              <div className="text-lg font-bold text-primary mt-0.5">{result.macroNutrients.proteinGrams}g</div>
            </div>
            <div className="p-3 border rounded-lg bg-secondary/50 text-center">
              <div className="text-xs text-muted-foreground">지방 (20%)</div>
              <div className="text-lg font-bold text-foreground mt-0.5">{result.macroNutrients.fatGrams}g</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
