const demoData = {
  operationPlan: {
    operation_name: "대대급 야간 기동훈련",
    mission: "야간 제한시계 조건에서 지정 집결지까지 기동 후 예비대 전개태세 유지",
    start_time: "03:40",
    deadline: "05:20",
    source_disclaimer: "작전 자료 접수 완료",
    documents: [
      { id: "operation_plan", name: "operation_plan.pdf", type: "작전계획" },
      { id: "coa_options", name: "coa_options.xlsx", type: "방책" },
      { id: "logistics_status", name: "logistics_status.xlsx", type: "군수" },
      { id: "comm_coverage_map", name: "comm_coverage_map.png", type: "통신" },
      { id: "weather", name: "weather.json", type: "기상" },
      { id: "sop_excerpt", name: "sop_excerpt.txt", type: "SOP" }
    ],
    constraints: ["통신 음영", "보급대기점 부족", "차량 정비 제한", "새벽 안개", "후송로 제한"],
    extracted_fields: [
      { label: "작전명", value: "대대급 야간 기동훈련", source: "operation_plan.pdf" },
      { label: "임무", value: "제한 시간 내 지정 집결지 도착", source: "operation_plan.pdf" },
      { label: "재판단 기준", value: "문서 내 명시 부족", source: "sop_excerpt.txt" }
    ]
  },
  coas: [
    {
      id: "A",
      name: "최단 경로 신속 전개",
      travel_time: 78,
      comm_risk: "high",
      logistics_risk: "medium",
      enemy_predictability: "high",
      strength: "제한 시간 충족 가능성이 가장 높음",
      weakness: "통신 음영과 적 지연행동이 동시에 걸릴 때 지휘공백 발생 가능",
      condition: "예비 통신수단, 보급대기점, 재판단 기준 보완 시 조건부 가능"
    },
    {
      id: "B",
      name: "우회 경로 안정 전개",
      travel_time: 96,
      comm_risk: "low",
      logistics_risk: "low",
      enemy_predictability: "medium",
      strength: "통신, 보급, 후송 안정성이 가장 높음",
      weakness: "도착 시간 여유가 줄어 속도 저하 이벤트에 민감",
      condition: "기상 저하 시 선두 제대 속도 보정 필요"
    },
    {
      id: "C",
      name: "단계별 전개 후 예비대 대기",
      travel_time: 112,
      comm_risk: "medium",
      logistics_risk: "low",
      enemy_predictability: "low",
      strength: "예비대 운용과 재판단 여지가 큼",
      weakness: "제한 시간 초과 위험이 큼",
      condition: "집결지 도착 시각 조정 또는 임무 단계 분리 필요"
    }
  ],
  agents: [
    ["commander_agent", "지휘관 에이전트", "staff", "방책 선택과 지휘관 확인 항목 정리", ["지휘공백", "재판단 지연"], 0.86, "최종 결심 쟁점 4건", "결심카드"],
    ["ops_staff_agent", "작전참모 에이전트", "staff", "시간표, 단계, 방책별 실행 가능성 검토", ["시간 초과", "예비대 투입 지연"], 0.84, "단계별 시간 여유표", "리허설 타임라인"],
    ["logistics_staff_agent", "군수참모 에이전트", "staff", "보급 대기점과 정비 여력 검토", ["작전 지속성 저하", "정비 제한"], 0.82, "보급·정비 병목 목록", "즉시 수정안"],
    ["comm_staff_agent", "통신참모 에이전트", "staff", "통신 음영 및 예비 중계 검토", ["통신 음영", "보고 지연"], 0.82, "음영구간·예비망 표", "재판단 기준"],
    ["medical_staff_agent", "의무참모 에이전트", "staff", "후송로와 사고 대응 시간 검토", ["사고 대응 지연", "후송로 제한"], 0.8, "후송시간 초과 후보", "위험완화 조치"],
    ["sop_agent", "SOP 검증 에이전트", "staff", "중단, 전환, 증원 요청 기준 검증", ["재판단 기준 미명시", "승인 지연"], 0.88, "승인·전환 기준 공백", "지휘관 체크리스트"],
    ["red_team_agent", "레드팀 에이전트", "staff", "방책별 실패경로 공격 탐색", ["적 지연행동", "복합 실패"], 0.9, "A안 취약 경로 반론", "실패경로 카드"],
    ["judge_agent", "심판관 에이전트", "staff", "무근거 항목 배제 및 결심카드 검증", ["근거 누락", "과잉 권고"], 0.87, "근거 잠금·삭제 의견", "근거 테이블"],
    ["company_commander_agent", "중대장 에이전트", "field", "선두 제대 기동과 현장 판단 조건 검토", ["현장 대기", "보고 지연"], 0.78, "현장 대기 발생 조건", "재판단 기준"],
    ["platoon_leader_agent", "소대장 에이전트", "field", "구간별 이동 속도와 대기 지점 검토", ["속도 저하", "집결 지연"], 0.76, "구간별 지연 예상치", "리허설 이벤트"],
    ["squad_leader_agent", "분대장 에이전트", "field", "통신 두절 시 현장 유지 절차 검토", ["통신 두절", "명령 갱신 실패"], 0.75, "두절 시 행동 절차", "SOP 보완안"],
    ["driver_agent", "운전병 에이전트", "field", "야간 기동과 안개 조건 이동성 검토", ["차량 사고", "속도 저하"], 0.74, "차량 속도 보정값", "시간표 보정"],
    ["radio_operator_agent", "통신병 에이전트", "field", "보고 주기와 예비 통신수단 운용 검토", ["보고 지연", "예비망 미지정"], 0.77, "보고주기 누락 지점", "통신참모"],
    ["supply_soldier_agent", "군수병 에이전트", "field", "보급 대기점 처리량과 대기 시간 검토", ["보급 병목", "작전 지속성 저하"], 0.76, "보급 대기시간 계산", "군수참모"],
    ["maintenance_agent", "정비병 에이전트", "field", "차량 정비 제한과 고장 대응 검토", ["정비 지연", "차량 이탈"], 0.75, "정비 우선순위 초안", "군수참모"],
    ["reserve_leader_agent", "예비대장 에이전트", "field", "예비대 투입 기준과 대기 위치 검토", ["예비대 투입 판단 지연", "재판단 지연"], 0.79, "예비대 투입 트리거", "지휘관 체크리스트"],
    ["enemy_force_agent", "적군 에이전트", "environment", "적 지연행동과 방어 가능성 생성", ["적 지연행동", "A안 노출"], 0.81, "교차로 지연행동 가설", "레드팀"],
    ["weather_agent", "기상 에이전트", "environment", "새벽 안개와 이동 속도 보정", ["새벽 안개", "시정 저하"], 0.83, "03:50-04:35 시정 보정", "시간표 보정"],
    ["terrain_agent", "지형 에이전트", "environment", "협곡, 교차로, 우회로 통과 위험 검토", ["협곡 병목", "후송로 제한"], 0.78, "병목·우회로 위험 좌표", "지형 분석"],
    ["vehicle_agent", "차량 에이전트", "environment", "차량 정비 상태와 기동 지속성 검토", ["정비 제한", "기동 지속성 저하"], 0.76, "차량 이탈 가능 구간", "정비병"],
    ["network_agent", "통신망 에이전트", "environment", "통신 커버리지와 중계 후보 검토", ["통신 음영", "예비 중계"], 0.84, "C1/C2 중계 후보", "통신참모"],
    ["supply_route_agent", "보급로 에이전트", "environment", "보급 대기점과 보급로 안정성 검토", ["보급대기점 부족", "보급 병목"], 0.79, "대기점 추가 후보", "군수참모"],
    ["evac_route_agent", "후송로 에이전트", "environment", "주 후송로와 대체 후송로 검토", ["후송로 제한", "사고 대응 지연"], 0.8, "대체 후송로 후보", "의무참모"]
  ].map(([id, name, layer, role, risk_focus, confidence, review_output, handoff]) => ({
    id,
    name,
    layer,
    role,
    risk_focus,
    confidence,
    review_output,
    handoff,
    status: "대기"
  })),
  events: [
    {
      id: "start",
      time: "03:40",
      event: "작전 개시",
      detail: "A/B/C 방책에 동일한 제한사항을 적용하고 가상부대 리허설을 시작.",
      agents: ["지휘관 에이전트", "작전참모 에이전트", "중대장 에이전트"],
      impact: "기준 시간표 확정",
      severity: "low",
      linked_risks: [],
      evidence_ids: ["ev_plan_mission"]
    },
    {
      id: "fog",
      time: "03:55",
      event: "새벽 안개로 이동속도 저하",
      detail: "시정 저하로 선두 제대 속도가 예상보다 낮아지고 후송 시간 여유가 줄어듦.",
      agents: ["기상 에이전트", "운전병 에이전트", "의무참모 에이전트"],
      impact: "이동시간 증가",
      severity: "medium",
      linked_risks: ["accident_delay"],
      evidence_ids: ["ev_weather_fog"]
    },
    {
      id: "enemy_delay",
      time: "04:05",
      event: "적 지연행동 발생",
      detail: "A안 최단 경로의 교차로와 협곡 입구에서 선두 제대 진행이 지연됨.",
      agents: ["적군 에이전트", "레드팀 에이전트", "중대장 에이전트"],
      impact: "A안 시간 여유 감소",
      severity: "medium",
      linked_risks: ["command_gap"],
      evidence_ids: ["ev_redteam_delay"]
    },
    {
      id: "comm_gap",
      time: "04:08",
      event: "통신 음영구간 진입, 보고 지연",
      detail: "A안 2단계 구간에서 18분 음영이 발생해 지휘소의 상황 갱신이 늦어짐.",
      agents: ["통신참모 에이전트", "통신병 에이전트", "통신망 에이전트"],
      impact: "지휘 갱신 지연",
      severity: "high",
      linked_risks: ["command_gap", "rejudge_delay"],
      evidence_ids: ["ev_comm_gap"]
    },
    {
      id: "supply_gap",
      time: "04:15",
      event: "보급 대기점 부족 노출",
      detail: "A안과 C안 모두 보급 대기점 1개로는 정비와 연료 보충 대기 시간이 증가.",
      agents: ["군수참모 에이전트", "군수병 에이전트", "보급로 에이전트"],
      impact: "지속성 저하",
      severity: "medium",
      linked_risks: ["sustainment_drop"],
      evidence_ids: ["ev_logistics_supply"]
    },
    {
      id: "criteria_gap",
      time: "04:22",
      event: "재판단 기준 불명확으로 현장 대기",
      detail: "통신 두절 후 전환 승인 기준이 명시되지 않아 현장 제대가 대기 상태로 머묾.",
      agents: ["SOP 검증 에이전트", "소대장 에이전트", "예비대장 에이전트"],
      impact: "전환 판단 지연",
      severity: "high",
      linked_risks: ["rejudge_delay", "command_gap"],
      evidence_ids: ["ev_sop_criteria"]
    },
    {
      id: "reserve_delay",
      time: "04:30",
      event: "예비대 투입 판단 지연",
      detail: "예비대 투입 시점이 늦어져 지휘공백과 작전 지속성 저하가 동시에 상승.",
      agents: ["지휘관 에이전트", "작전참모 에이전트", "예비대장 에이전트"],
      impact: "실패경로 확정",
      severity: "high",
      linked_risks: ["command_gap", "sustainment_drop"],
      evidence_ids: ["ev_plan_mission", "ev_sop_criteria"]
    },
    {
      id: "b_stabilized",
      time: "04:42",
      event: "B안 우회 경로 안정성 확인",
      detail: "B안은 시간은 증가하나 통신 갱신과 보급 대기점 접근성이 유지됨.",
      agents: ["심판관 에이전트", "군수참모 에이전트", "통신참모 에이전트"],
      impact: "추천 방책 후보 확정",
      severity: "low",
      linked_risks: [],
      evidence_ids: ["ev_coa_b"]
    }
  ],
  failures: [
    {
      id: "command_gap",
      title: "지휘공백",
      score: 92,
      impact: 5,
      likelihood: 4,
      connectivity: 5,
      time_pressure: 0.92,
      summary: "A안 최단 경로에서 적 지연행동과 통신 음영이 겹치면 지휘소 갱신이 끊기고 예비대 투입 판단이 늦어진다.",
      driver: "적 지연행동과 통신 음영 동시 발생",
      decision_point: "04:08 음영 진입 전 예비망 전환 권한 확정",
      early_warning: "보고 주기 1회 누락 또는 10분 이상 두절",
      chain: ["최단 경로 선택", "적 지연행동", "통신 음영", "보고 지연", "재판단 기준 미명시", "예비대 투입 판단 지연"],
      mitigation: "예비 중계팀 C1/C2 선배치와 통신 두절 10분 기준 명시",
      mitigation_steps: [
        "C1/C2 예비 중계팀을 A안 2단계 진입 전 선배치",
        "통신 두절 10분 초과 시 예비망 전환 권한을 현장 지휘자에게 위임",
        "04:20 예비대 투입 재판단 시각을 결심카드에 고정"
      ],
      evidence: ["ev_comm_gap", "ev_redteam_delay", "ev_sop_criteria"]
    },
    {
      id: "sustainment_drop",
      title: "작전 지속성 저하",
      score: 84,
      impact: 4,
      likelihood: 4,
      connectivity: 4,
      time_pressure: 0.84,
      summary: "보급 대기점과 정비 여력이 부족하면 2단계 이후 연료·정비 대기열이 누적되어 B안 전환 여유까지 줄어든다.",
      driver: "보급 대기점 1개와 정비 가능 시간 35분 제한",
      decision_point: "04:15 보급 대기 15분 초과 예상 시 B안 유지",
      early_warning: "연료 보충 대기열 발생 또는 정비 우선순위 미확정",
      chain: ["보급대기점 부족", "정비 가능 시간 제한", "연료 여유 감소", "2단계 이후 기동 지속성 저하"],
      mitigation: "보급 대기점 1개 추가와 정비 우선순위 재배치",
      mitigation_steps: [
        "보급 대기점 1개를 우회 경로 접근 가능한 위치에 추가",
        "정비 우선순위를 선두 제대와 통신차량 순으로 고정",
        "2단계 진입 전 연료 여유와 정비 완료율을 재보고"
      ],
      evidence: ["ev_logistics_supply", "ev_coa_a"]
    },
    {
      id: "accident_delay",
      title: "사고 대응 지연",
      score: 78,
      impact: 4,
      likelihood: 3,
      connectivity: 4,
      time_pressure: 0.81,
      summary: "새벽 안개와 협소한 주 후송로가 겹치면 사고 발생 시 의무반 접근 시간이 늘고 선두 제대 흐름이 끊긴다.",
      driver: "새벽 안개와 협소한 주 후송로",
      decision_point: "03:55 시정 저하 확인 시 대체 후송로 개방",
      early_warning: "선두 제대 평균속도 저하 또는 후송 예상 20분 초과",
      chain: ["새벽 안개", "차량 속도 저하", "후송로 협소", "의무반 접근 지연", "사고 대응 시간 증가"],
      mitigation: "대체 후송로 사전 지정과 의무반 전방 대기",
      mitigation_steps: [
        "대체 후송로를 리허설 시작 전 지휘망에 공유",
        "의무반을 사고 다발 예상 지점 전방에 대기",
        "안개 지속 시 선두 제대 속도 제한과 간격 기준을 고정"
      ],
      evidence: ["ev_weather_fog", "ev_evac_route"]
    },
    {
      id: "rejudge_delay",
      title: "재판단 지연",
      score: 73,
      impact: 4,
      likelihood: 3,
      connectivity: 3,
      time_pressure: 0.76,
      summary: "SOP의 중단·전환 기준이 현재 시간표와 연결되지 않으면 통신 두절 뒤 현장 제대가 승인 대기 상태로 묶인다.",
      driver: "SOP 기준과 현재 시간표 미연결",
      decision_point: "04:20 이전 전환 승인권자 및 대체권한 지정",
      early_warning: "현장 대기 보고 후 1개 보고주기 내 승인 없음",
      chain: ["SOP 재판단 기준 미명시", "통신 두절 보고 지연", "현장 대기", "전환 승인 지연"],
      mitigation: "04:20 이전 전환 기준과 승인 대체권한 명시",
      mitigation_steps: [
        "04:20 이전 전환 승인 기준을 시간표에 명시",
        "지휘소 두절 시 대체 승인권자를 현장 지휘자로 지정",
        "현장 대기 보고 후 1개 보고주기 내 재판단하도록 체크리스트화"
      ],
      evidence: ["ev_sop_criteria", "ev_comm_gap"]
    }
  ],
  evidence: [
    ["ev_plan_mission", "작전계획서 문장", "임무와 제한시간", "근거 있음", "operation_plan.pdf", "야간 제한시계 조건에서 지정 집결지까지 기동 후 예비대 전개태세 유지."],
    ["ev_coa_a", "COA 비교표", "A안 최단 경로 위험", "근거 있음", "coa_options.xlsx", "A안은 이동시간이 짧지만 통신 위험 high, 적 예측 가능성 high로 표시됨."],
    ["ev_coa_b", "COA 비교표", "B안 안정성", "근거 있음", "coa_options.xlsx", "B안은 이동시간이 증가하나 통신과 군수 위험이 low로 정규화됨."],
    ["ev_comm_gap", "통신 커버리지 지도", "A안 2단계 통신 음영", "근거 있음", "comm_coverage_map.png", "A안 협곡 구간에 18분 음영이 겹쳐 보고 주기 갱신이 불안정."],
    ["ev_logistics_supply", "군수 현황표", "보급대기점 부족", "근거 있음", "logistics_status.xlsx", "현재 대기점 1개, 요구 대기점 2개. 정비 가능 시간 35분으로 제한."],
    ["ev_weather_fog", "기상 JSON", "새벽 안개", "근거 있음", "weather.json", "03:50-04:35 구간 제한시계. 이동 속도 보정 +12분."],
    ["ev_sop_criteria", "SOP 발췌", "재판단 기준 명시 필요", "추가 확인 필요", "sop_excerpt.txt", "중단/전환/증원 요청 기준은 있으나 본 계획서의 시간 기준과 연결되지 않음."],
    ["ev_redteam_delay", "에이전트 토론 로그", "적 지연행동 가설", "추정", "agent_discussion.log", "레드팀은 A안 교차로와 협곡 입구에서 선두 제대 지연 가능성을 제시."],
    ["ev_evac_route", "후송로 검토", "후송 대체로 필요", "추정", "operation_plan.pdf", "주 후송로가 협소하여 사고 발생 시 의무반 접근 시간이 증가할 수 있음."]
  ].map(([id, type, title, status, source, preview]) => ({ id, type, title, status, source, preview })),
  decision: {
    title: "지휘관 결심카드",
    recommended_coa: "B안 우선",
    conditional_coa: "A안은 조건부 보완 후 시행 가능",
    command_authority_notice: "AI 생성 검토안 / 지휘관 검토 필요",
    decision_statement: "B안 우선을 기본 결심으로 하고, A안은 통신·군수·재판단 조건 충족 시에만 제한적으로 시행한다.",
    rationale: [
      "A안은 통신 음영과 적 지연행동이 결합될 때 지휘공백 위험이 가장 큼",
      "B안은 이동시간은 늘지만 보급, 통신, 후송 안정성이 가장 높음",
      "C안은 예비대 운용 여지는 있으나 제한시간 초과 위험이 남음"
    ],
    conditions: [
      { label: "통신", detail: "A안 2단계 진입 전 C1/C2 예비 중계팀 선배치", owner: "통신참모" },
      { label: "군수", detail: "보급 대기점 1개 추가와 정비 우선순위 확정", owner: "군수참모" },
      { label: "재판단", detail: "04:20 이전 예비대 투입 및 전환 승인권자 지정", owner: "지휘관" },
      { label: "후송", detail: "대체 후송로와 의무반 전방 대기 위치 확정", owner: "의무참모" }
    ],
    immediate_actions: [
      "통신 음영 진입 전 보고 기준과 예비망 전환 절차 확정",
      "C1/C2 예비 중계팀 선배치",
      "보급 대기점 1개 추가 및 정비 우선순위 고정",
      "04:20 예비대 투입 재판단 시각 고정",
      "대체 후송로와 의무반 전방 대기 위치 확정"
    ],
    redecision_criteria: [
      "통신 두절 10분 초과 시 예비망 전환",
      "04:20 이전 예비대 투입 여부 재판단",
      "후송 지연 20분 초과 예상 시 대체 후송로 전환",
      "보급 대기 15분 초과 시 B안 유지 또는 C안 단계 분리"
    ],
    commander_check_items: [
      "A안 조건부 시행 조건을 승인할 것인가",
      "예비망 전환 권한을 현장 지휘자에게 위임할 것인가",
      "보급 대기점 추가에 필요한 자원을 즉시 배정할 것인가",
      "04:20 재판단 기준과 대체 승인권자를 명시할 것인가"
    ],
    watch_items: [
      "04:08 통신 음영 진입 전 보고 완료 여부",
      "04:15 보급 대기 15분 초과 예상 여부",
      "04:20 예비대 투입 재판단 실행 여부",
      "후송 예상시간 20분 초과 징후"
    ],
    evidence_ids: ["ev_coa_b", "ev_comm_gap", "ev_logistics_supply", "ev_sop_criteria"]
  },
  order: {
    title: "단편명령 작성안",
    notice: "의사결정 지원 작성안 / 지휘관 승인 필요",
    situation: "대대급 야간 기동훈련 중 A안 최단 경로에서 통신 음영, 적 지연행동, 보급대기점 부족이 복합 위험으로 식별됨.",
    mission: "부대는 제한 시간 내 지정 집결지에 도착하되, 지휘공백 없이 예비대 전개태세를 유지한다.",
    execution: [
      "B안을 기본 기동방책으로 준비한다.",
      "A안 시행 시 예비 통신수단 지정 후 조건부 승인한다.",
      "A안 2단계 진입 전 예비 중계팀을 C1/C2 후보지에 선배치한다.",
      "04:20 이전 예비대 투입 여부를 재판단한다.",
      "통신 두절 10분 초과 또는 후송 지연 20분 초과 예상 시 전환 판단한다."
    ],
    service_support: [
      "보급 대기점 1개를 추가 지정한다.",
      "정비 우선순위는 선두 제대 차량과 통신 차량으로 둔다.",
      "의무반은 대체 후송로 진입 가능 위치에서 전방 대기한다."
    ],
    command_signal: [
      "주 통신망 두절 시 예비망으로 즉시 전환한다.",
      "현장 보고 누락 시 소대장 기준으로 10분 단위 상태 보고를 유지한다.",
      "최종 명령 발령 전 지휘관 확인 항목 4건을 검토한다."
    ]
  }
};

const evidenceById = new Map(demoData.evidence.map((item) => [item.id, item]));
const terrainRehearsalSummary = {
  metrics: [
    { label: "지형", value: "실측 산악 협곡형" },
    { label: "DEM", value: "139-911m" },
    { label: "위성", value: "z14 모자이크" },
    { label: "가시선", value: "제한" },
    { label: "통신", value: "A안 취약" }
  ],
  brief: [
    "VISTA 승진훈련장 Terrarium DEM과 위성 타일을 3D 지형 표면에 적용했다.",
    "실제 고도 기복 기준 중앙 협곡과 북동 고지대가 A안 통신 갱신을 제한한다.",
    "B안은 남측 우회축으로 보급·후송 접근성이 유지된다.",
    "예비 중계팀 C1 선배치가 지휘공백 실패경로를 직접 완화한다."
  ],
  commander: {
    recommendation: "B안 우회 경로 안정 전개",
    confidence: 0.86,
    message: "지형·통신·군수 제약을 종합하면 B안을 기본 기동방책으로 준비하고 A안은 조건부 승인한다.",
    overlays: ["B안 경로 강조", "A안 통신 음영 표시", "예비 중계팀 C1", "재판단 기준 04:20"]
  }
};
const layerLabels = {
  staff: "지휘·참모 계층",
  field: "현장 수행 계층",
  environment: "환경·적·장비 계층"
};

const agentLayerMeta = {
  staff: {
    code: "HQ CELL",
    brief: "지휘소 판단, 참모 검토, 반론과 근거 검증을 맡는 상위 셀."
  },
  field: {
    code: "FIELD UNIT",
    brief: "중대, 소대, 분대, 차량, 보급 등 실제 수행 조건을 압박하는 현장 셀."
  },
  environment: {
    code: "OPFOR / WORLD",
    brief: "적, 기상, 지형, 통신망, 이동로처럼 부대를 흔드는 전장 변수 셀."
  }
};

const agentFilterLabels = {
  all: "전체",
  blue: "아군",
  opfor: "대항군",
  environment: "전장 변수",
  control: "통제"
};

const agentMetricLabels = {
  command: "지휘",
  mobility: "기동",
  support: "지원",
  threat: "위협",
  control: "통제"
};

const agentUnitProfiles = {
  commander_agent: {
    callsign: "CMD",
    faction: "blue",
    factionLabel: "아군 지휘",
    unitClass: "Command Unit",
    portrait: "command",
    temperament: "결심형",
    specialty: "최종 방책 승인과 지휘공백 차단",
    traits: ["방책 승인", "지휘권 확인", "재판단 기준"],
    loadout: ["작전계획서", "결심카드"],
    quote: "빠른 경로보다 지휘 갱신이 유지되는 경로가 먼저입니다."
  },
  ops_staff_agent: {
    callsign: "OPS",
    faction: "blue",
    factionLabel: "아군 참모",
    unitClass: "Operations Unit",
    portrait: "operations",
    temperament: "계산형",
    specialty: "시간표와 단계별 실행 가능성 압박",
    traits: ["시간표", "단계 통제", "예비대 투입"],
    loadout: ["작전계획서", "방책 비교표"],
    quote: "각 방책은 시간 여유와 지휘 갱신 주기로 먼저 걸러야 합니다."
  },
  logistics_staff_agent: {
    callsign: "LOG",
    faction: "blue",
    factionLabel: "아군 군수",
    unitClass: "Sustainment Unit",
    portrait: "logistics",
    temperament: "보수형",
    specialty: "보급 대기점과 정비 여력 계산",
    traits: ["보급 지속성", "정비 시간", "연료 여유"],
    loadout: ["군수 현황", "방책 비교표"],
    quote: "A안은 빠르지만 보급 대기점이 하나 더 필요합니다."
  },
  comm_staff_agent: {
    callsign: "SIG",
    faction: "blue",
    factionLabel: "아군 통신",
    unitClass: "Signal Unit",
    portrait: "signals",
    temperament: "감시형",
    specialty: "통신 음영과 예비 중계 후보 탐지",
    traits: ["통신 커버리지", "중계 후보", "보고 지연"],
    loadout: ["통신 지도", "작전계획서"],
    quote: "18분 음영 구간은 예비 중계 없이 통과시키면 안 됩니다."
  },
  medical_staff_agent: {
    callsign: "MED",
    faction: "blue",
    factionLabel: "아군 의무",
    unitClass: "Medical Unit",
    portrait: "medical",
    temperament: "안전형",
    specialty: "후송로와 사고 대응 시간 검증",
    traits: ["후송 시간", "사고 대응", "대체로"],
    loadout: ["작전계획서", "기상 JSON"],
    quote: "안개가 깔리면 이동 속도보다 후송 여유가 먼저 줄어듭니다."
  },
  sop_agent: {
    callsign: "SOP",
    faction: "control",
    factionLabel: "규정 통제",
    unitClass: "Rule Check Unit",
    portrait: "judge",
    temperament: "엄격형",
    specialty: "중단, 전환, 증원 기준 누락 탐지",
    traits: ["규정 검증", "승인 기준", "중단 조건"],
    loadout: ["SOP 발췌", "작전계획서"],
    quote: "재판단 기준이 없으면 결심카드는 미완성입니다."
  },
  red_team_agent: {
    callsign: "RED",
    faction: "opfor",
    factionLabel: "대항군",
    unitClass: "Red Team Unit",
    portrait: "opfor",
    temperament: "공격형",
    specialty: "방책별 실패경로를 적 관점으로 공격",
    traits: ["취약점 공격", "지연행동", "복합 실패"],
    loadout: ["방책 비교표", "이벤트 타임라인"],
    quote: "A안은 협곡 입구를 묶으면 지휘 갱신 주기가 무너집니다."
  },
  judge_agent: {
    callsign: "JDG",
    faction: "control",
    factionLabel: "심판 통제",
    unitClass: "Arbiter Unit",
    portrait: "judge",
    temperament: "검증형",
    specialty: "무근거 권고 제거와 결심카드 검증",
    traits: ["근거 체인", "과잉 권고 제거", "최종 판정"],
    loadout: ["근거 맵", "결심카드"],
    quote: "근거가 연결되지 않은 주장은 결심에 올리지 않습니다."
  },
  company_commander_agent: {
    callsign: "COY",
    faction: "blue",
    factionLabel: "아군 수행",
    unitClass: "Company Unit",
    portrait: "field",
    temperament: "현장형",
    specialty: "선두 제대 기동과 현장 판단 조건",
    traits: ["선두 제대", "현장 대기", "상황 보고"],
    loadout: ["작전계획서", "방책 비교표"],
    quote: "현장 대기 지점이 모호하면 선두 제대가 먼저 멈춥니다."
  },
  platoon_leader_agent: {
    callsign: "PLT",
    faction: "blue",
    factionLabel: "아군 수행",
    unitClass: "Platoon Unit",
    portrait: "field",
    temperament: "기동형",
    specialty: "구간별 이동 속도와 대기 지점 검토",
    traits: ["구간 속도", "집결 지연", "대기 지점"],
    loadout: ["작전계획서", "기상 JSON"],
    quote: "속도 저하가 생기면 집결 대기열부터 다시 계산해야 합니다."
  },
  squad_leader_agent: {
    callsign: "SQD",
    faction: "blue",
    factionLabel: "아군 수행",
    unitClass: "Squad Unit",
    portrait: "field",
    temperament: "유지형",
    specialty: "통신 두절 시 현장 유지 절차",
    traits: ["분대 유지", "통신 두절", "명령 갱신"],
    loadout: ["SOP 발췌", "통신 지도"],
    quote: "두절 시 누구 기준으로 멈출지 정해져 있어야 합니다."
  },
  driver_agent: {
    callsign: "DRV",
    faction: "blue",
    factionLabel: "아군 기동",
    unitClass: "Mobility Unit",
    portrait: "vehicle",
    temperament: "기동형",
    specialty: "야간 기동과 안개 조건 이동성",
    traits: ["야간 운전", "시정 저하", "차량 사고"],
    loadout: ["기상 JSON", "작전계획서"],
    quote: "새벽 안개에서는 속도보다 차간 유지가 먼저입니다."
  },
  radio_operator_agent: {
    callsign: "RTO",
    faction: "blue",
    factionLabel: "아군 통신",
    unitClass: "Radio Unit",
    portrait: "signals",
    temperament: "연결형",
    specialty: "보고 주기와 예비 통신수단 운용",
    traits: ["상황 보고", "예비망", "보고 누락"],
    loadout: ["통신 지도", "SOP 발췌"],
    quote: "예비망 전환 기준을 모르면 보고 공백이 길어집니다."
  },
  supply_soldier_agent: {
    callsign: "SUP",
    faction: "blue",
    factionLabel: "아군 군수",
    unitClass: "Supply Unit",
    portrait: "logistics",
    temperament: "처리형",
    specialty: "보급 대기점 처리량과 대기 시간",
    traits: ["처리량", "보급 병목", "지속성"],
    loadout: ["군수 현황"],
    quote: "보급 대기점 하나로는 2단계 이후 병목이 생깁니다."
  },
  maintenance_agent: {
    callsign: "MNT",
    faction: "blue",
    factionLabel: "아군 정비",
    unitClass: "Repair Unit",
    portrait: "vehicle",
    temperament: "정비형",
    specialty: "차량 정비 제한과 고장 대응",
    traits: ["정비 지연", "차량 이탈", "우선순위"],
    loadout: ["군수 현황"],
    quote: "정비 시간은 통신 차량과 선두 차량에 먼저 배정해야 합니다."
  },
  reserve_leader_agent: {
    callsign: "RSV",
    faction: "blue",
    factionLabel: "아군 예비",
    unitClass: "Reserve Unit",
    portrait: "reserve",
    temperament: "대기형",
    specialty: "예비대 투입 기준과 대기 위치",
    traits: ["예비대", "투입 기준", "재판단"],
    loadout: ["작전계획서", "SOP 발췌"],
    quote: "예비대는 기준 없이 움직이면 늦고, 너무 일찍 움직이면 비게 됩니다."
  },
  enemy_force_agent: {
    callsign: "OPF",
    faction: "opfor",
    factionLabel: "적군",
    unitClass: "OPFOR Delay Unit",
    portrait: "enemy",
    temperament: "교란형",
    specialty: "협곡과 교차로 지연행동 생성",
    traits: ["매복", "지연행동", "A안 노출"],
    loadout: ["방책 비교표"],
    quote: "최단 경로는 예측 가능성이 높아 지연행동을 걸기 쉽습니다."
  },
  weather_agent: {
    callsign: "WX",
    faction: "environment",
    factionLabel: "전장 환경",
    unitClass: "Weather Cell",
    portrait: "weather",
    temperament: "변동형",
    specialty: "새벽 안개와 이동 속도 보정",
    traits: ["시정 저하", "속도 보정", "후송 지연"],
    loadout: ["기상 JSON"],
    quote: "안개는 기동과 후송 시간을 동시에 갉아먹습니다."
  },
  terrain_agent: {
    callsign: "TER",
    faction: "environment",
    factionLabel: "전장 환경",
    unitClass: "Terrain Cell",
    portrait: "terrain",
    temperament: "병목형",
    specialty: "협곡, 교차로, 우회로 통과 위험",
    traits: ["협곡 병목", "우회로", "후송 제한"],
    loadout: ["작전계획서", "통신 지도"],
    quote: "협곡은 시간 문제가 아니라 대열이 끊기는 문제입니다."
  },
  vehicle_agent: {
    callsign: "VEH",
    faction: "environment",
    factionLabel: "장비 변수",
    unitClass: "Vehicle Cell",
    portrait: "vehicle",
    temperament: "상태형",
    specialty: "차량 정비 상태와 기동 지속성",
    traits: ["정비 제한", "기동 지속성", "차량 이탈"],
    loadout: ["군수 현황"],
    quote: "고장 차량 하나가 선두 제대의 속도를 다시 정의합니다."
  },
  network_agent: {
    callsign: "NET",
    faction: "environment",
    factionLabel: "통신 변수",
    unitClass: "Network Cell",
    portrait: "signals",
    temperament: "탐지형",
    specialty: "통신 커버리지와 중계 후보 검토",
    traits: ["통신 음영", "중계 후보", "예비 통신"],
    loadout: ["통신 지도"],
    quote: "커버리지 구멍은 경로 위에 겹칠 때 위험이 됩니다."
  },
  supply_route_agent: {
    callsign: "RTE",
    faction: "environment",
    factionLabel: "보급 변수",
    unitClass: "Supply Route Cell",
    portrait: "logistics",
    temperament: "경로형",
    specialty: "보급 대기점과 보급로 안정성",
    traits: ["보급로", "대기점", "병목"],
    loadout: ["군수 현황", "방책 비교표"],
    quote: "보급로 안정성은 이동 시간과 같은 비중으로 봐야 합니다."
  },
  evac_route_agent: {
    callsign: "EVAC",
    faction: "environment",
    factionLabel: "후송 변수",
    unitClass: "Evac Route Cell",
    portrait: "medical",
    temperament: "안전형",
    specialty: "주 후송로와 대체 후송로 검토",
    traits: ["주 후송로", "대체로", "대응 지연"],
    loadout: ["작전계획서", "기상 JSON"],
    quote: "후송로가 하나뿐이면 사고 대응 시간이 방책 전체를 흔듭니다."
  }
};

const staffRows = [
  ["적군", "A안 진입축에 지연행동 집중 가능성. 선두 제대 고립 시 지휘공백으로 전이.", "위험"],
  ["군수", "B안은 추가 대기점 없이 지속 가능. A안은 보급 대기점 1개 보강 필요.", "보완"],
  ["통신", "A안 중간 18분 음영. 예비 중계팀 선배치 없이는 권장 불가.", "경고"],
  ["기상", "새벽 안개가 속도와 후송 시간을 동시에 악화. B안의 시간 여유가 유리.", "주의"],
  ["SOP", "재판단 기준 미명시는 승인 전 보완 필요. 결심카드에 중단 조건 추가.", "필수"]
];

const debateEntries = [
  { agent: "적군", stance: "반론", text: "A안은 빠르지만 협곡 입구 지연행동을 받으면 지휘 갱신 주기가 깨집니다.", evidence: "ev_redteam_delay" },
  { agent: "통신", stance: "근거", text: "통신 커버리지 지도 기준으로 A안 2단계에 음영 구간이 겹칩니다. 예비 중계팀이 필요합니다.", evidence: "ev_comm_gap" },
  { agent: "군수", stance: "보완", text: "A안 유지 시 보급 대기점 1개 추가와 정비 시간 재배치가 선행되어야 합니다.", evidence: "ev_logistics_supply" },
  { agent: "기상", stance: "근거", text: "새벽 안개는 시정과 후송 속도를 모두 낮춥니다. B안의 우회 시간 여유가 안전합니다.", evidence: "ev_weather_fog" },
  { agent: "SOP", stance: "필수조건", text: "재판단 기준을 결심카드에 명시하지 않으면 중단/전환 승인 지연이 남습니다.", evidence: "ev_sop_criteria" },
  { agent: "심판관", stance: "합의", text: "B안을 우선 추천합니다. A안은 예비 통신, 보급 대기점, 재판단 기준 보완 시 조건부 가능.", evidence: "ev_coa_b" }
];

const rehearsalRadioScripts = {
  start: [
    { agentId: "company_commander_agent", callsign: "알파-1", tone: "blue", channel: "현장", message: "출발선 통과. 선두 제대 작전 개시, 대열 간격 정상.", finding: "진입 완료", evidence: "ev_plan_mission" },
    { agentId: "ops_staff_agent", callsign: "작전", tone: "amber", channel: "참모", message: "A/B/C 방책 동일 조건으로 시간표 계측 시작. 제한시간 기준 유지.", finding: "기준 시간 고정", evidence: "ev_plan_mission" },
    { agentId: "commander_agent", callsign: "지휘", tone: "blue", channel: "지휘망", message: "각 에이전트는 마찰 발생 즉시 근거와 조치안을 같이 보고.", finding: "리허설 통제", evidence: "ev_plan_mission" }
  ],
  fog: [
    { agentId: "weather_agent", callsign: "기상", tone: "amber", channel: "환경", message: "03:55 구간 시정 저하. 선두 평균속도 보정 필요.", finding: "새벽 안개", evidence: "ev_weather_fog" },
    { agentId: "driver_agent", callsign: "기동", tone: "amber", channel: "현장", message: "도로 경계 식별 지연. 차량 피로도와 야간 집중도 저하로 진입 속도 낮춤.", finding: "피로도 지연", evidence: "ev_weather_fog" },
    { agentId: "medical_staff_agent", callsign: "의무", tone: "red", channel: "지원", message: "후송 예상시간 증가. 대체 후송로 개방 조건을 앞당겨야 함.", finding: "후송 위험", evidence: "ev_evac_route" }
  ],
  enemy_delay: [
    { agentId: "enemy_force_agent", callsign: "대항군", tone: "red", channel: "위협", message: "협곡 입구 차단 성공 가능. 선두 제대가 1차 병목에서 정체됨.", finding: "적 지연행동", evidence: "ev_redteam_delay" },
    { agentId: "red_team_agent", callsign: "레드팀", tone: "red", channel: "검증", message: "A안은 빠르지만 예측 가능성이 높음. 교차로 지연이 지휘공백으로 전이됩니다.", finding: "허점 확인", evidence: "ev_redteam_delay" },
    { agentId: "company_commander_agent", callsign: "알파-1", tone: "amber", channel: "현장", message: "선두 제대 일시 감속. 우회 또는 엄호 기준 없으면 대기 시간 증가.", finding: "진입 지연", evidence: "ev_redteam_delay" }
  ],
  comm_gap: [
    { agentId: "radio_operator_agent", callsign: "무전", tone: "red", channel: "통신", message: "A안 2단계 음영 진입. 1개 보고주기 누락, 예비망 전환 필요.", finding: "통신장애", evidence: "ev_comm_gap" },
    { agentId: "network_agent", callsign: "통신망", tone: "red", channel: "통신", message: "C1/C2 중계팀 미선배치 시 지휘소 갱신 지연이 18분까지 확대.", finding: "음영 확대", evidence: "ev_comm_gap" },
    { agentId: "squad_leader_agent", callsign: "분대", tone: "amber", channel: "현장", message: "명령 갱신 수신 불안정. 현장 유지 절차와 대체 승인권자 필요.", finding: "명령 공백", evidence: "ev_sop_criteria" }
  ],
  supply_gap: [
    { agentId: "supply_soldier_agent", callsign: "보급", tone: "amber", channel: "군수", message: "보급 대기점 처리량 초과. 연료 보충 대기열 발생.", finding: "보급 병목", evidence: "ev_logistics_supply" },
    { agentId: "maintenance_agent", callsign: "정비", tone: "amber", channel: "군수", message: "정비 가능 시간 35분 제한. 통신차량 우선순위 고정 필요.", finding: "정비 제한", evidence: "ev_logistics_supply" },
    { agentId: "logistics_staff_agent", callsign: "군수참모", tone: "blue", channel: "참모", message: "보급 대기점 1개 추가 없이는 A안 지속성 저하가 누적됩니다.", finding: "보완 요구", evidence: "ev_logistics_supply" }
  ],
  criteria_gap: [
    { agentId: "sop_agent", callsign: "SOP", tone: "red", channel: "검증", message: "중단·전환 기준이 현재 시간표와 연결되지 않음. 승인 지연 위험.", finding: "기준 공백", evidence: "ev_sop_criteria" },
    { agentId: "platoon_leader_agent", callsign: "소대", tone: "amber", channel: "현장", message: "전환 승인 미수신. 현장 제대 대기 상태로 묶임.", finding: "현장 대기", evidence: "ev_sop_criteria" },
    { agentId: "reserve_leader_agent", callsign: "예비대", tone: "amber", channel: "예비", message: "04:20 전 투입 기준이 없으면 예비대가 타이밍을 놓칩니다.", finding: "투입 조건 미정", evidence: "ev_sop_criteria" }
  ],
  reserve_delay: [
    { agentId: "ops_staff_agent", callsign: "작전", tone: "red", channel: "참모", message: "예비대 투입 판단 지연. 지휘공백과 지속성 저하가 동시에 상승.", finding: "복합 실패", evidence: "ev_sop_criteria" },
    { agentId: "commander_agent", callsign: "지휘", tone: "red", channel: "지휘망", message: "A안 조건부 시행은 보류. 예비망, 보급, 재판단 기준 보완 전 권장 불가.", finding: "결심 보류", evidence: "ev_comm_gap" },
    { agentId: "judge_agent", callsign: "심판", tone: "blue", channel: "검증", message: "근거 없는 낙관 판단 삭제. 실패경로는 지휘공백 우선으로 잠금.", finding: "근거 잠금", evidence: "ev_redteam_delay" }
  ],
  b_stabilized: [
    { agentId: "judge_agent", callsign: "심판", tone: "blue", channel: "검증", message: "B안은 통신 갱신과 보급 접근성이 유지됩니다.", finding: "안정성 확인", evidence: "ev_coa_b" },
    { agentId: "comm_staff_agent", callsign: "통신참모", tone: "blue", channel: "참모", message: "B안 우회축은 음영 시간이 짧아 예비망 없이도 보고 주기 유지 가능.", finding: "통신 안정", evidence: "ev_coa_b" },
    { agentId: "logistics_staff_agent", callsign: "군수참모", tone: "blue", channel: "참모", message: "보급 대기점 접근성이 유지됩니다. B안 우선 추천에 동의.", finding: "합의", evidence: "ev_coa_b" }
  ]
};

const stageMeta = {
  data: { phase: "자료 투입", alert: "작전계획 접수" },
  ontology: { phase: "그래프 구축", alert: "근거 연결" },
  agents: { phase: "가상부대 생성", alert: "23개 역할" },
  rehearsal: { phase: "수행 리허설", alert: "시간순 이벤트" },
  risk: { phase: "실패경로", alert: "TOP 4" },
  decision: { phase: "결심카드", alert: "B안 우선" },
  briefing: { phase: "브리핑 모드", alert: "심사 대응" },
  aar: { phase: "AAR 개선안", alert: "후속조치" },
  audit: { phase: "감사 로그", alert: "검증 완료" },
  submit: { phase: "제출 패키지", alert: "최종 묶음" },
  retrain: { phase: "재훈련 계획", alert: "72시간 계획" },
  handoff: { phase: "인수인계 센터", alert: "패킷 전달" },
  metrics: { phase: "운영 지표", alert: "상태 추적" },
  watch: { phase: "상황 감시", alert: "재판단 트리거" },
  log: { phase: "상황 일지", alert: "보고 기록" },
  challenge: { phase: "반증 검증", alert: "가정 재검토" },
  queue: { phase: "조치 큐", alert: "우선순위" },
  forecast: { phase: "준비 예측", alert: "24h 전망" },
  broadcast: { phase: "전파 패키지", alert: "수신 확인" },
  receipt: { phase: "수신 확인", alert: "미확인 추적" },
  closeout: { phase: "종결 보고", alert: "기록 잠금" },
  lessons: { phase: "교훈 라이브러리", alert: "재사용 준비" },
  nextop: { phase: "다음 작전 템플릿", alert: "작전 시드" },
  prefill: { phase: "초기 접수 프리필", alert: "접수값 잠금" }
};

const primaryStageRail = ["data", "ontology", "agents", "rehearsal", "risk", "decision"];

const stageTransitionCopy = {
  data: {
    kicker: "INTAKE PIPELINE",
    title: "작전 자료 구조화",
    detail: "문서 해시, 임무 필드, 방책 표를 시연용 데이터 패킷으로 정규화합니다.",
    steps: ["원천 문서 수신", "임무/제약 추출", "방책 비교표 정규화"]
  },
  ontology: {
    kicker: "SEMANTIC GRAPH",
    title: "온톨로지 관계 생성",
    detail: "문서, 방책, 위험, 결심 노드를 연결하고 근거 체인의 신뢰도를 계산합니다.",
    steps: ["노드 타입 분류", "관계 엣지 생성", "결심 경로 잠금"]
  },
  agents: {
    kicker: "VIRTUAL UNIT",
    title: "가상부대 역할 매핑",
    detail: "참모, 현장 제대, 대항군, 환경 에이전트를 작전 쟁점에 배치합니다.",
    steps: ["역할 카드 로드", "쟁점별 책임 할당", "토론 채널 개방"]
  },
  rehearsal: {
    kicker: "MISSION REHEARSAL",
    title: "수행 리허설 동기화",
    detail: "시간순 이벤트와 3D 지형, 포격·기동 시각화를 같은 타임라인에 연결합니다.",
    steps: ["이벤트 타임라인 장전", "지형 좌표 동기화", "전술 액션 재생 준비"]
  },
  risk: {
    kicker: "FAILURE PATH",
    title: "실패경로 압축",
    detail: "마찰 이벤트를 지휘공백, 지속성, 사고 대응, 재판단 경로로 묶습니다.",
    steps: ["위험 신호 수집", "인과 사슬 정렬", "차단 조치 우선순위화"]
  },
  decision: {
    kicker: "COMMAND CARD",
    title: "결심카드 패키징",
    detail: "추천 방책, 시행 조건, 근거 테이블을 지휘관 확인 양식으로 잠급니다.",
    steps: ["추천 방책 검증", "승인 조건 결합", "브리핑 패킷 생성"]
  },
  briefing: {
    kicker: "LIVE BRIEFING",
    title: "심사 브리핑 구성",
    detail: "시연 흐름, 예상 질문, 직접 근거를 한 화면에서 발표 순서로 정리합니다.",
    steps: ["브리핑 런웨이 정렬", "심사 질문 매핑", "근거 잠금 확인"]
  },
  aar: {
    kicker: "AFTER ACTION REVIEW",
    title: "AAR 개선안 생성",
    detail: "리허설 마찰, 실패경로, 결심 조건을 책임자와 기한이 있는 보완 과제로 변환합니다.",
    steps: ["마찰 이벤트 회수", "책임자 배정", "보완 패킷 잠금"]
  },
  audit: {
    kicker: "AUDIT LOGBOOK",
    title: "검증 로그 작성",
    detail: "자료 접수부터 AAR 보완 조치까지 근거, 공백, 책임자를 하나의 검증 장부로 묶습니다.",
    steps: ["판단 이벤트 회수", "근거 원장 대조", "검증 공백 표시"]
  },
  submit: {
    kicker: "SUBMISSION PACKAGE",
    title: "최종 제출 패키지 잠금",
    detail: "브리핑, 결심카드, AAR, 감사 로그를 제출 가능한 산출물 묶음으로 정리합니다.",
    steps: ["준비도 점검", "산출물 묶음", "매니페스트 생성"]
  },
  retrain: {
    kicker: "RETRAINING PLAN",
    title: "72시간 재훈련 계획",
    detail: "AAR 조치와 감사 공백을 담당자별 훈련 과제, 검증 게이트, 일정으로 다시 묶습니다.",
    steps: ["AAR 조치 회수", "담당자별 훈련 편성", "검증 게이트 잠금"]
  },
  handoff: {
    kicker: "HANDOFF CENTER",
    title: "인수인계 패킷 생성",
    detail: "결심카드, 제출 묶음, 재훈련 과제를 다음 운용자가 받을 수 있는 수신자별 패킷으로 정리합니다.",
    steps: ["수신자 분류", "교신 문안 생성", "확인 체크 잠금"]
  },
  metrics: {
    kicker: "OPERATIONS METRICS",
    title: "운영 지표판 갱신",
    detail: "위험 감소, 근거 부채, 재훈련 진행, 인수인계 완료율을 한 화면에서 추적합니다.",
    steps: ["위험 추세 계산", "근거 부채 집계", "24시간 리듬 생성"]
  },
  watch: {
    kicker: "DECISION WATCH",
    title: "재판단 감시 시작",
    detail: "결심 이후 현장에서 확인해야 할 트리거, 전파 문안, 즉시 조치 경로를 감시 화면으로 묶습니다.",
    steps: ["트리거 기준 정렬", "경고 신호 매핑", "전파 문안 생성"]
  },
  log: {
    kicker: "OPERATIONS LOG",
    title: "상황 일지 기록",
    detail: "감시 트리거와 전파 문안을 교대 가능한 보고 기록, 확인 상태, 다음 조치로 남깁니다.",
    steps: ["보고 타임라인 생성", "확인 상태 정렬", "교대 기록 패킷화"]
  },
  challenge: {
    kicker: "CHALLENGE REVIEW",
    title: "결심 반증 검증",
    detail: "최종 결심의 핵심 가정, 반대 신호, 확인 조치를 한 화면에서 다시 점검합니다.",
    steps: ["핵심 가정 추출", "반증 신호 대조", "검증 조치 잠금"]
  },
  queue: {
    kicker: "ACTION QUEUE",
    title: "남은 조치 우선순위화",
    detail: "AAR, 재훈련, 감시, 반증 검증에서 열린 일을 담당자별 실행 큐로 묶습니다.",
    steps: ["열린 조치 수집", "담당자 부하 계산", "완료 게이트 정렬"]
  },
  forecast: {
    kicker: "READINESS FORECAST",
    title: "운용 준비도 예측",
    detail: "조치 큐 처리 속도별 24~72시간 준비도, 잔여 위험, 병목 변화를 계산합니다.",
    steps: ["큐 영향 산정", "시나리오 곡선 생성", "병목 게이트 표시"]
  },
  broadcast: {
    kicker: "BROADCAST PACKAGE",
    title: "수신자별 전파 문안 생성",
    detail: "준비 예측과 조치 큐를 지휘관, 참모, 검증관이 바로 확인할 전파 패킷으로 변환합니다.",
    steps: ["수신자 우선순위 정렬", "문안·근거 결합", "확인 게이트 잠금"]
  },
  receipt: {
    kicker: "RECEIPT TRACKER",
    title: "수신 확인과 재전파 추적",
    detail: "전파 패키지가 실제 수신됐는지 확인하고 미확인 대상의 재전파 조치를 잠급니다.",
    steps: ["수신 상태 집계", "미확인 대상 분리", "재전파 게이트 잠금"]
  },
  closeout: {
    kicker: "CLOSEOUT REPORT",
    title: "종결 보고와 보관 잠금",
    detail: "결심, 수신 확인, 예외 처리, 보관 산출물을 다음 운용자가 확인할 종결 보고로 잠급니다.",
    steps: ["최종 판단 요약", "예외 책임 확인", "보관 산출물 잠금"]
  },
  lessons: {
    kicker: "LESSONS LIBRARY",
    title: "재사용 교훈 패턴화",
    detail: "종결 보고의 판단, 예외, 보관 산출물을 다음 작전에서 바로 쓰는 체크와 패턴으로 바꿉니다.",
    steps: ["반복 패턴 추출", "재사용 체크 잠금", "교훈 패킷 저장"]
  },
  nextop: {
    kicker: "NEXT OP TEMPLATE",
    title: "다음 작전 접수 템플릿 생성",
    detail: "교훈 라이브러리의 패턴과 체크를 다음 작전에서 바로 시작할 입력 템플릿으로 변환합니다.",
    steps: ["작전 시드 생성", "초기 제약 잠금", "접수 패킷 저장"]
  },
  prefill: {
    kicker: "INTAKE PREFILL",
    title: "초기 접수값 프리필",
    detail: "다음 작전 템플릿을 자료 접수 화면의 사전 입력값, 자료 매니페스트, 확인 게이트로 되돌립니다.",
    steps: ["자료 매니페스트 구성", "접수 필드 채움", "초기 게이트 잠금"]
  }
};

const REHEARSAL_EVENT_DURATION_MS = 4200;
const REHEARSAL_SPEED_STEPS = [1, 2, 4];

const state = {
  scenarioLoaded: false,
  agentsGenerated: false,
  rehearsalStarted: false,
  currentStage: "data",
  graphMode: "all",
  selectedNodeId: "decision",
  generatedAgentCount: 0,
  rehearsalIndex: -1,
  rehearsalTimer: null,
  rehearsalPaused: false,
  rehearsalSpeed: 1,
  rehearsalEventElapsedMs: 0,
  rehearsalEventStartedAt: 0,
  autoTimer: null,
  transitionTimer: null,
  stageTransitioning: false,
  compareLlm: false,
  demoRemaining: 210,
  selectedAgentId: "red_team_agent",
  agentFilter: "all",
  selectedFailureId: "command_gap",
  selectedEvidenceId: "ev_comm_gap",
  focusMode: false,
  presenterMode: false,
  selectedBriefingStepId: "decision",
  selectedBriefingQuestionId: "why-b",
  selectedAarActionId: "aar-command_gap-0",
  selectedAuditItemId: "audit-decision",
  selectedSubmitBundleId: "submit-briefing",
  selectedRetrainItemId: "retrain-command_gap-0",
  selectedHandoffRecipientId: "handoff-commander",
  selectedMetricId: "metric-readiness",
  selectedWatchItemId: "watch-command_gap",
  selectedLogItemId: "log-command_gap",
  selectedChallengeItemId: "challenge-command_gap",
  selectedQueueItemId: "queue-challenge-command_gap",
  selectedForecastScenarioId: "forecast-paced",
  selectedBroadcastRecipientId: "broadcast-commander",
  selectedReceiptItemId: "receipt-broadcast-commander",
  selectedCloseoutItemId: "closeout-final",
  selectedLessonItemId: "lesson-command-gap",
  selectedNextOpItemId: "nextop-seed-comms",
  selectedPrefillItemId: "prefill-field-mission",
  lastRehearsalRiskEventId: null,
  decisionConditionState: {
    comms: true,
    logistics: true,
    rejudge: true,
    evac: true
  },
  agentConversationTab: "live",
  radioLog: [],
  radioTimers: [],
  radioSerial: 0,
  routeSyncReady: false
};

function qs(selector) {
  return document.querySelector(selector);
}

function byId(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clearTimer(timerName) {
  if (state[timerName]) {
    window.clearTimeout(state[timerName]);
    state[timerName] = null;
  }
}

function setText(id, text) {
  const target = byId(id);
  if (target) target.textContent = text;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function waitForStageTransitionPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(resolve);
    });
  });
}

function getRehearsalNow() {
  return window.performance?.now?.() || Date.now();
}

function resetRehearsalEventClock() {
  state.rehearsalEventElapsedMs = 0;
  state.rehearsalEventStartedAt = getRehearsalNow();
}

function getRehearsalEventProgress() {
  if (state.rehearsalIndex < 0) return 0;
  const runningWallTime = !state.rehearsalPaused && state.rehearsalEventStartedAt
    ? (getRehearsalNow() - state.rehearsalEventStartedAt) * state.rehearsalSpeed
    : 0;
  return clamp(state.rehearsalEventElapsedMs + runningWallTime, 0, REHEARSAL_EVENT_DURATION_MS);
}

function captureRehearsalEventProgress() {
  state.rehearsalEventElapsedMs = getRehearsalEventProgress();
  state.rehearsalEventStartedAt = getRehearsalNow();
}

function getRehearsalEventDelay() {
  const remaining = Math.max(0, REHEARSAL_EVENT_DURATION_MS - getRehearsalEventProgress());
  return Math.max(90, Math.round(remaining / Math.max(0.5, state.rehearsalSpeed)));
}

function renderRehearsalSpeedControls() {
  const label = `속도 ${state.rehearsalSpeed}x`;
  setText("rehearsalSpeedButton", label);
  setText("rehearsalMapSpeedButton", `${state.rehearsalSpeed}x`);
  byId("rehearsalMapSpeedButton")?.setAttribute("title", `리허설 배속 ${state.rehearsalSpeed}x`);
}

function getNextRehearsalSpeed() {
  const currentIndex = REHEARSAL_SPEED_STEPS.indexOf(state.rehearsalSpeed);
  return REHEARSAL_SPEED_STEPS[(currentIndex + 1) % REHEARSAL_SPEED_STEPS.length] || REHEARSAL_SPEED_STEPS[0];
}

function setRehearsalSpeed(speed) {
  if (state.rehearsalStarted && !state.rehearsalPaused) captureRehearsalEventProgress();
  state.rehearsalSpeed = REHEARSAL_SPEED_STEPS.includes(speed) ? speed : 1;
  renderRehearsalSpeedControls();
  window.WarGround3D?.setSpeed?.(state.rehearsalSpeed);
  if (state.rehearsalStarted && !state.rehearsalPaused) scheduleNextEvent();
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function riskLabel(value) {
  const labels = {
    high: "높음",
    medium: "중간",
    low: "낮음"
  };
  return labels[value] || value;
}

function refreshIcons() {
  window.lucide?.createIcons?.();
}

function getStageTransitionCopy(stage, overrides = {}) {
  const base = stageTransitionCopy[stage] || stageTransitionCopy.data;
  return {
    ...base,
    ...overrides,
    steps: overrides.steps || base.steps,
    stage
  };
}

function renderStageTransitionOverlay(stage, overrides = {}) {
  const overlay = byId("stageTransitionOverlay");
  if (!overlay) return null;
  const copy = getStageTransitionCopy(stage, overrides);
  overlay.dataset.transitionStage = stage;
  overlay.innerHTML = `
    <section class="stage-transition-panel">
      <div class="stage-loader-ring" aria-hidden="true"><span></span><i></i></div>
      <div class="stage-transition-copy">
        <span>${copy.kicker}</span>
        <h2>${copy.title}</h2>
        <p>${copy.detail}</p>
      </div>
      <div class="stage-loader-steps" aria-label="처리 단계">
        ${copy.steps
          .map(
            (step, index) => `
              <article class="stage-loader-step ${index === 1 ? "is-running" : ""}" data-transition-step="${index + 1}">
                <b>${String(index + 1).padStart(2, "0")}</b>
                <span>${step}</span>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
  return overlay;
}

function beginStageTransition(stage, overrides = {}) {
  clearTimer("transitionTimer");
  const overlay = renderStageTransitionOverlay(stage, overrides);
  if (!overlay) return;
  const wasVisible = !overlay.hidden && overlay.classList.contains("is-active");
  overlay.hidden = false;
  overlay.classList.add("stage-transition-overlay");
  overlay.classList.remove("is-leaving");
  if (!wasVisible) {
    overlay.classList.remove("is-active");
    void overlay.offsetWidth;
  }
  overlay.classList.add("is-active");
  document.body.classList.add("is-stage-transitioning");
  if (overrides.autoComplete !== false) {
    const duration = overrides.duration || 720;
    state.transitionTimer = window.setTimeout(() => completeStageTransition(stage), duration);
  }
}

function completeStageTransition(stage = state.currentStage) {
  clearTimer("transitionTimer");
  const overlay = byId("stageTransitionOverlay");
  if (!overlay) return;
  overlay.dataset.transitionStage = stage;
  overlay.classList.remove("is-active");
  overlay.classList.add("is-leaving");
  window.setTimeout(() => {
    if (!overlay.classList.contains("is-active")) {
      overlay.hidden = true;
      overlay.classList.remove("is-leaving");
      document.body.classList.remove("is-stage-transitioning");
    }
  }, 220);
}

function getAgentPersonIcon(profile) {
  const iconByPortrait = {
    commander: "user-round",
    staff: "user-cog",
    logistics: "user-check",
    signals: "user-round-cog",
    medical: "user-round-check",
    judge: "user-check",
    opfor: "shield-user",
    enemy: "shield-alert",
    field: "user-round",
    vehicle: "user-round-cog",
    reserve: "user-round-plus",
    weather: "user-round-search",
    terrain: "user-round-search"
  };
  const iconByFaction = {
    blue: "user-round",
    opfor: "shield-user",
    environment: "user-round-search",
    control: "user-check"
  };
  return iconByPortrait[profile.portrait] || iconByFaction[profile.faction] || "user-round";
}

function renderAgentPortrait(profile, sizeClass = "") {
  const className = ["agent-portrait", sizeClass, `portrait-${profile.portrait}`].filter(Boolean).join(" ");
  const iconName = profile.personIcon || getAgentPersonIcon(profile);
  return `
    <span class="${className}" aria-hidden="true">
      <i data-lucide="${iconName}"></i>
      <b>${profile.callsign}</b>
    </span>
  `;
}

function renderInfoTileItems(items) {
  return items
    .map(
      (item) => `
        <article class="hud-tile ${item.tone ? `is-${item.tone}` : ""}">
          <span>${item.label}</span>
          <b>${item.value}</b>
          <em>${item.detail}</em>
        </article>
      `
    )
    .join("");
}

function renderInfoTiles(className, items, ariaLabel = "") {
  const label = ariaLabel ? ` aria-label="${ariaLabel}"` : "";
  return `<div class="${className}"${label}>${renderInfoTileItems(items)}</div>`;
}

function renderActionList(className, items, { title = "", ariaLabel = "", ordered = false } = {}) {
  const listTag = ordered ? "ol" : "ul";
  const label = ariaLabel ? ` aria-label="${ariaLabel}"` : "";
  const heading = title ? `<b>${title}</b>` : "";
  return `
    <div class="${className} hud-action-list"${label}>
      ${heading}
      <${listTag}>${items.map((item) => `<li>${item}</li>`).join("")}</${listTag}>
    </div>
  `;
}

function getGraphModeLabel(mode) {
  const labels = {
    all: "전체",
    evidence: "근거",
    debate: "토론",
    failure: "실패경로",
    decision: "결심"
  };
  return labels[mode] || mode;
}

function getPageBriefingItems(page) {
  if (page === "prefill") {
    const overviewItems = getPrefillOverviewItems();
    const manifests = getPrefillManifestItems();
    const fields = getPrefillFieldItems();
    const gates = getPrefillGateItems();
    return [
      { label: "프리필 준비", value: `${getPrefillReadinessScore(overviewItems, manifests, fields, gates)}%`, detail: "자료·필드·게이트", tone: "primary" },
      { label: "자료 매니페스트", value: `${manifests.filter((item) => item.ready).length}/${manifests.length}`, detail: "접수 전 준비 파일", tone: "evidence" },
      { label: "접수 필드", value: `${fields.filter((item) => item.ready).length}/${fields.length}`, detail: "사전 입력값", tone: "support" },
      { label: "초기 게이트", value: `${gates.filter((item) => item.ready).length}/${gates.length}`, detail: "첫 판단 잠금", tone: "primary" }
    ];
  }
  if (page === "nextop") {
    const summaryItems = getNextOperationSummaryItems();
    const seedItems = getNextOperationSeedItems();
    const constraints = getNextOperationConstraintItems();
    const packets = getNextOperationPacketItems();
    return [
      { label: "템플릿 준비", value: `${getNextOperationReadinessScore(summaryItems, seedItems, constraints, packets)}%`, detail: "시드·제약·패킷", tone: "primary" },
      { label: "작전 시드", value: `${seedItems.filter((item) => item.ready).length}/${seedItems.length}`, detail: "접수 전 채울 핵심값", tone: "evidence" },
      { label: "초기 제약", value: `${constraints.filter((item) => item.ready).length}/${constraints.length}`, detail: "첫 검토 기준", tone: "support" },
      { label: "템플릿 패킷", value: `${packets.length}개`, detail: "다음 작전 산출물", tone: "primary" }
    ];
  }
  if (page === "lessons") {
    const summaryItems = getLessonSummaryItems();
    const patterns = getLessonPatternItems();
    const checks = getLessonChecklistItems();
    const archives = getLessonArchiveItems();
    return [
      { label: "교훈 준비", value: `${getLessonReadinessScore(summaryItems, patterns, checks, archives)}%`, detail: "패턴·체크·보관", tone: "primary" },
      { label: "판단 패턴", value: `${patterns.length}개`, detail: "재사용 가능한 조건", tone: "evidence" },
      { label: "재사용 체크", value: `${checks.filter((item) => item.ready).length}/${checks.length}`, detail: "다음 작전 적용 조건", tone: "support" },
      { label: "보관 패킷", value: `${archives.length}개`, detail: "교훈 산출물", tone: "primary" }
    ];
  }
  if (page === "closeout") {
    const summaryItems = getCloseoutSummaryItems();
    const exceptions = getCloseoutExceptionItems();
    const archives = getCloseoutArchiveItems();
    return [
      { label: "종결 준비", value: `${getCloseoutReadinessScore(summaryItems, exceptions, archives)}%`, detail: "결심·수신·예외·보관", tone: "primary" },
      { label: "잠금 항목", value: `${summaryItems.filter((item) => item.ready).length}/${summaryItems.length}`, detail: "종결 조건 충족", tone: "evidence" },
      { label: "예외 처리", value: `${exceptions.filter((item) => !item.ready).length}건`, detail: "후속 책임 필요", tone: "danger" },
      { label: "보관 산출물", value: `${archives.length}개`, detail: "제출·감사·수신 기록", tone: "support" }
    ];
  }
  if (page === "data") {
    const plan = demoData.operationPlan;
    return [
      { label: "입력 패키지", value: state.scenarioLoaded ? `${plan.documents.length}종` : "0종", detail: state.scenarioLoaded ? "작전 자료 접수 완료" : "접수된 자료 없음", tone: state.scenarioLoaded ? "support" : "" },
      { label: "추출 상태", value: state.scenarioLoaded ? plan.operation_name : "대기", detail: state.scenarioLoaded ? `${plan.start_time}-${plan.deadline}` : "임무, 시간, 제한사항 자동 채움" },
      { label: "방책 후보", value: state.scenarioLoaded ? `${demoData.coas.length}개안` : "잠김", detail: state.scenarioLoaded ? "A/B/C 시간·통신·군수 비교" : "자료 접수 후 생성" },
      { label: "다음 조치", value: state.scenarioLoaded ? "가상부대 생성" : "작전계획 접수", detail: state.scenarioLoaded ? "역할별 검토 셀을 생성합니다." : "상단 실행 버튼으로 시작합니다.", tone: state.scenarioLoaded ? "primary" : "evidence" }
    ];
  }

  const plan = demoData.operationPlan;
  const selectedNode = graph.nodeMap.get(state.selectedNodeId);
  const selectedAgent = getAgentById(state.selectedAgentId) || demoData.agents[0];
  const selectedAgentProfile = selectedAgent ? getAgentProfile(selectedAgent) : null;
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const selectedFailure = getFailureById(state.selectedFailureId);
  const selectedFailureProfile = getFailureProfile(selectedFailure);
  const decisionSummary = getDecisionFailureSummary();
  const generatedPercent = demoData.agents.length ? Math.round((state.generatedAgentCount / demoData.agents.length) * 100) : 0;

  const pageItems = {
    data: [
      { label: "입력 패키지", value: state.scenarioLoaded ? `${plan.documents.length}종` : "0종", detail: state.scenarioLoaded ? "작전 자료 접수 완료" : "접수된 자료 없음", tone: state.scenarioLoaded ? "support" : "" },
      { label: "추출 상태", value: state.scenarioLoaded ? plan.operation_name : "대기", detail: state.scenarioLoaded ? `${plan.start_time}-${plan.deadline}` : "임무, 시간, 제한사항 자동 채움" },
      { label: "방책 후보", value: state.scenarioLoaded ? `${demoData.coas.length}개안` : "잠김", detail: state.scenarioLoaded ? "A/B/C 시간·통신·군수 비교" : "자료 접수 후 생성" },
      { label: "다음 조치", value: state.scenarioLoaded ? "가상부대 생성" : "작전계획 접수", detail: state.scenarioLoaded ? "역할별 검토 셀을 생성합니다." : "상단 실행 버튼으로 시작합니다.", tone: state.scenarioLoaded ? "primary" : "evidence" }
    ],
    ontology: [
      { label: "그래프 규모", value: `${graph.nodes.length}/${graph.edges.length}`, detail: "노드 / 관계" },
      { label: "현재 필터", value: getGraphModeLabel(state.graphMode), detail: "관계선을 목적별로 압축" },
      { label: "선택 노드", value: selectedNode?.label || "결심카드", detail: selectedNode?.meta || "DECISION", tone: "evidence" },
      { label: "연결 근거", value: `${(selectedNode?.evidence_ids || demoData.decision.evidence_ids).length}건`, detail: "오른쪽 인스펙터에서 확인" }
    ],
    agents: [
      { label: "생성률", value: `${generatedPercent}%`, detail: `${state.generatedAgentCount}/${demoData.agents.length} 역할 준비`, tone: state.agentsGenerated ? "support" : "" },
      { label: "선택 유닛", value: selectedAgentProfile?.callsign || "RED", detail: selectedAgent?.name || "레드팀 에이전트" },
      { label: "검토 초점", value: selectedAgent?.risk_focus?.[0] || "위험", detail: selectedAgent?.review_output || "역할별 산출물" },
      { label: "다음 조치", value: state.agentsGenerated ? "리허설 실행" : "가상부대 생성", detail: state.agentsGenerated ? "시간순 마찰을 재생합니다." : "23개 역할을 준비합니다.", tone: state.agentsGenerated ? "primary" : "evidence" }
    ],
    rehearsal: [
      { label: "현재 이벤트", value: activeEvent ? activeEvent.time : "대기", detail: activeEvent?.event || "수행 리허설 실행 필요" },
      { label: "위험 수준", value: activeEvent ? riskLabel(activeEvent.severity) : "대기", detail: activeEvent?.impact || "이벤트별 영향 표시", tone: activeEvent?.severity === "high" ? "danger" : "" },
      { label: "활성 에이전트", value: `${activeEvent?.agents?.length || 0}명`, detail: activeEvent?.agents?.slice(0, 2).join(", ") || "관련 역할 점등" },
      { label: "다음 조치", value: state.rehearsalStarted ? "실패경로 확인" : "리허설 시작", detail: state.rehearsalStarted ? "위험 체인으로 전환합니다." : "3D 지형에서 실행합니다.", tone: state.rehearsalStarted ? "primary" : "evidence" }
    ],
    risk: [
      { label: "우선 흐름", value: `${selectedFailure.title} ${selectedFailure.score}`, detail: selectedFailureProfile.severity, tone: "danger" },
      { label: "막을 지점", value: selectedFailureProfile.decisionPoint, detail: selectedFailureProfile.timeWindow },
      { label: "직접 근거", value: `${selectedFailure.evidence.length}건`, detail: `${selectedFailureProfile.evidenceItems.length}개 출처 연결` },
      { label: "즉시 조치", value: selectedFailureProfile.mitigationActions[0], detail: "결심카드 반영 대상", tone: "primary" }
    ],
    decision: [
      { label: "추천 방책", value: demoData.decision.recommended_coa, detail: demoData.decision.conditional_coa, tone: "primary" },
      { label: "시행 조건", value: `${getDecisionConditions().length}개`, detail: "통신·군수·재판단·후송" },
      { label: "근거 잠금", value: `${demoData.decision.evidence_ids.length}/${decisionSummary.evidenceTotal}`, detail: "직접 근거 / 전체 근거", tone: "evidence" },
      { label: "승인 상태", value: "지휘관 검토", detail: demoData.decision.command_authority_notice, tone: "support" }
    ],
    retrain: [
      { label: "72시간 재훈련", value: `${getRetrainingScheduleItems().length}개`, detail: "AAR 조치를 일정으로 변환", tone: "primary" },
      { label: "담당자", value: `${getRetrainingOwnerLoads().length}개 축`, detail: "훈련 과제별 책임 분산" },
      { label: "검증 게이트", value: `${getRetrainingValidationGates().filter((item) => item.ready).length}/${getRetrainingValidationGates().length}`, detail: "재훈련 전 확인 조건", tone: "evidence" },
      { label: "연결 근거", value: `${new Set(getRetrainingScheduleItems().map((item) => item.evidenceId).filter(Boolean)).size}건`, detail: "훈련 과제별 직접 근거" }
    ],
    handoff: [
      { label: "인수인계 패킷", value: `${getHandoffRecipientItems().length}명`, detail: "수신자별 인계 묶음", tone: "primary" },
      { label: "확인 체크", value: `${getHandoffChecklistItems().filter((item) => item.ready).length}/${getHandoffChecklistItems().length}`, detail: "다음 운용 전 확인" },
      { label: "교신 문안", value: `${getHandoffSignalItems().length}건`, detail: "무전/브리핑용 문장", tone: "evidence" },
      { label: "연결 산출물", value: `${getSubmissionBundleItems().length}개`, detail: "제출 묶음과 재훈련 계획" }
    ],
    metrics: [
      { label: "운영 지표판", value: `${getOperationsMetricItems().length}개`, detail: "인수인계 이후 핵심 KPI", tone: "primary" },
      { label: "위험 추세", value: `${getOperationsRiskTrend()[0]?.before || 0}→${getOperationsRiskTrend()[0]?.after || 0}`, detail: "상위 실패경로 감소" },
      { label: "근거 부채", value: `${getOperationsEvidenceDebt().length}건`, detail: "추가 확인 필요 근거", tone: "evidence" },
      { label: "운영 리듬", value: `${getOperationsCadenceItems().length}개`, detail: "다음 24시간 확인 주기" }
    ],
    watch: [
      { label: "재판단 감시", value: `${getDecisionWatchItems().length}개`, detail: "현장 트리거 기준", tone: "primary" },
      { label: "고위험 신호", value: `${getDecisionWatchItems().filter((item) => item.level === "critical").length}건`, detail: "즉시 보고 대상", tone: "danger" },
      { label: "전파 문안", value: `${getWatchSignalItems().length}건`, detail: "무전·브리핑 문장", tone: "evidence" },
      { label: "조치 경로", value: `${getWatchEscalationItems().length}개`, detail: "화면 이동과 책임자" }
    ],
    log: [
      { label: "상황 일지", value: `${getOperationsLogItems().length}건`, detail: "감시 보고 기록", tone: "primary" },
      { label: "확인 기록", value: `${getLogAcknowledgementItems().filter((item) => item.done).length}/${getLogAcknowledgementItems().length}`, detail: "교대 전 확인 상태", tone: "evidence" },
      { label: "미확인", value: `${getOperationsLogItems().filter((item) => item.status !== "확인").length}건`, detail: "추적 필요 보고", tone: "danger" },
      { label: "인계 묶음", value: `${getLogReportPacket().handoff_refs.length}개`, detail: "다음 운용자 참조" }
    ],
    challenge: [
      { label: "반증 검증", value: `${getChallengeAssumptionItems().length}개`, detail: "핵심 가정 재검토", tone: "primary" },
      { label: "위험 가정", value: `${getChallengeAssumptionItems().filter((item) => item.tone === "danger").length}개`, detail: "즉시 확인 필요", tone: "danger" },
      { label: "반증 신호", value: `${getChallengeCounterItems().length}건`, detail: "가정별 반대 근거", tone: "evidence" },
      { label: "검증 준비", value: `${getChallengeReadinessScore()}%`, detail: "조치·근거·책임 연결" }
    ],
    queue: [
      { label: "조치 큐", value: `${getActionQueueItems().length}건`, detail: "열린 실행 항목", tone: "primary" },
      { label: "긴급", value: `${getActionQueueItems().filter((item) => item.priority === "urgent").length}건`, detail: "우선 실행", tone: "danger" },
      { label: "담당자", value: `${getActionQueueOwnerItems().length}명`, detail: "부하 분산" },
      { label: "완료 기준", value: `${getActionQueueGateItems().filter((item) => item.ready).length}/${getActionQueueGateItems().length}`, detail: "닫힘 조건", tone: "evidence" }
    ],
    forecast: [
      { label: "준비 예측", value: `${getReadinessForecastScore()}%`, detail: "선택 시나리오 전망", tone: "primary" },
      { label: "시나리오", value: `${getForecastScenarioItems().length}개`, detail: "지연/기준/가속" },
      { label: "병목", value: `${getForecastBottleneckItems().length}건`, detail: "준비도 저하 요인", tone: "danger" },
      { label: "예측 게이트", value: `${getForecastGateItems().filter((item) => item.ready).length}/${getForecastGateItems().length}`, detail: "운용 전환 조건", tone: "evidence" }
    ],
    broadcast: [
      { label: "전파 준비", value: `${getBroadcastReadinessScore()}%`, detail: "수신·문안·확인 상태", tone: "primary" },
      { label: "수신자", value: `${getBroadcastRecipientItems().length}명`, detail: "지휘관·참모·검증관" },
      { label: "수신자별 문안", value: `${getBroadcastMessageItems().length}건`, detail: "예측·큐·감시 통합", tone: "evidence" },
      { label: "확인 게이트", value: `${getBroadcastAckItems().filter((item) => item.ready).length}/${getBroadcastAckItems().length}`, detail: "전파 완료 조건", tone: "support" }
    ],
    receipt: [
      { label: "수신 확인", value: `${getReceiptReadinessScore()}%`, detail: "확인·대기·재전파 상태", tone: "primary" },
      { label: "확인 완료", value: `${getReceiptTrackItems().filter((item) => item.ready).length}/${getReceiptTrackItems().length}`, detail: "수신자 확인 현황", tone: "evidence" },
      { label: "미확인 대상", value: `${getReceiptTrackItems().filter((item) => !item.ready).length}명`, detail: "재전파 필요", tone: "danger" },
      { label: "완료 게이트", value: `${getReceiptGateItems().filter((item) => item.ready).length}/${getReceiptGateItems().length}`, detail: "운용 기록 잠금", tone: "support" }
    ]
  };

  return pageItems[page] || [];
}

function getPageInsightItems(page) {
  if (page === "prefill") {
    const manifests = getPrefillManifestItems();
    const fields = getPrefillFieldItems();
    const gates = getPrefillGateItems();
    const readiness = getPrefillReadinessScore(undefined, manifests, fields, gates);
    const openGates = gates.filter((item) => !item.ready);
    return [
      {
        label: "초기 접수 프리필",
        title: `${readiness}% 접수값 잠금`,
        body: "다음 작전 템플릿을 빈 접수 화면으로 되돌려 자료, 필드, 확인 게이트를 미리 채웁니다.",
        evidence: `${manifests.length}개 자료 매니페스트`,
        score: readiness,
        tone: "primary"
      },
      {
        label: "접수 필드",
        title: `${fields.filter((item) => item.ready).length}/${fields.length}개 사전 입력`,
        body: "임무, 시간, 통신, 결심 조건, 근거 책임자를 첫 화면에서 바로 검토하게 만듭니다.",
        evidence: "작전 시드 기반",
        score: clamp(58 + fields.filter((item) => item.ready).length * 8, 62, 98),
        tone: "evidence"
      },
      {
        label: "초기 게이트",
        title: openGates.length ? `${openGates.length}개 확인 필요` : "첫 판단 게이트 충족",
        body: "자료 접수 전 결심 산출 잠금, 통신 권한, 근거 책임, 훈련 삽입을 확인합니다.",
        evidence: `${gates.length}개 게이트`,
        score: clamp(100 - openGates.length * 11, 40, 96),
        tone: openGates.length ? "danger" : "support"
      }
    ];
  }
  if (page === "nextop") {
    const seedItems = getNextOperationSeedItems();
    const constraints = getNextOperationConstraintItems();
    const packets = getNextOperationPacketItems();
    const readiness = getNextOperationReadinessScore(undefined, seedItems, constraints, packets);
    const openConstraints = constraints.filter((item) => !item.ready);
    return [
      {
        label: "다음 작전 템플릿",
        title: `${readiness}% 접수 준비`,
        body: "교훈 라이브러리의 반복 위험, 결심 조건, 근거 부채를 다음 작전 초기 입력값으로 바꿉니다.",
        evidence: `${packets.length}개 템플릿 산출물`,
        score: readiness,
        tone: "primary"
      },
      {
        label: "작전 시드",
        title: `${seedItems[0]?.value || demoData.operationPlan.operation_name} 기준`,
        body: "다음 작전 접수 전에도 임무, 통신, 결심 조건, 재훈련 삽입점을 미리 채워둡니다.",
        evidence: `${seedItems.length}개 시드`,
        score: clamp(68 + seedItems.filter((item) => item.ready).length * 7, 70, 98),
        tone: "evidence"
      },
      {
        label: "초기 제약",
        title: openConstraints.length ? `${openConstraints.length}개 확인 필요` : "초기 제약 잠금",
        body: "다음 작전 첫 접수 단계에서 통신, 수신, 근거, 훈련 반영을 놓치지 않게 만듭니다.",
        evidence: `${constraints.length}개 제약`,
        score: clamp(100 - openConstraints.length * 10, 42, 96),
        tone: openConstraints.length ? "danger" : "support"
      }
    ];
  }
  if (page === "lessons") {
    const patterns = getLessonPatternItems();
    const checks = getLessonChecklistItems();
    const archives = getLessonArchiveItems();
    const readiness = getLessonReadinessScore(undefined, patterns, checks, archives);
    const openChecks = checks.filter((item) => !item.ready);
    return [
      {
        label: "교훈 라이브러리",
        title: `${readiness}% 재사용 준비`,
        body: "종결 보고의 결심, 미확인 수신, 근거 부채를 다음 작전 준비 체크로 재정렬합니다.",
        evidence: `${archives.length}개 교훈 산출물`,
        score: readiness,
        tone: "primary"
      },
      {
        label: "반복 패턴",
        title: `${patterns[0]?.title || "조건부 결심"} 우선`,
        body: "이번 작전에서 반복 가능성이 높은 실패 원인과 차단 조건을 패턴 카드로 남깁니다.",
        evidence: `${patterns.length}개 패턴`,
        score: clamp(70 + patterns.length * 4, 70, 96),
        tone: "evidence"
      },
      {
        label: "재사용 체크",
        title: openChecks.length ? `${openChecks.length}개 보완 후 재사용` : "즉시 재사용 가능",
        body: "다음 작전 전 확인할 수신, 통신, 근거, 재훈련 조건을 실행 체크로 분리합니다.",
        evidence: `${checks.length}개 체크`,
        score: clamp(100 - openChecks.length * 12, 40, 96),
        tone: openChecks.length ? "danger" : "support"
      }
    ];
  }
  if (page === "closeout") {
    const exceptions = getCloseoutExceptionItems();
    const archives = getCloseoutArchiveItems();
    const readiness = getCloseoutReadinessScore(undefined, exceptions, archives);
    return [
      {
        label: "종결 보고",
        title: `${readiness}% 종결 준비`,
        body: "결심카드, 수신 확인, 제출 패키지, 감사 기록을 하나의 종결 보고로 묶어 다음 운용자가 바로 확인하게 합니다.",
        evidence: `${archives.length}개 보관 산출물`,
        score: readiness,
        tone: "primary"
      },
      {
        label: "예외 처리",
        title: `${exceptions.filter((item) => !item.ready).length}건 후속 책임`,
        body: "미확인 수신자, 근거 부채, 열린 큐, 검증 공백을 종결 후에도 놓치지 않도록 담당자와 조치 화면에 연결합니다.",
        evidence: `${exceptions.length}개 예외`,
        score: clamp(100 - exceptions.filter((item) => !item.ready).length * 10, 38, 96),
        tone: "danger"
      },
      {
        label: "보관 잠금",
        title: `${archives.filter((item) => item.ready).length}/${archives.length} 산출물 보관`,
        body: "제출 패키지, 수신 확인, 감사 로그, 재훈련 계획을 파일 수준 기록으로 남길 수 있게 정리합니다.",
        evidence: "종결 보관 목록",
        score: readiness,
        tone: "evidence"
      }
    ];
  }
  if (page === "data") {
    const plan = demoData.operationPlan;
    return [
      {
        label: "자동 추출",
        title: state.scenarioLoaded ? `${plan.operation_name} 구조화 완료` : "자료 접수 즉시 필드 잠금",
        body: state.scenarioLoaded ? `${plan.documents.length}종 자료에서 임무, 시간, 제한사항, 방책을 같은 작전 키로 연결했습니다.` : "작전계획, 방책표, 군수, 통신, 기상을 동일 기준으로 정규화하도록 대기 중입니다.",
        evidence: state.scenarioLoaded ? `${plan.documents.length}종 자료` : "로컬 자료 대기",
        score: state.scenarioLoaded ? 94 : 24,
        tone: state.scenarioLoaded ? "support" : "evidence"
      },
      state.scenarioLoaded
        ? {
          label: "방책 랭킹",
          title: "B안 안정 후보 유지",
          body: "통신 음영과 보급 접근성 부담이 낮아 결심카드 추천안으로 계속 승격됩니다.",
          evidence: "COA B 비교표",
          score: 88,
          tone: "primary"
        }
        : {
          label: "방책 랭킹",
          title: "자료 접수 후 산출",
          body: "방책표가 들어오기 전까지 후보 랭킹과 결심 추천은 표시하지 않습니다.",
          evidence: "입력 없음",
          score: 0,
          tone: "neutral"
        },
      {
        label: "다음 큐",
        title: state.scenarioLoaded ? "가상부대 검토로 이관" : "계획서 접수 필요",
        body: state.scenarioLoaded ? "역할별 에이전트가 통신, 군수, 재판단 기준을 나눠 검토할 수 있습니다." : "접수 전에는 후보 필드만 표시하고 결심 근거는 잠가 둡니다.",
        evidence: state.scenarioLoaded ? "역할 매핑 준비" : "승인 전 대기",
        score: state.scenarioLoaded ? 78 : 16,
        tone: state.scenarioLoaded ? "primary" : "neutral"
      }
    ];
  }

  const plan = demoData.operationPlan;
  const selectedNode = graph.nodeMap.get(state.selectedNodeId);
  const selectedAgent = getAgentById(state.selectedAgentId) || demoData.agents[0];
  const selectedAgentProfile = selectedAgent ? getAgentProfile(selectedAgent) : null;
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const selectedFailure = getFailureById(state.selectedFailureId);
  const selectedFailureProfile = getFailureProfile(selectedFailure);
  const selectedFailureStory = getFailureStory(selectedFailure);
  const decisionSummary = getDecisionFailureSummary();
  const generatedPercent = demoData.agents.length ? Math.round((state.generatedAgentCount / demoData.agents.length) * 100) : 0;
  const selectedNodeEvidenceCount = (selectedNode?.evidence_ids || demoData.decision.evidence_ids).length;
  const activeSeverityScore = activeEvent?.severity === "high" ? 92 : activeEvent?.severity === "medium" ? 72 : activeEvent ? 48 : 18;
  const topFailure = decisionSummary.topRisk;

  const pageItems = {
    data: [
      {
        label: "자동 추출",
        title: state.scenarioLoaded ? `${plan.operation_name} 구조화 완료` : "자료 접수 즉시 필드 잠금",
        body: state.scenarioLoaded ? `${plan.documents.length}종 자료에서 임무, 시간, 제한사항, 방책을 같은 작전 키로 연결했습니다.` : "작전계획, 방책표, 군수, 통신, 기상을 동일 기준으로 정규화하도록 대기 중입니다.",
        evidence: state.scenarioLoaded ? `${plan.documents.length}종 자료` : "로컬 자료 대기",
        score: state.scenarioLoaded ? 94 : 24,
        tone: state.scenarioLoaded ? "support" : "evidence"
      },
      state.scenarioLoaded
        ? {
          label: "방책 랭킹",
          title: "B안 안정 후보 유지",
          body: "통신 음영과 보급 접근성 부담이 낮아 결심카드 추천안으로 계속 승격됩니다.",
          evidence: "COA B 비교표",
          score: 88,
          tone: "primary"
        }
        : {
          label: "방책 랭킹",
          title: "자료 접수 후 산출",
          body: "방책표가 들어오기 전까지 후보 랭킹과 결심 추천은 표시하지 않습니다.",
          evidence: "입력 없음",
          score: 0,
          tone: "neutral"
        },
      {
        label: "다음 큐",
        title: state.scenarioLoaded ? "가상부대 검토로 이관" : "계획서 접수 필요",
        body: state.scenarioLoaded ? "역할별 에이전트가 통신, 군수, 재판단 기준을 나눠 검토할 수 있습니다." : "접수 전에는 후보 필드만 표시하고 결심 근거는 잠가 둡니다.",
        evidence: state.scenarioLoaded ? "역할 매핑 준비" : "승인 전 대기",
        score: state.scenarioLoaded ? 78 : 16,
        tone: state.scenarioLoaded ? "primary" : "neutral"
      }
    ],
    ontology: [
      {
        label: "중심 노드",
        title: selectedNode?.label || "결심카드",
        body: selectedNode?.detail || "문서 근거, 실패경로, 방책 후보를 결심카드에 연결합니다.",
        evidence: `${selectedNodeEvidenceCount}건 근거`,
        score: clamp(64 + selectedNodeEvidenceCount * 8, 58, 96),
        tone: "evidence"
      },
      {
        label: "관계 압축",
        title: `${getGraphModeLabel(state.graphMode)} 뷰`,
        body: "현재 필터 기준으로 문서, 토론, 실패경로, 결심 연결선만 남겨 판단 경로를 줄입니다.",
        evidence: `${graph.nodes.length}노드 / ${graph.edges.length}관계`,
        score: state.graphMode === "all" ? 70 : 86,
        tone: "support"
      },
      {
        label: "결심 연결",
        title: `${demoData.decision.recommended_coa} 근거 잠금`,
        body: `${topFailure.title}를 우선 차단하도록 근거와 즉시 수정안을 결심카드에 묶습니다.`,
        evidence: `${demoData.decision.evidence_ids.length}건 직접 근거`,
        score: 91,
        tone: "primary"
      }
    ],
    agents: [
      {
        label: "편성 병목",
        title: state.agentsGenerated ? "23개 역할 준비 완료" : `${generatedPercent}% 생성 중`,
        body: state.agentsGenerated ? "아군, 대항군, 전장 변수, 통제 역할이 같은 실패경로를 놓고 토론할 수 있습니다." : "생성 전에는 레드팀과 참모 검토가 잠겨 있어 리허설 판단을 보류합니다.",
        evidence: `${state.generatedAgentCount}/${demoData.agents.length} 역할`,
        score: state.agentsGenerated ? 96 : clamp(generatedPercent, 12, 74),
        tone: state.agentsGenerated ? "support" : "evidence"
      },
      {
        label: "선택 유닛",
        title: selectedAgentProfile?.callsign || "RED",
        body: selectedAgent?.review_output || "선택한 역할의 검토 산출물을 표시합니다.",
        evidence: selectedAgent?.risk_focus?.slice(0, 2).join(" / ") || "위험 초점",
        score: Math.round((selectedAgent?.confidence || 0.78) * 100),
        tone: selectedAgentProfile?.faction === "opfor" ? "danger" : "primary"
      },
      {
        label: "합의 방향",
        title: "B안 우선, A안 조건부",
        body: "통신 중계, 보급 대기점, 재판단 기준이 정리되기 전까지 A안 승격은 제한합니다.",
        evidence: "참모 토론 로그",
        score: state.agentsGenerated ? 89 : 52,
        tone: "primary"
      }
    ],
    rehearsal: [
      {
        label: "마찰 예측",
        title: activeEvent ? activeEvent.event : "리허설 대기",
        body: activeEvent ? activeEvent.impact : "시간순 이벤트가 시작되면 지형, 통신, 군수 마찰을 같은 카드에서 추적합니다.",
        evidence: activeEvent ? `${activeEvent.time} / ${riskLabel(activeEvent.severity)}` : "이벤트 없음",
        score: activeSeverityScore,
        tone: activeEvent?.severity === "high" ? "danger" : activeEvent ? "evidence" : "neutral"
      },
      {
        label: "교신 신호",
        title: state.radioLog.length ? `${state.radioLog[0].callsign} 최신 보고` : "무전 로그 대기",
        body: state.radioLog.length ? state.radioLog[0].message : "관련 에이전트 교신이 들어오면 실패경로 근거와 바로 연결됩니다.",
        evidence: state.radioLog.length ? state.radioLog[0].finding : "리허설 시작 필요",
        score: state.radioLog.length ? 84 : 18,
        tone: state.radioLog[0]?.tone === "red" ? "danger" : state.radioLog.length ? "support" : "neutral"
      },
      {
        label: "다음 전환",
        title: state.rehearsalStarted ? "실패경로 페이지로 압축" : "리허설 실행 필요",
        body: state.rehearsalStarted ? "재생된 마찰을 원인, 차단점, 조치 카드로 재정렬합니다." : "가상부대 생성 후 리허설을 실행하면 판단 큐가 갱신됩니다.",
        evidence: state.rehearsalStarted ? `${demoData.failures.length}개 실패경로` : "대기",
        score: state.rehearsalStarted ? 82 : 20,
        tone: state.rehearsalStarted ? "primary" : "evidence"
      }
    ],
    risk: [
      {
        label: "차단점",
        title: selectedFailureProfile.decisionPoint,
        body: selectedFailureStory.why,
        evidence: selectedFailureProfile.timeWindow,
        score: selectedFailure.score,
        tone: "danger"
      },
      {
        label: "경고 신호",
        title: selectedFailureProfile.earlyWarning,
        body: `${selectedFailureProfile.agents.slice(0, 2).join(", ") || "사전 검증"}가 먼저 확인해야 하는 흐름입니다.`,
        evidence: `${selectedFailureProfile.evidenceItems.length}건 직접 근거`,
        score: clamp(selectedFailure.score - 6, 52, 96),
        tone: "evidence"
      },
      {
        label: "조치 후보",
        title: selectedFailureProfile.mitigationActions[0],
        body: selectedFailureProfile.mitigationActions[1] || selectedFailure.mitigation,
        evidence: selectedFailureProfile.evidenceItems[0]?.source || "결심카드",
        score: 86,
        tone: "primary"
      }
    ],
    decision: [
      {
        label: "승인 패키지",
        title: demoData.decision.recommended_coa,
        body: demoData.decision.decision_statement || demoData.decision.conditional_coa,
        evidence: demoData.decision.command_authority_notice,
        score: 92,
        tone: "primary"
      },
      {
        label: "조건 잠금",
        title: `${getDecisionConditions().length}개 시행 조건`,
        body: getDecisionConditions().map((condition) => (typeof condition === "string" ? condition : condition.detail)).slice(0, 2).join(" / "),
        evidence: "통신·군수·재판단",
        score: 88,
        tone: "support"
      },
      {
        label: "잔여 위험",
        title: `${decisionSummary.topRisk.title} ${decisionSummary.topRisk.score}`,
        body: "최종 명령 전 가장 큰 실패경로를 조건부 승인 문구와 감시 항목에 남깁니다.",
        evidence: `${decisionSummary.evidenceTotal}건 위험 근거`,
        score: decisionSummary.averageRisk,
        tone: "danger"
      }
    ],
    retrain: [
      {
        label: "훈련 과제",
        title: `${getRetrainingScheduleItems().length}개 보완 드릴`,
        body: "AAR 개선안의 책임자, 기한, 근거를 재훈련 시간표로 다시 묶어 다음 훈련 전 확인합니다.",
        evidence: `${getAarImprovementItems().length}개 AAR 조치`,
        score: 93,
        tone: "primary"
      },
      {
        label: "담당자 부하",
        title: `${getRetrainingOwnerLoads().length}개 책임 축`,
        body: getRetrainingOwnerLoads().slice(0, 2).map((item) => `${item.owner} ${item.load}건`).join(" / "),
        evidence: "소유자별 훈련 편성",
        score: 88,
        tone: "support"
      },
      {
        label: "검증 게이트",
        title: `${getRetrainingValidationGates().filter((item) => item.ready).length}/${getRetrainingValidationGates().length} 잠금`,
        body: "감사 공백과 결심 조건을 재훈련 전 통과 기준으로 압축합니다.",
        evidence: `${getAuditCoverageSummary().gapCount}개 감사 공백`,
        score: 86,
        tone: "evidence"
      }
    ],
    handoff: [
      {
        label: "수신자별 인계",
        title: `${getHandoffRecipientItems().length}명에게 패킷 분배`,
        body: "지휘관, 통신, 군수, 훈련장교가 받아야 할 조치와 근거를 각각 다른 패킷으로 분리합니다.",
        evidence: `${getSubmissionBundleItems().length}개 산출물`,
        score: 94,
        tone: "primary"
      },
      {
        label: "교신 문안",
        title: `${getHandoffSignalItems().length}개 즉시 전파 문장`,
        body: getHandoffSignalItems().slice(0, 2).map((item) => item.title).join(" / "),
        evidence: "무전·브리핑 전환",
        score: 88,
        tone: "support"
      },
      {
        label: "확인 체크",
        title: `${getHandoffChecklistItems().filter((item) => item.ready).length}/${getHandoffChecklistItems().length} 잠금`,
        body: "제출, 재훈련, 근거, 지휘관 검토 항목을 인계 전 확인 기준으로 압축합니다.",
        evidence: "인수인계 패킷",
        score: 90,
        tone: "evidence"
      }
    ],
    metrics: [
      {
        label: "운영 지표판",
        title: `${getOperationsMetricItems().length}개 KPI 추적`,
        body: "제출, 재훈련, 인수인계가 실제 운용 상태로 이어지는지 한 화면에서 확인합니다.",
        evidence: `${getHandoffRecipientItems().length}명 수신자`,
        score: getOperationsReadinessScore(),
        tone: "primary"
      },
      {
        label: "위험 추세",
        title: `${getOperationsRiskTrend()[0]?.label || "위험"} ${getOperationsRiskTrend()[0]?.before || 0}→${getOperationsRiskTrend()[0]?.after || 0}`,
        body: "AAR 조치와 재훈련 계획을 반영한 잔여 위험 변화를 추적합니다.",
        evidence: `${getOperationsRiskTrend().length}개 실패경로`,
        score: 92,
        tone: "support"
      },
      {
        label: "근거 부채",
        title: `${getOperationsEvidenceDebt().length}개 확인 필요`,
        body: "감사 로그에서 약한 근거와 미확인 문서를 운영 리듬에 올립니다.",
        evidence: `근거 사용률 ${getOperationsEvidenceCoverageSummary().verifiedPercent}%`,
        score: clamp(100 - getOperationsEvidenceDebt().length * 8, 48, 96),
        tone: "evidence"
      }
    ],
    watch: [
      {
        label: "재판단 감시",
        title: `${getDecisionWatchItems()[0]?.title || "트리거"} 우선 확인`,
        body: "결심 이후 현장에서 어떤 신호가 들어오면 위험, 결심, 근거 화면으로 돌아가야 하는지 표시합니다.",
        evidence: `${getDecisionWatchItems().length}개 감시 기준`,
        score: getWatchReadinessScore(),
        tone: "primary"
      },
      {
        label: "트리거 보드",
        title: `${getDecisionWatchItems().filter((item) => item.level === "critical").length}개 즉시 보고`,
        body: "보고 누락, 보급 대기, 후송 지연, 전환 승인 지연을 임계값과 책임자 기준으로 나눕니다.",
        evidence: `${getWatchEscalationItems().length}개 조치 경로`,
        score: 91,
        tone: "danger"
      },
      {
        label: "전파 문안",
        title: `${getWatchSignalItems().length}개 문장 준비`,
        body: "경고가 발생하면 무전망과 참모 브리핑에서 바로 읽을 수 있는 문장으로 전환합니다.",
        evidence: "무전·참모망 전파",
        score: 88,
        tone: "evidence"
      }
    ],
    log: [
      {
        label: "상황 일지",
        title: `${getOperationsLogItems().length}건 보고 기록`,
        body: "감시 트리거와 전파 문안을 시간순 일지로 남겨 다음 교대자가 무엇을 확인했는지 바로 볼 수 있습니다.",
        evidence: `${getLogAcknowledgementItems().length}개 확인 항목`,
        score: getLogReadinessScore(),
        tone: "primary"
      },
      {
        label: "보고 타임라인",
        title: `${getOperationsLogItems()[0]?.time || "T+0"} 최신 보고`,
        body: getOperationsLogItems()[0]?.summary || "감시 보고가 들어오면 위험, 결심, 인계 참조와 함께 기록됩니다.",
        evidence: "감시 트리거 연결",
        score: 90,
        tone: "support"
      },
      {
        label: "확인 기록",
        title: `${getLogAcknowledgementItems().filter((item) => item.done).length}/${getLogAcknowledgementItems().length} 확인`,
        body: "지휘, 참모, 인계 담당자가 확인해야 할 항목을 일지 끝에 잠급니다.",
        evidence: "교대 전 확인",
        score: getLogReadinessScore(),
        tone: "evidence"
      }
    ],
    challenge: [
      {
        label: "반증 검증",
        title: `${getChallengeAssumptionItems()[0]?.title || "핵심 가정"} 재검토`,
        body: "최종 결심을 승인한 뒤에도 어떤 가정이 틀리면 판단을 되돌려야 하는지 명시합니다.",
        evidence: `${getChallengeAssumptionItems().length}개 가정`,
        score: getChallengeReadinessScore(),
        tone: "primary"
      },
      {
        label: "반증 신호",
        title: `${getChallengeCounterItems().filter((item) => item.severity === "높음").length}개 고위험 신호`,
        body: "통신, 보급, 후송, 승인 지연 신호를 결심 반박 근거로 다시 대조합니다.",
        evidence: `${getChallengeCounterItems().length}개 반대 근거`,
        score: clamp(100 - getChallengeCounterItems().filter((item) => item.severity === "높음").length * 9, 54, 94),
        tone: "danger"
      },
      {
        label: "검증 조치",
        title: `${getChallengeActionItems().length}개 확인 경로`,
        body: "각 가정을 위험 화면, 근거 추적, 결심카드 갱신 조치로 바로 연결합니다.",
        evidence: "책임자·근거·화면 이동",
        score: getChallengeReadinessScore(),
        tone: "evidence"
      }
    ],
    queue: [
      {
        label: "조치 큐",
        title: `${getActionQueueItems()[0]?.title || "열린 조치"} 우선 실행`,
        body: "AAR, 재훈련, 감시, 반증 검증에서 열린 항목을 하나의 실행 큐로 합쳐 다음 담당자가 바로 처리할 수 있게 합니다.",
        evidence: `${getActionQueueItems().length}건 큐`,
        score: getActionQueueReadinessScore(),
        tone: "primary"
      },
      {
        label: "담당자 부하",
        title: `${getActionQueueOwnerItems()[0]?.owner || "작전참모"} 집중`,
        body: "같은 담당자에게 열린 조치가 몰리는지 보고, 지휘관 확인 전에 병목을 줄입니다.",
        evidence: `${getActionQueueOwnerItems().length}명 담당자`,
        score: clamp(100 - (getActionQueueOwnerItems()[0]?.open || 0) * 6, 52, 94),
        tone: "evidence"
      },
      {
        label: "닫힘 기준",
        title: `${getActionQueueGateItems().filter((item) => item.ready).length}/${getActionQueueGateItems().length} 게이트 충족`,
        body: "큐가 비어 보이는 것이 아니라 완료 기준을 충족해야 다음 운용 단계로 넘길 수 있게 잠급니다.",
        evidence: "완료 게이트",
        score: getActionQueueReadinessScore(),
        tone: "support"
      }
    ],
    forecast: [
      {
        label: "준비 예측",
        title: `${getSelectedForecastScenario()?.label || "기준 처리"} ${getReadinessForecastScore()}% 전망`,
        body: "큐를 지연, 기준, 가속 처리했을 때 준비도와 잔여 위험이 어떻게 바뀌는지 비교합니다.",
        evidence: `${getForecastScenarioItems().length}개 시나리오`,
        score: getReadinessForecastScore(),
        tone: "primary"
      },
      {
        label: "병목 신호",
        title: `${getForecastBottleneckItems()[0]?.owner || "담당자"} 병목 우선`,
        body: "가장 많은 열린 조치와 긴급 조치가 몰린 담당자를 예측 리스크로 표시합니다.",
        evidence: `${getForecastBottleneckItems().length}개 병목`,
        score: clamp(100 - (getForecastBottleneckItems()[0]?.impact || 0), 42, 94),
        tone: "danger"
      },
      {
        label: "전환 게이트",
        title: `${getForecastGateItems().filter((item) => item.ready).length}/${getForecastGateItems().length} 조건 충족`,
        body: "예측값이 다음 운용으로 넘길 수 있는지 게이트 기준으로 확인합니다.",
        evidence: "24~72h 전망",
        score: getReadinessForecastScore(),
        tone: "evidence"
      }
    ],
    broadcast: [
      {
        label: "전파 패키지",
        title: `${getSelectedBroadcastRecipient()?.recipient || "지휘관"} 우선 전파`,
        body: "준비 예측, 조치 큐, 인수인계 문안을 수신자별로 합쳐 실제 읽을 수 있는 전파 패킷으로 닫습니다.",
        evidence: `${getBroadcastMessageItems().length}건 문안`,
        score: getBroadcastReadinessScore(),
        tone: "primary"
      },
      {
        label: "확인 상태",
        title: `${getBroadcastAckItems().filter((item) => item.ready).length}/${getBroadcastAckItems().length} 게이트 충족`,
        body: "지휘관 승인, 참모 수신, 근거 링크, 큐 영향, 예측 점수 확인을 전파 완료 조건으로 잠급니다.",
        evidence: "수신 확인 게이트",
        score: getBroadcastReadinessScore(),
        tone: "evidence"
      },
      {
        label: "다음 조치",
        title: `${getBroadcastRecipientItems().filter((item) => item.tone === "danger").length}건 즉시 전파`,
        body: "긴급·고위험 조치가 있는 수신자는 위험 또는 큐 화면으로 바로 돌아갈 수 있게 연결합니다.",
        evidence: `${getActionQueueItems().length}건 큐 영향`,
        score: clamp(100 - getBroadcastRecipientItems().filter((item) => item.tone === "danger").length * 9, 52, 96),
        tone: "danger"
      }
    ],
    receipt: [
      {
        label: "수신 확인",
        title: `${getSelectedReceiptItem()?.recipient || "지휘관"} ${getSelectedReceiptItem()?.status || "확인"} 상태`,
        body: "전파 이후 누가 확인했고 누가 재전파 대상인지 수신자 단위로 추적해 다음 운용 기록으로 남깁니다.",
        evidence: `${getReceiptTrackItems().filter((item) => item.ready).length}/${getReceiptTrackItems().length} 확인`,
        score: getReceiptReadinessScore(),
        tone: "primary"
      },
      {
        label: "미확인 대상",
        title: `${getReceiptTrackItems().filter((item) => !item.ready).length}명 재전파 필요`,
        body: "확인 지연 수신자는 전파 패키지, 근거 추적, 조치 큐, 상황 일지로 바로 연결합니다.",
        evidence: `${getReceiptEscalationItems().length}개 조치`,
        score: clamp(100 - getReceiptTrackItems().filter((item) => !item.ready).length * 12, 42, 96),
        tone: "danger"
      },
      {
        label: "완료 게이트",
        title: `${getReceiptGateItems().filter((item) => item.ready).length}/${getReceiptGateItems().length} 조건 충족`,
        body: "모든 수신 상태가 근거 링크와 운용 일지에 남아야 전파가 실제로 닫힌 것으로 처리합니다.",
        evidence: "수신 확인 게이트",
        score: getReceiptReadinessScore(),
        tone: "evidence"
      }
    ]
  };

  return pageItems[page] || [];
}

function getMissionActionItems(page = state.currentStage) {
  const selectedFailure = getFailureById(state.selectedFailureId);
  const selectedAgent = getAgentById(state.selectedAgentId) || demoData.agents[0];
  const primary = (() => {
    if (!state.scenarioLoaded) {
      return {
        label: "작전계획 접수",
        detail: "자료를 구조화하고 방책 비교를 시작합니다.",
        action: "load-scenario",
        icon: "file-input",
        stage: "data",
        primary: true
      };
    }
    if (!state.agentsGenerated) {
      return {
        label: "가상부대 생성",
        detail: "23개 역할을 활성화해 참모·현장·대항군 검토를 시작합니다.",
        action: "generate-agents",
        icon: "users-round",
        stage: "agents",
        primary: true
      };
    }
    if (!state.rehearsalStarted) {
      return {
        label: "수행 리허설 실행",
        detail: "3D 지형에서 시간순 마찰과 교신을 재생합니다.",
        action: "run-rehearsal",
        icon: "play",
        stage: "rehearsal",
        primary: true
      };
    }
    if (page !== "risk") {
      return {
        label: "실패경로 확인",
        detail: `${selectedFailure.title} ${selectedFailure.score}점 흐름을 먼저 차단합니다.`,
        action: "open-risk",
        icon: "triangle-alert",
        stage: "risk",
        primary: true
      };
    }
    return {
      label: "결심카드 검토",
      detail: `${demoData.decision.recommended_coa} 추천안과 조건부 시행 기준을 확인합니다.`,
      action: "open-decision",
      icon: "clipboard-check",
      stage: "decision",
      primary: true
    };
  })();

  return [
    primary,
    {
      label: "근거 검색",
      detail: "문서, 에이전트, 실패경로, 이벤트를 바로 찾습니다.",
      action: "open-search",
      icon: "search",
      stage: state.currentStage
    },
    {
      label: page === "agents" ? selectedAgent.name : "그래프 보기",
      detail: page === "agents" ? selectedAgent.review_output || selectedAgent.role : "선택 근거와 결심 노드를 한 화면에서 확인합니다.",
      action: page === "agents" ? "focus-agent" : "focus-graph",
      icon: page === "agents" ? "user-round-check" : "network",
      stage: page === "agents" ? "agents" : "ontology"
    }
  ];
}

function runMissionAction(action) {
  const actions = {
    "load-scenario": loadScenario,
    "generate-agents": generateAgents,
    "run-rehearsal": runRehearsal,
    "open-risk": () => {
      updateFlow("failure");
      setStage("risk");
      selectFailurePath(state.selectedFailureId);
    },
    "open-decision": () => {
      updateFlow("decision");
      setStage("decision");
      setDecisionTab("card");
    },
    "open-search": () => openMissionSearch(),
    "focus-graph": () => {
      setStage("ontology");
      setGraphMode("decision");
      selectNode("decision");
    },
    "focus-agent": () => {
      setStage("agents");
      selectAgentProfile(state.selectedAgentId);
    }
  };
  actions[action]?.();
}

function renderMissionActionPanel(rail, page) {
  rail.querySelector(":scope > .mission-action-panel")?.remove();
}

function renderPageInsights(page, anchor) {
  const items = getPageInsightItems(page.dataset.page);
  const container = anchor?.parentElement?.classList.contains("page-side-rail") ? anchor.parentElement : page;
  let deck = container.querySelector(":scope > .ai-insight-deck") || page.querySelector(":scope > .ai-insight-deck");
  if (!items.length) {
    deck?.remove();
    return;
  }
  if (!deck) {
    deck = document.createElement("section");
    deck.className = "ai-insight-deck";
    deck.setAttribute("aria-label", "AI 판단 큐");
    anchor.insertAdjacentElement("afterend", deck);
  } else if (deck.parentElement !== container) {
    anchor.insertAdjacentElement("afterend", deck);
  }
  deck.innerHTML = items
    .map((item) => {
      const score = clamp(Math.round(item.score), 0, 100);
      return `
        <article class="ai-insight-card is-${item.tone || "neutral"}">
          <header>
            <span>${item.label}</span>
            <b>${score}%</b>
          </header>
          <strong>${item.title}</strong>
          <p>${item.body}</p>
          <footer>
            <em>${item.evidence}</em>
            <i class="insight-meter" role="meter" aria-label="판단 신뢰도" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${score}"><span style="width: ${score}%"></span></i>
          </footer>
        </article>
      `;
    })
    .join("");
}

function ensurePageSideRail(page, heading) {
  let rail = page.querySelector(":scope > .page-side-rail");
  if (!rail) {
    rail = document.createElement("aside");
    rail.className = "page-side-rail";
    rail.setAttribute("aria-label", "보조 판단 정보");
    heading.insertAdjacentElement("afterend", rail);
  }
  return rail;
}

function keepFailureStoryInReportBody(page) {
  const failureStory = page.querySelector(".selected-failure-story");
  const workspace = page.querySelector(":scope > .risk-workspace");
  if (!failureStory || !workspace || failureStory.parentElement === page) return;
  page.insertBefore(failureStory, workspace);
}

function formatKoreanObjectParticle(text) {
  const value = String(text || "").trim();
  const lastCode = value.charCodeAt(value.length - 1);
  const hasFinalConsonant = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;
  return `${value}${hasFinalConsonant ? "을" : "를"}`;
}

function formatKoreanTopicParticle(text) {
  const value = String(text || "").trim();
  const lastCode = value.charCodeAt(value.length - 1);
  const hasFinalConsonant = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;
  return `${value}${hasFinalConsonant ? "은" : "는"}`;
}

function getDemoJudgeCue() {
  const stageOrder = ["data", "ontology", "agents", "rehearsal", "risk", "decision", "briefing", "aar", "audit", "submit", "retrain", "handoff", "metrics", "watch", "log", "challenge", "queue", "forecast", "broadcast", "receipt", "closeout", "lessons", "nextop", "prefill"];
  const stageIndex = stageOrder.indexOf(state.currentStage) + 1;
  if (state.currentStage === "data") {
    return {
      step: stageIndex > 0 ? `${String(stageIndex).padStart(2, "0")}/24` : "시연",
      title: state.scenarioLoaded ? "자료가 작전 시드로 잠겼습니다" : "문서 접수 전 상태를 먼저 보여줍니다",
      pitch: state.scenarioLoaded
        ? "문서 파일을 단순 업로드한 것이 아니라 임무, 제한사항, 방책 비교가 같은 작전 키로 연결됐다고 설명합니다."
        : "시작 전에는 모든 결심 근거가 잠겨 있고, 작전계획 접수 버튼 하나로 구조화가 시작된다고 말합니다.",
      judge: "심사위원은 입력 자료가 실제 판단 필드로 바뀌는지 봅니다.",
      proof: state.scenarioLoaded ? `${demoData.operationPlan.documents.length}종 자료 / ${demoData.coas.length}개 방책` : "파일 패키지, 파이프라인, 준비 상태가 대기값으로 구분됨",
      next: state.scenarioLoaded ? "그래프에서 관계 보기" : "작전계획 접수",
      action: state.scenarioLoaded ? "open-graph" : "load-scenario",
      score: state.scenarioLoaded ? 92 : 34
    };
  }
  if (state.currentStage === "lessons") {
    return {
      step: stageIndex > 0 ? `${String(stageIndex).padStart(2, "0")}/24` : "시연",
      title: "종결 산출물을 다음 작전 교훈으로 바꿉니다",
      pitch: "종결 보고에서 반복 패턴, 재사용 체크, 보관 패킷을 추출해 다음 작전 준비물로 남긴다고 설명합니다.",
      judge: "심사위원은 시연 결과가 일회성 보고가 아니라 다음 계획 품질로 재사용되는지 확인합니다.",
      proof: "판단 패턴·재사용 체크·교훈 패킷",
      next: "다음 작전 템플릿 확인",
      action: "open-nextop",
      score: 95
    };
  }
  if (state.currentStage === "nextop") {
    return {
      step: stageIndex > 0 ? `${String(stageIndex).padStart(2, "0")}/24` : "시연",
      title: "교훈을 다음 작전 접수 템플릿으로 바꿉니다",
      pitch: "마지막에는 재사용 교훈을 임무 시드, 초기 제약, 접수 패킷으로 변환해 다음 작전이 빈 화면에서 시작하지 않게 한다고 설명합니다.",
      judge: "심사위원은 결과가 보고서 저장에서 끝나지 않고 다음 작전의 초기 입력 품질을 높이는지 확인합니다.",
      proof: "작전 시드·초기 제약·템플릿 패킷",
      next: "초기 접수 프리필 확인",
      action: "open-prefill",
      score: 96
    };
  }
  if (state.currentStage === "prefill") {
    return {
      step: stageIndex > 0 ? `${String(stageIndex).padStart(2, "0")}/24` : "시연",
      title: "다음 작전이 빈 접수 화면에서 시작하지 않습니다",
      pitch: "템플릿에서 나온 자료 매니페스트, 접수 필드, 초기 게이트를 새 자료 접수 화면에 사전 입력값으로 넘긴다고 설명합니다.",
      judge: "심사위원은 후속 작전의 시작 품질까지 닫히는지 확인합니다.",
      proof: "자료 매니페스트·접수 필드·초기 게이트",
      next: "프리필 저장",
      action: "open-prefill",
      score: 97
    };
  }
  const selectedFailure = getFailureById(state.selectedFailureId);
  const selectedFailureProfile = getFailureProfile(selectedFailure);
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const generatedPercent = demoData.agents.length ? Math.round((state.generatedAgentCount / demoData.agents.length) * 100) : 0;
  const evidenceTotal = new Set(demoData.failures.flatMap((failure) => failure.evidence)).size;
  const activeConditions = getActiveDecisionConditionIds().size;
  const base = {
    data: {
      title: state.scenarioLoaded ? "자료가 작전 시드로 잠겼습니다" : "문서 접수 전 상태를 먼저 보여줍니다",
      pitch: state.scenarioLoaded
        ? "문서 파일을 단순 업로드한 것이 아니라 임무, 제한사항, 방책 비교가 같은 작전 키로 연결됐다고 설명합니다."
        : "시작 전에는 모든 결심 근거가 잠겨 있고, 작전계획 접수 버튼 하나로 구조화가 시작된다고 말합니다.",
      judge: "심사위원은 입력 자료가 실제 판단 필드로 바뀌는지 봅니다.",
      proof: state.scenarioLoaded ? `${demoData.operationPlan.documents.length}종 자료 / ${demoData.coas.length}개 방책` : "파일 패키지, 파이프라인, 준비 상태가 대기값으로 구분됨",
      next: state.scenarioLoaded ? "그래프에서 관계 보기" : "작전계획 접수",
      action: state.scenarioLoaded ? "open-graph" : "load-scenario",
      score: state.scenarioLoaded ? 92 : 34
    },
    ontology: {
      title: "문서가 아니라 판단 경로를 보여줍니다",
      pitch: "그래프는 장식이 아니라 문서, 에이전트 발언, 실패경로, 결심카드를 한 경로로 묶는 근거 지도라고 설명합니다.",
      judge: "심사위원은 왜 B안이 나왔는지 역추적 가능한지 확인합니다.",
      proof: `${graph.nodes.length}개 노드 / ${graph.edges.length}개 관계 / 선택 노드 ${graph.nodeMap.get(state.selectedNodeId)?.label || "결심카드"}`,
      next: state.agentsGenerated ? "리허설로 이동" : "가상부대 생성",
      action: state.agentsGenerated ? "run-rehearsal" : "generate-agents",
      score: 88
    },
    agents: {
      title: state.agentsGenerated ? "23개 역할이 같은 상황을 나눠 봅니다" : "가상부대 생성 전후 차이를 보여줍니다",
      pitch: "참모, 현장 제대, 대항군, 환경 에이전트가 각각 다른 허점을 잡아내고 합의 결론으로 모인다고 설명합니다.",
      judge: "심사위원은 다중 에이전트가 단순 채팅이 아니라 역할별 산출물을 내는지 봅니다.",
      proof: `${state.generatedAgentCount}/${demoData.agents.length} 역할 준비 · ${generatedPercent}%`,
      next: state.agentsGenerated ? "수행 리허설 실행" : "가상부대 생성",
      action: state.agentsGenerated ? "run-rehearsal" : "generate-agents",
      score: state.agentsGenerated ? 94 : clamp(generatedPercent, 24, 76)
    },
    rehearsal: {
      title: activeEvent ? `${activeEvent.time} ${activeEvent.event}` : "3D 리허설에서 마찰을 발생시킵니다",
      pitch: activeEvent
        ? "지형 위 이벤트와 무전 로그가 동시에 바뀌고, 이 마찰이 실패경로와 근거 추적으로 이어진다고 말합니다."
        : "수행 리허설은 애니메이션 시연이 아니라 시간순 위험 증거를 생성하는 단계라고 설명합니다.",
      judge: "심사위원은 3D 장면이 결심 근거로 이어지는지 확인합니다.",
      proof: activeEvent ? `${riskLabel(activeEvent.severity)} · ${activeEvent.impact}` : "승진훈련장 지형, 이벤트 타임라인, 무전 로그 대기",
      next: state.rehearsalStarted ? "실패경로로 압축" : "수행 리허설 실행",
      action: state.rehearsalStarted ? "open-risk" : "run-rehearsal",
      score: activeEvent?.severity === "high" ? 95 : state.rehearsalStarted ? 82 : 42
    },
    risk: {
      title: `${formatKoreanObjectParticle(selectedFailure.title)} 먼저 막아야 합니다`,
      pitch: "리허설에서 나온 마찰을 원인, 차단 지점, 즉시 조치로 압축했고 결심카드에 바로 반영된다고 설명합니다.",
      judge: "심사위원은 위험 목록이 경고가 아니라 조치 우선순위인지 봅니다.",
      proof: `${selectedFailure.score}점 · ${selectedFailureProfile.decisionPoint} · 직접 근거 ${selectedFailure.evidence.length}건`,
      next: "결심카드 확인",
      action: "open-decision",
      score: selectedFailure.score
    },
    decision: {
      title: `${demoData.decision.recommended_coa} 결심안을 제시합니다`,
      pitch: "마지막 화면에서는 추천 방책, 조건별 위험 감쇄, 실행 조치, 지휘관 확인 항목이 한 화면에서 닫힌다고 설명합니다.",
      judge: "심사위원은 AI 결과가 명령이 아니라 근거가 잠긴 검토안인지 확인합니다.",
      proof: `${activeConditions}/${getDecisionConditions().length} 조건 반영 · 직접 근거 ${demoData.decision.evidence_ids.length}/${evidenceTotal}`,
      next: "지휘관 브리핑 열기",
      action: "open-briefing",
      score: 96
    },
    briefing: {
      title: "1분 브리핑과 심사 질문을 한 화면에서 닫습니다",
      pitch: "자료, 그래프, 가상부대, 3D 리허설, 실패경로, 결심카드가 심사 답변 순서로 연결됐다고 설명합니다.",
      judge: "심사위원은 시연 흐름이 기능 나열이 아니라 근거 잠금과 지휘관 승인으로 귀결되는지 봅니다.",
      proof: `질문 ${getBriefingQuestionQueue().length}건 · 근거 ${getBriefingEvidenceLockItems().length}건 · 잔여위험 ${getBriefingSnapshot().residualRisk}`,
      next: "검토 패킷 열기",
      action: "open-briefing",
      score: 98
    },
    aar: {
      title: "리허설 결과를 실행 가능한 개선안으로 넘깁니다",
      pitch: "실패경로와 결심카드에서 끝나지 않고 책임자, 기한, 근거가 있는 후속 조치로 다음 훈련 준비물을 만든다고 설명합니다.",
      judge: "심사위원은 AI 검토가 현장 조치와 재훈련 계획까지 이어지는지 확인합니다.",
      proof: `${getAarImprovementItems().length}개 조치 · ${getAarOwnerMatrix().length}개 책임 축 · 근거 ${getAarEvidenceReplayItems().length}건`,
      next: "감사 로그 확인",
      action: "open-audit",
      score: 97
    },
    audit: {
      title: "소스 투입부터 AAR까지 검증 장부로 닫습니다",
      pitch: "자료, 그래프, 에이전트, 리허설, 실패경로, 결심, AAR 조치가 같은 근거 원장에 남아 있음을 보여줍니다.",
      judge: "심사위원은 산출물이 화면용 설명이 아니라 추적 가능한 감사 기록인지 확인합니다.",
      proof: `${getAuditTrailItems().length}개 판단 이벤트 · 근거 ${getAuditEvidenceLedger().length}건 · 공백 ${getAuditCoverageSummary().gapCount}건`,
      next: "제출 패키지 확인",
      action: "open-submit",
      score: 99
    },
    submit: {
      title: "최종 제출 패키지를 한 화면에서 잠급니다",
      pitch: "브리핑, 결심카드, AAR, 감사 로그를 제출 가능한 묶음으로 만들고 빠진 게이트를 바로 확인합니다.",
      judge: "심사위원은 결과물이 시연 화면에 머무르지 않고 제출 산출물로 정리되는지 봅니다.",
      proof: `${getSubmissionBundleItems().length}개 산출물 · 준비도 ${getSubmissionReadinessScore()}% · ${getSubmissionManifest().files.length}개 파일`,
      next: "재훈련 계획 확인",
      action: "open-retrain",
      score: getSubmissionReadinessScore()
    },
    retrain: {
      title: "AAR 조치를 72시간 재훈련으로 배치합니다",
      pitch: "최종 제출 뒤에도 끝나지 않고 담당자별 훈련 과제, 검증 게이트, 직접 근거가 붙은 재훈련 계획으로 이어진다고 설명합니다.",
      judge: "심사위원은 AI 검토가 실제 다음 훈련 준비까지 연결되는지 확인합니다.",
      proof: `${getRetrainingScheduleItems().length}개 훈련 과제 · ${getRetrainingOwnerLoads().length}개 책임 축 · 검증 ${getRetrainingValidationGates().filter((item) => item.ready).length}/${getRetrainingValidationGates().length}`,
      next: "인수인계 확인",
      action: "open-handoff",
      score: 98
    },
    handoff: {
      title: "결심과 재훈련을 다음 운용자에게 넘깁니다",
      pitch: "마지막에는 결과물을 저장하는 데서 끝나지 않고, 수신자별 조치·근거·교신 문안이 묶인 인수인계 패킷으로 마감된다고 설명합니다.",
      judge: "심사위원은 산출물이 실제 교대·후속 운용으로 전달 가능한지 확인합니다.",
      proof: `${getHandoffRecipientItems().length}명 수신자 · 체크 ${getHandoffChecklistItems().filter((item) => item.ready).length}/${getHandoffChecklistItems().length} · 문안 ${getHandoffSignalItems().length}건`,
      next: "운영 지표 확인",
      action: "open-metrics",
      score: 99
    },
    metrics: {
      title: "인계 이후 상태를 운영 지표로 추적합니다",
      pitch: "위험 감소, 근거 부채, 재훈련 준비, 인계 완료율을 한 화면에서 추적해 다음 24시간 운용 리듬으로 이어진다고 설명합니다.",
      judge: "심사위원은 시연 결과가 실제 후속 운용의 상태판으로 남는지 확인합니다.",
      proof: `준비도 ${getOperationsReadinessScore()}% · 위험 ${getOperationsRiskTrend()[0]?.before || 0}->${getOperationsRiskTrend()[0]?.after || 0} · 근거 부채 ${getOperationsEvidenceDebt().length}건`,
      next: "상황 감시 확인",
      action: "open-watch",
      score: getOperationsReadinessScore()
    },
    watch: {
      title: "현장 신호가 들어오면 재판단으로 돌아갑니다",
      pitch: "결심 이후에도 끝난 화면이 아니라, 어떤 신호가 들어오면 위험·결심·근거로 복귀해야 하는지 감시 기준을 제공한다고 설명합니다.",
      judge: "심사위원은 결과물이 운용 중 재판단 체계까지 이어지는지 확인합니다.",
      proof: `감시 ${getDecisionWatchItems().length}개 · 전파 ${getWatchSignalItems().length}건 · 준비도 ${getWatchReadinessScore()}%`,
      next: "상황 일지 확인",
      action: "open-log",
      score: getWatchReadinessScore()
    },
    log: {
      title: "감시 보고를 교대 가능한 일지로 남깁니다",
      pitch: "재판단 신호와 전파 문안이 실제 운용 기록으로 남고, 다음 담당자가 확인해야 할 항목까지 닫힌다고 설명합니다.",
      judge: "심사위원은 결과물이 후속 운용의 기록과 책임 확인까지 이어지는지 확인합니다.",
      proof: `보고 ${getOperationsLogItems().length}건 · 확인 ${getLogAcknowledgementItems().filter((item) => item.done).length}/${getLogAcknowledgementItems().length} · 준비도 ${getLogReadinessScore()}%`,
      next: "반증 검증 확인",
      action: "open-challenge",
      score: getLogReadinessScore()
    },
    challenge: {
      title: "최종 결심을 반증 기준으로 한 번 더 흔듭니다",
      pitch: "B안 우선 결심이 틀릴 수 있는 조건을 먼저 열고, 반대 신호와 조치 경로가 준비됐는지 보여줍니다.",
      judge: "심사위원은 AI가 낙관 결론만 내지 않고 스스로 반박 가능한 가정을 관리하는지 확인합니다.",
      proof: `가정 ${getChallengeAssumptionItems().length}개 · 반증 ${getChallengeCounterItems().length}건 · 준비도 ${getChallengeReadinessScore()}%`,
      next: "조치 큐 확인",
      action: "open-queue",
      score: getChallengeReadinessScore()
    },
    queue: {
      title: "열린 일을 우선순위 큐로 닫습니다",
      pitch: "모든 검토 산출물이 담당자, 기한, 근거, 완료 게이트가 붙은 실행 항목으로 정렬된다고 설명합니다.",
      judge: "심사위원은 WAR GROUND가 분석 화면이 아니라 실제 후속 조치를 남기는지 확인합니다.",
      proof: `큐 ${getActionQueueItems().length}건 · 담당자 ${getActionQueueOwnerItems().length}명 · 준비도 ${getActionQueueReadinessScore()}%`,
      next: "준비 예측 확인",
      action: "open-forecast",
      score: getActionQueueReadinessScore()
    },
    forecast: {
      title: "큐 처리 속도에 따른 24시간 준비도를 예측합니다",
      pitch: "남은 조치를 지연, 기준, 가속으로 처리했을 때 준비도와 잔여 위험이 어떻게 달라지는지 보여줍니다.",
      judge: "심사위원은 후속 조치가 단순 목록이 아니라 다음 운용 판단의 전망으로 이어지는지 확인합니다.",
      proof: `예측 ${getReadinessForecastScore()}% · 시나리오 ${getForecastScenarioItems().length}개 · 병목 ${getForecastBottleneckItems().length}건`,
      next: "전파 패키지 확인",
      action: "open-broadcast",
      score: getReadinessForecastScore()
    },
    broadcast: {
      title: "예측과 큐를 수신자별 전파 문안으로 닫습니다",
      pitch: "최종적으로 지휘관, 참모, 검증관이 받을 문안과 확인 게이트까지 같은 패키지로 생성된다고 설명합니다.",
      judge: "심사위원은 분석 결과가 실제 전파와 수신 확인까지 이어지는지 확인합니다.",
      proof: `전파 ${getBroadcastReadinessScore()}% · 수신자 ${getBroadcastRecipientItems().length}명 · 문안 ${getBroadcastMessageItems().length}건`,
      next: "수신 확인",
      action: "open-receipt",
      score: getBroadcastReadinessScore()
    },
    receipt: {
      title: "전파가 실제 수신됐는지 확인합니다",
      pitch: "수신자별 확인 상태, 미확인 대상, 재전파 조치, 완료 게이트를 운용 기록으로 남긴다고 설명합니다.",
      judge: "심사위원은 결과물이 전파 생성에서 끝나지 않고 수신 확인과 재전파 책임까지 닫히는지 확인합니다.",
      proof: `수신 ${getReceiptTrackItems().filter((item) => item.ready).length}/${getReceiptTrackItems().length} · 미확인 ${getReceiptTrackItems().filter((item) => !item.ready).length}명 · 준비도 ${getReceiptReadinessScore()}%`,
      next: "종결 보고 확인",
      action: "open-closeout",
      score: getReceiptReadinessScore()
    },
    closeout: {
      title: "수신과 예외까지 종결 보고로 잠급니다",
      pitch: "결심, 제출물, 수신 확인, 미결 예외, 보관 산출물이 하나의 운용 종결 보고로 남는다고 설명합니다.",
      judge: "심사위원은 시연이 화면 전환으로 끝나지 않고 다음 운용자가 받을 기록으로 닫히는지 확인합니다.",
      proof: "결심·수신·예외·보관 산출물 잠금",
      next: "교훈 라이브러리 확인",
      action: "open-lessons",
      score: 94
    }
  };
  return {
    step: stageIndex > 0 ? `${String(stageIndex).padStart(2, "0")}/24` : "시연",
    ...(base[state.currentStage] || base.data)
  };
}

function getDemoJudgeDefenseItems() {
  const selectedFailure = getFailureById(state.selectedFailureId);
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const stageDefense = {
    data: {
      question: state.scenarioLoaded ? "이게 단순 목업 입력이 아니라 판단 데이터라는 근거는?" : "자료가 없을 때 AI가 임의 결심을 내리지는 않나?",
      answer: state.scenarioLoaded ? "자료 종류, 추출 필드, 방책 비교, 준비 상태가 같은 작전 키로 동시에 갱신됩니다." : "접수 전에는 결심 근거와 방책 산출을 잠그고 대기값만 보여줍니다.",
      location: state.scenarioLoaded ? "작전계획 추출 필드와 A/B/C 방책 비교" : "자료 투입 빈 상태와 운용 준비 상태"
    },
    ontology: {
      question: "왜 B안인지 설명 가능한가?",
      answer: "결심 노드에서 문서 근거, 참모 발언, 실패경로가 한 경로로 역추적됩니다.",
      location: "그래프 인스펙터와 근거 추적 버튼"
    },
    agents: {
      question: "다중 에이전트가 이름만 다른 챗봇 아닌가?",
      answer: "23개 역할이 참모, 현장, 대항군, 전장 변수로 나뉘고 산출물과 인계 대상이 다릅니다.",
      location: "가상부대 프로필과 합의 로그"
    },
    rehearsal: {
      question: "3D 장면이 의사결정에 어떤 값을 주나?",
      answer: activeEvent ? `${activeEvent.time} 이벤트가 실패경로, 차단점, 결심 조건으로 바로 연결됩니다.` : "시간순 마찰이 발생하면 3D 브리핑, 무전 로그, 실패경로가 같은 이벤트 ID로 갱신됩니다.",
      location: activeEvent ? "3D 판단 브리핑과 현재 이벤트 카드" : "수행 리허설 실행 후 이벤트 스크러버"
    },
    risk: {
      question: "위험 점수가 실제 조치 우선순위로 이어지나?",
      answer: `${selectedFailure.title}의 차단 지점, 조기 경고, 완화 조치가 결심카드 실행 항목으로 이어집니다.`,
      location: "현재 선택한 흐름과 바로 막는 조치"
    },
    decision: {
      question: "AI가 명령을 대신 내리는 것처럼 보이지 않나?",
      answer: "최종 화면은 검토안이며 승인 게이트, 지휘관 확인, human-in-the-loop 문구를 유지합니다.",
      location: "승인 게이트와 최종 승인 흐름"
    },
    briefing: {
      question: "전체 시연을 한 문장으로 요약하면 무엇인가?",
      answer: "작전 자료를 근거 그래프로 잠그고 3D 리허설에서 생긴 위험을 결심카드와 브리핑 패킷으로 닫는 도구입니다.",
      location: "브리핑 런웨이와 심사 질문"
    },
    audit: {
      question: "시연이 끝난 뒤 무엇이 검증 기록으로 남나?",
      answer: "소스 투입부터 AAR 조치까지 판단 이벤트, 근거 원장, 검증 공백이 한 장부에 남습니다.",
      location: "감사 로그 타임라인과 근거 원장"
    },
    submit: {
      question: "최종 제출물은 어디서 확인하나?",
      answer: "제출 패키지 화면에서 브리핑, 결심카드, AAR, 감사 로그 산출물과 준비 게이트를 한 번에 확인합니다.",
      location: "제출 준비도와 산출물 묶음"
    },
    retrain: {
      question: "시연 뒤 실제 개선은 어떻게 이어지나?",
      answer: "AAR 조치를 72시간 일정, 담당자별 훈련 과제, 검증 게이트로 바꿔 다음 훈련 전 확인할 수 있습니다.",
      location: "재훈련 일정과 검증 게이트"
    },
    handoff: {
      question: "다음 담당자가 무엇을 먼저 해야 하나?",
      answer: "인수인계 센터에서 수신자별 패킷, 교신 문안, 확인 체크를 분리해 첫 조치부터 볼 수 있습니다.",
      location: "수신자별 인계와 교신 문안"
    },
    metrics: {
      question: "인수인계 뒤에도 상태를 추적할 수 있나?",
      answer: `운영 지표 화면에서 준비도 ${getOperationsReadinessScore()}%, 위험 추세, 근거 부채, 24시간 확인 리듬을 같이 봅니다.`,
      location: "운영 지표판과 위험 추세"
    },
    watch: {
      question: "현장 상황이 바뀌면 언제 결심을 다시 봐야 하나?",
      answer: "상황 감시 화면에서 보고 누락, 보급 대기, 후송 지연, 전환 승인 지연을 임계값과 전파 문안으로 추적합니다.",
      location: "재판단 감시와 트리거 보드"
    },
    log: {
      question: "감시 뒤 실제 기록은 어디에 남나?",
      answer: "상황 일지에서 감시 보고, 확인 상태, 다음 조치, 인계 참조를 시간순 기록으로 남깁니다.",
      location: "보고 타임라인과 확인 기록"
    },
    challenge: {
      question: "AI가 자기 결론을 반박하는 기준도 갖고 있나?",
      answer: "반증 검증에서 B안 결심의 핵심 가정, 반대 신호, 위험·근거·결심 복귀 조치를 함께 잠급니다.",
      location: "가정 보드와 반증 신호"
    },
    queue: {
      question: "분석 뒤 실제로 남는 할 일은 무엇인가?",
      answer: "조치 큐에서 AAR, 감시, 반증, 재훈련 산출물을 담당자·기한·근거가 있는 우선순위 작업으로 정리합니다.",
      location: "우선순위 큐와 담당자 부하"
    },
    forecast: {
      question: "그 조치를 처리하면 다음 운용 준비도는 얼마나 오르나?",
      answer: "준비 예측에서 지연, 기준, 가속 처리 시나리오별 준비도, 잔여 위험, 병목 게이트를 비교합니다.",
      location: "예측 시나리오와 병목 신호"
    },
    broadcast: {
      question: "분석 결과를 실제 운용자에게 어떻게 전달하나?",
      answer: "전파 패키지에서 수신자별 문안, 근거 링크, 큐 영향, 수신 확인 게이트를 같이 생성합니다.",
      location: "수신자별 문안과 확인 게이트"
    },
    receipt: {
      question: "전파 이후 확인이 안 된 대상은 어떻게 추적하나?",
      answer: "수신 확인 화면에서 확인·대기·재전파 상태를 분리하고 근거, 큐, 일지로 바로 연결합니다.",
      location: "수신 추적과 미확인 대상"
    },
    closeout: {
      question: "마지막에 무엇이 실제 기록으로 남나?",
      answer: "종결 보고에서 결심, 수신 확인, 예외 책임, 보관 산출물을 한 패킷으로 잠그고 저장할 수 있습니다.",
      location: "종결 준비도, 예외 처리, 보관 산출물"
    },
    lessons: {
      question: "종결 보고가 다음 훈련에 어떻게 재사용되나?",
      answer: "교훈 라이브러리에서 반복 위험, 결심 조건, 근거 부채, 재훈련 전환을 다음 작전 체크로 남깁니다.",
      location: "판단 패턴과 재사용 체크"
    },
    nextop: {
      question: "다음 작전은 무엇을 들고 시작하나?",
      answer: "다음 작전 템플릿에서 임무 시드, 통신 제약, 결심 조건, 위험 감시, 훈련 삽입 패킷을 바로 저장합니다.",
      location: "작전 시드, 초기 제약, 템플릿 패킷"
    },
    prefill: {
      question: "새 작전 접수 화면은 무엇이 미리 채워지나?",
      answer: "초기 접수 프리필에서 자료 매니페스트, 임무·시간·통신·방책 필드, 첫 판단 게이트를 사전 입력값으로 잠급니다.",
      location: "자료 매니페스트, 접수 필드, 접수 게이트"
    }
  };
  const item = stageDefense[state.currentStage] || stageDefense.data;
  return [
    { label: "예상 질문", value: item.question, detail: "심사 Q&A" },
    { label: "답변 프레임", value: item.answer, detail: "30초 답변" },
    { label: "보여줄 위치", value: item.location, detail: "화면 포인터" }
  ];
}

function getDemoRunSheetItems() {
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const selectedFailure = getFailureById(state.selectedFailureId);
  const activeConditions = getActiveDecisionConditionIds().size;
  return [
    {
      stage: "data",
      time: "00:00",
      label: "작전계획 접수",
      talk: "문서가 임무, 제한사항, 방책 비교로 구조화됩니다.",
      proof: state.scenarioLoaded ? `${demoData.operationPlan.documents.length}종 자료` : "입력 잠금"
    },
    {
      stage: "ontology",
      time: "00:45",
      label: "근거 지도",
      talk: "왜 B안인지 문서와 판단 경로로 역추적합니다.",
      proof: `${graph.nodes.length}개 노드`
    },
    {
      stage: "agents",
      time: "01:25",
      label: "가상부대 검토",
      talk: "역할별 에이전트가 서로 다른 허점을 찾아냅니다.",
      proof: `${state.generatedAgentCount}/${demoData.agents.length} 역할`
    },
    {
      stage: "rehearsal",
      time: "02:05",
      label: "3D 리허설",
      talk: "지형 위 마찰이 실패경로와 결심 조건으로 이어집니다.",
      proof: activeEvent ? `${activeEvent.time} 이벤트` : "이벤트 대기"
    },
    {
      stage: "risk",
      time: "03:10",
      label: "실패경로 압축",
      talk: "점수가 높은 흐름을 차단 지점과 즉시 조치로 바꿉니다.",
      proof: `${selectedFailure.title} ${selectedFailure.score}`
    },
    {
      stage: "decision",
      time: "04:05",
      label: "결심카드 승인",
      talk: "AI 검토안은 승인 게이트와 지휘관 확인 뒤에만 닫힙니다.",
      proof: `${activeConditions}/${getDecisionConditions().length} 게이트`
    },
    {
      stage: "briefing",
      time: "04:45",
      label: "심사 브리핑",
      talk: "1분 설명, 예상 질문, 근거 잠금을 한 화면에서 확인합니다.",
      proof: `${getBriefingQuestionQueue().length}개 질문`
    },
    {
      stage: "aar",
      time: "05:10",
      label: "AAR 개선안",
      talk: "리허설 마찰을 책임자와 기한이 있는 후속 조치로 전환합니다.",
      proof: `${getAarImprovementItems().length}개 조치`
    },
    {
      stage: "audit",
      time: "05:35",
      label: "감사 로그",
      talk: "소스 투입부터 AAR까지 판단 이벤트와 근거 원장을 검증합니다.",
      proof: `${getAuditTrailItems().length}개 이벤트`
    },
    {
      stage: "submit",
      time: "05:55",
      label: "제출 패키지",
      talk: "최종 산출물 묶음과 제출 전 게이트를 잠급니다.",
      proof: `${getSubmissionBundleItems().length}개 산출물`
    },
    {
      stage: "retrain",
      time: "06:15",
      label: "재훈련 계획",
      talk: "AAR 조치를 72시간 재훈련 과제와 검증 게이트로 전환합니다.",
      proof: `${getRetrainingScheduleItems().length}개 훈련 과제`
    },
    {
      stage: "handoff",
      time: "06:35",
      label: "인수인계",
      talk: "최종 결심과 재훈련 계획을 수신자별 인계 패킷으로 전달합니다.",
      proof: `${getHandoffRecipientItems().length}명 수신자`
    },
    {
      stage: "metrics",
      time: "06:55",
      label: "운영 지표",
      talk: "인계 이후 위험, 근거, 재훈련 준비도를 운영 상태판으로 추적합니다.",
      proof: `준비도 ${getOperationsReadinessScore()}%`
    },
    {
      stage: "watch",
      time: "07:15",
      label: "상황 감시",
      talk: "현장 신호가 임계값을 넘으면 위험, 결심, 근거 화면으로 바로 되돌아갑니다.",
      proof: `${getDecisionWatchItems().length}개 트리거`
    },
    {
      stage: "log",
      time: "07:35",
      label: "상황 일지",
      talk: "감시 보고와 전파 문안을 교대 가능한 운용 기록으로 남깁니다.",
      proof: `${getOperationsLogItems().length}건 기록`
    },
    {
      stage: "challenge",
      time: "07:55",
      label: "반증 검증",
      talk: "최종 결심이 틀릴 수 있는 가정과 반대 신호를 한 번 더 검토합니다.",
      proof: `${getChallengeAssumptionItems().length}개 가정`
    },
    {
      stage: "queue",
      time: "08:15",
      label: "조치 큐",
      talk: "열린 산출물을 담당자, 기한, 근거가 있는 실행 항목으로 정렬합니다.",
      proof: `${getActionQueueItems().length}건 조치`
    },
    {
      stage: "forecast",
      time: "08:35",
      label: "준비 예측",
      talk: "큐 처리 속도별 준비도와 잔여 위험을 다음 운용 판단으로 예측합니다.",
      proof: `${getReadinessForecastScore()}% 전망`
    },
    {
      stage: "broadcast",
      time: "08:55",
      label: "전파 패키지",
      talk: "예측과 큐를 수신자별 문안과 확인 게이트로 전달합니다.",
      proof: `${getBroadcastRecipientItems().length}명 수신자`
    },
    {
      stage: "receipt",
      time: "09:15",
      label: "수신 확인",
      talk: "전파 이후 확인·대기·재전파 상태를 운용 기록으로 남깁니다.",
      proof: `${getReceiptTrackItems().filter((item) => item.ready).length}/${getReceiptTrackItems().length} 확인`
    },
    {
      stage: "closeout",
      time: "09:35",
      label: "종결 보고",
      talk: "결심, 수신, 예외, 보관 산출물을 다음 운용자용 종결 기록으로 잠급니다.",
      proof: "기록 잠금"
    }
  ];
}

function shouldShowStartOnlyCue() {
  return state.currentStage === "data" && !state.scenarioLoaded;
}

function setTopCueVisibility(target, visible) {
  target.hidden = !visible;
  target.setAttribute("aria-hidden", String(!visible));
  if (!visible) target.innerHTML = "";
}

function renderDemoRunSheet() {
  const target = byId("demoRunSheet");
  if (!target) return;
  const visible = shouldShowStartOnlyCue();
  setTopCueVisibility(target, visible);
  if (!visible) return;
  const items = getDemoRunSheetItems();
  const activeIndex = Math.max(0, items.findIndex((item) => item.stage === state.currentStage));
  const activeItem = items[activeIndex] || items[0];
  target.innerHTML = `
    <header>
      <span>5분 러닝오더</span>
      <b>${activeItem.time} · ${activeItem.label}</b>
    </header>
    <ol>
      ${items.map((item, index) => {
        const statusClass = index < activeIndex ? "is-complete" : index === activeIndex ? "is-active" : "";
        return `
          <li class="${statusClass}" data-demo-run-stage="${item.stage}">
            <span>${item.time}</span>
            <b>${item.label}</b>
            <em>${item.talk}</em>
            <strong>${item.proof}</strong>
          </li>
        `;
      }).join("")}
    </ol>
  `;
}

function renderDemoJudgeCue() {
  const target = byId("demoJudgeCue");
  if (!target) return;
  const visible = shouldShowStartOnlyCue();
  setTopCueVisibility(target, visible);
  if (!visible) return;
  const cue = getDemoJudgeCue();
  const defenseItems = getDemoJudgeDefenseItems();
  target.innerHTML = `
    <div class="demo-cue-head">
      <span>심사 시연 큐</span>
      <b>${cue.title}</b>
      <em>${cue.step} · ${cue.score}%</em>
    </div>
    <p>${cue.pitch}</p>
    <div class="demo-cue-grid">
      <article><span>심사위원 체크</span><b>${cue.judge}</b></article>
      <article><span>증명 포인트</span><b>${cue.proof}</b></article>
      <article><span>다음 클릭</span><b>${cue.next}</b></article>
    </div>
    <div class="demo-cue-defense-grid" aria-label="심사 예상 질문 대응">
      ${defenseItems.map((item) => `
        <article>
          <span>${item.label}</span>
          <b>${item.value}</b>
          <em>${item.detail}</em>
        </article>
      `).join("")}
    </div>
    <button class="demo-cue-action" type="button" data-demo-cue-action="${cue.action}">
      <i data-lucide="arrow-right" aria-hidden="true"></i><span>${cue.next}</span>
    </button>
  `;
  refreshIcons();
}

function runDemoCueAction(action) {
  if (action === "load-scenario") {
    loadScenario();
    return;
  }
  if (action === "open-graph") {
    setStage("ontology");
    setGraphMode("all");
    selectNode("decision");
    return;
  }
  if (action === "generate-agents") {
    if (!state.scenarioLoaded) loadScenario();
    else generateAgents();
    return;
  }
  if (action === "run-rehearsal") {
    runRehearsal();
    return;
  }
  if (action === "open-risk") {
    setStage("risk");
    selectFailurePath(state.selectedFailureId);
    return;
  }
  if (action === "open-decision") {
    setStage("decision");
    setDecisionTab("card");
    return;
  }
  if (action === "open-briefing") {
    openBriefingSheet();
    return;
  }
  if (action === "open-aar") {
    setStage("aar");
    return;
  }
  if (action === "open-audit") {
    setStage("audit");
    return;
  }
  if (action === "open-submit") {
    setStage("submit");
    return;
  }
  if (action === "open-retrain") {
    setStage("retrain");
    return;
  }
  if (action === "open-handoff") {
    setStage("handoff");
    return;
  }
  if (action === "open-metrics") {
    setStage("metrics");
    return;
  }
  if (action === "open-watch") {
    setStage("watch");
    return;
  }
  if (action === "open-log") {
    setStage("log");
    return;
  }
  if (action === "open-challenge") {
    setStage("challenge");
    return;
  }
  if (action === "open-queue") {
    setStage("queue");
    return;
  }
  if (action === "open-forecast") {
    setStage("forecast");
    return;
  }
  if (action === "open-broadcast") {
    setStage("broadcast");
    return;
  }
  if (action === "open-receipt") {
    setStage("receipt");
    return;
  }
  if (action === "open-closeout") {
    setStage("closeout");
    return;
  }
  if (action === "open-lessons") {
    setStage("lessons");
    return;
  }
  if (action === "open-nextop") {
    setStage("nextop");
    return;
  }
  if (action === "open-prefill") {
    setStage("prefill");
  }
}

function renderPageBriefings() {
  const activePage = document.querySelector(".page-view.is-active[data-page]")
    || document.querySelector(`.page-view[data-page="${state.currentStage}"]`)
    || document.querySelector(".page-view[data-page]");
  const pages = activePage ? [activePage] : [];
  pages.forEach((page) => {
    const heading = page.querySelector(":scope > .page-heading");
    if (!heading) return;
    const rail = ensurePageSideRail(page, heading);
    renderMissionActionPanel(rail, page);
    let briefing = rail.querySelector(":scope > .page-briefing-strip") || page.querySelector(":scope > .page-briefing-strip");
    if (!briefing) {
      briefing = document.createElement("section");
      briefing.className = "page-briefing-strip";
      briefing.setAttribute("aria-label", "페이지 브리핑");
      rail.appendChild(briefing);
    } else if (briefing.parentElement !== rail) {
      rail.appendChild(briefing);
    }
    briefing.innerHTML = renderInfoTileItems(getPageBriefingItems(page.dataset.page));
    renderPageInsights(page, briefing);
    if (page.dataset.page === "risk") {
      keepFailureStoryInReportBody(page);
    } else {
      const failureStory = page.querySelector(".selected-failure-story");
      if (failureStory && failureStory.parentElement !== rail) rail.appendChild(failureStory);
    }
  });
  renderDemoRunSheet();
  renderDemoJudgeCue();
  const pageRenderers = {
    briefing: renderBriefingRunway,
    aar: renderAarImprovementPlan,
    audit: renderAuditLogbook,
    submit: renderSubmissionPackage,
    retrain: renderRetrainingPlan,
    handoff: renderHandoffCenter,
    metrics: renderOperationsMetrics,
    watch: renderDecisionWatch,
    log: renderOperationsLog,
    challenge: renderChallengeReview,
    queue: renderActionQueue,
    forecast: renderReadinessForecast,
    broadcast: renderBroadcastPackage,
    receipt: renderReceiptTracker,
    closeout: renderCloseoutReport,
    lessons: renderLessonsLibrary,
    nextop: renderNextOperationTemplate,
    prefill: renderIntakePrefill
  };
  pageRenderers[state.currentStage]?.();
}

function getAgentById(agentId) {
  return demoData.agents.find((agent) => agent.id === agentId);
}

function getAgentProfile(agent) {
  const unit = agentUnitProfiles[agent.id] || {};
  const layer = agentLayerMeta[agent.layer] || {};
  return {
    ...agent,
    callsign: unit.callsign || agent.name.slice(0, 2),
    faction: unit.faction || "blue",
    factionLabel: unit.factionLabel || layerLabels[agent.layer] || "가상부대",
    unitClass: unit.unitClass || layer.code || "Agent Unit",
    portrait: unit.portrait || agent.layer,
    temperament: unit.temperament || "분석형",
    specialty: unit.specialty || agent.role,
    traits: unit.traits || agent.risk_focus,
    loadout: unit.loadout || ["작전 데이터"],
    quote: unit.quote || agent.role,
    layerCode: layer.code || "AGENT",
    layerBrief: layer.brief || "",
    personIcon: unit.personIcon || getAgentPersonIcon({ ...agent, ...unit })
  };
}

function getAgentFactionClass(profile) {
  return profile.faction === "opfor" ? "is-opfor" : `is-${profile.faction}`;
}

function matchesAgentFilter(profile) {
  return state.agentFilter === "all" || profile.faction === state.agentFilter;
}

function getAgentMetrics(agent, profile) {
  const factionBase = {
    blue: { command: 66, mobility: 58, support: 70, threat: 34, control: 62 },
    opfor: { command: 44, mobility: 72, support: 34, threat: 92, control: 54 },
    environment: { command: 32, mobility: 52, support: 66, threat: 72, control: 42 },
    control: { command: 72, mobility: 32, support: 58, threat: 26, control: 94 }
  };
  const layerBoost = {
    staff: { command: 12, mobility: 0, support: 4, threat: 0, control: 9 },
    field: { command: 2, mobility: 13, support: 8, threat: 0, control: 1 },
    environment: { command: 0, mobility: 5, support: 3, threat: 8, control: 0 }
  };
  const confidenceBoost = Math.round((agent.confidence - 0.75) * 60);
  const base = factionBase[profile.faction] || factionBase.blue;
  const boost = layerBoost[agent.layer] || {};

  return Object.fromEntries(
    Object.entries(agentMetricLabels).map(([key]) => [
      key,
      clamp((base[key] || 50) + (boost[key] || 0) + confidenceBoost, 12, 99)
    ])
  );
}

function getAgentGrade(score) {
  if (score >= 90) return "S";
  if (score >= 82) return "A";
  if (score >= 74) return "B";
  return "C";
}

function getAgentBattleLane(agent, profile) {
  if (profile.faction === "opfor") return "대항 축";
  if (profile.faction === "control") return "판정 축";
  if (profile.faction === "environment") return "변수 축";
  if (agent.layer === "field") return "수행 축";
  return "지휘 축";
}

function getRelatedEvents(agent) {
  return demoData.events.filter((event) => event.agents.includes(agent.name));
}

function getSynergyAgents(agent) {
  const linkedNames = new Set();
  getRelatedEvents(agent).forEach((event) => {
    event.agents.forEach((name) => {
      if (name !== agent.name) linkedNames.add(name);
    });
  });
  const eventLinked = Array.from(linkedNames)
    .map((name) => demoData.agents.find((candidate) => candidate.name === name))
    .filter(Boolean);
  const overlapLinked = demoData.agents
    .filter((candidate) => candidate.id !== agent.id)
    .filter((candidate) => candidate.risk_focus.some((risk) => agent.risk_focus.includes(risk)))
    .filter((candidate) => !eventLinked.some((linked) => linked.id === candidate.id));
  return [...eventLinked, ...overlapLinked].slice(0, 4);
}

function getAgentRiskTargets(agent, profile) {
  const focusText = agent.risk_focus.join(" ");
  const matches = demoData.failures
    .filter((failure) => {
      const failureText = [failure.title, failure.mitigation, ...failure.chain].join(" ");
      return agent.risk_focus.some((risk) => failureText.includes(risk) || risk.includes(failure.title));
    })
    .map((failure) => ({
      title: failure.title,
      score: failure.score,
      mode: profile.faction === "opfor" ? "공격" : "차단"
    }));

  if (matches.length) return matches.slice(0, 3);
  return agent.risk_focus.slice(0, 3).map((risk) => ({
    title: risk,
    score: null,
    mode: profile.faction === "opfor" || focusText.includes("적") ? "압박" : "감시"
  }));
}

function getAgentCoaAffinity(agent, profile) {
  const metrics = getAgentMetrics(agent, profile);
  const text = `${profile.specialty} ${profile.traits.join(" ")} ${agent.risk_focus.join(" ")}`;
  const scoreA = clamp(
    Math.round(32 + metrics.mobility * 0.3 + metrics.threat * 0.28 + (text.includes("A안") || text.includes("최단") || text.includes("적") ? 16 : 0)),
    20,
    99
  );
  const scoreB = clamp(
    Math.round(34 + metrics.support * 0.34 + metrics.control * 0.22 + metrics.command * 0.16 + (text.includes("통신") || text.includes("보급") || text.includes("후송") ? 12 : 0)),
    20,
    99
  );
  const scoreC = clamp(
    Math.round(30 + metrics.control * 0.34 + metrics.command * 0.2 + metrics.support * 0.14 + (text.includes("예비") || text.includes("재판단") || text.includes("전환") ? 16 : 0)),
    20,
    99
  );

  return demoData.coas.map((coa) => ({
    id: coa.id,
    name: coa.name,
    score: { A: scoreA, B: scoreB, C: scoreC }[coa.id]
  }));
}

function getAgentTacticalDossier(agent, profile) {
  const coaAffinity = getAgentCoaAffinity(agent, profile);
  const peak = Math.max(...coaAffinity.map((coa) => coa.score), Math.round(agent.confidence * 100));
  const primaryAction = {
    blue: "보완 조건 실행",
    opfor: "취약점 공격",
    environment: "전장 변수 주입",
    control: "근거/규정 잠금"
  }[profile.faction] || "조건 검증";

  return {
    grade: getAgentGrade(peak),
    lane: getAgentBattleLane(agent, profile),
    primaryAction,
    eventCount: getRelatedEvents(agent).length,
    synergies: getSynergyAgents(agent),
    risks: getAgentRiskTargets(agent, profile),
    coaAffinity
  };
}

function renderAgentFilterControls() {
  const target = byId("agentFilterControls");
  if (!target) return;
  target.querySelectorAll("[data-agent-filter]").forEach((button) => {
    const active = button.dataset.agentFilter === state.agentFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function renderAgentFormationSummary() {
  const target = byId("agentFormationSummary");
  if (!target) return;
  const factions = ["blue", "opfor", "environment", "control"];
  target.innerHTML = factions
    .map((faction) => {
      const items = demoData.agents.filter((agent) => getAgentProfile(agent).faction === faction);
      const ready = items.filter((agent) => agent.status !== "대기").length;
      const percent = items.length ? Math.round((ready / items.length) * 100) : 0;
      const active = state.agentFilter === faction;
      return `
        <button class="formation-tile is-${faction} ${active ? "is-active" : ""}" type="button" data-agent-filter="${faction}" aria-pressed="${active ? "true" : "false"}">
          <span>${agentFilterLabels[faction]}</span>
          <b>${items.length}</b>
          <em>${ready}/${items.length} 준비</em>
          <i><span style="width: ${percent}%"></span></i>
        </button>
      `;
    })
    .join("");
}

function setAgentFilter(filter) {
  if (!Object.hasOwn(agentFilterLabels, filter)) return;
  state.agentFilter = filter;
  const selected = getAgentById(state.selectedAgentId);
  if (filter !== "all" && selected && !matchesAgentFilter(getAgentProfile(selected))) {
    const firstMatch = demoData.agents.find((agent) => matchesAgentFilter(getAgentProfile(agent)));
    if (firstMatch) state.selectedAgentId = firstMatch.id;
  }
  renderAgentLayers();
}

function makeSvg(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

const ONTOLOGY_SAFE_MIN_Y = 84;
const ONTOLOGY_SAFE_MAX_Y = 560;
const ONTOLOGY_VIEWBOX_WIDTH = 1000;
const ONTOLOGY_VIEWBOX_HEIGHT = 620;

function getOntologyEntityNames(groupKey) {
  const entityNames = {
    planSeed: ["H-Hour", "1단계 돌파", "2단계 확보", "통제선 Alpha", "통제선 Bravo", "완료조건", "예비축", "분기점 04:20"],
    assetSeed: ["K2 전차", "K21 장갑차", "K9 자주포", "UAV 정찰", "공병 장비", "의무차량", "전술무전", "중계차량", "연료차량", "정비반"],
    terrainSeed: ["한강 이남", "능선 314", "협곡 진입부", "교량 Node-7", "우회로 B2", "가시권 차폐", "통신 음영", "하천 장애", "고지 관측", "후송로 Delta"],
    logSeed: ["보급대기점", "탄약 적재율", "연료 지속", "정비 소요", "후송 시간", "예비 부품", "급유 창"],
    ruleSeed: ["재판단 기준", "중단 조건", "승인권자", "보고 주기", "우회 승인", "증원 요청", "민간 피해 제한"],
    coreEdge: ["A안 속도", "A안 노출", "협곡 병목", "통신 취약", "연막 조건", "정찰 선행", "차단점", "공병 지원"],
    coreRoute: ["B안 안정성", "우회 거리", "보급 여유", "중계 확보", "후송 가능", "기동 여유", "예비축 연결", "재편성 지점"],
    agentTalk: ["통신 반론", "지형 반론", "군수 보완", "레드팀 가정", "COA 비교", "위험 가중치", "중계 제안", "재판단 발언", "노출 검증", "보급 검증", "정찰 요청", "결심 후보"],
    relayExpand: ["C1 중계", "C2 중계", "안테나 고도", "통신 복구", "보고 지연", "백업망", "전파 차폐"],
    riskExpand: ["지휘공백", "장비 노출", "협곡 지연", "적 차단", "보고 단절", "후송 지연", "우회 실패", "가시권 상실"],
    decisionTrace: ["B안 우선", "A안 조건부", "04:20 재판단", "보급 보강", "중계 삽입", "정찰 선행", "우회 권고", "결심카드"]
  };
  return entityNames[groupKey] || [];
}

function buildGraph() {
  const nodes = [
    { id: "docPlan", kind: "document", tier: "key", x: 226, y: 164, size: 9, label: "작전계획서", meta: "OPORD", detail: "임무, 시간축, 단계, 통제선을 온톨로지 시드로 변환하는 원천 계획.", evidence_ids: ["ev_plan_mission"] },
    { id: "docEquipment", kind: "document", tier: "key", x: 190, y: 292, size: 10, label: "아군 장비 제원", meta: "BLUE ASSET", detail: "K2, K21, K9, 드론, 통신장비의 속도, 화력, 항속, 통신범위를 엔티티로 생성.", evidence_ids: ["ev_coa_b", "ev_plan_mission"] },
    { id: "docComm", kind: "document", tier: "key", x: 292, y: 424, size: 9, label: "지형·통신 모델", meta: "TERRAIN", detail: "능선, 협곡, 통신 음영, 중계 후보를 같은 좌표 기준으로 정규화.", evidence_ids: ["ev_comm_gap", "ev_weather_fog"] },
    { id: "docLog", kind: "document", tier: "key", x: 442, y: 512, size: 8, label: "군수 지속성", meta: "LOG XLSX", detail: "보급 대기점, 정비 제한, 연료 지속성을 작전 제약 속성으로 변환.", evidence_ids: ["ev_logistics_supply"] },
    { id: "docSop", kind: "document", tier: "key", x: 562, y: 466, size: 8, label: "SOP·재판단", meta: "RULE", detail: "중단, 전환, 증원 요청 기준을 결심 검증 규칙으로 연결.", evidence_ids: ["ev_sop_criteria"] },
    { id: "missionSchema", kind: "schema", tier: "key", x: 392, y: 184, size: 9, label: "임무·시간축", meta: "SCHEMA", detail: "작전명, H-hour, 단계, 통제선, 완료 조건을 시간 그래프로 잠금.", evidence_ids: ["ev_plan_mission"] },
    { id: "assetSchema", kind: "schema", tier: "key", x: 350, y: 300, size: 9, label: "아군 제대·장비", meta: "ENTITY", detail: "부대, 장비, 가용수량, 이동성, 통신범위를 관계형 엔티티로 구성.", evidence_ids: ["ev_coa_b", "ev_plan_mission"] },
    { id: "terrainSchema", kind: "schema", tier: "key", x: 440, y: 392, size: 9, label: "지형·통신권역", meta: "GEO ENTITY", detail: "고도, 협곡, 가시권, 통신권역을 방책 경로와 연결.", evidence_ids: ["ev_comm_gap", "ev_weather_fog"] },
    { id: "constraintSchema", kind: "schema", tier: "key", x: 526, y: 452, size: 8, label: "제약·지속성", meta: "CONSTRAINT", detail: "보급, 정비, 후송, 기상 조건을 위험 발생 조건으로 정규화.", evidence_ids: ["ev_logistics_supply", "ev_evac_route"] },
    { id: "ruleSchema", kind: "schema", tier: "key", x: 570, y: 330, size: 8, label: "판단 규칙", meta: "SOP GATE", detail: "재판단 시각, 중단 조건, 승인 권한을 결심 카드 검증 규칙으로 유지.", evidence_ids: ["ev_sop_criteria"] },
    { id: "graphCore", kind: "ontology", tier: "key", x: 500, y: 314, size: 18, label: "작전 지식 그래프", meta: "ONTOLOGY CORE", detail: "자료 엔티티, 속성, 제약, 방책, 위험을 같은 작전 의미망으로 묶은 중심 그래프.", evidence_ids: ["ev_plan_mission", "ev_coa_b", "ev_comm_gap", "ev_logistics_supply", "ev_sop_criteria"] },
    { id: "coaA", kind: "coa", tier: "key", x: 586, y: 202, size: 9, label: "A안 최단경로", meta: "COA / FAST", detail: "속도는 빠르지만 통신 음영, 협곡, 적 지연행동이 한 지점에 겹치는 후보.", evidence_ids: ["ev_coa_a", "ev_comm_gap"] },
    { id: "coaB", kind: "coa", tier: "key", x: 622, y: 420, size: 10, label: "B안 우회경로", meta: "COA / STABLE", detail: "시간은 늘지만 장비 운용, 통신, 보급 위험을 분산하는 추천 후보.", evidence_ids: ["ev_coa_b", "ev_logistics_supply"] },
    { id: "commAgent", kind: "agent", tier: "key", x: 678, y: 148, size: 8, label: "통신참모", meta: "AGENT", detail: "지형·통신권역 노드를 검토하고 예비 중계 확장 노드를 제안.", evidence_ids: ["ev_comm_gap"] },
    { id: "terrainAgent", kind: "agent", tier: "key", x: 714, y: 272, size: 8, label: "지형분석", meta: "AGENT", detail: "협곡, 능선, 후송로 제약을 방책별 취약 지점으로 토론.", evidence_ids: ["ev_comm_gap", "ev_evac_route"] },
    { id: "logAgent", kind: "agent", tier: "key", x: 700, y: 392, size: 8, label: "군수참모", meta: "AGENT", detail: "장비 지속성과 보급 대기점 부족을 그래프에 위험 조건으로 추가.", evidence_ids: ["ev_logistics_supply"] },
    { id: "redAgent", kind: "agent", tier: "key", x: 656, y: 506, size: 8, label: "레드팀", meta: "AGENT", detail: "적 지연행동과 아군 장비 운용 제약이 겹치는 실패경로를 제시.", evidence_ids: ["ev_redteam_delay"] },
    { id: "debateRelay", kind: "debate", tier: "key", x: 780, y: 190, size: 7, label: "예비 중계 삽입", meta: "토론 확장", detail: "통신참모가 C1 중계 후보를 그래프에 추가해 A안 조건부 보완안을 생성.", evidence_ids: ["ev_comm_gap"] },
    { id: "debateTerrain", kind: "debate", tier: "key", x: 812, y: 306, size: 7, label: "협곡 노출 반론", meta: "토론 확장", detail: "지형분석과 레드팀이 A안 협곡 통과 시 장비 기동 폭과 시야 제약을 반론으로 연결.", evidence_ids: ["ev_redteam_delay", "ev_comm_gap"] },
    { id: "debateSupply", kind: "debate", tier: "key", x: 782, y: 426, size: 7, label: "보급대기점 보강", meta: "토론 확장", detail: "군수참모가 B안 우회축의 추가 보급 대기점과 정비 여유를 그래프에 확장.", evidence_ids: ["ev_logistics_supply"] },
    { id: "debateRule", kind: "debate", tier: "key", x: 708, y: 540, size: 7, label: "04:20 재판단", meta: "토론 확장", detail: "SOP 기준을 결심 전 확인해야 할 명시 조건으로 승격.", evidence_ids: ["ev_sop_criteria"] },
    { id: "riskCmdGap", kind: "risk", tier: "key", x: 872, y: 248, size: 9, label: "지휘공백", meta: "RISK 92", detail: "통신 음영과 적 지연행동이 결합되어 보고 갱신이 끊기는 실패경로.", evidence_ids: ["ev_comm_gap", "ev_redteam_delay"] },
    { id: "riskExposure", kind: "risk", tier: "key", x: 866, y: 360, size: 8, label: "장비 노출", meta: "RISK 86", detail: "협곡·능선 지형과 장비 기동 폭이 맞물려 선두 제대가 노출되는 위험.", evidence_ids: ["ev_redteam_delay", "ev_comm_gap"] },
    { id: "riskSustain", kind: "risk", tier: "key", x: 806, y: 488, size: 8, label: "지속성 저하", meta: "RISK 84", detail: "보급 대기점 부족과 정비 제한이 겹쳐 B안 보완 조건을 요구.", evidence_ids: ["ev_logistics_supply"] },
    { id: "decision", kind: "decision", tier: "key", x: 724, y: 348, size: 13, label: "결심 후보 그래프", meta: "B안 우선", detail: "토론으로 확장된 그래프에서 B안 우선, A안 조건부 보완, 재판단 기준 명시를 결심카드 후보로 잠금.", evidence_ids: ["ev_coa_b", "ev_comm_gap", "ev_logistics_supply", "ev_sop_criteria"] }
  ];

  const edges = [
    ["docPlan", "missionSchema", "evidence", "추출"],
    ["docEquipment", "assetSchema", "evidence", "제원화"],
    ["docComm", "terrainSchema", "evidence", "좌표화"],
    ["docLog", "constraintSchema", "evidence", "지속성"],
    ["docSop", "ruleSchema", "evidence", "규칙"],
    ["missionSchema", "graphCore", "semantic", "정규화"],
    ["assetSchema", "graphCore", "semantic", "엔티티"],
    ["terrainSchema", "graphCore", "semantic", "공간관계"],
    ["constraintSchema", "graphCore", "semantic", "제약"],
    ["ruleSchema", "graphCore", "semantic", "판단규칙"],
    ["graphCore", "coaA", "semantic", "후보"],
    ["graphCore", "coaB", "semantic", "추천"],
    ["graphCore", "commAgent", "debate", "검토할당"],
    ["graphCore", "terrainAgent", "debate", "검토할당"],
    ["graphCore", "logAgent", "debate", "검토할당"],
    ["graphCore", "redAgent", "debate", "검토할당"],
    ["commAgent", "debateRelay", "expansion", "제안"],
    ["terrainAgent", "debateTerrain", "expansion", "반론"],
    ["logAgent", "debateSupply", "expansion", "보완"],
    ["redAgent", "debateRule", "expansion", "공격"],
    ["coaA", "debateTerrain", "failure", "취약"],
    ["debateRelay", "riskCmdGap", "failure", "차단점"],
    ["debateTerrain", "riskExposure", "failure", "노출"],
    ["debateSupply", "riskSustain", "failure", "부족"],
    ["debateRule", "decision", "decision", "조건"],
    ["riskCmdGap", "decision", "decision", "통신조건"],
    ["riskExposure", "decision", "decision", "우회권고"],
    ["riskSustain", "decision", "decision", "군수보완"],
    ["coaB", "decision", "decision", "추천"],
    ["graphCore", "decision", "decision", "결심 후보"]
  ].map(([from, to, mode, label]) => ({ from, to, mode, label }));

  const constellationSpecs = [
    { prefix: "planSeed", from: "docPlan", to: "missionSchema", kind: "evidence", mode: "evidence", label: "임무 문장", count: 8, rx: 112, ry: 72, angle: 0.15 },
    { prefix: "assetSeed", from: "docEquipment", to: "assetSchema", kind: "evidence", mode: "evidence", label: "장비 제원", count: 10, rx: 118, ry: 88, angle: 0.95 },
    { prefix: "terrainSeed", from: "docComm", to: "terrainSchema", kind: "evidence", mode: "evidence", label: "지형 셀", count: 10, rx: 120, ry: 84, angle: 1.65 },
    { prefix: "logSeed", from: "docLog", to: "constraintSchema", kind: "factor", mode: "semantic", label: "지속성 속성", count: 7, rx: 96, ry: 58, angle: 2.25 },
    { prefix: "ruleSeed", from: "docSop", to: "ruleSchema", kind: "factor", mode: "semantic", label: "판단 규칙", count: 7, rx: 92, ry: 64, angle: 2.9 },
    { prefix: "coreEdge", from: "graphCore", to: "coaA", kind: "schema", mode: "semantic", label: "방책 속성", count: 8, rx: 128, ry: 98, angle: 3.6 },
    { prefix: "coreRoute", from: "graphCore", to: "coaB", kind: "schema", mode: "semantic", label: "우회 조건", count: 8, rx: 122, ry: 96, angle: 4.3 },
    { prefix: "agentTalk", from: "graphCore", to: "terrainAgent", kind: "debate", mode: "debate", label: "에이전트 발화", count: 12, rx: 152, ry: 110, angle: 5.05 },
    { prefix: "relayExpand", from: "commAgent", to: "riskCmdGap", kind: "debate", mode: "expansion", label: "중계 후보", count: 7, rx: 86, ry: 68, angle: 5.7 },
    { prefix: "riskExpand", from: "debateTerrain", to: "riskExposure", kind: "risk", mode: "failure", label: "실패 가정", count: 8, rx: 92, ry: 76, angle: 0.55 },
    { prefix: "decisionTrace", from: "decision", to: "riskSustain", kind: "decision", mode: "decision", label: "결심 근거", count: 8, rx: 118, ry: 82, angle: 1.25 }
  ];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  constellationSpecs.forEach((spec, groupIndex) => {
    const source = nodes.find((node) => node.id === spec.from);
    const target = nodes.find((node) => node.id === spec.to);
    const entityNames = getOntologyEntityNames(spec.prefix);
    if (!source || !target) return;
    for (let i = 0; i < spec.count; i += 1) {
      const orbit = 0.46 + (i % 5) * 0.13;
      const angle = spec.angle + i * goldenAngle + groupIndex * 0.22;
      const node = {
        id: `${spec.prefix}${i}`,
        kind: spec.kind,
        tier: "support",
        x: clamp(
          source.x + Math.cos(angle) * spec.rx * orbit + Math.sin(i + groupIndex) * 12,
          54,
          ONTOLOGY_VIEWBOX_WIDTH - 54
        ),
        y: clamp(
          source.y + Math.sin(angle) * spec.ry * orbit + Math.cos(i * 1.35 + groupIndex) * 10,
          ONTOLOGY_SAFE_MIN_Y,
          ONTOLOGY_SAFE_MAX_Y
        ),
        size: spec.mode === "failure" || spec.mode === "decision" ? 4.2 : spec.mode === "debate" || spec.mode === "expansion" ? 3.9 : 3.4,
        label: entityNames[i % entityNames.length] || `${spec.label} ${String(i + 1).padStart(2, "0")}`,
        meta: spec.mode === "expansion" ? "토론 확장" : spec.mode === "debate" ? "AGENT NOTE" : spec.mode === "failure" ? "RISK TRACE" : spec.mode === "decision" ? "DECISION LINK" : "ONTOLOGY FACT",
        detail: `${source.label}에서 ${target.label}(으)로 의미가 전파될 때 생성된 ${spec.label} 노드.`,
        evidence_ids: source.evidence_ids || target.evidence_ids || []
      };
      nodes.push(node);
      edges.push({ from: source.id, to: node.id, mode: spec.mode, label: spec.mode === "expansion" ? "확장" : spec.mode === "debate" ? "발화" : spec.label });
      edges.push({ from: node.id, to: target.id, mode: spec.mode, label: "relation_type" });
    }
  });

  return { nodes, edges, nodeMap: new Map(nodes.map((node) => [node.id, node])) };
}

const graph = buildGraph();

function getOntologyNodeStyle(node) {
  const styleMap = {
    document: { className: "is-ontology-document", label: "문서", confidence: 94, layer: "source" },
    evidence: { className: "is-ontology-evidence", label: "근거", confidence: 82, layer: "source" },
    schema: { className: "is-ontology-schema", label: "스키마", confidence: 90, layer: "schema" },
    ontology: { className: "is-ontology-core", label: "코어", confidence: 96, layer: "core" },
    coa: { className: "is-ontology-coa", label: "방책", confidence: 88, layer: "course" },
    factor: { className: "is-ontology-factor", label: "제약", confidence: 86, layer: "course" },
    agent: { className: "is-ontology-agent", label: "에이전트", confidence: 79, layer: "review" },
    debate: { className: "is-ontology-debate", label: "토론", confidence: 76, layer: "review" },
    risk: { className: "is-ontology-risk", label: "위험", confidence: 91, layer: "risk" },
    decision: { className: "is-ontology-decision", label: "결심", confidence: 96, layer: "decision" }
  };
  const base = styleMap[node.kind] || styleMap.factor;
  const evidenceBoost = Math.min((node.evidence_ids?.length || 0) * 2, 6);
  const tierBoost = node.tier === "key" ? 3 : -8;
  return {
    ...base,
    confidence: clamp(base.confidence + evidenceBoost + tierBoost, 54, 99)
  };
}

function getOntologyLayerSummary() {
  const layers = [
    { key: "source", label: "문서·근거", kinds: ["document", "evidence"], detail: "원천 자료" },
    { key: "schema", label: "온톨로지 스키마", kinds: ["schema", "coa", "factor"], detail: "엔티티·속성" },
    { key: "core", label: "지식 그래프", kinds: ["ontology"], detail: "작전 의미망" },
    { key: "review", label: "에이전트 토론", kinds: ["agent", "debate"], detail: "토론 확장" },
    { key: "expansion", label: "위험·결심", kinds: ["risk", "decision"], detail: "그래프 확장" }
  ];
  return layers.map((layer) => {
    const nodes = graph.nodes.filter((node) => layer.kinds.includes(node.kind));
    const linkedEdges = graph.edges.filter((edge) => {
      const from = graph.nodeMap.get(edge.from);
      const to = graph.nodeMap.get(edge.to);
      return layer.kinds.includes(from?.kind) || layer.kinds.includes(to?.kind);
    });
    return {
      ...layer,
      count: nodes.length,
      relationCount: linkedEdges.length
    };
  });
}

function renderOntologyDepthMap() {
  const target = byId("ontologyDepthMap");
  if (!target) return;
  target.innerHTML = getOntologyLayerSummary()
    .map(
      (layer, index) => `
        <article class="ontology-layer-card is-${layer.key}">
          <span>${String(index + 1).padStart(2, "0")} ${layer.label}</span>
          <b>${layer.count}</b>
          <em>${layer.detail} / ${layer.relationCount} 관계</em>
        </article>
      `
    )
    .join("");
}

function renderOntologyRelationPulse() {
  const target = byId("ontologyRelationPulse");
  const node = graph.nodeMap.get(state.selectedNodeId);
  if (!target || !node) return;
  const directEdges = graph.edges.filter((edge) => edge.from === node.id || edge.to === node.id);
  const topModes = [...new Set(directEdges.map((edge) => edge.mode))].slice(0, 3).join(" · ");
  target.innerHTML = `
    <span>SELECTED ONTOLOGY ROUTE</span>
    <b>${node.label}</b>
    <em>${directEdges.length} relations${topModes ? ` / ${topModes}` : ""}</em>
  `;
}

function renderOntologyLayerRings() {
  const grid = qs(".grid-lines");
  if (!grid) return;
  [
    { key: "source", cx: 278, cy: 320, rx: 235, ry: 218, label: "SOURCE FACTS" },
    { key: "schema", cx: 446, cy: 316, rx: 210, ry: 178, label: "SCHEMA ENTITY MAP" },
    { key: "core", cx: 516, cy: 320, rx: 120, ry: 108, label: "ONTOLOGY CORE" },
    { key: "review", cx: 690, cy: 334, rx: 190, ry: 232, label: "AGENT DEBATE CLOUD" },
    { key: "expansion", cx: 786, cy: 378, rx: 160, ry: 176, label: "RISK / DECISION EXPANSION" }
  ].forEach((ring) => {
    grid.appendChild(makeSvg("ellipse", {
      cx: ring.cx,
      cy: ring.cy,
      rx: ring.rx,
      ry: ring.ry,
      class: `ontology-layer-ring ontology-cluster-ring is-${ring.key}`
    }));
    const label = makeSvg("text", {
      x: ring.cx - ring.rx + 20,
      y: ring.cy - ring.ry + 32,
      class: "ontology-layer-label"
    });
    label.textContent = ring.label;
    grid.appendChild(label);
  });
}

function getOntologyDirectEdges(nodeId = state.selectedNodeId) {
  return graph.edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
}

function getOntologyNeighborIds(nodeId = state.selectedNodeId) {
  const ids = new Set([nodeId]);
  getOntologyDirectEdges(nodeId).forEach((edge) => {
    ids.add(edge.from);
    ids.add(edge.to);
  });
  return ids;
}

function isOntologySupportNodeVisible(node) {
  return Boolean(node);
}

function shouldRenderOntologyEdge(edge, source = graph.nodeMap.get(edge.from), target = graph.nodeMap.get(edge.to)) {
  return Boolean(source && target && activeEdge(edge));
}

function getOntologyNodeLabelTier(node, isSelected = node.id === state.selectedNodeId) {
  if (isSelected || node.kind === "ontology" || (node.kind === "decision" && node.tier === "key")) return "primary";
  if (node.tier === "key") return "key";
  return "micro";
}

function getOntologyKindLabel(kind) {
  return {
    document: "문서 원천",
    evidence: "근거 조각",
    schema: "온톨로지 스키마",
    ontology: "지식 그래프 코어",
    coa: "방책 후보",
    factor: "제약 속성",
    agent: "토론 에이전트",
    debate: "토론 확장",
    risk: "실패경로 위험",
    decision: "결심 후보"
  }[kind] || "그래프 노드";
}

function getOntologyInspectorFields(node, directEdges) {
  const ontologyStyle = getOntologyNodeStyle(node);
  const relationModes = [...new Set(directEdges.map((edge) => edge.mode))].join(" / ") || "isolated";
  const evidenceCount = node.evidence_ids?.length || 0;
  const controlStatus =
    node.kind === "decision"
      ? "결심 후보 잠금"
      : node.kind === "risk"
        ? "위험 검증 중"
        : node.kind === "agent" || node.kind === "debate"
          ? "토론 확장 중"
          : "온톨로지 정규화";
  return [
    { label: "control_status", value: controlStatus },
    { label: "name", value: node.label },
    { label: "ontology_type", value: `${getOntologyKindLabel(node.kind)} / ${node.meta}` },
    { label: "source_evidence", value: evidenceCount ? `${evidenceCount}건 근거 연결` : "파생 노드" },
    { label: "relation_type", value: relationModes },
    { label: "semantic_confidence", value: `${ontologyStyle.confidence}%` }
  ];
}

function renderOntologyInspectorOverlay() {
  const target = byId("ontologyInspectorOverlay");
  const node = graph.nodeMap.get(state.selectedNodeId);
  if (!target || !node) return;
  const directEdges = getOntologyDirectEdges(node.id);
  const keyRelationEdges = directEdges.filter((edge) => {
    const other = graph.nodeMap.get(edge.from === node.id ? edge.to : edge.from);
    return other?.tier === "key";
  });
  const visibleRelationEdges = keyRelationEdges.slice(0, 5);
  const fields = getOntologyInspectorFields(node, directEdges);
  target.innerHTML = `
    <header>
      <span>SELECTED NODE</span>
      <b>${node.label}</b>
      <em>${getOntologyKindLabel(node.kind)}</em>
    </header>
    <div class="ontology-inspector-fields">
      ${fields
        .map(
          (field) => `
            <div class="ontology-inspector-field">
              <span>${field.label}</span>
              <b>${field.value}</b>
            </div>
          `
        )
        .join("")}
    </div>
    <p>${node.detail}</p>
    <div class="ontology-inspector-relations">
      <span>linked_nodes</span>
      ${visibleRelationEdges
        .map((edge) => {
          const other = graph.nodeMap.get(edge.from === node.id ? edge.to : edge.from);
          if (!other) return "";
          return `
            <button type="button" data-inspector-node-id="${other.id}">
              <b>${other.label}</b>
              <em>${edge.label} / ${edge.mode}</em>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function normalizeSearchText(value) {
  return String(value || "").toLocaleLowerCase("ko-KR");
}

function buildMissionSearchIndex() {
  const items = [];
  demoData.operationPlan.documents.forEach((doc) => {
    items.push({
      id: `doc-${doc.id}`,
      type: "자료",
      title: doc.name,
      meta: doc.type,
      body: `${doc.type} 자료. 작전계획 접수 후 구조화 파이프라인에서 확인합니다.`,
      stage: "data",
      kind: "document",
      priority: 42
    });
  });
  demoData.coas.forEach((coa) => {
    items.push({
      id: `coa-${coa.id}`,
      type: "방책",
      title: `${coa.id}안 ${coa.name}`,
      meta: `${coa.travel_time}분 / 통신 ${riskLabel(coa.comm_risk)}`,
      body: `${coa.strength} ${coa.weakness} ${coa.condition}`,
      stage: "data",
      kind: "coa",
      priority: coa.id === "B" ? 92 : 58
    });
  });
  demoData.evidence.forEach((item) => {
    items.push({
      id: `evidence-${item.id}`,
      type: "근거",
      title: item.title,
      meta: `${item.source} / ${item.status}`,
      body: item.preview,
      stage: "ontology",
      kind: "evidence",
      ref: item.id,
      priority: item.status === "근거 있음" ? 80 : 64
    });
  });
  demoData.agents.forEach((agent) => {
    const profile = getAgentProfile(agent);
    items.push({
      id: `agent-${agent.id}`,
      type: "에이전트",
      title: agent.name,
      meta: `${profile.callsign} / ${profile.factionLabel}`,
      body: `${agent.role} ${agent.risk_focus.join(" ")} ${agent.review_output}`,
      stage: "agents",
      kind: "agent",
      ref: agent.id,
      priority: profile.faction === "opfor" ? 88 : 62
    });
  });
  demoData.events.forEach((event, index) => {
    items.push({
      id: `event-${event.id}`,
      type: "리허설",
      title: `${event.time} ${event.event}`,
      meta: riskLabel(event.severity),
      body: `${event.detail} ${event.impact} ${event.agents.join(" ")}`,
      stage: "rehearsal",
      kind: "event",
      ref: index,
      priority: event.severity === "high" ? 86 : 56
    });
  });
  demoData.failures.forEach((failure) => {
    const story = getFailureStory(failure);
    items.push({
      id: `failure-${failure.id}`,
      type: "실패경로",
      title: `${failure.title} ${failure.score}`,
      meta: story.stopPoint,
      body: `${story.headline} ${story.why} ${failure.mitigation}`,
      stage: "risk",
      kind: "failure",
      ref: failure.id,
      priority: failure.score
    });
  });
  graph.nodes
    .filter((node) => node.tier === "key")
    .forEach((node) => {
      items.push({
        id: `node-${node.id}`,
        type: "그래프",
        title: node.label,
        meta: node.meta,
        body: node.detail,
        stage: "ontology",
        kind: "node",
        ref: node.id,
        priority: node.kind === "decision" ? 96 : 58
      });
    });
  items.push({
    id: "decision-card",
    type: "결심",
    title: `결심카드 ${demoData.decision.recommended_coa}`,
    meta: demoData.decision.conditional_coa,
    body: `${demoData.decision.decision_statement} ${demoData.decision.rationale.join(" ")}`,
    stage: "decision",
    kind: "decision",
    priority: 100
  });

  return items.map((item) => ({
    ...item,
    haystack: normalizeSearchText(`${item.id} ${item.ref || ""} ${item.type} ${item.title} ${item.meta} ${item.body}`)
  }));
}

const missionSearchIndex = buildMissionSearchIndex();

function getMissionSearchResults(query = "") {
  const normalized = normalizeSearchText(query).trim();
  if (!normalized) {
    return [...missionSearchIndex]
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
  }
  const terms = normalized.split(/\s+/).filter(Boolean);
  return missionSearchIndex
    .map((item) => {
      const title = normalizeSearchText(item.title);
      const meta = normalizeSearchText(item.meta);
      const score = terms.reduce((sum, term) => {
        if (title.includes(term)) return sum + 72;
        if (meta.includes(term)) return sum + 42;
        if (item.haystack.includes(term)) return sum + 18;
        return sum - 8;
      }, item.priority / 10);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function renderMissionSearchResults(query = "") {
  const target = byId("missionSearchResults");
  if (!target) return;
  const results = getMissionSearchResults(query);
  target.innerHTML = results.length
    ? results
      .map(
        (result) => `
          <button class="mission-search-result" type="button" role="option" data-search-result-id="${result.id}">
            <span>${result.type}</span>
            <b>${result.title}</b>
            <em>${result.meta}</em>
            <p>${result.body}</p>
          </button>
        `
      )
      .join("")
    : `<div class="mission-search-empty">검색 결과 없음</div>`;
}

function closeMissionSearch() {
  const modal = byId("missionSearchModal");
  if (modal) modal.hidden = true;
}

function openMissionSearch(query = "") {
  const modal = byId("missionSearchModal");
  const input = byId("missionSearchInput");
  if (!modal || !input) return;
  modal.hidden = false;
  input.value = query;
  renderMissionSearchResults(query);
  window.requestAnimationFrame(() => {
    input.focus();
    input.select();
  });
  refreshIcons();
}

function applyMissionSearchResult(resultId) {
  const result = missionSearchIndex.find((item) => item.id === resultId);
  if (!result) return;
  setStage(result.stage);
  if (result.kind === "agent") {
    const agent = getAgentById(result.ref);
    if (agent) {
      const profile = getAgentProfile(agent);
      if (state.agentFilter !== "all" && !matchesAgentFilter(profile)) state.agentFilter = profile.faction;
      selectAgentProfile(agent.id);
    }
  } else if (result.kind === "failure") {
    selectFailurePath(result.ref);
  } else if (result.kind === "event") {
    clearTimer("rehearsalTimer");
    state.rehearsalStarted = true;
    state.rehearsalPaused = true;
    setText("rehearsalPauseButton", "계속");
    showEvent(result.ref);
    updateFlow("rehearsal");
  } else if (result.kind === "evidence") {
    selectEvidence(result.ref, { openTrace: false });
  } else if (result.kind === "node") {
    selectNode(result.ref);
  } else if (result.kind === "decision") {
    setDecisionTab("card");
    updateFlow("decision");
  }
  closeMissionSearch();
  if (result.kind === "evidence") openEvidenceTrace(result.ref);
  renderPageBriefings();
}

function activeEdge(edge) {
  if (state.graphMode === "all") return true;
  if (state.graphMode === "evidence") return edge.mode === "evidence" || edge.mode === "semantic";
  if (state.graphMode === "debate") return edge.mode === "debate" || edge.mode === "expansion";
  return edge.mode === state.graphMode;
}

function activeNodeIds() {
  if (state.graphMode === "all") return new Set(graph.nodes.map((node) => node.id));
  const ids = new Set([state.selectedNodeId]);
  graph.edges.filter(activeEdge).forEach((edge) => {
    ids.add(edge.from);
    ids.add(edge.to);
  });
  return ids;
}

function renderGrid() {
  const grid = qs(".grid-lines");
  if (!grid) return;
  grid.innerHTML = "";
  for (let x = 0; x <= ONTOLOGY_VIEWBOX_WIDTH; x += 50) {
    grid.appendChild(makeSvg("line", { x1: x, y1: 0, x2: x, y2: ONTOLOGY_VIEWBOX_HEIGHT, class: "graph-grid-line" }));
  }
  for (let y = 0; y <= ONTOLOGY_VIEWBOX_HEIGHT; y += 50) {
    grid.appendChild(makeSvg("line", { x1: 0, y1: y, x2: ONTOLOGY_VIEWBOX_WIDTH, y2: y, class: "graph-grid-line" }));
  }
  renderOntologyLayerRings();
}

function renderEdges() {
  const edgeLayer = byId("edgeLayer");
  if (!edgeLayer) return;
  edgeLayer.innerHTML = "";
  const neighborIds = getOntologyNeighborIds();
  let labelCount = 0;
  graph.edges.forEach((edge, index) => {
    const source = graph.nodeMap.get(edge.from);
    const target = graph.nodeMap.get(edge.to);
    if (!source || !target) return;
    if (!shouldRenderOntologyEdge(edge, source, target)) return;
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const curve = ((index % 5) - 2) * 9;
    const isDirect = edge.from === state.selectedNodeId || edge.to === state.selectedNodeId;
    const isNeighborhood = neighborIds.has(edge.from) && neighborIds.has(edge.to);
    const isActive = activeEdge(edge);
    const path = makeSvg("path", {
      d: `M ${source.x} ${source.y} C ${source.x + dx * 0.42} ${source.y + dy * 0.22 - curve}, ${source.x + dx * 0.58} ${source.y + dy * 0.78 + curve}, ${target.x} ${target.y}`,
      class: `edge ${edge.mode} is-${edge.mode}${isDirect ? " is-direct" : ""}${isNeighborhood ? " is-neighborhood" : ""}${isActive ? "" : " muted"}`,
      "data-relation-mode": edge.mode
    });
    path.style.setProperty("--edge-order", String(index % 9));
    edgeLayer.appendChild(path);
    const shouldLabel =
      isActive &&
      isDirect &&
      labelCount < 7 &&
      source.tier === "key" &&
      target.tier === "key" &&
      edge.label !== "relation_type";
    if (shouldLabel) {
      const label = makeSvg("text", {
        x: source.x + dx * 0.5,
        y: source.y + dy * 0.5 - Math.sign(dy || 1) * 8,
        class: `ontology-link-label is-${edge.mode}`
      });
      label.textContent = edge.label;
      edgeLayer.appendChild(label);
      labelCount += 1;
    }
  });
}

function getOntologyLabelAnchor(node) {
  const isLeft = node.x > 650;
  const offset = node.size + (node.kind === "ontology" ? 18 : 12);
  return {
    className: isLeft ? "is-left" : "is-right",
    x: isLeft ? node.x - offset : node.x + offset,
    stemX: isLeft ? node.x - node.size - 6 : node.x + node.size + 6,
    labelY: node.y - 7,
    metaY: node.y + 8,
    confidenceY: node.y + 23
  };
}

function makeOntologyHexPoints(cx, cy, radius) {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 6 + index * (Math.PI / 3);
    return `${(cx + Math.cos(angle) * radius).toFixed(2)},${(cy + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(" ");
}

function renderNodes() {
  const nodeLayer = byId("nodeLayer");
  if (!nodeLayer) return;
  const activeIds = activeNodeIds();
  const neighborIds = getOntologyNeighborIds();
  nodeLayer.innerHTML = "";
  graph.nodes.forEach((node) => {
    if (!isOntologySupportNodeVisible(node)) return;
    const isSelected = node.id === state.selectedNodeId;
    const isNeighbor = neighborIds.has(node.id) && !isSelected;
    const ontologyStyle = getOntologyNodeStyle(node);
    const isDimmed = !activeIds.has(node.id);
    const group = makeSvg("g", {
      class: `node ${node.kind} ${ontologyStyle.className}${node.tier === "support" ? " is-support" : ""}${isSelected ? " is-selected" : ""}${isNeighbor ? " is-neighbor" : ""}${isDimmed ? " is-dimmed" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": node.label,
      "data-node-id": node.id,
      "data-ontology-kind": node.kind,
      "data-ontology-tier": node.tier,
      "data-ontology-layer": ontologyStyle.layer
    });
    if (isSelected || isNeighbor) {
      group.appendChild(makeSvg("circle", {
        cx: node.x,
        cy: node.y,
        r: node.size + (isSelected ? 18 : 10),
        class: "ontology-neighbor-ring"
      }));
    }
    group.appendChild(makeSvg("circle", {
      cx: node.x,
      cy: node.y,
      r: node.size + (node.tier === "key" ? 12 : 6),
      class: "node-halo"
    }));
    const visualRadius = isSelected ? node.size + 4 : node.size;
    group.appendChild(makeSvg("polygon", {
      points: makeOntologyHexPoints(node.x, node.y, visualRadius),
      class: "ontology-node-polygon"
    }));
    group.appendChild(makeSvg("circle", {
      cx: node.x,
      cy: node.y,
      r: Math.max(1.8, visualRadius * 0.3),
      class: "node-dot"
    }));

    const labelTier = getOntologyNodeLabelTier(node, isSelected);
    if (labelTier === "micro") {
      const microLabel = makeSvg("text", {
        x: node.x + node.size + 4,
        y: node.y - 4,
        class: "ontology-micro-label"
      });
      microLabel.textContent = node.label;
      group.appendChild(microLabel);
    } else {
      const anchor = getOntologyLabelAnchor(node);
      if (labelTier === "primary") {
        group.appendChild(makeSvg("line", {
          x1: node.x,
          y1: node.y,
          x2: anchor.stemX,
          y2: node.y,
          class: "ontology-node-stem"
        }));
      }
      const labelBlock = makeSvg("g", { class: `ontology-label-block ${anchor.className} is-${labelTier}` });
      const label = makeSvg("text", { x: anchor.x, y: anchor.labelY, class: "node-label" });
      label.textContent = node.label;
      labelBlock.appendChild(label);
      if (labelTier === "primary") {
        const meta = makeSvg("text", { x: anchor.x, y: anchor.metaY, class: "node-meta" });
        meta.textContent = node.meta;
        const confidence = makeSvg("text", { x: anchor.x, y: anchor.confidenceY, class: "semantic-confidence" });
        confidence.textContent = `${ontologyStyle.label} ${ontologyStyle.confidence}%`;
        labelBlock.appendChild(meta);
        labelBlock.appendChild(confidence);
      }
      group.appendChild(labelBlock);
    }

    group.addEventListener("click", () => selectNode(node.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectNode(node.id);
      }
    });
    nodeLayer.appendChild(group);
  });
}

function renderGraph() {
  renderOntologyDepthMap();
  renderOntologyRelationPulse();
  renderOntologyInspectorOverlay();
  renderGrid();
  renderEdges();
  renderNodes();
  updateSelectedNode();
}

function selectNode(nodeId) {
  state.selectedNodeId = nodeId;
  renderEdges();
  renderNodes();
  renderOntologyRelationPulse();
  renderOntologyInspectorOverlay();
  updateSelectedNode();
  syncRouteState();
}

function getGraphDecisionPath(startNodeId = state.selectedNodeId, targetNodeId = "decision") {
  if (!graph.nodeMap.has(startNodeId) || !graph.nodeMap.has(targetNodeId)) return [];
  if (startNodeId === targetNodeId) return [graph.nodeMap.get(targetNodeId)];
  const nextByNode = new Map();
  graph.edges.forEach((edge) => {
    if (!nextByNode.has(edge.from)) nextByNode.set(edge.from, []);
    nextByNode.get(edge.from).push(edge.to);
  });
  const queue = [[startNodeId]];
  const visited = new Set([startNodeId]);
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const next of nextByNode.get(current) || []) {
      if (visited.has(next)) continue;
      const nextPath = [...path, next];
      if (next === targetNodeId) {
        return nextPath.map((id) => graph.nodeMap.get(id)).filter(Boolean);
      }
      visited.add(next);
      queue.push(nextPath);
    }
  }
  return [graph.nodeMap.get(startNodeId)];
}

function renderGraphPathPanel() {
  const target = byId("graphPathPanel");
  if (!target) return;
  const path = getGraphDecisionPath();
  const current = graph.nodeMap.get(state.selectedNodeId);
  const decision = graph.nodeMap.get("decision");
  const steps = Math.max(path.length - 1, 0);
  target.innerHTML = `
    <header>
      <span>판단 경로</span>
      <b>${steps ? `${steps}단계` : "현재 결심"}</b>
    </header>
    <div class="graph-path-chain">
      ${path
        .map(
          (node, index) => `
            <button class="graph-path-node ${node.id === state.selectedNodeId ? "is-current" : ""}" type="button" data-path-node-id="${node.id}" aria-pressed="${node.id === state.selectedNodeId ? "true" : "false"}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <b>${node.label}</b>
              <em>${node.meta}</em>
            </button>
          `
        )
        .join("")}
    </div>
    <footer>
      <span>결심카드까지</span>
      <b>${current?.label || "선택 노드"} → ${decision?.label || "결심카드"}</b>
    </footer>
  `;
}

function updateSelectedNode() {
  const target = byId("selectedNode");
  const node = graph.nodeMap.get(state.selectedNodeId);
  if (!target || !node) return;
  const links = graph.edges
    .filter((edge) => edge.from === node.id || edge.to === node.id)
    .slice(0, 6)
    .map((edge) => {
      const other = graph.nodeMap.get(edge.from === node.id ? edge.to : edge.from);
      return `${edge.label}:${other ? other.label : ""}`;
    })
    .join(" / ");
  target.innerHTML = `<b>${node.label} <small>${node.meta}</small></b><span>${node.detail}${links ? ` 연결: ${links}` : ""}</span>`;
  renderEvidencePreview(node.evidence_ids || []);
  renderGraphPathPanel();
  renderPageBriefings();
}

function setGraphMode(mode) {
  state.graphMode = mode;
  document.querySelectorAll(".mode-button[data-graph-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.graphMode === mode);
  });
  renderOntologyDepthMap();
  renderEdges();
  renderNodes();
  renderOntologyInspectorOverlay();
  renderPageBriefings();
}

function getNextPrimaryStage(stage = state.currentStage) {
  const currentIndex = primaryStageRail.indexOf(stage);
  if (currentIndex < 0) return null;
  return primaryStageRail[currentIndex + 1] || null;
}

function updateNextStageButton() {
  const button = byId("nextStageButton");
  if (!button) return;
  const nextStage = getNextPrimaryStage();
  const nextMeta = nextStage ? stageMeta[nextStage] : null;
  button.disabled = state.stageTransitioning || !nextStage;
  button.dataset.stageNext = nextStage || "";
  if (state.stageTransitioning) {
    button.setAttribute("aria-disabled", "true");
    button.title = "단계 전환 중";
  } else if (!nextStage) {
    button.setAttribute("aria-disabled", "true");
    button.title = "최종 단계";
  } else {
    button.setAttribute("aria-disabled", "false");
    button.title = `다음 단계: ${nextMeta.phase}`;
  }
  setText("nextStageLabel", state.stageTransitioning ? "전환 중" : nextMeta?.phase || "최종 단계");
}

async function runStageNavigationTransition(stage) {
  if (!stageMeta[stage] || state.stageTransitioning || stage === state.currentStage) return;
  state.stageTransitioning = true;
  updateNextStageButton();
  beginStageTransition(stage, { autoComplete: false });
  try {
    await waitForStageTransitionPaint();
    await wait(180);
    setStage(stage, { skipTransition: true });
    await waitForStageTransitionPaint();
    await wait(360);
  } finally {
    completeStageTransition(stage);
    state.stageTransitioning = false;
    updateNextStageButton();
  }
}

async function goToNextStage() {
  const nextStage = getNextPrimaryStage();
  if (!nextStage) return;
  await runStageNavigationTransition(nextStage);
}

function setStage(stage, options = {}) {
  const meta = stageMeta[stage];
  if (!meta) return;
  const previousStage = state.currentStage;
  if (previousStage !== stage && options.showTransition && !options.skipTransition) beginStageTransition(stage);
  state.currentStage = stage;
  document.body.dataset.stage = stage;
  document.querySelectorAll(".workspace-tab").forEach((button) => {
    const active = button.dataset.stage === stage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.setAttribute("aria-current", active ? "page" : "false");
    button.tabIndex = active ? 0 : -1;
  });
  syncCompactStageContext(stage);
  scrollActiveWorkspaceTabIntoView();
  document.querySelectorAll(".page-view").forEach((page) => {
    const active = page.dataset.page === stage;
    page.hidden = !active;
    page.classList.toggle("is-active", active);
    if (active) {
      page.classList.remove("is-stage-entering");
      window.requestAnimationFrame(() => page.classList.add("is-stage-entering"));
    }
  });
  setText("phaseLabel", meta.phase);
  setText("alertLabel", meta.alert);
  if (stage === "risk") setGraphMode("failure");
  if (stage === "decision") setGraphMode("decision");
  renderPageBriefings();
  syncRouteState();
  updateNextStageButton();
}

function syncCompactStageContext(stage) {
  const tabs = [...document.querySelectorAll(".workspace-tab")];
  const nav = document.querySelector(".workspace-tabs");
  let visibleCount = 0;
  tabs.forEach((button) => {
    const visible = primaryStageRail.includes(button.dataset.stage);
    button.classList.toggle("is-context-tab", visible);
    button.setAttribute("aria-hidden", String(!visible && button.dataset.stage !== stage));
    button.setAttribute("aria-disabled", visible ? "false" : "true");
    if (!visible) button.tabIndex = -1;
    if (visible) visibleCount += 1;
  });
  if (nav) nav.dataset.visibleTabs = String(visibleCount);
}

function scrollActiveWorkspaceTabIntoView() {
  const activeTab = document.querySelector(".workspace-tab.is-active");
  if (!activeTab) return;
  activeTab.scrollIntoView({
    inline: "center",
    block: "nearest"
  });
}

function handleWorkspaceTabKeydown(event) {
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const tabs = [...document.querySelectorAll(".workspace-tab")].filter((button) => button.classList.contains("is-context-tab"));
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex < 0) return;
  event.preventDefault();
  let nextIndex = currentIndex;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % tabs.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = tabs.length - 1;
  const nextTab = tabs[nextIndex];
  nextTab.focus();
}

function setFocusMode(enabled) {
  state.focusMode = Boolean(enabled);
  document.body.classList.toggle("is-focus-mode", state.focusMode);
  const button = byId("toggleFocusModeButton");
  if (button) {
    button.setAttribute("aria-pressed", String(state.focusMode));
    button.title = state.focusMode ? "보조 레일 표시" : "집중 보기";
    button.setAttribute("aria-label", button.title);
    button.innerHTML = `<i data-lucide="${state.focusMode ? "panel-right-open" : "panel-right-close"}" aria-hidden="true"></i>`;
    refreshIcons();
  }
}

function toggleFocusMode() {
  setFocusMode(!state.focusMode);
}

function setPresenterMode(enabled) {
  state.presenterMode = Boolean(enabled);
  document.documentElement.classList.toggle("is-presenter-mode-root", state.presenterMode);
  document.body.classList.toggle("is-presenter-mode", state.presenterMode);
  const button = byId("togglePresenterModeButton");
  if (button) {
    button.setAttribute("aria-pressed", String(state.presenterMode));
    button.title = state.presenterMode ? "발표 모드 해제" : "발표 모드";
    button.setAttribute("aria-label", button.title);
    button.innerHTML = `<i data-lucide="${state.presenterMode ? "screen-share-off" : "screen-share"}" aria-hidden="true"></i>`;
    refreshIcons();
  }
  syncRouteState();
}

function togglePresenterMode() {
  setPresenterMode(!state.presenterMode);
}

function renderEvidencePreview(evidenceIds = []) {
  const panel = byId("evidencePreview");
  if (!panel) return;
  const ids = evidenceIds.length ? evidenceIds : demoData.decision.evidence_ids;
  panel.innerHTML = `
    <div class="panel-heading compact-heading">
      <span>근거 미리보기</span>
      <b>${ids.length}건</b>
    </div>
    <div class="evidence-list">
      ${ids.map((id) => evidenceBadge(evidenceById.get(id))).join("")}
    </div>
  `;
  if (!byId("evidenceTraceDrawer")?.hidden) renderEvidenceTraceDrawer(state.selectedEvidenceId);
}

function evidenceBadge(item) {
  if (!item) return "";
  const selected = state.selectedEvidenceId === item.id;
  return `
    <article class="evidence-item ${item.status === "추정" ? "is-estimate" : ""} ${item.status === "추가 확인 필요" ? "is-check" : ""} ${selected ? "is-selected" : ""}" role="button" tabindex="0" data-evidence-id="${item.id}">
      <div>
        <b>${item.title}</b>
        <span>${item.type} / ${item.source}</span>
      </div>
      <em>${item.status}</em>
      <p>${item.preview}</p>
    </article>
  `;
}

function getEvidenceTrace(evidenceId = state.selectedEvidenceId) {
  const evidence = evidenceById.get(evidenceId) || evidenceById.get("ev_comm_gap") || demoData.evidence[0];
  const failures = demoData.failures.filter((failure) => failure.evidence.includes(evidence.id));
  const events = demoData.events.filter((event) => event.evidence_ids?.includes(evidence.id));
  const nodes = graph.nodes.filter((node) => node.evidence_ids?.includes(evidence.id));
  const decisionIndex = demoData.decision.evidence_ids.indexOf(evidence.id);
  const debates = debateEntries.filter((entry) => entry.evidence === evidence.id);
  const radioItems = Object.values(rehearsalRadioScripts)
    .flat()
    .filter((item) => item.evidence === evidence.id);
  const primaryFailure = failures[0];
  const decisionAction = decisionIndex >= 0
    ? demoData.decision.immediate_actions[decisionIndex] || demoData.decision.rationale[decisionIndex]
    : primaryFailure?.mitigation_steps?.[0] || demoData.decision.redecision_criteria[0];
  return {
    evidence,
    failures,
    events,
    nodes,
    debates,
    radioItems,
    decisionIndex,
    decisionAction,
    decisionLocked: decisionIndex >= 0,
    primaryFailure
  };
}

function renderEvidenceTraceDrawer(evidenceId = state.selectedEvidenceId) {
  const body = byId("evidenceTraceBody");
  const title = byId("evidenceTraceTitle");
  if (!body) return;
  const traceLabel = "근거 추적";
  const trace = getEvidenceTrace(evidenceId);
  state.selectedEvidenceId = trace.evidence.id;
  setText("evidenceTraceTitle", trace.evidence.title);
  if (title) title.title = trace.evidence.id;
  const chainItems = [
    { label: "원천", value: trace.evidence.source, detail: trace.evidence.type },
    { label: "검증", value: trace.evidence.status, detail: `${trace.debates.length + trace.radioItems.length}건 발언` },
    { label: "위험", value: trace.primaryFailure?.title || "직접 위험 없음", detail: trace.primaryFailure ? `${trace.primaryFailure.score}점` : "보조 근거" },
    { label: "결심", value: trace.decisionLocked ? "직접 잠금" : "간접 보강", detail: trace.decisionLocked ? demoData.decision.recommended_coa : "상황 판단" }
  ];
  const relatedFailures = trace.failures.length
    ? trace.failures.map((failure) => `<button type="button" data-trace-action="risk" data-trace-ref="${failure.id}"><b>${failure.title}</b><span>${failure.score}점 / ${failure.decision_point}</span></button>`).join("")
    : `<p>이 근거는 실패경로를 직접 만들기보다 결심 조건을 보강합니다.</p>`;
  const relatedEvents = trace.events.length
    ? trace.events.map((event) => `<article><span>${event.time}</span><b>${event.event}</b><em>${event.impact}</em></article>`).join("")
    : `<p>현재 리허설 이벤트에는 직접 연결되지 않았습니다.</p>`;
  const relatedVoices = [...trace.debates.map((entry) => ({
    actor: entry.agent,
    label: entry.stance,
    text: entry.text
  })), ...trace.radioItems.slice(0, 4).map((item) => ({
    actor: item.callsign,
    label: item.channel,
    text: item.message
  }))].slice(0, 5);
  body.innerHTML = `
    <section class="evidence-trace-summary ${trace.evidence.status === "추정" ? "is-estimate" : ""} ${trace.evidence.status === "추가 확인 필요" ? "is-check" : ""}">
      <div>
        <span>${traceLabel} / ${trace.evidence.type}</span>
        <h3>${trace.evidence.title}</h3>
        <p>${trace.evidence.preview}</p>
      </div>
      <b>${trace.evidence.status}</b>
    </section>
    <div class="evidence-trace-metrics" aria-label="근거 연결 요약">
      <article><span>실패경로</span><b>${trace.failures.length}</b></article>
      <article><span>리허설</span><b>${trace.events.length}</b></article>
      <article><span>그래프</span><b>${trace.nodes.length}</b></article>
      <article><span>결심</span><b>${trace.decisionLocked ? "LOCK" : "AUX"}</b></article>
    </div>
    <section class="evidence-trace-chain" aria-label="근거 흐름">
      ${chainItems.map((item, index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")} ${item.label}</span>
          <b>${item.value}</b>
          <em>${item.detail}</em>
        </article>
      `).join("")}
    </section>
    <section class="evidence-trace-section">
      <header><span>연결 위험</span><b>${trace.failures.length}건</b></header>
      <div class="evidence-trace-links">${relatedFailures}</div>
    </section>
    <section class="evidence-trace-section">
      <header><span>리허설 근거</span><b>${trace.events.length}건</b></header>
      <div class="evidence-trace-events">${relatedEvents}</div>
    </section>
    <section class="evidence-trace-section">
      <header><span>판단 발언</span><b>${relatedVoices.length}건</b></header>
      <div class="evidence-trace-voices">
        ${relatedVoices.length ? relatedVoices.map((item) => `<article><span>${item.actor} / ${item.label}</span><p>${item.text}</p></article>`).join("") : "<p>직접 연결된 발언이 아직 없습니다.</p>"}
      </div>
    </section>
    <section class="evidence-trace-section">
      <header><span>권고 조치</span><b>${trace.decisionLocked ? "결심카드" : "보완"}</b></header>
      <p>${trace.decisionAction}</p>
    </section>
    <footer class="evidence-trace-actions">
      <button class="evidence-trace-action" type="button" data-trace-action="graph"><i data-lucide="network" aria-hidden="true"></i><span>그래프에서 보기</span></button>
      <button class="evidence-trace-action" type="button" data-trace-action="risk"><i data-lucide="triangle-alert" aria-hidden="true"></i><span>실패경로 보기</span></button>
      <button class="evidence-trace-action" type="button" data-trace-action="decision"><i data-lucide="clipboard-check" aria-hidden="true"></i><span>결심카드 보기</span></button>
    </footer>
  `;
  refreshIcons();
}

function openEvidenceTrace(evidenceId = state.selectedEvidenceId) {
  const drawer = byId("evidenceTraceDrawer");
  if (!drawer) return;
  const evidence = evidenceById.get(evidenceId) || evidenceById.get(state.selectedEvidenceId);
  if (evidence) state.selectedEvidenceId = evidence.id;
  renderEvidenceTraceDrawer(state.selectedEvidenceId);
  drawer.hidden = false;
  drawer.classList.add("is-open");
  refreshIcons();
}

function closeEvidenceTrace() {
  const drawer = byId("evidenceTraceDrawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.hidden = true;
}

function selectEvidence(evidenceId, options = {}) {
  const evidence = evidenceById.get(evidenceId);
  if (!evidence) return;
  state.selectedEvidenceId = evidence.id;
  renderEvidencePreview([evidence.id]);
  if (state.currentStage === "risk") renderRiskEvidence();
  if (state.currentStage === "decision") {
    renderDecisionTracePanel();
    renderDecisionEvidence();
  }
  if (options.openTrace !== false) openEvidenceTrace(evidence.id);
  syncRouteState();
}

function runEvidenceTraceAction(action, ref) {
  const trace = getEvidenceTrace(state.selectedEvidenceId);
  if (action === "graph") {
    const node = trace.nodes.find((item) => item.tier === "key") || graph.nodes.find((item) => item.evidence_ids?.includes(trace.evidence.id));
    setStage("ontology");
    setGraphMode("evidence");
    if (node) selectNode(node.id);
    renderEvidencePreview([trace.evidence.id]);
  } else if (action === "risk") {
    const failureId = ref || trace.primaryFailure?.id;
    setStage("risk");
    if (failureId) selectFailurePath(failureId);
  } else if (action === "decision") {
    setStage("decision");
    setDecisionTab("card");
    renderDecisionTracePanel();
  }
  closeEvidenceTrace();
}

function getBriefingSnapshot() {
  const selectedFailure = getFailureById(state.selectedFailureId);
  const failureStory = getFailureStory(selectedFailure);
  const selectedEvidence = evidenceById.get(state.selectedEvidenceId);
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const activeConditions = getDecisionImpactModel().conditions.filter((condition) => state.decisionConditionState[condition.id]);
  const projectedRows = demoData.failures.map((failure) => getProjectedFailureScore(failure));
  const residualRisk = Math.round(projectedRows.reduce((sum, row) => sum + row.projected, 0) / projectedRows.length);
  const shareUrl = new URL(window.location.href);
  return {
    title: demoData.operationPlan.operation_name,
    stage: stageMeta[state.currentStage]?.phase || "작전",
    decision: demoData.decision.recommended_coa,
    condition: demoData.decision.conditional_coa,
    failure: selectedFailure,
    failureStory,
    evidence: selectedEvidence,
    event: activeEvent,
    rehearsalBriefing: getRehearsalBriefing(activeEvent),
    activeConditions,
    approvalGates: getDecisionApprovalGates(),
    defenseItems: getDemoJudgeDefenseItems(),
    executionRows: getDecisionExecutionRows(),
    residualRisk,
    shareUrl: shareUrl.href
  };
}

function getBriefingText(snapshot = getBriefingSnapshot()) {
  const lines = [
    `[WAR GROUND] ${snapshot.title}`,
    `현재 화면: ${snapshot.stage}`,
    `추천 결심: ${snapshot.decision} (${snapshot.condition})`,
    `핵심 위험: ${snapshot.failure.title} ${snapshot.failure.score}점 - ${snapshot.failureStory.stopPoint}`,
    `예상 잔여 위험: ${snapshot.residualRisk}`,
    `상위 조치: ${snapshot.executionRows.slice(0, 3).map((row) => `${row.owner} ${row.action}`).join(" / ")}`,
    `직접 근거: ${snapshot.evidence?.title || "선택 없음"} / ${snapshot.evidence?.source || "-"}`,
    `활성 조건: ${snapshot.activeConditions.map((condition) => condition.label).join(", ") || "없음"}`,
    `현재 이벤트: ${snapshot.event ? `${snapshot.event.time} ${snapshot.event.event}` : "리허설 대기"}`,
    `3D 판단: ${snapshot.rehearsalBriefing.terrainCue} / ${snapshot.rehearsalBriefing.decisionCue}`,
    `승인 게이트: ${snapshot.approvalGates.map((gate) => `${gate.label} ${gate.status}`).join(", ")}`,
    `심사 대응: ${snapshot.defenseItems.map((item) => `${item.label}=${item.value}`).join(" / ")}`,
    `링크: ${window.location.href}`
  ];
  return lines.join("\n");
}

function renderBriefingSheet() {
  const body = byId("briefingSheetBody");
  if (!body) return;
  const briefingLabel = "지휘관 브리핑";
  const snapshot = getBriefingSnapshot();
  body.innerHTML = `
    <section class="briefing-snapshot-hero">
      <span>${briefingLabel} / ${snapshot.stage}</span>
      <h3>${snapshot.decision}</h3>
      <p>${snapshot.condition}</p>
      <b>예상 잔여 위험 ${snapshot.residualRisk}</b>
    </section>
    <div class="briefing-fact-grid" aria-label="브리핑 핵심 수치">
      <article><span>핵심 위험</span><b>${snapshot.failure.title}</b><em>${snapshot.failure.score}점</em></article>
      <article><span>막을 지점</span><b>${snapshot.failureStory.stopPoint}</b><em>${snapshot.failureStory.timeWindow}</em></article>
      <article><span>직접 근거</span><b>${snapshot.evidence?.title || "선택 없음"}</b><em>${snapshot.evidence?.source || "-"}</em></article>
      <article><span>리허설</span><b>${snapshot.event ? snapshot.event.time : "대기"}</b><em>${snapshot.event?.event || "이벤트 없음"}</em></article>
    </div>
    <section class="briefing-section">
      <header><span>3D 판단</span><b>${snapshot.rehearsalBriefing.time}</b></header>
      <div class="briefing-event-card">
        <b>${snapshot.rehearsalBriefing.title}</b>
        <p>${snapshot.rehearsalBriefing.terrainCue}</p>
        <em>${snapshot.rehearsalBriefing.failureTitle} · ${snapshot.rehearsalBriefing.decisionCue}</em>
      </div>
    </section>
    <section class="briefing-section">
      <header><span>지휘관 질문</span><b>승인 전 확인</b></header>
      <p>${snapshot.failureStory.question}</p>
    </section>
    <section class="briefing-section">
      <header><span>활성 조건</span><b>${snapshot.activeConditions.length}건</b></header>
      <div class="briefing-condition-list">
        ${snapshot.activeConditions.map((condition) => `<article><b>${condition.label}</b><span>${condition.detail}</span><em>${condition.owner}</em></article>`).join("")}
      </div>
    </section>
    <section class="briefing-section">
      <header><span>승인 게이트</span><b>${snapshot.approvalGates.filter((gate) => gate.active).length}/${snapshot.approvalGates.length}</b></header>
      <div class="briefing-approval-grid">
        ${snapshot.approvalGates.map((gate) => `<article class="is-${gate.tone}"><b>${gate.label}</b><span>${gate.status}</span><em>${gate.owner} · 잔여위험 ${gate.residualRisk}</em></article>`).join("")}
      </div>
    </section>
    <section class="briefing-section">
      <header><span>심사 대응</span><b>Q&A</b></header>
      <div class="briefing-defense-grid">
        ${snapshot.defenseItems.map((item) => `<article><span>${item.label}</span><b>${item.value}</b><em>${item.detail}</em></article>`).join("")}
      </div>
    </section>
    <section class="briefing-section">
      <header><span>상위 조치</span><b>${snapshot.executionRows.length}건</b></header>
      <div class="briefing-condition-list">
        ${snapshot.executionRows.slice(0, 3).map((row) => `<article><b>${row.owner}</b><span>${row.action}</span><em>잔여위험 ${row.score.projected}</em></article>`).join("")}
      </div>
    </section>
    <section class="briefing-section">
      <header><span>공유 링크</span><b>현재 상태 포함</b></header>
      <code>${window.location.href}</code>
    </section>
  `;
  refreshIcons();
}

function getBriefingRunwayItems() {
  const selectedFailure = getFailureById(state.selectedFailureId);
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const activeConditions = getActiveDecisionConditionIds().size;
  return [
    {
      id: "data",
      stage: "data",
      label: "자료",
      title: "작전계획 접수",
      script: "문서 업로드가 아니라 임무, 제한사항, 방책 비교가 같은 작전 시드로 정규화됩니다.",
      proof: state.scenarioLoaded ? `${demoData.operationPlan.documents.length}종 자료 접수` : "접수 전",
      ready: state.scenarioLoaded,
      actionLabel: state.scenarioLoaded ? "자료 확인" : "접수 실행"
    },
    {
      id: "ontology",
      stage: "ontology",
      label: "근거",
      title: "결심 경로 역추적",
      script: "그래프는 장식이 아니라 문서, 에이전트 발언, 실패경로, 결심카드를 연결한 근거 지도입니다.",
      proof: `${graph.nodes.length}개 노드 / ${graph.edges.length}개 관계`,
      ready: state.scenarioLoaded,
      actionLabel: "그래프 보기"
    },
    {
      id: "agents",
      stage: "agents",
      label: "역할",
      title: "가상부대 역할 검토",
      script: "23개 역할이 참모, 현장 제대, 대항군, 환경 변수로 나뉘어 각기 다른 허점을 냅니다.",
      proof: `${state.generatedAgentCount}/${demoData.agents.length} 역할 준비`,
      ready: state.agentsGenerated,
      actionLabel: state.agentsGenerated ? "프로필 보기" : "부대 생성"
    },
    {
      id: "rehearsal",
      stage: "rehearsal",
      label: "3D",
      title: "마찰 이벤트 재생",
      script: activeEvent
        ? `${activeEvent.time} ${activeEvent.event} 장면이 실패경로와 결심 조건으로 이어집니다.`
        : "3D 리허설은 보기용 장면이 아니라 시간순 위험 증거를 생성하는 단계입니다.",
      proof: activeEvent ? `${activeEvent.time} 이벤트` : "리허설 대기",
      ready: state.rehearsalStarted,
      actionLabel: state.rehearsalStarted ? "리허설 보기" : "리허설 실행"
    },
    {
      id: "risk",
      stage: "risk",
      label: "위험",
      title: "실패경로 압축",
      script: `${selectedFailure.title} 흐름은 차단 지점, 조기 경고, 즉시 조치로 바뀌어 결심카드에 들어갑니다.`,
      proof: `${selectedFailure.title} ${selectedFailure.score}점`,
      ready: state.rehearsalStarted,
      actionLabel: "위험 확인"
    },
    {
      id: "decision",
      stage: "decision",
      label: "결심",
      title: `${demoData.decision.recommended_coa} 승인안`,
      script: "AI 결과는 명령이 아니라 조건, 승인 게이트, 지휘관 확인 항목이 붙은 검토안입니다.",
      proof: `${activeConditions}/${getDecisionConditions().length} 조건 활성`,
      ready: activeConditions >= 3,
      actionLabel: "결심카드"
    },
    {
      id: "briefing",
      stage: "briefing",
      label: "브리핑",
      title: "1분 브리핑",
      script: "자료-근거-역할-3D-위험-결심을 심사 질문 순서로 묶고 근거 잠금 상태를 확인합니다.",
      proof: `${getBriefingQuestionQueue().length}개 심사 질문`,
      ready: state.scenarioLoaded && state.agentsGenerated && state.rehearsalStarted,
      actionLabel: "패킷 열기"
    }
  ];
}

function getBriefingQuestionQueue() {
  const snapshot = getBriefingSnapshot();
  const selectedFailure = snapshot.failure;
  const selectedEvent = snapshot.event || demoData.events.find((event) => event.severity === "high") || demoData.events[0];
  return [
    {
      id: "why-b",
      label: "심사 질문",
      question: "왜 B안을 추천하나?",
      answer: "B안은 통신 갱신과 보급 접근성이 유지되어 지휘공백과 지속성 저하를 동시에 낮춥니다.",
      evidenceId: "ev_coa_b",
      stage: "decision"
    },
    {
      id: "why-3d",
      label: "심사 질문",
      question: "3D 리허설이 실제 판단에 어떤 값을 주나?",
      answer: `${selectedEvent.time} ${selectedEvent.event} 이벤트가 ${selectedFailure.title} 차단점과 승인 조건으로 연결됩니다.`,
      evidenceId: selectedEvent.evidence_ids?.[0] || state.selectedEvidenceId,
      stage: "rehearsal"
    },
    {
      id: "human-loop",
      label: "심사 질문",
      question: "AI가 명령을 대신 내리는 구조인가?",
      answer: "아닙니다. 최종 산출물은 지휘관 검토안이며 승인 게이트와 Human-in-the-loop 문구를 계속 노출합니다.",
      evidenceId: demoData.decision.evidence_ids[0],
      stage: "decision"
    },
    {
      id: "evidence-lock",
      label: "심사 질문",
      question: "근거 없는 권고는 어떻게 걸러지나?",
      answer: "문서 근거, 에이전트 반론, 실패경로 연결이 없는 항목은 결심카드 근거 테이블에 잠기지 않습니다.",
      evidenceId: selectedFailure.evidence[0],
      stage: "ontology"
    }
  ];
}

function getBriefingEvidenceLockItems() {
  const evidenceIds = [
    ...demoData.decision.evidence_ids,
    ...getFailureById(state.selectedFailureId).evidence,
    state.selectedEvidenceId
  ];
  return [...new Set(evidenceIds)]
    .map((id) => evidenceById.get(id))
    .filter(Boolean)
    .slice(0, 7)
    .map((evidence) => {
      const linkedFailures = demoData.failures.filter((failure) => failure.evidence.includes(evidence.id));
      return {
        ...evidence,
        locked: demoData.decision.evidence_ids.includes(evidence.id),
        linkedFailure: linkedFailures[0]?.title || "결심 근거"
      };
    });
}

function getBriefingReadinessItems() {
  const evidenceLocks = getBriefingEvidenceLockItems();
  const lockedCount = evidenceLocks.filter((item) => item.locked).length;
  return [
    { label: "자료", value: state.scenarioLoaded ? "접수 완료" : "대기", ready: state.scenarioLoaded },
    { label: "가상부대", value: `${state.generatedAgentCount}/${demoData.agents.length}`, ready: state.agentsGenerated },
    { label: "리허설", value: state.rehearsalStarted ? "이벤트 생성" : "미실행", ready: state.rehearsalStarted },
    { label: "근거 잠금", value: `${lockedCount}/${evidenceLocks.length}`, ready: lockedCount >= 3 },
    { label: "승인 조건", value: `${getActiveDecisionConditionIds().size}/${getDecisionConditions().length}`, ready: getActiveDecisionConditionIds().size >= 3 }
  ];
}

function renderBriefingRunway() {
  const page = byId("page-briefing");
  if (!page) return;
  const runway = getBriefingRunwayItems();
  const selectedItem = runway.find((item) => item.id === state.selectedBriefingStepId) || runway.find((item) => item.id === "decision") || runway[0];
  state.selectedBriefingStepId = selectedItem.id;
  const timeline = byId("briefingRunwayTimeline");
  const questions = byId("briefingQuestionQueue");
  const drill = byId("briefingDrillCard");
  const evidenceLock = byId("briefingEvidenceLock");
  const script = byId("briefingOneLineScript");
  const readiness = byId("briefingReadinessPanel");

  if (script) {
    script.innerHTML = `
      <div class="panel-heading"><span>1분 브리핑</span><b>${selectedItem.title}</b></div>
      <strong>${demoData.operationPlan.operation_name}</strong>
      <p>${selectedItem.script}</p>
      <div class="briefing-script-proof">
        <span>${selectedItem.label}</span>
        <b>${selectedItem.proof}</b>
        <button class="mode-button" type="button" data-briefing-action="stage" data-briefing-ref="${selectedItem.stage}">${selectedItem.actionLabel}</button>
      </div>
    `;
  }

  if (timeline) {
    timeline.innerHTML = runway
      .map(
        (item, index) => `
          <article class="${item.id === selectedItem.id ? "is-selected" : ""} ${item.ready ? "is-ready" : "is-pending"}">
            <button type="button" data-briefing-action="select" data-briefing-ref="${item.id}" aria-pressed="${item.id === selectedItem.id ? "true" : "false"}">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <b>${item.title}</b>
              <em>${item.proof}</em>
            </button>
            <button class="briefing-jump-button" type="button" data-briefing-action="stage" data-briefing-ref="${item.stage}">${item.actionLabel}</button>
          </article>
        `
      )
      .join("");
  }

  if (questions) {
    const queue = getBriefingQuestionQueue();
    const selectedQuestion = queue.find((item) => item.id === state.selectedBriefingQuestionId) || queue[0];
    state.selectedBriefingQuestionId = selectedQuestion.id;
    questions.innerHTML = `
      <div class="panel-heading"><span>심사 질문</span><b>${queue.length}개</b></div>
      ${queue
        .map(
          (item) => `
            <article class="${item.id === selectedQuestion.id ? "is-selected" : ""}" data-briefing-question-id="${item.id}">
              <span>${item.label}</span>
              <b>${item.question}</b>
              <p>${item.answer}</p>
              <footer>
                <button type="button" data-briefing-action="question" data-briefing-ref="${item.id}">답변 드릴</button>
                <button type="button" data-briefing-action="stage" data-briefing-ref="${item.stage}">화면 보기</button>
                <button type="button" data-briefing-action="evidence" data-briefing-ref="${item.evidenceId}">근거 열기</button>
              </footer>
            </article>
          `
        )
        .join("")}
    `;
    renderBriefingDrillCard(selectedQuestion, drill);
  }

  if (evidenceLock) {
    const locks = getBriefingEvidenceLockItems();
    evidenceLock.innerHTML = `
      <div class="panel-heading"><span>근거 잠금</span><b>${locks.filter((item) => item.locked).length}/${locks.length}</b></div>
      <div>
        ${locks
          .map(
            (item) => `
              <button class="${item.locked ? "is-locked" : ""}" type="button" data-briefing-action="evidence" data-briefing-ref="${item.id}">
                <span>${item.locked ? "잠금" : "확인"}</span>
                <b>${item.title}</b>
                <em>${item.source} · ${item.linkedFailure}</em>
              </button>
            `
          )
          .join("")}
      </div>
    `;
  }

  if (readiness) {
    readiness.innerHTML = `
      <div class="panel-heading"><span>준비 상태</span><b>브리핑 체크</b></div>
      <div class="briefing-readiness-grid">
        ${getBriefingReadinessItems()
          .map((item) => `<article class="${item.ready ? "is-ready" : "is-pending"}"><span>${item.label}</span><b>${item.value}</b></article>`)
          .join("")}
      </div>
      <button class="combat-button" type="button" data-briefing-action="sheet"><i data-lucide="clipboard-list" aria-hidden="true"></i>검토 패킷 열기</button>
    `;
  }

  refreshIcons();
}

function renderBriefingDrillCard(question, target = byId("briefingDrillCard")) {
  if (!target || !question) return;
  const evidence = evidenceById.get(question.evidenceId);
  target.innerHTML = `
    <div class="panel-heading"><span>답변 드릴</span><b>20초 답변</b></div>
    <strong>${question.question}</strong>
    <p>${question.answer}</p>
    <ol>
      <li><span>첫 문장</span><b>${question.answer.split(".")[0]}</b></li>
      <li><span>보여줄 화면</span><b>${stageMeta[question.stage]?.phase || "관련 화면"}</b></li>
      <li><span>근거</span><b>${evidence?.title || "선택 근거"}</b></li>
    </ol>
    <div class="briefing-drill-actions">
      <button type="button" data-briefing-action="stage" data-briefing-ref="${question.stage}">보여줄 화면</button>
      <button type="button" data-briefing-action="evidence" data-briefing-ref="${question.evidenceId}">근거 열기</button>
    </div>
  `;
}

function selectBriefingQuestion(questionId) {
  const question = getBriefingQuestionQueue().find((item) => item.id === questionId) || getBriefingQuestionQueue()[0];
  if (!question) return;
  state.selectedBriefingQuestionId = question.id;
  renderBriefingRunway();
}

async function runBriefingAction(action, ref, trigger = null) {
  if (action === "select") {
    state.selectedBriefingStepId = ref || state.selectedBriefingStepId;
    renderBriefingRunway();
    return;
  }
  if (action === "question") {
    selectBriefingQuestion(ref);
    return;
  }
  if (action === "stage") {
    if (ref === "briefing") {
      openBriefingSheet();
      return;
    }
    if (stageMeta[ref]) setStage(ref);
    if (ref === "data" && !state.scenarioLoaded) loadScenario();
    if (ref === "agents" && !state.agentsGenerated) generateAgents();
    if (ref === "rehearsal" && !state.rehearsalStarted) runRehearsal();
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "sheet") {
    openBriefingSheet();
    return;
  }
  if (action === "copy") {
    await copyTextToClipboard(getBriefingText());
    if (trigger) {
      const previous = trigger.innerHTML;
      trigger.textContent = "복사 완료";
      window.setTimeout(() => {
        trigger.innerHTML = previous;
        refreshIcons();
      }, 1200);
    }
    return;
  }
  if (action === "auto") {
    runAutoDemo();
  }
}

function getAarImprovementItems() {
  const ownersByFailure = {
    command_gap: "통신참모",
    sustainment_drop: "군수참모",
    accident_delay: "의무참모",
    rejudge_delay: "SOP 검증관"
  };
  const dueByIndex = ["D+0 18:00", "D+1 09:00", "D+1 14:00", "D+2 훈련 전"];
  const executionRows = getDecisionExecutionRows();
  const executionByFailure = new Map(executionRows.map((row) => [row.failure.id, row]));
  return demoData.failures.flatMap((failure) => {
    const profile = getFailureProfile(failure);
    const projected = getProjectedFailureScore(failure);
    const event = profile.events[0] || demoData.events.find((item) => item.linked_risks.includes(failure.id));
    const execution = executionByFailure.get(failure.id);
    const actions = profile.mitigationActions.slice(0, 2);
    return actions.map((action, actionIndex) => {
      const evidenceId = failure.evidence[actionIndex] || execution?.evidenceId || state.selectedEvidenceId;
      const evidence = evidenceById.get(evidenceId);
      const reduction = Math.max(4, Math.round((failure.score - projected.projected) / Math.max(actions.length, 1)));
      return {
        id: `aar-${failure.id}-${actionIndex}`,
        title: action,
        owner: execution?.owner || ownersByFailure[failure.id] || "작전참모",
        due: dueByIndex[actionIndex + (failure.score >= 90 ? 0 : 1)] || "D+2",
        status: projected.projected <= 72 ? "통제 가능" : failure.score >= 90 ? "즉시 보완" : "추적 필요",
        failure,
        event,
        evidence,
        evidenceId,
        before: failure.score,
        after: projected.projected,
        reduction,
        priority: failure.score >= 90 ? "high" : failure.score >= 82 ? "medium" : "low"
      };
    });
  });
}

function getAarOwnerMatrix() {
  const items = getAarImprovementItems();
  const owners = new Map();
  items.forEach((item) => {
    if (!owners.has(item.owner)) {
      owners.set(item.owner, {
        owner: item.owner,
        actions: [],
        high: 0,
        evidence: new Set(),
        maxRisk: 0
      });
    }
    const entry = owners.get(item.owner);
    entry.actions.push(item);
    if (item.priority === "high") entry.high += 1;
    if (item.evidenceId) entry.evidence.add(item.evidenceId);
    entry.maxRisk = Math.max(entry.maxRisk, item.before);
  });
  return [...owners.values()].map((entry) => ({
    ...entry,
    evidenceCount: entry.evidence.size,
    load: entry.actions.length
  }));
}

function getAarEvidenceReplayItems() {
  return demoData.events
    .filter((event) => event.severity === "high" || event.linked_risks.length)
    .map((event) => {
      const failure = demoData.failures.find((item) => event.linked_risks.includes(item.id)) || getFailureById(state.selectedFailureId);
      const evidenceId = event.evidence_ids?.[0] || failure.evidence[0];
      const evidence = evidenceById.get(evidenceId);
      return {
        event,
        failure,
        evidence,
        evidenceId,
        actionCount: getAarImprovementItems().filter((item) => item.failure.id === failure.id).length
      };
    })
    .slice(0, 6);
}

function getAarPacket() {
  const actions = getAarImprovementItems();
  return {
    package_type: "war-ground-aar-improvement-plan",
    generated_at: new Date().toISOString(),
    mission: demoData.operationPlan.operation_name,
    recommended_decision: demoData.decision.recommended_coa,
    selected_action: state.selectedAarActionId,
    actions: actions.map((item) => ({
      id: item.id,
      title: item.title,
      owner: item.owner,
      due: item.due,
      status: item.status,
      failure: item.failure.title,
      event: item.event ? `${item.event.time} ${item.event.event}` : null,
      evidence: item.evidence?.title || item.evidenceId,
      risk_before: item.before,
      risk_after: item.after
    })),
    owner_matrix: getAarOwnerMatrix().map((owner) => ({
      owner: owner.owner,
      actions: owner.load,
      high_priority: owner.high,
      evidence: owner.evidenceCount,
      max_risk: owner.maxRisk
    }))
  };
}

function renderAarImprovementPlan() {
  const page = byId("page-aar");
  if (!page) return;
  const actions = getAarImprovementItems();
  const selected = actions.find((item) => item.id === state.selectedAarActionId) || actions[0];
  if (selected) state.selectedAarActionId = selected.id;
  const owners = getAarOwnerMatrix();
  const replayItems = getAarEvidenceReplayItems();
  const averageBefore = Math.round(actions.reduce((sum, item) => sum + item.before, 0) / Math.max(actions.length, 1));
  const averageAfter = Math.round(actions.reduce((sum, item) => sum + item.after, 0) / Math.max(actions.length, 1));
  const summary = byId("aarSummaryPanel");
  const board = byId("aarActionBoard");
  const ownerMatrix = byId("aarOwnerMatrix");
  const evidenceReplay = byId("aarEvidenceReplay");

  if (summary) {
    summary.innerHTML = `
      <div class="panel-heading"><span>AAR 개선안</span><b>${actions.length}개 조치</b></div>
      <strong>${selected?.failure.title || "후속 조치"} 보완 계획</strong>
      <p>${selected?.title || "리허설 이후 보완 조치를 선택하세요."}</p>
      <div class="aar-summary-kpis">
        <article><span>평균 위험</span><b>${averageBefore} → ${averageAfter}</b></article>
        <article><span>책임 축</span><b>${owners.length}개</b></article>
        <article><span>즉시 보완</span><b>${actions.filter((item) => item.priority === "high").length}건</b></article>
      </div>
      ${selected ? `
        <div class="aar-selected-action">
          <span>${selected.owner} · ${selected.due}</span>
          <b>${selected.status}</b>
          <em>근거: ${selected.evidence?.title || selected.evidenceId}</em>
          <div>
            <button type="button" data-aar-action="risk" data-aar-ref="${selected.failure.id}">실패경로</button>
            <button type="button" data-aar-action="evidence" data-aar-ref="${selected.evidenceId}">근거 열기</button>
          </div>
        </div>
      ` : ""}
    `;
  }

  if (board) {
    board.innerHTML = `
      <div class="panel-heading"><span>조치 보드</span><b>소유자 / 기한 / 위험감쇄</b></div>
      ${actions
        .map(
          (item) => `
            <article class="aar-action-card is-${item.priority} ${item.id === state.selectedAarActionId ? "is-selected" : ""}">
              <button type="button" data-aar-action="select" data-aar-ref="${item.id}" aria-pressed="${item.id === state.selectedAarActionId ? "true" : "false"}">
                <span>${item.status}</span>
                <b>${item.title}</b>
                <p>${item.failure.title} ${item.before} → ${item.after} / ${item.owner}</p>
              </button>
              <footer>
                <em>${item.due}</em>
                <button type="button" data-aar-action="event" data-aar-ref="${item.event?.id || ""}">리허설</button>
              </footer>
            </article>
          `
        )
        .join("")}
    `;
  }

  if (ownerMatrix) {
    ownerMatrix.innerHTML = `
      <div class="panel-heading"><span>책임자 매트릭스</span><b>${owners.length}개 책임 축</b></div>
      ${owners
        .map(
          (owner) => `
            <article>
              <span>${owner.owner}</span>
              <b>${owner.load}개 조치</b>
              <p>최고 위험 ${owner.maxRisk} · 직접 근거 ${owner.evidenceCount}건 · 즉시 ${owner.high}건</p>
              <i><span style="width: ${Math.min(100, owner.maxRisk)}%"></span></i>
            </article>
          `
        )
        .join("")}
    `;
  }

  if (evidenceReplay) {
    evidenceReplay.innerHTML = `
      <div class="panel-heading"><span>근거 리플레이</span><b>${replayItems.length}개 이벤트</b></div>
      ${replayItems
        .map(
          (item) => `
            <button type="button" data-aar-action="event" data-aar-ref="${item.event.id}">
              <span>${item.event.time} · ${riskLabel(item.event.severity)}</span>
              <b>${item.event.event}</b>
              <em>${item.failure.title} / ${item.evidence?.title || item.evidenceId} / 조치 ${item.actionCount}건</em>
            </button>
          `
        )
        .join("")}
    `;
  }
  refreshIcons();
}

function runAarAction(action, ref) {
  if (action === "select") {
    state.selectedAarActionId = ref || state.selectedAarActionId;
    renderAarImprovementPlan();
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "event") {
    const index = demoData.events.findIndex((event) => event.id === ref);
    setStage("rehearsal");
    if (index >= 0) {
      clearTimer("rehearsalTimer");
      state.rehearsalStarted = true;
      state.rehearsalPaused = true;
      setText("rehearsalPauseButton", "계속");
      showEvent(index);
    }
    return;
  }
  if (action === "decision") {
    setStage("decision");
    setDecisionTab("card");
    return;
  }
  if (action === "rehearsal") {
    setStage("rehearsal");
    return;
  }
  if (action === "packet") {
    downloadJson(getAarPacket(), "war-ground-aar-improvement-plan.json");
  }
}

function getAuditTrailItems() {
  const selectedFailure = getFailureById(state.selectedFailureId);
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : demoData.events.find((event) => event.severity === "high");
  const activeConditions = getActiveDecisionConditionIds().size;
  const aarActions = getAarImprovementItems();
  const evidenceTotal = demoData.evidence.length;
  return [
    {
      id: "audit-intake",
      stage: "data",
      time: "00:00",
      title: "작전계획 접수",
      summary: `${demoData.operationPlan.documents.length}종 자료에서 임무, 제한사항, 방책 비교를 추출`,
      proof: state.scenarioLoaded ? "접수 완료" : "시연 데이터 기준",
      evidenceIds: ["ev_plan_mission"],
      status: state.scenarioLoaded ? "완료" : "대기",
      tone: "source"
    },
    {
      id: "audit-graph",
      stage: "ontology",
      time: "00:45",
      title: "근거 그래프 구성",
      summary: `${graph.nodes.length}개 노드와 ${graph.edges.length}개 관계로 결심 경로 연결`,
      proof: "결심 노드 역추적 가능",
      evidenceIds: demoData.decision.evidence_ids,
      status: "검증",
      tone: "evidence"
    },
    {
      id: "audit-agents",
      stage: "agents",
      time: "01:25",
      title: "가상부대 역할 검토",
      summary: `${state.generatedAgentCount || demoData.agents.length}개 역할이 위험 초점과 산출물을 분담`,
      proof: `${debateEntries.length}개 토론 발언`,
      evidenceIds: debateEntries.map((item) => item.evidence),
      status: state.agentsGenerated ? "완료" : "준비",
      tone: "agent"
    },
    {
      id: "audit-rehearsal",
      stage: "rehearsal",
      time: activeEvent?.time || "02:05",
      title: "리허설 이벤트 기록",
      summary: activeEvent ? `${activeEvent.event} / ${activeEvent.impact}` : "시간순 이벤트 대기",
      proof: `${demoData.events.length}개 이벤트`,
      evidenceIds: activeEvent?.evidence_ids || ["ev_redteam_delay"],
      status: state.rehearsalStarted ? "재생" : "대기",
      tone: activeEvent?.severity === "high" ? "danger" : "event"
    },
    {
      id: "audit-risk",
      stage: "risk",
      time: "03:10",
      title: "실패경로 압축",
      summary: `${selectedFailure.title} ${selectedFailure.score}점 흐름을 차단 지점과 조치로 압축`,
      proof: `${demoData.failures.length}개 실패경로`,
      evidenceIds: selectedFailure.evidence,
      status: "위험 잠금",
      tone: "risk"
    },
    {
      id: "audit-decision",
      stage: "decision",
      time: "04:05",
      title: "결심카드 승인 게이트",
      summary: `${demoData.decision.recommended_coa} 추천안과 ${activeConditions}/${getDecisionConditions().length}개 승인 조건 확인`,
      proof: `${demoData.decision.evidence_ids.length}/${evidenceTotal} 직접 근거`,
      evidenceIds: demoData.decision.evidence_ids,
      status: "검토안",
      tone: "decision"
    },
    {
      id: "audit-briefing",
      stage: "briefing",
      time: "04:45",
      title: "브리핑 근거 잠금",
      summary: `${getBriefingQuestionQueue().length}개 심사 질문과 ${getBriefingEvidenceLockItems().length}개 근거 잠금`,
      proof: "1분 브리핑 준비",
      evidenceIds: getBriefingEvidenceLockItems().flatMap((item) => item.evidenceIds || []),
      status: "발표 가능",
      tone: "briefing"
    },
    {
      id: "audit-aar",
      stage: "aar",
      time: "05:10",
      title: "AAR 후속 조치",
      summary: `${aarActions.length}개 보완 조치가 책임자, 기한, 근거와 연결`,
      proof: `${getAarOwnerMatrix().length}개 책임 축`,
      evidenceIds: aarActions.map((item) => item.evidenceId).filter(Boolean),
      status: "후속 조치",
      tone: "aar"
    }
  ];
}

function getAuditEvidenceLedger() {
  const trail = getAuditTrailItems();
  return demoData.evidence.map((evidence) => {
    const linkedTrail = trail.filter((item) => item.evidenceIds.includes(evidence.id));
    const linkedFailures = demoData.failures.filter((failure) => failure.evidence.includes(evidence.id));
    const linkedEvents = demoData.events.filter((event) => event.evidence_ids?.includes(evidence.id));
    return {
      ...evidence,
      linkedTrail,
      linkedFailures,
      linkedEvents,
      coverage: linkedTrail.length + linkedFailures.length + linkedEvents.length
    };
  });
}

function getAuditCoverageSummary() {
  const trail = getAuditTrailItems();
  const ledger = getAuditEvidenceLedger();
  const usedEvidence = new Set(trail.flatMap((item) => item.evidenceIds));
  const weakEvidence = ledger.filter((item) => item.coverage <= 1);
  const pendingTrail = trail.filter((item) => ["대기", "준비"].includes(item.status));
  const highRiskOpen = getAarImprovementItems().filter((item) => item.priority === "high");
  return {
    trailCount: trail.length,
    evidenceCount: ledger.length,
    usedEvidenceCount: usedEvidence.size,
    weakEvidenceCount: weakEvidence.length,
    pendingCount: pendingTrail.length,
    gapCount: weakEvidence.length + pendingTrail.length,
    highActionCount: highRiskOpen.length,
    verifiedPercent: Math.round((usedEvidence.size / Math.max(ledger.length, 1)) * 100),
    weakEvidence,
    pendingTrail,
    highRiskOpen
  };
}

function renderAuditLogbook() {
  const page = byId("page-audit");
  if (!page) return;
  const trail = getAuditTrailItems();
  const selected = trail.find((item) => item.id === state.selectedAuditItemId) || trail[0];
  if (selected) state.selectedAuditItemId = selected.id;
  const ledger = getAuditEvidenceLedger();
  const summaryData = getAuditCoverageSummary();
  const summary = byId("auditSummaryPanel");
  const timeline = byId("auditTimelinePanel");
  const evidence = byId("auditEvidencePanel");
  const gap = byId("auditGapPanel");

  if (summary) {
    summary.innerHTML = `
      <div class="panel-heading"><span>감사 로그</span><b>소스 투입부터 AAR까지</b></div>
      <strong>${selected?.title || "검증 항목"} 검증</strong>
      <p>${selected?.summary || "판단 이벤트를 선택하면 연결 근거와 검증 상태를 확인합니다."}</p>
      <div class="audit-summary-kpis">
        <article><span>판단 이벤트</span><b>${summaryData.trailCount}</b></article>
        <article><span>근거 사용률</span><b>${summaryData.verifiedPercent}%</b></article>
        <article><span>검증 공백</span><b>${summaryData.gapCount}</b></article>
      </div>
      ${selected ? `
        <div class="audit-selected-item">
          <span>${selected.time} · ${stageMeta[selected.stage]?.phase || selected.stage}</span>
          <b>${selected.status}</b>
          <em>${selected.proof}</em>
          <button type="button" data-audit-action="stage" data-audit-ref="${selected.stage}">해당 화면</button>
        </div>
      ` : ""}
    `;
  }

  if (timeline) {
    timeline.innerHTML = `
      <div class="panel-heading"><span>판단 타임라인</span><b>${trail.length}개 이벤트</b></div>
      ${trail
        .map(
          (item) => `
            <article class="audit-timeline-item is-${item.tone} ${item.id === state.selectedAuditItemId ? "is-selected" : ""}">
              <button type="button" data-audit-action="select" data-audit-ref="${item.id}" aria-pressed="${item.id === state.selectedAuditItemId ? "true" : "false"}">
                <span>${item.time} · ${item.status}</span>
                <b>${item.title}</b>
                <p>${item.summary}</p>
              </button>
              <footer>
                <em>${item.evidenceIds.length}개 근거</em>
                <button type="button" data-audit-action="stage" data-audit-ref="${item.stage}">보기</button>
              </footer>
            </article>
          `
        )
        .join("")}
    `;
  }

  if (evidence) {
    evidence.innerHTML = `
      <div class="panel-heading"><span>근거 원장</span><b>${ledger.length}개 출처</b></div>
      ${ledger
        .map(
          (item) => `
            <button type="button" class="audit-evidence-row ${item.coverage <= 1 ? "is-weak" : ""}" data-audit-action="evidence" data-audit-ref="${item.id}">
              <span>${item.source}</span>
              <b>${item.title}</b>
              <em>연결 ${item.coverage}건 · 실패경로 ${item.linkedFailures.length} · 이벤트 ${item.linkedEvents.length}</em>
            </button>
          `
        )
        .join("")}
    `;
  }

  if (gap) {
    const gapRows = [
      ...summaryData.pendingTrail.map((item) => ({
        label: "대기 항목",
        title: item.title,
        detail: item.proof,
        action: "stage",
        ref: item.stage
      })),
      ...summaryData.weakEvidence.map((item) => ({
        label: "약한 근거",
        title: item.title,
        detail: `${item.source} / 연결 ${item.coverage}건`,
        action: "evidence",
        ref: item.id
      })),
      ...summaryData.highRiskOpen.slice(0, 3).map((item) => ({
        label: "즉시 보완",
        title: item.title,
        detail: `${item.owner} · ${item.due}`,
        action: "stage",
        ref: "aar"
      }))
    ].slice(0, 8);
    gap.innerHTML = `
      <div class="panel-heading"><span>검증 공백</span><b>${gapRows.length}개 점검</b></div>
      ${gapRows.length
        ? gapRows
          .map(
            (item) => `
              <button type="button" data-audit-action="${item.action}" data-audit-ref="${item.ref}">
                <span>${item.label}</span>
                <b>${item.title}</b>
                <em>${item.detail}</em>
              </button>
            `
          )
          .join("")
        : `<p class="audit-empty">현재 검증 공백이 없습니다.</p>`}
    `;
  }
}

function runAuditAction(action, ref) {
  if (action === "select") {
    state.selectedAuditItemId = ref || state.selectedAuditItemId;
    renderAuditLogbook();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
  }
}

function getSubmissionReadinessItems() {
  const auditSummary = getAuditCoverageSummary();
  const briefingSnapshot = getBriefingSnapshot();
  const activeConditions = getActiveDecisionConditionIds().size;
  const aarActions = getAarImprovementItems();
  return [
    {
      id: "source",
      label: "자료 접수",
      value: state.scenarioLoaded ? "완료" : "시연 데이터",
      detail: `${demoData.operationPlan.documents.length}종 자료 / ${demoData.coas.length}개 방책`,
      ready: true
    },
    {
      id: "rehearsal",
      label: "리허설 근거",
      value: state.rehearsalStarted ? "재생 완료" : "데모 기준",
      detail: `${demoData.events.length}개 이벤트 / ${demoData.failures.length}개 실패경로`,
      ready: true
    },
    {
      id: "decision",
      label: "결심 게이트",
      value: `${activeConditions}/${getDecisionConditions().length}`,
      detail: `${demoData.decision.recommended_coa} / 직접 근거 ${demoData.decision.evidence_ids.length}건`,
      ready: activeConditions >= getDecisionConditions().length
    },
    {
      id: "briefing",
      label: "브리핑",
      value: "준비",
      detail: `${getBriefingQuestionQueue().length}개 질문 / 잔여위험 ${briefingSnapshot.residualRisk}`,
      ready: getBriefingQuestionQueue().length >= 4
    },
    {
      id: "aar",
      label: "AAR 조치",
      value: `${aarActions.length}건`,
      detail: `${getAarOwnerMatrix().length}개 책임 축 / 즉시 ${aarActions.filter((item) => item.priority === "high").length}건`,
      ready: aarActions.length >= 6
    },
    {
      id: "audit",
      label: "감사 로그",
      value: `${auditSummary.verifiedPercent}%`,
      detail: `${auditSummary.trailCount}개 판단 이벤트 / 공백 ${auditSummary.gapCount}건`,
      ready: auditSummary.verifiedPercent >= 80
    },
    {
      id: "retrain",
      label: "재훈련 계획",
      value: `${getRetrainingScheduleItems().length}건`,
      detail: `${getRetrainingOwnerLoads().length}개 책임 축 / 검증 ${getRetrainingValidationGates().filter((item) => item.ready).length}/${getRetrainingValidationGates().length}`,
      ready: getRetrainingScheduleItems().length >= 6
    }
  ];
}

function getSubmissionReadinessScore() {
  const items = getSubmissionReadinessItems();
  return Math.round((items.filter((item) => item.ready).length / Math.max(items.length, 1)) * 100);
}

function getSubmissionBundleItems() {
  const auditSummary = getAuditCoverageSummary();
  return [
    {
      id: "submit-briefing",
      title: "심사 브리핑 패킷",
      type: "presentation",
      stage: "briefing",
      owner: "발표자",
      status: "준비",
      detail: `1분 브리핑, ${getBriefingQuestionQueue().length}개 예상 질문, ${getBriefingEvidenceLockItems().length}개 근거 잠금`,
      fileName: "war-ground-briefing-packet.json"
    },
    {
      id: "submit-decision",
      title: "지휘관 결심카드",
      type: "decision",
      stage: "decision",
      owner: "지휘관",
      status: "승인 대기",
      detail: `${demoData.decision.recommended_coa} / ${demoData.decision.immediate_actions.length}개 즉시 조치`,
      fileName: "war-ground-decision-card.json"
    },
    {
      id: "submit-aar",
      title: "AAR 개선안",
      type: "followup",
      stage: "aar",
      owner: "작전참모",
      status: "후속 조치",
      detail: `${getAarImprovementItems().length}개 조치 / ${getAarOwnerMatrix().length}개 책임 축`,
      fileName: "war-ground-aar-improvement-plan.json"
    },
    {
      id: "submit-audit",
      title: "감사 로그",
      type: "audit",
      stage: "audit",
      owner: "검증관",
      status: auditSummary.gapCount ? "공백 표시" : "검증 완료",
      detail: `${auditSummary.trailCount}개 판단 이벤트 / 근거 사용률 ${auditSummary.verifiedPercent}%`,
      fileName: "war-ground-audit-logbook.json"
    },
    {
      id: "submit-retrain",
      title: "72시간 재훈련 계획",
      type: "retraining",
      stage: "retrain",
      owner: "훈련장교",
      status: "편성 완료",
      detail: `${getRetrainingScheduleItems().length}개 훈련 과제 / ${getRetrainingValidationGates().filter((item) => item.ready).length}개 검증 게이트 잠금`,
      fileName: "war-ground-72h-retraining-plan.json"
    },
    {
      id: "submit-manifest",
      title: "제출 매니페스트",
      type: "manifest",
      stage: "submit",
      owner: "제출 담당",
      status: "생성",
      detail: "산출물 파일명, 준비도, 직접 근거, 생성 시각을 묶은 최종 목록",
      fileName: "war-ground-submission-manifest.json"
    }
  ];
}

function getSubmissionManifest() {
  const readiness = getSubmissionReadinessItems();
  const bundles = getSubmissionBundleItems();
  return {
    package_type: "war-ground-final-submission-package",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    mission: demoData.operationPlan.mission,
    readiness_score: getSubmissionReadinessScore(),
    recommended_decision: demoData.decision.recommended_coa,
    files: bundles.map((item) => ({
      id: item.id,
      file_name: item.fileName,
      title: item.title,
      owner: item.owner,
      status: item.status,
      source_stage: item.stage
    })),
    readiness_gates: readiness.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
      ready: item.ready,
      detail: item.detail
    })),
    audit: {
      trail_events: getAuditTrailItems().length,
      evidence_sources: getAuditEvidenceLedger().length,
      gaps: getAuditCoverageSummary().gapCount
    },
    retraining: {
      drills: getRetrainingScheduleItems().length,
      owners: getRetrainingOwnerLoads().length,
      validation_gates: getRetrainingValidationGates().length
    }
  };
}

function renderSubmissionPackage() {
  const page = byId("page-submit");
  if (!page) return;
  const readiness = getSubmissionReadinessItems();
  const bundles = getSubmissionBundleItems();
  const selected = bundles.find((item) => item.id === state.selectedSubmitBundleId) || bundles[0];
  if (selected) state.selectedSubmitBundleId = selected.id;
  const manifest = getSubmissionManifest();
  const score = getSubmissionReadinessScore();
  const readinessPanel = byId("submitReadinessPanel");
  const bundlePanel = byId("submitBundlePanel");
  const checklistPanel = byId("submitChecklistPanel");
  const manifestPanel = byId("submitManifestPanel");

  if (readinessPanel) {
    readinessPanel.innerHTML = `
      <div class="panel-heading"><span>제출 준비도</span><b>${score}%</b></div>
      <strong>최종 제출 패키지</strong>
      <p>${manifest.files.length}개 산출물과 ${readiness.length}개 준비 게이트를 제출 전 한 번에 확인합니다.</p>
      <div class="submit-score-ring" aria-label="제출 준비도 ${score}%"><span>${score}%</span><i style="--score:${score}"></i></div>
      <div class="submit-selected-bundle">
        <span>${selected?.owner || "제출 담당"}</span>
        <b>${selected?.title || "산출물 선택"}</b>
        <em>${selected?.detail || "산출물을 선택하면 제출 상태를 확인합니다."}</em>
      </div>
    `;
  }

  if (bundlePanel) {
    bundlePanel.innerHTML = `
      <div class="panel-heading"><span>산출물 묶음</span><b>${bundles.length}개 파일</b></div>
      ${bundles.map((item) => `
        <article class="submit-bundle-card ${item.id === state.selectedSubmitBundleId ? "is-selected" : ""}">
          <button type="button" data-submit-action="select" data-submit-ref="${item.id}" aria-pressed="${item.id === state.selectedSubmitBundleId ? "true" : "false"}">
            <span>${item.type} · ${item.status}</span>
            <b>${item.title}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>${item.fileName}</em>
            <button type="button" data-submit-action="stage" data-submit-ref="${item.stage}">보기</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (checklistPanel) {
    checklistPanel.innerHTML = `
      <div class="panel-heading"><span>제출 체크리스트</span><b>${readiness.filter((item) => item.ready).length}/${readiness.length}</b></div>
      ${readiness.map((item) => `
        <article class="${item.ready ? "is-ready" : "is-pending"}">
          <span>${item.ready ? "READY" : "CHECK"}</span>
          <b>${item.label}</b>
          <p>${item.value} · ${item.detail}</p>
        </article>
      `).join("")}
    `;
  }

  if (manifestPanel) {
    manifestPanel.innerHTML = `
      <div class="panel-heading"><span>제출 매니페스트</span><b>${manifest.package_type}</b></div>
      <div class="submit-manifest-list">
        <article><span>작전</span><b>${manifest.operation}</b></article>
        <article><span>추천 결심</span><b>${manifest.recommended_decision}</b></article>
        <article><span>파일</span><b>${manifest.files.length}개</b></article>
        <article><span>감사</span><b>${manifest.audit.trail_events}개 이벤트</b></article>
      </div>
      <div class="submit-manifest-actions">
        <button type="button" data-submit-action="copy">요약 복사</button>
        <button type="button" data-submit-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function getSubmissionSummaryText() {
  const manifest = getSubmissionManifest();
  return [
    `WAR GROUND 제출 패키지`,
    `작전: ${manifest.operation}`,
    `추천 결심: ${manifest.recommended_decision}`,
    `준비도: ${manifest.readiness_score}%`,
    `파일: ${manifest.files.map((item) => item.file_name).join(", ")}`,
    `감사: 판단 이벤트 ${manifest.audit.trail_events}개 / 근거 ${manifest.audit.evidence_sources}개 / 공백 ${manifest.audit.gaps}개`
  ].join("\n");
}

function runSubmissionAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedSubmitBundleId = ref || state.selectedSubmitBundleId;
    renderSubmissionPackage();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "download") {
    downloadJson(getSubmissionManifest(), "war-ground-final-submission-package.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getSubmissionSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getRetrainingDrillMeta(failureId) {
  const drillByFailure = {
    command_gap: {
      drill: "예비망 전환 3분 드릴",
      measure: "보고 누락 0건",
      range: "통신 음영 진입 전",
      asset: "통신참모 / 무전반"
    },
    sustainment_drop: {
      drill: "보급 대기점 재배치 워크스루",
      measure: "대기 15분 이하",
      range: "보급 대기점 노출 전",
      asset: "군수참모 / 보급반"
    },
    accident_delay: {
      drill: "후송로 개방 연락훈련",
      measure: "후송 판단 5분 이내",
      range: "시정 저하 확인 직후",
      asset: "의무참모 / 통제관"
    },
    rejudge_delay: {
      drill: "전환 승인권자 콜드콜",
      measure: "재판단 승인 2콜 이내",
      range: "04:20 이전",
      asset: "SOP 검증관 / 지휘소"
    }
  };
  return drillByFailure[failureId] || {
    drill: "위험 차단 반복훈련",
    measure: "잔여 위험 72점 이하",
    range: "다음 훈련 전",
    asset: "작전참모"
  };
}

function getRetrainingScheduleItems() {
  const windows = ["D+0 18:00", "D+1 09:00", "D+1 15:00", "D+2 10:00", "D+2 15:00", "D+3 09:00"];
  return getAarImprovementItems().slice(0, 8).map((action, index) => {
    const meta = getRetrainingDrillMeta(action.failure.id);
    return {
      id: `retrain-${action.failure.id}-${index}`,
      title: action.title,
      owner: action.owner,
      window: windows[index % windows.length],
      status: index < 2 ? "즉시 편성" : action.priority === "high" ? "우선 편성" : "예정",
      drill: meta.drill,
      measure: meta.measure,
      range: meta.range,
      asset: meta.asset,
      failure: action.failure,
      event: action.event,
      evidence: action.evidence,
      evidenceId: action.evidenceId,
      sourceActionId: action.id,
      residualRisk: action.after,
      priority: action.priority
    };
  });
}

function getRetrainingOwnerLoads() {
  const owners = new Map();
  getRetrainingScheduleItems().forEach((item) => {
    if (!owners.has(item.owner)) {
      owners.set(item.owner, {
        owner: item.owner,
        drills: [],
        evidence: new Set(),
        high: 0,
        earliest: item.window
      });
    }
    const owner = owners.get(item.owner);
    owner.drills.push(item);
    if (item.evidenceId) owner.evidence.add(item.evidenceId);
    if (item.priority === "high") owner.high += 1;
  });
  return [...owners.values()].map((owner) => ({
    ...owner,
    load: owner.drills.length,
    evidenceCount: owner.evidence.size,
    readiness: clamp(72 + owner.evidence.size * 8 - owner.high * 4, 58, 98)
  }));
}

function getRetrainingValidationGates() {
  const schedule = getRetrainingScheduleItems();
  const audit = getAuditCoverageSummary();
  const activeConditions = getActiveDecisionConditionIds().size;
  const highDrills = schedule.filter((item) => item.priority === "high");
  return [
    {
      id: "gate-aar",
      label: "AAR 조치 전환",
      value: `${schedule.length}/${getAarImprovementItems().length}`,
      detail: "후속 조치가 훈련 과제로 변환됨",
      ready: schedule.length >= 6,
      tone: "primary"
    },
    {
      id: "gate-evidence",
      label: "직접 근거",
      value: `${new Set(schedule.map((item) => item.evidenceId).filter(Boolean)).size}건`,
      detail: "각 훈련 과제에 문서 또는 이벤트 근거 연결",
      ready: audit.verifiedPercent >= 80,
      tone: "evidence"
    },
    {
      id: "gate-decision",
      label: "결심 조건 유지",
      value: `${activeConditions}/${getDecisionConditions().length}`,
      detail: "통신, 군수, 재판단, 후송 조건을 재훈련 기준으로 유지",
      ready: activeConditions >= getDecisionConditions().length,
      tone: "support"
    },
    {
      id: "gate-high-risk",
      label: "고위험 우선",
      value: `${highDrills.length}건`,
      detail: "90점 이상 실패경로를 D+1 이전 과제로 배치",
      ready: highDrills.length >= 2,
      tone: "danger"
    }
  ];
}

function getRetrainingPacket() {
  const schedule = getRetrainingScheduleItems();
  return {
    package_type: "war-ground-72h-retraining-plan",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    source_decision: demoData.decision.recommended_coa,
    selected_drill: state.selectedRetrainItemId,
    schedule: schedule.map((item) => ({
      id: item.id,
      source_action: item.sourceActionId,
      window: item.window,
      title: item.title,
      drill: item.drill,
      owner: item.owner,
      status: item.status,
      validation: item.measure,
      failure: item.failure.title,
      evidence: item.evidence?.title || item.evidenceId
    })),
    owners: getRetrainingOwnerLoads().map((owner) => ({
      owner: owner.owner,
      drills: owner.load,
      high_priority: owner.high,
      evidence: owner.evidenceCount,
      readiness: owner.readiness
    })),
    validation_gates: getRetrainingValidationGates().map((gate) => ({
      id: gate.id,
      label: gate.label,
      value: gate.value,
      ready: gate.ready,
      detail: gate.detail
    }))
  };
}

function renderRetrainingPlan() {
  const page = byId("page-retrain");
  if (!page) return;
  const schedule = getRetrainingScheduleItems();
  const selected = schedule.find((item) => item.id === state.selectedRetrainItemId) || schedule[0];
  if (selected) state.selectedRetrainItemId = selected.id;
  const owners = getRetrainingOwnerLoads();
  const gates = getRetrainingValidationGates();
  const schedulePanel = byId("retrainSchedulePanel");
  const ownerPanel = byId("retrainOwnerPanel");
  const validationPanel = byId("retrainValidationPanel");
  const drillPanel = byId("retrainDrillPanel");

  if (schedulePanel) {
    schedulePanel.innerHTML = `
      <div class="panel-heading"><span>72시간 재훈련</span><b>${schedule.length}개 과제</b></div>
      <div class="retrain-schedule-list">
        ${schedule.map((item) => `
          <article class="retrain-schedule-card is-${item.priority} ${item.id === state.selectedRetrainItemId ? "is-selected" : ""}">
            <button type="button" data-retrain-action="select" data-retrain-ref="${item.id}" aria-pressed="${item.id === state.selectedRetrainItemId ? "true" : "false"}">
              <span>${item.window} · ${item.status}</span>
              <b>${item.drill}</b>
              <p>${item.title}</p>
            </button>
            <footer>
              <em>${item.owner}</em>
              <button type="button" data-retrain-action="risk" data-retrain-ref="${item.failure.id}">위험</button>
            </footer>
          </article>
        `).join("")}
      </div>
    `;
  }

  if (ownerPanel) {
    ownerPanel.innerHTML = `
      <div class="panel-heading"><span>훈련 과제</span><b>${owners.length}개 책임 축</b></div>
      ${owners.map((owner) => `
        <article>
          <span>${owner.owner}</span>
          <b>${owner.load}개 드릴 · 즉시 ${owner.high}건</b>
          <p>${owner.drills.slice(0, 2).map((item) => item.drill).join(" / ")}</p>
          <i><span style="width: ${owner.readiness}%"></span></i>
        </article>
      `).join("")}
    `;
  }

  if (validationPanel) {
    validationPanel.innerHTML = `
      <div class="panel-heading"><span>검증 게이트</span><b>${gates.filter((item) => item.ready).length}/${gates.length}</b></div>
      ${gates.map((gate) => `
        <article class="is-${gate.tone} ${gate.ready ? "is-ready" : "is-pending"}">
          <span>${gate.ready ? "LOCK" : "CHECK"}</span>
          <b>${gate.label}</b>
          <p>${gate.value} · ${gate.detail}</p>
        </article>
      `).join("")}
    `;
  }

  if (drillPanel) {
    drillPanel.innerHTML = `
      <div class="panel-heading"><span>선택 훈련</span><b>${selected?.window || "대기"}</b></div>
      ${selected ? `
        <strong>${selected.drill}</strong>
        <p>${selected.title}</p>
        <div class="retrain-drill-facts">
          <article><span>담당</span><b>${selected.owner}</b></article>
          <article><span>기준</span><b>${selected.measure}</b></article>
          <article><span>시점</span><b>${selected.range}</b></article>
          <article><span>자산</span><b>${selected.asset}</b></article>
        </div>
        <div class="retrain-source-card">
          <span>${selected.failure.title} · 잔여위험 ${selected.residualRisk}</span>
          <b>${selected.event ? `${selected.event.time} ${selected.event.event}` : "관련 이벤트 없음"}</b>
          <em>${selected.evidence?.title || selected.evidenceId}</em>
        </div>
        <div class="retrain-drill-actions">
          <button type="button" data-retrain-action="evidence" data-retrain-ref="${selected.evidenceId}">근거 열기</button>
          <button type="button" data-retrain-action="stage" data-retrain-ref="aar">AAR 보기</button>
          <button type="button" data-retrain-action="download">계획 저장</button>
        </div>
      ` : "<p>선택된 훈련 과제가 없습니다.</p>"}
    `;
  }
  refreshIcons();
}

function runRetrainingAction(action, ref) {
  if (action === "select") {
    state.selectedRetrainItemId = ref || state.selectedRetrainItemId;
    renderRetrainingPlan();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getRetrainingPacket(), "war-ground-72h-retraining-plan.json");
  }
}

function getHandoffRecipientItems() {
  const schedule = getRetrainingScheduleItems();
  const commandDrill = schedule.find((item) => item.failure.id === "command_gap") || schedule[0];
  const logisticsDrill = schedule.find((item) => item.failure.id === "sustainment_drop") || schedule[1] || schedule[0];
  const auditSummary = getAuditCoverageSummary();
  return [
    {
      id: "handoff-commander",
      recipient: "지휘관",
      role: "최종 승인",
      priority: "즉시",
      packet: "결심 승인 인계",
      action: demoData.decision.commander_check_items[0] || demoData.decision.immediate_actions[0],
      proof: `${demoData.decision.recommended_coa} / 직접 근거 ${demoData.decision.evidence_ids.length}건`,
      evidenceId: demoData.decision.evidence_ids[0],
      stage: "decision",
      tone: "primary"
    },
    {
      id: "handoff-signals",
      recipient: "통신참모",
      role: "통신 보완",
      priority: commandDrill?.status || "즉시",
      packet: "예비망 전환 인계",
      action: commandDrill?.title || "예비망 전환 권한 확인",
      proof: commandDrill ? `${commandDrill.window} · ${commandDrill.drill}` : "통신 음영 차단",
      evidenceId: commandDrill?.evidenceId || "ev_comm_gap",
      stage: "retrain",
      tone: "danger"
    },
    {
      id: "handoff-logistics",
      recipient: "군수참모",
      role: "보급 지속성",
      priority: logisticsDrill?.status || "우선",
      packet: "보급 대기점 인계",
      action: logisticsDrill?.title || "보급 대기점 재배치",
      proof: logisticsDrill ? `${logisticsDrill.window} · ${logisticsDrill.drill}` : "보급 접근성 유지",
      evidenceId: logisticsDrill?.evidenceId || "ev_logistics_supply",
      stage: "retrain",
      tone: "support"
    },
    {
      id: "handoff-training",
      recipient: "훈련장교",
      role: "재훈련 통제",
      priority: "D+0",
      packet: "72시간 재훈련 인계",
      action: `${schedule.length}개 훈련 과제 편성 확인`,
      proof: `${getRetrainingValidationGates().filter((item) => item.ready).length}/${getRetrainingValidationGates().length} 검증 게이트`,
      evidenceId: schedule[0]?.evidenceId || state.selectedEvidenceId,
      stage: "retrain",
      tone: "primary"
    },
    {
      id: "handoff-auditor",
      recipient: "검증관",
      role: "근거 추적",
      priority: auditSummary.gapCount ? "확인" : "잠금",
      packet: "감사 로그 인계",
      action: `${auditSummary.gapCount}개 검증 공백 추적`,
      proof: `근거 사용률 ${auditSummary.verifiedPercent}% / 판단 이벤트 ${auditSummary.trailCount}개`,
      evidenceId: getAuditEvidenceLedger().find((item) => item.coverage <= 1)?.id || demoData.decision.evidence_ids[0],
      stage: "audit",
      tone: auditSummary.gapCount ? "evidence" : "support"
    }
  ];
}

function getHandoffChecklistItems() {
  const recipients = getHandoffRecipientItems();
  const signals = getHandoffSignalItems();
  const readiness = getSubmissionReadinessScore();
  return [
    {
      id: "handoff-submit",
      label: "제출 패키지",
      value: `${readiness}%`,
      detail: "최종 제출 묶음과 매니페스트 확인",
      ready: readiness >= 80
    },
    {
      id: "handoff-recipients",
      label: "수신자",
      value: `${recipients.length}명`,
      detail: "지휘관, 참모, 훈련장교, 검증관 분리",
      ready: recipients.length >= 4
    },
    {
      id: "handoff-retrain",
      label: "재훈련",
      value: `${getRetrainingScheduleItems().length}건`,
      detail: "AAR 조치가 훈련 과제로 변환됨",
      ready: getRetrainingScheduleItems().length >= 6
    },
    {
      id: "handoff-signals",
      label: "교신 문안",
      value: `${signals.length}건`,
      detail: "인계 직후 전파 가능한 문장",
      ready: signals.length >= 3
    },
    {
      id: "handoff-evidence",
      label: "근거 연결",
      value: `${new Set(recipients.map((item) => item.evidenceId).filter(Boolean)).size}건`,
      detail: "수신자별 직접 근거 연결",
      ready: recipients.every((item) => Boolean(item.evidenceId))
    }
  ];
}

function getHandoffSignalItems() {
  return getHandoffRecipientItems().slice(0, 4).map((item) => ({
    id: `signal-${item.id}`,
    recipientId: item.id,
    recipient: item.recipient,
    title: `${item.recipient} ${item.packet}`,
    channel: item.recipient === "지휘관" ? "지휘망" : item.recipient === "훈련장교" ? "훈련통제망" : "참모망",
    message: `[WAR GROUND] ${item.packet}: ${item.action}. 근거 ${evidenceById.get(item.evidenceId)?.title || item.evidenceId}. ${item.proof}.`,
    stage: item.stage,
    evidenceId: item.evidenceId,
    tone: item.tone
  }));
}

function getHandoffPacket() {
  const recipients = getHandoffRecipientItems();
  const selected = recipients.find((item) => item.id === state.selectedHandoffRecipientId) || recipients[0];
  return {
    package_type: "war-ground-operator-handoff-packet",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    selected_recipient: selected?.recipient,
    recommended_decision: demoData.decision.recommended_coa,
    recipients: recipients.map((item) => ({
      id: item.id,
      recipient: item.recipient,
      role: item.role,
      packet: item.packet,
      action: item.action,
      proof: item.proof,
      evidence: evidenceById.get(item.evidenceId)?.title || item.evidenceId,
      source_stage: item.stage
    })),
    checklist: getHandoffChecklistItems(),
    signals: getHandoffSignalItems().map((item) => ({
      recipient: item.recipient,
      channel: item.channel,
      message: item.message,
      evidence: evidenceById.get(item.evidenceId)?.title || item.evidenceId
    })),
    submission_manifest: getSubmissionManifest(),
    retraining_plan: getRetrainingPacket()
  };
}

function renderHandoffCenter() {
  const page = byId("page-handoff");
  if (!page) return;
  const recipients = getHandoffRecipientItems();
  const selected = recipients.find((item) => item.id === state.selectedHandoffRecipientId) || recipients[0];
  if (selected) state.selectedHandoffRecipientId = selected.id;
  const checklist = getHandoffChecklistItems();
  const signals = getHandoffSignalItems();
  const summary = byId("handoffSummaryPanel");
  const recipientPanel = byId("handoffRecipientPanel");
  const signalPanel = byId("handoffSignalPanel");
  const packetPanel = byId("handoffPacketPanel");

  if (summary) {
    summary.innerHTML = `
      <div class="panel-heading"><span>인수인계 패킷</span><b>${recipients.length}명 수신</b></div>
      <strong>${selected?.packet || "인계 패킷"} 준비</strong>
      <p>${selected?.action || "다음 운용자가 먼저 확인할 조치를 선택합니다."}</p>
      <div class="handoff-summary-kpis">
        <article><span>체크</span><b>${checklist.filter((item) => item.ready).length}/${checklist.length}</b></article>
        <article><span>문안</span><b>${signals.length}건</b></article>
        <article><span>근거</span><b>${new Set(recipients.map((item) => item.evidenceId).filter(Boolean)).size}건</b></article>
      </div>
      ${selected ? `
        <div class="handoff-selected-card">
          <span>${selected.recipient} · ${selected.role}</span>
          <b>${selected.priority}</b>
          <em>${selected.proof}</em>
          <button type="button" data-handoff-action="stage" data-handoff-ref="${selected.stage}">출처 화면</button>
        </div>
      ` : ""}
    `;
  }

  if (recipientPanel) {
    recipientPanel.innerHTML = `
      <div class="panel-heading"><span>수신자별 인계</span><b>${recipients.length}개 패킷</b></div>
      ${recipients.map((item) => `
        <article class="handoff-recipient-card is-${item.tone} ${item.id === state.selectedHandoffRecipientId ? "is-selected" : ""}">
          <button type="button" data-handoff-action="select" data-handoff-ref="${item.id}" aria-pressed="${item.id === state.selectedHandoffRecipientId ? "true" : "false"}">
            <span>${item.priority} · ${item.role}</span>
            <b>${item.recipient}</b>
            <p>${item.action}</p>
          </button>
          <footer>
            <em>${item.packet}</em>
            <button type="button" data-handoff-action="evidence" data-handoff-ref="${item.evidenceId}">근거</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (signalPanel) {
    signalPanel.innerHTML = `
      <div class="panel-heading"><span>교신 문안</span><b>${signals.length}건</b></div>
      ${signals.map((item) => `
        <article class="handoff-signal-card is-${item.tone}">
          <span>${item.channel} · ${item.recipient}</span>
          <b>${item.title}</b>
          <p>${item.message}</p>
          <button type="button" data-handoff-action="copy-signal" data-handoff-ref="${item.id}">문안 복사</button>
        </article>
      `).join("")}
    `;
  }

  if (packetPanel) {
    const signal = signals.find((item) => item.recipientId === selected?.id) || signals[0];
    packetPanel.innerHTML = `
      <div class="panel-heading"><span>패킷 상세</span><b>${selected?.recipient || "수신자"}</b></div>
      ${selected ? `
        <strong>${selected.packet}</strong>
        <p>${selected.action}</p>
        <div class="handoff-checklist">
          ${checklist.map((item) => `
            <article class="${item.ready ? "is-ready" : "is-pending"}">
              <span>${item.ready ? "READY" : "CHECK"}</span>
              <b>${item.label}</b>
              <p>${item.value} · ${item.detail}</p>
            </article>
          `).join("")}
        </div>
        <div class="handoff-message-preview">
          <span>${signal?.channel || "교신망"}</span>
          <b>${signal?.title || selected.packet}</b>
          <p>${signal?.message || selected.proof}</p>
        </div>
        <div class="handoff-packet-actions">
          <button type="button" data-handoff-action="evidence" data-handoff-ref="${selected.evidenceId}">근거 열기</button>
          <button type="button" data-handoff-action="copy">패킷 요약</button>
          <button type="button" data-handoff-action="download">JSON 저장</button>
        </div>
      ` : "<p>수신자를 선택하면 인계 패킷을 표시합니다.</p>"}
    `;
  }
  refreshIcons();
}

function getHandoffSummaryText() {
  const packet = getHandoffPacket();
  return [
    `WAR GROUND 인수인계 패킷`,
    `작전: ${packet.operation}`,
    `추천 결심: ${packet.recommended_decision}`,
    `수신자: ${packet.recipients.map((item) => `${item.recipient}/${item.packet}`).join(", ")}`,
    `체크: ${packet.checklist.filter((item) => item.ready).length}/${packet.checklist.length}`,
    `교신: ${packet.signals.map((item) => `${item.channel} ${item.recipient}`).join(" / ")}`
  ].join("\n");
}

function runHandoffAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedHandoffRecipientId = ref || state.selectedHandoffRecipientId;
    renderHandoffCenter();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getHandoffPacket(), "war-ground-operator-handoff-packet.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getHandoffSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "패킷 요약";
      }, 1200);
    });
    return;
  }
  if (action === "copy-signal") {
    const signal = getHandoffSignalItems().find((item) => item.id === ref);
    copyTextToClipboard(signal?.message || getHandoffSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "문안 복사";
      }, 1200);
    });
  }
}

function getOperationsRiskTrend() {
  return demoData.failures.map((failure) => {
    const projected = getProjectedFailureScore(failure);
    const scheduleCount = Math.max(1, failure.mitigation_steps?.length || 0);
    const handoffCount = failure.evidence.filter((id) => demoData.decision.evidence_ids.includes(id)).length || 1;
    const after = clamp(projected.projected - scheduleCount * 2 - handoffCount * 2, 28, failure.score);
    return {
      id: failure.id,
      label: failure.title,
      before: failure.score,
      after,
      delta: failure.score - after,
      scheduleCount,
      handoffCount,
      tone: after >= 80 ? "danger" : after >= 65 ? "evidence" : "support"
    };
  }).sort((a, b) => b.after - a.after);
}

function getOperationsEvidenceCoverageSummary() {
  const usedEvidence = new Set([
    ...demoData.failures.flatMap((failure) => failure.evidence),
    ...demoData.events.flatMap((event) => event.evidence_ids || []),
    ...demoData.decision.evidence_ids
  ]);
  const weakEvidence = demoData.evidence.filter((item) => item.status !== "근거 있음" || !usedEvidence.has(item.id));
  return {
    usedEvidenceCount: usedEvidence.size,
    evidenceCount: demoData.evidence.length,
    verifiedPercent: Math.round((usedEvidence.size / Math.max(demoData.evidence.length, 1)) * 100),
    weakEvidence
  };
}

function getOperationsEvidenceDebt() {
  const coverage = getOperationsEvidenceCoverageSummary();
  return coverage.weakEvidence
    .map((item) => ({
      id: item.id,
      title: item.title,
      source: item.source,
      status: item.status,
      coverage: demoData.failures.filter((failure) => failure.evidence.includes(item.id)).length
        + demoData.events.filter((event) => event.evidence_ids?.includes(item.id)).length
        + (demoData.decision.evidence_ids.includes(item.id) ? 1 : 0),
      owner: item.status === "추정" ? "검증관" : "작전참모",
      action: item.status === "근거 있음" ? "추가 연결 확인" : "원문 재확인",
      tone: item.status === "추정" ? "danger" : "evidence"
    }));
}

function getOperationsCadenceItems() {
  const risk = getOperationsRiskTrend()[0];
  const debt = getOperationsEvidenceDebt()[0];
  return [
    {
      time: "T+0",
      label: "인계 확인",
      owner: "지휘관",
      detail: "5개 수신자 축 확인",
      stage: "handoff",
      tone: "primary"
    },
    {
      time: "T+2h",
      label: "위험 재평가",
      owner: "작전참모",
      detail: `${risk?.label || "잔여 위험"} ${risk?.after || 0}점 재확인`,
      stage: "risk",
      tone: risk?.tone || "support"
    },
    {
      time: "T+6h",
      label: "근거 부채 정리",
      owner: debt?.owner || "검증관",
      detail: debt ? `${debt.title} 확인` : "근거 부채 없음",
      stage: "audit",
      tone: "evidence"
    },
    {
      time: "T+12h",
      label: "재훈련 체크",
      owner: "훈련장교",
      detail: `${demoData.failures.length * 2}개 과제 준비도 확인`,
      stage: "retrain",
      tone: "support"
    },
    {
      time: "T+24h",
      label: "운영 지표 재생성",
      owner: "검증관",
      detail: "위험, 근거, 인계 지표 재산출",
      stage: "metrics",
      tone: "primary"
    }
  ];
}

function getOperationsMetricItems() {
  const evidenceScore = getOperationsEvidenceCoverageSummary().verifiedPercent;
  const handoffReady = 92;
  const retrainReady = clamp(76 + getActiveDecisionConditionIds().size * 5, 70, 96);
  const submissionReady = clamp(72 + demoData.decision.evidence_ids.length * 5 + getActiveDecisionConditionIds().size * 3, 70, 98);
  const topRiskAfter = getOperationsRiskTrend()[0]?.after || 0;
  return [
    {
      id: "metric-readiness",
      label: "운용 준비",
      value: `${submissionReady}%`,
      score: submissionReady,
      detail: "제출 패키지 게이트",
      tone: "primary"
    },
    {
      id: "metric-handoff",
      label: "인계 완료",
      value: `${handoffReady}%`,
      score: handoffReady,
      detail: "5개 수신자 축",
      tone: "support"
    },
    {
      id: "metric-retrain",
      label: "재훈련 잠금",
      value: `${retrainReady}%`,
      score: retrainReady,
      detail: `${demoData.failures.length * 2}개 훈련 과제`,
      tone: "evidence"
    },
    {
      id: "metric-evidence",
      label: "근거 건전성",
      value: `${evidenceScore}%`,
      score: evidenceScore,
      detail: `부채 ${getOperationsEvidenceDebt().length}건`,
      tone: "primary"
    },
    {
      id: "metric-risk",
      label: "잔여 위험",
      value: `${topRiskAfter}`,
      score: clamp(100 - topRiskAfter, 8, 96),
      detail: "상위 실패경로 잔여값",
      tone: topRiskAfter >= 70 ? "danger" : "support"
    }
  ];
}

function getOperationsReadinessScore() {
  const metrics = getOperationsMetricItems();
  return Math.round(metrics.reduce((sum, item) => sum + item.score, 0) / Math.max(metrics.length, 1));
}

function getOperationsMetricsPacket() {
  return {
    package_type: "war-ground-operations-metrics",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getOperationsReadinessScore(),
    metric_items: getOperationsMetricItems(),
    risk_trend: getOperationsRiskTrend(),
    evidence_debt: getOperationsEvidenceDebt(),
    cadence: getOperationsCadenceItems(),
    handoff_summary: {
      recipients: 5,
      decision: demoData.decision.recommended_coa,
      signals: 4,
      next_stage: "handoff"
    }
  };
}

function getOperationsMetricsSummaryText() {
  const packet = getOperationsMetricsPacket();
  return [
    "WAR GROUND 운영 지표",
    `작전: ${packet.operation}`,
    `준비도: ${packet.readiness_score}%`,
    `KPI: ${packet.metric_items.map((item) => `${item.label} ${item.value}`).join(" / ")}`,
    `상위 위험: ${packet.risk_trend[0]?.label || "없음"} ${packet.risk_trend[0]?.before || 0}->${packet.risk_trend[0]?.after || 0}`,
    `근거 부채: ${packet.evidence_debt.length}건`,
    `운영 리듬: ${packet.cadence.map((item) => `${item.time} ${item.label}`).join(" / ")}`
  ].join("\n");
}

function renderOperationsMetrics() {
  const page = byId("page-metrics");
  if (!page) return;
  const metrics = getOperationsMetricItems();
  const selected = metrics.find((item) => item.id === state.selectedMetricId) || metrics[0];
  if (selected) state.selectedMetricId = selected.id;
  const riskTrend = getOperationsRiskTrend();
  const evidenceDebt = getOperationsEvidenceDebt();
  const cadence = getOperationsCadenceItems();
  const overview = byId("metricsOverviewPanel");
  const risk = byId("metricsRiskPanel");
  const evidence = byId("metricsEvidencePanel");
  const cadencePanel = byId("metricsCadencePanel");

  if (overview) {
    overview.innerHTML = `
      <div class="panel-heading"><span>운영 지표판</span><b>${getOperationsReadinessScore()}%</b></div>
      <strong>${selected?.label || "운용 준비"} 상태</strong>
      <p>${selected?.detail || "인수인계 이후 핵심 상태를 추적합니다."}</p>
      <div class="metrics-kpi-grid">
        ${metrics.map((item) => `
          <button class="metrics-kpi-card is-${item.tone} ${item.id === state.selectedMetricId ? "is-selected" : ""}" type="button" data-metrics-action="select" data-metrics-ref="${item.id}" aria-pressed="${item.id === state.selectedMetricId ? "true" : "false"}">
            <span>${item.label}</span>
            <b>${item.value}</b>
            <em>${item.detail}</em>
            <i style="--value:${item.score}%"><small></small></i>
          </button>
        `).join("")}
      </div>
      <div class="metrics-selected-card">
        <span>현재 추적</span>
        <b>${selected?.label || "KPI"}</b>
        <p>${selected?.detail || "세부 지표 없음"}</p>
        <button type="button" data-metrics-action="copy">요약 복사</button>
      </div>
    `;
  }

  if (risk) {
    risk.innerHTML = `
      <div class="panel-heading"><span>위험 추세</span><b>${riskTrend.length}개 경로</b></div>
      ${riskTrend.map((item) => {
        const afterPercent = clamp(item.after, 0, 100);
        return `
          <article class="metrics-risk-row is-${item.tone}">
            <header>
              <span>${item.delta}점 감소 · 재훈련 ${item.scheduleCount}건</span>
              <b>${item.label}</b>
              <em>${item.before} → ${item.after}</em>
            </header>
            <div class="metrics-risk-bars" aria-label="${item.label} 위험 추세">
              <i style="--value:${item.before}%"></i>
              <b style="--value:${afterPercent}%"></b>
            </div>
            <footer>
              <small>인계 ${item.handoffCount}건 연결</small>
              <button type="button" data-metrics-action="stage" data-metrics-ref="risk">위험 보기</button>
            </footer>
          </article>
        `;
      }).join("")}
    `;
  }

  if (evidence) {
    evidence.innerHTML = `
      <div class="panel-heading"><span>근거 부채</span><b>${evidenceDebt.length}건</b></div>
      ${evidenceDebt.length ? evidenceDebt.map((item) => `
        <article class="metrics-debt-card is-${item.tone}">
          <span>${item.status} · ${item.owner}</span>
          <b>${item.title}</b>
          <p>${item.source} / 연결 ${item.coverage}건</p>
          <footer>
            <em>${item.action}</em>
            <button type="button" data-metrics-action="evidence" data-metrics-ref="${item.id}">근거</button>
          </footer>
        </article>
      `).join("") : `
        <article class="metrics-debt-card is-support">
          <span>부채 없음</span>
          <b>근거 원장 잠금</b>
          <p>추가 확인이 필요한 근거가 없습니다.</p>
        </article>
      `}
    `;
  }

  if (cadencePanel) {
    cadencePanel.innerHTML = `
      <div class="panel-heading"><span>운영 리듬</span><b>24h</b></div>
      ${cadence.map((item) => `
        <article class="metrics-cadence-item is-${item.tone}">
          <time>${item.time}</time>
          <div>
            <span>${item.owner}</span>
            <b>${item.label}</b>
            <p>${item.detail}</p>
          </div>
          <button type="button" data-metrics-action="stage" data-metrics-ref="${item.stage}">열기</button>
        </article>
      `).join("")}
      <div class="metrics-cadence-actions">
        <button type="button" data-metrics-action="stage" data-metrics-ref="handoff">인계 확인</button>
        <button type="button" data-metrics-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runMetricsAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedMetricId = ref || state.selectedMetricId;
    renderOperationsMetrics();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getOperationsMetricsPacket(), "war-ground-operations-metrics.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getOperationsMetricsSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getDecisionWatchItems() {
  const ownerByFailure = {
    command_gap: "통신참모",
    sustainment_drop: "군수참모",
    accident_delay: "의무참모",
    rejudge_delay: "지휘관"
  };
  const thresholdByFailure = {
    command_gap: "보고 누락 1회 또는 10분 두절",
    sustainment_drop: "보급 대기 15분 초과",
    accident_delay: "후송 예상 20분 초과",
    rejudge_delay: "1개 보고주기 내 승인 없음"
  };
  const channelByFailure = {
    command_gap: "지휘망",
    sustainment_drop: "군수망",
    accident_delay: "의무망",
    rejudge_delay: "참모망"
  };
  return demoData.failures.map((failure) => {
    const event = demoData.events.find((item) => item.linked_risks.includes(failure.id));
    const projected = getProjectedFailureScore(failure);
    const remaining = projected.projected;
    const level = failure.score >= 90 || remaining >= 70 ? "critical" : remaining >= 58 ? "watch" : "stable";
    return {
      id: `watch-${failure.id}`,
      failureId: failure.id,
      title: failure.title,
      owner: ownerByFailure[failure.id] || "작전참모",
      channel: channelByFailure[failure.id] || "지휘망",
      window: event?.time || failure.decision_point.split(" ")[0],
      trigger: thresholdByFailure[failure.id] || failure.early_warning,
      earlyWarning: failure.early_warning,
      action: failure.mitigation_steps?.[0] || failure.mitigation,
      evidenceId: failure.evidence[0] || state.selectedEvidenceId,
      before: failure.score,
      after: remaining,
      level,
      status: level === "critical" ? "즉시 보고" : level === "watch" ? "감시 강화" : "안정 감시",
      stage: level === "critical" ? "risk" : "decision"
    };
  }).sort((a, b) => {
    const weight = { critical: 3, watch: 2, stable: 1 };
    return weight[b.level] - weight[a.level] || b.before - a.before;
  });
}

function getWatchEscalationItems() {
  const watchItems = getDecisionWatchItems();
  const selected = watchItems.find((item) => item.id === state.selectedWatchItemId) || watchItems[0];
  if (!selected) return [];
  return [
    {
      id: "watch-confirm",
      label: "신호 확인",
      owner: selected.owner,
      detail: `${selected.trigger} 여부를 ${selected.channel}에서 확인`,
      stage: "rehearsal",
      evidenceId: selected.evidenceId,
      tone: selected.level === "critical" ? "danger" : "evidence"
    },
    {
      id: "watch-risk",
      label: "위험 재개방",
      owner: "작전참모",
      detail: `${selected.title} 실패경로와 차단 지점 재확인`,
      stage: "risk",
      failureId: selected.failureId,
      tone: "danger"
    },
    {
      id: "watch-decision",
      label: "결심 조건 갱신",
      owner: "지휘관",
      detail: demoData.decision.conditional_coa,
      stage: "decision",
      evidenceId: selected.evidenceId,
      tone: "primary"
    },
    {
      id: "watch-broadcast",
      label: "전파",
      owner: selected.owner,
      detail: `${selected.channel} 문안으로 현장과 참모에게 공유`,
      stage: "watch",
      evidenceId: selected.evidenceId,
      tone: "support"
    }
  ];
}

function getWatchSignalItems() {
  return getDecisionWatchItems().slice(0, 4).map((item) => ({
    id: `watch-signal-${item.failureId}`,
    watchId: item.id,
    channel: item.channel,
    title: `${item.title} ${item.status}`,
    message: `[WAR GROUND WATCH] ${item.title}: ${item.trigger}. ${formatKoreanTopicParticle(item.owner)} ${item.action}. 근거 ${evidenceById.get(item.evidenceId)?.title || item.evidenceId}.`,
    evidenceId: item.evidenceId,
    tone: item.level === "critical" ? "danger" : item.level === "watch" ? "evidence" : "support"
  }));
}

function getWatchReadinessScore() {
  const items = getDecisionWatchItems();
  const signalCount = getWatchSignalItems().length;
  const criticalCount = items.filter((item) => item.level === "critical").length;
  const evidenceCount = new Set(items.map((item) => item.evidenceId).filter(Boolean)).size;
  return clamp(72 + signalCount * 4 + evidenceCount * 3 - criticalCount * 3, 58, 98);
}

function getWatchPacket() {
  return {
    package_type: "war-ground-decision-watch",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getWatchReadinessScore(),
    watch_items: getDecisionWatchItems(),
    escalation: getWatchEscalationItems(),
    signals: getWatchSignalItems(),
    decision: demoData.decision.recommended_coa
  };
}

function getWatchSummaryText() {
  const packet = getWatchPacket();
  return [
    "WAR GROUND 상황 감시",
    `작전: ${packet.operation}`,
    `추천 결심: ${packet.decision}`,
    `준비도: ${packet.readiness_score}%`,
    `트리거: ${packet.watch_items.map((item) => `${item.title}/${item.status}`).join(" / ")}`,
    `전파: ${packet.signals.map((item) => `${item.channel} ${item.title}`).join(" / ")}`
  ].join("\n");
}

function renderDecisionWatch() {
  const page = byId("page-watch");
  if (!page) return;
  const watchItems = getDecisionWatchItems();
  const selected = watchItems.find((item) => item.id === state.selectedWatchItemId) || watchItems[0];
  if (selected) state.selectedWatchItemId = selected.id;
  const escalation = getWatchEscalationItems();
  const signals = getWatchSignalItems();
  const overview = byId("watchOverviewPanel");
  const triggerPanel = byId("watchTriggerPanel");
  const signalPanel = byId("watchSignalPanel");
  const actionPanel = byId("watchActionPanel");

  if (overview) {
    const criticalCount = watchItems.filter((item) => item.level === "critical").length;
    overview.innerHTML = `
      <div class="panel-heading"><span>재판단 감시</span><b>${getWatchReadinessScore()}%</b></div>
      <strong>${selected?.title || "감시 기준"} 추적</strong>
      <p>${selected?.earlyWarning || "현장 신호를 기준으로 재판단 시점을 확인합니다."}</p>
      <div class="watch-kpi-grid">
        <article><span>트리거</span><b>${watchItems.length}</b><em>감시 기준</em></article>
        <article><span>즉시 보고</span><b>${criticalCount}</b><em>고위험 신호</em></article>
        <article><span>전파 문안</span><b>${signals.length}</b><em>무전·참모망</em></article>
      </div>
      ${selected ? `
        <div class="watch-selected-card is-${selected.level}">
          <span>${selected.window} · ${selected.owner}</span>
          <b>${selected.trigger}</b>
          <p>${selected.action}</p>
          <button type="button" data-watch-action="copy">요약 복사</button>
        </div>
      ` : ""}
    `;
  }

  if (triggerPanel) {
    triggerPanel.innerHTML = `
      <div class="panel-heading"><span>트리거 보드</span><b>${watchItems.length}개 기준</b></div>
      ${watchItems.map((item) => `
        <article class="watch-trigger-card is-${item.level} ${item.id === state.selectedWatchItemId ? "is-selected" : ""}">
          <button type="button" data-watch-action="select" data-watch-ref="${item.id}" aria-pressed="${item.id === state.selectedWatchItemId ? "true" : "false"}">
            <span>${item.window} · ${item.status}</span>
            <b>${item.title}</b>
            <p>${item.trigger}</p>
            <i style="--value:${item.after}%"><small></small></i>
          </button>
          <footer>
            <em>${item.before} → ${item.after}</em>
            <button type="button" data-watch-action="risk" data-watch-ref="${item.failureId}">위험</button>
            <button type="button" data-watch-action="evidence" data-watch-ref="${item.evidenceId}">근거</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (signalPanel) {
    signalPanel.innerHTML = `
      <div class="panel-heading"><span>전파 문안</span><b>${signals.length}건</b></div>
      ${signals.map((item) => `
        <article class="watch-signal-card is-${item.tone}">
          <span>${item.channel}</span>
          <b>${item.title}</b>
          <p>${item.message}</p>
          <button type="button" data-watch-action="copy-signal" data-watch-ref="${item.id}">문안 복사</button>
        </article>
      `).join("")}
    `;
  }

  if (actionPanel) {
    actionPanel.innerHTML = `
      <div class="panel-heading"><span>재판단 조치</span><b>${selected?.status || "감시"}</b></div>
      ${escalation.map((item, index) => {
        const action = item.failureId ? "risk" : item.stage ? "stage" : "evidence";
        const ref = item.failureId || item.stage || item.evidenceId;
        return `
          <article class="watch-action-step is-${item.tone}">
            <span>${String(index + 1).padStart(2, "0")} · ${item.owner}</span>
            <b>${item.label}</b>
            <p>${item.detail}</p>
            <button type="button" data-watch-action="${action}" data-watch-ref="${ref}">열기</button>
          </article>
        `;
      }).join("")}
      <div class="watch-packet-actions">
        <button type="button" data-watch-action="stage" data-watch-ref="decision">결심 확인</button>
        <button type="button" data-watch-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runWatchAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedWatchItemId = ref || state.selectedWatchItemId;
    renderDecisionWatch();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || getDecisionWatchItems()[0]?.failureId || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getWatchPacket(), "war-ground-decision-watch.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getWatchSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
    return;
  }
  if (action === "copy-signal") {
    const signal = getWatchSignalItems().find((item) => item.id === ref);
    copyTextToClipboard(signal?.message || getWatchSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "문안 복사";
      }, 1200);
    });
  }
}

function getOperationsLogItems() {
  const statusByLevel = {
    critical: "추적",
    watch: "확인",
    stable: "확인"
  };
  const toneByLevel = {
    critical: "danger",
    watch: "evidence",
    stable: "support"
  };
  const watchItems = getDecisionWatchItems();
  const signalsByWatch = new Map(getWatchSignalItems().map((item) => [item.watchId, item]));
  const baseMinutes = 8;
  return watchItems.map((item, index) => {
    const signal = signalsByWatch.get(item.id);
    const minutes = baseMinutes + index * 9;
    const time = `T+${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    return {
      id: `log-${item.failureId}`,
      watchId: item.id,
      failureId: item.failureId,
      time,
      title: `${item.title} ${item.status}`,
      source: item.channel,
      owner: item.owner,
      status: statusByLevel[item.level] || "확인",
      tone: toneByLevel[item.level] || "support",
      summary: signal?.message || `${item.title} 감시 기준 확인`,
      action: item.action,
      evidenceId: item.evidenceId,
      nextStage: item.level === "critical" ? "risk" : "watch",
      handoffRef: item.level === "critical" ? "지휘관 인계" : "참모 확인"
    };
  });
}

function getLogAcknowledgementItems() {
  const logs = getOperationsLogItems();
  const openCount = logs.filter((item) => item.status !== "확인").length;
  return [
    {
      id: "ack-commander",
      label: "지휘관 확인",
      owner: "지휘관",
      detail: `${openCount}건 추적 보고 확인`,
      done: openCount <= 1,
      stage: "decision",
      tone: openCount ? "danger" : "support"
    },
    {
      id: "ack-watch",
      label: "감시 기준 유지",
      owner: "작전참모",
      detail: `${getDecisionWatchItems().length}개 트리거 일지화`,
      done: true,
      stage: "watch",
      tone: "primary"
    },
    {
      id: "ack-handoff",
      label: "인계 참조",
      owner: "인계 담당",
      detail: `${logs.length}건 기록을 다음 운용자에게 전달`,
      done: true,
      stage: "handoff",
      tone: "evidence"
    },
    {
      id: "ack-evidence",
      label: "근거 연결",
      owner: "검증관",
      detail: `${new Set(logs.map((item) => item.evidenceId).filter(Boolean)).size}건 직접 근거`,
      done: logs.every((item) => Boolean(item.evidenceId)),
      stage: "audit",
      tone: "support"
    }
  ];
}

function getLogReadinessScore() {
  const acknowledgements = getLogAcknowledgementItems();
  const done = acknowledgements.filter((item) => item.done).length;
  return Math.round((done / Math.max(acknowledgements.length, 1)) * 100);
}

function getLogReportPacket() {
  const logs = getOperationsLogItems();
  return {
    package_type: "war-ground-operations-log",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getLogReadinessScore(),
    reports: logs,
    acknowledgements: getLogAcknowledgementItems(),
    handoff_refs: logs.map((item) => ({
      id: item.id,
      title: item.title,
      status: item.status,
      handoff: item.handoffRef,
      evidence: evidenceById.get(item.evidenceId)?.title || item.evidenceId
    }))
  };
}

function getLogSummaryText() {
  const packet = getLogReportPacket();
  return [
    "WAR GROUND 상황 일지",
    `작전: ${packet.operation}`,
    `준비도: ${packet.readiness_score}%`,
    `보고: ${packet.reports.map((item) => `${item.time} ${item.title}/${item.status}`).join(" / ")}`,
    `확인: ${packet.acknowledgements.map((item) => `${item.label} ${item.done ? "완료" : "대기"}`).join(" / ")}`
  ].join("\n");
}

function renderOperationsLog() {
  const page = byId("page-log");
  if (!page) return;
  const logs = getOperationsLogItems();
  const selected = logs.find((item) => item.id === state.selectedLogItemId) || logs[0];
  if (selected) state.selectedLogItemId = selected.id;
  const acknowledgements = getLogAcknowledgementItems();
  const overview = byId("logOverviewPanel");
  const timeline = byId("logTimelinePanel");
  const report = byId("logReportPanel");
  const acknowledge = byId("logAcknowledgePanel");

  if (overview) {
    const openCount = logs.filter((item) => item.status !== "확인").length;
    overview.innerHTML = `
      <div class="panel-heading"><span>상황 일지</span><b>${getLogReadinessScore()}%</b></div>
      <strong>${selected?.title || "보고 기록"} 저장</strong>
      <p>${selected?.summary || "감시 보고를 시간순 운용 기록으로 남깁니다."}</p>
      <div class="log-kpi-grid">
        <article><span>보고</span><b>${logs.length}</b><em>기록 건수</em></article>
        <article><span>추적</span><b>${openCount}</b><em>미확인 보고</em></article>
        <article><span>확인</span><b>${acknowledgements.filter((item) => item.done).length}/${acknowledgements.length}</b><em>교대 기준</em></article>
      </div>
      ${selected ? `
        <div class="log-selected-card is-${selected.tone}">
          <span>${selected.time} · ${selected.owner}</span>
          <b>${selected.status}</b>
          <p>${selected.action}</p>
          <button type="button" data-log-action="copy">요약 복사</button>
        </div>
      ` : ""}
    `;
  }

  if (timeline) {
    timeline.innerHTML = `
      <div class="panel-heading"><span>보고 타임라인</span><b>${logs.length}건</b></div>
      ${logs.map((item) => `
        <article class="log-timeline-card is-${item.tone} ${item.id === state.selectedLogItemId ? "is-selected" : ""}">
          <button type="button" data-log-action="select" data-log-ref="${item.id}" aria-pressed="${item.id === state.selectedLogItemId ? "true" : "false"}">
            <span>${item.time} · ${item.source}</span>
            <b>${item.title}</b>
            <p>${item.summary}</p>
          </button>
          <footer>
            <em>${item.handoffRef}</em>
            <button type="button" data-log-action="stage" data-log-ref="${item.nextStage}">열기</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (report) {
    report.innerHTML = `
      <div class="panel-heading"><span>보고 상세</span><b>${selected?.status || "기록"}</b></div>
      ${selected ? `
        <strong>${selected.title}</strong>
        <p>${selected.summary}</p>
        <div class="log-report-grid">
          <article><span>담당</span><b>${selected.owner}</b></article>
          <article><span>출처</span><b>${selected.source}</b></article>
          <article><span>근거</span><b>${evidenceById.get(selected.evidenceId)?.title || selected.evidenceId}</b></article>
        </div>
        <div class="log-report-actions">
          <button type="button" data-log-action="risk" data-log-ref="${selected.failureId}">위험 보기</button>
          <button type="button" data-log-action="evidence" data-log-ref="${selected.evidenceId}">근거 추적</button>
          <button type="button" data-log-action="stage" data-log-ref="handoff">인계 확인</button>
        </div>
      ` : "<p>보고를 선택하면 상세 기록을 표시합니다.</p>"}
    `;
  }

  if (acknowledge) {
    acknowledge.innerHTML = `
      <div class="panel-heading"><span>확인 기록</span><b>${acknowledgements.filter((item) => item.done).length}/${acknowledgements.length}</b></div>
      ${acknowledgements.map((item) => `
        <article class="log-ack-card is-${item.tone} ${item.done ? "is-done" : "is-open"}">
          <span>${item.done ? "확인" : "대기"} · ${item.owner}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <button type="button" data-log-action="stage" data-log-ref="${item.stage}">열기</button>
        </article>
      `).join("")}
      <div class="log-packet-actions">
        <button type="button" data-log-action="stage" data-log-ref="watch">감시 보기</button>
        <button type="button" data-log-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runLogAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedLogItemId = ref || state.selectedLogItemId;
    renderOperationsLog();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || getOperationsLogItems()[0]?.failureId || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getLogReportPacket(), "war-ground-operations-log.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getLogSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getChallengeAssumptionItems() {
  const assumptionByFailure = {
    command_gap: "B안 우회축에서도 10분 내 지휘 보고가 유지된다.",
    sustainment_drop: "보급 대기점 접근성이 유지되어 전투 지속성이 급락하지 않는다.",
    accident_delay: "후송 판단이 지연돼도 주공 전개와 보고 체계가 동시에 흔들리지 않는다.",
    rejudge_delay: "재판단 승인 기준이 지휘관 확인 전에 공백으로 남지 않는다."
  };
  const invalidationByFailure = {
    command_gap: "보고 누락 1회가 발생하면 B안 우선 추천을 재검토한다.",
    sustainment_drop: "보급 대기가 15분을 넘으면 예비 축선과 보급 대기점을 재설정한다.",
    accident_delay: "후송 예상이 20분을 넘으면 3D 리허설 이벤트를 다시 연다.",
    rejudge_delay: "1개 보고주기 내 승인 공백이 있으면 결심카드 조건을 보류한다."
  };
  const watchByFailure = new Map(getDecisionWatchItems().map((item) => [item.failureId, item]));
  const logByFailure = new Map(getOperationsLogItems().map((item) => [item.failureId, item]));
  return demoData.failures.map((failure) => {
    const watch = watchByFailure.get(failure.id);
    const log = logByFailure.get(failure.id);
    const projected = getProjectedFailureScore(failure);
    const residual = projected.projected;
    const tone = watch?.level === "critical" || residual >= 70 ? "danger" : residual >= 58 ? "evidence" : "support";
    return {
      id: `challenge-${failure.id}`,
      failureId: failure.id,
      title: `${failure.title} 가정`,
      assumption: assumptionByFailure[failure.id] || failure.mitigation,
      invalidates: invalidationByFailure[failure.id] || failure.early_warning,
      owner: watch?.owner || failure.owner || "작전참모",
      counter: watch?.trigger || failure.early_warning,
      evidenceId: watch?.evidenceId || failure.evidence[0] || state.selectedEvidenceId,
      logStatus: log?.status || "대기",
      residual,
      confidence: clamp(100 - residual + failure.evidence.length * 4, 42, 96),
      severity: tone === "danger" ? "높음" : tone === "evidence" ? "중간" : "낮음",
      tone,
      stage: tone === "danger" ? "risk" : "decision"
    };
  }).sort((a, b) => {
    const weight = { danger: 3, evidence: 2, support: 1 };
    return weight[b.tone] - weight[a.tone] || b.residual - a.residual;
  });
}

function getSelectedChallengeAssumption() {
  const items = getChallengeAssumptionItems();
  return items.find((item) => item.id === state.selectedChallengeItemId) || items[0];
}

function getChallengeCounterItems() {
  const selected = getSelectedChallengeAssumption();
  if (!selected) return [];
  const evidence = evidenceById.get(selected.evidenceId);
  const log = getOperationsLogItems().find((item) => item.failureId === selected.failureId);
  return [
    {
      id: "counter-trigger",
      label: "현장 임계값",
      title: selected.counter,
      detail: selected.invalidates,
      severity: selected.severity,
      evidenceId: selected.evidenceId,
      tone: selected.tone
    },
    {
      id: "counter-evidence",
      label: "반대 근거",
      title: evidence?.title || selected.evidenceId,
      detail: evidence?.source || "근거 원장",
      severity: evidence ? "중간" : "높음",
      evidenceId: selected.evidenceId,
      tone: evidence ? "evidence" : "danger"
    },
    {
      id: "counter-log",
      label: "일지 상태",
      title: `${log?.status || "대기"} · ${log?.handoffRef || "인계 확인"}`,
      detail: log?.summary || "감시 보고가 아직 일지로 확정되지 않았습니다.",
      severity: log?.status === "확인" ? "낮음" : "높음",
      evidenceId: selected.evidenceId,
      tone: log?.status === "확인" ? "support" : "danger"
    }
  ];
}

function getChallengeActionItems() {
  const selected = getSelectedChallengeAssumption();
  if (!selected) return [];
  return [
    {
      id: "challenge-risk",
      label: "실패경로 재개방",
      owner: "작전참모",
      detail: `${selected.title}의 잔여 위험 ${selected.residual}점을 다시 확인`,
      action: "risk",
      ref: selected.failureId,
      tone: selected.tone
    },
    {
      id: "challenge-evidence",
      label: "근거 반박 추적",
      owner: "검증관",
      detail: evidenceById.get(selected.evidenceId)?.title || selected.evidenceId,
      action: "evidence",
      ref: selected.evidenceId,
      tone: "evidence"
    },
    {
      id: "challenge-decision",
      label: "결심 조건 갱신",
      owner: "지휘관",
      detail: selected.invalidates,
      action: "stage",
      ref: "decision",
      tone: "primary"
    },
    {
      id: "challenge-log",
      label: "일지 확인",
      owner: selected.owner,
      detail: "반증 기준을 다음 교대 기록에 남깁니다.",
      action: "stage",
      ref: "log",
      tone: "support"
    }
  ];
}

function getChallengeReadinessScore() {
  const assumptions = getChallengeAssumptionItems();
  const counters = getChallengeCounterItems();
  const averageConfidence = Math.round(assumptions.reduce((sum, item) => sum + item.confidence, 0) / Math.max(assumptions.length, 1));
  const highCounters = counters.filter((item) => item.severity === "높음").length;
  return clamp(averageConfidence + getChallengeActionItems().length * 3 - highCounters * 5, 48, 98);
}

function getChallengeReviewPacket() {
  return {
    package_type: "war-ground-challenge-review",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    decision: demoData.decision.recommended_coa,
    readiness_score: getChallengeReadinessScore(),
    selected_assumption: getSelectedChallengeAssumption(),
    assumptions: getChallengeAssumptionItems(),
    counters: getChallengeCounterItems(),
    actions: getChallengeActionItems()
  };
}

function getChallengeSummaryText() {
  const packet = getChallengeReviewPacket();
  return [
    "WAR GROUND 반증 검증",
    `작전: ${packet.operation}`,
    `결심: ${packet.decision}`,
    `준비도: ${packet.readiness_score}%`,
    `선택 가정: ${packet.selected_assumption?.title || "없음"}`,
    `반증 신호: ${packet.counters.map((item) => `${item.label}/${item.severity}`).join(" / ")}`,
    `조치: ${packet.actions.map((item) => `${item.label}-${item.owner}`).join(" / ")}`
  ].join("\n");
}

function renderChallengeReview() {
  const page = byId("page-challenge");
  if (!page) return;
  const assumptions = getChallengeAssumptionItems();
  const selected = assumptions.find((item) => item.id === state.selectedChallengeItemId) || assumptions[0];
  if (selected) state.selectedChallengeItemId = selected.id;
  const counters = getChallengeCounterItems();
  const actions = getChallengeActionItems();
  const overview = byId("challengeOverviewPanel");
  const assumptionPanel = byId("challengeAssumptionPanel");
  const counterPanel = byId("challengeCounterPanel");
  const actionPanel = byId("challengeActionPanel");

  if (overview) {
    const dangerCount = assumptions.filter((item) => item.tone === "danger").length;
    overview.innerHTML = `
      <div class="panel-heading"><span>반증 검증</span><b>${getChallengeReadinessScore()}%</b></div>
      <strong>${selected?.title || "핵심 가정"} 재검토</strong>
      <p>${selected?.assumption || "결심이 유지되려면 참이어야 하는 가정을 다시 확인합니다."}</p>
      <div class="challenge-kpi-grid">
        <article><span>가정</span><b>${assumptions.length}</b><em>검증 대상</em></article>
        <article><span>고위험</span><b>${dangerCount}</b><em>즉시 확인</em></article>
        <article><span>반증</span><b>${counters.length}</b><em>선택 가정 신호</em></article>
      </div>
      ${selected ? `
        <div class="challenge-selected-card is-${selected.tone}">
          <span>${selected.owner} · 잔여 ${selected.residual}</span>
          <b>${selected.invalidates}</b>
          <p>${selected.counter}</p>
          <button type="button" data-challenge-action="copy">요약 복사</button>
        </div>
      ` : ""}
    `;
  }

  if (assumptionPanel) {
    assumptionPanel.innerHTML = `
      <div class="panel-heading"><span>가정 보드</span><b>${assumptions.length}개</b></div>
      ${assumptions.map((item) => `
        <article class="challenge-assumption-card is-${item.tone} ${item.id === state.selectedChallengeItemId ? "is-selected" : ""}">
          <button type="button" data-challenge-action="select" data-challenge-ref="${item.id}" aria-pressed="${item.id === state.selectedChallengeItemId ? "true" : "false"}">
            <span>${item.owner} · ${item.severity}</span>
            <b>${item.title}</b>
            <p>${item.assumption}</p>
            <i style="--value:${item.confidence}%"><small></small></i>
          </button>
          <footer>
            <em>잔여 ${item.residual}</em>
            <button type="button" data-challenge-action="risk" data-challenge-ref="${item.failureId}">위험</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (counterPanel) {
    counterPanel.innerHTML = `
      <div class="panel-heading"><span>반증 신호</span><b>${selected?.severity || "대기"}</b></div>
      ${counters.map((item) => `
        <article class="challenge-counter-card is-${item.tone}">
          <span>${item.label} · ${item.severity}</span>
          <b>${item.title}</b>
          <p>${item.detail}</p>
          <button type="button" data-challenge-action="evidence" data-challenge-ref="${item.evidenceId}">근거 추적</button>
        </article>
      `).join("")}
    `;
  }

  if (actionPanel) {
    actionPanel.innerHTML = `
      <div class="panel-heading"><span>검증 조치</span><b>${actions.length}개</b></div>
      ${actions.map((item, index) => `
        <article class="challenge-action-step is-${item.tone}">
          <span>${String(index + 1).padStart(2, "0")} · ${item.owner}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <button type="button" data-challenge-action="${item.action}" data-challenge-ref="${item.ref}">열기</button>
        </article>
      `).join("")}
      <div class="challenge-packet-actions">
        <button type="button" data-challenge-action="stage" data-challenge-ref="decision">결심 확인</button>
        <button type="button" data-challenge-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runChallengeAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedChallengeItemId = ref || state.selectedChallengeItemId;
    renderChallengeReview();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || getSelectedChallengeAssumption()?.failureId || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || getSelectedChallengeAssumption()?.evidenceId || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getChallengeReviewPacket(), "war-ground-challenge-review.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getChallengeSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function normalizeQueuePriority(priority, score = 0) {
  if (priority === "urgent" || priority === "high" || priority === "medium" || priority === "normal") return priority;
  if (score >= 88) return "urgent";
  if (score >= 78) return "high";
  if (score >= 62) return "medium";
  return "normal";
}

function getActionQueueItems() {
  const challengeItems = getChallengeAssumptionItems().map((item) => ({
    id: `queue-${item.id}`,
    source: "반증",
    title: item.invalidates,
    detail: item.assumption,
    owner: item.owner,
    due: item.tone === "danger" ? "즉시" : "다음 보고 전",
    priority: normalizeQueuePriority(item.tone === "danger" ? "urgent" : item.tone === "evidence" ? "high" : "medium", item.residual),
    score: item.residual,
    stage: item.stage,
    action: item.failureId ? "risk" : "stage",
    ref: item.failureId || item.stage,
    evidenceId: item.evidenceId,
    failureId: item.failureId,
    tone: item.tone
  }));

  const watchItems = getDecisionWatchItems().map((item) => ({
    id: `queue-${item.id}`,
    source: "감시",
    title: `${item.title} ${item.status}`,
    detail: item.trigger,
    owner: item.owner,
    due: item.window,
    priority: normalizeQueuePriority(item.level === "critical" ? "urgent" : item.level === "watch" ? "high" : "medium", item.before),
    score: item.before,
    stage: item.stage,
    action: "risk",
    ref: item.failureId,
    evidenceId: item.evidenceId,
    failureId: item.failureId,
    tone: item.level === "critical" ? "danger" : item.level === "watch" ? "evidence" : "support"
  }));

  const aarItems = getAarImprovementItems().slice(0, 6).map((item) => ({
    id: `queue-${item.id}`,
    source: "AAR",
    title: item.title,
    detail: `${item.failure.title} ${item.before}→${item.after}`,
    owner: item.owner,
    due: item.due,
    priority: normalizeQueuePriority(item.priority === "high" ? "high" : item.priority === "medium" ? "medium" : "normal", item.before),
    score: item.before,
    stage: "aar",
    action: "risk",
    ref: item.failure.id,
    evidenceId: item.evidenceId,
    failureId: item.failure.id,
    tone: item.priority === "high" ? "danger" : item.priority === "medium" ? "evidence" : "support"
  }));

  const retrainItems = getRetrainingScheduleItems().slice(0, 4).map((item) => ({
    id: `queue-${item.id}`,
    source: "훈련",
    title: item.drill,
    detail: item.measure,
    owner: item.owner,
    due: item.window,
    priority: normalizeQueuePriority(item.priority === "high" ? "high" : "normal", item.residualRisk),
    score: item.residualRisk,
    stage: "retrain",
    action: "stage",
    ref: "retrain",
    evidenceId: item.evidenceId,
    failureId: item.failure.id,
    tone: item.priority === "high" ? "danger" : "support"
  }));

  const priorityWeight = { urgent: 4, high: 3, medium: 2, normal: 1 };
  return [...challengeItems, ...watchItems, ...aarItems, ...retrainItems]
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority] || b.score - a.score)
    .slice(0, 16);
}

function getSelectedActionQueueItem() {
  const items = getActionQueueItems();
  return items.find((item) => item.id === state.selectedQueueItemId) || items[0];
}

function getActionQueueOwnerItems() {
  const owners = new Map();
  getActionQueueItems().forEach((item) => {
    if (!owners.has(item.owner)) {
      owners.set(item.owner, {
        owner: item.owner,
        items: [],
        urgent: 0,
        evidence: new Set(),
        maxScore: 0
      });
    }
    const owner = owners.get(item.owner);
    owner.items.push(item);
    if (item.priority === "urgent") owner.urgent += 1;
    if (item.evidenceId) owner.evidence.add(item.evidenceId);
    owner.maxScore = Math.max(owner.maxScore, item.score);
  });
  return [...owners.values()]
    .map((owner) => ({
      ...owner,
      open: owner.items.length,
      evidenceCount: owner.evidence.size,
      loadScore: clamp(owner.items.length * 18 + owner.urgent * 16, 18, 98),
      readiness: clamp(96 - owner.items.length * 5 - owner.urgent * 8 + owner.evidence.size * 3, 44, 96)
    }))
    .sort((a, b) => b.loadScore - a.loadScore || b.maxScore - a.maxScore);
}

function getActionQueueGateItems() {
  const items = getActionQueueItems();
  const owners = getActionQueueOwnerItems();
  const urgent = items.filter((item) => item.priority === "urgent");
  const evidenceCovered = items.filter((item) => Boolean(item.evidenceId)).length;
  const maxOwnerLoad = owners[0]?.open || 0;
  return [
    {
      id: "queue-gate-urgent",
      label: "긴급 조치 식별",
      value: `${urgent.length}건`,
      detail: "즉시 처리 항목이 큐 상단에 고정됨",
      ready: urgent.length > 0,
      tone: urgent.length ? "danger" : "support"
    },
    {
      id: "queue-gate-evidence",
      label: "근거 연결",
      value: `${evidenceCovered}/${items.length}`,
      detail: "조치 항목마다 추적 가능한 근거가 붙음",
      ready: evidenceCovered === items.length,
      tone: "evidence"
    },
    {
      id: "queue-gate-owner",
      label: "담당자 부하",
      value: `${maxOwnerLoad}건`,
      detail: "한 담당자에게 과도하게 몰린 조치 확인",
      ready: maxOwnerLoad <= 5,
      tone: maxOwnerLoad > 5 ? "danger" : "support"
    },
    {
      id: "queue-gate-handoff",
      label: "인계 가능",
      value: `${getHandoffChecklistItems().filter((item) => item.ready).length}/${getHandoffChecklistItems().length}`,
      detail: "큐가 다음 운용자에게 전달될 조건",
      ready: getHandoffChecklistItems().every((item) => item.ready),
      tone: "primary"
    }
  ];
}

function getActionQueueReadinessScore() {
  const gates = getActionQueueGateItems();
  const readyScore = Math.round((gates.filter((item) => item.ready).length / Math.max(gates.length, 1)) * 100);
  const urgentPenalty = getActionQueueItems().filter((item) => item.priority === "urgent").length * 3;
  return clamp(readyScore - urgentPenalty + 18, 32, 98);
}

function getActionQueuePacket() {
  return {
    package_type: "war-ground-action-queue",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getActionQueueReadinessScore(),
    selected_item: getSelectedActionQueueItem(),
    queue_items: getActionQueueItems(),
    owner_loads: getActionQueueOwnerItems(),
    gates: getActionQueueGateItems()
  };
}

function getActionQueueSummaryText() {
  const packet = getActionQueuePacket();
  return [
    "WAR GROUND 조치 큐",
    `작전: ${packet.operation}`,
    `준비도: ${packet.readiness_score}%`,
    `최우선: ${packet.queue_items[0]?.title || "없음"}`,
    `담당자: ${packet.owner_loads.map((item) => `${item.owner} ${item.open}건`).join(" / ")}`,
    `게이트: ${packet.gates.map((item) => `${item.label} ${item.ready ? "완료" : "대기"}`).join(" / ")}`
  ].join("\n");
}

function renderActionQueue() {
  const page = byId("page-queue");
  if (!page) return;
  const items = getActionQueueItems();
  const selected = items.find((item) => item.id === state.selectedQueueItemId) || items[0];
  if (selected) state.selectedQueueItemId = selected.id;
  const owners = getActionQueueOwnerItems();
  const gates = getActionQueueGateItems();
  const overview = byId("queueOverviewPanel");
  const priorityPanel = byId("queuePriorityPanel");
  const ownerPanel = byId("queueOwnerPanel");
  const gatePanel = byId("queueGatePanel");

  if (overview) {
    const urgentCount = items.filter((item) => item.priority === "urgent").length;
    overview.innerHTML = `
      <div class="panel-heading"><span>조치 큐</span><b>${getActionQueueReadinessScore()}%</b></div>
      <strong>${selected?.title || "열린 조치"} 실행 대기</strong>
      <p>${selected?.detail || "남은 작업을 담당자와 우선순위 기준으로 정리합니다."}</p>
      <div class="queue-kpi-grid">
        <article><span>열린 조치</span><b>${items.length}</b><em>큐 항목</em></article>
        <article><span>긴급</span><b>${urgentCount}</b><em>즉시 실행</em></article>
        <article><span>담당자</span><b>${owners.length}</b><em>부하 분산</em></article>
      </div>
      ${selected ? `
        <div class="queue-selected-card is-${selected.tone}">
          <span>${selected.source} · ${selected.owner} · ${selected.due}</span>
          <b>${selected.priority.toUpperCase()}</b>
          <p>${selected.title}</p>
          <button type="button" data-queue-action="copy">요약 복사</button>
        </div>
      ` : ""}
    `;
  }

  if (priorityPanel) {
    priorityPanel.innerHTML = `
      <div class="panel-heading"><span>우선순위 큐</span><b>${items.length}건</b></div>
      ${items.map((item, index) => `
        <article class="queue-item-card is-${item.tone} is-${item.priority} ${item.id === state.selectedQueueItemId ? "is-selected" : ""}">
          <button type="button" data-queue-action="select" data-queue-ref="${item.id}" aria-pressed="${item.id === state.selectedQueueItemId ? "true" : "false"}">
            <span>${String(index + 1).padStart(2, "0")} · ${item.source} · ${item.due}</span>
            <b>${item.title}</b>
            <p>${item.detail}</p>
            <i style="--value:${clamp(item.score, 0, 100)}%"><small></small></i>
          </button>
          <footer>
            <em>${item.owner}</em>
            <button type="button" data-queue-action="${item.action}" data-queue-ref="${item.ref}">열기</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (ownerPanel) {
    ownerPanel.innerHTML = `
      <div class="panel-heading"><span>담당자 부하</span><b>${owners.length}명</b></div>
      ${owners.map((item) => `
        <article class="queue-owner-card ${item.urgent ? "is-danger" : "is-support"}">
          <span>${item.urgent}건 긴급 · 근거 ${item.evidenceCount}건</span>
          <b>${item.owner}</b>
          <p>${item.items.map((queueItem) => queueItem.source).join(" / ")}</p>
          <i style="--value:${item.loadScore}%"><small></small></i>
          <button type="button" data-queue-action="select" data-queue-ref="${item.items[0]?.id || ""}">${item.open}건 보기</button>
        </article>
      `).join("")}
    `;
  }

  if (gatePanel) {
    gatePanel.innerHTML = `
      <div class="panel-heading"><span>완료 게이트</span><b>${gates.filter((item) => item.ready).length}/${gates.length}</b></div>
      ${gates.map((item) => `
        <article class="queue-gate-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "완료" : "대기"}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <em>${item.value}</em>
        </article>
      `).join("")}
      <div class="queue-packet-actions">
        <button type="button" data-queue-action="stage" data-queue-ref="handoff">인계 확인</button>
        <button type="button" data-queue-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runActionQueueAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedQueueItemId = ref || state.selectedQueueItemId;
    renderActionQueue();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || getSelectedActionQueueItem()?.failureId || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || getSelectedActionQueueItem()?.evidenceId || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getActionQueuePacket(), "war-ground-action-queue.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getActionQueueSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getReadinessForecastItems() {
  const queueItems = getActionQueueItems();
  const urgentCount = queueItems.filter((item) => item.priority === "urgent").length;
  const highCount = queueItems.filter((item) => item.priority === "high").length;
  const ownerLoad = getActionQueueOwnerItems()[0]?.open || 0;
  const baseReadiness = Math.round((getOperationsReadinessScore() + getActionQueueReadinessScore() + getChallengeReadinessScore()) / 3);
  const riskTrend = getOperationsRiskTrend()[0];
  const topRiskAfter = riskTrend?.after || 0;
  return [
    {
      id: "forecast-current",
      label: "현재",
      horizon: "0h",
      readiness: clamp(baseReadiness - urgentCount * 3, 24, 96),
      residualRisk: topRiskAfter,
      queueOpen: queueItems.length,
      ownerLoad,
      detail: "큐 처리 전 현재 준비도",
      tone: urgentCount ? "danger" : "evidence"
    },
    {
      id: "forecast-24h",
      label: "24h",
      horizon: "24h",
      readiness: clamp(baseReadiness + highCount * 2 - urgentCount, 34, 98),
      residualRisk: clamp(topRiskAfter - highCount * 3, 8, 96),
      queueOpen: Math.max(0, queueItems.length - highCount - urgentCount),
      ownerLoad: Math.max(0, ownerLoad - 2),
      detail: "긴급·고위험 큐 처리 후",
      tone: "primary"
    },
    {
      id: "forecast-72h",
      label: "72h",
      horizon: "72h",
      readiness: clamp(baseReadiness + queueItems.length * 2 - ownerLoad, 42, 99),
      residualRisk: clamp(topRiskAfter - queueItems.length * 2, 4, 92),
      queueOpen: Math.max(0, Math.round(queueItems.length * 0.25)),
      ownerLoad: Math.max(0, Math.round(ownerLoad * 0.4)),
      detail: "재훈련·인계까지 반영",
      tone: "support"
    }
  ];
}

function getForecastScenarioItems() {
  const base = getReadinessForecastItems();
  const current = base[0] || { readiness: 60, residualRisk: 70, queueOpen: 0, ownerLoad: 0 };
  const paced = base[1] || current;
  const complete = base[2] || paced;
  return [
    {
      id: "forecast-delayed",
      label: "지연 처리",
      detail: "긴급 조치가 다음 보고주기까지 밀림",
      readiness: clamp(current.readiness - 8, 20, 94),
      residualRisk: clamp(current.residualRisk + 6, 8, 98),
      queueOpen: current.queueOpen,
      ownerLoad: current.ownerLoad + 1,
      gate: "재판단 필요",
      tone: "danger"
    },
    {
      id: "forecast-paced",
      label: "기준 처리",
      detail: "긴급·고위험 큐를 24시간 안에 처리",
      readiness: paced.readiness,
      residualRisk: paced.residualRisk,
      queueOpen: paced.queueOpen,
      ownerLoad: paced.ownerLoad,
      gate: "운용 유지",
      tone: "primary"
    },
    {
      id: "forecast-accelerated",
      label: "가속 처리",
      detail: "담당자 부하를 재분배하고 재훈련을 앞당김",
      readiness: complete.readiness,
      residualRisk: complete.residualRisk,
      queueOpen: complete.queueOpen,
      ownerLoad: complete.ownerLoad,
      gate: "전환 가능",
      tone: "support"
    }
  ];
}

function getSelectedForecastScenario() {
  const scenarios = getForecastScenarioItems();
  return scenarios.find((item) => item.id === state.selectedForecastScenarioId) || scenarios[1] || scenarios[0];
}

function getForecastBottleneckItems() {
  const selected = getSelectedForecastScenario();
  const owners = getActionQueueOwnerItems();
  const urgent = getActionQueueItems().filter((item) => item.priority === "urgent");
  const gates = getActionQueueGateItems().filter((item) => !item.ready);
  return [
    ...owners.slice(0, 3).map((owner) => ({
      id: `forecast-owner-${owner.owner}`,
      label: "담당자 병목",
      owner: owner.owner,
      title: `${owner.open}건 조치 집중`,
      detail: `${owner.urgent}건 긴급 · 준비도 ${owner.readiness}%`,
      impact: clamp(owner.loadScore - selected.readiness + 34, 8, 92),
      action: "stage",
      ref: "queue",
      tone: owner.urgent ? "danger" : "evidence"
    })),
    ...urgent.slice(0, 2).map((item) => ({
      id: `forecast-urgent-${item.id}`,
      label: "긴급 큐",
      owner: item.owner,
      title: item.title,
      detail: `${item.source} · ${item.due}`,
      impact: clamp(item.score - selected.readiness + 28, 10, 94),
      action: item.action,
      ref: item.ref,
      tone: "danger"
    })),
    ...gates.slice(0, 2).map((gate) => ({
      id: `forecast-gate-${gate.id}`,
      label: "게이트 미충족",
      owner: "검증관",
      title: gate.label,
      detail: gate.detail,
      impact: 42,
      action: "stage",
      ref: "queue",
      tone: gate.tone
    }))
  ].slice(0, 6);
}

function getForecastGateItems() {
  const selected = getSelectedForecastScenario();
  return [
    {
      id: "forecast-gate-readiness",
      label: "준비도",
      value: `${selected?.readiness || 0}%`,
      detail: "다음 운용 단계 전 80% 이상 필요",
      ready: (selected?.readiness || 0) >= 80,
      tone: "primary"
    },
    {
      id: "forecast-gate-risk",
      label: "잔여 위험",
      value: `${selected?.residualRisk || 0}`,
      detail: "상위 실패경로 잔여 위험 65 이하",
      ready: (selected?.residualRisk || 100) <= 65,
      tone: "danger"
    },
    {
      id: "forecast-gate-queue",
      label: "큐 잔량",
      value: `${selected?.queueOpen || 0}건`,
      detail: "열린 조치 8건 이하",
      ready: (selected?.queueOpen || 0) <= 8,
      tone: "evidence"
    },
    {
      id: "forecast-gate-load",
      label: "담당자 부하",
      value: `${selected?.ownerLoad || 0}건`,
      detail: "최대 담당자 부하 5건 이하",
      ready: (selected?.ownerLoad || 0) <= 5,
      tone: "support"
    }
  ];
}

function getReadinessForecastScore() {
  const selected = getSelectedForecastScenario();
  const gates = getForecastGateItems();
  const gateScore = Math.round((gates.filter((item) => item.ready).length / Math.max(gates.length, 1)) * 100);
  return clamp(Math.round(((selected?.readiness || 0) + gateScore) / 2), 24, 99);
}

function getReadinessForecastPacket() {
  return {
    package_type: "war-ground-readiness-forecast",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    forecast_score: getReadinessForecastScore(),
    selected_scenario: getSelectedForecastScenario(),
    timeline: getReadinessForecastItems(),
    scenarios: getForecastScenarioItems(),
    bottlenecks: getForecastBottleneckItems(),
    gates: getForecastGateItems()
  };
}

function getReadinessForecastSummaryText() {
  const packet = getReadinessForecastPacket();
  return [
    "WAR GROUND 준비 예측",
    `작전: ${packet.operation}`,
    `시나리오: ${packet.selected_scenario?.label || "기준"}`,
    `예측 점수: ${packet.forecast_score}%`,
    `준비도: ${packet.selected_scenario?.readiness || 0}% / 잔여 위험 ${packet.selected_scenario?.residualRisk || 0}`,
    `병목: ${packet.bottlenecks.map((item) => `${item.owner}-${item.title}`).join(" / ")}`,
    `게이트: ${packet.gates.map((item) => `${item.label} ${item.ready ? "완료" : "대기"}`).join(" / ")}`
  ].join("\n");
}

function renderReadinessForecast() {
  const page = byId("page-forecast");
  if (!page) return;
  const timeline = getReadinessForecastItems();
  const scenarios = getForecastScenarioItems();
  const selected = scenarios.find((item) => item.id === state.selectedForecastScenarioId) || scenarios[1] || scenarios[0];
  if (selected) state.selectedForecastScenarioId = selected.id;
  const bottlenecks = getForecastBottleneckItems();
  const gates = getForecastGateItems();
  const overview = byId("forecastOverviewPanel");
  const scenarioPanel = byId("forecastScenarioPanel");
  const bottleneckPanel = byId("forecastBottleneckPanel");
  const gatePanel = byId("forecastGatePanel");

  if (overview) {
    overview.innerHTML = `
      <div class="panel-heading"><span>준비 예측</span><b>${getReadinessForecastScore()}%</b></div>
      <strong>${selected?.label || "기준 처리"} 전망</strong>
      <p>${selected?.detail || "조치 큐 처리 속도별 준비도 변화를 예측합니다."}</p>
      <div class="forecast-kpi-grid">
        <article><span>준비도</span><b>${selected?.readiness || 0}%</b><em>선택 시나리오</em></article>
        <article><span>잔여 위험</span><b>${selected?.residualRisk || 0}</b><em>상위 경로</em></article>
        <article><span>큐 잔량</span><b>${selected?.queueOpen || 0}</b><em>열린 조치</em></article>
      </div>
      <div class="forecast-selected-card is-${selected?.tone || "primary"}">
        <span>${selected?.gate || "운용 유지"} · 담당자 최대 ${selected?.ownerLoad || 0}건</span>
        <b>${selected?.label || "예측"}</b>
        <p>${selected?.detail || "예측 시나리오를 선택하세요."}</p>
        <button type="button" data-forecast-action="copy">요약 복사</button>
      </div>
    `;
  }

  if (scenarioPanel) {
    scenarioPanel.innerHTML = `
      <div class="panel-heading"><span>예측 시나리오</span><b>${scenarios.length}개</b></div>
      ${scenarios.map((item) => `
        <article class="forecast-scenario-card is-${item.tone} ${item.id === state.selectedForecastScenarioId ? "is-selected" : ""}">
          <button type="button" data-forecast-action="select" data-forecast-ref="${item.id}" aria-pressed="${item.id === state.selectedForecastScenarioId ? "true" : "false"}">
            <span>${item.gate} · 큐 ${item.queueOpen}건</span>
            <b>${item.label}</b>
            <p>${item.detail}</p>
            <div class="forecast-bars" aria-label="${item.label} 예측">
              <i style="--value:${item.readiness}%"></i>
              <b style="--value:${item.residualRisk}%"></b>
            </div>
          </button>
        </article>
      `).join("")}
      <div class="forecast-timeline">
        ${timeline.map((item) => `
          <article class="is-${item.tone}">
            <span>${item.horizon}</span>
            <b>${item.readiness}%</b>
            <p>${item.detail}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  if (bottleneckPanel) {
    bottleneckPanel.innerHTML = `
      <div class="panel-heading"><span>병목 신호</span><b>${bottlenecks.length}건</b></div>
      ${bottlenecks.map((item) => `
        <article class="forecast-bottleneck-card is-${item.tone}">
          <span>${item.label} · 영향 ${item.impact}</span>
          <b>${item.title}</b>
          <p>${item.detail}</p>
          <button type="button" data-forecast-action="${item.action}" data-forecast-ref="${item.ref}">열기</button>
        </article>
      `).join("")}
    `;
  }

  if (gatePanel) {
    gatePanel.innerHTML = `
      <div class="panel-heading"><span>예측 게이트</span><b>${gates.filter((item) => item.ready).length}/${gates.length}</b></div>
      ${gates.map((item) => `
        <article class="forecast-gate-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "완료" : "대기"}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <em>${item.value}</em>
        </article>
      `).join("")}
      <div class="forecast-packet-actions">
        <button type="button" data-forecast-action="stage" data-forecast-ref="queue">큐 조정</button>
        <button type="button" data-forecast-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runForecastAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedForecastScenarioId = ref || state.selectedForecastScenarioId;
    renderReadinessForecast();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || state.selectedFailureId);
    return;
  }
  if (action === "download") {
    downloadJson(getReadinessForecastPacket(), "war-ground-readiness-forecast.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getReadinessForecastSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getBroadcastRecipientItems() {
  const forecast = getSelectedForecastScenario();
  const queueItems = getActionQueueItems();
  const handoffRecipients = getHandoffRecipientItems();
  const ownerAlias = {
    "지휘관": ["지휘관"],
    "통신참모": ["통신참모"],
    "군수참모": ["군수참모"],
    "훈련장교": ["훈련장교"],
    "검증관": ["검증관", "작전참모"]
  };
  return handoffRecipients.map((item) => {
    const aliases = ownerAlias[item.recipient] || [item.recipient];
    const ownedQueue = queueItems.filter((queue) => aliases.includes(queue.owner));
    const urgentCount = ownedQueue.filter((queue) => queue.priority === "urgent" || queue.priority === "high").length;
    const id = item.id.replace("handoff", "broadcast");
    return {
      id,
      sourceId: item.id,
      recipient: item.recipient,
      role: item.role,
      channel: item.recipient === "지휘관" ? "지휘망" : item.recipient === "훈련장교" ? "훈련통제망" : item.recipient === "검증관" ? "검증망" : "참모망",
      priority: urgentCount ? "즉시 전파" : item.priority,
      title: `${item.recipient} ${item.packet}`,
      detail: item.action,
      proof: `${item.proof} · ${forecast?.label || "기준 처리"} ${forecast?.readiness || 0}%`,
      message: `[WAR GROUND 전파] ${item.recipient}: ${item.packet}. ${item.action}. 예측 ${forecast?.label || "기준 처리"} 준비도 ${forecast?.readiness || 0}%, 잔여 위험 ${forecast?.residualRisk || 0}. 근거 ${evidenceById.get(item.evidenceId)?.title || item.evidenceId}.`,
      evidenceId: item.evidenceId,
      stage: item.stage,
      queueCount: ownedQueue.length,
      urgentCount,
      readiness: clamp((forecast?.readiness || 70) - urgentCount * 4 + (item.tone === "support" ? 4 : 0), 42, 99),
      tone: urgentCount ? "danger" : item.tone
    };
  });
}

function getSelectedBroadcastRecipient() {
  const recipients = getBroadcastRecipientItems();
  return recipients.find((item) => item.id === state.selectedBroadcastRecipientId) || recipients[0];
}

function getBroadcastMessageItems(recipientId = null) {
  const recipients = getBroadcastRecipientItems();
  const selected = recipientId ? recipients.find((item) => item.id === recipientId) : null;
  const forecast = getSelectedForecastScenario();
  const watchSignals = getWatchSignalItems();
  const handoffSignals = getHandoffSignalItems();
  const queueItems = getActionQueueItems();
  const baseRecipients = selected ? [selected] : recipients;
  return baseRecipients.flatMap((recipient) => {
    const handoffSignal = handoffSignals.find((item) => item.recipient === recipient.recipient);
    const queue = queueItems.find((item) => item.owner === recipient.recipient) || queueItems[0];
    const watch = watchSignals.find((item) => item.channel === recipient.channel) || watchSignals[0];
    return [
      {
        id: `broadcast-primary-${recipient.id}`,
        recipientId: recipient.id,
        label: "전파 본문",
        title: recipient.title,
        channel: recipient.channel,
        message: recipient.message,
        evidenceId: recipient.evidenceId,
        stage: recipient.stage,
        tone: recipient.tone
      },
      ...(selected ? [
        {
          id: `broadcast-forecast-${recipient.id}`,
          recipientId: recipient.id,
          label: "예측 요약",
          title: `${forecast?.label || "기준 처리"} ${getReadinessForecastScore()}% 전망`,
          channel: "지휘참모 공통",
          message: `[WAR GROUND 예측] ${forecast?.label || "기준 처리"}: 준비도 ${forecast?.readiness || 0}%, 잔여 위험 ${forecast?.residualRisk || 0}, 큐 잔량 ${forecast?.queueOpen || 0}건. 병목 ${getForecastBottleneckItems()[0]?.title || "없음"}.`,
          evidenceId: recipient.evidenceId,
          stage: "forecast",
          tone: "primary"
        },
        {
          id: `broadcast-queue-${recipient.id}`,
          recipientId: recipient.id,
          label: "큐 영향",
          title: queue?.title || "열린 조치 없음",
          channel: recipient.channel,
          message: queue ? `[WAR GROUND 큐] ${queue.owner}: ${queue.title}. 기한 ${queue.due}. 근거 ${evidenceById.get(queue.evidenceId)?.title || queue.evidenceId}.` : "[WAR GROUND 큐] 추가 조치 없음.",
          evidenceId: queue?.evidenceId || recipient.evidenceId,
          stage: queue?.stage || "queue",
          tone: queue?.tone || "support"
        },
        {
          id: `broadcast-signal-${recipient.id}`,
          recipientId: recipient.id,
          label: "감시 문안",
          title: handoffSignal?.title || watch?.title || "감시 신호",
          channel: handoffSignal?.channel || watch?.channel || recipient.channel,
          message: handoffSignal?.message || watch?.message || recipient.message,
          evidenceId: handoffSignal?.evidenceId || watch?.evidenceId || recipient.evidenceId,
          stage: handoffSignal?.stage || "watch",
          tone: handoffSignal?.tone || watch?.tone || recipient.tone
        }
      ] : [])
    ];
  });
}

function getBroadcastAckItems() {
  const recipients = getBroadcastRecipientItems();
  const messages = getBroadcastMessageItems();
  const forecastScore = getReadinessForecastScore();
  const urgentRecipients = recipients.filter((item) => item.urgentCount > 0);
  return [
    {
      id: "broadcast-ack-forecast",
      label: "예측 기준",
      value: `${forecastScore}%`,
      detail: "준비 예측 점수 80% 이상",
      ready: forecastScore >= 80,
      tone: "primary"
    },
    {
      id: "broadcast-ack-recipients",
      label: "수신자",
      value: `${recipients.length}명`,
      detail: "수신자별 패킷 생성",
      ready: recipients.length >= 5,
      tone: "support"
    },
    {
      id: "broadcast-ack-messages",
      label: "문안",
      value: `${messages.length}건`,
      detail: "수신자별 전파 문안 생성",
      ready: messages.length >= recipients.length,
      tone: "evidence"
    },
    {
      id: "broadcast-ack-urgent",
      label: "긴급 분리",
      value: `${urgentRecipients.length}명`,
      detail: "긴급 큐가 있는 수신자 표시",
      ready: urgentRecipients.length <= 3,
      tone: urgentRecipients.length ? "danger" : "support"
    },
    {
      id: "broadcast-ack-evidence",
      label: "근거 링크",
      value: `${new Set(recipients.map((item) => item.evidenceId).filter(Boolean)).size}건`,
      detail: "모든 문안에 근거 연결",
      ready: recipients.every((item) => Boolean(item.evidenceId)),
      tone: "primary"
    }
  ];
}

function getBroadcastReadinessScore() {
  const gates = getBroadcastAckItems();
  const readyScore = Math.round((gates.filter((item) => item.ready).length / Math.max(gates.length, 1)) * 100);
  const recipientScore = Math.round(getBroadcastRecipientItems().reduce((sum, item) => sum + item.readiness, 0) / Math.max(getBroadcastRecipientItems().length, 1));
  return clamp(Math.round((readyScore + recipientScore + getReadinessForecastScore()) / 3), 36, 99);
}

function getBroadcastPackage() {
  const selected = getSelectedBroadcastRecipient();
  return {
    package_type: "war-ground-broadcast-package",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getBroadcastReadinessScore(),
    selected_recipient: selected,
    recipients: getBroadcastRecipientItems(),
    messages: getBroadcastMessageItems(),
    selected_messages: selected ? getBroadcastMessageItems(selected.id) : [],
    acknowledgements: getBroadcastAckItems(),
    forecast: getReadinessForecastPacket(),
    queue: getActionQueuePacket()
  };
}

function getBroadcastSummaryText() {
  const packet = getBroadcastPackage();
  return [
    "WAR GROUND 전파 패키지",
    `작전: ${packet.operation}`,
    `준비도: ${packet.readiness_score}%`,
    `선택 수신자: ${packet.selected_recipient?.recipient || "없음"}`,
    `수신자: ${packet.recipients.map((item) => `${item.recipient}/${item.priority}`).join(" / ")}`,
    `문안: ${packet.selected_messages.map((item) => `${item.label}-${item.channel}`).join(" / ")}`,
    `확인: ${packet.acknowledgements.map((item) => `${item.label} ${item.ready ? "완료" : "대기"}`).join(" / ")}`
  ].join("\n");
}

function renderBroadcastPackage() {
  const page = byId("page-broadcast");
  if (!page) return;
  const recipients = getBroadcastRecipientItems();
  const selected = recipients.find((item) => item.id === state.selectedBroadcastRecipientId) || recipients[0];
  if (selected) state.selectedBroadcastRecipientId = selected.id;
  const messages = selected ? getBroadcastMessageItems(selected.id) : [];
  const acknowledgements = getBroadcastAckItems();
  const overview = byId("broadcastOverviewPanel");
  const recipientPanel = byId("broadcastRecipientPanel");
  const messagePanel = byId("broadcastMessagePanel");
  const ackPanel = byId("broadcastAckPanel");

  if (overview) {
    overview.innerHTML = `
      <div class="panel-heading"><span>전파 패키지</span><b>${getBroadcastReadinessScore()}%</b></div>
      <strong>${selected?.recipient || "수신자"} 우선 전파</strong>
      <p>${selected?.detail || "예측과 조치 큐를 수신자별 문안으로 묶습니다."}</p>
      <div class="broadcast-kpi-grid">
        <article><span>수신자</span><b>${recipients.length}</b><em>전파 대상</em></article>
        <article><span>문안</span><b>${getBroadcastMessageItems().length}</b><em>기본 문안</em></article>
        <article><span>확인</span><b>${acknowledgements.filter((item) => item.ready).length}/${acknowledgements.length}</b><em>완료 게이트</em></article>
      </div>
      ${selected ? `
        <div class="broadcast-selected-card is-${selected.tone}">
          <span>${selected.channel} · ${selected.priority}</span>
          <b>${selected.title}</b>
          <p>${selected.proof}</p>
          <button type="button" data-broadcast-action="copy">요약 복사</button>
        </div>
      ` : ""}
    `;
  }

  if (recipientPanel) {
    recipientPanel.innerHTML = `
      <div class="panel-heading"><span>수신자</span><b>${recipients.length}명</b></div>
      ${recipients.map((item) => `
        <article class="broadcast-recipient-card is-${item.tone} ${item.id === state.selectedBroadcastRecipientId ? "is-selected" : ""}">
          <button type="button" data-broadcast-action="select" data-broadcast-ref="${item.id}" aria-pressed="${item.id === state.selectedBroadcastRecipientId ? "true" : "false"}">
            <span>${item.priority} · ${item.channel}</span>
            <b>${item.recipient}</b>
            <p>${item.detail}</p>
            <i style="--value:${item.readiness}%"><small></small></i>
          </button>
          <footer>
            <em>큐 ${item.queueCount}건</em>
            <button type="button" data-broadcast-action="stage" data-broadcast-ref="${item.stage}">열기</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (messagePanel) {
    messagePanel.innerHTML = `
      <div class="panel-heading"><span>수신자별 문안</span><b>${messages.length}건</b></div>
      ${messages.map((item) => `
        <article class="broadcast-message-card is-${item.tone}">
          <span>${item.label} · ${item.channel}</span>
          <b>${item.title}</b>
          <p>${item.message}</p>
          <footer>
            <button type="button" data-broadcast-action="evidence" data-broadcast-ref="${item.evidenceId}">근거</button>
            <button type="button" data-broadcast-action="copy-message" data-broadcast-ref="${item.id}">복사</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (ackPanel) {
    ackPanel.innerHTML = `
      <div class="panel-heading"><span>확인 게이트</span><b>${acknowledgements.filter((item) => item.ready).length}/${acknowledgements.length}</b></div>
      ${acknowledgements.map((item) => `
        <article class="broadcast-ack-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "완료" : "대기"}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <em>${item.value}</em>
        </article>
      `).join("")}
      <div class="broadcast-packet-actions">
        <button type="button" data-broadcast-action="stage" data-broadcast-ref="forecast">예측 확인</button>
        <button type="button" data-broadcast-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runBroadcastAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedBroadcastRecipientId = ref || state.selectedBroadcastRecipientId;
    renderBroadcastPackage();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || getSelectedBroadcastRecipient()?.evidenceId || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getBroadcastPackage(), "war-ground-broadcast-package.json");
    return;
  }
  if (action === "copy-message") {
    const message = getBroadcastMessageItems(state.selectedBroadcastRecipientId).find((item) => item.id === ref);
    copyTextToClipboard(message?.message || getBroadcastSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "복사";
      }, 1200);
    });
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getBroadcastSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getReceiptTrackItems() {
  const statusByRecipient = {
    "지휘관": { status: "확인", receivedAt: "D+0 18:03", issue: "조건부 시행 승인 확인", ready: true, tone: "primary" },
    "통신참모": { status: "재전파", receivedAt: "대기", issue: "예비망 전환 권한 재확인", ready: false, tone: "danger" },
    "군수참모": { status: "확인", receivedAt: "D+0 18:07", issue: "보급 대기점 변경 수신", ready: true, tone: "support" },
    "훈련장교": { status: "확인", receivedAt: "D+0 18:11", issue: "재훈련 편성표 수신", ready: true, tone: "primary" },
    "검증관": { status: "대기", receivedAt: "D+0 18:15 예정", issue: "근거 원장 대조 필요", ready: false, tone: "evidence" }
  };
  return getBroadcastRecipientItems().map((recipient) => {
    const profile = statusByRecipient[recipient.recipient] || { status: "대기", receivedAt: "미확인", issue: "수신 확인 필요", ready: false, tone: "evidence" };
    const messageCount = getBroadcastMessageItems(recipient.id).length;
    const readiness = clamp(recipient.readiness + (profile.ready ? 6 : -14) - recipient.urgentCount * 4, 32, 99);
    return {
      id: `receipt-${recipient.id}`,
      recipientId: recipient.id,
      recipient: recipient.recipient,
      role: recipient.role,
      channel: recipient.channel,
      status: profile.status,
      receivedAt: profile.receivedAt,
      issue: profile.issue,
      ready: profile.ready,
      title: `${recipient.recipient} ${profile.status}`,
      detail: recipient.detail,
      evidenceId: recipient.evidenceId,
      stage: recipient.stage,
      queueCount: recipient.queueCount,
      urgentCount: recipient.urgentCount,
      messageCount,
      readiness,
      tone: profile.tone
    };
  });
}

function getSelectedReceiptItem() {
  const items = getReceiptTrackItems();
  return items.find((item) => item.id === state.selectedReceiptItemId) || items[0];
}

function getReceiptEscalationItems() {
  const selected = getSelectedReceiptItem();
  if (!selected) return [];
  return [
    {
      id: "receipt-rebroadcast",
      label: "재전파 요청",
      owner: selected.recipient,
      detail: `${selected.channel}로 ${selected.issue} 문안 재전파`,
      action: "broadcast",
      ref: selected.recipientId,
      tone: selected.ready ? "support" : "danger"
    },
    {
      id: "receipt-evidence",
      label: "근거 재첨부",
      owner: "검증관",
      detail: evidenceById.get(selected.evidenceId)?.title || selected.evidenceId,
      action: "evidence",
      ref: selected.evidenceId,
      tone: "evidence"
    },
    {
      id: "receipt-queue",
      label: "큐 영향 확인",
      owner: "작전참모",
      detail: `${selected.queueCount}건 조치와 ${selected.urgentCount}건 긴급 항목 재확인`,
      action: "stage",
      ref: "queue",
      tone: selected.urgentCount ? "danger" : "primary"
    },
    {
      id: "receipt-log",
      label: "일지 기록",
      owner: "상황장교",
      detail: `${selected.recipient} 수신 상태를 상황 일지에 남김`,
      action: "stage",
      ref: "log",
      tone: "support"
    }
  ];
}

function getReceiptGateItems() {
  const tracks = getReceiptTrackItems();
  const readyCount = tracks.filter((item) => item.ready).length;
  const openCount = tracks.length - readyCount;
  const logReferenceCount = getDecisionWatchItems().length;
  return [
    {
      id: "receipt-gate-recipients",
      label: "수신 완료",
      value: `${readyCount}/${tracks.length}`,
      detail: "전체 수신자 확인 상태",
      ready: readyCount >= tracks.length - 1,
      tone: "primary"
    },
    {
      id: "receipt-gate-open",
      label: "미확인 대상",
      value: `${openCount}명`,
      detail: "미확인 수신자 1명 이하",
      ready: openCount <= 1,
      tone: openCount ? "danger" : "support"
    },
    {
      id: "receipt-gate-evidence",
      label: "근거 링크",
      value: `${new Set(tracks.map((item) => item.evidenceId).filter(Boolean)).size}건`,
      detail: "모든 수신 항목 근거 연결",
      ready: tracks.every((item) => Boolean(item.evidenceId)),
      tone: "evidence"
    },
    {
      id: "receipt-gate-log",
      label: "일지 연결",
      value: `${logReferenceCount}건`,
      detail: "상황 일지 참조 가능",
      ready: logReferenceCount >= 4,
      tone: "support"
    },
    {
      id: "receipt-gate-package",
      label: "전파 패키지",
      value: `${getBroadcastReadinessScore()}%`,
      detail: "전파 준비도 80% 이상",
      ready: getBroadcastReadinessScore() >= 80,
      tone: "primary"
    }
  ];
}

function getReceiptReadinessScore() {
  const tracks = getReceiptTrackItems();
  const gates = getReceiptGateItems();
  const trackScore = Math.round(tracks.reduce((sum, item) => sum + item.readiness, 0) / Math.max(tracks.length, 1));
  const gateScore = Math.round((gates.filter((item) => item.ready).length / Math.max(gates.length, 1)) * 100);
  return clamp(Math.round((trackScore + gateScore + getBroadcastReadinessScore()) / 3), 28, 99);
}

function getReceiptPackage() {
  return {
    package_type: "war-ground-broadcast-receipt-tracker",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getReceiptReadinessScore(),
    selected_receipt: getSelectedReceiptItem(),
    receipts: getReceiptTrackItems(),
    escalations: getReceiptEscalationItems(),
    gates: getReceiptGateItems(),
    broadcast_package: getBroadcastPackage()
  };
}

function getReceiptSummaryText() {
  const packet = getReceiptPackage();
  return [
    "WAR GROUND 수신 확인",
    `작전: ${packet.operation}`,
    `준비도: ${packet.readiness_score}%`,
    `선택 수신자: ${packet.selected_receipt?.recipient || "없음"} / ${packet.selected_receipt?.status || "대기"}`,
    `수신: ${packet.receipts.map((item) => `${item.recipient}-${item.status}`).join(" / ")}`,
    `조치: ${packet.escalations.map((item) => `${item.label}-${item.owner}`).join(" / ")}`,
    `게이트: ${packet.gates.map((item) => `${item.label} ${item.ready ? "완료" : "대기"}`).join(" / ")}`
  ].join("\n");
}

function renderReceiptTracker() {
  const page = byId("page-receipt");
  if (!page) return;
  const tracks = getReceiptTrackItems();
  const selected = tracks.find((item) => item.id === state.selectedReceiptItemId) || tracks[0];
  if (selected) state.selectedReceiptItemId = selected.id;
  const escalations = getReceiptEscalationItems();
  const gates = getReceiptGateItems();
  const overview = byId("receiptOverviewPanel");
  const trackPanel = byId("receiptTrackPanel");
  const escalationPanel = byId("receiptEscalationPanel");
  const gatePanel = byId("receiptGatePanel");

  if (overview) {
    const readyCount = tracks.filter((item) => item.ready).length;
    overview.innerHTML = `
      <div class="panel-heading"><span>수신 확인</span><b>${getReceiptReadinessScore()}%</b></div>
      <strong>${selected?.recipient || "수신자"} ${selected?.status || "대기"}</strong>
      <p>${selected?.issue || "전파 패키지 수신 상태를 확인합니다."}</p>
      <div class="receipt-kpi-grid">
        <article><span>확인</span><b>${readyCount}/${tracks.length}</b><em>수신자 상태</em></article>
        <article><span>미확인</span><b>${tracks.length - readyCount}</b><em>재전파 대상</em></article>
        <article><span>조치</span><b>${escalations.length}</b><em>선택 대상</em></article>
      </div>
      ${selected ? `
        <div class="receipt-selected-card is-${selected.tone}">
          <span>${selected.channel} · ${selected.receivedAt}</span>
          <b>${selected.title}</b>
          <p>${selected.detail}</p>
          <button type="button" data-receipt-action="copy">요약 복사</button>
        </div>
      ` : ""}
    `;
  }

  if (trackPanel) {
    trackPanel.innerHTML = `
      <div class="panel-heading"><span>수신 추적</span><b>${tracks.length}명</b></div>
      ${tracks.map((item) => `
        <article class="receipt-track-card is-${item.tone} ${item.id === state.selectedReceiptItemId ? "is-selected" : ""}">
          <button type="button" data-receipt-action="select" data-receipt-ref="${item.id}" aria-pressed="${item.id === state.selectedReceiptItemId ? "true" : "false"}">
            <span>${item.status} · ${item.channel}</span>
            <b>${item.recipient}</b>
            <p>${item.issue}</p>
            <i style="--value:${item.readiness}%"><small></small></i>
          </button>
          <footer>
            <em>${item.messageCount}개 문안 · 큐 ${item.queueCount}건</em>
            <button type="button" data-receipt-action="broadcast" data-receipt-ref="${item.recipientId}">전파</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (escalationPanel) {
    escalationPanel.innerHTML = `
      <div class="panel-heading"><span>미확인 대상</span><b>${tracks.filter((item) => !item.ready).length}명</b></div>
      ${escalations.map((item, index) => `
        <article class="receipt-escalation-card is-${item.tone}">
          <span>${String(index + 1).padStart(2, "0")} · ${item.owner}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <button type="button" data-receipt-action="${item.action}" data-receipt-ref="${item.ref}">열기</button>
        </article>
      `).join("")}
    `;
  }

  if (gatePanel) {
    gatePanel.innerHTML = `
      <div class="panel-heading"><span>완료 게이트</span><b>${gates.filter((item) => item.ready).length}/${gates.length}</b></div>
      ${gates.map((item) => `
        <article class="receipt-gate-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "완료" : "대기"}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <em>${item.value}</em>
        </article>
      `).join("")}
      <div class="receipt-packet-actions">
        <button type="button" data-receipt-action="stage" data-receipt-ref="broadcast">전파 보기</button>
        <button type="button" data-receipt-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runReceiptAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedReceiptItemId = ref || state.selectedReceiptItemId;
    renderReceiptTracker();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "broadcast") {
    state.selectedBroadcastRecipientId = ref || getSelectedReceiptItem()?.recipientId || state.selectedBroadcastRecipientId;
    setStage("broadcast");
    renderBroadcastPackage();
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || getSelectedReceiptItem()?.evidenceId || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getReceiptPackage(), "war-ground-receipt-tracker.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getReceiptSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getCloseoutSummaryItems() {
  const receiptTracks = getCloseoutReceiptItems();
  const receiptReady = receiptTracks.filter((item) => item.ready).length;
  const receiptOpen = receiptTracks.length - receiptReady;
  const auditSummary = getCloseoutAuditSummary();
  const submissionScore = getCloseoutSubmissionScore();
  return [
    {
      id: "closeout-final",
      label: "최종 결심",
      value: demoData.decision.recommended_coa,
      detail: demoData.decision.conditional_coa,
      ready: getActiveDecisionConditionIds().size >= getDecisionConditions().length,
      action: "stage",
      ref: "decision",
      tone: "primary"
    },
    {
      id: "closeout-receipt",
      label: "수신 확인",
      value: `${receiptReady}/${receiptTracks.length}`,
      detail: receiptOpen ? `${receiptOpen}명 재확인 필요` : "전체 수신자 확인",
      ready: receiptOpen <= 1,
      action: "stage",
      ref: "receipt",
      tone: receiptOpen ? "danger" : "support"
    },
    {
      id: "closeout-submit",
      label: "제출 묶음",
      value: `${submissionScore}%`,
      detail: `${getCloseoutBundleCount()}개 산출물 잠금`,
      ready: submissionScore >= 80,
      action: "stage",
      ref: "submit",
      tone: "evidence"
    },
    {
      id: "closeout-audit",
      label: "감사 기록",
      value: `${auditSummary.evidenceCount}건`,
      detail: `검증 공백 ${auditSummary.gapCount}건`,
      ready: auditSummary.gapCount <= 2,
      action: "stage",
      ref: "audit",
      tone: auditSummary.gapCount ? "evidence" : "support"
    }
  ];
}

function getSelectedCloseoutItem() {
  const items = getCloseoutSummaryItems();
  return items.find((item) => item.id === state.selectedCloseoutItemId) || items[0];
}

function getCloseoutSubmissionScore() {
  const auditSummary = getCloseoutAuditSummary();
  const gates = [
    true,
    true,
    getActiveDecisionConditionIds().size >= getDecisionConditions().length,
    demoData.decision.evidence_ids.length >= 3,
    getAarImprovementItems().length >= 6,
    auditSummary.verifiedPercent >= 80,
    getRetrainingScheduleItems().length >= 6
  ];
  return Math.round((gates.filter(Boolean).length / gates.length) * 100);
}

function getCloseoutReceiptItems() {
  const recipients = [
    { recipient: "지휘관", role: "최종 승인", channel: "지휘망", status: "확인", receivedAt: "D+0 18:03", issue: "조건부 시행 승인 확인", ready: true, tone: "primary" },
    { recipient: "통신참모", role: "통신 보완", channel: "참모망", status: "재전파", receivedAt: "대기", issue: "예비망 전환 권한 재확인", ready: false, tone: "danger" },
    { recipient: "군수참모", role: "보급 지속성", channel: "참모망", status: "확인", receivedAt: "D+0 18:07", issue: "보급 대기점 변경 수신", ready: true, tone: "support" },
    { recipient: "훈련장교", role: "재훈련 통제", channel: "훈련통제망", status: "확인", receivedAt: "D+0 18:11", issue: "재훈련 편성표 수신", ready: true, tone: "primary" },
    { recipient: "검증관", role: "근거 추적", channel: "검증망", status: "대기", receivedAt: "D+0 18:15 예정", issue: "근거 원장 대조 필요", ready: false, tone: "evidence" }
  ];
  return recipients.map((item, index) => ({
    id: `closeout-receipt-${index + 1}`,
    ...item,
    readiness: item.ready ? 92 : item.status === "재전파" ? 54 : 64
  }));
}

function getCloseoutReceiptReadinessScore(items = getCloseoutReceiptItems()) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + item.readiness, 0) / items.length);
}

function getCloseoutAuditSummary() {
  const usedEvidence = new Set([
    ...demoData.failures.flatMap((failure) => failure.evidence),
    ...demoData.events.flatMap((event) => event.evidence_ids || []),
    ...demoData.decision.evidence_ids
  ]);
  const weakEvidence = demoData.evidence.filter((item) => item.status !== "근거 있음" || !usedEvidence.has(item.id));
  const pendingCount = state.scenarioLoaded ? 0 : 1;
  return {
    trailCount: 8,
    evidenceCount: demoData.evidence.length,
    usedEvidenceCount: usedEvidence.size,
    weakEvidenceCount: weakEvidence.length,
    pendingCount,
    gapCount: weakEvidence.length + pendingCount,
    verifiedPercent: Math.round((usedEvidence.size / Math.max(demoData.evidence.length, 1)) * 100),
    weakEvidence
  };
}

function getCloseoutBundleCount() {
  return 6;
}

function getCloseoutEvidenceDebtItems() {
  const usedEvidence = new Set([
    ...demoData.failures.flatMap((failure) => failure.evidence),
    ...demoData.events.flatMap((event) => event.evidence_ids || []),
    ...demoData.decision.evidence_ids
  ]);
  return demoData.evidence
    .filter((item) => item.status !== "근거 있음" || !usedEvidence.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      source: item.source,
      status: item.status,
      owner: item.status === "추정" ? "검증관" : "작전참모",
      tone: item.status === "추정" ? "danger" : "evidence"
    }));
}

function getCloseoutUrgentQueueItems() {
  const ownerByFailure = {
    command_gap: "통신참모",
    sustainment_drop: "군수참모",
    accident_delay: "의무참모",
    rejudge_delay: "지휘관"
  };
  return demoData.failures
    .filter((failure) => failure.score >= 88)
    .map((failure) => {
      const event = demoData.events.find((item) => item.linked_risks.includes(failure.id));
      return {
        id: `closeout-queue-${failure.id}`,
        title: `${failure.title} 후속 확인`,
        owner: ownerByFailure[failure.id] || "작전참모",
        due: event?.time || "즉시",
        score: failure.score,
        ref: failure.id,
        tone: failure.score >= 90 ? "danger" : "evidence"
      };
    })
    .sort((a, b) => b.score - a.score);
}

function getCloseoutRetrainingGateCount() {
  const schedule = getRetrainingScheduleItems();
  const gates = [
    schedule.length >= 6,
    new Set(schedule.map((item) => item.evidenceId).filter(Boolean)).size >= 4,
    getActiveDecisionConditionIds().size >= getDecisionConditions().length,
    schedule.filter((item) => item.priority === "high").length >= 2
  ];
  return gates.filter(Boolean).length;
}

function getCloseoutDecisionItems() {
  const receiptTracks = getCloseoutReceiptItems();
  const receiptScore = getCloseoutReceiptReadinessScore(receiptTracks);
  return [
    {
      id: "closeout-decision-card",
      label: "결심카드",
      title: `${demoData.decision.recommended_coa} 조건부 시행`,
      detail: demoData.decision.command_authority_notice,
      value: `${getActiveDecisionConditionIds().size}/${getDecisionConditions().length} 조건`,
      action: "stage",
      ref: "decision",
      tone: "primary"
    },
    {
      id: "closeout-order",
      label: "단편명령",
      title: demoData.order.title,
      detail: demoData.order.command_signal[0] || "지휘 및 통신 기준 확인",
      value: `${demoData.order.execution.length}개 실행`,
      action: "stage",
      ref: "decision",
      tone: "support"
    },
    {
      id: "closeout-receipt-lock",
      label: "수신 잠금",
      title: `수신 확인 ${receiptScore}%`,
      detail: `${receiptTracks.filter((item) => !item.ready).length}명 미확인 대상 추적`,
      value: `${receiptTracks.filter((item) => item.ready).length}/${receiptTracks.length} 수신`,
      action: "stage",
      ref: "receipt",
      tone: receiptScore >= 80 ? "evidence" : "danger"
    }
  ];
}

function getCloseoutExceptionItems() {
  const openReceipt = getCloseoutReceiptItems().filter((item) => !item.ready);
  const evidenceDebt = getCloseoutEvidenceDebtItems();
  const urgentQueue = getCloseoutUrgentQueueItems();
  const auditSummary = getCloseoutAuditSummary();
  return [
    {
      id: "closeout-exception-receipt",
      label: "미확인 수신",
      owner: openReceipt[0]?.recipient || "상황장교",
      detail: openReceipt.length ? `${openReceipt.map((item) => item.recipient).join(", ")} 재확인` : "수신자 확인 완료",
      ready: openReceipt.length <= 1,
      value: `${openReceipt.length}명`,
      action: "stage",
      ref: "receipt",
      tone: openReceipt.length ? "danger" : "support"
    },
    {
      id: "closeout-exception-evidence",
      label: "근거 부채",
      owner: "검증관",
      detail: evidenceDebt[0]?.title || "추가 근거 부채 없음",
      ready: evidenceDebt.length <= 3,
      value: `${evidenceDebt.length}건`,
      action: "stage",
      ref: "metrics",
      tone: evidenceDebt.length ? "evidence" : "support"
    },
    {
      id: "closeout-exception-queue",
      label: "긴급 큐",
      owner: urgentQueue[0]?.owner || "작전참모",
      detail: urgentQueue[0]?.title || "즉시 큐 없음",
      ready: urgentQueue.length <= 2,
      value: `${urgentQueue.length}건`,
      action: "stage",
      ref: "risk",
      tone: urgentQueue.length ? "danger" : "support"
    },
    {
      id: "closeout-exception-audit",
      label: "검증 공백",
      owner: "감사 담당",
      detail: `근거 검증 ${auditSummary.verifiedPercent}% · 원장 ${auditSummary.evidenceCount}건`,
      ready: auditSummary.gapCount <= 2,
      value: `${auditSummary.gapCount}건`,
      action: "stage",
      ref: "audit",
      tone: auditSummary.gapCount ? "evidence" : "support"
    }
  ];
}

function getCloseoutArchiveItems() {
  const receiptTracks = getCloseoutReceiptItems();
  const auditSummary = getCloseoutAuditSummary();
  return [
    {
      id: "closeout-archive-submit",
      label: "제출 패키지",
      file: "war-ground-submission-packet.json",
      detail: `${getCloseoutBundleCount()}개 제출 산출물`,
      ready: getCloseoutSubmissionScore() >= 80,
      action: "stage",
      ref: "submit",
      tone: "primary"
    },
    {
      id: "closeout-archive-receipt",
      label: "수신 확인",
      file: "war-ground-receipt-tracker.json",
      detail: `${receiptTracks.length}명 수신 상태`,
      ready: getCloseoutReceiptReadinessScore(receiptTracks) >= 70,
      action: "stage",
      ref: "receipt",
      tone: "evidence"
    },
    {
      id: "closeout-archive-audit",
      label: "감사 로그",
      file: "war-ground-audit-logbook.json",
      detail: `${auditSummary.trailCount}개 판단 이벤트`,
      ready: auditSummary.gapCount <= 2,
      action: "stage",
      ref: "audit",
      tone: "support"
    },
    {
      id: "closeout-archive-retrain",
      label: "재훈련 계획",
      file: "war-ground-72h-retraining-plan.json",
      detail: `${getRetrainingScheduleItems().length}개 훈련 과제`,
      ready: getCloseoutRetrainingGateCount() >= 3,
      action: "stage",
      ref: "retrain",
      tone: "primary"
    },
    {
      id: "closeout-archive-closeout",
      label: "종결 보고",
      file: "war-ground-closeout-report.json",
      detail: "결심·수신·예외·보관 통합 기록",
      ready: true,
      action: "download",
      ref: "closeout",
      tone: "evidence"
    }
  ];
}

function getCloseoutReadinessScore(
  summaryItems = getCloseoutSummaryItems(),
  exceptionItems = getCloseoutExceptionItems(),
  archiveItems = getCloseoutArchiveItems(),
  receiptScore = getCloseoutReceiptReadinessScore()
) {
  const summaryScore = Math.round((summaryItems.filter((item) => item.ready).length / Math.max(summaryItems.length, 1)) * 100);
  const exceptionScore = Math.round((exceptionItems.filter((item) => item.ready).length / Math.max(exceptionItems.length, 1)) * 100);
  const archiveScore = Math.round((archiveItems.filter((item) => item.ready).length / Math.max(archiveItems.length, 1)) * 100);
  return clamp(Math.round((summaryScore + exceptionScore + archiveScore + receiptScore) / 4), 32, 99);
}

function getCloseoutPackage() {
  return {
    package_type: "war-ground-closeout-report",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getCloseoutReadinessScore(),
    selected_item: getSelectedCloseoutItem(),
    summary_items: getCloseoutSummaryItems(),
    decision_items: getCloseoutDecisionItems(),
    exceptions: getCloseoutExceptionItems(),
    archive_items: getCloseoutArchiveItems(),
    receipt_readiness: getCloseoutReceiptReadinessScore(),
    submission_readiness: getCloseoutSubmissionScore(),
    audit_gap_count: getCloseoutAuditSummary().gapCount
  };
}

function getCloseoutSummaryText() {
  const packet = getCloseoutPackage();
  return [
    "WAR GROUND 종결 보고",
    `작전: ${packet.operation}`,
    `종결 준비도: ${packet.readiness_score}%`,
    `잠금: ${packet.summary_items.map((item) => `${item.label}-${item.ready ? "완료" : "대기"}`).join(" / ")}`,
    `예외: ${packet.exceptions.map((item) => `${item.label} ${item.value}`).join(" / ")}`,
    `보관: ${packet.archive_items.map((item) => item.file).join(" / ")}`
  ].join("\n");
}

function renderCloseoutReport() {
  const page = byId("page-closeout");
  if (!page) return;
  const summaryItems = getCloseoutSummaryItems();
  const selected = summaryItems.find((item) => item.id === state.selectedCloseoutItemId) || summaryItems[0];
  if (selected) state.selectedCloseoutItemId = selected.id;
  const decisionItems = getCloseoutDecisionItems();
  const exceptions = getCloseoutExceptionItems();
  const archives = getCloseoutArchiveItems();
  const readiness = getCloseoutReadinessScore(summaryItems, exceptions, archives);
  const overview = byId("closeoutOverviewPanel");
  const decisionPanel = byId("closeoutDecisionPanel");
  const exceptionPanel = byId("closeoutExceptionPanel");
  const archivePanel = byId("closeoutArchivePanel");

  if (overview) {
    const readyCount = summaryItems.filter((item) => item.ready).length;
    overview.innerHTML = `
      <div class="panel-heading"><span>종결 보고</span><b>${readiness}%</b></div>
      <strong>${selected?.label || "종결"} ${selected?.value || "대기"}</strong>
      <p>${selected?.detail || "최종 운용 기록을 잠급니다."}</p>
      <div class="closeout-kpi-grid">
        <article><span>잠금</span><b>${readyCount}/${summaryItems.length}</b><em>종결 조건</em></article>
        <article><span>예외</span><b>${exceptions.filter((item) => !item.ready).length}</b><em>후속 책임</em></article>
        <article><span>보관</span><b>${archives.length}</b><em>산출물</em></article>
      </div>
      ${selected ? `
        <div class="closeout-selected-card is-${selected.tone}">
          <span>${selected.ready ? "완료" : "대기"} · ${selected.label}</span>
          <b>${selected.value}</b>
          <p>${selected.detail}</p>
          <button type="button" data-closeout-action="${selected.action}" data-closeout-ref="${selected.ref}">열기</button>
        </div>
      ` : ""}
    `;
  }

  if (decisionPanel) {
    decisionPanel.innerHTML = `
      <div class="panel-heading"><span>최종 판단</span><b>${decisionItems.length}개</b></div>
      ${decisionItems.map((item) => `
        <article class="closeout-decision-card is-${item.tone}">
          <span>${item.label} · ${item.value}</span>
          <b>${item.title}</b>
          <p>${item.detail}</p>
          <button type="button" data-closeout-action="${item.action}" data-closeout-ref="${item.ref}">열기</button>
        </article>
      `).join("")}
    `;
  }

  if (exceptionPanel) {
    exceptionPanel.innerHTML = `
      <div class="panel-heading"><span>예외 처리</span><b>${exceptions.filter((item) => !item.ready).length}건</b></div>
      ${exceptions.map((item, index) => `
        <article class="closeout-exception-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${String(index + 1).padStart(2, "0")} · ${item.owner}</span>
          <b>${item.label}</b>
          <p>${item.detail}</p>
          <footer>
            <em>${item.value}</em>
            <button type="button" data-closeout-action="${item.action}" data-closeout-ref="${item.ref}">열기</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (archivePanel) {
    archivePanel.innerHTML = `
      <div class="panel-heading"><span>보관 산출물</span><b>${archives.filter((item) => item.ready).length}/${archives.length}</b></div>
      ${archives.map((item) => `
        <article class="closeout-archive-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "잠금" : "확인"} · ${item.label}</span>
          <b>${item.file}</b>
          <p>${item.detail}</p>
          <button type="button" data-closeout-action="${item.action}" data-closeout-ref="${item.ref}">${item.action === "download" ? "저장" : "열기"}</button>
        </article>
      `).join("")}
      <div class="closeout-packet-actions">
        <button type="button" data-closeout-action="stage" data-closeout-ref="receipt">수신 확인</button>
        <button type="button" data-closeout-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runCloseoutAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedCloseoutItemId = ref || state.selectedCloseoutItemId;
    renderCloseoutReport();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "download") {
    downloadJson(getCloseoutPackage(), "war-ground-closeout-report.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getCloseoutSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getLessonSummaryItems() {
  const patterns = getLessonPatternItems();
  const checks = getLessonChecklistItems();
  const closeoutScore = getCloseoutReadinessScore();
  return [
    {
      id: "lesson-command-gap",
      label: "우선 교훈",
      value: "통신 공백",
      detail: "예비망 전환 권한과 미확인 수신 추적을 다음 작전 체크로 고정",
      ready: true,
      action: "risk",
      ref: "command_gap",
      tone: "danger"
    },
    {
      id: "lesson-conditional-decision",
      label: "결심 재사용",
      value: demoData.decision.recommended_coa,
      detail: demoData.decision.conditional_coa,
      ready: getActiveDecisionConditionIds().size >= getDecisionConditions().length,
      action: "stage",
      ref: "decision",
      tone: "primary"
    },
    {
      id: "lesson-checklist",
      label: "재사용 체크",
      value: `${checks.filter((item) => item.ready).length}/${checks.length}`,
      detail: "다음 작전 투입 전 확인할 조건",
      ready: checks.filter((item) => item.ready).length >= Math.ceil(checks.length * 0.7),
      action: "stage",
      ref: "lessons",
      tone: "support"
    },
    {
      id: "lesson-package",
      label: "교훈 패킷",
      value: `${patterns.length}개 패턴`,
      detail: `종결 준비도 ${closeoutScore}% 기반`,
      ready: closeoutScore >= 60,
      action: "download",
      ref: "lessons",
      tone: "evidence"
    }
  ];
}

function getLessonPatternItems() {
  const exceptionItems = getCloseoutExceptionItems();
  const receiptOpen = getCloseoutReceiptItems().filter((item) => !item.ready).length;
  return [
    {
      id: "lesson-pattern-command",
      label: "반복 위험",
      title: "통신 두절 전 예비망 권한을 먼저 확정",
      detail: `미확인 수신 ${receiptOpen}명과 긴급 큐를 동시에 닫아야 지휘공백이 줄어듭니다.`,
      reuse: "작전 접수 시 통신참모 권한·대체망·수신 확인자를 같은 줄에 배치",
      owner: "통신참모",
      stage: "risk",
      ref: "command_gap",
      evidenceId: "ev_comm_gap",
      ready: receiptOpen <= 2,
      tone: "danger"
    },
    {
      id: "lesson-pattern-decision",
      label: "결심 조건",
      title: `${demoData.decision.recommended_coa} 우선, A안 조건부 유지`,
      detail: demoData.decision.conditional_coa,
      reuse: "방책 추천은 통신·군수·재판단·후송 조건이 잠긴 뒤에만 승격",
      owner: "지휘관",
      stage: "decision",
      ref: "decision",
      evidenceId: demoData.decision.evidence_ids[0],
      ready: true,
      tone: "primary"
    },
    {
      id: "lesson-pattern-evidence",
      label: "근거 부채",
      title: "추정 근거는 종결 전 책임자를 붙여 보관",
      detail: exceptionItems.find((item) => item.id === "closeout-exception-evidence")?.detail || "근거 원장 공백 추적",
      reuse: "검증관이 약한 근거를 원장, 실패경로, 재훈련 체크에 동시에 연결",
      owner: "검증관",
      stage: "audit",
      ref: "audit",
      evidenceId: "ev_comm_gap",
      ready: getCloseoutEvidenceDebtItems().length <= 3,
      tone: "evidence"
    },
    {
      id: "lesson-pattern-retrain",
      label: "재훈련 전환",
      title: "AAR 조치는 72시간 훈련 과제로 즉시 전환",
      detail: `${getRetrainingScheduleItems().length}개 훈련 과제와 ${getCloseoutRetrainingGateCount()}/4 검증 게이트`,
      reuse: "훈련장교가 고위험 실패경로부터 드릴, 측정 기준, 근거를 묶어 배치",
      owner: "훈련장교",
      stage: "retrain",
      ref: "retrain",
      evidenceId: "ev_redteam_delay",
      ready: getCloseoutRetrainingGateCount() >= 3,
      tone: "support"
    }
  ];
}

function getLessonChecklistItems() {
  const receiptItems = getCloseoutReceiptItems();
  const audit = getCloseoutAuditSummary();
  const archives = getCloseoutArchiveItems();
  return [
    {
      id: "lesson-check-intake",
      label: "자료 접수",
      title: "작전계획 접수 전 결심 산출 잠금",
      detail: `${demoData.operationPlan.documents.length}종 자료와 ${demoData.coas.length}개 방책 비교 기준`,
      ready: true,
      stage: "data",
      tone: "primary"
    },
    {
      id: "lesson-check-comms",
      label: "통신",
      title: "예비망 전환 권한과 수신 확인자를 같은 체크에 둠",
      detail: `${receiptItems.filter((item) => !item.ready).length}명 미확인 수신 추적`,
      ready: receiptItems.filter((item) => !item.ready).length <= 2,
      stage: "receipt",
      tone: "danger"
    },
    {
      id: "lesson-check-evidence",
      label: "근거",
      title: "추정·약한 근거는 검증관 책임으로 재분류",
      detail: `검증 공백 ${audit.gapCount}건 / 근거 사용률 ${audit.verifiedPercent}%`,
      ready: audit.verifiedPercent >= 70,
      stage: "audit",
      tone: "evidence"
    },
    {
      id: "lesson-check-retrain",
      label: "훈련",
      title: "AAR 조치가 재훈련 과제로 전환됐는지 확인",
      detail: `${getRetrainingScheduleItems().length}개 과제 / 게이트 ${getCloseoutRetrainingGateCount()}/4`,
      ready: getCloseoutRetrainingGateCount() >= 3,
      stage: "retrain",
      tone: "support"
    },
    {
      id: "lesson-check-archive",
      label: "보관",
      title: "종결 보고와 교훈 패킷을 함께 저장",
      detail: `${archives.filter((item) => item.ready).length}/${archives.length} 종결 산출물 잠금`,
      ready: archives.filter((item) => item.ready).length >= 4,
      stage: "closeout",
      tone: "primary"
    }
  ];
}

function getLessonArchiveItems() {
  const patterns = getLessonPatternItems();
  const checks = getLessonChecklistItems();
  return [
    {
      id: "lesson-archive-library",
      label: "교훈 라이브러리",
      file: "war-ground-lessons-library.json",
      detail: `${patterns.length}개 판단 패턴과 ${checks.length}개 재사용 체크`,
      ready: true,
      action: "download",
      ref: "lessons",
      tone: "primary"
    },
    {
      id: "lesson-archive-checklist",
      label: "재사용 체크",
      file: "war-ground-reuse-checklist.json",
      detail: `${checks.filter((item) => item.ready).length}/${checks.length} 조건 준비`,
      ready: checks.filter((item) => item.ready).length >= 4,
      action: "stage",
      ref: "lessons",
      tone: "support"
    },
    {
      id: "lesson-archive-closeout",
      label: "종결 연결",
      file: "war-ground-closeout-report.json",
      detail: "결심·수신·예외·보관 기록 참조",
      ready: getCloseoutReadinessScore() >= 60,
      action: "stage",
      ref: "closeout",
      tone: "evidence"
    },
    {
      id: "lesson-archive-training",
      label: "훈련 반영",
      file: "war-ground-training-insert.json",
      detail: "72시간 재훈련 계획에 교훈 체크 삽입",
      ready: getCloseoutRetrainingGateCount() >= 3,
      action: "stage",
      ref: "retrain",
      tone: "primary"
    }
  ];
}

function getLessonReadinessScore(
  summaryItems = getLessonSummaryItems(),
  patternItems = getLessonPatternItems(),
  checklistItems = getLessonChecklistItems(),
  archiveItems = getLessonArchiveItems()
) {
  const summaryScore = Math.round((summaryItems.filter((item) => item.ready).length / Math.max(summaryItems.length, 1)) * 100);
  const patternScore = Math.round((patternItems.filter((item) => item.ready).length / Math.max(patternItems.length, 1)) * 100);
  const checklistScore = Math.round((checklistItems.filter((item) => item.ready).length / Math.max(checklistItems.length, 1)) * 100);
  const archiveScore = Math.round((archiveItems.filter((item) => item.ready).length / Math.max(archiveItems.length, 1)) * 100);
  return clamp(Math.round((summaryScore + patternScore + checklistScore + archiveScore) / 4), 36, 99);
}

function getLessonPackage() {
  return {
    package_type: "war-ground-lessons-library",
    generated_at: new Date().toISOString(),
    operation: demoData.operationPlan.operation_name,
    readiness_score: getLessonReadinessScore(),
    selected_lesson: state.selectedLessonItemId,
    summary_items: getLessonSummaryItems(),
    pattern_items: getLessonPatternItems(),
    reuse_checklist: getLessonChecklistItems(),
    archive_items: getLessonArchiveItems(),
    source_closeout: {
      readiness_score: getCloseoutReadinessScore(),
      receipt_readiness: getCloseoutReceiptReadinessScore(),
      audit_gap_count: getCloseoutAuditSummary().gapCount
    }
  };
}

function getLessonSummaryText() {
  const packet = getLessonPackage();
  return [
    "WAR GROUND 교훈 라이브러리",
    `작전: ${packet.operation}`,
    `재사용 준비도: ${packet.readiness_score}%`,
    `패턴: ${packet.pattern_items.map((item) => item.title).join(" / ")}`,
    `체크: ${packet.reuse_checklist.map((item) => `${item.label}-${item.ready ? "완료" : "확인"}`).join(" / ")}`,
    `보관: ${packet.archive_items.map((item) => item.file).join(" / ")}`
  ].join("\n");
}

function renderLessonsLibrary() {
  const page = byId("page-lessons");
  if (!page) return;
  const summaryItems = getLessonSummaryItems();
  const patterns = getLessonPatternItems();
  const checks = getLessonChecklistItems();
  const archives = getLessonArchiveItems();
  const readiness = getLessonReadinessScore(summaryItems, patterns, checks, archives);
  const selected = [...summaryItems, ...patterns].find((item) => item.id === state.selectedLessonItemId) || summaryItems[0];
  if (selected) state.selectedLessonItemId = selected.id;
  const selectedAction = selected?.action || (selected?.stage === "risk" ? "risk" : selected?.stage ? "stage" : "select");
  const selectedRef = selected?.action ? selected.ref : selected?.stage === "risk" ? selected.ref : selected?.stage || selected?.id;
  const overview = byId("lessonsOverviewPanel");
  const patternPanel = byId("lessonsPatternPanel");
  const checklistPanel = byId("lessonsChecklistPanel");
  const archivePanel = byId("lessonsArchivePanel");

  if (overview) {
    overview.innerHTML = `
      <div class="panel-heading"><span>교훈 라이브러리</span><b>${readiness}%</b></div>
      <strong>${selected?.value || selected?.title || "교훈"} 재사용</strong>
      <p>${selected?.detail || "종결 산출물을 다음 작전 체크로 전환합니다."}</p>
      <div class="lessons-kpi-grid">
        <article><span>패턴</span><b>${patterns.length}</b><em>판단 조건</em></article>
        <article><span>체크</span><b>${checks.filter((item) => item.ready).length}/${checks.length}</b><em>재사용 준비</em></article>
        <article><span>보관</span><b>${archives.filter((item) => item.ready).length}/${archives.length}</b><em>패킷</em></article>
      </div>
      <div class="lessons-selected-card is-${selected?.tone || "primary"}">
        <span>${selected?.label || "선택 교훈"}</span>
        <b>${selected?.title || selected?.value || "재사용 교훈"}</b>
        <p>${selected?.reuse || selected?.detail || "다음 작전 적용 기준을 확인합니다."}</p>
        <button type="button" data-lesson-action="${selectedAction}" data-lesson-ref="${selectedRef}">열기</button>
      </div>
    `;
  }

  if (patternPanel) {
    patternPanel.innerHTML = `
      <div class="panel-heading"><span>판단 패턴</span><b>${patterns.length}개</b></div>
      ${patterns.map((item) => `
        <article class="lessons-pattern-card is-${item.tone} ${item.id === state.selectedLessonItemId ? "is-selected" : ""}">
          <button type="button" data-lesson-action="select" data-lesson-ref="${item.id}" aria-pressed="${item.id === state.selectedLessonItemId ? "true" : "false"}">
            <span>${item.label} · ${item.owner}</span>
            <b>${item.title}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>${item.reuse}</em>
            <button type="button" data-lesson-action="${item.stage === "risk" ? "risk" : "stage"}" data-lesson-ref="${item.stage === "risk" ? item.ref : item.stage}">출처</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (checklistPanel) {
    checklistPanel.innerHTML = `
      <div class="panel-heading"><span>재사용 체크</span><b>${checks.filter((item) => item.ready).length}/${checks.length}</b></div>
      ${checks.map((item, index) => `
        <article class="lessons-check-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${String(index + 1).padStart(2, "0")} · ${item.ready ? "완료" : "확인"}</span>
          <b>${item.title}</b>
          <p>${item.detail}</p>
          <button type="button" data-lesson-action="stage" data-lesson-ref="${item.stage}">${item.label}</button>
        </article>
      `).join("")}
    `;
  }

  if (archivePanel) {
    archivePanel.innerHTML = `
      <div class="panel-heading"><span>교훈 보관</span><b>${archives.filter((item) => item.ready).length}/${archives.length}</b></div>
      ${archives.map((item) => `
        <article class="lessons-archive-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "잠금" : "확인"} · ${item.label}</span>
          <b>${item.file}</b>
          <p>${item.detail}</p>
          <button type="button" data-lesson-action="${item.action}" data-lesson-ref="${item.ref}">${item.action === "download" ? "저장" : "열기"}</button>
        </article>
      `).join("")}
      <div class="lessons-packet-actions">
        <button type="button" data-lesson-action="stage" data-lesson-ref="closeout">종결 보고</button>
        <button type="button" data-lesson-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runLessonAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedLessonItemId = ref || state.selectedLessonItemId;
    renderLessonsLibrary();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getLessonPackage(), "war-ground-lessons-library.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getLessonSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getNextOperationSummaryItems() {
  const patterns = getLessonPatternItems();
  const constraints = getNextOperationConstraintItems();
  const packets = getNextOperationPacketItems();
  const lessonScore = getLessonReadinessScore();
  return [
    {
      id: "nextop-summary-source",
      label: "교훈 원본",
      value: `${patterns.length}개 패턴`,
      detail: `교훈 준비도 ${lessonScore}% 기반`,
      ready: lessonScore >= 60,
      action: "stage",
      ref: "lessons",
      tone: "primary"
    },
    {
      id: "nextop-summary-comms",
      label: "우선 시드",
      value: "통신 예비망",
      detail: "예비망 권한, 수신 확인자, 지휘공백 감시를 접수 템플릿 첫 줄에 배치",
      ready: true,
      action: "select",
      ref: "nextop-seed-comms",
      tone: "danger"
    },
    {
      id: "nextop-summary-constraints",
      label: "초기 제약",
      value: `${constraints.filter((item) => item.ready).length}/${constraints.length}`,
      detail: "다음 작전 첫 검토에서 잠글 조건",
      ready: constraints.filter((item) => item.ready).length >= Math.ceil(constraints.length * 0.7),
      action: "select",
      ref: constraints.find((item) => !item.ready)?.id || constraints[0]?.id,
      tone: "support"
    },
    {
      id: "nextop-summary-packet",
      label: "템플릿 패킷",
      value: `${packets.length}개 파일`,
      detail: "접수 프리필, 위험 감시, 훈련 삽입 자료",
      ready: packets.every((item) => item.ready),
      action: "download",
      ref: "nextop",
      tone: "evidence"
    }
  ];
}

function getNextOperationSeedItems() {
  const commandPattern = getLessonPatternItems().find((item) => item.id === "lesson-pattern-command");
  return [
    {
      id: "nextop-seed-mission",
      label: "임무 시드",
      value: demoData.operationPlan.operation_name,
      detail: `${demoData.operationPlan.mission} / ${demoData.operationPlan.start_time}-${demoData.operationPlan.deadline}`,
      ready: true,
      action: "stage",
      ref: "data",
      tone: "primary"
    },
    {
      id: "nextop-seed-comms",
      label: "통신 시드",
      value: "예비망 권한 먼저 확정",
      detail: commandPattern?.reuse || "통신참모 권한, 대체망, 수신 확인자를 접수 단계에서 묶습니다.",
      ready: Boolean(commandPattern?.ready),
      action: "risk",
      ref: "command_gap",
      tone: "danger"
    },
    {
      id: "nextop-seed-decision",
      label: "결심 시드",
      value: demoData.decision.recommended_coa,
      detail: `${demoData.decision.conditional_coa} 조건을 새 방책 비교표 기본 검토 항목으로 둡니다.`,
      ready: getActiveDecisionConditionIds().size >= getDecisionConditions().length,
      action: "stage",
      ref: "decision",
      tone: "evidence"
    },
    {
      id: "nextop-seed-training",
      label: "훈련 삽입",
      value: `${getRetrainingScheduleItems().length}개 드릴`,
      detail: "AAR 조치와 재훈련 게이트를 새 작전 전 점검 항목으로 불러옵니다.",
      ready: getRetrainingScheduleItems().length >= 3,
      action: "stage",
      ref: "retrain",
      tone: "support"
    }
  ];
}

function getNextOperationConstraintItems() {
  return getLessonChecklistItems().map((item, index) => ({
    id: `nextop-constraint-${item.id.replace(/^lesson-check-/, "")}`,
    label: item.label,
    title: item.title,
    detail: item.detail,
    ready: item.ready,
    stage: item.stage,
    tone: item.tone,
    sourceId: item.id,
    order: index + 1
  }));
}

function getNextOperationPacketItems() {
  const checks = getNextOperationConstraintItems();
  const patterns = getLessonPatternItems();
  return [
    {
      id: "nextop-packet-template",
      label: "기본 템플릿",
      file: "war-ground-next-operation-template.json",
      detail: "임무 시드, 제약, 교훈 연결을 한 번에 저장",
      ready: true,
      action: "download",
      ref: "nextop",
      tone: "primary"
    },
    {
      id: "nextop-packet-intake",
      label: "접수 프리필",
      file: "war-ground-intake-prefill.json",
      detail: `${demoData.operationPlan.documents.length}종 자료 구조와 ${demoData.coas.length}개 방책 비교 틀`,
      ready: true,
      action: "stage",
      ref: "data",
      tone: "support"
    },
    {
      id: "nextop-packet-risk",
      label: "위험 감시",
      file: "war-ground-risk-watchlist.json",
      detail: `${patterns.filter((item) => item.tone === "danger").length}개 고위험 패턴을 초기 감시 대상으로 보관`,
      ready: patterns.some((item) => item.tone === "danger"),
      action: "risk",
      ref: "command_gap",
      tone: "danger"
    },
    {
      id: "nextop-packet-training",
      label: "훈련 삽입",
      file: "war-ground-training-inserts.json",
      detail: `${checks.filter((item) => item.ready).length}/${checks.length}개 제약을 재훈련 확인표와 연결`,
      ready: getRetrainingScheduleItems().length >= 3,
      action: "stage",
      ref: "retrain",
      tone: "evidence"
    }
  ];
}

function getNextOperationReadinessScore(
  summaryItems = getNextOperationSummaryItems(),
  seedItems = getNextOperationSeedItems(),
  constraintItems = getNextOperationConstraintItems(),
  packetItems = getNextOperationPacketItems()
) {
  const summaryScore = Math.round((summaryItems.filter((item) => item.ready).length / Math.max(summaryItems.length, 1)) * 100);
  const seedScore = Math.round((seedItems.filter((item) => item.ready).length / Math.max(seedItems.length, 1)) * 100);
  const constraintScore = Math.round((constraintItems.filter((item) => item.ready).length / Math.max(constraintItems.length, 1)) * 100);
  const packetScore = Math.round((packetItems.filter((item) => item.ready).length / Math.max(packetItems.length, 1)) * 100);
  return clamp(Math.round((summaryScore + seedScore + constraintScore + packetScore) / 4), 38, 99);
}

function getNextOperationPackage() {
  return {
    package_type: "war-ground-next-operation-template",
    generated_at: new Date().toISOString(),
    source_operation: demoData.operationPlan.operation_name,
    readiness_score: getNextOperationReadinessScore(),
    selected_template_item: state.selectedNextOpItemId,
    summary_items: getNextOperationSummaryItems(),
    operation_seed: getNextOperationSeedItems(),
    initial_constraints: getNextOperationConstraintItems(),
    packet_items: getNextOperationPacketItems(),
    source_lessons: {
      readiness_score: getLessonReadinessScore(),
      pattern_count: getLessonPatternItems().length,
      checklist_count: getLessonChecklistItems().length
    }
  };
}

function getNextOperationSummaryText() {
  const packet = getNextOperationPackage();
  return [
    "WAR GROUND 다음 작전 템플릿",
    `원본 작전: ${packet.source_operation}`,
    `접수 준비도: ${packet.readiness_score}%`,
    `작전 시드: ${packet.operation_seed.map((item) => `${item.label}-${item.value}`).join(" / ")}`,
    `초기 제약: ${packet.initial_constraints.map((item) => `${item.label}-${item.ready ? "잠금" : "확인"}`).join(" / ")}`,
    `패킷: ${packet.packet_items.map((item) => item.file).join(" / ")}`
  ].join("\n");
}

function renderNextOperationTemplate() {
  const page = byId("page-nextop");
  if (!page) return;
  const summaryItems = getNextOperationSummaryItems();
  const seedItems = getNextOperationSeedItems();
  const constraints = getNextOperationConstraintItems();
  const packets = getNextOperationPacketItems();
  const readiness = getNextOperationReadinessScore(summaryItems, seedItems, constraints, packets);
  const selected = [...summaryItems, ...seedItems, ...constraints].find((item) => item.id === state.selectedNextOpItemId) || seedItems[1] || summaryItems[0];
  if (selected) state.selectedNextOpItemId = selected.id;
  const selectedAction = selected?.action || (selected?.stage ? "stage" : "select");
  const selectedRef = selected?.action ? selected.ref : selected?.stage || selected?.id;
  const overview = byId("nextopOverviewPanel");
  const seedPanel = byId("nextopSeedPanel");
  const constraintPanel = byId("nextopConstraintPanel");
  const packetPanel = byId("nextopPacketPanel");

  if (overview) {
    overview.innerHTML = `
      <div class="panel-heading"><span>다음 작전 템플릿</span><b>${readiness}%</b></div>
      <strong>${selected?.value || selected?.title || "작전 시드"} 준비</strong>
      <p>${selected?.detail || "교훈을 다음 작전 접수 기준으로 변환합니다."}</p>
      <div class="nextop-kpi-grid">
        <article><span>시드</span><b>${seedItems.filter((item) => item.ready).length}/${seedItems.length}</b><em>접수값</em></article>
        <article><span>제약</span><b>${constraints.filter((item) => item.ready).length}/${constraints.length}</b><em>초기 확인</em></article>
        <article><span>패킷</span><b>${packets.filter((item) => item.ready).length}/${packets.length}</b><em>파일</em></article>
      </div>
      <div class="nextop-selected-card is-${selected?.tone || "primary"}">
        <span>${selected?.label || "선택 시드"}</span>
        <b>${selected?.title || selected?.value || "다음 작전 입력값"}</b>
        <p>${selected?.detail || "다음 작전 접수 전에 확인합니다."}</p>
        <button type="button" data-nextop-action="${selectedAction}" data-nextop-ref="${selectedRef}">열기</button>
      </div>
    `;
  }

  if (seedPanel) {
    seedPanel.innerHTML = `
      <div class="panel-heading"><span>작전 시드</span><b>${seedItems.length}개</b></div>
      ${seedItems.map((item) => `
        <article class="nextop-seed-card is-${item.tone} ${item.id === state.selectedNextOpItemId ? "is-selected" : ""}">
          <button type="button" data-nextop-action="select" data-nextop-ref="${item.id}" aria-pressed="${item.id === state.selectedNextOpItemId ? "true" : "false"}">
            <span>${item.label} · ${item.ready ? "잠금" : "확인"}</span>
            <b>${item.value}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>${item.ready ? "다음 접수에 바로 반영" : "출처 확인 필요"}</em>
            <button type="button" data-nextop-action="${item.action}" data-nextop-ref="${item.ref}">출처</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (constraintPanel) {
    constraintPanel.innerHTML = `
      <div class="panel-heading"><span>초기 제약</span><b>${constraints.filter((item) => item.ready).length}/${constraints.length}</b></div>
      ${constraints.map((item) => `
        <article class="nextop-constraint-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"} ${item.id === state.selectedNextOpItemId ? "is-selected" : ""}">
          <button type="button" data-nextop-action="select" data-nextop-ref="${item.id}" aria-pressed="${item.id === state.selectedNextOpItemId ? "true" : "false"}">
            <span>${String(item.order).padStart(2, "0")} · ${item.ready ? "잠금" : "확인"}</span>
            <b>${item.title}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>${item.label}</em>
            <button type="button" data-nextop-action="stage" data-nextop-ref="${item.stage}">열기</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (packetPanel) {
    packetPanel.innerHTML = `
      <div class="panel-heading"><span>템플릿 패킷</span><b>${packets.filter((item) => item.ready).length}/${packets.length}</b></div>
      ${packets.map((item) => `
        <article class="nextop-packet-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"}">
          <span>${item.ready ? "준비" : "확인"} · ${item.label}</span>
          <b>${item.file}</b>
          <p>${item.detail}</p>
          <button type="button" data-nextop-action="${item.action}" data-nextop-ref="${item.ref}">${item.action === "download" ? "저장" : "열기"}</button>
        </article>
      `).join("")}
      <div class="nextop-packet-actions">
        <button type="button" data-nextop-action="stage" data-nextop-ref="data">접수 화면</button>
        <button type="button" data-nextop-action="copy">요약 복사</button>
        <button type="button" data-nextop-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runNextOperationAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedNextOpItemId = ref || state.selectedNextOpItemId;
    renderNextOperationTemplate();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getNextOperationPackage(), "war-ground-next-operation-template.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getNextOperationSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function getPrefillOverviewItems() {
  const manifests = getPrefillManifestItems();
  const fields = getPrefillFieldItems();
  const gates = getPrefillGateItems();
  return [
    {
      id: "prefill-overview-template",
      label: "템플릿 원본",
      value: `${getNextOperationReadinessScore()}%`,
      detail: "다음 작전 템플릿에서 접수값 회수",
      ready: getNextOperationReadinessScore() >= 60,
      action: "stage",
      ref: "nextop",
      tone: "primary"
    },
    {
      id: "prefill-overview-manifest",
      label: "자료 매니페스트",
      value: `${manifests.filter((item) => item.ready).length}/${manifests.length}`,
      detail: "새 작전 접수 전 준비할 파일",
      ready: manifests.every((item) => item.ready),
      action: "select",
      ref: manifests[0]?.id,
      tone: "evidence"
    },
    {
      id: "prefill-overview-fields",
      label: "접수 필드",
      value: `${fields.filter((item) => item.ready).length}/${fields.length}`,
      detail: "첫 화면에 채울 작전 값",
      ready: fields.filter((item) => item.ready).length >= Math.ceil(fields.length * 0.8),
      action: "select",
      ref: fields[0]?.id,
      tone: "support"
    },
    {
      id: "prefill-overview-gates",
      label: "초기 게이트",
      value: `${gates.filter((item) => item.ready).length}/${gates.length}`,
      detail: "새 결심 산출 전 확인 조건",
      ready: gates.filter((item) => item.ready).length >= Math.ceil(gates.length * 0.75),
      action: "select",
      ref: gates.find((item) => !item.ready)?.id || gates[0]?.id,
      tone: "primary"
    }
  ];
}

function getPrefillManifestItems() {
  return [
    {
      id: "prefill-manifest-template",
      label: "템플릿",
      file: "war-ground-next-operation-template.json",
      detail: "작전 시드, 초기 제약, 패킷 연결",
      ready: getNextOperationReadinessScore() >= 60,
      action: "stage",
      ref: "nextop",
      tone: "primary"
    },
    {
      id: "prefill-manifest-source",
      label: "원천 자료",
      file: "operation_plan_mock.pdf",
      detail: `${demoData.operationPlan.documents.length}종 자료 구조와 ${demoData.operationPlan.constraints.length}개 제약`,
      ready: true,
      action: "stage",
      ref: "data",
      tone: "support"
    },
    {
      id: "prefill-manifest-risk",
      label: "위험 감시",
      file: "war-ground-risk-watchlist.json",
      detail: "지휘공백과 예비망 확인을 접수 전 감시 목록에 포함",
      ready: true,
      action: "risk",
      ref: "command_gap",
      tone: "danger"
    },
    {
      id: "prefill-manifest-training",
      label: "훈련 삽입",
      file: "war-ground-training-inserts.json",
      detail: `${getRetrainingScheduleItems().length}개 재훈련 과제를 새 작전 전 점검으로 첨부`,
      ready: getRetrainingScheduleItems().length >= 3,
      action: "stage",
      ref: "retrain",
      tone: "evidence"
    }
  ];
}

function getPrefillFieldItems() {
  const seedItems = getNextOperationSeedItems();
  return [
    {
      id: "prefill-field-mission",
      label: "임무",
      value: demoData.operationPlan.operation_name,
      detail: "야간 제한시계 기동 · 예비대 전개태세 유지",
      ready: Boolean(seedItems.find((item) => item.id === "nextop-seed-mission")?.ready),
      action: "stage",
      ref: "data",
      tone: "primary"
    },
    {
      id: "prefill-field-time",
      label: "시간",
      value: `${demoData.operationPlan.start_time}-${demoData.operationPlan.deadline}`,
      detail: "지정 집결지까지 기동 후 예비대 전개태세 유지",
      ready: true,
      action: "stage",
      ref: "rehearsal",
      tone: "support"
    },
    {
      id: "prefill-field-comms",
      label: "통신",
      value: "예비망 권한",
      detail: "통신참모 권한, 대체망, 수신 확인자를 같은 입력 행으로 묶음",
      ready: getNextOperationSeedItems().find((item) => item.id === "nextop-seed-comms")?.ready || false,
      action: "risk",
      ref: "command_gap",
      tone: "danger"
    },
    {
      id: "prefill-field-decision",
      label: "방책",
      value: demoData.decision.recommended_coa,
      detail: demoData.decision.conditional_coa,
      ready: getActiveDecisionConditionIds().size >= getDecisionConditions().length,
      action: "stage",
      ref: "decision",
      tone: "evidence"
    },
    {
      id: "prefill-field-evidence",
      label: "근거 책임",
      value: "검증관",
      detail: "약한 근거와 추정 근거를 접수 단계에서 책임자 필드로 분리",
      ready: getCloseoutAuditSummary().verifiedPercent >= 70,
      action: "stage",
      ref: "audit",
      tone: "support"
    }
  ];
}

function getPrefillGateItems() {
  const fields = getPrefillFieldItems();
  return [
    {
      id: "prefill-gate-no-decision",
      label: "산출 잠금",
      title: "자료 접수 전 결심 산출 잠금",
      detail: "프리필은 입력값만 채우고 새 방책 추천은 자료 확인 뒤에 실행",
      ready: true,
      stage: "data",
      tone: "primary"
    },
    {
      id: "prefill-gate-comms",
      label: "통신",
      title: "예비망 권한과 수신 확인자 필수",
      detail: fields.find((item) => item.id === "prefill-field-comms")?.detail || "통신 필드 확인",
      ready: fields.find((item) => item.id === "prefill-field-comms")?.ready || false,
      stage: "risk",
      ref: "command_gap",
      tone: "danger"
    },
    {
      id: "prefill-gate-evidence",
      label: "근거",
      title: "약한 근거 책임자 분리",
      detail: `근거 사용률 ${getCloseoutAuditSummary().verifiedPercent}% 기준`,
      ready: getCloseoutAuditSummary().verifiedPercent >= 70,
      stage: "audit",
      tone: "evidence"
    },
    {
      id: "prefill-gate-training",
      label: "훈련",
      title: "재훈련 삽입 항목 첨부",
      detail: `${getRetrainingScheduleItems().length}개 드릴을 새 작전 사전 점검으로 연결`,
      ready: getRetrainingScheduleItems().length >= 3,
      stage: "retrain",
      tone: "support"
    },
    {
      id: "prefill-gate-return",
      label: "접수",
      title: "자료 화면에서 새 접수 루프 시작",
      detail: "프리필 패킷 저장 후 자료 투입 화면으로 돌아가 새 작전 접수를 시작",
      ready: true,
      stage: "data",
      tone: "primary"
    }
  ];
}

function getPrefillReadinessScore(
  overviewItems = getPrefillOverviewItems(),
  manifestItems = getPrefillManifestItems(),
  fieldItems = getPrefillFieldItems(),
  gateItems = getPrefillGateItems()
) {
  const overviewScore = Math.round((overviewItems.filter((item) => item.ready).length / Math.max(overviewItems.length, 1)) * 100);
  const manifestScore = Math.round((manifestItems.filter((item) => item.ready).length / Math.max(manifestItems.length, 1)) * 100);
  const fieldScore = Math.round((fieldItems.filter((item) => item.ready).length / Math.max(fieldItems.length, 1)) * 100);
  const gateScore = Math.round((gateItems.filter((item) => item.ready).length / Math.max(gateItems.length, 1)) * 100);
  return clamp(Math.round((overviewScore + manifestScore + fieldScore + gateScore) / 4), 40, 99);
}

function getPrefillPackage() {
  return {
    package_type: "war-ground-intake-prefill",
    generated_at: new Date().toISOString(),
    source_operation: demoData.operationPlan.operation_name,
    readiness_score: getPrefillReadinessScore(),
    selected_prefill_item: state.selectedPrefillItemId,
    overview_items: getPrefillOverviewItems(),
    manifest_items: getPrefillManifestItems(),
    intake_fields: getPrefillFieldItems(),
    intake_gates: getPrefillGateItems(),
    source_template: getNextOperationPackage()
  };
}

function getPrefillSummaryText() {
  const packet = getPrefillPackage();
  return [
    "WAR GROUND 초기 접수 프리필",
    `원본 작전: ${packet.source_operation}`,
    `프리필 준비도: ${packet.readiness_score}%`,
    `자료: ${packet.manifest_items.map((item) => item.file).join(" / ")}`,
    `접수 필드: ${packet.intake_fields.map((item) => `${item.label}-${item.ready ? "잠금" : "확인"}`).join(" / ")}`,
    `게이트: ${packet.intake_gates.map((item) => `${item.label}-${item.ready ? "통과" : "확인"}`).join(" / ")}`
  ].join("\n");
}

function renderIntakePrefill() {
  const page = byId("page-prefill");
  if (!page) return;
  const overviewItems = getPrefillOverviewItems();
  const manifests = getPrefillManifestItems();
  const fields = getPrefillFieldItems();
  const gates = getPrefillGateItems();
  const readiness = getPrefillReadinessScore(overviewItems, manifests, fields, gates);
  const selected = [...overviewItems, ...manifests, ...fields, ...gates].find((item) => item.id === state.selectedPrefillItemId) || fields[0] || overviewItems[0];
  if (selected) state.selectedPrefillItemId = selected.id;
  const selectedAction = selected?.action || (selected?.stage ? "stage" : "select");
  const selectedRef = selected?.action ? selected.ref : selected?.stage || selected?.id;
  const overview = byId("prefillOverviewPanel");
  const manifestPanel = byId("prefillManifestPanel");
  const fieldPanel = byId("prefillFieldPanel");
  const gatePanel = byId("prefillGatePanel");

  if (overview) {
    overview.innerHTML = `
      <div class="panel-heading"><span>초기 접수 프리필</span><b>${readiness}%</b></div>
      <strong>${selected?.value || selected?.title || "접수 필드"} 잠금</strong>
      <p>${selected?.detail || "다음 작전 템플릿을 새 접수값으로 변환합니다."}</p>
      <div class="prefill-kpi-grid">
        <article><span>자료</span><b>${manifests.filter((item) => item.ready).length}/${manifests.length}</b><em>매니페스트</em></article>
        <article><span>필드</span><b>${fields.filter((item) => item.ready).length}/${fields.length}</b><em>사전 입력</em></article>
        <article><span>게이트</span><b>${gates.filter((item) => item.ready).length}/${gates.length}</b><em>초기 확인</em></article>
      </div>
      <div class="prefill-selected-card is-${selected?.tone || "primary"}">
        <span>${selected?.label || "선택 프리필"}</span>
        <b>${selected?.title || selected?.value || "초기 접수값"}</b>
        <p>${selected?.detail || "새 접수 전에 확인합니다."}</p>
        <button type="button" data-prefill-action="${selectedAction}" data-prefill-ref="${selectedRef}">열기</button>
      </div>
    `;
  }

  if (manifestPanel) {
    manifestPanel.innerHTML = `
      <div class="panel-heading"><span>자료 매니페스트</span><b>${manifests.length}개</b></div>
      ${manifests.map((item) => `
        <article class="prefill-manifest-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"} ${item.id === state.selectedPrefillItemId ? "is-selected" : ""}">
          <button type="button" data-prefill-action="select" data-prefill-ref="${item.id}" aria-pressed="${item.id === state.selectedPrefillItemId ? "true" : "false"}">
            <span>${item.ready ? "준비" : "확인"} · ${item.label}</span>
            <b>${item.file}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>새 접수 첨부</em>
            <button type="button" data-prefill-action="${item.action}" data-prefill-ref="${item.ref}">${item.action === "download" ? "저장" : "열기"}</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (fieldPanel) {
    fieldPanel.innerHTML = `
      <div class="panel-heading"><span>접수 필드</span><b>${fields.filter((item) => item.ready).length}/${fields.length}</b></div>
      ${fields.map((item) => `
        <article class="prefill-field-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"} ${item.id === state.selectedPrefillItemId ? "is-selected" : ""}">
          <button type="button" data-prefill-action="select" data-prefill-ref="${item.id}" aria-pressed="${item.id === state.selectedPrefillItemId ? "true" : "false"}">
            <span>${item.label} · ${item.ready ? "잠금" : "확인"}</span>
            <b>${item.value}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>프리필 입력값</em>
            <button type="button" data-prefill-action="${item.action}" data-prefill-ref="${item.ref}">출처</button>
          </footer>
        </article>
      `).join("")}
    `;
  }

  if (gatePanel) {
    gatePanel.innerHTML = `
      <div class="panel-heading"><span>접수 게이트</span><b>${gates.filter((item) => item.ready).length}/${gates.length}</b></div>
      ${gates.map((item, index) => `
        <article class="prefill-gate-card is-${item.tone} ${item.ready ? "is-ready" : "is-open"} ${item.id === state.selectedPrefillItemId ? "is-selected" : ""}">
          <button type="button" data-prefill-action="select" data-prefill-ref="${item.id}" aria-pressed="${item.id === state.selectedPrefillItemId ? "true" : "false"}">
            <span>${String(index + 1).padStart(2, "0")} · ${item.ready ? "통과" : "확인"}</span>
            <b>${item.title}</b>
            <p>${item.detail}</p>
          </button>
          <footer>
            <em>${item.label}</em>
            <button type="button" data-prefill-action="${item.stage === "risk" ? "risk" : "stage"}" data-prefill-ref="${item.ref || item.stage}">열기</button>
          </footer>
        </article>
      `).join("")}
      <div class="prefill-packet-actions">
        <button type="button" data-prefill-action="stage" data-prefill-ref="data">자료 접수</button>
        <button type="button" data-prefill-action="copy">요약 복사</button>
        <button type="button" data-prefill-action="download">JSON 저장</button>
      </div>
    `;
  }
  refreshIcons();
}

function runPrefillAction(action, ref, trigger) {
  if (action === "select") {
    state.selectedPrefillItemId = ref || state.selectedPrefillItemId;
    renderIntakePrefill();
    return;
  }
  if (action === "stage" && stageMeta[ref]) {
    setStage(ref);
    return;
  }
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref || state.selectedFailureId);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref || state.selectedEvidenceId);
    return;
  }
  if (action === "download") {
    downloadJson(getPrefillPackage(), "war-ground-intake-prefill.json");
    return;
  }
  if (action === "copy") {
    copyTextToClipboard(getPrefillSummaryText()).then((ok) => {
      if (!trigger) return;
      const original = trigger.textContent;
      trigger.textContent = ok ? "복사 완료" : "복사 실패";
      window.setTimeout(() => {
        trigger.textContent = original || "요약 복사";
      }, 1200);
    });
  }
}

function openBriefingSheet() {
  const drawer = byId("briefingSheetDrawer");
  if (!drawer) return;
  drawer.classList.add("briefing-sheet-drawer");
  renderBriefingSheet();
  drawer.hidden = false;
  refreshIcons();
}

function closeBriefingSheet() {
  const drawer = byId("briefingSheetDrawer");
  if (drawer) drawer.hidden = true;
}

async function copyTextToClipboard(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  }
}

async function copyBriefingLink() {
  syncRouteState();
  await copyTextToClipboard(window.location.href);
  byId("copyBriefingLink").innerHTML = `<i data-lucide="check" aria-hidden="true"></i>링크 복사됨`;
  window.setTimeout(() => {
    byId("copyBriefingLink").innerHTML = `<i data-lucide="link" aria-hidden="true"></i>현재 링크 복사`;
    refreshIcons();
  }, 1200);
  refreshIcons();
}

async function copyBriefingText() {
  await copyTextToClipboard(getBriefingText());
  byId("copyBriefingText").innerHTML = `<i data-lucide="check" aria-hidden="true"></i>본문 복사됨`;
  window.setTimeout(() => {
    byId("copyBriefingText").innerHTML = `<i data-lucide="copy" aria-hidden="true"></i>브리핑 본문 복사`;
    refreshIcons();
  }, 1200);
  refreshIcons();
}

function getIntakeQualityReport() {
  const plan = demoData.operationPlan;
  const fieldGaps = plan.extracted_fields.filter((field) => /부족|누락|미명시/.test(field.value));
  const weakEvidence = demoData.evidence.filter((item) => item.status !== "근거 있음");
  const score = state.scenarioLoaded
    ? clamp(100 - fieldGaps.length * 11 - weakEvidence.length * 4, 42, 96)
    : 38;
  const status = state.scenarioLoaded
    ? fieldGaps.length || weakEvidence.length ? "보완 필요" : "결심 가능"
    : "접수 대기";
  const items = [
    {
      id: "document-package",
      icon: "files",
      tone: state.scenarioLoaded ? "ready" : "wait",
      label: "자료 패키지",
      value: state.scenarioLoaded ? `${plan.documents.length}/6` : "대기",
      detail: state.scenarioLoaded ? "작전계획, 방책, 군수, 통신, 기상, SOP 연결" : "작전계획 접수 후 품질 점수를 계산합니다."
    },
    {
      id: "criteria-gap",
      icon: "circle-alert",
      tone: "gap",
      label: "재판단 기준",
      value: fieldGaps.length ? "보완 필요" : "확인",
      detail: "SOP 기준은 있으나 현재 시간표와 승인권자 연결이 약합니다.",
      evidenceId: "ev_sop_criteria"
    },
    {
      id: "estimated-evidence",
      icon: "scan-search",
      tone: weakEvidence.length ? "check" : "ready",
      label: "추정 근거",
      value: `${weakEvidence.length}건`,
      detail: "레드팀 지연행동, 후송로 검토 등 추정 근거를 결심 전 확인합니다.",
      evidenceId: "ev_redteam_delay"
    },
    {
      id: "risk-handoff",
      icon: "triangle-alert",
      tone: "support",
      label: "실패경로 인계",
      value: "지휘공백",
      detail: "접수 품질 이슈를 우선 실패경로 검토로 넘깁니다.",
      stage: "risk",
      failureId: "command_gap"
    }
  ];
  return { score, status, fieldGaps, weakEvidence, items };
}

function renderIntakeQualityPanel() {
  const target = byId("intakeQualityPanel");
  if (!target) return;
  const report = getIntakeQualityReport();
  target.innerHTML = `
    <div class="intake-quality-summary ${report.score >= 80 ? "is-ready" : "is-gap"}">
      <div>
        <span>자료 품질</span>
        <strong>${report.score}</strong>
        <em>${report.status}</em>
      </div>
      <i aria-label="자료 품질 ${report.score}%"><span style="width: ${report.score}%"></span></i>
    </div>
    <div class="intake-quality-actions">
      ${report.items
        .map(
          (item) => `
            <button class="intake-quality-button is-${item.tone}" type="button" data-intake-quality-action="${item.id}">
              <i data-lucide="${item.icon}" aria-hidden="true"></i>
              <span>${item.label}</span>
              <b>${item.value}</b>
              <em>${item.detail}</em>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function runIntakeQualityAction(actionId) {
  const item = getIntakeQualityReport().items.find((entry) => entry.id === actionId);
  if (!item) return;
  if (item.evidenceId) {
    selectEvidence(item.evidenceId);
    return;
  }
  if (item.stage === "risk") {
    setStage("risk");
    selectFailurePath(item.failureId || state.selectedFailureId);
  }
}

function renderIntakeEmptyState() {
  const target = byId("intakeEmptyState");
  if (!target) return;
  target.hidden = state.scenarioLoaded;
  target.innerHTML = state.scenarioLoaded
    ? ""
    : `
      <div class="intake-empty-copy">
        <span>NO INPUT PACKAGE</span>
        <h3>아직 접수된 작전 자료가 없습니다.</h3>
        <p>자료 화면의 접수 버튼을 실행하면 입력 자료, 작전 성격, 방책 비교, 근거 품질이 생성됩니다.</p>
      </div>
      <div class="intake-empty-drop" aria-hidden="true">
        <i data-lucide="file-plus-2"></i>
        <b>작전 자료 대기</b>
        <em>PDF / XLSX / PNG / JSON / TXT</em>
      </div>
    `;
}

function getInputDocumentManifest() {
  const roleByType = {
    작전계획: "임무와 제한시간",
    방책: "A/B/C 후보 비교",
    군수: "보급·정비 지속성",
    통신: "음영구간·중계 후보",
    기상: "시정·속도 보정",
    SOP: "재판단·전환 기준"
  };
  const extensionByName = (name) => name.split(".").pop().toUpperCase();
  return demoData.operationPlan.documents.map((doc, index) => ({
    ...doc,
    extension: extensionByName(doc.name),
    role: roleByType[doc.type] || "작전 보조 자료",
    signalCount: index === 0 ? 3 : index < 4 ? 2 : 1,
    status: state.scenarioLoaded ? "접수 완료" : "미접수"
  }));
}

function renderInputDocumentManifest() {
  const target = byId("inputManifestPanel");
  if (!target) return;
  if (!state.scenarioLoaded) {
    target.innerHTML = "";
    return;
  }
  const manifest = getInputDocumentManifest();
  target.innerHTML = `
    <header>
      <span>입력 자료 확인</span>
      <b>${manifest.length}종 접수</b>
    </header>
    <div class="input-doc-grid">
      ${manifest
        .map(
          (doc) => `
            <article class="input-doc-card" data-input-doc-id="${doc.id}">
              <span>${doc.type}</span>
              <b>${doc.name}</b>
              <em>${doc.extension} / ${doc.role}</em>
              <i>${doc.signalCount}개 신호</i>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function getOperationIdentity() {
  const plan = demoData.operationPlan;
  return {
    scale: "대대급",
    period: "야간",
    type: "기동훈련",
    title: plan.operation_name,
    objective: "제한 시간 내 지정 집결지 도착",
    posture: "예비대 전개태세 유지",
    area: "산악 협곡형 훈련장",
    window: `${plan.start_time}-${plan.deadline}`,
    primaryFriction: "통신 음영 + 보급 지속성"
  };
}

function renderOperationIdentityPanel() {
  const target = byId("operationIdentityPanel");
  if (!target) return;
  if (!state.scenarioLoaded) {
    target.innerHTML = "";
    return;
  }
  const identity = getOperationIdentity();
  target.innerHTML = `
    <section class="operation-identity-map">
      <div>
        <span>INPUT OPERATION</span>
        <h3>${identity.title}</h3>
        <p>${identity.objective} 후 ${identity.posture}</p>
      </div>
      <strong>${identity.window}</strong>
    </section>
    <div class="operation-identity-chip-row">
      <span class="operation-identity-chip">${identity.scale}</span>
      <span class="operation-identity-chip">${identity.period}</span>
      <span class="operation-identity-chip">${identity.type}</span>
      <span class="operation-identity-chip">${identity.area}</span>
      <span class="operation-identity-chip is-risk">${identity.primaryFriction}</span>
    </div>
  `;
}

function renderScenarioShell() {
  const dataPage = byId("page-data");
  const dataGrid = byId("dataGrid");
  if (dataPage) {
    dataPage.classList.toggle("is-intake-empty", !state.scenarioLoaded);
    dataPage.classList.toggle("is-intake-loaded", state.scenarioLoaded);
    dataPage.setAttribute("data-intake-loaded", String(state.scenarioLoaded));
  }
  if (dataGrid) byId("dataGrid").hidden = !state.scenarioLoaded;
  renderIntakeEmptyState();
  renderInputDocumentManifest();
  renderOperationIdentityPanel();
  const fileStack = byId("fileStack");
  fileStack.hidden = state.scenarioLoaded;
  fileStack.innerHTML = demoData.operationPlan.documents
    .map((doc) => `
      <li class="${state.scenarioLoaded ? "is-ready" : ""}" data-input-doc-id="${doc.id}">
        <span class="file-icon">${doc.type.slice(0, 2)}</span>
        <span><strong>${doc.name}</strong><small>${doc.type} 자료</small></span>
        <b>${state.scenarioLoaded ? "접수" : "대기"}</b>
      </li>
    `)
    .join("");
  byId("pipelineList").innerHTML = [
    ["문서 파싱", "임무, 단계, 제한사항, 재판단 기준 추출", state.scenarioLoaded ? "94%" : "--"],
    ["방책 정규화", "A/B/C안을 동일 스키마로 변환", state.scenarioLoaded ? "91%" : "--"],
    ["근거 연결", "파일 문장과 그래프 노드를 양방향 연결", state.scenarioLoaded ? "88%" : "--"],
    ["에이전트 배정", "분야별 역할에 검토 쟁점 할당", state.scenarioLoaded ? "100%" : "--"]
  ]
    .map(([title, body, score]) => `
      <article>
        <b>${title}</b>
        <span>${body}</span>
        <em>${score}</em>
        <i class="pipeline-meter"><span style="width: ${score === "--" ? 8 : Number.parseInt(score, 10)}%"></span></i>
      </article>
    `)
    .join("");
  byId("readinessList").innerHTML = [
    ["자료 구조 정합", "계획서, 방책, 군수, 통신, 기상 자료가 같은 작전 기준으로 연결됨", true],
    ["브라우저 내 실행", "외부 전송 없이 로컬 런타임에서 근거와 결심카드 산출", true],
    ["핵심 동선", "작전계획 접수부터 결심카드까지 3개 주요 명령으로 이동", state.scenarioLoaded],
    ["필드 자동 채움", "작전계획 접수 시 임무, 시간, 제한사항 자동 반영", state.scenarioLoaded],
    ["승인 문구 고정", "최종 명령 전 지휘관 승인 필요 문구를 유지", true]
  ]
    .map(([title, body, ready]) => `<article class="${ready ? "is-ready" : ""}"><b>${ready ? "OK" : "WAIT"}</b><div><strong>${title}</strong><span>${body}</span></div></article>`)
    .join("");
  if (!state.scenarioLoaded) {
    byId("constraintGrid").innerHTML = ["통신 음영 후보", "보급 대기점 확인", "새벽 안개 확인", "후송로 확인"]
      .map((constraint) => `<span class="is-placeholder">${constraint}</span>`)
      .join("");
    byId("coaTable").innerHTML = demoData.coas
      .map(
        (coa) => `
          <article class="coa-row is-placeholder">
            <div><span>${coa.id}안 후보</span><b>${coa.name}</b></div>
            <div><span>시간</span><b>${coa.travel_time}분</b></div>
            <div><span>통신</span><b class="risk-pill ${coa.comm_risk}">${riskLabel(coa.comm_risk)}</b></div>
            <div><span>군수</span><b class="risk-pill ${coa.logistics_risk}">${riskLabel(coa.logistics_risk)}</b></div>
            <p>작전계획 접수 후 근거 문장과 조건부 시행 기준을 연결합니다.</p>
          </article>
        `
      )
      .join("");
  }
  renderIntakeQualityPanel();
  renderPageBriefings();
  refreshIcons();
}

function renderScenarioData() {
  const plan = demoData.operationPlan;
  setText("operationName", plan.operation_name);
  setText("missionText", plan.mission);
  setText("operationTime", `${plan.start_time} / ${plan.deadline}`);
  setText("missionLabel", plan.operation_name);
  setText("scenarioSourceLabel", plan.source_disclaimer);
  setText("scenarioLoadState", "작전계획 입력 완료");
  setText("pipelineState", "완료");
  setText("coaState", "A/B/C 정규화");
  setText("demoReadinessLabel", "운용 가능");
  setText("mockStatusLabel", "작전 자료 접수");
  byId("constraintGrid").innerHTML = plan.constraints
    .map((constraint) => `<span>${constraint}</span>`)
    .join("");
  byId("coaTable").innerHTML = demoData.coas
    .map(
      (coa) => `
        <article class="coa-row ${coa.id === "B" ? "is-recommended" : ""}">
          <div><span>${coa.id}안 ${coa.id === "B" ? "추천" : "후보"}</span><b>${coa.name}</b></div>
          <div><span>시간</span><b>${coa.travel_time}분</b></div>
          <div><span>통신</span><b class="risk-pill ${coa.comm_risk}">${riskLabel(coa.comm_risk)}</b></div>
          <div><span>군수</span><b class="risk-pill ${coa.logistics_risk}">${riskLabel(coa.logistics_risk)}</b></div>
          <p>${coa.condition}</p>
        </article>
      `
    )
    .join("");
  renderScenarioShell();
  renderPageBriefings();
}

function loadScenario() {
  clearTimer("autoTimer");
  state.scenarioLoaded = true;
  setStage("data");
  setText("scenarioLoadState", "접수 중");
  setText("pipelineState", "처리 중");
  byId("loadScenarioButton").disabled = true;
  window.setTimeout(() => {
    renderScenarioData();
    updateStats();
    byId("generateAgentsButton").disabled = false;
    byId("loadScenarioButton").disabled = false;
    setRehearsalRunButtonDisabled(!state.agentsGenerated);
    updateFlow("scenario");
    setText("alertLabel", "작전계획 접수 완료");
  }, 650);
}

function setRehearsalRunButtonDisabled(disabled) {
  ["runRehearsalButton", "rehearsalRunInlineButton"].forEach((id) => {
    const button = byId(id);
    if (button) button.disabled = Boolean(disabled);
  });
}

function prepareRehearsalPrerequisites() {
  clearTimer("autoTimer");
  if (!state.scenarioLoaded) {
    state.scenarioLoaded = true;
    renderScenarioData();
    updateStats();
    byId("generateAgentsButton").disabled = false;
    byId("loadScenarioButton").disabled = false;
  }
  if (!state.agentsGenerated) {
    state.generatedAgentCount = demoData.agents.length;
    state.agentsGenerated = true;
    demoData.agents.forEach((agent) => {
      agent.status = "준비";
    });
    setText("agentFactoryState", "가상부대 23개 역할 생성 완료");
    setText("agentLayerState", "준비 완료");
    setText("staffState", "합의 완료");
    byId("generateAgentsButton").disabled = false;
    setRehearsalRunButtonDisabled(false);
    renderAgentLayers();
    renderDebate();
    updateAgentProgress();
    updateFlow("agents");
  }
}

function renderAgentLayers() {
  const board = byId("agentLayerBoard");
  if (!board) return;
  renderAgentFilterControls();
  renderAgentFormationSummary();
  const groups = Object.keys(layerLabels).map((layer) => {
    const items = demoData.agents.filter((agent) => agent.layer === layer);
    const visibleItems = items.filter((agent) => matchesAgentFilter(getAgentProfile(agent)));
    const meta = agentLayerMeta[layer];
    const readyCount = visibleItems.filter((agent) => agent.status !== "대기").length;
    return `
      <section class="agent-layer">
        <div class="panel-heading compact-heading">
          <span><i>${meta.code}</i>${layerLabels[layer]}</span>
          <b>${readyCount}/${visibleItems.length}</b>
        </div>
        <p class="agent-layer-brief">${meta.brief}</p>
        <div class="agent-grid">
          ${visibleItems.length
            ? visibleItems
            .map((agent) => {
              const profile = getAgentProfile(agent);
              const dossier = getAgentTacticalDossier(agent, profile);
              const selected = state.selectedAgentId === agent.id;
              const factionClass = getAgentFactionClass(profile);
              const traits = profile.traits
                .slice(0, 2)
                .map((trait) => `<span>${trait}</span>`)
                .join("");
              return `
                <button class="agent-card ${factionClass} ${selected ? "is-selected" : ""} ${agent.status === "생성중" ? "is-running" : ""} ${agent.status === "준비" ? "is-ready" : ""}" type="button" title="${agent.role}" aria-pressed="${selected ? "true" : "false"}" data-agent-id="${agent.id}" data-agent-name="${agent.name}">
                  ${renderAgentPortrait(profile)}
                  <span class="agent-card-copy">
                    <strong>${agent.name}</strong>
                    <span>${profile.unitClass} · ${dossier.lane}</span>
                    <span class="agent-card-traits">${traits}</span>
                  </span>
                  <span class="agent-card-status">
                    <span class="agent-card-rank">${dossier.grade}</span>
                    <em>${agent.status}</em>
                    <small>${formatPercent(agent.confidence)}</small>
                  </span>
                </button>
              `;
            })
            .join("")
            : `<div class="agent-empty-slot">현재 필터에 해당하는 유닛 없음</div>`}
        </div>
      </section>
    `;
  });
  board.innerHTML = groups.join("");
  renderAgentProfile();
  refreshIcons();
}

function renderAgentDossier(agent, profile) {
  const dossier = getAgentTacticalDossier(agent, profile);
  const bestCoaScore = Math.max(...dossier.coaAffinity.map((coa) => coa.score));
  const coaRows = dossier.coaAffinity
    .map(
      (coa) => `
        <div class="${coa.score === bestCoaScore ? "is-peak" : ""}">
          <span>${coa.id}안</span>
          <b>${coa.score}</b>
          <i><span style="width: ${coa.score}%"></span></i>
          <em>${coa.name}</em>
        </div>
      `
    )
    .join("");
  const synergyButtons = dossier.synergies.length
    ? dossier.synergies
      .map((linkedAgent) => {
        const linkedProfile = getAgentProfile(linkedAgent);
        return `
          <button type="button" data-synergy-agent-id="${linkedAgent.id}" class="${getAgentFactionClass(linkedProfile)}">
            <span>${linkedProfile.callsign}</span>
            <b>${linkedAgent.name}</b>
            <em>${linkedProfile.factionLabel}</em>
          </button>
        `;
      })
      .join("")
    : `<span class="agent-synergy-empty">독립 검증 유닛</span>`;
  const riskRows = dossier.risks
    .map(
      (risk) => `
        <div>
          <span>${risk.mode}</span>
          <b>${risk.title}</b>
          <em>${risk.score ? `${risk.score}점` : "감시"}</em>
        </div>
      `
    )
    .join("");
  const outputTiles = [
    { label: "산출물", value: agent.review_output || dossier.primaryAction, detail: "검토 결과" },
    { label: "인계", value: agent.handoff || profile.factionLabel, detail: "다음 확인" }
  ];

  return `
    <div class="agent-dossier-grid">
      <div>
        <span>전술 등급</span>
        <b>${dossier.grade}</b>
        <em>${dossier.lane}</em>
      </div>
      <div>
        <span>주임무</span>
        <b>${dossier.primaryAction}</b>
        <em>${profile.temperament}</em>
      </div>
      <div>
        <span>리허설 접점</span>
        <b>${dossier.eventCount}</b>
        <em>이벤트</em>
      </div>
    </div>
    ${renderInfoTiles("agent-output-list", outputTiles, "검토 산출물")}
    <div class="agent-coa-bars" aria-label="방책 적합도">
      ${coaRows}
    </div>
    <div class="agent-synergy-map" aria-label="연동 유닛">
      ${synergyButtons}
    </div>
    <div class="agent-counter-list" aria-label="위험 대응">
      ${riskRows}
    </div>
  `;
}

function renderAgentProfile() {
  const panel = byId("agentProfilePanel");
  if (!panel) return;
  const agent = getAgentById(state.selectedAgentId) || demoData.agents[0];
  if (!agent) return;

  const profile = getAgentProfile(agent);
  const factionClass = getAgentFactionClass(profile);
  const metricBars = Object.entries(getAgentMetrics(agent, profile))
    .map(
      ([key, value]) => `
        <div>
          <span>${agentMetricLabels[key]}</span>
          <b>${value}</b>
          <i><span style="width: ${value}%"></span></i>
        </div>
      `
    )
    .join("");
  const riskTags = agent.risk_focus.map((risk) => `<span>${risk}</span>`).join("");
  const traitTags = profile.traits.map((trait) => `<span>${trait}</span>`).join("");
  const loadout = profile.loadout.map((item) => `<span>${item}</span>`).join("");

  panel.innerHTML = `
    <div class="panel-heading">
      <span>선택 유닛 프로필</span>
      <b>${profile.factionLabel}</b>
    </div>
    <div class="agent-profile-hero ${factionClass}">
      ${renderAgentPortrait(profile, "agent-portrait-large")}
      <div>
        <span>${profile.layerCode}</span>
        <strong>${agent.name}</strong>
        <em>${profile.unitClass} · ${profile.temperament}</em>
      </div>
    </div>
    <p class="agent-profile-quote">“${profile.quote}”</p>
    <div class="agent-profile-stats">
      <div>
        <span>판단 신뢰도</span>
        <b>${formatPercent(agent.confidence)}</b>
        <i><span style="width: ${Math.round(agent.confidence * 100)}%"></span></i>
      </div>
      <div>
        <span>현재 상태</span>
        <b>${agent.status}</b>
        <i><span style="width: ${agent.status === "대기" ? 16 : agent.status === "생성중" ? 58 : 100}%"></span></i>
      </div>
    </div>
    <div class="agent-attribute-grid" aria-label="유닛 속성">
      ${metricBars}
    </div>
    ${renderAgentDossier(agent, profile)}
    <dl class="agent-profile-spec">
      <div>
        <dt>전술 역할</dt>
        <dd>${profile.specialty}</dd>
      </div>
      <div>
        <dt>검토 산출물</dt>
        <dd>${agent.review_output || agent.role}</dd>
      </div>
      <div>
        <dt>인계 대상</dt>
        <dd>${agent.handoff || profile.factionLabel}</dd>
      </div>
      <div>
        <dt>입력 장비</dt>
        <dd class="agent-tag-list">${loadout}</dd>
      </div>
      <div>
        <dt>특성</dt>
        <dd class="agent-tag-list">${traitTags}</dd>
      </div>
      <div>
        <dt>감시 위험</dt>
        <dd class="agent-tag-list danger-tags">${riskTags}</dd>
      </div>
    </dl>
  `;
}

function selectAgentProfile(agentId) {
  if (!getAgentById(agentId)) return;
  state.selectedAgentId = agentId;
  renderAgentLayers();
  if (window.matchMedia("(max-width: 1180px)").matches) {
    byId("agentProfilePanel")?.scrollIntoView({ block: "center" });
  }
}

function renderDebate() {
  const stream = byId("debateStream");
  if (!stream) return;
  stream.innerHTML = debateEntries
    .map(
      (entry) => `
        <article class="debate-entry">
          <div>
            <b>${entry.agent}</b>
            <em>${entry.stance}</em>
          </div>
          <p>${entry.text}</p>
          <button type="button" class="evidence-link" data-evidence-id="${entry.evidence}">${entry.evidence}</button>
        </article>
      `
    )
    .join("");
}

function renderStaffMatrix() {
  const matrix = byId("staffMatrix");
  if (!matrix) return;
  matrix.innerHTML = staffRows
    .map(
      ([name, body, stateText]) => `
        <article class="staff-row">
          <div>
            <b>${name}</b>
            <span>${body}</span>
          </div>
          <em>${stateText}</em>
        </article>
      `
    )
    .join("");
}

function updateAgentProgress() {
  const total = demoData.agents.length;
  const percent = total ? Math.round((state.generatedAgentCount / total) * 100) : 0;
  setText("agentReadyCount", `${state.generatedAgentCount} / ${total}`);
  setText("agentProgressLabel", `${percent}%`);
  const bar = byId("agentProgressBar");
  if (bar) bar.style.width = `${percent}%`;
  renderPageBriefings();
}

function generateAgents() {
  if (!state.scenarioLoaded) {
    loadScenario();
    return;
  }
  setStage("agents");
  state.generatedAgentCount = 0;
  state.agentsGenerated = false;
  demoData.agents.forEach((agent) => {
    agent.status = "대기";
  });
  setText("agentFactoryState", "구성 중");
  setText("agentLayerState", "역할 매핑");
  setText("staffState", "토론 준비");
  byId("generateAgentsButton").disabled = true;
  setRehearsalRunButtonDisabled(true);
  renderAgentLayers();
  updateAgentProgress();

  let index = 0;
  const tick = () => {
    demoData.agents.forEach((agent) => {
      if (agent.status === "생성중") agent.status = "준비";
    });
    if (index < demoData.agents.length) {
      demoData.agents[index].status = "생성중";
      state.generatedAgentCount = index;
      renderAgentLayers();
      updateAgentProgress();
      index += 1;
      state.autoTimer = window.setTimeout(tick, 45);
      return;
    }
    demoData.agents.forEach((agent) => {
      agent.status = "준비";
    });
    state.generatedAgentCount = demoData.agents.length;
    state.agentsGenerated = true;
    setText("agentFactoryState", "가상부대 23개 역할 생성 완료");
    setText("agentLayerState", "준비 완료");
    setText("staffState", "합의 완료");
    byId("generateAgentsButton").disabled = false;
    setRehearsalRunButtonDisabled(false);
    renderAgentLayers();
    renderDebate();
    updateAgentProgress();
    updateFlow("agents");
  };
  tick();
}

function runStaffCycle() {
  if (!state.agentsGenerated) {
    generateAgents();
    return;
  }
  setStage("agents");
  setText("staffState", "토론중");
  demoData.agents.forEach((agent, index) => {
    agent.status = index < 8 ? "생성중" : "준비";
  });
  renderAgentLayers();
  window.setTimeout(() => {
    demoData.agents.forEach((agent) => {
      agent.status = "준비";
    });
    setText("staffState", "합의 완료");
    renderAgentLayers();
  }, 900);
}

function renderTimeline() {
  const list = byId("timelineEvents");
  if (!list) return;
  list.innerHTML = demoData.events
    .map((event, index) => {
      const preview = getEventConversationPreview(event);
      return `
        <button class="timeline-event ${index === state.rehearsalIndex ? "is-active" : ""} ${index < state.rehearsalIndex ? "is-complete" : ""} ${event.severity}" type="button" data-event-index="${index}">
          <span>${event.time}</span>
          <b>${event.event}</b>
          <em>${event.severity}</em>
          <div class="timeline-chat-preview is-${preview.tone}">
            <span class="timeline-chat-avatars" aria-hidden="true">
              ${preview.avatars.map((avatar) => `<i>${avatar}</i>`).join("")}
            </span>
            <span class="timeline-chat-copy">
              <strong>${preview.lead}</strong>
              <small>${preview.message}</small>
            </span>
            <span class="timeline-chat-count">${preview.count}문장</span>
          </div>
        </button>
      `;
    })
    .join("");
  renderRehearsalScrubber();
}

function getEventConversationPreview(event) {
  const scripts = getRadioScriptForEvent(event);
  const first = scripts[0] || {};
  return {
    count: scripts.length || event?.agents?.length || 0,
    lead: first.callsign || event?.agents?.[0]?.replace(" 에이전트", "") || "에이전트",
    message: first.message || event?.impact || "이벤트 발생 시 관련 에이전트가 순차 보고합니다.",
    tone: first.tone || (event?.severity === "high" ? "red" : event?.severity === "medium" ? "amber" : "blue"),
    avatars: (scripts.length ? scripts : (event?.agents || []).map((agent) => ({ callsign: agent })))
      .slice(0, 3)
      .map((item) => getAgentAvatarLabel(item.callsign || item.agent || "AI"))
  };
}

function getRehearsalProgress() {
  const activeIndex = state.rehearsalIndex >= 0 ? state.rehearsalIndex : -1;
  const activeEvent = activeIndex >= 0 ? demoData.events[activeIndex] : null;
  const totalSteps = Math.max(demoData.events.length - 1, 1);
  const progress = activeIndex < 0 ? 0 : Math.round((activeIndex / totalSteps) * 100);
  const highRiskCount = demoData.events.filter((event) => event.severity === "high").length;
  return {
    activeIndex,
    activeEvent,
    progress,
    highRiskCount,
    label: activeEvent ? `${activeEvent.time} ${activeEvent.event}` : "리허설 대기",
    detail: activeEvent ? activeEvent.impact : "이벤트를 선택하면 3D 포커스와 무전이 함께 이동합니다."
  };
}

function renderRehearsalScrubber() {
  const target = byId("rehearsalScrubber");
  if (!target) return;
  const progress = getRehearsalProgress();
  target.innerHTML = `
    <div class="rehearsal-scrubber-readout">
      <div>
        <span>리허설 스크러버</span>
        <b>${progress.label}</b>
        <em>${progress.detail}</em>
      </div>
      <strong>${progress.progress}%</strong>
    </div>
    <div class="rehearsal-scrubber-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.progress}">
      <span style="width: ${progress.progress}%"></span>
    </div>
    <div class="rehearsal-scrubber-track" role="listbox" aria-label="리허설 이벤트 빠른 이동">
      ${demoData.events.map((event, index) => {
        const active = index === progress.activeIndex;
        const complete = index < progress.activeIndex;
        return `
          <button class="rehearsal-scrubber-step ${event.severity} ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}" type="button" role="option" aria-selected="${active ? "true" : "false"}" data-scrub-event-index="${index}">
            <span>${event.time}</span>
            <b>${event.event}</b>
            <em>${event.linked_risks.length ? event.linked_risks.length : event.severity === "high" ? "!" : "·"}</em>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderTerrainPanels(activeEvent = null) {
  const metricGrid = byId("terrainMetricGrid");
  const briefList = byId("terrainBriefList");
  const commander = terrainRehearsalSummary.commander;
  if (metricGrid) {
    metricGrid.innerHTML = terrainRehearsalSummary.metrics
      .map((metric) => `<article><span>${metric.label}</span><b>${metric.value}</b></article>`)
      .join("");
  }
  if (briefList) {
    briefList.innerHTML = terrainRehearsalSummary.brief
      .map((item) => `<li>${item}</li>`)
      .join("");
  }
  setText("commanderConfidenceLabel", `${Math.round(commander.confidence * 100)}%`);
  setText("commanderRecommendation", commander.recommendation);
  setText("commanderMessage", activeEvent?.id === "b_stabilized" ? commander.message : "리허설 이벤트에 맞춰 지형·통신·군수 판단이 누적됩니다.");
  const overlayList = byId("commanderOverlayList");
  if (overlayList) {
    overlayList.innerHTML = commander.overlays
      .map((overlay) => `<span>${overlay}</span>`)
      .join("");
  }
}

function getRehearsalLinkedFailures(event) {
  return (event?.linked_risks || [])
    .map((failureId) => demoData.failures.find((failure) => failure.id === failureId))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}

function getRehearsalBriefing(event = null) {
  const linkedFailures = getRehearsalLinkedFailures(event);
  const failure = linkedFailures[0] || getFailureById(state.selectedFailureId);
  const profile = failure ? getFailureProfile(failure) : null;
  const evidenceId = event?.evidence_ids?.[0] || failure?.evidence?.[0] || "ev_plan_mission";
  const evidence = evidenceById.get(evidenceId);
  const terrainCueByEvent = {
    start: "기준 경로와 제한사항을 같은 시계로 맞춥니다.",
    fog: "시정 저하가 선두 속도와 후송 여유를 줄입니다.",
    enemy_delay: "협곡·교차로 지연행동이 A안 시간 여유를 갉아먹습니다.",
    comm_gap: "중앙 음영 구간에서 보고 갱신이 끊깁니다.",
    supply_gap: "남측 보급 대기점 처리량이 2단계 이후 병목이 됩니다.",
    criteria_gap: "현장 제대가 전환 기준 부재로 대기합니다.",
    reserve_delay: "예비대 투입 시각 지연이 복합 실패로 번집니다.",
    b_stabilized: "B안 우회축은 통신·군수 접근성이 유지됩니다."
  };
  const decisionCueByEvent = {
    start: demoData.decision.recommended_coa,
    fog: "속도 보정과 대체 후송로 확인",
    enemy_delay: "A안 노출 시 B안 전환 준비",
    comm_gap: "예비망 전환 권한 승인",
    supply_gap: "보급 대기점 추가 승인",
    criteria_gap: "04:20 재판단 기준 고정",
    reserve_delay: "A안 보류와 예비대 투입 기준 확정",
    b_stabilized: demoData.decision.recommended_coa
  };
  return {
    time: event?.time || "--:--",
    title: event?.event || "수행 리허설 대기",
    severity: event?.severity || "low",
    terrainCue: terrainCueByEvent[event?.id] || "지형, 통신, 군수 제약을 같이 보며 판단합니다.",
    failureId: failure?.id || state.selectedFailureId,
    failureTitle: failure?.title || "기준 상황",
    failureScore: failure?.score || "--",
    decisionCue: decisionCueByEvent[event?.id] || profile?.mitigationActions?.[0] || demoData.decision.recommended_coa,
    stopPoint: profile?.decisionPoint || "이벤트 선택 후 표시",
    evidenceId,
    evidenceTitle: evidence?.title || evidenceId,
    action: profile?.mitigationActions?.[0] || event?.impact || "리허설 이벤트를 선택합니다."
  };
}

function renderRehearsalBriefingStrip(event = null) {
  const target = byId("rehearsalBriefingStrip");
  if (!target) return;
  const briefing = getRehearsalBriefing(event);
  target.innerHTML = `
    <header>
      <span>3D 판단 브리핑</span>
      <b>${briefing.time}</b>
    </header>
    <div class="rehearsal-briefing-grid">
      <article>
        <span>지형 관찰</span>
        <b>${briefing.terrainCue}</b>
      </article>
      <article>
        <span>실패경로</span>
        <b>${briefing.failureTitle} · ${briefing.failureScore}</b>
      </article>
      <article>
        <span>결심 연결</span>
        <b>${briefing.decisionCue}</b>
      </article>
    </div>
    <div class="rehearsal-briefing-actions">
      <button type="button" data-rehearsal-action="risk" data-rehearsal-ref="${briefing.failureId}">위험 확인</button>
      <button type="button" data-rehearsal-action="evidence" data-rehearsal-ref="${briefing.evidenceId}">근거 보기</button>
    </div>
  `;
}

function renderRehearsalDecisionBridge(event = null) {
  const target = byId("rehearsalDecisionBridge");
  if (!target) return;
  const briefing = getRehearsalBriefing(event);
  target.innerHTML = `
    <div>
      <span>판단 연결</span>
      <b>${briefing.title}</b>
      <em>${briefing.terrainCue}</em>
    </div>
    <ol>
      <li><span>마찰</span><b>${briefing.failureTitle}</b></li>
      <li><span>차단점</span><b>${briefing.stopPoint}</b></li>
      <li><span>결심</span><b>${briefing.decisionCue}</b></li>
      <li><span>근거</span><button type="button" data-evidence-id="${briefing.evidenceId}">${briefing.evidenceTitle}</button></li>
    </ol>
  `;
}

function getRehearsalSimulationReadout(event) {
  const presets = {
    start: [
      ["진입", "출발선 통과", "대열 정상"],
      ["기동", "계획 속도", "기준 시간표"],
      ["통신", "보고 정상", "주망 유지"],
      ["지속성", "준비 완료", "보급 대기"]
    ],
    fog: [
      ["진입", "진입 지연", "안개·피로도"],
      ["기동", "속도 저하", "평균속도 보정"],
      ["통신", "정상", "보고 유지"],
      ["후송", "시간 증가", "대체로 감시"]
    ],
    enemy_delay: [
      ["진입", "협곡 정체", "대항군 접촉"],
      ["기동", "엄호 필요", "선두 감속"],
      ["위협", "지연행동", "교차로 차단"],
      ["판단", "A안 취약", "우회 검토"]
    ],
    comm_gap: [
      ["진입", "음영 진입", "보고 누락"],
      ["통신", "장애 발생", "예비망 전환"],
      ["지휘", "갱신 지연", "10분 기준"],
      ["현장", "유지 절차", "대체권한 필요"]
    ],
    supply_gap: [
      ["진입", "2단계 대기", "보급 병목"],
      ["군수", "처리량 초과", "대기점 추가"],
      ["정비", "시간 제한", "우선순위 필요"],
      ["지속성", "저하 누적", "B안 유지"]
    ],
    criteria_gap: [
      ["진입", "현장 대기", "승인 미수신"],
      ["SOP", "기준 공백", "전환 조건 필요"],
      ["예비대", "투입 미정", "04:20 기준"],
      ["지휘", "판단 지연", "대체권한 필요"]
    ],
    reserve_delay: [
      ["진입", "전개 지연", "예비대 타이밍 상실"],
      ["지휘", "공백 확대", "복합 실패"],
      ["군수", "지속성 저하", "대기열 누적"],
      ["결심", "A안 보류", "조건부 전환"]
    ],
    b_stabilized: [
      ["진입", "우회축 안정", "보고 유지"],
      ["통신", "갱신 정상", "음영 짧음"],
      ["군수", "접근성 유지", "대기 완화"],
      ["결심", "B안 우선", "합의 완료"]
    ]
  };
  return presets[event?.id] || [
    ["상태", event?.impact || "리허설", riskLabel(event?.severity || "low")],
    ["통신", "감시", "보고 주기 확인"],
    ["기동", "감시", "속도 편차 확인"],
    ["결심", "대기", "근거 누적"]
  ];
}

function getRehearsalIntervention(event) {
  const linkedFailures = (event?.linked_risks || []).map((id) => getFailureById(id)).filter(Boolean);
  const failure = linkedFailures.sort((a, b) => b.score - a.score)[0];
  const profile = failure ? getFailureProfile(failure) : null;
  return {
    event,
    failure,
    profile,
    title: failure ? failure.title : "기준 이벤트 유지",
    label: failure ? "차단 권고" : "관찰",
    timeWindow: profile?.decisionPoint || event?.time || "대기",
    action: profile?.mitigationActions?.[0] || event?.impact || "리허설 이벤트를 계속 관찰합니다.",
    evidenceId: event?.evidence_ids?.[0] || failure?.evidence?.[0] || "ev_plan_mission",
    severity: event?.severity || "low"
  };
}

function renderRehearsalIntervention(event) {
  const intervention = getRehearsalIntervention(event);
  return `
    <div class="rehearsal-intervention-card is-${intervention.severity}">
      <header>
        <span>${intervention.label}</span>
        <b>${intervention.title}</b>
      </header>
      <strong>${intervention.timeWindow}</strong>
      <p>${intervention.action}</p>
      <div class="rehearsal-intervention-actions">
        ${
          intervention.failure
            ? `<button type="button" data-rehearsal-action="risk" data-rehearsal-ref="${intervention.failure.id}">실패경로 보기</button>`
            : ""
        }
        <button type="button" data-rehearsal-action="evidence" data-rehearsal-ref="${intervention.evidenceId}">근거 추적</button>
      </div>
    </div>
  `;
}

function openFailurePathFromRehearsal(ref, eventId) {
  setStage("risk");
  selectFailurePath(ref, { sourceEventId: eventId || null });
}

function runRehearsalInterventionAction(action, ref) {
  if (action === "risk") {
    const activeEvent = demoData.events[state.rehearsalIndex] || null;
    openFailurePathFromRehearsal(ref, activeEvent?.id);
    return;
  }
  if (action === "evidence") {
    selectEvidence(ref);
  }
}

function getRadioScriptForEvent(event) {
  const scripted = rehearsalRadioScripts[event?.id] || [];
  if (scripted.length) return scripted;
  return (event?.agents || []).slice(0, 3).map((agentName, index) => ({
    agentId: "",
    callsign: agentName.replace(" 에이전트", ""),
    tone: event?.severity === "high" ? "red" : event?.severity === "medium" ? "amber" : "blue",
    channel: index === 0 ? "현장" : "참모",
    message: `${event?.event || "리허설 이벤트"} 확인. 관련 허점과 조치 조건을 검토 중.`,
    finding: event?.impact || "상황 갱신",
    evidence: event?.evidence_ids?.[0] || "ev_plan_mission"
  }));
}

function getAgentAvatarLabel(value = "AI") {
  const compact = String(value)
    .replace(/에이전트/g, "")
    .replace(/참모/g, "")
    .replace(/[^가-힣A-Za-z0-9]/g, "")
    .trim();
  return compact.slice(0, 2) || "AI";
}

function getRadioToneForEvent(event) {
  if (event?.severity === "high") return "red";
  if (event?.severity === "medium") return "amber";
  return "blue";
}

function getAgentConversationTabs() {
  const counts = {
    live: state.radioLog.length,
    alerts: state.radioLog.filter((item) => item.tone === "red" || item.tone === "amber").length,
    evidence: state.radioLog.filter((item) => item.evidence).length
  };
  return [
    { id: "live", label: "전체", detail: "실시간", count: counts.live },
    { id: "alerts", label: "경보", detail: "위험 발언", count: counts.alerts },
    { id: "evidence", label: "근거", detail: "증거 연결", count: counts.evidence }
  ];
}

function renderAgentConversationTabs() {
  const target = byId("agentConversationTabs");
  if (!target) return;
  target.innerHTML = getAgentConversationTabs()
    .map((tab) => {
      const selected = state.agentConversationTab === tab.id;
      return `
        <button class="agent-conversation-tab ${selected ? "is-active" : ""}" type="button" role="tab" aria-selected="${selected ? "true" : "false"}" data-agent-conversation-tab="${tab.id}">
          <span>${tab.detail}</span>
          <b>${tab.label}</b>
          <em>${tab.count}</em>
        </button>
      `;
    })
    .join("");
}

function getFilteredRadioLog() {
  if (state.agentConversationTab === "alerts") {
    return state.radioLog.filter((item) => item.tone === "red" || item.tone === "amber");
  }
  if (state.agentConversationTab === "evidence") {
    return state.radioLog.filter((item) => item.evidence);
  }
  return state.radioLog;
}

function renderAgentTypingIndicator(event = null) {
  const target = byId("agentTypingIndicator");
  if (!target) return;
  if (!event) {
    target.className = "agent-typing-indicator";
    target.innerHTML = `
      <span class="typing-agent-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <b>커뮤니티 대기</b>
      <em>수행 리허설을 실행하면 에이전트 대화가 시간순으로 올라옵니다.</em>
    `;
    return;
  }
  const scripts = getRadioScriptForEvent(event);
  const names = scripts.slice(0, 2).map((item) => item.callsign).join(", ");
  target.className = `agent-typing-indicator is-${getRadioToneForEvent(event)}`;
  target.innerHTML = `
    <span class="typing-agent-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <b>${event.time} ${event.event}</b>
    <em>${names || "관련 에이전트"} 입력 중</em>
  `;
}

function renderActiveAgentChips(event = null) {
  const target = byId("activeAgentChips");
  if (!target) return;
  if (!event) {
    target.innerHTML = "";
    return;
  }
  const scripts = getRadioScriptForEvent(event);
  target.innerHTML = event.agents
    .map((agentName, index) => {
      const transmission = scripts[index] || {};
      const tone = transmission.tone || getRadioToneForEvent(event);
      const label = agentName.replace(" 에이전트", "");
      return `
        <span class="active-agent-chip is-${tone}">
          <i aria-hidden="true">${getAgentAvatarLabel(transmission.callsign || label)}</i>
          <b>${label}</b>
          <em>${transmission.channel || "대기"}</em>
        </span>
      `;
    })
    .join("");
}

function renderAgentRadioLog() {
  const target = byId("agentRadioLog");
  if (!target) return;
  renderAgentConversationTabs();
  setText("agentConversationCount", state.radioLog.length ? `${state.radioLog.length}문장` : "대기");
  if (!state.radioLog.length) {
    target.innerHTML = `
      <div class="agent-radio-empty">
        <span>커뮤니티 대기</span>
        <b>리허설 이벤트가 진행되면 에이전트 대화가 채팅처럼 기록됩니다.</b>
      </div>
    `;
    return;
  }
  const filteredLog = getFilteredRadioLog();
  if (!filteredLog.length) {
    target.innerHTML = `
      <div class="agent-radio-empty">
        <span>채널 비어 있음</span>
        <b>현재 필터에 해당하는 에이전트 발언이 아직 없습니다.</b>
      </div>
    `;
    return;
  }
  target.innerHTML = filteredLog
    .slice(0, 10)
    .map((item, index) => `
      <button type="button" class="agent-radio-log-row is-${item.tone}" style="--chat-index: ${index}" data-radio-evidence-id="${item.evidence}" data-evidence-id="${item.evidence}">
        <span class="agent-chat-avatar" aria-hidden="true">${getAgentAvatarLabel(item.callsign)}</span>
        <span class="agent-chat-bubble">
          <span class="agent-chat-meta">
            <strong>${item.callsign}</strong>
            <em>${item.time} · ${item.channel}</em>
            <i>${item.finding}</i>
          </span>
          <b>${item.message}</b>
        </span>
      </button>
    `)
    .join("");
}

function queueRadioTransmission(transmission, event, index = 0) {
  const delay = Math.round((index * 360) / Math.max(0.5, state.rehearsalSpeed));
  const timer = window.setTimeout(() => {
    const overlay = byId("agentRadioOverlay");
    const item = {
      id: `radio-${state.radioSerial += 1}`,
      eventId: event.id,
      agentId: transmission.agentId || "",
      time: event.time,
      tone: transmission.tone || getRadioToneForEvent(event),
      channel: transmission.channel || "무전",
      callsign: transmission.callsign || "에이전트",
      message: transmission.message,
      finding: transmission.finding || event.impact,
      evidence: transmission.evidence || event.evidence_ids?.[0] || "ev_plan_mission"
    };
    state.radioLog.unshift(item);
    state.radioLog = state.radioLog.slice(0, 18);
    renderAgentRadioLog();
    if (!overlay) return;
    const toast = document.createElement("button");
    toast.type = "button";
    toast.className = `agent-radio-toast is-${item.tone}`;
    toast.dataset.radioEvidenceId = item.evidence;
    toast.dataset.evidenceId = item.evidence;
    toast.innerHTML = `
      <span>${item.time} · ${item.channel}</span>
      <strong>${item.callsign}</strong>
      <b>${item.finding}</b>
      <em>${item.message}</em>
    `;
    overlay.prepend(toast);
    [...overlay.children].slice(3).forEach((node) => node.remove());
    window.setTimeout(() => toast.remove(), 4200);
  }, delay);
  state.radioTimers.push(timer);
}

function clearRadioTraffic(options = {}) {
  state.radioTimers.forEach((timer) => window.clearTimeout(timer));
  state.radioTimers = [];
  byId("agentRadioOverlay")?.replaceChildren();
  if (!options.preserveLog) state.radioLog = [];
  renderAgentRadioLog();
}

function triggerRadioTrafficForEvent(event) {
  clearRadioTraffic({ preserveLog: true });
  getRadioScriptForEvent(event).forEach((transmission, index) => {
    queueRadioTransmission(transmission, event, index);
  });
}

function update3dRehearsal(event) {
  if (window.WarGround3D?.focusEvent) {
    window.WarGround3D.focusEvent(event.id);
  }
  if (window.WarGround3D?.setPlayback) {
    window.WarGround3D.setPlayback(!state.rehearsalPaused);
  }
  renderTerrainPanels(event);
}

function showEvent(index) {
  state.rehearsalIndex = clamp(index, 0, demoData.events.length - 1);
  resetRehearsalEventClock();
  const event = demoData.events[state.rehearsalIndex];
  window.__warGroundCurrentEventId = event.id;
  document.body.dataset.rehearsalEventId = event.id;
  const simReadout = getRehearsalSimulationReadout(event)
    .map(([label, value, detail]) => `
      <article>
        <span>${label}</span>
        <b>${value}</b>
        <em>${detail}</em>
      </article>
    `)
    .join("");
  renderTimeline();
  setText("timelineState", `${event.time} 재생`);
  setText("rehearsalRiskLabel", event.linked_risks.length ? event.linked_risks.join(", ") : "기준 이벤트");
  setText("activeAgentCount", `${event.agents.length}명`);
  const interventionMarkup = renderRehearsalIntervention(event);
  const interventionOverlay = byId("rehearsalInterventionOverlay");
  if (interventionOverlay) interventionOverlay.innerHTML = interventionMarkup;
  byId("currentEventCard").innerHTML = `
    <span>${event.time}</span>
    <strong>${event.event}</strong>
    <p>${event.detail}</p>
    <div class="rehearsal-friction-banner is-${event.severity}">
      <span>${riskLabel(event.severity)}</span>
      <b>${event.impact}</b>
      <em>${event.linked_risks.length ? event.linked_risks.join(" · ") : "기준 상황"}</em>
    </div>
    ${interventionMarkup}
    <div class="rehearsal-sim-readout" aria-label="리허설 시뮬레이션 상태">
      ${simReadout}
    </div>
    <div class="event-meta">
      <b>${event.impact}</b>
      ${event.evidence_ids.map((id) => `<button type="button" class="evidence-link" data-evidence-id="${id}">${id}</button>`).join("")}
    </div>
  `;
  renderActiveAgentChips(event);
  renderAgentTypingIndicator(event);
  renderRehearsalBriefingStrip(event);
  renderRehearsalDecisionBridge(event);
  update3dRehearsal(event);
  triggerRadioTrafficForEvent(event);
  renderPageBriefings();
  const pulse = byId("rehearsalPulse");
  if (pulse) {
    pulse.className = `map-pulse ${event.severity}`;
    pulse.style.left = `${18 + state.rehearsalIndex * 9}%`;
  }
  syncRouteState();
}

function scheduleNextEvent() {
  clearTimer("rehearsalTimer");
  if (state.rehearsalPaused) return;
  if (state.rehearsalIndex >= demoData.events.length - 1) {
    setText("timelineState", "리허설 완료");
    updateFlow("failure");
    setStage("risk");
    return;
  }
  state.rehearsalTimer = window.setTimeout(() => {
    showEvent(state.rehearsalIndex + 1);
    scheduleNextEvent();
  }, getRehearsalEventDelay());
}

function runRehearsal() {
  if (!state.agentsGenerated) {
    prepareRehearsalPrerequisites();
  }
  setStage("rehearsal");
  state.rehearsalStarted = true;
  state.rehearsalPaused = false;
  state.rehearsalIndex = 0;
  resetRehearsalEventClock();
  setText("rehearsalPauseButton", "일시정지");
  clearRadioTraffic();
  window.WarGround3D?.start?.();
  showEvent(0);
  updateFlow("rehearsal");
  scheduleNextEvent();
}

function restartRehearsalFromStart() {
  prepareRehearsalPrerequisites();
  clearTimer("rehearsalTimer");
  state.rehearsalStarted = true;
  state.rehearsalPaused = false;
  state.rehearsalIndex = -1;
  resetRehearsalEventClock();
  setStage("rehearsal", { skipTransition: true });
  setText("rehearsalPauseButton", "일시정지");
  clearRadioTraffic();
  window.WarGround3D?.focusEvent?.("start");
  window.WarGround3D?.setPlayback?.(false);
  window.WarGround3D?.start?.();
  showEvent(0);
  updateFlow("rehearsal");
  scheduleNextEvent();
}

function resetRehearsal() {
  clearTimer("rehearsalTimer");
  state.rehearsalIndex = -1;
  state.rehearsalPaused = false;
  resetRehearsalEventClock();
  window.__warGroundCurrentEventId = "start";
  document.body.dataset.rehearsalEventId = "start";
  renderTimeline();
  setText("timelineState", "대기");
  setText("rehearsalRiskLabel", "위험 대기");
  setText("activeAgentCount", "0명");
  const interventionOverlay = byId("rehearsalInterventionOverlay");
  if (interventionOverlay) interventionOverlay.innerHTML = "";
  byId("currentEventCard").innerHTML = "<span>대기</span><strong>수행 리허설 실행 버튼을 누르세요.</strong><p>시간순 이벤트와 관련 에이전트가 자동 재생됩니다.</p>";
  renderActiveAgentChips();
  renderAgentTypingIndicator();
  renderRehearsalBriefingStrip();
  renderRehearsalDecisionBridge();
  clearRadioTraffic();
  renderTerrainPanels();
  window.WarGround3D?.focusEvent?.("start");
  window.WarGround3D?.setPlayback?.(false);
  renderPageBriefings();
}

function toggleRehearsalPause() {
  if (!state.rehearsalStarted) return;
  if (!state.rehearsalPaused) {
    captureRehearsalEventProgress();
    clearTimer("rehearsalTimer");
  }
  state.rehearsalPaused = !state.rehearsalPaused;
  if (!state.rehearsalPaused) state.rehearsalEventStartedAt = getRehearsalNow();
  setText("rehearsalPauseButton", state.rehearsalPaused ? "계속" : "일시정지");
  window.WarGround3D?.setPlayback?.(!state.rehearsalPaused);
  if (!state.rehearsalPaused) scheduleNextEvent();
}

function toggleRehearsalSpeed() {
  setRehearsalSpeed(getNextRehearsalSpeed());
}

function playStrikeReplay() {
  clearTimer("rehearsalTimer");
  state.rehearsalPaused = true;
  setText("rehearsalPauseButton", "계속");
  setText("timelineState", "타격 재생");
  setText("rehearsalRiskLabel", "집중타격 / 피해평가");
  window.WarGround3D?.setPlayback?.(false);
  window.WarGround3D?.replayStrike?.();
  const strikeEvent = demoData.events.find((event) => event.id === "enemy_delay");
  if (strikeEvent) triggerRadioTrafficForEvent({ ...strikeEvent, event: "집중타격 피해평가", impact: "타격 재생" });
  if (window.matchMedia?.("(max-width: 720px)").matches) {
    byId("rehearsalMap")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getFailureById(failureId) {
  return demoData.failures.find((failure) => failure.id === failureId) || demoData.failures[0];
}

function getFailureSeverity(score) {
  if (score >= 90) return "치명";
  if (score >= 80) return "고위험";
  if (score >= 70) return "주의";
  return "관찰";
}

function getFailurePlainLabel(failure) {
  const labels = {
    command_gap: "지휘가 비는 상황",
    sustainment_drop: "작전이 버티지 못하는 상황",
    accident_delay: "사고 대응이 늦어지는 상황",
    rejudge_delay: "전환 판단이 늦어지는 상황"
  };
  return labels[failure.id] || failure.title;
}

function getFailureCommanderQuestion(failure) {
  const questions = {
    command_gap: "예비망 전환 권한을 누구에게 줄 것인가",
    sustainment_drop: "보급 대기점과 정비 우선순위를 지금 확정할 것인가",
    accident_delay: "대체 후송로와 의무반 위치를 지금 열 것인가",
    rejudge_delay: "04:20 재판단 기준과 대체 승인권자를 명시할 것인가"
  };
  return questions[failure.id] || "이 흐름을 어디서 끊을 것인가";
}

function getFailureEvents(failure) {
  return demoData.events.filter((event) => event.linked_risks.includes(failure.id));
}

function getFailureAgents(failure) {
  const names = new Set(getFailureEvents(failure).flatMap((event) => event.agents));
  return Array.from(names).slice(0, 5);
}

function getFailureMitigationActions(failure) {
  if (Array.isArray(failure.mitigation_steps) && failure.mitigation_steps.length) {
    return failure.mitigation_steps.slice(0, 4);
  }
  const failureText = [failure.title, failure.mitigation, ...failure.chain].join(" ");
  const directActions = demoData.decision.immediate_actions.filter((action) =>
    failureText.split(" ").some((token) => token.length > 1 && action.includes(token))
  );
  const fallback = [failure.mitigation];
  return [...new Set(directActions.length ? directActions : fallback)].slice(0, 4);
}

function getFailureProfile(failure) {
  const events = getFailureEvents(failure);
  const evidenceItems = failure.evidence.map((id) => evidenceById.get(id)).filter(Boolean);
  const agents = getFailureAgents(failure);
  const timeWindow = events.length ? `${events[0].time} - ${events[events.length - 1].time}` : "사전 차단";
  return {
    severity: getFailureSeverity(failure.score),
    events,
    evidenceItems,
    agents,
    timeWindow,
    summary: failure.summary || failure.chain.join(" -> "),
    driver: failure.driver || failure.chain[0],
    decisionPoint: failure.decision_point || failure.chain[Math.max(1, Math.floor(failure.chain.length / 2))],
    earlyWarning: failure.early_warning || failure.chain[Math.max(1, failure.chain.length - 2)],
    trigger: failure.chain[0],
    breakpoint: failure.chain[Math.max(1, Math.floor(failure.chain.length / 2))],
    terminal: failure.chain[failure.chain.length - 1],
    mitigationActions: getFailureMitigationActions(failure)
  };
}

function getFailureStory(failure) {
  const profile = getFailureProfile(failure);
  return {
    plainLabel: getFailurePlainLabel(failure),
    headline: `${getFailurePlainLabel(failure)}을 ${profile.decisionPoint}에서 끊어야 합니다.`,
    why: `${profile.driver} 때문에 시작되고, 놓치면 ${profile.terminal}으로 이어집니다.`,
    stopPoint: profile.decisionPoint,
    warning: profile.earlyWarning,
    firstAction: profile.mitigationActions[0],
    question: getFailureCommanderQuestion(failure),
    timeWindow: profile.timeWindow,
    severity: profile.severity
  };
}

function selectFailurePath(failureId, options = {}) {
  if (!demoData.failures.some((failure) => failure.id === failureId)) return;
  state.selectedFailureId = failureId;
  if (Object.prototype.hasOwnProperty.call(options, "sourceEventId")) {
    state.lastRehearsalRiskEventId = options.sourceEventId || null;
  } else if (state.currentStage === "risk") {
    state.lastRehearsalRiskEventId = null;
  }
  renderRiskStack();
  renderSelectedFailureStory();
  renderFailureLens();
  renderRiskMetricMatrix();
  renderFailureCoverageMatrix();
  renderFailureChains();
  renderMitigationBoard();
  renderRiskEvidence();
  renderPageBriefings();
  syncRouteState();
}

function renderRiskStack() {
  const stack = byId("riskStack");
  if (!stack) return;
  stack.innerHTML = demoData.failures
    .map(
      (risk, index) => {
        const profile = getFailureProfile(risk);
        const story = getFailureStory(risk);
        const selected = state.selectedFailureId === risk.id;
        return `
        <button class="risk-item ${selected ? "is-selected" : ""} ${state.compareLlm ? "with-comparison" : ""}" type="button" data-failure-id="${risk.id}" aria-pressed="${selected ? "true" : "false"}">
          <div class="risk-report-row">
            <span class="risk-rank">R-${String(index + 1).padStart(2, "0")}</span>
            <div class="risk-report-main">
              <div class="risk-topline">
                <b>${risk.title}</b>
                <span>${risk.score}</span>
              </div>
              <strong class="risk-item-plain">${story.plainLabel}</strong>
            </div>
          </div>
          <dl class="risk-item-meta">
            <div><dt>등급</dt><dd>${story.severity}</dd></div>
            <div><dt>시간대</dt><dd>${story.timeWindow}</dd></div>
            <div><dt>근거</dt><dd>${profile.evidenceItems.length}건</dd></div>
          </dl>
          <p class="failure-summary">${story.why}</p>
          <div class="failure-pivot-strip" aria-label="실패경로 핵심 판단점">
            <span><b>원인</b><em>${profile.driver}</em></span>
            <span><b>막을 지점</b><em>${profile.decisionPoint}</em></span>
            <span><b>경고 신호</b><em>${profile.earlyWarning}</em></span>
          </div>
          <div class="risk-bar"><span style="width: ${risk.score}%"></span></div>
          ${state.compareLlm ? `<small>단일 LLM 목록식 출력 대비: 인과 체인 ${risk.chain.length}단계와 근거 ${risk.evidence.length}건 연결</small>` : ""}
        </button>
      `;
      }
    )
    .join("");
  setText("highestRiskLabel", `가장 먼저 볼 흐름: ${demoData.failures[0].title} ${demoData.failures[0].score}점`);
}

function getFailureTransferContext(failure) {
  if (!state.lastRehearsalRiskEventId || !failure) return null;
  const event = demoData.events.find((item) => item.id === state.lastRehearsalRiskEventId);
  if (!event || !event.linked_risks?.includes(failure.id)) return null;
  const evidence = event.evidence_ids?.map((id) => evidenceById.get(id)).filter(Boolean)[0];
  return { event, failure, evidence };
}

function renderFailureTransferBanner(context) {
  if (!context) return "";
  const { event, failure, evidence } = context;
  return `
    <aside class="failure-transfer-banner" aria-label="리허설 이벤트에서 실패경로로 전이된 맥락">
      <div class="failure-transfer-event">
        <span>방금 발생한 이벤트</span>
        <strong>${event.time} ${event.event}</strong>
        <em>${event.impact}</em>
      </div>
      <i class="failure-transfer-arrow" aria-hidden="true">→</i>
      <div class="failure-transfer-risk">
        <span>이 실패경로로 전이됨</span>
        <strong>${failure.title} ${failure.score}점</strong>
        <em>${evidence?.title || event.evidence_ids?.[0] || "연결 근거 확인"}</em>
      </div>
    </aside>
  `;
}

function renderSelectedFailureStory() {
  const target = byId("selectedFailureStory");
  if (!target) return;
  const failure = getFailureById(state.selectedFailureId);
  const profile = getFailureProfile(failure);
  const story = getFailureStory(failure);
  const transferContext = getFailureTransferContext(failure);
  target.innerHTML = `
    <section class="failure-cause-brief" aria-label="선택 실패경로 원인 요약">
      ${renderFailureTransferBanner(transferContext)}
      <header class="failure-cause-topline">
        <div>
          <span>현재 실패경로</span>
          <strong>${failure.title}</strong>
        </div>
        <b>${failure.score}</b>
      </header>
      <div class="failure-cause-path" aria-label="문제 원인에서 실패 결과까지">
        <article class="failure-cause-node is-problem">
          <span>문제</span>
          <strong>${story.plainLabel}</strong>
          <p>${profile.summary}</p>
        </article>
        <i aria-hidden="true">→</i>
        <article class="failure-cause-node is-cause">
          <span>왜 실패했나</span>
          <strong>${profile.driver}</strong>
          <p>${story.why}</p>
        </article>
        <i aria-hidden="true">→</i>
        <article class="failure-cause-node is-failure">
          <span>실패 결과</span>
          <strong>${profile.terminal}</strong>
          <p>${story.warning}</p>
        </article>
      </div>
      <footer class="failure-interrupt-card">
        <span>끊을 지점</span>
        <strong>${story.stopPoint}</strong>
        <em>${story.timeWindow} · ${story.question}</em>
      </footer>
    </section>
  `;
}

function renderFailureLens() {
  const target = byId("failureLensPanel");
  if (!target) return;
  const failure = getFailureById(state.selectedFailureId);
  const profile = getFailureProfile(failure);
  const story = getFailureStory(failure);
  setText("failureLensState", failure.title);
  target.innerHTML = renderInfoTiles("failure-lens-grid", [
    { label: "무슨 문제", value: story.plainLabel, detail: `${failure.score}점 · ${profile.severity}` },
    { label: "막을 지점", value: profile.decisionPoint, detail: profile.timeWindow },
    { label: "놓치면", value: profile.terminal, detail: profile.earlyWarning },
    { label: "누가 확인", value: profile.agents.length, detail: profile.agents.slice(0, 2).join(", ") || "사전 검증" }
  ], "실패경로 상세");
}

function renderRiskMetricMatrix() {
  const target = byId("riskMetricMatrix");
  if (!target) return;
  const failure = getFailureById(state.selectedFailureId);
  const metrics = [
    ["피해 크기", failure.impact, 5, "임무 영향"],
    ["발생 가능성", failure.likelihood, 5, "현장 조건"],
    ["다른 문제로 번짐", failure.connectivity, 5, "연쇄성"],
    ["시간 여유 부족", Math.round(failure.time_pressure * 100), 100, "시한 압박"]
  ];
  target.innerHTML = metrics
    .map(([label, value, max, note]) => {
      const percent = Math.round((value / max) * 100);
      return `
        <div class="risk-metric-row">
          <span>${label}</span>
          <b>${value}${max === 100 ? "%" : `/${max}`}</b>
          <em>${note}</em>
          <i><span style="width: ${percent}%"></span></i>
        </div>
      `;
    })
    .join("");
}

function getFailureCoverageRows() {
  return demoData.failures.map((failure) => {
    const profile = getFailureProfile(failure);
    const sources = new Set(profile.evidenceItems.map((item) => item.source));
    const confirmedEvidence = profile.evidenceItems.filter((item) => item.status === "근거 있음").length;
    const coverageScore = clamp(
      confirmedEvidence * 18 + sources.size * 10 + profile.events.length * 14 + profile.agents.length * 6 + profile.mitigationActions.length * 8,
      24,
      100
    );
    return {
      failure,
      profile,
      evidenceCount: profile.evidenceItems.length,
      sourceCount: sources.size,
      eventCount: profile.events.length,
      agentCount: profile.agents.length,
      actionCount: profile.mitigationActions.length,
      confirmedEvidence,
      coverageScore
    };
  });
}

function renderFailureCoverageMatrix() {
  const target = byId("failureCoverageMatrix");
  if (!target) return;
  const rows = getFailureCoverageRows();
  const sourceTotal = new Set(rows.flatMap((row) => row.profile.evidenceItems.map((item) => item.source))).size;
  target.innerHTML = `
    <header>
      <span>근거 커버리지 / Evidence Coverage Register</span>
      <b>${sourceTotal}개 출처 / ${rows.length}개 실패경로</b>
    </header>
    <div class="failure-coverage-grid">
      ${rows
        .map((row) => {
          const selected = row.failure.id === state.selectedFailureId;
          return `
            <button class="failure-coverage-row ${selected ? "is-selected" : ""}" type="button" data-coverage-failure-id="${row.failure.id}" aria-pressed="${selected ? "true" : "false"}">
              <div>
                <strong>${row.failure.title}</strong>
                <span>${row.profile.decisionPoint}</span>
              </div>
              <dl>
                <div><dt title="직접 근거">근거</dt><dd>${row.evidenceCount}</dd></div>
                <div><dt>이벤트</dt><dd>${row.eventCount}</dd></div>
                <div><dt title="참여 에이전트">에이전트</dt><dd>${row.agentCount}</dd></div>
                <div><dt>차단 조치</dt><dd>${row.actionCount}</dd></div>
              </dl>
              <i class="failure-coverage-meter" aria-label="커버리지 ${row.coverageScore}%"><span style="width: ${row.coverageScore}%"></span></i>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderFailureChains() {
  const chain = byId("failureChain");
  if (!chain) return;
  const risk = getFailureById(state.selectedFailureId);
  chain.innerHTML = risk.chain
    .map(
      (step, index) => `
        <article class="${index === risk.chain.length - 1 ? "is-terminal" : ""}">
          <span>STEP ${String(index + 1).padStart(2, "0")}</span>
          <div>
            <b>${step}</b>
            <em class="failure-step-type">${index === 0 ? "시작 조건" : index === risk.chain.length - 1 ? "최종 실패" : "연쇄 요인"}</em>
          </div>
        </article>
      `
    )
    .join("");
}

function renderMitigationBoard() {
  const target = byId("mitigationBoard");
  if (!target) return;
  const failure = getFailureById(state.selectedFailureId);
  const profile = getFailureProfile(failure);
  target.innerHTML = profile.mitigationActions
    .map(
      (action, index) => `
        <article class="failure-action-card">
          <span>ACTION ${String(index + 1).padStart(2, "0")}</span>
          <b>${action}</b>
          <em>근거: ${profile.evidenceItems[index % Math.max(profile.evidenceItems.length, 1)]?.source || "결심카드"}</em>
        </article>
      `
    )
    .join("");
}

function renderRiskEvidence() {
  const target = byId("riskEvidenceList");
  if (!target) return;
  const selected = getFailureById(state.selectedFailureId);
  const directIds = [...new Set(selected?.evidence || [])];
  const allIds = [...new Set(demoData.failures.flatMap((risk) => risk.evidence))];
  target.innerHTML = `
    ${directIds.map((id) => evidenceBadge(evidenceById.get(id))).join("")}
    <div class="risk-evidence-overview">
      <b>${directIds.length}건 직접 근거</b>
      <span>전체 근거는 커버리지에서 비교 · ${allIds.length}건 전체</span>
    </div>
  `;
  setText("riskEvidenceState", `${directIds.length}건 직접 / ${allIds.length}건 전체`);
}

function getDecisionFailureSummary() {
  const count = demoData.failures.length;
  const averageRisk = Math.round(demoData.failures.reduce((sum, failure) => sum + failure.score, 0) / count);
  const topRisk = demoData.failures.reduce((top, failure) => (failure.score > top.score ? failure : top), demoData.failures[0]);
  return {
    count,
    averageRisk,
    topRisk,
    evidenceTotal: new Set(demoData.failures.flatMap((failure) => failure.evidence)).size
  };
}

function getDecisionConditions() {
  return demoData.decision.conditions || [
    { label: "통신", detail: "예비 통신수단 지정", owner: "통신참모" },
    { label: "군수", detail: "보급 대기점 추가", owner: "군수참모" },
    { label: "재판단", detail: "전환 기준 명시", owner: "지휘관" }
  ];
}

function getDecisionImpactModel() {
  const conditionSource = getDecisionConditions();
  const conditionSpecs = [
    {
      id: "comms",
      icon: "radio-tower",
      evidence: "ev_comm_gap",
      reduction: { command_gap: 16, rejudge_delay: 6 }
    },
    {
      id: "logistics",
      icon: "package-check",
      evidence: "ev_logistics_supply",
      reduction: { sustainment_drop: 18, command_gap: 4 }
    },
    {
      id: "rejudge",
      icon: "git-branch-plus",
      evidence: "ev_sop_criteria",
      reduction: { rejudge_delay: 20, command_gap: 10 }
    },
    {
      id: "evac",
      icon: "cross",
      evidence: "ev_evac_route",
      reduction: { accident_delay: 18 }
    }
  ];
  const conditions = conditionSpecs.map((spec, index) => {
    const source = conditionSource[index] || { label: `조건 ${index + 1}`, detail: demoData.decision.immediate_actions[index] || "확인 필요", owner: "지휘관" };
    return {
      ...spec,
      label: typeof source === "string" ? `조건 ${index + 1}` : source.label,
      detail: typeof source === "string" ? source : source.detail,
      owner: typeof source === "string" ? "확인 필요" : source.owner
    };
  });
  return { conditions, failures: demoData.failures };
}

function getDecisionApprovalGates() {
  const model = getDecisionImpactModel();
  const activeIds = getActiveDecisionConditionIds();
  return model.conditions.map((condition) => {
    const impactedFailures = model.failures
      .map((failure) => ({
        failure,
        reduction: condition.reduction[failure.id] || 0,
        score: getProjectedFailureScore(failure, activeIds)
      }))
      .filter((item) => item.reduction > 0)
      .sort((a, b) => b.reduction - a.reduction);
    const primary = impactedFailures[0] || {
      failure: model.failures[0],
      reduction: 0,
      score: getProjectedFailureScore(model.failures[0], activeIds)
    };
    const active = activeIds.has(condition.id);
    const evidence = evidenceById.get(condition.evidence);
    return {
      id: condition.id,
      label: condition.label,
      owner: condition.owner,
      detail: condition.detail,
      evidenceId: condition.evidence,
      evidenceTitle: evidence?.title || condition.evidence,
      active,
      tone: active ? "ready" : "pending",
      status: active ? "조건 반영" : "승인 전 보완",
      failure: primary.failure,
      residualRisk: primary.score.projected,
      reduction: primary.reduction
    };
  });
}

function renderDecisionApprovalBoard() {
  const target = byId("decisionApprovalBoard");
  if (!target) return;
  const gates = getDecisionApprovalGates();
  const readyCount = gates.filter((gate) => gate.active).length;
  const highestResidual = Math.max(...gates.map((gate) => gate.residualRisk));
  target.innerHTML = `
    <header>
      <div>
        <span>승인 게이트</span>
        <b>${readyCount}/${gates.length}개 조건 반영</b>
      </div>
      <em>최고 잔여위험 ${highestResidual}</em>
    </header>
    <div class="decision-approval-grid">
      ${gates.map((gate) => `
        <button class="decision-approval-gate is-${gate.tone}" type="button" aria-pressed="${gate.active ? "true" : "false"}" data-decision-approval-gate="${gate.id}" data-decision-condition="${gate.id}" data-evidence-id="${gate.evidenceId}">
          <span>${gate.status}</span>
          <b>${gate.label}</b>
          <p>${gate.detail}</p>
          <em>${gate.owner} · ${gate.failure.title} ${gate.residualRisk}</em>
        </button>
      `).join("")}
    </div>
  `;
}

function getDecisionSignatureFlow() {
  const gates = getDecisionApprovalGates();
  const readyCount = gates.filter((gate) => gate.active).length;
  const allReady = readyCount === gates.length;
  const evidenceLocked = demoData.decision.evidence_ids.length;
  return [
    {
      label: "AI 검토안",
      owner: "WAR GROUND",
      status: `${evidenceLocked}개 근거 잠금`,
      done: true
    },
    {
      label: "참모 보완",
      owner: "주요 참모",
      status: `${readyCount}/${gates.length}개 승인 게이트 반영`,
      done: readyCount >= Math.max(1, gates.length - 1)
    },
    {
      label: "지휘관 승인",
      owner: "지휘관",
      status: allReady ? "조건부 승인 가능" : "보완 조건 확인",
      done: allReady
    },
    {
      label: "단편명령 전파",
      owner: "작전참모",
      status: allReady ? "작성안 전파 준비" : "승인 후 전파",
      done: false
    }
  ];
}

function renderDecisionSignatureFlow() {
  const target = byId("decisionSignatureFlow");
  if (!target) return;
  target.innerHTML = `
    <header><span>최종 승인 흐름</span><b>Human-in-the-loop</b></header>
    <div>
      ${getDecisionSignatureFlow().map((step, index) => `
        <article class="signature-step ${step.done ? "is-done" : ""}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <b>${step.label}</b>
          <em>${step.owner}</em>
          <p>${step.status}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function getActiveDecisionConditionIds() {
  return new Set(
    Object.entries(state.decisionConditionState)
      .filter(([, enabled]) => enabled)
      .map(([id]) => id)
  );
}

function getProjectedFailureScore(failure, activeIds = getActiveDecisionConditionIds()) {
  const { conditions } = getDecisionImpactModel();
  const reduction = conditions.reduce((sum, condition) => (
    activeIds.has(condition.id) ? sum + (condition.reduction[failure.id] || 0) : sum
  ), 0);
  return {
    base: failure.score,
    reduction,
    projected: clamp(failure.score - reduction, 18, failure.score)
  };
}

function toggleDecisionCondition(conditionId) {
  if (!Object.hasOwn(state.decisionConditionState, conditionId)) return;
  state.decisionConditionState[conditionId] = !state.decisionConditionState[conditionId];
  renderDecisionImpactSimulator();
  renderDecisionApprovalBoard();
  renderDecisionExecutionMatrix();
  renderDecisionSignatureFlow();
  renderPageBriefings();
}

function renderDecisionImpactSimulator() {
  const target = byId("decisionImpactSimulator");
  if (!target) return;
  target.classList.add("decision-impact-simulator");
  const model = getDecisionImpactModel();
  const activeIds = getActiveDecisionConditionIds();
  const projectedRows = model.failures.map((failure) => ({
    failure,
    ...getProjectedFailureScore(failure, activeIds)
  }));
  const averageBase = Math.round(projectedRows.reduce((sum, row) => sum + row.base, 0) / projectedRows.length);
  const averageProjected = Math.round(projectedRows.reduce((sum, row) => sum + row.projected, 0) / projectedRows.length);
  const averageReduction = averageBase - averageProjected;
  const activeCount = activeIds.size;
  target.innerHTML = `
    <header class="decision-module-heading">
      <div>
        <span>조건 검토표</span>
        <b>승인 조건 충족 시 위험 감쇄</b>
      </div>
      <em>${activeCount}/${model.conditions.length}개 반영</em>
    </header>
    <div class="decision-impact-summary">
      <div>
        <span>평균 잔여 위험</span>
        <b>예상 잔여 위험 ${averageProjected}</b>
        <em>${activeCount}/${model.conditions.length}개 조건 반영 · 평균 ${averageReduction}점 감소</em>
      </div>
      <strong>${averageBase} → ${averageProjected}</strong>
    </div>
    <div class="decision-condition-toggle-grid" aria-label="조건 토글">
      ${model.conditions.map((condition) => {
        const active = activeIds.has(condition.id);
        return `
          <button class="decision-condition-toggle ${active ? "is-active" : ""}" type="button" aria-pressed="${active ? "true" : "false"}" data-decision-condition="${condition.id}" data-evidence-id="${condition.evidence}">
            <i data-lucide="${condition.icon}" aria-hidden="true"></i>
            <span>${condition.label}</span>
            <b>${condition.detail}</b>
            <em>${condition.owner}</em>
          </button>
        `;
      }).join("")}
    </div>
    <div class="decision-impact-bars" aria-label="예상 잔여 위험">
      ${projectedRows.map((row) => {
        const percent = Math.round((row.projected / row.base) * 100);
        return `
          <article>
            <div><span>${row.failure.title}</span><b>${row.base} → ${row.projected}</b></div>
            <i><span style="width: ${percent}%"></span></i>
            <em>${row.reduction ? `${row.reduction}점 감쇄` : "조건 보강 필요"}</em>
          </article>
        `;
      }).join("")}
    </div>
  `;
  refreshIcons();
}

function getDecisionExecutionRows() {
  const model = getDecisionImpactModel();
  const activeIds = getActiveDecisionConditionIds();
  const evidenceIds = demoData.decision.evidence_ids;
  return demoData.decision.immediate_actions.map((action, index) => {
    const evidenceId = evidenceIds[index] || evidenceIds[evidenceIds.length - 1] || "ev_plan_mission";
    const evidence = evidenceById.get(evidenceId);
    const failure = demoData.failures.find((item) => item.evidence.includes(evidenceId)) || demoData.failures[index % demoData.failures.length];
    const condition = model.conditions.find((item) => item.evidence === evidenceId || item.reduction[failure.id]) || model.conditions[index % model.conditions.length];
    const score = getProjectedFailureScore(failure, activeIds);
    return {
      id: `decision-action-${index}`,
      action,
      owner: condition?.owner || "지휘관",
      condition: condition?.label || "조건",
      evidenceId,
      evidence,
      failure,
      score,
      critical: score.projected >= 75
    };
  });
}

function renderDecisionExecutionMatrix() {
  const target = byId("decisionExecutionMatrix");
  if (!target) return;
  const rows = getDecisionExecutionRows();
  const openRiskCount = rows.filter((row) => row.critical).length;
  target.innerHTML = `
    <header>
      <div>
        <span>실행 등록부 / 조치 실행 매트릭스</span>
        <b>${rows.length}개 즉시 수정안 / 담당 참모 연결</b>
      </div>
      <em>${openRiskCount ? `${openRiskCount}개 고위험 잔류` : "조건 반영 후 통제 가능"}</em>
    </header>
    <div class="decision-execution-grid">
      ${rows.map((row, index) => `
        <article class="decision-execution-row ${row.critical ? "is-critical" : ""}">
          <span>${String(index + 1).padStart(2, "0")} / ${row.owner}</span>
          <b>${row.action}</b>
          <p>${row.condition} 조건으로 ${row.failure.title} 잔여위험 ${row.score.projected}까지 통제</p>
          <div class="decision-execution-meta">
            <em>잔여위험 ${row.score.base} → ${row.score.projected}</em>
            <strong>${row.evidence?.title || row.evidenceId}</strong>
          </div>
          <div class="decision-execution-actions">
            <button type="button" data-decision-execution-action="risk" data-decision-execution-ref="${row.failure.id}">위험 보기</button>
            <button type="button" data-decision-execution-action="evidence" data-decision-execution-ref="${row.evidenceId}">근거 추적</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function runDecisionExecutionAction(action, ref) {
  if (action === "risk") {
    setStage("risk");
    selectFailurePath(ref);
    return;
  }
  if (action === "evidence") {
    openEvidenceTrace(ref);
  }
}

function getDecisionScorecard() {
  const failureSummary = getDecisionFailureSummary();
  const directEvidence = demoData.decision.evidence_ids.length;
  const actionCoverage = Math.round((demoData.decision.immediate_actions.length / (demoData.failures.length + 1)) * 100);
  return [
    { label: "추천 방책", value: demoData.decision.recommended_coa, detail: demoData.decision.conditional_coa, tone: "primary" },
    { label: "위험 부하", value: failureSummary.averageRisk, detail: `${failureSummary.count}개 실패경로 · 최고 ${failureSummary.topRisk.title}`, tone: "danger" },
    { label: "조치 커버", value: `${Math.min(actionCoverage, 100)}%`, detail: `${demoData.decision.immediate_actions.length}개 즉시 수정안`, tone: "support" },
    { label: "근거 잠금", value: `${directEvidence}/${failureSummary.evidenceTotal}`, detail: "결심 근거 직접 연결", tone: "evidence" }
  ];
}

function getCommanderCheckItems() {
  return demoData.decision.commander_check_items || [
    "A안 조건부 승인 여부",
    "예비 중계팀 선배치 권한",
    "보급 대기점 추가 가능 여부",
    "재판단 기준과 대체 승인권자 지정"
  ];
}

function renderDecisionScoreboard() {
  const target = byId("decisionScoreboard");
  if (!target) return;
  target.innerHTML = renderInfoTileItems(getDecisionScorecard());
  renderDecisionImpactSimulator();
  renderDecisionApprovalBoard();
  renderDecisionExecutionMatrix();
}

function renderCommanderChecklist() {
  const target = byId("commanderChecklist");
  if (!target) return;
  const checkItems = getCommanderCheckItems()
    .map(
      (item, index) => `
        <article>
          <span>CHK ${String(index + 1).padStart(2, "0")}</span>
          <div>
            <b>${item}</b>
            <em>${index < 2 ? "승인 전 확인" : "조건 확인"}</em>
          </div>
        </article>
      `
    )
    .join("");
  const watchItems = (demoData.decision.watch_items || [])
    .slice(0, 4);
  target.innerHTML = `
    ${checkItems}
    ${renderActionList("watch-item-list", watchItems, { title: "리허설 감시 항목", ariaLabel: "감시 항목" })}
  `;
  renderDecisionSignatureFlow();
}

function renderDecisionTracePanel() {
  const target = byId("decisionTracePanel");
  if (!target) return;
  target.innerHTML = demoData.decision.evidence_ids
    .map((id, index) => {
      const evidence = evidenceById.get(id);
      const action = demoData.decision.immediate_actions[index] || demoData.decision.redecision_criteria[index] || "지휘관 확인";
      return `
        <button type="button" data-decision-evidence-id="${id}" data-evidence-id="${id}">
          <span>EV ${String(index + 1).padStart(2, "0")} · ${evidence?.status || "근거"}</span>
          <b>${evidence?.title || id}</b>
          <em>${action}</em>
        </button>
      `;
    })
    .join("");
}

function renderDecisionCard() {
  const panel = byId("decisionCardPanel");
  if (!panel) return;
  const decision = demoData.decision;
  const conditions = getDecisionConditions();
  const primaryCondition = conditions[0];
  const primaryAction = decision.immediate_actions[1] || decision.immediate_actions[0];
  const criteria = decision.redecision_criteria[0];
  const summary = getDecisionFailureSummary();
  const topProfile = getFailureProfile(summary.topRisk);
  const directEvidence = decision.evidence_ids.length;
  const relatedEvents = topProfile.events.length;
  panel.innerHTML = `
    <section class="simple-decision-card final-decision-card" aria-label="지휘관 결심카드">
      <header class="simple-decision-hero final-decision-verdict">
        <span>권고 결심</span>
        <strong>${decision.recommended_coa}</strong>
        <p>${decision.decision_statement || decision.conditional_coa}</p>
      </header>
      <p class="simple-decision-statement">${decision.conditional_coa}</p>
      <div class="final-decision-grid">
        <article class="simple-decision-conditions final-decision-condition">
          <h3>조건</h3>
          <b>${typeof primaryCondition === "string" ? "승인 조건" : primaryCondition.label}</b>
          <p>${typeof primaryCondition === "string" ? primaryCondition : primaryCondition.detail}</p>
          <em>재판단 기준: ${criteria}</em>
        </article>
        <article class="simple-decision-actions final-decision-action">
          <h3>즉시 조치</h3>
          <b>${primaryAction}</b>
          <p>${decision.commander_check_items[1] || "현장 지휘자 권한 위임 여부 확인"}</p>
        </article>
        <article class="simple-decision-footer final-decision-evidence">
          <h3>근거</h3>
          <b>실패경로 ${summary.topRisk.score}점 / 근거 ${directEvidence}건 / 관련 이벤트 ${relatedEvents}건</b>
          <p>${summary.topRisk.title} · ${topProfile.driver}</p>
        </article>
      </div>
      <footer class="simple-decision-footer">
        <span>근거 ${decision.evidence_ids.length}건 잠금</span>
        <strong>지휘관 승인 필요</strong>
      </footer>
    </section>
  `;
}

function renderFragmentaryOrder() {
  const panel = byId("fragmentaryOrderPanel");
  if (!panel) return;
  const order = demoData.order;
  panel.innerHTML = `
    <div class="order-sheet">
      <div class="decision-lock">
        <span>${order.notice}</span>
        <strong>${order.title}</strong>
      </div>
      <article><b>상황</b><p>${order.situation}</p></article>
      <article><b>임무</b><p>${order.mission}</p></article>
      <article><b>실시</b><ol>${order.execution.map((item) => `<li>${item}</li>`).join("")}</ol></article>
      <article><b>전투근무지원</b><ol>${order.service_support.map((item) => `<li>${item}</li>`).join("")}</ol></article>
      <article><b>지휘 및 통신</b><ol>${order.command_signal.map((item) => `<li>${item}</li>`).join("")}</ol></article>
    </div>
  `;
}

function renderDecisionEvidence() {
  const table = byId("decisionEvidenceTable");
  if (!table) return;
  table.innerHTML = demoData.decision.evidence_ids
    .map((id, index) => {
      const item = evidenceById.get(id);
      return `<div data-decision-evidence-id="${id}"><span>REF ${String(index + 1).padStart(2, "0")} · ${item.status}</span><b>${item.title}</b><em>${item.source}</em></div>`;
    })
    .join("");
  setText("humanLoopNotice", demoData.decision.command_authority_notice);
  renderPageBriefings();
}

function setDecisionTab(tab) {
  document.querySelectorAll("[data-decision-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.decisionTab === tab);
  });
  byId("decisionCardPanel").hidden = tab !== "card";
  byId("fragmentaryOrderPanel").hidden = tab !== "order";
}

function updateFlow(step) {
  const order = ["scenario", "agents", "rehearsal", "failure", "decision"];
  const activeIndex = order.indexOf(step);
  document.querySelectorAll(".flow-step").forEach((item) => {
    const index = order.indexOf(item.dataset.flowStep);
    item.classList.toggle("is-active", index === activeIndex);
    item.classList.toggle("is-complete", index < activeIndex);
  });
}

function updateStats() {
  setText("nodeCountLabel", state.scenarioLoaded ? `${graph.nodes.length}개 노드` : "0개 노드");
  setText("edgeCountLabel", state.scenarioLoaded ? `${graph.edges.length}개 관계` : "0개 관계");
  setText("ontologyCountLabel", `${graph.nodes.length}개 노드`);
}

function updateDemoClock() {
  const minutes = String(Math.floor(state.demoRemaining / 60)).padStart(2, "0");
  const seconds = String(state.demoRemaining % 60).padStart(2, "0");
  setText("demoClockLabel", `${minutes}:${seconds}`);
}

function tickDemoClock() {
  state.demoRemaining = Math.max(0, state.demoRemaining - 1);
  updateDemoClock();
}

function resetDemo() {
  clearTimer("autoTimer");
  clearTimer("rehearsalTimer");
  hideAutoDemoOverlay();
  state.scenarioLoaded = false;
  state.agentsGenerated = false;
  state.rehearsalStarted = false;
  state.generatedAgentCount = 0;
  state.rehearsalIndex = -1;
  state.rehearsalPaused = false;
  state.rehearsalSpeed = 1;
  state.rehearsalEventElapsedMs = 0;
  state.rehearsalEventStartedAt = 0;
  state.compareLlm = false;
  state.agentConversationTab = "live";
  state.demoRemaining = 210;
  state.selectedAgentId = "red_team_agent";
  state.agentFilter = "all";
  state.selectedFailureId = "command_gap";
  state.selectedEvidenceId = "ev_comm_gap";
  state.selectedBriefingStepId = "decision";
  state.selectedBriefingQuestionId = "why-b";
  state.selectedAarActionId = "aar-command_gap-0";
  state.selectedAuditItemId = "audit-decision";
  state.selectedSubmitBundleId = "submit-briefing";
  state.selectedRetrainItemId = "retrain-command_gap-0";
  state.selectedHandoffRecipientId = "handoff-commander";
  state.selectedMetricId = "metric-readiness";
  state.selectedWatchItemId = "watch-command_gap";
  state.selectedLogItemId = "log-command_gap";
  state.selectedChallengeItemId = "challenge-command_gap";
  state.selectedQueueItemId = "queue-challenge-command_gap";
  state.selectedForecastScenarioId = "forecast-paced";
  state.selectedBroadcastRecipientId = "broadcast-commander";
  state.selectedReceiptItemId = "receipt-broadcast-commander";
  state.selectedCloseoutItemId = "closeout-final";
  state.selectedLessonItemId = "lesson-command-gap";
  state.selectedNextOpItemId = "nextop-seed-comms";
  state.selectedPrefillItemId = "prefill-field-mission";
  setFocusMode(false);
  state.decisionConditionState = {
    comms: true,
    logistics: true,
    rejudge: true,
    evac: true
  };
  demoData.agents.forEach((agent) => {
    agent.status = "대기";
  });
  setText("missionLabel", "OP NIGHT-MOVE / READY");
  setText("operationName", "접수 전");
  setText("missionText", "작전계획을 접수하면 임무가 표시됩니다.");
  setText("operationTime", "--:-- / --:--");
  setText("mockStatusLabel", "작전 자료 대기");
  setText("scenarioSourceLabel", "자료 접수 전");
  setText("scenarioLoadState", "대기");
  setText("pipelineState", "준비");
  setText("coaState", "접수 필요");
  setText("demoReadinessLabel", "부분 가능");
  setText("agentFactoryState", "생성 대기");
  setText("agentLayerState", "대기");
  setText("staffState", "접수 필요");
  setText("agentProgressLabel", "0%");
  renderRehearsalSpeedControls();
  byId("agentProgressBar").style.width = "0%";
  byId("constraintGrid").innerHTML = "";
  byId("coaTable").innerHTML = "";
  byId("generateAgentsButton").disabled = true;
  setRehearsalRunButtonDisabled(true);
  renderScenarioShell();
  renderAgentLayers();
  renderDebate();
  renderStaffMatrix();
  renderRiskStack();
  renderSelectedFailureStory();
  renderFailureLens();
  renderRiskMetricMatrix();
  renderFailureCoverageMatrix();
  renderFailureChains();
  renderMitigationBoard();
  renderRiskEvidence();
  renderDecisionScoreboard();
  renderDecisionCard();
  renderFragmentaryOrder();
  renderCommanderChecklist();
  renderDecisionTracePanel();
  renderDecisionEvidence();
  resetRehearsal();
  updateFlow("scenario");
  updateStats();
  updateDemoClock();
  setGraphMode("all");
  setStage("data");
  renderPageBriefings();
  refreshIcons();
}

const autoDemoSteps = [
  {
    id: "scenario",
    stage: "data",
    flow: "scenario",
    label: "작전계획 접수",
    detail: "문서 패키지, 제한사항, A/B/C 방책을 구조화합니다.",
    duration: 1100,
    run: loadScenario
  },
  {
    id: "graph",
    stage: "ontology",
    flow: "scenario",
    label: "온톨로지 연결",
    detail: "문서 근거와 방책, 위험, 결심 후보를 그래프에 연결합니다.",
    duration: 1200,
    run: () => {
      setGraphMode("all");
      selectNode("mission");
    }
  },
  {
    id: "agents",
    stage: "agents",
    flow: "agents",
    label: "가상부대 생성",
    detail: "참모, 현장 제대, 대항군, 환경 에이전트를 활성화합니다.",
    duration: 1600,
    run: generateAgents
  },
  {
    id: "rehearsal",
    stage: "rehearsal",
    flow: "rehearsal",
    label: "수행 리허설 실행",
    detail: "시간순 이벤트와 3D 지형 위 마찰 지점을 재생합니다.",
    duration: 5200,
    run: runRehearsal
  },
  {
    id: "risk",
    stage: "risk",
    flow: "failure",
    label: "실패경로 산출",
    detail: "지휘공백, 지속성 저하, 사고 대응 지연의 인과 흐름을 압축합니다.",
    duration: 1600,
    run: () => {
      selectFailurePath("command_gap");
    }
  },
  {
    id: "decision",
    stage: "decision",
    flow: "decision",
    label: "결심카드 작성",
    detail: "추천 방책, 시행 조건, 근거 테이블을 지휘관 확인 양식으로 묶습니다.",
    duration: 1700,
    run: () => {
      setDecisionTab("card");
    }
  },
  {
    id: "briefing",
    stage: "briefing",
    flow: "decision",
    label: "심사 브리핑 구성",
    detail: "1분 설명, 예상 질문, 근거 잠금을 발표 화면으로 정리합니다.",
    duration: 900,
    run: () => {
      renderBriefingRunway();
    }
  },
  {
    id: "aar",
    stage: "aar",
    flow: "decision",
    label: "AAR 개선안 생성",
    detail: "리허설 마찰을 책임자, 기한, 근거가 있는 보완 과제로 전환합니다.",
    duration: 900,
    run: () => {
      renderAarImprovementPlan();
    }
  },
  {
    id: "audit",
    stage: "audit",
    flow: "decision",
    label: "감사 로그 작성",
    detail: "자료 접수부터 AAR 조치까지 판단 이벤트와 근거 원장을 검증합니다.",
    duration: 900,
    run: () => {
      renderAuditLogbook();
    }
  },
  {
    id: "submit",
    stage: "submit",
    flow: "decision",
    label: "제출 패키지 잠금",
    detail: "최종 산출물 묶음과 제출 전 게이트를 생성합니다.",
    duration: 900,
    run: () => {
      renderSubmissionPackage();
    }
  },
  {
    id: "retrain",
    stage: "retrain",
    flow: "decision",
    label: "재훈련 계획 편성",
    detail: "AAR 조치와 감사 공백을 72시간 훈련 일정으로 다시 묶습니다.",
    duration: 900,
    run: () => {
      renderRetrainingPlan();
    }
  },
  {
    id: "handoff",
    stage: "handoff",
    flow: "decision",
    label: "인수인계 패킷 생성",
    detail: "수신자별 조치, 근거, 교신 문안을 다음 운용자에게 전달합니다.",
    duration: 900,
    run: () => {
      renderHandoffCenter();
    }
  },
  {
    id: "metrics",
    stage: "metrics",
    flow: "decision",
    label: "운영 지표 갱신",
    detail: "인계 이후 위험 추세, 근거 부채, 재훈련 준비도를 상태판으로 정리합니다.",
    duration: 900,
    run: () => {
      renderOperationsMetrics();
    }
  },
  {
    id: "watch",
    stage: "watch",
    flow: "decision",
    label: "상황 감시 시작",
    detail: "현장 재판단 트리거와 전파 문안을 감시 화면으로 묶습니다.",
    duration: 900,
    run: () => {
      renderDecisionWatch();
    }
  },
  {
    id: "log",
    stage: "log",
    flow: "decision",
    label: "상황 일지 기록",
    detail: "감시 보고를 시간순 일지와 교대 확인 기록으로 남깁니다.",
    duration: 900,
    run: () => {
      renderOperationsLog();
    }
  },
  {
    id: "challenge",
    stage: "challenge",
    flow: "decision",
    label: "반증 검증",
    detail: "최종 결심의 핵심 가정과 반대 신호를 다시 점검합니다.",
    duration: 900,
    run: () => {
      renderChallengeReview();
    }
  },
  {
    id: "queue",
    stage: "queue",
    flow: "decision",
    label: "조치 큐 정렬",
    detail: "남은 산출물을 담당자와 우선순위가 있는 실행 항목으로 묶습니다.",
    duration: 900,
    run: () => {
      renderActionQueue();
    }
  },
  {
    id: "forecast",
    stage: "forecast",
    flow: "decision",
    label: "준비 예측 산출",
    detail: "큐 처리 속도별 준비도와 잔여 위험 변화를 예측합니다.",
    duration: 900,
    run: () => {
      renderReadinessForecast();
    }
  },
  {
    id: "broadcast",
    stage: "broadcast",
    flow: "decision",
    label: "전파 패키지 생성",
    detail: "예측과 조치 큐를 수신자별 문안과 확인 게이트로 변환합니다.",
    duration: 900,
    run: () => {
      renderBroadcastPackage();
    }
  },
  {
    id: "receipt",
    stage: "receipt",
    flow: "decision",
    label: "수신 확인 추적",
    detail: "전파 이후 확인·대기·재전파 상태와 완료 게이트를 추적합니다.",
    duration: 900,
    run: () => {
      renderReceiptTracker();
    }
  },
  {
    id: "closeout",
    stage: "closeout",
    flow: "decision",
    label: "종결 보고 잠금",
    detail: "결심, 수신 확인, 예외 처리, 보관 산출물을 최종 기록으로 묶습니다.",
    duration: 900,
    run: () => {
      renderCloseoutReport();
    }
  },
  {
    id: "lessons",
    stage: "lessons",
    flow: "decision",
    label: "교훈 라이브러리 생성",
    detail: "종결 산출물을 다음 작전에서 재사용할 판단 패턴과 체크로 전환합니다.",
    duration: 900,
    run: () => {
      renderLessonsLibrary();
    }
  },
  {
    id: "nextop",
    stage: "nextop",
    flow: "decision",
    label: "다음 작전 템플릿 생성",
    detail: "교훈 패턴과 체크를 다음 작전 접수 시드와 초기 제약으로 변환합니다.",
    duration: 900,
    run: () => {
      renderNextOperationTemplate();
    }
  },
  {
    id: "prefill",
    stage: "prefill",
    flow: "scenario",
    label: "초기 접수 프리필",
    detail: "다음 작전 템플릿을 새 자료 접수값과 확인 게이트로 되돌립니다.",
    duration: 900,
    run: () => {
      renderIntakePrefill();
    }
  }
];

function ensureAutoDemoOverlay() {
  let overlay = byId("autoDemoOverlay");
  if (overlay) return overlay;
  overlay = document.createElement("aside");
  overlay.id = "autoDemoOverlay";
  overlay.className = "auto-demo-overlay";
  overlay.setAttribute("aria-live", "polite");
  overlay.innerHTML = `
    <div class="auto-demo-head">
      <span>자동 진행</span>
      <b id="autoDemoStepLabel">대기</b>
    </div>
    <p id="autoDemoStepDetail">작전 리허설 시퀀스를 준비합니다.</p>
    <div class="auto-demo-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <span id="autoDemoProgressBar"></span>
    </div>
    <div class="auto-demo-step-list" id="autoDemoStepList"></div>
  `;
  document.body.append(overlay);
  return overlay;
}

function renderAutoDemoSteps(activeIndex = -1) {
  const list = byId("autoDemoStepList");
  if (!list) return;
  list.innerHTML = autoDemoSteps
    .map((step, index) => {
      const stateClass = index < activeIndex ? "is-complete" : index === activeIndex ? "is-active" : "";
      return `<span class="${stateClass}"><i>${String(index + 1).padStart(2, "0")}</i>${step.label}</span>`;
    })
    .join("");
}

function showAutoDemoOverlay() {
  const overlay = ensureAutoDemoOverlay();
  overlay.classList.add("is-visible");
  renderAutoDemoSteps();
}

function hideAutoDemoOverlay() {
  const overlay = byId("autoDemoOverlay");
  if (!overlay) return;
  overlay.classList.remove("is-visible", "is-complete");
  document.body.classList.remove("is-auto-demo-running");
}

function setAutoDemoProgress(index, step, progress) {
  const percent = Math.round(((index + progress) / autoDemoSteps.length) * 100);
  setText("autoDemoStepLabel", step.label);
  setText("autoDemoStepDetail", step.detail);
  const meter = byId("autoDemoProgressBar");
  const progressbar = document.querySelector(".auto-demo-meter");
  if (meter) meter.style.width = `${percent}%`;
  if (progressbar) progressbar.setAttribute("aria-valuenow", String(percent));
  renderAutoDemoSteps(index);
}

function runAutoDemoStep(index) {
  const step = autoDemoSteps[index];
  if (!step) {
    const overlay = byId("autoDemoOverlay");
    if (overlay) overlay.classList.add("is-complete");
    setText("autoDemoStepLabel", "초기 접수 프리필 완료");
    setText("autoDemoStepDetail", "검토안, 근거, 단편명령, 심사 브리핑, 후속 조치, 검증 장부, 제출 묶음, 재훈련, 인수인계, 운영 지표, 상황 감시, 상황 일지, 반증 검증, 조치 큐, 준비 예측, 전파 패키지, 수신 확인, 종결 보고, 교훈 라이브러리, 다음 작전 템플릿, 초기 접수 프리필까지 자동 생성되었습니다.");
    document.body.classList.remove("is-auto-demo-running");
    updateFlow("scenario");
    setStage("prefill");
    return;
  }

  setAutoDemoProgress(index, step, 0.25);
  setStage(step.stage);
  updateFlow(step.flow);

  state.autoTimer = window.setTimeout(() => {
    step.run();
    setAutoDemoProgress(index, step, 0.82);
    state.autoTimer = window.setTimeout(() => {
      setAutoDemoProgress(index, step, 1);
      runAutoDemoStep(index + 1);
    }, step.duration);
  }, 420);
}

function runAutoDemo() {
  clearTimer("autoTimer");
  resetDemo();
  document.body.classList.add("is-auto-demo-running");
  showAutoDemoOverlay();
  runAutoDemoStep(0);
}

function downloadJson(payload, fileName) {
  const serialized = JSON.stringify(payload, null, 2);
  const blob = new Blob([serialized], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportDecision() {
  downloadJson({
    decision_card: demoData.decision,
    fragmentary_order: demoData.order,
    execution_matrix: getDecisionExecutionRows(),
    evidence: demoData.decision.evidence_ids.map((id) => evidenceById.get(id))
  }, "war-ground-decision-review.json");
}

function getSubmissionPacket(snapshot = getBriefingSnapshot()) {
  return {
    package_type: "war-ground-submission-packet",
    generated_at: new Date().toISOString(),
    share_url: snapshot.shareUrl,
    mission: {
      title: snapshot.title,
      current_stage: snapshot.stage,
      recommended_decision: snapshot.decision,
      decision_condition: snapshot.condition,
      residual_risk: snapshot.residualRisk
    },
    briefing_text: getBriefingText(snapshot),
    run_sheet: getDemoRunSheetItems(),
    rehearsal_judgment: snapshot.rehearsalBriefing,
    approval_gates: snapshot.approvalGates,
    judge_defense: snapshot.defenseItems,
    decision_card: demoData.decision,
    fragmentary_order: demoData.order,
    execution_matrix: snapshot.executionRows,
    selected_failure: snapshot.failure,
    selected_evidence: snapshot.evidence,
    recommended_screenshots: [
      "outputs/verify-rehearsal-3d-briefing.png",
      "outputs/verify-decision-approval-gates.png",
      "outputs/verify-briefing-packet.png",
      "outputs/verify-mobile-rehearsal-briefing.png"
    ]
  };
}

function exportBriefingPacket() {
  const button = byId("exportBriefingPacket");
  downloadJson(getSubmissionPacket(), "war-ground-submission-packet.json");
  if (!button) return;
  button.innerHTML = `<i data-lucide="check" aria-hidden="true"></i>패킷 저장됨`;
  window.setTimeout(() => {
    button.innerHTML = `<i data-lucide="download" aria-hidden="true"></i>제출 패킷 저장`;
    refreshIcons();
  }, 1200);
  refreshIcons();
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function activateEvidenceKeyboardTarget(event) {
  const evidenceTarget = event.target.closest?.("[data-evidence-id]");
  if (!evidenceTarget || !(event.key === "Enter" || event.key === " ")) return false;
  event.preventDefault();
  selectEvidence(evidenceTarget.dataset.evidenceId);
  return true;
}

function syncRouteState() {
  if (!state.routeSyncReady || !window.history?.replaceState) return;
  const url = new URL(window.location.href);
  const params = url.searchParams;
  params.set("stage", state.currentStage);
  params.set("node", state.selectedNodeId);
  params.set("failure", state.selectedFailureId);
  params.set("evidence", state.selectedEvidenceId);
  if (state.presenterMode) {
    params.set("presenter", "1");
  } else {
    params.delete("presenter");
  }
  if (state.rehearsalIndex >= 0 && demoData.events[state.rehearsalIndex]) {
    params.set("event", demoData.events[state.rehearsalIndex].id);
  } else {
    params.delete("event");
  }
  url.search = params.toString();
  window.history.replaceState({
    stage: state.currentStage,
    node: state.selectedNodeId,
    failure: state.selectedFailureId,
    evidence: state.selectedEvidenceId,
    event: state.rehearsalIndex,
    presenter: state.presenterMode
  }, "", url);
}

function applyRouteStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const initialFailure = params.get("failure");
  const initialEvidence = params.get("evidence");
  const initialStage = params.get("stage");
  const initialNode = params.get("node");
  const initialEvent = params.get("event");
  const initialPresenter = params.get("presenter") === "1";

  if (initialFailure && demoData.failures.some((failure) => failure.id === initialFailure)) {
    selectFailurePath(initialFailure);
  }
  if (initialPresenter) setPresenterMode(true);
  if (initialEvidence && evidenceById.has(initialEvidence)) {
    state.selectedEvidenceId = initialEvidence;
  }
  if (initialStage && stageMeta[initialStage]) setStage(initialStage, { skipTransition: true });
  if (initialNode && graph.nodeMap.has(initialNode)) selectNode(initialNode);
  if (initialEvidence && evidenceById.has(initialEvidence)) {
    renderEvidencePreview([initialEvidence]);
    if (state.currentStage === "risk") renderRiskEvidence();
    if (state.currentStage === "decision") {
      renderDecisionTracePanel();
      renderDecisionEvidence();
    }
  }
  if (initialEvent) {
    const eventIndex = demoData.events.findIndex((event) => event.id === initialEvent);
    if (eventIndex >= 0) {
      state.rehearsalStarted = true;
      state.rehearsalPaused = true;
      setText("rehearsalPauseButton", "계속");
      showEvent(eventIndex);
      const eventFailure = initialFailure && demoData.events[eventIndex].linked_risks.includes(initialFailure);
      if (initialStage === "risk" && eventFailure) {
        selectFailurePath(initialFailure, { sourceEventId: initialEvent });
      }
    }
  }
}

function bindEvents() {
  document.querySelectorAll(".workspace-tab").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      runStageNavigationTransition(button.dataset.stage);
    });
    button.addEventListener("keydown", handleWorkspaceTabKeydown);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-briefing-action]");
    if (!trigger) return;
    event.preventDefault();
    runBriefingAction(trigger.dataset.briefingAction, trigger.dataset.briefingRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-aar-action]");
    if (!trigger) return;
    event.preventDefault();
    runAarAction(trigger.dataset.aarAction, trigger.dataset.aarRef);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-audit-action]");
    if (!trigger) return;
    event.preventDefault();
    runAuditAction(trigger.dataset.auditAction, trigger.dataset.auditRef);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-submit-action]");
    if (!trigger) return;
    event.preventDefault();
    runSubmissionAction(trigger.dataset.submitAction, trigger.dataset.submitRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-retrain-action]");
    if (!trigger) return;
    event.preventDefault();
    runRetrainingAction(trigger.dataset.retrainAction, trigger.dataset.retrainRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-handoff-action]");
    if (!trigger) return;
    event.preventDefault();
    runHandoffAction(trigger.dataset.handoffAction, trigger.dataset.handoffRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-metrics-action]");
    if (!trigger) return;
    event.preventDefault();
    runMetricsAction(trigger.dataset.metricsAction, trigger.dataset.metricsRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-watch-action]");
    if (!trigger) return;
    event.preventDefault();
    runWatchAction(trigger.dataset.watchAction, trigger.dataset.watchRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-log-action]");
    if (!trigger) return;
    event.preventDefault();
    runLogAction(trigger.dataset.logAction, trigger.dataset.logRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-challenge-action]");
    if (!trigger) return;
    event.preventDefault();
    runChallengeAction(trigger.dataset.challengeAction, trigger.dataset.challengeRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-queue-action]");
    if (!trigger) return;
    event.preventDefault();
    runActionQueueAction(trigger.dataset.queueAction, trigger.dataset.queueRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-forecast-action]");
    if (!trigger) return;
    event.preventDefault();
    runForecastAction(trigger.dataset.forecastAction, trigger.dataset.forecastRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-broadcast-action]");
    if (!trigger) return;
    event.preventDefault();
    runBroadcastAction(trigger.dataset.broadcastAction, trigger.dataset.broadcastRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-receipt-action]");
    if (!trigger) return;
    event.preventDefault();
    runReceiptAction(trigger.dataset.receiptAction, trigger.dataset.receiptRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-closeout-action]");
    if (!trigger) return;
    event.preventDefault();
    runCloseoutAction(trigger.dataset.closeoutAction, trigger.dataset.closeoutRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-lesson-action]");
    if (!trigger) return;
    event.preventDefault();
    runLessonAction(trigger.dataset.lessonAction, trigger.dataset.lessonRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-nextop-action]");
    if (!trigger) return;
    event.preventDefault();
    runNextOperationAction(trigger.dataset.nextopAction, trigger.dataset.nextopRef, trigger);
  });
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-prefill-action]");
    if (!trigger) return;
    event.preventDefault();
    runPrefillAction(trigger.dataset.prefillAction, trigger.dataset.prefillRef, trigger);
  });
  document.querySelectorAll(".mode-button[data-graph-mode]").forEach((button) => {
    button.addEventListener("click", () => setGraphMode(button.dataset.graphMode));
  });
  byId("openMissionSearch").addEventListener("click", () => openMissionSearch());
  byId("nextStageButton")?.addEventListener("click", goToNextStage);
  byId("openEvidenceTrace").addEventListener("click", () => openEvidenceTrace());
  byId("openBriefingSheet").addEventListener("click", () => openBriefingSheet());
  byId("togglePresenterModeButton").addEventListener("click", togglePresenterMode);
  byId("toggleFocusModeButton").addEventListener("click", toggleFocusMode);
  byId("missionSearchInput").addEventListener("input", (event) => {
    renderMissionSearchResults(event.target.value);
  });
  byId("missionSearchResults").addEventListener("click", (event) => {
    const resultButton = event.target.closest("[data-search-result-id]");
    if (resultButton) applyMissionSearchResult(resultButton.dataset.searchResultId);
  });
  document.querySelectorAll("[data-close-mission-search]").forEach((trigger) => {
    trigger.addEventListener("click", closeMissionSearch);
  });
  document.querySelectorAll("[data-close-evidence-trace]").forEach((trigger) => {
    trigger.addEventListener("click", closeEvidenceTrace);
  });
  document.querySelectorAll("[data-close-briefing-sheet]").forEach((trigger) => {
    trigger.addEventListener("click", closeBriefingSheet);
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openMissionSearch();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
      event.preventDefault();
      openEvidenceTrace();
      return;
    }
    if (event.key === "/" && !isEditableTarget(event.target)) {
      event.preventDefault();
      openMissionSearch();
      return;
    }
    if (activateEvidenceKeyboardTarget(event)) return;
    if (event.key === "Escape" && !byId("missionSearchModal").hidden) {
      closeMissionSearch();
      return;
    }
    if (event.key === "Escape" && !byId("evidenceTraceDrawer").hidden) {
      closeEvidenceTrace();
      return;
    }
    if (event.key === "Escape" && !byId("briefingSheetDrawer").hidden) {
      closeBriefingSheet();
      return;
    }
    if (event.key === "Escape" && state.presenterMode) {
      setPresenterMode(false);
      return;
    }
    if (event.key === "Escape" && state.focusMode) {
      setFocusMode(false);
    }
  });
  byId("loadScenarioButton").addEventListener("click", loadScenario);
  byId("generateAgentsButton").addEventListener("click", generateAgents);
  byId("runRehearsalButton").addEventListener("click", runRehearsal);
  byId("rehearsalRunInlineButton")?.addEventListener("click", runRehearsal);
  byId("autoDemoButton").addEventListener("click", runAutoDemo);
  byId("resetDemoButton").addEventListener("click", resetDemo);
  byId("runCycle").addEventListener("click", runStaffCycle);
  byId("focusGraph").addEventListener("click", () => {
    setStage("ontology");
    setGraphMode("all");
    selectNode("decision");
  });
  byId("rehearsalPauseButton").addEventListener("click", toggleRehearsalPause);
  byId("rehearsalRestartButton").addEventListener("click", restartRehearsalFromStart);
  byId("rehearsalSpeedButton").addEventListener("click", toggleRehearsalSpeed);
  byId("rehearsalMapSpeedButton")?.addEventListener("click", toggleRehearsalSpeed);
  byId("terrainAnalysisButton").addEventListener("click", () => window.WarGround3D?.showTerrainAnalysis?.());
  byId("commanderViewButton").addEventListener("click", () => window.WarGround3D?.showCommanderResult?.());
  byId("strikeReplayButton").addEventListener("click", playStrikeReplay);
  byId("compareLlmButton").addEventListener("click", () => {
    state.compareLlm = !state.compareLlm;
    byId("compareLlmButton").classList.toggle("is-active", state.compareLlm);
    renderRiskStack();
  });
  byId("decisionTabCard").addEventListener("click", () => setDecisionTab("card"));
  byId("decisionTabOrder").addEventListener("click", () => setDecisionTab("order"));
  byId("exportDecisionButton").addEventListener("click", exportDecision);
  byId("copyBriefingLink").addEventListener("click", copyBriefingLink);
  byId("copyBriefingText").addEventListener("click", copyBriefingText);
  byId("exportBriefingPacket").addEventListener("click", exportBriefingPacket);
  document.body.addEventListener("click", (event) => {
    const demoCueAction = event.target.closest("[data-demo-cue-action]");
    if (demoCueAction) {
      runDemoCueAction(demoCueAction.dataset.demoCueAction);
      return;
    }
    const missionAction = event.target.closest("[data-mission-action]");
    if (missionAction) {
      runMissionAction(missionAction.dataset.missionAction);
      return;
    }
    const traceAction = event.target.closest("[data-trace-action]");
    if (traceAction) {
      runEvidenceTraceAction(traceAction.dataset.traceAction, traceAction.dataset.traceRef);
      return;
    }
    const decisionExecutionAction = event.target.closest("[data-decision-execution-action]");
    if (decisionExecutionAction) {
      runDecisionExecutionAction(
        decisionExecutionAction.dataset.decisionExecutionAction,
        decisionExecutionAction.dataset.decisionExecutionRef
      );
      return;
    }
    const decisionCondition = event.target.closest("[data-decision-condition]");
    if (decisionCondition) {
      toggleDecisionCondition(decisionCondition.dataset.decisionCondition);
      return;
    }
    const intakeAction = event.target.closest("[data-intake-quality-action]");
    if (intakeAction) {
      runIntakeQualityAction(intakeAction.dataset.intakeQualityAction);
      return;
    }
    const pathButton = event.target.closest("[data-path-node-id]");
    if (pathButton) {
      selectNode(pathButton.dataset.pathNodeId);
      return;
    }
    const inspectorNodeButton = event.target.closest("[data-inspector-node-id]");
    if (inspectorNodeButton) {
      selectNode(inspectorNodeButton.dataset.inspectorNodeId);
      return;
    }
    const rehearsalAction = event.target.closest("[data-rehearsal-action]");
    if (rehearsalAction) {
      runRehearsalInterventionAction(rehearsalAction.dataset.rehearsalAction, rehearsalAction.dataset.rehearsalRef);
      return;
    }
    const conversationTab = event.target.closest("[data-agent-conversation-tab]");
    if (conversationTab) {
      state.agentConversationTab = conversationTab.dataset.agentConversationTab || "live";
      renderAgentRadioLog();
      return;
    }
    const coverageButton = event.target.closest("[data-coverage-failure-id]");
    if (coverageButton) {
      selectFailurePath(coverageButton.dataset.coverageFailureId);
      return;
    }
    const failureButton = event.target.closest("[data-failure-id]");
    if (failureButton) {
      selectFailurePath(failureButton.dataset.failureId);
      return;
    }
    const filterButton = event.target.closest("[data-agent-filter]");
    if (filterButton) {
      setAgentFilter(filterButton.dataset.agentFilter);
      return;
    }
    const synergyButton = event.target.closest("[data-synergy-agent-id]");
    if (synergyButton) {
      const linkedAgent = getAgentById(synergyButton.dataset.synergyAgentId);
      if (linkedAgent) {
        const linkedProfile = getAgentProfile(linkedAgent);
        if (state.agentFilter !== "all" && !matchesAgentFilter(linkedProfile)) {
          state.agentFilter = linkedProfile.faction;
        }
        selectAgentProfile(linkedAgent.id);
      }
      return;
    }
    const agentCard = event.target.closest("[data-agent-id]");
    if (agentCard) {
      selectAgentProfile(agentCard.dataset.agentId);
      return;
    }
    const button = event.target.closest("[data-evidence-id]");
    if (button) {
      selectEvidence(button.dataset.evidenceId);
    }
    const scrubButton = event.target.closest("[data-scrub-event-index]");
    if (scrubButton) {
      clearTimer("rehearsalTimer");
      state.rehearsalStarted = true;
      state.rehearsalPaused = true;
      setText("rehearsalPauseButton", "계속");
      showEvent(Number(scrubButton.dataset.scrubEventIndex));
      updateFlow("rehearsal");
      return;
    }
    const timeline = event.target.closest("[data-event-index]");
    if (timeline) {
      state.rehearsalPaused = true;
      setText("rehearsalPauseButton", "계속");
      showEvent(Number(timeline.dataset.eventIndex));
    }
  });
}

const workspacePageFiles = [
  "pages/01-data.html",
  "pages/02-ontology.html",
  "pages/03-agents.html",
  "pages/04-rehearsal.html",
  "pages/05-risk.html",
  "pages/06-decision.html",
  "pages/07-briefing.html",
  "pages/08-aar.html",
  "pages/09-audit.html",
  "pages/10-submit.html",
  "pages/11-retrain.html",
  "pages/12-handoff.html",
  "pages/13-metrics.html",
  "pages/14-watch.html",
  "pages/15-log.html",
  "pages/16-challenge.html",
  "pages/17-queue.html",
  "pages/18-forecast.html",
  "pages/19-broadcast.html",
  "pages/20-receipt.html",
  "pages/21-closeout.html",
  "pages/22-lessons.html",
  "pages/23-nextop.html",
  "pages/24-prefill.html"
];

async function loadWorkspacePages() {
  const host = byId("workspacePages");
  if (!host || host.dataset.pagesLoaded === "true") return;
  if (host.querySelector("[data-page]")) {
    host.dataset.pagesLoaded = "true";
    return;
  }
  throw new Error(`페이지 모듈이 index.html에 포함되지 않았습니다: ${workspacePageFiles.join(", ")}`);
}

function setupGuideToggles() {
  document.querySelectorAll(".page-guide-strip, .risk-guide-strip").forEach((strip) => {
    if (strip.dataset.toggleReady === "true") return;
    strip.dataset.toggleReady = "true";
    strip.classList.add("is-collapsed");
    const label = strip.getAttribute("aria-label") || "가이드";
    const button = document.createElement("button");
    button.className = "guide-toggle-button";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", `${label} 펼치기`);
    const setGuideButtonState = (collapsed) => {
      button.innerHTML = `<i data-lucide="${collapsed ? "chevron-down" : "chevron-up"}" aria-hidden="true"></i><span>${collapsed ? "읽는 법" : "접기"}</span>`;
    };
    setGuideButtonState(true);
    button.addEventListener("click", () => {
      const collapsed = strip.classList.toggle("is-collapsed");
      button.setAttribute("aria-expanded", String(!collapsed));
      button.setAttribute("aria-label", `${label} ${collapsed ? "펼치기" : "접기"}`);
      setGuideButtonState(collapsed);
      refreshIcons();
    });
    strip.prepend(button);
  });
  refreshIcons();
}

function setupPanelModal() {
  const modal = byId("panelModal");
  const modalTitle = byId("panelModalTitle");
  const modalBody = byId("panelModalBody");
  if (!modal || !modalTitle || !modalBody) return;
  let lastPanelModalTrigger = null;

  const closeModal = () => {
    modal.hidden = true;
    modalBody.innerHTML = "";
    lastPanelModalTrigger?.focus();
    lastPanelModalTrigger = null;
  };

  modal.querySelectorAll("[data-close-panel-modal]").forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  const addPanelButtons = () => {
    let appended = false;
    document.querySelectorAll(".hard-panel").forEach((panel, index) => {
      const heading = panel.querySelector(":scope > .panel-heading");
      if (!heading || heading.querySelector(".panel-popout-button")) return;
      const title = heading.querySelector("span")?.textContent?.trim() || `상세 정보 ${index + 1}`;
      const button = document.createElement("button");
      button.className = "panel-popout-button";
      button.type = "button";
      button.title = "팝업으로 보기";
      button.innerHTML = `<i data-lucide="maximize-2" aria-hidden="true"></i><span class="sr-only">팝업으로 보기</span>`;
      button.setAttribute("aria-label", `${title} 팝업으로 보기`);
      button.addEventListener("click", () => {
        lastPanelModalTrigger = button;
        const clone = panel.cloneNode(true);
        clone.querySelectorAll(".panel-popout-button").forEach((item) => item.remove());
        modalTitle.textContent = title;
        modalBody.innerHTML = "";
        modalBody.append(clone);
        modal.hidden = false;
        window.requestAnimationFrame(() => modal.querySelector("button[data-close-panel-modal]")?.focus());
      });
      heading.append(button);
      appended = true;
    });
    if (appended) refreshIcons();
  };

  addPanelButtons();
  if (modal.dataset.observePanels !== "true") {
    modal.dataset.observePanels = "true";
    new MutationObserver(addPanelButtons).observe(byId("workspacePages"), { childList: true, subtree: true });
  }
}

function setupCompactPageControls() {
  setupGuideToggles();
  setupPanelModal();
}

function boot() {
  renderScenarioShell();
  renderGraph();
  renderAgentLayers();
  renderDebate();
  renderStaffMatrix();
  renderRiskStack();
  renderSelectedFailureStory();
  renderFailureLens();
  renderRiskMetricMatrix();
  renderFailureCoverageMatrix();
  renderFailureChains();
  renderMitigationBoard();
  renderRiskEvidence();
  renderDecisionScoreboard();
  renderDecisionCard();
  renderFragmentaryOrder();
  renderCommanderChecklist();
  renderDecisionTracePanel();
  renderDecisionEvidence();
  resetRehearsal();
  bindEvents();
  updateStats();
  updateDemoClock();
  setStage(state.currentStage);
  window.setInterval(tickDemoClock, 1000);
  applyRouteStateFromUrl();
  state.routeSyncReady = true;
  const params = new URLSearchParams(window.location.search);
  if (params.get("auto") === "1") {
    window.setTimeout(runAutoDemo, 100);
  }
  renderPageBriefings();
  refreshIcons();
}

async function bootApp() {
  try {
    await loadWorkspacePages();
    boot();
    setupCompactPageControls();
  } catch (error) {
    console.error(error);
    const host = byId("workspacePages");
    if (host) {
      host.innerHTML = `
        <section class="page-view is-active">
          <div class="hard-panel">
            <div class="panel-heading"><span>화면 모듈</span><b>로드 실패</b></div>
            <p>분리된 페이지 파일을 불러오지 못했습니다. 로컬 서버에서 실행 중인지 확인하세요.</p>
          </div>
        </section>
      `;
    }
  }
}

bootApp();
