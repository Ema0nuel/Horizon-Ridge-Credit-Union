import './style.css'
import { loadPage, parsePathToRoute } from './router.js'

const app = document.getElementById("app");
window.app = app

document.addEventListener("click", async (e) => {
    let target = e.target;
    while (target && target !== document) {
        if (target.matches && target.matches('[data-nav]')) {
            e.preventDefault();
            const path = target.getAttribute('href');
            const parsed = parsePathToRoute(path);
            const page = parsed.page;
            await loadPage(page);
            // Only load JivoChat if not on admin page
            if (!page.startsWith("admin/") && page !== "admin-login") {
                loadJivoChat();
            } else {
                removeJivoChat();
            }
            break;
        }
        target = target.parentElement;
    }
});

function loadJivoChat() {
    if (window.jivo_api || document.getElementById("jivo-script")) return;
    const script = document.createElement('script');
    script.id = "jivo-script";
    script.src = '//code.jivosite.com/widget/lhfN2DQKWY';
    script.async = true;
    document.body.appendChild(script);
}

function removeJivoChat() {
    // Remove the script
    const script = document.getElementById("jivo-script");
    if (script) script.remove();
    // Remove the widget if already loaded
    if (window.jivo_api && window.jivo_api.destroy) {
        window.jivo_api.destroy();
    }
    // Remove widget DOM if present
    const widget = document.getElementById("jvlabelWrap");
    if (widget) widget.remove();
}


window.addEventListener("DOMContentLoaded", async () => {
    const { page, args } = parsePathToRoute(window.location.pathname);
    await loadPage(page, ...(args || []));
    if (!page.startsWith("admin/") && page !== "admin-login") {
        loadJivoChat();
    } else { //
        removeJivoChat();
    }
});

// Welcome to the main connect routing page to the branch page and dynamically manage everything...