export function reset(pageName) {
    window.scrollTo({
        behavior: "smooth",
        left: 0,
        top: 0,
    });

    document.title = pageName
}