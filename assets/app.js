/* ============================================================
   렌더링 로직  —  내용 수정 시에는 건드릴 일이 없습니다
   글 내용은 assets/content.js 를 열어 주세요
   ============================================================ */

/* ---------- 경력 기간 자동 계산 ----------
   글 안에 {년차} · {경력기간} 이라고 써 두면 아래 값으로 바뀝니다 */
const CAREER = (function () {
  const now = new Date();

  // 만 N년 M개월
  let months = (now.getFullYear() - CAREER_START.getFullYear()) * 12
             + (now.getMonth() - CAREER_START.getMonth());
  if (now.getDate() < CAREER_START.getDate()) months -= 1;   // 해당 월의 입사일 이전이면 한 달 차감
  const y = Math.floor(months / 12), m = months % 12;

  return {
    years: now.getFullYear() - CAREER_START.getFullYear() + 1, // 입사 연도를 1년차로 계산
    duration: m ? `${y}년 ${m}개월` : `${y}년`
  };
})();

// {년차} · {경력기간} 자리를 실제 값으로 채우고, 눈에 띄게 굵게 표시합니다
function fill(text) {
  return String(text)
    .replaceAll("{년차}", `<b>${CAREER.years}</b>`)
    .replaceAll("{경력기간}", `<b>${CAREER.duration}</b>`);
}

/* ============================================================
   기본 문구 렌더링 (상단 메뉴 · 프로필 · 자기소개 · 경력 · 맨 아래)
   ============================================================ */

/* ---------- 상단 고정 메뉴 ---------- */
document.getElementById("navBar").innerHTML = `
  <div class="nav-brand">${SITE.nav.brand}<span class="dot">.</span></div>
  <div class="nav-links">
    ${SITE.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
  </div>`;

/* ---------- 첫 화면 ---------- */
(function renderHero() {
  const h = SITE.hero;
  // 사진 파일이 없으면 사진 칸 자체를 없앱니다
  const photo = h.photo
    ? `<div class="avatar">
         <img src="${h.photo}" alt="${h.name} 프로필"
              onerror="this.closest('.avatar').remove()">
       </div>`
    : "";
  document.getElementById("hero").innerHTML = `
    <div class="hero-top">
      ${photo}
      <div>
        <h1>${h.name}</h1>
        <div class="role">${h.role}</div>
        <p class="lede">${fill(h.lede)}</p>
        <div class="contact">${h.contact.map(c => `<span>${c}</span>`).join("")}</div>
      </div>
    </div>
    <div class="traits">
      ${h.traits.map(t => `<div class="trait"><b>${t.k}</b>${t.v}</div>`).join("")}
    </div>
    <div class="tools">
      ${h.tools.map(t => `<span class="tool"><i>${t.use}</i>${t.name}</span>`).join("")}
    </div>`;
})();

/* ---------- 자기소개 ---------- */
(function renderAbout() {
  const a = SITE.about;
  document.getElementById("aboutBox").innerHTML = `
    <div class="sec-head">
      <div class="sec-label">${a.label}</div>
      <h2>${a.heading}</h2>
    </div>
    <div class="about">
      <h3>${a.title}</h3>
      ${a.paragraphs.map(p => `<p>${fill(p)}</p>`).join("")}
    </div>`;
})();

/* ---------- 경력사항 · 학력 ---------- */
(function renderCareer() {
  const c = SITE.career;

  // 경력 카드와 학력 카드가 같은 모양을 씁니다
  const card = (j, cls = "job") => `
    <div class="${cls}">
      <div class="j-period">${j.period}</div>
      <div>
        <div class="j-org">${j.org}</div>
        <div class="j-role">${j.role}</div>
      </div>
      <div class="j-tags">${(j.tags || []).map(t => `<span>${t}</span>`).join("")}</div>
    </div>`;

  // 학력이 비어 있으면 '학력' 제목까지 통째로 나오지 않습니다
  const edu = (c.education || []).length
    ? `<h3 class="career-sub">${c.eduHeading}</h3>
       <div class="career">${c.education.map(e => card(e, "job edu")).join("")}</div>`
    : "";

  document.getElementById("careerBox").innerHTML = `
    <div class="sec-head">
      <div class="sec-label">${c.label}</div>
      <h2>${c.heading}</h2>
    </div>
    <div class="career">${c.jobs.map(j => card(j)).join("")}</div>
    ${edu}`;
})();

/* ---------- 프로젝트 섹션 머리말 (목록 자체는 아래에서 채웁니다) ---------- */
(function renderProjectsFrame() {
  const p = SITE.projects;
  document.getElementById("projectsBox").innerHTML = `
    <div class="sec-head">
      <div class="sec-label">${p.label}</div>
      <h2>${p.heading}</h2>
      <p class="sub">${p.sub}</p>
    </div>
    <div class="proj-tools">
      <span class="hint">${p.hint}</span>
      <button class="btn" id="expandAll" type="button">${p.expandAll}</button>
      <button class="btn" id="collapseAll" type="button">${p.collapseAll}</button>
    </div>
    <div class="projects" id="projectList"></div>`;
})();

/* ---------- 맨 아래 ---------- */
(function renderFooter() {
  const f = SITE.footer;
  document.getElementById("footerBox").innerHTML = `
    <div class="f-name">${f.name}</div>
    <div class="f-note">${f.lines.join("<br>")}</div>`;
})();

/* ============================================================
   프로젝트 렌더링
   ============================================================ */
const KEY_CLASS = {
  "문제": "problem", "실행": "action", "성과": "result",
  // 프로젝트마다 머리말이 조금씩 다를 수 있어, 비슷한 뜻이면 같은 색을 씁니다.
  "기획 배경": "problem", "실행 및 성과": "result", "주요 기능 및 화면": "action"
};

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
  // now 를 숫자로 적으면 '작년 → 현재 → 목표' 막대가 있는 카드로 그려집니다.
  if (typeof m.now === "number") return renderTrackMetric(m);
  const dir = m.dir ? ` ${m.dir}` : "";
  const from = m.from ? `<span class="m-from">${m.from}</span><span class="m-arrow">→</span>` : "";
  return `<div class="metric${dir}">
      <div class="m-label">${m.label}</div>
      <div class="m-value">${from}<span class="m-to">${m.to}</span></div>
      ${m.note ? `<div class="m-note">${m.note}</div>` : ""}
    </div>`;
}

/* 낮을수록 좋은 지표(저효율 PGM 등)를 막대로 보여줍니다.
     연한 막대 = 작년 결과 (base, 없어도 됩니다)
     진한 막대 = 현재 (now)
     세로 점선 = 목표 (goal) — 막대가 점선보다 짧으면 목표 달성            */
function renderTrackMetric(m) {
  const u = m.unit || "%";
  const base = typeof m.base === "number" ? m.base : null;
  const goal = typeof m.goal === "number" ? m.goal : null;
  const now = m.now;

  // 막대 눈금의 끝 — 가장 큰 값보다 조금 여유를 둡니다
  const max = Math.max(base || 0, now, goal || 0) * 1.2 || 1;
  const w = v => (v / max * 100).toFixed(1) + "%";

  const done = goal !== null && now <= goal;
  // 부동소수점 오차를 없애기 위해 소수 첫째 자리에서 반올림합니다 (14 - 13 = 1)
  const gap = goal === null ? null : Math.round((now - goal) * 10) / 10;

  // 화살표까지 한 덩어리로 묶어 '작년 값' 줄이 통째로 위에 오도록 합니다
  const from = base === null ? ""
    : `<span class="m-from">${m.baseLabel ? m.baseLabel + " " : ""}${base}${u} <span class="m-arrow">→</span></span>`;
  const ghost = base === null ? "" : `<span class="m-bar base" style="width:${w(base)}"></span>`;
  const mark = goal === null ? "" : `<span class="m-goal" style="left:${w(goal)}"></span>`;
  const foot = goal === null ? ""
    : `<div class="m-foot">
        <span>${m.goalLabel || "목표"} ${goal}${u} ↓</span>
        <span class="m-chip${done ? " done" : ""}">${done ? "달성" : gap + "%p 남음"}</span>
      </div>`;

  return `<div class="metric track${done ? " done" : ""}">
      <div class="m-label">${m.label}</div>
      <div class="m-value">${from}<span class="m-to">${now}${u}</span></div>
      <div class="m-track">${ghost}<span class="m-bar now" style="width:${w(now)}"></span>${mark}</div>
      ${m.note ? `<div class="m-note">${m.note}</div>` : ""}
      ${foot}
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
  // 파일이 없는 이미지는 칸을 지우고, 전부 없으면 이미지 영역째 지워 설명만 넓게 보이게 합니다
  const imgs = list.map(src => `
      <button type="button" class="shot-img zoom" data-full="${src}" title="클릭하면 크게 보기">
        <img src="${src}" alt="${s.title || ""}" loading="lazy"
             onerror="var w=this.closest('.shot-imgs');this.closest('.shot-img').remove();if(w&&!w.querySelector('.shot-img'))w.remove()">
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
  // 항목도 프로젝트와 같은 방식으로 접혀 있다가, 클릭하면 펼쳐집니다.
  return `<details class="item" id="item-${projectNo}-${idx + 1}">
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
  // 뱃지는 넓은 화면에서는 오른쪽 끝에, 좁은 화면에서는 기간 앞에 놓입니다.
  // (좁은 화면에서 오른쪽에 두면 제목이 지나치게 눌리므로 자리를 옮깁니다)
  const metaBadge = p.badge ? `<span class="p-badge mini">${p.badge}</span>` : "";
  const meta = metaBadge + [p.period, p.summary].filter(Boolean).map(t => `<span>${t}</span>`).join("");
  const items = (p.items || []).map((it, k) => renderItem(it, k, i + 1)).join("");
  // 실제로 열어볼 수 있는 결과물이 있으면 본문 맨 위에 바로가기 버튼을 놓습니다.
  // 소개 자료(PDF 등)가 있으면 그 옆에 내려받기 버튼을 나란히 놓습니다.
  const buttons = [
    p.link
      ? `<a class="p-link" href="${p.link.href}" target="_blank" rel="noopener">
           ${p.link.label || "바로가기"}<span aria-hidden="true">↗</span>
         </a>`
      : "",
    p.file
      ? `<a class="p-link ghost" href="${p.file.href}" download="${p.file.name || ""}">
           ${p.file.label || "자료 다운로드"}<span aria-hidden="true">↓</span>
         </a>`
      : ""
  ].filter(Boolean).join("");
  const link = buttons ? `<div class="p-links">${buttons}</div>` : "";
  // tone 이 있으면 카드 색을 달리합니다 (예: 개인 프로젝트 → .personal)
  const tone = p.tone ? ` ${p.tone}` : "";
  // tag 는 제목 옆에 붙는 작은 표식입니다 (예: 개인)
  const tag = p.tag ? `<span class="p-tag">${p.tag}</span>` : "";
  return `<details class="proj${tone}" id="project-${i + 1}">
      <summary>
        <span class="p-no">${no}</span>
        <span class="p-title">${p.title}${tag}</span>
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

// 프로젝트와 세부 항목을 한 번에 펼치고 접습니다.
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
