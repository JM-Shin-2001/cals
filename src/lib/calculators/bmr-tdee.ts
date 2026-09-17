import { BmrTdeeInput, BmrTdeeOutput } from './types';

export function calculateBmrTdee(input: BmrTdeeInput): BmrTdeeOutput {
  const { gender, weightKg, heightCm, age, activityLevel, goal } = input;

  // Mifflin-St Jeor 공식
  // BMR = 10 * weight + 6.25 * height - 5 * age + (남성: +5, 여성: -161)
  const genderOffset = gender === 'MALE' ? 5 : -161;
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset);

  const tdee = Math.round(bmr * activityLevel);

  let targetCalories = tdee;
  if (goal === 'LOSE') {
    targetCalories = Math.max(1000, Math.round(tdee * 0.8)); // 20% 칼로리 결손
  } else if (goal === 'GAIN') {
    targetCalories = Math.round(tdee * 1.15); // 15% 잉여
  }

  // 탄수화물(50%), 단백질(30%), 지방(20%) 분배
  // 탄수화물 4kcal/g, 단백질 4kcal/g, 지방 9kcal/g
  const carbsGrams = Math.round((targetCalories * 0.5) / 4);
  const proteinGrams = Math.round((targetCalories * 0.3) / 4);
  const fatGrams = Math.round((targetCalories * 0.2) / 9);

  return {
    bmr,
    tdee,
    targetCalories,
    macroNutrients: {
      carbsGrams,
      proteinGrams,
      fatGrams,
    },
  };
}
