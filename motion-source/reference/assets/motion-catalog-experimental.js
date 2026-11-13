/* Each study encodes its named mechanism. Timelines are illustrative, not simulations. */
(() => {
  const demos = window.MOTION_DEMOS ||= {};
  const node = (cls, text = '', style = '') => `<div class="mxe-node stage-object web-motion-object ${cls}" style="${style}">${text}</div>`;
  const box = (cls, text = '', style = '') => node(`mxe-card ${cls}`, text, style);
  const dot = (cls, style = '') => node(`mxe-dot ${cls}`, '', style);
  const svg = (content) => `<svg class="mxe-svg" viewBox="0 0 260 154" aria-hidden="true">${content}</svg>`;
  const path = (cls, d, extra = '') => `<path class="stage-object web-motion-object ${cls}" d="${d}" ${extra}/>`;
  const text = (cls, value, style = '') => node(`mxe-text ${cls}`, value, style);
  const frames = (...stops) => stops.map(([offset, props]) => ({offset, ...props}));
  const track = (selector, keyframes, delay = 0) => ({selector, keyframes, delay});
  const fade = (at = .18, end = .35) => frames([0,{opacity:0}],[at,{opacity:0}],[end,{opacity:1}],[1,{opacity:1}]);
  const pulse = (at = .35) => frames([0,{opacity:0,transform:'scale(.4)'}],[at,{opacity:0,transform:'scale(.4)'}],[at+.05,{opacity:.8,transform:'scale(.65)'}],[at+.24,{opacity:0,transform:'scale(1.6)'}],[1,{opacity:0,transform:'scale(1.6)'}]);
  const draw = (at = .12, end = .6) => frames([0,{strokeDashoffset:1}],[at,{strokeDashoffset:1}],[end,{strokeDashoffset:0}],[1,{strokeDashoffset:0}]);
  const letters = (word, cls='letter') => [...word].map((c,i)=>node(`mxe-letter ${cls}`,c,`left:${34+i*27}px;top:58px`)).join('');
  const rings = () => node('mxe-ring ring-a')+node('mxe-ring ring-b');
  const axis = svg('<path d="M30 25V121H234" fill="none" stroke="#354052"/><path d="M30 73H234" fill="none" stroke="#1a2531" stroke-dasharray="3 4"/>');
  const meta = {
    'ui-spatial': ['깊이는 계층이나 선택 상태 설명에 사용','원근 변형 중에도 조작 대상을 놓치지 않게 한다','이동을 줄이는 설정에서는 최종 배치를 직접 표시한다'],
    'ui-material': ['접촉·변형·복원 순서가 읽힐 간격으로','소재 표현은 실제 물리 계산과 나눠 생각한다','변형 후에도 라벨과 상태가 읽히는 형태로 되돌린다'],
    'kinetic-type': ['읽는 순서에 따라 글자를 움직인다','글자를 읽을 수 있는 정지 시간을 충분히 남긴다','본문에는 같은 강도의 연출을 반복하지 않는다'],
    'game-impact-fx': ['명중이나 확정 순간에 액센트를 맞춘다','충격 뒤에는 감쇠시켜 정보를 읽게 한다','반복되는 점멸이나 큰 흔들림은 피한다'],
    'data-story': ['이 데모의 수치는 설명용 가상 데이터','구현에서는 실데이터의 비율과 위치를 유지','추정값과 확정값을 구별해 표시한다']
  };
  const metaEn = {
    'ui-spatial': ['Use depth to explain hierarchy or selection state','Keep the interactive target trackable during perspective changes','With reduced motion, show the final layout directly'],
    'ui-material': ['Space contact, deformation, and recovery so their order is readable','Treat the material look separately from real physics','Return to a shape where the label and state stay readable'],
    'kinetic-type': ['Move letters in reading order','Leave enough still time to read the text','Do not repeat the same intensity in body text'],
    'game-impact-fx': ['Align the accent with the moment of a hit or confirmation','Let the effect decay after impact so the information can be read','Avoid repeated flashing and large shakes'],
    'data-story': ['The values in this demo are illustrative, not real data','In production, keep the ratios and positions of the real data','Distinguish estimates from confirmed values']
  };
  function define(group,key,html,tracks,description,focus,options={}) {
    demos[`catalog-${group}-${key}`] = {
      html:`<div class="mxe-scene mxe-${group} mxe-${key}">${html}</div>`, tracks,
      duration:4200, easing:'linear', description, descriptionEn:options.descriptionEn || description,
      focus, focusEn:options.focusEn || focus,
      caution:group==='data-story'?'그림 속 값은 설명용 가상 데이터다. 위치나 면적 변화는 실데이터에 맞추고, 장식으로 의미를 바꾸지 않는다.':'자동 재생에 의한 움직임 시범. 구현 시에는 입력이나 상태 갱신에 연결하고 움직임을 줄이는 설정에서는 최종 상태를 표시한다.',
      cautionEn:group==='data-story'?'Values are illustrative. Map geometry to real data without distorting its meaning.':'This is an autoplay study. Connect the motion to a real event and provide a reduced-motion final state.',
      tips:meta[group], tipsEn:metaEn[group], recipe:`시작 상태 → ${focus} → 완료 상태 유지`, ...options
    };
  }

  // Spatial UI: depth belongs to an explicit layer, target, or navigation relation.
  define('ui-spatial','cursor-depth-pull', box('pull-card','CARD')+dot('cursor','left:196px;top:100px'), [
    track('.cursor',frames([0,{transform:'translate(0,0)'}],[.2,{transform:'translate(-43px,-37px)'}],[.65,{transform:'translate(-43px,-37px)'}],[.8,{transform:'translate(0,0)'}],[1,{transform:'translate(0,0)'}])),
    track('.pull-card',frames([0,{transform:'perspective(360px) rotateX(0) rotateY(0) translateZ(0)'}],[.2,{transform:'perspective(360px) rotateX(9deg) rotateY(-13deg) translateZ(24px)'}],[.65,{transform:'perspective(360px) rotateX(9deg) rotateY(-13deg) translateZ(24px)'}],[.8,{transform:'perspective(360px) rotateX(0) rotateY(0) translateZ(0)'}],[1,{transform:'perspective(360px) rotateX(0) rotateY(0) translateZ(0)'}]))
  ],'커서가 가까워지면 카드가 앞쪽으로 일어나고 떨어지면 평면으로 돌아간다.','커서 이동에 이어 회전과 Z방향 이동이 반응한다.');
  define('ui-spatial','focus-portal',node('portal-window',box('portal-content','DETAIL')), [
    track('.portal-window',frames([0,{clipPath:'circle(2% at 50% 50%)'}],[.15,{clipPath:'circle(2% at 50% 50%)'}],[.48,{clipPath:'circle(76% at 50% 50%)'}],[1,{clipPath:'circle(76% at 50% 50%)'}])),
    track('.portal-content',frames([0,{transform:'scale(.72)',opacity:.2}],[.2,{transform:'scale(.72)',opacity:.2}],[.55,{transform:'scale(1)',opacity:1}],[1,{transform:'scale(1)',opacity:1}]))
  ],'원형 개구부가 확대되며, 안쪽에 둔 상세 면을 앞쪽으로 끌어낸다.','개구부 확대와 내용면 접근을 살짝 어긋나게 한다.');
  define('ui-spatial','radial-command-bloom',node('mxe-hub','＋')+['✦','⌕','▣','↗','○'].map((s,i)=>box(`radial-command command-${i}`,s)).join(''),[
    track('.radial-command',(i)=>{const a=(-90+i*72)*Math.PI/180,x=Math.cos(a)*59,y=Math.sin(a)*48;return frames([0,{transform:'translate(0,0) scale(.25)',opacity:0}],[.14+i*.035,{transform:'translate(0,0) scale(.25)',opacity:0}],[.4+i*.035,{transform:`translate(${x}px,${y}px) scale(1)`,opacity:1}],[1,{transform:`translate(${x}px,${y}px) scale(1)`,opacity:1}]);})
  ],'중앙 버튼에서 다섯 개의 명령이 방사형으로 열린다.','같은 중심에서 서로 다른 방향으로 펼쳐 메뉴의 관계를 유지한다.');
  define('ui-spatial','spatial-breadcrumb',['HOME','FILES','ITEM'].map((s,i)=>box(`crumb crumb-${i}`,s,`left:${30+i*68}px;top:56px`)).join(''),[
    track('.crumb',(i)=>frames([0,{transform:'perspective(280px) translateZ(0)',opacity:1}],[.24,{transform:`perspective(280px) translateZ(${-70+i*35}px) translateY(${(2-i)*10}px)`,opacity:.35+i*.3}],[.6,{transform:`perspective(280px) translateZ(${-70+i*35}px) translateY(${(2-i)*10}px)`,opacity:.35+i*.3}],[1,{transform:`perspective(280px) translateZ(${-70+i*35}px) translateY(${(2-i)*10}px)`,opacity:.35+i*.3}]))
  ],'상위 계층일수록 안쪽으로 물러나고, 현재 위치가 앞에 남는 브레드크럼.','계층 깊이와 겉보기 거리를 대응시킨다.');
  define('ui-spatial','perspective-dock',node('dock-base')+['◆','●','■','✦','▲'].map((s,i)=>box('dock-icon',s,`left:${37+i*40}px;top:68px`)).join(''),[
    track('.dock-icon',(i)=>{const scale=1.55-Math.abs(2-i)*.22;return frames([0,{transform:'translateY(0) scale(.85)'}],[.32,{transform:`translateY(${-12+(Math.abs(2-i)*4)}px) scale(${scale})`}],[.66,{transform:`translateY(${-12+(Math.abs(2-i)*4)}px) scale(${scale})`}],[.85,{transform:'translateY(0) scale(.85)'}],[1,{transform:'translateY(0) scale(.85)'}]);})
  ],'독의 중앙 아이콘을 들어 올리고, 옆 아이콘도 거리에 따라 확대한다.','선택 위치로부터의 거리에 따른 연속적인 확대.');
  define('ui-spatial','layer-peel',box('peel-under','DETAIL')+box('peel-top','COVER'),[
    track('.peel-top',frames([0,{transform:'perspective(400px) rotateY(0deg)'}],[.16,{transform:'perspective(400px) rotateY(0deg)'}],[.52,{transform:'perspective(400px) rotateY(-145deg)'}],[1,{transform:'perspective(400px) rotateY(-145deg)'}]))
  ],'위 면을 왼쪽 끝부터 넘겨 뒤의 정보 면을 보여준다.','회전 지점을 왼쪽 끝에 고정하고, 아래 층은 움직이지 않는다.');
  define('ui-spatial','tooltip-orbit',node('mxe-hub','i')+box('orbit-tooltip','DETAIL'),[
    track('.orbit-tooltip',frames([0,{transform:'translate(-57px,-36px)'}],[.22,{transform:'translate(50px,-37px)'}],[.45,{transform:'translate(60px,30px)'}],[.65,{transform:'translate(-51px,32px)'}],[.85,{transform:'translate(-57px,-36px)'}],[1,{transform:'translate(-57px,-36px)'}]))
  ],'대상을 중심으로 툴팁 위치를 옮겨, 화면 끝을 피하는 배치 변경을 나타낸다.','내용은 회전시키지 않고, 위치만 대상 주위로 옮긴다.');
  define('ui-spatial','depth-lens',node('lens-grid')+node('depth-lens','ZOOM'),[
    track('.depth-lens',frames([0,{transform:'translateX(-64px) scale(.75)'}],[.25,{transform:'translateX(-15px) scale(1.1)'}],[.55,{transform:'translateX(55px) scale(1)'}],[.8,{transform:'translateX(0) scale(1.1)'}],[1,{transform:'translateX(0) scale(1.1)'}]))
  ],'격자 위를 확대창이 이동하며 창 안만 큰 격자로 표시한다.','창 안팎 격자 간격 차로 확대를 전달한다.',{caution:'확대창 표시 방식을 보여주는 CSS 데모. 실제 콘텐츠에서는 창 안에 대상의 확대 렌더링을 동기화한다.'});
  define('ui-spatial','magnetic-constellation',svg(path('magnet-lines','M52 110L96 43L167 34L209 104L130 118Z','fill="none" stroke="#35505c" vector-effect="non-scaling-stroke"'))+[[52,110],[96,43],[167,34],[209,104],[130,118]].map(([x,y])=>dot('magnet-node',`left:${x-6}px;top:${y-6}px`)).join('')+dot('magnet-center','left:124px;top:70px'),[
    track('.magnet-node',(i)=>{const pos=[[52,110],[96,43],[167,34],[209,104],[130,118]][i];return frames([0,{transform:'translate(0,0)'}],[.38,{transform:`translate(${(130-pos[0])*.38}px,${(77-pos[1])*.38}px)`}],[.67,{transform:`translate(${(130-pos[0])*.38}px,${(77-pos[1])*.38}px)`}],[.88,{transform:'translate(0,0)'}],[1,{transform:'translate(0,0)'}]);}),
    track('.magnet-lines',frames([0,{transform:'scale(1)'}],[.38,{transform:'scale(.62)'}],[.67,{transform:'scale(.62)'}],[.88,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]))
  ],'주변 노드가 중심으로 끌려 관계를 남긴 채 모인다.','각 점을 중심까지의 거리에 비례해 이동시킨다.');
  define('ui-spatial','infinite-canvas-jump',node('canvas-world',box('canvas-a','A','left:30px;top:25px')+box('canvas-b','B','left:210px;top:98px')+box('canvas-c','C','left:355px;top:20px')),[
    track('.canvas-world',frames([0,{transform:'translate(0,0) scale(1)'}],[.16,{transform:'translate(0,0) scale(1)'}],[.32,{transform:'translate(-85px,-15px) scale(.7)'}],[.53,{transform:'translate(-174px,-63px) scale(1)'}],[1,{transform:'translate(-174px,-63px) scale(1)'}]))
  ],'넓은 캔버스를 한 번 물러난 뒤 목표 카드로 이동한다.','도중에 당겨서 떨어진 두 지점의 위치 관계를 보여준다.');
  define('ui-spatial','z-notification',box('z-back','WORKSPACE')+box('z-toast','✓ SAVED'),[
    track('.z-toast',frames([0,{transform:'perspective(380px) translateZ(-180px)',opacity:0}],[.15,{transform:'perspective(380px) translateZ(-180px)',opacity:0}],[.4,{transform:'perspective(380px) translateZ(18px)',opacity:1}],[.5,{transform:'perspective(380px) translateZ(0)',opacity:1}],[1,{transform:'perspective(380px) translateZ(0)',opacity:1}]))
  ],'작업면 안쪽에서 알림이 앞쪽으로 나타나, 일정 깊이에서 멈춘다.','접근 후 작은 되돌림과 읽을 수 있는 정지 시간.');
  define('ui-spatial','camera-dolly-ui',node('dolly-world',box('dolly-far','BACK')+box('dolly-near','FRONT')),[
    track('.dolly-near',frames([0,{transform:'translate(8.7px,-4px) scale(.8)'}],[.15,{transform:'translate(8.7px,-4px) scale(.8)'}],[.6,{transform:'translate(-15.2px,7px) scale(1.35)'}],[1,{transform:'translate(-15.2px,7px) scale(1.35)'}])),
    track('.dolly-far',frames([0,{transform:'translate(-12.2px,7.1px) scale(.66)',opacity:.4}],[.15,{transform:'translate(-12.2px,7.1px) scale(.66)',opacity:.4}],[.6,{transform:'translate(-6.5px,3.8px) scale(.82)',opacity:.62}],[1,{transform:'translate(-6.5px,3.8px) scale(.82)',opacity:.62}]))
  ],'앞뒤로 떨어진 두 면에 시점을 가까이 해, 앞쪽일수록 크게 퍼지는 원근을 보여준다.','전경과 배경의 확대율 차이.');
  define('ui-spatial','volumetric-menu',['ONE','TWO','THREE'].map((s,i)=>box('volume-plane',s,`top:${31+i*18}px;left:${53+i*12}px`)).join(''),[
    track('.volume-plane',(i)=>frames([0,{transform:'perspective(400px) rotateX(0deg) translateZ(0)'}],[.42,{transform:`perspective(400px) rotateX(42deg) translateZ(${(1-i)*34}px) translateY(${(i-1)*14}px)`}],[1,{transform:`perspective(400px) rotateX(42deg) translateZ(${(1-i)*34}px) translateY(${(i-1)*14}px)`}]))
  ],'겹쳐진 메뉴를 위아래 깊이로 펼쳐 층으로 보여준다.','같은 각도의 면을 깊이만 바꿔 분리한다.');
  define('ui-spatial','parallax-inspector',['BG','CONTENT','UI'].map((s,i)=>box('inspect-plane',s,`left:${44+i*13}px;top:${30+i*13}px;opacity:${.45+i*.25}`)).join(''),[
    track('.inspect-plane',(i)=>frames([0,{transform:'translateX(0) rotateY(0deg)'}],[.32,{transform:`translateX(${[8,20,36][i]}px) rotateY(-10deg)`}],[.65,{transform:`translateX(${[-7,-17,-30][i]}px) rotateY(9deg)`}],[.86,{transform:'translateX(0) rotateY(0deg)'}],[1,{transform:'translateX(0) rotateY(0deg)'}]))
  ],'배경·내용·UI 를 서로 다른 양만큼 옆으로 움직여 레이어 거리를 보여준다.','앞쪽 레이어일수록 크게 움직이는 상대 차이.');
  define('ui-spatial','spatial-search',box('search-field','⌕  DESIGN')+['A','B','C'].map((s,i)=>box('search-result',s,`left:${37+i*65}px;top:72px`)).join(''),[
    track('.search-result',(i)=>frames([0,{transform:'perspective(300px) translateZ(-100px) translateY(-30px)',opacity:0}],[.19+i*.09,{transform:'perspective(300px) translateZ(-100px) translateY(-30px)',opacity:0}],[.41+i*.09,{transform:'perspective(300px) translateZ(0) translateY(0)',opacity:1}],[1,{transform:'perspective(300px) translateZ(0) translateY(0)',opacity:1}]))
  ],'검색창 안쪽에서 결과 카드를 순서대로 꺼낸다.','검색창을 시작점으로 삼아 읽는 순서대로 결과를 나열한다.');
  define('ui-spatial','orbit-context',node('orbit-guide')+node('mxe-hub','EDIT')+['↗','◆','⌫'].map((s,i)=>box(`context-node context-${i}`,s)).join(''),[
    track('.context-node',(i)=>{const a=i*120;return frames([0,{transform:`rotate(${a-60}deg) translateX(62px) rotate(${-a+60}deg)`,opacity:0}],[.18,{transform:`rotate(${a-60}deg) translateX(62px) rotate(${-a+60}deg)`,opacity:0}],[.5,{transform:`rotate(${a}deg) translateX(62px) rotate(${-a}deg)`,opacity:1}],[1,{transform:`rotate(${a}deg) translateX(62px) rotate(${-a}deg)`,opacity:1}]);})
  ],'대상 주변 궤도를 따라 맥락 명령이 미끄러져 들어와 정위치에 멈춘다.','공전과 역회전을 조합해 아이콘 방향을 유지한다.');
  define('ui-spatial','depth-stack-reorder',['01','02','03'].map((s,i)=>box(`reorder-card reorder-${i}`,s,`left:${66+i*10}px;top:${31+i*17}px`)).join(''),[
    track('.reorder-2',frames([0,{transform:'translate(0,0)',zIndex:6}],[.24,{transform:'translate(58px,-10px) rotate(8deg)',zIndex:6}],[.25,{transform:'translate(58px,-10px) rotate(8deg)',zIndex:2}],[.48,{transform:'translate(-20px,-34px) rotate(0deg)',zIndex:2}],[1,{transform:'translate(-20px,-34px) rotate(0deg)',zIndex:2}])),
    track('.reorder-0',frames([0,{transform:'translate(0,0)'}],[.48,{transform:'translate(10px,17px)'}],[1,{transform:'translate(10px,17px)'}])),track('.reorder-1',frames([0,{transform:'translate(0,0)'}],[.48,{transform:'translate(10px,17px)'}],[1,{transform:'translate(10px,17px)'}]))
  ],'최전면 카드를 옆으로 빼 뒤에 끼워 넣고 나머지를 한 단계씩 민다.','교차 전 바깥으로 피하는 경로와, 재정렬 후 순서.');
  define('ui-spatial','calendar-fold',box('calendar-base','25')+box('calendar-page','24'),[
    track('.calendar-page',frames([0,{transform:'perspective(350px) rotateX(0deg)',opacity:1}],[.18,{transform:'perspective(350px) rotateX(0deg)',opacity:1}],[.57,{transform:'perspective(350px) rotateX(-170deg)',opacity:0}],[1,{transform:'perspective(350px) rotateX(-170deg)',opacity:0}]))
  ],'캘린더 위 끝을 지점으로 날짜 면이 넘어가며 다음 날을 표시한다.','지점 위치와 넘긴 뒤 나타나는 새 날짜.');
  define('ui-spatial','cursor-raycast',svg(path('selection-ray','M28 128L151 70','fill="none" stroke="#78efd0" stroke-width="2" pathLength="1" stroke-dasharray="1"'))+box('ray-target','TARGET','left:151px;top:26px')+dot('ray-origin','left:22px;top:122px'),[
    track('.selection-ray',draw(.1,.4)),track('.ray-target',frames([0,{borderColor:'#34404f',backgroundColor:'#111b26'}],[.4,{borderColor:'#34404f',backgroundColor:'#111b26'}],[.46,{borderColor:'#a6ffe3',backgroundColor:'#254e49'}],[1,{borderColor:'#a6ffe3',backgroundColor:'#254e49'}]))
  ],'시작점에서 대상으로 광선을 뻗어 도달한 순간 대상을 선택 표시한다.','레이 도착과 선택 하이라이트를 같은 시각으로 맞춘다.',{caution:'선택 레이의 시각 예시. 실제 3D 교차 판정은 포함하지 않으며 대상 위치는 고정.'});
  define('ui-spatial','spatial-audio-locator',node('audio-map')+dot('audio-source','left:190px;top:45px')+node('audio-bearing')+node('audio-listener','◉')+node('audio-wave wave-1')+node('audio-wave wave-2'),[
    track('.audio-wave',(i)=>frames([0,{transform:'scale(.2)',opacity:0}],[.12+i*.16,{transform:'scale(.2)',opacity:.9}],[.44+i*.16,{transform:'scale(2.96)',opacity:.55}],[.54+i*.16,{transform:'scale(3.8)',opacity:0}],[1,{transform:'scale(3.8)',opacity:0}])),
    track('.audio-bearing',frames([0,{opacity:0}],[.43,{opacity:0}],[.47,{opacity:1}],[.88,{opacity:1}],[.96,{opacity:0}],[1,{opacity:0}]))
  ],'음원 위치에서 파동이 퍼져 중앙의 리스너에 닿는 방향을 나타낸다.','파동 시작점을 음원에 고정한다.',{caution:'방향을 시각화하는 무음 데모. 공간 오디오 처리나 소리의 거리 감쇠 계산은 하지 않는다.'});

  // Materials: deliberately small CSS/SVG studies, with stylization called out.
  define('ui-material','liquid-tab-bridge',node('liquid-rail','<span>A</span><span>B</span>')+node('liquid-bridge')+node('liquid-knob'),[
    track('.liquid-bridge',frames([0,{clipPath:'inset(0 94px 0 0 round 6px)',transform:'scaleY(1)'}],[.23,{clipPath:'inset(0 47px 0 0 round 6px)',transform:'scaleY(.9)'}],[.35,{clipPath:'inset(0 12px 0 30px round 6px)',transform:'scaleY(.42)'}],[.42,{clipPath:'inset(0 0 0 94px round 6px)',transform:'scaleY(.2)'}],[1,{clipPath:'inset(0 0 0 94px round 6px)',transform:'scaleY(.2)'}])),
    track('.liquid-knob',frames([0,{transform:'translateX(0)',borderRadius:'50%'}],[.23,{transform:'translateX(47px) scaleX(1.4)',borderRadius:'45%'}],[.42,{transform:'translateX(94px)',borderRadius:'50%'}],[1,{transform:'translateX(94px)',borderRadius:'50%'}]))
  ],'선택 탭이 옮겨가는 도중 가는 액체 다리가 뻗어 나왔다가 도착 시 끊어진다.','연결을 늘인 다음 가늘게 하여 이동 목표로 수렴시킨다.');
  define('ui-material','gel-button-split',box('gel gel-a','A')+box('gel gel-b','B')+node('gel-neck'),[
    track('.gel-a',frames([0,{transform:'translateX(0)',borderRadius:'46%'}],[.4,{transform:'translateX(-45px)',borderRadius:'50%'}],[1,{transform:'translateX(-45px)',borderRadius:'50%'}])),
    track('.gel-b',frames([0,{transform:'translateX(0)',borderRadius:'46%'}],[.4,{transform:'translateX(45px)',borderRadius:'50%'}],[1,{transform:'translateX(45px)',borderRadius:'50%'}])),
    track('.gel-neck',frames([0,{transform:'scaleX(.2) scaleY(1)'}],[.25,{transform:'scaleX(1) scaleY(.45)'}],[.4,{transform:'scaleX(1) scaleY(0)'}],[1,{transform:'scaleX(1) scaleY(0)'}]))
  ],'하나의 젤 덩어리가 좌우로 당겨지고, 중앙의 목이 가늘어져 둘로 갈라진다.','분열 전 양쪽과 연결부를 동시에 늘린다.');
  define('ui-material','glass-refraction',node('glass-grid')+node('glass-lens')+node('glass-highlight'),[
    track('.glass-lens',frames([0,{transform:'translateX(-58px)'}],[.55,{transform:'translateX(58px)'}],[.85,{transform:'translateX(0)'}],[1,{transform:'translateX(0)'}])),
    track('.glass-highlight',frames([0,{transform:'translateX(-58px)',opacity:.35}],[.55,{transform:'translateX(58px)',opacity:.75}],[.85,{transform:'translateX(0)',opacity:.5}],[1,{transform:'translateX(0)',opacity:.5}]))
  ],'유리 같은 창을 움직여 내부 격자를 확대해 경계의 어긋남을 보여준다.','창 가장자리에서 배경 격자가 불연속이 되는 보임 방식.',{title:'유리풍 굴절 호버',titleEn:'Stylized Glass Refraction Hover',caution:'CSS 배경 확대에 의한 양식화. 굴절률·시선·두께를 쓴 광학 시뮬레이션이 아님.'});
  define('ui-material','ink-adhesion',node('ink-pool')+[0,1,2].map(i=>dot('ink-drop',`left:${72+i*56}px;top:${28+i*8}px`)).join(''),[
    track('.ink-drop',(i)=>frames([0,{transform:'translateY(0) scale(1)'}],[.2+i*.09,{transform:'translateY(0) scale(1)'}],[.4+i*.09,{transform:'translateY(43px) scale(.7,1.4)'}],[.48+i*.09,{transform:'translateY(55px) scale(1.9,.4)',opacity:1}],[.57+i*.09,{transform:'translateY(56px) scale(1.9,.4)',opacity:0}],[1,{opacity:0,transform:'translateY(56px)'}])),
    track('.ink-pool',frames([0,{transform:'scaleX(.62)'}],[.7,{transform:'scaleX(1)'}],[1,{transform:'scaleX(1)'}]))
  ],'가라앉음에만 이징을 건다','세로로 늘어난 물방울이 접촉 시 옆으로 납작해진다.');
  define('ui-material','metallic-foil',box('foil-card','FOIL'),[
    track('.foil-card',frames([0,{transform:'perspective(350px) rotateY(-22deg)',backgroundPosition:'0% 50%'}],[.35,{transform:'perspective(350px) rotateY(22deg)',backgroundPosition:'100% 50%'}],[.7,{transform:'perspective(350px) rotateY(0deg)',backgroundPosition:'55% 50%'}],[1,{transform:'perspective(350px) rotateY(0deg)',backgroundPosition:'55% 50%'}]))
  ],'박 카드 기울기에 맞춰 가는 하이라이트가 가로질러 간다.','기울기와 반사 밴드 위치를 동기화한다.',{caution:'금박 인상을 만드는 그라데이션 표현. 조명을 계산한 물리 기반 재질이 아니다.'});
  define('ui-material','soft-body-toggle',node('soft-rail')+node('soft-knob'),[
    track('.soft-knob',frames([0,{transform:'translateX(0) scale(1,1)'}],[.2,{transform:'translateX(0) scale(.8,1.15)'}],[.35,{transform:'translateX(86px) scale(1.3,.82)'}],[.46,{transform:'translateX(86px) scale(.93,1.06)'}],[.56,{transform:'translateX(86px) scale(1)'}],[1,{transform:'translateX(86px) scale(1)'}]))
  ],'토글의 노브가 눌려 줄어들고 가로 이동 중에 늘어나며 도착 시 복원된다.','이동 방향과 변형 방향을 일치시킨다.');
  define('ui-material','viscous-progress',node('viscous-track',node('viscous-fill')+node('viscous-head')),[
    track('.viscous-fill',frames([0,{transform:'scaleX(.02)'}],[.18,{transform:'scaleX(.02)'}],[.48,{transform:'scaleX(.74)'}],[.64,{transform:'scaleX(1)'}],[1,{transform:'scaleX(1)'}])),
    track('.viscous-head',frames([0,{transform:'translateX(0) scale(.7,1)'}],[.18,{transform:'translateX(0) scale(.7,1)'}],[.48,{transform:'translateX(115px) scale(1.4,.75)'}],[.64,{transform:'translateX(160px) scale(.7,1)'}],[1,{transform:'translateX(160px) scale(.7,1)'}]))
  ],'둥근 액체 끝이 늘었다 줄었다 하며 진행 바를 채운다.','평평한 뒤쪽과 둥근 앞끝을 따로 움직인다.');
  define('ui-material','chromatic-glass-edge',box('prism-body','PRISM')+node('prism-edge red-edge')+node('prism-edge cyan-edge'),[
    track('.red-edge',frames([0,{transform:'translateX(0)',opacity:0}],[.3,{transform:'translateX(-5px)',opacity:.9}],[.6,{transform:'translateX(5px)',opacity:.9}],[.82,{transform:'translateX(0)',opacity:.3}],[1,{transform:'translateX(0)',opacity:.3}])),
    track('.cyan-edge',frames([0,{transform:'translateX(0)',opacity:0}],[.3,{transform:'translateX(5px)',opacity:.9}],[.6,{transform:'translateX(-5px)',opacity:.9}],[.82,{transform:'translateX(0)',opacity:.3}],[1,{transform:'translateX(0)',opacity:.3}]))
  ],'투명 면의 좌우 가장자리에 빨강과 시안의 윤곽이 분리되어 나타났다가 중앙으로 돌아온다.','면 전체가 아니라 윤곽으로 색 어긋남을 한정한다.',{title:'색 분리 유리 엣지',titleEn:'Chromatic Glass Edge',caution:'가장자리 색 분리를 디자인한 CSS 표현. 파장별 굴절을 계산하는 분광 표현이 아니다.'});
  define('ui-material','paper-fold',box('paper-base','INSIDE')+box('paper-back','<i></i><i></i><i></i>')+box('paper-flap','OPEN'),[
    track('.paper-flap',frames([0,{transform:'perspective(380px) rotateY(0deg)',filter:'brightness(1)',opacity:1}],[.18,{transform:'perspective(380px) rotateY(0deg)',filter:'brightness(1)',opacity:1,easing:'cubic-bezier(.55,0,1,.5)'}],[.36,{transform:'perspective(380px) rotateY(-90deg)',filter:'brightness(.6)',opacity:1}],[.361,{transform:'perspective(380px) rotateY(-90deg)',filter:'brightness(.6)',opacity:0}],[1,{transform:'perspective(380px) rotateY(-90deg)',filter:'brightness(.6)',opacity:0}])),
    track('.paper-back',frames([0,{transform:'perspective(380px) rotateY(90deg)',filter:'brightness(.6)',opacity:0}],[.36,{transform:'perspective(380px) rotateY(90deg)',filter:'brightness(.6)',opacity:0}],[.361,{transform:'perspective(380px) rotateY(90deg)',filter:'brightness(.6)',opacity:1,easing:'cubic-bezier(0,.5,.45,1)'}],[.55,{transform:'perspective(380px) rotateY(0deg)',filter:'brightness(.9)',opacity:1}],[1,{transform:'perspective(380px) rotateY(0deg)',filter:'brightness(.9)',opacity:1}]))
  ],'종이 중앙의 접힘을 고정하고 오른쪽 절반을 왼쪽으로 접어 안면을 보여준다.','평면 접힘을 지점으로 회전하고, 각도에 맞춰 면을 어둡게 한다.');
  define('ui-material','cloth-wave',Array.from({length:12},(_,i)=>node('cloth-strip','',`left:${40+i*15}px;top:43px;background-position:${-i*15}px 0`)).join(''),[
    track('.cloth-strip',(i)=>frames([0,{transform:'translateY(0) rotateY(0deg)'}],[.16+i*.026,{transform:'translateY(-13px) rotateY(12deg)'}],[.34+i*.026,{transform:'translateY(11px) rotateY(-12deg)'}],[.56+i*.026,{transform:'translateY(0) rotateY(0deg)'}],[1,{transform:'translateY(0) rotateY(0deg)'}]))
  ],'가는 밴드로 나눈 면을 시간차로 위아래로 움직여 천의 파도가 옆으로 전해진다.','인접한 밴드의 위상차에 의한 한 방향의 파동.',{caution:'분할 면에 의한 천 근사. 장력이나 충돌을 푸는 클로스 시뮬레이션이 아니다.'});
  define('ui-material','bubble-merge',node('merge-bubble bubble-left','A')+node('merge-bubble bubble-right','B')+node('merged-label','A + B'),[
    track('.bubble-left',frames([0,{transform:'translateX(-50px) scale(1)'}],[.35,{transform:'translateX(-12px) scale(1.1)'}],[.52,{transform:'translateX(0) scale(1.18)'}],[1,{transform:'translateX(0) scale(1.18)'}])),
    track('.bubble-right',frames([0,{transform:'translateX(50px) scale(1)',opacity:1}],[.35,{transform:'translateX(12px) scale(1.1)',opacity:1}],[.52,{transform:'translateX(0) scale(1.18)',opacity:0}],[1,{transform:'translateX(0) scale(1.18)',opacity:0}])),track('.merged-label',fade(.5,.56))
  ],'두 버블이 가까워지며 하나의 큰 선택 면으로 결합한다.','접촉 후 큰 면으로 바뀌고 통합 라벨을 표시한다.');
  define('ui-material','frost-melt',box('frost-content','UNLOCKED')+box('frost-cover','LOCKED'),[
    track('.frost-cover',frames([0,{clipPath:'circle(100% at 50% 50%)',opacity:1}],[.2,{clipPath:'circle(100% at 50% 50%)',opacity:1}],[.62,{clipPath:'circle(0% at 50% 50%)',opacity:0}],[1,{clipPath:'circle(0% at 50% 50%)',opacity:0}]))
  ],'서리 무늬 덮개가 가장자리부터 줄어들며 투명한 정보면이 나타난다.','덮개 면적이 줄어드는 것으로 잠금 해제를 전달한다.',{caution:'서리 녹는 것을 원형 마스크로 양식화한 표현. 온도 분포나 실제 융해를 재현하지 않는다.'});
  define('ui-material','membrane-press',svg(path('membrane','M35 76Q130 76 225 76','fill="none" stroke="#81e5d4" stroke-width="4"'))+dot('press-finger','left:124px;top:25px'),[
    track('.press-finger',frames([0,{transform:'translateY(0)'}],[.3,{transform:'translateY(64px)'}],[.42,{transform:'translateY(64px)'}],[.6,{transform:'translateY(0)'}],[1,{transform:'translateY(0)'}])),
    track('.membrane',frames([0,{d:'path("M35 76Q130 76 225 76")'}],[.15,{d:'path("M35 76Q130 76 225 76")'}],[.3,{d:'path("M35 76Q130 120 225 76")'}],[.42,{d:'path("M35 76Q130 120 225 76")'}],[.58,{d:'path("M35 76Q130 58 225 76")'}],[.7,{d:'path("M35 76Q130 82 225 76")'}],[.8,{d:'path("M35 76Q130 76 225 76")'}],[1,{d:'path("M35 76Q130 76 225 76")'}]))
  ],'양 끝이 고정된 막 중앙을 눌렀다가, 놓은 뒤 감쇠하며 되돌린다.','양 끝을 움직이지 않고 중앙만 처지게 한다.');
  define('ui-material','sand-dissolve',Array.from({length:30},(_,i)=>node('sand-cell','',`left:${70+(i%6)*20}px;top:${35+Math.floor(i/6)*16}px`)).join('')+text('sand-done','NEXT','left:90px;top:61px'),[
    track('.sand-cell',(i)=>frames([0,{transform:'translate(0,0)',opacity:1}],[.18+(i%6)*.025,{transform:'translate(0,0)',opacity:1}],[.58+(i%6)*.025,{transform:`translate(${(i%6-2.5)*9}px,${65+Math.floor(i/6)*3}px) scale(.15)`,opacity:0}],[1,{transform:'translateY(80px) scale(.15)',opacity:0}])),track('.sand-done',fade(.5,.7))
  ],'면을 작은 파티클 격자로 나누어 아래로 무너뜨리며 다음 상태를 보여준다.','입자별 시작 차와 아래 방향 낙하를 맞춘다.');
  define('ui-material','oil-slick',box('oil-card','SELECTED'),[
    track('.oil-card',frames([0,{backgroundPosition:'0% 50%',borderRadius:'24% 35% 27% 31%'}],[.35,{backgroundPosition:'100% 25%',borderRadius:'36% 23% 39% 25%'}],[.7,{backgroundPosition:'50% 75%',borderRadius:'24% 35% 27% 31%'}],[1,{backgroundPosition:'50% 75%',borderRadius:'24% 35% 27% 31%'}]))
  ],'유막풍 다색 밴드가 면을 흐르고 선택된 영역만 천천히 변형된다.','여러 가는 색 밴드를 면 안에서 움직인다.',{caution:'유막의 간섭색을 연상시키는 그라데이션. 박막 간섭의 광학 계산이 아니다.'});
  define('ui-material','magnetic-fluid',node('ferro-core')+Array.from({length:12},(_,i)=>node('ferro-spike','',`transform:rotate(${i*30}deg);--angle:${i*30}deg`)).join('')+dot('ferro-magnet','left:190px;top:71px'),[
    track('.ferro-spike',(i)=>frames([0,{transform:`rotate(${i*30}deg) scaleY(.3)`}],[.4,{transform:`rotate(${i*30}deg) scaleY(${.35+Math.max(0,Math.cos((i*30-90)*Math.PI/180))*.85})`}],[.7,{transform:`rotate(${i*30}deg) scaleY(.3)`}],[1,{transform:`rotate(${i*30}deg) scaleY(.3)`}]))
  ],'자석 쪽 돌기가 늘어나 자성유체다운 뾰족한 윤곽을 만든다.','외력 방향에 가까운 돌기일수록 길게 한다.',{caution:'자성유체 윤곽을 양식화한 도형 표현. 자기장이나 유체역학 시뮬레이션이 아니다.'});
  define('ui-material','glass-crack-recover',box('crack-glass','')+svg(path('crack-lines','M130 77L91 29M130 77L172 33M130 77L196 103M130 77L145 123M130 77L61 105M94 34L75 42M173 92L184 70','fill="none" stroke="#b5e8ee" stroke-width="1.5" pathLength="1" stroke-dasharray="1"')),[
    track('.crack-lines',frames([0,{strokeDashoffset:1,opacity:0}],[.2,{strokeDashoffset:1,opacity:1}],[.3,{strokeDashoffset:0,opacity:1}],[.58,{strokeDashoffset:0,opacity:1}],[.8,{strokeDashoffset:1,opacity:0}],[1,{strokeDashoffset:1,opacity:0}]))
  ],'중심에서 균열선이 퍼지고, 역순으로 수렴해 면이 복원된다.','파손은 바깥 방향, 복구는 안쪽 방향의 선 드로잉.');
  define('ui-material','neon-tube-draw',svg(path('neon-tube','M38 100V50L70 100V50M90 100V50H118M90 75H114M90 100H120M155 50A17 25 0 1 1 155 100A17 25 0 1 1 155 50M190 100V50L222 100V50','fill="none" stroke="#94fff0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1"')),[track('.neon-tube',draw(.08,.62))],
    '휘어진 네온 관 경로를 따라 빛이 나아가 글자를 다 그린다.','선 시작점부터 끝점까지의 드로잉과 그려진 구간의 발광.');
  define('ui-material','chrome-ripple',box('chrome-surface')+node('chrome-ring ring-small')+node('chrome-ring ring-large'),[
    track('.chrome-ring',(i)=>frames([0,{transform:'scale(.05)',opacity:0}],[.18+i*.12,{transform:'scale(.05)',opacity:.9}],[.64+i*.12,{transform:'scale(2)',opacity:0}],[1,{transform:'scale(2)',opacity:0}]))
  ],'크롬풍 면에 접촉점에서 동심원 반사가 퍼진다.','강약을 준 윤곽으로 수면 같은 물결을 표현한다.',{caution:'금속 반사와 물결을 합성한 CSS 표현. 환경 반사나 실제 면 변형은 계산하지 않는다.'});
  define('ui-material','clay-icon-morph',node('clay-shape'),[
    track('.clay-shape',frames([0,{borderRadius:'18%',transform:'rotate(0) scale(1)'}],[.2,{borderRadius:'18%',transform:'rotate(0) scale(.88,1.12)'}],[.42,{borderRadius:'50%',transform:'rotate(90deg) scale(1.12,.9)'}],[.57,{borderRadius:'50%',transform:'rotate(90deg) scale(1)'}],[1,{borderRadius:'50%',transform:'rotate(90deg) scale(1)'}]))
  ],'부드러운 둥근 모서리 덩어리가 한 번 납작해졌다 회전하며 구형으로 바뀐다.','형태 변화 앞뒤에 부피감을 느끼는 납작함을 둔다.');

  // Typography: actual glyph positions, masks, baselines and strokes are animated.
  define('kinetic-type','glyph-slot-roll',Array.from({length:4},(_,i)=>node('slot-window',node('slot-reel',`<span>${['M','O','V','E'][i]}</span><span>${['T','Y','P','E'][i]}</span><span>${['M','O','V','E'][i]}</span>`),`left:${58+i*36}px;top:54px`)).join(''),[
    track('.slot-reel',(i)=>frames([0,{transform:'translateY(0)'}],[.15+i*.06,{transform:'translateY(0)'}],[.48+i*.06,{transform:'translateY(-42px)'}],[1,{transform:'translateY(-42px)'}]))
  ],'창 안 문자열을 세로로 밀어 각 글자가 시간차로 다음 단어로 전환된다.','고정 창 안에서만 글자를 보내 착지 위치를 맞춘다.');
  define('kinetic-type','variable-font-pulse',text('weight-type','WEIGHT','left:25px;top:53px'),[
    track('.weight-type',frames([0,{fontWeight:200,letterSpacing:'3px'}],[.3,{fontWeight:900,letterSpacing:'-1px'}],[.6,{fontWeight:200,letterSpacing:'3px'}],[.82,{fontWeight:650,letterSpacing:'0px'}],[1,{fontWeight:650,letterSpacing:'0px'}]))
  ],'글자 굵기를 가는 글씨에서 굵은 글씨로 연속적으로 바꾸고 동시에 자간을 정돈한다.','자폭 변동을 억제하면서 스트로크 굵기를 바꾼다.',{caution:'font-weight 보간 예. 기기 폰트가 가변 웨이트를 지원하지 않으면 굵기는 단계적으로 전환.'});
  define('kinetic-type','text-path-orbit',svg('<defs><path id="mxe-orbit-text-path" d="M130 27a50 50 0 1 1 -.1 0"/></defs><circle cx="130" cy="77" r="37" fill="none" stroke="#29404a"/><text class="orbit-text stage-object web-motion-object" fill="#a1f3df" font-size="14" letter-spacing="3"><textPath href="#mxe-orbit-text-path" startOffset="0" textLength="312" lengthAdjust="spacing">TYPE ON A PATH · TYPE ON A PATH · </textPath></text>'),[
    track('.orbit-text',frames([0,{transform:'rotate(0deg)'}],[1,{transform:'rotate(360deg)'}]))
  ],'글자를 원형 경로에 따라 배치하고 그 원을 한 바퀴 돌린다.','글자 방향이 패스 접선을 따라 바뀐다.',{duration:6500,recipe:'원형 SVG 패스 → textPath로 글자 배치 → 중심을 지점으로 360° 회전',recipeEn:'Circular SVG path → place text with textPath → rotate 360° around the center'});
  define('kinetic-type','word-gravity',letters('DROP','drop-letter')+node('type-floor'),[
    track('.drop-letter',(i)=>frames([0,{transform:'translateY(-70px) rotate(-12deg)',opacity:0}],[.12+i*.035,{transform:'translateY(-70px) rotate(-12deg)',opacity:1}],[.31+i*.035,{transform:'translateY(24px) rotate(4deg)',opacity:1}],[.41+i*.035,{transform:'translateY(2px) rotate(-2deg)',opacity:1}],[.5+i*.035,{transform:'translateY(24px) rotate(0deg)',opacity:1}],[1,{transform:'translateY(24px) rotate(0deg)',opacity:1}]))
  ],'글자가 위에서 낙하하고 바닥에서 작게 튀며 기준선 위에 늘어선다.','낙하 접지 프레임에서 세로로 납작해지고 옆으로 넓어지며 곧 원래 형태로 돌아온다.');
  define('kinetic-type','character-magnetize',letters('ALIGN','magnet-letter'),[
    track('.magnet-letter',(i)=>frames([0,{transform:`translate(${[21,-15,11,-23,7][i]}px,${[-38,30,-21,36,-29][i]}px) rotate(${[-30,20,15,-15,25][i]}deg)`,opacity:.5}],[.48,{transform:'translate(0,0) rotate(0)',opacity:1}],[1,{transform:'translate(0,0) rotate(0)',opacity:1}]))
  ],'제각각의 위치와 각도에 있던 글자가 공통 기준선과 자간으로 흡착한다.','각 글자의 이동 대상을 고정하고, 마지막에 단어로 읽히는 상태를 만든다.');
  define('kinetic-type','line-break-reflow',node('reflow-frame')+['MAKE','IT','MOVE'].map((s,i)=>text(`reflow-word word-${i}`,s,`left:${[33,107,139][i]}px;top:48px`)).join(''),[
    track('.reflow-frame',frames([0,{width:'221px'}],[.12,{width:'221px'}],[.24,{width:'195px'}],[.48,{width:'143px'}],[1,{width:'143px'}])),track('.word-2',frames([0,{transform:'translate(0,0)'}],[.24,{transform:'translate(0,0)'}],[.4,{transform:'translate(-106px,36px)'}],[1,{transform:'translate(-106px,36px)'}]))
  ],'컨테이너가 좁아지면 끝 단어를 다음 행으로 옮겨 줄바꿈 전후를 이어준다.','각 단어의 이전 위치와 새 위치를 보간해 읽기 순서를 유지한다.',{caution:'고정 문장의 줄바꿈 전후를 보간하는 데모. 구현에서는 FLIP 등으로 실제 레이아웃 위치를 측정한다.'});
  define('kinetic-type','terminal-decode',text('decode-noise','7#Q_2?','left:44px;top:58px')+letters('DECODE','decode-letter'),[
    track('.decode-noise',frames([0,{opacity:1}],[.55,{opacity:0}],[1,{opacity:0}])),track('.decode-letter',(i)=>fade(.15+i*.06,.19+i*.06))
  ],'잡음 글자가 사라지고 왼쪽부터 차례로 올바른 글자가 확정된다.','이미 확정한 글자를 움직이지 않고 미확정 영역을 줄인다.');
  define('kinetic-type','counterweight-headline',node('balance-beam',text('balance-left','LIGHT')+text('balance-right','HEAVY'))+node('balance-pivot'),[
    track('.balance-beam',frames([0,{transform:'rotate(-13deg)'}],[.24,{transform:'rotate(7deg)'}],[.41,{transform:'rotate(-3deg)'}],[.56,{transform:'rotate(0deg)'}],[1,{transform:'rotate(0deg)'}]))
  ],'두 제목을 저울 양 끝에 두고, 흔들림을 줄여 수평으로 균형을 맞춘다.','중앙 지점을 기준으로 좌우 글자가 반대 방향으로 움직인다.');
  define('kinetic-type','echo-caption',[0,1,2].map(i=>text(`echo-copy echo-${i}`,'ECHO','left:74px;top:56px')).join(''),[
    track('.echo-copy',(i)=>frames([0,{transform:'translateX(-70px)',opacity:0}],[.1+(2-i)*.07,{transform:'translateX(-70px)',opacity:0}],[.36+(2-i)*.07,{transform:'translateX(0)',opacity:i===2?1:.3}],[.61,{transform:'translateX(0)',opacity:i===2?1:0}],[1,{transform:'translateX(0)',opacity:i===2?1:0}]))
  ],'자막과 같은 형태의 잔상을 시차로 따라가게 하고, 마지막에는 본문만 남긴다.','잔상을 최종 위치에서 지우고 글자를 겹쳐 두지 않는다.');
  define('kinetic-type','kinetic-kerning',letters('SPACE','kern-letter'),[
    track('.kern-letter',(i)=>frames([0,{transform:`translateX(${(i-2)*13}px)`}],[.44,{transform:'translateX(0)'}],[1,{transform:'translateX(0)'}]))
  ],'넓어진 글자 간격을 중앙을 향해 좁혀, 단어의 묶음을 만든다.','중앙 글자를 기준으로 양쪽을 대칭으로 옮긴다.');
  define('kinetic-type','vertical-type-cascade',['모','션','의','형'].map((s,i)=>node('vertical-letter',s,`left:114px;top:${12+i*32}px`)).join(''),[
    track('.vertical-letter',(i)=>frames([0,{transform:'translateY(-18px)',opacity:0}],[.12+i*.1,{transform:'translateY(-18px)',opacity:0}],[.28+i*.1,{transform:'translateY(0)',opacity:1}],[1,{transform:'translateY(0)',opacity:1}]))
  ],'세로 조합 글자를 위에서 아래 순서로 나타나게 해 일본어 읽기 순서를 움직임으로 보여준다.','위 글자가 착지하기 시작한 뒤 다음 글자를 내보낸다.');
  define('kinetic-type','baseline-wave',node('baseline-mask',letters('WAVES','wave-letter')),[
    track('.wave-letter',(i)=>frames([0,{transform:'translateY(44px)'}],[.08+i*.055,{transform:'translateY(44px)'}],[.28+i*.055,{transform:'translateY(-7px)'}],[.4+i*.055,{transform:'translateY(0)'}],[1,{transform:'translateY(0)'}]))
  ],'기선 아래 숨긴 글자를 한 글자씩 들어 올려, 물결처럼 등장시킨다.','글자의 등장 경계를 고정 마스크로 맞춘다.');
  define('kinetic-type','letter-collision',text('collision-a','A','left:66px;top:52px')+text('collision-b','B','left:146px;top:52px'),[
    track('.collision-a',frames([0,{transform:'translateX(-40px) scaleX(1)',easing:'cubic-bezier(.5,0,1,1)'}],[.28,{transform:'translateX(45px) scaleX(1)'}],[.32,{transform:'translateX(47px) scaleX(.88)'}],[.44,{transform:'translateX(36px) scaleX(1)'}],[1,{transform:'translateX(36px) scaleX(1)'}])),
    track('.collision-b',frames([0,{transform:'translateX(0) scaleX(1)'}],[.28,{transform:'translateX(0) scaleX(1)'}],[.32,{transform:'translateX(-2px) scaleX(.88)',easing:'cubic-bezier(.2,.8,.3,1)'}],[.46,{transform:'translateX(42px) scaleX(1)'}],[.57,{transform:'translateX(38px) scaleX(1)'}],[1,{transform:'translateX(38px) scaleX(1)'}]))
  ],'달려온 글자가 옆 글자에 부딪히고 받은 쪽이 밀려난다.','충돌 전에 상대를 움직이지 않고 접촉 후에 속도를 넘긴다.');
  define('kinetic-type','type-tunnel',[0,1,2,3].map(i=>text('tunnel-copy','TYPE','left:80px;top:54px')).join(''),[
    track('.tunnel-copy',(i)=>frames([0,{transform:`scale(${.25+i*.25})`,opacity:.15+i*.2}],[.55,{transform:`scale(${.7+i*.5})`,opacity:Math.max(0,.8-i*.25)}],[1,{transform:`scale(${.7+i*.5})`,opacity:Math.max(0,.8-i*.25)}]))
  ],'같은 글자를 안쪽에서 앞쪽으로 단계적으로 확대해, 글자 터널을 나아가는 감각을 만든다.','중심을 맞추고, 앞쪽 큰 글자일수록 옅게 한다.');
  define('kinetic-type','chapter-index-scrub',node('chapter-window',node('chapter-reel','<span>01</span><span>02</span><span>03</span><span>04</span>'))+node('scrub-track')+dot('scrub-thumb','left:41px;top:119px'),[
    track('.chapter-reel',frames([0,{transform:'translateY(0)'}],[.2,{transform:'translateY(-48px)'}],[.39,{transform:'translateY(-96px)'}],[.58,{transform:'translateY(-144px)'}],[1,{transform:'translateY(-144px)'}])),
    track('.scrub-thumb',frames([0,{transform:'translateX(0)'}],[.58,{transform:'translateX(165px)'}],[1,{transform:'translateX(165px)'}]))
  ],'스크럽 위치 진행에 맞춰 장 번호를 세로로 보낸다.','노브의 위치와 번호 전진량을 같은 진행률로 한다.',{caution:'자동 재생으로 스크럽 위치를 모사한 데모. 구현에서는 입력 위치를 진행률로 변환한다.'});
  define('kinetic-type','type-hinge',letters('HINGE','hinge-letter'),[
    track('.hinge-letter',(i)=>frames([0,{transform:'perspective(160px) rotateX(-90deg)',opacity:0}],[.1+i*.045,{transform:'perspective(160px) rotateX(-90deg)',opacity:0}],[.36+i*.045,{transform:'perspective(160px) rotateX(12deg)',opacity:1}],[.46+i*.045,{transform:'perspective(160px) rotateX(0deg)',opacity:1}],[1,{transform:'perspective(160px) rotateX(0deg)',opacity:1}]))
  ],'각 글자가 상단 경첩으로 일어나며, 살짝 넘어선 뒤 정면에서 멈춘다.','글자마다 같은 위쪽 끝 지점을 쓰고 읽는 순서대로 늦춘다.');
  define('kinetic-type','focus-word-explosion',text('focus-main','FOCUS','left:64px;top:55px')+['IDEA','TYPE','MOVE','LOOK'].map((s,i)=>text('focus-satellite',s,'left:105px;top:69px')).join(''),[
    track('.focus-main',frames([0,{transform:'scale(.65)',opacity:.3}],[.29,{transform:'scale(1.12)',opacity:1}],[.42,{transform:'scale(1)',opacity:1}],[1,{transform:'scale(1)',opacity:1}])),
    track('.focus-satellite',(i)=>{const v=[[-74,-45],[77,-42],[-70,43],[71,43]][i];return frames([0,{transform:'translate(0,0) scale(.4)',opacity:0}],[.21,{transform:'translate(0,0) scale(.4)',opacity:0}],[.45,{transform:`translate(${v[0]}px,${v[1]}px) scale(1)`,opacity:.6}],[.7,{transform:`translate(${v[0]*1.15}px,${v[1]*1.15}px) scale(1)`,opacity:0}],[1,{opacity:0}]);})
  ],'중심의 주목 단어가 확대되는 동시에, 주변의 작은 단어들이 바깥으로 흩어진다.','중앙 단어는 마지막에 남기고, 주변 단어를 감쇠시킨다.');
  define('kinetic-type','mono-data-shuffle',Array.from({length:6},(_,i)=>node('data-slot',node('data-reel',`<span>${i%2}</span><span>${(i+1)%2}</span><span>${i%2}</span><span>${'204826'[i]}</span>`),`left:${38+i*31}px;top:55px`)).join(''),[
    track('.data-reel',(i)=>frames([0,{transform:'translateY(0)'}],[.12+i*.035,{transform:'translateY(0)'}],[.55+i*.035,{transform:'translateY(-108px)'}],[1,{transform:'translateY(-108px)'}]))
  ],'등폭 숫자열이 자릿수별로 밀려 새 데이터로 확정된다.','자릿수 위치를 고정해 갱신해도 주변 배치를 움직이지 않는다.');
  define('kinetic-type','stroke-catchup',svg(path('hand-stroke','M35 93C55 25 49 113 67 86S82 64 87 86S103 50 110 72S117 105 133 85S149 61 154 80S176 92 182 69S184 103 218 70','fill="none" stroke="#a5f3de" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1"')),[track('.hand-stroke',draw(.12,.68))],
    '한 획의 곡선을 시작점부터 따라가며 손글씨풍 선을 다 그린다.','일정 거리마다 선이 나타나는 것으로 붓의 진행을 보여준다.');
  define('kinetic-type','headline-ribbon',node('ribbon-fold fold-left')+node('headline-ribbon','MAKE IT MOVE')+node('ribbon-fold fold-right'),[
    track('.headline-ribbon',frames([0,{transform:'scaleX(0)'}],[.36,{transform:'scaleX(1)'}],[1,{transform:'scaleX(1)'}])),
    track('.ribbon-fold',(i)=>frames([0,{transform:`perspective(200px) rotateY(${i?-100:100}deg)`,opacity:0}],[.28,{transform:`perspective(200px) rotateY(${i?-100:100}deg)`,opacity:0}],[.48,{transform:'perspective(200px) rotateY(0)',opacity:1}],[1,{transform:'perspective(200px) rotateY(0)',opacity:1}]))
  ],'제목 밴드를 중앙에서 늘리고 좌우 되넘김을 마지막에 연다.','앞면 글자 밴드와 뒷면 접힘부를 차례로 펼친다.');

  // Impact FX: one event per cycle; long readable rests avoid repeated flashing.
  const combatScene = () => node('combat-floor')+node('impact-attacker','◆')+node('impact-target','■');
  define('game-impact-fx','hit-stop',combatScene()+text('hitstop-label','CONTACT / HOLD','left:65px;top:24px'),[
    track('.impact-attacker',frames([0,{transform:'translateX(0)'}],[.12,{transform:'translateX(0)'}],[.29,{transform:'translateX(81px)'}],[.43,{transform:'translateX(81px)'}],[.6,{transform:'translateX(105px)'}],[1,{transform:'translateX(105px)'}])),
    track('.impact-target',frames([0,{transform:'translateX(0)'}],[.43,{transform:'translateX(0)'}],[.6,{transform:'translateX(36px) rotate(15deg)'}],[1,{transform:'translateX(36px) rotate(15deg)'}])),track('.hitstop-label',frames([0,{opacity:0}],[.285,{opacity:0}],[.29,{opacity:1}],[.43,{opacity:1}],[.44,{opacity:0}],[1,{opacity:0}]))
  ],'공격이 명중한 순간 양측 이동을 멈추고 짧은 정지 뒤 상대를 밀어낸다.','명중 직후의 같은 위치가 이어지는 정지 구간.',{duration:4000,reducedProgress:.75,caution:'정지 구조를 읽을 수 있게 유지 시간을 길게 한 데모. 실제 게임에서는 몇 프레임으로 조정하고, 입력 받기와 분리해 관리한다.'});
  define('game-impact-fx','shockwave-type',text('shock-type','BOOM','left:70px;top:53px')+rings(),[
    track('.shock-type',frames([0,{transform:'scale(.7)',opacity:0}],[.22,{transform:'scale(.7)',opacity:0}],[.28,{transform:'scale(1.18)',opacity:1}],[.43,{transform:'scale(1)',opacity:1}],[1,{transform:'scale(1)',opacity:1}])),track('.ring-a',pulse(.27)),track('.ring-b',pulse(.35))
  ],'글자가 착지한 순간을 시작점으로 바깥 방향의 충격파가 퍼진다.','글자의 최대 크기 직후에 파동을 퍼뜨린다.');
  define('game-impact-fx','slash-reveal',text('slash-title','SLASH','left:66px;top:54px')+node('slash-line'),[
    track('.slash-title',frames([0,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'}],[.23,{clipPath:'polygon(0 0,0 0,0 100%,0 100%)'}],[.4,{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}],[1,{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}])),
    track('.slash-line',frames([0,{transform:'translateX(-120px) rotate(-25deg)',opacity:0}],[.2,{transform:'translateX(-120px) rotate(-25deg)',opacity:0}],[.24,{transform:'translateX(-95px) rotate(-25deg)',opacity:1}],[.43,{transform:'translateX(125px) rotate(-25deg)',opacity:0}],[1,{opacity:0,transform:'translateX(125px) rotate(-25deg)'}]))
  ],'대각선 참격선이 지나간 부분부터 글자가 나타난다.','참격 통과 위치와 표시 마스크 경계를 동기화한다.');
  define('game-impact-fx','freeze-color-drain',node('freeze-world',node('freeze-player','◆')+node('freeze-orb','●')+node('freeze-block','■'))+text('freeze-label','PAUSED','left:90px;top:112px'),[
    track('.freeze-world',frames([0,{transform:'translateX(-35px)',filter:'saturate(1)'}],[.3,{transform:'translateX(0)',filter:'saturate(1)'}],[.34,{transform:'translateX(0)',filter:'saturate(0)'}],[1,{transform:'translateX(0)',filter:'saturate(0)'}])),track('.freeze-label',fade(.3,.34))
  ],'이동 중 구도를 멈추는 동시에 색을 빼 정지한 순간을 강조한다.','위치 정지와 채도 저하를 겹친다.');
  define('game-impact-fx','combo-heat',node('heat-meter',node('heat-fill'))+['1 HIT','3 HIT','6 HIT'].map((s,i)=>text(`heat-number heat-${i}`,s,'left:71px;top:47px')).join(''),[
    track('.heat-fill',frames([0,{transform:'scaleX(.167)',backgroundColor:'#64c9c1'}],[.3,{transform:'scaleX(.167)',backgroundColor:'#64c9c1'}],[.36,{transform:'scaleX(.5)',backgroundColor:'#f2bf78'}],[.6,{transform:'scaleX(.5)',backgroundColor:'#f2bf78'}],[.66,{transform:'scaleX(1)',backgroundColor:'#ff7969'}],[1,{transform:'scaleX(1)',backgroundColor:'#ff7969'}])),
    ...[[0,.3],[.3,.6],[.6,1]].map(([on,off],i)=>track(`.heat-${i}`,frames([0,{opacity:on===0?1:0,transform:'scale(1)'}],...(on>0?[[on,{opacity:0,transform:'scale(1)'}],[on+.005,{opacity:1,transform:'scale(1.25)'}],[on+.06,{opacity:1,transform:'scale(1)'}]]:[]),...(off<1?[[off,{opacity:1,transform:'scale(1)'}],[off+.005,{opacity:0,transform:'scale(1)'}]]:[]),[1,{opacity:off<1?0:1,transform:'scale(1)'}])))
  ],'콤보 수 증가에 맞춰 게이지가 늘어나고 한랭색에서 난색으로 바뀐다.','숫자의 단계와 열기의 높이를 대응시킨다.');
  define('game-impact-fx','edge-damage',node('damage-vignette')+node('hud-center','HP 24')+node('mxe-crosshair'),[
    track('.damage-vignette',frames([0,{opacity:0}],[.17,{opacity:0}],[.24,{opacity:.9}],[.36,{opacity:.28}],[.7,{opacity:0}],[1,{opacity:0}]))
  ],'화면 가장자리만 빨갛게 맥동시켜 중앙 시인성을 유지한 채 피탄을 전달한다.','가장 큰 빨간 테두리에서 천천히 감쇠시킨다.',{reducedProgress:.25});
  define('game-impact-fx','armor-crack',node('armor-plate')+svg(['M130 77L100 38','M130 77L168 44','M130 77L164 108','M130 77L106 122','M130 77L84 82'].map(d=>path('armor-line armor-main',d,'fill="none" stroke="#fac497" stroke-width="2" stroke-linecap="round" pathLength="1" stroke-dasharray="1"')).join('')+['M115 57.5L118 36','M147 92.5L172 86'].map(d=>path('armor-line armor-sub',d,'fill="none" stroke="#fac497" stroke-width="1.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1"')).join(''))+dot('armor-impact','left:124px;top:71px'),[track('.armor-main',draw(.22,.32)),track('.armor-sub',draw(.27,.36)),track('.armor-impact',pulse(.2))],
    '장갑 명중점에서 갈라져 퍼지는 균열이 한꺼번에 번진다.','균열의 모든 갈래를 하나의 충격점에 연결한다.');
  define('game-impact-fx','critical-compress',node('critical-world',node('critical-mark','✦')+node('critical-lines'))+text('critical-title','CRITICAL','left:48px;top:112px'),[
    track('.critical-world',frames([0,{transform:'scale(1)'}],[.23,{transform:'scale(.72,1.2)'}],[.3,{transform:'scale(1.15,.88)'}],[.43,{transform:'scale(1)'}],[1,{transform:'scale(1)'}])),track('.critical-title',fade(.27,.32))
  ],'화면 안의 대상을 옆으로 압축했다 넓히며 강한 명중의 순간을 만든다.','압축·반발·복원 순서로 전체를 동시에 변형시킨다.',{title:'크리티컬 화면 압축',titleEn:'Critical Screen Compression',caution:'렌즈의 실제 거동이 아니라, 화면의 비등방 스케일에 의한 임팩트 표현.'});
  define('game-impact-fx','phase-shatter',Array.from({length:6},(_,i)=>node('phase-shard',String(i+1),`left:${70+i%3*40}px;top:${37+Math.floor(i/3)*40}px`)).join('')+text('phase-next','PHASE 02','left:58px;top:61px'),[
    track('.phase-shard',(i)=>frames([0,{transform:'translate(0,0) rotate(0)',opacity:1}],[.23,{transform:'translate(0,0) rotate(0)',opacity:1}],[.57,{transform:`translate(${(i%3-1)*90}px,${(Math.floor(i/3)-.5)*140}px) rotate(${(i-2)*26}deg)`,opacity:0}],[1,{opacity:0,transform:`translate(${(i%3-1)*90}px,${(Math.floor(i/3)-.5)*140}px)`}])),track('.phase-next',fade(.46,.66))
  ],'현재 페이즈 면이 분할되어 바깥으로 흩어지고 다음 페이즈 이름이 나타난다.','파편 퇴장이 진행된 뒤 다음 라벨을 읽게 한다.');
  define('game-impact-fx','speedline-tunnel',Array.from({length:12},(_,i)=>node('speed-ray','',`--angle:${i*30}deg`)).join('')+text('speed-word','RUSH','left:78px;top:60px'),[
    track('.speed-ray',(i)=>frames([0,{transform:`rotate(${i*30}deg) translateY(-20px) scaleY(.15)`,opacity:0}],[.18,{transform:`rotate(${i*30}deg) translateY(-20px) scaleY(.15)`,opacity:.5}],[.5,{transform:`rotate(${i*30}deg) translateY(-62px) scaleY(1.5)`,opacity:.8}],[.7,{transform:`rotate(${i*30}deg) translateY(-90px) scaleY(1.7)`,opacity:0}],[1,{opacity:0}])),track('.speed-word',frames([0,{transform:'scale(.7)'}],[.5,{transform:'scale(1.15)'}],[.7,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]))
  ],'소실점 주위의 선이 바깥으로 뻗어 전진하는 속도감을 만든다.','선의 각도를 유지한 채 중심에서 멀어진다.');
  define('game-impact-fx','parry-time-slice',node('parry-blade blade-a')+node('parry-blade blade-b')+node('parry-spark','✦'),[
    track('.blade-a',frames([0,{transform:'translateX(-45px) rotate(-35deg)'}],[.28,{transform:'translateX(0) rotate(-35deg)'}],[.43,{transform:'translateX(0) rotate(-35deg)'}],[.62,{transform:'translateX(-55px) rotate(-65deg)'}],[1,{transform:'translateX(-55px) rotate(-65deg)'}])),
    track('.blade-b',frames([0,{transform:'translateX(45px) rotate(35deg)'}],[.28,{transform:'translateX(0) rotate(35deg)'}],[.43,{transform:'translateX(0) rotate(35deg)'}],[.62,{transform:'translateX(45px) rotate(65deg)'}],[1,{transform:'translateX(45px) rotate(65deg)'}])),track('.parry-spark',frames([0,{opacity:0,transform:'scale(.3)'}],[.28,{opacity:0,transform:'scale(.3)'}],[.3,{opacity:1,transform:'scale(1)'}],[.43,{opacity:1,transform:'scale(1)'}],[.59,{opacity:0,transform:'scale(1.3)'}],[1,{opacity:0}]))
  ],'교차하는 두 칼날을 접촉 시점에 멈추고, 불꽃을 남긴 채 서로 튕겨낸다.','접촉·짧은 정지·반대 방향 이탈.',{reducedProgress:.36});
  define('game-impact-fx','element-burst',node('element-core','✦')+Array.from({length:8},(_,i)=>dot('element-particle',`left:125px;top:72px;--tone:${i%2?'#ffad76':'#88deef'}`)).join(''),[
    track('.element-particle',(i)=>{const a=i*Math.PI/4;return frames([0,{transform:'translate(0,0) scale(.3)',opacity:0}],[.25,{transform:'translate(0,0) scale(.3)',opacity:0}],[.3,{transform:'translate(0,0) scale(.5)',opacity:1}],[.59,{transform:`translate(${Math.cos(a)*77}px,${Math.sin(a)*55}px) scale(1)`,opacity:0}],[1,{opacity:0}]);}),track('.element-core',frames([0,{transform:'scale(.75)'}],[.28,{transform:'scale(1.4)'}],[.42,{transform:'scale(1)'}],[1,{transform:'scale(1)'}]))
  ],'두 속성의 색을 가진 파티클이 같은 충격점에서 교대로 방사된다.','발생원과 타이밍을 공유하고 색으로 속성을 구분한다.');
  define('game-impact-fx','camera-kick',node('kick-world',node('kick-grid')+node('kick-target','TARGET'))+node('kick-hud','+  AMMO 08'),[
    track('.kick-world',frames([0,{transform:'translateY(0) rotate(0)'}],[.21,{transform:'translateY(0) rotate(0)'}],[.24,{transform:'translateY(10px) rotate(-2deg)'}],[.38,{transform:'translateY(-3px) rotate(.6deg)'}],[.51,{transform:'translateY(0) rotate(0)'}],[1,{transform:'translateY(0) rotate(0)'}]))
  ],'배경과 타깃에 한 방향의 반동을 주고 앞쪽 HUD 는 고정한다.','화면 안의 세계만 움직여 조준 정보를 안정시킨다.');
  define('game-impact-fx','afterimage-dash',[0,1,2,3].map(i=>node(`dash-body dash-${i}`,'◆')).join(''),[
    track('.dash-body',(i)=>frames([0,{transform:'translateX(0)',opacity:i===3?1:0}],[.18+(3-i)*.035,{transform:'translateX(0)',opacity:i===3?1:0}],[.35+(3-i)*.035,{transform:'translateX(142px)',opacity:i===3?1:.35}],[.61,{transform:'translateX(142px)',opacity:i===3?1:0}],[1,{transform:'translateX(142px)',opacity:i===3?1:0}]))
  ],'고속 이동하는 본체의 통과 경로를 시간차 잔상으로 나타낸다.','본체 뒤에 잔상을 두고 정지 후에는 잔상만 지운다.');
  define('game-impact-fx','victory-hold',node('victory-rule')+text('victory-word','VICTORY','left:43px;top:55px'),[
    track('.victory-word',frames([0,{transform:'scale(1.8)',opacity:0}],[.2,{transform:'scale(1.8)',opacity:0}],[.29,{transform:'scale(.94)',opacity:1}],[.39,{transform:'scale(1)',opacity:1}],[1,{transform:'scale(1)',opacity:1}])),track('.victory-rule',frames([0,{transform:'scaleX(0)'}],[.29,{transform:'scaleX(0)'}],[.45,{transform:'scaleX(1)'}],[1,{transform:'scaleX(1)'}]))
  ],'승리 타이틀을 한 번 강하게 착지시키고, 긴 정지로 결과를 읽게 한다.','착지의 짧음과 그 뒤 정지의 길이를 대비시킨다.',{duration:5200});
  define('game-impact-fx','loot-beam',node('loot-floor')+node('loot-beam')+node('loot-object','◆'),[
    track('.loot-beam',frames([0,{transform:'scaleY(0)',opacity:0}],[.25,{transform:'scaleY(0)',opacity:0}],[.48,{transform:'scaleY(1)',opacity:.8}],[.62,{transform:'scaleY(1)',opacity:.55}],[1,{transform:'scaleY(1)',opacity:.55}])),track('.loot-object',frames([0,{transform:'translateY(0)',opacity:0}],[.2,{transform:'translateY(0)',opacity:0}],[.47,{transform:'translateY(-14px)',opacity:1}],[.65,{transform:'translateY(-10px)',opacity:1}],[1,{transform:'translateY(-10px)',opacity:1}]))
  ],'바닥의 획득물에서 위로 빛기둥을 세워 드롭 위치를 멀리서도 알린다.','빛기둥 뿌리를 획득물 위치에 고정한다.');
  define('game-impact-fx','warning-stripe',node('warning-strip strip-top')+node('warning-strip strip-bottom')+text('warning-word','WARNING','left:45px;top:60px'),[
    track('.strip-top',frames([0,{transform:'translateX(-260px)'}],[.31,{transform:'translateX(0)'}],[1,{transform:'translateX(0)'}])),track('.strip-bottom',frames([0,{transform:'translateX(260px)'}],[.31,{transform:'translateX(0)'}],[1,{transform:'translateX(0)'}])),track('.warning-word',fade(.3,.38))
  ],'상하 경고 밴드를 좌우 반대 방향에서 넣어 중앙 문구를 감싼다.','밴드가 착지한 뒤 경고 문구를 낸다.');
  define('game-impact-fx','shield-recharge',svg('<circle cx="130" cy="77" r="48" fill="none" stroke="#29384b" stroke-width="7"/>'+`<circle class="shield-arc stage-object web-motion-object" cx="130" cy="77" r="48" fill="none" stroke="#84e7ea" stroke-width="7" pathLength="1" stroke-dasharray="1" transform="rotate(-90 130 77)"/>`)+node('shield-symbol','◇'),[
    track('.shield-arc',draw(.1,.67)),track('.shield-symbol',frames([0,{opacity:.35}],[.67,{opacity:.35}],[.73,{opacity:1}],[1,{opacity:1}]))
  ],'원주를 한 바퀴 도는 채움 스윕이 끝나면, 중앙 방어가 활성화된다.','원 완성과 방어 점등을 같은 상태로 연결한다.');
  define('game-impact-fx','mission-stamp',box('mission-sheet','MISSION 07')+node('mission-stamp','CLEARED'),[
    track('.mission-stamp',frames([0,{transform:'scale(2) rotate(-12deg)',opacity:0}],[.23,{transform:'scale(2) rotate(-12deg)',opacity:0}],[.32,{transform:'scale(.93) rotate(-8deg)',opacity:1}],[.41,{transform:'scale(1) rotate(-8deg)',opacity:1}],[1,{transform:'scale(1) rotate(-8deg)',opacity:1}]))
  ],'미션 면 위로 완료 표시가 앞쪽에서 눌려 들어오고, 인쇄 자국이 남는다.','표식 축소를 착지에서 멈추고, 결과를 지우지 않고 남긴다.');
  define('game-impact-fx','finisher-cut',node('finisher-slice slice-top','FINISH')+node('finisher-slice slice-bottom','FINISH')+node('finisher-cutline'),[
    track('.slice-top',frames([0,{transform:'translateX(-180px)'}],[.32,{transform:'translateX(0)'}],[1,{transform:'translateX(0)'}])),track('.slice-bottom',frames([0,{transform:'translateX(180px)'}],[.32,{transform:'translateX(0)'}],[1,{transform:'translateX(0)'}])),track('.finisher-cutline',frames([0,{transform:'scaleX(0)',opacity:0}],[.32,{transform:'scaleX(0)',opacity:1}],[.41,{transform:'scaleX(1)',opacity:1}],[.57,{transform:'scaleX(1)',opacity:0}],[1,{opacity:0}]))
  ],'상하로 갈라진 결착 타이틀이 반대 방향에서 합류하고, 경계를 참격선이 지난다.','분할한 글자의 상하를 동시에 정위치로 정렬한다.');

  // Data stories: geometry communicates sample values, not arbitrary decoration.
  define('data-story','sankey-flow',svg('<rect x="28" y="42" width="10" height="70" fill="#88e7d2"/><rect x="222" y="25" width="10" height="42" fill="#88e7d2"/><rect x="222" y="97" width="10" height="28" fill="#b3a4f7"/>'+path('sankey-upper','M38 63C125 63 133 46 222 46','fill="none" stroke="#88e7d2" stroke-opacity=".5" stroke-width="42" pathLength="1" stroke-dasharray="1"')+path('sankey-lower','M38 98C125 98 133 111 222 111','fill="none" stroke="#b3a4f7" stroke-opacity=".5" stroke-width="28" pathLength="1" stroke-dasharray="1"')+'<g fill="#d7e6ec" font-size="10" font-family="monospace"><text x="18" y="31">100</text><text x="218" y="17">60</text><text x="218" y="140">40</text></g>'),[
    track('.sankey-upper',draw(.1,.57)),track('.sankey-lower',draw(.17,.64))
  ],'합계 100의 흐름을 두께 60:40으로 두 목적지로 분기시킨다.','흐름의 밴드 폭과 숫자를 일치시켜 입구와 출구 합계를 유지한다.');
  define('data-story','odometer-cascade',Array.from({length:3},(_,i)=>node('metric-window',node('metric-reel',Array.from({length:[2,3,9][i]},(_,n)=>`<span>${n}</span>`).join('')),`left:${57+i*40}px;top:46px`)).join('')+text('metric-unit','K','left:181px;top:52px'),[
    track('.metric-reel',(i)=>frames([0,{transform:'translateY(0)'}],[.1+i*.06,{transform:'translateY(0)'}],[.52+i*.06,{transform:`translateY(${-48*[1,2,8][i]}px)`}],[1,{transform:`translateY(${-48*[1,2,8][i]}px)`}]))
  ],'지표의 각 자릿수를 세로로 굴리고 128K에서 순서대로 멈춘다.','자릿수 위치를 고정하고 아랫자리일수록 오래 돈다.');
  define('data-story','threshold-wave',axis+svg('<path d="M31 60H232" fill="none" stroke="#efb179" stroke-dasharray="4 4"/>'+path('threshold-line','M32 107L66 97L100 88L134 67L168 48L203 39L230 29','fill="none" stroke="#8bdfd5" stroke-width="3" pathLength="1" stroke-dasharray="1"'))+node('threshold-ring')+text('threshold-label','LIMIT','left:37px;top:37px'),[
    track('.threshold-line',draw(.08,.65)),track('.threshold-ring',pulse(.4))
  ],'상승하는 값이 임계선을 넘는 교점에서 파동을 내어 경고한다.','선 전체가 아니라 임계값을 통과한 지점을 강조한다.');
  define('data-story','confidence-fog',axis+svg('<path d="M32 103L71 88L109 93L138 76" fill="none" stroke="#91e6d8" stroke-width="3"/>'+path('confidence-band','M138 76L180 34L225 20L225 105L180 88Z','fill="#8ab4f5" fill-opacity=".2"')+path('forecast-line','M138 76L180 61L225 50','fill="none" stroke="#a9c5fa" stroke-width="2" stroke-dasharray="4 4"'))+text('forecast-label','FORECAST','left:160px;top:119px'),[
    track('.confidence-band',frames([0,{clipPath:'inset(0 100% 0 0)',opacity:0}],[.2,{clipPath:'inset(0 100% 0 0)',opacity:0}],[.6,{clipPath:'inset(0 0% 0 0)',opacity:1}],[1,{clipPath:'inset(0 0% 0 0)',opacity:1}])),track('.forecast-line',fade(.25,.55))
  ],'실측선 앞에 예측선과 폭 있는 불확실성 밴드를 표시한다.','미래일수록 밴드를 넓게 하고 실측은 실선·예측은 점선으로 구분한다.');
  define('data-story','signal-pulse-map',svg('<path d="M26 57L71 25L113 47L163 22L227 57L218 102L164 130L118 116L59 132L30 98Z" fill="#102029" stroke="#294551"/><path d="M76 47L167 90L200 50" fill="none" stroke="#35515c"/>')+[[76,47],[167,90],[200,50]].map(([x,y])=>dot('signal-point',`left:${x-4}px;top:${y-4}px`)+node('signal-ring','',`left:${x-15}px;top:${y-15}px`)).join(''),[
    track('.signal-ring',(i)=>pulse(.12+i*.15))
  ],'지도 위 관측점이 시차를 두고 발신해, 데이터가 도착하는 위치를 나타낸다.','지리적 위치를 고정해 그 자리에서 파동을 퍼뜨린다.',{reducedProgress:.43});
  define('data-story','delta-split',text('delta-a','40','left:53px;top:48px')+text('delta-b','64','left:160px;top:48px')+node('delta-bar-a')+node('delta-bar-b')+text('delta-label','+24','left:109px;top:15px'),[
    track('.delta-bar-a',frames([0,{transform:'scaleY(0)'}],[.42,{transform:'scaleY(1)'}],[1,{transform:'scaleY(1)'}])),track('.delta-bar-b',frames([0,{transform:'scaleY(0)'}],[.57,{transform:'scaleY(1)'}],[1,{transform:'scaleY(1)'}])),track('.delta-label',fade(.55,.65))
  ],'두 값을 공통 기준선에서 뻗어 나오게 하고, 차이 24를 나중에 표시한다.','40과 64의 높이 비율을 유지하며 비교.');
  define('data-story','timeline-trail',svg('<path d="M30 93L78 83L121 101L162 49L220 34" fill="none" stroke="#233846" stroke-width="2"/>'+path('timeline-drawn','M30 93L78 83L121 101L162 49L220 34','fill="none" stroke="#8ae9d8" stroke-width="3" pathLength="1" stroke-dasharray="1"'))+dot('timeline-head','left:25px;top:88px'),[
    track('.timeline-drawn',draw(.1,.68)),track('.timeline-head',frames([0,{transform:'translate(0,0)'}],[.1,{transform:'translate(0,0)'}],[.24,{transform:'translate(48px,-10px)'}],[.37,{transform:'translate(91px,8px)'}],[.52,{transform:'translate(132px,-44px)'}],[.68,{transform:'translate(190px,-59px)'}],[1,{transform:'translate(190px,-59px)'}]))
  ],'시간 위치를 나타내는 점이 꺾은선을 따라가고 지나간 구간을 남긴다.','현재점과 읽은 구간의 끝점을 같은 위치로 한다.');
  define('data-story','topology-bloom',svg(path('topology-links','M130 77L57 42M130 77L207 39M130 77L202 120M130 77L55 118','fill="none" stroke="#6e9d9c" stroke-width="1.5" pathLength="1" stroke-dasharray="1"'))+node('topology-hub','A')+['B','C','D','E'].map((s,i)=>node('topology-node',s,`left:${[45,195,190,43][i]}px;top:${[30,27,108,106][i]}px`)).join(''),[
    track('.topology-links',draw(.15,.4)),track('.topology-node',(i)=>fade(.3+i*.055,.42+i*.055))
  ],'중심 노드에서 연결선을 뻗어, 각 끝점에 연결 대상 노드를 표시한다.','선 도달 후 노드를 꺼내 관계에서 정보로 시선을 이끈다.');
  define('data-story','milestone-firefly',node('milestone-track')+node('milestone-fill')+[0,1,2,3].map(i=>dot('milestone-dot',`left:${35+i*61}px;top:71px`)).join('')+dot('milestone-firefly','left:33px;top:69px')+text('milestone-value','75%','left:97px;top:101px'),[
    track('.milestone-fill',frames([0,{transform:'scaleX(0)'}],[.62,{transform:'scaleX(.75)'}],[1,{transform:'scaleX(.75)'}])),track('.milestone-firefly',frames([0,{transform:'translateX(0)'}],[.62,{transform:'translateX(137px)'}],[1,{transform:'translateX(137px)'}])),track('.milestone-value',fade(.6,.7))
  ],'빛점이 진행 바 끝을 따라 나아가 75% 지점에서 멈춘다.','이동하는 빛점과 실제 바의 끝단을 일치시킨다.');
  define('data-story','heatmap-ripple',Array.from({length:35},(_,i)=>node('heatmap-cell','',`left:${36+i%7*27}px;top:${21+Math.floor(i/7)*24}px;--heat:${[.18,.4,.72,.9,.65,.32,.2][i%7]}`)).join(''),[
    track('.heatmap-cell',(i)=>{const d=Math.abs(i%7-3)+Math.abs(Math.floor(i/7)-2);return frames([0,{transform:'scale(1)',outlineColor:'transparent'}],[.12+d*.045,{transform:'scale(1)',outlineColor:'transparent'}],[.2+d*.045,{transform:'scale(1.15)',outlineColor:'#b1fff0'}],[.34+d*.045,{transform:'scale(1)',outlineColor:'transparent'}],[1,{transform:'scale(1)',outlineColor:'transparent'}]);})
  ],'주목 셀을 중심으로 주위로 하이라이트가 전파되고 원래 진한 정도로 돌아온다.','데이터의 색을 바꾸지 않고 윤곽과 크기로 주목 영역을 나타낸다.');
  define('data-story','stream-breathe',svg(path('stream-one','M25 77Q77 27 130 53Q182 80 235 64L235 77Q182 65 130 77Q77 89 25 77Z','fill="#76bbae" fill-opacity=".8"')+path('stream-two','M25 77Q77 89 130 77Q182 65 235 77L235 96Q182 120 130 107Q77 125 25 77Z','fill="#8d8fc3" fill-opacity=".8"')),[
    track('.stream-one',frames([0,{d:'path("M25 77Q77 27 130 53Q182 80 235 64L235 77Q182 65 130 77Q77 89 25 77Z")'}],[.4,{d:'path("M25 77Q77 30 130 45Q182 65 235 50L235 77Q182 95 130 77Q77 64 25 77Z")'}],[.75,{d:'path("M25 77Q77 27 130 53Q182 80 235 64L235 77Q182 65 130 77Q77 89 25 77Z")'}],[1,{d:'path("M25 77Q77 27 130 53Q182 80 235 64L235 77Q182 65 130 77Q77 89 25 77Z")'}])),
    track('.stream-two',frames([0,{d:'path("M25 77Q77 89 130 77Q182 65 235 77L235 96Q182 120 130 107Q77 125 25 77Z")'}],[.4,{d:'path("M25 77Q77 64 130 77Q182 95 235 77L235 108Q182 130 130 112Q77 98 25 77Z")'}],[.75,{d:'path("M25 77Q77 89 130 77Q182 65 235 77L235 96Q182 120 130 107Q77 125 25 77Z")'}],[1,{d:'path("M25 77Q77 89 130 77Q182 65 235 77L235 96Q182 120 130 107Q77 125 25 77Z")'}]))
  ],'두 흐름 밴드가 공유 경계 근처에서 폭을 바꾸며 구성 변화를 나타낸다.','밴드로서 연속된 형태를 유지하고, 막대 그래프로 대체하지 않는다.',{caution:'밴드 형태 변화를 설명하는 가상 데이터. 구현 시 공유 경계를 재계산하고, 누적 면적을 실값에 대응시킨다.'});
  define('data-story','rank-ladder',['A · 82','B · 76','C · 90'].map((s,i)=>box(`rank-row rank-${i}`,s,`top:${27+i*36}px`)).join(''),[
    track('.rank-2',frames([0,{transform:'translate(0,0)',borderColor:'#344653'}],[.22,{transform:'translate(13px,0)',borderColor:'#91efd3'}],[.5,{transform:'translate(13px,-72px)',borderColor:'#91efd3'}],[.63,{transform:'translate(0,-72px)',borderColor:'#91efd3'}],[1,{transform:'translate(0,-72px)',borderColor:'#91efd3'}])),
    track('.rank-0',frames([0,{transform:'translateY(0)'}],[.22,{transform:'translateY(0)'}],[.5,{transform:'translateY(36px)'}],[1,{transform:'translateY(36px)'}])),track('.rank-1',frames([0,{transform:'translateY(0)'}],[.22,{transform:'translateY(0)'}],[.5,{transform:'translateY(36px)'}],[1,{transform:'translateY(36px)'}]))
  ],'90점으로 갱신한 항목 C를 1위로 옮기고, 기존 1위와 2위를 한 칸씩 내림.','추월하는 항목을 옆으로 살짝 피하게 하여 순위 변화를 놓치지 않게 한다.');
  define('data-story','cluster-merge',Array.from({length:12},(_,i)=>dot('cluster-dot',`left:${i<6?49+i%3*17:165+i%3*17}px;top:${46+Math.floor(i%6/3)*29}px;--tone:${i<6?'#8be6d4':'#b6a7f4'}`)).join('')+text('cluster-label','12 ITEMS','left:102px;top:100px'),[
    track('.cluster-dot',(i)=>{const t=`translate(${i<6?34:-31}px,${i%6<3?6:-6}px)`;return frames([0,{transform:'translate(0,0)'}],[.14,{transform:'translate(0,0)'}],[.52,{transform:t}],[1,{transform:t}]);}),track('.cluster-label',fade(.5,.64))
  ],'두 점군을 중앙으로 옮기고, 색과 점 수를 유지한 채 한 무리로 모은다.','합류해도 원래 소속과 총수를 알 수 있는 색을 남긴다.');
  define('data-story','event-domino',['IN','RUN','SAVE','OUT'].map((s,i)=>box('event-card',s,`left:${27+i*55}px;top:50px`)).join(''),[
    track('.event-card',(i)=>frames([0,{transform:'perspective(180px) rotateY(-72deg)',opacity:.25}],[.13+i*.12,{transform:'perspective(180px) rotateY(-72deg)',opacity:.25}],[.26+i*.12,{transform:'perspective(180px) rotateY(8deg)',opacity:1}],[.34+i*.12,{transform:'perspective(180px) rotateY(0deg)',opacity:1}],[1,{transform:'perspective(180px) rotateY(0deg)',opacity:1}]))
  ],'처리 이벤트 카드가 왼쪽부터 차례로 일어서며, 연쇄된 인과를 나타낸다.','앞 단계가 확정된 뒤 다음 단계를 시작하는 시차.');
  define('data-story','kpi-relay',['72','128','96'].map((s,i)=>box(`kpi-box kpi-${i}`,`<small>${['VIEW','CLICK','SAVE'][i]}</small>${s}`,`left:${27+i*70}px;top:47px`)).join(''),[
    track('.kpi-box',(i)=>frames([0,{borderColor:'#263b49',backgroundColor:'#101a24'}],[.1+i*.2,{borderColor:'#263b49',backgroundColor:'#101a24'}],[.18+i*.2,{borderColor:'#9ef3dc',backgroundColor:'#24473f'}],[.31+i*.2,{borderColor:'#9ef3dc',backgroundColor:'#24473f'}],[.39+i*.2,{borderColor:'#263b49',backgroundColor:'#101a24'}],[1,{borderColor:'#263b49',backgroundColor:'#101a24'}]))
  ],'세 지표를 왼쪽부터 순서대로 밝히고, 값을 움직이지 않은 채 주목 대상만 넘겨준다.','스포트라이트 이동과 지표 위치를 분리한다.',{reducedProgress:.5});
  define('data-story','budget-bloom',svg('<circle cx="130" cy="77" r="45" fill="none" stroke="#1e303b" stroke-width="18"/>'+`<circle class="budget-a stage-object web-motion-object" cx="130" cy="77" r="45" fill="none" stroke="#8be4d2" stroke-width="18" pathLength="100" stroke-dasharray="50 100" transform="rotate(-90 130 77)"/><circle class="budget-b stage-object web-motion-object" cx="130" cy="77" r="45" fill="none" stroke="#aaa1ed" stroke-width="18" pathLength="100" stroke-dasharray="30 100" transform="rotate(90 130 77)"/><circle class="budget-c stage-object web-motion-object" cx="130" cy="77" r="45" fill="none" stroke="#e9b680" stroke-width="18" pathLength="100" stroke-dasharray="20 100" transform="rotate(198 130 77)"/>`)+text('budget-total','100','left:104px;top:61px'),[
    track('.budget-a',frames([0,{strokeDasharray:'0 100'}],[.4,{strokeDasharray:'50 100'}],[1,{strokeDasharray:'50 100'}])),track('.budget-b',frames([0,{strokeDasharray:'0 100'}],[.2,{strokeDasharray:'0 100'}],[.52,{strokeDasharray:'30 100'}],[1,{strokeDasharray:'30 100'}])),track('.budget-c',frames([0,{strokeDasharray:'0 100'}],[.38,{strokeDasharray:'0 100'}],[.62,{strokeDasharray:'20 100'}],[1,{strokeDasharray:'20 100'}]))
  ],'예산을 50·30·20 세 원호로 나누고, 전체 100까지 순서대로 채운다.','원호 길이로 비율을 나타내고, 합계를 한 바퀴에 일치시킨다.');
  define('data-story','calendar-density',Array.from({length:28},(_,i)=>node('calendar-cell',String(i+1),`left:${37+i%7*27}px;top:${24+Math.floor(i/7)*27}px;--density:${[.08,.3,.6,.16,.8,.45,.1][i%7]}`)).join(''),[
    track('.calendar-cell',(i)=>frames([0,{opacity:.18,transform:'translateY(5px)'}],[.1+Math.floor(i/7)*.12,{opacity:.18,transform:'translateY(5px)'}],[.24+Math.floor(i/7)*.12,{opacity:1,transform:'translateY(0)'}],[1,{opacity:1,transform:'translateY(0)'}]))
  ],'일별 건수를 배경의 진한 정도로 보여주고 주 단위로 캘린더를 공개한다.','주 단위로 전개하며 날짜 배치를 유지한다.');
  define('data-story','queue-compress',['01','02','03','04'].map((s,i)=>box(`queue-item queue-${i}`,s,`left:${31+i*52}px;top:56px`)).join('')+text('queue-label','PROCESS → DONE','left:70px;top:112px'),[
    track('.queue-0',frames([0,{transform:'translateY(0)',opacity:1}],[.2,{transform:'translateY(0)',opacity:1}],[.38,{transform:'translateY(-40px)',opacity:0}],[1,{transform:'translateY(-40px)',opacity:0}])),
    ...[1,2,3].map(i=>track(`.queue-${i}`,frames([0,{transform:'translateX(0)'}],[.33,{transform:'translateX(0)'}],[.57,{transform:'translateX(-52px)'}],[1,{transform:'translateX(-52px)'}])))
  ],'처리된 맨 앞 항목이 빠지고, 남은 큐가 한 칸씩 앞으로 좁혀진다.','퇴장이 끝난 후 옆 항목을 이동시킨다.');
  define('data-story','sentiment-spectrum',node('sentiment-track')+node('sentiment-pointer','▲')+text('sentiment-low','−','left:36px;top:99px')+text('sentiment-high','＋','left:207px;top:99px')+text('sentiment-value','+0.6','left:102px;top:22px'),[
    track('.sentiment-pointer',frames([0,{transform:'translateX(0)'}],[.2,{transform:'translateX(-47px)'}],[.57,{transform:'translateX(56px)'}],[1,{transform:'translateX(56px)'}])),track('.sentiment-value',fade(.56,.66))
  ],'음수에서 양수의 연속 척도 위를 지표가 이동해 +0.6 위치에서 멈춘다.','연속 값을 색뿐 아니라 위치와 부호로도 표시한다.');
  define('data-story','goal-projection',axis+svg('<path d="M32 109L68 99L103 80L137 69" fill="none" stroke="#8de6d4" stroke-width="3"/>'+path('goal-projected','M137 69Q180 58 222 27','fill="none" stroke="#b6a7f4" stroke-width="2" stroke-dasharray="5 4"')+'<circle cx="222" cy="27" r="6" fill="#0b151e" stroke="#e6bd81" stroke-width="2"/>')+text('goal-label','GOAL','left:192px;top:9px'),[
    track('.goal-projected',frames([0,{clipPath:'inset(0 100% 0 0)'}],[.18,{clipPath:'inset(0 100% 0 0)'}],[.6,{clipPath:'inset(0 0 0 0)'}],[1,{clipPath:'inset(0 0 0 0)'}]))
  ],'실적 꺾은선에서 목표점까지 파선 예측 궤도를 뻗는다.','실적과 예측의 경계를 명확히 하고, 목표는 고정한다.');
})();
