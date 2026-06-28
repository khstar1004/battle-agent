import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const STAGE_27_LOCAL_EAST_SCALE_METERS = 16;
const STAGE_27_LOCAL_NORTH_SCALE_METERS = 36.9;
const STAGE_27_LOCAL_NORTH_ORIGIN_METERS = 234;

function stage27LocalPoint(northMeters, eastMeters) {
  return [
    Number((eastMeters / STAGE_27_LOCAL_EAST_SCALE_METERS).toFixed(2)),
    Number(((northMeters - STAGE_27_LOCAL_NORTH_ORIGIN_METERS) / STAGE_27_LOCAL_NORTH_SCALE_METERS).toFixed(2))
  ];
}

const stage27Points = {
  routeAStart: stage27LocalPoint(-390, -90),
  routeA1Start: stage27LocalPoint(-430, -310),
  routeBStart: stage27LocalPoint(-360, 175),
  target5: stage27LocalPoint(630, -20),
  target6: stage27LocalPoint(785, 200),
  target7: stage27LocalPoint(925, 185),
  target9: stage27LocalPoint(1010, 45),
  airIngressEast: stage27LocalPoint(-340, 360),
  forwardDroneLine: stage27LocalPoint(760, 60),
  forwardDroneObjective: stage27LocalPoint(1020, 95),
  centerLakeLower: stage27LocalPoint(90, -35),
  greenFinale: stage27LocalPoint(520, 40),
  flagPoint: stage27LocalPoint(580, 20)
};

const VISTA_SEUNGJIN_STAGE_27_REPLAY = {
  sequenceId: "seungjin-training-sequence",
  stageId: "stage-27-final-ground-assault-flag",
  sourcePath: "ref/VISTA/client/src/scenarios/seungjinTrainingSequence/stages/stage27.ts",
  title: "지상장비운용 및 종료",
  assetSummary: "K2/K21 5·6·7번 표적 돌격, AH-64E 9번 표적 이동·로켓, 군집드론 전방비행, 후속 전차중대 녹색신호탄",
  missionSummary: "K2 전차와 K21 장갑차가 5·6·7번 표적으로 돌격하고, AH-64E가 9번 표적으로 이동해 로켓을 발사한 뒤 군집드론과 후속 전차중대가 전방으로 진격",
  actions: [
    { id: "armor-assault", atSeconds: 4, label: "1차 이동 K2 전차·K21 장갑차 7·5·6번 표적 돌격", assetId: "stage27_k2_assault", brief: "K2/K21 5·6·7번 표적 진입" },
    { id: "k2-k21-live-fire", atSeconds: 8, label: "1차 타격 K21 6번 표적 포격·K2 7번 표적 폭격", assetId: "stage27_k21_assault", brief: "40mm·120mm 동시 사격" },
    { id: "apache-move", atSeconds: 12, label: "2차 이동 AH-64E 아파치 9번 표적 이동", assetId: "stage27_apache_rocket", brief: "AH-64E 공격축 진입" },
    { id: "blank-cover", atSeconds: 16, label: "2차 타격 K2·K21 공포탄 사격", assetId: "stage27_k2_assault", brief: "공포탄 엄호사격 지속" },
    { id: "apache-rocket", atSeconds: 20, label: "3차 타격 AH-64E 로켓 9번 표적 포격", assetId: "stage27_apache_rocket", brief: "2.75-inch Hydra Rocket" },
    { id: "drone-and-armor-push", atSeconds: 24, label: "3차 이동 군집드론 전방비행 후 K2·K21 전방 돌진", assetId: "stage27_swarm_drone", brief: "군집드론 전방비행" },
    { id: "follow-on-company-green-signal", atSeconds: 32, label: "4차 이동 후속 전차중대 전방 진격 및 녹색신호탄 발사", assetId: "stage27_follow_on_k2", brief: "Green Smoke Signal Flare" },
    { id: "final-bda", atSeconds: 35, label: "최종 지상장비 진격 및 녹색신호탄", assetId: "stage27_green_finale", brief: "태극기 계양 지점 확인" }
  ],
  assets: [
    "stage27_k2_assault",
    "stage27_k21_assault",
    "stage27_apache_rocket",
    "stage27_swarm_drone",
    "stage27_follow_on_k2",
    "stage27_green_finale"
  ]
};

const DEFAULT_VISTA_SCENARIO_VISIBLE = true;

const terrainData = {
  trainingArea: {
    name: "승진훈련장",
    center: { latitude: 38.07775, longitude: 127.354386 },
    widthKm: 7.4,
    depthKm: 5.1
  },
  routes: {
    coa_a: [[-26, -18], [-16, -7], [-6, 0], [8, 4], [25, 10]],
    coa_b: [[-27, -20], [-18, -17], [-8, -15], [5, -12], [18, -5], [27, 9]]
  },
  units: [
    { id: "blue_command", name: "대대 지휘차량", kind: "command", side: "blue", model: "tank-m577", position: [-24, -21], scale: 1 },
    { id: "blue_apc_1", name: "선두 장갑차 1", kind: "ground", side: "blue", model: "south_korean_km900_apc", route: "coa_b", routeOffset: 0, scale: 0.8 },
    { id: "blue_apc_2", name: "선두 장갑차 2", kind: "ground", side: "blue", model: "south_korean_km900_apc", route: "coa_b", routeOffset: -2.1, scale: 0.8 },
    { id: "relay_c1", name: "예비 중계팀 C1", kind: "relay", side: "blue", model: "infrastructure-tent", position: [-9, -8], scale: 0.82 },
    { id: "supply_point", name: "보급 대기점", kind: "supply", side: "blue", model: "low_poly_cargo_container", position: [3, -15], scale: 0.85 },
    { id: "blue_tank_platoon", name: "K2 전차 소대", kind: "tank", side: "blue", model: "tank-k2", position: [-15, -10], heading: 32, scale: 1 },
    { id: "blue_k21_support", name: "K21 보조 표적", kind: "ground", side: "blue", model: "tank-k21", position: [12, 6], heading: 205, scale: 0.92 },
    { id: "blue_fire_battery", name: "K9A1 포대 1", kind: "fire", side: "blue", model: "artillery-k9", position: [-13, 15], heading: 118, scale: 1 },
    { id: "red_tank_block", name: "T-80U 전차 표적", kind: "tank", side: "red", model: "tank-t80u", position: [8, 4], heading: 218, scale: 1 },
    { id: "enemy_delay_cell", name: "9번 표적 더미", kind: "enemy", side: "red", model: "target-mannequin-cluster", position: [6, 3], scale: 1 },
    { id: "air_patrol", name: "정찰 드론 편대", kind: "air", side: "blue", model: "drone-quad", position: [-12, 13], altitude: 12, scale: 0.8 },
    { id: "stage27_k2_assault", name: "1차 돌격 K2 전차", kind: "tank", side: "blue", model: "tank-k2", position: stage27Points.routeAStart, heading: 24, scale: 0.58, readiness: 88, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_k21_assault", name: "1차 돌격 K21 장갑차", kind: "ground", side: "blue", model: "tank-k21", position: stage27Points.routeBStart, heading: 26, scale: 0.56, readiness: 86, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_apache_rocket", name: "AH-64E 아파치 로켓 편대", kind: "air", side: "blue", model: "aircraft-apache", position: stage27Points.airIngressEast, heading: 292, altitude: 18, scale: 0.55, readiness: 84, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_swarm_drone", name: "최종 군집드론", kind: "air", side: "green", model: "drone-quad", position: stage27Points.forwardDroneLine, heading: 18, altitude: 9, scale: 0.34, readiness: 82, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_follow_on_k2", name: "후속 전차중대", kind: "tank", side: "green", model: "tank-k2", position: stage27Points.routeA1Start, heading: 28, scale: 0.54, readiness: 80, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_green_finale", name: "종료 녹색신호탄", kind: "objective", side: "green", model: "target-mannequin-cluster", position: stage27Points.greenFinale, heading: 0, scale: 0.34, readiness: 100, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_target_5", name: "5번 전차 돌격 표적", kind: "enemy", side: "red", model: "target-mannequin-cluster", position: stage27Points.target5, heading: 0, scale: 0.32, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_target_6", name: "6번 K21 포격 표적", kind: "enemy", side: "red", model: "target-mannequin-cluster", position: stage27Points.target6, heading: 0, scale: 0.32, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_target_7", name: "7번 K2 전차 폭격 표적", kind: "enemy", side: "red", model: "target-mannequin-cluster", position: stage27Points.target7, heading: 0, scale: 0.32, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "stage27_target_9", name: "9번 AH-64E 로켓 표적", kind: "enemy", side: "red", model: "target-mannequin-cluster", position: stage27Points.target9, heading: 0, scale: 0.32, replayOnly: true, sourceStageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId },
    { id: "objective_alpha", name: "목표 집결지", kind: "objective", side: "neutral", model: "target-mannequin-cluster", position: [27, 9], scale: 0.95 }
  ],
  eventOrder: ["start", "fog", "enemy_delay", "comm_gap", "supply_gap", "criteria_gap", "reserve_delay", "b_stabilized"],
  eventBindings: {
    start: { focus: "blue_command", camera: "overview", visual: "route_compare", label: "작전 개시" },
    fog: { focus: "blue_apc_1", camera: "ground_move", visual: "fog_band", label: "새벽 안개" },
    enemy_delay: { focus: "enemy_delay_cell", camera: "enemy_delay_action", visual: "enemy_contact", label: "적 지연행동" },
    comm_gap: { focus: "relay_c1", camera: "comm_gap", visual: "comm_shadow", label: "통신 음영" },
    supply_gap: { focus: "supply_point", camera: "logistics", visual: "supply_warning", label: "보급 병목" },
    criteria_gap: { focus: "blue_command", camera: "command", visual: "decision_delay", label: "재판단 지연" },
    reserve_delay: { focus: "blue_apc_2", camera: "risk_chain", visual: "risk_chain", label: "예비대 지연" },
    b_stabilized: { focus: "objective_alpha", camera: "objective_focus", visual: "commander_result", label: "B안 안정성 확인" }
  }
};

const modelPaths = {
  "low_poly_f-15": "./assets/vista-models/low_poly_f-15.glb",
  south_korean_km900_apc: "./assets/vista-models/south_korean_km900_apc.glb",
  artillery_shell: "./assets/vista-models/artillery_shell.glb",
  low_poly_cargo_container: "./assets/vista-models/low_poly_cargo_container.glb"
};

const vistaModelCatalog = {
  "artillery-k9": {
    path: "./assets/vista-bundles/artillery/models/k9_thunder_artillery.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.65
  },
  "artillery-paladin": {
    path: "./assets/vista-bundles/artillery/models/m109a6_paladin_self-propelled_howitzer.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.6
  },
  "tank-k2": {
    path: "./assets/vista-bundles/tank/models/k2_black_panther_tank.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.42,
    materialCorrection: "remove-uniform-white-emissive"
  },
  "tank-k21": {
    path: "./assets/vista-bundles/tank/models/k21_armored_warfare.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.35
  },
  "tank-t80u": {
    path: "./assets/vista-bundles/tank/models/t-80u_tank.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.46
  },
  "tank-m577": {
    path: "./assets/vista-bundles/tank/models/m577_command_vehicle.glb",
    axis: "gltf-y-up-x-forward",
    targetSize: 1.22
  },
  "infrastructure-tent": {
    path: "./assets/vista-bundles/infrastructure/models/military_tent_hangar.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.9
  },
  "target-mannequin-cluster": {
    path: "./assets/vista-bundles/infrastructure/models/target_mannequin_cluster.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 0.72
  },
  "drone-quad": {
    path: "./assets/vista-bundles/drone/models/drone.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 0.62
  },
  "aircraft-apache": {
    path: "./assets/vista-bundles/aircraft/models/boeing_ah-64d_apache_combat_helicopter.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 1.05
  },
  "robotics-quadruped": {
    path: "./assets/vista-bundles/robotics/models/quadruped_ground_robot.glb",
    axis: "gltf-y-up-y-forward",
    targetSize: 0.6
  }
};

const vistaModelIds = Object.keys(vistaModelCatalog);
const vistaModelLoadCache = new Map();

const focusFireEffectTextures = {
  launchMuzzle: "./assets/vista-bundles/effects/textures/focus-fire/launch_muzzle.png",
  trailTrace: "./assets/vista-bundles/effects/textures/focus-fire/trail_trace.png",
  trailSmoke: "./assets/vista-bundles/effects/textures/focus-fire/trail_smoke.png",
  headGlow: "./assets/vista-bundles/effects/textures/focus-fire/head_glow.png",
  impactFlash: "./assets/vista-bundles/effects/textures/focus-fire/impact_flash.png",
  impactDust: "./assets/vista-bundles/effects/textures/focus-fire/impact_dust.png",
  impactSmoke: "./assets/vista-bundles/effects/textures/focus-fire/impact_smoke.png"
};

const STRIKE_REPLAY_DURATION_SECONDS = 36;
const REHEARSAL_ACTION_SLOT_SECONDS = 4.2;
const strikeReplayTimeline = VISTA_SEUNGJIN_STAGE_27_REPLAY.actions.map((action) => ({
  ...action,
  at: action.atSeconds / STRIKE_REPLAY_DURATION_SECONDS
}));

const combatReplayAssetIds = [
  ...VISTA_SEUNGJIN_STAGE_27_REPLAY.assets,
  "stage27_target_5",
  "stage27_target_6",
  "stage27_target_7",
  "stage27_target_9"
];
const VISTA_MODEL_VISIBILITY_SCALE = 0.68;
const PROFESSIONAL_LABEL_SCALE = [1.85, 0.42, 1];
const PROFESSIONAL_MARKER_OPACITY = 0.32;

const combatReplayMotionPlan = {
  stage27_k2_assault: {
    start: stage27Points.routeAStart,
    end: stage27Points.target7,
    headingStart: 24,
    headingEnd: 28,
    phaseStart: 4 / STRIKE_REPLAY_DURATION_SECONDS,
    phaseEnd: 24 / STRIKE_REPLAY_DURATION_SECONDS,
    altitude: 0.64
  },
  stage27_k21_assault: {
    start: stage27Points.routeBStart,
    end: stage27Points.target6,
    headingStart: 26,
    headingEnd: 32,
    phaseStart: 4 / STRIKE_REPLAY_DURATION_SECONDS,
    phaseEnd: 24 / STRIKE_REPLAY_DURATION_SECONDS,
    altitude: 0.64
  },
  stage27_apache_rocket: {
    start: stage27Points.airIngressEast,
    end: stage27Points.target9,
    headingStart: 292,
    headingEnd: 318,
    phaseStart: 12 / STRIKE_REPLAY_DURATION_SECONDS,
    phaseEnd: 20 / STRIKE_REPLAY_DURATION_SECONDS,
    altitude: 18
  },
  stage27_swarm_drone: {
    start: stage27Points.forwardDroneLine,
    end: stage27Points.forwardDroneObjective,
    headingStart: 18,
    headingEnd: 24,
    phaseStart: 24 / STRIKE_REPLAY_DURATION_SECONDS,
    phaseEnd: 32 / STRIKE_REPLAY_DURATION_SECONDS,
    altitude: 11
  },
  stage27_follow_on_k2: {
    start: stage27Points.routeA1Start,
    end: stage27Points.greenFinale,
    headingStart: 24,
    headingEnd: 34,
    phaseStart: 32 / STRIKE_REPLAY_DURATION_SECONDS,
    phaseEnd: 35 / STRIKE_REPLAY_DURATION_SECONDS,
    altitude: 0.64
  },
  stage27_green_finale: {
    start: stage27Points.greenFinale,
    end: stage27Points.greenFinale,
    headingStart: 0,
    headingEnd: 0,
    phaseStart: 32 / STRIKE_REPLAY_DURATION_SECONDS,
    phaseEnd: 1,
    altitude: 0.58
  },
  stage27_target_5: {
    start: stage27Points.target5,
    end: stage27Points.target5,
    headingStart: 0,
    headingEnd: 0,
    phaseStart: 0,
    phaseEnd: 1,
    altitude: 0.58
  },
  stage27_target_6: {
    start: stage27Points.target6,
    end: stage27Points.target6,
    headingStart: 0,
    headingEnd: 0,
    phaseStart: 0,
    phaseEnd: 1,
    altitude: 0.58
  },
  stage27_target_7: {
    start: stage27Points.target7,
    end: stage27Points.target7,
    headingStart: 0,
    headingEnd: 0,
    phaseStart: 0,
    phaseEnd: 1,
    altitude: 0.58
  },
  stage27_target_9: {
    start: stage27Points.target9,
    end: stage27Points.target9,
    headingStart: 0,
    headingEnd: 0,
    phaseStart: 0,
    phaseEnd: 1,
    altitude: 0.58
  }
};

const rehearsalActionPlans = {
  start: {
    label: "기동 출발",
    visibleAction: "기동 진행",
    duration: 4.4,
    tacticalActions: ["기동 진행", "경로 점령"],
    movementTrails: true,
    artilleryArcs: false,
    movement: [
      { assetId: "blue_command", routeId: "coa_b", from: 0.01, to: 0.09, offset: -1.4, startAt: 0.05, endAt: 0.82 },
      { assetId: "blue_apc_1", routeId: "coa_b", from: 0.04, to: 0.2, offset: 0, startAt: 0.04, endAt: 0.88 },
      { assetId: "blue_apc_2", routeId: "coa_b", from: 0.01, to: 0.16, offset: -2.1, startAt: 0.1, endAt: 0.94 }
    ],
    fires: []
  },
  fog: {
    label: "저속 이동",
    visibleAction: "기동 진행",
    duration: 4.2,
    tacticalActions: ["기동 진행", "시계 제한"],
    movementTrails: true,
    artilleryArcs: false,
    movement: [
      { assetId: "blue_apc_1", routeId: "coa_b", from: 0.2, to: 0.31, offset: 0, startAt: 0.04, endAt: 0.92 },
      { assetId: "air_patrol", start: [-12, 13], end: [-4, 8], altitude: 11, startAt: 0.08, endAt: 0.84 }
    ],
    fires: []
  },
  enemy_delay: {
    label: "대항군 지연 제압",
    visibleAction: "포격 진행",
    duration: 4.8,
    tacticalActions: ["포격 진행", "충격파", "기동 엄호"],
    movementTrails: true,
    artilleryArcs: true,
    movement: [
      { assetId: "blue_tank_platoon", start: [-15, -10], end: [-8, -4], startAt: 0.08, endAt: 0.78 },
      { assetId: "blue_k21_support", start: [12, 6], end: [16, 8], startAt: 0.14, endAt: 0.8 },
      { assetId: "red_tank_block", start: [8, 4], end: [9.4, 4.8], startAt: 0.12, endAt: 0.58 }
    ],
    fires: [
      { id: "k9-suppress-delay-cell", shooter: "blue_fire_battery", target: "enemy_delay_cell", fireAt: 0.16, impactAt: 0.56, color: 0xffbd4a },
      { id: "tank-direct-red-block", shooter: "blue_tank_platoon", target: "red_tank_block", fireAt: 0.36, impactAt: 0.68, color: 0x8fd9ff }
    ]
  },
  comm_gap: {
    label: "중계 재배치",
    visibleAction: "기동 진행",
    duration: 4.2,
    tacticalActions: ["기동 진행", "통신 복구"],
    movementTrails: true,
    artilleryArcs: false,
    movement: [
      { assetId: "relay_c1", start: [-9, -8], end: [-4, -2], startAt: 0.06, endAt: 0.88 },
      { assetId: "blue_command", routeId: "coa_b", from: 0.34, to: 0.4, offset: -1.2, startAt: 0.18, endAt: 0.78 }
    ],
    fires: []
  },
  supply_gap: {
    label: "보급축 전개",
    visibleAction: "기동 진행",
    duration: 4.2,
    tacticalActions: ["기동 진행", "보급 병목 우회"],
    movementTrails: true,
    artilleryArcs: false,
    movement: [
      { assetId: "supply_point", start: [3, -15], end: [7.8, -10.6], startAt: 0.08, endAt: 0.82 },
      { assetId: "blue_apc_2", routeId: "coa_b", from: 0.48, to: 0.58, offset: -2.1, startAt: 0.18, endAt: 0.92 }
    ],
    fires: []
  },
  criteria_gap: {
    label: "지휘소 판단 전환",
    visibleAction: "기동 진행",
    duration: 4.1,
    tacticalActions: ["기동 진행", "결심 기준 송신"],
    movementTrails: true,
    artilleryArcs: false,
    movement: [
      { assetId: "blue_command", routeId: "coa_b", from: 0.56, to: 0.63, offset: -1.2, startAt: 0.08, endAt: 0.74 },
      { assetId: "air_patrol", start: [-4, 8], end: [4, 10], altitude: 12, startAt: 0.12, endAt: 0.8 }
    ],
    fires: []
  },
  reserve_delay: {
    label: "예비대 엄호 포격",
    visibleAction: "포격 진행",
    duration: 4.4,
    tacticalActions: ["포격 진행", "충격파", "예비대 투입"],
    movementTrails: true,
    artilleryArcs: true,
    movement: [
      { assetId: "blue_apc_2", routeId: "coa_b", from: 0.6, to: 0.74, offset: -2.1, startAt: 0.1, endAt: 0.92 },
      { assetId: "blue_tank_platoon", start: [-8, -4], end: [1.5, 1.5], startAt: 0.16, endAt: 0.84 }
    ],
    fires: [
      { id: "reserve-cover-red-block", shooter: "blue_fire_battery", target: "red_tank_block", fireAt: 0.2, impactAt: 0.6, color: 0xffbd4a }
    ]
  },
  b_stabilized: {
    label: "목표 안정화",
    visibleAction: "기동 진행",
    duration: 4.6,
    tacticalActions: ["기동 진행", "목표 점령"],
    movementTrails: true,
    artilleryArcs: false,
    movement: [
      { assetId: "blue_apc_1", routeId: "coa_b", from: 0.78, to: 1, offset: 0, startAt: 0.06, endAt: 0.88 },
      { assetId: "blue_apc_2", routeId: "coa_b", from: 0.74, to: 0.96, offset: -2.1, startAt: 0.12, endAt: 0.94 },
      { assetId: "blue_command", routeId: "coa_b", from: 0.68, to: 0.9, offset: -1.2, startAt: 0.18, endAt: 0.9 }
    ],
    fires: []
  }
};

const editableAssetTemplates = [
  {
    id: "relay-team",
    name: "예비 중계팀",
    kind: "relay",
    side: "blue",
    model: "infrastructure-tent",
    scale: 0.74,
    readiness: 78,
    mobility: 42,
    sensor: 88,
    note: "통신 음영구간 보강"
  },
  {
    id: "km900-apc",
    name: "KM900 기동분대",
    kind: "ground",
    side: "blue",
    model: "south_korean_km900_apc",
    scale: 0.82,
    readiness: 84,
    mobility: 76,
    sensor: 52,
    note: "우회로 선점 및 엄호"
  },
  {
    id: "tank-platoon",
    name: "K2 전차 소대",
    kind: "tank",
    side: "blue",
    model: "tank-k2",
    scale: 1.05,
    readiness: 82,
    mobility: 70,
    sensor: 58,
    note: "타격 전 전방 엄호와 표적 압박"
  },
  {
    id: "fire-support-cell",
    name: "K9A1 포대",
    kind: "fire",
    side: "blue",
    model: "artillery-k9",
    scale: 0.9,
    readiness: 71,
    mobility: 36,
    sensor: 48,
    note: "표적 확인 후 효과 묘사"
  },
  {
    id: "opfor-tank-cell",
    name: "T-80U 전차 표적",
    kind: "tank",
    side: "red",
    model: "tank-t80u",
    scale: 1,
    readiness: 76,
    mobility: 61,
    sensor: 52,
    note: "협곡 입구 지연 및 차단"
  },
  {
    id: "opfor-delay-cell",
    name: "9번 표적 더미",
    kind: "enemy",
    side: "red",
    model: "target-mannequin-cluster",
    scale: 0.86,
    readiness: 69,
    mobility: 44,
    sensor: 65,
    note: "관측 사각과 병목 활용"
  },
  {
    id: "objective-marker",
    name: "목표 기준점",
    kind: "objective",
    side: "neutral",
    model: "target-mannequin-cluster",
    scale: 0.78,
    readiness: 100,
    mobility: 0,
    sensor: 100,
    note: "지휘관 결과 확인점"
  },
  {
    id: "k21-ifv",
    name: "K21 보조 표적",
    kind: "ground",
    side: "blue",
    model: "tank-k21",
    scale: 0.92,
    readiness: 79,
    mobility: 74,
    sensor: 56,
    note: "지상이동 관측 및 보조 표적"
  },
  {
    id: "drone-quad",
    name: "정찰 드론 편대",
    kind: "air",
    side: "blue",
    model: "drone-quad",
    scale: 0.8,
    readiness: 88,
    mobility: 90,
    sensor: 86,
    note: "VISTA 드론시점 현장관측"
  }
];

const assetModeLabels = {
  select: "선택 모드",
  place: "배치 모드",
  move: "이동 모드"
};

const kindLabels = {
  command: "지휘",
  ground: "기동",
  relay: "중계",
  supply: "군수",
  enemy: "대항군",
  air: "공중",
  objective: "목표",
  fire: "화력",
  tank: "전차",
  armor: "장갑"
};

const sideLabels = {
  blue: "아군",
  red: "대항군",
  neutral: "기준"
};

const realTerrainSource = {
  label: "VISTA 승진훈련장 실 지형",
  sourceManifest: "./ref/VISTA/client/public/offline-map/seungjin/manifest.json",
  satelliteTexture: "./assets/vista-terrain/seungjin-satellite-z14-x13986-13990-y6313-6317.png",
  demGrid: "./assets/vista-terrain/seungjin-dem-grid-z14-x13986-13990-y6313-6317.json",
  zoom: 14,
  tileRange: { xStart: 13986, xEnd: 13990, yStart: 6313, yEnd: 6317 },
  heightScale: 10.5,
  heightBase: -1.2
};

const cameraPresets = {
  overview: { position: [5, 32, 48], target: [2.5, 1.7, 4] },
  top: { position: [2.5, 62, 3.5], target: [2.5, 0, 3.5] },
  oblique: { position: [31, 25, 35], target: [3, 2, 6] },
  low_route: { position: [-20, 10, -27], target: [-2, 1.7, -8] },
  target_observe: { position: [12, 13, 31], target: [3.2, 2, 18.5] },
  enemy_delay_action: { position: [20, 13, 18], target: [7.2, 2.2, 4.8] },
  strike_replay: { position: [14, 9.5, 24], target: [4.2, 2.2, 12.5] },
  drone_follow: { position: [12, 18, 25], target: [4.4, 8, 14] },
  objective_focus: { position: [20, 17, 22], target: [2.5, 2.2, 7.75] },
  ground_move: { position: [-17, 9, -25], target: [-2, 1.6, -9] },
  threat: { position: [18, 16, 18], target: [4, 2, 3] },
  comm_gap: { position: [-18, 18, 8], target: [-6, 2.5, -1] },
  logistics: { position: [5, 17, -30], target: [7, 2, -10] },
  command: { position: [-31, 16, -25], target: [-12, 2, -12] },
  risk_chain: { position: [-4, 24, 34], target: [8, 2, -3] },
  commander_result: { position: [33, 22, 20], target: [13, 2, 0] }
};

const cameraModeLabels = {
  overview: "전체전장",
  top: "수직",
  oblique: "사선",
  low_route: "저각",
  target_observe: "표적관측",
  enemy_delay_action: "지연제압",
  strike_replay: "타격재생",
  drone_follow: "드론추적",
  objective_focus: "목표중심",
  ground_move: "지상이동",
  threat: "표적관측",
  comm_gap: "통신 음영",
  logistics: "군수",
  command: "지휘",
  risk_chain: "위험 연결",
  commander_result: "지휘관 결과",
  free: "자유 관측"
};

const placementCandidateSlots = [
  {
    id: "relay-ridge-west",
    label: "서측 능선 중계점",
    position: [-8, -2],
    preferredKinds: ["relay", "command"],
    brief: "통신 음영과 우회축 사이를 잇는 능선 중계 후보"
  },
  {
    id: "route-cover-south",
    label: "남측 우회 엄호점",
    position: [11, -7],
    preferredKinds: ["ground", "tank", "fire"],
    brief: "B안 우회로와 목표 접근로를 동시에 감시"
  },
  {
    id: "fire-ridge-north",
    label: "북측 화력 기준점",
    position: [-12, 14],
    preferredKinds: ["fire", "air"],
    brief: "표적 셀까지 사선이 짧고 아군 경로와 분리"
  },
  {
    id: "objective-screen-east",
    label: "목표 동측 차단점",
    position: [22, 7],
    preferredKinds: ["ground", "tank", "objective"],
    brief: "목표 직전 병목을 통제하는 차단 후보"
  },
  {
    id: "opfor-delay-neck",
    label: "대항군 지연 목",
    position: [7, 3],
    preferredKinds: ["enemy", "tank"],
    brief: "아군 진행축이 좁아지는 지점의 대항군 후보"
  }
];

const runtime = {
  canvas: null,
  renderer: null,
  scene: null,
  camera: null,
  clock: new THREE.Clock(),
  loader: new GLTFLoader(),
  textureLoader: new THREE.TextureLoader(),
  animationId: 0,
  playing: false,
  speed: 1,
  initialized: false,
  currentEventId: "start",
  routeProgress: 0,
  cameraTarget: new THREE.Vector3(0, 1, 0),
  cameraPosition: new THREE.Vector3(0, 33, 42),
  terrain: null,
  overlays: {},
  units: new Map(),
  routeLines: new Map(),
  labels: [],
  effects: [],
  vistaModelLoadState: {},
  commanderBeam: null,
  realTerrain: null,
  realTerrainLoadState: "idle",
  raycaster: new THREE.Raycaster(),
  pointer: new THREE.Vector2(),
  pointerDown: null,
  controlsBound: false,
  placementMode: "select",
  placementTemplateId: "relay-team",
  editableAssets: new Map(),
  selectedEditableAssetId: null,
  assetSerial: 1,
  selectionMarker: null,
  assetInfluenceOverlay: null,
  assetInfluenceLastRefresh: 0,
  placementScore: null,
  placementCandidates: [],
  cameraMode: "overview",
  cameraZoomLevel: 1,
  cameraDragMode: "orbit",
  mapFocusMode: true,
  modifierKeys: {
    ctrl: false,
    shift: false
  },
  strikeReplayStartedAt: 0,
  strikeTelemetryState: "대기",
  strikeTimelineActiveStep: "standby",
  strikeTelemetryLastRender: 0,
  combatReplayActive: false,
  combatReplayPhase: "대기",
  combatReplayMarkers: new Map(),
  combatReplayRouteCues: new Map(),
  rehearsalActionState: "대기",
  rehearsalActionStartedAt: 0,
  rehearsalActionElapsed: 0,
  rehearsalActionProgress: 0,
  rehearsalActionActiveEventId: "start",
  rehearsalActionLayer: null,
  rehearsalActionProjectiles: new Map(),
  rehearsalActionTrails: new Map(),
  rehearsalActionParticipants: new Set(),
  rehearsalActionLastRender: 0,
  lastStableDelta: 0,
  lastScaledDelta: 0,
  layerVisibility: {
    routes: true,
    labels: true,
    effects: true,
    threat: true
  }
};

function setStatus(text) {
  const status = document.getElementById("warGround3dStatus");
  if (status) status.textContent = text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getAssetTemplate(templateId) {
  return editableAssetTemplates.find((template) => template.id === templateId) || editableAssetTemplates[0];
}

function getAssetTemplateForUnit(unit) {
  return (
    editableAssetTemplates.find((template) => template.id === unit.templateId) ||
    editableAssetTemplates.find((template) => template.model === unit.model && template.kind === unit.kind && template.side === unit.side) ||
    editableAssetTemplates.find((template) => template.model === unit.model && template.side === unit.side) ||
    editableAssetTemplates.find((template) => template.kind === unit.kind && template.side === unit.side) ||
    getAssetTemplate(runtime.placementTemplateId)
  );
}

function getAssetEntry(assetId = runtime.selectedEditableAssetId) {
  return assetId ? runtime.editableAssets.get(assetId) : null;
}

function getAssetTone(unit) {
  if (unit.side === "red") return "red";
  if (unit.side === "neutral" || unit.kind === "objective") return "amber";
  return "blue";
}

function isVistaStage27Unit(unit) {
  return unit?.sourceStageId === VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId || combatReplayAssetIds.includes(unit?.id);
}

function shouldShowUnitByDefault(unit) {
  if (unit?.userPlaced) return true;
  if (DEFAULT_VISTA_SCENARIO_VISIBLE) return isVistaStage27Unit(unit);
  return !unit?.replayOnly;
}

function setCombatReplayShellActive(active) {
  document.querySelector(".war-ground-3d-shell")?.classList.toggle("is-combat-replay", Boolean(active));
}

function setTacticalActionShellActive(active) {
  document.querySelector(".war-ground-3d-shell")?.classList.toggle("is-tactical-action", Boolean(active));
}

function getMapShell() {
  return document.getElementById("rehearsalMap") || document.querySelector(".war-ground-3d-shell");
}

const cameraDragModeLabels = {
  orbit: "궤도 관측",
  pan: "중심 이동",
  tilt: "고도 전환",
  precision: "정밀 관측"
};

function getCameraDragIntent(event = {}) {
  const hasCtrl = Boolean(event.ctrlKey || event.metaKey);
  const hasShift = Boolean(event.shiftKey);
  if (hasCtrl && hasShift) return "precision";
  if (hasCtrl) return "pan";
  if (hasShift) return "tilt";
  return "orbit";
}

function setCameraInteractionMode(mode = "orbit", active = false) {
  const intent = cameraDragModeLabels[mode] ? mode : "orbit";
  runtime.cameraDragMode = intent;
  const shell = getMapShell();
  if (shell) {
    shell.dataset.cameraDragMode = intent;
    shell.classList.toggle("is-camera-dragging", Boolean(active));
  }
  const label = document.getElementById("mapInteractionModeLabel");
  if (label) label.textContent = cameraDragModeLabels[intent];
}

function setMapFocusMode(active) {
  runtime.mapFocusMode = Boolean(active);
  getMapShell()?.classList.toggle("is-map-focus", runtime.mapFocusMode);
  document.querySelectorAll("[data-map-focus-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(runtime.mapFocusMode));
    button.textContent = runtime.mapFocusMode ? "통제판" : "관측 집중";
  });
  return runtime.mapFocusMode;
}

function toggleMapFocusMode() {
  return setMapFocusMode(!runtime.mapFocusMode);
}

function setCameraModifierState(event) {
  runtime.modifierKeys.ctrl = Boolean(event.ctrlKey || event.metaKey);
  runtime.modifierKeys.shift = Boolean(event.shiftKey);
  setCameraInteractionMode(
    getCameraDragIntent({
      ctrlKey: runtime.modifierKeys.ctrl,
      shiftKey: runtime.modifierKeys.shift
    }),
    Boolean(runtime.pointerDown)
  );
}

function handleCameraModifierKeydown(event) {
  if (!["Control", "Meta", "Shift"].includes(event.key)) return;
  setCameraModifierState(event);
}

function handleCameraModifierKeyup(event) {
  if (!["Control", "Meta", "Shift"].includes(event.key)) return;
  setCameraModifierState(event);
}

function setCombatReplayActive(active) {
  runtime.combatReplayActive = Boolean(active);
  if (!runtime.combatReplayActive) runtime.combatReplayPhase = "대기";
  setCombatReplayShellActive(runtime.combatReplayActive);
  document.getElementById("strikeTelemetryPanel")?.classList.toggle("is-compact", runtime.combatReplayActive);
  setCombatReplayCuesVisible(runtime.combatReplayActive);
  if (runtime.combatReplayActive) {
    runtime.units.forEach((entry) => {
      const visible = combatReplayAssetIds.includes(entry.unit.id);
      entry.anchor.visible = visible;
      if (entry.label) entry.label.visible = visible && runtime.layerVisibility.labels;
    });
  }
  if (!runtime.combatReplayActive) {
    runtime.units.forEach((entry) => {
      const visible = shouldShowUnitByDefault(entry.unit);
      entry.anchor.visible = visible;
      entry.anchor.scale.setScalar(isVistaStage27Unit(entry.unit) ? VISTA_MODEL_VISIBILITY_SCALE : 1);
      if (entry.label) entry.label.visible = visible && runtime.layerVisibility.labels;
      if (entry.label) {
        entry.label.scale.set(PROFESSIONAL_LABEL_SCALE[0], PROFESSIONAL_LABEL_SCALE[1], PROFESSIONAL_LABEL_SCALE[2]);
        updateLabelPosition(entry);
      }
      refreshCombatVisibilityMarker(entry);
    });
  }
}

function getStrikeReplayEffect() {
  return runtime.effects.find((effect) => effect.id === "strike" && effect.kind === "focus-fire") || null;
}

function getStrikeReplayPhase(effect = getStrikeReplayEffect()) {
  const hasStarted = runtime.strikeReplayStartedAt > 0;
  const effectsEnabled = Boolean(runtime.layerVisibility.effects);
  const effectVisible = Boolean(effect?.group?.visible);
  const duration = effect?.duration || 4.6;
  const progress = hasStarted && effect ? THREE.MathUtils.clamp((effect.age || 0) / duration, 0, 1) : 0;
  let activeStepIndex = 0;

  strikeReplayTimeline.forEach((step, index) => {
    if (progress >= step.at) activeStepIndex = index;
  });

  const activeStep = strikeReplayTimeline[activeStepIndex] || strikeReplayTimeline[0];
  const isLive = hasStarted && effectsEnabled && effectVisible;
  const isComplete = isLive && progress >= 0.99;
  let stateLabel = "대기";

  if (hasStarted && !effectsEnabled) {
    stateLabel = "효과 숨김";
  } else if (isComplete) {
    stateLabel = "피해평가 완료";
  } else if (isLive) {
    stateLabel = `${activeStep.label} 진행`;
  } else if (hasStarted) {
    stateLabel = "타격 대기";
  }

  runtime.strikeTelemetryState = stateLabel;
  runtime.strikeTimelineActiveStep = isLive ? activeStep.id : "standby";

  return {
    activeStep,
    activeStepIndex,
    effectVisible,
    isComplete,
    isLive,
    progress,
    stateLabel
  };
}

function getStrikeImpactEta(phase = getStrikeReplayPhase(), effect = getStrikeReplayEffect()) {
  if (!runtime.strikeReplayStartedAt || !phase.isLive) return "--";
  const duration = effect?.duration || 4.6;
  const impactAt = strikeReplayTimeline.find((step) => step.id === "apache-rocket")?.at ?? 20 / STRIKE_REPLAY_DURATION_SECONDS;
  if (phase.progress >= impactAt) return "명중";
  const seconds = Math.max(0, ((impactAt - phase.progress) * duration) / Math.max(0.5, runtime.speed));
  return `${seconds.toFixed(1)}s`;
}

function getStrikeBdaEstimate(phase = getStrikeReplayPhase()) {
  if (!runtime.strikeReplayStartedAt) return { label: "대기", score: 0, tone: "standby" };
  if (!phase.isLive) return { label: "대기", score: 0, tone: "standby" };
  const liveFireAt = 8 / STRIKE_REPLAY_DURATION_SECONDS;
  const rocketAt = 20 / STRIKE_REPLAY_DURATION_SECONDS;
  const greenSignalAt = 32 / STRIKE_REPLAY_DURATION_SECONDS;
  if (phase.progress < liveFireAt) return { label: "기동중", score: Math.round(phase.progress * 40), tone: "tracking" };
  if (phase.progress < rocketAt) return { label: "사격중", score: Math.round(22 + ((phase.progress - liveFireAt) / (rocketAt - liveFireAt)) * 28), tone: "tracking" };
  if (phase.progress < greenSignalAt) {
    const score = Math.round(62 + ((phase.progress - rocketAt) / (greenSignalAt - rocketAt)) * 18);
    return { label: `피해확인 ${score}%`, score, tone: "impact" };
  }
  const score = Math.round(84 + Math.min(1, (phase.progress - greenSignalAt) / (1 - greenSignalAt)) * 10);
  return { label: `종결 ${score}%`, score, tone: "suppressed" };
}

function getStrikeAssetState(assetId, phase) {
  if (!phase.isLive && !runtime.strikeReplayStartedAt) return "대기";
  if (assetId === "stage27_k2_assault") {
    if (phase.progress < 4 / STRIKE_REPLAY_DURATION_SECONDS) return "출발 대기";
    if (phase.progress < 8 / STRIKE_REPLAY_DURATION_SECONDS) return "7번 표적 돌격";
    if (phase.progress < 16 / STRIKE_REPLAY_DURATION_SECONDS) return "120mm 사격";
    if (phase.progress < 24 / STRIKE_REPLAY_DURATION_SECONDS) return "공포탄 엄호";
    return "전방 고정";
  }
  if (assetId === "stage27_k21_assault") {
    if (phase.progress < 4 / STRIKE_REPLAY_DURATION_SECONDS) return "출발 대기";
    if (phase.progress < 8 / STRIKE_REPLAY_DURATION_SECONDS) return "6번 표적 돌격";
    if (phase.progress < 16 / STRIKE_REPLAY_DURATION_SECONDS) return "40mm 포격";
    return "전방 엄호";
  }
  if (assetId === "stage27_apache_rocket") {
    if (phase.progress < 12 / STRIKE_REPLAY_DURATION_SECONDS) return "대기선";
    if (phase.progress < 20 / STRIKE_REPLAY_DURATION_SECONDS) return "9번 표적 이동";
    if (phase.progress < 24 / STRIKE_REPLAY_DURATION_SECONDS) return "로켓 발사";
    return "이탈 감시";
  }
  if (assetId === "stage27_swarm_drone") {
    if (phase.progress < 24 / STRIKE_REPLAY_DURATION_SECONDS) return "대기";
    if (phase.progress < 32 / STRIKE_REPLAY_DURATION_SECONDS) return "전방비행";
    return "상공 관측";
  }
  if (assetId === "stage27_follow_on_k2") {
    if (phase.progress < 32 / STRIKE_REPLAY_DURATION_SECONDS) return "후속 대기";
    return "녹색신호탄";
  }
  if (assetId === "stage27_green_finale") {
    return phase.progress >= 32 / STRIKE_REPLAY_DURATION_SECONDS ? "종결 신호" : "신호 대기";
  }
  if (assetId.startsWith("stage27_target_")) {
    if (phase.progress < 8 / STRIKE_REPLAY_DURATION_SECONDS) return "표적 대기";
    return "피해평가";
  }
  if (assetId === "air_patrol") return phase.progress >= 0 ? "좌표 송신" : "대기";
  if (assetId === "blue_fire_battery") {
    if (phase.progress < 0.34) return "사격 대기";
    if (phase.progress < 0.58) return "발사";
    return "재장전";
  }
  if (assetId === "blue_tank_platoon") {
    if (phase.progress < 0.18) return "엄호 대기";
    if (phase.progress < 0.74) return "전개 이동";
    return "엄호 유지";
  }
  if (assetId === "blue_k21_support") {
    if (phase.progress < 0.66) return "지상이동";
    return "보조 표적";
  }
  if (assetId === "red_tank_block") {
    if (phase.progress < 0.78) return "위협 유지";
    return "피격";
  }
  if (assetId === "enemy_delay_cell") {
    if (phase.progress < 0.92) return "지연행동";
    return "억제 확인";
  }
  return "추적";
}

function renderStrikeTelemetry(force = false) {
  const panel = document.getElementById("strikeTelemetryPanel");
  if (!panel) return;

  const now = performance.now();
  if (!force && now - runtime.strikeTelemetryLastRender < 120) return;
  runtime.strikeTelemetryLastRender = now;

  const phase = getStrikeReplayPhase();
  const impactEta = getStrikeImpactEta(phase);
  const bda = getStrikeBdaEstimate(phase);
  panel.hidden = !phase.isLive && !phase.isComplete && runtime.currentEventId !== "enemy_delay";
  const state = document.getElementById("strikeTelemetryState");
  const progressMeter = document.getElementById("strikeProgressMeter");
  const impactEtaNode = document.getElementById("strikeImpactEta");
  const bdaNode = document.getElementById("strikeBdaReadout");
  const steps = document.getElementById("strikeTimelineSteps");
  const readout = document.getElementById("strikeAssetReadout");

  panel.classList.toggle("is-live", phase.isLive);
  panel.classList.toggle("is-complete", phase.isComplete);
  panel.classList.toggle("is-compact", runtime.combatReplayActive || phase.isLive);
  panel.dataset.bdaTone = bda.tone;
  if (state) state.textContent = phase.stateLabel;
  if (progressMeter) {
    progressMeter.style.setProperty("--progress", `${Math.round(phase.progress * 100)}%`);
    progressMeter.setAttribute("aria-valuenow", String(Math.round(phase.progress * 100)));
    progressMeter.setAttribute("aria-valuetext", `${Math.round(phase.progress * 100)}%`);
  }
  if (impactEtaNode) impactEtaNode.textContent = impactEta;
  if (bdaNode) bdaNode.textContent = bda.label;

  if (steps) {
    steps.innerHTML = strikeReplayTimeline
      .map((step, index) => {
        const entry = runtime.units.get(step.assetId);
        const unit = entry?.unit || {};
        const nextAt = strikeReplayTimeline[index + 1]?.at ?? 1;
        const isActive = phase.isLive && phase.activeStep.id === step.id && !phase.isComplete;
        const isComplete = phase.isLive && (phase.progress >= nextAt || phase.isComplete);
        return `
          <button class="strike-step ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}" type="button" data-strike-step="${escapeHtml(step.id)}" data-asset-id="${escapeHtml(step.assetId)}">
            <span>${escapeHtml(step.label)}</span>
            <strong>${escapeHtml(unit.name || step.assetId)}</strong>
            <small>${escapeHtml(step.brief)}</small>
            <b>${Math.round(step.at * 100)}%</b>
          </button>
        `;
      })
      .join("");
  }

  if (readout) {
    readout.innerHTML = combatReplayAssetIds
      .map((assetId) => {
        const entry = runtime.units.get(assetId);
        const unit = entry?.unit || {};
        const readiness = Number(unit.readiness ?? (unit.side === "red" ? 66 : 82));
        const position = unit.position || (entry ? [entry.anchor.position.x, entry.anchor.position.z] : [0, 0]);
        return `
          <button class="strike-asset-row is-${escapeHtml(getAssetTone(unit))}" type="button" data-asset-id="${escapeHtml(assetId)}">
            <span>${escapeHtml(kindLabels[unit.kind] || unit.kind || "자산")}</span>
            <strong>${escapeHtml(unit.name || assetId)}</strong>
            <b>${escapeHtml(getStrikeAssetState(assetId, phase))}</b>
            <small>X ${Number(position[0]).toFixed(1)} / Z ${Number(position[1]).toFixed(1)} / ${Math.round(readiness)}%</small>
          </button>
        `;
      })
      .join("");
  }
}

function focusStrikeTelemetryAsset(assetId) {
  const entry = runtime.units.get(assetId);
  if (!entry) return;
  selectEditableAsset(assetId);
  runtime.cameraTarget.copy(entry.anchor.position);
  refreshSelectionMarker();
  renderStrikeTelemetry(true);
  setStatus(`타격 자산 추적: ${entry.unit.name}`);
}

function clampGroundCoordinate(value, limit) {
  return THREE.MathUtils.clamp(Number(value) || 0, -limit, limit);
}

function normalizeGroundPoint(point) {
  if (!point) return null;
  if (point.isVector3) return { x: clampGroundCoordinate(point.x, 34), z: clampGroundCoordinate(point.z, 23) };
  if (Array.isArray(point)) return { x: clampGroundCoordinate(point[0], 34), z: clampGroundCoordinate(point[1], 23) };
  return { x: clampGroundCoordinate(point.x, 34), z: clampGroundCoordinate(point.z, 23) };
}

function updateLabelPosition(entry) {
  if (!entry?.label) return;
  entry.label.position.copy(entry.anchor.position);
  entry.label.position.y += entry.unit?.kind === "air" ? 1.55 : 1.32;
}

function distance2d(a, b) {
  const ax = a.x ?? a[0];
  const az = a.z ?? a[1];
  const bx = b.x ?? b[0];
  const bz = b.z ?? b[1];
  return Math.hypot(ax - bx, az - bz);
}

function distanceToSegment2d(point, start, end) {
  const px = point.x;
  const pz = point.z;
  const ax = start[0];
  const az = start[1];
  const bx = end[0];
  const bz = end[1];
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSq = dx * dx + dz * dz || 1;
  const t = THREE.MathUtils.clamp(((px - ax) * dx + (pz - az) * dz) / lengthSq, 0, 1);
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

function nearestRouteDistance(point) {
  let best = Infinity;
  Object.values(terrainData.routes).forEach((route) => {
    for (let index = 0; index < route.length - 1; index += 1) {
      best = Math.min(best, distanceToSegment2d(point, route[index], route[index + 1]));
    }
  });
  return best;
}

function getNearestAsset(point, predicate) {
  let best = null;
  runtime.units.forEach((entry) => {
    if (!predicate(entry.unit)) return;
    const distance = distance2d(point, entry.anchor.position);
    if (!best || distance < best.distance) best = { entry, distance };
  });
  return best;
}

function scoreTone(score) {
  if (score >= 78) return "good";
  if (score >= 58) return "warn";
  return "danger";
}

function analyzeAssetPoint(unit, point) {
  const ground = normalizeGroundPoint(point) || normalizeGroundPoint(unit.position) || { x: 0, z: 0 };
  const elevation = terrainHeight(ground.x, ground.z);
  const slopeX = Math.abs(terrainHeight(ground.x + 1, ground.z) - terrainHeight(ground.x - 1, ground.z));
  const slopeZ = Math.abs(terrainHeight(ground.x, ground.z + 1) - terrainHeight(ground.x, ground.z - 1));
  const slope = Math.hypot(slopeX, slopeZ);
  const routeDistance = nearestRouteDistance(ground);
  const friendlyAnchor = getNearestAsset(ground, (candidate) => candidate.side === "blue" && ["relay", "command"].includes(candidate.kind) && candidate.id !== unit.id);
  const threatAnchor = getNearestAsset(ground, (candidate) => candidate.side === "red" && candidate.id !== unit.id);
  const friendlyDistance = friendlyAnchor?.distance ?? 18;
  const threatDistance = threatAnchor?.distance ?? 18;

  const terrainScore = THREE.MathUtils.clamp(100 - slope * 24 + elevation * 2.2, 0, 100);
  const routeScore = THREE.MathUtils.clamp(100 - routeDistance * 8.5, 0, 100);
  const commScore = THREE.MathUtils.clamp(100 - friendlyDistance * 4.8 + (unit.kind === "relay" ? elevation * 2.8 : 0), 0, 100);
  const threatScore = unit.side === "red"
    ? THREE.MathUtils.clamp(100 - routeDistance * 7 + Math.max(0, 9 - friendlyDistance) * 2, 0, 100)
    : THREE.MathUtils.clamp(threatDistance * 9.5 + (routeDistance > 5 ? 8 : 0), 0, 100);
  const coverScore = THREE.MathUtils.clamp(58 + slope * 9 + elevation * 2 - Math.max(0, 6 - threatDistance) * 8, 0, 100);
  const preference = placementCandidateSlots.some((slot) => slot.preferredKinds.includes(unit.kind) && distance2d(ground, slot.position) < 4) ? 6 : 0;
  const weights = unit.kind === "relay"
    ? { terrain: 0.28, comm: 0.36, route: 0.18, threat: 0.12, cover: 0.06 }
    : unit.kind === "fire"
      ? { terrain: 0.22, comm: 0.14, route: 0.16, threat: 0.34, cover: 0.14 }
      : unit.side === "red"
        ? { terrain: 0.18, comm: 0.1, route: 0.34, threat: 0.26, cover: 0.12 }
        : { terrain: 0.22, comm: 0.18, route: 0.3, threat: 0.2, cover: 0.1 };

  const score = Math.round(
    terrainScore * weights.terrain +
    commScore * weights.comm +
    routeScore * weights.route +
    threatScore * weights.threat +
    coverScore * weights.cover +
    preference
  );

  return {
    score: THREE.MathUtils.clamp(score, 0, 100),
    tone: scoreTone(score),
    position: [ground.x, ground.z],
    elevation: Number(elevation.toFixed(2)),
    slope: Number(slope.toFixed(2)),
    routeDistance: Number(routeDistance.toFixed(1)),
    nearestComms: friendlyAnchor?.entry.unit.name || "기준 없음",
    commDistance: Number(friendlyDistance.toFixed(1)),
    nearestThreat: threatAnchor?.entry.unit.name || "위협 없음",
    threatDistance: Number(threatDistance.toFixed(1)),
    summary: score >= 78 ? "배치 적합" : score >= 58 ? "보완 필요" : "재배치 권고",
    factors: [
      { key: "terrain", label: "지형", value: Math.round(terrainScore), detail: `경사 ${slope.toFixed(1)} / 고도 ${elevation.toFixed(1)}` },
      { key: "comms", label: "통신", value: Math.round(commScore), detail: `${friendlyAnchor?.entry.unit.name || "기준 없음"} ${friendlyDistance.toFixed(1)}` },
      { key: "route", label: "경로", value: Math.round(routeScore), detail: `B/A 경로 ${routeDistance.toFixed(1)}` },
      { key: "threat", label: "위협", value: Math.round(threatScore), detail: `${threatAnchor?.entry.unit.name || "위협 없음"} ${threatDistance.toFixed(1)}` },
      { key: "cover", label: "엄폐", value: Math.round(coverScore), detail: slope > 1.4 ? "지형 기복 활용" : "노출 보통" }
    ]
  };
}

function analyzeAssetPlacement(entryOrUnit = getAssetEntry(), point = null) {
  const entry = entryOrUnit?.unit ? entryOrUnit : null;
  const unit = entry?.unit || entryOrUnit;
  if (!unit) return null;
  const ground = normalizeGroundPoint(point) || normalizeGroundPoint(unit.position) || normalizeGroundPoint(entry?.anchor?.position);
  const analysis = analyzeAssetPoint(unit, ground);
  analysis.candidates = placementCandidateSlots
    .map((slot) => {
      const candidate = analyzeAssetPoint(unit, { x: slot.position[0], z: slot.position[1] });
      return {
        id: slot.id,
        label: slot.label,
        brief: slot.brief,
        position: slot.position,
        score: candidate.score,
        tone: candidate.tone,
        preferred: slot.preferredKinds.includes(unit.kind)
      };
    })
    .sort((a, b) => Number(b.preferred) - Number(a.preferred) || b.score - a.score)
    .slice(0, 3);
  return analysis;
}

function terrainHeight(x, z) {
  const realHeight = sampleRealTerrainHeight(x, z);
  if (realHeight !== null) return realHeight;

  const ridge = Math.exp(-((x - 12) ** 2) / 420) * 3.8;
  const valley = -Math.exp(-((z + 1) ** 2) / 90) * 1.2;
  const wave = Math.sin(x * 0.18) * 0.7 + Math.cos(z * 0.22) * 0.85;
  const northRise = THREE.MathUtils.clamp((z + 10) / 28, 0, 1) * 2.8;
  return ridge + valley + wave + northRise;
}

function sampleRealTerrainHeight(x, z) {
  const terrain = runtime.realTerrain;
  if (!terrain?.rows?.length) return null;

  const u = THREE.MathUtils.clamp(x / 70 + 0.5, 0, 1);
  const v = THREE.MathUtils.clamp(0.5 - z / 48, 0, 1);
  const gridMax = terrain.gridSize - 1;
  const gx = u * gridMax;
  const gy = v * gridMax;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const x1 = Math.min(gridMax, x0 + 1);
  const y1 = Math.min(gridMax, y0 + 1);
  const tx = gx - x0;
  const ty = gy - y0;
  const h00 = terrain.rows[y0][x0];
  const h10 = terrain.rows[y0][x1];
  const h01 = terrain.rows[y1][x0];
  const h11 = terrain.rows[y1][x1];
  const top = THREE.MathUtils.lerp(h00, h10, tx);
  const bottom = THREE.MathUtils.lerp(h01, h11, tx);
  const meters = THREE.MathUtils.lerp(top, bottom, ty);
  const range = Math.max(1, terrain.maxElevationM - terrain.minElevationM);
  const normalized = THREE.MathUtils.clamp((meters - terrain.minElevationM) / range, 0, 1);
  return Math.pow(normalized, 1.08) * realTerrainSource.heightScale + realTerrainSource.heightBase;
}

function pointToVector(point, lift = 0.18) {
  const [x, z] = point;
  return new THREE.Vector3(x, terrainHeight(x, z) + lift, z);
}

function getUnitTerrainLift(unit) {
  return unit?.kind === "air" ? unit.altitude || 8 : 0;
}

function createTerrainMesh() {
  const geometry = new THREE.PlaneGeometry(70, 48, 110, 78);
  geometry.rotateX(-Math.PI / 2);
  const colors = [];
  const color = new THREE.Color();
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const h = terrainHeight(x, z);
    position.setY(i, h);
    if (h > 4.2) color.setRGB(0.52, 0.46, 0.3);
    else if (h > 2.2) color.setRGB(0.32, 0.47, 0.28);
    else if (z < -13) color.setRGB(0.24, 0.37, 0.23);
    else color.setRGB(0.18, 0.31, 0.2);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.02
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function createGridAndContours() {
  const group = new THREE.Group();
  const grid = new THREE.GridHelper(70, 28, 0x466b5b, 0x24352d);
  grid.position.y = 0.07;
  grid.material.opacity = 0.18;
  grid.material.transparent = true;
  group.add(grid);

  for (let z = -18; z <= 20; z += 4) {
    const points = [];
    for (let x = -32; x <= 32; x += 2) {
      points.push(new THREE.Vector3(x, terrainHeight(x, z) + 0.11, z));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x9bd1b4, transparent: true, opacity: 0.12 })
    );
    group.add(line);
  }
  runtime.scene.add(group);
}

function createRouteLine(routeId, color, opacity = 0.9) {
  const points = terrainData.routes[routeId].map((point) => pointToVector(point, 0.36));
  const curve = new THREE.CatmullRomCurve3(points);
  const samples = curve.getPoints(90);
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(samples),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth: 2 })
  );
  runtime.scene.add(line);
  runtime.routeLines.set(routeId, { line, curve, color, opacity });
}

function refreshRouteLine(routeId) {
  const route = runtime.routeLines.get(routeId);
  if (!route) return;
  const points = terrainData.routes[routeId].map((point) => pointToVector(point, 0.36));
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
  route.line.geometry.dispose();
  route.line.geometry = geometry;
  route.curve = curve;
}

function refreshTerrainGeometry() {
  if (!runtime.terrain) return;
  const geometry = runtime.terrain.geometry;
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    position.setY(i, terrainHeight(position.getX(i), position.getZ(i)));
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function refreshTerrainAnchoredObjects() {
  refreshTerrainGeometry();
  runtime.routeLines.forEach((_route, routeId) => refreshRouteLine(routeId));
  runtime.units.forEach((entry) => {
    const { unit, anchor, label } = entry;
    placeUnit(unit, anchor);
    if (label) {
      updateLabelPosition(entry);
    }
  });
  combatReplayAssetIds.forEach((assetId) => {
    const entry = runtime.units.get(assetId);
    if (entry) refreshCombatVisibilityMarker(entry);
    refreshCombatReplayRouteCue(assetId);
  });

  if (runtime.overlays.comm) runtime.overlays.comm.position.copy(pointToVector([-4, 0], 0.28));
  if (runtime.overlays.steep) runtime.overlays.steep.position.copy(pointToVector([16, 12], 0.32));
  if (runtime.commanderBeam) runtime.commanderBeam.position.copy(pointToVector([27, 9], 8.5));

  runtime.effects.forEach((effect) => {
    runtime.scene.remove(effect.group);
  });
  runtime.effects = [];
  createStrikeEffect();
  if (runtime.rehearsalActionLayer) {
    clearRehearsalActionLayer();
    startRehearsalAction(runtime.currentEventId || "start");
  }
  setOverlayMode(terrainData.eventBindings[runtime.currentEventId]?.visual || "route_compare");
  refreshSelectionMarker();
  refreshAssetInfluenceOverlay(true);
}

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    runtime.textureLoader.load(url, resolve, undefined, reject);
  });
}

function applySatelliteTexture(texture) {
  if (!runtime.terrain) return;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, runtime.renderer.capabilities.getMaxAnisotropy());
  runtime.terrain.material.map = texture;
  runtime.terrain.material.vertexColors = false;
  runtime.terrain.material.color.set(0xffffff);
  runtime.terrain.material.roughness = 0.86;
  runtime.terrain.material.needsUpdate = true;
}

async function loadRealTerrainData() {
  if (runtime.realTerrainLoadState !== "idle") return;
  runtime.realTerrainLoadState = "loading";
  setStatus("VISTA 실지형 DEM·위성 타일 로딩");

  try {
    const [demResponse, texture] = await Promise.all([
      fetch(realTerrainSource.demGrid, { cache: "force-cache" }),
      loadTexture(realTerrainSource.satelliteTexture)
    ]);
    if (!demResponse.ok) throw new Error(`DEM grid request failed: ${demResponse.status}`);
    const dem = await demResponse.json();
    if (!Array.isArray(dem.rows) || dem.rows.length !== dem.gridSize) {
      throw new Error("DEM grid shape is invalid.");
    }

    runtime.realTerrain = dem;
    applySatelliteTexture(texture);
    refreshTerrainAnchoredObjects();
    runtime.realTerrainLoadState = "ready";
    setStatus(`VISTA 실지형 적용 / DEM ${Math.round(dem.minElevationM)}-${Math.round(dem.maxElevationM)}m / z${realTerrainSource.zoom}`);
  } catch (error) {
    runtime.realTerrainLoadState = "fallback";
    setStatus("VISTA 실지형 로딩 실패 / 절차 지형 유지");
    console.warn("WAR GROUND real terrain load failed", error);
  }
}

function makeLabelCanvas(text, tone = "blue") {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 56;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = tone === "red" ? "rgba(40, 12, 10, 0.78)" : tone === "amber" ? "rgba(42, 34, 14, 0.76)" : "rgba(6, 12, 13, 0.72)";
  ctx.strokeStyle = tone === "red" ? "rgba(255, 124, 104, 0.82)" : tone === "amber" ? "rgba(255, 189, 74, 0.82)" : "rgba(95, 244, 223, 0.76)";
  ctx.lineWidth = 1.25;
  ctx.roundRect(6, 8, 288, 34, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = tone === "red" ? "rgba(255, 124, 104, 0.9)" : tone === "amber" ? "rgba(255, 189, 74, 0.9)" : "rgba(95, 244, 223, 0.9)";
  ctx.fillRect(14, 17, 2, 16);
  ctx.fillStyle = "#f2ead2";
  ctx.font = "700 15px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const label = text.length > 18 ? `${text.slice(0, 17)}…` : text;
  ctx.fillText(label, 24, 25);
  return canvas;
}

function createLabel(text, position, tone = "blue") {
  const texture = new THREE.CanvasTexture(makeLabelCanvas(text, tone));
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.position.copy(position);
  sprite.position.y += 1.28;
  sprite.scale.set(PROFESSIONAL_LABEL_SCALE[0], PROFESSIONAL_LABEL_SCALE[1], PROFESSIONAL_LABEL_SCALE[2]);
  sprite.visible = runtime.layerVisibility.labels;
  runtime.scene.add(sprite);
  runtime.labels.push(sprite);
  return sprite;
}

function removeLabel(label) {
  if (!label) return;
  runtime.scene.remove(label);
  runtime.labels = runtime.labels.filter((item) => item !== label);
  if (label.material?.map) label.material.map.dispose();
  if (label.material) label.material.dispose();
}

function createProceduralArmorModel(unit) {
  const group = new THREE.Group();
  const isRed = unit.side === "red";
  const bodyColor = isRed ? 0x8d2e22 : 0x275f56;
  const trimColor = isRed ? 0xff765d : 0x58e4cf;
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x171b17, metalness: 0.24, roughness: 0.74 });
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: bodyColor, metalness: 0.22, roughness: 0.7 });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: trimColor, emissive: trimColor, emissiveIntensity: 0.08, metalness: 0.18, roughness: 0.54 });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.58, 1.38), bodyMaterial);
  hull.position.y = 0.42;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.32, 1.02), bodyMaterial);
  deck.position.y = 0.88;
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.58, 0.34, 12), bodyMaterial);
  turret.position.y = 1.16;
  turret.rotation.y = Math.PI / 6;
  const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 1.65, 10), trimMaterial);
  cannon.position.set(0, 1.16, 0.98);
  cannon.rotation.x = Math.PI / 2;
  const leftTrack = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.34, 0.28), darkMaterial);
  leftTrack.position.set(0, 0.25, -0.82);
  const rightTrack = leftTrack.clone();
  rightTrack.position.z = 0.82;
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 6), trimMaterial);
  antenna.position.set(-0.65, 1.58, -0.24);
  antenna.rotation.z = -0.22;

  [hull, deck, turret, cannon, leftTrack, rightTrack, antenna].forEach((part) => {
    part.castShadow = true;
    part.receiveShadow = true;
    group.add(part);
  });
  group.scale.setScalar(unit.scale || 1);
  return group;
}

function fallbackModel(unit) {
  const group = new THREE.Group();
  const color = unit.side === "red" ? 0xe95d43 : unit.kind === "air" ? 0x8fd9ff : unit.kind === "objective" ? 0xffc94d : 0x42d4bb;
  let mesh;
  if (unit.kind === "air") {
    mesh = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2.5, 4), new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.45 }));
    mesh.rotation.x = Math.PI / 2;
  } else if (unit.kind === "tank" || unit.kind === "armor" || unit.model === "procedural_tank") {
    return createProceduralArmorModel(unit);
  } else if (unit.kind === "ground") {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1), new THREE.MeshStandardMaterial({ color, metalness: 0.18, roughness: 0.72 }));
    mesh.position.y = 0.3;
  } else {
    mesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, 1.4), new THREE.MeshStandardMaterial({ color, metalness: 0.08, roughness: 0.8 }));
    mesh.position.y = 0.5;
  }
  mesh.castShadow = true;
  group.add(mesh);
  return group;
}

function resolveUnitModelConfig(unit) {
  const vistaModel = vistaModelCatalog[unit.model];
  if (vistaModel) return { id: unit.model, source: "VISTA terrain-3d", ...vistaModel };
  const path = modelPaths[unit.model];
  if (path) return { id: unit.model, source: "local", path, axis: "gltf-y-up-y-forward" };
  return null;
}

function applyVistaAxisCorrection(root, modelConfig) {
  if (modelConfig?.axis === "gltf-y-up-x-forward") {
    root.rotation.y -= Math.PI / 2;
  }
}

function applyVistaMaterialCorrection(root, modelConfig) {
  if (modelConfig?.materialCorrection !== "remove-uniform-white-emissive") return;
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (material.emissive) material.emissive.setHex(0x000000);
      if ("emissiveIntensity" in material) material.emissiveIntensity = 0;
      material.needsUpdate = true;
    });
  });
}

function cloneCachedVistaModel(modelConfig, onSuccess, onError) {
  const path = modelConfig?.path;
  if (!path) return false;

  const cached = vistaModelLoadCache.get(path);
  if (cached?.scene) {
    onSuccess(cached.scene.clone(true));
    return true;
  }
  if (cached?.promise) {
    cached.promise.then((scene) => onSuccess(scene.clone(true))).catch(onError);
    return true;
  }

  runtime.vistaModelLoadState[modelConfig.id] = "loading";
  const promise = new Promise((resolve, reject) => {
    runtime.loader.load(
      path,
      (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error)
    );
  });
  vistaModelLoadCache.set(path, { promise });
  promise
    .then((scene) => {
      vistaModelLoadCache.set(path, { scene });
      runtime.vistaModelLoadState[modelConfig.id] = "ready";
      onSuccess(scene.clone(true));
    })
    .catch((error) => {
      vistaModelLoadCache.delete(path);
      runtime.vistaModelLoadState[modelConfig.id] = "fallback";
      onError(error);
    });
  return true;
}

function alignModelRootToGround(root) {
  root.updateMatrixWorld(true);
  const scaledBox = new THREE.Box3().setFromObject(root);
  if (!Number.isFinite(scaledBox.min.y)) return;
  root.position.y -= scaledBox.min.y;
}

function normalizeLoadedModel(root, unit, modelConfig = resolveUnitModelConfig(unit)) {
  applyVistaAxisCorrection(root, modelConfig);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;
  const targetSize = Number(modelConfig?.targetSize) || (unit.kind === "air" ? 2.2 : unit.kind === "ground" ? 2.1 : 1.45);
  const scale = (targetSize / maxAxis) * (unit.scale || 1);
  root.scale.setScalar(scale);
  root.position.set(-center.x * scale, 0, -center.z * scale);
  alignModelRootToGround(root);
  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material = child.material.clone();
        child.material.roughness = Math.max(child.material.roughness ?? 0.6, 0.42);
      }
    }
  });
  applyVistaMaterialCorrection(root, modelConfig);
}

function assignAssetUserData(object, assetId) {
  object.userData.assetId = assetId;
  object.traverse?.((child) => {
    child.userData.assetId = assetId;
  });
}

function placeUnit(unit, object) {
  const origin = unit.position || terrainData.routes[unit.route]?.[0] || [0, 0];
  const position = pointToVector(origin, getUnitTerrainLift(unit));
  object.position.copy(position);
  object.rotation.y = THREE.MathUtils.degToRad(unit.heading || 0);
}

function createUnit(unit) {
  const anchor = new THREE.Group();
  anchor.name = unit.id;
  assignAssetUserData(anchor, unit.id);
  placeUnit(unit, anchor);
  const proxy = fallbackModel(unit);
  assignAssetUserData(proxy, unit.id);
  anchor.add(proxy);
  runtime.scene.add(anchor);
  const entry = { unit, anchor, proxy, routeProgress: 0, userPlaced: Boolean(unit.userPlaced), templateId: unit.templateId || unit.model };
  runtime.units.set(unit.id, entry);
  runtime.editableAssets.set(unit.id, entry);
  const label = createLabel(unit.name, anchor.position, unit.side === "red" ? "red" : unit.kind === "objective" ? "amber" : "blue");
  entry.label = label;
  if (!shouldShowUnitByDefault(unit)) {
    anchor.visible = false;
    label.visible = false;
  } else if (isVistaStage27Unit(unit)) {
    anchor.scale.setScalar(VISTA_MODEL_VISIBILITY_SCALE);
  }
  if (combatReplayAssetIds.includes(unit.id)) {
    createCombatVisibilityMarker(entry);
    createCombatReplayRouteCue(unit.id);
  }

  const modelConfig = resolveUnitModelConfig(unit);
  if (modelConfig) {
    cloneCachedVistaModel(
      modelConfig,
      (model) => {
        normalizeLoadedModel(model, unit, modelConfig);
        assignAssetUserData(model, unit.id);
        anchor.remove(entry.proxy);
        anchor.add(model);
        entry.proxy = model;
        entry.modelConfig = modelConfig;
      },
      () => {
        setStatus("일부 VISTA GLB 대체 모델 사용");
      }
    );
  }
}

function createOverlayZones() {
  const comm = new THREE.Mesh(
    new THREE.CylinderGeometry(6.5, 6.5, 0.08, 48),
    new THREE.MeshBasicMaterial({ color: 0xe9553d, transparent: true, opacity: 0.18, depthWrite: false })
  );
  comm.position.copy(pointToVector([-4, 0], 0.28));
  comm.scale.z = 0.56;
  comm.visible = false;
  runtime.scene.add(comm);

  const steep = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 11),
    new THREE.MeshBasicMaterial({ color: 0xff8b7c, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })
  );
  steep.rotation.x = -Math.PI / 2;
  steep.position.copy(pointToVector([16, 12], 0.32));
  steep.visible = false;
  runtime.scene.add(steep);

  const fog = new THREE.Mesh(
    new THREE.BoxGeometry(46, 4, 10),
    new THREE.MeshBasicMaterial({ color: 0xaec7be, transparent: true, opacity: 0.1, depthWrite: false })
  );
  fog.position.set(0, 4.8, -1);
  fog.visible = false;
  runtime.scene.add(fog);

  const commanderBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 17, 16),
    new THREE.MeshBasicMaterial({ color: 0x5ff4df, transparent: true, opacity: 0.68 })
  );
  commanderBeam.position.copy(pointToVector([27, 9], 8.5));
  commanderBeam.visible = false;
  runtime.scene.add(commanderBeam);

  runtime.overlays = { comm, steep, fog };
  runtime.commanderBeam = commanderBeam;
}

function createFocusFireSprite(textureKey, scale = 1, opacity = 0.9, additive = true) {
  const texturePath = focusFireEffectTextures[textureKey];
  const texture = texturePath ? runtime.textureLoader.load(texturePath) : null;
  if (texture) texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

function createFocusFireStrikeEffect() {
  const group = new THREE.Group();
  const apacheLaunchPoint = [
    THREE.MathUtils.lerp(stage27Points.airIngressEast[0], stage27Points.target9[0], 0.72),
    THREE.MathUtils.lerp(stage27Points.airIngressEast[1], stage27Points.target9[1], 0.72)
  ];
  const launch = pointToVector(apacheLaunchPoint, 13.4);
  const control = new THREE.Vector3(
    (apacheLaunchPoint[0] + stage27Points.target9[0]) / 2,
    Math.max(terrainHeight(stage27Points.target9[0], stage27Points.target9[1]) + 15, 18),
    (apacheLaunchPoint[1] + stage27Points.target9[1]) / 2
  );
  const impact = pointToVector(stage27Points.target9, 0.9);
  const curve = new THREE.QuadraticBezierCurve3(launch, control, impact);
  const curvePoints = curve.getPoints(72);

  const projectile = createFocusFireSprite("headGlow", 1.35, 0.95);
  projectile.position.copy(launch);
  const projectileCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 10),
    new THREE.MeshBasicMaterial({ color: 0xfff4b3, transparent: true, opacity: 0.92, depthWrite: false })
  );

  const trail = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([launch, launch]),
    new THREE.LineBasicMaterial({ color: 0x8fd9ff, transparent: true, opacity: 0.84 })
  );
  const traceSprites = [0.18, 0.32, 0.46, 0.6].map((t) => {
    const sprite = createFocusFireSprite("trailSmoke", 1.25, 0.26, false);
    sprite.position.copy(curve.getPoint(t));
    return sprite;
  });
  const muzzle = createFocusFireSprite("launchMuzzle", 2.8, 0.86);
  muzzle.position.copy(launch);
  const impactFlash = createFocusFireSprite("impactFlash", 4.2, 0);
  impactFlash.position.copy(impact);
  const impactDust = createFocusFireSprite("impactDust", 5.2, 0, false);
  impactDust.position.copy(impact);
  impactDust.position.y += 0.2;
  const impactSmoke = createFocusFireSprite("impactSmoke", 4.8, 0, false);
  impactSmoke.position.copy(impact);
  impactSmoke.position.y += 1.2;
  const shockwave = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.055, 8, 72),
    new THREE.MeshBasicMaterial({ color: 0xffbd4a, transparent: true, opacity: 0.82 })
  );
  shockwave.rotation.x = Math.PI / 2;
  shockwave.position.copy(impact);
  const targetMarker = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 0.06, 56),
    new THREE.MeshBasicMaterial({ color: 0xff5844, transparent: true, opacity: 0.28, depthWrite: false })
  );
  targetMarker.position.copy(pointToVector(stage27Points.target9, 0.18));
  const greenSignal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 1.18, 6.2, 28, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x61ff8a, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
  );
  const greenSignalHalo = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.045, 8, 72),
    new THREE.MeshBasicMaterial({ color: 0x61ff8a, transparent: true, opacity: 0, depthWrite: false })
  );
  greenSignal.position.copy(pointToVector(stage27Points.greenFinale, 3.2));
  greenSignalHalo.rotation.x = Math.PI / 2;
  greenSignalHalo.position.copy(pointToVector(stage27Points.greenFinale, 0.34));
  group.add(projectile, projectileCore, trail, muzzle, impactFlash, impactDust, impactSmoke, shockwave, targetMarker, greenSignal, greenSignalHalo, ...traceSprites);
  group.visible = false;
  runtime.scene.add(group);
  runtime.effects.push({
    id: "strike",
    kind: "focus-fire",
    group,
    curve,
    curvePoints,
    projectile,
    projectileCore,
    trail,
    muzzle,
    impactFlash,
    impactDust,
    impactSmoke,
    shockwave,
    targetMarker,
    greenSignal,
    greenSignalHalo,
    traceSprites,
    strikeReplayStartedAt: 0,
    age: 0,
    duration: STRIKE_REPLAY_DURATION_SECONDS
  });
}

function createStrikeEffect() {
  createFocusFireStrikeEffect();
}

function disposeRehearsalActionObject(object) {
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material.dispose?.());
    } else {
      child.material?.dispose?.();
    }
  });
}

function createRehearsalActionLayer() {
  if (runtime.rehearsalActionLayer) return runtime.rehearsalActionLayer;
  const group = new THREE.Group();
  group.name = "rehearsalActionLayer";
  group.visible = false;
  runtime.scene.add(group);
  runtime.rehearsalActionLayer = group;
  return group;
}

function clearRehearsalActionLayer() {
  const layer = createRehearsalActionLayer();
  runtime.rehearsalActionProjectiles.forEach((mission) => disposeRehearsalActionObject(mission.group));
  runtime.rehearsalActionTrails.forEach((trail) => disposeRehearsalActionObject(trail.line));
  while (layer.children.length) layer.remove(layer.children[0]);
  runtime.rehearsalActionProjectiles.clear();
  runtime.rehearsalActionTrails.clear();
}

function getRehearsalActionPlan(eventId) {
  return rehearsalActionPlans[eventId] || rehearsalActionPlans.start;
}

function getRehearsalActionParticipants(plan) {
  const ids = new Set();
  (plan.movement || []).forEach((move) => ids.add(move.assetId));
  (plan.fires || []).forEach((mission) => {
    if (typeof mission.shooter === "string") ids.add(mission.shooter);
    if (typeof mission.target === "string") ids.add(mission.target);
  });
  return ids;
}

function resetRehearsalActionParticipantVisibility(nextParticipants = new Set()) {
  runtime.rehearsalActionParticipants.forEach((assetId) => {
    if (nextParticipants.has(assetId)) return;
    const entry = runtime.units.get(assetId);
    if (!entry || shouldShowUnitByDefault(entry.unit) || runtime.combatReplayActive) return;
    entry.anchor.visible = false;
    if (entry.label) entry.label.visible = false;
  });
  runtime.rehearsalActionParticipants = nextParticipants;
}

function showRehearsalActionParticipants(participants) {
  participants.forEach((assetId) => {
    const entry = runtime.units.get(assetId);
    if (!entry) return;
    entry.anchor.visible = true;
    entry.anchor.scale.setScalar(isVistaStage27Unit(entry.unit) ? VISTA_MODEL_VISIBILITY_SCALE : 1);
    if (entry.label) entry.label.visible = runtime.layerVisibility.labels;
  });
}

function getRehearsalActionVector(ref, lift = 0.5) {
  if (typeof ref === "string") {
    const entry = runtime.units.get(ref);
    if (entry) {
      return new THREE.Vector3(
        entry.anchor.position.x,
        terrainHeight(entry.anchor.position.x, entry.anchor.position.z) + lift,
        entry.anchor.position.z
      );
    }
  }
  if (Array.isArray(ref)) return pointToVector(ref, lift);
  if (ref?.isVector3) return ref.clone();
  if (ref && Number.isFinite(ref.x) && Number.isFinite(ref.z)) return new THREE.Vector3(ref.x, terrainHeight(ref.x, ref.z) + lift, ref.z);
  return pointToVector([0, 0], lift);
}

function getRehearsalMovementVector(move, progress, lift = 0) {
  const startAt = move.startAt ?? 0;
  const endAt = move.endAt ?? 1;
  const local = smoothCombatStep((progress - startAt) / Math.max(0.01, endAt - startAt));
  if (move.routeId) {
    const from = move.from ?? 0;
    const to = move.to ?? 1;
    const routeT = THREE.MathUtils.lerp(from, to, local);
    return sampleRoute(move.routeId, routeT, move.offset || 0, move.altitude || lift);
  }
  const start = move.start || runtime.units.get(move.assetId)?.unit?.position || [0, 0];
  const end = move.end || start;
  const altitude = move.altitude ?? lift;
  return pointToVector([
    THREE.MathUtils.lerp(start[0], end[0], local),
    THREE.MathUtils.lerp(start[1], end[1], local)
  ], altitude);
}

function createRehearsalMovementTrail(move) {
  const layer = createRehearsalActionLayer();
  const entry = runtime.units.get(move.assetId);
  const color = entry?.unit?.side === "red" ? 0xff725e : entry?.unit?.kind === "fire" ? 0xffbd4a : 0x5ff4df;
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([getRehearsalMovementVector(move, 0), getRehearsalMovementVector(move, 0)]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.42 })
  );
  line.name = `movementTrails:${move.assetId}`;
  layer.add(line);
  runtime.rehearsalActionTrails.set(move.assetId, { line, move, color, lastProgress: -1 });
}

function createRehearsalArtilleryMission(mission) {
  const layer = createRehearsalActionLayer();
  const launch = getRehearsalActionVector(mission.shooter, 1.35);
  const impact = getRehearsalActionVector(mission.target, 0.58);
  const control = new THREE.Vector3(
    (launch.x + impact.x) / 2,
    Math.max(launch.y, impact.y) + (mission.arcHeight || 10),
    (launch.z + impact.z) / 2
  );
  const curve = new THREE.QuadraticBezierCurve3(launch, control, impact);
  const curvePoints = curve.getPoints(72);
  const color = mission.color || 0xffbd4a;
  const group = new THREE.Group();
  group.name = `artilleryArcs:${mission.id}`;

  const arc = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(curvePoints),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 })
  );
  const arcTube = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 72, 0.045, 8, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })
  );
  const trail = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([launch, launch]),
    new THREE.LineBasicMaterial({ color: 0xfff0b8, transparent: true, opacity: 0 })
  );
  const projectile = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 18, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff0b8, transparent: true, opacity: 0.96, depthWrite: false })
  );
  const muzzle = createFocusFireSprite("launchMuzzle", 2.1, 0);
  const impactFlash = createFocusFireSprite("impactFlash", 3.8, 0);
  const impactDust = createFocusFireSprite("impactDust", 4.6, 0, false);
  const shockwave = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.045, 8, 64),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false })
  );
  const targetMark = new THREE.Mesh(
    new THREE.CylinderGeometry(1.7, 1.7, 0.035, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false })
  );

  muzzle.position.copy(launch);
  impactFlash.position.copy(impact);
  impactDust.position.copy(impact).add(new THREE.Vector3(0, 0.42, 0));
  shockwave.rotation.x = Math.PI / 2;
  shockwave.position.copy(impact);
  targetMark.position.copy(getRehearsalActionVector(mission.target, 0.16));
  group.add(arc, arcTube, trail, projectile, muzzle, impactFlash, impactDust, shockwave, targetMark);
  layer.add(group);
  runtime.rehearsalActionProjectiles.set(mission.id, {
    mission,
    group,
    curve,
    curvePoints,
    arc,
    arcTube,
    trail,
    projectile,
    muzzle,
    impactFlash,
    impactDust,
    shockwave,
    targetMark,
    lastTrailT: -1
  });
}

function startRehearsalAction(eventId) {
  const plan = getRehearsalActionPlan(eventId);
  const participants = getRehearsalActionParticipants(plan);
  resetRehearsalActionParticipantVisibility(participants);
  clearRehearsalActionLayer();
  showRehearsalActionParticipants(participants);
  (plan.movement || []).forEach(createRehearsalMovementTrail);
  (plan.fires || []).forEach(createRehearsalArtilleryMission);
  runtime.rehearsalActionActiveEventId = eventId;
  runtime.rehearsalActionStartedAt = runtime.clock.elapsedTime;
  runtime.rehearsalActionElapsed = 0;
  runtime.rehearsalActionProgress = 0;
  runtime.rehearsalActionState = plan.visibleAction || "기동 진행";
  runtime.rehearsalActionLayer.visible = runtime.layerVisibility.effects;
  setTacticalActionShellActive(true);
  renderRehearsalActionReadout(plan, 0, true);
}

function getRehearsalActionProgress(plan) {
  const duration = Math.max(0.6, Math.min(plan.duration || REHEARSAL_ACTION_SLOT_SECONDS, REHEARSAL_ACTION_SLOT_SECONDS));
  runtime.rehearsalActionProgress = THREE.MathUtils.clamp(runtime.rehearsalActionElapsed / duration, 0, 1);
  return runtime.rehearsalActionProgress;
}

function animateRehearsalMovement(plan, progress) {
  (plan.movement || []).forEach((move) => {
    const entry = runtime.units.get(move.assetId);
    if (!entry) return;
    const lift = getUnitTerrainLift(entry.unit);
    const position = getRehearsalMovementVector(move, progress, lift);
    const next = getRehearsalMovementVector(move, Math.min(1, progress + 0.018), lift);
    const heading = Math.atan2(next.x - position.x, next.z - position.z);
    const local = THREE.MathUtils.clamp((progress - (move.startAt ?? 0)) / Math.max(0.01, (move.endAt ?? 1) - (move.startAt ?? 0)), 0, 1);
    const pulse = Math.sin(local * Math.PI) * 0.06;

    entry.anchor.visible = true;
    entry.anchor.position.copy(position);
    entry.anchor.rotation.y = heading;
    entry.anchor.scale.setScalar((isVistaStage27Unit(entry.unit) ? VISTA_MODEL_VISIBILITY_SCALE : 1) + pulse);
    entry.unit.position = [Number(position.x.toFixed(2)), Number(position.z.toFixed(2))];
    entry.unit.heading = THREE.MathUtils.radToDeg(heading);
    if (entry.unit.kind === "air") entry.unit.altitude = Math.max(8, position.y - terrainHeight(position.x, position.z));
    if (entry.label) entry.label.visible = runtime.layerVisibility.labels;
    updateLabelPosition(entry);

    const trail = runtime.rehearsalActionTrails.get(move.assetId);
    if (!trail) return;
    if (Math.abs(trail.lastProgress - progress) > 0.012 || progress >= 0.995) {
      const points = [];
      const first = move.startAt ?? 0;
      const last = Math.max(first, progress);
      for (let index = 0; index < 14; index += 1) {
        const t = index / 13;
        points.push(getRehearsalMovementVector(move, THREE.MathUtils.lerp(first, last, t), lift));
      }
      trail.line.geometry.dispose();
      trail.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
      trail.lastProgress = progress;
    }
    trail.line.material.opacity = plan.movementTrails ? 0.16 + local * 0.44 : 0;
  });
}

function animateRehearsalArtillery(plan, progress) {
  runtime.rehearsalActionProjectiles.forEach((effect) => {
    const { mission } = effect;
    const fireAt = mission.fireAt ?? 0.18;
    const impactAt = mission.impactAt ?? 0.62;
    const flightT = THREE.MathUtils.clamp((progress - fireAt) / Math.max(0.01, impactAt - fireAt), 0, 1);
    const projectileVisible = progress >= fireAt && progress <= impactAt;
    const impactT = THREE.MathUtils.clamp((progress - impactAt) / 0.22, 0, 1);
    const muzzleT = THREE.MathUtils.clamp((progress - fireAt) / 0.12, 0, 1);
    const arcVisible = progress >= fireAt - 0.08 && progress <= 1;
    const point = effect.curve.getPoint(flightT);

    effect.arc.material.opacity = arcVisible && plan.artilleryArcs ? 0.2 : 0;
    effect.arcTube.material.opacity = arcVisible && plan.artilleryArcs ? 0.54 : 0;
    effect.projectile.visible = projectileVisible;
    effect.projectile.position.copy(point);
    effect.projectile.material.opacity = projectileVisible ? 0.96 : 0;
    effect.projectile.scale.setScalar(1.2 + Math.sin(runtime.clock.elapsedTime * 24) * 0.22);

    if (projectileVisible && Math.abs(effect.lastTrailT - flightT) > 0.014) {
      const trailStart = Math.max(0, Math.floor(flightT * effect.curvePoints.length) - 14);
      const trailEnd = Math.max(trailStart + 2, Math.floor(flightT * effect.curvePoints.length));
      const trailPoints = effect.curvePoints.slice(trailStart, trailEnd);
      effect.trail.geometry.dispose();
      effect.trail.geometry = new THREE.BufferGeometry().setFromPoints(trailPoints.length ? trailPoints : [point, point]);
      effect.lastTrailT = flightT;
    }
    effect.trail.material.opacity = projectileVisible ? 0.72 : 0;

    setSpriteOpacity(effect.muzzle, muzzleT > 0 && muzzleT < 1 ? Math.max(0, 0.82 - muzzleT * 1.2) : 0);
    effect.muzzle.scale.setScalar(1.5 + muzzleT * 2.8);
    setSpriteOpacity(effect.impactFlash, impactT > 0 ? Math.max(0, 0.92 - impactT * 1.7) : 0);
    effect.impactFlash.scale.setScalar(2.2 + impactT * 5.8);
    setSpriteOpacity(effect.impactDust, impactT > 0 ? Math.max(0, 0.58 - impactT * 0.3) : 0);
    effect.impactDust.scale.setScalar(2.4 + impactT * 6);
    effect.shockwave.visible = impactT > 0;
    effect.shockwave.material.opacity = impactT > 0 ? Math.max(0, 0.72 - impactT * 0.85) : 0;
    effect.shockwave.scale.setScalar(0.45 + impactT * 4.2);
    effect.targetMark.material.opacity = arcVisible ? 0.2 + Math.sin(runtime.clock.elapsedTime * 6) * 0.08 : 0;
  });
}

function renderRehearsalActionReadout(plan, progress, force = false) {
  const now = performance.now();
  if (!force && now - runtime.rehearsalActionLastRender < 180) return;
  runtime.rehearsalActionLastRender = now;
  const percent = Math.round(progress * 100);
  const hasImpact = plan.tacticalActions?.includes("충격파") && progress >= 0.54;
  const actionLabel = hasImpact ? `${plan.visibleAction} · 충격파` : plan.visibleAction;
  runtime.rehearsalActionState = progress >= 0.98 ? `${plan.label} 완료` : actionLabel;
  setStatus(`${plan.label} · ${runtime.rehearsalActionState} ${percent}%`);
}

function animateRehearsalAction(delta, scaledDelta) {
  if (!runtime.rehearsalActionLayer) return;
  const plan = getRehearsalActionPlan(runtime.rehearsalActionActiveEventId);
  advanceRehearsalActionClock(scaledDelta);
  const progress = getRehearsalActionProgress(plan);
  runtime.rehearsalActionLayer.visible = runtime.layerVisibility.effects;
  animateRehearsalMovement(plan, progress, delta);
  animateRehearsalArtillery(plan, progress, delta);
  renderRehearsalActionReadout(plan, progress);
}

function createSelectionMarker() {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.045, 8, 72),
    new THREE.MeshBasicMaterial({ color: 0x5ff4df, transparent: true, opacity: 0.92, depthWrite: false })
  );
  ring.rotation.x = Math.PI / 2;
  ring.visible = false;
  runtime.scene.add(ring);
  runtime.selectionMarker = ring;
}

function getCombatReplayColor(unit) {
  if (unit.side === "red") return 0xff684f;
  if (unit.kind === "fire") return 0xffbd4a;
  if (unit.kind === "air") return 0x8fd9ff;
  return 0x5ff4df;
}

function createCombatVisibilityMarker(entry) {
  if (!entry || !runtime.scene || !combatReplayAssetIds.includes(entry.unit.id)) return null;
  if (runtime.combatReplayMarkers.has(entry.unit.id)) return runtime.combatReplayMarkers.get(entry.unit.id);

  const color = getCombatReplayColor(entry.unit);
  const group = new THREE.Group();
  const radius = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.82, 0.03, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.055, depthWrite: false })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.86, 0.018, 8, 72),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: PROFESSIONAL_MARKER_OPACITY, depthWrite: false })
  );
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 1.7, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, depthWrite: false })
  );
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 10, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.52, depthWrite: false })
  );
  ring.rotation.x = Math.PI / 2;
  mast.position.y = 0.9;
  cap.position.y = 1.78;
  group.add(radius, ring, mast, cap);
  group.visible = false;
  runtime.scene.add(group);

  const marker = { group, radius, ring, mast, cap, color };
  runtime.combatReplayMarkers.set(entry.unit.id, marker);
  refreshCombatVisibilityMarker(entry);
  return marker;
}

function refreshCombatVisibilityMarker(entry, progress = 0) {
  const marker = runtime.combatReplayMarkers.get(entry?.unit?.id);
  if (!marker) return;
  const visible = runtime.combatReplayActive && runtime.layerVisibility.effects;
  marker.group.visible = visible;
  if (!visible) return;

  const { unit, anchor } = entry;
  const groundY = terrainHeight(anchor.position.x, anchor.position.z) + 0.18;
  const pulse = 1 + Math.sin(runtime.clock.elapsedTime * 7 + progress * Math.PI * 2) * 0.08;
  const baseScale = unit.kind === "air" ? 0.86 : unit.kind === "fire" ? 0.9 : unit.side === "red" ? 0.84 : 0.78;
  const mastHeight = Math.max(1.1, (unit.kind === "air" ? anchor.position.y - groundY : 1) + 0.42);
  marker.group.position.set(anchor.position.x, groundY, anchor.position.z);
  marker.radius.scale.setScalar(baseScale * pulse);
  marker.ring.scale.setScalar(baseScale * (1.05 + Math.sin(runtime.clock.elapsedTime * 5) * 0.04));
  marker.mast.scale.y = mastHeight / 1.7;
  marker.mast.position.y = mastHeight / 2;
  marker.cap.position.y = mastHeight;
  marker.radius.material.opacity = unit.side === "red" ? 0.07 : 0.045;
  marker.ring.material.opacity = PROFESSIONAL_MARKER_OPACITY + Math.sin(runtime.clock.elapsedTime * 6) * 0.06;
}

function createCombatReplayRouteCue(assetId) {
  const plan = combatReplayMotionPlan[assetId];
  if (!plan || runtime.combatReplayRouteCues.has(assetId) || !runtime.scene) return runtime.combatReplayRouteCues.get(assetId) || null;

  const unit = runtime.units.get(assetId)?.unit || {};
  const color = getCombatReplayColor(unit);
  const line = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineDashedMaterial({ color, transparent: true, opacity: 0.76, dashSize: 0.55, gapSize: 0.26, depthWrite: false })
  );
  line.visible = false;
  runtime.scene.add(line);
  const cue = { assetId, line };
  runtime.combatReplayRouteCues.set(assetId, cue);
  refreshCombatReplayRouteCue(assetId);
  return cue;
}

function refreshCombatReplayRouteCue(assetId) {
  const cue = runtime.combatReplayRouteCues.get(assetId);
  const plan = combatReplayMotionPlan[assetId];
  if (!cue || !plan) return;
  const start = pointToVector(plan.start, 0.34);
  const end = pointToVector(plan.end, 0.34);
  const mid = pointToVector([(plan.start[0] + plan.end[0]) / 2, (plan.start[1] + plan.end[1]) / 2], 0.42);
  const curve = new THREE.CatmullRomCurve3([start, mid, end]);
  cue.line.geometry.dispose();
  cue.line.geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(28));
  cue.line.computeLineDistances();
}

function setCombatReplayCuesVisible(active) {
  const visible = Boolean(active || DEFAULT_VISTA_SCENARIO_VISIBLE);
  runtime.combatReplayMarkers.forEach((marker) => {
    marker.group.visible = Boolean(active) && runtime.layerVisibility.effects;
  });
  runtime.combatReplayRouteCues.forEach((cue) => {
    cue.line.visible = visible && runtime.layerVisibility.routes;
  });
}

function createAssetInfluenceOverlay() {
  const group = new THREE.Group();
  const radius = new THREE.Mesh(
    new THREE.CylinderGeometry(4.2, 4.2, 0.04, 64),
    new THREE.MeshBasicMaterial({ color: 0x5ff4df, transparent: true, opacity: 0.08, depthWrite: false })
  );
  const perimeter = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.035, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x5ff4df, transparent: true, opacity: 0.72, depthWrite: false })
  );
  perimeter.rotation.x = Math.PI / 2;
  const commLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0x8fd9ff, transparent: true, opacity: 0.68 })
  );
  const threatLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineDashedMaterial({ color: 0xff725e, transparent: true, opacity: 0.74, dashSize: 0.5, gapSize: 0.28 })
  );
  const routeLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0xffbd4a, transparent: true, opacity: 0.58 })
  );
  group.add(radius, perimeter, commLine, threatLine, routeLine);
  group.visible = false;
  runtime.scene.add(group);
  runtime.assetInfluenceOverlay = { group, radius, perimeter, commLine, threatLine, routeLine };
}

function setLineGeometry(line, points) {
  line.geometry.dispose();
  line.geometry = new THREE.BufferGeometry().setFromPoints(points);
  if (line.computeLineDistances) line.computeLineDistances();
}

function refreshAssetInfluenceOverlay(force = false) {
  const overlay = runtime.assetInfluenceOverlay;
  if (!overlay) return;
  const now = performance.now();
  if (!force && now - runtime.assetInfluenceLastRefresh < 220) return;
  runtime.assetInfluenceLastRefresh = now;
  const entry = getAssetEntry();
  const analysis = entry ? analyzeAssetPlacement(entry) : null;
  runtime.placementScore = analysis;
  runtime.placementCandidates = analysis?.candidates || [];
  if (!entry || !analysis) {
    overlay.group.visible = false;
    return;
  }

  const [x, z] = analysis.position;
  const anchor = new THREE.Vector3(x, terrainHeight(x, z) + 0.24, z);
  const color = analysis.tone === "good" ? 0x5ff4df : analysis.tone === "warn" ? 0xffbd4a : 0xff725e;
  overlay.group.visible = true;
  overlay.radius.position.copy(anchor);
  overlay.perimeter.position.copy(anchor);
  overlay.radius.material.color.setHex(color);
  overlay.perimeter.material.color.setHex(color);
  overlay.radius.scale.setScalar(0.86 + analysis.score / 100 * 0.45);
  overlay.perimeter.scale.setScalar(0.86 + analysis.score / 100 * 0.45);

  const comm = getNearestAsset({ x, z }, (candidate) => candidate.side === "blue" && ["relay", "command"].includes(candidate.kind) && candidate.id !== entry.unit.id);
  const threat = getNearestAsset({ x, z }, (candidate) => candidate.side === "red" && candidate.id !== entry.unit.id);
  overlay.commLine.visible = Boolean(comm);
  overlay.threatLine.visible = Boolean(threat) && runtime.layerVisibility.threat;
  overlay.routeLine.visible = runtime.layerVisibility.routes;
  if (comm) setLineGeometry(overlay.commLine, [anchor, comm.entry.anchor.position.clone().add(new THREE.Vector3(0, 0.8, 0))]);
  if (threat) setLineGeometry(overlay.threatLine, [anchor, threat.entry.anchor.position.clone().add(new THREE.Vector3(0, 0.8, 0))]);
  setLineGeometry(overlay.routeLine, [anchor, pointToVector([18, -5], 0.38)]);
}

function refreshSelectionMarker() {
  if (!runtime.selectionMarker) return;
  const entry = getAssetEntry();
  if (!entry) {
    runtime.selectionMarker.visible = false;
    return;
  }
  runtime.selectionMarker.visible = true;
  runtime.selectionMarker.position.set(
    entry.anchor.position.x,
    terrainHeight(entry.anchor.position.x, entry.anchor.position.z) + 0.18,
    entry.anchor.position.z
  );
  const scale = entry.unit.kind === "air" ? 1.45 : entry.unit.kind === "ground" ? 1.2 : 0.92;
  runtime.selectionMarker.scale.setScalar(scale);
}

function applyLayerVisibility() {
  runtime.routeLines.forEach(({ line }) => {
    line.visible = runtime.layerVisibility.routes;
  });
  runtime.units.forEach((entry) => {
    if (!entry.label) return;
    const visible = runtime.combatReplayActive
      ? combatReplayAssetIds.includes(entry.unit.id)
      : shouldShowUnitByDefault(entry.unit);
    entry.label.visible = runtime.layerVisibility.labels && visible;
  });
  if (!runtime.layerVisibility.threat) {
    Object.values(runtime.overlays).forEach((overlay) => {
      overlay.visible = false;
    });
    if (runtime.commanderBeam) runtime.commanderBeam.visible = false;
  }
  if (!runtime.layerVisibility.effects) {
    runtime.effects.forEach((effect) => {
      effect.group.visible = false;
    });
  }
  if (runtime.rehearsalActionLayer) {
    runtime.rehearsalActionLayer.visible = runtime.layerVisibility.effects;
  }
  setCombatReplayCuesVisible(runtime.combatReplayActive);
  refreshAssetInfluenceOverlay(true);
}

function setOverlayMode(visual) {
  Object.values(runtime.overlays).forEach((overlay) => {
    overlay.visible = false;
  });
  runtime.commanderBeam.visible = false;
  const strike = runtime.effects.find((effect) => effect.id === "strike");
  if (strike) strike.group.visible = false;

  if (["comm_shadow", "risk_chain", "commander_result"].includes(visual)) runtime.overlays.comm.visible = true;
  if (["fog_band", "risk_chain"].includes(visual)) runtime.overlays.fog.visible = true;
  if (["supply_warning", "commander_result"].includes(visual)) runtime.overlays.steep.visible = true;
  if (["enemy_contact", "risk_chain"].includes(visual) && strike) {
    strike.group.visible = true;
    strike.age = 0;
  }
  if (visual === "commander_result") runtime.commanderBeam.visible = true;

  const a = runtime.routeLines.get("coa_a")?.line;
  const b = runtime.routeLines.get("coa_b")?.line;
  if (a) a.material.opacity = visual === "commander_result" ? 0.32 : 0.74;
  if (b) b.material.opacity = visual === "commander_result" ? 1 : 0.9;
  applyLayerVisibility();
  renderStrikeTelemetry(true);
}

function setCameraPreset(name) {
  const preset = cameraPresets[name] || cameraPresets.overview;
  runtime.cameraPosition.fromArray(preset.position);
  runtime.cameraTarget.fromArray(preset.target);
  runtime.cameraMode = name;
  runtime.cameraZoomLevel = 1;
}

function setCameraOrbitMode(mode) {
  const presetName = cameraPresets[mode] ? mode : "overview";
  setCameraPreset(presetName);
  setStatus(`VISTA 3D 보기모드: ${cameraModeLabels[presetName] || presetName}`);
  renderAssetCommandRail();
}

function zoomCameraByFactor(factor) {
  if (!runtime.cameraPosition || !runtime.cameraTarget) return runtime.cameraZoomLevel;
  const offset = runtime.cameraPosition.clone().sub(runtime.cameraTarget);
  const distance = offset.length();
  if (!Number.isFinite(distance) || distance <= 0.01) return runtime.cameraZoomLevel;
  const nextDistance = THREE.MathUtils.clamp(distance * factor, 5.8, 82);
  offset.setLength(nextDistance);
  runtime.cameraPosition.copy(runtime.cameraTarget).add(offset);
  runtime.cameraZoomLevel = Number(THREE.MathUtils.clamp(runtime.cameraZoomLevel / factor, 0.45, 4).toFixed(2));
  setStatus(`VISTA 3D 줌 ${runtime.cameraZoomLevel.toFixed(2)}x / ${cameraModeLabels[runtime.cameraMode] || runtime.cameraMode}`);
  return runtime.cameraZoomLevel;
}

function setCameraZoom(action) {
  if (action === "in") return zoomCameraByFactor(0.78);
  if (action === "out") return zoomCameraByFactor(1.28);
  const presetName = cameraPresets[runtime.cameraMode] ? runtime.cameraMode : "overview";
  setCameraPreset(presetName);
  setStatus(`VISTA 3D 줌 기준 / ${cameraModeLabels[presetName] || presetName}`);
  return runtime.cameraZoomLevel;
}

function orbitCameraByDelta(deltaX, deltaY) {
  if (!runtime.camera) return;
  const offset = runtime.cameraPosition.clone().sub(runtime.cameraTarget);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta -= deltaX * 0.006;
  spherical.phi = THREE.MathUtils.clamp(spherical.phi - deltaY * 0.004, 0.32, 1.42);
  runtime.cameraPosition.copy(new THREE.Vector3().setFromSpherical(spherical).add(runtime.cameraTarget));
  runtime.cameraMode = "free";
  renderAssetCommandRail();
}

function panCameraByDelta(deltaX, deltaY) {
  if (!runtime.camera) return;
  const offset = runtime.cameraPosition.clone().sub(runtime.cameraTarget);
  const distance = THREE.MathUtils.clamp(offset.length(), 8, 90);
  const viewForward = runtime.cameraTarget.clone().sub(runtime.cameraPosition);
  viewForward.y = 0;
  if (viewForward.lengthSq() < 0.0001) viewForward.set(0, 0, -1);
  viewForward.normalize();
  const viewRight = new THREE.Vector3().crossVectors(viewForward, new THREE.Vector3(0, 1, 0)).normalize();
  const panScale = THREE.MathUtils.clamp(distance * 0.0026, 0.026, 0.16);
  const move = viewRight
    .multiplyScalar(-deltaX * panScale)
    .add(viewForward.multiplyScalar(deltaY * panScale));
  runtime.cameraPosition.add(move);
  runtime.cameraTarget.add(move);
  runtime.cameraMode = "free";
  renderAssetCommandRail();
}

function tiltCameraByDelta(deltaX, deltaY) {
  if (!runtime.camera) return;
  const offset = runtime.cameraPosition.clone().sub(runtime.cameraTarget);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  spherical.theta -= deltaX * 0.0028;
  spherical.phi = THREE.MathUtils.clamp(spherical.phi - deltaY * 0.0072, 0.24, 1.5);
  runtime.cameraPosition.copy(new THREE.Vector3().setFromSpherical(spherical).add(runtime.cameraTarget));
  runtime.cameraMode = "free";
  renderAssetCommandRail();
}

function applyCameraDrag(intent, deltaX, deltaY) {
  if (intent === "pan") {
    panCameraByDelta(deltaX, deltaY);
    return;
  }
  if (intent === "tilt") {
    tiltCameraByDelta(deltaX, deltaY);
    return;
  }
  if (intent === "precision") {
    orbitCameraByDelta(deltaX * 0.45, deltaY * 0.45);
    return;
  }
  orbitCameraByDelta(deltaX, deltaY);
}

function handleCanvasWheel(event) {
  event.preventDefault();
  const factor = event.deltaY > 0 ? 1.12 : 0.9;
  zoomCameraByFactor(factor);
}

function toggleLayer(layerId) {
  if (!(layerId in runtime.layerVisibility)) return false;
  runtime.layerVisibility[layerId] = !runtime.layerVisibility[layerId];
  const visual = terrainData.eventBindings[runtime.currentEventId]?.visual || "route_compare";
  setOverlayMode(visual);
  renderAssetCommandRail();
  return runtime.layerVisibility[layerId];
}

function setPlacementMode(mode) {
  if (!Object.prototype.hasOwnProperty.call(assetModeLabels, mode)) return;
  runtime.placementMode = mode;
  const template = getAssetTemplate(runtime.placementTemplateId);
  if (mode === "place") {
    setStatus(`배치 모드: ${template.name} 지형 클릭`);
  } else if (mode === "move") {
    setStatus(runtime.selectedEditableAssetId ? "이동 모드: 새 위치를 지형에서 클릭" : "이동 모드: 먼저 자산 선택");
  } else {
    setStatus("선택 모드: 자산 클릭 또는 드래그 관측");
  }
  renderAssetCommandRail();
}

function setPlacementTemplate(templateId) {
  const template = getAssetTemplate(templateId);
  runtime.placementTemplateId = template.id;
  setPlacementMode("place");
  setStatus(`배치 대기: ${template.name}`);
}

function updateAssetLabel(entry) {
  removeLabel(entry.label);
  entry.label = createLabel(entry.unit.name, entry.anchor.position, getAssetTone(entry.unit));
}

function selectEditableAsset(assetId) {
  if (!assetId || !runtime.editableAssets.has(assetId)) {
    runtime.selectedEditableAssetId = null;
    refreshSelectionMarker();
    refreshAssetInfluenceOverlay(true);
    renderAssetCommandRail();
    return null;
  }
  runtime.selectedEditableAssetId = assetId;
  const entry = runtime.editableAssets.get(assetId);
  runtime.cameraTarget.lerp(entry.anchor.position, 0.72);
  refreshSelectionMarker();
  refreshAssetInfluenceOverlay(true);
  renderAssetCommandRail();
  setStatus(`선택: ${entry.unit.name}`);
  return entry.unit;
}

function moveSelectedAssetToPoint(point) {
  const entry = getAssetEntry();
  const ground = normalizeGroundPoint(point);
  if (!entry || !ground) return null;
  entry.unit.position = [ground.x, ground.z];
  delete entry.unit.route;
  delete entry.unit.routeOffset;
  placeUnit(entry.unit, entry.anchor);
  updateLabelPosition(entry);
  refreshSelectionMarker();
  refreshAssetInfluenceOverlay(true);
  setStatus(`${entry.unit.name} 이동 / X ${ground.x.toFixed(1)} Z ${ground.z.toFixed(1)}`);
  renderAssetCommandRail();
  return { id: entry.unit.id, x: ground.x, z: ground.z };
}

function addEditableAsset(templateId = runtime.placementTemplateId, point = null) {
  const template = getAssetTemplate(templateId);
  const fallback = {
    x: runtime.cameraTarget.x + Math.sin(runtime.assetSerial * 1.7) * 5,
    z: runtime.cameraTarget.z + Math.cos(runtime.assetSerial * 1.3) * 4
  };
  const ground = normalizeGroundPoint(point) || normalizeGroundPoint(fallback);
  const serial = runtime.assetSerial;
  runtime.assetSerial += 1;
  const unit = {
    id: `editable_${template.id}_${serial}`,
    name: `${template.name} ${serial}`,
    kind: template.kind,
    side: template.side,
    model: template.model,
    position: [ground.x, ground.z],
    heading: 0,
    scale: template.scale,
    readiness: template.readiness,
    mobility: template.mobility,
    sensor: template.sensor,
    note: template.note,
    templateId: template.id,
    userPlaced: true
  };
  createUnit(unit);
  selectEditableAsset(unit.id);
  runtime.placementMode = "select";
  setStatus(`${unit.name} 배치 완료`);
  renderAssetCommandRail();
  return unit.id;
}

function renderPlacementScorecard(analysis) {
  if (!analysis) return "";
  const bestCandidate = analysis.candidates?.[0];
  return `
    <div class="asset-placement-scorecard is-${escapeHtml(analysis.tone)}">
      <div class="asset-placement-summary">
        <span>배치 판정</span>
        <strong>${escapeHtml(analysis.summary)}</strong>
        <b class="asset-score-pill">${Math.round(analysis.score)}</b>
      </div>
      <div class="asset-placement-factors">
        ${analysis.factors.map((factor) => `
          <span style="--value:${Math.round(factor.value)}%">
            <b>${escapeHtml(factor.label)}</b>
            <i></i>
            <em>${escapeHtml(factor.detail)}</em>
          </span>
        `).join("")}
      </div>
      <div class="asset-candidate-list">
        <div>
          <span>추천 후보</span>
          ${bestCandidate ? `<button class="mode-button" type="button" data-asset-action="recommend">추천 적용</button>` : ""}
        </div>
        ${(analysis.candidates || []).map((candidate) => `
          <button class="asset-candidate-item is-${escapeHtml(candidate.tone)}" type="button" data-placement-candidate="${escapeHtml(candidate.id)}">
            <strong>${escapeHtml(candidate.label)}</strong>
            <small>${escapeHtml(candidate.brief)}</small>
            <b>${Math.round(candidate.score)}</b>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderVistaScenarioRail() {
  const phase = getStrikeReplayPhase();
  return `
    <div class="vista-scenario-card">
      <span>VISTA 시나리오</span>
      <strong>${escapeHtml(VISTA_SEUNGJIN_STAGE_27_REPLAY.title)}</strong>
      <p>${escapeHtml(VISTA_SEUNGJIN_STAGE_27_REPLAY.assetSummary)}</p>
      <b>${escapeHtml(VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId)}</b>
    </div>
    ${VISTA_SEUNGJIN_STAGE_27_REPLAY.actions.map((action) => {
      const isActive = phase.activeStep?.id === action.id && phase.isLive && !phase.isComplete;
      const isComplete = phase.isLive && phase.progress >= action.atSeconds / STRIKE_REPLAY_DURATION_SECONDS;
      return `
        <button class="asset-palette-item vista-stage-action ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}" type="button" data-stage-action="${escapeHtml(action.id)}" data-asset-id="${escapeHtml(action.assetId)}">
          <span class="asset-palette-swatch ${action.id.includes("apache") ? "blue" : action.id.includes("green") ? "green" : "yellow"}" aria-hidden="true"></span>
          <span>
            <strong>${escapeHtml(action.label)}</strong>
            <small>${escapeHtml(action.brief)}</small>
          </span>
          <b class="vista-action-time">T+${action.atSeconds}s</b>
        </button>
      `;
    }).join("")}
  `;
}

function renderAssetCommandRail() {
  const palette = document.getElementById("assetPaletteList");
  const status = document.getElementById("assetModeStatus");
  const inspector = document.getElementById("selectedAssetInspector");
  const showVistaScenario = runtime.combatReplayActive || DEFAULT_VISTA_SCENARIO_VISIBLE;

  if (status) status.textContent = showVistaScenario ? "VISTA 27단계" : assetModeLabels[runtime.placementMode] || "선택 모드";

  document.querySelectorAll("[data-asset-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.assetMode === runtime.placementMode);
  });

  document.querySelectorAll("[data-camera-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.cameraMode === runtime.cameraMode);
  });

  document.querySelectorAll("[data-layer-toggle]").forEach((button) => {
    const layerId = button.dataset.layerToggle;
    button.classList.toggle("is-active", Boolean(runtime.layerVisibility[layerId]));
  });

  if (palette) {
    palette.innerHTML = showVistaScenario
      ? renderVistaScenarioRail()
      : editableAssetTemplates
      .map((template) => {
        const isActive = template.id === runtime.placementTemplateId;
        return `
          <button class="asset-palette-item ${isActive ? "is-active" : ""}" type="button" data-asset-template="${escapeHtml(template.id)}">
            <span class="asset-palette-swatch ${escapeHtml(template.side)}" aria-hidden="true"></span>
            <span>
              <strong>${escapeHtml(template.name)}</strong>
              <small>${escapeHtml(template.note)}</small>
            </span>
            <b>${escapeHtml(kindLabels[template.kind] || template.kind)}</b>
          </button>
        `;
      })
      .join("");
  }

  if (!inspector) return;
  const entry = getAssetEntry();
  if (!entry) {
    if (showVistaScenario) {
      inspector.innerHTML = `
        <div class="asset-inspector-empty vista-scenario-card">
          <span>선택 시나리오</span>
          <strong>${escapeHtml(VISTA_SEUNGJIN_STAGE_27_REPLAY.title)}</strong>
          <p>${escapeHtml(VISTA_SEUNGJIN_STAGE_27_REPLAY.missionSummary)}</p>
          <b>${escapeHtml(VISTA_SEUNGJIN_STAGE_27_REPLAY.sourcePath)}</b>
        </div>
      `;
      return;
    }
    inspector.innerHTML = `
      <div class="asset-inspector-empty">
        <span>선택 자산</span>
        <strong>지도 자산을 선택하세요.</strong>
        <p>선택 모드는 드래그로 지도를 돌리고, 배치 모드는 지형 클릭으로 자산을 추가합니다.</p>
      </div>
    `;
    return;
  }

  const unit = entry.unit;
  const position = unit.position || [entry.anchor.position.x, entry.anchor.position.z];
  const readiness = Number(unit.readiness ?? 72);
  const mobility = Number(unit.mobility ?? (unit.route ? 70 : 38));
  const sensor = Number(unit.sensor ?? (unit.kind === "relay" ? 88 : 54));
  const heading = Number(unit.heading || 0);
  const placementAnalysis = analyzeAssetPlacement(entry);
  runtime.placementScore = placementAnalysis;
  runtime.placementCandidates = placementAnalysis?.candidates || [];
  inspector.innerHTML = `
    <div class="asset-status-card is-${escapeHtml(unit.side || "neutral")}">
      <div class="asset-card-heading">
        <span>${escapeHtml(kindLabels[unit.kind] || unit.kind)} / ${escapeHtml(sideLabels[unit.side] || unit.side)}</span>
        <strong>${escapeHtml(unit.name)}</strong>
        <b>${Math.round(readiness)}%</b>
      </div>
      <div class="asset-coordinate-readout">
        <span>X ${Number(position[0]).toFixed(1)}</span>
        <span>Z ${Number(position[1]).toFixed(1)}</span>
        <span>${unit.userPlaced ? "사용자 배치" : "시나리오 자산"}</span>
      </div>
      ${renderPlacementScorecard(placementAnalysis)}
      <label class="asset-editor-field">
        <span>호칭</span>
        <input id="selectedAssetNameInput" type="text" value="${escapeHtml(unit.name)}" />
      </label>
      <label class="asset-editor-field">
        <span>방위 ${Math.round(heading)}도</span>
        <input id="selectedAssetHeadingInput" type="range" min="0" max="359" value="${Math.round(heading)}" />
      </label>
      <label class="asset-editor-field">
        <span>준비도 ${Math.round(readiness)}%</span>
        <input id="selectedAssetReadinessInput" type="range" min="0" max="100" value="${Math.round(readiness)}" />
      </label>
      <div class="asset-stat-bars">
        <span style="--value:${Math.round(readiness)}%"><b>준비</b><i></i></span>
        <span style="--value:${Math.round(mobility)}%"><b>기동</b><i></i></span>
        <span style="--value:${Math.round(sensor)}%"><b>관측</b><i></i></span>
      </div>
      <div class="asset-nudge-grid" aria-label="선택 자산 미세 이동">
        <button class="mode-button" type="button" data-asset-nudge-x="0" data-asset-nudge-z="-1.2">북</button>
        <button class="mode-button" type="button" data-asset-nudge-x="-1.2" data-asset-nudge-z="0">서</button>
        <button class="mode-button" type="button" data-asset-nudge-x="1.2" data-asset-nudge-z="0">동</button>
        <button class="mode-button" type="button" data-asset-nudge-x="0" data-asset-nudge-z="1.2">남</button>
      </div>
      <div class="asset-action-row">
        <button class="mode-button" type="button" data-asset-action="focus">추적</button>
        <button class="mode-button" type="button" data-asset-action="duplicate">복제</button>
        <button class="mode-button" type="button" data-asset-action="remove">철수</button>
      </div>
    </div>
  `;
}

function setRaycasterFromEvent(event) {
  if (!runtime.canvas || !runtime.camera) return false;
  const rect = runtime.canvas.getBoundingClientRect();
  runtime.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  runtime.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  runtime.raycaster.setFromCamera(runtime.pointer, runtime.camera);
  return true;
}

function raycastTerrainFromEvent(event) {
  if (!runtime.terrain || !setRaycasterFromEvent(event)) return null;
  const hit = runtime.raycaster.intersectObject(runtime.terrain, false)[0];
  return hit?.point || null;
}

function getAssetIdFromObject(object) {
  let cursor = object;
  while (cursor) {
    if (cursor.userData?.assetId) return cursor.userData.assetId;
    cursor = cursor.parent;
  }
  return null;
}

function raycastAssetFromEvent(event) {
  if (!setRaycasterFromEvent(event)) return null;
  const objects = [...runtime.editableAssets.values()].map((entry) => entry.anchor);
  const hits = runtime.raycaster.intersectObjects(objects, true);
  for (const hit of hits) {
    const assetId = getAssetIdFromObject(hit.object);
    if (assetId && runtime.editableAssets.has(assetId)) return assetId;
  }
  return null;
}

function handleCanvasPick(event) {
  if (runtime.placementMode === "place") {
    const point = raycastTerrainFromEvent(event);
    if (point) addEditableAsset(runtime.placementTemplateId, point);
    return;
  }
  if (runtime.placementMode === "move") {
    const point = raycastTerrainFromEvent(event);
    if (point) moveSelectedAssetToPoint(point);
    return;
  }
  selectEditableAsset(raycastAssetFromEvent(event));
}

function handleCanvasPointerDown(event) {
  if (event.button !== 0) return;
  runtime.pointerDown = {
    id: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    moved: false,
    intent: getCameraDragIntent(event)
  };
  setCameraInteractionMode(runtime.pointerDown.intent, true);
  runtime.canvas?.setPointerCapture?.(event.pointerId);
}

function handleCanvasPointerMove(event) {
  if (!runtime.pointerDown || event.pointerId !== runtime.pointerDown.id) return;
  const intent = getCameraDragIntent(event);
  const deltaX = event.clientX - runtime.pointerDown.lastX;
  const deltaY = event.clientY - runtime.pointerDown.lastY;
  const total = Math.hypot(event.clientX - runtime.pointerDown.x, event.clientY - runtime.pointerDown.y);
  runtime.pointerDown.lastX = event.clientX;
  runtime.pointerDown.lastY = event.clientY;
  runtime.pointerDown.intent = intent;
  setCameraInteractionMode(intent, true);
  const canDragCamera = runtime.placementMode === "select" || intent !== "orbit";
  if (canDragCamera && total > 4) {
    runtime.pointerDown.moved = true;
    applyCameraDrag(intent, deltaX, deltaY);
  }
}

function handleCanvasPointerUp(event) {
  const pointerDown = runtime.pointerDown;
  if (!pointerDown || event.pointerId !== pointerDown.id) return;
  runtime.pointerDown = null;
  runtime.canvas?.releasePointerCapture?.(event.pointerId);
  setCameraInteractionMode(getCameraDragIntent(event), false);
  const total = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  if (!pointerDown.moved && total < 6 && pointerDown.intent === "orbit") handleCanvasPick(event);
}

function handleAssetInspectorChange(event) {
  const entry = getAssetEntry();
  if (!entry) return;
  const target = event.target;
  if (target.id === "selectedAssetNameInput") {
    entry.unit.name = target.value.trim() || entry.unit.name;
    updateAssetLabel(entry);
  }
  if (target.id === "selectedAssetHeadingInput") {
    entry.unit.heading = Number(target.value) || 0;
    entry.anchor.rotation.y = THREE.MathUtils.degToRad(entry.unit.heading);
  }
  if (target.id === "selectedAssetReadinessInput") {
    entry.unit.readiness = Number(target.value) || 0;
  }
  refreshAssetInfluenceOverlay(true);
  renderAssetCommandRail();
}

function removeSelectedAsset() {
  const entry = getAssetEntry();
  if (!entry) return;
  runtime.scene.remove(entry.anchor);
  removeLabel(entry.label);
  runtime.units.delete(entry.unit.id);
  runtime.editableAssets.delete(entry.unit.id);
  runtime.selectedEditableAssetId = null;
  refreshSelectionMarker();
  refreshAssetInfluenceOverlay(true);
  renderAssetCommandRail();
  setStatus(`${entry.unit.name} 철수 처리`);
}

function duplicateSelectedAsset() {
  const entry = getAssetEntry();
  if (!entry) return null;
  const point = {
    x: entry.anchor.position.x + 1.6,
    z: entry.anchor.position.z + 1.4
  };
  return addEditableAsset(getAssetTemplateForUnit(entry.unit).id, point);
}

function applyPlacementCandidate(candidateId) {
  const candidate = placementCandidateSlots.find((slot) => slot.id === candidateId);
  if (!candidate) return null;
  const result = moveSelectedAssetToPoint({ x: candidate.position[0], z: candidate.position[1] });
  if (result) {
    runtime.cameraTarget.copy(pointToVector(candidate.position, 1.2));
    setStatus(`추천 후보 적용: ${candidate.label}`);
  }
  return result;
}

function recommendPlacementForSelectedAsset() {
  const entry = getAssetEntry();
  if (!entry) return null;
  const analysis = analyzeAssetPlacement(entry);
  const best = analysis?.candidates?.[0];
  if (!best) return null;
  return applyPlacementCandidate(best.id);
}

function handleAssetInspectorClick(event) {
  const candidateButton = event.target.closest("[data-placement-candidate]");
  if (candidateButton) {
    applyPlacementCandidate(candidateButton.dataset.placementCandidate);
    return;
  }

  const nudgeButton = event.target.closest("[data-asset-nudge-x]");
  if (nudgeButton) {
    const entry = getAssetEntry();
    if (!entry) return;
    moveSelectedAssetToPoint({
      x: entry.anchor.position.x + Number(nudgeButton.dataset.assetNudgeX || 0),
      z: entry.anchor.position.z + Number(nudgeButton.dataset.assetNudgeZ || 0)
    });
    return;
  }

  const actionButton = event.target.closest("[data-asset-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.assetAction;
  const entry = getAssetEntry();
  if (action === "focus" && entry) {
    runtime.cameraTarget.copy(entry.anchor.position);
    setStatus(`추적: ${entry.unit.name}`);
  } else if (action === "duplicate") {
    duplicateSelectedAsset();
  } else if (action === "recommend") {
    recommendPlacementForSelectedAsset();
  } else if (action === "remove") {
    removeSelectedAsset();
  }
}

function bindAssetWorkspaceControls() {
  if (runtime.controlsBound) return;

  document.querySelectorAll("[data-asset-mode]").forEach((button) => {
    button.addEventListener("click", () => setPlacementMode(button.dataset.assetMode));
  });

  document.getElementById("assetPaletteList")?.addEventListener("click", (event) => {
    const stageActionButton = event.target.closest("[data-stage-action]");
    if (stageActionButton) {
      focusStrikeTelemetryAsset(stageActionButton.dataset.assetId);
      return;
    }
    const button = event.target.closest("[data-asset-template]");
    if (button) setPlacementTemplate(button.dataset.assetTemplate);
  });

  document.getElementById("cameraControlStack")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-camera-mode]");
    if (button) setCameraOrbitMode(button.dataset.cameraMode);
  });

  document.getElementById("warGroundZoomControls")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-camera-zoom]");
    if (button) setCameraZoom(button.dataset.cameraZoom);
  });

  document.getElementById("layerControlStack")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-layer-toggle]");
    if (button) toggleLayer(button.dataset.layerToggle);
  });

  document.querySelector("[data-map-focus-toggle]")?.addEventListener("click", toggleMapFocusMode);

  const inspector = document.getElementById("selectedAssetInspector");
  inspector?.addEventListener("click", handleAssetInspectorClick);
  inspector?.addEventListener("change", handleAssetInspectorChange);

  document.getElementById("strikeTelemetryPanel")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-asset-id]");
    if (button) focusStrikeTelemetryAsset(button.dataset.assetId);
  });

  runtime.canvas?.addEventListener("pointerdown", handleCanvasPointerDown);
  runtime.canvas?.addEventListener("pointermove", handleCanvasPointerMove);
  runtime.canvas?.addEventListener("pointerup", handleCanvasPointerUp);
  runtime.canvas?.addEventListener("wheel", handleCanvasWheel, { passive: false });
  document.addEventListener("keydown", handleCameraModifierKeydown);
  document.addEventListener("keyup", handleCameraModifierKeyup);
  setMapFocusMode(runtime.mapFocusMode);
  setCameraInteractionMode("orbit");
  runtime.controlsBound = true;
}

function setRouteProgressForEvent(eventId) {
  const index = terrainData.eventOrder.indexOf(eventId);
  if (index >= 0) {
    runtime.routeProgress = index / Math.max(1, terrainData.eventOrder.length - 1);
  }
}

function sampleRoute(routeId, t, offset = 0, lift = 0) {
  const route = runtime.routeLines.get(routeId);
  if (!route) return pointToVector(terrainData.routes[routeId][0], lift);
  const p = route.curve.getPoint(THREE.MathUtils.clamp(t, 0, 1));
  p.y = terrainHeight(p.x, p.z) + lift;
  if (offset) {
    const t2 = route.curve.getPoint(THREE.MathUtils.clamp(t + 0.015, 0, 1));
    const dir = t2.clone().sub(p).normalize();
    const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(offset);
    p.add(side);
    p.y = terrainHeight(p.x, p.z) + lift;
  }
  return p;
}

function smoothCombatStep(value) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function getCombatPlanPose(plan, progress) {
  const local = smoothCombatStep((progress - plan.phaseStart) / Math.max(0.01, plan.phaseEnd - plan.phaseStart));
  return {
    point: [
      THREE.MathUtils.lerp(plan.start[0], plan.end[0], local),
      THREE.MathUtils.lerp(plan.start[1], plan.end[1], local)
    ],
    heading: THREE.MathUtils.lerp(plan.headingStart, plan.headingEnd, local),
    altitude: plan.altitude ?? 0.7,
    local
  };
}

function setCombatUnitPose(assetId, point, heading, altitude = 0.7) {
  const entry = runtime.units.get(assetId);
  if (!entry) return null;
  entry.unit.position = point;
  entry.unit.heading = heading;
  if (entry.unit.kind === "air") entry.unit.altitude = altitude;
  const lift = getUnitTerrainLift(entry.unit);
  entry.anchor.position.copy(pointToVector(point, lift));
  entry.anchor.rotation.y = THREE.MathUtils.degToRad(heading);
  updateLabelPosition(entry);
  return entry;
}

function applyCombatReplayVisualState(entry, progress) {
  if (!entry || !combatReplayAssetIds.includes(entry.unit.id)) return;
  const activeStep = strikeReplayTimeline.find((step) => step.assetId === entry.unit.id);
  const stepPulse = activeStep ? Math.max(0, 1 - Math.abs(progress - activeStep.at) * 7) : 0;
  const targetImpactAt = {
    stage27_target_5: 16 / STRIKE_REPLAY_DURATION_SECONDS,
    stage27_target_6: 8 / STRIKE_REPLAY_DURATION_SECONDS,
    stage27_target_7: 8 / STRIKE_REPLAY_DURATION_SECONDS,
    stage27_target_9: 20 / STRIKE_REPLAY_DURATION_SECONDS
  }[entry.unit.id] ?? 20 / STRIKE_REPLAY_DURATION_SECONDS;
  const impactPulse = entry.unit.side === "red" ? Math.max(0, (progress - targetImpactAt) / 0.14) : 0;
  const baseScale = entry.unit.kind === "air" ? VISTA_MODEL_VISIBILITY_SCALE * 1.12 : VISTA_MODEL_VISIBILITY_SCALE;
  entry.anchor.scale.setScalar(baseScale + stepPulse * 0.18 + Math.min(impactPulse, 1) * 0.12);
  if (entry.unit.side === "red" && progress >= targetImpactAt) {
    entry.anchor.rotation.z = Math.sin(runtime.clock.elapsedTime * 18) * 0.035 * Math.max(0, 1 - (progress - targetImpactAt) * 2.2);
  } else {
    entry.anchor.rotation.z = 0;
  }
  if (entry.label) {
    entry.label.scale.set(1.65, 0.38, 1);
    entry.label.position.y = entry.anchor.position.y + (entry.unit.kind === "air" ? 1.18 : entry.unit.side === "red" ? 1.42 : 1.24);
  }
  refreshCombatVisibilityMarker(entry, progress);
}

function animateCombatReplay() {
  if (!runtime.combatReplayActive) return;
  const phase = getStrikeReplayPhase();
  const progress = phase.progress;
  runtime.combatReplayPhase = phase.stateLabel;

  Object.entries(combatReplayMotionPlan).forEach(([assetId, plan]) => {
    const pose = getCombatPlanPose(plan, progress);
    if (assetId === "stage27_apache_rocket") {
      const hoverT = Math.max(0, (progress - 20 / STRIKE_REPLAY_DURATION_SECONDS) / 0.2);
      const radiusX = THREE.MathUtils.lerp(2.2, 1.2, THREE.MathUtils.clamp(hoverT, 0, 1));
      const radiusZ = THREE.MathUtils.lerp(1.5, 0.9, THREE.MathUtils.clamp(hoverT, 0, 1));
      const orbitAngle = runtime.clock.elapsedTime * 1.25 * runtime.speed + progress * Math.PI * 2;
      const center = stage27Points.target9;
      const point = progress < 20 / STRIKE_REPLAY_DURATION_SECONDS
        ? pose.point
        : [center[0] + Math.sin(orbitAngle) * radiusX, center[1] + Math.cos(orbitAngle) * radiusZ];
      const heading = THREE.MathUtils.radToDeg(Math.atan2(center[0] - point[0], center[1] - point[1]));
      const entry = setCombatUnitPose(assetId, point, heading, 17.2 + Math.sin(orbitAngle * 1.7) * 0.9);
      applyCombatReplayVisualState(entry, progress);
      return;
    }
    if (assetId === "stage27_swarm_drone") {
      const weave = Math.sin(runtime.clock.elapsedTime * 2.4 + progress * 9) * 0.45;
      const point = [pose.point[0] + weave, pose.point[1] + Math.cos(runtime.clock.elapsedTime * 2.1) * 0.25];
      const entry = setCombatUnitPose(assetId, point, pose.heading + weave * 6, pose.altitude + Math.sin(runtime.clock.elapsedTime * 3) * 0.7);
      applyCombatReplayVisualState(entry, progress);
      return;
    }

    const entry = setCombatUnitPose(assetId, pose.point, pose.heading, pose.altitude);
    applyCombatReplayVisualState(entry, progress);
  });

  [
    ["stage27_k2_assault", 8 / STRIKE_REPLAY_DURATION_SECONDS],
    ["stage27_k21_assault", 8 / STRIKE_REPLAY_DURATION_SECONDS],
    ["stage27_apache_rocket", 20 / STRIKE_REPLAY_DURATION_SECONDS],
    ["stage27_follow_on_k2", 32 / STRIKE_REPLAY_DURATION_SECONDS]
  ].forEach(([assetId, eventAt]) => {
    const entry = runtime.units.get(assetId);
    if (!entry) return;
    const firePulse = Math.max(0, 1 - Math.abs(progress - eventAt) * 12);
    entry.anchor.scale.setScalar(VISTA_MODEL_VISIBILITY_SCALE + firePulse * 0.14);
    entry.anchor.rotation.z = assetId === "stage27_follow_on_k2" ? 0 : -firePulse * 0.024;
    updateLabelPosition(entry);
    applyCombatReplayVisualState(entry, progress);
  });

  combatReplayAssetIds.forEach((assetId) => {
    const cue = runtime.combatReplayRouteCues.get(assetId);
    if (cue) cue.line.visible = runtime.layerVisibility.routes && assetId in combatReplayMotionPlan;
  });
}

function updateRoutedUnits() {
  const base = runtime.routeProgress;
  runtime.units.forEach((entry) => {
    const { unit, anchor } = entry;
    if (!unit.route) return;
    const offset = unit.routeOffset || 0;
    const t = THREE.MathUtils.clamp(base - Math.abs(offset) * 0.012, 0, 1);
    const lift = getUnitTerrainLift(unit);
    const pos = sampleRoute(unit.route, t, offset, lift);
    const next = sampleRoute(unit.route, Math.min(t + 0.015, 1), offset, lift);
    anchor.position.copy(pos);
    const heading = Math.atan2(next.x - pos.x, next.z - pos.z);
    anchor.rotation.y = heading;
    updateLabelPosition(entry);
  });

  const air = runtime.units.get("air_patrol");
  if (air) {
    const time = runtime.clock.elapsedTime * 0.22 * runtime.speed;
    const x = -7 + Math.sin(time) * 12;
    const z = 12 + Math.cos(time * 0.8) * 7;
    air.anchor.position.set(x, terrainHeight(x, z) + 10, z);
    air.anchor.rotation.y = time + Math.PI / 2;
    updateLabelPosition(air);
  }
}

function setSpriteOpacity(sprite, opacity) {
  if (sprite?.material) sprite.material.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
}

function getStableFrameDelta(rawDelta) {
  return THREE.MathUtils.clamp(Number(rawDelta) || 0, 0, 1 / 30);
}

function getScaledFrameDelta(delta) {
  return delta * Math.max(0.5, runtime.speed || 1);
}

function advanceRehearsalActionClock(scaledDelta) {
  if (!runtime.playing || !runtime.rehearsalActionLayer) return;
  runtime.rehearsalActionElapsed += scaledDelta;
}

function animateFocusFireEffect(effect) {
  const duration = effect.duration || 4.6;
  const t = THREE.MathUtils.clamp(effect.age / duration, 0, 1);
  const rocketAt = 20 / STRIKE_REPLAY_DURATION_SECONDS;
  const rocketImpactAt = 24 / STRIKE_REPLAY_DURATION_SECONDS;
  const greenSignalAt = 32 / STRIKE_REPLAY_DURATION_SECONDS;
  const flightT = THREE.MathUtils.clamp((t - rocketAt) / (rocketImpactAt - rocketAt), 0, 1);
  const impactT = THREE.MathUtils.clamp((t - rocketImpactAt) / 0.14, 0, 1);
  const greenT = THREE.MathUtils.clamp((t - greenSignalAt) / 0.1, 0, 1);
  const projectileVisible = t >= rocketAt && t < rocketImpactAt + 0.03;
  const point = effect.curve.getPoint(flightT);

  effect.projectile.visible = projectileVisible;
  effect.projectileCore.visible = projectileVisible;
  effect.projectile.position.copy(point);
  effect.projectileCore.position.copy(point);
  const headPulse = 1 + Math.sin(effect.age * 18) * 0.16;
  effect.projectile.scale.setScalar(1.2 + headPulse * 0.34);
  effect.projectileCore.scale.setScalar(0.8 + headPulse * 0.18);

  const trailStart = Math.max(0, Math.floor(flightT * effect.curvePoints.length) - 16);
  const trailEnd = Math.max(trailStart + 2, Math.floor(flightT * effect.curvePoints.length));
  const trailPoints = effect.curvePoints.slice(trailStart, trailEnd);
  effect.trail.geometry.dispose();
  effect.trail.geometry = new THREE.BufferGeometry().setFromPoints(trailPoints.length ? trailPoints : [point, point]);
  effect.trail.material.opacity = projectileVisible ? Math.max(0.1, 0.72 - flightT * 0.28) : 0;

  const muzzleT = THREE.MathUtils.clamp((t - rocketAt) / 0.1, 0, 1);
  setSpriteOpacity(effect.muzzle, muzzleT > 0 ? Math.max(0, 0.72 - muzzleT * 1.8) : 0);
  effect.muzzle.scale.setScalar(1.8 + muzzleT * 3.1);
  effect.traceSprites.forEach((sprite, index) => {
    const localT = THREE.MathUtils.clamp((flightT - index * 0.13) / 0.45, 0, 1);
    setSpriteOpacity(sprite, projectileVisible ? Math.max(0, 0.32 - localT * 0.28) : 0);
    sprite.scale.setScalar(1.15 + localT * 1.35);
  });

  setSpriteOpacity(effect.impactFlash, impactT > 0 ? Math.max(0, 0.98 - impactT * 1.8) : 0);
  effect.impactFlash.scale.setScalar(2.8 + impactT * 6.8);
  setSpriteOpacity(effect.impactDust, impactT > 0 ? Math.max(0, 0.62 - impactT * 0.42) : 0);
  effect.impactDust.scale.setScalar(3.2 + impactT * 6.4);
  setSpriteOpacity(effect.impactSmoke, impactT > 0 ? Math.max(0, 0.44 - impactT * 0.24) : 0);
  effect.impactSmoke.scale.setScalar(3.8 + impactT * 7.2);
  effect.shockwave.visible = impactT > 0;
  effect.shockwave.scale.setScalar(0.5 + impactT * 2.7);
  effect.shockwave.material.opacity = impactT > 0 ? Math.max(0, 0.82 - impactT * 0.9) : 0;
  effect.targetMarker.material.opacity = t >= rocketAt - 0.05 ? 0.08 + Math.sin(effect.age * 5) * 0.035 : 0.035;
  effect.greenSignal.material.opacity = greenT > 0 ? Math.max(0.08, 0.48 - greenT * 0.16) : 0;
  effect.greenSignal.scale.set(1 + greenT * 0.35, 0.25 + greenT * 1.2, 1 + greenT * 0.35);
  effect.greenSignalHalo.material.opacity = greenT > 0 ? Math.max(0, 0.72 - greenT * 0.28) : 0;
  effect.greenSignalHalo.scale.setScalar(0.5 + greenT * 2.7 + Math.sin(effect.age * 5) * 0.08);

  strikeReplayTimeline.forEach((step) => {
    const entry = runtime.units.get(step.assetId);
    if (!entry) return;
    const pulse = Math.max(0, 1 - Math.abs(t - step.at) * 7);
    const visibleBase = runtime.combatReplayActive && combatReplayAssetIds.includes(step.assetId)
      ? VISTA_MODEL_VISIBILITY_SCALE * (entry.unit.kind === "air" ? 1.12 : 1)
      : 1;
    entry.anchor.scale.setScalar(visibleBase + pulse * 0.16);
  });
}

function animateEffects(delta, scaledDelta = getScaledFrameDelta(delta)) {
  runtime.effects.forEach((effect) => {
    if (!effect.group.visible) return;
    effect.age += scaledDelta;
    if (effect.kind === "focus-fire") {
      animateFocusFireEffect(effect);
      renderStrikeTelemetry();
      return;
    }
    const pulse = 1 + Math.sin(effect.age * 8) * 0.18;
    effect.sphere.scale.setScalar(1.1 + effect.age * 0.45);
    effect.sphere.material.opacity = Math.max(0.12, 0.55 - effect.age * 0.13);
    effect.ring.scale.setScalar(pulse + effect.age * 0.08);
    effect.ring.material.opacity = Math.max(0.18, 0.82 - effect.age * 0.16);
  });
}

function animate() {
  const delta = getStableFrameDelta(runtime.clock.getDelta());
  const scaledDelta = getScaledFrameDelta(delta);
  runtime.lastStableDelta = delta;
  runtime.lastScaledDelta = scaledDelta;
  if (runtime.playing) {
    runtime.routeProgress = THREE.MathUtils.clamp(runtime.routeProgress + scaledDelta * 0.028, 0, 1);
  }
  updateRoutedUnits();
  animateRehearsalAction(delta, scaledDelta);
  animateCombatReplay(delta, scaledDelta);
  animateEffects(delta, scaledDelta);
  refreshSelectionMarker();
  refreshAssetInfluenceOverlay();
  runtime.camera.position.lerp(runtime.cameraPosition, 0.045);
  const lookTarget = new THREE.Vector3();
  runtime.camera.getWorldDirection(lookTarget);
  runtime.camera.lookAt(runtime.cameraTarget);
  runtime.renderer.render(runtime.scene, runtime.camera);
  runtime.animationId = window.requestAnimationFrame(animate);
}

function resizeRenderer() {
  if (!runtime.renderer || !runtime.canvas) return;
  const rect = runtime.canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(260, Math.floor(rect.height));
  runtime.renderer.setSize(width, height, false);
  runtime.camera.aspect = width / height;
  runtime.camera.updateProjectionMatrix();
}

function initLights() {
  runtime.scene.add(new THREE.HemisphereLight(0xf2fff6, 0x6d765e, 2.15));
  const sun = new THREE.DirectionalLight(0xffffff, 3.05);
  sun.position.set(-12, 26, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  runtime.scene.add(sun);
  const rim = new THREE.DirectionalLight(0xd2fff4, 1.05);
  rim.position.set(22, 14, -12);
  runtime.scene.add(rim);
}

function initWarGround3dScene() {
  runtime.canvas = document.getElementById("warGround3dCanvas");
  if (!runtime.canvas || runtime.initialized) return;

  try {
    runtime.renderer = new THREE.WebGLRenderer({ canvas: runtime.canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
    runtime.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    runtime.renderer.outputColorSpace = THREE.SRGBColorSpace;
    runtime.renderer.setClearColor(0x8ea293, 1);
    runtime.renderer.shadowMap.enabled = true;

    runtime.scene = new THREE.Scene();
    runtime.scene.fog = null;
    runtime.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 240);
    runtime.camera.position.copy(runtime.cameraPosition);
    runtime.camera.lookAt(runtime.cameraTarget);

    initLights();
    runtime.terrain = createTerrainMesh();
    runtime.scene.add(runtime.terrain);
    createGridAndContours();
    createRouteLine("coa_a", 0xff8468, 0.72);
    createRouteLine("coa_b", 0x52f2d7, 0.9);
    terrainData.units.forEach(createUnit);
    createOverlayZones();
    createStrikeEffect();
    createSelectionMarker();
    createAssetInfluenceOverlay();
    runtime.initialized = true;
    bindAssetWorkspaceControls();
    renderAssetCommandRail();
    renderStrikeTelemetry(true);
    focusEvent(window.__warGroundCurrentEventId || document.body?.dataset?.rehearsalEventId || "start");
    resizeRenderer();
    window.addEventListener("resize", resizeRenderer);
    new ResizeObserver(resizeRenderer).observe(runtime.canvas.parentElement);
    setStatus(`${terrainData.trainingArea.name} 3D 준비 완료`);
    animate();
    loadRealTerrainData();
  } catch (error) {
    runtime.initialized = false;
    setStatus("3D 초기화 실패");
    console.error("WAR GROUND 3D init failed", error);
  }
}

function updateWarGround3dEvent(eventId) {
  const binding = terrainData.eventBindings[eventId] || terrainData.eventBindings.start;
  if (eventId !== "enemy_delay") setCombatReplayActive(false);
  runtime.currentEventId = eventId;
  setRouteProgressForEvent(eventId);
  setCameraPreset(binding.camera);
  setOverlayMode(binding.visual);
  setStatus(`${binding.label} / ${binding.visual}`);
  startRehearsalAction(eventId);
  renderAssetCommandRail();
}

function focusEvent(eventId) {
  if (!runtime.initialized) initWarGround3dScene();
  updateWarGround3dEvent(eventId);
}

function showTerrainAnalysis() {
  runtime.currentEventId = "comm_gap";
  setRouteProgressForEvent(runtime.currentEventId);
  setOverlayMode("risk_chain");
  setCameraPreset("comm_gap");
  setStatus("지형분석: 통신 음영·급경사·우회축 표시");
  renderAssetCommandRail();
}

function showCommanderResult() {
  runtime.currentEventId = "b_stabilized";
  setOverlayMode("commander_result");
  setCameraPreset("commander_result");
  runtime.routeProgress = 1;
  setStatus("지휘관 결과: B안 경로와 완화 조건 표시");
  renderAssetCommandRail();
}

function deployStrikeReplayAssets() {
  combatReplayAssetIds.forEach((assetId) => {
    const entry = runtime.units.get(assetId);
    const plan = combatReplayMotionPlan[assetId];
    if (!entry) return;
    entry.unit.position = plan?.start || entry.unit.position;
    entry.unit.heading = plan?.headingStart ?? entry.unit.heading ?? 0;
    if (entry.unit.kind === "air" && plan?.altitude) entry.unit.altitude = plan.altitude;
    entry.unit.route = null;
    entry.anchor.visible = true;
    if (entry.label) entry.label.visible = runtime.layerVisibility.labels;
    entry.anchor.scale.setScalar(1);
    placeUnit(entry.unit, entry.anchor);
    updateLabelPosition(entry);
    createCombatVisibilityMarker(entry);
    createCombatReplayRouteCue(assetId);
  });
  runtime.layerVisibility.effects = true;
  runtime.layerVisibility.threat = true;
  setCombatReplayCuesVisible(runtime.combatReplayActive);
  renderAssetCommandRail();
  renderStrikeTelemetry(true);
}

function replayStrike() {
  runtime.currentEventId = "enemy_delay";
  deployStrikeReplayAssets();
  setRouteProgressForEvent(runtime.currentEventId);
  setOverlayMode("enemy_contact");
  const strike = runtime.effects.find((effect) => effect.id === "strike");
  runtime.strikeReplayStartedAt = performance.now();
  setCombatReplayActive(true);
  if (strike) {
    strike.age = 0;
    strike.strikeReplayStartedAt = runtime.strikeReplayStartedAt;
    strike.group.visible = true;
  }
  setCameraPreset("strike_replay");
  setStatus(`타격 재생: VISTA ${VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId} / K2·K21·AH-64E·군집드론·녹색신호탄`);
  renderAssetCommandRail();
  renderStrikeTelemetry(true);
}

function start() {
  runtime.playing = true;
  focusEvent(runtime.currentEventId || "start");
}

function setPlayback(value) {
  runtime.playing = Boolean(value);
}

function setSpeed(value) {
  const speed = Number(value);
  runtime.speed = speed === 4 ? 4 : speed === 2 ? 2 : 1;
}

window.WarGround3D = {
  start,
  setPlayback,
  setSpeed,
  focusEvent,
  showTerrainAnalysis,
  showCommanderResult,
  replayStrike,
  renderAssetCommandRail,
  setPlacementMode,
  setPlacementTemplate,
  addEditableAsset,
  selectEditableAsset,
  moveSelectedAssetToPoint,
  setCameraOrbitMode,
  setCameraZoom,
  zoomCameraByFactor,
  getCameraDragIntent,
  setCameraInteractionMode,
  setMapFocusMode,
  toggleMapFocusMode,
  toggleLayer,
  analyzeAssetPlacement,
  recommendPlacementForSelectedAsset,
  applyPlacementCandidate,
  getDiagnostics: () => {
    const strikePhase = getStrikeReplayPhase();
    const strikeBda = getStrikeBdaEstimate(strikePhase);
    return {
      initialized: runtime.initialized,
      eventId: runtime.currentEventId,
      unitCount: runtime.units.size,
      editableAssetCount: runtime.editableAssets.size,
      selectedEditableAssetId: runtime.selectedEditableAssetId,
      placementMode: runtime.placementMode,
      placementTemplateId: runtime.placementTemplateId,
      cameraMode: runtime.cameraMode,
      cameraZoomLevel: runtime.cameraZoomLevel,
      cameraDragMode: runtime.cameraDragMode,
      mapFocusMode: runtime.mapFocusMode,
      strikeReplayStartedAt: runtime.strikeReplayStartedAt,
      strikeTelemetryState: strikePhase.stateLabel,
      strikeTimelineActiveStep: strikePhase.isLive ? strikePhase.activeStep.id : "standby",
      strikeTimelineProgress: Number(strikePhase.progress.toFixed(3)),
      strikeImpactEta: getStrikeImpactEta(strikePhase),
      strikeBdaEstimate: strikeBda.label,
      combatReplayActive: runtime.combatReplayActive,
      combatReplayPhase: runtime.combatReplayPhase,
      rehearsalActionState: runtime.rehearsalActionState,
      rehearsalActionEventId: runtime.rehearsalActionActiveEventId,
      rehearsalActionStartedAt: Number(runtime.rehearsalActionStartedAt.toFixed(3)),
      rehearsalActionElapsed: Number(runtime.rehearsalActionElapsed.toFixed(3)),
      rehearsalActionProgress: Number(runtime.rehearsalActionProgress.toFixed(3)),
      lastStableDelta: Number(runtime.lastStableDelta.toFixed(4)),
      lastScaledDelta: Number(runtime.lastScaledDelta.toFixed(4)),
      visibleAction: getRehearsalActionPlan(runtime.rehearsalActionActiveEventId).visibleAction,
      tacticalActions: getRehearsalActionPlan(runtime.rehearsalActionActiveEventId).tacticalActions || [],
      artilleryArcs: runtime.rehearsalActionProjectiles.size,
      movementTrails: runtime.rehearsalActionTrails.size,
      rehearsalActionParticipants: Array.from(runtime.rehearsalActionParticipants),
      vistaScenarioReplay: {
        sequenceId: VISTA_SEUNGJIN_STAGE_27_REPLAY.sequenceId,
        stageId: VISTA_SEUNGJIN_STAGE_27_REPLAY.stageId,
        title: VISTA_SEUNGJIN_STAGE_27_REPLAY.title,
        sourcePath: VISTA_SEUNGJIN_STAGE_27_REPLAY.sourcePath,
        durationSeconds: STRIKE_REPLAY_DURATION_SECONDS
      },
      combatReplayAssetIds,
      combatReplayUnits: combatReplayAssetIds.map((assetId) => {
        const entry = runtime.units.get(assetId);
        return {
          id: assetId,
          position: entry?.unit?.position || null,
          altitude: entry?.unit?.altitude ?? null,
          visible: entry?.anchor?.visible !== false
        };
      }),
      vistaModelIds,
      vistaModelLoadState: { ...runtime.vistaModelLoadState },
      unitIds: Array.from(runtime.units.keys()),
      strikeEffectKind: runtime.effects.find((effect) => effect.id === "strike")?.kind || null,
      placementScore: runtime.placementScore
        ? {
            score: runtime.placementScore.score,
            summary: runtime.placementScore.summary,
            tone: runtime.placementScore.tone
          }
        : null,
      placementCandidates: runtime.placementCandidates.map((candidate) => ({
        id: candidate.id,
        score: candidate.score,
        preferred: candidate.preferred
      })),
      layerVisibility: { ...runtime.layerVisibility },
      routeProgress: runtime.routeProgress,
      realTerrainLoadState: runtime.realTerrainLoadState,
      realTerrainSource: realTerrainSource.label,
      elevationRangeM: runtime.realTerrain
        ? [runtime.realTerrain.minElevationM, runtime.realTerrain.maxElevationM]
        : null
    };
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWarGround3dScene);
} else {
  initWarGround3dScene();
}
