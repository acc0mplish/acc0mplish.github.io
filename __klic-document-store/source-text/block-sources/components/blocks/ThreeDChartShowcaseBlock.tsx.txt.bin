import React, { useState, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Activity,
  Globe,
  BarChart,
  Sliders,
  Eye,
  Check,
  ChevronRight,
  TrendingDown,
  Clock,
  Zap,
} from 'lucide-react';
import { NeonGlass3DCanvas } from './NeonGlass3DCanvas';
import { HourlyVoxel3DCanvas } from './HourlyVoxel3DCanvas';
import { FunnelSlab3DCanvas } from './FunnelSlab3DCanvas';
import {ChartDataTable} from './ChartDataTable';

export type ThreeDChartMode =
  | 'isometric-latency'
  | 'voxel-hourly-density'
  | 'cylinder-donut-stack'
  | 'cluster-topology-bars'
  | 'funnel-slab-cascade'
  | 'all-showcase';

interface ThreeDChartShowcaseBlockProps {
  initialMode?: ThreeDChartMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const MODE_TABS: {
  id: ThreeDChartMode;
  label: string;
  pkg: string;
}[] = [
  {
    id: 'isometric-latency',
    label: '1. 3D 네온 글래스 슬래브 p95 지연율',
    pkg: 'KLIC · 3D 라인',
  },
  {
    id: 'voxel-hourly-density',
    label: '2. 3D 아워리 히트맵 입체 복셀 그리드',
    pkg: 'KLIC · 3D 복셀',
  },
  {
    id: 'cylinder-donut-stack',
    label: '3. 3D 실린더 링 & 티어드 도넛',
    pkg: 'KLIC · 3D 도넛',
  },
  {
    id: 'cluster-topology-bars',
    label: '4. 3D 글로벌 분산 노드 쿼드 기둥',
    pkg: 'KLIC · 3D 리전 기둥',
  },
  {
    id: 'funnel-slab-cascade',
    label: '5. 3D 계단식 슬래브 퍼넬 캐스케이드',
    pkg: 'KLIC · 3D 퍼널',
  },
  {
    id: 'all-showcase',
    label: '전체 5종 한눈에 보기',
    pkg: 'KLIC · 3D 차트 모음',
  },
];

const CYLINDER_TIERS=[
  {id:0,name:'컴퓨팅 클러스터 (EKS)',color:'#245FC2',lightColor:'#8AB6FF',darkColor:'#193A87',percent:48,height:55,baseY:260,cost:'₩12,480,000 /월',desc:'64개 c6i 노드 인스턴스 활성 운영 중',badge:'bg-blue-500'},
  {id:1,name:'영구 스토리지 볼륨 (EBS)',color:'#4F8DF7',lightColor:'#9DBAFF',darkColor:'#2641B9',percent:32,height:40,baseY:205,cost:'₩8,320,000 /월',desc:'초당 12,000 IOPS 프로비저닝 완료',badge:'bg-blue-400'},
  {id:2,name:'글로벌 네트워크 (트랜짓)',color:'#2641B9',lightColor:'#8AB6FF',darkColor:'#193A87',percent:20,height:30,baseY:165,cost:'₩5,200,000 /월',desc:'서울-도쿄 간 초저지연 전용선 연결',badge:'bg-blue-700'},
];

const REGIONAL_NODES=[
  {id:'ap-seoul',region:'서울 (KR)',rps:4280,ping:4,height:140,active:true,color:'from-blue-600 to-blue-600'},
  {id:'ap-tokyo',region:'도쿄 (JP)',rps:3840,ping:28,height:120,active:true,color:'from-blue-500 to-blue-600'},
  {id:'ap-singapore',region:'싱가포르 (SG)',rps:2450,ping:68,height:90,active:true,color:'from-blue-500 to-blue-600'},
  {id:'eu-frankfurt',region:'프랑크푸르트 (DE)',rps:3120,ping:142,height:105,active:false,color:'from-blue-700 to-blue-600'},
  {id:'us-virginia',region:'버지니아 (US)',rps:5180,ping:184,height:160,active:true,color:'from-blue-600 to-blue-600'},
];

export function ThreeDChartShowcaseBlock({
  initialMode = 'isometric-latency',
}: ThreeDChartShowcaseBlockProps) {
  const [activeMode, setActiveMode] = useState<ThreeDChartMode>(initialMode);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  /* 3D 실린더 링 & 티어드 도넛 State */
  const [selectedCylinderTier, setSelectedCylinderTier] = useState<number>(0);
  const [cylinderTilt, setCylinderTilt] = useState<number>(32);

  /* 3D 글로벌 분산 노드 쿼드 기둥 State */
  const [selectedRegionId, setSelectedRegionId] = useState<string>('ap-seoul');

  /* 3D 계단식 슬래브 퍼넬 캐스케이드 State */
  const [activeCascadeStep, setActiveCascadeStep] = useState<number>(1);

  /* ========================================================================
   * RENDER 1: 3D 네온 글래스 슬래브 p95 응답 지연 라인 차트 (Image 90d273e2)
   * ======================================================================== */
  const renderStyle1IsometricLatency = () => (
    <NeonGlass3DCanvas />
  );

  /* ========================================================================
   * RENDER 2: 3D 아워리 히트맵 입체 복셀 그리드 (Image bc3fc2b5)
   * ======================================================================== */
  const renderStyle2VoxelHourlyDensity = () => (
    <HourlyVoxel3DCanvas />
  );

  /* ========================================================================
   * RENDER 3: 3D 실린더 링 & 티어드 도넛 (KLIC · 3D 도넛)
   * ======================================================================== */
  const renderStyle3CylinderDonutStack = () => (
    <section data-chart-region="chart3d-cylinder-donut-stack" role="region" aria-labelledby="chart3d-cylinder-title" className="rounded-[28px] bg-klic-inverse border border-[var(--klic-component-block-color-border)] p-6 sm:p-8 text-klic-on-emphasis shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
              KLIC · 3D 도넛
            </span>
            <h3 id="chart3d-cylinder-title" className="text-xl font-bold text-klic-on-emphasis">
              3D 실린더 링 & 티어드 도넛 차트
            </h3>
          </div>
          <p className="text-xs text-klic-muted mt-1">
            클라우드 인프라 자원 구성비와 스토리지 점유율을 입체 원통형 실린더로 시각화합니다.
          </p>
        </div>

        {/* 각도 조절 슬라이더 */}
        <div className="flex items-center gap-3 text-xs font-mono text-klic-muted">
          <label htmlFor="chart3d-cylinder-tilt">기울기: {cylinderTilt}°</label>
          <input
            id="chart3d-cylinder-tilt"
            type="range"
            min="20"
            max="45"
            value={cylinderTilt}
            aria-label="3D 원통 차트 기울기"
            aria-valuetext={`${cylinderTilt}도`}
            onChange={(e) => setCylinderTilt(Number(e.target.value))}
            className="w-28 accent-blue-500 bg-klic-inverse h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* 좌측 3D SVG 원통 실린더 링 (7열) */}
        <div className="lg:col-span-7 flex justify-center">
          <svg viewBox="0 0 520 400" role="group" aria-label="선택 가능한 3D 자원 점유 원통" className="w-full max-w-[480px] h-auto">
            {/* 하단 그림자 */}
            <ellipse
              cx="260"
              cy="310"
              rx="180"
              ry="75"
              fill="#000000"
              opacity="0.5"
              filter="blur(18px)"
            />

            {/* 3단 누적 실린더 레이어 */}
            {CYLINDER_TIERS.map((tier) => {
              const isSelected = selectedCylinderTier === tier.id;
              const lift = isSelected ? 12 : 0;
              const y = tier.baseY - lift;
              const h = tier.height;
              const rx = 150 - tier.id * 18;
              const ry = (rx * cylinderTilt) / 80;

              return (
                <g
                  key={tier.id}
                  className="cursor-pointer transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
                  role="button"
                  tabIndex={0}
                  aria-label={`${tier.name} ${tier.percent}% 점유`}
                  aria-pressed={isSelected}
                  aria-keyshortcuts="Enter Space"
                  onClick={() => setSelectedCylinderTier(tier.id)}
                  onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelectedCylinderTier(tier.id);}}}
                >
                  {/* 실린더 몸체 기둥 */}
                  <path
                    d={`
                      M ${260 - rx} ${y}
                      A ${rx} ${ry} 0 0 0 ${260 + rx} ${y}
                      L ${260 + rx} ${y + h}
                      A ${rx} ${ry} 0 0 1 ${260 - rx} ${y + h}
                      Z
                    `}
                    fill={tier.darkColor}
                    stroke="#18181B"
                    strokeWidth="1"
                  />

                  {/* 실린더 상단 캡 타원 */}
                  <ellipse
                    cx="260"
                    cy={y}
                    rx={rx}
                    ry={ry}
                    fill={isSelected ? tier.lightColor : tier.color}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2 : 0.8}
                    strokeOpacity={isSelected ? 0.9 : 0.3}
                  />

                  {/* 퍼센트 텍스트 */}
                  <text
                    x="260"
                    y={y + 5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {tier.percent}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 우측 세부 메트릭 카드 (5열) */}
        <div className="lg:col-span-5 space-y-3">
          {CYLINDER_TIERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCylinderTier(item.id)}
              aria-pressed={selectedCylinderTier===item.id}
              className={`w-full text-left p-4 rounded-2xl border transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                selectedCylinderTier === item.id
                  ? 'bg-klic-inverse border-blue-500 shadow-md ring-1 ring-blue-500/50'
                  : 'bg-klic-inverse/70 border-[var(--klic-component-block-color-border)] hover:bg-klic-inverse'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${item.badge}`} />
                  <span className="text-sm font-bold text-klic-on-emphasis">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-klic-on-emphasis">
                  {item.percent}% 점유
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-klic-muted">
                <span>{item.desc}</span>
                <span className="font-mono text-klic-on-emphasis">{item.cost}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <ChartDataTable chartId="chart3d-cylinder-donut-stack" caption="합성 자원 점유율과 예시 월 비용" columns={['점유율','예시 월 비용','설명']} rows={CYLINDER_TIERS.map(item=>[item.name,`${item.percent}%`,`예시 ${item.cost}`,item.desc])} />
    </section>
  );

  /* ========================================================================
   * RENDER 4: 3D 글로벌 분산 노드 쿼드 기둥 (KLIC · 3D 리전 기둥)
   * ======================================================================== */
  const renderStyle4ClusterTopologyBars = () => (
    <section data-chart-region="chart3d-cluster-topology-bars" role="region" aria-labelledby="chart3d-regions-title" className="rounded-[28px] bg-klic-inverse border border-[var(--klic-component-block-color-border)] p-6 sm:p-8 text-klic-on-emphasis shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-600 text-klic-on-emphasis text-[11px] font-mono font-semibold">
              KLIC · 3D 리전 기둥
            </span>
            <h3 id="chart3d-regions-title" className="text-xl font-bold text-klic-on-emphasis">
              3D 글로벌 분산 노드 쿼드 기둥 차트
            </h3>
          </div>
          <p className="text-xs text-klic-muted mt-1">
            5대 대륙 주요 데이터센터 리전의 처리량(RPS)과 응답 지연(Latency) 3D 기둥 관제 보드입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {REGIONAL_NODES.map((node) => {
          const selected = selectedRegionId === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedRegionId(node.id)}
              aria-pressed={selected}
              aria-label={`${node.region}, ${node.rps.toLocaleString('ko-KR')} 요청/초, 평균 ${node.ping}밀리초`}
              className={`rounded-2xl p-4 bg-klic-inverse/80 border transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 text-left flex flex-col justify-between ${
                selected
                  ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                  : 'border-[var(--klic-component-block-color-border)] hover:border-[var(--klic-component-block-color-border)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-klic-muted">
                  <span>{node.region}</span>
                  <span className={`w-2 h-2 rounded-full bg-blue-400 ${node.active?'motion-safe:animate-pulse motion-reduce:animate-none':'bg-zinc-500'}`} />
                </div>

                {/* 3D 기둥 그래픽 렌더링 */}
                <div className="h-44 flex items-end justify-center py-3">
                  <div className="relative w-14 flex flex-col items-center">
                    {/* 상단 캡 (다이아몬드 아이소메트릭) */}
                    <div
                      className={`w-12 h-6 rounded-md bg-gradient-to-r ${node.color} shadow-md -mb-3 z-10 border border-white/40`}
                      style={{ transform: 'rotateX(55deg)' }}
                    />
                    {/* 수직 기둥 바디 */}
                    <div
                      className={`w-12 rounded-b-md bg-gradient-to-b ${node.color} opacity-90 shadow-lg`}
                      style={{ height: `${node.height}px` }}
                    />
                    {/* 바닥 반사 그림자 */}
                    <div className="w-14 h-3 rounded-full bg-blue-500/20 blur-xs mt-1" />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--klic-component-block-color-border)] text-center">
                <div className="text-sm font-bold font-mono text-klic-on-emphasis">
                  {node.rps.toLocaleString('ko-KR')} RPS
                </div>
                <div className="text-[11px] font-mono text-klic-muted mt-0.5">
                  평균 핑 {node.ping} ms
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <ChartDataTable chartId="chart3d-cluster-topology-bars" caption="합성 리전별 처리량·지연과 예시 상태" columns={['처리량 (요청/초)','평균 지연','예시 상태']} rows={REGIONAL_NODES.map(node=>[node.region,node.rps.toLocaleString('ko-KR'),`${node.ping} ms`,node.active?'활성 예시':'대기 예시'])} />
    </section>
  );

  /* ========================================================================
   * RENDER 5: 3D 계단식 슬래브 퍼넬 캐스케이드 (KLIC · 3D 퍼널)
   * ======================================================================== */
  const renderStyle5FunnelSlabCascade = () => (
    <FunnelSlab3DCanvas />
  );

  return (
    <div className="space-y-6">
      {/* 상단 5종 3D 차트 스타일 전환 탭 바 */}
      <div role="group" aria-label="3D 차트 선택" className="rounded-2xl bg-klic-inverse border border-[var(--klic-component-block-color-border)] p-2 flex flex-wrap items-center gap-1.5">
        {MODE_TABS.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMode(tab.id)}
              aria-pressed={isActive}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-klic-inverse text-klic-on-emphasis shadow-xs border border-[var(--klic-component-block-color-border)]'
                  : 'text-klic-muted hover:text-klic-on-emphasis'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeMode === 'isometric-latency' && renderStyle1IsometricLatency()}
      {activeMode === 'voxel-hourly-density' && renderStyle2VoxelHourlyDensity()}
      {activeMode === 'cylinder-donut-stack' && renderStyle3CylinderDonutStack()}
      {activeMode === 'cluster-topology-bars' && renderStyle4ClusterTopologyBars()}
      {activeMode === 'funnel-slab-cascade' && renderStyle5FunnelSlabCascade()}

      {activeMode === 'all-showcase' && (
        <div className="space-y-8">
          {renderStyle1IsometricLatency()}
          {renderStyle2VoxelHourlyDensity()}
          {renderStyle3CylinderDonutStack()}
          {renderStyle4ClusterTopologyBars()}
          {renderStyle5FunnelSlabCascade()}
        </div>
      )}
    </div>
  );
}
