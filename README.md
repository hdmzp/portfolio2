# Portfolio — 박민지 · Business Analyst

홈쇼핑 업계 Business Analyst 포트폴리오 웹페이지.
PC·모바일 모두 대응하며, 프로젝트는 기본적으로 접혀 있고 클릭하면 상세가 펼쳐집니다.

## 파일 구조

```
index.html          뼈대 + 소개·경력 텍스트
assets/data.js      프로젝트 내용        ← 내용을 추가·수정할 때는 여기만
assets/app.js       렌더링 로직          (거의 건드릴 일 없음)
assets/style.css    디자인               (거의 건드릴 일 없음)
images/             화면 캡처·프로필 이미지
```

## 프로젝트 추가하기

`assets/data.js` 의 `PROJECTS` 배열에 객체 하나를 추가하면 됩니다.
번호(01, 02 …)는 배열 순서대로 자동으로 매겨지므로 직접 쓰지 않아도 됩니다.

```js
{
  title: "프로젝트 제목",
  badge: "역량 뱃지",              // 생략 가능
  period: "2026.01 ~ 현재",        // 생략 가능
  summary: "접혀 있을 때 보이는 한 줄 요약",
  items: [
    {
      no: "4-1",
      title: "세부 항목 제목",
      period: "’26.01 ~ 현재",
      blocks: [
        { k: "문제", lines: ["..."], note: "※ 각주" },
        { k: "실행", tech: ["MySQL", "Power BI"], lines: ["..."] },
        { k: "성과", lines: ["..."] }
      ],
      metrics: [ { label: "지표명", from: "10%", to: "24%", note: "비고", dir: "up" } ],
      shots:   [ { src: "images/파일명.png", title: "제목", desc: ["설명"] } ]
    }
  ]
}
```

- `metrics` · `shots` · `note` · `tech` 는 필요할 때만 쓰면 되고, 없으면 알아서 빠집니다.
- `lines` 안에서는 `<b>강조</b>` 를 쓸 수 있습니다.
- `dir` 은 `"up"`(개선·확대) / `"down"`(축소) 로 숫자 색이 달라집니다.

## 경력 기간

년차와 만 N년 M개월은 `assets/data.js` 의 `CAREER_START` (2020.10.20) 기준으로
페이지를 열 때마다 자동 계산됩니다. 별도로 고칠 필요가 없습니다.

## 로컬에서 보기

`index.html` 을 브라우저로 열면 됩니다.
