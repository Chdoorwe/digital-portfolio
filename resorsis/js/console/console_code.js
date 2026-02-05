// ===============================
// Retro Console Core
// ===============================

const screen = document.getElementById("screen");
const input = document.getElementById("console-input");

// Typing speed
const TYPE_SPEED = 25;

// Command registry
const commands = {};

// Helper to register commands
function addCommand(name, handler) {
  commands[name.toLowerCase()] = handler;
}

// ===============================
// Typing + Output
// ===============================

function typeLine(text = "") {
  return new Promise(resolve => {
    const line = document.createElement("div");
    line.className = "line";
    screen.insertBefore(line, screen.querySelector(".prompt-line"));

    let i = 0;
    function typeChar() {
      line.textContent = text.slice(0, i);
      screen.scrollTop = screen.scrollHeight;

      if (i < text.length) {
        i++;
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        resolve();
      }
    }
    typeChar();
  });
}

function printLineInstant(text = "") {
  const line = document.createElement("div");
  line.className = "line";
  line.textContent = text;
  screen.insertBefore(line, screen.querySelector(".prompt-line"));
  screen.scrollTop = screen.scrollHeight;
}

// ===============================
// Built‑in Commands
// ===============================

addCommand("help", async () => {
  await typeLine("Available commands:");
  Object.keys(commands).forEach(cmd => {
    printLineInstant("  " + cmd);
  });
});

addCommand("clear", async () => {
  const lines = [...screen.querySelectorAll(".line")];
  lines.forEach(l => l.remove());
});

addCommand("echo", async (args) => {
  await typeLine(args.join(" "));
});

// ===============================
// Command Processor
// ===============================

async function handleCommand(raw) {
  const inputText = raw.trim();
  if (!inputText) return;

  // Echo user input instantly
  printLineInstant("C:\\> " + inputText);

  const parts = inputText.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commands[cmd]) {
    await commands[cmd](args);
  } else {
    await typeLine(`'${cmd}' is not recognized as an internal command.`);
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleCommand(input.value);
    input.value = "";
  }
});

// ===============================
// Window Buttons
// ===============================

const frame = document.querySelector(".pc-frame");
const btnMin = document.getElementById("btn-min");
const btnFull = document.getElementById("btn-full");
const btnClose = document.getElementById("btn-close");

btnMin.addEventListener("click", () => {
});

btnFull.addEventListener("click", () => {
});

btnClose.addEventListener("click", () => {
});

// ===============================
// Add your custom commands below
// ===============================

// Example custom command
addCommand("hi", async () => {
  await typeLine("OG-BOX SYSTEM CONSOLE");
}, { hidden: true });

// Example math command
addCommand("add", async (args) => {
  const a = Number(args[0]);
  const b = Number(args[1]);

  if (isNaN(a) || isNaN(b)) {
    await typeLine("Error: add requires two numbers.");
    return;
  }

  await typeLine(String(a + b));
});

// Example fake scan
addCommand("scan", async () => {
  await typeLine("Running system scan...");
  await typeLine("Checking memory...");
  await typeLine("Checking drives...");
  await typeLine("Checking I/O ports...");
  await typeLine("Scan complete. No issues found.");
});



