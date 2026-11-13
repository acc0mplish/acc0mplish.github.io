/** SPDX-License-Identifier: Apache-2.0 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  type ThrowableFile,
  type SoccerGoalGeometry,
  type TrajectoryPoint,
  inferFileBadge,
  simulateSoccerShot,
} from './shotPhysics';
import { FileDocumentCard } from './FileDocumentCard';
import { Upload, Shield, Sparkles, RotateCcw, Plus, Crosshair, CheckCircle2 } from 'lucide-react';

interface SoccerGoalUploadSceneProps {
  density?: 'compact' | 'normal' | 'relaxed';
  uploadedFiles: ThrowableFile[];
  onFileUploaded: (file: ThrowableFile) => void;
  keeperActive?: boolean;
  onToggleKeeper?: () => void;
}

const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 490;
const PENALTY_SPOT = { x: 240, y: 386 };

const SOCCER_SAMPLE_FILES: Array<{ name: string; sizeBytes: number }> = [
  { name: '전술_분석_보고서.pdf', sizeBytes: 1_940_000 },
  { name: '선수단_스탯_데이터.csv', sizeBytes: 840_320 },
  { name: '유니폼_시안_최종.fig', sizeBytes: 6_420_000 },
  { name: '하이라이트_영상.mp4', sizeBytes: 12_500_000 },
  { name: '선발_라인업_명단.pdf', sizeBytes: 1_280_000 },
];

export const SoccerGoalUploadScene: React.FC<SoccerGoalUploadSceneProps> = ({
  density = 'normal',
  uploadedFiles,
  onFileUploaded,
  keeperActive = false,
  onToggleKeeper,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleIdxRef = useRef(1);

  const [stagedFile, setStagedFile] = useState<ThrowableFile>(() => {
    const badgeInfo = inferFileBadge('전술_분석_보고서.pdf');
    return {
      id: 'soccer-initial-1',
      name: '전술_분석_보고서.pdf',
      sizeBytes: 1_940_000,
      badge: badgeInfo.badge,
      badgeColor: badgeInfo.color,
      x: PENALTY_SPOT.x,
      y: PENALTY_SPOT.y,
      rotation: 0,
      status: 'staged',
    };
  });

  // Goalkeeper horizontal patrol position
  const [keeperX, setKeeperX] = useState(STAGE_WIDTH / 2);
  const keeperPhaseRef = useRef(0);

  // Drag / Free-kick aiming state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>(PENALTY_SPOT);
  const [previewArc, setPreviewArc] = useState<TrajectoryPoint[]>([]);
  const [aimTarget, setAimTarget] = useState<{ x: number; y: number }>({ x: 145, y: 128 });
  const [curveSpin, setCurveSpin] = useState<number>(-0.55);
  const [showReleaseHand, setShowReleaseHand] = useState(false);

  // Flight & Net Ripple animation state
  const [isFlying, setIsFlying] = useState(false);
  const [flightFrame, setFlightFrame] = useState<TrajectoryPoint | null>(null);
  const [netRipple, setNetRipple] = useState<{ active: boolean; x: number; y: number }>({
    active: false,
    x: 240,
    y: 140,
  });
  const [shotCallout, setShotCallout] = useState<{ text: string; scored: boolean } | null>(null);
  const [isOsDragOver, setIsOsDragOver] = useState(false);

  // Goalpost geometry in 480x490 stage coordinates
  const getGoalGeometry = useCallback(
    (currentKeeperX = keeperX): SoccerGoalGeometry => ({
      goalLeft: 86,
      goalRight: 394,
      goalTop: 94,
      goalBottom: 238,
      postRadius: 6,
      ...(keeperActive
        ? {
            keeperX: currentKeeperX,
            keeperY: 184,
            keeperWidth: 58,
            keeperHeight: 74,
          }
        : {}),
    }),
    [keeperActive, keeperX]
  );

  // Goalkeeper animation loop when active
  useEffect(() => {
    if (!keeperActive) {
      setKeeperX(STAGE_WIDTH / 2);
      return;
    }
    let rafId: number;
    const tick = () => {
      keeperPhaseRef.current += 0.036;
      setKeeperX(STAGE_WIDTH / 2 + Math.sin(keeperPhaseRef.current) * 95);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [keeperActive]);

  const spawnNextFile = useCallback((customFile?: File) => {
    const nextSample = SOCCER_SAMPLE_FILES[sampleIdxRef.current % SOCCER_SAMPLE_FILES.length];
    sampleIdxRef.current += 1;

    const fileName = customFile ? customFile.name : nextSample.name;
    const fileSize = customFile ? customFile.size : nextSample.sizeBytes;
    const badgeInfo = inferFileBadge(fileName);

    setStagedFile({
      id: `soccer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: fileName,
      sizeBytes: fileSize,
      badge: badgeInfo.badge,
      badgeColor: badgeInfo.color,
      x: PENALTY_SPOT.x,
      y: PENALTY_SPOT.y,
      rotation: 0,
      status: 'staged',
      rawFile: customFile,
    });
    setDragPos(PENALTY_SPOT);
    setPreviewArc([]);
  }, []);

  // Execute soccer shot flight
  const launchSoccerShot = useCallback(
    (
      origin: { x: number; y: number },
      target: { x: number; y: number },
      spin: number
    ) => {
      if (isFlying) return;
      const goal = getGoalGeometry();
      const result = simulateSoccerShot(origin, target, spin, goal, 36);

      setPreviewArc(result.points.slice(0, 32));
      setIsFlying(true);
      setShowReleaseHand(true);
      setTimeout(() => setShowReleaseHand(false), 600);

      let idx = 0;
      const total = result.points.length;

      const step = () => {
        if (idx >= total) {
          setIsFlying(false);
          setFlightFrame(null);
          setPreviewArc([]);

          if (result.scored) {
            const uploaded: ThrowableFile = {
              ...stagedFile,
              status: 'uploaded',
              shotType: result.shotLabel,
              uploadedAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
            };
            onFileUploaded(uploaded);
            spawnNextFile();
          } else {
            setDragPos(PENALTY_SPOT);
          }
          return;
        }

        const pt = result.points[idx];
        setFlightFrame(pt);

        // Trigger net ripple when ball reaches goal plane (idx === 35)
        if (idx === 34) {
          if (result.scored) {
            setNetRipple({ active: true, x: target.x, y: target.y });
            setShotCallout({ text: `${result.shotLabel} +1`, scored: true });
            setTimeout(() => setNetRipple((prev) => ({ ...prev, active: false })), 650);
            setTimeout(() => setShotCallout(null), 1500);
          } else {
            setShotCallout({ text: result.shotLabel, scored: false });
            setTimeout(() => setShotCallout(null), 1300);
          }
        }

        idx += 1;
        requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    },
    [getGoalGeometry, isFlying, onFileUploaded, spawnNextFile, stagedFile]
  );

  // Trigger a preset shot ("Top Bins" or smart corner avoiding keeper)
  const triggerPresetKick = useCallback(
    (preset: 'top-bins-left' | 'top-bins-right' | 'knuckle') => {
      if (isFlying) return;
      // Pick the corner opposite the goalkeeper if keeper is active
      const pickRightCorner =
        preset === 'top-bins-right' || (keeperActive && keeperX < STAGE_WIDTH / 2);

      const target =
        preset === 'knuckle'
          ? { x: keeperActive && keeperX > 220 ? 132 : 348, y: 148 }
          : pickRightCorner
          ? { x: 356, y: 122 }
          : { x: 124, y: 122 };

      const spin =
        preset === 'knuckle' ? 0.15 : pickRightCorner ? 0.72 : -0.72;

      setAimTarget(target);
      setCurveSpin(spin);
      launchSoccerShot(PENALTY_SPOT, target, spin);
    },
    [isFlying, keeperActive, keeperX, launchSoccerShot]
  );

  const clientToStage = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return PENALTY_SPOT;
    const scaleX = STAGE_WIDTH / rect.width;
    const scaleY = STAGE_HEIGHT / rect.height;
    return {
      x: Math.max(28, Math.min(STAGE_WIDTH - 28, (clientX - rect.left) * scaleX)),
      y: Math.max(28, Math.min(STAGE_HEIGHT - 28, (clientY - rect.top) * scaleY)),
    };
  };

  // Map pointer drag position to goal target + curve spin
  const computeTargetFromDrag = (pos: { x: number; y: number }) => {
    const goal = getGoalGeometry();
    // If user drags directly into or near the goal mouth, target that exact point!
    if (pos.y < 275) {
      const clampedX = Math.max(goal.goalLeft - 20, Math.min(goal.goalRight + 20, pos.x));
      const clampedY = Math.max(goal.goalTop - 10, Math.min(goal.goalBottom, pos.y));
      const spin = ((clampedX - STAGE_WIDTH / 2) / 160) * 0.65;
      return { target: { x: clampedX, y: clampedY }, spin };
    }

    // Slingshot pull-back at bottom: pulling left aims right with curve, or pulling down aims top corner
    const pullDx = PENALTY_SPOT.x - pos.x;
    const pullDy = Math.max(10, pos.y - PENALTY_SPOT.y + 45);
    const targetX = Math.max(
      goal.goalLeft + 18,
      Math.min(goal.goalRight - 18, STAGE_WIDTH / 2 + pullDx * 1.65)
    );
    const targetY = Math.max(
      goal.goalTop + 16,
      Math.min(goal.goalBottom - 18, goal.goalBottom - pullDy * 1.35)
    );
    const spin = Math.max(-1.1, Math.min(1.1, (pullDx / 90) * 0.85));
    return { target: { x: targetX, y: targetY }, spin };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFlying) return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);

    const pos = clientToStage(e.clientX, e.clientY);
    setDragPos(pos);
    const { target, spin } = computeTargetFromDrag(pos);
    setAimTarget(target);
    setCurveSpin(spin);

    const sim = simulateSoccerShot(pos, target, spin, getGoalGeometry(), 34);
    setPreviewArc(sim.points.slice(0, 32));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isFlying) return;
    const pos = clientToStage(e.clientX, e.clientY);
    setDragPos(pos);

    const { target, spin } = computeTargetFromDrag(pos);
    setAimTarget(target);
    setCurveSpin(spin);

    const sim = simulateSoccerShot(pos, target, spin, getGoalGeometry(), 34);
    setPreviewArc(sim.points.slice(0, 32));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || isFlying) return;
    setIsDragging(false);

    const pos = clientToStage(e.clientX, e.clientY);
    const dist = Math.hypot(pos.x - PENALTY_SPOT.x, pos.y - PENALTY_SPOT.y);

    if (dist < 12) {
      // Quick click -> curl into top bins!
      triggerPresetKick('top-bins-left');
      return;
    }

    const { target, spin } = computeTargetFromDrag(pos);
    launchSoccerShot(pos, target, spin);
  };

  // OS Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const badgeInfo = inferFileBadge(file.name);
      setStagedFile({
        id: `os-soccer-${Date.now()}`,
        name: file.name,
        sizeBytes: file.size,
        badge: badgeInfo.badge,
        badgeColor: badgeInfo.color,
        x: PENALTY_SPOT.x,
        y: PENALTY_SPOT.y,
        rotation: 0,
        status: 'staged',
        rawFile: file,
      });
      setTimeout(() => {
        triggerPresetKick('top-bins-right');
      }, 60);
    }
  };

  const goal = getGoalGeometry();
  const activePos =
    isFlying && flightFrame
      ? { x: flightFrame.x, y: flightFrame.y }
      : isDragging
      ? dragPos
      : PENALTY_SPOT;
  const activeRotation =
    isFlying && flightFrame
      ? flightFrame.rotation
      : isDragging
      ? curveSpin * 22
      : 0;
  const activeScale = isFlying && flightFrame ? flightFrame.scale : 1;

  const arcDots = previewArc.filter((_, idx) => idx > 1 && idx % 3 === 0 && idx <= 30);

  return (
    <div
      className={`w-full max-w-[510px] bg-[var(--klic-component-block-color-soft)] border border-zinc-200/90 rounded-3xl ${density === 'compact' ? 'p-4 sm:p-5' : density === 'relaxed' ? 'p-7 sm:p-8' : 'p-6 sm:p-7'} shadow-md flex flex-col justify-between relative overflow-hidden`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOsDragOver(true);
      }}
      onDragLeave={() => setIsOsDragOver(false)}
      onDrop={handleDrop}
      data-testid="soccer-upload-block"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) spawnNextFile(f);
        }}
        aria-label="축구 골대 업로드용 파일 선택"
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 z-20">
        <div>
          <h2 className="text-[24px] font-bold tracking-tight text-zinc-900 leading-tight">
            축구 골대 파일 업로드
          </h2>
          <p className="text-[14px] text-zinc-500 mt-1">
            파일을 골키퍼를 피해 감아 차세요.
          </p>
        </div>

        <div
          className="bg-[var(--klic-component-block-color-border)]/90 px-3.5 py-1.5 rounded-full text-[13px] text-zinc-500 font-medium tracking-tight tabular-nums shrink-0"
          aria-live="polite"
          data-testid="soccer-uploaded-count"
        >
          업로드됨 <span className="font-bold text-zinc-900 ml-0.5">{uploadedFiles.length}</span>
        </div>
      </div>

      {/* Interactive Soccer Goal Stage */}
      <div
        ref={stageRef}
        className="relative w-full h-[460px] mt-1 select-none touch-none"
      >
        {/* Shot Result Callout */}
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

        {/* SOCCER GOALPOST & WOVEN NET DROPZONE */}
        <div className="absolute inset-x-0 top-[26px] flex flex-col items-center z-10">
          {/* Outer Dashed Dropzone Card acting as Stadium Penalty Backdrop */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-[348px] h-[238px] bg-white rounded-2xl border-[2px] border-dashed transition-colors flex flex-col items-center pt-4 relative cursor-pointer group focus-visible:outline-2 focus-visible:outline-blue-600 ${
              isOsDragOver
                ? 'border-blue-500 bg-blue-50/30'
                : 'border-[var(--klic-component-block-color-control-border)] hover:border-zinc-400'
            }`}
            aria-label="축구 골대 드롭존. 여기에 파일을 놓거나 클릭하여 파일 선택"
          >
            {/* Upload Prompt Header inside Top of Dropzone */}
            <div className="flex items-center gap-2 text-zinc-600 group-hover:text-zinc-900 transition-colors">
              <Upload className="w-[18px] h-[18px] stroke-[1.9]" />
              <span className="text-[15px] font-semibold text-zinc-900 tracking-tight">
                여기에 파일을 놓으세요
              </span>
              <span className="text-[12.5px] text-zinc-400">
                또는 상단 구석으로 슛
              </span>
            </div>

            {/* 3D SOCCER GOALPOST & NET SVG */}
            <div
              className="mt-2.5 relative w-[316px] h-[168px]"
              style={{
                transform: netRipple.active ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <svg
                viewBox="0 0 316 168"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Woven hexagonal/diamond goal net pattern */}
                  <pattern
                    id="soccer-net-mesh"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 7 0 L 14 7 L 7 14 L 0 7 Z"
                      fill="none"
                      stroke="var(--klic-component-block-color-control-border)"
                      strokeWidth="1.25"
                    />
                  </pattern>
                </defs>

                {/* Inner 3D Recessed Back Net Box */}
                <polygon
                  points="10,8 306,8 286,154 30,154"
                  fill="var(--klic-component-block-color-surface)"
                />

                {/* Back Net Mesh Fill */}
                <polygon
                  points="10,8 306,8 286,154 30,154"
                  fill="url(#soccer-net-mesh)"
                  style={{
                    transformOrigin: `${netRipple.x - 82}px ${netRipple.y - 76}px`,
                    transform: netRipple.active ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 240ms ease-out',
                  }}
                />

                {/* Side Net Depth Triangles (Left & Right 3D perspective) */}
                <polygon
                  points="10,8 30,26 30,154 10,158"
                  fill="url(#soccer-net-mesh)"
                  opacity="0.75"
                />
                <polygon
                  points="306,8 286,26 286,154 306,158"
                  fill="url(#soccer-net-mesh)"
                  opacity="0.75"
                />

                {/* 3D Depth Support Stanchions (Back-frame bars in KLIC blue/neutral) */}
                <path
                  d="M 10 8 L 30 26 L 286 26 L 306 8"
                  fill="none"
                  stroke="var(--klic-component-block-color-muted)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                <line x1="30" y1="26" x2="30" y2="154" stroke="var(--klic-component-block-color-control-border)" strokeWidth="2" />
                <line x1="286" y1="26" x2="286" y2="154" stroke="var(--klic-component-block-color-control-border)" strokeWidth="2" />
                <line x1="10" y1="154" x2="306" y2="154" stroke="var(--klic-component-block-color-control-border)" strokeWidth="2.5" />

                {/* Top Bins Corner Target Bullseyes (Left & Right 90-degree corners) */}
                <g opacity="0.85">
                  <circle cx="36" cy="34" r="14" fill="var(--klic-component-block-color-accent)" fillOpacity="0.1" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="36" cy="34" r="4" fill="var(--klic-component-block-color-accent)" fillOpacity="0.35" />

                  <circle cx="280" cy="34" r="14" fill="var(--klic-component-block-color-accent)" fillOpacity="0.1" stroke="var(--klic-component-block-color-accent)" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="280" cy="34" r="4" fill="var(--klic-component-block-color-accent)" fillOpacity="0.35" />
                </g>

                {/* Net Impact Ripple Ring when Goal is Scored */}
                {netRipple.active && (
                  <g>
                    <circle
                      cx={Math.max(30, Math.min(286, netRipple.x - 82))}
                      cy={Math.max(24, Math.min(142, netRipple.y - 78))}
                      r="24"
                      fill="none"
                      stroke="var(--klic-component-block-color-accent)"
                      strokeWidth="2.5"
                      strokeOpacity="0.65"
                    />
                    <circle
                      cx={Math.max(30, Math.min(286, netRipple.x - 82))}
                      cy={Math.max(24, Math.min(142, netRipple.y - 78))}
                      r="12"
                      fill="var(--klic-component-block-color-accent)"
                      fillOpacity="0.2"
                    />
                  </g>
                )}

                {/* MAIN FRONT GOALPOSTS & CROSSBAR (KLIC blue and neutral frame) */}
                {/* Post Shadow */}
                <path
                  d="M 10 158 L 10 8 L 306 8 L 306 158"
                  fill="none"
                  stroke="var(--klic-component-block-color-text)"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Inner Crisp White/Silver Goal Frame Highlight */}
                <path
                  d="M 10 158 L 10 8 L 306 8 L 306 158"
                  fill="none"
                  stroke="var(--klic-component-block-color-panel)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Blue Corner Brackets on Goal Frame */}
                <path
                  d="M 10 32 L 10 8 L 36 8"
                  fill="none"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 280 8 L 306 8 L 306 32"
                  fill="none"
                  stroke="var(--klic-component-block-color-accent)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Animated Goalkeeper Blocker when Keeper Mode is ON */}
              {keeperActive && (
                <div
                  style={{
                    left: `${((keeperX - 82) / 316) * 100}%`,
                    top: '58%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-25 pointer-events-none flex flex-col items-center"
                >
                  <div className="px-2.5 py-1.5 rounded-xl bg-zinc-900/95 text-klic-on-emphasis border-2 border-blue-400 shadow-md flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold tracking-wider">골키퍼</span>
                  </div>
                </div>
              )}
            </div>
          </button>

          {/* Penalty Box Arc Marking below the Goal */}
          <svg width="180" height="26" viewBox="0 0 180 26" className="-mt-[2px] opacity-60 pointer-events-none">
            <path
              d="M 20 2 Q 90 28 160 2"
              fill="none"
              stroke="var(--klic-component-block-color-control-border)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* CURVED DOTTED TRAJECTORY ARC + AIM RETICLE */}
        <svg
          viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          {arcDots.map((dot, index) => {
            const opacity = 0.88 - (index / Math.max(arcDots.length, 1)) * 0.35;
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

          {/* Target Reticle inside Goal when Dragging */}
          {isDragging && (
            <g transform={`translate(${aimTarget.x}, ${aimTarget.y})`}>
              <circle r="11" fill="none" stroke="var(--klic-component-block-color-accent)" strokeWidth="2" strokeDasharray="3 2" />
              <circle r="3.5" fill="var(--klic-component-block-color-accent)" />
            </g>
          )}
        </svg>

        {/* Penalty Spot Marker on the Pitch */}
        <div
          style={{
            left: `${(PENALTY_SPOT.x / STAGE_WIDTH) * 100}%`,
            top: `${((PENALTY_SPOT.y + 18) / STAGE_HEIGHT) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute w-8 h-2.5 rounded-full bg-zinc-300/75 pointer-events-none z-10"
        />

        {/* THROWABLE / KICKABLE FILE CARD */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onMouseEnter={() => {
            if (!isFlying && !isDragging) {
              const sim = simulateSoccerShot(
                PENALTY_SPOT,
                { x: 124, y: 122 },
                -0.72,
                getGoalGeometry(),
                34
              );
              setPreviewArc(sim.points.slice(0, 32));
            }
          }}
          onMouseLeave={() => {
            if (!isFlying && !isDragging) {
              setPreviewArc([]);
            }
          }}
          style={{
            left: `${(activePos.x / STAGE_WIDTH) * 100}%`,
            top: `${(activePos.y / STAGE_HEIGHT) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className={`absolute z-30 ${
            isFlying ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
          }`}
          role="button"
          tabIndex={0}
          aria-label={`찰 수 있는 파일 ${stagedFile.name}. 드래그하여 축구 골대로 감아차거나 Enter 키를 눌러 발사하세요.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerPresetKick('top-bins-left');
            }
          }}
          data-testid="soccer-throwable-file"
        >
          <FileDocumentCard
            key={stagedFile.id}
            name={stagedFile.name}
            badge={stagedFile.badge}
            badgeColor={stagedFile.badgeColor}
            isGrabbing={isDragging}
            isFlying={isFlying}
            showHandIcon={!isFlying && !showReleaseHand ? 'fist' : 'none'}
            scale={activeScale}
            rotation={activeRotation}
          />
        </div>

        {/* Open Hand Release Indicator */}
        {showReleaseHand && (
          <div
            style={{
              left: `${(PENALTY_SPOT.x / STAGE_WIDTH) * 100}%`,
              top: `${((PENALTY_SPOT.y + 44) / STAGE_HEIGHT) * 100}%`,
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
      </div>

      {/* Interactive Action Footer inside Soccer Component Block */}
      <div className="pt-2 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => triggerPresetKick('top-bins-left')}
            disabled={isFlying}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-klic-on-emphasis text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            페널티킥 차기
          </button>

          <button
            type="button"
            onClick={() => triggerPresetKick('top-bins-right')}
            disabled={isFlying}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-600" />
            구석 감아차기
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleKeeper && (
            <button
              type="button"
              onClick={onToggleKeeper}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                keeperActive
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {keeperActive ? '골키퍼: 켜짐' : '골키퍼 모드'}
            </button>
          )}

          <button
            type="button"
            onClick={() => spawnNextFile()}
            disabled={isFlying}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="다음 축구 샘플 파일로 변경"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            다음 파일
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="축구 골대용 내 파일 선택"
          >
            <Plus className="w-3.5 h-3.5" />
            내 파일
          </button>
        </div>
      </div>
    </div>
  );
};
