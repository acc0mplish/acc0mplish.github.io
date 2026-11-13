/** SPDX-License-Identifier: Apache-2.0 */
import React from 'react';
import { Check, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { formatFileSize, type ThrowableFile } from './shotPhysics';

export type ShotDropDensity = 'compact' | 'normal' | 'relaxed';

export function ShotDropLocalNotice() {
  return (
    <aside className="flex w-full max-w-[510px] items-start gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs leading-relaxed text-zinc-600" role="note">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
      <span>로컬 미리보기입니다. 파일명과 크기만 화면에 표시하며 실제 파일 전송이나 서버 저장은 하지 않습니다.</span>
    </aside>
  );
}

export function ShotDropToggle({
  label,
  value,
  pressed,
  onClick,
}: {
  label: string;
  value: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${pressed ? 'border-blue-600 bg-blue-50 text-zinc-900' : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'}`}
    >
      {pressed ? <Check size={14} aria-hidden="true" /> : <span className="h-3.5 w-3.5 rounded-full border border-current" aria-hidden="true" />}
      {label}: {value}
    </button>
  );
}

export function ShotDropUploadHistory({
  blockName,
  files,
  onRemove,
  onClear,
}: {
  blockName: string;
  files: ThrowableFile[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="w-full max-w-[510px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm" aria-labelledby={`shotdrop-history-${blockName}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 id={`shotdrop-history-${blockName}`} className="text-sm font-semibold text-zinc-900">업로드 결과</h3>
          <p className="mt-0.5 text-xs text-zinc-500">이 미리보기 안에서만 유지됩니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-blue-700" aria-live="polite">{files.length}개</span>
          {files.length > 0 && <button type="button" onClick={onClear} className="min-h-8 rounded-lg px-2 text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">기록 지우기</button>}
        </div>
      </div>
      {files.length === 0 ? (
        <p className="rounded-lg bg-zinc-50 px-3 py-3 text-xs text-zinc-500">슛에 성공하면 업로드 완료 파일이 여기에 표시됩니다.</p>
      ) : (
        <ul className="grid gap-2">
          {files.map((file) => (
            <li key={file.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5">
              <span className="grid h-9 w-8 shrink-0 place-items-center rounded-md bg-blue-50 text-[9px] font-bold tracking-wide text-blue-700">{file.badge}</span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-xs font-semibold text-zinc-900">{file.name}</strong>
                <small className="mt-0.5 block truncate text-[11px] text-zinc-500">{formatFileSize(file.sizeBytes)} · {file.shotType || '업로드 완료'}{file.uploadedAt ? ` · ${file.uploadedAt}` : ''}</small>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-blue-700"><CheckCircle2 size={14} aria-hidden="true" />완료</span>
              <button type="button" onClick={() => onRemove(file.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-blue-600" aria-label={`${file.name} 기록에서 제거`}><Trash2 size={14} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ShotDropBlockShell({
  blockName,
  files,
  onRemove,
  onClear,
  controls,
  children,
}: {
  blockName: string;
  files: ThrowableFile[];
  onRemove: (id: string) => void;
  onClear: () => void;
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid w-full min-w-0 justify-items-center gap-3">
      <ShotDropLocalNotice />
      {controls && <div className="flex w-full max-w-[510px] flex-wrap items-center gap-2">{controls}</div>}
      {children}
      <ShotDropUploadHistory blockName={blockName} files={files} onRemove={onRemove} onClear={onClear} />
    </div>
  );
}
