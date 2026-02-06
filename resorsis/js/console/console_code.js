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
    hidden: options.hidden || false
  };
}
//var


// Load permanent state
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
// Built‑in Commands
// ===============================

addCommand("help", async () => {
  await typeLine("Available commands:");

  Object.keys(commands).forEach(cmd => {
    if (!commands[cmd].hidden) {
      printLineInstant("  " + cmd);
    }
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

  printLineInstant("C:\\> " + inputText);

  const parts = inputText.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commands[cmd]) {
    await commands[cmd].run(args);
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

let puzzleInput = [];

const PUZZLE_PATTERN = [1, 3, 2, 3];




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

function puzzleSolved() {
  autoRunCommand("secret");
  puzzleInput = [];
}

function registerPuzzleClick(num) {
  puzzleInput.push(num);

  if (puzzleInput.length > PUZZLE_PATTERN.length) {
    puzzleInput = [];
    return;
  }

  for (let i = 0; i < puzzleInput.length; i++) {
    if (puzzleInput[i] !== PUZZLE_PATTERN[i]) {
      puzzleInput = [];
      return;
    }
  }

  if (puzzleInput.length === PUZZLE_PATTERN.length) {
    puzzleSolved();
  }
}

btn1.addEventListener("click", () => registerPuzzleClick(1));
btn2.addEventListener("click", () => registerPuzzleClick(2));
btn3.addEventListener("click", () => registerPuzzleClick(3));

// ===============================
// Custom Commands
// ===============================

// Hidden "hi" command (binary message)
addCommand("hi", async () => {
  await typeLine(
    "01001000 01100101 01101100 01101100 01101111 00100000 01110100 01101000 01100101 01110010 01100101 00101100 00100000 01111001 01101111 01110101 00100000 01100110 01101111 01110101 01101110 01100100 00100000 01110100 01101000 01100101 00100000 01100011 01101111 01101110 01110011 01101111 01101100 01100101 00100000 01101100 01100101 01110100 01110011 00100000 01110000 01101100 01100001 01111001 00100000 01100001 00100000 01100111 01100001 01101101 01100101 00100000 01110010 01110101 01101110 00111010 00101111 01100110 01110101 01100011 00101101 01110000 01110101 01111010 01100101 01101100 00101110 01101000 01110101 01101110 01110100"
  );
}, { hidden: true });

// Hidden example
addCommand("secret", async () => {
  await typeLine("Puzzle unlocked!");
}, { hidden: true });

// Math example
addCommand("add", async (args) => {
  const a = Number(args[0]);
  const b = Number(args[1]);

  if (isNaN(a) || isNaN(b)) {
    await typeLine("Error: add requires two numbers.");
    return;
  }

  await typeLine(String(a + b));
});

// Fake scan
addCommand("scan", async () => {
  await typeLine("Running system scan...");
  await typeLine("Checking memory...");
  await typeLine("Checking drives...");
  await typeLine("Checking I/O ports...");
  await typeLine("Scan complete. No issues found.");
});
