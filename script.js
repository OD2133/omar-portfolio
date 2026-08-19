// ===============================
// YOUR PORTFOLIO PROJECTS
// ===============================
const projects = [
  {
    title: "Selected Reel 01",
    category: "Reels",
    video: "videos/reel-01.mp4",
    poster: ""
  },
  {
    title: "Real Estate Reel",
    category: "Real Estate",
    video: "",
    poster: ""
  },
  {
    title: "Social Media Reel",
    category: "Social",
    video: "",
    poster: ""
  },
  {
    title: "Commercial Edit",
    category: "Commercial",
    video: "",
    poster: ""
  }
];

const projectsEl = document.getElementById("projects");
const filtersEl = document.getElementById("filters");
const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");
const modalClose = document.getElementById("modalClose");

// Autoplay only when at least 55% of a project is visible.
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
  document.querySelectorAll(".project").forEach(card => {
    autoplayObserver.observe(card);
  });
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
        ${p.poster
          ? `<img src="${p.poster}" alt="${p.title}" loading="lazy">`
          : p.video
            ? `<video src="${p.video}" muted playsinline loop preload="metadata"></video>`
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
      if (v) {
        v.muted = true;
        v.play().catch(() => {});
      }
    });

    card.addEventListener("mouseleave", () => {
      const v = card.querySelector("video");
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    });

    card.addEventListener("click", () => {
      openProject(Number(card.dataset.index));
    });
  });

  observeAutoplayVideos();
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
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

renderFilters();
renderProjects();
