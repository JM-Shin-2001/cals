'use client';

import React, { useState, useEffect } from 'react';
import {
  SalaryCalculator,
  RentConvertCalculator,
  LoanCalculator,
  UnitPriceCalculator,
  DutchPayCalculator,
  SavingsCalculator,
  CagrCalculator,
  DateCalculator,
  BrokerageCalculator,
  BmrTdeeCalculator,
} from '@/components/calculators';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Wallet,
  Building2,
  Receipt,
  ShoppingCart,
  Users,
  PiggyBank,
  TrendingUp,
  CalendarDays,
  Home as HomeIcon,
  Activity,
  Calculator,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search,
} from 'lucide-react';

interface CalculatorItem {
  id: string;
  name: string;
  category: 'finance' | 'real-estate' | 'daily' | 'health';
  categoryLabel: string;
  badge: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  component: React.ReactNode;
}

const CALCULATORS: CalculatorItem[] = [
  {
    id: 'salary',
    name: '실수령액(월급) 계산기',
    category: 'finance',
    categoryLabel: '금융 / 세금',
    badge: '2026 간이세액',
    icon: <Wallet className="w-5 h-5 text-indigo-500" />,
    tagline: '내 통장에 찍히는 진짜 월급은?',
    description: '연봉/월급에서 4대 보험(국민연금 상한액 적용)과 근로소득세, 지방소득세를 차감한 실지급액 산출',
    component: <SalaryCalculator />,
  },
  {
    id: 'loan',
    name: '대출 상환 계산기',
    category: 'finance',
    categoryLabel: '금융 / 세금',
    badge: '스케줄 표 제공',
    icon: <Receipt className="w-5 h-5 text-blue-500" />,
    tagline: '원리금균등 · 원금균등 · 만기일시',
    description: '상환 방식별 회차별 원금/이자 납입액과 총 상환 비용, 이자 지출 비교 시뮬레이션',
    component: <LoanCalculator />,
  },
  {
    id: 'savings',
    name: '예적금 이자 및 과세 계산기',
    category: 'finance',
    categoryLabel: '금융 / 세금',
    badge: '15.4% 과세반영',
    icon: <PiggyBank className="w-5 h-5 text-emerald-500" />,
    tagline: '정기예금(거치) & 정기적금(적립)',
    description: '만기 시점 세전 이자 및 일반과세(15.4%), 세금우대(9.5%), 비과세 적용 후 최종 실수령액',
    component: <SavingsCalculator />,
  },
  {
    id: 'cagr',
    name: '복리 투자 & CAGR 계산기',
    category: 'finance',
    categoryLabel: '금융 / 세금',
    badge: '월 적립식 복리',
    icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
    tagline: '스노우볼 자산 증식 시뮬레이션',
    description: '초기 자본과 매월 적립금의 복리 효과, 연도별 자산 성장 추이 및 연평균 성장률(CAGR)',
    component: <CagrCalculator />,
  },
  {
    id: 'rent-convert',
    name: '전월세 변환 계산기',
    category: 'real-estate',
    categoryLabel: '부동산 / 주거',
    badge: '전월세전환율',
    icon: <Building2 className="w-5 h-5 text-amber-500" />,
    tagline: '전세 ↔ 월세 상호 최적 환산',
    description: '법정 전월세전환율을 기준으로 보증금 조정 시 월세 변동액 또는 월세 조정 시 보증금 환산',
    component: <RentConvertCalculator />,
  },
  {
    id: 'brokerage',
    name: '부동산 중개보수(복비) 계산기',
    category: 'real-estate',
    categoryLabel: '부동산 / 주거',
    badge: '개정 요율표',
    icon: <HomeIcon className="w-5 h-5 text-orange-500" />,
    tagline: '주택 · 오피스텔 매매/임대차',
    description: '거래금액 구간별 법정 상한 요율, 한도액 및 5,000만원 미만 임대차 보정식, 부가세 계산',
    component: <BrokerageCalculator />,
  },
  {
    id: 'unit-price',
    name: '단위당 단가 비교 계산기',
    category: 'daily',
    categoryLabel: '일상 / 생활',
    badge: '가성비 랭킹',
    icon: <ShoppingCart className="w-5 h-5 text-rose-500" />,
    tagline: '용량/규격별 최저가 자동 판별',
    description: 'g, kg, ml, L, ea 단위가 다른 상품군을 100g/100ml/1개 단위로 정규화하여 가성비 순위 도출',
    component: <UnitPriceCalculator />,
  },
  {
    id: 'dutch-pay',
    name: '더치페이(N빵) 정산기',
    category: 'daily',
    categoryLabel: '일상 / 생활',
    badge: '차등/끝전 절사',
    icon: <Users className="w-5 h-5 text-teal-500" />,
    tagline: '술값 따로, 끝전 절사까지 깔끔하게',
    description: '특정 인원만 지출한 차등 금액 분리 및 10원/100원/1,000원 단위 절사/반올림 정산',
    component: <DutchPayCalculator />,
  },
  {
    id: 'date',
    name: 'D-Day & 영업일 계산기',
    category: 'daily',
    categoryLabel: '일상 / 생활',
    badge: '주말 제외 영업일',
    icon: <CalendarDays className="w-5 h-5 text-cyan-500" />,
    tagline: '기념일 카운트 & 실근무 영업일수',
    description: 'UTC 타임존 보정 D-Day 카운트다운 및 토/일 주말을 제외한 순수 영업일수 계산',
    component: <DateCalculator />,
  },
  {
    id: 'bmr-tdee',
    name: '기초대사량 & TDEE 다이어트',
    category: 'health',
    categoryLabel: '건강 / 다이어트',
    badge: 'Mifflin-St Jeor',
    icon: <Activity className="w-5 h-5 text-green-500" />,
    tagline: '유지 칼로리 & 5:3:2 탄단지 분배',
    description: '키/몸무게/활동량 기반 기초대사량, 일일 유지 칼로리(TDEE) 및 감량/증량 맞춤 탄·단·지 권장량',
    component: <BmrTdeeCalculator />,
  },
];

const CATEGORIES = [
  { id: 'all', label: '전체 보기' },
  { id: 'finance', label: '금융 / 세금' },
  { id: 'real-estate', label: '부동산 / 주거' },
  { id: 'daily', label: '일상 / 생활' },
  { id: 'health', label: '건강 / 다이어트' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 자연스러운 로딩 스켈레톤 상태 표현
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const filtered = CALCULATORS.filter((calc) => {
    const matchCategory = selectedCategory === 'all' || calc.category === selectedCategory;
    const matchSearch =
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-muted/30">
      {/* 그레인 텍스처 배경 오버레이 */}
      <div className="grain-overlay" />

      {/* 상단 네비게이션 바 */}
      <header className="sticky top-0 z-40 border-b border-border/50 glass-panel">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center font-black shadow-md shadow-primary/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  INU 생활형 계산기
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                  <Sparkles className="w-3 h-3" /> 10-in-1
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                일상의 복잡한 연산을 가장 쉽고 정확하게
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* 메인 히어로 & 컨트롤러 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 히어로 타이틀 */}
        <section className="text-center max-w-2xl mx-auto mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary/80 border border-border/80 mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            2026 최신 개정세법 & 금융공식 반영 완료
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-foreground">
            필요한 계산을 선택하세요
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            카드를 클릭하면 직관적인 실시간 계산 엔진이 즉시 펼쳐집니다.
          </p>

          {/* 검색 입력창 */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="계산기 이름, 키워드 검색 (예: 월급, 대출, N빵...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-xs"
            />
          </div>
        </section>

        {/* 카테고리 필터 탭 */}
        <section className="flex items-center justify-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 backdrop-blur-md ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                  : 'glass-panel hover:bg-secondary/60 text-muted-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </section>

        {/* 계산기 카드 그리드 (로딩 스켈레톤 vs 실제 카드) */}
        {isLoading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border animate-pulse space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-muted/80" />
                  <div className="w-20 h-5 rounded-full bg-muted/80" />
                </div>
                <div className="space-y-2">
                  <div className="w-3/4 h-5 rounded-md bg-muted/80" />
                  <div className="w-1/2 h-4 rounded-md bg-muted/60" />
                </div>
                <div className="w-full h-10 rounded-xl bg-muted/40" />
              </div>
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {filtered.length === 0 ? (
              <div className="col-span-full py-16 text-center glass-card rounded-2xl border">
                <p className="text-muted-foreground text-sm">검색 결과에 일치하는 계산기가 없습니다.</p>
              </div>
            ) : (
              filtered.map((calc) => {
                const isExpanded = expandedCardId === calc.id;
                return (
                  <div
                    key={calc.id}
                    className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? 'col-span-1 md:col-span-2 ring-2 ring-primary/40 shadow-xl shadow-primary/5 bg-background/85'
                        : 'hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    {/* 카드 헤더 (클릭 시 펼치기 토글) */}
                    <div
                      onClick={() => toggleExpand(calc.id)}
                      className="p-5 sm:p-6 cursor-pointer select-none flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-secondary/80 border border-border/50 shadow-xs">
                            {calc.icon}
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-primary block">
                              {calc.categoryLabel}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                              {calc.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary/90 text-foreground/80 border border-border/50">
                            {calc.badge}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                              isExpanded ? 'bg-primary text-primary-foreground rotate-180' : 'bg-muted/70 text-muted-foreground'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground/90">
                          {calc.tagline}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {calc.description}
                        </p>
                      </div>

                      {!isExpanded && (
                        <div className="pt-2 flex items-center text-xs font-semibold text-primary gap-1">
                          <span>계산기 열기</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* 확장 영역: 계산기 상세 폼 및 연산 UI */}
                    {isExpanded && (
                      <div className="border-t border-border/50 p-4 sm:p-6 bg-background/50 backdrop-blur-sm animate-fade-up">
                        <div className="flex justify-end mb-3">
                          <button
                            type="button"
                            onClick={() => toggleExpand(calc.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border bg-secondary/50 transition-colors"
                          >
                            <ChevronUp className="w-3.5 h-3.5" /> 접기
                          </button>
                        </div>
                        {calc.component}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        )}
      </main>

      {/* 푸터 (Footer) */}
      <footer className="mt-auto border-t border-border/50 glass-panel py-8 px-4 text-center">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="text-xs sm:text-sm font-medium text-foreground/80">
            Copyright INU 생활형 계산기 by tenning_Gyaru
          </p>
          <p className="text-[11px] text-muted-foreground">
            정확한 기준과 공식에 기반하여 설계되었으며, 실제 세법 및 금융 규정에 따라 미세한 차이가 발생할 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
