import * as THREE from 'three';

const realmData = [
  { id: 'ai', title: 'Intelligence, in motion', copy: 'A living constellation of learning systems, neural patterns and ideas that keep evolving.', color: 0x7299ff, kind: 'brain' },
  { id: 'cyber', title: 'The unseen frontier', copy: 'Explore the architectures, signals and human ingenuity that shape a more resilient digital world.', color: 0x8d77ed, kind: 'shield' },
  { id: 'robotics', title: 'Matter with intent', copy: 'Mechanisms, autonomy and imagination meet in forms made to move beyond the expected.', color: 0xb9b6c4, kind: 'robot' },
  { id: 'ev', title: 'A new kind of momentum', copy: 'Electric mobility redraws the map: quieter systems, cleaner motion and fresh ways to travel.', color: 0x7fbcff, kind: 'wheel' },
  { id: 'drone', title: 'A different point of view', copy: 'Flight, sensing and spatial intelligence open new perspectives on the world below.', color: 0x9d7cff, kind: 'drone' },
  { id: 'workshops', title: 'Make the next thing', copy: 'A place for hands-on exploration, shared practice and the spark of learning by doing.', color: 0xc5b693, kind: 'workshop' }
];

const smooth = (a, b, t) => {
  const n = THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);
  return n * n * (3 - 2 * n);
};

function makeMaterial(color, metalness = 0.7, roughness = 0.28, emissive = 0x000000) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness, emissive, emissiveIntensity: 0.7 });
}

function makeRealmObject(kind, color) {
  const group = new THREE.Group();
  const metal = makeMaterial(color, 0.82, 0.2, color);
  const dim = makeMaterial(0x252c41, 0.65, 0.35);
  const ring = (radius, tube, material = metal) => new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 96), material);
  if (kind === 'brain') {
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 2), metal);
    core.scale.set(1, 1.12, .78); group.add(core);
    for (let i = 0; i < 3; i++) {
      const orbit = ring(1.15 + i * .1, .012, i === 1 ? dim : metal);
      orbit.rotation.set(.4 + i * .7, .2 + i * .5, i * .42); group.add(orbit);
    }
    for (let i = 0; i < 14; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 8), metal);
      const a = i * 2.4; dot.position.set(Math.sin(a) * (0.7 + (i % 3) * .12), Math.cos(a * .71) * .9, Math.sin(a * .43) * .68); group.add(dot);
    }
  } else if (kind === 'shield') {
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(.96, 0), metal); body.scale.set(.82, 1.2, .3); group.add(body);
    const inner = new THREE.Mesh(new THREE.OctahedronGeometry(.65, 0), dim); inner.scale.set(.82, 1.14, .31); group.add(inner);
    const loop = ring(.9, .018); loop.rotation.x = Math.PI / 2; loop.scale.set(1, 1.35, 1); group.add(loop);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(.04, 1.2, .05), metal); bar.position.z = .42; group.add(bar);
  } else if (kind === 'robot') {
    const torso = new THREE.Mesh(new THREE.BoxGeometry(.85, 1.05, .55), metal); group.add(torso);
    const head = new THREE.Mesh(new THREE.BoxGeometry(.65, .48, .5), dim); head.position.y = .86; group.add(head);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(.42, .07, .04), new THREE.MeshBasicMaterial({ color: color })); visor.position.set(0, .9, .28); group.add(visor);
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(.11, .14, .92, 12), metal); arm.position.set(side * .58, .02, 0); arm.rotation.z = side * -.2; group.add(arm);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.13, .17, .84, 12), dim); leg.position.set(side * .24, -.88, 0); group.add(leg);
    }
    const halo = ring(.73, .015, dim); halo.position.y = .86; group.add(halo);
  } else if (kind === 'wheel') {
    for (let i = 0; i < 3; i++) { const rim = ring(.65 + i * .2, .025, i === 1 ? dim : metal); rim.rotation.y = Math.PI / 2; rim.rotation.z = .3 * i; group.add(rim); }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .42, 24), metal); hub.rotation.z = Math.PI / 2; group.add(hub);
    for (let i = 0; i < 8; i++) { const spoke = new THREE.Mesh(new THREE.BoxGeometry(.025, 1.25, .035), dim); spoke.rotation.z = i * Math.PI / 4; group.add(spoke); }
  } else if (kind === 'drone') {
    const hub = new THREE.Mesh(new THREE.OctahedronGeometry(.38, 1), metal); group.add(hub);
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2, arm = new THREE.Mesh(new THREE.BoxGeometry(.94, .055, .09), dim);
      arm.rotation.z = a; arm.position.set(Math.cos(a) * .48, Math.sin(a) * .48, 0); group.add(arm);
      const prop = ring(.29, .012); prop.position.set(Math.cos(a) * .98, Math.sin(a) * .98, 0); group.add(prop);
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .14, 12), metal); pod.position.set(Math.cos(a) * .98, Math.sin(a) * .98, 0); group.add(pod);
    }
    const lens = new THREE.Mesh(new THREE.SphereGeometry(.11, 12, 12), new THREE.MeshBasicMaterial({ color: color })); lens.position.z = .34; group.add(lens);
  } else {
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(.72, .85, .16, 48), dim); plinth.position.y = -.38; group.add(plinth);
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(.67, 0), metal); crystal.position.y = .26; group.add(crystal);
    for (let i = 0; i < 4; i++) { const hoop = ring(.9 + i * .12, .013, i % 2 ? dim : metal); hoop.rotation.set(i * .35, i * .52, .4); group.add(hoop); }
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, 1.5, 6), new THREE.MeshBasicMaterial({ color })); beam.position.y = 1.36; group.add(beam);
  }
  group.traverse(o => { if (o.isMesh) { o.userData.realmRoot = group; o.userData.realmId = null; } });
  return group;
}

export function createExperience(container, onSelect) {
  let renderer;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    if (!context) return { update() {}, select() {}, dispose() {} };
    renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch {
    return { update() {}, select() {}, dispose() {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080a12, .0095);
  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, .1, 260);
  camera.position.set(0, 1.1, 13);
  const world = new THREE.Group(); scene.add(world);
  scene.add(new THREE.HemisphereLight(0x8e9fcd, 0x100d15, 1.5));
  const key = new THREE.DirectionalLight(0xd8d7cf, 2.2); key.position.set(-5, 9, 7); scene.add(key);
  const blueLight = new THREE.PointLight(0x4a75ff, 36, 38); blueLight.position.set(4, 2, -42); scene.add(blueLight);
  const violetLight = new THREE.PointLight(0x7953d6, 26, 32); violetLight.position.set(-3, -1, -82); scene.add(violetLight);
  const champagne = new THREE.PointLight(0xcab78f, 18, 28); champagne.position.set(1, 3, -111); scene.add(champagne);

  const stars = new THREE.BufferGeometry();
  let ambientPoints = null;
  fetch(`${import.meta.env.BASE_URL}data/aether-field.json`).then(r => r.ok ? r.json() : null).then(data => {
    if (data?.particles?.length) ambientPoints = data.particles;
  }).catch(() => {});
  const starPositions = new Float32Array(2100 * 3), starSizes = new Float32Array(2100);
  for (let i = 0; i < 2100; i++) {
    starPositions[i * 3] = (Math.random() - .5) * 100;
    starPositions[i * 3 + 1] = (Math.random() - .5) * 60;
    starPositions[i * 3 + 2] = -Math.random() * 170 + 24;
    starSizes[i] = Math.random() * 1.65 + .35;
  }
  stars.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  stars.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
  const starMaterial = new THREE.PointsMaterial({ color: 0xbcc8f2, size: .045, transparent: true, opacity: .73, sizeAttenuation: true, depthWrite: false });
  const starField = new THREE.Points(stars, starMaterial); scene.add(starField);

  // A suspended chrome relic — the first object encountered in the flight.
  const artifact = new THREE.Group(); artifact.position.set(0, .2, 1); world.add(artifact);
  const artifactCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), makeMaterial(0xc5c8d1, .96, .16));
  artifactCore.scale.set(.77, 1.17, .68); artifact.add(artifactCore);
  const innerCore = new THREE.Mesh(new THREE.OctahedronGeometry(.48, 2), new THREE.MeshStandardMaterial({ color: 0x8098d3, metalness: .95, roughness: .12, emissive: 0x163d9a, emissiveIntensity: .55 }));
  artifact.add(innerCore);
  for (let i = 0; i < 4; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.7 + i * .18, .018, 8, 144), makeMaterial(i === 2 ? 0x8a91a2 : 0xc4b99f, .9, .24));
    torus.rotation.set(.42 + i * .48, .17 + i * .4, .22 + i * .31); artifact.add(torus);
  }
  const artifactLight = new THREE.PointLight(0x6889ff, 18, 17); artifact.add(artifactLight); artifactLight.position.z = 1.6;
  for (let i = 0; i < 18; i++) {
    const pin = new THREE.Mesh(new THREE.SphereGeometry(.028, 8, 8), new THREE.MeshBasicMaterial({ color: i % 3 ? 0x7c9dff : 0xd4c49d }));
    const a = i * 2.4; pin.position.set(Math.sin(a) * 1.4, Math.cos(a * .71) * 1.5, Math.sin(a * .33) * .9); artifact.add(pin);
  }

  // Repeating arch ribs move from carved stone into illuminated circuitry.
  const architecture = new THREE.Group(); world.add(architecture);
  const stone = makeMaterial(0x77716b, .56, .44);
  const electric = new THREE.MeshStandardMaterial({ color: 0x6178b1, metalness: .65, roughness: .3, emissive: 0x172e77, emissiveIntensity: .65 });
  for (let i = 0; i < 11; i++) {
    const z = -17 - i * 4;
    const arch = new THREE.Group(); arch.position.z = z; architecture.add(arch);
    const mat = i < 5 ? stone : electric;
    const curve = new THREE.EllipseCurve(0, 0, 5.3, 5.9, Math.PI, 0, false, 0);
    const pts = curve.getPoints(64).map(p => new THREE.Vector3(p.x, p.y + .2, 0));
    const arc = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 70, i < 5 ? .11 : .035, 8, false), mat); arch.add(arc);
    for (const side of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(.22, 5.7, .28), mat); pillar.position.set(side * 5.3, -2.55, 0); arch.add(pillar);
      const base = new THREE.Mesh(new THREE.BoxGeometry(.75, .18, .58), mat); base.position.set(side * 5.3, -5.4, .04); arch.add(base);
      for (let row = 0; row < 4; row++) { const cut = new THREE.Mesh(new THREE.BoxGeometry(.1, .045, .31), i < 5 ? makeMaterial(0xa59b8e, .35, .6) : electric); cut.position.set(side * 5.3, -1.2 - row * .85, .17); arch.add(cut); }
    }
    const cross = new THREE.Mesh(new THREE.BoxGeometry(10.6, .085, .1), mat); cross.position.y = -5.35; arch.add(cross);
  }
  // Campus reference is only a translucent, depth-layered architectural memory.
  const campusTexture = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}images/references/iit-bombay-campus.png`, texture => { texture.colorSpace = THREE.SRGBColorSpace; });
  const campus = new THREE.Mesh(new THREE.PlaneGeometry(15, 6), new THREE.MeshBasicMaterial({ map: campusTexture, transparent: true, opacity: .23, color: 0xa9b8dd, depthWrite: false }));
  campus.position.set(0, -1.7, -37.2); world.add(campus);
  const campusFrame = new THREE.Mesh(new THREE.PlaneGeometry(15.5, 6.5), new THREE.MeshBasicMaterial({ color: 0x506287, transparent: true, opacity: .13, wireframe: true }));
  campusFrame.position.set(0, -1.7, -37.35); world.add(campusFrame);

  // A cropped sleeve-detail from the supplied apparel concept becomes an
  // electric linework trace across the stone-to-signal passage.
  const lineworkTexture = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}images/references/hoodie-linework-detail.png`);
  lineworkTexture.colorSpace = THREE.SRGBColorSpace;
  const linework = new THREE.Mesh(
    new THREE.PlaneGeometry(8.2, 6.1),
    new THREE.MeshBasicMaterial({
      map: lineworkTexture,
      transparent: true,
      opacity: .29,
      color: 0xa6b7ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  linework.position.set(6.4, .25, -27.8);
  linework.rotation.y = -.3;
  linework.rotation.z = -.08;
  world.add(linework);

  // Thirty portal, built from rings and a luminous numeral texture.
  const portal = new THREE.Group(); portal.position.set(0, .3, -54); world.add(portal);
  const portalRings = [];
  for (let i = 0; i < 7; i++) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(5.2 + i * .24, i % 2 ? .018 : .045, 12, 180), makeMaterial(i % 3 ? 0x8793ad : 0xc2b99f, .92, .19, i % 3 ? 0x243c83 : 0x3d2e18));
    torus.rotation.set(.12 + i * .17, .09 + i * .38, i * .2); portal.add(torus); portalRings.push(torus);
  }
  const portalCanvas = document.createElement('canvas'); portalCanvas.width = 800; portalCanvas.height = 800;
  const ctx = portalCanvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 800, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '300 490px Manrope, sans-serif'; ctx.fillStyle = '#ddd9d0'; ctx.shadowColor = '#7a9aff'; ctx.shadowBlur = 26; ctx.fillText('30', 400, 395);
    ctx.font = '22px monospace'; ctx.shadowBlur = 0; ctx.fillStyle = '#b7c1db'; ctx.fillText('THIRTIETH EDITION', 400, 690);
  }
  const numberTexture = new THREE.CanvasTexture(portalCanvas);
  const number = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 7.8), new THREE.MeshBasicMaterial({ map: numberTexture, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
  number.position.z = -.2; portal.add(number);
  const editionTexture = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}images/references/edition-mark.png`);
  editionTexture.colorSpace = THREE.SRGBColorSpace;
  const editionAtmosphere = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 4.25), new THREE.MeshBasicMaterial({ map: editionTexture, transparent: true, opacity: .13, color: 0xc8d3ee, depthWrite: false }));
  editionAtmosphere.position.set(0, -.04, -.42); portal.add(editionAtmosphere);
  const portalAura = new THREE.Mesh(new THREE.TorusGeometry(5.1, .4, 8, 128), new THREE.MeshBasicMaterial({ color: 0x344f9e, transparent: true, opacity: .13 }));
  portal.add(portalAura);

  // Realm sculptures share one connected environment and become raycast targets.
  const realmGroup = new THREE.Group(); world.add(realmGroup);
  const realmMeshes = [];
  const realmCoords = [
    [-5.2, 1.2, -77], [-3.1, -1.4, -79], [-1, 1.25, -76.5], [1.35, -1.2, -80], [3.65, 1.05, -77.8], [5.7, -.9, -80]
  ];
  realmData.forEach((data, i) => {
    const root = makeRealmObject(data.kind, data.color); root.position.set(...realmCoords[i]); root.scale.setScalar(i === 2 ? .87 : .76);
    root.userData.realmId = data.id; root.userData.realm = data; realmGroup.add(root); realmMeshes.push(root);
    root.traverse(o => { if (o.isMesh) { o.userData.realmRoot = root; o.userData.realmId = data.id; } });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.38, .008, 6, 88), new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: .6 }));
    halo.rotation.x = Math.PI / 2; halo.position.copy(root.position); halo.position.y -= 1.05; realmGroup.add(halo);
    const beacon = new THREE.PointLight(data.color, 5, 8); beacon.position.copy(root.position); beacon.position.y += .5; realmGroup.add(beacon);
  });
  // Fine rails make the separated inventions feel like a shared constellation.
  for (let i = 0; i < realmCoords.length - 1; i++) {
    const a = new THREE.Vector3(...realmCoords[i]), b = new THREE.Vector3(...realmCoords[i + 1]);
    const curve = new THREE.QuadraticBezierCurve3(a, new THREE.Vector3((a.x + b.x) / 2, 2.8, (a.z + b.z) / 2), b);
    realmGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, .008, 4, false), new THREE.MeshBasicMaterial({ color: 0x6d8cff, transparent: true, opacity: .42 })));
  }

  const exit = new THREE.Group(); exit.position.set(0, 0, -118); world.add(exit);
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.5 + i * 1.1, .015 + (i % 2) * .02, 8, 128), makeMaterial(i % 2 ? 0x6379ae : 0xc5b693, .85, .23, 0x1c2851));
    ring.rotation.set(i * .22, i * .56, i * .33); exit.add(ring);
  }
  const lastSpark = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 1), makeMaterial(0x9baddc, .9, .15, 0x304f9c)); lastSpark.position.z = .1; exit.add(lastSpark);
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let activeId = '', pointerX = 0, pointerY = 0, scrollProgress = 0, reducedMotion = false, clock = new THREE.Clock();
  const tooltip = document.querySelector('#realm-tooltip');
  let hoveredId = '';
  const onPointerMove = e => {
    pointerX = (e.clientX / window.innerWidth - .5) * 2;
    pointerY = (e.clientY / window.innerHeight - .5) * 2;
    if (scrollProgress < .42 || scrollProgress > .77) {
      hoveredId = '';
      if (tooltip) tooltip.style.display = 'none';
      return;
    }
    pointer.set(pointerX, -pointerY);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(realmMeshes, true).find(item => item.object.userData.realmId);
    hoveredId = hit?.object.userData.realmId || '';
    if (tooltip) {
      const data = realmData.find(item => item.id === hoveredId);
      tooltip.textContent = data ? data.title.toUpperCase() : '';
      tooltip.style.display = data ? 'block' : 'none';
      tooltip.style.left = `${e.clientX + 15}px`;
      tooltip.style.top = `${e.clientY + 15}px`;
    }
  };
  const onClick = e => {
    const target = e.target instanceof Element ? e.target : null;
    if (target?.closest('button,a,input,textarea,select,[role="group"]')) return;
    if (scrollProgress < .42 || scrollProgress > .77) return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(realmMeshes, true).find(item => item.object.userData.realmId);
    if (hit) select(hit.object.userData.realmId);
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('click', onClick);
  const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7)); };
  window.addEventListener('resize', onResize);

  function select(id) {
    const data = realmData.find(item => item.id === id);
    if (!data) return;
    activeId = id; onSelect?.(data);
  }
  function update(progress, isReduced = false) {
    scrollProgress = progress; reducedMotion = isReduced;
    const t = reducedMotion ? 0 : clock.getElapsedTime();
    const route = [
      { p: 0, z: 13, x: 0, y: 1.15 }, { p: .16, z: -19, x: -.3, y: .5 }, { p: .33, z: -41, x: 0, y: .1 },
      { p: .48, z: -54, x: 0, y: .3 }, { p: .65, z: -78.6, x: 0, y: .15 }, { p: .82, z: -107, x: .15, y: .4 }, { p: 1, z: -134, x: 0, y: .2 }
    ];
    let i = 0; while (i < route.length - 2 && progress > route[i + 1].p) i++;
    const a = route[i], b = route[i + 1], k = smooth(a.p, b.p, progress);
    const z = THREE.MathUtils.lerp(a.z, b.z, k), centerY = THREE.MathUtils.lerp(a.y, b.y, k);
    const pointerEase = reducedMotion ? 0 : 1;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, THREE.MathUtils.lerp(a.x, b.x, k) + pointerX * .72 * pointerEase, .045);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, centerY + pointerY * -.42 * pointerEase, .045);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, .055);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -pointerX * .035 * pointerEase, .035);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, pointerY * .022 * pointerEase, .035);
    artifact.rotation.y = t * .13 + pointerX * .12 * pointerEase; artifact.rotation.x = Math.sin(t * .32) * .08 + pointerY * .06 * pointerEase;
    artifact.position.y = .2 + Math.sin(t * .55) * .15;
    portal.rotation.z = t * .025; portal.rotation.y = Math.sin(t * .12) * .12;
    portalRings.forEach((r, n) => { r.rotation.z += reducedMotion ? 0 : (n % 2 ? 1 : -1) * .0009; });
    realmMeshes.forEach((root, n) => {
      root.rotation.y = t * .13 + n * .68; root.rotation.x = Math.sin(t * .24 + n) * .08;
      root.position.y = realmCoords[n][1] + Math.sin(t * .7 + n * 1.2) * .13;
      const selected = root.userData.realmId === activeId ? 1.17 : root.userData.realmId === hoveredId ? 1.08 : 1;
      root.scale.lerp(new THREE.Vector3((n === 2 ? .87 : .76) * selected, (n === 2 ? .87 : .76) * selected, (n === 2 ? .87 : .76) * selected), .08);
    });
    exit.rotation.y = t * .035;
    blueLight.intensity = 28 + Math.sin(t * .7) * 6;
    blueLight.position.x = 4 + pointerX * 2.2 * pointerEase;
    violetLight.position.x = -3 + pointerX * 2.7 * pointerEase;
    if (ambientPoints) {
      // Generated point clouds, when supplied by the asset pipeline, replace the same ambient field.
      const count = Math.min(ambientPoints.length, 5000), pos = new Float32Array(count * 3);
      for (let n = 0; n < count; n++) { const p = ambientPoints[n]; pos[n * 3] = p[0] * 1.5; pos[n * 3 + 1] = p[1] * 1.5; pos[n * 3 + 2] = p[2] - 22; }
      stars.setAttribute('position', new THREE.BufferAttribute(pos, 3)); stars.attributes.position.needsUpdate = true; ambientPoints = null;
    }
    renderer.render(scene, camera);
  }
  let frameId = 0;
  const renderFrame = () => {
    update(scrollProgress, reducedMotion);
    frameId = window.requestAnimationFrame(renderFrame);
  };
  frameId = window.requestAnimationFrame(renderFrame);
  function dispose() {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('click', onClick);
    if (tooltip) tooltip.style.display = 'none';
    renderer.dispose();
  }
  return { update, select, dispose, realmData, renderer };
}
