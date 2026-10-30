import {RIGHT_PANEL_EXAMPLES,RIGHT_PANEL_ADOPTION} from '../right-panel-block-catalog.mjs';
const descriptions=[
 'Keep the timeline visible while reviewing properties, comments, attachments and review material in a docked panel.',
 'Explore customer properties, owners and activity in a docked panel linked to selected pipeline cards.',
 'Place owner, date, labels and discussion above a dimmed task board. Provide comments, replies, reactions and a description tab.',
 'Review a risk matrix, mitigation actions, linked resources and review controls in a right panel with a persistent header and footer.',
];
const adoption={
 composition:'Connect the selected record, right-side properties, content, related context and final action through the same record ID.',
 interaction:'Explore the main content with a docked panel; a modal drawer makes the background inert. Provide close, reopen, previous/next, width expansion and per-record local edits.',
 keyboard:'A docked panel does not trap focus. A drawer provides initial focus, Tab/Shift+Tab trapping and Escape dismissal, restoring focus to the selected record after close.',
 responsive:'Use a full-width modal drawer in narrow containers. Preserve text size and provide an internally scrolling body with separate header and footer rows.',
 states:'Distinguish closed, docked, modal and expanded states, selected record, tabs, comments, actions and completion. Preserve per-record edits.',
 limits:'Sample data remains in memory for the current preview. Comments, completion and review are not sent to a server; attachment downloads contain sample text.',
 use:'Use when people need details, discussion and review while retaining the selected context.',
 avoid:'Do not trap focus in a nonmodal docked panel or present a local review as an actual approval.',
};
export const rightPanelNames=Object.fromEntries(RIGHT_PANEL_EXAMPLES.map(e=>[e.id,e.enTitle]));
export const rightPanelMessages={
 '우측 패널·시트':'Right panels & sheets','패널 기본 너비':'Panel default width','패널 확장 너비':'Panel expanded width',
 ...Object.fromEntries(RIGHT_PANEL_EXAMPLES.flatMap((e,i)=>[[e.title,e.enTitle],[e.description,descriptions[i]],[`KLIC 독립 구현 · initialMode=${e.mode} · 로컬 샘플`,`KLIC-owned implementation · initialMode=${e.mode} · Local sample`]])),
 ...Object.fromEntries(Object.entries(RIGHT_PANEL_ADOPTION).flatMap(([key,rows])=>rows.map(row=>[row,adoption[key]]))),
};
