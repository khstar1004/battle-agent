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

  it("ships the Lucide runtime from committed vendor assets for Cloudtype", () => {
    const html = readText("index.html");

    assert.equal(existsSync(join(root, "vendor/lucide/lucide.min.js")), true, "vendor/lucide/lucide.min.js is missing");
    assert.ok(html.includes("src=\"vendor/lucide/lucide.min.js\""), "index.html must load the vendored Lucide bundle");
    assert.doesNotMatch(html, /node_modules\/lucide/, "deployed HTML must not reference node_modules");
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

  it("adds per-agent wargame stats and uses them in rehearsal dialogue", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function getAgentWargameStats",
      "function renderAgentWargameStats",
      "function getAgentDialogueSimulation",
      "function getTransmissionSimulationLine",
      "health",
      "moveSpeedKph",
      "commRangeKm",
      "체력",
      "이동속도",
      "통신범위",
      "스탯 반영 대화"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".agent-wargame-stats",
      ".agent-wargame-stat",
      ".agent-dialogue-sim",
      ".agent-chat-statline",
      ".agent-chat-simline"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
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
    assert.match(css, /Decision confirmation density/);
    assert.match(css, /\.decision-workspace > \.hard-panel:nth-child\(2\) \.watch-item-list/);
    assert.match(css, /\.decision-workspace > \.hard-panel:nth-child\(2\) \.decision-trace-panel button:nth-child\(n \+ 4\)/);
    assert.match(css, /\.decision-workspace > \.hard-panel:nth-child\(2\) \.entity-table div:nth-child\(n \+ 5\)/);
  });

  it("explains the failure-path page in plain operational language", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "riskGuideStrip",
      "selectedFailureStory",
      "무엇 때문에 실패했나",
      "문제 원인과 실패 결과를 먼저 확인합니다.",
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
      ".failure-cause-brief",
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

  it("adds an intake quality report that surfaces missing or weak source support", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"intakeQualityPanel\""), "id=\"intakeQualityPanel\" is missing from index.html");

    [
      "function getIntakeQualityReport",
      "function renderIntakeQualityPanel",
      "function runIntakeQualityAction",
      "data-intake-quality-action",
      "자료 품질",
      "재판단 기준",
      "추정 근거",
      "selectEvidence(item.evidenceId)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".intake-quality-panel",
      ".intake-quality-summary",
      ".intake-quality-actions",
      ".intake-quality-button",
      ".intake-quality-button.is-gap"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("starts the data page empty and reveals an input manifest after intake", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"intakeEmptyState\"",
      "id=\"dataGrid\"",
      "id=\"inputManifestPanel\"",
      "id=\"operationIdentityPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "class=\"intake-empty-copy\"",
      "NO INPUT PACKAGE",
      "아직 접수된 작전 자료가 없습니다.",
      "작전 자료 대기",
      "PDF / XLSX / PNG / JSON / TXT"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from initial data empty markup`));

    [
      "function renderIntakeEmptyState",
      "function getInputDocumentManifest",
      "function renderInputDocumentManifest",
      "function getOperationIdentity",
      "function renderOperationIdentityPanel",
      "data-input-doc-id",
      "data-intake-loaded",
      "byId(\"dataGrid\").hidden = !state.scenarioLoaded",
      "대대급",
      "야간",
      "기동훈련"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".intake-empty-state",
      ".data-page.is-intake-empty .data-grid",
      ".data-page.is-intake-loaded .intake-empty-state",
      ".input-manifest-panel",
      ".input-doc-card",
      ".operation-identity-panel",
      ".operation-identity-map",
      ".operation-identity-chip",
      "@keyframes intake-reveal"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds richer role-specific combat dossiers for every virtual unit", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "const agentCombatDossiers",
      "function getAgentCombatDossier",
      "function renderAgentCombatDossier",
      "agent-combat-dossier",
      "전투 성향",
      "교전 방식",
      "판단 강점",
      "취약점",
      "야간 차간 유지와 노면 판독을 우선하는 기동 셀",
      "보급 대기열을 전투 지속 시간으로 환산하는 군수 실행 셀",
      "통신 두절 시 분대 단위 유지 절차를 고정하는 현장 셀"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".agent-combat-dossier",
      ".agent-combat-dossier article",
      ".agent-combat-dossier p",
      ".agent-combat-dossier ul"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a graph decision-path inspector for explaining why a selected node matters", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"graphPathPanel\""), "id=\"graphPathPanel\" is missing from index.html");

    [
      "function getGraphDecisionPath",
      "function renderGraphPathPanel",
      "data-path-node-id",
      "판단 경로",
      "결심카드까지",
      "selectNode(pathButton.dataset.pathNodeId)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".graph-path-panel",
      ".graph-path-chain",
      ".graph-path-node",
      ".graph-path-node.is-current",
      ".graph-path-panel footer",
      ".graph-inspector #evidencePreview .evidence-item",
      ".graph-inspector #evidencePreview .evidence-item p",
      ".graph-inspector .selected-node span",
      "-webkit-line-clamp: 3"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds event-level rehearsal intervention cards that jump to risks or evidence", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"rehearsalInterventionOverlay\""), "id=\"rehearsalInterventionOverlay\" is missing from index.html");

    [
      "function getRehearsalIntervention",
      "function renderRehearsalIntervention",
      "function runRehearsalInterventionAction",
      "data-rehearsal-action",
      "차단 권고",
      "실패경로 보기",
      "근거 추적",
      "selectFailurePath(ref)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".rehearsal-intervention-card",
      ".rehearsal-intervention-overlay",
      ".rehearsal-intervention-card header",
      ".rehearsal-intervention-actions",
      ".rehearsal-intervention-actions button"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a global focus mode that expands the active workspace and hides the side rail", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"toggleFocusModeButton\""), "id=\"toggleFocusModeButton\" is missing from index.html");

    [
      "focusMode",
      "function setFocusMode",
      "function toggleFocusMode",
      "document.body.classList.toggle(\"is-focus-mode\"",
      "setAttribute(\"aria-pressed\"",
      "toggleFocusModeButton",
      "setFocusMode(false)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "/* Global focus mode: hide the inspection rail and let the work surface breathe. */",
      "body.is-focus-mode .page-view.is-active",
      "grid-template-columns: minmax(0, 1fr)",
      "body.is-focus-mode .page-side-rail",
      "display: none"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds compact per-page briefing cards for the main operator workflow", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function getPageBriefingItems",
      "function renderPageBriefings",
      "function ensurePageSideRail",
      "page-briefing-strip",
      "page-side-rail",
      "입력 패키지",
      "그래프 규모",
      "생성률",
      "현재 이벤트",
      "우선 흐름",
      "추천 방책"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".page-briefing-strip",
      ".page-briefing-strip .hud-tile",
      ".page-side-rail",
      "grid-area: rail",
      "grid-area: workspace",
      "grid-template-columns: repeat(4, minmax(0, 1fr))",
      "grid-template-columns: repeat(2, minmax(0, 1fr))"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a state-aware AI decision queue and hides verbose guide strips", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function getPageInsightItems",
      "function renderPageInsights",
      "ai-insight-deck",
      "AI 판단 큐",
      "자동 추출",
      "중심 노드",
      "편성 병목",
      "마찰 예측",
      "차단점",
      "승인 패키지"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".ai-insight-deck",
      ".ai-insight-card",
      ".insight-meter",
      ".data-page .data-grid > .hard-panel:nth-child(5)",
      ".page-guide-strip.is-collapsed",
      "display: none;"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("applies an Apple-inspired product refinement layer across every page", () => {
    const html = readText("index.html");
    const css = readText("styles.css");

    [
      "<img",
      "src=\"assets/bpk-logo.png?v=war-ground-direct-logo\"",
      "class=\"brand-logo-image\"",
      "alt=\"\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "/* Apple-inspired product refinement layer */",
      "--refined-surface",
      "--refined-hairline",
      "--refined-shadow",
      ".brand-logo-image",
      ".hard-panel::before",
      ".panel-popout-button",
      ".hard-panel:hover .panel-popout-button",
      ".workspace-tab.is-active",
      ".page-briefing-strip .hud-tile",
      ".ai-insight-card:first-child",
      ".page-view.is-active::before",
      ".decision-lock strong",
      ".graph-workspace",
      ".rehearsal-workspace",
      ".risk-workspace",
      ".decision-workspace",
      "calc(100% - 202px)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps panel popouts keyboard-safe by moving and restoring focus", () => {
    const app = readText("app.js");

    [
      "let lastPanelModalTrigger = null",
      "lastPanelModalTrigger?.focus()",
      "modal.querySelector(\"button[data-close-panel-modal]\")?.focus()",
      "lastPanelModalTrigger = button"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("keeps the command chrome visually quiet so page workspaces stay dominant", () => {
    const css = readText("styles.css");

    [
      "/* Quiet command chrome: reduce presentation controls to a product-grade toolbar. */",
      ".top-command",
      "grid-template-columns: minmax(190px, 240px) minmax(0, 1fr) auto",
      ".demo-flow",
      "grid-template-columns: repeat(5, 18px)",
      ".flow-step svg",
      "font-size: 0",
      ".workspace-pages",
      "height: calc(100vh - 158px)",
      ".page-heading h2",
      "font-size: 28px",
      ".hard-panel",
      "background: rgba(8, 13, 12, 0.74)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("trims the global command bar down to the six primary workflow tabs only", () => {
    const app = readText("app.js");
    const css = readText("styles.css");
    const html = readText("index.html");

    [
      "function shouldShowStartOnlyCue",
      "state.currentStage === \"data\"",
      "target.hidden = !visible",
      "target.setAttribute(\"aria-hidden\", String(!visible))",
      "const primaryStageRail = [\"data\", \"ontology\", \"agents\", \"rehearsal\", \"risk\", \"decision\"]",
      "const visible = primaryStageRail.includes(button.dataset.stage)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "/* Primary workflow rail: keep only the six operational stages visible. */",
      ".compact-command-bar .command-identity",
      ".compact-command-bar .system-actions",
      "display: none !important",
      "grid-template-columns: minmax(0, 1fr)",
      "grid-template-columns: repeat(6, minmax(128px, 1fr))",
      ".compact-command-bar .workspace-tabs::-webkit-scrollbar",
      "body:not([data-stage=\"data\"]) .demo-judge-cue",
      "height: calc(100vh - 66px)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    [
      "<span>01</span><b>자료 투입</b>",
      "<span>02</span><b>그래프 구축</b>",
      "<span>03</span><b>가상부대</b>",
      "<span>04</span><b>수행 리허설</b>",
      "<span>05</span><b>실패경로</b>",
      "<span>06</span><b>결심카드</b>"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));
  });

  it("keeps mobile stage navigation in one compact scrolling row", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function scrollActiveWorkspaceTabIntoView",
      "activeTab.scrollIntoView",
      "inline: \"center\"",
      "block: \"nearest\""
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "/* Mobile command compression: keep stage tabs to one scrolling row. */",
      "grid-auto-flow: column",
      "grid-auto-columns: minmax(72px, 1fr)",
      "overflow-x: auto",
      "scrollbar-width: none",
      "-webkit-overflow-scrolling: touch"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps the desktop stage rail fixed to the six primary workflow stages", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function syncCompactStageContext",
      "const primaryStageRail = [\"data\", \"ontology\", \"agents\", \"rehearsal\", \"risk\", \"decision\"]",
      "const visible = primaryStageRail.includes(button.dataset.stage)",
      "button.classList.toggle(\"is-context-tab\", visible)",
      "nav.dataset.visibleTabs"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "/* Primary workflow rail: keep only the six operational stages visible. */",
      ".compact-command-bar .workspace-tabs[data-visible-tabs] .workspace-tab:not(.is-context-tab)",
      ".compact-command-bar .workspace-tab.is-context-tab",
      ".compact-command-bar .workspace-tab.is-context-tab.is-active",
      ".compact-command-bar .workspace-tabs[data-visible-tabs]"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("loads and navigates from both the stage rail and the top-right next button", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"nextStageButton\"",
      "id=\"nextStageLabel\"",
      "data-stage-next",
      "<span>다음 단계</span>"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getNextPrimaryStage",
      "function updateNextStageButton",
      "function goToNextStage",
      "function runStageNavigationTransition",
      "await waitForStageTransitionPaint()",
      "beginStageTransition(stage, { autoComplete: false })",
      "runStageNavigationTransition(button.dataset.stage)",
      "byId(\"nextStageButton\")?.addEventListener(\"click\", goToNextStage)",
      "button.setAttribute(\"aria-disabled\", visible ? \"false\" : \"true\")"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    assert.ok(!app.includes("button.addEventListener(\"click\", () => setStage(button.dataset.stage))"), "stage rail clicks should not bypass the loading transition");

    [
      ".stage-progress-actions",
      ".stage-next-button",
      ".compact-command-bar .stage-progress-actions",
      ".stage-next-button:disabled",
      ".compact-command-bar .workspace-tab",
      "cursor: pointer"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("renders only the active heavy workspace during stage changes", () => {
    const app = readText("app.js");

    [
      "const activePage = document.querySelector(\".page-view.is-active[data-page]\")",
      "const pages = activePage ? [activePage] : []",
      "const pageRenderers = {",
      "broadcast: renderBroadcastPackage",
      "receipt: renderReceiptTracker",
      "pageRenderers[state.currentStage]?.()"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("skips the stage transition overlay when restoring a stage from the URL", () => {
    const app = readText("app.js");

    [
      "function setStage(stage, options = {})",
      "previousStage !== stage && options.showTransition",
      "setStage(initialStage, { skipTransition: true })"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("gives each page a single premium focal surface instead of equal-weight panels", () => {
    const css = readText("styles.css");

    [
      "/* Focal surfaces: make the primary work area read as the product, not another card. */",
      ".scenario-card",
      ".graph-theater",
      ".agent-factory-panel",
      ".rehearsal-map-panel",
      ".risk-workspace > .hard-panel:nth-child(2)",
      ".decision-main",
      "box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055)",
      "background: linear-gradient(180deg, rgba(95, 197, 180, 0.07), rgba(95, 197, 180, 0.018))",
      ".graph-theater::after",
      ".decision-main .decision-lock"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("polishes inspector rails and dense scroll surfaces without adding more UI", () => {
    const css = readText("styles.css");

    [
      "/* Premium inspector and scroll polish: quiet dense panels without adding UI. */",
      ".page-side-rail",
      "backdrop-filter: blur(14px) saturate(1.06)",
      ".page-side-rail::before",
      ".page-side-rail .ai-insight-card",
      ".page-side-rail .hud-tile",
      ".file-stack",
      ".agent-layer-board",
      ".timeline-events",
      ".risk-stack",
      ".commander-checklist",
      ".decision-trace-panel",
      "scrollbar-color: rgba(225, 229, 214, 0.2) transparent",
      "mask-image: linear-gradient(180deg, transparent, #000 18px, #000 calc(100% - 18px), transparent)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("compresses data intake side panels so file and pipeline status scan without scrolling", () => {
    const css = readText("styles.css");

    [
      "/* Data intake preview density: keep files and pipeline scannable in the first viewport. */",
      ".data-page .hard-panel:has(.file-stack) .file-stack li",
      ".data-page .hard-panel:has(.file-stack) .file-stack span small",
      ".data-page .hard-panel:has(.pipeline-list) .pipeline-list article",
      ".data-page .hard-panel:has(.pipeline-list) .pipeline-list span",
      "-webkit-line-clamp: 1"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("compresses rehearsal timeline events so the full sequence scans at once", () => {
    const css = readText("styles.css");

    [
      "/* Rehearsal timeline density: show the full event rail before popout detail. */",
      ".rehearsal-page .timeline-events",
      ".rehearsal-page .timeline-event",
      "grid-template-columns: 42px minmax(0, 1fr) 34px",
      "min-height: 26px"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds tactile selection affordances consistently across interactive surfaces", () => {
    const css = readText("styles.css");

    [
      "/* Tactile interaction layer: make selectable surfaces feel intentional and consistent. */",
      ".agent-card",
      ".risk-item",
      ".timeline-event",
      ".formation-tile",
      ".decision-trace-panel button",
      "transition: transform 160ms ease",
      "transform: translateY(-1px)",
      ".agent-card.is-selected::after",
      ".risk-item.is-selected::after",
      ".timeline-event.is-active::after",
      ".formation-tile.is-active::after",
      "box-shadow: 0 0 0 1px rgba(95, 197, 180, 0.3)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a global mission search that jumps across pages and evidence", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"openMissionSearch\"",
      "id=\"missionSearchModal\"",
      "id=\"missionSearchInput\"",
      "id=\"missionSearchResults\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function buildMissionSearchIndex",
      "function getMissionSearchResults",
      "function openMissionSearch",
      "function applyMissionSearchResult",
      "data-search-result-id",
      "mission-search-result",
      "ctrlKey",
      "setStage(result.stage)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".mission-search-modal",
      ".mission-search-panel",
      ".mission-search-box",
      ".mission-search-results",
      ".mission-search-result"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a state-aware mission action panel to reduce next-step ambiguity", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function getMissionActionItems",
      "function renderMissionActionPanel",
      "function runMissionAction",
      "mission-action-panel",
      "data-mission-action",
      "작전계획 접수",
      "가상부대 생성",
      "수행 리허설 실행",
      "결심카드 검토"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".mission-action-panel",
      ".mission-action-panel header",
      ".mission-action-list",
      ".mission-action-button",
      ".mission-action-button.is-primary"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a judge-facing demo cue that keeps presenter flow clear", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"demoJudgeCue\"",
      "aria-label=\"시연 심사 큐\"",
      "data-demo-cue-action=\"load-scenario\"",
      "심사 시연 큐",
      "시연 시작"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getDemoJudgeCue",
      "function renderDemoJudgeCue",
      "function runDemoCueAction",
      "function formatKoreanObjectParticle",
      "data-demo-cue-action",
      "심사위원은",
      "open-briefing",
      "renderDemoJudgeCue();"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".demo-judge-cue",
      ".demo-cue-grid",
      ".demo-cue-action",
      "grid-template-areas: \"actions cue flow\"",
      "grid-area: cue",
      ".demo-cue-grid article:first-child",
      "-webkit-line-clamp: 1"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds judge question defense prompts to the presenter cue", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function getDemoJudgeDefenseItems",
      "demo-cue-defense-grid",
      "예상 질문",
      "답변 프레임",
      "보여줄 위치"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".demo-cue-defense-grid",
      ".demo-cue-defense-grid article",
      ".demo-cue-defense-grid em"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a five-minute presenter run sheet to keep the submission demo on track", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"demoRunSheet\"",
      "aria-label=\"5분 시연 러닝오더\"",
      "demo-run-sheet"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getDemoRunSheetItems",
      "function renderDemoRunSheet",
      "data-demo-run-stage",
      "5분 러닝오더",
      "3D 리허설",
      "승인 게이트",
      "renderDemoRunSheet();"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".demo-run-sheet",
      ".demo-run-sheet ol",
      ".demo-run-sheet li.is-active",
      "grid-template-areas: \"actions cue flow\" \"run run run\"",
      "flex: 0 0 146px"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds an evidence trace drawer that explains source-to-decision links", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"openEvidenceTrace\"",
      "id=\"evidenceTraceDrawer\"",
      "id=\"evidenceTraceBody\"",
      "data-close-evidence-trace"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "selectedEvidenceId",
      "function getEvidenceTrace",
      "function renderEvidenceTraceDrawer",
      "function openEvidenceTrace",
      "function closeEvidenceTrace",
      "function runEvidenceTraceAction",
      "function activateEvidenceKeyboardTarget",
      "data-trace-action",
      "근거 추적",
      "그래프에서 보기",
      "결심카드 보기",
      "openEvidenceTrace(result.ref)",
      "event.key === \"Enter\" || event.key === \" \"",
      "selectEvidence(evidenceTarget.dataset.evidenceId)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".evidence-trace-drawer",
      ".evidence-trace-panel",
      ".evidence-trace-summary",
      ".evidence-trace-chain",
      ".evidence-trace-action",
      ".evidence-item.is-selected"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("marks workspace navigation as real tabs with linked panels", () => {
    const html = readText("index.html");
    const app = readText("app.js");

    [
      "role=\"tablist\"",
      "role=\"tab\"",
      "aria-controls=\"page-data\"",
      "aria-controls=\"page-decision\"",
      "id=\"page-data\"",
      "role=\"tabpanel\"",
      "aria-labelledby=\"tab-data\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "button.setAttribute(\"aria-current\", active ? \"page\" : \"false\")",
      "button.tabIndex = active ? 0 : -1",
      "page.hidden = !active",
      "function handleWorkspaceTabKeydown",
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
      "button.addEventListener(\"keydown\", handleWorkspaceTabKeydown)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("adds a rehearsal scrubber for fast event playback review", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"rehearsalScrubber\""), "id=\"rehearsalScrubber\" is missing from index.html");

    [
      "function getRehearsalProgress",
      "function renderRehearsalScrubber",
      "data-scrub-event-index",
      "rehearsal-scrubber-step",
      "리허설 스크러버",
      "showEvent(Number(scrubButton.dataset.scrubEventIndex))"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".rehearsal-scrubber",
      ".rehearsal-scrubber-readout",
      ".rehearsal-scrubber-track",
      ".rehearsal-scrubber-step",
      ".rehearsal-scrubber-step.is-active"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps page and selection state shareable in the URL", () => {
    const app = readText("app.js");

    [
      "routeSyncReady",
      "function syncRouteState",
      "function applyRouteStateFromUrl",
      "window.history.replaceState",
      "params.set(\"stage\"",
      "params.set(\"node\"",
      "params.set(\"failure\"",
      "params.set(\"evidence\"",
      "params.set(\"event\"",
      "syncRouteState();"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("adds an interactive decision impact simulator for conditional approval", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"decisionImpactSimulator\""), "id=\"decisionImpactSimulator\" is missing from index.html");

    [
      "decisionConditionState",
      "function getDecisionImpactModel",
      "function getActiveDecisionConditionIds",
      "function toggleDecisionCondition",
      "function renderDecisionImpactSimulator",
      "data-decision-condition",
      "decision-impact-simulator",
      "조건별 위험 감쇄",
      "예상 잔여 위험"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".decision-impact-simulator",
      ".decision-impact-summary",
      ".decision-condition-toggle",
      ".decision-condition-toggle.is-active",
      ".decision-impact-bars"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a decision execution matrix that ties actions to risks and evidence", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"decisionExecutionMatrix\""), "id=\"decisionExecutionMatrix\" is missing from index.html");

    [
      "function getDecisionExecutionRows",
      "function renderDecisionExecutionMatrix",
      "function runDecisionExecutionAction",
      "data-decision-execution-action",
      "data-decision-execution-ref",
      "조치 실행 매트릭스",
      "잔여위험",
      "setStage(\"risk\")",
      "openEvidenceTrace(ref)",
      "executionRows: getDecisionExecutionRows()"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".decision-execution-matrix",
      ".decision-execution-row",
      ".decision-execution-row.is-critical",
      ".decision-execution-actions",
      "/* Decision main cockpit: show the recommendation, top actions, risk reduction, and compact card together. */",
      ".decision-main .decision-execution-row:nth-child(n + 4)",
      ".decision-main #decisionCardPanel .decision-columns li:nth-child(n + 3)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a commander briefing sheet for sharing current review state", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"openBriefingSheet\"",
      "id=\"briefingSheetDrawer\"",
      "id=\"briefingSheetBody\"",
      "id=\"copyBriefingLink\"",
      "id=\"exportBriefingPacket\"",
      "data-close-briefing-sheet"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getBriefingSnapshot",
      "function renderBriefingSheet",
      "function openBriefingSheet",
      "function closeBriefingSheet",
      "function copyBriefingLink",
      "function copyBriefingText",
      "function getSubmissionPacket",
      "function exportBriefingPacket",
      "package_type: \"war-ground-submission-packet\"",
      "recommended_screenshots",
      "briefing-sheet-drawer",
      "지휘관 브리핑",
      "상위 조치",
      "snapshot.executionRows",
      "현재 링크 복사",
      "브리핑 본문 복사",
      "제출 패킷 저장"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".briefing-sheet-drawer",
      ".briefing-sheet-panel",
      ".briefing-snapshot-hero",
      ".briefing-fact-grid",
      ".briefing-copy-actions"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("includes 3D event, approval gates, and judge defense in the briefing packet", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "rehearsalBriefing: getRehearsalBriefing(activeEvent)",
      "approvalGates: getDecisionApprovalGates()",
      "defenseItems: getDemoJudgeDefenseItems()",
      "심사 대응",
      "3D 판단",
      "승인 게이트",
      "snapshot.approvalGates",
      "snapshot.defenseItems"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".briefing-defense-grid",
      ".briefing-approval-grid",
      ".briefing-event-card"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a failure evidence coverage matrix for comparing risk support quality", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"failureCoverageMatrix\""), "id=\"failureCoverageMatrix\" is missing from index.html");

    [
      "function getFailureCoverageRows",
      "function renderFailureCoverageMatrix",
      "risk-evidence-overview",
      "전체 근거는 커버리지에서 비교",
      "data-coverage-failure-id",
      "근거 커버리지",
      "직접 근거",
      "참여 에이전트",
      "selectFailurePath(coverageButton.dataset.coverageFailureId)"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".failure-coverage-matrix",
      ".failure-coverage-grid",
      ".failure-coverage-row",
      ".failure-coverage-row.is-selected",
      ".failure-coverage-meter",
      ".risk-page .hard-panel:has(#riskEvidenceList) .evidence-item p",
      "/* Risk workspace hierarchy: give coverage and evidence room without equal-height cards. */",
      ".risk-workspace > .hard-panel:nth-child(1)",
      "grid-row: 1 / 4",
      ".risk-workspace > .hard-panel:nth-child(3)",
      "grid-row: 1 / 3",
      ".risk-workspace > .wide-panel",
      "grid-column: auto",
      "/* Risk operational density: make side lists act as selection controls, not prose cards. */",
      ".risk-page .hard-panel:has(.risk-stack) .failure-summary",
      "-webkit-line-clamp: 1",
      ".risk-page .hard-panel:has(.risk-stack) .failure-pivot-strip span:not(:nth-child(2))",
      ".risk-page .failure-chain article",
      ".risk-page .mitigation-board b"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("renders the failure path as an immediate cause-to-failure board", () => {
    const html = readText("index.html");
    const page = readText("pages/05-risk.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "실패경로",
      "무엇 때문에 실패했나",
      "문제 원인과 실패 결과를 먼저 확인합니다."
    ].forEach((signature) => {
      assert.ok(html.includes(signature), `${signature} is missing from index.html`);
      assert.ok(page.includes(signature), `${signature} is missing from pages/05-risk.html`);
    });

    assert.ok(!page.includes("report-security-stamp"), "pages/05-risk.html should not render a document stamp");
    assert.ok(!page.includes("분석 보고서"), "pages/05-risk.html should not frame the risk page as a report");

    [
      "failure-cause-brief",
      "failure-cause-path",
      "failure-cause-node is-problem",
      "failure-cause-node is-cause",
      "failure-cause-node is-failure",
      "failure-interrupt-card",
      "왜 실패했나",
      "실패 결과",
      "끊을 지점"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "/* Failure path cockpit reset: show cause, result, and interruption point before any report detail. */",
      ".risk-page.report-page.page-view.is-active",
      "grid-template-areas:",
      "\"heading\"",
      "\"story\"",
      "\"workspace\"",
      ".risk-page.report-page .report-security-stamp",
      "display: none !important",
      ".failure-cause-brief",
      ".failure-cause-path",
      ".failure-cause-node.is-cause",
      ".failure-cause-node.is-failure",
      ".failure-interrupt-card",
      "/* Desktop failure path fit: keep the full cause board and action panels visible in presenter view. */",
      "@media (min-width: 1181px)",
      "grid-template-rows: auto auto auto",
      "overflow-y: auto !important",
      "--failure-board-surface: rgba(12, 24, 21, 0.94)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from failure path board CSS`));
  });

  it("renders the decision card as a single simple commander card, not a report bundle", () => {
    const html = readText("index.html");
    const page = readText("pages/06-decision.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "결심카드",
      "단편명령 작성안",
      "검토안 내보내기"
    ].forEach((signature) => {
      assert.ok(html.includes(signature), `${signature} is missing from index.html`);
      assert.ok(page.includes(signature), `${signature} is missing from pages/06-decision.html`);
    });

    [
      "simple-decision-card",
      "simple-decision-hero",
      "simple-decision-conditions",
      "simple-decision-actions",
      "simple-decision-footer",
      "승인 조건",
      "즉시 조치",
      "재판단 기준",
      "지휘관 승인 필요"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "/* Simple decision card reset: make tab 06 feel like a decision card, not another report. */",
      ".decision-page.report-page.page-view.is-active",
      "grid-template-areas:",
      "\"workspace\"",
      ".decision-page.report-page .decision-workspace",
      "max-width: 1120px",
      ".decision-page.report-page .report-security-stamp",
      "display: none",
      ".decision-page.report-page .decision-scoreboard",
      ".decision-page.report-page .decision-execution-matrix",
      ".decision-page.report-page .decision-impact-simulator",
      ".decision-page.report-page .decision-approval-board",
      "display: none !important",
      ".simple-decision-card",
      "box-shadow: none",
      ".simple-decision-hero",
      ".simple-decision-conditions",
      ".simple-decision-actions",
      ".decision-page.report-page .decision-actions .mode-button",
      "--decision-card-surface: rgba(12, 24, 21, 0.94)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from simple decision card CSS`));
  });

  it("carries rehearsal events into the failure path as a visible transfer context", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "lastRehearsalRiskEventId",
      "openFailurePathFromRehearsal",
      "getFailureTransferContext",
      "failure-transfer-banner",
      "방금 발생한 이벤트",
      "이 실패경로로 전이됨",
      "selectFailurePath(ref, { sourceEventId"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from rehearsal-to-risk handoff`));

    [
      ".failure-transfer-banner",
      ".failure-transfer-event",
      ".failure-transfer-arrow",
      ".failure-transfer-risk"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from rehearsal-to-risk CSS`));
  });

  it("keeps the commander decision card as the final actionable result", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "final-decision-card",
      "final-decision-verdict",
      "final-decision-condition",
      "final-decision-action",
      "final-decision-evidence",
      "권고 결심",
      "조건",
      "즉시 조치",
      "근거",
      "실패경로",
      "관련 이벤트"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from final decision card rendering`));

    [
      ".final-decision-card",
      ".final-decision-verdict",
      ".final-decision-grid",
      ".final-decision-evidence",
      ".decision-page.report-page #decisionCardPanel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from final decision card CSS`));
  });

  it("adds a desktop presenter mode for 16:9 live demonstrations", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"togglePresenterModeButton\"",
      "발표 모드"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "presenterMode: false",
      "setPresenterMode",
      "togglePresenterMode",
      "document.body.classList.toggle(\"is-presenter-mode\"",
      "params.get(\"presenter\") === \"1\""
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from presenter mode JS`));

    [
      "/* Presenter mode: lock desktop demos to a clean 16:9 operating viewport. */",
      "body.is-presenter-mode",
      "body.is-presenter-mode .hud-shell",
      "body.is-presenter-mode .system-actions .icon-button:not(#togglePresenterModeButton)",
      "body.is-presenter-mode .page-view.is-active",
      "@media (min-width: 1181px)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from presenter mode CSS`));
  });

  it("keeps the virtual-unit review rail readable instead of compressing support panels", () => {
    const css = readText("styles.css");

    [
      "/* Agent review rail density: keep profile, debate, matrix, and consensus readable. */",
      ".agents-workspace",
      "grid-template-rows: minmax(200px, 0.9fr) minmax(108px, 0.34fr) minmax(108px, 0.34fr) minmax(124px, 0.24fr)",
      ".agents-workspace > .hard-panel:not(.agent-factory-panel)",
      "min-height: 108px",
      ".agents-workspace .agent-factory-panel",
      "grid-template-rows: auto auto auto auto minmax(0, 1fr)",
      ".agents-workspace .agent-layer-board",
      "grid-template-columns: repeat(2, minmax(0, 1fr))",
      ".agents-workspace .agent-profile-panel",
      "max-height: none",
      ".agents-workspace .debate-stream",
      "grid-template-columns: 1fr",
      ".agents-workspace .staff-matrix",
      "grid-template-columns: 1fr",
      ".agents-workspace .consensus-card strong",
      "font-size: 20px"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps virtual-unit side rail as a concise preview while popouts retain detail", () => {
    const css = readText("styles.css");

    [
      "/* Agent dense rail preview: keep side rail brief and reserve full detail for popout. */",
      ".agents-workspace .agent-profile-panel .agent-profile-spec",
      ".agents-workspace .agent-profile-panel .agent-attribute-grid",
      ".agents-workspace .agent-profile-panel .agent-dossier-grid",
      ".agents-workspace .agent-profile-panel .agent-coa-bars",
      "display: none",
      ".agents-workspace .discussion-panel .debate-entry:nth-child(n + 3)",
      ".agents-workspace .staff-matrix .staff-row:nth-child(n + 3)",
      ".agents-workspace .discussion-panel .debate-entry .evidence-link",
      "grid-template-columns: 42px 42px minmax(0, 1fr)",
      ".panel-modal-body .agent-profile-spec",
      "display: grid"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("fits the active workspace below the command chrome without clipping the bottom edge", () => {
    const css = readText("styles.css");

    [
      "/* Viewport fit pass: keep active page workspaces inside the visible shell. */",
      ".workspace-pages",
      "height: calc(100vh - 226px)",
      "max-height: calc(100vh - 226px)"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("uses person-style profile icons for virtual unit agents", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function renderAgentPortrait",
      "personIcon",
      "const iconName = profile.personIcon || getAgentPersonIcon(profile)",
      "data-lucide=\"${iconName}\"",
      "user-round",
      "shield-user",
      "user-cog",
      "user-check"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".agent-portrait i",
      ".agent-portrait i svg",
      ".agent-portrait > svg",
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
      "assets/vista-bundles/artillery/models/k9_thunder_artillery.glb",
      "assets/vista-bundles/tank/models/k2_black_panther_tank.glb",
      "assets/vista-bundles/tank/models/k21_armored_warfare.glb",
      "assets/vista-bundles/tank/models/t-80u_tank.glb",
      "assets/vista-bundles/infrastructure/models/target_mannequin_cluster.glb",
      "assets/vista-bundles/drone/models/drone.glb"
    ].forEach((file) => assert.equal(existsSync(join(root, file)), true, `${file} is missing`));

    const runtime = readText("war-ground-3d.js");
    [
      "./assets/vista-bundles/artillery/models/k9_thunder_artillery.glb",
      "./assets/vista-bundles/tank/models/k2_black_panther_tank.glb",
      "./assets/vista-bundles/tank/models/k21_armored_warfare.glb",
      "./assets/vista-bundles/tank/models/t-80u_tank.glb",
      "./assets/vista-bundles/infrastructure/models/target_mannequin_cluster.glb",
      "./assets/vista-bundles/drone/models/drone.glb",
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
      "id=\"rehearsalMapSpeedButton\"",
      "data-rehearsal-speed-toggle",
      "agentRadioOverlay",
      "rehearsalEventAlertOverlay",
      "agentRadioLog"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "const rehearsalRadioScripts",
      "const rehearsalDialogueBursts",
      "const rehearsalDialogueAdditions",
      "const rehearsalEventAlertBriefings",
      "function getRehearsalSimulationReadout",
      "function getRadioScriptForEvent",
      "function mergeRehearsalDialogueTurns",
      "function getRehearsalEventAlertBriefing",
      "function getRadioTransmissionDelay",
      "function queueRadioTransmission",
      "function renderAgentRadioLog",
      "function triggerRadioTrafficForEvent",
      "function renderRehearsalEventAlert",
      "function showRehearsalEventAlert",
      "function clearRadioTraffic",
      "후속 질문",
      "확인 응답",
      "C1 중계팀 전진 준비",
      "협곡 입구 지연세력 접촉, 엄호 포격 진행",
      "A안 보류, 예비대는 전방 대기선까지만 이동",
      "교신 중 · ${scripts.length}턴",
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
      ".rehearsal-event-alert-overlay",
      ".rehearsal-event-alert",
      ".rehearsal-event-alert.is-high",
      ".war-ground-zoom-controls",
      ".rehearsal-friction-banner",
      ".rehearsal-sim-readout"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("supports modifier-based 3D camera control without stealing asset clicks", () => {
    const html = readText("index.html");
    const page = readText("pages/04-rehearsal.html");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "mapInteractionModeLabel",
      "is-map-focus"
    ].forEach((signature) => {
      assert.ok(html.includes(signature), `${signature} is missing from index.html`);
      assert.ok(page.includes(signature), `${signature} is missing from pages/04-rehearsal.html`);
    });

    [
      "function getCameraDragIntent",
      "function panCameraByDelta",
      "function tiltCameraByDelta",
      "function setCameraInteractionMode",
      "event.ctrlKey",
      "event.shiftKey",
      "pointerDown.intent",
      "is-camera-dragging"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      "[data-camera-drag-mode=\"pan\"]",
      "[data-camera-drag-mode=\"tilt\"]",
      "#warGround3dCanvas",
      "touch-action: none"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a low-clutter 3D map focus mode with collapsible command surfaces", () => {
    const html = readText("index.html");
    const page = readText("pages/04-rehearsal.html");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "mapFocusModeButton",
      "data-map-focus-toggle",
      "aria-pressed=\"true\""
    ].forEach((signature) => {
      assert.ok(html.includes(signature), `${signature} is missing from index.html`);
      assert.ok(page.includes(signature), `${signature} is missing from pages/04-rehearsal.html`);
    });

    [
      "function setMapFocusMode",
      "function toggleMapFocusMode",
      "runtime.mapFocusMode",
      "data-map-focus-toggle"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".war-ground-3d-shell.is-map-focus .asset-command-rail",
      ".war-ground-3d-shell.is-map-focus .selected-asset-inspector",
      ".war-ground-3d-shell.is-map-focus .rehearsal-briefing-strip",
      ".rehearsal-map-panel:has(.war-ground-3d-shell.is-map-focus) .current-event-card",
      ".war-ground-3d-shell.is-map-focus .rehearsal-intervention-overlay"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("prioritizes the 3D map before the support rail on narrow rehearsal screens", () => {
    const css = readText("styles.css");
    [
      ".rehearsal-page .rehearsal-workspace {",
      "order: 2;",
      ".rehearsal-page .page-side-rail {",
      "order: 3;",
      ".rehearsal-page .timeline-panel {",
      "max-height: 170px",
      ".rehearsal-page .rehearsal-briefing-strip {",
      "order: 2;",
      ".rehearsal-page .rehearsal-scrubber {",
      "position: static;"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from mobile rehearsal CSS`));
  });

  it("runs visible tactical movement and artillery actions for rehearsal events", () => {
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "const rehearsalActionPlans",
      "start: {",
      "fog: {",
      "enemy_delay: {",
      "enemy_delay_action",
      "comm_gap: {",
      "supply_gap: {",
      "criteria_gap: {",
      "reserve_delay: {",
      "b_stabilized: {",
      "function createRehearsalActionLayer",
      "function startRehearsalAction",
      "function animateRehearsalAction",
      "function animateRehearsalMovement",
      "function animateRehearsalArtillery",
      "function renderRehearsalActionReadout",
      "function setTacticalActionShellActive",
      "rehearsalActionState",
      "rehearsalActionStartedAt",
      "rehearsalActionElapsed",
      "rehearsalActionProgress",
      "lastStableDelta",
      "rehearsalActionLayer",
      "rehearsalActionProjectiles",
      "rehearsalActionTrails",
      "function getStableFrameDelta",
      "function getScaledFrameDelta",
      "function advanceRehearsalActionClock",
      "runtime.rehearsalActionElapsed += scaledDelta",
      "getRehearsalActionProgress(plan)",
      "const REHEARSAL_ACTION_SLOT_SECONDS = 4.2",
      "Math.min(plan.duration || REHEARSAL_ACTION_SLOT_SECONDS, REHEARSAL_ACTION_SLOT_SECONDS)",
      "lastProgress: -1",
      "lastTrailT: -1",
      "tacticalActions",
      "artilleryArcs",
      "arcTube",
      "new THREE.TubeGeometry(curve",
      "movementTrails",
      "visibleAction",
      "포격 진행",
      "기동 진행",
      "충격파"
    ].forEach((signature) => assert.ok(runtime.includes(signature), `${signature} is missing from war-ground-3d.js`));

    [
      ".rehearsal-page .rehearsal-map-panel .current-event-card",
      "width: min(320px, calc(100% - 48px))",
      "max-height: 210px",
      ".current-event-card .rehearsal-sim-readout article:nth-child(n + 5)",
      ".war-ground-3d-shell.is-tactical-action .asset-command-rail",
      ".war-ground-3d-shell.is-tactical-action .rehearsal-intervention-overlay",
      ".war-ground-3d-shell.is-tactical-action .agent-radio-toast:nth-child(n + 3)",
      "#rehearsalMap.is-tactical-action + .current-event-card",
      "width: min(260px, calc(100% - 24px))",
      "-webkit-line-clamp: 2"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds an explicit restart button for replaying movement and artillery from the beginning", () => {
    const html = readText("index.html");
    const page = readText("pages/04-rehearsal.html");
    const app = readText("app.js");

    [
      "id=\"rehearsalRunInlineButton\"",
      "수행 리허설 실행",
      "id=\"rehearsalRestartButton\"",
      "처음부터 재생"
    ].forEach((signature) => {
      assert.ok(html.includes(signature), `${signature} is missing from index.html`);
      assert.ok(page.includes(signature), `${signature} is missing from pages/04-rehearsal.html`);
    });

    [
      "function setRehearsalRunButtonDisabled",
      "function prepareRehearsalPrerequisites",
      "function restartRehearsalFromStart",
      "byId(\"rehearsalRunInlineButton\")?.addEventListener(\"click\", runRehearsal)",
      "byId(\"rehearsalRestartButton\").addEventListener(\"click\", restartRehearsalFromStart)",
      "state.rehearsalIndex = -1",
      "setStage(\"rehearsal\", { skipTransition: true })",
      "window.WarGround3D?.focusEvent?.(\"start\")",
      "showEvent(0, { defer3d: true, deferSecondary: true })",
      "scheduleNextEvent()"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));
  });

  it("keeps rehearsal launch responsive and moves major event alerts out of the map center", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "rehearsalStartTimer: null",
      "rehearsalStartToken: 0",
      "function queueWarGround3dTask",
      "if (state.currentStage !== \"rehearsal\") setStage(\"rehearsal\", { skipTransition: true });",
      "renderScenarioWorkspace: false",
      "prepareRehearsalPrerequisites({ renderScenarioWorkspace: false, renderAgentWorkspace: false",
      "showEvent(0, { defer3d: true, deferSecondary: true })",
      "queueWarGround3dTask(() => window.WarGround3D?.start?.())"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    const launchStart = app.indexOf("function runRehearsal()");
    const launchEnd = app.indexOf("function restartRehearsalFromStart", launchStart);
    const launchBody = app.slice(launchStart, launchEnd);
    assert.ok(!launchBody.includes("runDeferredRehearsalStart()"), "runRehearsal should not wait before showing the first event");

    [
      "rehearsalEventAlertTimer: null",
      "state.rehearsalEventAlertTimer = window.setTimeout",
      ".rehearsal-event-alert-overlay.is-muted .rehearsal-event-alert",
      "top: 12px",
      "width: min(560px, calc(100% - 132px))",
      "@media (max-width: 720px)",
      ".rehearsal-event-alert p,\n  .rehearsal-event-alert div",
      ".rehearsal-intervention-overlay {\n    display: none;",
      "backdrop-filter: blur(8px) saturate(1.08)"
    ].forEach((signature) => {
      assert.ok(app.includes(signature) || css.includes(signature), `${signature} is missing from rehearsal alert implementation`);
    });
  });

  it("shows a failure-path analysis loading transition after rehearsal completes", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "function beginFailurePathAnalysisTransition",
      "실패경로 분석중",
      "리허설 이벤트 수집",
      "위험 체인 계산",
      "실패경로 화면 준비",
      "beginStageTransition(\"risk\", {",
      "autoComplete: false",
      "setStage(\"risk\", { skipTransition: true })",
      "completeStageTransition(\"risk\")",
      "beginFailurePathAnalysisTransition();"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      "[data-transition-stage=\"risk-analysis\"]",
      ".stage-transition-overlay[data-transition-stage=\"risk-analysis\"] .stage-loader-ring",
      "실패경로 분석 전환"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps the 3D rehearsal visualization professional and low-clutter", () => {
    const app = readText("app.js");
    const runtime = readText("war-ground-3d.js");
    const css = readText("styles.css");

    [
      "const REHEARSAL_EVENT_DURATION_MS = 4200",
      "function captureRehearsalEventProgress",
      "function getRehearsalEventDelay",
      "const REHEARSAL_SPEED_STEPS = [1, 2, 4]",
      "function setRehearsalSpeed",
      "function renderRehearsalSpeedControls",
      "byId(\"rehearsalMapSpeedButton\")?.addEventListener(\"click\", toggleRehearsalSpeed)",
      "state.rehearsalEventElapsedMs",
      "state.rehearsalEventStartedAt",
      "captureRehearsalEventProgress();"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    assert.ok(css.includes("#rehearsalSpeedButton"), "#rehearsalSpeedButton mobile override is missing");
    assert.doesNotMatch(
      css,
      /#rehearsalSpeedButton\s*\{\s*display:\s*none;\s*\}/,
      "speed control must stay visible on narrow rehearsal screens"
    );

    [
      "const STRIKE_REPLAY_DURATION_SECONDS = 36",
      "runtime.speed = speed === 4 ? 4 : speed === 2 ? 2 : 1",
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
      ".agent-radio-overlay",
      "/* Rehearsal command layout: keep the 3D battle surface dominant and move support data to the side rail. */",
      ".rehearsal-page .rehearsal-map-panel .current-event-card",
      "grid-row: 1 / 3",
      ".rehearsal-page .rehearsal-map-panel #warGround3dCanvas",
      ".rehearsal-page .terrain-metric-grid article:nth-child(n + 5)",
      ".rehearsal-page .commander-overlay-list span:nth-child(n + 3)"
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
      "simple-decision-statement",
      "simple-decision-conditions",
      "simple-decision-actions",
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

  it("turns the graph view into a semantic ontology surface", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"ontologyDepthMap\"",
      "id=\"ontologyRelationPulse\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getOntologyNodeStyle",
      "function getOntologyLayerSummary",
      "function renderOntologyDepthMap",
      "data-ontology-kind",
      "data-ontology-tier",
      "semantic-confidence",
      "ontology-layer-ring",
      "is-ontology-document",
      "is-ontology-decision"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".graph-theater.is-ontology",
      ".ontology-depth-map",
      ".ontology-layer-ring",
      ".ontology-relation-pulse",
      ".node.is-ontology-document",
      ".node.is-ontology-decision",
      ".edge.is-evidence",
      ".edge.is-failure",
      ".semantic-confidence",
      "animation: none"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    assert.ok(!css.includes("@keyframes ontology-flow"), "ontology graph should not keep flow animation keyframes");
  });

  it("frames the ontology graph as source data, schema, agent debate, and graph expansion", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "viewBox=\"0 0 1000 620\"",
      "아군 장비, 지형, 작전계획 요소를 온톨로지화하고 에이전트 토론으로 확장하는 지식 그래프.",
      "id=\"ontologyInspectorOverlay\"",
      "ontology-constellation-shell"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from ontology HTML`));

    [
      "const ONTOLOGY_SAFE_MAX_Y = 560",
      "작전 지식 그래프",
      "아군 장비 제원",
      "지형·통신권역",
      "토론 확장",
      "function getOntologyNeighborIds",
      "function makeOntologyHexPoints",
      "function renderOntologyInspectorOverlay",
      "function isOntologySupportNodeVisible",
      "function shouldRenderOntologyEdge",
      "function getOntologyEntityNames",
      "function getOntologyNodeLabelTier",
      "ontology-micro-label",
      "K2 전차",
      "한강 이남",
      "H-Hour",
      "control_status",
      "source_evidence",
      "relation_type",
      "function getOntologyLabelAnchor",
      "ontology-node-stem"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from ontology graph model`));

    const keyNodeYMatches = [...app.matchAll(/tier: "key"[^}]*?y: (\d+)/g)].map((match) => Number(match[1]));
    assert.ok(keyNodeYMatches.length > 0, "ontology graph should define key nodes");
    assert.ok(Math.max(...keyNodeYMatches) <= 560, "key ontology nodes should stay inside the visible graph safe area");

    [
      ".ontology-constellation-shell",
      ".ontology-node-polygon",
      ".ontology-micro-label",
      ".node.is-support",
      ".ontology-neighbor-ring",
      ".ontology-inspector-overlay",
      ".ontology-inspector-field",
      ".ontology-link-label",
      "animation: none",
      "overflow: hidden",
      ".node.is-ontology-core",
      ".ontology-node-stem",
      ".ontology-label-block",
      ".graph-theater.is-ontology .edge.is-expansion"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from ontology graph CSS`));
  });

  it("shows stage transition processing so every demo step feels live", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(html.includes("id=\"stageTransitionOverlay\""), "id=\"stageTransitionOverlay\" is missing from index.html");

    [
      "transitionTimer",
      "function getStageTransitionCopy",
      "function renderStageTransitionOverlay",
      "function beginStageTransition",
      "function completeStageTransition",
      "stage-transition-overlay",
      "data-transition-step",
      "setTimeout(() => completeStageTransition",
      "beginStageTransition(stage"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".stage-transition-overlay",
      ".stage-transition-panel",
      ".stage-loader-ring",
      ".stage-loader-step",
      ".stage-transition-overlay.is-active",
      "body.is-stage-transitioning .workspace-pages",
      "@keyframes stage-scan",
      "@keyframes stage-loader"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("keeps loading feedback limited to page and stage transitions", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"stageTransitionOverlay\"",
      "stage-transition-overlay"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function beginStageTransition",
      "function completeStageTransition",
      "beginStageTransition(stage"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".stage-transition-overlay",
      "body.is-stage-transitioning .workspace-pages",
      "@keyframes stage-loader"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    [
      "id=\"interactionFeedbackToast\"",
      "interaction-feedback-toast"
    ].forEach((signature) => assert.ok(!html.includes(signature), `${signature} should not remain in index.html`));

    [
      "const interactionFeedbackSelector",
      "function bindInteractionFeedback",
      "interaction-feedback-spinner",
      "data-interaction-feedback",
      "interaction-generation-veil",
      "data-generation-state",
      "is-generating",
      "is-generated",
      "is-auto-demo-loading"
    ].forEach((signature) => assert.ok(!app.includes(signature), `${signature} should not remain in app.js`));

    [
      "/* Global interaction loading feedback */",
      ".interaction-feedback-spinner",
      ".interaction-feedback-toast",
      ".interaction-generation-veil",
      ".interaction-generation-skeleton",
      ".is-processing",
      ".is-generating",
      ".is-generated",
      "body.is-auto-demo-loading",
      "@keyframes loadingPulse",
      "@keyframes interaction-spin",
      "@keyframes generation-skeleton"
    ].forEach((signature) => assert.ok(!css.includes(signature), `${signature} should not remain in styles.css`));
  });

  it("keeps stage transitions responsive instead of blanking the active workspace", () => {
    const app = readText("app.js");
    const css = readText("styles.css");

    assert.ok(app.includes("void overlay.offsetWidth"), "stage overlay should be forced visible before reuse");
    assert.ok(app.includes("if (overrides.autoComplete !== false)"), "stage transitions should support manual completion after paint");
    assert.ok(app.includes("function waitForStageTransitionPaint"), "stage transition should wait for the loader to paint");
    assert.ok(app.includes("await waitForStageTransitionPaint()"), "stage transition should yield before heavy page switching");
    assert.match(css, /body\.is-stage-transitioning \.workspace-pages\s*{\s*opacity:\s*1;/);
    assert.doesNotMatch(css, /body\.is-stage-transitioning \.workspace-pages\s*{[^}]*opacity:\s*0;/);
    assert.ok(css.includes("place-items: center"), "stage transition should render a visible centered loader");
    assert.ok(css.includes("width: min(520px, calc(100vw - 40px))"), "stage transition panel should stay readable without blanking the page");
  });

  it("adds 3D decision narration and commander approval gates for judge-facing demos", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"rehearsalBriefingStrip\"",
      "id=\"rehearsalDecisionBridge\"",
      "id=\"decisionApprovalBoard\"",
      "id=\"decisionSignatureFlow\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "function getRehearsalBriefing",
      "function renderRehearsalBriefingStrip",
      "function renderRehearsalDecisionBridge",
      "function getDecisionApprovalGates",
      "function renderDecisionApprovalBoard",
      "function getDecisionSignatureFlow",
      "function renderDecisionSignatureFlow",
      "data-decision-approval-gate",
      "판단 연결",
      "승인 게이트",
      "최종 승인 흐름"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".rehearsal-briefing-strip",
      ".rehearsal-decision-bridge",
      ".decision-approval-board",
      ".decision-approval-grid",
      ".decision-approval-gate",
      ".decision-signature-flow",
      ".signature-step"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate briefing mode page for live judging without crowding existing screens", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-briefing\"",
      "data-stage=\"briefing\"",
      "id=\"page-briefing\"",
      "id=\"briefingRunwayTimeline\"",
      "id=\"briefingQuestionQueue\"",
      "id=\"briefingEvidenceLock\"",
      "id=\"briefingOneLineScript\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "briefing: { phase: \"브리핑 모드\"",
      "function getBriefingRunwayItems",
      "function getBriefingQuestionQueue",
      "function getBriefingEvidenceLockItems",
      "function renderBriefingRunway",
      "function runBriefingAction",
      "data-briefing-action",
      "심사 질문",
      "근거 잠금",
      "1분 브리핑"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".briefing-mode-page",
      ".briefing-mode-workspace",
      ".briefing-runway-timeline",
      ".briefing-question-queue",
      ".briefing-evidence-lock",
      ".briefing-script-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a briefing answer drill so judging questions become executable talking points", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"briefingDrillCard\"",
      "답변 드릴"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "selectedBriefingQuestionId",
      "data-briefing-question-id",
      "function renderBriefingDrillCard",
      "function selectBriefingQuestion",
      "20초 답변",
      "보여줄 화면",
      "근거 열기"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".briefing-drill-card",
      ".briefing-question-queue article.is-selected",
      ".briefing-drill-actions"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate AAR improvement page that turns rehearsal findings into owned follow-up actions", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-aar\"",
      "data-stage=\"aar\"",
      "id=\"page-aar\"",
      "id=\"aarSummaryPanel\"",
      "id=\"aarActionBoard\"",
      "id=\"aarOwnerMatrix\"",
      "id=\"aarEvidenceReplay\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "aar: { phase: \"AAR 개선안\"",
      "function getAarImprovementItems",
      "function getAarOwnerMatrix",
      "function getAarEvidenceReplayItems",
      "function renderAarImprovementPlan",
      "function runAarAction",
      "data-aar-action",
      "AAR 개선안",
      "책임자 매트릭스",
      "근거 리플레이"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".aar-page",
      ".aar-workspace",
      ".aar-summary-panel",
      ".aar-action-board",
      ".aar-owner-matrix",
      ".aar-evidence-replay"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate audit log page that proves the scenario from source intake to AAR actions", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-audit\"",
      "data-stage=\"audit\"",
      "id=\"page-audit\"",
      "id=\"auditSummaryPanel\"",
      "id=\"auditTimelinePanel\"",
      "id=\"auditEvidencePanel\"",
      "id=\"auditGapPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "audit: { phase: \"감사 로그\"",
      "function getAuditTrailItems",
      "function getAuditCoverageSummary",
      "function getAuditEvidenceLedger",
      "function renderAuditLogbook",
      "function runAuditAction",
      "data-audit-action",
      "소스 투입부터 AAR까지",
      "근거 원장",
      "검증 공백"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".audit-page",
      ".audit-workspace",
      ".audit-summary-panel",
      ".audit-timeline-panel",
      ".audit-evidence-panel",
      ".audit-gap-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate submission package page that bundles final outputs and readiness gates", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-submit\"",
      "data-stage=\"submit\"",
      "id=\"page-submit\"",
      "id=\"submitReadinessPanel\"",
      "id=\"submitBundlePanel\"",
      "id=\"submitChecklistPanel\"",
      "id=\"submitManifestPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "submit: { phase: \"제출 패키지\"",
      "function getSubmissionReadinessItems",
      "function getSubmissionBundleItems",
      "function getSubmissionManifest",
      "function renderSubmissionPackage",
      "function runSubmissionAction",
      "data-submit-action",
      "최종 제출 패키지",
      "제출 준비도",
      "산출물 묶음"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".submit-page",
      ".submit-workspace",
      ".submit-readiness-panel",
      ".submit-bundle-panel",
      ".submit-checklist-panel",
      ".submit-manifest-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate retraining plan page that converts AAR findings into 72-hour drills", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-retrain\"",
      "data-stage=\"retrain\"",
      "id=\"page-retrain\"",
      "id=\"retrainSchedulePanel\"",
      "id=\"retrainOwnerPanel\"",
      "id=\"retrainValidationPanel\"",
      "id=\"retrainDrillPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "retrain: { phase: \"재훈련 계획\"",
      "function getRetrainingScheduleItems",
      "function getRetrainingOwnerLoads",
      "function getRetrainingValidationGates",
      "function renderRetrainingPlan",
      "function runRetrainingAction",
      "data-retrain-action",
      "72시간 재훈련",
      "검증 게이트",
      "훈련 과제"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".retrain-page",
      ".retrain-workspace",
      ".retrain-schedule-panel",
      ".retrain-owner-panel",
      ".retrain-validation-panel",
      ".retrain-drill-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate handoff center page that packages the final decision for next operators", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-handoff\"",
      "data-stage=\"handoff\"",
      "id=\"page-handoff\"",
      "id=\"handoffSummaryPanel\"",
      "id=\"handoffRecipientPanel\"",
      "id=\"handoffSignalPanel\"",
      "id=\"handoffPacketPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "handoff: { phase: \"인수인계 센터\"",
      "function getHandoffRecipientItems",
      "function getHandoffChecklistItems",
      "function getHandoffSignalItems",
      "function renderHandoffCenter",
      "function runHandoffAction",
      "data-handoff-action",
      "인수인계 패킷",
      "수신자별 인계",
      "교신 문안"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".handoff-page",
      ".handoff-workspace",
      ".handoff-summary-panel",
      ".handoff-recipient-panel",
      ".handoff-signal-panel",
      ".handoff-packet-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate operations metrics page that tracks readiness after handoff", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-metrics\"",
      "data-stage=\"metrics\"",
      "id=\"page-metrics\"",
      "id=\"metricsOverviewPanel\"",
      "id=\"metricsRiskPanel\"",
      "id=\"metricsEvidencePanel\"",
      "id=\"metricsCadencePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "metrics: { phase: \"운영 지표\"",
      "function getOperationsMetricItems",
      "function getOperationsRiskTrend",
      "function getOperationsEvidenceCoverageSummary",
      "function getOperationsEvidenceDebt",
      "function renderOperationsMetrics",
      "function runMetricsAction",
      "data-metrics-action",
      "운영 지표판",
      "위험 추세",
      "근거 부채"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".metrics-page",
      ".metrics-workspace",
      ".metrics-overview-panel",
      ".metrics-risk-panel",
      ".metrics-evidence-panel",
      ".metrics-cadence-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    const metricBody = app.match(/function getOperationsMetricItems\(\) \{[\s\S]*?\n\}/)?.[0] || "";
    [
      "getHandoffChecklistItems",
      "getRetrainingValidationGates",
      "getSubmissionReadinessScore",
      "getHandoffRecipientItems",
      "getRetrainingScheduleItems"
    ].forEach((signature) => assert.ok(!metricBody.includes(signature), `metrics should not call ${signature} during boot`));

    const snapshotBody = app.match(/function getBriefingSnapshot\(\) \{[\s\S]*?\n\}/)?.[0] || "";
    assert.ok(!snapshotBody.includes("syncRouteState();"), "getBriefingSnapshot should not mutate browser history while rendering");
  });

  it("adds a separate decision watch page that tracks redecision triggers after metrics", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-watch\"",
      "data-stage=\"watch\"",
      "id=\"page-watch\"",
      "id=\"watchOverviewPanel\"",
      "id=\"watchTriggerPanel\"",
      "id=\"watchSignalPanel\"",
      "id=\"watchActionPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "watch: { phase: \"상황 감시\"",
      "function getDecisionWatchItems",
      "function getWatchEscalationItems",
      "function getWatchSignalItems",
      "function renderDecisionWatch",
      "function runWatchAction",
      "data-watch-action",
      "재판단 감시",
      "트리거 보드",
      "전파 문안",
      "const action = item.failureId ? \"risk\" : item.stage ? \"stage\" : \"evidence\""
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".watch-page",
      ".watch-workspace",
      ".watch-overview-panel",
      ".watch-trigger-panel",
      ".watch-signal-panel",
      ".watch-action-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate operations log page that preserves watch reports as a handoff record", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-log\"",
      "data-stage=\"log\"",
      "id=\"page-log\"",
      "id=\"logOverviewPanel\"",
      "id=\"logTimelinePanel\"",
      "id=\"logReportPanel\"",
      "id=\"logAcknowledgePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "log: { phase: \"상황 일지\"",
      "function getOperationsLogItems",
      "function getLogAcknowledgementItems",
      "function getLogReportPacket",
      "function renderOperationsLog",
      "function runLogAction",
      "data-log-action",
      "상황 일지",
      "보고 타임라인",
      "확인 기록"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".log-page",
      ".log-workspace",
      ".log-overview-panel",
      ".log-timeline-panel",
      ".log-report-panel",
      ".log-acknowledge-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate challenge review page that stress-tests the final decision before reuse", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-challenge\"",
      "data-stage=\"challenge\"",
      "id=\"page-challenge\"",
      "id=\"challengeOverviewPanel\"",
      "id=\"challengeAssumptionPanel\"",
      "id=\"challengeCounterPanel\"",
      "id=\"challengeActionPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "challenge: { phase: \"반증 검증\"",
      "function getChallengeAssumptionItems",
      "function getChallengeCounterItems",
      "function getChallengeActionItems",
      "function getChallengeReadinessScore",
      "function renderChallengeReview",
      "function runChallengeAction",
      "data-challenge-action",
      "반증 검증",
      "가정 보드",
      "반증 신호",
      "pages/16-challenge.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".challenge-page",
      ".challenge-workspace",
      ".challenge-overview-panel",
      ".challenge-assumption-panel",
      ".challenge-counter-panel",
      ".challenge-action-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate action queue page that turns all open review outputs into ordered work", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-queue\"",
      "data-stage=\"queue\"",
      "id=\"page-queue\"",
      "id=\"queueOverviewPanel\"",
      "id=\"queuePriorityPanel\"",
      "id=\"queueOwnerPanel\"",
      "id=\"queueGatePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "queue: { phase: \"조치 큐\"",
      "function getActionQueueItems",
      "function getActionQueueOwnerItems",
      "function getActionQueueGateItems",
      "function getActionQueueReadinessScore",
      "function renderActionQueue",
      "function runActionQueueAction",
      "data-queue-action",
      "조치 큐",
      "우선순위 큐",
      "담당자 부하",
      "pages/17-queue.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".queue-page",
      ".queue-workspace",
      ".queue-overview-panel",
      ".queue-priority-panel",
      ".queue-owner-panel",
      ".queue-gate-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate readiness forecast page that projects queue impact over the next operating window", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-forecast\"",
      "data-stage=\"forecast\"",
      "id=\"page-forecast\"",
      "id=\"forecastOverviewPanel\"",
      "id=\"forecastScenarioPanel\"",
      "id=\"forecastBottleneckPanel\"",
      "id=\"forecastGatePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "forecast: { phase: \"준비 예측\"",
      "function getReadinessForecastItems",
      "function getForecastScenarioItems",
      "function getForecastBottleneckItems",
      "function getForecastGateItems",
      "function getReadinessForecastScore",
      "function renderReadinessForecast",
      "function runForecastAction",
      "data-forecast-action",
      "준비 예측",
      "예측 시나리오",
      "병목 신호",
      "pages/18-forecast.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".forecast-page",
      ".forecast-workspace",
      ".forecast-overview-panel",
      ".forecast-scenario-panel",
      ".forecast-bottleneck-panel",
      ".forecast-gate-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate broadcast package page that turns forecast and queue outputs into recipient messages", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-broadcast\"",
      "data-stage=\"broadcast\"",
      "id=\"page-broadcast\"",
      "id=\"broadcastOverviewPanel\"",
      "id=\"broadcastRecipientPanel\"",
      "id=\"broadcastMessagePanel\"",
      "id=\"broadcastAckPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "broadcast: { phase: \"전파 패키지\"",
      "selectedBroadcastRecipientId",
      "function getBroadcastRecipientItems",
      "function getBroadcastMessageItems",
      "function getBroadcastAckItems",
      "function getBroadcastReadinessScore",
      "function getBroadcastPackage",
      "function renderBroadcastPackage",
      "function runBroadcastAction",
      "data-broadcast-action",
      "전파 패키지",
      "수신자별 문안",
      "pages/19-broadcast.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".broadcast-page",
      ".broadcast-workspace",
      ".broadcast-overview-panel",
      ".broadcast-recipient-panel",
      ".broadcast-message-panel",
      ".broadcast-ack-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate receipt tracking page that follows broadcast acknowledgements and escalation gates", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-receipt\"",
      "data-stage=\"receipt\"",
      "id=\"page-receipt\"",
      "id=\"receiptOverviewPanel\"",
      "id=\"receiptTrackPanel\"",
      "id=\"receiptEscalationPanel\"",
      "id=\"receiptGatePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "receipt: { phase: \"수신 확인\"",
      "selectedReceiptItemId",
      "function getReceiptTrackItems",
      "function getReceiptEscalationItems",
      "function getReceiptGateItems",
      "function getReceiptReadinessScore",
      "function getReceiptPackage",
      "function renderReceiptTracker",
      "function runReceiptAction",
      "data-receipt-action",
      "수신 확인",
      "미확인 대상",
      "pages/20-receipt.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".receipt-page",
      ".receipt-workspace",
      ".receipt-overview-panel",
      ".receipt-track-panel",
      ".receipt-escalation-panel",
      ".receipt-gate-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));
  });

  it("adds a separate closeout report page that locks receipt, exceptions, and archive outputs", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-closeout\"",
      "data-stage=\"closeout\"",
      "id=\"page-closeout\"",
      "id=\"closeoutOverviewPanel\"",
      "id=\"closeoutDecisionPanel\"",
      "id=\"closeoutExceptionPanel\"",
      "id=\"closeoutArchivePanel\"",
      "styles.css?v=primary-rail-v1"
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "closeout: { phase: \"종결 보고\"",
      "selectedCloseoutItemId",
      "function getCloseoutSummaryItems",
      "function getCloseoutDecisionItems",
      "function getCloseoutExceptionItems",
      "function getCloseoutArchiveItems",
      "function getCloseoutReadinessScore",
      "function getCloseoutPackage",
      "function renderCloseoutReport",
      "function runCloseoutAction",
      "data-closeout-action",
      "종결 보고",
      "예외 처리",
      "pages/21-closeout.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".closeout-page",
      ".closeout-page .panel-popout-button",
      ".closeout-workspace",
      ".closeout-overview-panel",
      ".closeout-decision-panel",
      ".closeout-exception-panel",
      ".closeout-archive-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    assert.ok(
      app.includes("if (page === \"data\")") && app.includes("if (state.currentStage === \"data\")"),
      "data stage should bypass eager all-page briefing and judge cue calculation"
    );
  });

  it("adds a separate lessons library page that turns closeout output into reusable next-operation checks", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-lessons\"",
      "data-stage=\"lessons\"",
      "id=\"page-lessons\"",
      "id=\"lessonsOverviewPanel\"",
      "id=\"lessonsPatternPanel\"",
      "id=\"lessonsChecklistPanel\"",
      "id=\"lessonsArchivePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "lessons: { phase: \"교훈 라이브러리\"",
      "selectedLessonItemId",
      "function getLessonSummaryItems",
      "function getLessonPatternItems",
      "function getLessonChecklistItems",
      "function getLessonArchiveItems",
      "function getLessonReadinessScore",
      "function getLessonPackage",
      "function renderLessonsLibrary",
      "function runLessonAction",
      "data-lesson-action",
      "교훈 라이브러리",
      "재사용 체크",
      "pages/22-lessons.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".lessons-page",
      ".lessons-workspace",
      ".lessons-overview-panel",
      ".lessons-pattern-panel",
      ".lessons-checklist-panel",
      ".lessons-archive-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    assert.ok(
      app.includes("if (page === \"lessons\")") && app.includes("if (state.currentStage === \"lessons\")"),
      "lessons page should avoid eager all-page briefing and judge cue calculation"
    );
  });

  it("adds a next operation template page that converts lessons into a new intake starter", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-nextop\"",
      "data-stage=\"nextop\"",
      "id=\"page-nextop\"",
      "id=\"nextopOverviewPanel\"",
      "id=\"nextopSeedPanel\"",
      "id=\"nextopConstraintPanel\"",
      "id=\"nextopPacketPanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "nextop: { phase: \"다음 작전 템플릿\"",
      "selectedNextOpItemId",
      "function getNextOperationSummaryItems",
      "function getNextOperationSeedItems",
      "function getNextOperationConstraintItems",
      "function getNextOperationPacketItems",
      "function getNextOperationReadinessScore",
      "function getNextOperationPackage",
      "function renderNextOperationTemplate",
      "function runNextOperationAction",
      "data-nextop-action",
      "다음 작전 템플릿",
      "작전 시드",
      "pages/23-nextop.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".nextop-page",
      ".nextop-workspace",
      ".nextop-overview-panel",
      ".nextop-seed-panel",
      ".nextop-constraint-panel",
      ".nextop-packet-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    assert.ok(
      app.includes("if (page === \"nextop\")") && app.includes("if (state.currentStage === \"nextop\")"),
      "next operation page should avoid eager all-page briefing and judge cue calculation"
    );
  });

  it("adds an intake prefill page that loops the next operation template back into source intake", () => {
    const html = readText("index.html");
    const app = readText("app.js");
    const css = readText("styles.css");

    [
      "id=\"tab-prefill\"",
      "data-stage=\"prefill\"",
      "id=\"page-prefill\"",
      "id=\"prefillOverviewPanel\"",
      "id=\"prefillManifestPanel\"",
      "id=\"prefillFieldPanel\"",
      "id=\"prefillGatePanel\""
    ].forEach((signature) => assert.ok(html.includes(signature), `${signature} is missing from index.html`));

    [
      "prefill: { phase: \"초기 접수 프리필\"",
      "selectedPrefillItemId",
      "function getPrefillOverviewItems",
      "function getPrefillManifestItems",
      "function getPrefillFieldItems",
      "function getPrefillGateItems",
      "function getPrefillReadinessScore",
      "function getPrefillPackage",
      "function renderIntakePrefill",
      "function runPrefillAction",
      "data-prefill-action",
      "초기 접수 프리필",
      "접수 필드",
      "pages/24-prefill.html"
    ].forEach((signature) => assert.ok(app.includes(signature), `${signature} is missing from app.js`));

    [
      ".prefill-page",
      ".prefill-workspace",
      ".prefill-overview-panel",
      ".prefill-manifest-panel",
      ".prefill-field-panel",
      ".prefill-gate-panel"
    ].forEach((signature) => assert.ok(css.includes(signature), `${signature} is missing from styles.css`));

    assert.ok(
      app.includes("if (page === \"prefill\")") && app.includes("if (state.currentStage === \"prefill\")"),
      "prefill page should avoid eager all-page briefing and judge cue calculation"
    );
  });
});
