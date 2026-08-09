/* ============================================================
   렌더링 로직  —  내용 수정 시에는 건드릴 일이 없습니다
   내용은 assets/data.js 를 열어 주세요
   ============================================================ */

/* ---------- 경력 기간 자동 계산 ---------- */
(function renderCareerLength() {
  const now = new Date();

  // 만 N년 M개월
  let months = (now.getFullYear() - CAREER_START.getFullYear()) * 12
             + (now.getMonth() - CAREER_START.getMonth());
  if (now.getDate() < CAREER_START.getDate()) months -= 1;   // 해당 월의 입사일 이전이면 한 달 차감
  const y = Math.floor(months / 12), m = months % 12;
  const duration = m ? `${y}년 ${m}개월` : `${y}년`;

  // 년차 = 입사 연도를 1년차로 계산
  const years = now.getFullYear() - CAREER_START.getFullYear() + 1;

  // 페이지 안의 모든 자리에 동일하게 채워 넣습니다
  document.querySelectorAll(".career-years").forEach(el => el.textContent = years);
  document.querySelectorAll(".career-duration").forEach(el => el.textContent = duration);
})();

/* ---------- 렌더링 ---------- */
const KEY_CLASS = { "문제": "problem", "실행": "action", "성과": "result" };

function renderBlock(b) {
  const cls = KEY_CLASS[b.k] || "action";
  const tech = b.tech ? `<div class="tech">${b.tech.map(t => `<span>${t}</span>`).join("")}</div>` : "";
  const lines = (b.lines || []).map(l => `<li>${l}</li>`).join("");
  const note = b.note ? `<div class="note">${b.note}</div>` : "";
  return `<div class="blk">
      <div class="blk-k ${cls}">${b.k}</div>
      <div>${tech}<ul>${lines}</ul>${note}</div>
    </div>`;
}

function renderMetric(m) {
  const dir = m.dir ? ` ${m.dir}` : "";
  const from = m.from ? `<span class="m-from">${m.from}</span><span class="m-arrow">→</span>` : "";
  return `<div class="metric${dir}">
      <div class="m-label">${m.label}</div>
      <div class="m-value">${from}<span class="m-to">${m.to}</span></div>
      ${m.note ? `<div class="m-note">${m.note}</div>` : ""}
    </div>`;
}

function renderShot(s) {
  const desc = (s.desc || []).map(d => `<li>${d}</li>`).join("");
  // 이미지가 있으면 로드 후 자리표시자를 지우고, 없으면 이미지 태그 쪽을 지웁니다.
  // 표·대시보드 캡처는 카드 안에서 작게 보이므로 클릭하면 원본 크기로 열립니다.
  const img = s.src
    ? `<a class="zoom" href="${s.src}" target="_blank" rel="noopener" title="클릭하면 원본 크기로 열립니다">
         <img src="${s.src}" alt="${s.title || ""}" loading="lazy"
              onload="this.closest('.shot-img').querySelector('.ph')?.remove()"
              onerror="this.closest('.zoom').remove()">
       </a>`
    : "";
  return `<div class="shot">
      <div class="shot-img">
        ${img}
        <div class="ph">이미지 자리<br><code>${s.src || "images/파일명.png"}</code></div>
      </div>
      <div class="shot-txt">
        <h4>${s.title || ""}</h4>
        <ul>${desc}</ul>
      </div>
    </div>`;
}

function renderItem(it) {
  const blocks = (it.blocks || []).map(renderBlock).join("");
  const metrics = it.metrics && it.metrics.length
    ? `<div class="metrics">${it.metrics.map(renderMetric).join("")}</div>` : "";
  const diagram = it.diagram && DIAGRAMS[it.diagram] ? DIAGRAMS[it.diagram] : "";
  const shots = it.shots && it.shots.length
    ? `<div class="mini-label">예시 이미지</div><div class="shots">${it.shots.map(renderShot).join("")}</div>` : "";
  return `<div class="item">
      <div class="item-head">
        ${it.no ? `<span class="item-no">${it.no}</span>` : ""}
        <span class="item-title">${it.title}</span>
        ${it.period ? `<span class="item-period">${it.period}</span>` : ""}
      </div>
      <div class="blocks">${blocks}</div>
      ${metrics}${diagram}${shots}
    </div>`;
}

function renderProject(p, i) {
  const no = String(i + 1).padStart(2, "0");
  const meta = [p.period, p.summary].filter(Boolean).map(t => `<span>${t}</span>`).join("");
  const items = (p.items || []).map(renderItem).join("");
  // 실제로 열어볼 수 있는 결과물이 있으면 본문 맨 위에 바로가기 버튼을 놓습니다.
  const link = p.link
    ? `<a class="p-link" href="${p.link.href}" target="_blank" rel="noopener">
         ${p.link.label || "바로가기"}<span aria-hidden="true">↗</span>
       </a>`
    : "";
  return `<details class="proj" id="project-${i + 1}">
      <summary>
        <span class="p-no">${no}</span>
        <span class="p-title">${p.title}</span>
        <span class="p-right">
          ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}
          <span class="chev"></span>
        </span>
        <span class="p-meta">${meta}</span>
      </summary>
      <div class="p-body">${link}${items}</div>
    </details>`;
}

const list = document.getElementById("projectList");
list.innerHTML = PROJECTS.map(renderProject).join("");

document.getElementById("expandAll").addEventListener("click", () => {
  list.querySelectorAll("details").forEach(d => d.open = true);
});
document.getElementById("collapseAll").addEventListener("click", () => {
  list.querySelectorAll("details").forEach(d => d.open = false);
});

// 주소창에 #project-2 같은 해시가 있으면 해당 프로젝트를 펼쳐 줍니다.
if (location.hash) {
  const t = document.querySelector(location.hash);
  if (t && t.tagName === "DETAILS") { t.open = true; t.scrollIntoView(); }
}
