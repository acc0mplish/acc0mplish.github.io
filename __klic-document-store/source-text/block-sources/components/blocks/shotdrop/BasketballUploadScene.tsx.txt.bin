/** SPDX-License-Identifier: Apache-2.0 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  type ThrowableFile,
  type HoopGeometry,
  type TrajectoryPoint,
  inferFileBadge,
  calculateGuidedArcVelocity,
  computeSlingshotVelocity,
  simulateBasketballShot,
} from './shotPhysics';
import { FileDocumentCard } from './FileDocumentCard';
import { Upload, Sparkles, RotateCcw, Plus, MoveHorizontal, CheckCircle2 } from 'lucide-react';

interface BasketballUploadSceneProps {
  density?: 'compact' | 'normal' | 'relaxed';
  uploadedFiles: ThrowableFile[];
  onFileUploaded: (file: ThrowableFile) => void;
  movingHoop?: boolean;
  onToggleMovingHoop?: () => void;
  aimAssist?: boolean;
}

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 490;
const DEFAULT_SPAWN = { x: 108, y: 378 };

const SAMPLE_FILES: Array<{ name: string; sizeBytes: number }> = [
  { name: '최종_제출본_진짜최종.pdf', sizeBytes: 2_480_120 },
  { name: '4분기_사업계획서.pdf', sizeBytes: 4_120_800 },
  { name: '디자인_시스템_시안.fig', sizeBytes: 8_910_400 },
  { name: '메인_히어로_렌더링.png', sizeBytes: 3_640_000 },
  { name: '릴리즈_빌드_패키지.zip', sizeBytes: 14_200_000 },
];

export const BasketballUploadScene: React.FC<BasketballUploadSceneProps> = ({
  density = 'normal',
  uploadedFiles,
  onFileUploaded,
  movingHoop = false,
  onToggleMovingHoop,
  aimAssist = true,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleIndexRef = useRef(1);

  // Current staged file ready to be thrown
  const [stagedFile, setStagedFile] = useState<ThrowableFile>(() => {
    const badgeInfo = inferFileBadge('최종_제출본_진짜최종.pdf');
    return {
      id: 'bball-initial-1',
      name: '최종_제출본_진짜최종.pdf',
      sizeBytes: 2_480_120,
      badge: badgeInfo.badge,
      badgeColor: badgeInfo.color,
      x: DEFAULT_SPAWN.x,
      y: DEFAULT_SPAWN.y,
      rotation: 0,
      status: 'staged',
    };
  });

  // Hoop horizontal offset when "Moving Hoop" mode is enabled
  const [hoopOffsetX, setHoopOffsetX] = useState(0);
  const hoopPhaseRef = useRef(0);

  // Drag / Slingshot state
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>(DEFAULT_SPAWN);
  const [previewArc, setPreviewArc] = useState<TrajectoryPoint[]>([]);
  const [showReleaseHand, setShowReleaseHand] = useState(false);
  const [releaseHandPos, setReleaseHandPos] = useState<{ x: number; y: number } | null>(null);

  // Flying projectile animation state
  const [isFlying, setIsFlying] = useState(false);
  const [flightFrame, setFlightFrame] = useState<TrajectoryPoint | null>(null);
  const [flightZAboveRim, setFlightZAboveRim] = useState(false);
  const [netSwish, setNetSwish] = useState<'idle' | 'swish' | 'rim'>('idle');
  const [shotCallout, setShotCallout] = useState<{ text: string; scored: boolean } | null>(null);
  const [isOsDragOver, setIsOsDragOver] = useState(false);

  // Compute current hoop geometry in stage coordinate space (480x490)
  const getHoopGeometry = useCallback(
    (offsetX = hoopOffsetX): HoopGeometry => {
      const centerX = STAGE_WIDTH / 2 + offsetX;
      return {
        rimCenterX: centerX,
        rimY: 228,
        rimRadius: 54,
        backboardTop: 48,
        backboardBottom: 230,
        backboardLeft: centerX - 145,
        backboardRight: centerX + 145,
      };
    },
    [hoopOffsetX]
  );

  // Animate moving hoop if enabled
  useEffect(() => {
    if (!movingHoop) {
      setHoopOffsetX(0);
      return;
    }
    let rafId: number;
    const tick = () => {
      hoopPhaseRef.current += 0.028;
      setHoopOffsetX(Math.sin(hoopPhaseRef.current) * 62);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [movingHoop]);

  // Spawn next sample or queued file
  const spawnNextFile = useCallback((customFile?: File) => {
    const nextSample = SAMPLE_FILES[sampleIndexRef.current % SAMPLE_FILES.length];
    sampleIndexRef.current += 1;

    const fileName = customFile ? customFile.name : nextSample.name;
    const fileSize = customFile ? customFile.size : nextSample.sizeBytes;
    const badgeInfo = inferFileBadge(fileName);

    setStagedFile({
      id: `bball-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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
  }, []);

  // Run the shot flight animation along simulated points
  const launchShotWithVelocity = useCallback(
    (origin: { x: number; y: number }, velocity: { vx: number; vy: number }) => {
      if (isFlying) return;

      const hoop = getHoopGeometry();
      const result = simulateBasketballShot(origin, velocity, hoop, 0.55, 70);

      // Show the trajectory dots briefly during the shot, just like image_9f1f16bb.png!
      setPreviewArc(result.points.slice(0, Math.max(18, result.crossingIndex)));
      setIsFlying(true);
      setShowReleaseHand(true);
      setReleaseHandPos({ x: origin.x, y: origin.y + 42 });

      setTimeout(() => {
        setShowReleaseHand(false);
      }, 650);

      let frameIdx = 0;
      const totalFrames = result.points.length;

      const stepAnimation = () => {
        if (frameIdx >= totalFrames) {
          setIsFlying(false);
          setFlightFrame(null);
          setPreviewArc([]);

          if (result.scored) {
            const uploadedItem: ThrowableFile = {
              ...stagedFile,
              status: 'uploaded',
              shotType: result.shotLabel,
              uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            };
            onFileUploaded(uploadedItem);
            spawnNextFile();
          } else {
            // Reset file back to spawn position on miss so user can shoot again
            setDragPos(DEFAULT_SPAWN);
          }
          return;
        }

        const pt = result.points[frameIdx];
        setFlightFrame(pt);

        // Once the ball reaches the apex and starts descending into the rim,
        // render it behind the front rim & net (z-20 vs z-30)
        setFlightZAboveRim(pt.vy < 0 && pt.y < hoop.rimY);

        // Trigger net swish when crossing rim plane
        if (result.scored && frameIdx === result.crossingIndex) {
          setNetSwish('swish');
          setShotCallout({ text: `${result.shotLabel} +1`, scored: true });
          setTimeout(() => setNetSwish('idle'), 650);
          setTimeout(() => setShotCallout(null), 1500);
        } else if (!result.scored && result.hitRim && frameIdx === 24) {
          setNetSwish('rim');
          setShotCallout({ text: result.shotLabel, scored: false });
          setTimeout(() => setNetSwish('idle'), 450);
          setTimeout(() => setShotCallout(null), 1200);
        }

        frameIdx += 1;
        requestAnimationFrame(stepAnimation);
      };

      requestAnimationFrame(stepAnimation);
    },
    [getHoopGeometry, isFlying, onFileUploaded, spawnNextFile, stagedFile]
  );

  // Trigger a guided shot (used by "Take the Shot" button or click)
  const triggerGuidedShot = useCallback(
    (bankShot = false) => {
      if (isFlying) return;
      const hoop = getHoopGeometry();
      const origin = { x: DEFAULT_SPAWN.x - 16, y: DEFAULT_SPAWN.y + 12 };
      const target = {
        x: bankShot ? hoop.rimCenterX + 12 : hoop.rimCenterX,
        y: bankShot ? hoop.rimY - 14 : hoop.rimY - 2,
      };
      const vel = calculateGuidedArcVelocity(origin, target, 0.55, 44);
      launchShotWithVelocity(origin, vel);
    },
    [getHoopGeometry, isFlying, launchShotWithVelocity]
  );

  // Convert client pointer coordinates to stage coordinates (480x490)
  const clientToStage = (clientX: number, clientY: number): { x: number; y: number } => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return DEFAULT_SPAWN;
    const scaleX = STAGE_WIDTH / rect.width;
    const scaleY = STAGE_HEIGHT / rect.height;
    return {
      x: Math.max(28, Math.min(STAGE_WIDTH - 28, (clientX - rect.left) * scaleX)),
      y: Math.max(28, Math.min(STAGE_HEIGHT - 28, (clientY - rect.top) * scaleY)),
    };
  };

  const handlePointerDownFile = (e: React.PointerEvent) => {
    if (isFlying) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDraggingFile(true);
    setShowReleaseHand(false);

    const pos = clientToStage(e.clientX, e.clientY);
    setDragPos(pos);

    const hoop = getHoopGeometry();
    const { vx, vy } = computeSlingshotVelocity(
      DEFAULT_SPAWN,
      pos,
      { x: hoop.rimCenterX, y: hoop.rimY },
      aimAssist ? 0.45 : 0.12
    );
    const sim = simulateBasketballShot(pos, { vx, vy }, hoop, 0.55, 46);
    setPreviewArc(sim.points.slice(0, 22));
  };

  const handlePointerMoveFile = (e: React.PointerEvent) => {
    if (!isDraggingFile || isFlying) return;
    const pos = clientToStage(e.clientX, e.clientY);
    setDragPos(pos);

    const hoop = getHoopGeometry();
    // Check if dragged directly inside the backboard dropzone
    const insideDropzone =
      pos.x >= hoop.backboardLeft &&
      pos.x <= hoop.backboardRight &&
      pos.y >= hoop.backboardTop &&
      pos.y <= hoop.backboardBottom;

    if (insideDropzone) {
      setPreviewArc([]);
      return;
    }

    const { vx, vy } = computeSlingshotVelocity(
      DEFAULT_SPAWN,
      pos,
      { x: hoop.rimCenterX, y: hoop.rimY },
      aimAssist ? 0.48 : 0.12
    );
    const sim = simulateBasketballShot(pos, { vx, vy }, hoop, 0.55, 46);
    setPreviewArc(sim.points.slice(0, 24));
  };

  const handlePointerUpFile = (e: React.PointerEvent) => {
    if (!isDraggingFile || isFlying) return;
    setIsDraggingFile(false);

    const pos = clientToStage(e.clientX, e.clientY);
    const hoop = getHoopGeometry();

    // 1. If user dragged the file directly into the backboard dropzone, drop it straight through the hoop!
    const insideDropzone =
      pos.x >= hoop.backboardLeft &&
      pos.x <= hoop.backboardRight &&
      pos.y >= hoop.backboardTop &&
      pos.y <= hoop.backboardBottom + 25;

    if (insideDropzone) {
      const dropOrigin = { x: hoop.rimCenterX, y: hoop.rimY - 52 };
      launchShotWithVelocity(dropOrigin, { vx: 0, vy: 2.2 });
      return;
    }

    // 2. Otherwise launch with slingshot / throw physics!
    const pullDist = Math.hypot(pos.x - DEFAULT_SPAWN.x, pos.y - DEFAULT_SPAWN.y);
    if (pullDist < 12) {
      // Quick tap on the file -> take a clean guided shot!
      triggerGuidedShot(false);
      return;
    }

    const { vx, vy } = computeSlingshotVelocity(
      DEFAULT_SPAWN,
      pos,
      { x: hoop.rimCenterX, y: hoop.rimY },
      aimAssist ? 0.52 : 0.15
    );
    launchShotWithVelocity(pos, { vx, vy });
  };

  // Native OS File Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsOsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const first = files[0];
      const badgeInfo = inferFileBadge(first.name);
      const droppedThrowable: ThrowableFile = {
        id: `os-bball-${Date.now()}`,
        name: first.name,
        sizeBytes: first.size,
        badge: badgeInfo.badge,
        badgeColor: badgeInfo.color,
        x: DEFAULT_SPAWN.x,
        y: DEFAULT_SPAWN.y,
        rotation: 0,
        status: 'staged',
        rawFile: first,
      };
      setStagedFile(droppedThrowable);
      // Launch immediately into the hoop
      const hoop = getHoopGeometry();
      const vel = calculateGuidedArcVelocity(DEFAULT_SPAWN, { x: hoop.rimCenterX, y: hoop.rimY }, 0.55, 44);
      setTimeout(() => {
        launchShotWithVelocity(DEFAULT_SPAWN, vel);
      }, 60);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      spawnNextFile(file);
    }
  };

  const hoop = getHoopGeometry();
  const activeFilePos = isFlying && flightFrame ? { x: flightFrame.x, y: flightFrame.y } : isDraggingFile ? dragPos : DEFAULT_SPAWN;
  const activeRotation = isFlying && flightFrame
    ? flightFrame.rotation
    : isDraggingFile
    ? -15
    : 0;
  const activeScale = isFlying && flightFrame ? flightFrame.scale : 1;

  // Choose every 3rd point for clean dotted arc matching image_9f1f16bb.png
  const arcDots = previewArc.filter((_, idx) => idx > 1 && idx % 3 === 0 && idx <= 21);

  return (
    <div
      className={`w-full max-w-[510px] bg-[var(--klic-component-block-color-soft)] border border-zinc-200/90 rounded-3xl ${density === 'compact' ? 'p-4 sm:p-5' : density === 'relaxed' ? 'p-7 sm:p-8' : 'p-6 sm:p-7'} shadow-md flex flex-col justify-between relative overflow-hidden`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="basketball-upload-block"
    >
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        aria-label="농구 골대 업로드용 파일 선택"
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 z-20">
        <div>
          <h2 className="text-[24px] font-bold tracking-tight text-zinc-900 leading-tight">
            농구 골대 파일 업로드
          </h2>
          <p className="text-[14px] text-zinc-500 mt-1">
            파일을 끌어 골대에 던져 넣으세요.
          </p>
        </div>

        {/* Top-Right Uploaded Counter */}
        <div
          className="bg-[var(--klic-component-block-color-border)]/90 px-3.5 py-1.5 rounded-full text-[13px] text-zinc-500 font-medium tracking-tight tabular-nums shrink-0"
          aria-live="polite"
          data-testid="basketball-uploaded-count"
        >
          업로드됨 <span className="font-bold text-zinc-900 ml-0.5">{uploadedFiles.length}</span>
        </div>
      </div>

      {/* Interactive Physics Court Stage */}
      <div
        ref={stageRef}
        className="relative w-full h-[460px] mt-1 select-none touch-none"
      >
        {/* Celebratory Shot Callout */}
        {shotCallout && (
          <div
            role="status"
            aria-live="polite"
            className={`absolute top-2 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all ${
              shotCallout.scored
                ? 'bg-[var(--klic-component-block-color-accent)] text-klic-on-emphasis'
                : 'bg-zinc-800 text-klic-on-emphasis'
            }`}
          >
            {shotCallout.scored && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
            {shotCallout.scored ? `업로드 완료 · ${shotCallout.text}` : shotCallout.text}
          </div>
        )}

        {/* BACKBOARD & BACK RIM (Layer z-10) */}
        <div
          style={{
            transform: `translateX(${hoopOffsetX}px)`,
            transition: movingHoop ? 'none' : 'transform 200ms ease-out',
          }}
          className="absolute inset-x-0 top-[34px] flex flex-col items-center z-10 pointer-events-none"
        >
          {/* Dashed White Dropzone Backboard */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`pointer-events-auto w-[292px] h-[184px] bg-white rounded-2xl border-[2px] border-dashed transition-colors flex flex-col items-center pt-6 relative cursor-pointer group focus-visible:outline-2 focus-visible:outline-blue-600 ${
              isOsDragOver
                ? 'border-[var(--klic-component-block-color-accent)] bg-blue-50/30'
                : 'border-[var(--klic-component-block-color-control-border)] hover:border-zinc-400'
            }`}
            aria-label="여기에 파일을 놓거나 클릭하여 파일 선택"
          >
            {/* Upload Icon */}
            <Upload className="w-[22px] h-[22px] text-zinc-500 group-hover:text-zinc-800 transition-colors stroke-[1.8]" />

            <span className="text-[15.5px] font-semibold text-zinc-900 mt-2.5 tracking-tight">
              여기에 파일을 놓으세요
            </span>
            <span className="text-[12.5px] text-zinc-400 mt-0.5">
              또는 아래 파일을 당겨 슛을 던지세요
            </span>

            {/* Orange Shooter's Square on Backboard */}
            <div className="mt-auto mb-[6px] w-[102px] h-[64px] border-[2.5px] border-[var(--klic-component-block-color-accent)] rounded-sm" />

            {/* Orange Rim Mounting Bracket */}
            <div className="w-[22px] h-[6px] bg-[var(--klic-component-block-color-accent)] -mb-[2px]" />
          </button>

          {/* Back Half of the Orange Rim (behind the falling file) */}
          <svg
            width="140"
            height="28"
            viewBox="0 0 140 28"
            className="-mt-[9px] overflow-visible"
          >
            <path
              d="M 12 14 A 58 9 0 0 1 128 14"
              fill="none"
              stroke="var(--klic-component-block-color-accent)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* DOTTED ORANGE TRAJECTORY ARC */}
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

        {/* THROWABLE FILE DOCUMENT CARD (z-35 when ascending, z-20 when dropping into the hoop!) */}
        <div
          onPointerDown={handlePointerDownFile}
          onPointerMove={handlePointerMoveFile}
          onPointerUp={handlePointerUpFile}
          onMouseEnter={() => {
            if (!isFlying && !isDraggingFile) {
              const vel = calculateGuidedArcVelocity(
                DEFAULT_SPAWN,
                { x: hoop.rimCenterX, y: hoop.rimY - 2 },
                0.55,
                44
              );
              const sim = simulateBasketballShot(DEFAULT_SPAWN, vel, hoop, 0.55, 46);
              setPreviewArc(sim.points.slice(0, 22));
            }
          }}
          onMouseLeave={() => {
            if (!isFlying && !isDraggingFile) {
              setPreviewArc([]);
            }
          }}
          style={{
            left: `${(activeFilePos.x / STAGE_WIDTH) * 100}%`,
            top: `${(activeFilePos.y / STAGE_HEIGHT) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className={`absolute ${
            flightZAboveRim ? 'z-35' : 'z-20'
          } ${isFlying ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}
          role="button"
          tabIndex={0}
          aria-label={`던질 수 있는 파일 ${stagedFile.name}. 드래그하여 조준 후 놓거나 Enter 키를 눌러 발사하세요.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerGuidedShot(false);
            }
          }}
          data-testid="basketball-throwable-file"
        >
          <FileDocumentCard
            key={stagedFile.id}
            name={stagedFile.name}
            badge={stagedFile.badge}
            badgeColor={stagedFile.badgeColor}
            isGrabbing={isDraggingFile}
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
            className="absolute z-30 pointer-events-none animate-fade-in"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-900">
                <path d="M11.5 2a1.25 1.25 0 0 1 1.25 1.25v6.25h.75V3.75a1.25 1.25 0 0 1 2.5 0v5.75h.75V5.25a1.25 1.25 0 0 1 2.5 0V14.5a6.5 6.5 0 0 1-6.5 6.5h-1.8a6.2 6.2 0 0 1-5.4-3.15l-2.75-4.85a1.35 1.35 0 0 1 2.15-1.68l2.05 1.93V4.25a1.25 1.25 0 0 1 2.5 0v5.25h.75V3.25A1.25 1.25 0 0 1 11.5 2Z" />
              </svg>
            </div>
          </div>
        )}

        {/* FRONT RIM & WOVEN BASKETBALL NET (Layer z-30 — in front of the file as it drops through the hoop!) */}
        <div
          style={{
            transform: `translateX(${hoopOffsetX}px)`,
            transition: movingHoop ? 'none' : 'transform 200ms ease-out',
          }}
          className="absolute inset-x-0 top-[209px] flex flex-col items-center z-30 pointer-events-none"
        >
          <svg
            width="140"
            height="108"
            viewBox="0 0 140 108"
            className="overflow-visible"
            style={{
              transformOrigin: '70px 10px',
              transform:
                netSwish === 'swish'
                  ? 'scaleY(1.14) scaleX(0.93)'
                  : netSwish === 'rim'
                  ? 'translateX(3px) rotate(1.5deg)'
                  : 'scale(1)',
              transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Woven Gray Net Mesh */}
            <g stroke="var(--klic-component-block-color-control-border)" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 14 14 L 31 94" />
              <path d="M 126 14 L 109 94" />

              <path d="M 14 14 L 44 94" />
              <path d="M 30 16 L 57 94" />
              <path d="M 46 18 L 70 94" />
              <path d="M 62 19 L 83 94" />
              <path d="M 78 19 L 96 94" />
              <path d="M 94 18 L 109 94" />
              <path d="M 110 16 L 116 56" />

              <path d="M 30 16 L 24 56" />
              <path d="M 46 18 L 31 94" />
              <path d="M 62 19 L 44 94" />
              <path d="M 78 19 L 57 94" />
              <path d="M 94 18 L 70 94" />
              <path d="M 110 16 L 83 94" />
              <path d="M 126 14 L 96 94" />

              <path d="M 19 38 Q 70 43 121 38" strokeOpacity="0.65" />
              <path d="M 25 65 Q 70 70 115 65" strokeOpacity="0.65" />
            </g>

            {/* Front Half of the Orange Rim */}
            <path
              d="M 12 12 A 58 9 0 0 0 128 12"
              fill="none"
              stroke="var(--klic-component-block-color-accent)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Subtle Interactive Action Footer inside Component Block */}
      <div className="pt-2 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => triggerGuidedShot(false)}
            disabled={isFlying}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-klic-on-emphasis text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            슛 던지기
          </button>

          <button
            type="button"
            onClick={() => triggerGuidedShot(true)}
            disabled={isFlying}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            뱅크슛
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleMovingHoop && (
            <button
              type="button"
              onClick={onToggleMovingHoop}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                movingHoop
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              {movingHoop ? '움직이는 골대: 켜짐' : '움직이는 골대'}
            </button>
          )}

          <button
            type="button"
            onClick={() => spawnNextFile()}
            disabled={isFlying}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="다음 샘플 파일로 변경"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            다음 파일
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="내 컴퓨터에서 파일 선택"
          >
            <Plus className="w-3.5 h-3.5" />
            내 파일
          </button>
        </div>
      </div>
    </div>
  );
};
