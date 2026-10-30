import React, { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Activity, ArrowDown, ArrowLeft, ArrowRight, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronRight, CircleAlert, CircleCheck, Clock3, File, FileArchive, FileImage, FileText, Filter, Folder, FolderTree, GitBranch, HardDriveUpload, ListFilter, Pause, Play, Plus, RotateCcw, Search, Server, ShieldAlert, Terminal, Trash2, Upload, Users, X, type LucideIcon } from 'lucide-react';
import { DashboardBadge, DashboardEmpty, DashboardMetric, DashboardNotice, DashboardPanel, DashboardShell } from '../dashboard/DashboardShared';
import type { DriveNode, FlattenedDriveItem } from '../../types';
import { flattenDriveTree, formatBytes, getNodeCheckboxState, toggleCascadeSelection } from '../../utils/driveTree';

type ReferenceMode = 'multi-select' | 'tree-view' | 'file-upload' | 'trace-waterfall' | 'log-stream' | 'deploy-pipeline';
type NavEntry = { id: string; label: string; icon: LucideIcon };
type UploadState = '대기' | '업로드 중' | '완료' | '실패' | '취소됨';
type PipelineStatus = 'success' | 'running' | 'failed' | 'queued';

const config: Record<ReferenceMode, { title: string; description: string; nav: NavEntry[] }> = {
  'multi-select': { title: '그룹형 다중 선택', description: '그룹 검색, 선택 칩, 인원 제한과 새 태그 만들기를 한 입력에서 다룹니다.', nav: [{id:'reviewers',label:'담당자 선택',icon:Users},{id:'tags',label:'태그 만들기',icon:Plus}] },
  'tree-view': { title: '저장소 트리 보기', description: '키보드 탐색, 폴더 확장, 부분 선택과 경로 검색을 지원합니다.', nav: [{id:'files',label:'저장소 파일',icon:FolderTree},{id:'permissions',label:'권한 선택',icon:ShieldAlert}] },
  'file-upload': { title: '파일 업로드 대기열', description: '파일 선택, 형식·크기 안내, 진행률, 취소와 실패 재시도를 보여줍니다.', nav: [{id:'campaign',label:'캠페인 자료',icon:FileImage},{id:'receipts',label:'영수증 첨부',icon:FileText}] },
  'trace-waterfall': { title: '분산 트레이스 워터폴', description: '요청 스팬 계층과 지연 시간축, 오류·임계 경로·상세 정보를 연결합니다.', nav: [{id:'checkout',label:'요청 추적',icon:Activity},{id:'errors',label:'오류 스팬',icon:CircleAlert}] },
  'log-stream': { title: '운영 로그 스트림', description: '수준 필터와 검색을 제공하고, 위로 스크롤하면 자동 따라가기를 멈춥니다.', nav: [{id:'live',label:'실시간 로그',icon:Terminal},{id:'incidents',label:'장애 기록',icon:ListFilter}] },
  'deploy-pipeline': { title: '배포 파이프라인', description: '병렬 작업, 단계 흐름, 실행 시간, 실패 로그와 로컬 재시도를 살펴봅니다.', nav: [{id:'live-run',label:'실시간 실행',icon:GitBranch},{id:'failed-run',label:'실패 기록',icon:CircleAlert}] },
};

type UploadItem = { id:string; name:string; size:number; type:string; progress:number; status:UploadState };
type Span = {id:string;parent:string|null;service:string;operation:string;start:number;duration:number;status:'success'|'warning'|'failed';critical?:boolean;detail:string};
type LogEntry = {id:number;time:string;level:'정보'|'경고'|'오류'|'디버그';service:string;message:string;trace:string};
type Job = {id:string;name:string;status:PipelineStatus;duration:number;detail:string;logs:string[]};

const styles = `
.kri-scope{display:grid;gap:var(--kd-space);min-width:0}.kri-scope .kri-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.kri-scope .kri-search{position:relative;min-width:170px;flex:1}.kri-scope .kri-search svg{position:absolute;left:10px;top:10px;width:15px;height:15px;color:var(--kd-muted)}.kri-scope .kri-search input{width:100%;padding-left:33px}.kri-scope .kri-layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(250px,.9fr);gap:var(--kd-space);align-items:start}.kri-scope .kri-field{display:grid;gap:7px}.kri-scope .kri-field>label,.kri-scope .kri-label{font-size:calc(11px * var(--runtime-text-scale,1));font-weight:600}.kri-scope .kri-hint{font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted);line-height:1.65}.kri-scope .kri-selectbox{position:relative;display:grid;gap:8px;padding:8px;border:1px solid var(--klic-component-block-color-control-border);border-radius:var(--kd-radius);background:var(--kd-panel)}.kri-scope .kri-chips{display:flex;align-items:center;gap:5px;flex-wrap:wrap;min-height:30px}.kri-scope .kri-chips[data-wrap=false]{flex-wrap:nowrap;overflow:hidden}.kri-scope .kri-chip{display:inline-flex;align-items:center;gap:5px;max-width:190px;padding:4px 7px;border:1px solid var(--kd-border);border-radius:7px;background:var(--kd-selected);color:var(--kd-text);font-size:calc(10px * var(--runtime-text-scale,1))}.kri-scope .kri-chip-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kri-scope .kri-chip-remove{display:grid;place-items:center;width:19px;height:19px;border:0;border-radius:5px;background:transparent;color:var(--kd-muted)}.kri-scope .kri-chip-remove:hover{background:var(--kd-panel);color:var(--klic-component-block-color-danger)}.kri-scope .kri-select-input{border:0!important;box-shadow:none!important;min-width:100px;flex:1;padding:5px 7px!important;background:transparent!important}.kri-scope .kri-option-list{max-height:300px;overflow:auto;border:1px solid var(--kd-border);border-radius:var(--kd-radius);background:var(--kd-panel)}.kri-scope .kri-option-group{padding:7px 8px 3px;color:var(--kd-muted);font-size:calc(9px * var(--runtime-text-scale,1));font-weight:650;letter-spacing:.04em}.kri-scope .kri-option{display:grid;width:100%;grid-template-columns:17px 28px minmax(0,1fr) auto;gap:8px;align-items:center;padding:8px 10px;border:0;background:transparent;color:var(--kd-text);text-align:left}.kri-scope .kri-option:hover,.kri-scope .kri-option[aria-selected=true],.kri-scope .kri-option[data-active=true]{background:var(--kd-selected)}.kri-scope .kri-option:disabled{opacity:.52;cursor:not-allowed}.kri-scope .kri-option-check{width:15px;height:15px;display:grid;place-items:center;border:1px solid var(--kd-border);border-radius:4px;color:var(--kd-accent)}.kri-scope .kri-person{width:27px;height:27px;display:grid;place-items:center;border-radius:50%;background:var(--kd-soft);color:var(--kd-accent);font-size:calc(10px * var(--runtime-text-scale,1));font-weight:700}.kri-scope .kri-option-copy{min-width:0}.kri-scope .kri-option-copy strong,.kri-scope .kri-option-copy small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kri-scope .kri-option-copy strong{font-size:calc(10px * var(--runtime-text-scale,1))}.kri-scope .kri-option-copy small{font-size:calc(9px * var(--runtime-text-scale,1));color:var(--kd-muted);margin-top:2px}.kri-scope .kri-group-action{font-size:calc(9px * var(--runtime-text-scale,1));padding:4px 7px;min-height:26px}.kri-scope .kri-tree{display:grid;gap:2px;min-width:0}.kri-scope .kri-tree-row{display:flex;align-items:center;gap:7px;min-height:36px;min-width:0;padding:4px 7px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--kd-text);text-align:left}.kri-scope .kri-tree-row:hover,.kri-scope .kri-tree-row[aria-selected=true]{background:var(--kd-selected);border-color:var(--kd-border)}.kri-scope .kri-tree-toggle,.kri-scope .kri-tree-check{display:grid;place-items:center;flex:none;width:24px;height:24px;border:0;border-radius:5px;background:transparent;color:var(--kd-muted)}.kri-scope .kri-tree-check[aria-checked=true],.kri-scope .kri-tree-check[aria-checked=mixed]{color:var(--kd-accent)}.kri-scope .kri-tree-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:calc(11px * var(--runtime-text-scale,1))}.kri-scope .kri-tree-meta{margin-left:auto;flex:none;font-size:calc(9px * var(--runtime-text-scale,1));color:var(--kd-muted)}.kri-scope .kri-file-icon{color:var(--kd-accent);width:15px;height:15px;flex:none}.kri-scope .kri-dropzone{display:grid;justify-items:center;gap:8px;padding:24px 16px;border:1px dashed var(--kd-border);border-radius:var(--kd-radius);background:var(--kd-soft);text-align:center}.kri-scope .kri-dropzone[data-dragging=true]{border-color:var(--kd-accent);background:var(--kd-selected)}.kri-scope .kri-dropzone svg{color:var(--kd-accent)}.kri-scope .kri-dropzone strong{font-size:calc(12px * var(--runtime-text-scale,1))}.kri-scope .kri-dropzone small{font-size:calc(10px * var(--runtime-text-scale,1));color:var(--kd-muted)}.kri-scope .kri-upload-list{display:grid;gap:8px}.kri-scope .kri-upload-row{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;border:1px solid var(--kd-border);border-radius:var(--kd-radius);background:var(--kd-panel)}.kri-scope .kri-upload-mark{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;background:var(--kd-selected);color:var(--kd-accent)}.kri-scope .kri-upload-name{display:block;min-width:0;overflow-wrap:anywhere;font-size:calc(10px * var(--runtime-text-scale,1));font-weight:600}.kri-scope .kri-upload-progress{height:5px;margin-top:6px;background:var(--kd-soft);border-radius:8px;overflow:hidden}.kri-scope .kri-upload-progress>span{display:block;height:100%;background:var(--kd-accent)}.kri-scope .kri-timeline-axis{display:flex;justify-content:space-between;padding:0 0 6px 180px;color:var(--kd-muted);font-size:calc(9px * var(--runtime-text-scale,1))}.kri-scope .kri-span-list{display:grid;gap:3px;min-width:0}.kri-scope .kri-span{display:grid;grid-template-columns:minmax(150px,190px) minmax(180px,1fr) 58px;gap:10px;align-items:center;min-height:34px;padding:4px 7px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--kd-text);text-align:left}.kri-scope .kri-span:hover,.kri-scope .kri-span[aria-pressed=true]{background:var(--kd-selected);border-color:var(--kd-border)}.kri-scope .kri-span-name{display:flex;align-items:center;gap:3px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:calc(10px * var(--runtime-text-scale,1))}.kri-scope .kri-span-select{display:grid;min-width:0;padding:0;border:0;background:transparent;color:inherit;text-align:left;line-height:1.2}.kri-scope .kri-span-select:hover{color:var(--kd-accent)}.kri-scope .kri-span-select small{display:block;color:var(--kd-muted);font-size:calc(9px * var(--runtime-text-scale,1))}.kri-scope .kri-track{height:18px;position:relative;border-left:1px solid var(--kd-border);background:repeating-linear-gradient(90deg,transparent 0 19.8%,var(--kd-border) 20%)}.kri-scope .kri-span-bar{position:absolute;top:3px;height:12px;min-width:3px;border-radius:4px;background:var(--kd-accent);opacity:.82}.kri-scope .kri-span-bar[data-status=warning]{background:var(--klic-component-block-color-warning)}.kri-scope .kri-span-bar[data-status=failed]{background:var(--klic-component-block-color-danger)}.kri-scope .kri-duration{font-size:calc(9px * var(--runtime-text-scale,1));font-variant-numeric:tabular-nums;text-align:right;color:var(--kd-muted)}.kri-scope .kri-critical{box-shadow:inset 2px 0 var(--kd-accent)}.kri-scope .kri-log-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.kri-scope .kri-log-window{max-height:440px;overflow:auto;background:var(--kd-soft);border:1px solid var(--kd-border);border-radius:var(--kd-radius);font-family:var(--klic-ui-mono,monospace);font-size:calc(10px * var(--runtime-text-scale,1));scrollbar-width:thin}.kri-scope .kri-log-row{display:grid;grid-template-columns:94px 62px 118px minmax(0,1fr);gap:8px;padding:7px 10px;border-bottom:1px solid var(--kd-border);align-items:start}.kri-scope .kri-log-row:last-child{border-bottom:0}.kri-scope .kri-log-time,.kri-scope .kri-log-service{color:var(--kd-muted);white-space:nowrap}.kri-scope .kri-log-level{font-weight:650}.kri-scope .kri-log-level[data-level=오류]{color:var(--klic-component-block-color-danger)}.kri-scope .kri-log-level[data-level=경고]{color:var(--klic-component-block-color-warning)}.kri-scope .kri-log-message{overflow-wrap:anywhere}.kri-scope .kri-pipeline-scroll{max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain;padding:4px 0 12px;scrollbar-width:thin}.kri-scope .kri-pipeline-flow{position:relative;display:grid;grid-template-columns:repeat(5,17.24137931%);justify-content:space-between;min-width:696px;height:190px;isolation:isolate}.kri-scope .kri-flow-connectors{position:absolute;inset:0;width:100%;height:190px;pointer-events:none;z-index:0}.kri-scope .kri-flow-path{fill:none;stroke:var(--kd-accent);stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-linecap:round}.kri-scope .kri-flow-path[data-status=queued]{stroke:var(--kd-border);stroke-dasharray:3 3}.kri-scope .kri-flow-stage{position:relative;z-index:1;min-width:0}.kri-scope .kri-flow-stage-head{display:flex;align-items:center;justify-content:space-between;height:30px;color:var(--kd-muted);font-size:calc(10px * var(--runtime-text-scale,1));font-weight:500}.kri-scope .kri-flow-stage-head small{font-size:9px;font-variant-numeric:tabular-nums}.kri-scope .kri-flow-nodes{display:grid;gap:10px;padding-top:6px}.kri-scope .kri-job{width:100%;height:44px;display:grid;grid-template-columns:14px minmax(0,1fr);column-gap:7px;align-content:center;padding:6px 9px;border:1px solid var(--kd-border);border-radius:7px;background:var(--kd-panel);color:var(--kd-text);text-align:left}.kri-scope .kri-job:hover{border-color:var(--kd-accent);background:var(--kd-soft)}.kri-scope .kri-job[aria-pressed=true]{border-color:var(--kd-accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--kd-accent) 10%,transparent)}.kri-scope .kri-job[data-status=failed]{border-color:color-mix(in srgb,var(--klic-component-block-color-danger) 55%,var(--kd-border))}.kri-scope .kri-job[data-status=queued]{border-style:dashed;color:var(--kd-muted)}.kri-scope .kri-job-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:calc(10px * var(--runtime-text-scale,1));font-weight:550;line-height:15px}.kri-scope .kri-job-time{grid-column:2;font-size:calc(9px * var(--runtime-text-scale,1));line-height:13px;color:var(--kd-muted);font-variant-numeric:tabular-nums}.kri-scope .kri-job-icon{grid-row:1/3;align-self:center;display:flex;color:var(--kd-muted)}.kri-scope .kri-job-icon[data-status=success],.kri-scope .kri-job-icon[data-status=running]{color:var(--kd-accent)}.kri-scope .kri-job-icon[data-status=running]{animation:kri-spin 1s linear infinite}.kri-scope .kri-job-icon[data-status=failed]{color:var(--klic-component-block-color-danger)}.kri-scope .kri-detail-log{display:grid;gap:6px;padding:12px;border:1px solid var(--kd-border);border-radius:8px;background:var(--kd-soft);font-size:calc(10px * var(--runtime-text-scale,1));line-height:1.6;color:var(--kd-muted)}.kri-scope .kri-run-progress{display:flex;gap:6px;margin:14px 0 20px}.kri-scope .kri-run-progress span{height:4px;flex:1;border-radius:3px;background:var(--kd-soft)}.kri-scope .kri-run-progress span[data-status=success]{background:var(--kd-accent)}.kri-scope .kri-run-progress span[data-status=failed]{background:var(--klic-component-block-color-danger)}.kri-scope .kri-run-progress span[data-status=running]{background:color-mix(in srgb,var(--kd-accent) 50%,var(--kd-panel))}@keyframes kri-spin{to{transform:rotate(360deg)}}.kri-scope .kri-status-grid{display:flex;gap:8px;flex-wrap:wrap}.kri-scope .kri-empty{padding:24px;color:var(--kd-muted);text-align:center}

@container kd-dashboard (max-width:700px){.kri-scope .kri-layout{grid-template-columns:1fr}.kri-scope .kri-span{grid-template-columns:minmax(110px,138px) minmax(90px,1fr) 45px;gap:5px;padding-inline:3px}.kri-scope .kri-timeline-axis{padding-left:130px}.kri-scope .kri-span-name{font-size:calc(9px * var(--runtime-text-scale,1))}.kri-scope .kri-log-row{grid-template-columns:78px 48px minmax(0,1fr);gap:5px}.kri-scope .kri-log-service{display:none}.kri-scope .kri-upload-row{grid-template-columns:30px minmax(0,1fr) auto}}
@container kd-dashboard (max-width:420px){.kri-scope .kri-span{grid-template-columns:1fr 50px}.kri-scope .kri-span-name{grid-column:1/-1}.kri-scope .kri-track{grid-column:1}.kri-scope .kri-timeline-axis{padding-left:3px}}
@media(prefers-reduced-motion:reduce){.kri-scope *{animation:none!important;scroll-behavior:auto!important}}
`;

const treeNodes: DriveNode[] = [
  {id:'workspace',name:'klic-workspace',type:'folder',sizeBytes:0,ownerName:'김민서',ownerAvatar:'김',modifiedDate:'2026-10-29',relativeTime:'오늘',children:[
    {id:'src',name:'src',type:'folder',sizeBytes:0,ownerName:'이서준',ownerAvatar:'이',modifiedDate:'2026-10-29',relativeTime:'오늘',children:[
      {id:'components',name:'components',type:'folder',sizeBytes:0,ownerName:'김민서',ownerAvatar:'김',modifiedDate:'2026-10-28',relativeTime:'어제',children:[
        {id:'button',name:'Button.tsx',type:'doc',sizeBytes:8420,ownerName:'김민서',ownerAvatar:'김',modifiedDate:'2026-10-29',relativeTime:'오늘'},
        {id:'tree',name:'TreeView.tsx',type:'doc',sizeBytes:12960,ownerName:'이서준',ownerAvatar:'이',modifiedDate:'2026-10-28',relativeTime:'어제'},
      ]},
      {id:'utils',name:'utils',type:'folder',sizeBytes:0,ownerName:'박지우',ownerAvatar:'박',modifiedDate:'2026-10-29',relativeTime:'오늘',children:[
        {id:'drive',name:'driveTree.ts',type:'doc',sizeBytes:6310,ownerName:'김민서',ownerAvatar:'김',modifiedDate:'2026-10-29',relativeTime:'오늘'},
        {id:'tokens',name:'tokens.ts',type:'doc',sizeBytes:4270,ownerName:'이서준',ownerAvatar:'이',modifiedDate:'2026-10-27',relativeTime:'2일 전'},
      ]},
    ]},
    {id:'docs',name:'docs',type:'folder',sizeBytes:0,ownerName:'박지우',ownerAvatar:'박',modifiedDate:'2026-10-28',relativeTime:'어제',children:[
      {id:'guide',name:'design-guide.md',type:'doc',sizeBytes:18240,ownerName:'박지우',ownerAvatar:'박',modifiedDate:'2026-10-28',relativeTime:'어제'},
      {id:'api',name:'api-reference.md',type:'doc',sizeBytes:12420,ownerName:'최도윤',ownerAvatar:'최',modifiedDate:'2026-10-27',relativeTime:'2일 전'},
    ]},
    {id:'package',name:'package.json',type:'spreadsheet',sizeBytes:3920,ownerName:'김민서',ownerAvatar:'김',modifiedDate:'2026-10-29',relativeTime:'오늘'},
  ]},
];
const multiOptions=[
  {id:'minseo',name:'김민서',detail:'디자인 시스템 리드',group:'디자인',avatar:'김'},
  {id:'seojun',name:'이서준',detail:'제품 디자이너',group:'디자인',avatar:'이'},
  {id:'haneul',name:'김하늘',detail:'프로덕트 매니저',group:'제품',avatar:'김'},
  {id:'jiwoo',name:'박지우',detail:'보안 담당',group:'플랫폼',avatar:'박'},
  {id:'doyun',name:'최도윤',detail:'결제 API',group:'플랫폼',avatar:'최'},
  {id:'yujin',name:'정유진',detail:'휴가 중',group:'제품',avatar:'정',disabled:true},
];
const seedUploads: UploadItem[]=[
  {id:'file-1',name:'캠페인_메인_이미지.png',size:3_200_000,type:'image/png',progress:100,status:'완료'},
  {id:'file-2',name:'제품_가이드.pdf',size:1_840_000,type:'application/pdf',progress:46,status:'업로드 중'},
  {id:'file-3',name:'배너_시안.jpg',size:2_600_000,type:'image/jpeg',progress:0,status:'대기'},
  {id:'file-4',name:'오래된_자료.csv',size:960_000,type:'text/csv',progress:38,status:'실패'},
];
const traceSpans: Span[]=[
  {id:'root',parent:null,service:'checkout-api',operation:'POST /checkout',start:0,duration:462,status:'success',critical:true,detail:'주문 결제 요청을 받아 하위 서비스 결과를 모읍니다.'},
  {id:'auth',parent:'root',service:'payment-gateway',operation:'authorize',start:12,duration:176,status:'warning',critical:true,detail:'카드 승인 요청이 한 번 시간 초과되어 재시도했습니다.'},
  {id:'token',parent:'auth',service:'token-service',operation:'refresh token',start:24,duration:44,status:'success',detail:'결제 게이트웨이 인증 토큰을 갱신했습니다.'},
  {id:'inventory',parent:'root',service:'inventory-api',operation:'reserve items',start:18,duration:104,status:'success',critical:true,detail:'상품 2개를 재고 예약했습니다.'},
  {id:'catalog',parent:'inventory',service:'catalog-db',operation:'select stock',start:31,duration:42,status:'success',detail:'재고 데이터베이스 조회가 정상 처리됐습니다.'},
  {id:'shipping',parent:'root',service:'shipping-api',operation:'estimate delivery',start:46,duration:72,status:'success',detail:'배송 예정일을 계산했습니다.'},
  {id:'profile',parent:'root',service:'profile-api',operation:'load preferences',start:57,duration:39,status:'failed',detail:'선택 사항인 프로필 조회가 실패했지만 결제 흐름은 계속 진행됐습니다.'},
  {id:'receipt',parent:'root',service:'notification-api',operation:'queue receipt',start:201,duration:68,status:'success',detail:'영수증 안내를 발송 대기열에 넣었습니다.'},
] as const;
const seedLogs: LogEntry[]=[
  {id:1,time:'14:32:08.104',level:'정보',service:'checkout-api',message:'결제 요청 접수 · 주문 #ORD-4821',trace:'tr-9a21'},
  {id:2,time:'14:32:08.119',level:'디버그',service:'auth-middleware',message:'세션 토큰 검증 완료 · 사용자 u-1204',trace:'tr-9a21'},
  {id:3,time:'14:32:08.207',level:'정보',service:'inventory-api',message:'재고 예약 시작 · 상품 2개',trace:'tr-9a21'},
  {id:4,time:'14:32:08.284',level:'경고',service:'payment-gateway',message:'승인 요청 응답 지연 · 420ms',trace:'tr-9a21'},
  {id:5,time:'14:32:08.511',level:'오류',service:'profile-api',message:'선택 항목을 조회하지 못했습니다 · fallback 적용',trace:'tr-9a21'},
  {id:6,time:'14:32:08.626',level:'정보',service:'shipping-api',message:'배송 예상일 계산 완료 · 10월 31일',trace:'tr-9a21'},
  {id:7,time:'14:32:08.752',level:'정보',service:'payment-gateway',message:'승인 재시도 성공 · 승인 코드 A-8031',trace:'tr-9a21'},
  {id:8,time:'14:32:08.811',level:'디버그',service:'receipt-worker',message:'영수증 알림 대기열 등록',trace:'tr-9a21'},
  {id:9,time:'14:32:09.004',level:'정보',service:'checkout-api',message:'요청 완료 · 총 462ms',trace:'tr-9a21'},
];
const seedPipeline: Job[]=[
  {id:'compile',name:'코드 컴파일',status:'success',duration:72,detail:'웹 애플리케이션 빌드 완료',logs:['의존성 설치 완료','TypeScript 검사 통과','번들 생성 완료']},
  {id:'types',name:'정적 검사',status:'success',duration:48,detail:'타입 검사 완료',logs:['241개 모듈 검사','오류 0건']},
  {id:'unit',name:'단위 확인',status:'success',duration:48,detail:'단위 확인 통과',logs:['컴포넌트 확인 132건','통과']},
  {id:'e2e',name:'브라우저 흐름',status:'failed',duration:95,detail:'첫 실행에서 브라우저 확인 하나가 실패했습니다. 예제 재시도는 이 화면 상태만 바꿉니다.',logs:['대시보드 열기 통과','파일 업로드 확인 실패','선택 대상이 나타나지 않음']},
  {id:'security',name:'보안 점검',status:'success',duration:36,detail:'보안 점검 완료',logs:['정적 분석 완료','새 이슈 0건']},
  {id:'preview',name:'미리보기 배포',status:'queued',duration:0,detail:'검증이 완료되면 대기열에서 실행합니다.',logs:['대기 중']},
  {id:'production',name:'프로덕션 배포',status:'queued',duration:0,detail:'미리보기 승인 후 실행합니다.',logs:['대기 중']},
] as const;
const collectTreeIds=(nodes:DriveNode[]):string[]=>nodes.flatMap(node=>[node.id,...(node.children?collectTreeIds(node.children):[])]);

export function InteractionReferenceBlock({ mode, density='normal' }:{mode:ReferenceMode;density?:string}) {
  const uid=useId();
  const [view,setView]=useState(config[mode].nav[0].id);
  const [notice,setNotice]=useState('샘플 화면 · 외부 서비스에 연결되지 않습니다.');
  const [query,setQuery]=useState('');
  const [selectedPeople,setSelectedPeople]=useState<string[]>(['minseo','seojun','jiwoo']);
  const [multiOpen,setMultiOpen]=useState(true);
  const [activeOption,setActiveOption]=useState(0);
  const [wrapChips,setWrapChips]=useState(false);
  const [customTags,setCustomTags]=useState(['결제','긴급 검토']);
  const [treeExpanded,setTreeExpanded]=useState<Set<string>>(()=>new Set(['workspace','src','components','docs']));
  const [treeSelected,setTreeSelected]=useState<Set<string>>(()=>new Set(['button','guide']));
  const [selectedTree,setSelectedTree]=useState('workspace');
  const treeRoot=useRef<HTMLDivElement>(null);
  const [uploads,setUploads]=useState<UploadItem[]>(()=>seedUploads.map(x=>({...x})));
  const [uploadActive,setUploadActive]=useState(true);
  const [dragging,setDragging]=useState(false);
  const fileInput=useRef<HTMLInputElement>(null);
  const uploadInputId=useId();
  const [selectedSpan,setSelectedSpan]=useState('auth');
  const [collapsedSpans,setCollapsedSpans]=useState<Set<string>>(()=>new Set());
  const [criticalOnly,setCriticalOnly]=useState(false);
  const [zoom,setZoom]=useState(1);
  const [logs,setLogs]=useState<LogEntry[]>(()=>seedLogs.map(x=>({...x})));
  const [streaming,setStreaming]=useState(true);
  const [followTail,setFollowTail]=useState(true);
  const [level,setLevel]=useState('all');
  const logWindow=useRef<HTMLDivElement>(null);
  const logSequence=useRef(seedLogs.length+1);
  const [jobs,setJobs]=useState<Job[]>(()=>seedPipeline.map(x=>({...x,logs:[...x.logs]})));
  const [selectedJob,setSelectedJob]=useState('e2e');
  const retryTimers=useRef<number[]>([]);

  const fillUploadSlots=(items:UploadItem[])=>{
    let available=Math.max(0,3-items.filter(file=>file.status==='업로드 중').length);
    return items.map(file=>{
      if(file.status!=='대기'||available===0)return file;
      available-=1;
      return {...file,status:'업로드 중' as UploadState};
    });
  };

  useEffect(()=>{
    if(mode!=='file-upload'||!uploadActive)return;
    const timer=window.setInterval(()=>setUploads(previous=>fillUploadSlots(previous.map(file=>file.status==='업로드 중'?{...file,progress:Math.min(100,file.progress+9),status:file.progress>=91?'완료' as UploadState:'업로드 중' as UploadState}:file))),650);
    return()=>window.clearInterval(timer);
  },[mode,uploadActive]);
  useEffect(()=>{
    if(mode!=='log-stream'||!streaming)return;
    const timer=window.setInterval(()=>setLogs(previous=>{
      const index=logSequence.current++;
      const samples=[
        {level:'정보' as const,service:'checkout-api',message:'대기 중인 주문 처리 완료'},
        {level:'디버그' as const,service:'auth-middleware',message:'세션 상태 확인 완료'},
        {level:'경고' as const,service:'payment-gateway',message:'응답 지연 · 재시도 대기'},
        {level:'정보' as const,service:'inventory-api',message:'재고 예약 상태 갱신'},
      ];
      const sample=samples[index%samples.length];
      const time=new Date().toLocaleTimeString('ko-KR',{hour12:false});
      return [...previous,{id:index,time,level:sample.level,service:sample.service,message:sample.message,trace:`tr-${(0x9a21+index).toString(16)}`}].slice(-120);
    }),3000);
    return()=>window.clearInterval(timer);
  },[mode,streaming]);
  useEffect(()=>{if(mode==='log-stream'&&followTail&&logWindow.current)logWindow.current.scrollTop=logWindow.current.scrollHeight;},[mode,logs.length,followTail]);
  useEffect(()=>()=>retryTimers.current.forEach(timer=>window.clearTimeout(timer)),[]);

  const nav=config[mode].nav;
  const shellToolbar=mode==='tree-view'||mode==='trace-waterfall'?<label className="kri-search"><span className="kd-sr-only">검색</span><Search aria-hidden="true"/><input className="kd-input" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={mode==='tree-view'?'파일 경로 검색':'스팬 검색'} aria-label={mode==='tree-view'?'파일 경로 검색':'스팬 검색'}/></label>:<div className="kri-toolbar"><DashboardBadge tone="neutral">샘플 데이터</DashboardBadge></div>;

  const removePerson=(id:string)=>setSelectedPeople(previous=>previous.filter(value=>value!==id));
  const togglePerson=(id:string)=>{
    const option=multiOptions.find(item=>item.id===id);
    if(!option||option.disabled)return;
    setSelectedPeople(previous=>previous.includes(id)?previous.filter(value=>value!==id):previous.length>=6?previous:[...previous,id]);
  };
  const filteredOptions=multiOptions.filter(option=>`${option.name} ${option.detail} ${option.group}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const activeOptionId=filteredOptions[activeOption]?.id;
  const optionGroups=[...new Set(filteredOptions.map(option=>option.group))];
  const createTag=(raw:string)=>{const tag=raw.trim();if(!tag||customTags.some(existing=>existing.toLocaleLowerCase()===tag.toLocaleLowerCase()))return;setCustomTags(previous=>[...previous,tag]);setNotice('새 태그를 예제에 추가했습니다.');setQuery('');};

  const searchableTree=useMemo(()=>{
    const expanded=query.trim()?new Set(['workspace','src','components','utils','docs']):treeExpanded;
    const paths=new Map<string,string>();
    const collectPaths=(nodes:DriveNode[],parentPath='')=>nodes.forEach(node=>{const path=parentPath?`${parentPath}/${node.name}`:node.name;paths.set(node.id,path);if(node.children)collectPaths(node.children,path);});
    collectPaths(treeNodes);
    return flattenDriveTree(treeNodes,expanded).filter(item=>`${paths.get(item.id)??item.name} ${item.ownerName}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  },[treeExpanded,query]);
  const toggleTreeFolder=(id:string)=>setTreeExpanded(previous=>{const next=new Set(previous);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const handleTreeKeys=(event:KeyboardEvent<HTMLDivElement>,item:FlattenedDriveItem,index:number)=>{
    if(event.key==='ArrowRight'&&item.type==='folder'){
      event.preventDefault();
      if(!treeExpanded.has(item.id))toggleTreeFolder(item.id);
      else if(searchableTree[index+1]?.depth>item.depth)treeRoot.current?.querySelectorAll<HTMLElement>('[role="treeitem"]')[index+1]?.focus();
      return;
    }
    if(event.key==='ArrowLeft'&&item.type==='folder'){
      event.preventDefault();
      if(treeExpanded.has(item.id))toggleTreeFolder(item.id);
      else if(item.parentId){const parentIndex=searchableTree.findIndex(row=>row.id===item.parentId);if(parentIndex>=0)treeRoot.current?.querySelectorAll<HTMLElement>('[role="treeitem"]')[parentIndex]?.focus();}
      return;
    }
    if(event.key==='Enter'){event.preventDefault();setSelectedTree(item.id);return;}
    if(event.key===' '){event.preventDefault();setTreeSelected(previous=>toggleCascadeSelection(treeNodes,previous,item.id));return;}
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();const next=index+(event.key==='ArrowDown'?1:-1);const rows=treeRoot.current?.querySelectorAll<HTMLElement>('[role="treeitem"]');rows?.[Math.max(0,Math.min(next,rows.length-1))]?.focus();
    }
  };
  const treeStatus=(item:DriveNode)=>getNodeCheckboxState(item,treeSelected);

  const addFiles=(list:FileList|null)=>{
    if(!list)return;
    const incoming=Array.from(list);
    const allowed=incoming.filter(file=>file.size<=10*1024*1024&&(/^(image\/(png|jpeg|webp)|application\/pdf|text\/csv)$/.test(file.type)||/\.(png|jpe?g|webp|pdf|csv)$/i.test(file.name)));
    const rejected=incoming.length-allowed.length;
    if(allowed.length)setUploads(previous=>[...previous,...allowed.map(file=>({id:`local-${Date.now()}-${Math.random().toString(16).slice(2)}`,name:file.name,size:file.size,type:file.type||'application/octet-stream',progress:0,status:'대기' as UploadState}))]);
    setNotice(rejected?'지원하지 않는 형식이거나 10MB를 초과한 파일은 제외했습니다.':'파일을 대기열에 추가했습니다. 파일 내용은 전송하지 않습니다.');
  };
  const startUploads=()=>{setUploads(previous=>fillUploadSlots(previous));setUploadActive(true);};
  const retryUpload=(id:string)=>{setUploads(previous=>fillUploadSlots(previous.map(file=>file.id===id?{...file,status:'대기' as UploadState,progress:0}:file)));setUploadActive(true);};

  const visibleSpans=useMemo(()=>{
    const rows:typeof traceSpans[number][]=[];
    const visit=(parent:string|null)=>{for(const span of traceSpans.filter(item=>item.parent===parent)){if((!criticalOnly||span.critical)&&`${span.service} ${span.operation}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))rows.push(span);if(!collapsedSpans.has(span.id))visit(span.id);}};visit(null);return rows;
  },[criticalOnly,query,collapsedSpans]);
  const totalDuration=462;

  const filteredLogs=logs.filter(row=>(level==='all'||row.level===level)&&`${row.service} ${row.message} ${row.trace}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const pipelineStatus=(status:PipelineStatus)=>status==='success'?'성공':status==='running'?'실행 중':status==='failed'?'실패':'대기';
  const retryJob=(jobId:string)=>{
    setJobs(previous=>previous.map(job=>job.id===jobId?{...job,status:'running' as PipelineStatus,detail:'로컬 재시도 진행 중입니다.',logs:[...job.logs,'예제 재시도 시작']}:job));
    const timer=window.setTimeout(()=>setJobs(previous=>previous.map(job=>job.id===jobId?{...job,status:'success' as PipelineStatus,duration:42,detail:'로컬 예제 재시도 완료',logs:[...job.logs,'예제 재시도 통과']}:job)),900);
    retryTimers.current.push(timer);
    setNotice('배포를 실행하지 않고 파이프라인 예제 상태만 변경했습니다.');
  };

  let content:React.ReactNode;
  if(mode==='multi-select'){
    content=<>
      <div className="kd-metrics"><DashboardMetric label="선택한 담당자" value={`${selectedPeople.length}명`} note="최대 6명" icon={Users}/><DashboardMetric label="팀 그룹" value="3개" note="그룹별 전체 선택" icon={CheckCheck}/><DashboardMetric label="선택 제한" value={selectedPeople.length>=6?'도달':'사용 가능'} note="제한 이후 옵션 비활성" icon={ListFilter}/></div>
      {view==='reviewers'?<div className="kri-layout"><DashboardPanel title="리뷰 담당자" caption="그룹별로 찾고 선택하세요. 한 명은 휴가 중이라 선택할 수 없습니다." action={<button type="button" className="kd-button" onClick={()=>setWrapChips(value=>!value)}>{wrapChips?'한 줄로 접기':'칩 모두 보기'}</button>}>
        <div className="kri-selectbox"><div className="kri-chips" data-wrap={String(wrapChips)}>{selectedPeople.length?selectedPeople.map(id=>{const person=multiOptions.find(item=>item.id===id);return person?<span className="kri-chip" key={id}><span className="kri-person" aria-hidden="true">{person.avatar}</span><span className="kri-chip-name">{person.name}</span><button type="button" className="kri-chip-remove" aria-label={`${person.name} 선택 해제`} onClick={()=>removePerson(id)}><X size={12}/></button></span>:null;}):<span className="kri-hint">담당자를 선택하세요.</span>}{selectedPeople.length>3&&!wrapChips&&<span className="kri-chip">+{selectedPeople.length-3}</span>}
          </div><input className="kri-select-input" role="combobox" aria-label="담당자 검색" aria-expanded={multiOpen} aria-controls={`${uid}-options`} aria-activedescendant={multiOpen&&activeOptionId?`${uid}-option-${activeOptionId}`:undefined} aria-autocomplete="list" value={query} onFocus={()=>setMultiOpen(true)} onChange={event=>{setQuery(event.target.value);setMultiOpen(true);setActiveOption(0);}} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setMultiOpen(true);setActiveOption(index=>Math.min(index+1,Math.max(filteredOptions.length-1,0)));}else if(event.key==='ArrowUp'){event.preventDefault();setActiveOption(index=>Math.max(index-1,0));}else if(event.key==='Enter'){event.preventDefault();if(filteredOptions[activeOption])togglePerson(filteredOptions[activeOption].id);else createTag(query);}else if(event.key==='Escape'){if(multiOpen){setMultiOpen(false);setQuery('');}}else if(event.key==='Backspace'&&!query&&selectedPeople.length)removePerson(selectedPeople.at(-1)!);}} placeholder="이름·팀으로 검색"/>
        </div>
        {multiOpen&&<div id={`${uid}-options`} className="kri-option-list" role="listbox" aria-label="담당자 옵션" aria-multiselectable="true">{optionGroups.length?optionGroups.map(group=>{const options=filteredOptions.filter(item=>item.group===group);const selectedGroup=options.filter(item=>selectedPeople.includes(item.id)).length;return <div role="group" aria-label={group} key={group}><div className="kri-option-group"><span>{group}</span><button type="button" className="kd-button kri-group-action" onClick={()=>setSelectedPeople(previous=>{const enabled=options.filter(item=>!item.disabled).map(item=>item.id);const all=enabled.every(id=>previous.includes(id));return all?previous.filter(id=>!enabled.includes(id)):[...new Set([...previous,...enabled])].slice(0,6);})}>{selectedGroup===options.filter(item=>!item.disabled).length?'그룹 해제':'그룹 전체 선택'}</button></div>{options.map(option=><button type="button" role="option" id={`${uid}-option-${option.id}`} data-active={activeOptionId===option.id} aria-selected={selectedPeople.includes(option.id)} aria-disabled={option.disabled||selectedPeople.length>=6&&!selectedPeople.includes(option.id)||undefined} disabled={option.disabled||selectedPeople.length>=6&&!selectedPeople.includes(option.id)} key={option.id} className="kri-option" onMouseEnter={()=>setActiveOption(filteredOptions.findIndex(item=>item.id===option.id))} onClick={()=>togglePerson(option.id)}><span className="kri-option-check">{selectedPeople.includes(option.id)&&<Check size={12}/>}</span><span className="kri-person" aria-hidden="true">{option.avatar}</span><span className="kri-option-copy"><strong>{option.name}</strong><small>{option.detail}</small></span>{option.disabled&&<DashboardBadge tone="warning">선택 불가</DashboardBadge>}</button>)}</div>;}):<DashboardEmpty title="검색 결과가 없습니다" description="새 태그로 추가하려면 Enter를 누르세요."/>}</div>}
        <p className="kri-hint">아래 방향키로 이동하고 Enter로 선택합니다. Backspace는 마지막 칩을 지웁니다.</p>
      </DashboardPanel><DashboardPanel title="선택 요약" caption="현재 선택은 이 블록 예제에서만 유지됩니다."><div className="kri-tree">{selectedPeople.map(id=>multiOptions.find(person=>person.id===id)).filter(Boolean).map(person=><div key={person!.id} className="kri-upload-row"><span className="kri-person" aria-hidden="true">{person!.avatar}</span><span><strong className="kri-upload-name">{person!.name}</strong><small className="kri-hint">{person!.group} · {person!.detail}</small></span><DashboardBadge tone="accent">선택됨</DashboardBadge></div>)}</div><DashboardNotice>{notice}</DashboardNotice></DashboardPanel></div>:<div className="kri-layout"><DashboardPanel title="태그 만들기" caption="기존 태그를 고르거나 새 이름을 입력해 추가합니다."><form onSubmit={event=>{event.preventDefault();createTag(query);}} className="kri-toolbar"><label className="kri-search"><span className="kd-sr-only">태그 이름</span><Search aria-hidden="true"/><input className="kd-input" value={query} onChange={event=>setQuery(event.target.value)} placeholder="태그 이름 입력" aria-label="태그 이름 입력"/></label><button type="submit" className="kd-button kd-primary" disabled={!query.trim()}><Plus size={14}/>추가</button></form><div className="kri-chips" style={{marginTop:14}}>{customTags.map(tag=><span className="kri-chip" key={tag}>{tag}<button className="kri-chip-remove" type="button" aria-label={`${tag} 제거`} onClick={()=>setCustomTags(previous=>previous.filter(value=>value!==tag))}><X size={12}/></button></span>)}</div></DashboardPanel><DashboardPanel title="새 태그 안내" caption="태그는 상태 색에 의존하지 않는 텍스트 분류입니다."><p className="kri-hint">Enter 또는 추가 버튼을 눌러 현재 검색어를 로컬 목록에 넣습니다. 같은 이름은 중복으로 만들지 않습니다.</p><DashboardNotice>{notice}</DashboardNotice></DashboardPanel></div>}
    </>;
  }else if(mode==='tree-view'){
    const rows=searchableTree;
    const selectedNode=rows.find(item=>item.id===selectedTree)??rows[0];
    content=<><div className="kd-metrics"><DashboardMetric label="파일·폴더" value="12개" note="저장소 샘플" icon={Folder}/><DashboardMetric label="선택 항목" value={`${treeSelected.size}개`} note="하위 항목 포함" icon={CheckCheck}/><DashboardMetric label="저장 공간" value="78 KB" note="표시된 트리 기준" icon={Server}/></div><div className="kri-layout"><DashboardPanel title={view==='permissions'?'권한 계층':'저장소 파일'} caption="왼쪽·오른쪽 방향키로 폴더를 열고 닫고, Space로 선택합니다." action={<div className="kri-toolbar"><button className="kd-button" type="button" onClick={()=>setTreeSelected(new Set())}>선택 해제</button><button className="kd-button" type="button" onClick={()=>setTreeSelected(new Set(collectTreeIds(treeNodes)))}>모두 선택</button></div>}><div className="kri-tree" role="tree" aria-label="저장소 파일 트리" ref={treeRoot}>{rows.map((item,index)=>{const folder=item.type==='folder';const state=treeStatus(item);const expanded=treeExpanded.has(item.id);return <div role="treeitem" key={item.id} aria-level={item.depth+1} aria-expanded={folder?expanded:undefined} aria-selected={selectedTree===item.id} aria-checked={state==='indeterminate'?'mixed':state==='checked'} tabIndex={selectedTree===item.id?0:-1} className="kri-tree-row" style={{paddingLeft:8+item.depth*18}} onFocus={()=>setSelectedTree(item.id)} onClick={()=>setSelectedTree(item.id)} onKeyDown={event=>handleTreeKeys(event,item,index)}>
        <button type="button" className="kri-tree-toggle" aria-label={folder?`${expanded?'폴더 접기':'폴더 펼치기'}: ${item.name}`:'파일'} tabIndex={-1} onClick={event=>{event.stopPropagation();if(folder)toggleTreeFolder(item.id);else setSelectedTree(item.id);}}>{folder?(expanded?<ChevronDown size={14}/>:<ChevronRight size={14}/>):<span style={{width:14}}/>}</button>
        <button type="button" role="checkbox" aria-checked={state==='indeterminate'?'mixed':state==='checked'} className="kri-tree-check" aria-label={`${item.name} 선택`} tabIndex={-1} onClick={event=>{event.stopPropagation();setTreeSelected(previous=>toggleCascadeSelection(treeNodes,previous,item.id));}}>{state==='checked'?<Check size={13}/>:state==='indeterminate'?<span aria-hidden="true">−</span>:null}</button>
        {folder?<Folder className="kri-file-icon" aria-hidden="true"/>:<File className="kri-file-icon" aria-hidden="true"/>}<span className="kri-tree-name">{item.name}</span><span className="kri-tree-meta">{folder?`${item.computedItemCount??0}개`:`${formatBytes(item.sizeBytes)} · ${item.relativeTime}`}</span>
      </div>;})}{rows.length===0&&<DashboardEmpty title="경로를 찾을 수 없습니다" description="검색어를 바꿔보세요."/>}</div><DashboardNotice>부분 선택은 혼합 상태로 표시하며, 폴더 선택은 하위 항목에 적용됩니다.</DashboardNotice></DashboardPanel><DashboardPanel title="선택한 항목" caption="소유자와 최근 변경"><div className="kri-tree-detail"><strong>{selectedNode?.name??'항목 없음'}</strong><div className="kri-status-grid"><DashboardBadge tone="accent">{selectedNode?.type==='folder'?'폴더':'파일'}</DashboardBadge><DashboardBadge tone="neutral">{selectedNode?.ownerName??'담당자 없음'}</DashboardBadge></div><p className="kri-hint">마지막 변경 · {selectedNode?.modifiedDate??'—'} · {selectedNode?.relativeTime??'—'}</p><p className="kri-hint">3상태 체크는 부모와 하위 선택을 함께 요약합니다.</p></div></DashboardPanel></div></>;
  }else if(mode==='file-upload'){
    const complete=uploads.filter(file=>file.status==='완료').length;const failed=uploads.filter(file=>file.status==='실패').length;
    const handleDrop=(event:React.DragEvent<HTMLDivElement>)=>{event.preventDefault();setDragging(false);addFiles(event.dataTransfer.files);};
    const iconFor=(file:UploadItem)=>file.type.startsWith('image/')?<FileImage size={17}/>:file.type==='application/pdf'?<FileText size={17}/>:<FileArchive size={17}/>;
    const receipts=view==='receipts';
    content=<><div className="kd-metrics"><DashboardMetric label="대기열 파일" value={`${uploads.length}개`} note="최대 동시 3개" icon={Upload}/><DashboardMetric label="완료" value={`${complete}개`} note="이 예제에서 처리" icon={CircleCheck}/><DashboardMetric label="확인 필요" value={`${failed}개`} note="실패 행에서 재시도" icon={CircleAlert}/></div><div className="kri-layout"><DashboardPanel title={receipts?'영수증 첨부':'캠페인 자료'} caption={receipts?'영수증은 로컬 목록으로만 표시됩니다.':'PNG, JPG, WebP, PDF, CSV · 파일당 10MB 이하'} action={<button className="kd-button kd-primary" type="button" onClick={()=>fileInput.current?.click()}><Plus size={14}/>파일 선택</button>}><input id={uploadInputId} ref={fileInput} type="file" multiple accept="image/png,image/jpeg,image/webp,application/pdf,text/csv,.csv" hidden aria-label="업로드할 파일 선택" onChange={event=>{addFiles(event.currentTarget.files);event.currentTarget.value='';}}/><div className="kri-dropzone" data-dragging={dragging} onDragEnter={event=>{event.preventDefault();setDragging(true);}} onDragOver={event=>event.preventDefault()} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setDragging(false);}} onDrop={handleDrop}><HardDriveUpload size={25} aria-hidden="true"/><strong>파일을 끌어 놓거나 선택하세요</strong><small>10MB 이하 · 실제 업로드 없이 화면 상태만 바뀝니다.</small><button className="kd-button" type="button" onClick={()=>fileInput.current?.click()}>파일 찾아보기</button></div><div className="kri-toolbar" style={{marginTop:14}}><span className="kri-hint">동시 처리 {Math.min(3,uploads.filter(file=>file.status==='업로드 중').length)} / 3</span><button className="kd-button" type="button" onClick={startUploads}><Play size={14}/>대기 파일 시작</button><button className="kd-button" type="button" onClick={()=>setUploadActive(value=>!value)}>{uploadActive?<Pause size={14}/>:<Play size={14}/>}예제 진행 {uploadActive?'멈춤':'재개'}</button></div><div className="kri-upload-list" style={{marginTop:10}}>{(receipts?uploads.slice(0,2):uploads).map(file=><div className="kri-upload-row" key={file.id}><span className="kri-upload-mark">{iconFor(file)}</span><span><strong className="kri-upload-name">{file.name}</strong><small className="kri-hint">{formatBytes(file.size)} · {file.status}</small>{(file.status==='업로드 중'||file.status==='완료')&&<div className="kri-upload-progress" role="progressbar" aria-label={`${file.name} 진행률`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={file.progress}><span style={{width:`${file.progress}%`}}/></div>}</span><span className="kri-toolbar">{file.status==='실패'&&<button className="kd-button" type="button" aria-label={`${file.name} 다시 시도`} onClick={()=>retryUpload(file.id)}><RotateCcw size={14}/></button>}{file.status==='업로드 중'&&<button className="kd-button" type="button" aria-label={`${file.name} 취소`} onClick={()=>setUploads(previous=>previous.map(item=>item.id===file.id?{...item,status:'취소됨'}:item))}><X size={14}/></button>}<button className="kd-button" type="button" aria-label={`${file.name} 제거`} onClick={()=>setUploads(previous=>previous.filter(item=>item.id!==file.id))}><Trash2 size={14}/></button></span></div>)}</div></DashboardPanel><DashboardPanel title={receipts?'경비 신청':'업로드 규칙'} caption={receipts?'파일 두 개까지 첨부할 수 있습니다.':'선택·검토·진행·결과 상태를 구분합니다.'}><div className="kri-status-grid"><DashboardBadge tone="accent"><CheckCircle2 size={12}/>완료 {complete}</DashboardBadge><DashboardBadge tone="warning">대기 {uploads.filter(file=>file.status==='대기').length}</DashboardBadge><DashboardBadge tone="danger">실패 {failed}</DashboardBadge></div><p className="kri-hint" style={{marginTop:12}}>파일명과 크기만 화면 상태로 사용합니다. 파일 내용을 읽거나 외부로 전송하지 않습니다.</p><DashboardNotice>{notice}</DashboardNotice></DashboardPanel></div></>;
  }else if(mode==='trace-waterfall'){
    const spanRows=visibleSpans.filter(span=>view!=='errors'||span.status==='failed');
    const span=traceSpans.find(item=>item.id===selectedSpan);
    content=<><div className="kd-metrics"><DashboardMetric label="요청 전체 시간" value="462ms" note="8개 서비스 스팬" icon={Clock3}/><DashboardMetric label="임계 경로" value="176ms" note="결제 승인 대기" icon={Activity}/><DashboardMetric label="오류 스팬" value="1건" note="선택 사항 프로필 조회" icon={CircleAlert}/></div><DashboardPanel title="결제 요청 · tr-9a21" caption="기간 막대는 각 스팬의 시작 시각과 소요 시간을 나타냅니다." action={<div className="kri-toolbar"><button className="kd-button" type="button" aria-pressed={criticalOnly} onClick={()=>setCriticalOnly(value=>!value)}><Filter size={14}/>{criticalOnly?'임계 경로 보기 중':'임계 경로만'}</button><button className="kd-button" type="button" aria-label="시간축 축소" onClick={()=>setZoom(value=>Math.max(.7,value-.15))}><ArrowLeft size={14}/></button><button className="kd-button" type="button" aria-label="시간축 확대" onClick={()=>setZoom(value=>Math.min(1.45,value+.15))}><ArrowRight size={14}/></button><button className="kd-button" type="button" onClick={()=>{setZoom(1);setCriticalOnly(false);setCollapsedSpans(new Set());}}>초기화</button></div>}><div className="kri-timeline-axis"><span>0ms</span><span>{Math.round(totalDuration/2)}ms</span><span>{totalDuration}ms</span></div><div className="kri-span-list" style={{'--trace-zoom':zoom} as React.CSSProperties}>{spanRows.map(item=>{
      const hasChildren=traceSpans.some(child=>child.parent===item.id);
      const expanded=!collapsedSpans.has(item.id);
      return <div key={item.id} className={`kri-span ${item.critical?'kri-critical':''}`} style={{paddingLeft:7+(item.parent?22:0)}}>
        <span className="kri-span-name">{hasChildren&&<button type="button" className="kri-tree-toggle" aria-label={`${expanded?'접기':'펼치기'}: ${item.service}`} aria-expanded={expanded} onClick={()=>setCollapsedSpans(previous=>{const next=new Set(previous);if(next.has(item.id))next.delete(item.id);else next.add(item.id);return next;})}>{expanded?<ChevronDown size={12}/>:<ChevronRight size={12}/>}</button>}<button type="button" className="kri-span-select" aria-label={`${item.service} ${item.operation}, ${item.duration}ms`} aria-pressed={selectedSpan===item.id} onClick={()=>setSelectedSpan(item.id)}><span>{item.service}</span><small>{item.operation}{item.status==='failed'?' · 오류':item.status==='warning'?' · 재시도':''}</small></button></span>
        <span className="kri-track" aria-hidden="true"><span className="kri-span-bar" data-status={item.status} style={{left:`${item.start/totalDuration*100}%`,width:`${Math.max(item.duration/totalDuration*100*zoom,1)}%`}}/></span><span className="kri-duration">{item.duration}ms</span>
      </div>;
    })}</div></DashboardPanel><div className="kri-layout"><DashboardPanel title="스팬 상세" caption={span?`${span.service} · ${span.operation}`:'스팬을 선택하세요.'}>{span?<><div className="kri-status-grid"><DashboardBadge tone={span.status==='failed'?'danger':span.status==='warning'?'warning':'accent'}>{span.status==='success'&&<CheckCircle2 size={12}/>}{span.status==='failed'?'오류':span.status==='warning'?'재시도':'정상'}</DashboardBadge><DashboardBadge tone="neutral">시작 {span.start}ms</DashboardBadge><DashboardBadge tone="neutral">지속 {span.duration}ms</DashboardBadge></div><p className="kri-hint" style={{marginTop:10}}>{span.detail}</p></>:<DashboardEmpty title="스팬 선택"/>}</DashboardPanel><DashboardPanel title="경로 요약" caption="요청 지연에 영향을 준 구간"><div className="kri-status-grid"><DashboardBadge tone="accent">재고 예약 104ms</DashboardBadge><DashboardBadge tone="warning">결제 승인 176ms</DashboardBadge><DashboardBadge tone="danger">프로필 조회 실패 · 비차단</DashboardBadge></div></DashboardPanel></div></>;
  }else if(mode==='log-stream'){
    const filtered=filteredLogs.filter(row=>view!=='incidents'||row.level==='오류'||row.level==='경고');
    const addDemo=()=>{const id=logSequence.current++;const sample={id,time:new Date().toLocaleTimeString('ko-KR',{hour12:false}),level:'정보' as const,service:'klic-preview',message:'새 샘플 로그 이벤트',trace:`tr-${id.toString(16)}`};setLogs(previous=>[...previous,sample].slice(-120));};
    content=<><div className="kd-metrics"><DashboardMetric label="표시 이벤트" value={`${filtered.length}건`} note="최대 120개 보관" icon={Terminal}/><DashboardMetric label="경고·오류" value={`${logs.filter(row=>row.level==='오류'||row.level==='경고').length}건`} note="합성 로그" icon={CircleAlert}/><DashboardMetric label="흐름 상태" value={streaming?'수신 중':'일시 정지'} note={followTail?'아래쪽 자동 따라가기':'읽기 위치 유지'} icon={Activity}/></div><DashboardPanel title={view==='incidents'?'장애 기록':'서비스 로그'} caption="실시간 로그는 예제 안에서만 생성되며 실제 서버에 연결되지 않습니다." action={<div className="kri-toolbar"><button className="kd-button" type="button" aria-pressed={streaming} onClick={()=>setStreaming(value=>!value)}>{streaming?<Pause size={14}/>:<Play size={14}/>} {streaming?'흐름 멈춤':'흐름 재개'}</button><button className="kd-button" type="button" onClick={addDemo}><Plus size={14}/>샘플 로그 추가</button></div>}><div className="kri-log-controls"><label className="kri-search"><span className="kd-sr-only">로그 검색</span><Search aria-hidden="true"/><input className="kd-input" value={query} onChange={event=>setQuery(event.target.value)} placeholder="서비스·메시지·트레이스 검색" aria-label="로그 검색"/></label><label className="kri-label">수준 <select className="kd-select" value={level} onChange={event=>setLevel(event.target.value)}><option value="all">모든 수준</option><option>오류</option><option>경고</option><option>정보</option><option>디버그</option></select></label><button className="kd-button" type="button" aria-pressed={followTail} onClick={()=>{setFollowTail(true);if(logWindow.current)logWindow.current.scrollTop=logWindow.current.scrollHeight;}}><ArrowDown size={14}/>{followTail?'최신 로그 따라가기':'최신 위치로 이동'}</button></div><div className="kri-log-window" ref={logWindow} role="log" aria-label="샘플 운영 로그" aria-live="off" onScroll={event=>{const node=event.currentTarget;const atBottom=node.scrollHeight-node.scrollTop-node.clientHeight<32;if(!atBottom)setFollowTail(false);}}><div className="kri-log-row" aria-hidden="true"><span>시각</span><span>수준</span><span>서비스</span><span>내용</span></div>{filtered.map(row=><div className="kri-log-row" key={row.id}><span className="kri-log-time">{row.time}</span><span className="kri-log-level" data-level={row.level}>{row.level}</span><span className="kri-log-service">{row.service}</span><span className="kri-log-message">{row.message}<small className="kri-hint"> · {row.trace}</small></span></div>)}{filtered.length===0&&<div className="kri-empty">조건에 맞는 로그가 없습니다.</div>}</div><DashboardNotice>{streaming?'합성 로그 스트림을 재생하고 있습니다.':'로그 생성이 일시 정지됐습니다.'} 위쪽으로 이동하면 자동 따라가기가 멈춥니다.</DashboardNotice></DashboardPanel></>;
  }else{
    const stages=[
      {id:'build',name:'빌드',jobs:jobs.filter(job=>job.id==='compile')},
      {id:'test',name:'테스트',jobs:['unit','e2e','types'].map(id=>jobs.find(job=>job.id===id)!)},
      {id:'security',name:'보안 검사',jobs:jobs.filter(job=>job.id==='security')},
      {id:'preview',name:'미리보기 배포',jobs:jobs.filter(job=>job.id==='preview')},
      {id:'production',name:'프로덕션 배포',jobs:jobs.filter(job=>job.id==='production')},
    ];
    const job=jobs.find(item=>item.id===selectedJob);
    const finished=jobs.filter(item=>item.status==='success').length;
    const failed=jobs.some(item=>item.status==='failed');
    content=<><DashboardPanel title={view==='failed-run'?'실패한 실행 기록':'웹 · main 배포 실행'} caption={view==='failed-run'?'완료된 실행에서 실패 로그를 확인합니다.':'실행 중인 파이프라인 예시 · 실제 CI는 실행되지 않습니다.'} action={<div className="kri-toolbar"><button className="kd-button" type="button" aria-pressed={view==='live-run'} onClick={()=>setView('live-run')}>실시간 실행</button><button className="kd-button" type="button" aria-pressed={view==='failed-run'} onClick={()=>setView('failed-run')}>실패 기록</button></div>}><div className="kri-status-grid" style={{marginBottom:12}}><DashboardBadge tone="accent">브랜치 main</DashboardBadge><DashboardBadge tone="neutral">커밋 7fd21a8</DashboardBadge><DashboardBadge tone={failed?'danger':'accent'}>{!failed&&<CheckCircle2 size={12}/>}{failed?'확인 필요':'상태 정상'}</DashboardBadge></div><div className="kri-run-progress" aria-label={`${jobs.length}개 작업 중 ${finished}개 완료`}>{jobs.map(item=><span key={item.id} data-status={item.status}/>)}</div><div className="kri-pipeline-scroll" role="region" aria-label="빌드부터 배포까지 파이프라인 흐름" tabIndex={0}><div className="kri-pipeline-flow"><svg className="kri-flow-connectors" viewBox="0 0 696 190" preserveAspectRatio="none" aria-hidden="true"><path className="kri-flow-path" d="M120 58H144 M120 58C133 58 131 112 144 112 M120 58C133 58 131 166 144 166"/><path className="kri-flow-path" data-status={failed?'queued':'success'} d="M264 58H288 M264 112C277 112 275 58 288 58 M264 166C277 166 275 58 288 58"/><path className="kri-flow-path" data-status="queued" d="M408 58H432 M552 58H576"/>{[120,264,408,552].map(x=><circle key={x} cx={x} cy="58" r="2" fill="var(--kd-accent)"/>)}</svg>{stages.map(stage=><section className="kri-flow-stage" key={stage.id} role="group" aria-label={`${stage.name} 단계`}><div className="kri-flow-stage-head"><span>{stage.name}</span></div><div className="kri-flow-nodes">{stage.jobs.map(item=><button type="button" key={item.id} className="kri-job" data-status={item.status} aria-pressed={selectedJob===item.id} aria-label={`${item.name}, ${pipelineStatus(item.status)}${item.duration?`, ${Math.floor(item.duration/60)}분 ${item.duration%60}초`:''}`} onClick={()=>setSelectedJob(item.id)}><span className="kri-job-icon" data-status={item.status}>{item.status==='success'?<CheckCircle2 size={15}/>:item.status==='failed'?<CircleAlert size={15}/>:item.status==='running'?<Activity size={15}/>:<Clock3 size={15}/>}</span><span className="kri-job-name">{item.name}</span><span className="kri-job-time">{item.duration?`${Math.floor(item.duration/60)}분 ${item.duration%60}초`:pipelineStatus(item.status)}</span></button>)}</div></section>)}</div></div><div className="kri-layout" style={{marginTop:14}}><div><h3 className="kri-label">{job?.name??'작업 상세'}</h3><p className="kri-hint">{job?.detail??'작업을 선택하세요.'}</p>{job?.status==='failed'&&<button className="kd-button kd-primary" type="button" onClick={()=>retryJob(job.id)}><RotateCcw size={14}/>실패 작업 재시도</button>}</div><div className="kri-detail-log" aria-label="작업 로그">{(job?.logs??[]).map((line,index)=><span key={index}>› {line}</span>)}</div></div></DashboardPanel><DashboardNotice>{notice} 재시도는 로컬 샘플 상태만 변경합니다.</DashboardNotice></>;
  }

  return <DashboardShell eyebrow="KLIC · 상호작용 블록" title={config[mode].title} description={config[mode].description} density={density} nav={nav} active={view} onNavigate={next=>{setView(next);setQuery('');}} toolbar={shellToolbar}><div className="kri-scope"><style>{styles}</style>{content}</div></DashboardShell>;
}
