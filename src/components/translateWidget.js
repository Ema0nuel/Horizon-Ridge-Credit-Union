export function renderFlagLanguageToggle() {
    const languages = [
        { code: "en", label: "English", flag: "https://flagcdn.com/us.svg" },
        { code: "fr", label: "Français", flag: "https://flagcdn.com/fr.svg" },
        { code: "es", label: "Español", flag: "https://flagcdn.com/es.svg" },
        { code: "de", label: "Deutsch", flag: "https://flagcdn.com/de.svg" },
        { code: "pt", label: "Português", flag: "https://flagcdn.com/pt.svg" },
        { code: "zh-CN", label: "中文", flag: "https://flagcdn.com/cn.svg" },
        { code: "ar", label: "العربية", flag: "https://flagcdn.com/sa.svg" },
    ];

    const selectedLang = localStorage.getItem("selectedLang") || "en";

    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "fixed bottom-4 left-4 z-50";

    // Button
    const button = document.createElement("button");
    button.className = `
    w-10 h-10 p-1 bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-600
    rounded-full shadow-lg focus:outline-none flex items-center justify-center
  `;
    button.innerHTML = `
    <img src="${languages.find(l => l.code === selectedLang).flag}" 
         alt="lang" class="w-6 h-6 rounded-full">
  `;

    // Dropdown
    const dropdown = document.createElement("div");
    dropdown.className = `
    hidden flex-col mt-2 p-2 bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-600 
    rounded-lg shadow-lg absolute bottom-12 left-0 w-40
  `;

    // Add language options
    languages.forEach(({ code, label, flag }) => {
        const item = document.createElement("button");
        item.className = `
      flex items-center gap-2 px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-200 
      hover:bg-gray-100 dark:hover:bg-gray-700 w-full rounded
    `;
        item.innerHTML = `
      <img src="${flag}" alt="${code}" class="w-5 h-5 rounded-full">
      <span>${label}</span>
    `;
        item.addEventListener("click", () => {
            localStorage.setItem("selectedLang", code);
            document.cookie = `googtrans=/en/${code};path=/`;
            localStorage.setItem("translated", "true");
            location.reload();
        });
        dropdown.appendChild(item);
    });

    // Toggle on click
    let open = false;
    button.addEventListener("click", () => {
        open = !open;
        dropdown.classList.toggle("hidden", !open);
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.add("hidden");
            open = false;
        }
    });

    // Append
    wrapper.appendChild(button);
    wrapper.appendChild(dropdown);

    // Load Google Translate
    if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.head.appendChild(script);
    }

    // Init function
    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
            {
                pageLanguage: "en",
                includedLanguages: languages.map(l => l.code).join(","),
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
            },
            "google_translate_element"
        );

        // Auto detect first time
        const hasTranslated = localStorage.getItem("translated");
        const browserLang = navigator.language.split("-")[0];
        const exists = languages.find(l => l.code.startsWith(browserLang));

        if (!hasTranslated && exists && exists.code !== "en") {
            localStorage.setItem("selectedLang", exists.code);
            document.cookie = `googtrans=/en/${exists.code};path=/`;
            localStorage.setItem("translated", "true");
            location.reload();
        }
    };

    return wrapper;
}
