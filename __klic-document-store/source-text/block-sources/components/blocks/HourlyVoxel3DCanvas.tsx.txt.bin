import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import {ChartDataTable} from './ChartDataTable';
import {dampChartMotion,usePrefersReducedMotion} from './chart3d-motion';

interface HourlyVoxel3DCanvasProps {
  initialDimension?: '2D' | '3D';
  onVoxelSelect?: (day: number, hour: number, val: number) => void;
}

export function HourlyVoxel3DCanvas({
  initialDimension = '3D',
  onVoxelSelect,
}: HourlyVoxel3DCanvasProps) {
  const prefersReducedMotion=usePrefersReducedMotion();
  const mountRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState<'2D' | '3D'>(initialDimension);

  // 선택/호버된 복셀 (기본값: Thu 18:00, 1.2k req/s - 레퍼런스 이미지 bc3fc2b5 완벽 일치)
  const [activeVoxel, setActiveVoxel] = useState<{
    day: number;
    hour: number;
    val: number;
  }>({
    day: 3, // Thu (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6)
    hour: 18, // 18:00
    val: 1.2,
  });

  const daysEng = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daysKor = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];

  // 7 x 24 트래픽 데이터 매트릭스 생성
  const matrixData = useMemo(() => {
    const grid: number[][] = [];
    for (let d = 0; d < 7; d++) {
      const row: number[] = [];
      for (let h = 0; h < 24; h++) {
        // 기본 새벽 기저 트래픽
        let val = 0.12 + Math.sin((h / 24) * Math.PI) * 0.35;
        // 주중(화~금) 오후 14시~20시 피크 트래픽 돔 형성
        if (d >= 1 && d <= 4 && h >= 12 && h <= 21) {
          const dist = Math.hypot(d - 3, h - 17.5);
          val += Math.max(0, 1.15 - dist * 0.32);
        }
        if (d === 3 && h === 18) val = 1.2; // 피크 1.2k req/s
        row.push(Number(Math.min(1.2, Math.max(0.08, val)).toFixed(2)));
      }
      grid.push(row);
    }
    return grid;
  }, []);

  // Three.js 인스턴스 참조
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubesRef = useRef<
    {
      mesh: THREE.Mesh;
      day: number;
      hour: number;
      val: number;
      baseColor: THREE.Color;
      peakColor: THREE.Color;
    }[]
  >([]);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number>(0);
  const mouseTargetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 2D <-> 3D 높이 및 머티리얼 실시간 업데이트
  useEffect(() => {
    if (onVoxelSelect) {
      onVoxelSelect(activeVoxel.day, activeVoxel.hour, activeVoxel.val);
    }
  }, [activeVoxel, onVoxelSelect]);

  // Three.js 씬 구축
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 840;
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

    // 2. 카메라 설정 (레퍼런스 이미지 bc3fc2b5의 정확한 아이소메트릭 사선 뷰 배치)
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(21, 17, 24);
    camera.lookAt(0, -0.2, 0);
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
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. 조명 시스템 (방향성 키 라이트 + 앰비언트 + 소프트 그림자)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(16, 26, 18);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fillLight.position.set(-20, 10, -15);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0x181a24, 1.6);
    scene.add(ambientLight);

    // 5. 전체 모델 루트 그룹
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // 바닥 접지 그림자 (Contact Shadow Plane)
    const shadowGeo = new THREE.PlaneGeometry(32, 18);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 64, 15, 128, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.22)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.45, 0);
    rootGroup.add(shadowMesh);

    // 6. 하단 둥근 사각 트레이 (Rounded Rectangular Tray Baseplate)
    const trayW = 24.5;
    const trayD = 8.8;
    const trayCornerR = 1.4;
    const trayShape = new THREE.Shape();
    trayShape.moveTo(-trayW / 2 + trayCornerR, -trayD / 2);
    trayShape.lineTo(trayW / 2 - trayCornerR, -trayD / 2);
    trayShape.quadraticCurveTo(trayW / 2, -trayD / 2, trayW / 2, -trayD / 2 + trayCornerR);
    trayShape.lineTo(trayW / 2, trayD / 2 - trayCornerR);
    trayShape.quadraticCurveTo(trayW / 2, trayD / 2, trayW / 2 - trayCornerR, trayD / 2);
    trayShape.lineTo(-trayW / 2 + trayCornerR, trayD / 2);
    trayShape.quadraticCurveTo(-trayW / 2, trayD / 2, -trayW / 2, trayD / 2 - trayCornerR);
    trayShape.lineTo(-trayW / 2, -trayD / 2 + trayCornerR);
    trayShape.quadraticCurveTo(-trayW / 2, -trayD / 2, -trayW / 2 + trayCornerR, -trayD / 2);

    const trayExtrudeSettings = {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.16,
      bevelThickness: 0.16,
    };
    const trayGeo = new THREE.ExtrudeGeometry(trayShape, trayExtrudeSettings);
    trayGeo.center();
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x0f1116,
      roughness: 0.5,
      metalness: 0.2,
    });
    const trayMesh = new THREE.Mesh(trayGeo, trayMat);
    trayMesh.rotation.x = -Math.PI / 2;
    trayMesh.position.y = -0.3;
    trayMesh.receiveShadow = !isSoftwareGl;
    rootGroup.add(trayMesh);

    // 트레이 상단 내부 패널 (약간 음각된 인셋 베이스)
    const innerPadGeo = new THREE.PlaneGeometry(trayW - 0.8, trayD - 0.8);
    const innerPadMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c10,
      roughness: 0.6,
      metalness: 0.1,
    });
    const innerPad = new THREE.Mesh(innerPadGeo, innerPadMat);
    innerPad.rotation.x = -Math.PI / 2;
    innerPad.position.y = -0.09;
    innerPad.receiveShadow = !isSoftwareGl;
    rootGroup.add(innerPad);

    // 7. 168개의 3D 복셀 기둥 생성 (7 rows x 24 cols)
    const cubesList: {
      mesh: THREE.Mesh;
      day: number;
      hour: number;
      val: number;
      baseColor: THREE.Color;
      peakColor: THREE.Color;
    }[] = [];

    const spacingX = 0.88; // 24시간 가로 간격
    const spacingZ = 0.88; // 7요일 세로 간격
    const startX = -((24 - 1) * spacingX) / 2;
    const startZ = -((7 - 1) * spacingZ) / 2;

    // 공용 박스 지오메트리 (단위 높이 1)
    const cubeGeo = new THREE.BoxGeometry(0.72, 1, 0.72);

    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < 24; h++) {
        const val = matrixData[d][h];
        const posX = startX + h * spacingX;
        const posZ = startZ + d * spacingZ;

        // 트래픽에 따른 기본 색상 계산
        let baseColorHex = 0x22242c;
        if (val > 0.4) baseColorHex = 0x333642;
        if (val > 0.8) baseColorHex = 0x484c5c;

        const baseColor = new THREE.Color(baseColorHex);
        const peakColor = new THREE.Color(0x245fc2);

        const mat = new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.35,
          metalness: 0.15,
        });

        const mesh = new THREE.Mesh(cubeGeo, mat);
        mesh.castShadow = !isSoftwareGl;
        mesh.receiveShadow = !isSoftwareGl;
        mesh.position.set(posX, 0.05, posZ);

        // 메타데이터 부착
        mesh.userData = { day: d, hour: h, val };

        rootGroup.add(mesh);
        cubesList.push({ mesh, day: d, hour: h, val, baseColor, peakColor });
      }
    }
    cubesRef.current = cubesList;

    // 8. 3D 트레이 위의 텍스트 라벨 (CanvasTexture 기반 축 라벨)
    // 요일 라벨 (Mon ~ Sun) 및 시간 라벨 (00h, 06h, 12h, 18h, 23h)
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 1024;
    labelCanvas.height = 512;
    const lCtx = labelCanvas.getContext('2d');
    if (lCtx) {
      lCtx.clearRect(0, 0, 1024, 512);
      lCtx.font = '600 24px "JetBrains Mono", monospace';
      lCtx.fillStyle = '#52657B';

      // 좌측 상단 요일 라벨
      daysEng.forEach((dName, idx) => {
        lCtx.fillText(dName, 40, 90 + idx * 48);
      });

      // 하단 시간 눈금
      const hourTicks = ['00h', '06h', '12h', '18h', '23h'];
      hourTicks.forEach((tick, idx) => {
        lCtx.fillText(tick, 180 + idx * 165, 460);
      });
    }
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    const labelPlaneGeo = new THREE.PlaneGeometry(trayW - 0.2, trayD - 0.2);
    const labelPlaneMat = new THREE.MeshBasicMaterial({
      map: labelTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const labelPlane = new THREE.Mesh(labelPlaneGeo, labelPlaneMat);
    labelPlane.rotation.x = -Math.PI / 2;
    labelPlane.position.y = -0.07;
    rootGroup.add(labelPlane);

    // 9. 마우스 레이캐스팅 및 틸트 상호작용
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

      // 레이캐스팅으로 복셀 탐지
      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = cubesRef.current.map((c) => c.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.day !== undefined) {
          setActiveVoxel({
            day: hit.userData.day,
            hour: hit.userData.hour,
            val: hit.userData.val,
          });
        }
      }
    };

    const handlePointerLeave = () => {
      mouseTargetRotation.current = { x: 0, y: 0 };
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 리사이즈 처리
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    // 10. 실시간 렌더 루프 (2D/3D 높이 애니메이션 및 회전 댐핑)
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
        rootGroupRef.current.rotation.x = currentRotation.current.x;
        rootGroupRef.current.rotation.y = currentRotation.current.y;
      }

      // 각 큐브의 높이(scale.y) 및 위치(position.y) 보간
      const is3D = dimension === '3D';
      cubesRef.current.forEach((item) => {
        // 목표 높이 계산: 2D일 때는 평면(0.08), 3D일 때는 트래픽 비례(0.25 ~ 3.6)
        const targetHeight = is3D ? Math.max(0.25, item.val * 3.0) : 0.08;
        item.mesh.scale.y = dampChartMotion(
          item.mesh.scale.y,
          targetHeight,
          10,
          dt,
          prefersReducedMotion
        );
        // 바닥에서 위로 자라도록 position.y 조정
        item.mesh.position.y = item.mesh.scale.y / 2;

        // 선택/호버된 복셀은 KLIC blue로 강조합니다.
        const isHovered =
          item.day === activeVoxel.day && item.hour === activeVoxel.hour;
        const mat = item.mesh.material as THREE.MeshStandardMaterial;

        if (isHovered) {
          mat.color.setHex(0x245FC2);
          mat.emissive.setHex(0x193A87);
          mat.emissiveIntensity = 0.9;
          mat.roughness = 0.2;
        } else {
          mat.color.copy(item.baseColor);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0.0;
          mat.roughness = 0.35;
        }
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
      trayGeo.dispose();
      trayMat.dispose();
      innerPadGeo.dispose();
      innerPadMat.dispose();
      cubeGeo.dispose();
      cubesRef.current.forEach((c) => {
        (c.mesh.material as THREE.Material).dispose();
      });
      labelPlaneGeo.dispose();
      labelPlaneMat.dispose();
      labelTex.dispose();
    };
  }, [dimension, activeVoxel.day, activeVoxel.hour, matrixData,prefersReducedMotion]);

  return (
    <div data-chart-region="chart3d-voxel-hourly-density" data-reduced-motion={String(prefersReducedMotion)} role="region" aria-labelledby="chart3d-voxel-title" className="relative w-full rounded-[28px] bg-klic-inverse border border-[var(--klic-component-block-color-border)] text-klic-on-emphasis overflow-hidden shadow-2xl">
      {/* 1. 상단 바: 레퍼런스 이미지 헤더 (Requests by hour, FLAT IN 2D · HEIGHT IN 3D, 우측 2D/3D 전환 토글) */}
      <div className="flex items-start justify-between gap-4 p-6 sm:p-8 pb-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 id="chart3d-voxel-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-klic-on-emphasis font-sans">
              Requests by hour
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-klic-inverse/90 text-blue-400 text-[11px] font-mono font-semibold border border-[var(--klic-component-block-color-border)]">
              KLIC · 3D 복셀
            </span>
          </div>
          <p className="text-[11px] font-mono tracking-[0.25em] text-klic-muted uppercase mt-1">
            FLAT IN 2D · HEIGHT IN 3D
          </p>
        </div>

        {/* 2D / 3D 세그먼트 전환 토글 (Image bc3fc2b5 우측 상단 토글 완벽 구현) */}
        <div className="inline-flex items-center p-1 rounded-xl bg-klic-inverse border border-[var(--klic-component-block-color-border)] shadow-inner">
          <button
            type="button"
            onClick={() => setDimension('2D')}
            aria-pressed={dimension==='2D'}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              dimension === '2D'
                ? 'bg-klic-inverse text-klic-on-emphasis shadow-xs'
                : 'text-klic-muted hover:text-klic-on-emphasis'
            }`}
          >
            2D
          </button>
          <button
            type="button"
            onClick={() => setDimension('3D')}
            aria-pressed={dimension==='3D'}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              dimension === '3D'
                ? 'bg-klic-inverse text-blue-400 shadow-xs'
                : 'text-klic-muted hover:text-klic-on-emphasis'
            }`}
          >
            3D
          </button>
        </div>
      </div>

      {/* 2. WebGL Three.js 복셀 캔버스 뷰포트 (중앙 100% 비가림) */}
      <div
        ref={mountRef}
        role="img"
        aria-label="7요일 24시간 합성 요청 밀도 3D 복셀 히트맵"
        aria-describedby="chart3d-voxel-summary"
        className="w-full h-[440px] sm:h-[500px] cursor-pointer flex items-center justify-center select-none"
      />

      <div className="flex flex-wrap items-center justify-center gap-4 px-6 py-3" aria-label="키보드로 요청 밀도 선택">
        <label className="flex min-w-[220px] items-center gap-3 text-sm text-klic-on-emphasis">요일 · {daysKor[activeVoxel.day]}
          <input type="range" min="0" max="6" step="1" aria-label="요일 선택" aria-valuetext={daysKor[activeVoxel.day]} value={activeVoxel.day} onChange={event=>{const day=Number(event.target.value);setActiveVoxel(current=>({day,hour:current.hour,val:matrixData[day][current.hour]}));}} className="w-32 accent-blue-500 bg-klic-inverse h-1.5 rounded-lg appearance-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400" />
        </label>
        <label className="flex min-w-[220px] items-center gap-3 text-sm text-klic-on-emphasis">시간 · {String(activeVoxel.hour).padStart(2,'0')}:00
          <input type="range" min="0" max="23" step="1" aria-label="시간 선택" aria-valuetext={`${String(activeVoxel.hour).padStart(2,'0')}:00`} value={activeVoxel.hour} onChange={event=>{const hour=Number(event.target.value);setActiveVoxel(current=>({day:current.day,hour,val:matrixData[current.day][hour]}));}} className="w-32 accent-blue-500 bg-klic-inverse h-1.5 rounded-lg appearance-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400" />
        </label>
      </div>

      {/* 3. 하단 네온 강조 텍스트 라벨 (Thu 18:00 · 1.2k req/s - Image bc3fc2b5 하단 초록 글씨 구현) */}
      <div className="p-6 sm:p-8 pt-0 flex flex-col items-center justify-center border-t border-[var(--klic-component-block-color-border)] mt-2">
        <div className="text-lg sm:text-xl font-mono font-bold text-[#245FC2] drop-shadow-[0_0_12px_rgba(36,95,194,0.5)] tracking-wider">
          {daysEng[activeVoxel.day]} {String(activeVoxel.hour).padStart(2, '0')}:00 ·{' '}
          {activeVoxel.val >= 1.0
            ? `${activeVoxel.val.toFixed(1)}k req/s`
            : `${Math.round(activeVoxel.val * 1000)} req/s`}
        </div>

        <div id="chart3d-voxel-summary" className="mt-2 text-xs font-mono text-klic-muted flex items-center gap-2">
          <span>{daysKor[activeVoxel.day]} {activeVoxel.hour}시</span>
          <span>•</span>
          <span>마우스 호버 또는 요일·시간 선택으로 셀을 탐색합니다. 모든 값은 합성 샘플입니다.</span>
        </div>
      </div>
      <ChartDataTable chartId="chart3d-voxel-hourly-density" caption="요일·시간별 합성 요청량 (requests/second)" columns={Array.from({length:24},(_,hour)=>`${String(hour).padStart(2,'0')}:00 (req/s)`)} rows={daysKor.map((day,index)=>[day,...matrixData[index].map(value=>`${Math.round(value*1000)} req/s`)])} />
    </div>
  );
}
