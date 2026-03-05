let pattern = "its ther";   // <-- change this anytime
let buffer = "";

document.addEventListener("keydown", (event) => {
    // Only track real characters
    if (event.key.length === 1) {
        buffer += event.key.toLowerCase();
    }

    // Keep buffer from growing forever
    if (buffer.length > pattern.length) {
        buffer = buffer.slice(-pattern.length);
    }

    // Check for match
    if (buffer.endsWith(pattern.toLowerCase())) {
        console.log("Pattern detected:", pattern);
        // Do something here
        buffer = ""; // optional reset
        window.location.href = "puzel_end.html";
    }
});