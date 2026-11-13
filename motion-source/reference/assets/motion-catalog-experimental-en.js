/* English copy for the 100 authored experimental motion studies. Load before runtime. */
(() => {
  const groups = {
    'ui-spatial': [
      ['cursor-depth-pull', 'The card tilts toward the viewer as the cursor approaches, then returns to a flat resting state.', 'Rotation and movement along the Z axis respond just after the cursor moves.'],
      ['focus-portal', 'A circular opening expands as a detail surface approaches from behind it.', 'Slightly offset the opening expansion and the approaching content.'],
      ['radial-command-bloom', 'Five commands spread radially from a central button.', 'Keep the menu relationship clear by sending every command from the same origin.'],
      ['spatial-breadcrumb', 'Ancestor levels recede into depth while the current breadcrumb remains in front.', 'Map hierarchy depth to apparent viewing distance.'],
      ['perspective-dock', 'Lift the central dock icon and enlarge neighboring icons according to their distance.', 'Vary magnification smoothly with distance from the selected position.'],
      ['layer-peel', 'Peel the top surface from its left edge to reveal the information beneath.', 'Keep the rotation pivot on the left edge and leave the lower surface still.'],
      ['tooltip-orbit', 'Reposition a tooltip around its target to illustrate placement that avoids screen edges.', 'Move the tooltip around the target without rotating its content.'],
      ['depth-lens', 'Move a magnifying window across a grid, showing a larger grid only inside the window.', 'Use different grid spacing inside and outside the window to communicate magnification.'],
      ['magnetic-constellation', 'Surrounding nodes move toward a central point while retaining their relationships.', 'Make each displacement proportional to the node’s distance from the center.'],
      ['infinite-canvas-jump', 'Pull back from a wide canvas before moving toward the destination card.', 'The intermediate zoom-out reveals the relationship between two distant locations.'],
      ['z-notification', 'A notification approaches from behind the workspace and settles at a fixed depth.', 'Use a small settling motion after approach and leave time to read the message.'],
      ['camera-dolly-ui', 'Move toward two surfaces at different depths, showing stronger perspective enlargement in front.', 'Watch the difference in magnification between foreground and background.'],
      ['volumetric-menu', 'Spread overlapping menu surfaces upward and downward in depth so they read as separate layers.', 'Separate similarly angled surfaces by changing their depth.'],
      ['parallax-inspector', 'Move background, content, and UI sideways by different amounts to expose layer depth.', 'Compare the relative movement, with closer layers moving farther.'],
      ['spatial-search', 'Bring result cards forward in sequence from behind the search field.', 'Use the search field as the origin and reveal results in reading order.'],
      ['orbit-context', 'Contextual commands slide into place along an orbit around their target.', 'Combine orbiting and counter-rotation to keep the icons upright.'],
      ['depth-stack-reorder', 'Move the front card sideways and insert it at the back while advancing the remaining cards.', 'Route the card outside the stack before crossing, then preserve the reordered sequence.'],
      ['calendar-fold', 'Turn the date page around its top edge to reveal the following day.', 'Watch the fixed hinge and the new date revealed beneath the page.'],
      ['cursor-raycast', 'Extend a selection ray from an origin to a target, highlighting the target on arrival.', 'Synchronize the ray’s arrival with the selection highlight.'],
      ['spatial-audio-locator', 'Waves spread from a sound-source position to show their direction toward a central listener.', 'Keep the wave origin anchored to the source.']
    ],
    'ui-material': [
      ['liquid-tab-bridge', 'A thin liquid bridge stretches during a tab change and separates when the selection arrives.', 'Stretch the connection, narrow it, then gather the shape at its destination.'],
      ['gel-button-split', 'Pull a gel shape in opposite directions until its central neck narrows and splits into two.', 'Stretch both sides and their connecting neck together before separation.'],
      ['glass-refraction', 'Move a glass-like window over an enlarged interior grid to show displacement at its boundary.', 'Watch the background grid become discontinuous at the window edge.'],
      ['ink-adhesion', 'A falling ink drop attaches to a surface, spreads sideways, and joins the pool below.', 'The vertically stretched drop squashes horizontally on contact.'],
      ['metallic-foil', 'A narrow highlight sweeps across a foil-like card as it tilts.', 'Synchronize the tilt with the position of the reflected light band.'],
      ['soft-body-toggle', 'A toggle knob compresses on press, stretches during travel, and recovers on arrival.', 'Align deformation with the direction of movement.'],
      ['viscous-progress', 'A rounded liquid front stretches and contracts as it fills a progress bar.', 'Animate the flat trailing region and rounded leading edge separately.'],
      ['chromatic-glass-edge', 'Red and cyan outlines separate at the edges of a transparent surface, then return to alignment.', 'Keep color separation at the outline rather than across the whole surface.'],
      ['paper-fold', 'Keep a central paper crease fixed while folding the right half to the left to reveal the inside.', 'Rotate around the crease and darken the surface according to its angle.'],
      ['cloth-wave', 'Move narrow strips up and down with staggered timing to carry a cloth-like wave sideways.', 'Phase differences between adjacent strips create a wave traveling in one direction.'],
      ['bubble-merge', 'Two bubbles approach and merge into one larger selection surface.', 'Wait for contact before forming the larger surface and showing its combined label.'],
      ['frost-melt', 'A frost-patterned covering shrinks inward to reveal a clear information surface.', 'The shrinking covered area communicates an unlock.'],
      ['membrane-press', 'Press the center of a membrane with fixed ends, then release it into a damped recovery.', 'Keep both ends stationary while bending only the center.'],
      ['sand-dissolve', 'Divide a surface into a grid of small grains and let them crumble downward to reveal the next state.', 'Combine staggered grain starts with downward falling motion.'],
      ['oil-slick', 'Oil-slick color bands flow across a surface while only the selected region slowly changes shape.', 'Move several narrow color bands within the surface.'],
      ['magnetic-fluid', 'Extend spikes toward a magnet to create a ferrofluid-like silhouette.', 'Make spikes closer to the force direction grow longer.'],
      ['glass-crack-recover', 'Cracks spread outward from the center, then retract to restore the surface.', 'Draw outward for damage and inward for repair.'],
      ['neon-tube-draw', 'Light travels along a bent neon-tube path until the lettering is complete.', 'Draw from the path’s start to its end while keeping completed segments illuminated.'],
      ['chrome-ripple', 'Concentric reflections spread from a contact point on a chrome-like surface.', 'Use alternating contour intensity to suggest ripples on a reflective surface.'],
      ['clay-icon-morph', 'A soft rounded shape squashes, rotates, and becomes a sphere-like form.', 'Use compression before and after the shape change to suggest volume.']
    ],
    'kinetic-type': [
      ['glyph-slot-roll', 'Roll letters vertically inside fixed windows, switching to the next word with staggered stops.', 'Keep all letter travel inside the windows and align their final positions.'],
      ['variable-font-pulse', 'Change lettering from light to heavy while adjusting its spacing.', 'Vary stroke weight while limiting abrupt changes in character width.'],
      ['text-path-orbit', 'Place text along a circular path and rotate it through one full orbit.', 'Each character remains oriented to the path tangent.'],
      ['word-gravity', 'Letters fall from above, bounce lightly on a floor, and settle along the baseline.', 'Accelerate the fall and lower each rebound step by step.'],
      ['character-magnetize', 'Scattered, rotated letters snap into a shared baseline and consistent spacing.', 'Fix each destination so the final arrangement reads as a word.'],
      ['line-break-reflow', 'When the container narrows, move the last word to the next line while preserving visual continuity.', 'Interpolate each word’s old and new positions to retain reading order.'],
      ['terminal-decode', 'Noise characters disappear as the correct letters resolve from left to right.', 'Keep resolved letters still while shrinking the unresolved region.'],
      ['counterweight-headline', 'Place two headings on opposite ends of a balance and damp the swing until they settle level.', 'The two sides move in opposite directions around a central pivot.'],
      ['echo-caption', 'Delayed copies follow a caption, leaving only the main text at the end.', 'Fade the echoes at the destination rather than leaving overlapping text.'],
      ['kinetic-kerning', 'Bring widely spaced letters toward the center to form a cohesive word.', 'Keep the middle letter as the anchor and move both sides symmetrically.'],
      ['vertical-type-cascade', 'Reveal vertically set Japanese characters from top to bottom to follow their reading order.', 'Begin the next character after the preceding one starts to settle.'],
      ['baseline-wave', 'Lift letters from below the baseline one at a time to create a traveling reveal wave.', 'Use a fixed mask to align the boundary where letters appear.'],
      ['letter-collision', 'A moving letter collides with its neighbor and pushes that letter away.', 'Keep the receiving letter still before contact, then transfer motion after impact.'],
      ['type-tunnel', 'Enlarge repeated text from back to front to suggest traveling through a tunnel of letters.', 'Keep the copies centered and make the larger foreground copies more transparent.'],
      ['chapter-index-scrub', 'Roll chapter numbers vertically as the scrub position advances.', 'Drive the thumb position and number reel from the same progress.'],
      ['type-hinge', 'Each character swings up around a top-edge hinge, overshoots slightly, and settles facing forward.', 'Use the same top-edge pivot for every letter and stagger them in reading order.'],
      ['focus-word-explosion', 'Enlarge the central focus word while smaller surrounding words scatter outward.', 'Retain the central word and fade the surrounding words away.'],
      ['mono-data-shuffle', 'Roll each digit of a monospaced number independently until it resolves to new data.', 'Fix digit positions so updates do not shift the surrounding layout.'],
      ['stroke-catchup', 'Trace a continuous curve from its starting point to complete a handwritten-style stroke.', 'Progressive path coverage makes the writing direction visible.'],
      ['headline-ribbon', 'Extend a headline ribbon from the center, then unfold the two side returns.', 'Reveal the front text band before opening the folded surfaces behind it.']
    ],
    'game-impact-fx': [
      ['hit-stop', 'Stop both objects at the instant of contact, then push the target away after a brief hold.', 'Look for the interval immediately after impact when positions remain unchanged.'],
      ['shockwave-type', 'Send an outward shockwave from the moment the lettering lands.', 'Expand the waves just after the text reaches its maximum scale.'],
      ['slash-reveal', 'Reveal lettering behind the passing edge of a diagonal slash.', 'Synchronize the slash position with the reveal-mask boundary.'],
      ['freeze-color-drain', 'Freeze a moving composition and drain its color to emphasize the captured moment.', 'Align the stop in movement with the loss of saturation.'],
      ['combo-heat', 'Grow a gauge and shift it from cool to warm colors as the combo count increases.', 'Match the count stages to the displayed heat level.'],
      ['edge-damage', 'Pulse red only around the screen edges to signal damage while leaving the center readable.', 'Let the strongest red edge fade gradually.'],
      ['armor-crack', 'Branching cracks spread rapidly from the armor’s impact point.', 'Connect every crack branch to the same impact origin.'],
      ['critical-compress', 'Compress the composition horizontally, then release it to emphasize a powerful hit.', 'Deform the whole scene through compression, rebound, and recovery in sequence.'],
      ['phase-shatter', 'Break the current phase surface into pieces and scatter them to reveal the next phase name.', 'Let the debris clear before asking the viewer to read the new label.'],
      ['speedline-tunnel', 'Extend lines outward from a vanishing point to suggest fast forward movement.', 'Keep each line’s angle fixed as it moves away from the center.'],
      ['parry-time-slice', 'Hold two crossing blades at contact, leave a spark, then deflect them apart.', 'Separate contact, a brief freeze, and movement in opposing directions.'],
      ['element-burst', 'Radiate alternating particles of two element colors from the same impact point.', 'Share the origin and event timing while using color to distinguish the elements.'],
      ['camera-kick', 'Apply a directional recoil to the background and target while keeping the foreground HUD still.', 'Move only the world view so aiming information remains stable.'],
      ['afterimage-dash', 'Use delayed afterimages to show the path of a rapidly moving subject.', 'Place echoes behind the subject and fade only the echoes after it stops.'],
      ['victory-hold', 'Land a victory title with one strong accent, then hold it still long enough to read.', 'Contrast a brief landing with the long resting state that follows.'],
      ['loot-beam', 'Raise a vertical light beam from loot on the ground to mark its position from a distance.', 'Keep the base of the beam anchored to the item.'],
      ['warning-stripe', 'Bring upper and lower warning bands in from opposite sides to frame a central message.', 'Show the warning text after the bands settle.'],
      ['shield-recharge', 'Activate the central shield after a charging sweep completes a full circle.', 'Connect ring completion and shield illumination to the same completed state.'],
      ['mission-stamp', 'Press a completion stamp onto the mission surface from the foreground and leave the mark visible.', 'Stop the stamp’s scale reduction on contact and retain the result.'],
      ['finisher-cut', 'Bring the top and bottom halves of a finishing title together from opposite directions, then slash along the join.', 'Align both halves of the split title at the same moment.']
    ],
    'data-story': [
      ['sankey-flow', 'Split a total flow of 100 into two destinations with band widths in a 60:40 ratio.', 'Match band width to value and preserve equal incoming and outgoing totals.'],
      ['odometer-cascade', 'Roll a metric’s digits vertically and stop them in sequence at 128K.', 'Keep digit positions fixed and let lower-order digits roll longer.'],
      ['threshold-wave', 'Emit a warning wave from the point where a rising value crosses a threshold.', 'Highlight the crossing location rather than the entire line.'],
      ['confidence-fog', 'Extend a forecast line and an uncertainty band beyond the observed series.', 'Widen uncertainty into the future and distinguish observed solid lines from forecast dashed lines.'],
      ['signal-pulse-map', 'Pulse observation points on a map at different times to show where data arrives.', 'Keep geographic positions fixed and expand waves from each point.'],
      ['delta-split', 'Grow two values from a shared baseline, then display their difference of 24.', 'Preserve the height ratio between 40 and 64 for a truthful comparison.'],
      ['timeline-trail', 'Move a time-position marker along a line chart while retaining the completed trail.', 'Keep the current marker aligned with the end of the revealed path.'],
      ['topology-bloom', 'Extend connections from a central node and reveal the connected nodes at their endpoints.', 'Reveal each node after its connection arrives, guiding attention from relationship to information.'],
      ['milestone-firefly', 'Move a light point along the leading edge of a progress bar and stop at 75%.', 'Keep the moving light aligned with the actual end of the bar.'],
      ['heatmap-ripple', 'Spread a highlight from a focus cell to its neighbors, then return to the original heatmap.', 'Use outlines and size to indicate focus without changing the underlying data colors.'],
      ['stream-breathe', 'Vary the widths of two flowing bands around their shared boundary to show a changing composition.', 'Preserve continuous band shapes rather than turning the display into separate bars.'],
      ['rank-ladder', 'Move item C to first place after its score updates to 90, shifting the former leaders down.', 'Route the overtaking item slightly sideways so viewers can follow the ranking change.'],
      ['cluster-merge', 'Bring two point clusters to the center and merge them while preserving their colors and total count.', 'Keep colors that show both the original membership and the total count after the merge.'],
      ['event-domino', 'Raise processing-event cards from left to right to show a chain of causes and effects.', 'Start each stage after the preceding stage has resolved.'],
      ['kpi-relay', 'Illuminate three metrics from left to right, transferring attention without moving their values.', 'Move the spotlight independently of the metric positions.'],
      ['budget-bloom', 'Divide a budget into arcs of 50, 30, and 20, filling the complete circle in sequence.', 'Use arc length to represent proportion and make the total equal one full revolution.'],
      ['calendar-density', 'Show daily counts through cell intensity and reveal the calendar one week at a time.', 'Reveal complete weeks while preserving the date layout.'],
      ['queue-compress', 'Remove the processed item at the front, then move each remaining queue item forward by one slot.', 'Complete the exit before shifting the neighboring items.'],
      ['sentiment-spectrum', 'Move an indicator along a continuous negative-to-positive scale and settle at +0.6.', 'Represent the value with position and a signed number as well as color.'],
      ['goal-projection', 'Extend a dashed projected trajectory from the observed series toward a fixed goal.', 'Clearly separate observed and projected data while keeping the goal stationary.']
    ]
  };
  const cautions = {
    'ui-spatial-depth-lens': 'This CSS study illustrates a magnifying window. In a real interface, synchronize the magnified rendering with the underlying content.',
    'ui-spatial-cursor-raycast': 'A visual example of a selection ray with a fixed target; it does not perform 3D intersection tests.',
    'ui-spatial-spatial-audio-locator': 'A silent visualization of direction. It does not process spatial audio or calculate distance attenuation.',
    'ui-material-glass-refraction': 'A stylized CSS effect using background magnification, not an optical simulation of refractive index, viewing direction, or thickness.',
    'ui-material-metallic-foil': 'A gradient-based impression of metal foil, not a physically based material with calculated lighting.',
    'ui-material-chromatic-glass-edge': 'A designed CSS color separation at the edges, not a spectral simulation of wavelength-dependent refraction.',
    'ui-material-cloth-wave': 'A strip-based approximation of cloth, not a cloth simulation solving tension or collisions.',
    'ui-material-frost-melt': 'A circular-mask interpretation of melting frost, not a simulation of temperature distribution or physical melting.',
    'ui-material-oil-slick': 'A gradient suggesting oil-film interference colors, not an optical calculation of thin-film interference.',
    'ui-material-magnetic-fluid': 'A stylized ferrofluid silhouette, not a magnetic-field or fluid-dynamics simulation.',
    'ui-material-chrome-ripple': 'A CSS combination of metallic reflection and ripples; environment reflections and physical surface deformation are not calculated.',
    'kinetic-type-variable-font-pulse': 'This study interpolates font-weight. If the available font lacks variable weights, weight changes may occur in discrete steps.',
    'kinetic-type-line-break-reflow': 'This study interpolates a fixed phrase before and after wrapping. In production, measure actual layout positions with FLIP or a similar technique.',
    'kinetic-type-chapter-index-scrub': 'Autoplay simulates scrub progress here. In production, map the input position to progress.',
    'game-impact-fx-hit-stop': 'The hold is extended to make its structure visible. In a game, tune it to a few frames and manage input acceptance separately.',
    'game-impact-fx-critical-compress': 'An impact effect using nonuniform screen scaling, not a simulation of lens behavior.',
    'data-story-stream-breathe': 'Illustrative data explains changing band shapes. In production, recalculate the shared boundary and map stacked areas to actual values.'
  };
  let count = 0;
  for (const [group, entries] of Object.entries(groups)) {
    for (const [key, descriptionEn, focusEn] of entries) {
      const id = `catalog-${group}-${key}`;
      const demo = window.MOTION_DEMOS?.[id];
      if (!demo) throw new Error(`Missing experimental motion for English copy: ${id}`);
      Object.assign(demo, { descriptionEn, focusEn });
      if (!demo.recipeEn && String(demo.recipe || '').startsWith('시작 상태 →')) demo.recipeEn = `Start state → ${focusEn.replace(/\.$/, '')} → Hold the final state`;
      const cautionEn = cautions[`${group}-${key}`];
      if (cautionEn) demo.cautionEn = cautionEn;
      count++;
    }
  }
  if (count !== 100) throw new Error(`Expected 100 experimental translations, found ${count}`);
})();
