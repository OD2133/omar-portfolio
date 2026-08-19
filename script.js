// ===============================
// EDIT YOUR PORTFOLIO HERE
// ===============================
// Add a new project by copying one object.
// video: path to your video file OR a direct video URL.
// poster: optional thumbnail image.
// category: used by the filter buttons.

const projects = [
  {
    title: "Real Estate Reel",
    category: "Real Estate",
    video: "",
    poster: "",
  },
  {
    title: "Social Media Reel",
    category: "Social",
    video: "",
    poster: "",
  },
  {
    title: "Commercial Edit",
    category: "Commercial",
    video: "",
    poster: "",
  },
  {
    title: "Personal Brand",
    category: "Personal Brand",
    video: "",
    poster: "",
  },
];

const projectsEl = document.getElementById("projects");
const filtersEl = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");
const modalClose = document.getElementById("modalClose");

const categories = ["All", ...new Set(projects.map(p => p.category))];

function renderFilters() {
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
        ${p.poster
          ? `<img src="${p.poster}" alt="${p.title}" loading="lazy">`
          : p.video
            ? `<video src="${p.video}" muted loop playsinline preload="metadata"></video>`
            : `<div class="thumb-placeholder">ADD VIDEO ${String(index + 1).padStart(2,"0")}</div>`
        }
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
      if (v) { v.pause(); v.currentTime = 0; }
    });
    card.addEventListener("click", () => openProject(Number(card.dataset.index)));
  });
}

function openProject(index) {
  const p = projects[index];
  if (!p.video) return;
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
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

renderFilters();
renderProjects();
