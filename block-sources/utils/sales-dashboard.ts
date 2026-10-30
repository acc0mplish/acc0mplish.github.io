export type SalesOwner = 'min' | 'seo' | 'jin';
export type SalesStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type SalesPeriod = 'h1' | 'q1' | 'q2' | 'q3';
export type SalesView = 'all' | 'open' | 'won';
export type SalesGrouping = 'month' | 'quarter';
export type SalesActivity = 'calls' | 'emails' | 'meetings' | 'tasks';
export interface SalesDeal {
  /** Authored English labels remain searchable alongside Korean source fields. */
  searchAliases?: string[];
  id: string;
  company: string;
  title: string;
  owner: SalesOwner;
  date: string;
  stage: SalesStage;
  amount: number;
  activities: Record<SalesActivity, number>;
}
export interface SalesFilters {
  period: SalesPeriod;
  owner: SalesOwner | 'all';
  view: SalesView;
  query: string;
}
export interface SalesRevenuePoint { key: string; label: string; revenue: number; wonCount: number }

export const SALES_OWNERS: { id: SalesOwner; name: string; initials: string; role: string }[] = [
  { id: 'min', name: '김민서', initials: '민서', role: '엔터프라이즈 영업' },
  { id: 'seo', name: '이서준', initials: '서준', role: '솔루션 영업' },
  { id: 'jin', name: '박서진', initials: '서진', role: '파트너 영업' },
];

export const SALES_DEALS: SalesDeal[] = [
  { id: 'S-2601', company: '한빛 리테일', title: '고객 분석 플랫폼', owner: 'min', date: '2026-01-14', stage: 'won', amount: 18000000, activities: { calls: 12, emails: 18, meetings: 4, tasks: 7 }, searchAliases: ["Hanbit Retail","Customer analytics platform","Minseo Kim"] },
  { id: 'S-2602', company: '누리 모빌리티', title: '운영 대시보드', owner: 'seo', date: '2026-01-23', stage: 'proposal', amount: 13000000, activities: { calls: 8, emails: 14, meetings: 3, tasks: 5 }, searchAliases: ["Nuri Mobility","Operations dashboard","Seojun Lee"] },
  { id: 'S-2603', company: '다온 스튜디오', title: '팀 워크스페이스', owner: 'jin', date: '2026-01-29', stage: 'lost', amount: 6000000, activities: { calls: 4, emails: 7, meetings: 1, tasks: 3 }, searchAliases: ["Daon Studio","Team workspace","Seojin Park"] },
  { id: 'S-2604', company: '온유 물류', title: '배송 인사이트', owner: 'seo', date: '2026-02-10', stage: 'won', amount: 26000000, activities: { calls: 15, emails: 21, meetings: 5, tasks: 8 }, searchAliases: ["Onyu Logistics","Delivery insights","Seojun Lee"] },
  { id: 'S-2605', company: '새봄 에듀', title: '학습 데이터 분석', owner: 'min', date: '2026-02-18', stage: 'qualified', amount: 9000000, activities: { calls: 6, emails: 9, meetings: 2, tasks: 4 }, searchAliases: ["Saebom Education","Learning data analytics","Minseo Kim"] },
  { id: 'S-2606', company: '별빛 커머스', title: '매출 예측 도구', owner: 'jin', date: '2026-02-25', stage: 'negotiation', amount: 17000000, activities: { calls: 11, emails: 16, meetings: 4, tasks: 6 }, searchAliases: ["Byeolbit Commerce","Revenue forecasting tool","Seojin Park"] },
  { id: 'S-2607', company: '한결 테크', title: '데이터 통합 허브', owner: 'jin', date: '2026-03-09', stage: 'won', amount: 22000000, activities: { calls: 13, emails: 19, meetings: 4, tasks: 7 }, searchAliases: ["Hangyeol Tech","Data integration hub","Seojin Park"] },
  { id: 'S-2608', company: '모아 금융', title: '고객 리포트 자동화', owner: 'min', date: '2026-03-20', stage: 'won', amount: 16000000, activities: { calls: 10, emails: 17, meetings: 3, tasks: 6 }, searchAliases: ["Moa Finance","Customer report automation","Minseo Kim"] },
  { id: 'S-2609', company: '아침 헬스', title: '서비스 지표 탐색', owner: 'seo', date: '2026-03-27', stage: 'lead', amount: 8000000, activities: { calls: 3, emails: 5, meetings: 1, tasks: 2 }, searchAliases: ["Achim Health","Service metrics explorer","Seojun Lee"] },
  { id: 'S-2610', company: '나래 시스템', title: '전사 분석 환경', owner: 'min', date: '2026-04-08', stage: 'won', amount: 32000000, activities: { calls: 18, emails: 25, meetings: 6, tasks: 9 }, searchAliases: ["Narae Systems","Enterprise analytics workspace","Minseo Kim"] },
  { id: 'S-2611', company: '이음 파트너스', title: '파트너 포털', owner: 'jin', date: '2026-04-17', stage: 'proposal', amount: 21000000, activities: { calls: 9, emails: 15, meetings: 3, tasks: 5 }, searchAliases: ["Ieum Partners","Partner portal","Seojin Park"] },
  { id: 'S-2612', company: '고운 푸드', title: '수요 분석 대시보드', owner: 'seo', date: '2026-04-29', stage: 'qualified', amount: 14000000, activities: { calls: 7, emails: 11, meetings: 2, tasks: 4 }, searchAliases: ["Goun Foods","Demand analytics dashboard","Seojun Lee"] },
  { id: 'S-2613', company: '우림 에너지', title: '운영 지표 통합', owner: 'seo', date: '2026-05-12', stage: 'won', amount: 24000000, activities: { calls: 14, emails: 22, meetings: 5, tasks: 8 }, searchAliases: ["Urim Energy","Operations metrics integration","Seojun Lee"] },
  { id: 'S-2614', company: '도담 로보틱스', title: '생산 인사이트', owner: 'min', date: '2026-05-21', stage: 'negotiation', amount: 27000000, activities: { calls: 12, emails: 18, meetings: 4, tasks: 6 }, searchAliases: ["Dodam Robotics","Production insights","Minseo Kim"] },
  { id: 'S-2615', company: '마루 디자인', title: '프로젝트 분석', owner: 'jin', date: '2026-05-28', stage: 'lost', amount: 12000000, activities: { calls: 5, emails: 8, meetings: 2, tasks: 3 }, searchAliases: ["Maru Design","Project analytics","Seojin Park"] },
  { id: 'S-2616', company: '해솔 네트웍스', title: '엔터프라이즈 데이터 허브', owner: 'jin', date: '2026-06-11', stage: 'won', amount: 38000000, activities: { calls: 20, emails: 28, meetings: 7, tasks: 10 }, searchAliases: ["Haesol Networks","Enterprise data hub","Seojin Park"] },
  { id: 'S-2617', company: '푸른 출판', title: '콘텐츠 성과 분석', owner: 'seo', date: '2026-06-19', stage: 'proposal', amount: 19000000, activities: { calls: 8, emails: 13, meetings: 3, tasks: 5 }, searchAliases: ["Pureun Publishing","Content performance analytics","Seojun Lee"] },
  { id: 'S-2618', company: '오름 랩스', title: '제품 지표 워크스페이스', owner: 'min', date: '2026-06-26', stage: 'lead', amount: 11000000, activities: { calls: 2, emails: 4, meetings: 1, tasks: 2 }, searchAliases: ["Oreum Labs","Product metrics workspace","Minseo Kim"] },
];

function monthsForPeriod(period: SalesPeriod): number[] {
  return period === 'h1' ? [1, 2, 3, 4, 5, 6] : period === 'q1' ? [1, 2, 3] : period === 'q2' ? [4, 5, 6] : [7, 8, 9];
}
function inPeriod(deal: SalesDeal, period: SalesPeriod): boolean {
  return deal.date.startsWith('2026-') && monthsForPeriod(period).includes(Number(deal.date.slice(5, 7)));
}
function isOpen(deal: SalesDeal): boolean { return deal.stage !== 'won' && deal.stage !== 'lost'; }

export function filterSalesDeals(deals: SalesDeal[], filters: SalesFilters): SalesDeal[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return deals.filter(deal => inPeriod(deal, filters.period)
    && (filters.owner === 'all' || deal.owner === filters.owner)
    && (filters.view === 'all' || (filters.view === 'open' ? isOpen(deal) : deal.stage === 'won'))
    && (!query || [deal.company, deal.title, deal.id, ...(deal.searchAliases ?? [])].some(value => value.toLocaleLowerCase().includes(query))));
}

export function summarizeSales(deals: SalesDeal[]) {
  const won = deals.filter(deal => deal.stage === 'won');
  const open = deals.filter(isOpen);
  const lostCount = deals.filter(deal => deal.stage === 'lost').length;
  const activities = { calls: 0, emails: 0, meetings: 0, tasks: 0 };
  const stages: Record<SalesStage, number> = { lead: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 };
  for (const deal of deals) {
    stages[deal.stage] += 1;
    for (const key of Object.keys(activities) as SalesActivity[]) activities[key] += deal.activities[key];
  }
  const team = SALES_OWNERS.filter(owner => deals.some(deal => deal.owner === owner.id)).map(owner => {
    const owned = deals.filter(deal => deal.owner === owner.id);
    return { owner: owner.id, revenue: owned.filter(deal => deal.stage === 'won').reduce((sum, deal) => sum + deal.amount, 0), wonCount: owned.filter(deal => deal.stage === 'won').length, openCount: owned.filter(isOpen).length };
  });
  return {
    revenue: won.reduce((sum, deal) => sum + deal.amount, 0),
    pipelineValue: open.reduce((sum, deal) => sum + deal.amount, 0),
    wonCount: won.length, openCount: open.length, lostCount,
    winRate: won.length + lostCount ? won.length / (won.length + lostCount) * 100 : 0,
    activities, totalActivities: Object.values(activities).reduce((sum, value) => sum + value, 0), stages, team,
  };
}

export function groupSalesRevenue(deals: SalesDeal[], period: SalesPeriod, grouping: SalesGrouping): SalesRevenuePoint[] {
  const months = monthsForPeriod(period);
  const groups = grouping === 'month' ? months : [...new Set(months.map(month => Math.ceil(month / 3)))];
  return groups.map(group => {
    const matching = deals.filter(deal => inPeriod(deal, period) && deal.stage === 'won' && (grouping === 'month' ? Number(deal.date.slice(5, 7)) : Math.ceil(Number(deal.date.slice(5, 7)) / 3)) === group);
    return { key: grouping === 'month' ? `2026-${String(group).padStart(2, '0')}` : `2026-Q${group}`, label: grouping === 'month' ? `${group}월` : `${group}분기`, revenue: matching.reduce((sum, deal) => sum + deal.amount, 0), wonCount: matching.length };
  });
}
