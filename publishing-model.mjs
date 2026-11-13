import {getPublishingTarget} from './publishing-targets.mjs';

function finiteNonNegative(value, name, max) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) {
    throw new TypeError(`${name} must be a finite number from 0 to ${max}`);
  }
  return value;
}

export function normalizePublishingPatch(targetId, patch) {
  const target = getPublishingTarget(targetId);
  if (!target) throw new TypeError(`Unknown publishing target: ${targetId}`);
  if (!patch || typeof patch !== 'object' || Array.isArray(patch) ||
      (Object.getPrototypeOf(patch) !== Object.prototype && Object.getPrototypeOf(patch) !== null)) {
    throw new TypeError('Publishing patch must be a plain object');
  }
  const keys = Object.keys(patch);
  if (!keys.length) throw new TypeError('Publishing patch must include a supported value');
  const normalized = {};
  for (const key of keys) {
    const rule = target.controls[key];
    if (!rule) throw new TypeError(`Unsupported ${key} for publishing target ${targetId}`);
    const value = patch[key];
    if (rule.kind === 'boolean') {
      if (typeof value !== 'boolean') throw new TypeError(`${key} must be a boolean`);
    } else if (rule.kind === 'number') {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < rule.min || value > rule.max ||
          Math.abs((value - rule.min) / rule.step - Math.round((value - rule.min) / rule.step)) > 1e-8) {
        throw new TypeError(`${key} must be a finite ${rule.step}px step from ${rule.min} to ${rule.max}`);
      }
    } else if (rule.kind === 'enum') {
      if (!rule.values.includes(value)) throw new TypeError(`${key} must be a registered value`);
    }
    normalized[key] = value;
  }
  return normalized;
}

/** Geometry for aligned nested corners. Optical floors affect display only. */
export function deriveConcentricRadii(input = {}) {
  const outerRadius = finiteNonNegative(input.outerRadius, 'outerRadius', 48);
  const outerBorderWidth = finiteNonNegative(input.outerBorderWidth ?? 0, 'outerBorderWidth', 10);
  const outerPadding = finiteNonNegative(input.outerPadding ?? 0, 'outerPadding', 48);
  const middleBorderWidth = finiteNonNegative(input.middleBorderWidth ?? 0, 'middleBorderWidth', 10);
  const innerPadding = finiteNonNegative(input.innerPadding ?? 0, 'innerPadding', 48);
  const minFloor = finiteNonNegative(input.minFloor ?? 0, 'minFloor', 12);
  if (typeof (input.useOpticalFloor ?? false) !== 'boolean') {
    throw new TypeError('useOpticalFloor must be a boolean');
  }
  const totalOffsetToMiddle = outerBorderWidth + outerPadding;
  const totalOffsetToInner = totalOffsetToMiddle + middleBorderWidth + innerPadding;
  const middleRadiusRaw = outerRadius - totalOffsetToMiddle;
  const innerRadiusRaw = outerRadius - totalOffsetToInner;
  const middleRadiusGeometry = Math.max(0, middleRadiusRaw);
  const innerRadiusGeometry = Math.max(0, innerRadiusRaw);
  const floor = input.useOpticalFloor && outerRadius > 0 ? minFloor : 0;
  const middleRadius = Math.max(floor, middleRadiusGeometry);
  const innerRadius = Math.max(floor, innerRadiusGeometry);

  return {
    outerRadius,
    outerBorderRadius: Math.max(0, outerRadius - outerBorderWidth),
    totalOffsetToMiddle,
    totalOffsetToInner,
    middleRadiusRaw,
    middleRadiusGeometry,
    middleRadius,
    innerRadiusRaw,
    innerRadiusGeometry,
    innerRadius,
    middleClampedToFloor: middleRadiusGeometry < floor,
    innerClampedToFloor: innerRadiusGeometry < floor,
  };
}

export function resolveUsedCornerRadii(input = {}) {
  const width=finiteNonNegative(input.width,'width',1_000_000);
  const height=finiteNonNegative(input.height,'height',1_000_000);
  const specified={
    topLeft:finiteNonNegative(input.topLeft??0,'topLeft',1_000_000),
    topRight:finiteNonNegative(input.topRight??0,'topRight',1_000_000),
    bottomRight:finiteNonNegative(input.bottomRight??0,'bottomRight',1_000_000),
    bottomLeft:finiteNonNegative(input.bottomLeft??0,'bottomLeft',1_000_000),
  };
  const ratios=[
    specified.topLeft+specified.topRight?width/(specified.topLeft+specified.topRight):1,
    specified.bottomLeft+specified.bottomRight?width/(specified.bottomLeft+specified.bottomRight):1,
    specified.topLeft+specified.bottomLeft?height/(specified.topLeft+specified.bottomLeft):1,
    specified.topRight+specified.bottomRight?height/(specified.topRight+specified.bottomRight):1,
  ];
  const factor=Math.max(0,Math.min(1,...ratios));
  return {factor,specified,used:Object.fromEntries(Object.entries(specified).map(([corner,value])=>[corner,value*factor]))};
}

export function createPublishingSession(scopeKey) {
  const segments = typeof scopeKey === 'string' ? scopeKey.split(':') : [];
  if (segments.length < 3 || segments.length > 4 || !['lab', 'component', 'block'].includes(segments[0]) ||
      segments.slice(1).some(part => !/^[a-z0-9-]+$/.test(part))) {
    throw new TypeError('Publishing session scopeKey is invalid');
  }
  let revision = 0;
  const entries = new Map();
  const targetFor = targetId => {
    const target = getPublishingTarget(targetId);
    if (!target || !scopeKey.startsWith(`${target.scope}:${target.itemId}:`)) {
      throw new TypeError(`Publishing target ${targetId} is outside this session scope`);
    }
    if (!entries.has(targetId)) entries.set(targetId, {values: {}, undo: [], gesture: null});
    return {target, entry: entries.get(targetId)};
  };
  const snapshot = targetId => {
    const {target, entry} = targetFor(targetId);
    return {
      scope: target.scope,
      itemId: target.itemId,
      targetId,
      revision,
      activeControl: null,
      values: {...entry.values},
      canUndo: entry.undo.length > 0,
      measurements: {},
      capabilities: Object.keys(target.controls),
    };
  };
  const currentRevision = expected => {
    if (!Number.isInteger(expected) || expected !== revision) {
      throw new RangeError(`Stale publishing revision: expected ${revision}`);
    }
  };

  return Object.freeze({
    scopeKey,
    snapshot,
    beginGesture(targetId) {
      const {entry} = targetFor(targetId);
      if (entry.gesture) throw new Error(`Publishing gesture already open for ${targetId}`);
      entry.gesture = {...entry.values};
    },
    apply(targetId, patch, expectedRevision) {
      currentRevision(expectedRevision);
      const values = normalizePublishingPatch(targetId, patch);
      const {entry} = targetFor(targetId);
      if (!entry.gesture) entry.undo.push({...entry.values});
      entry.values = {...entry.values, ...values};
      if (entry.undo.length > 20) entry.undo.shift();
      revision += 1;
      return snapshot(targetId);
    },
    finishGesture(targetId) {
      const {entry} = targetFor(targetId);
      if (!entry.gesture) return snapshot(targetId);
      if (JSON.stringify(entry.gesture) !== JSON.stringify(entry.values)) {
        entry.undo.push(entry.gesture);
        if (entry.undo.length > 20) entry.undo.shift();
      }
      entry.gesture = null;
      return snapshot(targetId);
    },
    undo(targetId, expectedRevision) {
      currentRevision(expectedRevision);
      const {entry} = targetFor(targetId);
      if (entry.gesture) throw new Error(`Finish publishing gesture before undoing ${targetId}`);
      if (!entry.undo.length) throw new RangeError(`No publishing edit to undo for ${targetId}`);
      entry.values = entry.undo.pop();
      revision += 1;
      return snapshot(targetId);
    },
    clear(targetId, expectedRevision) {
      currentRevision(expectedRevision);
      const {entry} = targetFor(targetId);
      entry.values = {};
      entry.undo = [];
      entry.gesture = null;
      revision += 1;
      return snapshot(targetId);
    },
    exportCSS(targetId) {
      const {target, entry} = targetFor(targetId);
      const unmapped = Object.keys(entry.values).filter(key => !Object.hasOwn(target.sourceProperties, key));
      if (unmapped.length) throw new TypeError(`No source mapping for ${unmapped.join(', ')} on publishing target ${targetId}`);
      const declarations = Object.entries(target.sourceProperties)
        .filter(([key]) => Object.hasOwn(entry.values, key))
        .map(([key, property]) => `  ${property}: ${entry.values[key]}px;`);
      if (!declarations.length) throw new RangeError(`No source-edit values for ${targetId}`);
      return `${target.selector} {\n${declarations.join('\n')}\n}`;
    },
  });
}

const MEASUREMENT_KEYS = new Set([
  'outerWidth', 'outerHeight', 'contentWidth', 'contentHeight',
  'scrollWidth', 'scrollHeight', 'clientWidth', 'clientHeight',
  'borderRadius', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'hitAreaWidth', 'hitAreaHeight', 'marginTop', 'marginBottom', 'marginGap', 'lineHeightPx', 'pillWidth', 'pillHeight', 'pillRadius',
]);
const CONTROL_LABELS = Object.freeze({
  outerRadius: '외부 반경', radius: '반경', padding: '패딩', innerPadding: '내부 패딩',
  borderWidth: '경계선 두께', minFloor: '최소 반경 보정', useOpticalFloor: '시각 보정',
  cornerTopLeft: '왼쪽 위 반경', cornerTopRight: '오른쪽 위 반경', cornerBottomRight: '오른쪽 아래 반경', cornerBottomLeft: '왼쪽 아래 반경',
  borderStyle: '경계선 종류', showGuides: '치수 가이드', showCenters: '곡률 중심점', textWrap: '한글 줄바꿈', fixture: '화면 fixture', backdropBlur: '유리 배경 흐림', lineHeight: '행간', letterSpacing: '자간', pillHeight: '알약 높이',
  shadowX: '그림자 X 이동', shadowY: '그림자 Y 이동', shadowBlur: '그림자 흐림', shadowSpread: '그림자 확산', shadowInset: '안쪽 그림자', offsetX: '시각적 수평 이동',
  layout: '레이아웃', align: '정렬', rowGap: '행 간격', columnGap: '열 간격', margin: '블록 마진', overflow: '넘침 처리', zIndex: '쌓임 순서', surfaceAlpha: '표면 불투명도',
  rotate: '회전', transformOrigin: '회전 기준점', transitionDuration: '전환 시간', outlineOffset: 'outline offset',
});
const NEXT_STEPS = Object.freeze({
  outerRadius: '외부 반경을 조금 바꾸고 내부 반경이 함께 변하는지 확인하세요.',
  radius: '반경을 조금 바꾸고 content-edge에 남는 곡률을 확인하세요.',
  padding: '패딩을 1px 바꾸고 content-edge 반경이 반대로 움직이는지 확인하세요.',
  innerPadding: '내부 패딩을 1px 바꾸고 안쪽 반경의 변화를 비교하세요.',
  borderWidth: '경계선 두께를 1px 바꾸고 안쪽 border edge를 비교하세요.',
  minFloor: 'floor를 켜고 실제 기하학 값과 화면 보정값을 비교하세요.',
  useOpticalFloor: '보정을 끄고 기하학 계산값으로 돌아가 차이를 확인하세요.',
  cornerTopLeft: '왼쪽 위 모서리만 바꾸고 나머지 세 모서리가 유지되는지 확인하세요.',
  cornerTopRight: '오른쪽 위 모서리만 바꿔 비대칭 곡률을 비교하세요.',
  cornerBottomRight: '오른쪽 아래 모서리만 바꾸고 지정값을 확인하세요.',
  cornerBottomLeft: '왼쪽 아래 모서리만 바꾸고 지정값을 확인하세요.',
  borderStyle: 'solid, dashed, dotted를 바꾸고 border 두께와 독립적으로 반영되는지 확인하세요.',
  showGuides: '치수선은 교육 overlay이며 target의 실제 border나 padding을 바꾸지 않습니다.',
  showCenters: '중심점 표시는 현재 실제 radius와 inset을 바탕으로 한 관찰용 표시입니다.',
  fixture: '카드·히어로·그리드·유리 다이얼로그 fixture를 바꿔도 같은 등록 controls가 실제 target에 적용되는지 비교하세요.',
  backdropBlur: '유리 다이얼로그 모형을 선택하고 배경 흐림만 바꿔 표면 투명도와 비교하세요.',
  textWrap: '긴 한글 문구에서 keep-all과 ellipsis의 실제 줄 수와 잘림을 확인하세요.',
  lineHeight: '행간을 바꾸고 computed line-height와 문장 읽기 높이를 비교하세요.',
  letterSpacing: '자간을 바꾸고 글자 폭과 줄바꿈을 비교하세요.',
  pillHeight: '알약 높이를 바꾼 뒤 DOM의 실제 outer height가 변하는지 확인하세요.',
  shadowX: '그림자를 좌우로 옮기고 layout 공간과 시각적 이동을 구분하세요.',
  shadowY: '그림자를 위아래로 옮기고 흐림·확산 값은 그대로 두세요.',
  shadowBlur: '흐림만 바꿔 그림자 경계가 퍼지는 정도를 비교하세요.',
  shadowSpread: '확산만 바꾸고 음수 확산으로 그림자가 줄어드는지 확인하세요.',
  shadowInset: '같은 그림자 값에서 inset과 outset을 비교하세요.',
  offsetX: 'transform 이동은 원래 layout 공간을 유지하고 화면 위치만 바꿉니다.',
  layout: 'flex 방향과 grid 열 수가 실제 컨테이너에 적용되는지 확인하세요.',
  align: '정렬을 바꾸고 항목의 실제 위치를 비교하세요.',
  rowGap: '행 간격만 바꿔 열 간격이 유지되는지 확인하세요.',
  columnGap: '열 간격만 바꿔 행 간격이 유지되는지 확인하세요.',
  margin: '일반 block 흐름에서 양수 margin 상쇄가 실제로 일어나는지 확인하세요.',
  overflow: '실제 넘치는 콘텐츠에서 hidden과 auto의 차이를 확인하세요.',
  zIndex: '같은 stacking context 안에서 숫자를 바꿔 앞뒤 순서를 확인하세요.',
  surfaceAlpha: '배경 표면의 alpha만 바꾸고 자식 텍스트 불투명도는 유지되는지 확인하세요.',
  rotate: '회전 각도를 바꾸고 layout 영역과 시각적 경계를 구분하세요.',
  transformOrigin: '같은 회전에서 기준점만 바꿔 도는 경로를 비교하세요.',
  transitionDuration: '실제 전환 시간을 바꾸고 reduced-motion 동작과 구분하세요.',
  outlineOffset: 'outline은 layout 공간을 차지하지 않습니다. 키보드 focus 상태에서 offset을 비교하세요.',
});

function assertMeasurements(measurements, name = 'measurements') {
  if (!measurements || typeof measurements !== 'object' || Array.isArray(measurements) ||
      (Object.getPrototypeOf(measurements) !== Object.prototype && Object.getPrototypeOf(measurements) !== null)) {
    throw new TypeError(`${name} must be a plain object`);
  }
  for (const [key, value] of Object.entries(measurements)) {
    if (!MEASUREMENT_KEYS.has(key) || typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new TypeError(`Invalid publishing measurement: ${key}`);
    }
  }
}

function displayPx(value) {
  return `${Number(value.toFixed(2))}px`;
}

export function evaluatePublishingGuidance(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
    throw new TypeError('Guidance snapshot must be an object');
  }
  const target = getPublishingTarget(snapshot.targetId);
  if (!target || snapshot.scope !== target.scope || snapshot.itemId !== target.itemId) {
    throw new TypeError('Guidance snapshot scope and target do not match the registry');
  }
  if (!Number.isInteger(snapshot.revision) || snapshot.revision < 0 ||
      !(snapshot.activeControl === null || (typeof snapshot.activeControl === 'string' && Object.hasOwn(target.controls, snapshot.activeControl)))) {
    throw new TypeError('Guidance snapshot revision or active control is invalid');
  }
  const values = snapshot.values;
  if (!values || typeof values !== 'object' || Array.isArray(values)) throw new TypeError('Guidance values must be an object');
  if (Object.keys(values).length) normalizePublishingPatch(snapshot.targetId, values);
  assertMeasurements(snapshot.measurements);
  if (snapshot.previousValues !== undefined) {
    if (!snapshot.previousValues || typeof snapshot.previousValues !== 'object' || Array.isArray(snapshot.previousValues)) {
      throw new TypeError('previousValues must be an object');
    }
    if (Object.keys(snapshot.previousValues).length) normalizePublishingPatch(snapshot.targetId, snapshot.previousValues);
  }
  const capabilities = snapshot.capabilities;
  if (!Array.isArray(capabilities) || capabilities.some(key => typeof key !== 'string' || !Object.hasOwn(target.controls, key)) ||
      new Set(capabilities).size !== capabilities.length) {
    throw new TypeError('Guidance capabilities must be registered target controls');
  }

  const measured = snapshot.measurements;
  const facts = [];
  const notices = [];
  const addFact = (id, label, value) => facts.push({id, label, value: String(value)});
  if (snapshot.activeControl) {
    addFact('active-control', '바뀐 항목', CONTROL_LABELS[snapshot.activeControl] || snapshot.activeControl);
    if (snapshot.previousValues && Object.hasOwn(values, snapshot.activeControl) &&
        snapshot.previousValues[snapshot.activeControl] !== values[snapshot.activeControl]) {
      const previous = snapshot.previousValues[snapshot.activeControl];
      const current = values[snapshot.activeControl];
      addFact('value-change', '변경 전·후', `${previous} → ${current}${typeof current === 'number' ? 'px' : ''}`);
    }
    if (NEXT_STEPS[snapshot.activeControl]) addFact('next-step', '다음 조작', NEXT_STEPS[snapshot.activeControl]);
  }
  if (measured.outerWidth !== undefined && measured.outerHeight !== undefined) {
    addFact('target-size', '실제 대상 크기', `${displayPx(measured.outerWidth)} × ${displayPx(measured.outerHeight)}`);
  }

  if (target.targetId === 'geometry-card') {
    const geometry = deriveConcentricRadii({
      outerRadius: values.outerRadius ?? 0,
      outerBorderWidth: values.borderWidth ?? 0,
      outerPadding: values.padding ?? 0,
      innerBorderWidth: 0,
      innerPadding: values.innerPadding ?? 0,
      minFloor: values.minFloor ?? 0,
      useOpticalFloor: values.useOpticalFloor ?? false,
    });
    addFact('concentric-radii', '외부 · 중간 · 내부 반경', `${displayPx(geometry.outerRadius)} → ${displayPx(geometry.middleRadius)} → ${displayPx(geometry.innerRadius)}`);
    addFact('middle-radius', '중간 반경', `${displayPx(geometry.middleRadius)} · 기하학 ${displayPx(geometry.middleRadiusGeometry)}`);
    addFact('inner-radius', '내부 반경', `${displayPx(geometry.innerRadius)} · 기하학 ${displayPx(geometry.innerRadiusGeometry)}`);
    addFact('radius-calculation', '현재 계산', `외부 ${displayPx(geometry.outerRadius)} − 바깥 border ${displayPx(values.borderWidth ?? 0)} − padding ${displayPx(values.padding ?? 0)} = 중간 ${displayPx(geometry.middleRadiusRaw)}; 중간 ${displayPx(geometry.middleRadiusRaw)} − 중간 border ${displayPx(0)} − 내부 padding ${displayPx(values.innerPadding ?? 0)} = 내부 ${displayPx(geometry.innerRadiusRaw)}`);
    notices.push({id: 'concentric-inset', kind: 'explanation', title: '안쪽 모서리에서 반경이 줄어드는 이유', reason: '중첩 경계가 같은 중심을 유지한다는 실험 조건에서 border와 padding만큼 안쪽으로 이동할 때마다 사용할 수 있는 반경이 줄어듭니다.', targetIds: [target.targetId]});
    if (geometry.innerClampedToFloor || geometry.middleClampedToFloor) {
      notices.push({id: 'optical-floor', kind: 'advisory', title: '시각 보정이 적용됨', reason: `기하학 결과는 중간 ${displayPx(geometry.middleRadiusGeometry)}, 내부 ${displayPx(geometry.innerRadiusGeometry)}입니다. floor ${displayPx(values.minFloor ?? 0)} 적용으로 실제 곡률과 동심 비율이 달라졌습니다.`, targetIds: [target.targetId], actionId: 'disable-optical-floor'});
    } else if (geometry.middleRadiusRaw < 0 || geometry.innerRadiusRaw < 0) {
      notices.push({id: 'negative-content-edge', kind: 'warning', title: '안쪽 곡률이 0으로 끝남', reason: `계산 결과가 음수라 CSS 곡률은 0px입니다. 외부 반경을 키우거나 패딩·border를 줄여 다시 비교하세요.`, targetIds: [target.targetId]});
    }
  } else if (target.targetId === 'effects-card') {
    addFact('active-fixture','현재 실습 fixture',values.fixture??'card');
    if(values.fixture==='glass-dialog')notices.push({id:'glass-is-simulation',kind:'explanation',title:'유리 다이얼로그는 시각 모형',reason:`이 fixture는 ${values.backdropBlur??12}px backdrop blur를 사용한 유리 표면의 CSS 표현만 비교합니다. 실제 native dialog의 top layer·포커스·Escape 동작은 별도 dialog target에서 확인하세요.`,targetIds:[target.targetId]});
    if(snapshot.activeControl==='backdropBlur')addFact('backdrop-blur','유리 배경 흐림',`${values.backdropBlur??0}px`);
    addFact('specified-corners', '지정 모서리 TL · TR · BR · BL', [values.cornerTopLeft, values.cornerTopRight, values.cornerBottomRight, values.cornerBottomLeft].map(value => displayPx(value ?? 0)).join(' · '));
    if (measured.outerWidth !== undefined && measured.outerHeight !== undefined) {
      const corners=resolveUsedCornerRadii({width:measured.outerWidth,height:measured.outerHeight,topLeft:values.cornerTopLeft,topRight:values.cornerTopRight,bottomRight:values.cornerBottomRight,bottomLeft:values.cornerBottomLeft});
      addFact('used-corners', '겹침 방지 후 사용 반경', [corners.used.topLeft,corners.used.topRight,corners.used.bottomRight,corners.used.bottomLeft].map(displayPx).join(' · '));
      if(corners.factor<1)notices.push({id:'corner-overlap-normalization',kind:'explanation',title:'브라우저가 모서리 반경을 정규화함',reason:`지정 반경 합계가 target 크기보다 커 비율 ${Number(corners.factor.toFixed(3))}로 줄었습니다. CSS는 모서리 곡선이 겹치지 않도록 사용 반경을 조정합니다.`,targetIds:[target.targetId]});
    }
    addFact('layout-state', '실제 레이아웃', `${values.layout ?? 'grid-2'} · ${values.align ?? 'start'} · 행 ${values.rowGap ?? 0}px / 열 ${values.columnGap ?? 0}px`);
    addFact('shadow-state', '현재 그림자', `${values.shadowX ?? 0}px ${values.shadowY ?? 0}px · blur ${values.shadowBlur ?? 0}px · spread ${values.shadowSpread ?? 0}px · ${values.shadowInset ? 'inset' : 'outset'}`);
    if(measured.lineHeightPx!==undefined)addFact('line-height-measurement','실제 행간',displayPx(measured.lineHeightPx));
    if(measured.pillWidth!==undefined&&measured.pillHeight!==undefined){const used=Math.min(measured.pillWidth,measured.pillHeight)/2;addFact('capsule-radius','알약 유효 반경',`min(${displayPx(measured.pillWidth)}, ${displayPx(measured.pillHeight)}) ÷ 2 = ${displayPx(used)}`);}
    if (measured.hitAreaWidth !== undefined && measured.hitAreaHeight !== undefined) {
      addFact('hit-area', '실제 조작 영역', `${displayPx(measured.hitAreaWidth)} × ${displayPx(measured.hitAreaHeight)}`);
    }
    if (measured.marginTop !== undefined && measured.marginBottom !== undefined) {
      addFact('block-margins', '인접 양수 margin', `${displayPx(measured.marginBottom)} / ${displayPx(measured.marginTop)} · 실제 gap ${displayPx(measured.marginGap ?? Math.max(measured.marginTop, measured.marginBottom))}`);
      notices.push({id: 'margin-collapse', kind: 'explanation', title: '일반 block 흐름의 마진 상쇄', reason: '인접한 일반 block의 양수 수직 마진은 더하지 않고 큰 값 하나가 적용될 수 있습니다. Flex/Grid gap은 상쇄되지 않습니다.', targetIds: [target.targetId]});
    }
    if (snapshot.activeControl === 'offsetX') {
      notices.push({id: 'visual-offset', kind: 'explanation', title: 'layout 크기는 그대로', reason: 'translateX는 요소가 차지하는 원래 공간은 유지하고 화면에서 보이는 위치만 이동합니다.', targetIds: [target.targetId]});
    }
    if(snapshot.activeControl==='surfaceAlpha')notices.push({id:'surface-alpha-only',kind:'explanation',title:'표면 배경만 투명해짐',reason:'background-color의 alpha만 바뀝니다. opacity로 요소 전체와 자식 텍스트를 흐리게 만들지 않습니다.',targetIds:[target.targetId]});
    if(snapshot.activeControl==='outlineOffset')notices.push({id:'outline-offset-layout',kind:'explanation',title:'outline은 layout 크기를 바꾸지 않음',reason:'outline은 border 바깥에 그려지며 문서 흐름에서 공간을 차지하지 않습니다. 키보드로 조작 영역을 focus해 실제 표시를 비교하세요.',targetIds:[target.targetId]});
    if (values.textWrap === 'ellipsis') {
      notices.push({id: 'ellipsis-content', kind: 'advisory', title: '한 줄 말줄임 적용', reason: '화면에는 잘린 표시가 보이지만 원본 문구는 DOM에 남아 있습니다. 실제 콘텐츠를 접근할 수 있는지 함께 확인하세요.', targetIds: [target.targetId]});
    }
    if (values.showGuides || values.showCenters) {
      addFact('teaching-overlays', '교육 표시', `${values.showGuides ? '치수 가이드' : ''}${values.showGuides && values.showCenters ? ' · ' : ''}${values.showCenters ? '곡률 중심점' : ''}`);
      notices.push({id: 'overlay-is-observation', kind: 'explanation', title: '관찰용 표시', reason: '치수선과 중심점은 교육 overlay입니다. source CSS나 제품 스타일에 포함되지 않습니다.', targetIds: [target.targetId]});
    }
  } else {
    const radius = values.radius ?? measured.borderRadius ?? 0;
    const border = values.borderWidth ?? measured.borderTopWidth ?? 0;
    const padding = values.padding ?? measured.paddingTop ?? 0;
    const rawContentRadius = radius - border - padding;
    const contentRadius = Math.max(0, rawContentRadius);
    if (measured.paddingTop !== undefined && measured.paddingRight !== undefined &&
        measured.paddingBottom !== undefined && measured.paddingLeft !== undefined &&
        new Set([measured.paddingTop, measured.paddingRight, measured.paddingBottom, measured.paddingLeft]).size > 1) {
      notices.push({id: 'asymmetric-padding', kind: 'explanation', title: '비대칭 inset', reason: '네 방향 패딩이 다릅니다. 한 개의 concentric radius 값으로 네 모서리를 설명하지 않습니다.', targetIds: [target.targetId]});
    } else {
      addFact('content-edge-radius', 'content-edge 반경', `${displayPx(radius)} − ${displayPx(border)} − ${displayPx(padding)} = ${displayPx(contentRadius)}`);
      notices.push({id: 'content-edge', kind: 'explanation', title: '안쪽 경계가 바뀌는 이유', reason: 'border 두께와 패딩만큼 안쪽으로 이동한 content-edge의 곡률입니다. 자식 버튼이나 다른 DOM part에 같은 반경이 적용된다는 뜻은 아닙니다.', targetIds: [target.targetId]});
      if (rawContentRadius < 0) notices.push({id: 'negative-content-edge', kind: 'warning', title: 'content-edge 반경은 0px', reason: `원시 계산은 ${displayPx(rawContentRadius)}라 CSS 안쪽 경계는 0px 직각 모서리로 끝납니다. radius를 키우거나 border·패딩을 줄여 비교하세요.`, targetIds: [target.targetId]});
    }
  }

  if (measured.scrollHeight !== undefined && measured.clientHeight !== undefined && measured.scrollHeight > measured.clientHeight) {
    addFact('vertical-overflow', '실제 넘침', `${displayPx(measured.scrollHeight - measured.clientHeight)} 초과`);
    notices.push({id: 'overflow-observation', kind: 'explanation', title: '콘텐츠가 실제 영역을 넘음', reason: '스크롤 또는 줄바꿈 동작을 확인하세요. 이 측정만으로 접근성 적합 여부를 판정하지 않습니다.', targetIds: [target.targetId]});
  }
  return {facts, notices};
}
