import React, { useState, useMemo } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Building2,
  Calendar,
  FileText,
  UserCheck,
  Sparkles,
  Info,
  ChevronRight,
  CheckCircle2,
  Users,
  Percent,
  Sliders,
  DollarSign,
  Lock,
} from 'lucide-react';
import {
  BillingPlanTier,
  BillingTerm,
  BillingUpgradeStep,
  BillingPlanInfo,
} from '../../types';

interface BillingUpgradeBlockProps {
  density?: 'compact' | 'normal' | 'relaxed';
}

const PLAN_TIERS: BillingPlanInfo[] = [
  {
    id: 'team',
    title: "팀",
    description: '성장하는 프로덕트 팀을 위한 기본 거버넌스 및 협업 제어 기능 제공.',
    monthlyPerSeatPrice: 49,
  },
  {
    id: 'business',
    title: "비즈니스",
    badge: '추천 플랜',
    description: 'SAML SSO, 보안 감사 로그 내보내기 및 24/7 우선 기술 지원 포함.',
    monthlyPerSeatPrice: 72,
  },
  {
    id: 'enterprise',
    title: "엔터프라이즈",
    description: '전사 조달 검토, 커스텀 SLA 계약 및 전담 계정 거버넌스 관리 지원.',
    monthlyPerSeatPrice: 96,
  },
];

export function BillingUpgradeBlock({ density = 'normal' }: BillingUpgradeBlockProps) {
  // 위자드 현재 단계: 1: 플랜 선택, 2: 시트 수, 3: 결제 조건, 4: 검토 및 승인
  const [currentStep, setCurrentStep] = useState<BillingUpgradeStep>(1);

  // 폼 상태
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanTier>('business');
  const [seatCount, setSeatCount] = useState<number>(42);
  const [billingTerm, setBillingTerm] = useState<BillingTerm>('annual');
  const [supportAddon, setSupportAddon] = useState<boolean>(true);
  const [poNumber, setPoNumber] = useState<string>('PO-2026-184');
  const [renewalDate, setRenewalDate] = useState<string>('2026년 5월 31일');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice' | 'ach'>('invoice');
  const [upgradeStatus, setUpgradeStatus] = useState<'임시저장' | '승인 완료'>('임시저장');
  const [signerName, setSignerName] = useState('이하은 총괄대표');
  const [isSigned, setIsSigned] = useState(false);

  // 토스트 알림
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 플랜 정보 계산
  const activePlanInfo = useMemo(() => {
    return PLAN_TIERS.find((p) => p.id === selectedPlan) || PLAN_TIERS[1];
  }, [selectedPlan]);

  const pricingCalculations = useMemo(() => {
    const monthlyRate = activePlanInfo.monthlyPerSeatPrice;
    const months = billingTerm === 'annual' ? 12 : billingTerm === 'semi-annual' ? 6 : 3;

    // 할인 전 소계
    const subtotal = seatCount * monthlyRate * months;

    // 약정 할인율: 연간 15%, 반기 5%, 분기 0%
    const discountRate = billingTerm === 'annual' ? 0.15 : billingTerm === 'semi-annual' ? 0.05 : 0;
    const discountAmount = Math.round(subtotal * discountRate);

    // 우선 기술 지원 애드온 ($390)
    const supportFee = supportAddon ? 390 : 0;

    // 금일 결제 예정 총액
    const dueToday = subtotal - discountAmount + supportFee;

    return {
      monthlyRate,
      subtotal,
      discountRate,
      discountAmount,
      supportFee,
      dueToday,
      months,
    };
  }, [activePlanInfo, seatCount, billingTerm, supportAddon]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as BillingUpgradeStep);
    } else {
      // 4단계 최종 승인 완료
      setUpgradeStatus('승인 완료');
      showToast('플랜 업그레이드 주문이 성공적으로 승인 및 확정되었습니다!');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as BillingUpgradeStep);
    }
  };

  return (
    <div className="w-full bg-white  rounded-2xl border border-zinc-200/90  shadow-xs overflow-hidden transition-all p-4 sm:p-6 lg:p-8">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-klic-inverse text-klic-on-emphasis   shadow-2xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. 상단 헤더 & 상태 배지                                     */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-zinc-100 ">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 ">
              플랜 업그레이드 및 계약 갱신
            </h2>
            <span className="text-xs text-klic-muted font-mono">결제 플랜 업그레이드</span>
          </div>
          <p className="text-xs sm:text-sm text-klic-muted  mt-1">
            계약 갱신 전 플랜 티어, 라이선스 시트 수, 결제 주기를 사전에 맞춤 변경하세요.
          </p>
        </div>

        {/* 상태 배지 */}
        <div>
          {upgradeStatus === '임시저장' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700   border border-amber-200/80 ">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>임시저장</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700   border border-blue-200/80 ">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>승인 완료</span>
            </span>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. 4단계 스텝 인디케이터 (Plan -> Seats -> Payment -> Review)  */}
      {/* ============================================================ */}
      <div className="py-6 sm:py-8 max-w-2xl mx-auto">
        <div className="relative flex items-center justify-between">
          {/* 가로 연결선 */}
          <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-zinc-200  z-0" />

          {/* 스텝 1: 플랜 선택 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-white  border-2 border-dashed border-zinc-900  text-zinc-900  ring-4 ring-zinc-100 '
                  : currentStep > 1
                  ? 'bg-klic-inverse  text-klic-on-emphasis '
                  : 'bg-white  border border-zinc-300  text-klic-muted'
              }`}
            >
              {currentStep > 1 ? <Check size={14} /> : '1'}
            </div>
            <span
              className={`text-xs font-bold mt-2 ${
                currentStep >= 1 ? 'text-zinc-900 ' : 'text-klic-muted'
              }`}
            >
              플랜 선택
            </span>
            <span className="text-[11px] text-klic-muted hidden sm:block">티어 지정</span>
          </button>

          {/* 스텝 2: 시트 설정 */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                currentStep === 2
                  ? 'bg-white  border-2 border-dashed border-zinc-900  text-zinc-900  ring-4 ring-zinc-100 '
                  : currentStep > 2
                  ? 'bg-klic-inverse  text-klic-on-emphasis '
                  : 'bg-white  border border-zinc-300  text-klic-muted'
              }`}
            >
              {currentStep > 2 ? <Check size={14} /> : '2'}
            </div>
            <span
              className={`text-xs font-bold mt-2 ${
                currentStep >= 2 ? 'text-zinc-900 ' : 'text-klic-muted'
              }`}
            >
              시트 수 설정
            </span>
            <span className="text-[11px] text-klic-muted hidden sm:block">좌석 수량 지정</span>
          </button>

          {/* 스텝 3: 결제 조건 */}
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                currentStep === 3
                  ? 'bg-white  border-2 border-dashed border-zinc-900  text-zinc-900  ring-4 ring-zinc-100 '
                  : currentStep > 3
                  ? 'bg-klic-inverse  text-klic-on-emphasis '
                  : 'bg-white  border border-zinc-300  text-klic-muted'
              }`}
            >
              {currentStep > 3 ? <Check size={14} /> : '3'}
            </div>
            <span
              className={`text-xs font-bold mt-2 ${
                currentStep >= 3 ? 'text-zinc-900 ' : 'text-klic-muted'
              }`}
            >
              결제 조건
            </span>
            <span className="text-[11px] text-klic-muted hidden sm:block">주기 및 PO</span>
          </button>

          {/* 스텝 4: 검토 및 승인 */}
          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className="relative z-10 flex flex-col items-center group cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                currentStep === 4
                  ? 'bg-white  border-2 border-dashed border-zinc-900  text-zinc-900  ring-4 ring-zinc-100 '
                  : upgradeStatus === '승인 완료'
                  ? 'bg-blue-600 text-klic-on-emphasis'
                  : 'bg-white  border border-zinc-300  text-klic-muted'
              }`}
            >
              {upgradeStatus === '승인 완료' ? <Check size={14} /> : '4'}
            </div>
            <span
              className={`text-xs font-bold mt-2 ${
                currentStep >= 4 ? 'text-zinc-900 ' : 'text-klic-muted'
              }`}
            >
              검토 및 승인
            </span>
            <span className="text-[11px] text-klic-muted hidden sm:block">전자 서명</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. 좌우 분할 영역 (좌측: 단계별 폼 / 우측: 실시간 청구서)     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 pb-8 border-b border-zinc-100 ">
        {/* 좌측 영역 (7열) */}
        <div className="lg:col-span-7 space-y-6">
          {/* ---------------- 1단계: 플랜 티어 선택 ---------------- */}
          {currentStep === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-900 ">
                  플랜 등급 선택
                </h3>
                <p className="text-xs text-klic-muted  mt-0.5">
                  시트 확장에 적용할 기업용 플랜 등급을 선택하세요.
                </p>
              </div>

              {/* 플랜 목록 카드 */}
              <div className="space-y-3">
                {PLAN_TIERS.map((tier) => {
                  const isSelected = selectedPlan === tier.id;

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedPlan(tier.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-zinc-950  bg-white  shadow-xs ring-1 ring-zinc-950/20 '
                          : 'border-zinc-200  bg-white  hover:border-zinc-300 '
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* 커스텀 라디오 버튼 */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'border-zinc-900  bg-white '
                              : 'border-zinc-300 '
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-klic-inverse " />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-900 ">
                              {tier.title}
                            </span>
                            {tier.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700   border border-blue-200/70 ">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-klic-muted  mt-1 leading-relaxed">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      {/* 우측 가격 */}
                      <div className="text-right shrink-0 whitespace-nowrap">
                        <span className="font-extrabold text-sm sm:text-base text-zinc-900  tabular-nums">
                          ${tier.monthlyPerSeatPrice}
                        </span>
                        <span className="text-xs text-klic-muted font-medium">/시트/월</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- 2단계: 시트 수 설정 ---------------- */}
          {currentStep === 2 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-900 ">
                  좌석 수 설정
                </h3>
                <p className="text-xs text-klic-muted  mt-0.5">
                  팀의 성장에 맞춰 필요한 전체 라이선스 좌석 수를 지정하세요.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200  bg-white  space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-700 ">
                      총 라이선스 좌석 수
                    </span>
                    <p className="text-[11px] text-klic-muted">
                      현재 재직 활성 인원: 38명 (예비 여유 4석 포함)
                    </p>
                  </div>

                  {/* 스테퍼 증감 버튼 */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSeatCount((prev) => Math.max(10, prev - 1))}
                      className="w-8 h-8 rounded-xl border border-zinc-200  bg-zinc-50  hover:bg-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-xl font-extrabold text-zinc-900  tabular-nums w-14 text-center">
                      {seatCount}석
                    </span>
                    <button
                      type="button"
                      onClick={() => setSeatCount((prev) => prev + 1)}
                      className="w-8 h-8 rounded-xl border border-zinc-200  bg-zinc-50  hover:bg-zinc-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 슬라이더 바 */}
                <div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="1"
                    value={seatCount}
                    onChange={(e) => setSeatCount(parseInt(e.target.value, 10))}
                    className="w-full accent-zinc-900  cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-klic-muted mt-1">
                    <span>최소 10석</span>
                    <span>42석 (현재 설정)</span>
                    <span>100석</span>
                    <span>150+석</span>
                  </div>
                </div>

                {/* 빠른 수량 프리셋 */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 ">
                  <span className="text-[11px] text-klic-muted font-medium">빠른 프리셋:</span>
                  {[25, 42, 50, 75, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSeatCount(preset)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                        seatCount === preset
                          ? 'border-zinc-900 bg-klic-inverse text-klic-on-emphasis    font-bold'
                          : 'border-zinc-200  bg-zinc-50  text-klic-muted  hover:bg-zinc-100'
                      }`}
                    >
                      {preset}석
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- 3단계: 결제 주기 및 조건 ---------------- */}
          {currentStep === 3 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-900 ">
                  결제 조건 및 주기
                </h3>
                <p className="text-xs text-klic-muted  mt-0.5">
                  청구 주기와 회사 회계 처리용 결제 방식을 선택하세요.
                </p>
              </div>

              <div className="space-y-4">
                {/* 주기 선택 옵션 카드 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setBillingTerm('annual')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                      billingTerm === 'annual'
                        ? 'border-zinc-900  bg-zinc-50/80  shadow-2xs'
                        : 'border-zinc-200  bg-white  hover:border-zinc-300'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800  ">
                      15% 연간 할인
                    </span>
                    <p className="font-bold text-xs text-zinc-900  mt-2">
                      연간 결제
                    </p>
                    <p className="text-[11px] text-klic-muted mt-0.5">연 1회 청구서 정산</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingTerm('semi-annual')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      billingTerm === 'semi-annual'
                        ? 'border-zinc-900  bg-zinc-50/80  shadow-2xs'
                        : 'border-zinc-200  bg-white  hover:border-zinc-300'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-200  text-zinc-700 ">
                      5% 반기 할인
                    </span>
                    <p className="font-bold text-xs text-zinc-900  mt-2">
                      반기 결제
                    </p>
                    <p className="text-[11px] text-klic-muted mt-0.5">6개월 분할 청구</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingTerm('quarterly')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      billingTerm === 'quarterly'
                        ? 'border-zinc-900  bg-zinc-50/80  shadow-2xs'
                        : 'border-zinc-200  bg-white  hover:border-zinc-300'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100  text-klic-muted">
                      정상 요금
                    </span>
                    <p className="font-bold text-xs text-zinc-900  mt-2">
                      분기 결제
                    </p>
                    <p className="text-[11px] text-klic-muted mt-0.5">3개월 단위 정기 청구</p>
                  </button>
                </div>

                {/* PO 번호 입력 필드 */}
                <div className="p-4 rounded-xl border border-zinc-200  bg-zinc-50/50 ">
                  <label className="block text-xs font-semibold text-zinc-700  mb-1">
                    구매주문서 번호
                  </label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white  border border-zinc-200  rounded-xl text-zinc-900  focus:outline-hidden"
                  />
                  <p className="text-[11px] text-klic-muted mt-1">
                    사내 ERP 및 재무팀 전표 대사용 참조 번호로 청구서 상단에 공식 표기됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- 4단계: 최종 검토 및 승인 ---------------- */}
          {currentStep === 4 && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-900 ">
                  최종 검토 및 서명 승인
                </h3>
                <p className="text-xs text-klic-muted  mt-0.5">
                  최종 계약 갱신 조건을 검토하고 전자 결재 서명을 완료하세요.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-zinc-200  bg-zinc-50/50  space-y-3">
                  <div className="flex justify-between text-xs pb-2 border-b border-zinc-200/70 ">
                    <span className="text-klic-muted">선택된 플랜</span>
                    <span className="font-bold text-zinc-900 ">
                      {activePlanInfo.title} (${activePlanInfo.monthlyPerSeatPrice}/시트/월)
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-zinc-200/70 ">
                    <span className="text-klic-muted">배정된 라이선스 시트</span>
                    <span className="font-bold text-zinc-900 ">
                      {seatCount} 석
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-zinc-200/70 ">
                    <span className="text-klic-muted">약정 청구 주기</span>
                    <span className="font-bold text-zinc-900 ">
                      {billingTerm === 'annual' ? '연간 결제 (15% 특별 할인 적용)' : '분기/반기 결제'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-zinc-200/70 ">
                    <span className="text-klic-muted">다음 갱신 예정일</span>
                    <span className="font-bold text-zinc-900 ">
                      {renewalDate}
                    </span>
                  </div>
                </div>

                {/* 전자 서명 확인 박스 */}
                <div className="p-4 rounded-xl border border-zinc-200  bg-white ">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSigned}
                      onChange={(e) => setIsSigned(e.target.checked)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-500 cursor-pointer"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-zinc-900 ">
                        워크스페이스 소유자 {signerName} 명의로 약관 승인
                      </p>
                      <p className="text-[11px] text-klic-muted mt-0.5">
                        본 주문 확정 시 지정된 결제 조건에 따라 등록된 전자세금계산서/인보이스로 청구서가 즉시 라우팅됩니다.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 우측 영역: 실시간 청구서 미리보기 (5열) */}
        <div className="lg:col-span-5 lg:border-l lg:border-zinc-200/80  lg:pl-8 space-y-5">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900 ">
                청구서 미리보기
              </h3>
              <span className="px-2 py-0.5 rounded-md border border-zinc-200  bg-zinc-50  text-[11px] font-semibold text-zinc-700 ">
                {billingTerm === 'annual' ? '연간 결제' : '분기 결제'}
              </span>
            </div>
          </div>
          <p className="text-xs text-klic-muted  -mt-3">
            최종 승인 전 임시 청구서 견적입니다.
          </p>

          {/* 점선 테두리 하이라이트 박스: 금일 결제 예정액 */}
          <div className="p-5 rounded-2xl border border-dashed border-zinc-300  bg-zinc-50/50  flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-zinc-700  block">
                오늘 결제 예정액
              </span>
              <span className="text-xs text-klic-muted  mt-0.5 block">
                {activePlanInfo.title}, {seatCount}석, {billingTerm === 'annual' ? '연간' : '분기'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900  tabular-nums">
                ${pricingCalculations.dueToday.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 비용 세부 내역 */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-zinc-700 ">
                <span className="font-semibold">비용 세부 내역</span>
                <span title="플랜 기본 시트 요율 및 약정 할인 상세" className="inline-flex items-center cursor-pointer">
                  <HelpCircle size={13} className="text-klic-muted hover:text-klic-muted" />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-zinc-800 ">기본 좌석 요금</span>
                <p className="text-[11px] text-klic-muted">
                  {seatCount}석, {billingTerm === 'annual' ? '연간 12개월' : '분기 3개월'}
                </p>
              </div>
              <span className="font-bold text-zinc-900  tabular-nums">
                ${pricingCalculations.subtotal.toLocaleString()}
              </span>
            </div>

            {pricingCalculations.discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-zinc-800 ">약정 할인</span>
                  <p className="text-[11px] text-klic-muted">
                    {Math.round(pricingCalculations.discountRate * 100)}% 기간 할인 크레딧
                  </p>
                </div>
                <span className="font-bold text-blue-600  tabular-nums">
                  -${pricingCalculations.discountAmount.toLocaleString()}
                </span>
              </div>
            )}

            {supportAddon && (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-zinc-800 ">우선 기술 지원</span>
                  <p className="text-[11px] text-klic-muted">24/7 전담 엔지니어 SLA</p>
                </div>
                <span className="font-bold text-zinc-900  tabular-nums">
                  ${pricingCalculations.supportFee}
                </span>
              </div>
            )}
          </div>

          {/* 청구서 라우팅 정보 */}
          <div className="pt-4 border-t border-zinc-100  space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-700 ">
              <span className="font-semibold">청구서 수신처</span>
              <span title="청구서 송부 및 다음 갱신 만료일" className="inline-flex items-center cursor-pointer">
                <HelpCircle size={13} className="text-klic-muted hover:text-klic-muted" />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-klic-muted ">다음 갱신일</span>
              <span className="font-medium text-zinc-900 ">
                {renewalDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-klic-muted ">발급 PO 번호</span>
              <span className="font-mono font-medium text-zinc-900 ">
                {poNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. 하단 액션 버튼 (이전 / 다음 / 업그레이드 확정)             */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-700  hover:bg-zinc-100  rounded-xl transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>이전 단계</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleNextStep}
          disabled={currentStep === 4 && !isSigned}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-klic-on-emphasis bg-klic-inverse hover:bg-klic-inverse    rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{currentStep === 4 ? '플랜 업그레이드 확정 (Confirm)' : '다음 단계'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
