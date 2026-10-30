import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Smartphone,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Building2,
  Globe,
  Terminal,
  Laptop,
} from 'lucide-react';

export type AuthMode =
  | 'flux-card'
  | 'split-glass'
  | 'workspace-signup'
  | 'mfa-verify'
  | 'sudo-recovery';

interface AuthBlockProps {
  initialMode?: AuthMode;
  density?: 'compact' | 'normal' | 'relaxed';
}

const AUTH_MODES: {
  id: AuthMode;
  index: number;
  label: string;
  pkg: string;
  subtitle: string;
}[] = [
  {
    id: 'flux-card',
    index: 1,
    label: 'KLIC 블루 글로우 카드 로그인',
    pkg: 'KLIC/auth-1',
    subtitle: 'KLIC 3D 리본 로고 · 아이스 블루 입력 필드 · Google/GitHub 소셜 로그인을 갖춘 클래식 로그인 카드',
  },
  {
    id: 'split-glass',
    index: 2,
    label: '스플릿 아키텍처 그리드 & 3D 리본 로그인',
    pkg: 'KLIC/auth-2',
    subtitle: '아키텍처 그리드 배경 · 좌측 미니멀 로그인 폼 · 우측 3D 글래스 리본 아트 패널 레이아웃',
  },
  {
    id: 'workspace-signup',
    index: 3,
    label: 'B2B 워크스페이스 계정 만들기 & 팀 가입',
    pkg: 'KLIC/auth-3',
    subtitle: '조직 도메인 슬러그 실시간 중복 확인 · 비밀번호 보안 강도 미터기 · 소셜 원클릭 가입',
  },
  {
    id: 'mfa-verify',
    index: 4,
    label: '2단계 인증 (2FA / OTP) & 패스키 검증',
    pkg: 'KLIC/auth-4',
    subtitle: '6자리 OTP 코드 자동 포커스 입력기 · 생체인증 패스키(WebAuthn) · 백업 복구 코드 인증',
  },
  {
    id: 'sudo-recovery',
    index: 5,
    label: '비밀번호 재설정 & 고위험 Sudo 재인증',
    pkg: 'KLIC/auth-5',
    subtitle: '비밀번호 복구 매직링크 발송 및 프로덕션 시크릿 조회 직전 관리자 Sudo 재검증 프롬프트',
  },
];

/** KLIC 3D Ribbon 'F' Logo + LUX Wordmark (Screenshot 1 exact style) */
function FluxRibbonBrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.8 : size === 'lg' ? 1.15 : 1;
  return (
    <div
      className="inline-flex items-center select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      <svg
        width="44"
        height="48"
        viewBox="0 0 44 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className=" -mr-1"
      >
        <defs>
          <linearGradient id="fluxTopBlue" x1="4" y1="2" x2="40" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" />
            <stop offset="45%" stopColor="var(--klic-component-block-color-accent)" />
            <stop offset="100%" stopColor="var(--klic-component-block-color-accent)" />
          </linearGradient>
          <linearGradient id="fluxMidSilver" x1="4" y1="16" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--klic-component-block-color-border)" />
            <stop offset="50%" stopColor="var(--klic-component-block-color-panel)" />
            <stop offset="100%" stopColor="var(--klic-component-block-color-soft)" />
          </linearGradient>
          <linearGradient id="fluxStemDark" x1="4" y1="18" x2="18" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--klic-component-block-color-accent)" />
            <stop offset="45%" stopColor="var(--klic-component-block-color-border)" />
            <stop offset="100%" stopColor="var(--klic-component-block-color-control-border)" />
          </linearGradient>
        </defs>
        {/* Back Dark Fold */}
        <path
          d="M6 12C6 7.5 9.5 4 14 4H39C37.5 10.5 32.5 14 25 14H15C10.5 14 7 17.5 7 22V12Z"
          fill="url(#fluxTopBlue)"
        />
        {/* Stem Base Shadow */}
        <path
          d="M6 20C6 15.5 9.5 12 14 12V43C14 44.5 12.8 45.5 11.2 45.5H6V20Z"
          fill="url(#fluxStemDark)"
        />
        {/* Middle White/Silver Ribbon Fold */}
        <path
          d="M6 29C6 23.5 10.5 19 16 19H31C29.5 25 25 28.5 18.5 28.5H14C9.5 28.5 6 32 6 36.5V29Z"
          fill="url(#fluxMidSilver)"
        />
        {/* Subtle Specular Edge */}
        <path
          d="M6 12C6 7.5 9.5 4 14 4H39"
          stroke="var(--klic-component-block-color-accent)"
          strokeWidth="0.75"
          strokeOpacity="0.6"
        />
      </svg>
      <span className="text-[35px] font-black tracking-[-0.04em] text-zinc-950 leading-none font-sans">
        LUX
      </span>
    </div>
  );
}

/** Authentic 4-Color Google G Icon */
function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="var(--klic-component-block-color-accent)"
        d="M23.49 12.275c0-.85-.075-1.675-.215-2.475H12v4.69h6.45c-.28 1.49-1.125 2.755-2.395 3.605v3h3.875c2.265-2.085 3.56-5.16 3.56-8.82z"
      />
      <path
        fill="var(--klic-component-block-color-accent)"
        d="M12 24c3.24 0 5.955-1.075 7.94-2.905l-3.875-3c-1.075.72-2.45 1.15-4.065 1.15-3.125 0-5.77-2.11-6.715-4.945H1.275v3.095C3.25 21.315 7.31 24 12 24z"
      />
      <path
        fill="var(--klic-component-block-color-warning)"
        d="M5.285 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.605H1.275C.465 8.22 0 10.055 0 12s.465 3.78 1.275 5.395l4.01-3.095z"
      />
      <path
        fill="var(--klic-component-block-color-danger)"
        d="M12 4.75c1.76 0 3.345.605 4.59 1.795l3.44-3.44C17.95 1.16 15.235 0 12 0 7.31 0 3.25 2.685 1.275 6.605l4.01 3.095C6.23 6.86 8.875 4.75 12 4.75z"
      />
    </svg>
  );
}

/** GitHub Octocat Icon */
function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
      />
    </svg>
  );
}

/** Apple Logo Icon */
function AppleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/**
 * MODE 1: KLIC 블루 글로우 카드 로그인 (Exact Screenshot 1 style)
 */
function FluxClassicCardLoginView({
  onSwitchMode,
}: {
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [email, setEmail] = useState('admin@flux.local');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 450);
  };

  return (
    <div className="relative min-h-[700px] w-full rounded-2xl border border-zinc-200/80 bg-[var(--klic-component-block-color-panel)] overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Soft ambient sky-blue glow behind the card matching Screenshot 1 */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-75"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb,var(--klic-component-block-color-selected) 65%,transparent) 0%, color-mix(in srgb,var(--klic-component-block-color-soft) 38%,transparent) 48%, color-mix(in srgb,var(--klic-component-block-color-panel) 0%,transparent) 75%)',
        }}
      />

      {/* Demo State Quick Bar (top-right subtle pill) */}
      <div className="relative z-10 mb-6 flex items-center gap-1.5 bg-white/85 backdrop-blur border border-zinc-200/80 rounded-full px-3 py-1 shadow-xs text-[11px] text-klic-muted">
        <span className="font-semibold text-zinc-800 mr-1">데모 프리셋:</span>
        <button
          type="button"
          onClick={() => {
            setEmail('admin@flux.local');
            setPassword('••••••••••');
            setStatus('idle');
            setSocialNotice(null);
          }}
          className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
            status === 'idle' && email === 'admin@flux.local'
              ? 'bg-blue-600 text-klic-on-emphasis'
              : 'hover:bg-zinc-100 text-klic-muted'
          }`}
        >
          기본 관리자
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail('sso.member@enterprise.kr');
            setPassword('••••••••••••');
            setStatus('idle');
            setSocialNotice('SAML 2.0 엔터프라이즈 도메인(enterprise.kr)이 감지되었습니다.');
          }}
          className="px-2 py-0.5 rounded-full font-medium hover:bg-zinc-100 text-klic-muted transition-colors"
        >
          SSO 도메인 감지
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail('');
            setPassword('');
            setStatus('error');
          }}
          className="px-2 py-0.5 rounded-full font-medium hover:bg-zinc-100 text-klic-muted transition-colors"
        >
          입력 오류 상태
        </button>
      </div>

      {/* Top KLIC Ribbon Brand Logo */}
      <div className="relative z-10 flex flex-col items-center mb-7">
        <FluxRibbonBrandLogo size="md" />
        <h2 className="mt-6 text-[24px] font-bold tracking-tight text-zinc-900">
          계정에 로그인
        </h2>
      </div>

      {/* Main White Auth Card matching Screenshot 1 */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[16px] border border-[color:var(--klic-component-block-color-soft)] shadow-[0_20px_60px_-15px_color-mix(in_srgb,var(--klic-component-block-color-accent)_12%,transparent)] px-9 py-9">
        {status === 'success' ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-zinc-900">
                인증 성공 · 세션이 시작되었습니다
              </h3>
              <p className="text-[13px] text-klic-muted mt-1">
                <span className="font-mono font-semibold text-zinc-700">{email}</span> 계정으로 로그인되었습니다.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onSwitchMode('mfa-verify')}
                className="px-3.5 py-2 rounded-lg bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[12px] font-semibold hover:bg-[var(--klic-component-block-color-accent)] transition-colors"
              >
                2단계 인증(2FA) 화면으로 이동
              </button>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="px-3.5 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-[12px] font-semibold hover:bg-zinc-50 transition-colors"
              >
                다시 로그인
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[12px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-blue-600" />
                <span>이메일 또는 비밀번호를 정확히 입력해 주세요.</span>
              </div>
            )}

            {socialNotice && (
              <div className="p-3 rounded-lg bg-blue-50/90 border border-blue-200 text-blue-800 text-[12px] flex items-center justify-between gap-2">
                <span className="font-medium">{socialNotice}</span>
                <button
                  type="button"
                  onClick={() => setSocialNotice(null)}
                  className="text-[11px] font-semibold underline shrink-0"
                >
                  닫기
                </button>
              </div>
            )}

            {/* 이메일 또는 사용자 이름 */}
            <div>
              <label className="block text-[13px] font-medium text-zinc-800 mb-2">
                이메일 또는 사용자 이름
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="admin@flux.local"
                className="w-full h-[44px] px-3.5 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[14px] text-zinc-900 placeholder:text-klic-muted focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)] focus:ring-2 focus:ring-[color:var(--klic-component-block-color-accent)]/20 transition-all"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-[13px] font-medium text-zinc-800 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="••••••••"
                  className="w-full h-[44px] pl-3.5 pr-10 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[14px] text-zinc-900 placeholder:text-klic-muted focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)] focus:ring-2 focus:ring-[color:var(--klic-component-block-color-accent)]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-klic-muted hover:text-zinc-700"
                  title={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 로그인 상태 유지 & 비밀번호를 잊으셨나요? */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-[color:var(--klic-component-block-color-accent)] focus:ring-[color:var(--klic-component-block-color-accent)]"
                />
                <span className="text-[13px] text-zinc-700">로그인 상태 유지</span>
              </label>
              <button
                type="button"
                onClick={() => onSwitchMode('sudo-recovery')}
                className="text-[13px] font-medium text-[color:var(--klic-component-block-color-accent)] hover:text-[color:var(--klic-component-block-color-accent)] hover:underline"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* 로그인 Primary Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full h-[44px] rounded-[8px] bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] active:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {status === 'submitting' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>로그인 처리 중...</span>
                </>
              ) : (
                <span>로그인</span>
              )}
            </button>

            {/* 또는 다음으로 계속 Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full border-t border-[color:var(--klic-component-block-color-border)]" />
              <span className="relative bg-white px-3.5 text-[12px] text-klic-muted whitespace-nowrap">
                또는 다음으로 계속
              </span>
            </div>

            {/* Google로 계속하기 & GitHub로 계속하기 */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  setSocialNotice('Google Workspace OAuth 2.0 인증 팝업이 준비되었습니다.')
                }
                className="w-full h-[44px] rounded-[8px] bg-white hover:bg-zinc-50 border border-[color:var(--klic-component-block-color-soft)] text-[13px] font-medium text-zinc-800 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Google로 계속하기</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSocialNotice('GitHub Enterprise OAuth 인증 세션이 연결되었습니다.')
                }
                className="w-full h-[44px] rounded-[8px] bg-white hover:bg-zinc-50 border border-[color:var(--klic-component-block-color-soft)] text-[13px] font-medium text-zinc-800 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <GitHubIcon className="w-4 h-4 text-zinc-900" />
                <span>GitHub로 계속하기</span>
              </button>
            </div>

            {/* 하단 계정 만들기 링크 */}
            <div className="pt-2 text-center text-[13px] text-klic-muted">
              계정이 없으신가요?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('workspace-signup')}
                className="font-semibold text-[color:var(--klic-component-block-color-accent)] hover:text-[color:var(--klic-component-block-color-accent)] hover:underline"
              >
                계정 만들기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * MODE 2: 스플릿 아키텍처 그리드 & 3D 리본 로그인 (Exact Screenshot 2 style)
 */
function SplitGridGlassRibbonLoginView({
  onSwitchMode,
}: {
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [artTheme, setArtTheme] = useState<'ice' | 'sapphire' | 'aurora'>('ice');
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignedInUser(username.trim() || 'lemon.kim@klic.dev');
  };

  return (
    <div className="relative min-h-[720px] w-full rounded-2xl border border-zinc-200/90 bg-white overflow-hidden flex items-center justify-center p-6 lg:p-12">
      {/* Subtle Architectural Square Grid Pattern + Scattered Tonal Cells matching Screenshot 2 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb,var(--klic-component-block-color-soft) 45%,transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb,var(--klic-component-block-color-soft) 45%,transparent) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
        }}
      />
      {/* Subtle decorative filled grid cells like Screenshot 2 */}
      <div className="pointer-events-none absolute top-[56px] left-[224px] w-[56px] h-[56px] bg-zinc-100/70" />
      <div className="pointer-events-none absolute top-[112px] left-[168px] w-[56px] h-[56px] bg-zinc-100/50" />
      <div className="pointer-events-none absolute top-[112px] left-[392px] w-[56px] h-[56px] bg-zinc-100/60" />
      <div className="pointer-events-none absolute bottom-[112px] left-[112px] w-[56px] h-[56px] bg-zinc-100/60" />
      <div className="pointer-events-none absolute bottom-[56px] left-[336px] w-[56px] h-[56px] bg-zinc-100/70" />

      <div className="relative z-10 w-full max-w-[1040px] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Minimalist Sign-in Form */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-[360px]">
            {/* Dark Squircle Icon + Heading */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-10 h-10 rounded-[11px] bg-klic-inverse text-klic-on-emphasis flex items-center justify-center shadow-sm mb-4">
                <span className="text-[17px] font-black tracking-tighter">U</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-tight text-zinc-950">
                KLIC에 로그인
              </h2>
              <p className="text-[13px] text-klic-muted mt-1">
                다시 오신 것을 환영합니다.
              </p>
            </div>

            {signedInUser ? (
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-zinc-900">
                    워크스페이스 인증 완료
                  </div>
                  <div className="text-[12px] text-klic-muted mt-1 font-mono">
                    {signedInUser}
                  </div>
                </div>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSignedInUser(null)}
                    className="px-3.5 py-1.5 rounded-lg bg-klic-inverse text-klic-on-emphasis text-[12px] font-medium hover:bg-klic-inverse"
                  >
                    폼으로 돌아가기
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email or username */}
                <div>
                  <label className="block text-[12px] font-semibold text-zinc-800 mb-1.5">
                    이메일 또는 사용자 이름
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="이메일 또는 사용자 이름"
                    className="w-full h-[38px] px-3 rounded-[8px] bg-white border border-zinc-200/90 text-[13px] text-zinc-900 placeholder:text-klic-muted shadow-2xs focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>

                {/* Password with right-aligned Forgot password? */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-semibold text-zinc-800">
                      비밀번호
                    </label>
                    <button
                      type="button"
                      onClick={() => onSwitchMode('sudo-recovery')}
                      className="text-[12px] text-klic-muted hover:text-zinc-900 transition-colors"
                    >
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="w-full h-[38px] pl-3 pr-9 rounded-[8px] bg-white border border-zinc-200/90 text-[13px] text-zinc-900 placeholder:text-klic-muted shadow-2xs focus:outline-none focus:border-zinc-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klic-muted hover:text-zinc-700"
                      title="비밀번호 표시 전환"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary Obsidian Sign in Button */}
                <button
                  type="submit"
                  className="w-full h-[38px] rounded-[8px] bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis text-[13px] font-semibold shadow-xs transition-colors cursor-pointer mt-1"
                >
                  로그인
                </button>

                {/* Or continue with divider */}
                <div className="relative py-2.5 flex items-center justify-center">
                  <div className="w-full border-t border-zinc-200/90" />
                  <span className="relative bg-white px-3 text-[11px] text-klic-muted whitespace-nowrap">
                    또는 다음으로 계속
                  </span>
                </div>

                {/* 2-Column Google & Apple Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSignedInUser('google-oauth@klic.dev')}
                    className="h-[38px] rounded-[8px] bg-white hover:bg-zinc-50 border border-zinc-200/90 text-[13px] font-semibold text-zinc-800 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignedInUser('apple-id@klic.dev')}
                    className="h-[38px] rounded-[8px] bg-white hover:bg-zinc-50 border border-zinc-200/90 text-[13px] font-semibold text-zinc-800 flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
                  >
                    <AppleIcon className="w-4 h-4 text-zinc-950" />
                    <span>Apple</span>
                  </button>
                </div>

                {/* Bottom Need an account? Sign up */}
                <div className="pt-3 text-center text-[12px] text-klic-muted">
                  계정이 없으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => onSwitchMode('workspace-signup')}
                    className="font-semibold text-zinc-900 hover:underline"
                  >
                    회원가입
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Tall Rounded-3xl Flowing 3D Ice-Blue Glass Ribbon Artwork matching Screenshot 2 */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[440px] h-[580px] rounded-[22px] border border-zinc-200/80 shadow-sm overflow-hidden select-none">
            {/* Base soft gradient backdrop */}
            <div
              className="absolute inset-0 transition-all duration-500"
              style={{
                background:
                  artTheme === 'ice'
                    ? 'linear-gradient(145deg, var(--klic-component-block-color-soft) 0%, var(--klic-component-block-color-soft) 45%, var(--klic-component-block-color-border) 100%)'
                    : artTheme === 'sapphire'
                    ? 'linear-gradient(145deg, var(--klic-component-block-color-border) 0%, var(--klic-component-block-color-soft) 48%, var(--klic-component-block-color-selected) 100%)'
                    : 'linear-gradient(145deg, var(--klic-component-block-color-border) 0%, var(--klic-component-block-color-soft) 50%, var(--klic-component-block-color-soft) 100%)',
              }}
            />

            {/* Sculptural 3D Glass Ribbon Curves SVG matching Screenshot 2 */}
            <svg
              viewBox="0 0 440 580"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full object-cover"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="glassCurve1" x1="0" y1="0" x2="440" y2="580" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-panel)" stopOpacity="0.88" />
                  <stop offset="50%" stopColor="var(--klic-component-block-color-soft)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-border)" stopOpacity="0.78" />
                </linearGradient>
                <linearGradient id="glassCurve2" x1="420" y1="20" x2="60" y2="540" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-panel)" stopOpacity="0.92" />
                  <stop offset="55%" stopColor="var(--klic-component-block-color-border)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-panel)" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="glassStroke" x1="0" y1="0" x2="440" y2="580" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--klic-component-block-color-panel)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--klic-component-block-color-panel)" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Sweeping Left-to-Bottom Ribbon */}
              <path
                d="M-40 -20 C180 80, 340 280, 390 600 L-40 600 Z"
                fill="url(#glassCurve1)"
              />
              <path
                d="M-40 -20 C180 80, 340 280, 390 600"
                stroke="url(#glassStroke)"
                strokeWidth="2.5"
              />

              {/* Sweeping Top-Right Loop */}
              <path
                d="M250 -40 C240 160, 360 280, 480 260 L480 -40 Z"
                fill="url(#glassCurve2)"
              />
              <path
                d="M250 -40 C240 160, 360 280, 480 260"
                stroke="var(--klic-component-block-color-panel)"
                strokeWidth="2"
                strokeOpacity="0.85"
              />

              {/* Central S-Curve Translucent Ribbon */}
              <path
                d="M320 -30 C160 120, 290 390, 210 610 L460 610 L460 -30 Z"
                fill="url(#glassCurve2)"
                fillOpacity="0.55"
              />
              <path
                d="M320 -30 C160 120, 290 390, 210 610"
                stroke="var(--klic-component-block-color-panel)"
                strokeWidth="2.2"
                strokeOpacity="0.9"
              />

              {/* Upper Right Inner Highlight Ring */}
              <path
                d="M450 30 C350 20, 310 130, 395 235"
                stroke="var(--klic-component-block-color-panel)"
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              {/* Bottom Left Soft Arc */}
              <path
                d="M-30 350 C140 330, 310 410, 460 360"
                stroke="var(--klic-component-block-color-panel)"
                strokeWidth="1.5"
                strokeOpacity="0.65"
              />
            </svg>

            {/* Subtle Floating Theme Switcher inside the art panel bottom-right */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 rounded-full bg-white/65 backdrop-blur-md border border-white/80 px-2.5 py-1 text-[11px] text-zinc-700 shadow-xs">
              {(['ice', 'sapphire', 'aurora'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setArtTheme(t)}
                  className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                    artTheme === t
                      ? 'bg-klic-inverse text-klic-on-emphasis'
                      : 'hover:bg-white/80 text-klic-muted'
                  }`}
                >
                  {t === 'ice' ? '아이스 펄' : t === 'sapphire' ? '사파이어' : '오로라'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MODE 3: B2B 워크스페이스 계정 만들기 & 팀 가입 (KLIC/auth-3)
 */
function WorkspaceSignupView({
  onSwitchMode,
}: {
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [fullName, setFullName] = useState('김레몬 (Lemon Kim)');
  const [workEmail, setWorkEmail] = useState('lemon.kim@klic.dev');
  const [workspaceSlug, setWorkspaceSlug] = useState('flux-korea-hq');
  const [password, setPassword] = useState('FluxStudio!2026');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [created, setCreated] = useState(false);

  const checks = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password) && /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const strengthScore = Object.values(checks).filter(Boolean).length;

  return (
    <div className="relative min-h-[700px] w-full rounded-2xl border border-zinc-200/80 bg-[var(--klic-component-block-color-panel)] overflow-hidden flex flex-col items-center justify-center px-4 py-10">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full blur-3xl opacity-70"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb,var(--klic-component-block-color-selected) 60%,transparent) 0%, color-mix(in srgb,var(--klic-component-block-color-soft) 32%,transparent) 50%, color-mix(in srgb,var(--klic-component-block-color-panel) 0%,transparent) 75%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center mb-6">
        <FluxRibbonBrandLogo size="sm" />
        <h2 className="mt-4 text-[22px] font-bold tracking-tight text-zinc-900">
          새 워크스페이스 계정 만들기
        </h2>
        <p className="text-[13px] text-klic-muted mt-1">
          팀 전용 도메인 슬러그와 관리자 계정을 1분 만에 개설하세요
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[16px] border border-[color:var(--klic-component-block-color-soft)] shadow-[0_20px_60px_-15px_color-mix(in_srgb,var(--klic-component-block-color-accent)_12%,transparent)] px-8 py-8">
        {created ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[color:var(--klic-component-block-color-accent)] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-zinc-900">
                워크스페이스 개설이 완료되었습니다!
              </h3>
              <p className="text-[13px] text-klic-muted mt-1">
                <span className="font-mono font-semibold text-[color:var(--klic-component-block-color-accent)]">
                  flux.local/{workspaceSlug}
                </span>{' '}
                전용 인스턴스가 준비되었습니다.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onSwitchMode('flux-card')}
                className="px-4 py-2 rounded-lg bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[13px] font-semibold hover:bg-[var(--klic-component-block-color-accent)]"
              >
                생성된 계정으로 로그인
              </button>
              <button
                type="button"
                onClick={() => setCreated(false)}
                className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-[13px] font-semibold hover:bg-zinc-50"
              >
                정보 수정
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCreated(true);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-medium text-zinc-800 mb-1.5">
                  이름 및 직함
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-[40px] px-3 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[13px] text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-zinc-800 mb-1.5">
                  업무용 이메일
                </label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full h-[40px] px-3 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[13px] text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)]"
                />
              </div>
            </div>

            {/* 워크스페이스 URL 슬러그 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-medium text-zinc-800">
                  워크스페이스 URL 슬러그
                </label>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 사용 가능한 주소
                </span>
              </div>
              <div className="flex items-center h-[40px] rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] overflow-hidden focus-within:border-[color:var(--klic-component-block-color-accent)]">
                <span className="px-3 text-[12px] font-mono text-klic-muted bg-zinc-100/80 border-r border-[color:var(--klic-component-block-color-border)] h-full flex items-center">
                  app.flux.local/
                </span>
                <input
                  type="text"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value)}
                  className="w-full px-3 bg-transparent text-[13px] font-mono font-semibold text-zinc-900 focus:outline-none"
                />
              </div>
            </div>

            {/* 비밀번호 & 강도 미터기 */}
            <div>
              <label className="block text-[12px] font-medium text-zinc-800 mb-1.5">
                마스터 비밀번호 설정
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[13px] font-mono text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)]"
              />
              {/* 4-segment strength bar */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 rounded-full transition-colors ${
                      strengthScore >= level
                        ? strengthScore === 4
                          ? 'bg-blue-500'
                          : 'bg-[var(--klic-component-block-color-accent)]'
                        : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px]">
                <span className={checks.length ? 'text-blue-700 font-medium' : 'text-klic-muted'}>
                  ✓ 10자 이상 입력
                </span>
                <span className={checks.upper ? 'text-blue-700 font-medium' : 'text-klic-muted'}>
                  ✓ 대·소문자 조합
                </span>
                <span className={checks.number ? 'text-blue-700 font-medium' : 'text-klic-muted'}>
                  ✓ 숫자 포함
                </span>
                <span className={checks.special ? 'text-blue-700 font-medium' : 'text-klic-muted'}>
                  ✓ 특수기호 포함
                </span>
              </div>
            </div>

            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-[color:var(--klic-component-block-color-accent)]"
              />
              <span className="text-[12px] text-klic-muted leading-relaxed">
                KLIC 엔터프라이즈 서비스 이용약관, 개인정보 처리방침 및 SOC2 데이터 보안 정책에 동의합니다.
              </span>
            </label>

            <button
              type="submit"
              className="w-full h-[42px] rounded-[8px] bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              계정 만들기
            </button>

            <div className="pt-2 text-center text-[13px] text-klic-muted">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('flux-card')}
                className="font-semibold text-[color:var(--klic-component-block-color-accent)] hover:underline"
              >
                계정에 로그인
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * MODE 4: 2단계 인증 (2FA / OTP) & 패스키 검증 (KLIC/auth-4)
 */
function MfaTotpPasskeyVerifyView({
  onSwitchMode,
}: {
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [digits, setDigits] = useState<string[]>(['4', '8', '2', '9', '1', '0']);
  const [method, setMethod] = useState<'totp' | 'passkey' | 'recovery'>('totp');
  const [trustDevice, setTrustDevice] = useState(true);
  const [verified, setVerified] = useState(false);

  const handleDigitChange = (idx: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    setDigits((prev) => prev.map((d, i) => (i === idx ? clean : d)));
  };

  return (
    <div className="relative min-h-[700px] w-full rounded-2xl border border-zinc-200/80 bg-[var(--klic-component-block-color-panel)] overflow-hidden flex flex-col items-center justify-center px-4 py-10">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-75"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb,var(--klic-component-block-color-selected) 65%,transparent) 0%, color-mix(in srgb,var(--klic-component-block-color-soft) 35%,transparent) 50%, color-mix(in srgb,var(--klic-component-block-color-panel) 0%,transparent) 75%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center mb-6">
        <FluxRibbonBrandLogo size="sm" />
        <h2 className="mt-4 text-[22px] font-bold tracking-tight text-zinc-900">
          2단계 보안 인증 (2FA)
        </h2>
        <div className="mt-1.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[12px] text-zinc-700">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-mono font-medium">admin@flux.local</span>
          <button
            type="button"
            onClick={() => onSwitchMode('flux-card')}
            className="text-[color:var(--klic-component-block-color-accent)] font-semibold hover:underline ml-1"
          >
            변경
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[16px] border border-[color:var(--klic-component-block-color-soft)] shadow-[0_20px_60px_-15px_color-mix(in_srgb,var(--klic-component-block-color-accent)_12%,transparent)] px-8 py-8">
        {/* 인증 방식 탭 */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100 border border-zinc-200/70 mb-6 text-[12px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setMethod('totp');
              setVerified(false);
            }}
            className={`py-1.5 rounded-lg transition-all ${
              method === 'totp'
                ? 'bg-white text-zinc-900 shadow-2xs'
                : 'text-klic-muted hover:text-zinc-800'
            }`}
          >
            OTP 인증 앱
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('passkey');
              setVerified(false);
            }}
            className={`py-1.5 rounded-lg transition-all ${
              method === 'passkey'
                ? 'bg-white text-zinc-900 shadow-2xs'
                : 'text-klic-muted hover:text-zinc-800'
            }`}
          >
            생체 패스키
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('recovery');
              setVerified(false);
            }}
            className={`py-1.5 rounded-lg transition-all ${
              method === 'recovery'
                ? 'bg-white text-zinc-900 shadow-2xs'
                : 'text-klic-muted hover:text-zinc-800'
            }`}
          >
            복구 코드
          </button>
        </div>

        {verified ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-zinc-900">
                2단계 보안 검증이 완료되었습니다
              </h3>
              <p className="text-[12px] text-klic-muted mt-1">
                신뢰할 수 있는 기기 토큰이 발급되었으며 워크스페이스로 이동합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVerified(false)}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-[12px] font-semibold hover:bg-zinc-50"
            >
              다시 테스트하기
            </button>
          </div>
        ) : method === 'totp' ? (
          <div className="space-y-5">
            <p className="text-[13px] text-klic-muted text-center leading-relaxed">
              Google Authenticator 또는 1Password 앱에 표시된{' '}
              <span className="font-semibold text-zinc-900">6자리 인증 코드</span>를 입력하세요.
            </p>

            {/* 6자리 숫자 박스 */}
            <div className="grid grid-cols-6 gap-2">
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  className="h-[50px] text-center text-[18px] font-mono font-bold rounded-[10px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)] focus:ring-2 focus:ring-[color:var(--klic-component-block-color-accent)]/20"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <label className="inline-flex items-center gap-2 cursor-pointer text-zinc-700">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-[color:var(--klic-component-block-color-accent)]"
                />
                <span>이 브라우저를 30일 동안 신뢰함</span>
              </label>
              <button
                type="button"
                onClick={() => setDigits(['7', '3', '9', '2', '0', '4'])}
                className="text-[color:var(--klic-component-block-color-accent)] font-medium hover:underline"
              >
                새 코드 채우기
              </button>
            </div>

            <button
              type="button"
              onClick={() => setVerified(true)}
              className="w-full h-[44px] rounded-[8px] bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              인증 코드 확인
            </button>
          </div>
        ) : method === 'passkey' ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[color:var(--klic-component-block-color-accent)] flex items-center justify-center mx-auto">
              <Fingerprint className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-zinc-900">
                Touch ID 또는 하드웨어 보안 키 사용
              </h3>
              <p className="text-[12px] text-klic-muted mt-1">
                기기에 등록된 WebAuthn 생체인증 패스키로 비밀번호 없이 즉시 검증합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVerified(true)}
              className="w-full h-[44px] rounded-[8px] bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              패스키로 즉시 인증하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-[13px] font-medium text-zinc-800">
              백업 복구 코드 (16자리)
            </label>
            <input
              type="text"
              defaultValue="KLIC-9482-KLPQ-2026"
              className="w-full h-[44px] px-3.5 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[14px] font-mono font-semibold text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)]"
            />
            <button
              type="button"
              onClick={() => setVerified(true)}
              className="w-full h-[44px] rounded-[8px] bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              복구 코드로 로그인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MODE 5: 비밀번호 재설정 & 고위험 작업 Sudo 재인증 (KLIC/auth-5)
 */
function PasswordRecoveryAndSudoView({
  onSwitchMode,
}: {
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const [subTab, setSubTab] = useState<'recovery' | 'sudo'>('recovery');
  const [recoveryEmail, setRecoveryEmail] = useState('admin@flux.local');
  const [recoverySent, setRecoverySent] = useState(false);
  const [sudoPassword, setSudoPassword] = useState('••••••••••');
  const [sudoApproved, setSudoApproved] = useState(false);

  return (
    <div className="relative min-h-[700px] w-full rounded-2xl border border-zinc-200/80 bg-[var(--klic-component-block-color-panel)] overflow-hidden flex flex-col items-center justify-center px-4 py-10">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-3xl opacity-75"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb,var(--klic-component-block-color-selected) 65%,transparent) 0%, color-mix(in srgb,var(--klic-component-block-color-soft) 35%,transparent) 50%, color-mix(in srgb,var(--klic-component-block-color-panel) 0%,transparent) 75%)',
        }}
      />

      {/* Mode Switch Pill */}
      <div className="relative z-10 mb-6 inline-flex items-center p-1 rounded-xl bg-white border border-zinc-200 shadow-2xs text-[12px] font-semibold">
        <button
          type="button"
          onClick={() => setSubTab('recovery')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            subTab === 'recovery'
              ? 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis'
              : 'text-klic-muted hover:text-zinc-900'
          }`}
        >
          비밀번호 찾기 / 재설정
        </button>
        <button
          type="button"
          onClick={() => setSubTab('sudo')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            subTab === 'sudo'
              ? 'bg-klic-inverse text-klic-on-emphasis'
              : 'text-klic-muted hover:text-zinc-900'
          }`}
        >
          고위험 작업 Sudo 재인증
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center mb-6">
        <FluxRibbonBrandLogo size="sm" />
        <h2 className="mt-4 text-[22px] font-bold tracking-tight text-zinc-900">
          {subTab === 'recovery' ? '비밀번호 재설정' : '관리자 Sudo 권한 재인증'}
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[16px] border border-[color:var(--klic-component-block-color-soft)] shadow-[0_20px_60px_-15px_color-mix(in_srgb,var(--klic-component-block-color-accent)_12%,transparent)] px-8 py-8">
        {subTab === 'recovery' ? (
          recoverySent ? (
            <div className="py-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-[color:var(--klic-component-block-color-accent)] flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-zinc-900">
                  재설정 링크가 발송되었습니다
                </h3>
                <p className="text-[13px] text-klic-muted mt-1">
                  <span className="font-mono font-semibold text-zinc-800">{recoveryEmail}</span>
                  으로 15분간 유효한 비밀번호 복구 링크를 보냈습니다.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onSwitchMode('flux-card')}
                  className="px-4 py-2 rounded-lg bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[13px] font-semibold hover:bg-[var(--klic-component-block-color-accent)]"
                >
                  로그인 화면으로 돌아가기
                </button>
                <button
                  type="button"
                  onClick={() => setRecoverySent(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-[13px] font-semibold hover:bg-zinc-50"
                >
                  재발송
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRecoverySent(true);
              }}
              className="space-y-4"
            >
              <p className="text-[13px] text-klic-muted leading-relaxed">
                가입하신 계정 이메일을 입력하시면 비밀번호를 즉시 재설정할 수 있는 보안 매직링크를 보내드립니다.
              </p>
              <div>
                <label className="block text-[13px] font-medium text-zinc-800 mb-2">
                  이메일 또는 사용자 이름
                </label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full h-[44px] px-3.5 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[14px] text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)]"
                />
              </div>
              <button
                type="submit"
                className="w-full h-[44px] rounded-[8px] bg-[var(--klic-component-block-color-accent)] hover:bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-colors cursor-pointer"
              >
                재설정 링크 보내기
              </button>
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => onSwitchMode('flux-card')}
                  className="text-[13px] font-semibold text-[color:var(--klic-component-block-color-accent)] hover:underline"
                >
                  ← 계정에 로그인으로 돌아가기
                </button>
              </div>
            </form>
          )
        ) : sudoApproved ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-zinc-900">
                Sudo 보안 세션이 활성화되었습니다 (15분)
              </h3>
              <p className="text-[12px] text-klic-muted mt-1">
                프로덕션 마스터 시크릿 키(`sk_live_99482_flux_prod`) 열람 및 웹훅 변경이 허용되었습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSudoApproved(false)}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-[12px] font-semibold hover:bg-zinc-50"
            >
              Sudo 세션 즉시 잠금
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSudoApproved(true);
            }}
            className="space-y-4"
          >
            <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-[12px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>민감한 작업 보호 모드 (Step-Up Auth)</span>
              </div>
              <p className="text-amber-800/90 leading-relaxed">
                프로덕션 API 시크릿 키를 조회하거나 결제 수단을 변경하려면 관리자 비밀번호를 한 번 더 입력해 주세요.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-[12px]">
              <div>
                <div className="font-semibold text-zinc-800">admin@flux.local</div>
                <div className="text-[11px] text-klic-muted">
                  대한민국 서울 (211.45.182.14) · macOS Chrome
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[color:var(--klic-component-block-color-accent)] font-semibold text-[11px]">
                소유자
              </span>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-zinc-800 mb-2">
                현재 관리자 비밀번호 확인
              </label>
              <input
                type="password"
                value={sudoPassword}
                onChange={(e) => setSudoPassword(e.target.value)}
                className="w-full h-[44px] px-3.5 rounded-[8px] bg-[var(--klic-component-block-color-soft)] border border-[color:var(--klic-component-block-color-border)] text-[14px] text-zinc-900 focus:outline-none focus:border-[color:var(--klic-component-block-color-accent)]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[44px] rounded-[8px] bg-klic-inverse hover:bg-klic-inverse text-klic-on-emphasis text-[14px] font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Sudo 권한 확인 (15분간 유지)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function AuthBlock({ initialMode = 'flux-card' }: AuthBlockProps) {
  const [activeMode, setActiveMode] = useState<AuthMode>(initialMode);

  React.useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  const currentMeta =
    AUTH_MODES.find((m) => m.id === activeMode) || AUTH_MODES[0];

  return (
    <div className="w-full space-y-4">
      {/* Top 5-Mode Auth Switcher Bar */}
      <div className="bg-white rounded-xl border border-zinc-200/90 p-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[color:var(--klic-component-block-color-accent)] text-[11px] font-bold">
              인증 · 5종 컬렉션
            </span>
            <span className="text-[12px] font-semibold text-zinc-800">
              {currentMeta.label}
            </span>
            <span className="text-[11px] font-mono text-klic-muted">
              {currentMeta.pkg}
            </span>
          </div>
          <span className="text-[11px] text-klic-muted">{currentMeta.subtitle}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {AUTH_MODES.map((m) => {
            const isActive = m.id === activeMode;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMode(m.id)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-klic-inverse text-klic-on-emphasis shadow-xs'
                    : 'bg-zinc-50 text-klic-muted hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    isActive
                      ? 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis'
                      : 'bg-zinc-200 text-klic-muted'
                  }`}
                >
                  {m.index}
                </span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Auth Mode Viewport */}
      {activeMode === 'flux-card' && (
        <FluxClassicCardLoginView onSwitchMode={setActiveMode} />
      )}
      {activeMode === 'split-glass' && (
        <SplitGridGlassRibbonLoginView onSwitchMode={setActiveMode} />
      )}
      {activeMode === 'workspace-signup' && (
        <WorkspaceSignupView onSwitchMode={setActiveMode} />
      )}
      {activeMode === 'mfa-verify' && (
        <MfaTotpPasskeyVerifyView onSwitchMode={setActiveMode} />
      )}
      {activeMode === 'sudo-recovery' && (
        <PasswordRecoveryAndSudoView onSwitchMode={setActiveMode} />
      )}
    </div>
  );
}
