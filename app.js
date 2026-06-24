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
  decision: { phase: "결심카드", alert: "B안 우선" }
};

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
  }
};

const REHEARSAL_EVENT_DURATION_MS = 4200;

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
  autoTimer: null,
  transitionTimer: null,
  compareLlm: false,
  demoRemaining: 210,
  selectedAgentId: "red_team_agent",
  agentFilter: "all",
  selectedFailureId: "command_gap",
  selectedEvidenceId: "ev_comm_gap",
  focusMode: false,
  presenterMode: false,
  lastRehearsalRiskEventId: null,
  decisionConditionState: {
    comms: true,
    logistics: true,
    rejudge: true,
    evac: true
  },
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
  overlay.hidden = false;
  overlay.classList.add("stage-transition-overlay");
  overlay.classList.remove("is-leaving");
  overlay.classList.add("is-active");
  document.body.classList.add("is-stage-transitioning");
  const duration = overrides.duration || 780;
  state.transitionTimer = window.setTimeout(() => completeStageTransition(stage), duration);
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
  return `
    <span class="${className}" aria-hidden="true">
      <i data-lucide="${profile.personIcon}"></i>
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
    ]
  };

  return pageItems[page] || [];
}

function getPageInsightItems(page) {
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

function getDemoJudgeCue() {
  const selectedFailure = getFailureById(state.selectedFailureId);
  const selectedFailureProfile = getFailureProfile(selectedFailure);
  const activeEvent = state.rehearsalIndex >= 0 ? demoData.events[state.rehearsalIndex] : null;
  const generatedPercent = demoData.agents.length ? Math.round((state.generatedAgentCount / demoData.agents.length) * 100) : 0;
  const evidenceTotal = new Set(demoData.failures.flatMap((failure) => failure.evidence)).size;
  const activeConditions = getActiveDecisionConditionIds().size;
  const stageIndex = ["data", "ontology", "agents", "rehearsal", "risk", "decision"].indexOf(state.currentStage) + 1;
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
    }
  };
  return {
    step: stageIndex > 0 ? `${String(stageIndex).padStart(2, "0")}/06` : "시연",
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
    }
  ];
}

function renderDemoRunSheet() {
  const target = byId("demoRunSheet");
  if (!target) return;
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
    if (!state.agentsGenerated) generateAgents();
    else runRehearsal();
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
  }
}

function renderPageBriefings() {
  document.querySelectorAll(".page-view[data-page]").forEach((page) => {
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

function buildGraph() {
  const nodes = [
    { id: "docPlan", kind: "document", tier: "key", x: 510, y: 85, size: 10, label: "작전계획서", meta: "PDF", detail: "임무, 기동 단계, 제한사항, 재판단 기준을 추출한 원천 문서.", evidence_ids: ["ev_plan_mission"] },
    { id: "docCoa", kind: "document", tier: "key", x: 325, y: 105, size: 8, label: "COA 표", meta: "XLSX", detail: "A/B/C 방책의 속도, 위험, 보급 소요, 시간 여유를 정규화한 표.", evidence_ids: ["ev_coa_a", "ev_coa_b"] },
    { id: "docComm", kind: "document", tier: "key", x: 155, y: 330, size: 8, label: "통신 지도", meta: "PNG", detail: "A안 중간 구간의 통신 음영과 예비 중계 후보지를 표시한 지도.", evidence_ids: ["ev_comm_gap"] },
    { id: "docLog", kind: "document", tier: "key", x: 220, y: 485, size: 8, label: "군수 현황", meta: "XLSX", detail: "보급 대기점, 정비 가능 시간, 연료 지속성을 제공하는 군수 자료.", evidence_ids: ["ev_logistics_supply"] },
    { id: "docWeather", kind: "document", tier: "key", x: 805, y: 285, size: 8, label: "기상 JSON", meta: "JSON", detail: "새벽 안개, 시정 저하, 시간대별 기상 위험을 제공.", evidence_ids: ["ev_weather_fog"] },
    { id: "docSop", kind: "document", tier: "key", x: 410, y: 620, size: 8, label: "SOP 발췌", meta: "TXT", detail: "중단/전환/증원 요청 기준의 존재 여부를 검증하는 규정 텍스트.", evidence_ids: ["ev_sop_criteria"] },
    { id: "mission", kind: "factor", tier: "key", x: 500, y: 170, size: 11, label: "임무 목표", meta: "MISSION", detail: "제한 시간 내 지정 집결지 도착과 예비대 전개태세 유지.", evidence_ids: ["ev_plan_mission"] },
    { id: "coaA", kind: "coa", tier: "key", x: 285, y: 230, size: 10, label: "A안 최단경로", meta: "위험 높음", detail: "가장 빠르지만 통신 음영, 적 지연행동, 보급 여유 부족이 동시에 걸림.", evidence_ids: ["ev_coa_a"] },
    { id: "coaB", kind: "coa", tier: "key", x: 512, y: 310, size: 11, label: "B안 우회경로", meta: "추천", detail: "이동 시간은 늘지만 통신과 보급 리스크가 분산되어 최종 추천 방책.", evidence_ids: ["ev_coa_b"] },
    { id: "coaC", kind: "coa", tier: "key", x: 742, y: 215, size: 9, label: "C안 단계전개", meta: "예비", detail: "예비대 운용 여지는 있으나 임무 완료 시간이 늘어나는 예비 방책.", evidence_ids: ["ev_coa_b"] },
    { id: "enemyDelay", kind: "factor", tier: "key", x: 770, y: 400, size: 9, label: "적 지연행동", meta: "ENEMY", detail: "협곡 입구와 교차로에서 A안 선두 제대를 묶을 가능성.", evidence_ids: ["ev_redteam_delay"] },
    { id: "commGap", kind: "factor", tier: "key", x: 290, y: 350, size: 9, label: "통신 음영", meta: "COMMS", detail: "A안 2단계 중간 18분 구간에서 음성/데이터 갱신이 불안정.", evidence_ids: ["ev_comm_gap"] },
    { id: "supplyPoint", kind: "factor", tier: "key", x: 445, y: 455, size: 8, label: "보급 대기점", meta: "LOG", detail: "추가 대기점 없이는 2단계 이후 지속성이 낮아짐.", evidence_ids: ["ev_logistics_supply"] },
    { id: "fog", kind: "factor", tier: "key", x: 705, y: 510, size: 8, label: "새벽 안개", meta: "WX", detail: "시정 저하로 속도와 사고 대응 시간을 동시에 악화.", evidence_ids: ["ev_weather_fog"] },
    { id: "evacRoute", kind: "factor", tier: "key", x: 705, y: 600, size: 8, label: "후송 경로", meta: "MED", detail: "주 후송로가 협소하여 사고 발생 시 대체로 지정 필요.", evidence_ids: ["ev_evac_route"] },
    { id: "sopCriteria", kind: "factor", tier: "key", x: 500, y: 600, size: 8, label: "재판단 기준", meta: "SOP", detail: "중단, 전환, 증원 요청 기준을 결심카드에 명시해야 함.", evidence_ids: ["ev_sop_criteria"] },
    { id: "commAgent", kind: "agent", tier: "key", x: 105, y: 360, size: 8, label: "통신참모", meta: "AGENT", detail: "음영지역과 예비 중계 수단을 분석.", evidence_ids: ["ev_comm_gap"] },
    { id: "logAgent", kind: "agent", tier: "key", x: 118, y: 525, size: 8, label: "군수참모", meta: "AGENT", detail: "보급 대기점, 정비 시간, 연료 지속성을 검토.", evidence_ids: ["ev_logistics_supply"] },
    { id: "redAgent", kind: "agent", tier: "key", x: 885, y: 485, size: 8, label: "레드팀", meta: "AGENT", detail: "방책별 실패경로를 공격적으로 탐색.", evidence_ids: ["ev_redteam_delay"] },
    { id: "judgeAgent", kind: "agent", tier: "key", x: 650, y: 650, size: 8, label: "심판관", meta: "AGENT", detail: "최종 결심카드와 근거 체인을 검증.", evidence_ids: ["ev_coa_b", "ev_sop_criteria"] },
    { id: "riskCmdGap", kind: "risk", tier: "key", x: 365, y: 525, size: 10, label: "지휘공백", meta: "RISK 92", detail: "통신 음영과 적 지연행동이 결합된 최상위 실패경로.", evidence_ids: ["ev_comm_gap", "ev_redteam_delay"] },
    { id: "riskSustain", kind: "risk", tier: "key", x: 550, y: 540, size: 9, label: "지속성 저하", meta: "RISK 84", detail: "보급 대기점 부족과 정비 제한이 결합된 지속 운용 실패경로.", evidence_ids: ["ev_logistics_supply"] },
    { id: "riskAccident", kind: "risk", tier: "key", x: 780, y: 640, size: 9, label: "사고 대응 지연", meta: "RISK 78", detail: "새벽 안개와 후송 경로 제약이 결합된 사고 대응 실패경로.", evidence_ids: ["ev_weather_fog", "ev_evac_route"] },
    { id: "riskRejudge", kind: "risk", tier: "key", x: 465, y: 675, size: 8, label: "재판단 지연", meta: "RISK 73", detail: "SOP 기준 미명시로 중단/전환 판단이 지연되는 실패경로.", evidence_ids: ["ev_sop_criteria"] },
    { id: "decision", kind: "decision", tier: "key", x: 635, y: 550, size: 12, label: "결심카드", meta: "B안 우선", detail: "B안을 우선 추천하고 A안은 예비 통신, 보급 대기점, 재판단 기준 보완 후 조건부 승인.", evidence_ids: ["ev_coa_b", "ev_comm_gap", "ev_logistics_supply", "ev_sop_criteria"] }
  ];

  const edges = [
    ["docPlan", "mission", "evidence", "추출"],
    ["docCoa", "coaA", "evidence", "정규화"],
    ["docCoa", "coaB", "evidence", "정규화"],
    ["docCoa", "coaC", "evidence", "정규화"],
    ["mission", "coaA", "semantic", "후보"],
    ["mission", "coaB", "semantic", "후보"],
    ["mission", "coaC", "semantic", "후보"],
    ["coaA", "commGap", "failure", "노출"],
    ["coaA", "enemyDelay", "failure", "취약"],
    ["coaA", "supplyPoint", "failure", "소모"],
    ["coaB", "decision", "decision", "추천"],
    ["coaC", "decision", "decision", "예비"],
    ["docComm", "commGap", "evidence", "커버리지"],
    ["commAgent", "commGap", "debate", "주장"],
    ["commGap", "riskCmdGap", "failure", "단절"],
    ["redAgent", "enemyDelay", "debate", "가설"],
    ["enemyDelay", "riskCmdGap", "failure", "지연"],
    ["riskCmdGap", "decision", "decision", "조건"],
    ["docLog", "supplyPoint", "evidence", "현황"],
    ["logAgent", "supplyPoint", "debate", "검증"],
    ["supplyPoint", "riskSustain", "failure", "부족"],
    ["riskSustain", "decision", "decision", "보완"],
    ["docWeather", "fog", "evidence", "예보"],
    ["fog", "riskAccident", "failure", "시정"],
    ["evacRoute", "riskAccident", "failure", "후송"],
    ["riskAccident", "decision", "decision", "대체로"],
    ["docSop", "sopCriteria", "evidence", "규정"],
    ["sopCriteria", "riskRejudge", "failure", "미명시"],
    ["riskRejudge", "decision", "decision", "명시"],
    ["judgeAgent", "decision", "decision", "검증"]
  ].map(([from, to, mode, label]) => ({ from, to, mode, label }));

  const supportSpecs = [
    ["evp", "docPlan", "mission", "evidence", 7],
    ["eva", "docCoa", "coaA", "evidence", 5],
    ["evb", "docCoa", "coaB", "evidence", 5],
    ["evc", "docComm", "commGap", "evidence", 6],
    ["evl", "docLog", "supplyPoint", "evidence", 5],
    ["evw", "docWeather", "fog", "evidence", 5],
    ["evs", "docSop", "sopCriteria", "evidence", 5],
    ["deb", "redAgent", "decision", "debate", 6]
  ];
  supportSpecs.forEach(([prefix, from, to, mode, count], groupIndex) => {
    const source = nodes.find((node) => node.id === from);
    const target = nodes.find((node) => node.id === to);
    for (let i = 0; i < count; i += 1) {
      const ratio = (i + 1) / (count + 1);
      const wave = Math.sin((i + groupIndex) * 1.7) * 42;
      const node = {
        id: `${prefix}${i}`,
        kind: mode === "debate" ? "debate" : "evidence",
        tier: "support",
        x: source.x + (target.x - source.x) * ratio + wave,
        y: source.y + (target.y - source.y) * ratio + Math.cos((i + groupIndex) * 1.3) * 34,
        size: mode === "debate" ? 3.7 : 3.1,
        label: mode === "debate" ? `토론 ${i + 1}` : `근거 ${i + 1}`,
        meta: mode === "debate" ? "토론" : "근거",
        detail: `${source.label}에서 ${target.label}(으)로 이어지는 ${mode === "debate" ? "토론" : "근거"} 연결 노드.`
      };
      nodes.push(node);
      edges.push({ from, to: node.id, mode, label: mode === "debate" ? "발언" : "근거" });
      edges.push({ from: node.id, to, mode, label: "연결" });
    }
  });

  return { nodes, edges, nodeMap: new Map(nodes.map((node) => [node.id, node])) };
}

const graph = buildGraph();

function getOntologyNodeStyle(node) {
  const styleMap = {
    document: { className: "is-ontology-document", label: "문서", confidence: 94, layer: "source" },
    evidence: { className: "is-ontology-evidence", label: "근거", confidence: 82, layer: "source" },
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
    { key: "course", label: "방책·제약", kinds: ["coa", "factor"], detail: "전술 의미" },
    { key: "review", label: "에이전트·토론", kinds: ["agent", "debate"], detail: "검토 발화" },
    { key: "risk", label: "실패경로", kinds: ["risk"], detail: "위험 인과" },
    { key: "decision", label: "결심", kinds: ["decision"], detail: "승인 후보" }
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
    <span>SELECTED SEMANTIC ROUTE</span>
    <b>${node.label}</b>
    <em>${directEdges.length} relations${topModes ? ` / ${topModes}` : ""}</em>
  `;
}

function renderOntologyLayerRings() {
  const grid = qs(".grid-lines");
  if (!grid) return;
  [
    { key: "source", cx: 270, cy: 335, rx: 240, ry: 252, label: "SOURCE" },
    { key: "course", cx: 510, cy: 345, rx: 310, ry: 235, label: "COURSE / FACTOR" },
    { key: "risk", cx: 585, cy: 545, rx: 260, ry: 145, label: "FAILURE PATH" },
    { key: "decision", cx: 635, cy: 550, rx: 92, ry: 72, label: "COMMAND" }
  ].forEach((ring) => {
    grid.appendChild(makeSvg("ellipse", {
      cx: ring.cx,
      cy: ring.cy,
      rx: ring.rx,
      ry: ring.ry,
      class: `ontology-layer-ring is-${ring.key}`
    }));
    const label = makeSvg("text", {
      x: ring.cx - ring.rx + 18,
      y: ring.cy - ring.ry + 26,
      class: "ontology-layer-label"
    });
    label.textContent = ring.label;
    grid.appendChild(label);
  });
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
  return state.graphMode === "all" || edge.mode === state.graphMode || (state.graphMode === "evidence" && edge.mode === "debate");
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
  for (let x = 0; x <= 1000; x += 50) {
    grid.appendChild(makeSvg("line", { x1: x, y1: 0, x2: x, y2: 700, class: "graph-grid-line" }));
  }
  for (let y = 0; y <= 700; y += 50) {
    grid.appendChild(makeSvg("line", { x1: 0, y1: y, x2: 1000, y2: y, class: "graph-grid-line" }));
  }
  renderOntologyLayerRings();
}

function renderEdges() {
  const edgeLayer = byId("edgeLayer");
  if (!edgeLayer) return;
  edgeLayer.innerHTML = "";
  graph.edges.forEach((edge, index) => {
    const source = graph.nodeMap.get(edge.from);
    const target = graph.nodeMap.get(edge.to);
    if (!source || !target) return;
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const curve = ((index % 5) - 2) * 9;
    const path = makeSvg("path", {
      d: `M ${source.x} ${source.y} C ${source.x + dx * 0.42} ${source.y + dy * 0.22 - curve}, ${source.x + dx * 0.58} ${source.y + dy * 0.78 + curve}, ${target.x} ${target.y}`,
      class: `edge ${edge.mode} is-${edge.mode}${activeEdge(edge) ? "" : " muted"}`,
      "data-relation-mode": edge.mode
    });
    path.style.setProperty("--edge-order", String(index % 9));
    edgeLayer.appendChild(path);
  });
}

function renderNodes() {
  const nodeLayer = byId("nodeLayer");
  if (!nodeLayer) return;
  const activeIds = activeNodeIds();
  nodeLayer.innerHTML = "";
  graph.nodes.forEach((node) => {
    const isSelected = node.id === state.selectedNodeId;
    const ontologyStyle = getOntologyNodeStyle(node);
    const group = makeSvg("g", {
      class: `node ${node.kind} ${ontologyStyle.className}${isSelected ? " is-selected" : ""}${activeIds.has(node.id) ? "" : " is-dimmed"}`,
      tabindex: "0",
      role: "button",
      "aria-label": node.label,
      "data-node-id": node.id,
      "data-ontology-kind": node.kind,
      "data-ontology-tier": node.tier,
      "data-ontology-layer": ontologyStyle.layer
    });
    group.appendChild(makeSvg("circle", {
      cx: node.x,
      cy: node.y,
      r: node.size + (node.tier === "key" ? 12 : 7),
      class: "node-halo"
    }));
    group.appendChild(makeSvg("circle", {
      cx: node.x,
      cy: node.y,
      r: isSelected ? node.size + 3 : node.size,
      class: "node-dot"
    }));

    if (node.tier === "key" || isSelected) {
      const label = makeSvg("text", { x: node.x + node.size + 8, y: node.y - 4, class: "node-label" });
      label.textContent = node.label;
      const meta = makeSvg("text", { x: node.x + node.size + 8, y: node.y + 10, class: "node-meta" });
      meta.textContent = node.meta;
      const confidence = makeSvg("text", { x: node.x + node.size + 8, y: node.y + 24, class: "semantic-confidence" });
      confidence.textContent = `${ontologyStyle.label} ${ontologyStyle.confidence}%`;
      group.appendChild(label);
      group.appendChild(meta);
      group.appendChild(confidence);
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
  renderPageBriefings();
}

function setStage(stage) {
  const meta = stageMeta[stage];
  if (!meta) return;
  const previousStage = state.currentStage;
  if (previousStage !== stage) beginStageTransition(stage);
  state.currentStage = stage;
  document.body.dataset.stage = stage;
  document.querySelectorAll(".workspace-tab").forEach((button) => {
    const active = button.dataset.stage === stage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.setAttribute("aria-current", active ? "page" : "false");
    button.tabIndex = active ? 0 : -1;
  });
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
}

function handleWorkspaceTabKeydown(event) {
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
  if (!keys.includes(event.key)) return;
  const tabs = [...document.querySelectorAll(".workspace-tab")];
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
  setStage(nextTab.dataset.stage);
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
  syncRouteState();
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
    updateFlow("scenario");
    setText("alertLabel", "작전계획 접수 완료");
  }, 650);
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
  byId("runRehearsalButton").disabled = true;
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
    byId("runRehearsalButton").disabled = false;
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
    .map(
      (event, index) => `
        <button class="timeline-event ${index === state.rehearsalIndex ? "is-active" : ""} ${index < state.rehearsalIndex ? "is-complete" : ""} ${event.severity}" type="button" data-event-index="${index}">
          <span>${event.time}</span>
          <b>${event.event}</b>
          <em>${event.severity}</em>
        </button>
      `
    )
    .join("");
  renderRehearsalScrubber();
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

function renderAgentRadioLog() {
  const target = byId("agentRadioLog");
  if (!target) return;
  if (!state.radioLog.length) {
    target.innerHTML = `
      <div class="agent-radio-empty">
        <span>무전 대기</span>
        <b>리허설 이벤트가 진행되면 에이전트 교신이 기록됩니다.</b>
      </div>
    `;
    return;
  }
  target.innerHTML = state.radioLog
    .slice(0, 8)
    .map((item) => `
      <button type="button" class="agent-radio-log-row is-${item.tone}" data-radio-evidence-id="${item.evidence}" data-evidence-id="${item.evidence}">
        <span>${item.time} · ${item.channel}</span>
        <strong>${item.callsign}</strong>
        <b>${item.finding}</b>
        <em>${item.message}</em>
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
      time: event.time,
      tone: transmission.tone || (event.severity === "high" ? "red" : event.severity === "medium" ? "amber" : "blue"),
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
  byId("activeAgentChips").innerHTML = event.agents
    .map((agent) => `<span>${agent}</span>`)
    .join("");
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
  }, REHEARSAL_EVENT_DURATION_MS / state.rehearsalSpeed);
}

function runRehearsal() {
  if (!state.agentsGenerated) {
    generateAgents();
    return;
  }
  setStage("rehearsal");
  state.rehearsalStarted = true;
  state.rehearsalPaused = false;
  state.rehearsalIndex = 0;
  setText("rehearsalPauseButton", "일시정지");
  clearRadioTraffic();
  window.WarGround3D?.start?.();
  showEvent(0);
  updateFlow("rehearsal");
  scheduleNextEvent();
}

function restartRehearsalFromStart() {
  if (!state.agentsGenerated) {
    runRehearsal();
    return;
  }
  clearTimer("rehearsalTimer");
  state.rehearsalStarted = true;
  state.rehearsalPaused = false;
  state.rehearsalIndex = -1;
  setStage("rehearsal");
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
  window.__warGroundCurrentEventId = "start";
  document.body.dataset.rehearsalEventId = "start";
  renderTimeline();
  setText("timelineState", "대기");
  setText("rehearsalRiskLabel", "위험 대기");
  setText("activeAgentCount", "0명");
  const interventionOverlay = byId("rehearsalInterventionOverlay");
  if (interventionOverlay) interventionOverlay.innerHTML = "";
  byId("currentEventCard").innerHTML = "<span>대기</span><strong>수행 리허설 실행 버튼을 누르세요.</strong><p>시간순 이벤트와 관련 에이전트가 자동 재생됩니다.</p>";
  byId("activeAgentChips").innerHTML = "";
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
  state.rehearsalPaused = !state.rehearsalPaused;
  setText("rehearsalPauseButton", state.rehearsalPaused ? "계속" : "일시정지");
  window.WarGround3D?.setPlayback?.(!state.rehearsalPaused);
  if (!state.rehearsalPaused) scheduleNextEvent();
}

function toggleRehearsalSpeed() {
  state.rehearsalSpeed = state.rehearsalSpeed === 1 ? 2 : 1;
  setText("rehearsalSpeedButton", `속도 ${state.rehearsalSpeed}x`);
  window.WarGround3D?.setSpeed?.(state.rehearsalSpeed);
  if (state.rehearsalStarted && !state.rehearsalPaused) scheduleNextEvent();
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
  state.compareLlm = false;
  state.demoRemaining = 210;
  state.selectedAgentId = "red_team_agent";
  state.agentFilter = "all";
  state.selectedFailureId = "command_gap";
  state.selectedEvidenceId = "ev_comm_gap";
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
  setText("rehearsalSpeedButton", "속도 1x");
  byId("agentProgressBar").style.width = "0%";
  byId("constraintGrid").innerHTML = "";
  byId("coaTable").innerHTML = "";
  byId("generateAgentsButton").disabled = true;
  byId("runRehearsalButton").disabled = true;
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
    setText("autoDemoStepLabel", "결심카드 준비 완료");
    setText("autoDemoStepDetail", "검토안, 근거, 단편명령 작성안까지 자동 생성되었습니다.");
    document.body.classList.remove("is-auto-demo-running");
    updateFlow("decision");
    setStage("decision");
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
  if (initialStage && stageMeta[initialStage]) setStage(initialStage);
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
    button.addEventListener("click", () => setStage(button.dataset.stage));
    button.addEventListener("keydown", handleWorkspaceTabKeydown);
  });
  document.querySelectorAll(".mode-button[data-graph-mode]").forEach((button) => {
    button.addEventListener("click", () => setGraphMode(button.dataset.graphMode));
  });
  byId("openMissionSearch").addEventListener("click", () => openMissionSearch());
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
    const rehearsalAction = event.target.closest("[data-rehearsal-action]");
    if (rehearsalAction) {
      runRehearsalInterventionAction(rehearsalAction.dataset.rehearsalAction, rehearsalAction.dataset.rehearsalRef);
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
  "pages/06-decision.html"
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
