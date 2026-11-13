/** SPDX-License-Identifier: Apache-2.0 */
import React, { useState, useRef, useCallback } from 'react';
import {
  type ThrowableFile,
  type TrashCanGeometry,
  type TrajectoryPoint,
  inferFileBadge,
  calculateGuidedArcVelocity,
  computeSlingshotVelocity,
  simulateTrashCanShot,
} from './shotPhysics';
import { CrumpledPaperCard } from './CrumpledPaperCard';
import { Upload, Sparkles, Wind, RotateCcw, Plus, FileCheck2, Trash2, CheckCircle2 } from 'lucide-react';

interface TrashCanUploadSceneProps {
  density?: 'compact' | 'normal' | 'relaxed';
  uploadedFiles: ThrowableFile[];
  onFileUploaded: (file: ThrowableFile) => void;
  windActive?: boolean;
  onToggleWind?: () => void;
  aimAssist?: boolean;
}

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 490;
const DEFAULT_SPAWN = { x: 108, y: 382 };

const MEMO_SAMPLE_FILES: Array<{ name: string; sizeBytes: number }> = [
  { name: '회의록_초안_메모.txt', sizeBytes: 18_420 },
  { name: '아이디어_스케치.doc', sizeBytes: 420_800 },
  { name: '폐기할_기획안_v1.pdf', sizeBytes: 1_640_000 },
  { name: '급한_할일_체크리스트.txt', sizeBytes: 9_200 },
  { name: '임시_견적서_메모.csv', sizeBytes: 64_500 },
];

export const TrashCanUploadScene: React.FC<TrashCanUploadSceneProps> = ({
  density = 'normal',
  uploadedFiles,
  onFileUploaded,
  windActive = false,
  onToggleWind,
  aimAssist = true,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleIdxRef = useRef(1);

  const [stagedFile, setStagedFile] = useState<ThrowableFile>(() => {
    const badgeInfo = inferFileBadge('회의록_초안_메모.txt');
    return {
      id: 'trash-initial-1',
      name: '회의록_초안_메모.txt',
      sizeBytes: 18_420,
      badge: badgeInfo.badge,
      badgeColor: badgeInfo.color,
      x: DEFAULT_SPAWN.x,
      y: DEFAULT_SPAWN.y,
      rotation: 0,
      status: 'staged',
    };
  });

  // Hover / Crumpled state: turns into a crumpled paper ball the instant mouse enters!
  const [isHoveredOrCrumpled, setIsHoveredOrCrumpled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>(DEFAULT_SPAWN);
  const [previewArc, setPreviewArc] = useState<TrajectoryPoint[]>([]);
  const [showReleaseHand, setShowReleaseHand] = useState(false);
  const [releaseHandPos, setReleaseHandPos] = useState<{ x: number; y: number } | null>(null);

  // Flight & Trash Can Shake state
  const [isFlying, setIsFlying] = useState(false);
  const [flightFrame, setFlightFrame] = useState<TrajectoryPoint | null>(null);
  const [flightZAboveRim, setFlightZAboveRim] = useState(false);
  const [canShake, setCanShake] = useState<'idle' | 'score' | 'clank'>('idle');
  const [shotCallout, setShotCallout] = useState<{ text: string; scored: boolean } | null>(null);
  const [isOsDragOver, setIsOsDragOver] = useState(false);

  // Desk Fan Wind acceleration
  const windAccel = windActive ? -0.045 : 0;

  const getTrashCanGeometry = useCallback((): TrashCanGeometry => {
    const centerX = 278; // Grounded slightly right of center so left spawn has a classic office Paper Toss angle!
    return {
      rimCenterX: centerX,
      rimY: 222,
      rimRadius: 56,
      canBottomY: 368,
      backboardTop: 28,
      backboardBottom: 368,
      backboardLeft: 92,
      backboardRight: 404,
    };
  }, []);

  const spawnNextFile = useCallback((customFile?: File) => {
    const nextSample = MEMO_SAMPLE_FILES[sampleIdxRef.current % MEMO_SAMPLE_FILES.length];
    sampleIdxRef.current += 1;

    const fileName = customFile ? customFile.name : nextSample.name;
    const fileSize = customFile ? customFile.size : nextSample.sizeBytes;
    const badgeInfo = inferFileBadge(fileName);

    setStagedFile({
      id: `trash-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: fileName,
      sizeBytes: fileSize,
      badge: badgeInfo.badge,
      badgeColor: badgeInfo.color,
      x: DEFAULT_SPAWN.x,
      y: DEFAULT_SPAWN.y,
      rotation: 0,
      status: 'staged',
      rawFile: customFile,
    });
    setDragPos(DEFAULT_SPAWN);
    setPreviewArc([]);
    setIsHoveredOrCrumpled(false);
  }, []);

  const launchPaperToss = useCallback(
    (origin: { x: number; y: number }, velocity: { vx: number; vy: number }) => {
      if (isFlying) return;
      const trashCan = getTrashCanGeometry();
      const result = simulateTrashCanShot(origin, velocity, trashCan, windAccel, 0.55, 70);

      setIsHoveredOrCrumpled(true);
      setPreviewArc(result.points.slice(0, Math.max(18, result.crossingIndex)));
      setIsFlying(true);
      setShowReleaseHand(true);
      setReleaseHandPos({ x: origin.x, y: origin.y + 42 });

      setTimeout(() => setShowReleaseHand(false), 650);

      let frameIdx = 0;
      const total = result.points.length;

      const step = () => {
        if (frameIdx >= total) {
          setIsFlying(false);
          setFlightFrame(null);
          setPreviewArc([]);

          if (result.scored) {
            const uploadedItem: ThrowableFile = {
              ...stagedFile,
              status: 'uploaded',
              shotType: result.shotLabel,
              uploadedAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
            };
            onFileUploaded(uploadedItem);
            spawnNextFile();
          } else {
            setDragPos(DEFAULT_SPAWN);
          }
          return;
        }

        const pt = result.points[frameIdx];
        setFlightFrame(pt);
        setFlightZAboveRim(pt.vy < 0 && pt.y < trashCan.rimY);

        if (result.scored && frameIdx === result.crossingIndex) {
          setCanShake('score');
          setShotCallout({ text: `${result.shotLabel} +1`, scored: true });
          setTimeout(() => setCanShake('idle'), 550);
          setTimeout(() => setShotCallout(null), 1500);
        } else if (!result.scored && result.hitRim && frameIdx === 24) {
          setCanShake('clank');
          setShotCallout({ text: result.shotLabel, scored: false });
          setTimeout(() => setCanShake('idle'), 450);
          setTimeout(() => setShotCallout(null), 1200);
        }

        frameIdx += 1;
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    },
    [getTrashCanGeometry, isFlying, onFileUploaded, spawnNextFile, stagedFile, windAccel]
  );

  const triggerGuidedToss = useCallback(
    (wallBounce = false) => {
      if (isFlying) return;
      const trashCan = getTrashCanGeometry();
      const origin = { x: DEFAULT_SPAWN.x - 8, y: DEFAULT_SPAWN.y + 6 };
      const steps = 44;
      const windCompensationX = -0.5 * windAccel * steps * steps;
      const target = {
        x: (wallBounce ? trashCan.rimCenterX + 14 : trashCan.rimCenterX) + windCompensationX,
        y: wallBounce ? trashCan.rimY - 12 : trashCan.rimY - 2,
      };
      const vel = calculateGuidedArcVelocity(origin, target, 0.55, steps);
      launchPaperToss(origin, vel);
    },
    [getTrashCanGeometry, isFlying, launchPaperToss, windAccel]
  );

  const clientToStage = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return DEFAULT_SPAWN;
    const scaleX = STAGE_WIDTH / rect.width;
    const scaleY = STAGE_HEIGHT / rect.height;
    return {
      x: Math.max(28, Math.min(STAGE_WIDTH - 28, (clientX - rect.left) * scaleX)),
      y: Math.max(28, Math.min(STAGE_HEIGHT - 28, (clientY - rect.top) * scaleY)),
    };
  };

  const handleMouseEnterMemo = () => {
    if (isFlying) return;
    setIsHoveredOrCrumpled(true);
    if (!isDragging) {
      const trashCan = getTrashCanGeometry();
      const steps = 44;
      const windCompX = -0.5 * windAccel * steps * steps;
      const vel = calculateGuidedArcVelocity(
        DEFAULT_SPAWN,
        { x: trashCan.rimCenterX + windCompX, y: trashCan.rimY - 2 },
        0.55,
        steps
      );
      const sim = simulateTrashCanShot(DEFAULT_SPAWN, vel, trashCan, windAccel, 0.55, 46);
      setPreviewArc(sim.points.slice(0, 24));
    }
  };

  const handleMouseLeaveMemo = () => {
    if (!isFlying && !isDragging) {
      setPreviewArc([]);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFlying) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsHoveredOrCrumpled(true);
    setIsDragging(true);
    setShowReleaseHand(false);

    const pos = clientToStage(e.clientX, e.clientY);
    setDragPos(pos);

    const trashCan = getTrashCanGeometry();
    const { vx, vy } = computeSlingshotVelocity(
      DEFAULT_SPAWN,
      pos,
      { x: trashCan.rimCenterX, y: trashCan.rimY },
      aimAssist ? 0.46 : 0.12
    );
    const sim = simulateTrashCanShot(pos, { vx, vy }, trashCan, windAccel, 0.55, 46);
    setPreviewArc(sim.points.slice(0, 24));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isFlying) return;
    const pos = clientToStage(e.clientX, e.clientY);
    setDragPos(pos);

    const trashCan = getTrashCanGeometry();
    const insideDropzone =
      pos.x >= trashCan.backboardLeft &&
      pos.x <= trashCan.backboardRight &&
      pos.y >= trashCan.backboardTop &&
      pos.y <= trashCan.backboardBottom;

    if (insideDropzone) {
      setPreviewArc([]);
      return;
    }

    const { vx, vy } = computeSlingshotVelocity(
      DEFAULT_SPAWN,
      pos,
      { x: trashCan.rimCenterX, y: trashCan.rimY },
      aimAssist ? 0.48 : 0.12
    );
    const sim = simulateTrashCanShot(pos, { vx, vy }, trashCan, windAccel, 0.55, 46);
    setPreviewArc(sim.points.slice(0, 24));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isFlying) return;
    setIsDragging(false);

    const pos = clientToStage(e.clientX, e.clientY);
    const trashCan = getTrashCanGeometry();

    const insideDropzone =
      pos.x >= trashCan.backboardLeft &&
      pos.x <= trashCan.backboardRight &&
      pos.y >= trashCan.backboardTop &&
      pos.y <= trashCan.backboardBottom;

    if (insideDropzone) {
      const dropOrigin = { x: trashCan.rimCenterX, y: trashCan.rimY - 48 };
      launchPaperToss(dropOrigin, { vx: 0, vy: 2.4 });
      return;
    }

    const pullDist = Math.hypot(pos.x - DEFAULT_SPAWN.x, pos.y - DEFAULT_SPAWN.y);
    if (pullDist < 12) {
      triggerGuidedToss(false);
      return;
    }

    const { vx, vy } = computeSlingshotVelocity(
      DEFAULT_SPAWN,
      pos,
      { x: trashCan.rimCenterX, y: trashCan.rimY },
      aimAssist ? 0.52 : 0.15
    );
    launchPaperToss(pos, { vx, vy });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const badgeInfo = inferFileBadge(file.name);
      setStagedFile({
        id: `os-trash-${Date.now()}`,
        name: file.name,
        sizeBytes: file.size,
        badge: badgeInfo.badge,
        badgeColor: badgeInfo.color,
        x: DEFAULT_SPAWN.x,
        y: DEFAULT_SPAWN.y,
        rotation: 0,
        status: 'staged',
        rawFile: file,
      });
      setIsHoveredOrCrumpled(true);
      setTimeout(() => {
        triggerGuidedToss(false);
      }, 60);
    }
  };

  const activePos =
    isFlying && flightFrame
      ? { x: flightFrame.x, y: flightFrame.y }
      : isDragging
      ? dragPos
      : DEFAULT_SPAWN;
  const activeRotation =
    isFlying && flightFrame
      ? flightFrame.rotation
      : isDragging
      ? -18
      : isHoveredOrCrumpled
      ? -6
      : 0;
  const activeScale = isFlying && flightFrame ? flightFrame.scale : 1;

  const arcDots = previewArc.filter((_, idx) => idx > 1 && idx % 3 === 0 && idx <= 22);

  // Crumpled paper wads peeking out from inside the top mouth of the trash bin!
  const peekingWads = uploadedFiles.slice(0, 6);

  return (
    <div
      className={`w-full max-w-[510px] bg-[var(--klic-component-block-color-soft)] border border-zinc-200/90 rounded-3xl ${density === 'compact' ? 'p-4 sm:p-5' : density === 'relaxed' ? 'p-7 sm:p-8' : 'p-6 sm:p-7'} shadow-md flex flex-col justify-between relative overflow-hidden`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOsDragOver(true);
      }}
      onDragLeave={() => setIsOsDragOver(false)}
      onDrop={handleDrop}
      data-testid="trash-upload-block"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) spawnNextFile(f);
        }}
        aria-label="휴지통 업로드용 파일 선택"
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 z-20">
        <div>
          <h2 className="text-[24px] font-bold tracking-tight text-zinc-900 leading-tight">
            휴지통 파일 업로드
          </h2>
          <p className="text-[14px] text-zinc-500 mt-1">
            메모지를 구겨 바람을 피해 휴지통에 던지세요.
          </p>
        </div>

        <div
          className="bg-[var(--klic-component-block-color-border)]/90 px-3.5 py-1.5 rounded-full text-[13px] text-zinc-500 font-medium tracking-tight tabular-nums shrink-0"
          aria-live="polite"
          data-testid="trash-uploaded-count"
        >
          업로드됨 <span className="font-bold text-zinc-900 ml-0.5">{uploadedFiles.length}</span>
        </div>
      </div>

      {/* Interactive Office Trash Bin Stage */}
      <div
        ref={stageRef}
        className="relative w-full h-[460px] mt-1 select-none touch-none"
      >
        {/* Celebratory Callout */}
        {shotCallout && (
          <div
            role="status"
            aria-live="polite"
            className={`absolute top-2 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all ${
              shotCallout.scored
                ? 'bg-blue-600 text-klic-on-emphasis'
                : 'bg-zinc-800 text-klic-on-emphasis'
            }`}
          >
            {shotCallout.scored && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
            {shotCallout.scored ? `업로드 완료 · ${shotCallout.text}` : shotCallout.text}
          </div>
        )}

        {/* Wind Indicator Banner when Fan Wind Mode is Active */}
        {windActive && (
          <div className="absolute top-2.5 right-2.5 z-30 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
            <Wind className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>선풍기 바람: 좌측풍 1.8m/s</span>
          </div>
        )}

        {/* UPPER DROPZONE BANNER & TRASH CAN BACK MOUTH (Layer z-10) */}
        <div className="absolute inset-x-0 top-[20px] flex flex-col items-center z-10 pointer-events-none">
          {/* Compact Top Dashed Dropzone Prompt */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`pointer-events-auto w-[290px] max-w-full h-[118px] bg-white rounded-2xl border-[2px] border-dashed transition-colors flex flex-col items-center justify-center px-4 relative cursor-pointer group focus-visible:outline-2 focus-visible:outline-blue-600 ${
              isOsDragOver
                ? 'border-blue-500 bg-blue-50/30'
                : 'border-[var(--klic-component-block-color-control-border)] hover:border-zinc-400'
            }`}
            aria-label="휴지통 드롭존. 여기에 파일을 놓거나 클릭하여 파일 선택"
          >
            <Upload className="w-[20px] h-[20px] text-zinc-500 group-hover:text-zinc-800 transition-colors stroke-[1.8]" />

            <span className="text-[15px] font-semibold text-zinc-900 mt-1.5 tracking-tight">
              여기에 파일을 놓으세요
            </span>
            <span className="text-[12px] text-zinc-400 mt-0.5">
              또는 아래 메모지를 구겨 휴지통에 골인시키세요
            </span>
          </button>
        </div>

        {/* 3D TRASH CAN BACK RIM, SIDE HANDLES & DEEP DARK INTERIOR CAVITY (Layer z-10, centered at x=278, y=222) */}
        <div
          style={{
            left: `${(278 / STAGE_WIDTH) * 100}%`,
            top: `${(182 / STAGE_HEIGHT) * 100}%`,
            transform: 'translateX(-50%)',
          }}
          className="absolute z-10 pointer-events-none"
        >
          <svg
            width="180"
            height="80"
            viewBox="0 0 180 80"
            className="overflow-visible"
            style={{
              transformOrigin: '90px 45px',
              transform:
                canShake === 'score'
                  ? 'scaleY(0.95) scaleX(1.04)'
                  : canShake === 'clank'
                  ? 'translateX(4px) rotate(2deg)'
                  : 'scale(1)',
              transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <defs>
              <radialGradient id="bin-cavity" cx="50%" cy="60%" r="55%">
                <stop offset="0%" stopColor="var(--klic-component-block-color-text)" />
                <stop offset="70%" stopColor="var(--klic-component-block-color-text)" />
                <stop offset="100%" stopColor="var(--klic-component-block-color-text)" />
              </radialGradient>
            </defs>

            {/* Left & Right Molded Trash Can Side Handles */}
            <path
              d="M 22 39 L 10 39 C 6 39 5 44 8 48 L 24 52"
              fill="none"
              stroke="var(--klic-component-block-color-text)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 158 39 L 170 39 C 174 39 175 44 172 48 L 156 52"
              fill="none"
              stroke="var(--klic-component-block-color-text)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Back Rim Lip Collar */}
            <ellipse cx="90" cy="40" rx="66" ry="16" fill="var(--klic-component-block-color-text)" stroke="var(--klic-component-block-color-text)" strokeWidth="2.5" />

            {/* Deep Dark Interior Mouth of the Trash Can */}
            <ellipse cx="90" cy="41" rx="58" ry="12.5" fill="url(#bin-cavity)" />

            {/* Trash Bag Liner Overhang / Pleats around the inner rim */}
            <path
              d="M 32 41 Q 45 33 62 36 Q 82 31 102 35 Q 124 31 148 41"
              fill="none"
              stroke="var(--klic-component-block-color-muted)"
              strokeWidth="2"
              strokeOpacity="0.6"
            />

            {/* Accumulated Crumpled Paper Wads Peeking Out of the Trash Can Mouth! */}
            {peekingWads.map((item, idx) => {
              const positions = [
                { x: 64, y: 40, rot: -15 },
                { x: 112, y: 41, rot: 22 },
                { x: 88, y: 38, rot: 8 },
                { x: 50, y: 43, rot: -28 },
                { x: 125, y: 43, rot: 14 },
                { x: 75, y: 35, rot: -6 },
              ];
              const p = positions[idx % positions.length];
              return (
                <g key={item.id} transform={`translate(${p.x}, ${p.y}) rotate(${p.rot})`}>
                  <polygon
                    points="0,-13 11,-8 15,2 8,11 -6,12 -14,4 -11,-7"
                    fill="var(--klic-component-block-color-selected)"
                    stroke="var(--klic-component-block-color-accent)"
                    strokeWidth="1"
                  />
                  <polygon points="0,-13 11,-8 3,1 -7,-2" fill="var(--klic-component-block-color-panel)" />
                  <polygon points="3,1 15,2 8,11 -6,12" fill="var(--klic-component-block-color-selected)" fillOpacity="0.8" />
                  <line x1="-8" y1="-2" x2="7" y2="4" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.9" />
                  <line x1="3" y1="-8" x2="-4" y2="7" stroke="var(--klic-component-block-color-accent)" strokeWidth="0.9" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* DOTTED AMBER TRAJECTORY ARC */}
        <svg
          viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-15"
        >
          {arcDots.map((dot, index) => {
            const opacity = 0.85 - (index / Math.max(arcDots.length, 1)) * 0.35;
            return (
              <circle
                key={index}
                cx={dot.x}
                cy={dot.y}
                r={3.5}
                fill="var(--klic-component-block-color-accent)"
                fillOpacity={opacity}
              />
            );
          })}
        </svg>

        {/* THROWABLE MEMO / CRUMPLED PAPER BALL (Morphs on Mouse Hover!) */}
        <div
          onMouseEnter={handleMouseEnterMemo}
          onMouseLeave={handleMouseLeaveMemo}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            left: `${(activePos.x / STAGE_WIDTH) * 100}%`,
            top: `${(activePos.y / STAGE_HEIGHT) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className={`absolute ${
            flightZAboveRim ? 'z-35' : 'z-20'
          } ${isFlying ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
          role="button"
          tabIndex={0}
          aria-label={`메모지 파일 ${stagedFile.name}. 마우스를 올리면 구겨진 종이로 바뀌며 드래그하여 휴지통에 던질 수 있습니다.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerGuidedToss(false);
            }
          }}
          data-testid="trash-throwable-file"
        >
          <CrumpledPaperCard
            key={stagedFile.id}
            name={stagedFile.name}
            badge={stagedFile.badge}
            badgeColor={stagedFile.badgeColor}
            isCrumpled={isHoveredOrCrumpled || isDragging || isFlying}
            isGrabbing={isDragging}
            isFlying={isFlying}
            showHandIcon={!isFlying && !showReleaseHand ? 'fist' : 'none'}
            scale={activeScale}
            rotation={activeRotation}
          />
        </div>

        {/* Open Hand Release Indicator */}
        {showReleaseHand && releaseHandPos && (
          <div
            style={{
              left: `${(releaseHandPos.x / STAGE_WIDTH) * 100}%`,
              top: `${(releaseHandPos.y / STAGE_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30 pointer-events-none"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-900">
                <path d="M11.5 2a1.25 1.25 0 0 1 1.25 1.25v6.25h.75V3.75a1.25 1.25 0 0 1 2.5 0v5.75h.75V5.25a1.25 1.25 0 0 1 2.5 0V14.5a6.5 6.5 0 0 1-6.5 6.5h-1.8a6.2 6.2 0 0 1-5.4-3.15l-2.75-4.85a1.35 1.35 0 0 1 2.15-1.68l2.05 1.93V4.25a1.25 1.25 0 0 1 2.5 0v5.25h.75V3.25A1.25 1.25 0 0 1 11.5 2Z" />
              </svg>
            </div>
          </div>
        )}

        {/* SOLID 3D RIBBED CYLINDRICAL TRASH CAN BODY, ROLLED FRONT LIP & FOOT PEDAL (Layer z-30 — in front of the falling paper ball!) */}
        <div
          style={{
            left: `${(278 / STAGE_WIDTH) * 100}%`,
            top: `${(182 / STAGE_HEIGHT) * 100}%`,
            transform: 'translateX(-50%)',
          }}
          className="absolute z-30 pointer-events-none"
        >
          <svg
            width="180"
            height="225"
            viewBox="0 0 180 225"
            className="overflow-visible"
            style={{
              transformOrigin: '90px 180px',
              transform:
                canShake === 'score'
                  ? 'scaleY(0.95) scaleX(1.04)'
                  : canShake === 'clank'
                  ? 'translateX(4px) rotate(2deg)'
                  : 'scale(1)',
              transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <defs>
              {/* 3D Cylindrical Body Horizontal Lighting Gradient */}
              <linearGradient id="trash-cylinder-body" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--klic-component-block-color-text)" />
                <stop offset="22%" stopColor="var(--klic-component-block-color-muted)" />
                <stop offset="52%" stopColor="var(--klic-component-block-color-muted)" />
                <stop offset="82%" stopColor="var(--klic-component-block-color-text)" />
                <stop offset="100%" stopColor="var(--klic-component-block-color-text)" />
              </linearGradient>

              {/* Rolled Top Rim Collar Gradient */}
              <linearGradient id="trash-rim-collar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--klic-component-block-color-text)" />
                <stop offset="28%" stopColor="var(--klic-component-block-color-muted)" />
                <stop offset="55%" stopColor="var(--klic-component-block-color-text)" />
                <stop offset="100%" stopColor="var(--klic-component-block-color-text)" />
              </linearGradient>

              {/* Recessed Vertical Rib Groove Gradient */}
              <linearGradient id="rib-groove" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--klic-component-block-color-text)" stopOpacity="0.65" />
                <stop offset="50%" stopColor="var(--klic-component-block-color-text)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--klic-component-block-color-muted)" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* Ground Floor Shadow under the Trash Can */}
            <ellipse
              cx="90"
              cy="202"
              rx="64"
              ry="13"
              fill="var(--klic-component-block-color-text)"
              fillOpacity="0.14"
            />

            {/* Stepped Molded Bottom Base Ring of the Trash Can */}
            <path
              d="M 42 182 L 45 196 C 46 205 134 205 135 196 L 138 182 Z"
              fill="var(--klic-component-block-color-text)"
            />

            {/* Main Solid Tapered Cylindrical Trash Can Body */}
            <path
              d="M 26 42 L 38 184 C 40 196 140 196 142 184 L 154 42 C 154 52 26 52 26 42 Z"
              fill="url(#trash-cylinder-body)"
              stroke="var(--klic-component-block-color-text)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Horizontal Moulded Reinforcing Band across upper-middle body */}
            <path
              d="M 29 74 C 45 83 135 83 151 74"
              fill="none"
              stroke="var(--klic-component-block-color-text)"
              strokeWidth="2"
              strokeOpacity="0.45"
            />
            <path
              d="M 29 76 C 45 85 135 85 151 76"
              fill="none"
              stroke="var(--klic-component-block-color-muted)"
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />

            {/* 5 Molded Vertical Fluted Ribs (입체 원통형 세로 홈) */}
            <g>
              {/* Rib 1 (Left) */}
              <path
                d="M 42 84 L 49 174 C 49.5 178 55.5 178 55 174 L 49 84 C 48.5 80 42 80 42 84 Z"
                fill="url(#rib-groove)"
              />
              {/* Rib 2 (Mid-Left) */}
              <path
                d="M 62 86 L 66 177 C 66.5 181 73 181 72.5 177 L 69 86 C 68.5 82 62 82 62 86 Z"
                fill="url(#rib-groove)"
              />
              {/* Rib 3 (Center) */}
              <path
                d="M 86 87 L 86.5 178 C 86.5 182 93.5 182 93.5 178 L 94 87 C 94 83 86 83 86 87 Z"
                fill="url(#rib-groove)"
              />
              {/* Rib 4 (Mid-Right) */}
              <path
                d="M 111 86 L 107.5 177 C 107 181 113.5 181 114 177 L 118 86 C 118 82 111.5 82 111 86 Z"
                fill="url(#rib-groove)"
              />
              {/* Rib 5 (Right) */}
              <path
                d="M 131 84 L 125 174 C 124.5 178 130.5 178 131 174 L 138 84 C 138 80 131.5 80 131 84 Z"
                fill="url(#rib-groove)"
              />
            </g>

            {/* Center Embossed Trash / Recycling Badge on Front of Bin */}
            <g transform="translate(90, 130)">
              <circle r="16" fill="var(--klic-component-block-color-text)" fillOpacity="0.55" stroke="var(--klic-component-block-color-muted)" strokeWidth="1.2" strokeOpacity="0.5" />
              {/* Mini Trash Bin / Paper Toss Icon */}
              <path
                d="M -6 -3 L -4.5 7 L 4.5 7 L 6 -3 Z M -7 -5 L 7 -5 M -2.5 -7 L 2.5 -7"
                fill="none"
                stroke="var(--klic-component-block-color-border)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Bottom Step-On Foot Pedal (발판 페달) */}
            <g transform="translate(90, 198)">
              <rect
                x="-16"
                y="-5"
                width="32"
                height="9"
                rx="3"
                fill="var(--klic-component-block-color-text)"
                stroke="var(--klic-component-block-color-muted)"
                strokeWidth="1.2"
              />
              <line x1="-10" y1="-1" x2="10" y2="-1" stroke="var(--klic-component-block-color-muted)" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* Thick Overhanging Front Rolled Rim Collar (휴지통 입구 앞쪽 테두리) */}
            <path
              d="M 23 39 A 67 16 0 0 0 157 39 L 156 49 A 66 16 0 0 1 24 49 Z"
              fill="url(#trash-rim-collar)"
              stroke="var(--klic-component-block-color-text)"
              strokeWidth="1.5"
            />
            {/* Specular Front Rim Lip Highlight */}
            <path
              d="M 26 40 A 64 15 0 0 0 154 40"
              fill="none"
              stroke="var(--klic-component-block-color-muted)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.65"
            />
          </svg>

          {/* Subtle Badge on Trash Can Base showing number of trashed/uploaded memos */}
          {uploadedFiles.length > 0 && (
            <div className="absolute bottom-[36px] left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-zinc-900/90 text-blue-300 text-[10px] font-bold tracking-tight whitespace-nowrap shadow-xs border border-zinc-700">
              골인 {uploadedFiles.length}건
            </div>
          )}
        </div>
      </div>

      {/* Interactive Action Footer inside Trash Can Component Block */}
      <div className="pt-2 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => triggerGuidedToss(false)}
            disabled={isFlying}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-klic-on-emphasis text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            구겨서 던지기
          </button>

          <button
            type="button"
            onClick={() => setIsHoveredOrCrumpled((prev) => !prev)}
            disabled={isFlying}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            {isHoveredOrCrumpled ? '메모지 펴기' : '종이 구기기'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleWind && (
            <button
              type="button"
              onClick={onToggleWind}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                windActive
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              {windActive ? '선풍기 바람: 켜짐' : '선풍기 바람'}
            </button>
          )}

          <button
            type="button"
            onClick={() => spawnNextFile()}
            disabled={isFlying}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="다음 메모지 샘플 파일로 변경"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            다음 메모
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="휴지통 업로드용 내 파일 선택"
          >
            <Plus className="w-3.5 h-3.5" />
            내 파일
          </button>
        </div>
      </div>
    </div>
  );
};
