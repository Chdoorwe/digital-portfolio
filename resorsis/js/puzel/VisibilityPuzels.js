function updateVisibility(condition, elementId) {
    const el = document.getElementById(elementId);

    if (!el) return; // safety

    if (condition) {
        el.style.display = "block";   // show
    } else {
        el.style.display = "none";    // hide
    }
}