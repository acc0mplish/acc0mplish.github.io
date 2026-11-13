import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Layers, TrendingDown, ArrowDownRight, Sparkles, RotateCcw } from 'lucide-react';
import {ChartDataTable} from './ChartDataTable';
import {dampChartMotion,usePrefersReducedMotion} from './chart3d-motion';

export interface FunnelStepData {
  step: number;
  title: string;
  volume: string;
  count: number;
  rate: string;
  dropRate: string;
  conversion: string;
  colorHex: number;
  colorCss: string;
  emissiveHex: number;
  desc: string;
}

const FUNNEL_STEPS: FunnelStepData[] = [
  {
    step: 1,
    title: '웹사이트 유입',
    volume: '142,000 방문',
    count: 142000,
    rate: '100%',
    dropRate: '-81.8%',
    conversion: '체험 시작 18.2% 전환',
    colorHex: 0x2563eb,
    colorCss: '#245FC2',
    emissiveHex: 0x1d4ed8,
    desc: '글로벌 광고 및 오가닉 검색을 통한 최상위 랜딩 트래픽',
  },
  {
    step: 2,
    title: '무료 체험 활성화',
    volume: '25,840 유저',
    count: 25840,
    rate: '18.2%',
    dropRate: '-57.9%',
    conversion: '보안 심사 42.1% 전환',
    colorHex: 0x4f8df7,
    colorCss: '#4F8DF7',
    emissiveHex: 0x2641b9,
    desc: '워크스페이스 생성 및 첫 번째 대시보드 연동 완료',
  },
  {
    step: 3,
    title: '엔터프라이즈 보안 심사',
    volume: '10,880 조직',
    count: 10880,
    rate: '7.6%',
    dropRate: '-31.5%',
    conversion: '계약 체결 68.5% 전환',
    colorHex: 0x2641b9,
    colorCss: '#2641B9',
    emissiveHex: 0x193a87,
    desc: 'SOC2 인증 확인, SSO 연동 및 법무 계약 검토',
  },
  {
    step: 4,
    title: '최종 유료 수주',
    volume: '7,450 고객사',
    count: 7450,
    rate: '5.2%',
    dropRate: '최종 달성',
    conversion: '신규 ARR ₩84.2억',
    colorHex: 0x193a87,
    colorCss: '#2641B9',
    emissiveHex: 0x142c68,
    desc: '연간 구독 계약 체결 및 전담 기술 서포트 개시',
  },
];

export function FunnelSlab3DCanvas() {
  const prefersReducedMotion=usePrefersReducedMotion();
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const activeStepRef=useRef(activeStep);
  activeStepRef.current=activeStep;

  // Three.js 인스턴스 보관
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number>(0);
  const mouseTargetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 슬래브 메시 참조 보관
  const slabMeshesRef = useRef<
    {
      group: THREE.Group;
      step: number;
      baseY: number;
      topMat: THREE.MeshBasicMaterial;
      texture: THREE.CanvasTexture;
      canvas: HTMLCanvasElement;
    }[]
  >([]);

  // 각 슬래브 상단 텍스처 생성 함수 (2048x1024 고해상도 & Mipmap 비활성화로 극상의 선명도 보장)
  const createSlabTexture = (stepItem: FunnelStepData, isSelected: boolean) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { canvas, texture: new THREE.CanvasTexture(canvas) };

    const w = canvas.width;
    const h = canvas.height;

    // 배경 클리어
    ctx.clearRect(0, 0, w, h);

    // 슬래브 상단 다크 틴트 베이스 플레이트 (고대비 순수 다크)
    ctx.save();
    ctx.fillStyle = isSelected ? 'rgba(8, 12, 20, 0.98)' : 'rgba(10, 14, 22, 0.92)';
    ctx.fillRect(30, 30, w - 60, h - 60);

    // 테두리 네온 하이라이트 (굵고 선명한 스트로크)
    ctx.strokeStyle = isSelected ? stepItem.colorCss : 'rgba(100, 116, 139, 0.6)';
    ctx.lineWidth = isSelected ? 16 : 8;
    if (isSelected) {
      ctx.shadowColor = stepItem.colorCss;
      ctx.shadowBlur = 32;
    }
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.restore();

    // 1. 상단 단계 뱃지 (고선명 대형 폰트)
    ctx.font = '800 68px "JetBrains Mono", monospace';
    ctx.fillStyle = isSelected ? '#ffffff' : stepItem.colorCss;
    ctx.fillText(`단계 0${stepItem.step} • 전환율 ${stepItem.rate}`, 80, 160);

    // 2. 슬래브 타이틀 (선명한 백색 텍스트)
    ctx.font = '800 96px "Pretendard", -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(stepItem.title, 80, 320);

    // 3. 수치 볼륨 (초대형 극선명 볼드 텍스트)
    ctx.font = '900 136px "JetBrains Mono", monospace';
    ctx.fillStyle = isSelected ? '#245FC2' : '#f8fafc';
    if (isSelected) {
      ctx.shadowColor = '#245FC2';
      ctx.shadowBlur = 24;
    }
    ctx.fillText(stepItem.volume, 80, 520);
    ctx.shadowBlur = 0;

    // 4. 하단 전환 정보 뱃지 바
    ctx.save();
    ctx.fillStyle = isSelected ? stepItem.colorCss : 'rgba(30, 41, 59, 0.85)';
    ctx.fillRect(80, 640, w - 160, 140);
    ctx.restore();

    ctx.font = '700 68px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`→ ${stepItem.conversion}`, 120, 735);

    // 5. 우측 이탈률 표시
    ctx.font = '700 60px "JetBrains Mono", monospace';
    ctx.fillStyle = isSelected ? '#ffffff' : '#52657B';
    ctx.textAlign = 'right';
    ctx.fillText(`이탈 ${stepItem.dropRate}`, w - 120, 735);
    ctx.textAlign = 'left';

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;
    texture.needsUpdate = true;

    return { canvas, texture };
  };

  // 슬래브 텍스처 업데이트
  useEffect(() => {
    slabMeshesRef.current.forEach((item) => {
      const stepItem = FUNNEL_STEPS[item.step - 1];
      const isSelected = activeStep === item.step;
      const { texture } = createSlabTexture(stepItem, isSelected);
      item.topMat.map = texture;
      item.topMat.needsUpdate = true;
    });
  }, [activeStep]);

  // Three.js 씬 구축
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 880;
    const height = container.clientHeight || 560;

    // 소프트웨어 WebGL 판별
    const gl = document.createElement('canvas').getContext('webgl2');
    let isSoftwareGl = false;
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    }

    // 1. 씬 구성
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. 카메라 설정 (아이소메트릭 사선 하향 뷰)
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(16, 18, 22);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. 렌더러 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. 조명 시스템
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(15, 24, 18);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-18, 12, -12);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4f8df7, 1.4);
    rimLight.position.set(0, -6, -18);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x11131c, 1.8);
    scene.add(ambientLight);

    // 5. 전체 모델 루트 그룹
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // 바닥 접지 메인 그림자
    const groundShadowGeo = new THREE.PlaneGeometry(36, 26);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.set(0, -3.8, 0);
    rootGroup.add(groundShadow);

    // 6. 4단계 계단식 슬래브 (Stepped Cascade Slabs)
    // 상단(단계 1: 가장 넓음)에서 하단(단계 4: 가장 좁고 밀도 높음)으로 계단식 하강
    const slabConfigs = [
      { step: 1, w: 15.0, d: 5.6, y: 3.2, z: -5.4, thickness: 0.45 },
      { step: 2, w: 12.0, d: 5.0, y: 1.0, z: -1.8, thickness: 0.45 },
      { step: 3, w: 9.2, d: 4.4, y: -1.2, z: 1.8, thickness: 0.45 },
      { step: 4, w: 6.8, d: 3.8, y: -3.2, z: 5.2, thickness: 0.5 },
    ];

    const slabsList: {
      group: THREE.Group;
      step: number;
      baseY: number;
      topMat: THREE.MeshBasicMaterial;
      texture: THREE.CanvasTexture;
      canvas: HTMLCanvasElement;
    }[] = [];

    slabConfigs.forEach((cfg) => {
      const stepItem = FUNNEL_STEPS[cfg.step - 1];
      const slabGroup = new THREE.Group();
      slabGroup.position.set(0, cfg.y, cfg.z);

      // 슬래브 외형: 둥근 모서리 입체 압출 형상 (ExtrudeGeometry)
      const r = 0.6;
      const shape = new THREE.Shape();
      shape.moveTo(-cfg.w / 2 + r, -cfg.d / 2);
      shape.lineTo(cfg.w / 2 - r, -cfg.d / 2);
      shape.quadraticCurveTo(cfg.w / 2, -cfg.d / 2, cfg.w / 2, -cfg.d / 2 + r);
      shape.lineTo(cfg.w / 2, cfg.d / 2 - r);
      shape.quadraticCurveTo(cfg.w / 2, cfg.d / 2, cfg.w / 2 - r, cfg.d / 2);
      shape.lineTo(-cfg.w / 2 + r, cfg.d / 2);
      shape.quadraticCurveTo(-cfg.w / 2, cfg.d / 2, -cfg.w / 2, cfg.d / 2 - r);
      shape.lineTo(-cfg.w / 2, -cfg.d / 2 + r);
      shape.quadraticCurveTo(-cfg.w / 2, -cfg.d / 2, -cfg.w / 2 + r, -cfg.d / 2);

      const extrudeSettings = {
        depth: cfg.thickness,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.12,
        bevelThickness: 0.12,
      };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();

      // 슬래브 몸체 물리 재질
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x11141c,
        roughness: 0.4,
        metalness: 0.3,
      });
      const bodyMesh = new THREE.Mesh(geo, bodyMat);
      bodyMesh.rotation.x = -Math.PI / 2;
      bodyMesh.castShadow = !isSoftwareGl;
      bodyMesh.receiveShadow = !isSoftwareGl;
      slabGroup.add(bodyMesh);

      // 슬래브 하단 네온 림 발광 링
      const rimGeo = new THREE.EdgesGeometry(geo);
      const rimMat = new THREE.LineBasicMaterial({
        color: stepItem.colorHex,
        linewidth: 2,
        transparent: true,
        opacity: 0.65,
      });
      const rimLines = new THREE.LineSegments(rimGeo, rimMat);
      rimLines.rotation.x = -Math.PI / 2;
      slabGroup.add(rimLines);

      // 슬래브 상단 정보 텍스처 플레인 (CanvasTexture)
      const { canvas, texture } = createSlabTexture(stepItem, cfg.step === activeStep);
      const topGeo = new THREE.PlaneGeometry(cfg.w * 0.96, cfg.d * 0.94);
      const topMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.98,
        depthWrite: false,
      });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.rotation.x = -Math.PI / 2;
      topMesh.position.y = cfg.thickness / 2 + 0.14; // 상단 표면 밀착
      topMesh.renderOrder = 10;
      slabGroup.add(topMesh);

      // 슬래브 그림자 평면
      const shadowPlaneGeo = new THREE.PlaneGeometry(cfg.w * 1.15, cfg.d * 1.15);
      const slabShadow = new THREE.Mesh(shadowPlaneGeo, shadowMat);
      slabShadow.rotation.x = -Math.PI / 2;
      slabShadow.position.y = -cfg.thickness / 2 - 0.08;
      slabGroup.add(slabShadow);

      // 클릭 및 호버 감지용 메타데이터
      bodyMesh.userData = { step: cfg.step };
      topMesh.userData = { step: cfg.step };

      rootGroup.add(slabGroup);
      slabsList.push({
        group: slabGroup,
        step: cfg.step,
        baseY: cfg.y,
        topMat,
        texture,
        canvas,
      });
    });

    slabMeshesRef.current = slabsList;

    // 7. 슬래브 간 흐름 연결 램프 (Cascading Drop Ramps)
    // 단계 1 -> 2, 2 -> 3, 3 -> 4 사이를 잇는 반투명 네온 캐스케이드 리본
    for (let i = 0; i < slabConfigs.length - 1; i++) {
      const topSlab = slabConfigs[i];
      const botSlab = slabConfigs[i + 1];
      const stepItem = FUNNEL_STEPS[i];

      const rampW = (topSlab.w + botSlab.w) * 0.38;
      const rampGeo = new THREE.PlaneGeometry(rampW, 2.8);
      const rampMat = new THREE.MeshBasicMaterial({
        color: stepItem.colorHex,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const rampMesh = new THREE.Mesh(rampGeo, rampMat);

      // 중간 지점에 경사지게 배치
      const midY = (topSlab.y + botSlab.y) / 2;
      const midZ = (topSlab.z + botSlab.z) / 2;
      rampMesh.position.set(0, midY, midZ);
      rampMesh.rotation.x = -Math.PI / 3.2;
      rootGroup.add(rampMesh);

      // 경사 램프 측면 가이드 선
      const wireMat = new THREE.LineBasicMaterial({
        color: stepItem.colorHex,
        transparent: true,
        opacity: 0.7,
      });
      const wireGeo = new THREE.EdgesGeometry(rampGeo);
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireMesh.position.copy(rampMesh.position);
      wireMesh.rotation.copy(rampMesh.rotation);
      rootGroup.add(wireMesh);
    }

    // 8. 마우스 포인터 인터랙션 (레이캐스팅 및 틸트)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouse.x = nx;
      mouse.y = ny;

      mouseTargetRotation.current = {
        x: ny * 0.12,
        y: nx * 0.18,
      };

      raycaster.setFromCamera(mouse, camera);
      const testObjects: THREE.Object3D[] = [];
      slabsList.forEach((s) => {
        s.group.traverse((child) => {
          if (child instanceof THREE.Mesh) testObjects.push(child);
        });
      });

      const intersects = raycaster.intersectObjects(testObjects, false);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.step) {
          setActiveStep(hit.userData.step);
        }
      }
    };

    const handlePointerLeave = () => {
      mouseTargetRotation.current = { x: 0, y: 0 };
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 리사이즈 옵저버
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    // 9. 실시간 렌더 루프 (선택된 슬래브의 부드러운 3D 리프트 업 애니메이션)
    const baseRotX = 0.12;
    const baseRotY = -0.38;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 부드러운 카메라 틸트 보간
      currentRotation.current.x = dampChartMotion(
        currentRotation.current.x,
        mouseTargetRotation.current.x,
        8,
        dt,
        prefersReducedMotion
      );
      currentRotation.current.y = dampChartMotion(
        currentRotation.current.y,
        mouseTargetRotation.current.y,
        8,
        dt,
        prefersReducedMotion
      );

      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.x = baseRotX + currentRotation.current.x;
        rootGroupRef.current.rotation.y = baseRotY + currentRotation.current.y;
      }

      // 각 슬래브의 선택 높이(Y) 보간 (선택된 슬래브는 입체감 있게 살짝 떠오름)
      slabsList.forEach((item) => {
        const isSelected = item.step === activeStepRef.current;
        const targetLift = isSelected ? 0.45 : 0.0;
        item.group.position.y = dampChartMotion(
          item.group.position.y,
          item.baseY + targetLift,
          10,
          dt,
          prefersReducedMotion
        );
      });

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.dispose();
      groundShadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      slabsList.forEach((s) => {
        s.topMat.dispose();
        s.texture.dispose();
      });
    };
  }, [prefersReducedMotion]);

  const currentStepData = FUNNEL_STEPS[activeStep - 1] || FUNNEL_STEPS[0];

  return (
    <div data-chart-region="chart3d-funnel-slab-cascade" data-reduced-motion={String(prefersReducedMotion)} role="region" aria-labelledby="chart3d-funnel-title" className="relative w-full rounded-[28px] bg-klic-inverse border border-[var(--klic-component-block-color-border)] text-klic-on-emphasis overflow-hidden shadow-2xl">
      {/* 1. 상단 헤더: 타이틀, 뱃지, 슬래브 단계 선택 탭 */}
      <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 id="chart3d-funnel-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-klic-on-emphasis font-sans">
              3D 계단식 슬래브 퍼넬
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 text-[11px] font-mono font-semibold border border-blue-500/40">
              KLIC · 3D 퍼널
            </span>
          </div>
          <p className="text-[11px] font-mono tracking-[0.25em] text-klic-muted uppercase mt-1">
            STEPPED SLAB CASCADE FUNNEL • 4-STAGE PIPELINE
          </p>
        </div>

        {/* 4단계 선택 퀵 탭 */}
        <div className="inline-flex items-center p-1 rounded-xl bg-klic-inverse border border-[var(--klic-component-block-color-border)] shadow-inner">
          {FUNNEL_STEPS.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              aria-pressed={activeStep===s.step}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 flex items-center gap-1.5 ${
                activeStep === s.step
                  ? 'bg-klic-inverse text-klic-on-emphasis shadow-xs border border-[var(--klic-component-block-color-border)]'
                  : 'text-klic-muted hover:text-klic-on-emphasis'
              }`}
            >
              <span>0{s.step}</span>
              <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Three.js 3D 계단식 퍼넬 뷰포트 (고선명 실시간 벡터 HUD 오버레이 탑재) */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={mountRef}
          role="img"
          aria-label={`4단계 합성 전환 퍼넬 3D 차트, 현재 ${currentStepData.title} ${currentStepData.volume}`}
          aria-describedby="chart3d-funnel-summary"
          className="w-full h-[460px] sm:h-[540px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        />

        {/* 뷰포트 내부 극선명 실시간 포커스 HUD 배지 (눈부심 및 흐림 없는 100% 선명도) */}
        <div className="absolute top-4 left-6 pointer-events-none z-10 flex flex-col gap-1.5 p-4 rounded-2xl bg-klic-inverse border border-[var(--klic-component-block-color-border)] shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold text-klic-on-emphasis shadow-xs"
              style={{ backgroundColor: currentStepData.colorCss }}
            >
              단계 0{currentStepData.step}
            </span>
            <span className="text-base font-extrabold text-klic-on-emphasis tracking-tight">
              {currentStepData.title}
            </span>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-500/50">
              전환율 {currentStepData.rate}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-klic-on-emphasis tracking-tight">
              {currentStepData.volume}
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {currentStepData.conversion}
            </span>
          </div>
          <p className="text-xs text-klic-on-emphasis font-sans mt-0.5 max-w-sm font-medium">
            {currentStepData.desc}
          </p>
        </div>
      </div>

      {/* 3. 하단 인터랙티브 전환 분석 및 메트릭 바 */}
      <div className="p-6 sm:p-8 pt-0 border-t border-[var(--klic-component-block-color-border)] mt-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {FUNNEL_STEPS.map((s) => {
            const isSelected = activeStep === s.step;
            return (
                <button
                key={s.step}
                  type="button"
                  onClick={() => setActiveStep(s.step)}
                  aria-pressed={isSelected}
                  className={`w-full text-left p-4 rounded-2xl border transition-all motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${
                  isSelected
                    ? 'bg-klic-inverse border-zinc-500 ring-2 ring-white/30 shadow-xl'
                    : 'bg-klic-inverse/80 border-[var(--klic-component-block-color-border)] hover:border-[var(--klic-component-block-color-border)] hover:bg-klic-inverse'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-klic-on-emphasis">단계 0{s.step}</span>
                  <span
                    className="font-bold px-2 py-0.5 rounded-md text-xs"
                    style={{
                      backgroundColor: `${s.colorCss}25`,
                      color: s.colorCss,
                      border: `1px solid ${s.colorCss}60`,
                    }}
                  >
                    전환율 {s.rate}
                  </span>
                </div>
                <div className="text-base font-extrabold text-klic-on-emphasis">{s.title}</div>
                <div className="text-xl font-black font-mono text-klic-on-emphasis mt-1.5 tracking-tight">
                  {s.volume}
                </div>
                <div className="mt-2.5 text-xs font-mono text-klic-on-emphasis border-t border-[var(--klic-component-block-color-border)] pt-2 flex items-center justify-between">
                  <span className="font-semibold text-blue-400">{s.conversion}</span>
                  <span className="text-klic-muted font-bold">{s.dropRate}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div id="chart3d-funnel-summary" className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-klic-muted">
          <div>단계 버튼이나 마우스 호버로 선택합니다. 값은 합성 예제입니다.</div>
          <div className="flex items-center gap-2 text-klic-on-emphasis font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <span>포커스 단계: <strong className="text-klic-on-emphasis">{currentStepData.title}</strong> ({currentStepData.volume})</span>
          </div>
        </div>
      </div>
      <ChartDataTable chartId="chart3d-funnel-slab-cascade" caption="합성 퍼넬 단계 수와 전환율" columns={['인원','단계 비율','이탈·결과']} rows={FUNNEL_STEPS.map(step=>[step.title,step.volume,step.rate,`${step.dropRate} · ${step.conversion}`])} />
    </div>
  );
}
