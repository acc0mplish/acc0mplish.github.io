// Source swatches are references, not an instruction to use saturated color as a page background.
const specs=[
 ['paper','Paper','Paper · Navy Ink · Blue Accent','#f3f1ec','#f3f1ec','#f8f6f2','#101722','#172132','#1d2b40','#9a8e78','#bcb09b'],
 ['ink','Ink','Ink · Graphite · Blue Accent','#121211','#eae9e6','#f3f2ef','#121211','#20201f','#2b2b29','#353534','#cfcdc7'],
 ['analysis','Analysis','Analysis · Violet','#7c5cf2','#f0edfc','#f7f5ff','#151226','#211b36','#2c2445','#7c5cf2','#b6a2ff'],
 ['electronics','Electronics','Electronics · Electric Blue','#2f68eb','#edf2ff','#f5f8ff','#101a2c','#182641','#22334f','#2f68eb','#9ebaff'],
 ['compute','Compute','Compute · Powder Blue','#8ab8ea','#edf3fa','#f5f8fc','#111b29','#1b293b','#26354a','#8ab8ea','#a9cdf4'],
 ['integrations','Integrations','Integrations · Copper','#c2884e','#f7efe7','#fcf7f1','#21180f','#30251b','#3d3023','#c2884e','#dfb080'],
 ['console','Console','Console · Signal Red','#e5484d','#faeeee','#fff6f6','#241316','#351e23','#44292f','#e5484d','#ffa4a8'],
 ['workspace','Workspace','Workspace · Lavender','#9b8fc4','#f2eff9','#f8f6fc','#1a1725','#272236','#332d43','#9b8fc4','#c2b8e0'],
 ['spatial','Spatial','Spatial · Golden Yellow','#f2be1e','#faf4df','#fff9e9','#211b0f','#302819','#3f3421','#f2be1e','#f5cf67']
];
const descriptions={paper:'따뜻한 종이 바탕에 네이비 텍스트와 선명한 블루를 더한 추천 테마입니다.',ink:'그래파이트 중립색과 블루로 콘텐츠의 대비를 또렷하게 만듭니다.',analysis:'바이올렛 보조색으로 분석 결과와 데이터 분류를 구분합니다.',electronics:'일렉트릭 블루를 중심으로 기술 제품의 선명한 인상을 만듭니다.',compute:'파우더 블루의 차분한 표면으로 데이터와 작업에 집중합니다.',integrations:'코퍼 보조색으로 연결된 서비스와 카테고리에 온기를 더합니다.',console:'시그널 레드를 보조 분류색으로 사용한 또렷한 운영 화면입니다.',workspace:'라벤더의 부드러운 표면으로 협업과 일상 업무를 담습니다.',spatial:'골드 옐로를 보조색으로 사용해 핵심 데이터에 시선을 모읍니다.'};
const chartCompanions={compute:'#6e93bb',workspace:'#9388ba',spatial:'#ae8916'};
const luminance=hex=>{const c=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
const onColor=hex=>{const l=luminance(hex);return (l+.05)/(.05+luminance('#132c46'))>=4.5?'#132c46':(l+.05)/(.05+luminance('#121211'))>=4.5?'#121211':1.05/(l+.05)>=4.5?'#ffffff':'#000000';};
const freeze=value=>{Object.values(value).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(value);};
export const DEFAULT_COLOR_THEME_ID='klic';
const klicTheme={id:'klic',name:'KLIC Original',label:'Original · White · Navy · Blue',description:'기존 KLIC의 화이트·네이비·블루 배색을 그대로 유지하는 기본 테마입니다.',source:{name:'KLIC Blue',hex:'#245fc2'},light:{surface:'#fbfcfe',panel:'#ffffff',soft:'#f5f7fb',text:'#132c46',muted:'#52657b',line:'#dfe5ee','control-border':'#7e8fa7',selected:'#eaf0fb',secondary:'#2641b9','on-secondary':'#ffffff','secondary-surface':'#eaf0fb'},dark:{surface:'#101722',panel:'#172132',soft:'#1d2b40',text:'#e8eef8',muted:'#a8b6cc',line:'#31425c','control-border':'#7185a1',selected:'#20365c',secondary:'#a9b8ff','on-secondary':'#132c46','secondary-surface':'#20365c'},series:{light:['#245fc2','#5b82cc','#163e80','#5478a8','#496388','#687c99'],dark:['#91b6ff','#afcbff','#719def','#c0d5ff','#7a9bc9','#b6c1d2']}};
export const COLOR_THEMES=freeze([klicTheme,...specs.map(([id,name,label,source,surface,soft,night,panel,nightSoft,secondary,darkSecondary])=>({id,name,label,description:descriptions[id],source:{name,hex:source},light:{surface,panel:'#ffffff',soft,text:'#132c46',muted:'#4e586b',line:'#c4c4c8','control-border':'#6c7080',selected:'#e4ecfc',secondary,'on-secondary':onColor(secondary),'secondary-surface':soft},dark:{surface:night,panel,soft:nightSoft,text:'#edf1fa',muted:'#bec6d6',line:'#536079','control-border':'#98a5ba',selected:'#2b4270',secondary:darkSecondary,'on-secondary':onColor(darkSecondary),'secondary-surface':nightSoft},series:{light:['#245fc2',chartCompanions[id]??secondary,'#163e80','#7960b7','#52657b','#b08a45'],dark:['#91b6ff',darkSecondary,'#c0d5ff','#c3acf2','#b6c1d2','#e4bd79']}}))]);
export const COLOR_THEME_IDS=Object.freeze(COLOR_THEMES.map(theme=>theme.id));
export const getColorTheme=id=>COLOR_THEMES.find(theme=>theme.id===id)??COLOR_THEMES[0];
export const colorThemePatch=id=>({colorTheme:getColorTheme(id).id,accent:'klic',neutral:'slate',chartPalette:'theme'});
export const COLOR_REFERENCE_SWATCHES=freeze([...COLOR_THEMES.map(t=>({name:t.source.name,hex:t.source.hex,role:t.id==='klic'?'brand reference':t.id==='paper'?'surface reference':t.id==='ink'?'ink reference':'secondary reference'})),...Object.entries({Vermilion:'#ff5200',Design:'#f1592a',Sensors:'#f4a27e',Pipelines:'#e2669b',Star:'#f5b700'}).map(([name,hex])=>({name,hex,role:'supporting reference'}))]);
