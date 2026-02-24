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
function addCommand(name, handler, options = {}) {
  commands[name.toLowerCase()] = {
    run: handler,
    hidden: options.hidden || false,
    locked: options.locked || false
  };
}

// ===============================
// Persistent Puzzle State
// (from your old console.js)
// ===============================

let puzzleHuntRan = localStorage.getItem("puzelHuntRan") === "true";
let puzzleHuntHelp = parseInt(localStorage.getItem("puzzleHuntHelp")) || 0;
let puzzleNumber = parseInt(localStorage.getItem("puzzleNumber")) || 0;

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
// CRT Flicker Effect
// ===============================

function crtFlicker() {
  screen.classList.add("crt-flicker");
  setTimeout(() => screen.classList.remove("crt-flicker"), 400);
}

// ===============================
// Built‑in Commands
// ===============================

addCommand("help", async () => {
  await typeLine("Available commands:");

  Object.keys(commands).forEach(cmd => {
    const c = commands[cmd];
    if (!c.hidden && !c.locked) {
      printLineInstant("  " + cmd);
    }
  });
});

addCommand("clear", async () => {
  const lines = [...screen.querySelectorAll(".line")];
  lines.forEach(l => l.remove());
});

// ===============================
// Command Processor
// ===============================

async function handleCommand(raw) {
  const inputText = raw.trim();
  if (!inputText) return;

  printLineInstant("C:\\> " + inputText);

  const parts = inputText.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commands[cmd] && !commands[cmd].locked) {
    await commands[cmd].run(args);
  } else if (commands[cmd] && commands[cmd].locked) {
    await typeLine("This command is locked.");
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
// Puzzle Button System
// ===============================

const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");
const btn3 = document.getElementById("btn-3");

// Sound Effects
const snd1 = new Audio("click1.mp3");
const snd2 = new Audio("click2.mp3");
const snd3 = new Audio("click3.mp3");

// Multiple Puzzle Patterns
const PUZZLE_PATTERNS = [
  { pattern: [1, 3, 2, 3], command: "secret" },
  { pattern: [3, 3, 1], command: "hi" },
  { pattern: [2, 1, 2, 1], command: "unlockme" }
];

let puzzleInput = [];

// Auto‑type into input
async function typeIntoInput(text) {
  input.value = "";
  for (let i = 0; i < text.length; i++) {
    input.value += text[i];
    await new Promise(res => setTimeout(res, TYPE_SPEED));
  }
}

// Auto‑run command after typing
async function autoRunCommand(cmd) {
  await typeIntoInput(cmd);
  await new Promise(res => setTimeout(res, 200));
  handleCommand(cmd);
}

// Unlock a command
function unlockCommand(name) {
  if (commands[name]) {
    commands[name].locked = false;
  }
}

// Handle puzzle click
function registerPuzzleClick(num) {
  puzzleInput.push(num);

  for (const entry of PUZZLE_PATTERNS) {
    const pattern = entry.pattern;

    if (puzzleInput.length > pattern.length) {
      puzzleInput = [];
      return;
    }

    let match = true;
    for (let i = 0; i < puzzleInput.length; i++) {
      if (puzzleInput[i] !== pattern[i]) {
        match = false;
        break;
      }
    }

    if (!match) continue;

    if (puzzleInput.length === pattern.length) {
      autoRunCommand(entry.command);
      unlockCommand(entry.command);
      puzzleInput = [];
      return;
    }
  }
}

// Button listeners with sound
btn1.addEventListener("click", () => {
  snd1.currentTime = 0;
  snd1.play();
  registerPuzzleClick(1);
});

btn2.addEventListener("click", () => {
  snd2.currentTime = 0;
  snd2.play();
  registerPuzzleClick(2);
});

btn3.addEventListener("click", () => {
  snd3.currentTime = 0;
  snd3.play();
  registerPuzzleClick(3);
});

// ===============================
// Custom Commands
// ===============================

// Hidden "hi" command (binary message)
addCommand("hi", async () => {
  crtFlicker();
  await typeLine(
    "01001000 01100101 01101100 01101100 01101111 00100000 01110100 01101000 01100101 01110010 01100101 00101100 00100000 01111001 01101111 01110101 00100000 01100110 01101111 01110101 01101110 01100100 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 00100000 01101100 01100101 01110100 01110011 00100000 01110000 01101100 01100001 01111001 00100000 01100001 00100000 01100111 01100001 01101101 01100101 00100000 01110010 01110101 01101110 00111010 00101111 01100110 01110101 01100011 00101101 01110000 01110101 01111010 01100101 01101100 00101110 01101000 01110101 01101110 01110100"
  );
}, { hidden: true });

// Secret command
addCommand("secret", async () => {
  crtFlicker();
  await typeLine("Puzzle unlocked!");
}, { hidden: true });

addCommand("secret", async () => {
  crtFlicker();
  await typeLine("Puzzle unlocked!");
}, { hidden: true });

// Locked command example
addCommand("run:/fuc-puzel.hunt", async () => {
  await typeLine("The Puzzles Have started have fun");
  
}, { locked: true });

//run:/fuc-puzel.hunt

// Scan command
addCommand("scan", async () => {
  await typeLine("Running system scan...");
  await typeLine("Checking memory...");
  await typeLine("Checking drives...");
  await typeLine("Checking I/O ports...");
  await typeLine("Scan complete. No issues found.");
});
