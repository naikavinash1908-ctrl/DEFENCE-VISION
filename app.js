const sectors = [
  { name: "Aerospace & aircraft", detail: "Aircraft, propulsion, autonomy and aerospace systems", evidence: "Evidence needed", theme: "aerospace aviation propulsion aircraft" },
  { name: "Naval technology", detail: "Shipbuilding, undersea systems and maritime sensors", evidence: "Evidence needed", theme: "naval shipbuilding maritime" },
  { name: "Radar & sensors", detail: "Radar, electro-optics and sensing technologies", evidence: "Evidence needed", theme: "radar sensor sensing" },
  { name: "AI & robotics", detail: "AI research, robotics and responsible deployment", evidence: "Evidence needed", theme: "artificial intelligence robotics" },
  { name: "Cybersecurity & communications", detail: "Secure communications and cyber resilience", evidence: "Evidence needed", theme: "cybersecurity communications" },
  { name: "Semiconductors & electronics", detail: "Chip design, packaging and electronics ecosystem", evidence: "Evidence needed", theme: "semiconductor electronics chip" },
  { name: "Advanced materials", detail: "Materials research, qualification and manufacturing", evidence: "Evidence needed", theme: "materials composites metallurgy" },
  { name: "Research & innovation", detail: "R&D capacity, talent and technology translation", evidence: "Evidence needed", theme: "research innovation r&d" }
];

const countries = ["United States", "China", "Russia", "France", "United Kingdom", "Israel", "Japan", "South Korea"];

const sources = [
  { title: "Ministry of Defence — Annual Reports", publisher: "Government of India", type: "GOVERNMENT", date: "Source portal", sector: "Research & innovation", description: "Official portal for Ministry of Defence annual reports and related publications.", url: "https://mod.gov.in/dod/annual-reports" },
  { title: "Department of Science & Technology — Publications", publisher: "Government of India", type: "GOVERNMENT", date: "Source portal", sector: "Research & innovation", description: "Department portal for policy documents, reports and science and technology publications.", url: "https://dst.gov.in/" },
  { title: "Comptroller and Auditor General of India", publisher: "CAG of India", type: "AUDIT", date: "Source portal", sector: "Research & innovation", description: "Audit reports and public-sector performance information for independent scrutiny.", url: "https://cag.gov.in/en/audit-report" },
  { title: "PRS Legislative Research — Defence", publisher: "PRS Legislative Research", type: "PARLIAMENTARY ANALYSIS", date: "Source portal", sector: "Research & innovation", description: "Non-partisan analysis of parliamentary documents, including defence-related material.", url: "https://prsindia.org/" },
  { title: "DRDO — Publications", publisher: "Defence Research and Development Organisation", type: "RESEARCH", date: "Source portal", sector: "Aerospace & aircraft", description: "Public-facing institutional research information and publications; verify individual claims against the source document.", url: "https://www.drdo.gov.in/" },
  { title: "India Semiconductor Mission", publisher: "Ministry of Electronics & IT", type: "GOVERNMENT", date: "Source portal", sector: "Semiconductors & electronics", description: "Official information on India's semiconductor ecosystem initiatives.", url: "https://ism.gov.in/" },
  { title: "WIPO PATENTSCOPE", publisher: "World Intellectual Property Organization", type: "PATENT DATABASE", date: "Search portal", sector: "Advanced materials", description: "Search international patent publications; patent counts alone do not measure deployed capability.", url: "https://patentscope.wipo.int/" },
  { title: "Google Scholar", publisher: "Google", type: "RESEARCH INDEX", date: "Search portal", sector: "AI & robotics", description: "Discovery index for scholarly publications; check the original paper and its methodology.", url: "https://scholar.google.com/" },
  { title: "OECD Main Science and Technology Indicators", publisher: "OECD", type: "STATISTICAL DATABASE", date: "Dataset portal", sector: "Research & innovation", description: "Comparable science and technology statistics with definitions and coverage notes.", url: "https://www.oecd.org/en/data/datasets/main-science-and-technology-indicators.html" }
];

const indicatorExamples = [
  { title: "Research-to-prototype transitions", code: "R&D · TRANSLATION", desc: "Track publicly documented projects moving from research outputs to tested prototypes, with a consistent definition and period.", frequency: "Annual review", unit: "Count with source trail" },
  { title: "Domestic supplier participation", code: "INDUSTRY · ECOSYSTEM", desc: "Measure disclosed participation by domestic suppliers in a defined component category; note whether data coverage is partial.", frequency: "Annual review", unit: "Share, only if comparable" },
  { title: "Talent pipeline", code: "PEOPLE · SKILLS", desc: "Track public programme enrolment, graduates or relevant research positions where scope and definitions remain consistent.", frequency: "Annual review", unit: "Cohort / programme" },
  { title: "Research collaboration", code: "SCIENCE · NETWORKS", desc: "Map attributable institutional research collaborations and resulting publications or patents without treating volume as impact.", frequency: "Two-year review", unit: "Bibliographic / patent record" }
];

const roadmapActions = [
  { title: "Map the evidence and define the capability", body: "Create a dated evidence register of public programmes, research facilities, patents and disclosed industrial activity. State the capability boundary and unknowns before assigning a score.", who: "Research institutions · Universities", when: "Short term · 0–2 years", metric: "Sources with publication dates and traceable claims" },
  { title: "Connect research, talent and industry needs", body: "Use structured workshops and public consultation to identify skills, infrastructure and technology-transfer needs. Publish a baseline and update it on a defined schedule.", who: "Universities · Industry · Government", when: "Medium term · 2–5 years", metric: "Documented partnerships · skills pathways · review cadence" },
  { title: "Measure validated translation outcomes", body: "Define transparent, sector-specific indicators for research outputs progressing toward independently evaluated prototypes, qualification or manufacturing readiness.", who: "Research institutions · Industry · Government", when: "Long term · 5+ years", metric: "Outcome indicators with scope, method and evidence" }
];

const sampleScores = {
  "Aerospace & aircraft": [2.8, 4.7], "Naval technology": [3.1, 4.6], "Radar & sensors": [3.0, 4.7],
  "AI & robotics": [2.7, 4.8], "Cybersecurity & communications": [3.0, 4.8], "Semiconductors & electronics": [2.2, 4.9],
  "Advanced materials": [2.5, 4.7], "Research & innovation": [3.0, 4.8]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let sectorChart;
let comparisonChart;
let fullComparisonChart;
let activeChartMode = "capability";

function populateSelect(select, options, firstLabel) {
  if (!select) return;
  select.innerHTML = "";
  if (firstLabel) {
    const first = document.createElement("option");
    first.value = "all";
    first.textContent = firstLabel;
    select.append(first);
  }
  options.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function createSectorOptions() {
  populateSelect($("#comparisonSector"), sectors.map(item => item.name), "All sectors");
  populateSelect($("#fullSectorFilter"), sectors.map(item => item.name), "Select a sector");
  populateSelect($("#gapFilter"), sectors.map(item => item.name), "All sectors");
  populateSelect($("#plannerSector"), sectors.map(item => item.name));
  populateSelect($("#researchSectorFilter"), sectors.map(item => item.name), "All sectors");
  populateSelect($("#comparisonCountry"), countries);
  populateSelect($("#fullCountryFilter"), countries);
}

function renderSectors() {
  const container = $("#profileSectors");
  container.innerHTML = sectors.map((sector, index) => `
    <article class="sector-card" data-sector="${sector.name}">
      <span class="sector-index">SECTOR ${String(index + 1).padStart(2, "0")}</span>
      <h3>${sector.name}</h3>
      <p>${sector.detail}</p>
      <span class="evidence-tag">${sector.evidence}</span>
      <div class="sector-card-foot"><span>Assessment</span><b>Not assessed</b></div>
    </article>`).join("");
  $$(".sector-card").forEach(card => card.addEventListener("click", () => {
    $("#gapFilter").value = card.dataset.sector;
    showPage("gaps");
    renderGapRows();
  }));
}

function renderGapRows() {
  const selected = $("#gapFilter").value;
  const evidenceFilter = $("#evidenceFilter").value;
  const filtered = sectors.filter(sector => (selected === "all" || sector.name === selected) &&
    (evidenceFilter === "all" || evidenceFilter === "needs-evidence"));
  $("#gapRows").innerHTML = filtered.map((sector, index) => `
    <div class="gap-row">
      <span class="gap-sector">${sector.name}</span>
      <span class="gap-status">○ &nbsp;NOT ASSESSED</span>
      <span class="gap-evidence">Identify dated, comparable public evidence</span>
      <span class="gap-open" aria-hidden="true">→</span>
    </div>`).join("") || '<div class="empty-state"><b>No sectors match this filter.</b></div>';
}

function renderCountryChips() {
  $("#countryChips").innerHTML = countries.map(country =>
    `<span class="country-chip${country === "United States" ? " selected" : ""}">${country}</span>`).join("");
}

function renderSources(filterText = "", filterSector = "all") {
  const query = filterText.trim().toLowerCase();
  const filtered = sources.filter(source => {
    const searchText = `${source.title} ${source.publisher} ${source.sector} ${source.description} ${source.type}`.toLowerCase();
    return (!query || searchText.includes(query)) && (filterSector === "all" || source.sector === filterSector);
  });
  $("#resultCount").textContent = `${filtered.length} SOURCES`;
  $("#sourceGrid").innerHTML = filtered.length ? filtered.map(source => `
    <article class="source-card">
      <div class="source-card-top"><span class="source-type">${source.type}</span><span class="source-date">${source.date}</span></div>
      <h3>${source.title}</h3><p>${source.description}</p>
      <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.publisher} ↗</a>
      <div class="source-tags"><span>${source.sector}</span></div>
    </article>`).join("") : '<div class="no-results">No matching sources. Try a broader search.</div>';
}

function renderMethodSources() {
  $("#methodSources").innerHTML = sources.slice(0, 5).map(source =>
    `<a class="method-source" href="${source.url}" target="_blank" rel="noopener noreferrer">${source.publisher} ↗</a>`).join("");
}

function renderIndicators() {
  $("#progressGrid").innerHTML = indicatorExamples.map((indicator, index) => `
    <article class="progress-card">
      <div class="progress-card-head"><h3>${indicator.title}</h3><span class="indicator-code">${indicator.code}</span></div>
      <p>${indicator.desc}</p><div class="progress-bar"><span></span></div>
      <div class="progress-card-foot"><span>${indicator.frequency}</span><span>${indicator.unit}</span></div>
    </article>`).join("");
}

function chartDefaults() {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#202a2b", titleColor: "#e7efeb", bodyColor: "#bac7c0", borderColor: "#3d4b49", borderWidth: 1 } },
    scales: {
      r: { min: 0, max: 5, ticks: { display: false, stepSize: 1 }, grid: { color: "#2b3939" }, angleLines: { color: "#2b3939" }, pointLabels: { color: "#a8b5af", font: { family: "DM Sans", size: 9 } } }
    }
  };
}

function radarChart() {
  const canvas = $("#sectorChart");
  if (!canvas || !window.Chart) return;
  if (sectorChart) sectorChart.destroy();
  const labels = sectors.map(s => s.name.replace(" &amp;", " &"));
  sectorChart = new Chart(canvas, {
    type: "radar",
    data: { labels, datasets: [
      { label: "India · illustrative", data: sectors.map(s => sampleScores[s.name][0]), borderColor: "#81c9a4", backgroundColor: "#81c9a41c", pointBackgroundColor: "#81c9a4", pointRadius: 2, borderWidth: 1.5 },
      { label: "Selected benchmark · illustrative", data: sectors.map(s => sampleScores[s.name][1]), borderColor: "#79a8c9", backgroundColor: "#79a8c910", pointBackgroundColor: "#79a8c9", pointRadius: 2, borderWidth: 1.3 }
    ] }, options: { ...chartDefaults(), scales: { ...chartDefaults().scales, r: { ...chartDefaults().scales.r, pointLabels: { color: "#a8b5af", font: { family: "DM Sans", size: 8 } } } } }
  });
}

function sectorValues(sectorName, country) {
  const base = sectorName === "all" ? sectors.map(s => s.name) : [sectorName];
  const offset = countries.indexOf(country);
  return {
    labels: base.map(name => name.replace(" &amp;", " &")),
    india: base.map(name => sampleScores[name][0]),
    comparator: base.map(name => Math.min(5, Math.max(0, sampleScores[name][1] - offset * 0.13)))
  };
}

function buildBarChart(canvasId, sectorName, country, existing) {
  const canvas = $(`#${canvasId}`);
  if (!canvas || !window.Chart) return existing;
  if (existing) existing.destroy();
  const data = sectorValues(sectorName, country);
  return new Chart(canvas, {
    type: "bar",
    data: { labels: data.labels, datasets: [
      { label: "India · illustrative", data: data.india, backgroundColor: "#81c9a4", borderRadius: 2, barPercentage: .63 },
      { label: `${country} · illustrative`, data: data.comparator, backgroundColor: "#79a8c9", borderRadius: 2, barPercentage: .63 }
    ] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, position: "bottom", labels: { color: "#9ba8a3", boxWidth: 8, boxHeight: 8, usePointStyle: true, pointStyle: "circle", font: { family: "DM Sans", size: 9 } } }, tooltip: { ...chartDefaults().plugins.tooltip } },
      scales: { x: { ticks: { color: "#9aa7a2", font: { family: "DM Sans", size: 8 }, maxRotation: 25, minRotation: 0 }, grid: { display: false }, border: { color: "#33403f" } }, y: { min: 0, max: 5, ticks: { color: "#778580", stepSize: 1, font: { family: "DM Mono", size: 8 } }, grid: { color: "#293637" }, border: { display: false } } }
    }
  });
}

function updateComparisonCharts() {
  const dashboardSector = $("#comparisonSector").value;
  const country = $("#comparisonCountry").value;
  comparisonChart = buildBarChart("comparisonChart", dashboardSector, country, comparisonChart);
  const fullSector = $("#fullSectorFilter").value === "all" ? sectors[0].name : $("#fullSectorFilter").value;
  const fullCountry = $("#fullCountryFilter").value;
  $("#comparisonTitle").textContent = `${fullSector} · illustrative indicators`;
  fullComparisonChart = buildBarChart("fullComparisonChart", fullSector, fullCountry, fullComparisonChart);
}

function showPage(name) {
  const page = $(`#page-${name}`);
  if (!page) return;
  $$(".page").forEach(item => item.classList.toggle("active", item === page));
  $$(".nav-link[data-page]").forEach(link => link.classList.toggle("active", link.dataset.page === name));
  $("#pageCrumb").textContent = page.dataset.title;
  $("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "comparison") setTimeout(updateComparisonCharts, 30);
}

function filterSources() {
  renderSources($("#researchSearch").value, $("#researchSectorFilter").value);
}

function generateRoadmap() {
  const sector = $("#plannerSector").value;
  const question = $("#plannerChallenge").value.trim();
  const horizon = $("#plannerHorizon").value;
  const horizonOrder = { short: 0, medium: 1, long: 2 };
  const actions = horizon === "all" ? roadmapActions : roadmapActions.filter((_, index) => index === horizonOrder[horizon]);
  $("#roadmapTitle").textContent = `${sector} · example improvement framework`;
  $("#roadmapOutput").className = "roadmap-results";
  $("#roadmapOutput").innerHTML = `
    <div class="roadmap-intro"><b>Research question:</b> ${escapeHtml(question || `What public evidence can guide capability development in ${sector}?`)}<br>
      These general planning actions require independent validation against current, sector-specific evidence.</div>
    ${actions.map((action, index) => `<article class="roadmap-item"><span class="roadmap-num">${index + 1}</span><div><b>${action.title}</b><p>${action.body}</p><div class="roadmap-meta"><span>${action.who}</span><span>${action.when}</span><span>MEASURE · ${action.metric}</span></div></div></article>`).join("")}
    <div class="roadmap-source-note">Citations: none attached to this generated example. Find sector-specific sources in the Research Explorer before treating any recommendation as evidence-based.</div>`;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function init() {
  createSectorOptions();
  renderSectors();
  renderGapRows();
  renderCountryChips();
  renderSources();
  renderMethodSources();
  renderIndicators();

  $$("[data-page]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.page)));
  $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  $(".notice-close").addEventListener("click", () => $(".notice-bar").remove());
  $("#gapFilter").addEventListener("change", renderGapRows);
  $("#evidenceFilter").addEventListener("change", renderGapRows);
  $("#comparisonSector").addEventListener("change", updateComparisonCharts);
  $("#comparisonCountry").addEventListener("change", updateComparisonCharts);
  $("#fullSectorFilter").addEventListener("change", updateComparisonCharts);
  $("#fullCountryFilter").addEventListener("change", updateComparisonCharts);
  $("#researchSearch").addEventListener("input", filterSources);
  $("#researchSectorFilter").addEventListener("change", filterSources);
  $("#generateRoadmap").addEventListener("click", generateRoadmap);
  $("#quickSearch").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      $("#researchSearch").value = event.currentTarget.value;
      filterSources();
      showPage("research");
    }
  });
  $$(".quick-tags button").forEach(button => button.addEventListener("click", () => {
    $("#researchSearch").value = button.dataset.search;
    filterSources();
    showPage("research");
  }));
  $$(".priority-item").forEach(button => button.addEventListener("click", () => {
    $("#plannerSector").value = button.dataset.sector;
    showPage("planner");
  }));
  $("#chartMode").addEventListener("click", () => {
    activeChartMode = activeChartMode === "capability" ? "readiness" : "capability";
    $("#chartMode").textContent = activeChartMode === "capability" ? "Capability view⌄" : "Readiness view⌄";
    if (sectorChart) {
      sectorChart.data.datasets[0].data = activeChartMode === "capability"
        ? sectors.map(s => sampleScores[s.name][0])
        : sectors.map(s => Math.max(0, sampleScores[s.name][0] - .4));
      sectorChart.update();
    }
  });
  if (window.Chart) {
    radarChart();
    updateComparisonCharts();
  } else {
    $$(".chart-wrap, .bar-chart-wrap").forEach(canvas => {
      canvas.innerHTML = '<div class="empty-state"><b>Charts unavailable</b><span>Connect to the internet to load the Chart.js demo.</span></div>';
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
