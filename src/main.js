import './style.css'
import { loadPage, parsePathToRoute } from './router.js'

const app = document.getElementById("app");
window.app = app

document.addEventListener("click", async (e) => {
    // Traverse up to find a parent with data-nav
    let target = e.target;
    while (target && target !== document) {
        if (target.matches && target.matches('[data-nav]')) {
            e.preventDefault();
            const path = target.getAttribute('href');
            const parsed = parsePathToRoute(path);
            const page = parsed.page;
            await loadPage(page);
            break;
        }
        target = target.parentElement;
    }
});


function loadJivoChat() {
  if (window.jivo_api) return; // Prevent duplicate loading

  const script = document.createElement('script');
  script.src = '//code.jivosite.com/widget/lhfN2DQKWY';
  script.async = true;
  document.body.appendChild(script);
}

// Call this once on initial load (e.g., after auth check or router load)
loadJivoChat();
