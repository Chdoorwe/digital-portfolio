
    /* ============================================================
       READABILITY / LIGHT MODE TOGGLE
       ------------------------------------------------------------
       This script controls your "Toggle Readability" button.
       It switches the entire website between:

       - normal CRT neon‑green mode
       - readable light mode (white background, dark text)

       It also SAVES the user's choice in localStorage so the
       mode stays active even after refreshing or reopening the page.
    ============================================================ */

    // Get the toggle button from your HTML
    // REQUIRED HTML:
    // <button id="readability-toggle">Toggle Readability</button>
    const toggleBtn = document.getElementById("readability-toggle");

    /* ============================================================
       APPLY SAVED MODE ON PAGE LOAD
       ------------------------------------------------------------
       If the user has previously turned on readability mode,
       we add the class "readable-mode" to <body> immediately.
       This prevents a flash of the wrong theme.
    ============================================================ */
    if (localStorage.getItem("readable") === "true") {
        document.body.classList.add("readable-mode");
    }

    /* ============================================================
       BUTTON CLICK HANDLER
       ------------------------------------------------------------
       When the user clicks the toggle button:
       - Add/remove the "readable-mode" class on <body>
       - Save the new state to localStorage
    ============================================================ */
    toggleBtn.addEventListener("click", () => {

        // Toggle the class on the <body> element
        document.body.classList.toggle("readable-mode");

        // Check if readable mode is now active
        const isReadable = document.body.classList.contains("readable-mode");

        // Save the state so it persists across page loads
        localStorage.setItem("readable", isReadable);
    });
