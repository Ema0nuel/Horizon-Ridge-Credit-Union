// src/components/themeToggle.js

export function renderThemeToggle() {
    // 1. Initialize theme from localStorage
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = storedTheme || (prefersDark ? "dark" : "light");

    // Apply initial theme
    document.documentElement.classList.toggle("dark", currentTheme === "dark");

    // 2. Create toggle button
    const button = document.createElement("button");
    button.setAttribute("aria-label", "Toggle Theme");
    button.className = `
    px-[8px] pt-[3px] rounded-[50%] ml-3
    bg-brand-sun dark:bg-brand-teal
    text-white shadow-md
    hover:scale-105 transition-transform
  `;

    button.innerHTML =
        currentTheme === "dark"
            ? `<i class="fas fa-sun text-lg"></i>`
            : `<i class="fas fa-moon text-lg"></i>`;

    // 3. Handle toggle logic
    button.addEventListener("click", () => {
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        location.reload(); // Optional reload for full reset
    });

    return button;
}
