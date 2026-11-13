import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import {ChartDataTable} from './ChartDataTable';
import {dampChartMotion,usePrefersReducedMotion} from './chart3d-motion';

interface NeonGlass3DCanvasProps {
  onDaySelect?: (day: number, val: number) => void;
}

export function NeonGlass3DCanvas({ onDaySelect }: NeonGlass3DCanvasProps) {
  const prefersReducedMotion=usePrefersReducedMotion();
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState<number>(19); // 0-indexed -> 20일차 (262 ms)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // 30일간의 p95 레이턴시 데이터 (레퍼런스 이미지 데이터 완벽 반영)
  const latencyData = useRef<number[]>([
    410, 385, 395, 360, 335, 340, 310, 290, 298, 265,
    270, 245, 230, 215, 220, 195, 185, 170, 160, 262,
    145, 138, 125, 118, 110, 102, 95, 88, 80, 72,
  ]).current;

  // Three.js 인스턴스 참조 보관
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const glassTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const animationFrameId = useRef<number>(0);
  const mouseTargetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const groupRef = useRef<THREE.Group | null>(null);

  // 고해상도 2D 캔버스 텍스처 업데이트 함수 (글래스 패널 내부의 실시간 네온 커브 & 그리드 렌더링)
  const updateGlassTexture = useCallback((selectedIdx: number) => {
    let canvas = textureCanvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      textureCanvasRef.current = canvas;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. 투명 캔버스 초기화 및 어두운 반투명 글래스 배경
    ctx.clearRect(0, 0, w, h);

    // 내부 글래스 슬래브 미세 라운드 림
    const padX = 140;
    const padTop = 110;
    const padBottom = 200;
    const graphW = w - padX * 2;
    const graphH = h - padTop - padBottom;

    // 반투명 다크 틴트 글래스 베이스 셰이딩 & 미세 테두리
    ctx.save();
    ctx.fillStyle = 'rgba(8, 12, 18, 0.72)';
    ctx.fillRect(padX - 20, padTop - 20, graphW + 40, graphH + 80);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(padX - 20, padTop - 20, graphW + 40, graphH + 80);
    ctx.restore();

    // 2. Y축 눈금 및 수평 점선 격자 (450, 350, 250, 150)
    const yLevels = [
      { val: 450, yNorm: 0.85 },
      { val: 350, yNorm: 0.62 },
      { val: 250, yNorm: 0.38 },
      { val: 150, yNorm: 0.15 },
    ];

    ctx.font = '600 34px "JetBrains Mono", monospace';
    ctx.fillStyle = '#52657B';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    yLevels.forEach((level) => {
      const yPos = padTop + graphH * (1 - level.yNorm);

      // 점선 격자선
      ctx.beginPath();
      ctx.setLineDash([12, 14]);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.38)';
      ctx.lineWidth = 2.5;
      ctx.moveTo(padX + 10, yPos);
      ctx.lineTo(padX + graphW - 10, yPos);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y축 라벨
      ctx.fillText(String(level.val), padX - 35, yPos);
    });

    // 3. X축 날짜 눈금 레이블 (150 day 1, day 15, day 30)
    ctx.font = '600 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#52657B';
    ctx.textAlign = 'start';
    ctx.fillText('150 day 1', padX + 10, padTop + graphH + 50);

    ctx.textAlign = 'center';
    ctx.fillText('day 15', padX + graphW * 0.48, padTop + graphH + 50);

    ctx.textAlign = 'end';
    ctx.fillText('day 30', padX + graphW - 10, padTop + graphH + 50);

    // 4. 데이터 좌표 변환
    const minVal = 50;
    const maxVal = 500;
    const points = latencyData.map((val, idx) => {
      const x = padX + (idx / (latencyData.length - 1)) * graphW;
      const norm = (val - minVal) / (maxVal - minVal);
      const y = padTop + graphH * (1 - norm);
      return { x, y, val };
    });

    const activePt = points[selectedIdx] || points[19];

    // 5. 활성 구간 하단 네온 그라데이션 영역 채우기 (day 1 ~ selectedIdx)
    const activePoints = points.slice(0, selectedIdx + 1);
    if (activePoints.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(activePoints[0].x, padTop + graphH);
      activePoints.forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(activePt.x, padTop + graphH);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, padTop, 0, padTop + graphH);
      areaGrad.addColorStop(0, 'rgba(36, 95, 194, 0.55)');
      areaGrad.addColorStop(0.45, 'rgba(38, 65, 185, 0.25)');
      areaGrad.addColorStop(1, 'rgba(10, 11, 14, 0.0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();
      ctx.restore();
    }

    // 6. 비활성 구간 (selectedIdx ~ 30일차) 어두운 슬레이트 선 (글로우 없음)
    const inactivePoints = points.slice(selectedIdx);
    if (inactivePoints.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      inactivePoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // 7. 활성 구간은 KLIC blue 계열로 강조합니다.
    if (activePoints.length > 1) {
      // 1) 바깥쪽 넓은 네온 글로우
      ctx.save();
      ctx.shadowColor = '#245FC2';
      ctx.shadowBlur = 36;
      ctx.beginPath();
      ctx.strokeStyle = '#245FC2';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      activePoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // 2) 중간 코어 광원 라인
      ctx.shadowBlur = 16;
      ctx.strokeStyle = '#8AB6FF';
      ctx.lineWidth = 8;
      ctx.stroke();

      // 3) 최상위 흰색 하이라이트 코어
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // 8. 현재 포커스된 지점 (activePt) 네온 마커 및 텍스트 툴팁
    if (activePt) {
      ctx.save();
      // 바닥으로 떨어지는 수직 가이드 점선
      ctx.beginPath();
      ctx.setLineDash([8, 10]);
      ctx.strokeStyle = 'rgba(79, 141, 247, 0.75)';
      ctx.lineWidth = 3.5;
      ctx.moveTo(activePt.x, activePt.y);
      ctx.lineTo(activePt.x, padTop + graphH);
      ctx.stroke();
      ctx.setLineDash([]);

      // 링 마커 (검은 중심 + 네온 스트로크)
      ctx.shadowColor = '#245FC2';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#06080d';
      ctx.fill();
      ctx.strokeStyle = '#245FC2';
      ctx.lineWidth = 6;
      ctx.stroke();

      // 중심 백색 점
      ctx.beginPath();
      ctx.arc(activePt.x, activePt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // 텍스트 라벨: day XX / XXX ms (레퍼런스 이미지 폰트 및 배치 완벽 구현)
      ctx.font = '600 36px "JetBrains Mono", monospace';
      ctx.fillStyle = '#DFE5EE';
      ctx.textAlign = 'left';
      ctx.shadowBlur = 0;
      ctx.fillText(`day ${selectedIdx + 1}`, activePt.x + 28, activePt.y - 28);

      ctx.font = '800 58px "JetBrains Mono", monospace';
      ctx.fillStyle = '#245FC2';
      ctx.shadowColor = '#245FC2';
      ctx.shadowBlur = 28;
      ctx.fillText(`${activePt.val} ms`, activePt.x + 28, activePt.y + 36);
      ctx.restore();
    }

    if (glassTextureRef.current) {
      glassTextureRef.current.needsUpdate = true;
    }
  }, [latencyData]);

  // Three.js 씬 초기화 및 애니메이션 루프
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

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

    // 2. 카메라 설정 (아이소메트릭 사선 뷰 배치)
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 6.8, 22.0);
    camera.lookAt(0, 2.5, 0);
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

    // 4. 조명 시스템 (3점 스튜디오 조명)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(12, 20, 16);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-15, 8, -10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4f8df7, 1.8);
    rimLight.position.set(0, -5, -15);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x181a24, 1.6);
    scene.add(ambientLight);

    // 5. 전체 모델 그룹
    const rootGroup = new THREE.Group();
    groupRef.current = rootGroup;
    scene.add(rootGroup);

    // 바닥 부드러운 접지 그림자 (Contact Shadow)
    const shadowGeo = new THREE.PlaneGeometry(24, 12);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 64, 10, 128, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.65, 0);
    rootGroup.add(shadowMesh);

    // 6. 하단 아이소메트릭 받침대 (Pedestal Base Tray)
    // 둥근 사각형 형태의 베이스 트레이 생성
    const baseW = 16.5;
    const baseD = 4.8;
    const baseCornerR = 0.9;
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-baseW / 2 + baseCornerR, -baseD / 2);
    baseShape.lineTo(baseW / 2 - baseCornerR, -baseD / 2);
    baseShape.quadraticCurveTo(baseW / 2, -baseD / 2, baseW / 2, -baseD / 2 + baseCornerR);
    baseShape.lineTo(baseW / 2, baseD / 2 - baseCornerR);
    baseShape.quadraticCurveTo(baseW / 2, baseD / 2, baseW / 2 - baseCornerR, baseD / 2);
    baseShape.lineTo(-baseW / 2 + baseCornerR, baseD / 2);
    baseShape.quadraticCurveTo(-baseW / 2, baseD / 2, -baseW / 2, baseD / 2 - baseCornerR);
    baseShape.lineTo(-baseW / 2, -baseD / 2 + baseCornerR);
    baseShape.quadraticCurveTo(-baseW / 2, -baseD / 2, -baseW / 2 + baseCornerR, -baseD / 2);

    const baseExtrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.16,
      bevelThickness: 0.16,
    };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    baseGeo.center();
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111319,
      roughness: 0.45,
      metalness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = -0.45;
    baseMesh.receiveShadow = !isSoftwareGl;
    rootGroup.add(baseMesh);

    // 7. 입체 3D 글래스 슬래브 (Glass Slab)
    const glassW = 14.8;
    const glassH = 6.4;
    const glassCornerR = 0.45;
    const glassShape = new THREE.Shape();
    glassShape.moveTo(-glassW / 2 + glassCornerR, -glassH / 2);
    glassShape.lineTo(glassW / 2 - glassCornerR, -glassH / 2);
    glassShape.quadraticCurveTo(glassW / 2, -glassH / 2, glassW / 2, -glassH / 2 + glassCornerR);
    glassShape.lineTo(glassW / 2, glassH / 2 - glassCornerR);
    glassShape.quadraticCurveTo(glassW / 2, glassH / 2, glassW / 2 - glassCornerR, glassH / 2);
    glassShape.lineTo(-glassW / 2 + glassCornerR, glassH / 2);
    glassShape.quadraticCurveTo(-glassW / 2, glassH / 2, -glassW / 2, glassH / 2 - glassCornerR);
    glassShape.lineTo(-glassW / 2, -glassH / 2 + glassCornerR);
    glassShape.quadraticCurveTo(-glassW / 2, -glassH / 2, -glassW / 2 + glassCornerR, -glassH / 2);

    const glassExtrudeSettings = {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };
    const glassGeo = new THREE.ExtrudeGeometry(glassShape, glassExtrudeSettings);
    glassGeo.center();

    // 물리 기반 투명 다크 글래스 재질 (depthWrite: false로 내부 차트 투과 보장)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x070a10,
      roughness: 0.1,
      metalness: 0.15,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.88,
      depthWrite: false,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color(0x0a0b0e),
      attenuationDistance: 2.2,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 3.0, 0);
    glassMesh.castShadow = !isSoftwareGl;
    rootGroup.add(glassMesh);

    // 8. 글래스 전면 네온 차트 그래픽 플레인 (CanvasTexture 매핑 및 renderOrder 최상위)
    updateGlassTexture(activeDay);
    const texture = new THREE.CanvasTexture(textureCanvasRef.current!);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    glassTextureRef.current = texture;

    const chartPlaneGeo = new THREE.PlaneGeometry(glassW, glassH);
    const chartPlaneMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      depthTest: false, // 어떤 각도에서도 글래스 메시에 의해 클리핑되지 않도록 보장
      side: THREE.DoubleSide,
    });
    const chartPlaneMesh = new THREE.Mesh(chartPlaneGeo, chartPlaneMat);
    chartPlaneMesh.position.set(0, 3.0, 0.22); // 슬래브 전면 바로 앞 밀착
    chartPlaneMesh.renderOrder = 100; // 글래스 슬래브 이후에 렌더링되도록 최상위 지정
    rootGroup.add(chartPlaneMesh);

    // 9. 마우스 포인터 인터랙션 (부드러운 스프링 댐핑 틸트)
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetRotation.current = {
        x: ny * 0.12,
        y: nx * 0.18,
      };
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

    // 10. 렌더 루프 (레퍼런스 이미지 bc3fc2b5 / 90d273e2의 기준 아이소메트릭 사선 각도 유지)
    const baseRotX = 0.08;
    const baseRotY = -0.42;
    let lastTime = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 부드러운 회전 각도 보간 (Exponential Damping)
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

      if (rootGroup) {
        rootGroup.rotation.x = baseRotX + currentRotation.current.x;
        rootGroup.rotation.y = baseRotY + currentRotation.current.y;
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    // 클린업
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      chartPlaneGeo.dispose();
      chartPlaneMat.dispose();
      texture.dispose();
    };
  }, [updateGlassTexture,prefersReducedMotion]);

  // 활성 일자 변경 시 캔버스 텍스처 재렌더링
  useEffect(() => {
    updateGlassTexture(activeDay);
    if (onDaySelect) {
      onDaySelect(activeDay + 1, latencyData[activeDay]);
    }
  }, [activeDay, updateGlassTexture, latencyData, onDaySelect]);

  // 자동 재생 시뮬레이션
  useEffect(() => {
    if (!isPlaying||prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveDay((prev) => (prev + 1) % latencyData.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isPlaying, latencyData.length,prefersReducedMotion]);

  useEffect(()=>{if(prefersReducedMotion)setIsPlaying(false);},[prefersReducedMotion]);

  return (
    <div
      data-chart-region="chart3d-isometric-latency"
      data-reduced-motion={String(prefersReducedMotion)}
      role="region"
      aria-labelledby="chart3d-latency-title"
      className={`relative w-full rounded-[28px] bg-klic-inverse border border-[var(--klic-component-block-color-border)] text-klic-on-emphasis overflow-hidden shadow-2xl transition-all ${
        isMaximized ? 'ring-2 ring-blue-500/50' : ''
      }`}
    >
      {/* 1. 상단 바: 레퍼런스 이미지 헤더 (p95 latency, LINE CHART, 우측 버튼 그룹) */}
      <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 id="chart3d-latency-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-klic-on-emphasis font-sans">
              p95 latency
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-klic-inverse/90 text-blue-400 text-[11px] font-mono font-semibold border border-[var(--klic-component-block-color-border)]">
              KLIC · 3D 라인
            </span>
          </div>
          <p className="text-[11px] font-mono tracking-[0.25em] text-klic-muted uppercase mt-1">
            LINE CHART • 3D 입체 네온 글래스 슬래브
          </p>
        </div>

        {/* 우측 상단 액션 버튼 그룹 (Image 90d273e2 구현) */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-klic-inverse/90 border border-[var(--klic-component-block-color-border)] shadow-inner">
          <button
            type="button"
            onClick={() => setIsMaximized((v) => !v)}
            title={isMaximized ? '기본 크기로 복원' : '전체화면 확대'}
            aria-label={isMaximized ? '기본 크기로 복원' : '전체화면 확대'}
            aria-pressed={isMaximized}
            className="p-2 rounded-xl text-klic-muted hover:text-klic-on-emphasis hover:bg-klic-inverse transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            title={isPlaying ? '일시 정지' : '실시간 시뮬레이션 재생'}
            aria-label={isPlaying ? '시뮬레이션 일시 정지' : prefersReducedMotion?'모션 감소 설정에서 자동 재생 사용 안 함':'샘플 시뮬레이션 재생'}
            aria-pressed={isPlaying}
            disabled={prefersReducedMotion}
            className={`p-2 rounded-xl transition-colors ${
              isPlaying
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-klic-muted hover:text-klic-on-emphasis hover:bg-klic-inverse'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setActiveDay(19); // 20일차 (262 ms 기본값)
            }}
            title="기본 20일차 위치로 리셋"
            aria-label="20일차로 초기화"
            className="p-2 rounded-xl text-klic-muted hover:text-klic-on-emphasis hover:bg-klic-inverse transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. WebGL Three.js 마운트 뷰포트 (중앙 100% 비가림) */}
      <div
        ref={mountRef}
        role="img"
        aria-label="30일 합성 p95 지연율 3D 라인 차트"
        aria-describedby="chart3d-latency-summary"
        className="w-full h-[460px] sm:h-[540px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
      />

      {/* 3. 하단 인터랙티브 스크러버 & 메트릭 요약 독 */}
      <div className="p-6 sm:p-8 pt-0 border-t border-[var(--klic-component-block-color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="29"
            value={activeDay}
            aria-label="지연율을 확인할 날짜"
            aria-valuetext={`${activeDay+1}일차, ${latencyData[activeDay]}밀리초`}
            onChange={(e) => setActiveDay(Number(e.target.value))}
            className="w-48 sm:w-64 accent-blue-400 bg-klic-inverse h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs font-mono text-klic-muted">
            {activeDay + 1}일차 선택 중 (총 30일)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-klic-muted">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>선택 지연율:</span>
            <strong className="text-blue-400 text-sm">
              {latencyData[activeDay]} ms
            </strong>
          </div>
          <span className="text-klic-muted">|</span>
          <div id="chart3d-latency-summary" className="text-klic-muted">
            마우스 드래그로 3D 슬래브 각도를 회전 탐색할 수 있습니다.
          </div>
        </div>
      </div>
      <ChartDataTable chartId="chart3d-isometric-latency" caption="합성 30일 p95 지연율" columns={['p95 지연 (ms)']} rows={latencyData.map((value,index)=>[`Day ${index+1}`,value])} />
    </div>
  );
}
