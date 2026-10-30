/** Four distinct reference-led compositions. Only appearance roles are shared. */
import React from 'react';
import {TimelineContextScene} from './TimelineContextScene';
import {CustomerInspectorScene} from './CustomerInspectorScene';
import {TaskDiscussionScene} from './TaskDiscussionScene';
import {RiskReviewScene} from './RiskReviewScene';
import type {RightPanelMode} from './right-panel-data';
import './right-panel-foundation.css';

interface Props {initialMode?:RightPanelMode;density?:'compact'|'normal'|'relaxed'}
export function RightSidePanelBlock({initialMode='timeline-context',density='normal'}:Props){
 const scene=initialMode==='customer-inspector'?<CustomerInspectorScene density={density}/>:initialMode==='task-discussion'?<TaskDiscussionScene density={density}/>:initialMode==='risk-review'?<RiskReviewScene density={density}/>:<TimelineContextScene density={density}/>;
 return <section className="rp2-root" data-right-panel={initialMode} data-density={density}>{scene}</section>;
}
