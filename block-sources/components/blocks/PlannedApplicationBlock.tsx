import React, { useEffect, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  KeyRound,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from 'lucide-react';

export type PlannedApplicationDensity = 'compact' | 'normal' | 'relaxed';

export interface PlannedApplicationBlockProps {
  variant: string;
  density?: PlannedApplicationDensity;
}

const COLOR = {
  accent: 'var(--klic-component-block-color-accent)',
  border: 'var(--klic-component-block-color-border)',
  controlBorder: 'var(--klic-component-block-color-control-border)',
  danger: 'var(--klic-component-block-color-danger)',
  dangerSurface: 'var(--klic-component-block-color-danger-surface)',
  muted: 'var(--klic-component-block-color-muted)',
  onAccent: 'var(--klic-component-block-color-on-accent)',
  panel: 'var(--klic-component-block-color-panel)',
  selected: 'var(--klic-component-block-color-selected)',
  soft: 'var(--klic-component-block-color-soft)',
  surface: 'var(--klic-component-block-color-surface)',
  text: 'var(--klic-component-block-color-text)',
  warning: 'var(--klic-component-block-color-warning)',
  warningSurface: 'var(--klic-component-block-color-warning-surface)',
} as const;

const focusClass =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--klic-component-block-color-accent)]';

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section
      style={{
        minWidth: 0,
        border: `1px solid ${COLOR.border}`,
        borderRadius: 14,
        background: COLOR.panel,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: COLOR.muted, fontSize: 11, fontWeight: 650, letterSpacing: '0.04em' }}>
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={focusClass}
      style={{
        minHeight: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        border: `1px solid ${COLOR.accent}`,
        borderRadius: 9,
        padding: '7px 12px',
        background: COLOR.accent,
        color: COLOR.onAccent,
        font: 'inherit',
        fontSize: 12,
        fontWeight: 650,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {children}
    </button>
  );
}

function QuietButton({
  children,
  onClick,
  danger = false,
  pressed,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={focusClass}
      style={{
        minHeight: 34,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        border: `1px solid ${danger ? COLOR.danger : COLOR.controlBorder}`,
        borderRadius: 9,
        padding: '6px 10px',
        background: danger ? COLOR.dangerSurface : COLOR.panel,
        color: danger ? COLOR.danger : COLOR.text,
        font: 'inherit',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function SampleNotice() {
  return (
    <p
      role="note"
      style={{
        margin: '0 0 16px',
        padding: '9px 11px',
        border: `1px solid ${COLOR.border}`,
        borderRadius: 9,
        background: COLOR.soft,
        color: COLOR.muted,
        fontSize: 11,
      }}
    >
      예시 데이터 · 변경은 이 미리보기에만 적용되며 서버에 저장되지 않습니다.
    </p>
  );
}

function ProfileHeading({
  title,
  subtitle,
  initials,
  density,
}: {
  title: string;
  subtitle: string;
  initials: string;
  density: PlannedApplicationDensity;
}) {
  const size = density === 'compact' ? 42 : density === 'relaxed' ? 58 : 50;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
      <div
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          flex: `0 0 ${size}px`,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 15,
          background: COLOR.selected,
          color: COLOR.accent,
          fontWeight: 750,
          fontSize: size * 0.3,
        }}
      >
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ margin: 0, color: COLOR.text, fontSize: 19, lineHeight: 1.25, fontWeight: 730 }}>
          {title}
        </h2>
        <p style={{ margin: '4px 0 0', color: COLOR.muted, fontSize: 12 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel style={{ padding: 13 }}>
      <Label>{label}</Label>
      <div style={{ marginTop: 7, color: COLOR.text, fontSize: 21, fontWeight: 720 }}>{value}</div>
      <div style={{ marginTop: 4, color: COLOR.muted, fontSize: 11 }}>{detail}</div>
    </Panel>
  );
}

function EngineerProfilePreview({ density }: { density: PlannedApplicationDensity }) {
  const services = [
    { id: 'identity', name: 'Identity API', role: 'Primary owner', health: '정상', detail: '인증 토큰 발급과 조직 SSO 연동을 담당합니다.', tier: 'Tier 1' },
    { id: 'billing', name: 'Billing Core', role: 'On-call backup', health: '정상', detail: '구독 청구와 결제 이벤트를 처리합니다.', tier: 'Tier 1' },
    { id: 'events', name: 'Event Relay', role: 'Contributor', health: '점검 예정', detail: '제품 이벤트를 분석 저장소로 전달합니다.', tier: 'Tier 2' },
  ];
  const [selectedService, setSelectedService] = useState(services[0].id);
  const active = services.find((service) => service.id === selectedService) ?? services[0];
  return (
    <>
      <ProfileHeading title="김도윤" subtitle="플랫폼 엔지니어 · Core Platform 스쿼드" initials="김" density={density} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 10, marginBottom: 14 }}>
        <StatCard label="온콜 등급" value="L2" detail="주간 1차 대응" />
        <StatCard label="PR 머지" value="38" detail="최근 90일" />
        <StatCard label="코드 리뷰" value="64" detail="최근 90일" />
        <StatCard label="인시던트 해결" value="7" detail="최근 90일" />
      </div>
      <Panel>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, color: COLOR.text, fontSize: 14 }}>담당 서비스</h3>
            <p style={{ margin: '4px 0 12px', color: COLOR.muted, fontSize: 11 }}>서비스를 선택하면 책임 범위 샘플을 확인합니다.</p>
          </div>
          <span style={{ color: COLOR.muted, fontSize: 10 }}>기술 스택: TypeScript · Go · PostgreSQL · Kubernetes</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedService(service.id)}
              aria-pressed={active.id === service.id}
              className={focusClass}
              style={{
                textAlign: 'left',
                border: `1px solid ${active.id === service.id ? COLOR.accent : COLOR.border}`,
                borderRadius: 10,
                padding: 11,
                background: active.id === service.id ? COLOR.selected : COLOR.panel,
                color: COLOR.text,
                cursor: 'pointer',
                font: 'inherit',
              }}
            >
              <span style={{ display: 'block', fontWeight: 680, fontSize: 12 }}>{service.name}</span>
              <span style={{ display: 'block', marginTop: 5, color: COLOR.muted, fontSize: 10 }}>{service.role} · {service.tier}</span>
            </button>
          ))}
        </div>
        <div aria-live="polite" style={{ marginTop: 12, padding: 12, borderRadius: 10, background: COLOR.soft, color: COLOR.text }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 680 }}>
            <Activity size={14} aria-hidden="true" /> {active.name} · {active.health}
          </div>
          <p style={{ margin: '5px 0 0', color: COLOR.muted, fontSize: 11 }}>{active.detail}</p>
        </div>
      </Panel>
    </>
  );
}

type AccountFields = { company: string; csm: string; ssoDomain: string; billingAddress: string };

function EnterpriseAccountPreview({ density }: { density: PlannedApplicationDensity }) {
  const [saved, setSaved] = useState<AccountFields>({
    company: '한빛 커머스 주식회사',
    csm: '이서연 · seoyeon@klic.example',
    ssoDomain: 'hanbit.example',
    billingAddress: '서울특별시 강남구 테헤란로 120',
  });
  const [draft, setDraft] = useState(saved);
  const [feedback, setFeedback] = useState('');
  const dirty = Object.keys(saved).some((key) => saved[key as keyof AccountFields] !== draft[key as keyof AccountFields]);
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 38,
    marginTop: 5,
    border: `1px solid ${COLOR.controlBorder}`,
    borderRadius: 8,
    padding: '8px 10px',
    background: COLOR.panel,
    color: COLOR.text,
    font: 'inherit',
    fontSize: 12,
  };
  const setField = (key: keyof AccountFields, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const fields: { key: keyof AccountFields; label: string }[] = [
    { key: 'company', label: '회사명' },
    { key: 'csm', label: '담당 CSM' },
    { key: 'ssoDomain', label: '연동 SSO 도메인' },
    { key: 'billingAddress', label: '청구지 주소' },
  ];
  return (
    <>
      <ProfileHeading title={saved.company} subtitle="Enterprise 계약 · 고객 계정 요약" initials="HB" density={density} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(260px, .85fr)', gap: 12, alignItems: 'start' }}>
        <Panel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
            <Building2 size={18} color={COLOR.accent} aria-hidden="true" />
            <div><h3 style={{ margin: 0, color: COLOR.text, fontSize: 14 }}>계정 정보</h3><p style={{ margin: '3px 0 0', color: COLOR.muted, fontSize: 11 }}>필드를 편집한 뒤 적용하거나 취소하세요.</p></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
            {fields.map(({ key, label }) => (
              <label key={key} style={{ display: 'block', color: COLOR.text, fontSize: 11, fontWeight: 650 }}>
                {label}
                <input className={focusClass} value={draft[key]} onChange={(event) => setField(key, event.target.value)} style={fieldStyle} />
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            <PrimaryButton onClick={() => { setSaved(draft); setFeedback('변경 사항을 미리보기에 적용했습니다.'); }} disabled={!dirty}><Check size={14} /> 적용</PrimaryButton>
            <QuietButton onClick={() => { setDraft(saved); setFeedback('편집을 취소하고 샘플 값을 복원했습니다.'); }}><X size={14} /> 취소</QuietButton>
            <span role="status" aria-live="polite" style={{ color: COLOR.muted, fontSize: 11 }}>{feedback || (dirty ? '적용 전 변경 사항' : '저장된 샘플 값')}</span>
          </div>
        </Panel>
        <div style={{ display: 'grid', gap: 12 }}>
          <StatCard label="계약 티어" value="Enterprise" detail="연간 갱신 · 2027.03.31" />
          <Panel>
            <Label>라이선스 가동률</Label>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 7, color: COLOR.text }}><strong style={{ fontSize: 22 }}>84%</strong><span style={{ color: COLOR.muted, fontSize: 11 }}>420 / 500 seats</span></div>
            <div aria-label="샘플 라이선스 사용률 84%" role="img" style={{ height: 7, marginTop: 10, overflow: 'hidden', borderRadius: 20, background: COLOR.soft }}><div style={{ width: '84%', height: '100%', background: COLOR.accent, borderRadius: 20 }} /></div>
            <p style={{ margin: '9px 0 0', color: COLOR.muted, fontSize: 10 }}>청구 기준: 매월 1일 · 자동 갱신 사용</p>
          </Panel>
          <Panel><Label>연결된 계정</Label><p style={{ margin: '8px 0 0', color: COLOR.text, fontSize: 12 }}><strong>SSO</strong> · {saved.ssoDomain}</p><p style={{ margin: '6px 0 0', color: COLOR.text, fontSize: 12 }}><strong>청구지</strong> · {saved.billingAddress}</p></Panel>
        </div>
      </div>
    </>
  );
}

type Credential = { id: string; name: string; kind: string; added: string; lastUsed: string };

function SecurityIdentityPreview({ density }: { density: PlannedApplicationDensity }) {
  const [credentials, setCredentials] = useState<Credential[]>([
    { id: 'key-1', name: 'YubiKey 5C NFC', kind: '하드웨어 보안키', added: '2025.02.14 등록', lastUsed: '오늘 09:41' },
    { id: 'key-2', name: 'MacBook Pro Passkey', kind: '패스키', added: '2025.07.06 등록', lastUsed: '어제 17:20' },
    { id: 'key-3', name: 'YubiKey Bio', kind: '하드웨어 보안키', added: '2026.01.21 등록', lastUsed: '2026.10.31' },
  ]);
  const [pendingRevoke, setPendingRevoke] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  return (
    <>
      <ProfileHeading title="보안 자격증명" subtitle="김도윤 · 최근 접근 내역을 포함한 로컬 샘플" initials="김" density={density} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(240px, .8fr)', gap: 12, alignItems: 'start' }}>
        <Panel>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div><h3 style={{ margin: 0, color: COLOR.text, fontSize: 14 }}>등록된 자격증명</h3><p style={{ margin: '4px 0 0', color: COLOR.muted, fontSize: 11 }}>폐기는 이 화면의 샘플 목록에만 적용됩니다.</p></div>
            <span style={{ borderRadius: 20, padding: '4px 8px', background: COLOR.selected, color: COLOR.accent, fontSize: 10, fontWeight: 700 }}>{credentials.length}개 활성</span>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {credentials.map((credential) => (
              <div key={credential.id} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: 11 }}>
                <div aria-hidden="true" style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 10, background: COLOR.soft, color: COLOR.accent }}><KeyRound size={16} /></div>
                <div style={{ minWidth: 130, flex: '1 1 auto' }}><strong style={{ display: 'block', color: COLOR.text, fontSize: 12 }}>{credential.name}</strong><span style={{ color: COLOR.muted, fontSize: 10 }}>{credential.kind} · {credential.added}</span><span style={{ display: 'block', marginTop: 3, color: COLOR.muted, fontSize: 10 }}>최근 사용 {credential.lastUsed}</span></div>
                {pendingRevoke === credential.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: COLOR.danger, fontSize: 10 }}>샘플 목록에서 제거할까요?</span>
                    <QuietButton danger onClick={() => { setCredentials((items) => items.filter((item) => item.id !== credential.id)); setPendingRevoke(null); setMessage(`${credential.name}을(를) 샘플 목록에서 폐기했습니다.`); }}>폐기 확인</QuietButton>
                    <QuietButton onClick={() => setPendingRevoke(null)}>취소</QuietButton>
                  </div>
                ) : <QuietButton danger onClick={() => { setPendingRevoke(credential.id); setMessage(''); }}>폐기</QuietButton>}
              </div>
            ))}
            {credentials.length === 0 && <p style={{ margin: 0, color: COLOR.muted, fontSize: 12 }}>활성 샘플 자격증명이 없습니다.</p>}
          </div>
          <p role="status" aria-live="polite" style={{ minHeight: 16, margin: '10px 0 0', color: COLOR.muted, fontSize: 11 }}>{message}</p>
        </Panel>
        <div style={{ display: 'grid', gap: 12 }}>
          <Panel><Label>RBAC 역할</Label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>{['platform-admin', 'incident-responder', 'billing-read'].map((role) => <span key={role} style={{ padding: '5px 8px', border: `1px solid ${COLOR.border}`, borderRadius: 20, color: COLOR.text, fontSize: 10 }}>{role}</span>)}</div><p style={{ margin: '10px 0 0', color: COLOR.warning, fontSize: 11 }}>임시 권한 만료 · 2026.11.12 18:00</p></Panel>
          <Panel><Label>최근 접근 IP 샘플</Label>{[['203.0.113.24', '서울 · 오늘 09:41'], ['198.51.100.18', '도쿄 · 어제 17:20'], ['203.0.113.72', '서울 · 11월 04일']].map(([ip, detail]) => <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 9, color: COLOR.text, fontSize: 11 }}><code>{ip}</code><span style={{ color: COLOR.muted }}>{detail}</span></div>)}</Panel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, background: COLOR.selected, color: COLOR.accent, fontSize: 11 }}><ShieldCheck size={16} aria-hidden="true" /> 다중 인증 활성화</div>
        </div>
      </div>
    </>
  );
}

type PreferenceFields = { jobTitle: string; timezone: string; language: string; dnd: boolean };

function PersonalPreferencesPreview({ density }: { density: PlannedApplicationDensity }) {
  const [saved, setSaved] = useState<PreferenceFields>({ jobTitle: '프로덕트 디자이너', timezone: 'Asia/Seoul', language: '한국어', dnd: true });
  const [draft, setDraft] = useState(saved);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('기본 프로필 사진');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!previewUrl) return;
    return () => {
      if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const update = <K extends keyof PreferenceFields>(key: K, value: PreferenceFields[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const fieldStyle: React.CSSProperties = { minHeight: 36, border: `1px solid ${COLOR.controlBorder}`, borderRadius: 8, padding: '7px 9px', background: COLOR.panel, color: COLOR.text, font: 'inherit', fontSize: 12 };
  const isDirty = JSON.stringify(saved) !== JSON.stringify(draft);
  return (
    <>
      <ProfileHeading title="개인 환경설정" subtitle="김도윤 · 표시 설정과 알림 일정을 관리합니다." initials="김" density={density} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(225px, .72fr)', gap: 12, alignItems: 'start' }}>
        <Panel>
          <h3 style={{ margin: '0 0 12px', color: COLOR.text, fontSize: 14 }}>프로필 및 기본 설정</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 11 }}>
            <label style={{ display: 'grid', gap: 5, color: COLOR.text, fontSize: 11, fontWeight: 650 }}>직함<input className={focusClass} value={draft.jobTitle} onChange={(event) => update('jobTitle', event.target.value)} style={fieldStyle} /></label>
            <label style={{ display: 'grid', gap: 5, color: COLOR.text, fontSize: 11, fontWeight: 650 }}>타임존<select className={focusClass} value={draft.timezone} onChange={(event) => update('timezone', event.target.value)} style={fieldStyle}><option>Asia/Seoul</option><option>Asia/Tokyo</option><option>America/Los_Angeles</option><option>UTC</option></select></label>
            <label style={{ display: 'grid', gap: 5, color: COLOR.text, fontSize: 11, fontWeight: 650 }}>언어<select className={focusClass} value={draft.language} onChange={(event) => update('language', event.target.value)} style={fieldStyle}><option>한국어</option><option>English</option><option>日本語</option></select></label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 9, minHeight: 38, marginTop: 18, color: COLOR.text, fontSize: 12 }}><input type="checkbox" checked={draft.dnd} onChange={(event) => update('dnd', event.target.checked)} /> 방해 금지 일정 켜기</label>
          </div>
          {draft.dnd && <p style={{ margin: '9px 0 0', color: COLOR.muted, fontSize: 11 }}>평일 22:00–08:00 · 긴급 알림은 계속 받습니다.</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 14 }}><PrimaryButton disabled={!isDirty} onClick={() => { setSaved(draft); setFeedback('환경설정을 미리보기에 적용했습니다.'); }}><Check size={14} /> 적용</PrimaryButton><QuietButton onClick={() => { setDraft(saved); setFeedback('변경 사항을 취소했습니다.'); }}>취소</QuietButton><span role="status" aria-live="polite" style={{ color: COLOR.muted, fontSize: 11 }}>{feedback}</span></div>
        </Panel>
        <div style={{ display: 'grid', gap: 12 }}>
          <Panel>
            <Label>프로필 사진 미리보기</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
              {previewUrl ? <img src={previewUrl} alt="선택한 프로필 사진의 로컬 미리보기" style={{ width: 62, height: 62, borderRadius: 18, objectFit: 'cover', border: `1px solid ${COLOR.border}` }} /> : <div aria-label="사진 미리보기 없음" role="img" style={{ width: 62, height: 62, display: 'grid', placeItems: 'center', borderRadius: 18, background: COLOR.selected, color: COLOR.accent }}><UserRound size={24} /></div>}
              <div style={{ minWidth: 0 }}><strong style={{ display: 'block', color: COLOR.text, fontSize: 11 }}>{photoName}</strong><span style={{ color: COLOR.muted, fontSize: 10 }}>선택한 파일은 브라우저 안에서만 표시됩니다.</span></div>
            </div>
            <label style={{ display: 'grid', gap: 6, marginTop: 12, color: COLOR.text, fontSize: 10, fontWeight: 650 }}>사진 선택<input type="file" accept="image/*" aria-label="프로필 사진 파일 선택" className={focusClass} style={{ maxWidth: '100%', color: COLOR.text, font: 'inherit', fontSize: 10 }} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (!file) return; if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') { setFeedback('이 환경에서는 로컬 사진 미리보기를 지원하지 않습니다.'); return; } setPreviewUrl(URL.createObjectURL(file)); setPhotoName(file.name); setFeedback('사진 미리보기는 이 화면을 닫을 때 정리됩니다.'); }} /></label>
          </Panel>
          <Panel><Label>개인 API 토큰 샘플</Label><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, color: COLOR.text, fontSize: 11 }}><KeyRound size={15} color={COLOR.accent} aria-hidden="true" /><code>klic_demo_••••••••7F2A</code></div><p style={{ margin: '8px 0 0', color: COLOR.muted, fontSize: 10 }}>실제 토큰 값이나 서버 권한은 포함하지 않습니다.</p></Panel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, background: COLOR.soft, color: COLOR.muted, fontSize: 11 }}><Smartphone size={15} aria-hidden="true" /> 모바일 알림 미리보기 사용</div>
        </div>
      </div>
    </>
  );
}

type ComplianceState = '확인 완료' | '검토 필요' | '갱신 요청';
type ComplianceRecord = { id: string; name: string; state: ComplianceState; expires: string; owner: string };

function VendorCompliancePreview({ density }: { density: PlannedApplicationDensity }) {
  const [records, setRecords] = useState<ComplianceRecord[]>([
    { id: 'soc2', name: 'SOC 2 Type II', state: '확인 완료', expires: '2027.04.30', owner: '보안팀' },
    { id: 'iso', name: 'ISO 27001', state: '갱신 요청', expires: '2026.12.18', owner: '파트너 담당' },
    { id: 'dpa', name: '데이터 처리 계약 (DPA)', state: '검토 필요', expires: '서명 대기', owner: '법무팀' },
  ]);
  const [message, setMessage] = useState('');
  const changeState = (id: string) => setRecords((items) => items.map((item) => item.id === id ? { ...item, state: item.state === '확인 완료' ? '검토 필요' : '확인 완료' } : item));
  const completed = records.filter((record) => record.state === '확인 완료').length;
  const needsAttention = records.length - completed;
  return (
    <>
      <ProfileHeading title="파트너 벤더 보안" subtitle="오션웨이브 데이터 서비스 · 공급업체 위험 검토" initials="OW" density={density} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 12 }}>
        <StatCard label="위험 등급" value="보통" detail="연례 검토 대상" />
        <StatCard label="인증서 상태" value={`${completed} / ${records.length}`} detail="확인 완료" />
        <StatCard label="주의 항목" value={String(needsAttention)} detail="현지 샘플 상태" />
      </div>
      <Panel>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
          <div><h3 style={{ margin: 0, color: COLOR.text, fontSize: 14 }}>준수 현황</h3><p style={{ margin: '4px 0 0', color: COLOR.muted, fontSize: 11 }}>상태 전환은 검토 화면에만 반영됩니다.</p></div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 9px', borderRadius: 20, background: needsAttention ? COLOR.warningSurface : COLOR.selected, color: needsAttention ? COLOR.warning : COLOR.accent, fontSize: 10, fontWeight: 700 }}>{needsAttention ? <Clock3 size={13} /> : <BadgeCheck size={13} />}{needsAttention ? `${needsAttention}개 검토 필요` : '모든 샘플 확인 완료'}</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {records.map((record) => {
            const complete = record.state === '확인 완료';
            return <div key={record.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(145px, 1fr) minmax(100px, .8fr) minmax(110px, .7fr) auto', alignItems: 'center', gap: 10, padding: 11, border: `1px solid ${COLOR.border}`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLOR.text, fontSize: 12, fontWeight: 650 }}>{complete ? <CheckCircle2 size={16} color={COLOR.accent} aria-hidden="true" /> : <Clock3 size={16} color={COLOR.warning} aria-hidden="true" />}{record.name}</div>
              <span style={{ color: complete ? COLOR.accent : COLOR.warning, fontSize: 11, fontWeight: 650 }}>{record.state}</span>
              <span style={{ color: COLOR.muted, fontSize: 10 }}>유효기간 · {record.expires}</span>
              <QuietButton pressed={complete} onClick={() => { changeState(record.id); setMessage(`${record.name} 상태를 전환했습니다.`); }}>{complete ? '검토로 변경' : '확인 완료로 변경'}</QuietButton>
            </div>;
          })}
        </div>
        <p role="status" aria-live="polite" style={{ minHeight: 16, margin: '10px 0 0', color: COLOR.muted, fontSize: 11 }}>{message}</p>
      </Panel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10, marginTop: 12 }}>
        <Panel style={{ display: 'flex', alignItems: 'center', gap: 9 }}><MapPin size={16} color={COLOR.accent} aria-hidden="true" /><div><Label>데이터 보관 지역</Label><strong style={{ display: 'block', marginTop: 4, color: COLOR.text, fontSize: 11 }}>대한민국 · 서울 리전</strong></div></Panel>
        <Panel style={{ display: 'flex', alignItems: 'center', gap: 9 }}><Mail size={16} color={COLOR.accent} aria-hidden="true" /><div><Label>담당 연락처</Label><strong style={{ display: 'block', marginTop: 4, color: COLOR.text, fontSize: 11 }}>정하늘 · vendor@oceanwave.example</strong></div></Panel>
      </div>
    </>
  );
}

export function PlannedApplicationBlock({ variant, density = 'normal' }: PlannedApplicationBlockProps) {
  let preview: React.ReactNode;
  switch (variant) {
    case 'profile-enterprise-account':
      preview = <EnterpriseAccountPreview density={density} />;
      break;
    case 'profile-security-identity':
      preview = <SecurityIdentityPreview density={density} />;
      break;
    case 'profile-personal-preferences':
      preview = <PersonalPreferencesPreview density={density} />;
      break;
    case 'profile-vendor-compliance':
      preview = <VendorCompliancePreview density={density} />;
      break;
    case 'profile-engineer-scorecard':
    default:
      preview = <EngineerProfilePreview density={density} />;
  }
  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: density === 'compact' ? 12 : density === 'relaxed' ? 24 : 18, borderRadius: 18, background: COLOR.surface, color: COLOR.text, fontFamily: 'inherit' }}>
      <SampleNotice />
      {preview}
    </div>
  );
}

export default PlannedApplicationBlock;
