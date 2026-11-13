import {MCP_URL,SITE_ORIGIN} from './site-metadata.mjs';
import {NPM_PACKAGE} from './npm-package-data.mjs';
import {normalizeKlicMarkup} from './native-class-contract.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export const MCP_TERMINAL_CLIENT_CONFIG=Object.freeze({
 Codex:`codex mcp add klic --url ${MCP_URL}`,
 Claude:JSON.stringify({mcpServers:{klic:{type:'http',url:MCP_URL}}},null,2),
 Cursor:JSON.stringify({mcpServers:{klic:{url:MCP_URL}}},null,2),
 CLI:`${NPM_PACKAGE.sourceCLICommand} plan block kanban-sprint-board\n${NPM_PACKAGE.sourceCLICommand} add block kanban-sprint-board --out ./my-workspace --dry-run\n${NPM_PACKAGE.sourceCLICommand} add block kanban-sprint-board --out ./my-workspace`,
 API:`fetch("${SITE_ORIGIN}/api/v1/search?kind=component&query=button")\n  .then(response => response.json())\n  .then(data => console.log(data.items));`
});

export function mcpTerminalClientNote(client,locale='ko'){
 if(locale==='en')return client==='CLI'?'Run the KLIC package CLI through bunx. add writes to a new folder and does not run npm commands.':client==='API'?'Read-only public design registry API. It is not connected to customer data.':'Public read-only MCP for external clients. Use /connect for ChatGPT or Claude organization setup. The ChatGPT Sites plugin is a separate route with Sites authentication.';
 return client==='CLI'?'bunx로 KLIC 패키지 CLI를 실행하세요. add는 새 폴더에만 저장하며 npm 명령을 실행하지 않습니다.':client==='API'?'공개 디자인 레지스트리 조회 API입니다. 고객 데이터와 연결되지 않습니다.':'외부 클라이언트용 공개 읽기 전용 MCP입니다. ChatGPT·Claude 조직 연결은 /connect에서 설정하세요. ChatGPT Sites 플러그인은 Sites 인증을 사용하는 별도 경로입니다.';
}

export function renderMcpTerminal(locale='ko'){
 const label=locale==='en';
 return `<div class="hs-terminal" data-mcp-terminal-shell><div class="hs-terminal-top"><span class="hs-window-lights" aria-hidden="true"><i></i><i></i><i></i></span><small class="hs-terminal-path"><i data-lucide="folder" aria-hidden="true"></i><span>~/KLIC</span></small><button type="button" data-hs-copy data-mcp-terminal-copy aria-label="${label?'Copy connection settings':'연결 설정 복사'}"><i data-lucide="copy" aria-hidden="true"></i> ${label?'Copy':'복사'}</button></div><div class="hs-client-tabs" role="group" aria-label="${label?'Development tool':'개발 도구 선택'}">${Object.keys(MCP_TERMINAL_CLIENT_CONFIG).map((name,index)=>`<button type="button" data-hs-client="${name}" data-mcp-terminal-client="${name}" aria-pressed="${index===0}">${name}</button>`).join('')}</div><pre><code data-hs-code data-mcp-terminal-code>${esc(MCP_TERMINAL_CLIENT_CONFIG.Codex)}</code></pre><div class="hs-terminal-foot"><span aria-hidden="true">●</span><p data-hs-client-note>${mcpTerminalClientNote('Codex',locale)}</p></div><a href="#docs/integrations">${label?'Integration guide':'연동 문서에서 자세히 보기'} <i data-lucide="arrow-right" aria-hidden="true"></i></a><a href="/connect${label?'?lang=en':''}">${label?'Organization connector setup':'조직 연결 안내'} <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>`;
}

export function renderKlicInstallTerminal(locale='ko',commandTabs={},publicVersion='latest'){
 const english=locale==='en';
 const tabs=Object.entries(commandTabs).map(([manager],index)=>`<button type="button" data-hs-install-manager="${esc(manager)}" aria-pressed="${index===0}">${esc(manager)}</button>`).join('');
 return `<div class="hs-terminal" data-klic-install-terminal role="region" aria-label="${english?'KLIC install terminal at ~/KLIC':'KLIC 설치 터미널 · ~/KLIC'}"><div class="hs-terminal-top"><span class="hs-window-lights" aria-hidden="true"><i></i><i></i><i></i></span><small class="hs-terminal-path"><i data-lucide="folder" aria-hidden="true"></i><span>${english?'KLIC Install':'KLIC 설치'}</span></small><button type="button" data-hs-install-copy aria-label="${english?'Copy install commands':'설치 명령 복사'}"><i data-lucide="copy" aria-hidden="true"></i><span>${english?'Copy':'복사'}</span></button></div><div class="hs-client-tabs" role="group" aria-label="${english?'Package manager':'패키지 매니저'}">${tabs}</div><pre><code data-hs-install-code>${esc(commandTabs.bun||'')}</code></pre><div class="hs-terminal-foot"><p>${english?'klic-design · Agent Skill · Library · Motion · Current npm release: ':'klic-design · Agent Skill · Library · Motion · npm 최신 공개판: '}<code>${esc(NPM_PACKAGE.name)}<span class="hs-package-version-at">@</span>${esc(publicVersion)}</code></p></div><a href="/resources/cli${english?'?lang=en':''}">${english?'KLIC install guide':'KLIC 설치 안내'} <i data-lucide="arrow-right" aria-hidden="true"></i></a></div>`;
}

export const TERMINAL_COMPONENTS=Object.freeze([
 {id:'macos-terminal',name:'macOS Terminal',ko:'macOS 터미널',category:'developer',icon:'terminal',tone:'soft-neutral',description:'macOS 스타일의 MCP 연결 설정을 로컬에서 미리 보는 터미널 컴포넌트.',tags:['터미널','셸','개발 도구','macOS','zsh','명령줄'],token:'klic.component.surface.card.background',rule:'Codex 연결 명령·복사와 개발 도구 설정 탭을 macOS 터미널 프레임으로 표시합니다.',req:'FR18 · FR19 · FR21 · AT09',source:'KLIC-authored macOS MCP terminal specimen; commands are never executed.'},
 {id:'powershell-terminal',name:'Windows PowerShell',ko:'Windows PowerShell 터미널',category:'developer',icon:'terminal',tone:'soft-neutral',description:'Windows Terminal 탭과 창 제어를 갖춘 PowerShell 콘솔 화면.',tags:['터미널','셸','개발 도구','Windows','PowerShell','PS'],token:'klic.component.surface.card.background',rule:'Windows 제목줄·PowerShell 탭·PS 경로 프롬프트를 원본 콘솔 화면처럼 배치합니다.',req:'FR18 · FR19 · FR21 · AT09',source:'KLIC-authored sample PowerShell UI; no Windows shell or command execution.'},
 {id:'ubuntu-terminal',name:'Ubuntu Terminal',ko:'Ubuntu 터미널',category:'developer',icon:'terminal',tone:'soft-neutral',description:'Ubuntu GNOME Terminal 헤더와 aubergine 화면에 bash 파일 편집기를 재현한 컴포넌트.',tags:['터미널','셸','개발 도구','Ubuntu','우분투','bash'],token:'klic.component.surface.card.background',rule:'GNOME 제목줄·Ubuntu aubergine 버퍼·bash 스크립트 편집 화면을 한 창 안에 표시합니다.',req:'FR18 · FR19 · FR21 · AT09',source:'KLIC-authored Ubuntu GNOME Terminal adaptation based on the supplied screenshot; no upstream assets or shell execution.'},
 {id:'ghostty-terminal',name:'Ghostty',ko:'Ghostty 터미널',category:'developer',icon:'terminal',tone:'soft-neutral',description:'Ghostty 네이티브 제목줄, 탭과 세 갈래 split pane을 갖춘 개발 터미널 컴포넌트.',tags:['터미널','셸','개발 도구','Ghostty','탭','분할 창'],token:'klic.component.surface.card.background',rule:'Ghostty 제목줄·세션 탭·무제목 split pane으로 여러 셸 출력을 한 창에 배치합니다.',req:'FR18 · FR19 · FR21 · AT09',source:'KLIC-authored Ghostty UI adaptation based on the official platform-native reference; no upstream assets or shell execution.'},
 {id:'termius-terminal',name:'Termius',ko:'Termius 원격 터미널',category:'developer',icon:'terminal',tone:'soft-neutral',description:'Termius의 가로 세션 탭·호스트 탐색·4분할 SSH 화면을 재현한 컴포넌트.',tags:['터미널','개발 도구','Termius','SSH','호스트','원격 세션'],token:'klic.component.surface.card.background',rule:'Termius 사이드 탐색·가로 세션 탭·호스트별 split pane을 보여주며 모든 샘플 호스트는 klic-design입니다.',req:'FR18 · FR19 · FR21 · AT09',source:'KLIC-authored Termius desktop adaptation based on public desktop screenshots; no upstream assets or SSH connection.'}
]);

const transcript=rows=>`<pre class="klic-terminal-output"><code>${rows.map(([kind,text])=>`<span class="klic-terminal-line klic-terminal-line--${kind}">${esc(text)}</span>`).join('')}</code></pre>`;
const sampleBadge='<span class="klic-terminal-sample">SAMPLE · 실행 안 함</span>';
const frame=(item,detail,body)=>`<section class="klic-terminal klic-terminal--${esc(item.id)}" data-terminal-demo="${esc(item.id)}" aria-label="${esc(item.ko)} 샘플 미리보기">${body}${detail.footer?`<footer class="klic-terminal-footer">${sampleBadge}<span>${esc(detail.footer)}</span></footer>`:''}</section>`;

function renderMacOS(item){
 const detail={footer:''};
 const locale=globalThis.document?.documentElement?.lang==='en'?'en':'ko';
 return frame(item,detail,renderMcpTerminal(locale));
}

function renderPowerShell(item){
 const detail={footer:''};
 const prompt='PS C:\\Users\\klic-design>';
 const rows=[
  ['prompt','PS C:\\Users\\klic-design> Get-Location'],
  ['output',''],
  ['output','Path'],
  ['output','----'],
  ['output','C:\\Users\\klic-design'],
  ['output',''],
  ['prompt','PS C:\\Users\\klic-design> Get-ChildItem'],
  ['output','Mode   LastWriteTime   Length Name'],
  ['output','d----  11/03/2026                Projects'],
  ['output','-a---  11/03/2026       1248      README.md'],
  ['output',''],
  ['current',prompt]
 ];
 const lines=rows.map(([kind,text])=>`<span class="klic-terminal-windows-line klic-terminal-windows-line--${kind}">${esc(text)}${kind==='current'?'<span class="klic-terminal-windows-cursor" aria-hidden="true"></span>':''}</span>`).join('');
 const body=`<div class="klic-terminal-windows">
  <header class="klic-terminal-windows-titlebar">
   <div class="klic-terminal-windows-tab"><span class="klic-terminal-windows-app" aria-hidden="true">&gt;_</span><span class="klic-terminal-windows-title">Windows PowerShell</span><span class="klic-terminal-windows-tab-close" aria-hidden="true">×</span></div>
   <span class="klic-terminal-windows-tab-add" aria-hidden="true">＋</span><span class="klic-terminal-windows-tab-menu" aria-hidden="true">⌄</span>
   <span class="klic-terminal-windows-controls" aria-hidden="true"><i>−</i><i>□</i><i>×</i></span>
  </header>
  <div class="klic-terminal-windows-console" aria-label="PowerShell 정적 프롬프트"><pre class="klic-terminal-windows-output"><code>${lines}</code></pre></div>
 </div>`;
 return frame(item,detail,body);
}

function renderUbuntu(item){
 const detail={footer:''};
 const lines=['#!/bin/bash','#hello.bash','echo "Hello world!"','printf "hello world! 2\\n"',...Array.from({length:20},()=> '~')];
 const buffer=lines.map(line=>`<span class="klic-terminal-ubuntu-line${line==='~'?' is-empty':''}">${esc(line)}</span>`).join('');
 const body=`<div class="klic-terminal-ubuntu">
  <header class="klic-terminal-ubuntu-header"><span class="klic-terminal-ubuntu-new" aria-hidden="true"><i data-lucide="square-plus"></i></span><strong class="klic-terminal-ubuntu-title">klic@klic-design:/serverA/ch5</strong><span class="klic-terminal-ubuntu-toolbar" aria-hidden="true"><i data-lucide="search"></i><i data-lucide="menu"></i></span><span class="klic-terminal-ubuntu-controls" aria-hidden="true"><i data-lucide="minus"></i><i data-lucide="square"></i><i data-lucide="x"></i></span></header>
  <div class="klic-terminal-ubuntu-console" aria-label="Ubuntu 터미널의 정적 bash 파일 편집 예시"><pre><code>${buffer}</code></pre></div>
 </div>`;
 return frame(item,detail,body);
}

function renderGhostty(item){
 const detail={footer:''};
 const pane=(rows,active=false)=>`<section class="klic-terminal-ghostty-pane${active?' is-active':''}"><div class="klic-terminal-ghostty-console">${transcript(rows)}</div></section>`;
 const body=`<div class="klic-terminal-ghostty">
  <header class="klic-terminal-ghostty-titlebar"><span aria-hidden="true"></span><strong>~/KLIC</strong><span class="klic-terminal-ghostty-actions" aria-hidden="true"><i data-lucide="plus-square"></i><i data-lucide="menu"></i><i data-lucide="x"></i></span></header>
  <div class="klic-terminal-ghostty-tabs" aria-label="Ghostty 세션 탭"><span class="is-active"><i data-lucide="terminal"></i> klic-design</span><span><i data-lucide="terminal"></i> files</span><span class="klic-terminal-ghostty-add" aria-hidden="true"><i data-lucide="plus"></i></span></div>
  <div class="klic-terminal-ghostty-grid">
   ${pane([['prompt','klic@klic-design ~/KLIC %'],['command','sudo apt update'],['output','Hit:1 archive.ubuntu.com noble'],['output','Hit:2 security.ubuntu.com'],['output','Reading package lists... Done'],['output','All packages are up to date.'],['prompt','klic@klic-design ~/KLIC %']],true)}
   ${pane([['prompt','klic@klic-design ~/KLIC %'],['command','btop --preset process'],['output','Tasks: 214, 468 threads; 1 running'],['output','Load avg: 0.10  0.08  0.06'],['output','CPU 4.1% · Mem 5.12G / 31.2G'],['output','PID USER CPU% MEM% COMMAND'],['output','812  klic 1.4 0.6 ghostty']] )}
   ${pane([['prompt','klic@klic-design ~/KLIC %'],['command','ncdu ~/KLIC'],['output','1.10 GiB  node_modules/'],['output','808 MiB   node_modules/.cache/'],['output','226 MiB   node_modules/@types/'],['output','134 MiB   node_modules/vite/'],['output','82 MiB    dist/'],['output','18 MiB    dist/assets/'],['output','14 MiB    docs/'],['output','6 MiB     docs/guides/'],['output','2.4 MiB   scripts/'],['output','884 KiB   .git/'],['output','640 KiB   package.json'],['output','116 KiB   bun.lock'],['output','92 KiB    README.md'],['output','total: 2.31 GiB']])}
  </div>
 </div>`;
 return frame(item,detail,body);
}

function renderTermius(item){
 const detail={footer:''};
 const navItems=[['server','Hosts'],['folder-open','SFTP'],['network','Port forwarding'],['braces','Snippets'],['clock-3','History']];
 const nav=navItems.map(([icon,label],index)=>`<span class="klic-terminal-termius-nav-item${index===0?' is-active':''}"><i data-lucide="${icon}"></i>${label}</span>`).join('');
 const pane=(label,path,rows)=>`<section class="klic-terminal-termius-pane"><header><i data-lucide="server"></i><span>${esc(label)}</span><small>${esc(path)}</small></header><div class="klic-terminal-termius-console">${transcript(rows)}</div></section>`;
 const panes=`<div class="klic-terminal-termius-panes">
  ${pane('Prod Main','klic-design:/srv/prod',[['prompt','klic@klic-design:/srv/prod$'],['command','uptime'],['output','up 1 day, 2 hours · load average: 0.05'],['prompt','klic@klic-design:/srv/prod$'],['command','df -h /'],['output','/dev/root 80G 26G 54G 33% /'],['prompt','klic@klic-design:/srv/prod$']])}
  ${pane('Development','klic-design:~/KLIC',[['prompt','klic@klic-design:~/KLIC$'],['command','git status -sb'],['output','## main'],['output',' M src/app.js'],['prompt','klic@klic-design:~/KLIC$'],['command','bun --version'],['output','1.4.2']])}
  ${pane('QA','klic-design:/srv/qa',[['prompt','klic@klic-design:/srv/qa$'],['command','uname -s'],['output','Linux klic-design 6.8.0-51'],['prompt','klic@klic-design:/srv/qa$'],['command','whoami'],['output','klic'],['prompt','klic@klic-design:/srv/qa$']])}
  ${pane('Staging','klic-design:/srv/staging',[['prompt','klic@klic-design:/srv/staging$'],['command','systemctl is-active klic-app'],['output','active'],['prompt','klic@klic-design:/srv/staging$'],['command','journalctl -u klic-app -n 1'],['output','klic-app[2084]: ready'],['prompt','klic@klic-design:/srv/staging$']])}
 </div>`;
 const body=`<div class="klic-terminal-termius">
  <header class="klic-terminal-termius-appbar"><span class="klic-terminal-termius-wordmark">Termius</span><nav class="klic-terminal-termius-tabs" aria-label="Termius workspace tabs"><span class="is-active"><i data-lucide="layers-2"></i> Vaults</span><span><i data-lucide="folder-open"></i> SFTP</span><span class="klic-terminal-termius-session-tab"><i data-lucide="terminal"></i> klic-design</span><span class="klic-terminal-termius-add" aria-hidden="true"><i data-lucide="plus"></i></span></nav><span class="klic-terminal-termius-command-key">⌘ J</span></header>
  <div class="klic-terminal-termius-workspace"><nav class="klic-terminal-termius-sidebar" aria-label="Termius navigation">${nav}</nav>
   <main class="klic-terminal-termius-main"><header class="klic-terminal-termius-toolbar"><span class="klic-terminal-termius-search"><i data-lucide="search"></i>Find a host or ssh user@hostname...</span><span class="klic-terminal-termius-disconnected">DEMO · NOT CONNECTED</span></header><div class="klic-terminal-termius-actions"><span>＋　NEW HOST</span><span><i data-lucide="terminal"></i> TERMINAL</span><span><i data-lucide="radio"></i> SERIAL</span></div>${panes}</main>
   <aside class="klic-terminal-termius-themes" aria-label="Terminal theme preview"><strong>Font</strong><span class="klic-terminal-termius-setting">Monospace <i data-lucide="chevron-right"></i></span><strong>Theme</strong><span class="klic-terminal-termius-theme klic-terminal-termius-theme--blue is-selected"><i></i><span>KLIC Blue<small>Dark · selected</small></span></span><span class="klic-terminal-termius-theme klic-terminal-termius-theme--slate"><i></i><span>Slate<small>Dark · neutral</small></span></span><span class="klic-terminal-termius-theme klic-terminal-termius-theme--light"><i></i><span>Light<small>Neutral</small></span></span></aside>
  </div>
 </div>`;
 return frame(item,detail,body);
}

const renderers=Object.freeze({'macos-terminal':renderMacOS,'powershell-terminal':renderPowerShell,'ubuntu-terminal':renderUbuntu,'ghostty-terminal':renderGhostty,'termius-terminal':renderTermius});
const byId=new Map(TERMINAL_COMPONENTS.map(item=>[item.id,item]));
export const TERMINAL_COMPONENT_IDS=Object.freeze(TERMINAL_COMPONENTS.map(item=>item.id));
export function isTerminalComponent(id){return byId.has(id);}
export function renderTerminalSpecimen(id,uid='demo'){
 const item=byId.get(id),render=renderers[id];if(!item||!render)return '';
 const html=render(item).replace('data-terminal-demo="'+esc(id)+'"','data-terminal-demo="'+esc(id)+'" data-terminal-instance="'+esc(uid)+'"');
 return normalizeKlicMarkup(html,{componentId:id});
}
export function terminalComponentForms(component,uid=`terminal-${component.id}`){
 return [{id:'default',name:'터미널 창',description:component.description,html:renderTerminalSpecimen(component.id,`${uid}-default`),reference:null}];
}
