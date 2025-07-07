// src/utils/preloader.js

export function startPreloader() {
  if (document.getElementById("page-preloader")) return;

  const preloader = document.createElement("div");
  preloader.id = "page-preloader";
  preloader.className = `
    fixed inset-0 z-50 bg-white dark:bg-brand-dark
    flex flex-col gap-6 px-8 py-10 opacity-100 transition-opacity duration-500
  `;

  preloader.innerHTML = `
    <div class="skeleton h-8 w-1/4 rounded"></div>
    <div class="skeleton h-5 w-full rounded"></div>
    <div class="skeleton h-5 w-full rounded"></div>
    <div class="skeleton h-5 w-[90%] rounded"></div>
    <div class="skeleton h-5 w-[95%] rounded"></div>
    <div class="skeleton h-64 w-full rounded-xl"></div>
    <div class="skeleton h-5 w-[60%] rounded"></div>
    <div class="skeleton h-5 w-full rounded"></div>
    <div class="skeleton h-48 w-full rounded-lg"></div>
  `;

  // Optional: hide app content while loading
  const app = document.getElementById("app");
  if (app) app.classList.add("opacity-0", "transition-opacity", "duration-300");

  document.body.append(preloader);
}

export function endPreloader(duration = 500) {
  const preloader = document.getElementById("page-preloader");
  const app = document.getElementById("app");

  if (preloader) {
    preloader.classList.add("opacity-0");
    preloader.classList.remove("opacity-100");

    // Remove preloader after fade-out
    setTimeout(() => {
      preloader.remove();
      if (app) {
        app.classList.remove("opacity-0");
        app.classList.add("opacity-100");
      }
    }, duration); // match transition duration
  }
}
