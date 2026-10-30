import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TaskItem, StageId, SignalStatus } from '../../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
}

export function NewTaskModal({ isOpen, onClose, onAddTask }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<StageId>('백로그');
  const [signal, setSignal] = useState<SignalStatus>('대기 중');
  const [tagName, setTagName] = useState('도입 확산');
  const [dueDate, setDueDate] = useState('11월 15일');
  const [progress, setProgress] = useState(25);
  const [assigneeName, setAssigneeName] = useState('김민수');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      stage,
      signal,
      dueDate,
      progress: Number(progress),
      iconName: 'layout',
      assignees: assigneeName.trim()
        ? [
            {
              id: `u-${Date.now()}`,
              name: assigneeName.trim(),
              initials: assigneeName.trim().slice(0, 2),
            },
          ]
        : [],
      tag: {
        name: tagName,
        color:
          tagName === '매출 성장'
            ? 'var(--klic-component-block-color-accent)'
            : tagName === '보안/권한'
            ? 'var(--klic-component-block-color-danger)'
            : tagName === 'AI 품질'
            ? 'var(--klic-component-block-color-accent)'
            : 'var(--klic-component-block-color-accent)',
      },
    };

    onAddTask(newTask);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-klic-inverse/50 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white  border border-zinc-200  shadow-2xl p-5 text-zinc-900  animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 ">
          <h3 className="text-sm font-semibold">새 로드맵 업무 등록</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-klic-muted hover:text-klic-muted  transition"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3 text-xs">
          <div>
            <label className="block font-medium text-zinc-700  mb-1">
              업무 제목 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 웹훅 재시도 텔레메트리 대시보드 연동"
              className="w-full px-3 py-2 bg-zinc-50  border border-zinc-200  rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700  mb-1">
                진행 단계
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as StageId)}
                className="w-full px-3 py-2 bg-zinc-50  border border-zinc-200  rounded-lg"
              >
                <option value="백로그">백로그</option>
                <option value="할 일">할 일</option>
                <option value="진행 중">진행 중</option>
                <option value="완료">완료</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700  mb-1">
                상태 신호
              </label>
              <select
                value={signal}
                onChange={(e) => setSignal(e.target.value as SignalStatus)}
                className="w-full px-3 py-2 bg-zinc-50  border border-zinc-200  rounded-lg"
              >
                <option value="대기 중">대기 중</option>
                <option value="정상 진행">정상 진행</option>
                <option value="위험">위험</option>
                <option value="차단됨">차단됨</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700  mb-1">
                카테고리 태그
              </label>
              <select
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50  border border-zinc-200  rounded-lg"
              >
                <option value="도입 확산">도입 확산</option>
                <option value="매출 성장">매출 성장</option>
                <option value="지식 관리">지식 관리</option>
                <option value="AI 품질">AI 품질</option>
                <option value="보안/권한">보안/권한</option>
                <option value="메시징">메시징</option>
                <option value="모바일">모바일</option>
                <option value="안정성">안정성</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-zinc-700  mb-1">
                마감 목표일
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="예: 11월 15일"
                className="w-full px-3 py-2 bg-zinc-50  border border-zinc-200  rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-zinc-700  mb-1">
                담당자명
              </label>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="예: 김민수"
                className="w-full px-3 py-2 bg-zinc-50  border border-zinc-200  rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700  mb-1">
                진행률: {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-2 accent-zinc-900 "
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200  flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted  hover:bg-zinc-50 "
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-klic-inverse  text-klic-on-emphasis  rounded-lg font-semibold hover:opacity-90"
            >
              업무 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
