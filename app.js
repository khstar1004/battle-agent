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
  compareLlm: false,
  demoRemaining: 210,
  selectedAgentId: "red_team_agent",
  agentFilter: "all",
  selectedFailureId: "command_gap",
  radioLog: [],
  radioTimers: [],
  radioSerial: 0
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
      class: `edge ${edge.mode}${activeEdge(edge) ? "" : " muted"}`
    });
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
    const group = makeSvg("g", {
      class: `node ${node.kind}${isSelected ? " is-selected" : ""}${activeIds.has(node.id) ? "" : " is-dimmed"}`,
      tabindex: "0",
      role: "button",
      "aria-label": node.label,
      "data-node-id": node.id
    });
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
      group.appendChild(label);
      group.appendChild(meta);
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
  renderGrid();
  renderEdges();
  renderNodes();
  updateSelectedNode();
}

function selectNode(nodeId) {
  state.selectedNodeId = nodeId;
  renderEdges();
  renderNodes();
  updateSelectedNode();
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
}

function setGraphMode(mode) {
  state.graphMode = mode;
  document.querySelectorAll(".mode-button[data-graph-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.graphMode === mode);
  });
  renderEdges();
  renderNodes();
}

function setStage(stage) {
  const meta = stageMeta[stage];
  if (!meta) return;
  state.currentStage = stage;
  document.querySelectorAll(".workspace-tab").forEach((button) => {
    const active = button.dataset.stage === stage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".page-view").forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === stage);
  });
  setText("phaseLabel", meta.phase);
  setText("alertLabel", meta.alert);
  if (stage === "risk") setGraphMode("failure");
  if (stage === "decision") setGraphMode("decision");
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
}

function evidenceBadge(item) {
  if (!item) return "";
  return `
    <article class="evidence-item ${item.status === "추정" ? "is-estimate" : ""} ${item.status === "추가 확인 필요" ? "is-check" : ""}" data-evidence-id="${item.id}">
      <div>
        <b>${item.title}</b>
        <span>${item.type} / ${item.source}</span>
      </div>
      <em>${item.status}</em>
      <p>${item.preview}</p>
    </article>
  `;
}

function renderScenarioShell() {
  byId("fileStack").innerHTML = demoData.operationPlan.documents
    .map((doc) => `
      <li class="${state.scenarioLoaded ? "is-ready" : ""}">
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
  byId("currentEventCard").innerHTML = `
    <span>${event.time}</span>
    <strong>${event.event}</strong>
    <p>${event.detail}</p>
    <div class="rehearsal-friction-banner is-${event.severity}">
      <span>${riskLabel(event.severity)}</span>
      <b>${event.impact}</b>
      <em>${event.linked_risks.length ? event.linked_risks.join(" · ") : "기준 상황"}</em>
    </div>
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
  update3dRehearsal(event);
  triggerRadioTrafficForEvent(event);
  const pulse = byId("rehearsalPulse");
  if (pulse) {
    pulse.className = `map-pulse ${event.severity}`;
    pulse.style.left = `${18 + state.rehearsalIndex * 9}%`;
  }
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

function resetRehearsal() {
  clearTimer("rehearsalTimer");
  state.rehearsalIndex = -1;
  state.rehearsalPaused = false;
  renderTimeline();
  setText("timelineState", "대기");
  setText("rehearsalRiskLabel", "위험 대기");
  setText("activeAgentCount", "0명");
  byId("currentEventCard").innerHTML = "<span>대기</span><strong>수행 리허설 실행 버튼을 누르세요.</strong><p>시간순 이벤트와 관련 에이전트가 자동 재생됩니다.</p>";
  byId("activeAgentChips").innerHTML = "";
  clearRadioTraffic();
  renderTerrainPanels();
  window.WarGround3D?.focusEvent?.("start");
  window.WarGround3D?.setPlayback?.(false);
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

function selectFailurePath(failureId) {
  if (!demoData.failures.some((failure) => failure.id === failureId)) return;
  state.selectedFailureId = failureId;
  renderRiskStack();
  renderSelectedFailureStory();
  renderFailureLens();
  renderRiskMetricMatrix();
  renderFailureChains();
  renderMitigationBoard();
  renderRiskEvidence();
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
          <div class="risk-topline">
            <b>#${index + 1} ${story.plainLabel}</b>
            <span>${risk.score}</span>
          </div>
          <strong class="risk-item-plain">${risk.title}</strong>
          <div class="risk-item-meta">
            <span>${story.severity}</span>
            <span>${story.timeWindow}</span>
            <span>${profile.evidenceItems.length}건 근거</span>
          </div>
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

function renderSelectedFailureStory() {
  const target = byId("selectedFailureStory");
  if (!target) return;
  const failure = getFailureById(state.selectedFailureId);
  const story = getFailureStory(failure);
  target.innerHTML = `
    <div>
      <span>선택한 문제 흐름</span>
      <strong>${story.headline}</strong>
      <p>${story.why}</p>
    </div>
    <article>
      <span>놓치면</span>
      <b>${failure.title}</b>
      <em>${story.warning}</em>
    </article>
    <article>
      <span>바로 할 조치</span>
      <b>${story.firstAction}</b>
      <em>${story.question}</em>
    </article>
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
    ["피해 크기", failure.impact, 5],
    ["발생 가능성", failure.likelihood, 5],
    ["다른 문제로 번짐", failure.connectivity, 5],
    ["시간 여유 부족", Math.round(failure.time_pressure * 100), 100]
  ];
  target.innerHTML = metrics
    .map(([label, value, max]) => {
      const percent = Math.round((value / max) * 100);
      return `
        <div>
          <span>${label}</span>
          <b>${value}${max === 100 ? "%" : `/${max}`}</b>
          <i><span style="width: ${percent}%"></span></i>
        </div>
      `;
    })
    .join("");
}

function renderFailureChains() {
  const chain = byId("failureChain");
  if (!chain) return;
  const risk = getFailureById(state.selectedFailureId);
  chain.innerHTML = risk.chain
    .map(
      (step, index) => `
        <article class="${index === risk.chain.length - 1 ? "is-terminal" : ""}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <b>${step}</b>
          <em class="failure-step-type">${index === 0 ? "시작" : index === risk.chain.length - 1 ? "놓치면 발생" : "다음 문제"}</em>
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
          <span>${index === 0 ? "지금" : "다음"}</span>
          <b>${action}</b>
          <em>${profile.evidenceItems[index % Math.max(profile.evidenceItems.length, 1)]?.source || "결심카드"}</em>
        </article>
      `
    )
    .join("");
}

function renderRiskEvidence() {
  const target = byId("riskEvidenceList");
  if (!target) return;
  const selected = getFailureById(state.selectedFailureId);
  const ids = [...new Set([...(selected?.evidence || []), ...demoData.failures.flatMap((risk) => risk.evidence)])];
  target.innerHTML = ids.map((id) => evidenceBadge(evidenceById.get(id))).join("");
  setText("riskEvidenceState", `${selected.evidence.length}건 직접 / ${ids.length}건 전체`);
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
}

function renderCommanderChecklist() {
  const target = byId("commanderChecklist");
  if (!target) return;
  const checkItems = getCommanderCheckItems()
    .map(
      (item, index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <b>${item}</b>
          <em>${index < 2 ? "승인 전 확인" : "조건 확인"}</em>
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
          <span>${evidence?.status || "근거"}</span>
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
  const conditionTiles = getDecisionConditions().map((condition) => ({
    label: typeof condition === "string" ? "조건" : condition.label,
    value: typeof condition === "string" ? condition : condition.detail,
    detail: typeof condition === "string" ? "확인 필요" : condition.owner
  }));
  panel.innerHTML = `
    <div class="decision-lock">
      <span>추천 방책</span>
      <strong>${decision.recommended_coa}</strong>
      <em>${decision.conditional_coa}</em>
    </div>
    <div class="decision-statement">
      <span>결심 문장</span>
      <b>${decision.decision_statement || `${decision.recommended_coa}: ${decision.conditional_coa}`}</b>
    </div>
    ${renderInfoTiles("decision-condition-list", conditionTiles, "시행 조건")}
    <div class="decision-columns">
      <article>
        <b>판단 근거</b>
        ${renderActionList("decision-copy-list", decision.rationale)}
      </article>
      <article>
        <b>즉시 수정안</b>
        ${renderActionList("decision-copy-list", decision.immediate_actions)}
      </article>
      <article>
        <b>재판단 기준</b>
        ${renderActionList("decision-copy-list", decision.redecision_criteria)}
      </article>
    </div>
    <div class="human-loop-notice">${decision.command_authority_notice}</div>
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
    .map((id) => {
      const item = evidenceById.get(id);
      return `<div data-decision-evidence-id="${id}"><span>${item.status}</span><b>${item.title}</b><em>${item.source}</em></div>`;
    })
    .join("");
  setText("humanLoopNotice", demoData.decision.command_authority_notice);
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
  setText("nodeCountLabel", `${graph.nodes.length}개 노드`);
  setText("edgeCountLabel", `${graph.edges.length}개 관계`);
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
  refreshIcons();
}

function runAutoDemo() {
  clearTimer("autoTimer");
  resetDemo();
  loadScenario();
  state.autoTimer = window.setTimeout(() => {
    generateAgents();
    state.autoTimer = window.setTimeout(() => {
      runRehearsal();
      state.autoTimer = window.setTimeout(() => {
        setStage("decision");
        updateFlow("decision");
      }, 10500);
    }, 1800);
  }, 1000);
}

function exportDecision() {
  const payload = JSON.stringify({
    decision_card: demoData.decision,
    fragmentary_order: demoData.order,
    evidence: demoData.decision.evidence_ids.map((id) => evidenceById.get(id))
  }, null, 2);
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "war-ground-decision-review.json";
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  document.querySelectorAll(".workspace-tab").forEach((button) => {
    button.addEventListener("click", () => setStage(button.dataset.stage));
  });
  document.querySelectorAll(".mode-button[data-graph-mode]").forEach((button) => {
    button.addEventListener("click", () => setGraphMode(button.dataset.graphMode));
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
  byId("rehearsalReplayButton").addEventListener("click", runRehearsal);
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
  document.body.addEventListener("click", (event) => {
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
      const evidence = evidenceById.get(button.dataset.evidenceId);
      if (evidence) renderEvidencePreview([evidence.id]);
      setStage("ontology");
    }
    const timeline = event.target.closest("[data-event-index]");
    if (timeline) {
      state.rehearsalPaused = true;
      setText("rehearsalPauseButton", "계속");
      showEvent(Number(timeline.dataset.eventIndex));
    }
  });
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
  window.setInterval(tickDemoClock, 1000);
  const params = new URLSearchParams(window.location.search);
  const initialStage = params.get("stage");
  const initialNode = params.get("node");
  if (initialStage && stageMeta[initialStage]) setStage(initialStage);
  if (initialNode && graph.nodeMap.has(initialNode)) selectNode(initialNode);
  if (params.get("auto") === "1") {
    window.setTimeout(runAutoDemo, 100);
  }
  refreshIcons();
}

boot();
