# images

`assets/data.js` 의 `src` 값이 이 폴더의 파일을 가리킵니다.
파일이 없으면 페이지에서 이미지 칸이 빠지고 설명만 표시됩니다.
파일을 넣고 푸시하면 다음 배포부터 자동으로 나타납니다.

## 들어와 있는 이미지

경력기술서 PDF에서 잘라낸 화면입니다. (가로 최대 1500px, PNG)

### 프로필

| 파일 | 내용 |
|---|---|
| `profile.png` | 상단 프로필 일러스트 (600×801) |


### 프로젝트 2-1 · 실적 총괄장 / 2-2 · KPI 대시보드

| 파일 | 내용 |
|---|---|
| `p2-1-pgm-master.png` | PGM 총괄장 예시 |
| `p2-1-sql.png` | 실적 집계 쿼리 |
| `p2-1-dashboard-live.png` | Power BI · 기간별 사업부/팀 실적 조회 |
| `p2-1-dashboard-brand.png` | Power BI · 협력사/브랜드별 실적 조회 |
| `p2-1-dashboard-raw.png` | Power BI · 방송 실적 RAW 데이터 |
| `p2-1-team-pgm.png` | 팀 · 사업부 PGM 효율 조회 |
| `p2-1-daily-trend.png` | 일자별 추이 조회 |
| `p2-1-fixedpgm-1.png` `p2-1-fixedpgm-2.png` | 고정 PGM 실적 조회 ① ② |
| `p2-1-fashion-1.png` `p2-1-fashion-2.png` | 패션잡화 PGM 실적 조회 ① ② |
| `p2-1-conversion.png` | 방송코드별 실제 구매전환율 조회 |
| `p2-1-conversion-raw.png` | 구매전환율 RAW 데이터 |

### 프로젝트 2-3 · 통합 선편성 캘린더

| 파일 | 내용 |
|---|---|
| `p2-2-calendar.png` | 선편성 요청 리스트 → 월 캘린더 |
| `p2-2-sheet.png` | 취합시트 → 월 캘린더 자동 업데이트 |
| `p2-2-features.png` | 통합 캘린더 기본 기능 3종 |
| `p2-2-search.png` | 조건별 검색 기능 |
| `p2-2-ppl.png` | PPL 방송횟수 자동 집계 (Apps Script) |

### 프로젝트 3 · 업무 자동화 프로그램

| 파일 | 내용 |
|---|---|
| `duty-1.png` `duty-2.png` `duty-3.png` | 3-5 당직 매출 추정 · 보고 자동화 |

### 프로젝트 4 · AI 사이트 (`hdhs/` 폴더)

| 파일 | 화면 |
|---|---|
| `hdhs/homeshop.webp` | 홈쇼핑 편성 조회 (시간대별) |
| `hdhs/homeshop_list.webp` | 홈쇼핑 편성 조회 (분류별) |
| `hdhs/fixedpgm.webp` | 고정 PGM 편성표 |
| `hdhs/celebrity.webp` | 셀럽 PGM 조회 |
| `hdhs/industry.webp` | 편성맵 — 시간대별 히트맵 · 인사이트 |
| `hdhs/health-tracker.webp` | 건강프로그램 추적 |
| `hdhs/schedule.webp` | 지상파 · 종편 편성표 |
| `hdhs/dramavariety.webp` | 드라마 · 예능 편성 및 시청률 |
| `hdhs/ranking.webp` | 주간 랭킹 |
| `hdhs/promotion.webp` | 카드 할인 조회 |
| `hdhs/weather.webp` | 지역별 날씨 달력 |
| `hdhs/feedback.webp` | 의견 보내기 |

## 아직 비어 있는 자리

아래 이름으로 파일을 넣으면 해당 위치에 자동으로 표시됩니다.

| 파일 | 위치 |
|---|---|
| `p1-1-monitoring.png` | 1-1 · 월별·조직별 효율 모니터링 |
| `p1-2-ogamsho.png` | 1-2 · 〈오감쇼〉 카테고리 포트폴리오 |
| `auto-daily.png` | 3-1 · 식품사업부 Daily 실적 분석 |
| `auto-ogamsho.png` | 3-2 · 오감쇼 상세분석 화면 |
| `campaign-3050.png` | 3-4 · 캠페인 운영현황 화면 |
| `hdhs/lavangba.webp` | 4-1 · 홈쇼핑 방송 실적 (라방바) 대시보드 |

## 파일 추가·교체 규칙

- 이름을 바꾸려면 `assets/data.js` 의 `src` 값도 함께 고쳐 주세요.
- 새 캡처는 **가로 1500px 이하, 장당 400KB 이하**를 권장합니다.
- 카드 이미지 영역은 가로가 살짝 긴 비율이라, 세로로 아주 긴 캡처는 작게 보입니다.

## 워터마크 처리

사내 캡처에는 사번 · 내부 IP 등이 들어간 반투명 워터마크가 겹쳐 있어,
저장소에 올릴 때 제거한 상태로 커밋합니다.

새 캡처를 추가할 때도 같은 처리가 필요하면 다음 조건으로 지울 수 있습니다.
- 채도가 낮은(무채색) 밝기 218~252 구간 픽셀만 골라
- 주변 9px 국소 최댓값(= 배경색)으로 대체

흰 배경을 흰색으로 덮는 방식은 회색 배경 위에서 흰 글씨로 남으므로 쓰지 않습니다.
