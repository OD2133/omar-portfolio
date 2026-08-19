// ===============================
// AUTO-LOAD VIDEOS FROM /videos
// ===============================
// Add a video to the GitHub `videos` folder and commit it.
// No code changes are needed.
// Filename examples:
// real-estate-luxury-01.mp4
// commercial-brand-01.mp4
// social-reel-01.mp4

const GITHUB_OWNER = "OD2133";
const GITHUB_REPO = "omar-portfolio";
const VIDEOS_PATH = "videos";

let projects = [];

const projectsEl = document.getElementById("projects");
const filtersEl = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");
const modalClose = document.getElementById("modalClose");

const autoplayObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector("video");
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: [0, 0.55, 1] });

function observeAutoplayVideos() {
  document.querySelectorAll(".project").forEach(card => autoplayObserver.observe(card));
}

function humanizeFilename(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function inferCategory(filename) {
  const name = filename.toLowerCase();
  if (name.includes("real-estate") || name.includes("realestate") || name.includes("property")) return "Real Estate";
  if (name.includes("commercial") || name.includes("brand") || name.includes("ad")) return "Commercial";
  if (name.includes("personal") || name.includes("creator")) return "Personal Brand";
  if (name.includes("social") || name.includes("reel")) return "Social";
  return "Reels";
}

function buildProject(file) {
  return {
    title: humanizeFilename(file.name),
    category: inferCategory(file.name),
    video: file.download_url,
    poster: ""
  };
}

async function loadProjectsFromGitHub() {
  projectsEl.innerHTML = `
    <div class="projects-loading">
      <span>LOADING WORK</span>
    </div>
  `;

  try {
    const endpoint = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${VIDEOS_PATH}?ref=main`;
    const response = await fetch(endpoint, {
      headers: { "Accept": "application/vnd.github+json" },
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`GitHub API ${response.status}`);

    const files = await response.json();

    projects = files
      .filter(file => file.type === "file" && /\.(mp4|webm|mov)$/i.test(file.name))
      .map(buildProject)
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }));

    renderFilters();
    renderProjects();

    if (!projects.length) {
      projectsEl.innerHTML = `
        <div class="projects-empty">
          <span>NO VIDEOS YET</span>
          <p>Upload an MP4 to the <strong>videos</strong> folder on GitHub.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Could not load portfolio videos:", error);
    projectsEl.innerHTML = `
      <div class="projects-empty">
        <span>WORK IS LOADING</span>
        <p>If you just uploaded a video, refresh the page in a few seconds.</p>
      </div>
    `;
  }
}

function renderFilters() {
  const categories = ["All", ...new Set(projects.map(p => p.category))];

  filtersEl.innerHTML = categories.map((category, i) =>
    `<button class="filter ${i === 0 ? "active" : ""}" data-category="${category}">${category}</button>`
  ).join("");

  filtersEl.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      filtersEl.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(btn.dataset.category);
    });
  });
}

function renderProjects(category = "All") {
  const visible = category === "All"
    ? projects
    : projects.filter(p => p.category === category);

  projectsEl.innerHTML = visible.map((p, index) => `
    <article class="project" data-index="${projects.indexOf(p)}">
      <div class="thumb">
        <video src="${p.video}" muted playsinline loop preload="metadata"></video>
        <div class="project-overlay"></div>
      </div>
      <div class="project-info">
        <strong>${p.title}</strong>
        <span>${p.category}</span>
      </div>
    </article>
  `).join("");

  projectsEl.querySelectorAll(".project").forEach(card => {
    card.addEventListener("mouseenter", () => {
      const v = card.querySelector("video");
      if (v) v.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      const v = card.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });
    card.addEventListener("click", () => openProject(Number(card.dataset.index)));
  });

  observeAutoplayVideos();
}

function openProject(index) {
  const p = projects[index];
  if (!p || !p.video) return;
  modalVideo.src = p.video;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modalVideo.play().catch(() => {});
}

function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

loadProjectsFromGitHub();

// ===== Editing Tools Strip =====
const toolsData = {
  premiere: {
    kicker: "PREMIERE PRO",
    title: "Editing & storytelling",
    description: "Reels editing, pacing, cuts, sound design and final social-media delivery.",
    tags: ["Reels", "Pacing", "Sound Design"]
  },
  aftereffects: {
    kicker: "AFTER EFFECTS",
    title: "Motion graphics & visual effects",
    description: "Motion graphics, animated typography, transitions, compositing and visual effects.",
    tags: ["Motion Graphics", "Typography", "VFX"]
  },
  capcut: {
    kicker: "CAPCUT",
    title: "Captions & fast social edits",
    description: "Arabic/English captions, quick social edits, templates and fast-turnaround content.",
    tags: ["Captions", "Social", "Fast Delivery"]
  },
  photoshop: {
    kicker: "PHOTOSHOP",
    title: "Thumbnails & visual assets",
    description: "Thumbnails, image cleanup, cutouts and supporting graphics for social content.",
    tags: ["Thumbnails", "Compositing", "Assets"]
  }
};

const toolsStrip = document.querySelector(".tools-strip");
const toolItems = document.querySelectorAll(".tool-item");
const toolKicker = document.getElementById("toolKicker");
const toolTitle = document.getElementById("toolTitle");
const toolDescription = document.getElementById("toolDescription");
const toolTags = document.getElementById("toolTags");

let mobileToolIndex = 0;
let mobileToolTimer;

function showTool(key) {
  const data = toolsData[key];
  if (!data) return;

  toolItems.forEach(item => {
    item.classList.toggle("active", item.dataset.tool === key);
  });

  toolKicker.textContent = data.kicker;
  toolTitle.textContent = data.title;
  toolDescription.textContent = data.description;
  toolTags.innerHTML = data.tags.map(tag => `<span class="detail-tag">${tag}</span>`).join("");
}

function startMobileToolRotation() {
  if (window.matchMedia("(min-width: 801px)").matches) return;

  clearInterval(mobileToolTimer);
  mobileToolTimer = setInterval(() => {
    mobileToolIndex = (mobileToolIndex + 1) % toolItems.length;
    const next = toolItems[mobileToolIndex];
    showTool(next.dataset.tool);
    toolsStrip.classList.add("tool-open");
    setTimeout(() => toolsStrip.classList.remove("tool-open"), 2600);
  }, 4200);
}

toolItems.forEach((item, index) => {
  item.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      showTool(item.dataset.tool);
    }
  });

  item.addEventListener("click", () => {
    mobileToolIndex = index;
    showTool(item.dataset.tool);
    toolsStrip.classList.add("tool-open");
    setTimeout(() => toolsStrip.classList.remove("tool-open"), 3000);
  });
});

showTool("premiere");
startMobileToolRotation();
window.addEventListener("resize", startMobileToolRotation);
