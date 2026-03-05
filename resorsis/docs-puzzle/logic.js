document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("doc-list");

    window.DOCUMENTS.forEach((doc, i) => {
        const card = document.createElement("div");
        card.className = "doc-card";

        card.innerHTML = `
            <div class="doc-title">${doc.title}</div>
            <div class="doc-description">${doc.description}</div>
            <a class="doc-link" href="${doc.file}" target="_blank">Open Document</a>
        `;

        if (doc.puzzle && doc.puzzle.type) {
            const puzzle = document.createElement("div");
            puzzle.className = "puzzle";
            const p = doc.puzzle;

            // INPUT
            if (p.type === "input") {
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <input type="text" id="input-${i}">
                    <button onclick="checkInput(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // CHOICE
            if (p.type === "choice") {
                const opts = p.options.map(o =>
                    `<div class="puzzle-list-item"><label><input type="radio" name="choice-${i}" value="${o}"> ${o}</label></div>`
                ).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${opts}
                    <button onclick="checkChoice(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // CODE
            if (p.type === "code") {
                let fields = "";
                for (let f = 0; f < p.fields; f++) {
                    fields += `<input type="text" id="code-${i}-${f}" placeholder="Part ${f + 1}"> `;
                }
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <div class="puzzle-row">${fields}</div>
                    <button onclick="checkCode(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // TRUE/FALSE
            if (p.type === "truefalse") {
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <label><input type="radio" name="tf-${i}" value="true"> True</label><br>
                    <label><input type="radio" name="tf-${i}" value="false"> False</label><br>
                    <button onclick="checkTF(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // ORDER
            if (p.type === "order") {
                const items = p.items.map((item, idx) => `
                    <div class="puzzle-list-item">
                        <input type="number" min="1" max="${p.items.length}" id="order-${i}-${idx}" style="width:40px;">
                        ${item}
                    </div>
                `).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${items}
                    <button onclick="checkOrder(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // REDACTION
            if (p.type === "redaction") {
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <input type="text" id="redaction-${i}">
                    <button onclick="checkRedaction(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // KEYWORD
            if (p.type === "keyword") {
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <input type="text" id="keyword-${i}">
                    <button onclick="checkKeyword(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // CIPHER (simple Caesar 3 check)
            if (p.type === "cipher") {
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <input type="text" id="cipher-${i}">
                    <button onclick="checkCipher(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // COMBINE
            if (p.type === "combine") {
                const opts = p.items.map((o, idx) =>
                    `<option value="${idx}">${o}</option>`
                ).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <div class="puzzle-row">
                        <select id="combine-${i}-0"><option value="">--</option>${opts}</select>
                        <select id="combine-${i}-1"><option value="">--</option>${opts}</select>
                        <select id="combine-${i}-2"><option value="">--</option>${opts}</select>
                    </div>
                    <button onclick="checkCombine(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // ASSEMBLE
            if (p.type === "assemble") {
                const items = p.pieces.map((piece, idx) => `
                    <div class="puzzle-list-item">
                        <input type="number" min="1" max="${p.pieces.length}" id="assemble-${i}-${idx}" style="width:40px;">
                        ${piece}
                    </div>
                `).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${items}
                    <button onclick="checkAssemble(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // MATCH
            if (p.type === "match") {
                const rows = p.pairs.map((pair, idx) => {
                    const opts = pair.options.map(o =>
                        `<option value="${o}">${o}</option>`
                    ).join("");
                    return `
                        <div class="puzzle-list-item">
                            ${pair.item} →
                            <select id="match-${i}-${idx}">
                                <option value="">--</option>
                                ${opts}
                            </select>
                        </div>
                    `;
                }).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${rows}
                    <button onclick="checkMatch(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // ALIGN
            if (p.type === "align") {
                let dials = "";
                for (let d = 0; d < p.dials; d++) {
                    dials += `<input type="number" min="1" max="9" id="align-${i}-${d}" style="width:40px;"> `;
                }
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <div class="puzzle-row">${dials}</div>
                    <button onclick="checkAlign(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // SEQUENCE
            if (p.type === "sequence") {
                const opts = p.options.map(o =>
                    `<button type="button" onclick="addSequenceStep(${i}, '${o}')">${o}</button>`
                ).join(" ");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    <div class="puzzle-row">${opts}</div>
                    <div>Current: <span id="sequence-display-${i}"></span></div>
                    <button onclick="checkSequence(${i})">Submit</button>
                    <button onclick="resetSequence(${i})" type="button">Reset</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
                window["sequenceBuffer" + i] = [];
            }

            // HOTSPOT
            if (p.type === "hotspot") {
                const opts = p.options.map(o =>
                    `<div class="puzzle-list-item"><label><input type="radio" name="hotspot-${i}" value="${o}"> ${o}</label></div>`
                ).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${opts}
                    <button onclick="checkHotspot(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // TIMELINE
            if (p.type === "timeline") {
                const rows = p.events.map((ev, idx) => `
                    <div class="puzzle-list-item">
                        ${ev.label}:
                        <input type="number" id="timeline-${i}-${idx}" style="width:70px;">
                    </div>
                `).join("");
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${rows}
                    <button onclick="checkTimeline(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            // TOGGLE
            if (p.type === "toggle") {
                let switches = "";
                for (let s = 0; s < p.switches; s++) {
                    switches += `
                        <label class="puzzle-list-item">
                            Switch ${s + 1}:
                            <input type="checkbox" id="toggle-${i}-${s}">
                        </label>
                    `;
                }
                puzzle.innerHTML = `
                    <div class="puzzle-label">${p.prompt}</div>
                    ${switches}
                    <button onclick="checkToggle(${i})">Submit</button>
                    <div id="feedback-${i}" class="feedback"></div>
                `;
            }

            card.appendChild(puzzle);
        }

        list.appendChild(card);
    });
});

// BASIC HELPERS
function setFeedback(i, ok) {
    const fb = document.getElementById(`feedback-${i}`);
    fb.textContent = ok ? "Correct." : "Incorrect.";
    fb.className = "feedback " + (ok ? "correct" : "incorrect");
}

// INPUT
function checkInput(i) {
    const val = document.getElementById(`input-${i}`).value.trim();
    const ans = window.DOCUMENTS[i].puzzle.answer;
    setFeedback(i, val.toUpperCase() === ans.toUpperCase());
}

// CHOICE
function checkChoice(i) {
    const ans = window.DOCUMENTS[i].puzzle.answer;
    const selected = document.querySelector(`input[name="choice-${i}"]:checked`);
    if (!selected) {
        const fb = document.getElementById(`feedback-${i}`);
        fb.textContent = "Select an option.";
        fb.className = "feedback incorrect";
        return;
    }
    setFeedback(i, selected.value === ans);
}

// CODE
function checkCode(i) {
    const p = window.DOCUMENTS[i].puzzle;
    for (let f = 0; f < p.fields; f++) {
        const val = document.getElementById(`code-${i}-${f}`).value.trim();
        if (val.toUpperCase() !== p.answer[f].toUpperCase()) {
            setFeedback(i, false);
            return;
        }
    }
    setFeedback(i, true);
}

// TRUE/FALSE
function checkTF(i) {
    const ans = window.DOCUMENTS[i].puzzle.answer;
    const selected = document.querySelector(`input[name="tf-${i}"]:checked`);
    if (!selected) {
        const fb = document.getElementById(`feedback-${i}`);
        fb.textContent = "Select True or False.";
        fb.className = "feedback incorrect";
        return;
    }
    const val = selected.value === "true";
    setFeedback(i, val === ans);
}

// ORDER
function checkOrder(i) {
    const p = window.DOCUMENTS[i].puzzle;
    const order = [];
    for (let idx = 0; idx < p.items.length; idx++) {
        const pos = parseInt(document.getElementById(`order-${i}-${idx}`).value, 10);
        order[pos - 1] = p.items[idx];
    }
    const ok = JSON.stringify(order) === JSON.stringify(p.answer);
    setFeedback(i, ok);
}

// REDACTION
function checkRedaction(i) {
    const val = document.getElementById(`redaction-${i}`).value.trim();
    const ans = window.DOCUMENTS[i].puzzle.answer;
    setFeedback(i, val.toUpperCase() === ans.toUpperCase());
}

// KEYWORD
function checkKeyword(i) {
    const val = document.getElementById(`keyword-${i}`).value.trim();
    const ans = window.DOCUMENTS[i].puzzle.answer;
    setFeedback(i, val.toUpperCase() === ans.toUpperCase());
}

// CIPHER (we just compare decoded answer; you can handle actual cipher in doc)
function checkCipher(i) {
    const val = document.getElementById(`cipher-${i}`).value.trim();
    const ans = window.DOCUMENTS[i].puzzle.answer;
    setFeedback(i, val.toUpperCase() === ans.toUpperCase());
}

// COMBINE
function checkCombine(i) {
    const p = window.DOCUMENTS[i].puzzle;
    const selected = [];
    for (let s = 0; s < 3; s++) {
        const sel = document.getElementById(`combine-${i}-${s}`).value;
        if (sel === "") {
            setFeedback(i, false);
            return;
        }
        selected.push(p.items[parseInt(sel, 10)]);
    }
    const ok = JSON.stringify(selected) === JSON.stringify(p.correct);
    setFeedback(i, ok);
}

// ASSEMBLE
function checkAssemble(i) {
    const p = window.DOCUMENTS[i].puzzle;
    const order = [];
    for (let idx = 0; idx < p.pieces.length; idx++) {
        const pos = parseInt(document.getElementById(`assemble-${i}-${idx}`).value, 10);
        order[pos - 1] = p.pieces[idx];
    }
    const ok = JSON.stringify(order) === JSON.stringify(p.answer);
    setFeedback(i, ok);
}

// MATCH
function checkMatch(i) {
    const p = window.DOCUMENTS[i].puzzle;
    for (let idx = 0; idx < p.pairs.length; idx++) {
        const sel = document.getElementById(`match-${i}-${idx}`).value;
        if (sel !== p.pairs[idx].answer) {
            setFeedback(i, false);
            return;
        }
    }
    setFeedback(i, true);
}

// ALIGN
function checkAlign(i) {
    const p = window.DOCUMENTS[i].puzzle;
    for (let d = 0; d < p.dials; d++) {
        const val = parseInt(document.getElementById(`align-${i}-${d}`).value, 10);
        if (val !== p.answer[d]) {
            setFeedback(i, false);
            return;
        }
    }
    setFeedback(i, true);
}

// SEQUENCE
function addSequenceStep(i, val) {
    const key = "sequenceBuffer" + i;
    if (!window[key]) window[key] = [];
    window[key].push(val);
    document.getElementById(`sequence-display-${i}`).textContent = window[key].join(" - ");
}

function resetSequence(i) {
    const key = "sequenceBuffer" + i;
    window[key] = [];
    document.getElementById(`sequence-display-${i}`).textContent = "";
}

function checkSequence(i) {
    const p = window.DOCUMENTS[i].puzzle;
    const key = "sequenceBuffer" + i;
    const buf = window[key] || [];
    const ok = JSON.stringify(buf) === JSON.stringify(p.answer);
    setFeedback(i, ok);
}

// HOTSPOT
function checkHotspot(i) {
    const p = window.DOCUMENTS[i].puzzle;
    const selected = document.querySelector(`input[name="hotspot-${i}"]:checked`);
    if (!selected) {
        const fb = document.getElementById(`feedback-${i}`);
        fb.textContent = "Select a location.";
        fb.className = "feedback incorrect";
        return;
    }
    setFeedback(i, selected.value === p.answer);
}

// TIMELINE
function checkTimeline(i) {
    const p = window.DOCUMENTS[i].puzzle;
    for (let idx = 0; idx < p.events.length; idx++) {
        const val = parseInt(document.getElementById(`timeline-${i}-${idx}`).value, 10);
        if (val !== p.events[idx].year) {
            setFeedback(i, false);
            return;
        }
    }
    setFeedback(i, true);
}

// TOGGLE
function checkToggle(i) {
    const p = window.DOCUMENTS[i].puzzle;
    for (let s = 0; s < p.switches; s++) {
        const checked = document.getElementById(`toggle-${i}-${s}`).checked;
        if (checked !== p.answer[s]) {
            setFeedback(i, false);
            return;
        }
    }
    setFeedback(i, true);
}
