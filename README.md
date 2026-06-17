# BATTLE-PROOF K Demo

PUBG/Battleground-style tactical UI를 참고하되, 로고와 원본 에셋은 사용하지 않은 독자 작전 의사결정 콘솔 데모입니다.

## 실행

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173/index.html`을 열면 됩니다.

## 메인 플로우

메인 화면은 모든 요소를 한 번에 깔아두는 대시보드가 아니라, 상단 가로 탭으로 전환하는 작업 화면 구조입니다.

- `자료 투입`: 작전계획서, 방책, 군수, 통신, 기상, SOP 목업 데이터 투입
- `그래프 구축`: 문서 근거, 방책 속성, 제약, 참모 발언, 실패경로를 촘촘한 온톨로지 네트워크로 표시
- `참모 토론`: 8개 AI 참모 셀의 병렬 토론 결과와 발언 근거 표시
- `실패경로`: 실패경로 TOP4 우선순위화
- `결심카드`: 지휘관 결심카드와 수정 명령

## 분리된 참고 화면

기본 비교 응답은 메인 데모에서 제거했고, 필요 시 `simple-llm-reference.html`에서만 확인하도록 분리했습니다.

## 생성 이미지 자산

- `assets/tactical-command-bg.png`: 전술 콘솔 배경
- `assets/ontology-graph-bg.png`: 온톨로지 그래프 배경

두 이미지는 Codex image generation으로 생성한 독자 bitmap asset입니다.
# battle-agent

