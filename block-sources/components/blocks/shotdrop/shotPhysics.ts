/** SPDX-License-Identifier: Apache-2.0 */
export type FileTypeBadge = 'PDF' | 'PNG' | 'FIG' | 'ZIP' | 'MP4' | 'DOC' | 'CSV';

export interface ThrowableFile {
  id: string;
  name: string;
  sizeBytes: number;
  badge: FileTypeBadge;
  badgeColor: string;
  x: number;
  y: number;
  rotation: number;
  status: 'staged' | 'uploaded';
  uploadedAt?: string;
  shotType?: string; // e.g., 'Swish!', 'Bank Shot!', 'Top Bins!', 'Direct Drop'
  rawFile?: File;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

export interface HoopGeometry {
  rimCenterX: number;
  rimY: number;
  rimRadius: number; // half-width of the hoop opening
  backboardTop: number;
  backboardBottom: number;
  backboardLeft: number;
  backboardRight: number;
}

export interface SoccerGoalGeometry {
  goalLeft: number;
  goalRight: number;
  goalTop: number; // crossbar Y
  goalBottom: number; // goal line Y
  postRadius: number;
  keeperX?: number;
  keeperY?: number;
  keeperWidth?: number;
  keeperHeight?: number;
}

export interface BasketballShotResult {
  points: TrajectoryPoint[];
  scored: boolean;
  shotLabel: '클린 샷!' | '뱅크슛!' | '림 맞고 골인!' | '림 튕김!' | '에어볼';
  crossingIndex: number;
  hitRim: boolean;
  hitBackboard: boolean;
}

export interface SoccerShotResult {
  points: TrajectoryPoint[];
  scored: boolean;
  shotLabel: '상단 구석 골!' | '골인!' | '골대 맞고 골인!' | '골키퍼 선방!' | '골대 강타!' | '빗나감!';
  impactPoint: Point2D;
  hitPost: boolean;
  savedByKeeper: boolean;
}

export interface TrashCanGeometry {
  rimCenterX: number;
  rimY: number;
  rimRadius: number; // half-width of the trash can opening
  canBottomY: number;
  backboardTop: number;
  backboardBottom: number;
  backboardLeft: number;
  backboardRight: number;
}

export interface TrashShotResult {
  points: TrajectoryPoint[];
  scored: boolean;
  shotLabel: '클린 골인!' | '모서리 맞고 골인!' | '벽 맞고 골인!' | '통 맞고 튕김!' | '빗나감!';
  crossingIndex: number;
  hitRim: boolean;
  hitWall: boolean;
}

export const BADGE_CONFIGS: Record<FileTypeBadge, { color: string; label: FileTypeBadge }> = {
  PDF: { color: 'var(--klic-component-block-color-accent)', label: 'PDF' },
  PNG: { color: 'var(--klic-component-block-color-accent)', label: 'PNG' },
  FIG: { color: 'var(--klic-component-block-color-accent)', label: 'FIG' },
  ZIP: { color: 'var(--klic-component-block-color-accent)', label: 'ZIP' },
  MP4: { color: 'var(--klic-component-block-color-accent)', label: 'MP4' },
  DOC: { color: 'var(--klic-component-block-color-accent)', label: 'DOC' },
  CSV: { color: 'var(--klic-component-block-color-accent)', label: 'CSV' },
};

export function inferFileBadge(filename: string): { badge: FileTypeBadge; color: string } {
  const ext = filename.split('.').pop()?.toUpperCase() || '';
  if (ext === 'PDF') return { badge: 'PDF', color: BADGE_CONFIGS.PDF.color };
  if (['PNG', 'JPG', 'JPEG', 'WEBP', 'SVG', 'GIF'].includes(ext)) {
    return { badge: 'PNG', color: BADGE_CONFIGS.PNG.color };
  }
  if (['FIG', 'SKETCH', 'XD'].includes(ext)) {
    return { badge: 'FIG', color: BADGE_CONFIGS.FIG.color };
  }
  if (['ZIP', 'RAR', 'TAR', 'GZ', '7Z'].includes(ext)) {
    return { badge: 'ZIP', color: BADGE_CONFIGS.ZIP.color };
  }
  if (['MP4', 'MOV', 'WEBM', 'AVI'].includes(ext)) {
    return { badge: 'MP4', color: BADGE_CONFIGS.MP4.color };
  }
  if (['CSV', 'XLS', 'XLSX', 'JSON'].includes(ext)) {
    return { badge: 'CSV', color: BADGE_CONFIGS.CSV.color };
  }
  if (['DOC', 'DOCX', 'TXT', 'MD'].includes(ext)) {
    return { badge: 'DOC', color: BADGE_CONFIGS.DOC.color };
  }
  return { badge: 'PDF', color: BADGE_CONFIGS.PDF.color };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Calculates initial launch velocity (vx, vy) to guide a projectile from `start`
 * to `target` with a high basketball arc under constant `gravity`.
 */
export function calculateGuidedArcVelocity(
  start: Point2D,
  target: Point2D,
  gravity = 0.55,
  steps = 46
): { vx: number; vy: number } {
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const vx = dx / steps;
  const vy = (dy - 0.5 * gravity * steps * steps) / steps;
  return { vx, vy };
}

/**
 * Converts a user drag/slingshot pull vector (or flick vector) into launch velocity,
 * blending optional smart aim-assist so shots feel rewarding and responsive.
 */
export function computeSlingshotVelocity(
  start: Point2D,
  dragCurrent: Point2D,
  target: Point2D,
  assistStrength = 0.38,
  gravity = 0.55
): { vx: number; vy: number; pullDistance: number } {
  const rawDx = start.x - dragCurrent.x;
  const rawDy = start.y - dragCurrent.y;
  const pullDistance = Math.hypot(rawDx, rawDy);

  // If user dragged upward toward the hoop instead of pulling back down,
  // treat the vector from start -> dragCurrent as a throw direction
  const isPullingBack = dragCurrent.y >= start.y - 15;
  const launchDirX = isPullingBack ? rawDx : (dragCurrent.x - start.x);
  const launchDirY = isPullingBack ? rawDy : (dragCurrent.y - start.y);

  const clampedPull = Math.min(Math.max(pullDistance, 25), 170);
  const powerScale = 0.135;

  const manualVx = launchDirX * powerScale;
  const manualVy = Math.min(launchDirY * powerScale, -9.5); // Ensure upward arc

  const ideal = calculateGuidedArcVelocity(start, target, gravity, 46);

  const vx = manualVx * (1 - assistStrength) + ideal.vx * assistStrength;
  const vy = manualVy * (1 - assistStrength) + ideal.vy * assistStrength;

  return { vx, vy, pullDistance };
}

/**
 * Simulates a full basketball shot trajectory and evaluates rim/backboard collisions
 * and whether the file drops cleanly through the hoop.
 */
export function simulateBasketballShot(
  start: Point2D,
  initialVelocity: { vx: number; vy: number },
  hoop: HoopGeometry,
  gravity = 0.55,
  maxSteps = 72
): BasketballShotResult {
  const points: TrajectoryPoint[] = [];
  let x = start.x;
  let y = start.y;
  let vx = initialVelocity.vx;
  let vy = initialVelocity.vy;
  let rotation = -14;

  let scored = false;
  let crossingIndex = -1;
  let hitRim = false;
  let hitBackboard = false;

  const leftRimX = hoop.rimCenterX - hoop.rimRadius;
  const rightRimX = hoop.rimCenterX + hoop.rimRadius;

  for (let i = 0; i < maxSteps; i++) {
    const prevY = y;
    const prevX = x;

    x += vx;
    y += vy;
    vy += gravity;
    rotation += vx * 1.6 + 2.2;

    // Backboard bank reflection when ball is aimed off-center at the upper square
    if (
      !scored &&
      vy > 0 &&
      y >= hoop.backboardTop + 20 &&
      y <= hoop.rimY - 10 &&
      Math.abs(x - hoop.rimCenterX) >= 8 &&
      Math.abs(x - hoop.rimCenterX) <= 44 &&
      Math.abs(vx) > 1.2
    ) {
      const distToCenter = hoop.rimCenterX - x;
      if (Math.sign(vx) !== Math.sign(distToCenter)) {
        vx *= 0.45;
        hitBackboard = true;
      }
    }

    // Rim collision check near rimY
    if (!scored && prevY <= hoop.rimY && y >= hoop.rimY) {
      // Interpolate X at exact rimY plane
      const t = (hoop.rimY - prevY) / Math.max(y - prevY, 0.0001);
      const crossX = prevX + vx * t;

      const distLeft = Math.abs(crossX - leftRimX);
      const distRight = Math.abs(crossX - rightRimX);
      const rimThickness = 11;

      if (crossX > leftRimX + rimThickness && crossX < rightRimX - rimThickness) {
        // Clean pass through the hoop!
        scored = true;
        crossingIndex = i;
        // Funnel smoothly through the net
        vx = (hoop.rimCenterX - crossX) * 0.18;
        vy = Math.max(vy * 0.68, 4.5);
      } else if (distLeft <= rimThickness || distRight <= rimThickness) {
        hitRim = true;
        // Check if it rolls/bounces in (inner edge of rim) vs bounces out
        const insideEdge =
          crossX >= leftRimX - 3 && crossX <= rightRimX + 3;
        if (insideEdge) {
          scored = true;
          crossingIndex = i;
          vx = (hoop.rimCenterX - crossX) * 0.25;
          vy = Math.max(vy * 0.55, 4.0);
        } else {
          // Rim out bounce
          vy = -Math.abs(vy) * 0.48;
          vx = crossX < hoop.rimCenterX ? -Math.abs(vx) * 0.7 - 2 : Math.abs(vx) * 0.7 + 2;
        }
      }
    }

    // While passing through the net right after scoring, dampen horizontal movement
    if (scored && i > crossingIndex && i <= crossingIndex + 12) {
      x += (hoop.rimCenterX - x) * 0.22;
      vy *= 0.92;
      rotation *= 0.85;
    }

    const scale = scored && i > crossingIndex
      ? Math.max(0.72, 1 - (i - crossingIndex) * 0.018)
      : 1;

    points.push({ x, y, vx, vy, rotation, scale });

    // Stop early after the ball falls well below the net after scoring
    if (scored && i > crossingIndex + 16) {
      break;
    }
  }

  let shotLabel: BasketballShotResult['shotLabel'] = '에어볼';
  if (scored) {
    if (hitRim) shotLabel = '림 맞고 골인!';
    else if (hitBackboard) shotLabel = '뱅크슛!';
    else shotLabel = '클린 샷!';
  } else if (hitRim || hitBackboard) {
    shotLabel = '림 튕김!';
  }

  return {
    points,
    scored,
    shotLabel,
    crossingIndex,
    hitRim,
    hitBackboard,
  };
}

/**
 * Simulates a soccer free-kick / penalty shot with curve spin (Magnus effect),
 * depth perspective scaling, goalpost collisions, and goalkeeper save checks.
 */
export function simulateSoccerShot(
  start: Point2D,
  target: Point2D,
  curveSpin: number, // -1.5 (left bend) to +1.5 (right bend)
  goal: SoccerGoalGeometry,
  steps = 38
): SoccerShotResult {
  const points: TrajectoryPoint[] = [];

  const dx = target.x - start.x;
  const dy = target.y - start.y;

  let hitPost = false;
  let savedByKeeper = false;
  let scored = false;

  // Check if target is near the posts or crossbar
  const postMargin = goal.postRadius + 8;
  const inHorizontalMouth =
    target.x >= goal.goalLeft + postMargin && target.x <= goal.goalRight - postMargin;
  const inVerticalMouth =
    target.y >= goal.goalTop + postMargin && target.y <= goal.goalBottom + 6;

  const hitsLeftPost =
    Math.abs(target.x - goal.goalLeft) <= postMargin &&
    target.y >= goal.goalTop - postMargin &&
    target.y <= goal.goalBottom + 6;
  const hitsRightPost =
    Math.abs(target.x - goal.goalRight) <= postMargin &&
    target.y >= goal.goalTop - postMargin &&
    target.y <= goal.goalBottom + 6;
  const hitsCrossbar =
    Math.abs(target.y - goal.goalTop) <= postMargin &&
    target.x >= goal.goalLeft - postMargin &&
    target.x <= goal.goalRight + postMargin;

  // Goalkeeper check if keeper is active
  if (
    goal.keeperX !== undefined &&
    goal.keeperY !== undefined &&
    goal.keeperWidth &&
    goal.keeperHeight
  ) {
    const halfW = goal.keeperWidth / 2;
    const halfH = goal.keeperHeight / 2;
    if (
      Math.abs(target.x - goal.keeperX) <= halfW &&
      Math.abs(target.y - goal.keeperY) <= halfH
    ) {
      savedByKeeper = true;
    }
  }

  if (!savedByKeeper) {
    if (inHorizontalMouth && inVerticalMouth) {
      scored = true;
    } else if (hitsLeftPost || hitsRightPost || hitsCrossbar) {
      hitPost = true;
      // Inner half of post glances into the net!
      const innerPostBounce =
        target.x > goal.goalLeft &&
        target.x < goal.goalRight &&
        target.y > goal.goalTop;
      if (innerPostBounce) {
        scored = true;
      }
    }
  }

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    // Ease out slightly as it approaches the net
    const eased = 1 - Math.pow(1 - progress, 1.35);

    // Parabolic loft + lateral Magnus curve spin that peaks mid-flight
    const loftArc = Math.sin(progress * Math.PI) * 48;
    const curveOffset = Math.sin(progress * Math.PI) * curveSpin * 46;

    const x = start.x + dx * eased + curveOffset;
    const y = start.y + dy * eased - loftArc;
    const scale = 1 - eased * 0.28; // Perspective shrink as it enters goal depth
    const rotation = progress * (360 + curveSpin * 180);

    points.push({
      x,
      y,
      vx: dx / steps,
      vy: dy / steps,
      rotation,
      scale,
    });
  }

  // Add post-impact rebound or net-settle frames
  const last = points[points.length - 1];
  if (savedByKeeper || (hitPost && !scored)) {
    // Rebound outward
    const reboundVx = target.x < (goal.goalLeft + goal.goalRight) / 2 ? -5.5 : 5.5;
    for (let r = 1; r <= 12; r++) {
      points.push({
        x: last.x + reboundVx * r,
        y: last.y + r * 4.5,
        vx: reboundVx,
        vy: 4.5,
        rotation: last.rotation + r * 18,
        scale: last.scale,
      });
    }
  } else if (scored) {
    // Settle down inside the back of the net
    for (let s = 1; s <= 10; s++) {
      points.push({
        x: last.x + (curveSpin * 1.2),
        y: Math.min(goal.goalBottom - 6, last.y + s * 2.2),
        vx: 0,
        vy: 2,
        rotation: last.rotation + s * 4,
        scale: Math.max(0.68, last.scale - s * 0.004),
      });
    }
  }

  let shotLabel: SoccerShotResult['shotLabel'] = '빗나감!';
  if (savedByKeeper) {
    shotLabel = '골키퍼 선방!';
  } else if (scored) {
    const isTopCorner =
      target.y <= goal.goalTop + (goal.goalBottom - goal.goalTop) * 0.38 &&
      (target.x <= goal.goalLeft + 55 || target.x >= goal.goalRight - 55);
    if (hitPost) shotLabel = '골대 맞고 골인!';
    else if (isTopCorner) shotLabel = '상단 구석 골!';
    else shotLabel = '골인!';
  } else if (hitPost) {
    shotLabel = '골대 강타!';
  }

  return {
    points,
    scored,
    shotLabel,
    impactPoint: { x: target.x, y: target.y },
    hitPost,
    savedByKeeper,
  };
}

/**
 * Simulates tossing a crumpled paper ball into a trash can (wastebasket),
 * including optional lateral fan wind acceleration and rim/wall bounces.
 */
export function simulateTrashCanShot(
  start: Point2D,
  initialVelocity: { vx: number; vy: number },
  trashCan: TrashCanGeometry,
  windAccelX = 0, // e.g., -0.04 to +0.04 for desk fan wind
  gravity = 0.55,
  maxSteps = 72
): TrashShotResult {
  const points: TrajectoryPoint[] = [];
  let x = start.x;
  let y = start.y;
  let vx = initialVelocity.vx;
  let vy = initialVelocity.vy;
  let rotation = 0;

  let scored = false;
  let crossingIndex = -1;
  let hitRim = false;
  let hitWall = false;

  const leftLipX = trashCan.rimCenterX - trashCan.rimRadius;
  const rightLipX = trashCan.rimCenterX + trashCan.rimRadius;

  for (let i = 0; i < maxSteps; i++) {
    const prevY = y;
    const prevX = x;

    vx += windAccelX;
    x += vx;
    y += vy;
    vy += gravity;
    rotation += vx * 2.8 + 7.5; // Crumpled paper spins briskly in mid-air

    // Optional wall/backboard bank reflection above the trash can lip
    if (
      !scored &&
      vy > 0 &&
      y >= trashCan.backboardTop + 20 &&
      y <= trashCan.rimY - 8 &&
      Math.abs(x - trashCan.rimCenterX) >= 8 &&
      Math.abs(x - trashCan.rimCenterX) <= 46 &&
      Math.abs(vx) > 1.2
    ) {
      const distToCenter = trashCan.rimCenterX - x;
      if (Math.sign(vx) !== Math.sign(distToCenter)) {
        vx *= 0.45;
        hitWall = true;
      }
    }

    // Check crossing the top opening plane of the trash can (rimY)
    if (!scored && prevY <= trashCan.rimY && y >= trashCan.rimY) {
      const t = (trashCan.rimY - prevY) / Math.max(y - prevY, 0.0001);
      const crossX = prevX + vx * t;

      const distLeft = Math.abs(crossX - leftLipX);
      const distRight = Math.abs(crossX - rightLipX);
      const lipThickness = 11;

      if (crossX > leftLipX + lipThickness && crossX < rightLipX - lipThickness) {
        scored = true;
        crossingIndex = i;
        vx = (trashCan.rimCenterX - crossX) * 0.2;
        vy = Math.max(vy * 0.65, 4.2);
      } else if (distLeft <= lipThickness || distRight <= lipThickness) {
        hitRim = true;
        const insideLip = crossX >= leftLipX - 3 && crossX <= rightLipX + 3;
        if (insideLip) {
          scored = true;
          crossingIndex = i;
          vx = (trashCan.rimCenterX - crossX) * 0.25;
          vy = Math.max(vy * 0.55, 3.8);
        } else {
          // Bounce off the outer rim of the trash can
          vy = -Math.abs(vy) * 0.45;
          vx = crossX < trashCan.rimCenterX ? -Math.abs(vx) * 0.7 - 2.2 : Math.abs(vx) * 0.7 + 2.2;
        }
      }
    }

    // Funnel into the trash basket after scoring
    if (scored && i > crossingIndex) {
      x += (trashCan.rimCenterX - x) * 0.24;
      vy *= 0.88;
      if (y >= trashCan.canBottomY - 16) {
        y = trashCan.canBottomY - 16;
        vy = 0;
        vx = 0;
      }
    }

    const scale =
      scored && i > crossingIndex
        ? Math.max(0.68, 1 - (i - crossingIndex) * 0.025)
        : 1;

    points.push({ x, y, vx, vy, rotation, scale });

    if (scored && i > crossingIndex + 14) {
      break;
    }
  }

  let shotLabel: TrashShotResult['shotLabel'] = '빗나감!';
  if (scored) {
    if (hitRim) shotLabel = '모서리 맞고 골인!';
    else if (hitWall) shotLabel = '벽 맞고 골인!';
    else shotLabel = '클린 골인!';
  } else if (hitRim || hitWall) {
    shotLabel = '통 맞고 튕김!';
  }

  return {
    points,
    scored,
    shotLabel,
    crossingIndex,
    hitRim,
    hitWall,
  };
}

