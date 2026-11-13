/* Shared timeline compiler. A loop has one duration, including stagger and holds. */
(() => {
  const definitions = window.MOTION_DEMOS || {};
  const contentFields = ["title", "titleEn", "description", "descriptionEn", "focus", "focusEn", "caution", "cautionEn", "tips", "tipsEn", "recipe", "duration", "easing", "tech", "inputs", "inputsEn", "reduced", "reducedEn"];
  const JAPANESE = /[\u3040-\u30ff\u3400-\u9fff]/;
  // Recipes are mostly shared notation; only swap Japanese punctuation for the English UI.
  const englishNotation = text => String(text || "").replace(/\s*·\s*/g, " · ").replace(/〜/g, "–");
  for (const item of window.MOTION_LIBRARY || []) {
    if (!item.recipeEn && item.recipe && !JAPANESE.test(englishNotation(item.recipe))) item.recipeEn = englishNotation(item.recipe);
    item.reduced = "이동·깜빡임·반복을 중지하고 내용을 읽을 수 있는 대표 프레임을 표시합니다.";
    item.reducedEn = "Stop movement, flashing, and repetition; show a readable representative frame.";
    const demo = definitions[item.pattern];
    if (!demo) continue;
    for (const field of contentFields) if (demo[field] !== undefined) item[field] = demo[field];
    item.easing = demo.easing || "linear";
    item.curve = "linear";
    item.recipeEn = demo.recipeEn || (demo.recipe && !JAPANESE.test(englishNotation(demo.recipe)) ? englishNotation(demo.recipe) : `${item.descriptionEn} ${item.focusEn}`);
    item.reduced = "이동·깜빡임·반복을 중지하고 내용을 읽을 수 있는 대표 프레임을 표시합니다.";
    item.reducedEn = "Stop movement, flashing, and repetition; show a readable representative frame.";
    if (item.catalogFamily) {
      item.sourceLabel = item.sourceLabel === "HapticLab 이식" ? "HapticLab 착안·웹 재구성" : "오리지널 웹 데모";
      item.sourceLabelEn = item.sourceLabelEn === "Ported from HapticLab" ? "HapticLab-inspired web study" : "Original web study";
      // A visual study does not generate device haptics.
      delete item.hapticCue;
      delete item.hapticCueEn;
    }
  }

  function offsets(frames) {
    const result = frames.map(frame => ({ ...frame }));
    if (!result.length) return result;
    if (result[0].offset == null) result[0].offset = 0;
    if (result.at(-1).offset == null) result.at(-1).offset = 1;
    let previous = 0;
    for (let index = 1; index < result.length; index++) {
      if (result[index].offset == null) continue;
      const start = result[previous].offset;
      const end = result[index].offset;
      for (let between = previous + 1; between < index; between++) {
        result[between].offset = start + (end - start) * (between - previous) / (index - previous);
      }
      previous = index;
    }
    return result;
  }

  function compile(frames, duration, delay = 0) {
    const resolved = offsets(frames);
    const start = Math.max(0, Math.min(.8, delay / duration));
    const shifted = resolved.map(frame => ({ ...frame, offset: start + frame.offset * (1 - start) }));
    if (start > 0 && shifted.length) shifted.unshift({ ...resolved[0], offset: 0 });
    return shifted;
  }

  // Per-segment easing. Dedicated demos author poses on one linear clock; without
  // shaping, every move between poses runs at constant speed. Each moving segment
  // now starts and ends with the velocity its neighbours imply: zero at a rest or
  // a turning point, carried through where motion continues in the same direction.
  const EASE_IN_OUT = "cubic-bezier(.45,.05,.2,1)";
  const EASE_IN = "cubic-bezier(.42,0,.78,.72)";
  const EASE_OUT = "cubic-bezier(.22,.28,.2,1)";
  const META = new Set(["offset", "easing", "composite", "computedOffset"]);
  const NUMBER = /-?\d*\.?\d+(?:e-?\d+)?/gi;
  const numbers = value => String(value).match(NUMBER)?.map(Number) || [];
  const shared = (a, b) => Object.keys(a).filter(key => !META.has(key) && key in b);

  function segmentInfo(from, to) {
    const keys = shared(from, to);
    if (!keys.length) return { known: false, hold: false, deltas: {} };
    const deltas = {};
    let hold = true;
    for (const key of keys) {
      if (String(from[key]) !== String(to[key])) hold = false;
      const a = numbers(from[key]);
      const b = numbers(to[key]);
      if (a.length && a.length === b.length) deltas[key] = b.map((value, index) => value - a[index]);
    }
    return { known: true, hold, deltas, span: to.offset - from.offset };
  }

  function continues(before, after) {
    for (const key of Object.keys(before.deltas)) {
      const next = after.deltas[key];
      if (!next) continue;
      if (before.deltas[key].some((delta, index) => Math.abs(delta) > 1e-6 && delta * next[index] > 1e-9)) return true;
    }
    // Densely sampled paths whose value syntax changes still pass straight through.
    return before.span < .03 && after.span < .03;
  }

  function sameFrame(a, b) {
    const keys = shared(a, b);
    return keys.length > 0 && keys.every(key => String(a[key]) === String(b[key]));
  }

  // Progress-like tracks stay on the linear clock so a fill, a drawn stroke and a
  // numeric readout that share one timeline stay in lockstep.
  function progressLike(frames) {
    const keys = new Set(frames.flatMap(frame => Object.keys(frame).filter(key => !META.has(key))));
    if (keys.has("strokeDashoffset") || keys.has("strokeDasharray")) return true;
    const moving = [...keys].filter(key => frames.some(frame => key in frame && String(frame[key]) !== String(frames.find(first => key in first)[key])));
    if (moving.length === 1 && moving[0] === "width") return true;
    if (moving.length === 1 && moving[0] === "transform") {
      return frames.every(frame => !frame.transform || /^\s*scale[XY]\([^)]*\)\s*$/.test(frame.transform));
    }
    return false;
  }

  function shapeSegments(frames) {
    if (frames.length < 2 || frames.some(frame => frame.easing && frame.easing !== "linear")) return frames;
    if (progressLike(frames)) return frames;
    const segments = frames.slice(0, -1).map((frame, index) => segmentInfo(frame, frames[index + 1]));
    const last = segments.length - 1;
    const restAt = key => {
      if (key > 0 && key < frames.length - 1) {
        const before = segments[key - 1];
        const after = segments[key];
        return before.hold || after.hold || !continues(before, after);
      }
      // Loop boundary: compare the last segment with the first through the wrap.
      if (segments[last].hold || segments[0].hold) return true;
      if (!sameFrame(frames[0], frames.at(-1))) return false;
      return !continues(segments[last], segments[0]);
    };
    return frames.map((frame, index) => {
      const segment = segments[index];
      if (!segment || !segment.known || segment.hold || segment.span < .012) return frame;
      const startRest = restAt(index);
      const endRest = restAt(index + 1);
      const easing = startRest && endRest ? EASE_IN_OUT : startRest ? EASE_IN : endRest ? EASE_OUT : null;
      return easing ? { ...frame, easing } : frame;
    });
  }

  // The span of a track's movement and whether it is a continuous chain
  // (several moving segments joined by pass-through keys, as in a scrub or path).
  function motionProfile(frames) {
    const segments = frames.slice(0, -1).map((frame, index) => segmentInfo(frame, frames[index + 1]));
    const moving = segments.map((segment, index) => ({ segment, index })).filter(({ segment }) => segment.known && !segment.hold);
    if (!moving.length) return null;
    const start = frames[moving[0].index].offset;
    const end = frames[moving.at(-1).index + 1].offset;
    let chain = false;
    for (let index = 1; index < moving.length; index++) {
      if (moving[index].index === moving[index - 1].index + 1 && continues(moving[index - 1].segment, moving[index].segment)) chain = true;
    }
    return { key: `${start.toFixed(3)}:${end.toFixed(3)}`, chain };
  }

  function records(stage, item, overrides = {}) {
    const demo = definitions[item.pattern];
    if (!demo) return null;
    const duration = overrides.duration || item.duration;
    const scopes = [...stage.querySelectorAll(".semantic-demo")];
    const records = [];
    for (const scope of scopes) {
      const baseline = Boolean(scope.closest(".baseline-pane"));
      const entries = [];
      demo.tracks.forEach(track => {
        const targets = [...scope.querySelectorAll(track.selector)];
        if (scope.matches(track.selector)) targets.unshift(scope);
        targets.forEach((target, index) => {
          const source = typeof track.keyframes === "function" ? track.keyframes(index, targets.length) : track.keyframes;
          const delay = typeof track.delay === "function" ? track.delay(index, targets.length) : (track.delay || 0);
          const compiled = compile(source, duration, delay + index * (overrides.stagger || 0));
          const readout = target.matches?.(".mc-number-strip, .mb-value, .mb-values, [class*='number-strip']");
          const fixed = Boolean(track.easing || demo.segmentEasing === false || compiled.some(frame => frame.easing && frame.easing !== "linear"));
          const linearByNature = readout || progressLike(compiled);
          entries.push({ target, track, compiled, fixed, linearByNature, profile: motionProfile(compiled) });
        });
      });
      // Tracks that move over exactly the same span are usually meant to stay in
      // lockstep (a thumb and its reel, a head and its drawn trail). If any of them
      // is linear by nature or a continuous chain, the whole group stays linear.
      const lockstep = new Set();
      const groups = new Map();
      entries.forEach(entry => { if (entry.profile) (groups.get(entry.profile.key) || groups.set(entry.profile.key, []).get(entry.profile.key)).push(entry); });
      groups.forEach(group => {
        if (group.length > 1 && group.some(entry => entry.linearByNature || entry.profile.chain)) group.forEach(entry => lockstep.add(entry));
      });
      entries.forEach(entry => {
        const keep = entry.fixed || entry.linearByNature || lockstep.has(entry);
        records.push({ target: entry.target, baseline, keyframes: keep ? entry.compiled : shapeSegments(entry.compiled), easing: entry.track.easing || demo.easing || "linear" });
      });
    }
    return records;
  }

  function representative(item) {
    if (definitions[item.pattern]) return definitions[item.pattern].reducedProgress ?? 1;
    if (["trailExit", "collapse", "softShrink", "shrinkFade", "discreteExit"].includes(item.pattern)) return 0;
    if (["accordionOpen", "stickyPin", "pinnedStorySteps", "scrollMarquee"].includes(item.pattern)) return .4;
    return 1;
  }
  window.MotionRuntime = { definitions, compile, records, representative, shapeSegments };
})();
