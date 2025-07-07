/**
 * Show a modern animated logo spinner preloader.
 * The logo zooms in/out with a glow and darkens on zoom out.
 * No text, smooth infinite loop, semi-transparent dark background.
 */
export function startLogoSpinner() {
    if (document.getElementById("logo-spinner-preloader")) return;

    const preloader = document.createElement("div");
    preloader.id = "logo-spinner-preloader";
    preloader.className = `
        fixed inset-0 z-50 flex items-center justify-center
        transition-colors duration-500
    `;
    preloader.style.background = "rgba(0,0,0,0.5)";

    preloader.innerHTML = `
      <div class="relative flex flex-col items-center">
        <img
          src="/src/images/logo.jpg"
          alt="Loading..."
          class="logo-spin-zoom-glow h-24 w-24 md:h-32 md:w-32 rounded-full shadow-xl"
          draggable="false"
          style="user-select:none;"
        />
      </div>
      <style>
        @keyframes logo-zoom-glow {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 0px #ffd700) brightness(1);
          }
          25% {
            transform: scale(1.13);
            filter: drop-shadow(0 0 24px #ffd700cc) brightness(1.12);
          }
          50% {
            transform: scale(0.92);
            filter: drop-shadow(0 0 8px #2228) brightness(0.82) grayscale(0.25);
          }
          75% {
            transform: scale(1.08);
            filter: drop-shadow(0 0 18px #ffd70099) brightness(1.08);
          }
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0px #ffd700) brightness(1);
          }
        }
        .logo-spin-zoom-glow {
          animation: logo-zoom-glow 2.8s cubic-bezier(.4,0,.2,1) infinite;
          transition: filter 0.3s, transform 0.3s;
          background: transparent;
        }
      </style>
    `;

    // Hide app content while loading
    const app = document.getElementById("app");
    if (app) app.classList.add("opacity-0", "transition-opacity", "duration-300");

    document.body.append(preloader);
}

/**
 * Hide the logo spinner preloader smoothly.
 * @param {number} duration - Fade-out duration in ms.
 */
export function endLogoSpinner(duration = 500) {
    const preloader = document.getElementById("logo-spinner-preloader");
    const app = document.getElementById("app");

    if (preloader) {
        preloader.style.transition = "opacity 0.5s";
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.remove();
            if (app) {
                app.classList.remove("opacity-0");
                app.classList.add("opacity-100");
            }
        }, duration);
    }
}