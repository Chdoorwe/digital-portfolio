// Example secret setup
const secretEnigma = makeEnigma({
  rotorNames: ["I", "II", "III"],
  ringSettings: [0, 0, 0],
  positions: [0, 0, 0],
  reflectorName: "B",
  plugPairs: ["AB", "CD"]
});

secretEnigma.setPositions("AAA");
const secretPlain = "THE EAGLE HAS LANDED";
const secretCipher = secretEnigma.encode(secretPlain);

// Show this ciphertext to the user
document.getElementById("cipherChallenge").textContent = secretCipher;
