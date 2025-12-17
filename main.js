// === Enigma core logic ===
const A = "A".charCodeAt(0);
const toIndex = (c) => c.charCodeAt(0) - A;
const toChar = (i) => String.fromCharCode(((i % 26) + 26) % 26 + A);

function makePlugboard(pairs = []) {
  const map = Array.from({ length: 26 }, (_, i) => i);
  for (const pair of pairs) {
    const [p, q] = pair.toUpperCase().split("");
    const pi = toIndex(p), qi = toIndex(q);
    [map[pi], map[qi]] = [map[qi], map[pi]];
  }
  return { encode(i) { return map[i]; } };
}

function makeRotor(wiringStr, notchLetters, ringSetting = 0, position = 0) {
  const wiring = [...wiringStr].map(toIndex);
  const inverse = Array(26).fill(0);
  for (let i = 0; i < 26; i++) inverse[wiring[i]] = i;
  const notches = new Set([...notchLetters].map(toIndex));
  return {
    position, ringSetting,
    atNotch() { return notches.has(this.position); },
    step() { this.position = (this.position + 1) % 26; },
    forward(i) {
      const shift = (i + this.position - this.ringSetting + 26) % 26;
      const wired = wiring[shift];
      return (wired - this.position + this.ringSetting + 26) % 26;
    },
    reverse(i) {
      const shift = (i + this.position - this.ringSetting + 26) % 26;
      const wired = inverse[shift];
      return (wired - this.position + this.ringSetting + 26) % 26;
    }
  };
}

function makeReflector(mapStr) {
  const map = [...mapStr].map(toIndex);
  return { reflect(i) { return map[i]; } };
}

const ROTORS = {
  I:    { wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ", notch: "Q" },
  II:   { wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE", notch: "E" },
  III:  { wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO", notch: "V" }
};
const REFLECTORS = {
  B: "YRUHQSLDPXNGOKMIEBFZCWVJAT"
};

function makeEnigma({ rotorNames, ringSettings, positions, reflectorName, plugPairs }) {
  const rotors = rotorNames.map((name, idx) => {
    const def = ROTORS[name];
    return makeRotor(def.wiring, def.notch, ringSettings[idx], positions[idx]);
  });
  const reflector = makeReflector(REFLECTORS[reflectorName]);
  const plugboard = makePlugboard(plugPairs);

  function stepRotors() {
    const [R, M, L] = rotors;
    const middleAtNotch = M.atNotch();
    const rightAtNotch = R.atNotch();
    R.step();
    if (middleAtNotch || rightAtNotch) M.step();
    if (middleAtNotch) L.step();
  }

  function encodeChar(c) {
    if (!/[A-Z]/i.test(c)) return c;
    stepRotors();
    let i = toIndex(c.toUpperCase());
    i = plugboard.encode(i);
    for (const r of rotors) i = r.forward(i);
    i = reflector.reflect(i);
    for (let k = rotors.length - 1; k >= 0; k--) i = rotors[k].reverse(i);
    i = plugboard.encode(i);
    return toChar(i);
  }

  function encode(text) {
    return [...text].map(encodeChar).join("");
  }

  return { encode, setPositions: (posLetters) => {
    rotors.forEach((r, i) => { r.position = toIndex(posLetters[i]); });
  }};
}

// === Puzzle logic ===
function setupPuzzle() {
  // Random rotor order
  const rotorChoices = ["I","II","III"];
  const rotorNames = rotorChoices.sort(() => Math.random() - 0.5);

  // Random starting positions
  const randomPositions = [
    Math.floor(Math.random() * 26),
    Math.floor(Math.random() * 26),
    Math.floor(Math.random() * 26)
  ];

  // Random plugboard pairs
  function randomPlugPairs() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const pairs = [];
    const used = new Set();
    const numPairs = Math.floor(Math.random() * 5); // up to 5 random pairs
    for (let i = 0; i < numPairs; i++) {
      let a, b;
      do { a = alphabet[Math.floor(Math.random() * 26)]; } while (used.has(a));
      used.add(a);
      do { b = alphabet[Math.floor(Math.random() * 26)]; } while (used.has(b));
      used.add(b);
      pairs.push(a + b);
    }
    return pairs;
  }
  const plugPairs = randomPlugPairs();

  // Build secret machine
  const secretEnigma = makeEnigma({
    rotorNames,
    ringSettings: [0, 0, 0],
    positions: randomPositions,
    reflectorName: "B",
    plugPairs
  });

  // Convert positions to letters for display
  const posLetters = randomPositions.map(p => String.fromCharCode(A + p)).join("");
  secretEnigma.setPositions(posLetters);

  // Random first part of the message
  const phrases = [
    "TOP SECRET MISSION",
    "OPERATION NIGHTFALL",
    "CODE RED ALERT",
    "AGENT REPORT",
    "MISSION BRIEFING",
    "CLASSIFIED ORDER"
  ];
  const randomPart = phrases[Math.floor(Math.random() * phrases.length)];

  // Always append the fixed ending
  const secretPlain = randomPart + " END TRANSMISSION";

  // Encrypt it
  const secretCipher = secretEnigma.encode(secretPlain);

  // Show ciphertext to the user
  document.getElementById("cipherChallenge").textContent = secretCipher;

  // For debugging or hints, log the settings
  console.log("Rotor order:", rotorNames);
  console.log("Positions:", posLetters);
  console.log("Plugboard:", plugPairs);

  // Decode button logic
  document.getElementById("decodeBtn").addEventListener("click", () => {
    const rotorNamesUser = [
      document.getElementById("r1").value,
      document.getElementById("r2").value,
      document.getElementById("r3").value
    ];
    const positionsLetters = [
      document.getElementById("pos1").value,
      document.getElementById("pos2").value,
      document.getElementById("pos3").value
    ].join("").toUpperCase();
    const plugPairsUser = document.getElementById("plug").value
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const enigma = makeEnigma({
      rotorNames: rotorNamesUser,
      ringSettings: [0,0,0],
      positions: positionsLetters.split("").map(c => c.charCodeAt(0) - 65),
      reflectorName: "B",
      plugPairs: plugPairsUser
    });
    enigma.setPositions(positionsLetters);

    const cipher = document.getElementById("cipherChallenge").textContent;
    const decoded = enigma.encode(cipher);

    document.getElementById("decodeOutput").textContent = decoded;
  });
}

window.onload = setupPuzzle;

