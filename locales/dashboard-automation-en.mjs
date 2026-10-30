// Authored UI and sample-data copy for the local automation operations dashboard.
export const automationDashboardMessages = Object.fromEntries(`
자동화 운영 대시보드	Automation operations dashboard
실행 흐름을 살피고, 검토가 필요한 작업을 한곳에서 관리하세요.	Inspect workflow activity and manage work that needs review in one place.
전체 워크플로	All workflows
활성 워크플로	Active workflows
중지된 워크플로	Paused workflows
2026.10.27 · 샘플	2026.10.27 · Sample
워크플로 만들기	Create workflow
현재 필터 기준	Current filter scope
표시된 워크플로	Visible workflows
누적 표본 기록 · 2026년 10월	Cumulative sample records · October 2026
전체 실행	Total runs
표시된 워크플로 누적 실행	Cumulative runs of visible workflows
실행 가중 성공률	Run-weighted success rate
실행 기록 없음	No run history
성공 실행 ÷ 전체 실행	Successful runs ÷ total runs
표시된 항목의 활성 상태	Active items in the visible scope
토큰 사용량	Token consumption
표시된 워크플로 누적 토큰	Cumulative tokens of visible workflows
워크플로 운영 현황	Workflow operations
검색과 필터는 표와 위의 네 가지 지표에 함께 적용됩니다.	Search and filters apply to the table and all four metrics above.
로컬 샘플	Local sample
워크플로 검색	Search workflows
이름, 담당 팀, 설명 검색	Search name, team or description
워크플로 상태	Workflow status
전체 상태	All statuses
활성	Active
중지	Paused
중지하기	Pause
워크플로 시작 조건	Workflow trigger
모든 시작 조건	All triggers
이벤트 수신	Incoming event
정기 일정	Schedule
수동 시작	Manual
필터 초기화	Reset filters
일치하는 워크플로가 없습니다.	No matching workflows.
검색어나 상태, 시작 조건을 조정해 보세요.	Try changing your search, status or trigger filter.
워크플로 표 · 가로로 스크롤 가능	Workflow table · horizontally scrollable
현재 필터의 워크플로별 누적 표본 실행 기록	Cumulative sample run records for each workflow in the current filter
워크플로	Workflow
시작 조건	Trigger
누적 실행	Total runs
성공률	Success rate
상태	Status
관리	Actions
상세	Inspect
활성화	Activate
선택한 워크플로 상세	Selected workflow details
성공 실행	Successful runs
실패 실행	Failed runs
누적 토큰	Total tokens
워크플로 구성 단계	Workflow steps
마지막 표본 실행	Last sample run
상태 변경은 누적 실행·성공·토큰 기록에 영향을 주지 않습니다.	Status changes do not affect cumulative run, success or token history.
템플릿으로 시작하기	Start from a template
흐름을 선택하고 이름을 입력해 로컬 워크플로를 추가하세요.	Choose a flow and enter a name to add a local workflow.
3단계	3 steps
새 로컬 워크플로	New local workflow
워크플로 만들기 닫기	Close workflow creation
워크플로 이름	Workflow name
예: 주간 문의 검토	e.g. Weekly inquiry review
시작 템플릿	Starting template
새 항목은 실행 기록 없이 중지 상태로 추가됩니다. 실제 서비스 연결이나 자동 실행은 없습니다.	New items start paused with no run history. No real services are connected and no automation runs.
로컬에 추가	Add locally
모든 수치는 샘플입니다. 변경은 현재 예제 메모리에만 반영되며 새로고침하면 초기화됩니다. API 호출, 저장, 실제 자동화를 수행하지 않습니다.	All figures are sample data. Changes exist only in this example's memory and reset on refresh. No API calls, storage or real automation occur.
워크플로 이름을 입력하세요.	Enter a workflow name.
이름은 80자 이내로 입력하세요.	Use no more than 80 characters for the name.
같은 이름의 워크플로가 있습니다. 다른 이름을 입력하세요.	A workflow with this name already exists. Enter a different name.
사용할 템플릿을 선택하세요.	Choose a template.
검색과 상태 변경은 이 예제 안에서만 적용됩니다.	Search and status changes apply only within this example.
선택한 워크플로를 로컬에서 중지했습니다. 누적 실행 기록은 유지됩니다.	The selected workflow is paused locally. Cumulative run history is unchanged.
선택한 워크플로를 로컬에서 활성화했습니다. 실제 작업은 실행되지 않습니다.	The selected workflow is active locally. No actual work is executed.
로컬 워크플로를 중지 상태로 추가했습니다. 실행 기록은 0이며 실제 자동화는 실행되지 않습니다.	Added a paused local workflow with zero run history. No real automation executes.
문의 접수 및 분류	Inquiry intake and routing
들어온 문의를 분류하고 담당 검토함으로 연결합니다.	Classify incoming inquiries and route them to the responsible review queue.
문의 수신	Receive inquiry
유형 분류	Classify type
담당 검토함	Team review queue
고객 운영	Customer operations
주간 운영 리포트	Weekly operations report
운영 지표를 모아 검토할 요약 초안을 구성합니다.	Collect operational metrics into a draft summary for review.
표본 수집	Collect samples
지표 요약	Summarize metrics
초안 검토	Review draft
리포팅	Reporting
품질 이상 감지	Quality anomaly review
품질 기준을 확인하고 주의 항목을 검토 대기열에 모읍니다.	Check quality criteria and gather flagged items in a review queue.
기준 확인	Check criteria
예외 분류	Classify exceptions
검토 대기열	Review queue
품질 관리	Quality management
고객 문의 라우터	Customer inquiry router
접수한 문의의 유형을 분류하고 담당 팀의 검토함으로 연결합니다.	Classify received inquiries and route them to the responsible team's review queue.
고객 운영팀	Customer operations team
10월 27일 09:42	Oct 27, 09:42
잠재 고객 우선순위	Lead prioritization
샘플 문의의 조건을 비교해 검토 우선순위를 정리합니다.	Compare sample inquiry criteria to organize review priorities.
영업 운영팀	Sales operations team
10월 27일 09:30	Oct 27, 09:30
대상 수집	Collect records
조건 비교	Compare criteria
우선순위 검토	Review priorities
일일 운영 브리핑	Daily operations briefing
샘플 운영 기록을 일별로 묶어 요약 초안을 구성합니다.	Group sample operational records by day to prepare a draft summary.
플랫폼팀	Platform team
10월 27일 09:00	Oct 27, 09:00
기록 수집	Collect records
주제별 요약	Summarize by topic
주간 성과 리포트	Weekly performance report
주간 지표를 집계해 운영 리포트의 검토 초안을 만듭니다.	Aggregate weekly metrics into an operations report draft for review.
데이터팀	Data team
10월 26일 08:00	Oct 26, 08:00
문서 품질 검토	Document quality review
문서의 누락 필드를 확인하고 예외 항목을 분류합니다.	Check documents for missing fields and classify exceptions.
품질 관리팀	Quality management team
10월 25일 16:20	Oct 25, 16:20
문서 확인	Check document
누락 필드 분류	Classify missing fields
문의 예외 모니터	Inquiry exception monitor
분류하지 못한 문의를 모아 담당자가 확인할 대기열에 배치합니다.	Gather unclassified inquiries into a queue for the responsible reviewer.
10월 24일 14:10	Oct 24, 14:10
내 로컬 작업	My local work
`.trim().split('\n').filter(Boolean).map(line => line.split('\t')));
