import { DateDiffInput, DateDiffOutput } from './types';

export function calculateDateDiff(input: DateDiffInput): DateDiffOutput {
  const { startDate, endDate, excludeWeekends = false } = input;

  // UTC 자정 기준 파싱 (타임존 왜곡 방지)
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);

  const startUtc = Date.UTC(sy, sm - 1, sd);
  const endUtc = Date.UTC(ey, em - 1, ed);

  const msPerDay = 86400000;
  const diffMs = endUtc - startUtc;
  const dayDifference = Math.round(diffMs / msPerDay);

  let businessDays = 0;
  const step = dayDifference >= 0 ? 1 : -1;
  const absDays = Math.abs(dayDifference);

  for (let i = 0; i < absDays; i++) {
    const currentMs = startUtc + (step > 0 ? i : -(i + 1)) * msPerDay;
    const dayOfWeek = new Date(currentMs).getUTCDay();
    // 0: 일요일, 6: 토요일
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++;
    }
  }

  const totalWeeks = Math.floor(Math.abs(dayDifference) / 7);

  let formattedDDayString = 'D-Day';
  if (dayDifference > 0) {
    formattedDDayString = `D-${dayDifference}`;
  } else if (dayDifference < 0) {
    formattedDDayString = `D+${Math.abs(dayDifference)}`;
  }

  return {
    dayDifference,
    businessDays,
    totalWeeks,
    formattedDDayString,
  };
}
