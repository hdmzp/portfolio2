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
  // src 는 문자열 하나 또는 배열(이미지 여러 장) 모두 가능합니다.
  const list = !s.src ? [] : (Array.isArray(s.src) ? s.src : [s.src]);
  const txt = `<div class="shot-txt">
        <h4>${s.title || ""}</h4>
        <ul>${desc}</ul>
      </div>`;

  // 이미지가 아직 없으면 이미지 칸을 통째로 없애고 설명만 남깁니다.
  //   → 공개된 사이트에 '이미지 자리' 안내가 노출되지 않도록 하기 위함
  //   → 나중에 파일만 넣으면 이미지가 자동으로 다시 나타납니다
  if (!list.length) return `<div class="shot no-img">${txt}</div>`;

  // 표·대시보드 캡처는 카드 안에서 작게 보이므로, 클릭하면 확대해서 봅니다.
  const imgs = list.map(src => `
      <button type="button" class="shot-img zoom" data-full="${src}" title="클릭하면 크게 보기">
        <img src="${src}" alt="${s.title || ""}" loading="lazy"
             onerror="this.closest('.shot-img').remove()">
      </button>`).join("");
  return `<div class="shot">
      <div class="shot-imgs">${imgs}</div>
      ${txt}
    </div>`;
}

function renderItem(it, idx, projectNo) {
  const blocks = (it.blocks || []).map(renderBlock).join("");
  const metrics = it.metrics && it.metrics.length
    ? `<div class="metrics">${it.metrics.map(renderMetric).join("")}</div>` : "";
  const diagram = it.diagram && DIAGRAMS[it.diagram] ? DIAGRAMS[it.diagram] : "";
  const shots = it.shots && it.shots.length
    ? `<div class="mini-label">예시 이미지</div><div class="shots">${it.shots.map(renderShot).join("")}</div>` : "";
  // 항목도 프로젝트와 같은 방식으로 접었다 펼 수 있습니다 (기본은 펼침).
  return `<details class="item" open id="item-${projectNo}-${idx + 1}">
      <summary class="item-head">
        ${it.no ? `<span class="item-no">${it.no}</span>` : ""}
        <span class="item-title">${it.title}</span>
        ${it.period ? `<span class="item-period">${it.period}</span>` : ""}
        <span class="chev"></span>
      </summary>
      <div class="item-body">
        <div class="blocks">${blocks}</div>
        ${metrics}${diagram}${shots}
      </div>
    </details>`;
}

function renderProject(p, i) {
  const no = String(i + 1).padStart(2, "0");
  const meta = [p.period, p.summary].filter(Boolean).map(t => `<span>${t}</span>`).join("");
  const items = (p.items || []).map((it, k) => renderItem(it, k, i + 1)).join("");
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

// 전체 펼치기·접기는 프로젝트만 대상으로 합니다 (항목은 그대로 유지).
document.getElementById("expandAll").addEventListener("click", () => {
  list.querySelectorAll("details.proj").forEach(d => d.open = true);
});
document.getElementById("collapseAll").addEventListener("click", () => {
  list.querySelectorAll("details.proj").forEach(d => d.open = false);
});

// 주소창에 #project-2 같은 해시가 있으면 해당 프로젝트를 펼쳐 줍니다.
if (location.hash) {
  const t = document.querySelector(location.hash);
  if (t && t.tagName === "DETAILS") { t.open = true; t.scrollIntoView(); }
}

/* ---------- 이미지 확대 보기 ----------
   캡처를 클릭하면 화면 전체에 크게 띄우고, 아래 방법으로 닫습니다.
     · 우측 상단 '닫기' 버튼
     · ESC 키
     · 이미지 바깥 어두운 영역 클릭
------------------------------------------ */
const viewer = document.createElement("div");
viewer.className = "viewer";
viewer.setAttribute("aria-hidden", "true");
viewer.innerHTML = `
  <button type="button" class="viewer-close" aria-label="닫기">닫기 ✕</button>
  <img alt="">
  <div class="viewer-hint">이미지 바깥을 클릭하거나 ESC 키를 눌러도 닫힙니다</div>`;
document.body.appendChild(viewer);

const viewerImg = viewer.querySelector("img");
let lastFocused = null;

function openViewer(src, alt) {
  lastFocused = document.activeElement;
  viewerImg.src = src;
  viewerImg.alt = alt || "";
  viewer.classList.add("on");
  viewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";      // 뒤 배경 스크롤 방지
  viewer.querySelector(".viewer-close").focus();
}

function closeViewer() {
  viewer.classList.remove("on");
  viewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  viewerImg.removeAttribute("src");
  if (lastFocused) lastFocused.focus();
}

list.addEventListener("click", e => {
  const btn = e.target.closest(".shot-img");
  if (!btn) return;
  const img = btn.querySelector("img");
  openViewer(btn.dataset.full, img && img.alt);
});

viewer.addEventListener("click", e => {
  // 이미지 자체를 클릭한 게 아니면 닫습니다 (배경·닫기 버튼 모두 해당)
  if (e.target !== viewerImg) closeViewer();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && viewer.classList.contains("on")) closeViewer();
});
