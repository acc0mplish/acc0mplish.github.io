import React, { useEffect, useMemo, useRef, useState } from 'react';

type Status = '대기' | '진행' | '검토' | '완료' | '주의';
type Priority = '높음' | '보통' | '낮음';
type ColumnKey = 'title' | 'group' | 'owner' | 'status' | 'priority' | 'quantity' | 'unitPrice' | 'total' | 'updated';
type GridRow = {
  id: string;
  title: string;
  group: string;
  owner: string;
  status: Status;
  priority: Priority;
  quantity: number;
  unitPrice: number;
  updated: string;
  description: string;
  lane: '대기함' | '선택함';
  parentId?: string;
};
type SortState = { key: ColumnKey; direction: 'asc' | 'desc' } | null;
type Filters = { group: string; status: string; priority: string };
type UiState = {
  variant: string;
  query: string;
  filters: Filters;
  sort: SortState;
  columns: ColumnKey[];
  hiddenColumns: ColumnKey[];
  widths: Partial<Record<ColumnKey, number>>;
  pin: { key: ColumnKey; side: 'left' | 'right' } | null;
  selectedIds: string[];
  expandedIds: string[];
  detailId: string | null;
  focusedId: string | null;
  groupExpanded: string[];
  groupOrder: string[];
  skeletonMode: boolean;
  expandedText: boolean;
  simulating: boolean;
  tick: number;
  scrollTop: number;
  bulkStatus: Status;
};

type PlannedVariant = { title: string; category: string; description: string };

const VARIANTS: Record<string, PlannedVariant> = {
  'bordered-table': { title: '보더 라인 테이블', category: '기본 그리드', description: '명확한 셀 경계선을 제공하는 그리드' },
  'selectable-grid': { title: '다중 선택 그리드', category: '기본 그리드', description: '체크박스 선택과 선택 행 수를 동기화합니다.' },
  'sortable-headers': { title: '정렬 가능 헤더', category: '기본 그리드', description: '헤더를 눌러 실제 행을 오름차순·내림차순으로 정렬합니다.' },
  'fixed-header': { title: '상단 고정 헤더', category: '기본 그리드', description: '그리드 안을 스크롤해도 컬럼 헤더가 상단에 남습니다.' },
  'empty-states': { title: '빈 데이터 상태 뷰', category: '기본 그리드', description: '검색 결과가 없을 때 복구할 수 있는 빈 상태를 보여줍니다.' },
  'loading-skeletons': { title: '로딩 스켈레톤 UI', category: '기본 그리드', description: '네트워크 요청 없이 로컬 스켈레톤 표시 상태를 전환합니다.' },
  'faceted-filter-grid': { title: '패싯 다중 필터', category: '고급 그리드', description: '검색어, 그룹, 상태, 우선순위 조건을 함께 적용합니다.' },
  'inline-row-actions': { title: '인라인 행 액션', category: '고급 그리드', description: '각 행에서 상태를 빠르게 바꾸고 행을 제거합니다.' },
  'cell-formula-eval': { title: '셀 수식 자동 계산', category: '고급 그리드', description: '수량 × 단가를 계산하고 합계를 다시 계산합니다. 한 가지 샘플 계산식만 제공합니다.' },
  'nested-subgrids': { title: '중첩 서브 그리드', category: '고급 그리드', description: '행을 펼쳐 로컬 하위 표본을 계층적으로 확인합니다.' },
  'multi-level-headers': { title: '다단 그룹 헤더', category: '고급 그리드', description: '관련 컬럼을 상위 헤더 아래 묶어 표시합니다.' },
  'batch-bulk-update': { title: '대량 일괄 수정', category: '고급 그리드', description: '선택한 행의 상태를 한 번에 갱신합니다.' },
  'export-csv-excel': { title: 'CSV 내보내기', category: '고급 그리드', description: '현재 필터에 맞는 로컬 행을 CSV 파일로 다운로드합니다.' },
  'dynamic-height-cells': { title: '가변 높이 셀', category: '고급 그리드', description: '긴 설명의 줄임 표시를 전환해 행 높이가 실제로 달라집니다.' },
  'undo-redo-history': { title: '실행 취소/복원', category: '고급 그리드', description: '담당자 편집을 실행 취소하거나 다시 적용합니다.' },
  'column-visibility': { title: '컬럼 표시 피커', category: '컬럼 설정', description: '컬럼을 숨기고 다시 표시합니다.' },
  'column-reordering': { title: '컬럼 순서 변경', category: '컬럼 설정', description: '헤더 드래그 또는 키보드 버튼으로 실제 컬럼 순서를 바꿉니다.' },
  'column-pinning': { title: '좌/우 컬럼 고정', category: '컬럼 설정', description: '선택한 컬럼을 가로 스크롤 영역의 한쪽 가장자리에 고정합니다.' },
  'resizable-headers': { title: '컬럼 너비 조절', category: '컬럼 설정', description: '헤더 경계를 드래그하거나 키보드로 조작해 실제 너비를 바꿉니다.' },
  'auto-fit-columns': { title: '자동 너비 맞춤', category: '컬럼 설정', description: '샘플 셀 텍스트 길이에 맞춰 각 컬럼 너비를 계산합니다.' },
  'row-reorder-handle': { title: '행 순서 드래그', category: '드래그 앤 드롭', description: '행을 드래그하거나 위·아래 버튼으로 순서를 변경합니다.' },
  'kanban-interchange': { title: '테이블 ↔ 칸반 연동', category: '드래그 앤 드롭', description: '행을 칸반 상태 열에 놓거나 이동 버튼으로 상태를 바꿉니다.' },
  'cross-table-dnd': { title: '테이블 간 이동', category: '드래그 앤 드롭', description: '두 로컬 표 사이에서 행을 드래그하거나 이동 버튼으로 옮깁니다.' },
  'hierarchy-tree-reorder': { title: '트리 계층 재배치', category: '드래그 앤 드롭', description: '들여쓰기·내어쓰기와 순서 버튼으로 샘플 트리를 편집합니다.' },
  'detail-panel-row': { title: '행 상세 아코디언', category: '행 확장', description: '각 행 아래 상세 메타데이터를 펼칩니다.' },
  'lazy-child-loader': { title: '지연 로딩 하위 행', category: '행 확장', description: '행을 펼치는 시점에 미리 정의된 로컬 하위 표본을 표시합니다. API 호출은 없습니다.' },
  'master-detail-split': { title: '마스터-디테일 분할', category: '행 확장', description: '선택 행의 상세 내용을 옆 패널에 표시합니다.' },
  'automation-library': { title: '자동화 규칙 목록', category: '필터링', description: '자동화 규칙의 그룹·상태·우선순위를 조합해 필터링합니다.' },
  'renewal-reassignment': { title: '갱신 담당자 재배정', category: '필터링', description: '계약 갱신 행을 담당자와 상태 기준으로 찾아 편집합니다.' },
  'at-risk-renewals': { title: '이탈 위험 고객사', category: '필터링', description: '위험 표시가 있는 샘플 행을 필터 조합으로 좁힙니다.' },
  'patient-access': { title: '임상 환자군 분류', category: '그룹화', description: '샘플 환자군을 그룹별로 묶고 각 그룹 합계를 다시 계산합니다.' },
  'bill-materials': { title: '자재 명세서 (BOM)', category: '그룹화', description: '부품 범주별 구성과 수량×단가 합계를 표시합니다.' },
  'reporting-hierarchy': { title: '조직 예산 체계', category: '그룹화', description: '조직 그룹별 행 수와 샘플 예산 합계를 계산합니다.' },
  'editorial-pipeline': { title: '콘텐츠 파이프라인', category: '그룹화', description: '발행 상태별로 행을 묶고 각 단계의 건수를 표시합니다.' },
  'studio-delivery': { title: '스튜디오 딜리버리', category: '그룹화', description: '제작 그룹을 펼치고 그룹 순서를 직접 조정합니다.' },
  'card-payments-ledger': { title: '대용량 결제 원장', category: '가상 스크롤', description: '고정된 로컬 합성 360행 중 화면 주변 행만 렌더링합니다. 처리량 측정이 아닙니다.' },
  'shipment-exceptions': { title: '물류 예외 모니터링', category: '가상 스크롤', description: '제한된 로컬 샘플 행과 상태를 표시합니다. 실제 텔레메트리는 연결하지 않습니다.' },
  'audit-log-stream': { title: '보안 감사 스트림', category: '가상 스크롤', description: '합성 로그 360행의 화면 구간을 렌더링합니다. 실시간 보안 로그는 아닙니다.' },
  'iot-sensor-matrix': { title: 'IoT 센서 그리드', category: '가상 스크롤', description: '로컬 합성 센서 수치를 제한된 행 구간에서 보여줍니다.' },
  'order-book-depth': { title: '초고속 호가창', category: '가상 스크롤', description: '로컬 합성 호가 360행 중 화면 구간을 렌더링합니다. 속도 벤치마크가 아닙니다.' },
};

const BASE_ROWS: Omit<GridRow, 'id'>[] = [
  { title: '결제 승인 화면 개선', group: '결제', owner: '김서연', status: '진행', priority: '높음', quantity: 3, unitPrice: 240000, updated: '09:12', description: '승인 단계의 오류 안내와 재시도 흐름을 정리합니다.', lane: '대기함' },
  { title: '고객 검색 응답 정리', group: '플랫폼', owner: '박도윤', status: '검토', priority: '보통', quantity: 2, unitPrice: 180000, updated: '09:28', description: '검색 결과의 빈 상태와 페이지 이동 문구를 검토합니다.', lane: '선택함' },
  { title: '정산 요약 리포트', group: '데이터', owner: '이민지', status: '대기', priority: '낮음', quantity: 5, unitPrice: 95000, updated: '10:04', description: '주간 정산 합계와 원본 행을 함께 확인할 수 있습니다.', lane: '대기함' },
  { title: '권한 변경 이력', group: '보안', owner: '최현우', status: '완료', priority: '높음', quantity: 1, unitPrice: 420000, updated: '10:31', description: '역할 변경 시각과 변경 이유를 기록합니다.', lane: '선택함' },
  { title: '배송 지연 알림', group: '운영', owner: '정하린', status: '주의', priority: '높음', quantity: 4, unitPrice: 125000, updated: '11:05', description: '예정 시간을 넘긴 배송 건을 운영자가 확인합니다.', lane: '대기함' },
  { title: '청구서 필드 검증', group: '결제', owner: '윤지호', status: '진행', priority: '보통', quantity: 6, unitPrice: 76000, updated: '11:46', description: '청구 금액과 수신 정보를 제출 전에 검증합니다.', lane: '선택함' },
  { title: '알림 규칙 점검', group: '플랫폼', owner: '한유진', status: '검토', priority: '낮음', quantity: 2, unitPrice: 135000, updated: '12:18', description: '같은 조건에서 중복 알림이 생성되지 않는지 확인합니다.', lane: '대기함' },
  { title: '월간 접근 검토', group: '보안', owner: '오준서', status: '대기', priority: '보통', quantity: 3, unitPrice: 110000, updated: '13:02', description: '권한 보유자를 검토하고 불필요한 접근을 정리합니다.', lane: '선택함' },
];

const SCENARIOS: Record<string, string[]> = {
  'automation-library': ['결제 완료 알림', '갱신 30일 전 안내', '권한 변경 기록', '배송 지연 통보', '주간 보고서 생성', '실패 작업 재시도'],
  'renewal-reassignment': ['한빛상사 · Enterprise', '새길테크 · Pro', '온누리금융 · Enterprise', '바른헬스 · Pro', '다온물류 · Enterprise', '미래교육 · Pro'],
  'at-risk-renewals': ['다온유통 · 건강도 32', '정원바이오 · 건강도 38', '누리금융 · 건강도 29', '한결교육 · 건강도 35', '새벽물류 · 건강도 40', '봄날미디어 · 건강도 34'],
  'patient-access': ['참여자 P-014', '참여자 P-021', '참여자 P-036', '참여자 P-042', '참여자 P-055', '참여자 P-061'],
  'bill-materials': ['센서 보드 어셈블리', '전원 모듈', '광학 모듈', '케이스 프레임', '연결 케이블', '보정 키트'],
  'reporting-hierarchy': ['제품 본부 · 예산', '플랫폼 팀 · 예산', '고객 경험 팀 · 예산', '데이터 팀 · 예산', '운영 본부 · 예산', '보안 팀 · 예산'],
  'editorial-pipeline': ['정산 가이드 초안', '보안 체크리스트', '제품 업데이트 노트', '고객 사례 인터뷰', '운영 FAQ 개정', '디자인 시스템 소개'],
  'studio-delivery': ['결제 화면 시안', '브랜드 아이콘 세트', '온보딩 일러스트', '제품 소개 영상', '대시보드 그래픽', '캠페인 랜딩 이미지'],
  'card-payments-ledger': ['결제 TXN-1042', '결제 TXN-1043', '환불 TXN-1044', '정산 TXN-1045'],
  'shipment-exceptions': ['화물 SH-241 · 지연', '화물 SH-242 · 이동 중', '화물 SH-243 · 확인 필요', '화물 SH-244 · 도착 예정'],
  'audit-log-stream': ['권한 변경 기록', '세션 종료 기록', '정책 조회 기록', '키 회전 기록'],
  'iot-sensor-matrix': ['센서 SN-018 · 온도', '센서 SN-019 · 압력', '센서 SN-020 · 습도', '센서 SN-021 · 진동'],
  'order-book-depth': ['매수 135,240원', '매도 135,260원', '매수 135,220원', '매도 135,280원'],
};

const STATUSES: Status[] = ['진행', '검토', '대기', '완료', '주의'];
const PRIORITIES: Priority[] = ['높음', '보통', '낮음'];
const ALL_COLUMN_KEYS: ColumnKey[] = ['title', 'group', 'owner', 'status', 'priority', 'quantity', 'unitPrice', 'total', 'updated'];
const DEFAULT_COLUMNS: ColumnKey[] = ['title', 'owner', 'group', 'status', 'priority', 'total', 'updated'];
const FORMULA_COLUMNS: ColumnKey[] = ['title', 'quantity', 'unitPrice', 'total'];
const VIRTUAL_VARIANTS = new Set(['card-payments-ledger', 'shipment-exceptions', 'audit-log-stream', 'iot-sensor-matrix', 'order-book-depth']);
const GROUP_VARIANTS = new Set(['patient-access', 'bill-materials', 'reporting-hierarchy', 'editorial-pipeline', 'studio-delivery']);
const EXPANSION_VARIANTS = new Set(['detail-panel-row', 'lazy-child-loader', 'nested-subgrids']);
const SELECTION_VARIANTS = new Set(['selectable-grid', 'faceted-filter-grid', 'batch-bulk-update', 'master-detail-split']);

const COLUMN_LABELS: Record<ColumnKey, string> = {
  title: '항목', group: '그룹', owner: '담당자', status: '상태', priority: '우선순위',
  quantity: '수량', unitPrice: '단가 (₩)', total: '합계 (₩)', updated: '수정 시각',
};

function createRows(variant: string): GridRow[] {
  const titles = SCENARIOS[variant];
  const rows = (titles ?? BASE_ROWS.map((row) => row.title)).map((title, index) => {
    const base = BASE_ROWS[index % BASE_ROWS.length];
    const groupByScenario: Record<string, string[]> = {
      'automation-library': ['결제', '계약', '보안', '배송', '보고', '운영'],
      'renewal-reassignment': ['Enterprise', 'Pro', 'Enterprise', 'Pro', 'Enterprise', 'Pro'],
      'at-risk-renewals': ['건강도 32', '건강도 38', '건강도 29', '건강도 35', '건강도 40', '건강도 34'],
      'patient-access': ['선별 단계', '관찰 단계', '치료 단계', '선별 단계', '관찰 단계', '치료 단계'],
      'bill-materials': ['제어 보드', '전원부', '광학부', '하우징', '배선', '검수'],
      'reporting-hierarchy': ['제품 본부', '플랫폼 팀', '고객 경험 팀', '데이터 팀', '운영 본부', '보안 팀'],
      'editorial-pipeline': ['기획', '집필', '검수', '기획', '집필', '검수'],
      'studio-delivery': ['화면 설계', '브랜드 에셋', '일러스트', '영상', '화면 설계', '브랜드 에셋'],
    };
    const groups = groupByScenario[variant];
    const status: Status = variant === 'editorial-pipeline' ? (['대기', '진행', '검토', '대기', '진행', '검토'][index] as Status) : STATUSES[index % STATUSES.length];
    const parentId = variant === 'hierarchy-tree-reorder' ? ([undefined, undefined, 'row-1', 'row-1', 'row-2', 'row-4', undefined, 'row-2'][index]) : undefined;
    return {
      ...base,
      id: `row-${index + 1}`,
      title,
      group: groups?.[index] ?? base.group,
      status,
      priority: PRIORITIES[index % PRIORITIES.length],
      quantity: index + 1,
      unitPrice: [240000, 180000, 95000, 420000, 125000, 76000, 135000, 110000][index],
      description: variant === 'patient-access'
        ? '합성 환자군의 시험 단계와 트리아지 상태를 확인합니다.'
        : variant === 'bill-materials'
          ? '로컬 BOM 표본의 구성 수량과 단가를 확인합니다.'
          : variant === 'at-risk-renewals'
            ? '합성 건강도 점수와 갱신 담당자를 확인합니다.'
            : base.description,
      lane: index % 2 === 0 ? '대기함' as const : '선택함' as const,
      ...(parentId ? { parentId } : {}),
    };
  });
  return rows;
}

function createUiState(variant: string): UiState {
  const virtual = VIRTUAL_VARIANTS.has(variant);
  return {
    variant,
    query: variant === 'empty-states' ? '없는 항목' : '',
    filters: { group: 'all', status: 'all', priority: 'all' },
    sort: null,
    columns: variant === 'cell-formula-eval' ? [...FORMULA_COLUMNS] : [...DEFAULT_COLUMNS],
    hiddenColumns: [],
    widths: {},
    pin: null,
    selectedIds: [],
    expandedIds: [],
    detailId: null,
    focusedId: null,
    groupExpanded: [],
    groupOrder: [],
    skeletonMode: variant === 'loading-skeletons',
    expandedText: false,
    simulating: false,
    tick: 0,
    scrollTop: 0,
    bulkStatus: '진행',
  };
}

function cloneRows(rows: GridRow[]): GridRow[] {
  return rows.map((row) => ({ ...row }));
}

function rowValue(row: GridRow, key: ColumnKey): string | number {
  switch (key) {
    case 'title': return row.title;
    case 'group': return row.group;
    case 'owner': return row.owner;
    case 'status': return row.status;
    case 'priority': return row.priority;
    case 'quantity': return row.quantity;
    case 'unitPrice': return row.unitPrice;
    case 'total': return row.quantity * row.unitPrice;
    case 'updated': return row.updated;
  }
}

function moveValue<T>(items: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (index < 0 || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

const styles = `
.klic-planned-grid{--dg-surface:var(--klic-semantic-color-surface,#fbfcfe);--dg-panel:var(--klic-semantic-color-panel,#fff);--dg-text:var(--klic-semantic-color-text,#132c46);--dg-muted:var(--klic-semantic-color-muted,#52657b);--dg-border:var(--klic-semantic-color-border,#dfe5ee);--dg-accent:var(--klic-semantic-color-accent,#245fc2);--dg-soft:var(--klic-ui-soft,#f5f7fb);--dg-selected:var(--klic-ui-selected,#eaf0fb);--dg-grid:var(--klic-ui-grid,#dce4f0);color:var(--dg-text);background:var(--dg-surface);font:inherit;min-width:0;max-width:100%;border:1px solid var(--dg-border);border-radius:12px;overflow:hidden}
.klic-planned-grid *{box-sizing:border-box}.klic-planned-grid button,.klic-planned-grid input,.klic-planned-grid select{font:inherit;color:inherit}.klic-planned-grid button{cursor:pointer}.klic-planned-grid button:disabled{cursor:not-allowed;opacity:.48}.klic-planned-grid button:focus-visible,.klic-planned-grid input:focus-visible,.klic-planned-grid select:focus-visible,.klic-planned-grid [tabindex]:focus-visible{outline:3px solid var(--dg-accent);outline-offset:2px;z-index:3}
.dg-head{padding:18px 20px 14px;border-bottom:1px solid var(--dg-border);background:var(--dg-panel)}.dg-kicker{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--dg-accent)}.dg-title{font-size:20px;line-height:1.3;font-weight:700;margin:5px 0}.dg-description{color:var(--dg-muted);font-size:13px;line-height:1.55;margin:0;max-width:760px}.dg-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}.dg-pill{border:1px solid var(--dg-border);background:var(--dg-soft);border-radius:999px;padding:3px 9px;color:var(--dg-muted);font-size:11px}.dg-pill-blue{color:var(--dg-accent);border-color:color-mix(in srgb,var(--dg-accent) 28%,var(--dg-border));background:var(--dg-selected)}
.dg-body{padding:14px 16px 16px;min-width:0}.dg-toolbar{display:flex;align-items:flex-end;gap:9px;flex-wrap:wrap;margin-bottom:12px}.dg-control{display:flex;flex-direction:column;gap:4px;min-width:118px}.dg-control label,.dg-label{color:var(--dg-muted);font-size:11px;font-weight:600}.dg-input,.dg-select{min-height:34px;border:1px solid var(--dg-border);border-radius:7px;background:var(--dg-panel);padding:6px 9px;font-size:12px;max-width:100%}.dg-search{min-width:min(250px,100%);flex:1}.dg-button{min-height:32px;border:1px solid var(--dg-border);border-radius:7px;background:var(--dg-panel);padding:6px 10px;font-size:12px;font-weight:600;color:var(--dg-text);white-space:nowrap}.dg-button:hover:not(:disabled){border-color:var(--dg-accent);color:var(--dg-accent)}.dg-button-primary{color:#fff!important;background:var(--dg-accent)!important;border-color:var(--dg-accent)!important}.dg-button-small{min-height:27px;padding:3px 7px;font-size:11px}.dg-inline{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.dg-toolbar-end{margin-left:auto;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.dg-count{font-size:12px;color:var(--dg-muted)}.dg-filter-tags{display:flex;gap:6px;flex-wrap:wrap;margin:-3px 0 10px}.dg-filter-tag{font-size:11px;padding:3px 8px;background:var(--dg-selected);border-radius:999px;color:var(--dg-accent)}
.dg-panel{border:1px solid var(--dg-border);border-radius:9px;background:var(--dg-panel);padding:11px;margin:0 0 12px}.dg-panel-title{font-weight:700;font-size:12px;margin:0 0 8px}.dg-columns{display:flex;gap:6px 12px;flex-wrap:wrap}.dg-check{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--dg-text)}.dg-check input{accent-color:var(--dg-accent)}.dg-column-tools{display:flex;flex-direction:column;gap:7px}.dg-column-row{display:flex;align-items:center;gap:6px;font-size:12px}.dg-column-row span{min-width:90px}.dg-column-row input[type=range]{width:min(180px,35vw);accent-color:var(--dg-accent)}.dg-hint{font-size:11px;color:var(--dg-muted);line-height:1.5;margin:7px 0 0}.dg-warning{color:#81520a;background:#fff6e5;border:1px solid #eed7a5;border-radius:7px;padding:8px 10px;font-size:11px}.dg-danger{color:#9e3030}.dg-scroll{overflow:auto;max-width:100%;max-height:390px;border:1px solid var(--dg-border);border-radius:8px;background:var(--dg-panel);overscroll-behavior:contain}.dg-scroll-fixed{max-height:310px}.dg-scroll-virtual{height:320px;max-height:320px;overflow:auto;overscroll-behavior:contain}.dg-table{width:100%;min-width:680px;border-collapse:separate;border-spacing:0;table-layout:fixed;font-size:12px}.dg-table th,.dg-table td{padding:10px 11px;border-bottom:1px solid var(--dg-grid);text-align:left;vertical-align:middle;background:var(--dg-panel);overflow-wrap:anywhere}.dg-table th{position:relative;color:var(--dg-muted);font-size:11px;font-weight:700;background:var(--dg-soft);white-space:nowrap}.dg-table th.dg-sticky{position:sticky;top:0;z-index:5}.dg-table td{line-height:1.45}.dg-table tr:last-child td{border-bottom:0}.dg-bordered .dg-table th,.dg-bordered .dg-table td{border-right:1px solid var(--dg-grid);border-bottom:1px solid var(--dg-grid)}.dg-bordered .dg-table th:last-child,.dg-bordered .dg-table td:last-child{border-right:0}.dg-th-button{border:0;background:transparent;padding:0;color:inherit;font-size:inherit;font-weight:inherit;text-align:left;cursor:pointer;max-width:100%}.dg-sort{color:var(--dg-accent);margin-left:5px}.dg-resize{position:absolute;right:-4px;top:0;height:100%;width:10px;touch-action:none;cursor:col-resize;z-index:7}.dg-resize:after{content:"";position:absolute;left:4px;top:25%;height:50%;border-left:2px solid transparent}.dg-resize:hover:after,.dg-resize:focus-visible:after{border-color:var(--dg-accent)}.dg-row-selected td{background:var(--dg-selected)}.dg-row-focused td{box-shadow:inset 0 0 0 1px var(--dg-accent)}.dg-checkbox-cell{width:42px;text-align:center!important}.dg-checkbox-cell input{accent-color:var(--dg-accent);width:15px;height:15px}.dg-cell-title{display:flex;align-items:center;gap:7px;min-width:0}.dg-title-link{border:0;background:none;padding:2px 0;text-align:left;color:var(--dg-text);font-weight:650;cursor:pointer;min-width:0}.dg-title-link:hover{color:var(--dg-accent);text-decoration:underline}.dg-status{display:inline-flex;align-items:center;gap:5px;border-radius:999px;background:var(--dg-selected);color:var(--dg-accent);padding:3px 8px;font-size:11px;white-space:nowrap}.dg-status-warning{background:#fff4df;color:#81520a}.dg-status-danger{background:#fff0ef;color:#9e3030}.dg-note{font-size:11px;color:var(--dg-muted)}.dg-total-row td{font-weight:700;background:var(--dg-soft)}.dg-empty{text-align:center;padding:34px 18px;color:var(--dg-muted)}.dg-empty strong{display:block;color:var(--dg-text);margin-bottom:5px}.dg-skeleton{height:14px;border-radius:5px;background:linear-gradient(90deg,var(--dg-soft),var(--dg-selected),var(--dg-soft));background-size:200% 100%;animation:dg-shimmer 1.4s ease-in-out infinite}.dg-skeleton-row td{height:40px}@keyframes dg-shimmer{to{background-position:-200% 0}}.dg-description-cell{max-width:430px}.dg-clamp .dg-description-cell-text{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.dg-detail{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:12px;background:var(--dg-soft);border-radius:7px}.dg-detail div{min-width:0}.dg-detail dt{font-size:10px;color:var(--dg-muted);margin-bottom:3px}.dg-detail dd{margin:0;font-size:12px;overflow-wrap:anywhere}.dg-child-table{min-width:340px;width:100%;border-collapse:collapse;margin-top:8px}.dg-child-table th,.dg-child-table td{padding:7px;border:1px solid var(--dg-grid);font-size:11px}.dg-split{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(230px,.8fr);gap:12px;align-items:start}.dg-detail-panel{border:1px solid var(--dg-border);border-radius:9px;background:var(--dg-panel);padding:13px;min-width:0}.dg-detail-panel h3{font-size:13px;margin:0 0 9px}.dg-detail-panel p{font-size:12px;line-height:1.6;color:var(--dg-muted);margin:0 0 10px}.dg-group-list{display:flex;flex-direction:column;gap:8px}.dg-group{border:1px solid var(--dg-border);border-radius:9px;background:var(--dg-panel);overflow:hidden}.dg-group-head{width:100%;display:flex;align-items:center;gap:9px;border:0;background:var(--dg-soft);text-align:left;padding:10px 12px;font-weight:700;font-size:12px}.dg-group-head:hover{color:var(--dg-accent)}.dg-group-summary{font-weight:400;color:var(--dg-muted);margin-left:auto}.dg-group-body{padding:8px 11px}.dg-group-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;padding:7px 2px;border-bottom:1px solid var(--dg-grid);font-size:12px}.dg-group-item:last-child{border-bottom:0}.dg-board{display:grid;grid-template-columns:repeat(3,minmax(170px,1fr));gap:9px;margin-top:12px;overflow:auto}.dg-lane{border:1px solid var(--dg-border);border-radius:9px;background:var(--dg-soft);min-height:100px;padding:9px}.dg-lane h3{font-size:12px;margin:0 0 8px}.dg-card{border:1px solid var(--dg-border);border-radius:7px;background:var(--dg-panel);padding:8px;margin:0 0 7px;font-size:12px}.dg-card strong{display:block;margin-bottom:5px}.dg-dual{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.dg-dual h3{font-size:13px;margin:0 0 7px}.dg-dual-zone{min-width:0;border:1px dashed var(--dg-border);border-radius:8px;padding:10px;background:var(--dg-soft)}.dg-dual-row{display:flex;justify-content:space-between;gap:8px;align-items:center;background:var(--dg-panel);border:1px solid var(--dg-border);border-radius:7px;padding:8px;margin-top:7px;font-size:12px}.dg-virtual-spacer td{padding:0!important;border:0!important}.dg-no-wrap{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dg-mobile-caption{display:none}.dg-sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:760px){.dg-head{padding:14px}.dg-body{padding:10px}.dg-title{font-size:18px}.dg-search{min-width:100%;flex-basis:100%}.dg-toolbar-end{margin-left:0}.dg-split{grid-template-columns:1fr}.dg-detail{grid-template-columns:repeat(2,minmax(0,1fr))}.dg-dual{grid-template-columns:1fr}.dg-board{grid-template-columns:repeat(3,minmax(190px,1fr))}.dg-mobile-caption{display:block;color:var(--dg-muted);font-size:11px;margin:0 0 6px}}
@media(prefers-reduced-motion:reduce){.klic-planned-grid *{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
`;

export interface PlannedDataGridPreviewBlockProps {
  variant: string;
  density?: 'compact' | 'normal' | 'relaxed';
}

export function PlannedDataGridPreviewBlock({ variant, density = 'normal' }: PlannedDataGridPreviewBlockProps) {
  const meta = VARIANTS[variant] ?? { title: '데이터 그리드', category: '로컬 미리보기', description: '정렬·필터가 가능한 로컬 샘플 표입니다.' };
  const virtual = VIRTUAL_VARIANTS.has(variant);
  const grouped = GROUP_VARIANTS.has(variant);
  const selectable = SELECTION_VARIANTS.has(variant);
  const hasExpansion = EXPANSION_VARIANTS.has(variant);
  const hasActions = ['inline-row-actions', 'row-reorder-handle', 'hierarchy-tree-reorder', 'detail-panel-row', 'lazy-child-loader', 'nested-subgrids'].includes(variant);
  const [dataState, setDataState] = useState(() => ({ variant, rows: createRows(variant) }));
  const [uiState, setUiState] = useState<UiState>(() => createUiState(variant));
  const [historyState, setHistoryState] = useState<{ variant: string; past: GridRow[][]; future: GridRow[][] }>(() => ({ variant, past: [], future: [] }));
  const resizeStart = useRef<{ key: ColumnKey; x: number; width: number } | null>(null);
  const virtualScrollRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const downloadUrlRef = useRef<string | null>(null);
  const downloadCleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedColumnRef = useRef<ColumnKey | null>(null);

  const rows = dataState.variant === variant ? dataState.rows : createRows(variant);
  const ui = uiState.variant === variant ? uiState : createUiState(variant);
  const history = historyState.variant === variant ? historyState : { variant, past: [], future: [] };
  const patchUi = (patch: Partial<UiState>) => {
    setUiState((previous) => ({ ...(previous.variant === variant ? previous : createUiState(variant)), ...patch, variant }));
  };
  const updateRows = (updater: (current: GridRow[]) => GridRow[]) => {
    const next = updater(rows);
    setDataState({ variant, rows: next });
    setHistoryState((previous) => {
      const current = previous.variant === variant ? previous : { variant, past: [], future: [] };
      return { variant, past: [...current.past.slice(-19), cloneRows(rows)], future: [] };
    });
  };

  useEffect(() => {
    setDataState({ variant, rows: createRows(variant) });
    setUiState(createUiState(variant));
    setHistoryState({ variant, past: [], future: [] });
  }, [variant]);

  useEffect(() => {
    if (!ui.simulating || !virtual) return;
    const timer = setInterval(() => {
      setUiState((previous) => {
        if (previous.variant !== variant || !previous.simulating) return previous;
        return { ...previous, tick: previous.tick + 1 };
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [ui.simulating, variant, virtual]);

  useEffect(() => {
    if (virtualScrollRef.current) virtualScrollRef.current.scrollTop = 0;
  }, [variant, ui.query, ui.filters.group, ui.filters.status, ui.filters.priority]);

  useEffect(() => () => {
    if (downloadCleanupRef.current) clearTimeout(downloadCleanupRef.current);
    if (downloadUrlRef.current && typeof URL !== 'undefined') URL.revokeObjectURL(downloadUrlRef.current);
  }, []);

  const sourceRows = useMemo(() => {
    if (!virtual) return rows;
    const source = rows.length > 0 ? rows : createRows(variant);
    return Array.from({ length: 360 }, (_, index) => {
      const base = source[index % source.length];
      const ordinal = index + 1;
      const tickDelta = ui.tick % 4;
      return {
        ...base,
        id: `sample-${variant}-${ordinal}`,
        title: `${base.title} · ${String(ordinal).padStart(3, '0')}`,
        quantity: base.quantity + (tickDelta && ordinal % 12 === 0 ? tickDelta : 0),
        updated: `${String(8 + Math.floor(ordinal / 60)).padStart(2, '0')}:${String((ordinal * 7) % 60).padStart(2, '0')}`,
        description: `${base.description} 합성 행 ${ordinal}.`,
      };
    });
  }, [rows, variant, virtual, ui.tick]);

  const filteredRows = useMemo(() => {
    const needle = ui.query.trim().toLocaleLowerCase();
    const matches = sourceRows.filter((row) => {
      const haystack = [row.title, row.group, row.owner, row.status, row.priority, row.description].join(' ').toLocaleLowerCase();
      return (!needle || haystack.includes(needle))
        && (ui.filters.group === 'all' || row.group === ui.filters.group)
        && (ui.filters.status === 'all' || row.status === ui.filters.status)
        && (ui.filters.priority === 'all' || row.priority === ui.filters.priority);
    });
    if (!ui.sort) return matches;
    const { key, direction } = ui.sort;
    return [...matches].sort((a, b) => {
      const left = rowValue(a, key);
      const right = rowValue(b, key);
      const order = typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), 'ko');
      return direction === 'asc' ? order : -order;
    });
  }, [sourceRows, ui.query, ui.filters, ui.sort]);

  const selectedRows = sourceRows.filter((row) => ui.selectedIds.includes(row.id));
  const selectedVisibleCount = filteredRows.filter((row) => ui.selectedIds.includes(row.id)).length;
  const uniqueGroups = [...new Set(sourceRows.map((row) => row.group))];
  const activeColumns = ui.columns.filter((key) => !ui.hiddenColumns.includes(key));
  const columns = activeColumns.length > 0 ? activeColumns : ui.columns;
  const isFormula = variant === 'cell-formula-eval';
  const isMultiHeader = variant === 'multi-level-headers';
  const isHierarchy = variant === 'hierarchy-tree-reorder';
  const isGroupOrder = variant === 'studio-delivery';
  const hasSelectionColumn = selectable;
  const hasActionColumn = hasActions || isHierarchy;
  const extraColumnCount = (hasSelectionColumn ? 1 : 0) + (hasActionColumn ? 1 : 0);
  const tableMinWidth = Math.max(680, columns.reduce((sum, key) => sum + (ui.widths[key] ?? (key === 'title' ? 250 : 130)), 0) + extraColumnCount * 42);
  const filteredTotal = filteredRows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);
  const groups = useMemo(() => {
    const byGroup = new Map<string, GridRow[]>();
    for (const row of filteredRows) {
      const key = variant === 'editorial-pipeline' ? row.status : row.group;
      byGroup.set(key, [...(byGroup.get(key) ?? []), row]);
    }
    const keys = [...byGroup.keys()];
    const ordered = [...ui.groupOrder.filter((key) => keys.includes(key)), ...keys.filter((key) => !ui.groupOrder.includes(key))];
    return ordered.map((key) => ({ key, rows: byGroup.get(key) ?? [] }));
  }, [filteredRows, variant, ui.groupOrder]);

  const virtualRowHeight = 44;
  const virtualWindowCount = 16;
  const maxVirtualStart = Math.max(0, filteredRows.length - virtualWindowCount);
  const virtualStart = virtual ? Math.min(maxVirtualStart, Math.max(0, Math.floor(ui.scrollTop / virtualRowHeight) - 2)) : 0;
  const virtualEnd = virtual ? Math.min(filteredRows.length, virtualStart + virtualWindowCount) : filteredRows.length;
  const visibleRows = virtual ? filteredRows.slice(virtualStart, virtualEnd) : filteredRows;
  const rowEntries = useMemo(() => {
    if (!isHierarchy) return visibleRows.map((row) => ({ row, depth: 0 }));
    const visibleIds = new Set(visibleRows.map((row) => row.id));
    const ordered: { row: GridRow; depth: number }[] = [];
    const visit = (parentId: string | undefined, depth: number) => {
      for (const row of visibleRows) {
        if (row.parentId === parentId && visibleIds.has(row.id)) {
          ordered.push({ row, depth });
          visit(row.id, depth + 1);
        }
      }
    };
    visit(undefined, 0);
    return ordered;
  }, [visibleRows, isHierarchy]);

  const focusRow = (id: string) => {
    patchUi({ focusedId: id, detailId: variant === 'master-detail-split' ? id : ui.detailId });
    rowRefs.current[id]?.focus();
  };
  const toggleSelected = (id: string) => patchUi({
    selectedIds: ui.selectedIds.includes(id) ? ui.selectedIds.filter((selected) => selected !== id) : [...ui.selectedIds, id],
    detailId: variant === 'master-detail-split' ? id : ui.detailId,
  });
  const selectVisible = () => {
    const allVisibleSelected = filteredRows.length > 0 && filteredRows.every((row) => ui.selectedIds.includes(row.id));
    patchUi({ selectedIds: allVisibleSelected ? ui.selectedIds.filter((id) => !filteredRows.some((row) => row.id === id)) : [...new Set([...ui.selectedIds, ...filteredRows.map((row) => row.id)])] });
  };
  const toggleExpanded = (id: string) => patchUi({ expandedIds: ui.expandedIds.includes(id) ? ui.expandedIds.filter((value) => value !== id) : [...ui.expandedIds, id] });
  const changeSort = (key: ColumnKey) => patchUi({ sort: ui.sort?.key === key ? { key, direction: ui.sort.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' } });
  const moveColumn = (key: ColumnKey, delta: number) => {
    const index = ui.columns.indexOf(key);
    patchUi({ columns: moveValue(ui.columns, index, delta) });
  };
  const moveRow = (id: string, delta: number) => updateRows((current) => {
    const index = current.findIndex((row) => row.id === id);
    return moveValue(current, index, delta);
  });
  const moveToLane = (id: string, lane: GridRow['lane']) => updateRows((current) => current.map((row) => row.id === id ? { ...row, lane } : row));
  const moveToStatus = (id: string, status: Status) => updateRows((current) => current.map((row) => row.id === id ? { ...row, status } : row));
  const updateField = <K extends keyof GridRow>(id: string, key: K, value: GridRow[K]) => updateRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  const reorderColumnTo = (source: ColumnKey, target: ColumnKey) => {
    if (source === target) return;
    const next = [...ui.columns];
    const from = next.indexOf(source);
    const to = next.indexOf(target);
    if (from < 0 || to < 0) return;
    next.splice(from, 1);
    next.splice(to, 0, source);
    patchUi({ columns: next });
  };
  const resizeColumn = (key: ColumnKey, width: number) => patchUi({ widths: { ...ui.widths, [key]: Math.max(100, Math.min(420, Math.round(width))) } });
  const setFilter = (key: keyof Filters, value: string) => patchUi({ filters: { ...ui.filters, [key]: value }, scrollTop: 0 });
  const clearFilters = () => patchUi({ query: '', filters: { group: 'all', status: 'all', priority: 'all' }, scrollTop: 0 });

  const undo = () => {
    if (history.past.length === 0) return;
    const previousRows = history.past[history.past.length - 1];
    setDataState({ variant, rows: cloneRows(previousRows) });
    setHistoryState({ variant, past: history.past.slice(0, -1), future: [cloneRows(rows), ...history.future] });
  };
  const redo = () => {
    if (history.future.length === 0) return;
    const nextRows = history.future[0];
    setDataState({ variant, rows: cloneRows(nextRows) });
    setHistoryState({ variant, past: [...history.past, cloneRows(rows)].slice(-20), future: history.future.slice(1) });
  };

  const exportCsv = () => {
    const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const lines = [
      columns.map((key) => csvCell(COLUMN_LABELS[key])).join(','),
      ...filteredRows.map((row) => columns.map((key) => csvCell(rowValue(row, key))).join(',')),
    ];
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    if (downloadCleanupRef.current) clearTimeout(downloadCleanupRef.current);
    if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    const url = URL.createObjectURL(blob);
    downloadUrlRef.current = url;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `klic-data-grid-${variant}.csv`;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    downloadCleanupRef.current = setTimeout(() => {
      URL.revokeObjectURL(url);
      if (downloadUrlRef.current === url) downloadUrlRef.current = null;
      downloadCleanupRef.current = null;
    }, 1500);
  };

  const resizeKeyboard = (event: React.KeyboardEvent<HTMLSpanElement>, key: ColumnKey) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    resizeColumn(key, (ui.widths[key] ?? (key === 'title' ? 250 : 130)) + (event.key === 'ArrowRight' ? 12 : -12));
  };
  const resizePointerDown = (event: React.PointerEvent<HTMLSpanElement>, key: ColumnKey) => {
    const width = ui.widths[key] ?? (key === 'title' ? 250 : 130);
    resizeStart.current = { key, x: event.clientX, width };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const resizePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!resizeStart.current) return;
    resizeColumn(resizeStart.current.key, resizeStart.current.width + event.clientX - resizeStart.current.x);
  };
  const resizePointerEnd = () => { resizeStart.current = null; };

  const columnsForRender = columns;
  const renderStatus = (status: Status) => <span className={`dg-status${status === '주의' ? ' dg-status-warning' : ''}`}>{status === '주의' ? '⚠ ' : ''}{status}</span>;
  const renderCell = (row: GridRow, key: ColumnKey, depth: number) => {
    if (key === 'title') {
      return <div className="dg-cell-title" style={isHierarchy ? { paddingLeft: depth * 16 } : undefined}>
        <button type="button" className="dg-title-link" onClick={() => focusRow(row.id)} aria-label={`${row.title} 행에 포커스`}>
          {isHierarchy && depth > 0 ? '↳ ' : ''}{row.title}
        </button>
      </div>;
    }
    if (key === 'status') {
      if (variant === 'inline-row-actions') return <select className="dg-select" aria-label={`${row.title} 상태`} value={row.status} onChange={(event) => updateField(row.id, 'status', event.target.value as Status)}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select>;
      return renderStatus(row.status);
    }
    if (key === 'quantity' && isFormula) return <input className="dg-input" type="number" min={0} max={999} aria-label={`${row.title} 수량`} value={row.quantity} onChange={(event) => updateField(row.id, 'quantity', Math.max(0, Number(event.target.value) || 0))} style={{ width: 86 }} />;
    if (key === 'unitPrice' && isFormula) return <input className="dg-input" type="number" min={0} max={9999999} aria-label={`${row.title} 단가`} value={row.unitPrice} onChange={(event) => updateField(row.id, 'unitPrice', Math.max(0, Number(event.target.value) || 0))} style={{ width: 120 }} />;
    if (key === 'total') return <span className="dg-no-wrap">₩{formatMoney(row.quantity * row.unitPrice)}</span>;
    if (key === 'quantity') return row.quantity;
    if (key === 'unitPrice') return `₩${formatMoney(row.unitPrice)}`;
    const value = rowValue(row, key);
    if (typeof value === 'string' && ui.query.trim() && value.toLocaleLowerCase().includes(ui.query.trim().toLocaleLowerCase())) return <mark>{value}</mark>;
    return value;
  };

  const renderExtraRow = (row: GridRow) => {
    const expanded = ui.expandedIds.includes(row.id);
    if (!expanded) return null;
    const childNames = [`${row.title} · 세부 항목 A`, `${row.title} · 세부 항목 B`];
    const cellCount = columnsForRender.length + extraColumnCount;
    if (variant === 'detail-panel-row') return <tr key={`${row.id}-detail`}><td colSpan={cellCount}><dl className="dg-detail"><div><dt>상세 설명</dt><dd>{row.description}</dd></div><div><dt>담당자</dt><dd>{row.owner}</dd></div><div><dt>예상 합계</dt><dd>₩{formatMoney(row.quantity * row.unitPrice)}</dd></div></dl></td></tr>;
    if (variant === 'nested-subgrids' || variant === 'lazy-child-loader') return <tr key={`${row.id}-children`}><td colSpan={cellCount}>
      <div className="dg-panel" style={{ margin: 0 }}>
        <strong className="dg-panel-title">{variant === 'lazy-child-loader' ? '로컬 하위 샘플' : '하위 그리드'} · {childNames.length}개</strong>
        <table className="dg-child-table"><caption className="dg-sr-only">{row.title}의 하위 샘플 항목</caption><thead><tr><th scope="col">항목</th><th scope="col">상태</th><th scope="col">담당</th></tr></thead><tbody>{childNames.map((name, index) => <tr key={name}><td>{name}</td><td>{index === 0 ? '진행' : '대기'}</td><td>{index === 0 ? row.owner : '최유나'}</td></tr>)}</tbody></table>
        {variant === 'lazy-child-loader' && <p className="dg-hint">미리 정의된 합성 데이터입니다. 외부 API 요청은 발생하지 않습니다.</p>}
      </div>
    </td></tr>;
    return null;
  };

  const renderRowActions = (row: GridRow, index: number) => {
    if (variant === 'inline-row-actions') return <div className="dg-inline"><button type="button" className="dg-button dg-button-small" onClick={() => updateField(row.id, 'status', STATUSES[(STATUSES.indexOf(row.status) + 1) % STATUSES.length])}>다음 상태</button><button type="button" className="dg-button dg-button-small" onClick={() => updateRows((current) => current.filter((item) => item.id !== row.id))}>행 제거</button></div>;
    if (variant === 'row-reorder-handle') return <div className="dg-inline"><button type="button" className="dg-button dg-button-small" aria-label={`${row.title} 위로`} onClick={() => moveRow(row.id, -1)}>↑</button><button type="button" className="dg-button dg-button-small" aria-label={`${row.title} 아래로`} onClick={() => moveRow(row.id, 1)}>↓</button></div>;
    if (variant === 'hierarchy-tree-reorder') {
      const parent = row.parentId ? rows.find((item) => item.id === row.parentId) : undefined;
      const previous = rows[Math.max(0, rows.findIndex((item) => item.id === row.id) - 1)];
      return <div className="dg-inline"><button type="button" className="dg-button dg-button-small" disabled={!previous || previous.id === row.id} onClick={() => updateField(row.id, 'parentId', previous?.id)}>들여쓰기</button><button type="button" className="dg-button dg-button-small" disabled={!parent} onClick={() => updateField(row.id, 'parentId', parent?.parentId)}>내어쓰기</button><button type="button" className="dg-button dg-button-small" aria-label={`${row.title} 위로`} onClick={() => moveRow(row.id, -1)}>↑</button><button type="button" className="dg-button dg-button-small" aria-label={`${row.title} 아래로`} onClick={() => moveRow(row.id, 1)}>↓</button></div>;
    }
    if (hasExpansion) return <button type="button" className="dg-button dg-button-small" aria-expanded={ui.expandedIds.includes(row.id)} onClick={() => toggleExpanded(row.id)}>{ui.expandedIds.includes(row.id) ? '상세 닫기' : variant === 'detail-panel-row' ? '상세 열기' : '하위 보기'}</button>;
    return <span className="dg-note">{index + 1}</span>;
  };

  const renderDataRow = (row: GridRow, depth: number, index: number) => {
    const selected = ui.selectedIds.includes(row.id);
    const pinnedStyle = (key: ColumnKey, header = false): React.CSSProperties => ui.pin?.key === key ? {
      position: 'sticky',
      left: ui.pin.side === 'left' ? 0 : undefined,
      right: ui.pin.side === 'right' ? 0 : undefined,
      zIndex: header ? 6 : 2,
      background: 'var(--klic-semantic-color-panel,#fff)',
    } : {};
    return <React.Fragment key={row.id}>
      <tr
        ref={(element) => { rowRefs.current[row.id] = element; }}
        tabIndex={-1}
        aria-selected={selected}
        draggable={variant === 'row-reorder-handle' || variant === 'kanban-interchange' || variant === 'cross-table-dnd'}
        onDragStart={variant === 'row-reorder-handle' ? (event) => event.dataTransfer.setData('text/plain', row.id) : undefined}
        onDragOver={variant === 'row-reorder-handle' ? (event) => event.preventDefault() : undefined}
        onDrop={variant === 'row-reorder-handle' ? (event) => { event.preventDefault(); const source = event.dataTransfer.getData('text/plain'); if (!source || source === row.id) return; updateRows((current) => { const from = current.findIndex((item) => item.id === source); const to = current.findIndex((item) => item.id === row.id); if (from < 0 || to < 0) return current; const next = [...current]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; }); } : undefined}
        className={`${selected ? 'dg-row-selected ' : ''}${ui.focusedId === row.id ? 'dg-row-focused ' : ''}${variant === 'bordered-table' ? 'dg-bordered-row' : ''}`}
        style={virtual ? { height: virtualRowHeight } : undefined}
      >
        {hasSelectionColumn && <td className="dg-checkbox-cell"><input type="checkbox" checked={selected} aria-label={`${row.title} 선택`} onChange={() => toggleSelected(row.id)} /></td>}
        {columnsForRender.map((key) => <td key={key} style={{ width: ui.widths[key] ?? (key === 'title' ? 250 : undefined), minWidth: ui.widths[key] ?? (key === 'title' ? 210 : 100), ...pinnedStyle(key) }} className={variant === 'dynamic-height-cells' ? 'dg-description-cell' : undefined}>
          {key === 'title' && variant === 'nested-subgrids' && <button type="button" className="dg-button dg-button-small" aria-label={`${row.title} 하위 항목 ${ui.expandedIds.includes(row.id) ? '닫기' : '열기'}`} aria-expanded={ui.expandedIds.includes(row.id)} onClick={() => toggleExpanded(row.id)}>{ui.expandedIds.includes(row.id) ? '−' : '+'}</button>}
          {variant === 'dynamic-height-cells' && key === 'title' ? <div><div>{renderCell(row, key, depth)}</div><div className="dg-description-cell-text dg-note">{row.description}</div></div> : renderCell(row, key, depth)}
          {variant === 'lazy-child-loader' && key === 'title' && <button type="button" className="dg-button dg-button-small" style={{ marginLeft: 6 }} aria-expanded={ui.expandedIds.includes(row.id)} onClick={() => toggleExpanded(row.id)}>{ui.expandedIds.includes(row.id) ? '자식 닫기' : '자식 보기'}</button>}
        </td>)}
        {hasActionColumn && <td style={{ width: variant === 'hierarchy-tree-reorder' ? 255 : 170, minWidth: variant === 'hierarchy-tree-reorder' ? 255 : 170 }}>{renderRowActions(row, index)}</td>}
      </tr>
      {renderExtraRow(row)}
    </React.Fragment>;
  };

  const renderTable = (rowsToRender = rowEntries, includeVirtualSpacers = virtual) => {
    const allSelected = filteredRows.length > 0 && filteredRows.every((row) => ui.selectedIds.includes(row.id));
    const virtualBefore = includeVirtualSpacers ? virtualStart * virtualRowHeight : 0;
    const virtualAfter = includeVirtualSpacers ? Math.max(0, filteredRows.length - virtualEnd) * virtualRowHeight : 0;
    return <div ref={virtual ? virtualScrollRef : undefined} className={`dg-scroll${variant === 'fixed-header' ? ' dg-scroll-fixed' : ''}${virtual ? ' dg-scroll-virtual' : ''}`} onScroll={virtual ? (event) => patchUi({ scrollTop: event.currentTarget.scrollTop }) : undefined}>
      <table className={`dg-table${variant === 'bordered-table' ? ' dg-bordered' : ''}${variant === 'dynamic-height-cells' && ui.query === '' ? ' dg-clamp' : ''}`} style={{ minWidth: tableMinWidth }}>
        <caption className="dg-sr-only">{meta.title} · 로컬 합성 샘플</caption>
        <thead>
          {isMultiHeader && <tr>{hasSelectionColumn && <th className="dg-checkbox-cell" rowSpan={2}><span className="dg-sr-only">행 선택</span></th>}<th scope="colgroup" colSpan={Math.min(3, columnsForRender.length)}>작업과 담당</th><th scope="colgroup" colSpan={Math.max(1, columnsForRender.length - 3)}>진행과 비용</th>{hasActionColumn && <th rowSpan={2}>행 작업</th>}</tr>}
          <tr>
            {hasSelectionColumn && !isMultiHeader && <th scope="col" className="dg-checkbox-cell"><input type="checkbox" aria-label="필터 결과 전체 선택" checked={allSelected} onChange={selectVisible} /></th>}
            {columnsForRender.map((key) => <th key={key} scope="col" aria-sort={ui.sort?.key === key ? (ui.sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className={variant === 'fixed-header' || virtual ? 'dg-sticky' : undefined} draggable={variant === 'column-reordering'} onDragStart={variant === 'column-reordering' ? () => { draggedColumnRef.current = key; } : undefined} onDragOver={variant === 'column-reordering' ? (event) => event.preventDefault() : undefined} onDrop={variant === 'column-reordering' ? (event) => { event.preventDefault(); if (draggedColumnRef.current) reorderColumnTo(draggedColumnRef.current, key); draggedColumnRef.current = null; } : undefined} style={{ width: ui.widths[key] ?? (key === 'title' ? 250 : undefined), minWidth: ui.widths[key] ?? (key === 'title' ? 210 : 100), ...(ui.pin?.key === key ? { position: 'sticky' as const, left: ui.pin.side === 'left' ? 0 : undefined, right: ui.pin.side === 'right' ? 0 : undefined, zIndex: 7, background: 'var(--klic-ui-soft,#f5f7fb)' } : {}) }}>
              <button type="button" className="dg-th-button" onClick={() => changeSort(key)}>{COLUMN_LABELS[key]}<span className="dg-sort">{ui.sort?.key === key ? (ui.sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span></button>
              {variant === 'resizable-headers' && <span role="separator" aria-orientation="vertical" aria-label={`${COLUMN_LABELS[key]} 너비 조절`} aria-valuemin={100} aria-valuemax={420} aria-valuenow={ui.widths[key] ?? (key === 'title' ? 250 : 130)} tabIndex={0} className="dg-resize" onPointerDown={(event) => resizePointerDown(event, key)} onPointerMove={resizePointerMove} onPointerUp={resizePointerEnd} onPointerCancel={resizePointerEnd} onKeyDown={(event) => resizeKeyboard(event, key)} />}
            </th>)}
            {hasActionColumn && !isMultiHeader && <th scope="col">행 작업</th>}
          </tr>
        </thead>
        <tbody>
          {ui.skeletonMode && variant === 'loading-skeletons' ? Array.from({ length: 5 }, (_, index) => <tr className="dg-skeleton-row" key={`skeleton-${index}`} aria-hidden="true">{Array.from({ length: columnsForRender.length + extraColumnCount }, (_, cell) => <td key={cell}><div className="dg-skeleton" /></td>)}</tr>) : filteredRows.length === 0 ? <tr><td colSpan={columnsForRender.length + extraColumnCount}><div className="dg-empty"><strong>조건에 맞는 행이 없습니다</strong><span>검색어 또는 필터를 지우면 로컬 샘플 행이 다시 표시됩니다.</span></div></td></tr> : <>
            {virtualBefore > 0 && <tr className="dg-virtual-spacer" aria-hidden="true"><td colSpan={columnsForRender.length + extraColumnCount} style={{ height: virtualBefore }} /></tr>}
            {rowsToRender.map(({ row, depth }, index) => renderDataRow(row, depth, index))}
            {virtualAfter > 0 && <tr className="dg-virtual-spacer" aria-hidden="true"><td colSpan={columnsForRender.length + extraColumnCount} style={{ height: virtualAfter }} /></tr>}
          </>}
          {isFormula && filteredRows.length > 0 && <tr className="dg-total-row"><td colSpan={Math.max(1, columnsForRender.length - 1) + extraColumnCount}>표시 행 합계 · 수량 × 단가</td><td>₩{formatMoney(filteredTotal)}</td></tr>}
        </tbody>
      </table>
    </div>;
  };

  const renderGrouped = () => <div className="dg-group-list">
    {groups.length === 0 ? <div className="dg-empty"><strong>그룹에 표시할 행이 없습니다</strong><span>현재 필터 조건을 조정하세요.</span></div> : groups.map(({ key, rows: groupRows }, index) => {
      const open = ui.groupExpanded.includes(key);
      const total = groupRows.reduce((sum, row) => sum + row.quantity * row.unitPrice, 0);
      return <section className="dg-group" key={key}>
        <button type="button" className="dg-group-head" aria-expanded={open} onClick={() => patchUi({ groupExpanded: open ? ui.groupExpanded.filter((item) => item !== key) : [...ui.groupExpanded, key] })}>
          <span aria-hidden="true">{open ? '⌄' : '›'}</span><span>{key}</span><span className="dg-group-summary">{groupRows.length}행 · ₩{formatMoney(total)}</span>
          {isGroupOrder && <span className="dg-inline" onClick={(event) => event.stopPropagation()}><button type="button" className="dg-button dg-button-small" aria-label={`${key} 그룹 위로`} onClick={() => patchUi({ groupOrder: moveValue(groups.map((group) => group.key), index, -1) })}>↑</button><button type="button" className="dg-button dg-button-small" aria-label={`${key} 그룹 아래로`} onClick={() => patchUi({ groupOrder: moveValue(groups.map((group) => group.key), index, 1) })}>↓</button></span>}
        </button>
        {open && <div className="dg-group-body">{groupRows.map((row) => <div className="dg-group-item" key={row.id}><button type="button" className="dg-title-link" onClick={() => focusRow(row.id)}>{row.title}</button>{renderStatus(row.status)}<span>₩{formatMoney(row.quantity * row.unitPrice)}</span></div>)}</div>}
      </section>;
    })}
  </div>;

  const renderCrossTables = () => {
    const lanes: GridRow['lane'][] = ['대기함', '선택함'];
    return <div className="dg-dual">{lanes.map((lane) => {
      const laneRows = filteredRows.filter((row) => row.lane === lane);
      const target = lane === '대기함' ? '선택함' : '대기함';
      return <section key={lane} className="dg-dual-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) moveToLane(id, lane); }}>
        <h3>{lane} <span className="dg-count">· {laneRows.length}행</span></h3>
        <p className="dg-hint">행을 이 영역으로 끌거나 이동 버튼을 누르세요.</p>
        {laneRows.map((row) => <div className="dg-dual-row" key={row.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', row.id)}><span><strong>{row.title}</strong><br /><span className="dg-note">{row.owner} · {row.group}</span></span><button type="button" className="dg-button dg-button-small" onClick={() => moveToLane(row.id, target)}>{target}로</button></div>)}
      </section>;
    })}</div>;
  };

  const renderKanban = () => <div className="dg-board" aria-label="상태별 칸반 열">{(['대기', '진행', '검토'] as Status[]).map((status) => {
    const cards = filteredRows.filter((row) => row.status === status);
    return <section key={status} className="dg-lane" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData('text/plain'); if (id) moveToStatus(id, status); }}>
      <h3>{status} <span className="dg-count">· {cards.length}</span></h3>
      {cards.map((row) => <article className="dg-card" key={row.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', row.id)}><strong>{row.title}</strong><span className="dg-note">{row.owner} · {row.group}</span><div className="dg-inline" style={{ marginTop: 7 }}>{(['대기', '진행', '검토'] as Status[]).filter((target) => target !== status).map((target) => <button type="button" key={target} className="dg-button dg-button-small" onClick={() => moveToStatus(row.id, target)}>{target}로</button>)}</div></article>)}
    </section>;
  })}</div>;

  const detailRow = ui.detailId ? sourceRows.find((row) => row.id === ui.detailId) : selectedRows[0];
  const noResults = filteredRows.length === 0;
  const showActiveFilterTags = variant === 'faceted-filter-grid';
  const styleDensity = density === 'compact' ? 'dg-compact' : density === 'relaxed' ? 'dg-relaxed' : 'dg-normal';

  return <section className={`klic-planned-grid ${styleDensity}${variant === 'bordered-table' ? ' dg-bordered' : ''}`}>
    <style>{styles}</style>
    <header className="dg-head">
      <div className="dg-kicker">{meta.category} · KLIC block preview</div>
      <h2 className="dg-title">{meta.title}</h2>
      <p className="dg-description">{meta.description}</p>
      <div className="dg-meta"><span className="dg-pill dg-pill-blue">로컬 상호작용</span><span className="dg-pill">합성 샘플 데이터</span>{virtual && <span className="dg-pill">360행 고정 데모 · 벤치마크 아님</span>}</div>
    </header>
    <div className="dg-body">
      <div className="dg-toolbar">
        <div className="dg-control dg-search"><label htmlFor={`dg-search-${variant}`}>검색</label><input id={`dg-search-${variant}`} className="dg-input" type="search" value={ui.query} placeholder="항목, 그룹, 담당자 검색" onChange={(event) => patchUi({ query: event.target.value, scrollTop: 0 })} /></div>
        <div className="dg-control"><label htmlFor={`dg-group-${variant}`}>그룹 필터</label><select id={`dg-group-${variant}`} className="dg-select" value={ui.filters.group} onChange={(event) => setFilter('group', event.target.value)}><option value="all">모든 그룹</option>{uniqueGroups.map((group) => <option key={group} value={group}>{group}</option>)}</select></div>
        <div className="dg-control"><label htmlFor={`dg-status-${variant}`}>상태 필터</label><select id={`dg-status-${variant}`} className="dg-select" value={ui.filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="all">모든 상태</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="dg-control"><label htmlFor={`dg-priority-${variant}`}>우선순위</label><select id={`dg-priority-${variant}`} className="dg-select" value={ui.filters.priority} onChange={(event) => setFilter('priority', event.target.value)}><option value="all">모든 우선순위</option>{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select></div>
        <button type="button" className="dg-button" onClick={clearFilters}>필터 초기화</button>
        <div className="dg-toolbar-end">
          <span className="dg-count">{filteredRows.length} / {sourceRows.length}행</span>
          {selectable && <span className="dg-count" aria-live="polite">선택 {selectedVisibleCount}행{selectedRows.length > selectedVisibleCount ? ` · 전체 ${selectedRows.length}행` : ''}</span>}
          {variant === 'export-csv-excel' && <button type="button" className="dg-button dg-button-primary" onClick={exportCsv}>CSV 다운로드</button>}
          {variant === 'loading-skeletons' && <button type="button" className="dg-button" aria-pressed={ui.skeletonMode} onClick={() => patchUi({ skeletonMode: !ui.skeletonMode })}>{ui.skeletonMode ? '표 데이터 보기' : '스켈레톤 보기'}</button>}
          {virtual && <><button type="button" className={`dg-button${ui.simulating ? ' dg-button-primary' : ''}`} aria-pressed={ui.simulating} onClick={() => patchUi({ simulating: !ui.simulating })}>{ui.simulating ? '시뮬레이션 일시정지' : '샘플 시뮬레이션 시작'}</button><span className="dg-count" aria-live="polite">합성 갱신 {ui.tick}회</span></>}
          {variant === 'dynamic-height-cells' && <button type="button" className="dg-button" aria-pressed={ui.query === ''} onClick={() => patchUi({ query: ui.query ? '' : '__show_full_text__' })}>{ui.query ? '전체 설명 보기' : '한 줄 요약 보기'}</button>}
        </div>
      </div>
      {showActiveFilterTags && <div className="dg-filter-tags" aria-live="polite"><span className="dg-filter-tag">검색: {ui.query || '없음'}</span><span className="dg-filter-tag">그룹: {ui.filters.group === 'all' ? '전체' : ui.filters.group}</span><span className="dg-filter-tag">상태: {ui.filters.status === 'all' ? '전체' : ui.filters.status}</span><span className="dg-filter-tag">우선순위: {ui.filters.priority === 'all' ? '전체' : ui.filters.priority}</span></div>}
      {variant === 'loading-skeletons' && ui.skeletonMode && <p className="dg-hint">정적 로딩 상태 예시입니다. 실제 네트워크 요청은 없습니다.</p>}
      {variant === 'empty-states' && noResults && <div className="dg-inline" style={{ marginBottom: 9 }}><span className="dg-note">검색어를 지우면 합성 샘플 행을 다시 볼 수 있습니다.</span><button type="button" className="dg-button dg-button-small" onClick={clearFilters}>샘플 행 표시</button></div>}
      {variant === 'column-visibility' && <div className="dg-panel"><p className="dg-panel-title">표시할 컬럼</p><div className="dg-columns">{ui.columns.map((key) => <label className="dg-check" key={key}><input type="checkbox" checked={!ui.hiddenColumns.includes(key)} onChange={() => patchUi({ hiddenColumns: ui.hiddenColumns.includes(key) ? ui.hiddenColumns.filter((item) => item !== key) : [...ui.hiddenColumns, key] })} />{COLUMN_LABELS[key]}</label>)}</div></div>}
      {variant === 'column-reordering' && <div className="dg-panel"><p className="dg-panel-title">컬럼 순서 · 헤더를 끌거나 버튼 사용</p><div className="dg-column-tools">{ui.columns.map((key, index) => <div className="dg-column-row" key={key}><span>{index + 1}. {COLUMN_LABELS[key]}</span><button type="button" className="dg-button dg-button-small" aria-label={`${COLUMN_LABELS[key]} 앞으로`} disabled={index === 0} onClick={() => moveColumn(key, -1)}>←</button><button type="button" className="dg-button dg-button-small" aria-label={`${COLUMN_LABELS[key]} 뒤로`} disabled={index === ui.columns.length - 1} onClick={() => moveColumn(key, 1)}>→</button></div>)}</div></div>}
      {variant === 'column-pinning' && <div className="dg-panel"><p className="dg-panel-title">가로 스크롤 고정 컬럼</p><div className="dg-inline"><label className="dg-label" htmlFor={`dg-pin-key-${variant}`}>컬럼</label><select id={`dg-pin-key-${variant}`} className="dg-select" value={ui.pin?.key ?? 'title'} onChange={(event) => patchUi({ pin: { key: event.target.value as ColumnKey, side: ui.pin?.side ?? 'left' } })}>{ui.columns.map((key) => <option key={key} value={key}>{COLUMN_LABELS[key]}</option>)}</select><label className="dg-label" htmlFor={`dg-pin-side-${variant}`}>위치</label><select id={`dg-pin-side-${variant}`} className="dg-select" value={ui.pin?.side ?? 'left'} onChange={(event) => patchUi({ pin: { key: ui.pin?.key ?? 'title', side: event.target.value as 'left' | 'right' } })}><option value="left">왼쪽</option><option value="right">오른쪽</option></select><button type="button" className="dg-button" onClick={() => patchUi({ pin: ui.pin ? null : { key: 'title', side: 'left' } })}>{ui.pin ? '고정 해제' : '선택 컬럼 고정'}</button></div><p className="dg-hint">가로로 스크롤해 고정 위치를 확인하세요.</p></div>}
      {variant === 'resizable-headers' && <p className="dg-hint" style={{ margin: '-4px 0 9px' }}>헤더 경계를 포인터로 끌거나 경계에 포커스한 뒤 ← / → 키를 누르세요. 너비는 100–420px입니다.</p>}
      {variant === 'auto-fit-columns' && <div className="dg-inline" style={{ marginBottom: 9 }}><button type="button" className="dg-button" onClick={() => { const widths: Partial<Record<ColumnKey, number>> = {}; for (const key of ui.columns) { const maxText = Math.max(COLUMN_LABELS[key].length, ...sourceRows.map((row) => String(rowValue(row, key)).length)); widths[key] = Math.max(110, Math.min(360, maxText * 9 + 28)); } patchUi({ widths }); }}>샘플 내용에 맞추기</button><span className="dg-note">현재 컬럼 너비에 적용됩니다.</span></div>}
      {variant === 'batch-bulk-update' && <div className="dg-panel"><p className="dg-panel-title">선택 행 일괄 상태 변경</p><div className="dg-inline"><select className="dg-select" aria-label="일괄 적용할 상태" value={ui.bulkStatus} onChange={(event) => patchUi({ bulkStatus: event.target.value as Status })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><button type="button" className="dg-button dg-button-primary" disabled={ui.selectedIds.length === 0} onClick={() => updateRows((current) => current.map((row) => ui.selectedIds.includes(row.id) ? { ...row, status: ui.bulkStatus } : row))}>선택 {ui.selectedIds.length}행 적용</button><button type="button" className="dg-button" disabled={ui.selectedIds.length === 0} onClick={() => patchUi({ selectedIds: [] })}>선택 해제</button></div></div>}
      {variant === 'undo-redo-history' && <div className="dg-panel"><p className="dg-panel-title">담당자 이름을 직접 편집한 뒤 이력을 확인하세요.</p><div className="dg-inline"><button type="button" className="dg-button" disabled={history.past.length === 0} onClick={undo}>실행 취소</button><button type="button" className="dg-button" disabled={history.future.length === 0} onClick={redo}>다시 실행</button><span className="dg-count">이전 {history.past.length} · 다음 {history.future.length}</span></div></div>}
      {variant === 'undo-redo-history' && <p className="dg-hint" style={{ margin: '-4px 0 9px' }}>담당자 셀을 편집하면 표의 실제 행이 바뀌고 이력에 저장됩니다.</p>}
      {variant === 'saved-filter-presets' && null}
      {variant === 'renewal-reassignment' && <div className="dg-inline" style={{ marginBottom: 9 }}><span className="dg-note">담당자 변경은 행의 실제 값에 반영됩니다.</span></div>}
      {variant === 'master-detail-split' && <div className="dg-split">{renderTable()}<aside className="dg-detail-panel" aria-live="polite"><h3>선택 항목 상세</h3>{detailRow ? <><p><strong>{detailRow.title}</strong></p><p>{detailRow.description}</p><dl className="dg-detail"><div><dt>그룹</dt><dd>{detailRow.group}</dd></div><div><dt>담당자</dt><dd>{detailRow.owner}</dd></div><div><dt>상태</dt><dd>{detailRow.status}</dd></div></dl></> : <p>행을 선택하면 상세 정보가 표시됩니다.</p>}</aside></div>}
      {variant !== 'master-detail-split' && (grouped ? renderGrouped() : variant === 'cross-table-dnd' ? renderCrossTables() : renderTable())}
      {variant === 'kanban-interchange' && renderKanban()}
      {variant === 'cell-formula-eval' && <p className="dg-hint">계산식 범위: 각 행의 수량 × 단가, 현재 필터 합계. 자유 형식 스프레드시트 수식은 제공하지 않습니다.</p>}
      {virtual && <p className="dg-hint">로컬 합성 데이터 · 360행의 현재 화면 주변만 렌더링합니다. 시뮬레이션은 합성 수치만 변경하며 실제 API·처리량을 나타내지 않습니다.</p>}
      {variant === 'cross-table-dnd' && <p className="dg-hint">테이블 간 이동은 이 컴포넌트 안의 샘플 행에만 적용됩니다.</p>}
      {variant === 'hierarchy-tree-reorder' && <p className="dg-hint">들여쓰기·내어쓰기 및 순서 변경은 로컬 트리 표본에 반영됩니다.</p>}
      {variant === 'dynamic-height-cells' && <p className="dg-hint">설명은 샘플 행의 실제 텍스트입니다. “전체 설명 보기”를 눌러 줄바꿈과 행 높이 변화를 확인하세요.</p>}
      {variant === 'export-csv-excel' && <p className="dg-hint">다운로드 파일은 현재 검색·필터가 적용된 UTF-8 CSV입니다.</p>}
      <footer className="dg-meta" style={{ borderTop: '1px solid var(--klic-semantic-color-border,#dfe5ee)', paddingTop: 10, marginTop: 12 }}><span className="dg-note">모든 표본 데이터는 이 미리보기 안에서 생성된 합성 데이터입니다.</span>{ui.focusedId && <span className="dg-pill dg-pill-blue" aria-live="polite">포커스: {sourceRows.find((row) => row.id === ui.focusedId)?.title ?? '화면 밖 행'}</span>}</footer>
    </div>
  </section>;
}

export default PlannedDataGridPreviewBlock;
