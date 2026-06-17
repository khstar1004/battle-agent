import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(readText(path));
}

describe("WAR GROUND demo contract", () => {
  const requiredFiles = [
    "mock-data/operation_plan.json",
    "mock-data/coa_options.json",
    "mock-data/agents.json",
    "mock-data/event_timeline.json",
    "mock-data/failure_paths.json",
    "mock-data/evidence_map.json",
    "mock-data/terrain_rehearsal.json",
    "mock-data/decision_card.json",
    "mock-data/fragmentary_order.json"
  ];

  it("ships the deterministic mock data package required for offline demos", () => {
    for (const file of requiredFiles) {
      assert.equal(existsSync(join(root, file)), true, `${file} is missing`);
      assert.doesNotThrow(() => readJson(file), `${file} must be valid JSON`);
    }
  });

  it("exposes the presenter controls from the development plan", () => {
    const html = readText("index.html");
    [
      "loadScenarioButton",
      "generateAgentsButton",
      "runRehearsalButton",
      "autoDemoButton",
      "resetDemoButton",
      "warGround3dCanvas",
      "terrainAnalysisPanel",
      "commanderVisualizationPanel"
    ].forEach((id) => assert.match(html, new RegExp(`id="${id}"`), `${id} is missing`));
  });

  it("keeps the demo flow deterministic and browser-local", () => {
    const app = readText("app.js");
    [
      "function loadScenario",
      "function generateAgents",
      "function runRehearsal",
      "function resetDemo",
      "function renderEvidencePreview",
      "function renderFragmentaryOrder"
    ].forEach((signature) => assert.match(app, new RegExp(signature)));
    assert.doesNotMatch(app, /fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
  });

  it("supports selectable game-unit style agent profiles", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.match(html, /id="agentProfilePanel"/);
    assert.match(html, /id="agentFormationSummary"/);
    assert.match(html, /id="agentFilterControls"/);
    [
      "const agentUnitProfiles",
      "function renderAgentFormationSummary",
      "function setAgentFilter",
      "function renderAgentProfile",
      "function selectAgentProfile"
    ].forEach((signature) => assert.match(app, new RegExp(signature)));
    assert.match(app, /data-agent-id=/);
    assert.match(app, /data-agent-filter=/);
    assert.match(app, /agent-portrait/);
    assert.match(app, /agent-attribute-grid/);
    assert.match(app, /function getAgentTacticalDossier/);
    assert.match(app, /function renderAgentDossier/);
    assert.match(app, /data-synergy-agent-id=/);
    assert.match(app, /agent-coa-bars/);
    assert.match(app, /agent-synergy-map/);
    assert.match(app, /is-opfor/);
    assert.match(css, /\.agent-formation-grid/);
    assert.match(css, /\.agent-filter-controls/);
    assert.match(css, /\.agent-attribute-grid/);
    assert.match(css, /\.agent-dossier-grid/);
    assert.match(css, /\.agent-coa-bars/);
    assert.match(css, /\.agent-synergy-map/);
    assert.match(css, /\.agent-profile-panel/);
    assert.match(css, /\.agent-card\.is-opfor/);
  });

  it("supports interactive failure-path and decision-card analysis surfaces", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "failureLensPanel",
      "riskMetricMatrix",
      "mitigationBoard",
      "decisionScoreboard",
      "commanderChecklist",
      "decisionTracePanel"
    ].forEach((id) => assert.match(html, new RegExp(`id="${id}"`), `${id} is missing`));

    [
      "function getFailureProfile",
      "function selectFailurePath",
      "function renderFailureLens",
      "function renderRiskMetricMatrix",
      "function renderMitigationBoard",
      "function renderDecisionScoreboard",
      "function renderCommanderChecklist",
      "function renderDecisionTracePanel"
    ].forEach((signature) => assert.match(app, new RegExp(signature)));

    assert.match(app, /selectedFailureId/);
    assert.match(app, /data-failure-id=/);
    assert.match(app, /data-decision-evidence-id=/);
    assert.match(css, /\.failure-lens-grid/);
    assert.match(css, /\.risk-metric-matrix/);
    assert.match(css, /\.mitigation-board/);
    assert.match(css, /\.decision-scoreboard/);
    assert.match(css, /\.commander-checklist/);
    assert.match(css, /\.decision-trace-panel/);
  });

  it("explains the failure-path page in plain operational language", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "riskGuideStrip",
      "selectedFailureStory",
      "문제가 실제 실패로 번지는 순서",
      "어디서 막아야 하는가",
      "우선 막아야 할 문제 흐름",
      "바로 막는 조치"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getFailurePlainLabel",
      "function getFailureCommanderQuestion",
      "function getFailureStory",
      "function renderSelectedFailureStory",
      "막을 지점",
      "놓치면"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".risk-guide-strip",
      ".selected-failure-story",
      ".failure-step-type",
      ".risk-item-plain",
      ".failure-action-card"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("makes every main page self-explanatory with simple guide strips", () => {
    const html = readText("index.html");
    const css = readText("styles.css");

    [
      "dataGuideStrip",
      "graphGuideStrip",
      "agentsGuideStrip",
      "rehearsalGuideStrip",
      "decisionGuideStrip",
      "무엇을 뽑았나",
      "근거가 어디에 연결됐나",
      "누가 무엇을 검토하나",
      "언제 문제가 터지나",
      "무엇을 승인할까"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      ".page-guide-strip",
      ".page-guide-strip article",
      ".page-guide-strip span"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("uses person-style profile icons for virtual unit agents", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function renderAgentPortrait",
      "personIcon",
      "data-lucide=\"${profile.personIcon}\"",
      "user-round",
      "shield-user",
      "user-cog",
      "user-check"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".agent-portrait i",
      ".agent-portrait i svg",
      ".agent-portrait b",
      ".agent-portrait::before",
      "content: none"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("includes the VISTA-inspired local Three.js rehearsal runtime", () => {
    assert.equal(existsSync(join(root, "war-ground-3d.js")), true);
    assert.equal(existsSync(join(root, "vendor/three/three.module.js")), true);
    assert.equal(existsSync(join(root, "vendor/three/three.core.js")), true);
    assert.equal(existsSync(join(root, "vendor/three/GLTFLoader.js")), true);
    assert.equal(existsSync(join(root, "vendor/utils/BufferGeometryUtils.js")), true);
    [
      "assets/vista-models/low_poly_f-15.glb",
      "assets/vista-models/south_korean_km900_apc.glb",
      "assets/vista-models/artillery_shell.glb",
      "assets/vista-models/low_poly_cargo_container.glb"
    ].forEach((file) => assert.equal(existsSync(join(root, file)), true, `${file} is missing`));

    const runtime = readText("war-ground-3d.js");
    [
      "import * as THREE",
      "function initWarGround3dScene",
      "function updateWarGround3dEvent",
      "window.WarGround3D"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing`));
  });

  it("uses real VISTA Seungjin terrain tiles for the 3D rehearsal surface", () => {
    [
      "ref/VISTA/client/public/offline-map/seungjin/manifest.json",
      "ref/VISTA/client/public/offline-map/seungjin/raster/satellite/14/13988/6315.jpg",
      "ref/VISTA/client/public/offline-map/seungjin/terrain/terrarium/14/13988/6315.png",
      "assets/vista-terrain/seungjin-satellite-z14-x13986-13990-y6313-6317.png",
      "assets/vista-terrain/seungjin-dem-grid-z14-x13986-13990-y6313-6317.json",
      "assets/vista-terrain/seungjin-real-terrain-source.json"
    ].forEach((file) => assert.equal(existsSync(join(root, file)), true, `${file} is missing`));

    const source = readJson("assets/vista-terrain/seungjin-real-terrain-source.json");
    const dem = readJson("assets/vista-terrain/seungjin-dem-grid-z14-x13986-13990-y6313-6317.json");
    const terrain = readJson("mock-data/terrain_rehearsal.json");
    assert.equal(source.sourceManifest, "ref/VISTA/client/public/offline-map/seungjin/manifest.json");
    assert.equal(source.terrariumFormula, "heightMeters = R * 256 + G + B / 256 - 32768");
    assert.equal(source.tileSet.zoom, 14);
    assert.equal(source.tileSet.tileCount, 5);
    assert.equal(dem.encoding, "terrarium");
    assert.equal(dem.gridSize, 129);
    assert.equal(dem.rows.length, dem.gridSize);
    assert.equal(dem.rows[0].length, dem.gridSize);
    assert.ok(dem.maxElevationM - dem.minElevationM > 400);
    assert.equal(terrain.real_terrain_source.encoding, "terrarium");
    assert.equal(terrain.real_terrain_source.dem_grid, source.demGrid);

    const runtime = readText("war-ground-3d.js");
    [
      "const realTerrainSource",
      "function loadRealTerrainData",
      "function sampleRealTerrainHeight",
      "satelliteTexture",
      "demGrid"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing`));
  });

  it("adds a VISTA-style 3D asset operations workspace", () => {
    const html = readText("index.html");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "assetCommandRail",
      "assetPaletteList",
      "placementModeButton",
      "moveAssetModeButton",
      "cameraControlStack",
      "layerControlStack",
      "selectedAssetInspector",
      "data-camera-mode=\"target_observe\"",
      "data-camera-mode=\"drone_follow\"",
      "data-camera-mode=\"ground_move\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "const editableAssetTemplates",
      "function renderAssetCommandRail",
      "function addEditableAsset",
      "function selectEditableAsset",
      "function moveSelectedAssetToPoint",
      "function setCameraOrbitMode",
      "raycaster: new THREE.Raycaster()",
      "layerVisibility",
      "editableAssetCount",
      "selectedEditableAssetId",
      "const vistaModelCatalog",
      "function cloneCachedVistaModel",
      "vistaModelLoadState",
      "vistaModelIds"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".asset-command-rail",
      ".asset-palette-list",
      ".asset-edit-toolbar",
      ".selected-asset-inspector",
      ".camera-control-stack",
      ".layer-control-stack",
      ".placement-mode"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("loads battlefield units from VISTA terrain-3d GLB bundles", () => {
    [
      "ref/VISTA/client/public/3d-bundles/artillery/models/k9_thunder_artillery.glb",
      "ref/VISTA/client/public/3d-bundles/tank/models/k2_black_panther_tank.glb",
      "ref/VISTA/client/public/3d-bundles/tank/models/k21_armored_warfare.glb",
      "ref/VISTA/client/public/3d-bundles/tank/models/t-80u_tank.glb",
      "ref/VISTA/client/public/3d-bundles/infrastructure/models/target_mannequin_cluster.glb",
      "ref/VISTA/client/public/3d-bundles/drone/models/drone.glb"
    ].forEach((file) => assert.equal(existsSync(join(root, file)), true, `${file} is missing`));

    const runtime = readText("war-ground-3d.js");
    [
      "./ref/VISTA/client/public/3d-bundles/artillery/models/k9_thunder_artillery.glb",
      "./ref/VISTA/client/public/3d-bundles/tank/models/k2_black_panther_tank.glb",
      "./ref/VISTA/client/public/3d-bundles/tank/models/k21_armored_warfare.glb",
      "./ref/VISTA/client/public/3d-bundles/tank/models/t-80u_tank.glb",
      "./ref/VISTA/client/public/3d-bundles/infrastructure/models/target_mannequin_cluster.glb",
      "./ref/VISTA/client/public/3d-bundles/drone/models/drone.glb",
      "K9A1 포대 1",
      "K2 전차 소대",
      "K21 보조 표적",
      "T-80U 전차 표적",
      "9번 표적 더미",
      "정찰 드론 편대",
      "root.position.set(-center.x * scale",
      "root.position.set(-center.x * scale, 0, -center.z * scale)",
      "alignModelRootToGround(root)"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));
  });

  it("scores asset placement quality with terrain, comms, route, and threat cues", () => {
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "const placementCandidateSlots",
      "function analyzeAssetPlacement",
      "function renderPlacementScorecard",
      "function createAssetInfluenceOverlay",
      "function refreshAssetInfluenceOverlay",
      "function recommendPlacementForSelectedAsset",
      "function applyPlacementCandidate",
      "placementScore",
      "placementCandidates",
      "assetInfluenceOverlay"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".asset-placement-scorecard",
      ".asset-placement-factors",
      ".asset-candidate-list",
      ".asset-placement-summary",
      ".asset-score-pill"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("replays VISTA focus-fire strike effects with armor assets", () => {
    const runtime = readText("war-ground-3d.js");
    [
      "const focusFireEffectTextures",
      "textures/focus-fire/launch_muzzle.png",
      "textures/focus-fire/trail_smoke.png",
      "textures/focus-fire/impact_flash.png",
      "textures/focus-fire/impact_dust.png",
      "textures/focus-fire/impact_smoke.png",
      "const strikeReplayTimeline",
      "function createProceduralArmorModel",
      "function createFocusFireSprite",
      "function createFocusFireStrikeEffect",
      "function deployStrikeReplayAssets",
      "strikeReplayStartedAt",
      "armor",
      "tank"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));
  });

  it("adds a live strike telemetry panel for focus-fire replay", () => {
    const html = readText("index.html");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "strikeTelemetryPanel",
      "strikeTelemetryState",
      "strikeProgressMeter",
      "strikeImpactEta",
      "strikeTimelineSteps",
      "strikeBdaReadout",
      "strikeAssetReadout"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getStrikeReplayPhase",
      "function getStrikeImpactEta",
      "function getStrikeBdaEstimate",
      "function renderStrikeTelemetry",
      "data-strike-step",
      "strikeTelemetryState",
      "strikeTimelineActiveStep",
      "strikeImpactEta",
      "strikeBdaEstimate"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".strike-telemetry-panel",
      ".strike-engagement-strip",
      ".strike-progress-meter",
      ".strike-timeline-steps",
      ".strike-step",
      ".strike-bda-readout",
      ".strike-asset-readout"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("animates combat replay units and keeps VISTA models visible", () => {
    const runtime = readText("war-ground-3d.js");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "const combatReplayAssetIds",
      "const VISTA_MODEL_VISIBILITY_SCALE",
      "function createCombatVisibilityMarker",
      "function refreshCombatVisibilityMarker",
      "function createCombatReplayRouteCue",
      "function animateCombatReplay",
      "combatReplayActive",
      "combatReplayPhase",
      "combatReplayUnits"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      "blue_tank_platoon",
      "blue_k21_support",
      "blue_fire_battery",
      "red_tank_block",
      "enemy_delay_cell",
      "air_patrol"
    ].forEach((assetId) => assert.ok(runtime.includes(assetId), `${assetId} must be part of combat replay`));

    [
      ".strike-telemetry-panel.is-compact",
      "max-height: 184px",
      "overflow-y: auto",
      ".war-ground-3d-shell.is-combat-replay"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    [
      "function playStrikeReplay",
      "clearTimer(\"rehearsalTimer\")",
      "타격 재생"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("supports zoomable 3D rehearsal and radio-style multi-agent debate alerts", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "warGroundZoomControls",
      "data-camera-zoom=\"in\"",
      "data-camera-zoom=\"out\"",
      "agentRadioOverlay",
      "agentRadioLog"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "const rehearsalRadioScripts",
      "function getRehearsalSimulationReadout",
      "function getRadioScriptForEvent",
      "function queueRadioTransmission",
      "function renderAgentRadioLog",
      "function triggerRadioTrafficForEvent",
      "function clearRadioTraffic",
      "data-radio-evidence-id",
      "무전"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "function zoomCameraByFactor",
      "function setCameraZoom",
      "data-camera-zoom",
      "wheel",
      "cameraZoomLevel"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".agent-radio-overlay",
      ".agent-radio-toast",
      ".agent-radio-log",
      ".war-ground-zoom-controls",
      ".rehearsal-friction-banner",
      ".rehearsal-sim-readout"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps the 3D rehearsal visualization professional and low-clutter", () => {
    const app = readText("app.js");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "const REHEARSAL_EVENT_DURATION_MS = 4200",
      "REHEARSAL_EVENT_DURATION_MS / state.rehearsalSpeed"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "const STRIKE_REPLAY_DURATION_SECONDS = 36",
      "const PROFESSIONAL_LABEL_SCALE",
      "ctx.roundRect",
      "rgba(6, 12, 13, 0.72)",
      "700 15px sans-serif",
      "sprite.scale.set(PROFESSIONAL_LABEL_SCALE",
      "const PROFESSIONAL_MARKER_OPACITY",
      "const VISTA_MODEL_VISIBILITY_SCALE = 0.68",
      "const DEFAULT_VISTA_SCENARIO_VISIBLE = true",
      "function isVistaStage27Unit(unit)",
      "function shouldShowUnitByDefault(unit)",
      "function getUnitTerrainLift(unit)",
      "return unit?.kind === \"air\" ? unit.altitude || 8 : 0;",
      "function alignModelRootToGround(root)",
      "root.position.y -= scaledBox.min.y;",
      "runtime.renderer.setClearColor(0x8ea293, 1)",
      "runtime.scene.fog = null",
      "duration: STRIKE_REPLAY_DURATION_SECONDS",
      "targetSize: 1.35"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      "/* Professional 3D visualization layer */",
      "--ops-glass",
      "--ops-border",
      ".war-ground-3d-shell::after",
      "/* Clear VISTA viewport: no dark vignette */",
      "background: none;",
      ".war-ground-3d-shell.is-combat-replay .asset-command-rail",
      ".strike-telemetry-panel.is-compact",
      "max-height: 92px",
      ".agent-radio-overlay"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from professional 3D CSS`));
  });

  it("ports the VISTA Seungjin stage-27 final assault into strike replay", () => {
    const runtime = readText("war-ground-3d.js");

    [
      "const VISTA_SEUNGJIN_STAGE_27_REPLAY",
      "stage-27-final-ground-assault-flag",
      "ref/VISTA/client/src/scenarios/seungjinTrainingSequence/stages/stage27.ts",
      "지상장비운용 및 종료",
      "1차 이동 K2 전차·K21 장갑차 7·5·6번 표적 돌격",
      "3차 이동 군집드론 전방비행 후 K2·K21 전방 돌진",
      "4차 이동 후속 전차중대 전방 진격 및 녹색신호탄 발사",
      "boeing_ah-64d_apache_combat_helicopter.glb",
      "stage27_apache_rocket",
      "stage27_swarm_drone",
      "stage27_follow_on_k2",
      "stage27_green_finale",
      "const STRIKE_REPLAY_DURATION_SECONDS = 36",
      "atSeconds: 32",
      "Green Smoke Signal Flare",
      "function renderVistaScenarioRail",
      "data-stage-action"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".vista-scenario-card",
      ".vista-stage-action",
      ".vista-action-time"
    ].forEach((signature) => assert.ok(readText("styles.css").includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps scenario, failure path, and decision data aligned", () => {
    const plan = readJson("mock-data/operation_plan.json");
    const coas = readJson("mock-data/coa_options.json");
    const agents = readJson("mock-data/agents.json");
    const events = readJson("mock-data/event_timeline.json");
    const failures = readJson("mock-data/failure_paths.json");
    const terrain = readJson("mock-data/terrain_rehearsal.json");
    const decision = readJson("mock-data/decision_card.json");

    assert.equal(plan.operation_name, "대대급 야간 기동훈련");
    assert.deepEqual(coas.map((coa) => coa.id), ["A", "B", "C"]);
    assert.equal(agents.length, 23);
    assert.ok(events.some((event) => event.time === "04:08" && event.severity === "high"));
    assert.deepEqual(failures.map((path) => path.title), ["지휘공백", "작전 지속성 저하", "사고 대응 지연", "재판단 지연"]);
    assert.equal(terrain.training_area.name, "승진훈련장");
    assert.deepEqual(terrain.training_area.center, { latitude: 38.07775, longitude: 127.354386 });
    assert.ok(terrain.units.length >= 8);
    assert.ok(terrain.terrain_layers.some((layer) => layer.key === "steep"));
    assert.equal(decision.recommended_coa, "B안 우선");
    assert.equal(decision.command_authority_notice, "AI 생성 검토안 / 지휘관 검토 필요");
  });

  it("keeps agent, failure-path, and decision-card content concise and actionable", () => {
    const agents = readJson("mock-data/agents.json");
    const failures = readJson("mock-data/failure_paths.json");
    const decision = readJson("mock-data/decision_card.json");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(agents.every((agent) => agent.review_output && agent.handoff), "agents need review_output and handoff");
    assert.equal(
      new Set(agents.map((agent) => agent.review_output)).size,
      agents.length,
      "agent outputs should be role-specific, not repeated labels"
    );

    for (const failure of failures) {
      ["summary", "driver", "decision_point", "early_warning"].forEach((field) => {
        assert.equal(typeof failure[field], "string", `${failure.id}.${field} is required`);
        assert.ok(failure[field].length >= 4, `${failure.id}.${field} is too short`);
      });
      assert.ok(Array.isArray(failure.mitigation_steps), `${failure.id}.mitigation_steps is required`);
      assert.ok(failure.mitigation_steps.length >= 3, `${failure.id}.mitigation_steps needs at least 3 items`);
    }

    assert.equal(typeof decision.decision_statement, "string");
    assert.ok(decision.decision_statement.includes(decision.recommended_coa));
    assert.ok(Array.isArray(decision.conditions) && decision.conditions.length >= 3);
    assert.ok(Array.isArray(decision.watch_items) && decision.watch_items.length >= 3);
    assert.deepEqual(
      decision.immediate_actions.filter((item) => decision.commander_check_items.includes(item)),
      [],
      "commander checks should not duplicate immediate actions"
    );

    [
      "agent-output-list",
      "failure-summary",
      "failure-pivot-strip",
      "decision-statement",
      "decision-condition-list",
      "watch-item-list"
    ].forEach((signature) => {
      assert.ok(app.includes(signature), `${signature} is missing from app.js`);
      assert.ok(css.includes(signature), `${signature} is missing from styles.css`);
    });
  });

  it("does not duplicate failure or card rendering data across the decision surface", () => {
    const decision = readJson("mock-data/decision_card.json");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.equal("failure_paths" in decision, false, "decision card should derive failure paths from failure_paths.json");
    assert.doesNotMatch(app, /failure_paths:\s*\[/, "inline decision data should not duplicate failure scores");

    [
      "function renderInfoTiles",
      "function renderActionList",
      "function getDecisionFailureSummary",
      "function getDecisionConditions"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    assert.ok(app.includes("renderInfoTiles(\"agent-output-list\""), "agent outputs should use shared tile renderer");
    assert.ok(app.includes("renderInfoTiles(\"failure-lens-grid\""), "failure lens should use shared tile renderer");
    assert.ok(app.includes("getDecisionFailureSummary()"), "decision scorecard should derive risk summary from failures");

    [
      ".hud-tile",
      ".hud-action-list",
      ".decision-condition-list .hud-tile",
      ".agent-output-list .hud-tile"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("applies a clean presentation layer for simple readable demo screens", () => {
    const css = readText("styles.css");

    [
      "/* Clean presentation layer */",
      "--clean-surface",
      "--clean-border",
      "clip-path: none",
      "border-radius: 8px",
      ".noise-layer {",
      "display: none",
      ".workspace-tab.is-active",
      ".hard-panel",
      ".hud-tile"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from clean design CSS`));

    assert.ok(
      css.includes("box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24)"),
      "clean layer should use a restrained shadow token"
    );
  });
});
