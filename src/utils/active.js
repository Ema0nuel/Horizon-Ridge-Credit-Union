import { parsePathToRoute } from '../router';

/**
 * Applies the "active" class to the navigation link that matches the current page.
 * @param {string} currentPage - The name of the current route page (e.g. 'about', 'contact').
 */
export function setActiveNav(currentPage) {
    const navLinks = document.querySelectorAll('[data-nav]');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Skip links with no href
        if (!href) return;

        // Use your route parser to extract the target page
        const { page: linkPage } = parsePathToRoute(href);

        // Toggle the active class based on the current page
        if (linkPage === currentPage) {
            link.classList.add('active-p');
        } else {
            link.classList.remove('active-p');
        }
    });
}
