window.DOCUMENTS = [
    // 1. input
    {
        title: "Field Report 12-A",
        file: "documents/doc1.html",
        description: "Recovered field report with partial redactions.",
        puzzle: {
            type: "input",
            prompt: "Enter the designation referenced in Section II:",
            answer: "SUBJECT-7"
        }
    },

    // 2. choice
    {
        title: "Internal Memo 4C",
        file: "documents/doc2.html",
        description: "Declassified memo from 1954.",
        puzzle: {
            type: "choice",
            prompt: "Which division authored this memo?",
            options: ["Logistics", "Security", "Research", "Administration"],
            answer: "Security"
        }
    },

    // 3. code
    {
        title: "Clearance Code Note",
        file: "documents/doc3.html",
        description: "Note containing a three-part clearance code.",
        puzzle: {
            type: "code",
            prompt: "Enter the clearance code:",
            fields: 3,
            answer: ["ALPHA", "RED", "47"]
        }
    },

    // 4. truefalse
    {
        title: "Observation Log 7B",
        file: "documents/doc4.html",
        description: "Observation log with conflicting statements.",
        puzzle: {
            type: "truefalse",
            prompt: "The log states the subject remained stationary.",
            answer: false
        }
    },

    // 5. order
    {
        title: "Containment Procedure Draft",
        file: "documents/doc5.html",
        description: "Draft of a multi-step containment procedure.",
        puzzle: {
            type: "order",
            prompt: "Arrange the steps in correct order (1–4):",
            items: ["Seal perimeter", "Verify identity", "Log entry", "Report anomaly"],
            answer: ["Verify identity", "Log entry", "Seal perimeter", "Report anomaly"]
        }
    },

    // 6. redaction
    {
        title: "Redacted Directive",
        file: "documents/doc6.html",
        description: "Directive with heavy black redactions.",
        puzzle: {
            type: "redaction",
            prompt: "Guess the redacted operation name:",
            answer: "IRON VEIL"
        }
    },

    // 7. keyword
    {
        title: "Intercept Transcript",
        file: "documents/doc7.html",
        description: "Transcript of an intercepted radio transmission.",
        puzzle: {
            type: "keyword",
            prompt: "Enter the keyword repeated three times in the transcript:",
            answer: "RETURN"
        }
    },

    // 8. cipher
    {
        title: "Cipher Fragment",
        file: "documents/doc8.html",
        description: "Fragment encoded with a Caesar shift of 3.",
        puzzle: {
            type: "cipher",
            prompt: "Decode the message (Caesar shift 3) and enter the word:",
            answer: "RENDEZVOUS"
        }
    },

    // 9. combine
    {
        title: "Evidence Locker Entry",
        file: "documents/doc9.html",
        description: "Evidence items recovered from Site 7.",
        puzzle: {
            type: "combine",
            prompt: "Select the items that reconstruct the device (in order):",
            items: ["Battery Pack", "Trigger Module", "Signal Antenna", "Cigarette Case"],
            correct: ["Battery Pack", "Trigger Module", "Signal Antenna"]
        }
    },

    // 10. assemble
    {
        title: "Fragmented Map",
        file: "documents/doc10.html",
        description: "Map fragments recovered from a field kit.",
        puzzle: {
            type: "assemble",
            prompt: "Assign positions (1–4) to assemble the map correctly:",
            pieces: ["North Sector", "East Sector", "South Sector", "West Sector"],
            answer: ["West Sector", "North Sector", "East Sector", "South Sector"]
        }
    },

    // 11. match
    {
        title: "Forensic Summary",
        file: "documents/doc11.html",
        description: "Summary of forensic evidence.",
        puzzle: {
            type: "match",
            prompt: "Match each item to the correct subject:",
            pairs: [
                { item: "Fingerprint A", options: ["Subject 1", "Subject 2"], answer: "Subject 2" },
                { item: "Shell Casing B", options: ["Weapon Type 1", "Weapon Type 3"], answer: "Weapon Type 3" }
            ]
        }
    },

    // 12. align
    {
        title: "Code Wheel Settings",
        file: "documents/doc12.html",
        description: "Settings for a mechanical cipher wheel.",
        puzzle: {
            type: "align",
            prompt: "Set the three dials to the correct positions:",
            dials: 3,
            answer: [3, 7, 2] // values 1–9
        }
    },

    // 13. sequence (interactive)
    {
        title: "Signal Pattern Log",
        file: "documents/doc13.html",
        description: "Log of repeating signal patterns.",
        puzzle: {
            type: "sequence",
            prompt: "Reproduce the correct sequence of signals:",
            options: ["DOT", "DASH", "PAUSE"],
            answer: ["DOT", "DASH", "DOT", "PAUSE"]
        }
    },

    // 14. hotspot (interactive)
    {
        title: "Photographic Evidence",
        file: "documents/doc14.html",
        description: "Photo description with multiple points of interest.",
        puzzle: {
            type: "hotspot",
            prompt: "Which area contains the hidden transmitter?",
            options: ["Desk drawer", "Ceiling vent", "Wall clock", "Window frame"],
            answer: "Wall clock"
        }
    },

    // 15. timeline (interactive)
    {
        title: "Incident Timeline",
        file: "documents/doc15.html",
        description: "Events recorded over several years.",
        puzzle: {
            type: "timeline",
            prompt: "Assign the correct year to each event:",
            events: [
                { label: "Initial sighting", year: 1947 },
                { label: "Containment breach", year: 1952 }
            ]
        }
    },

    // 16. toggle (interactive)
    {
        title: "Security Panel",
        file: "documents/doc16.html",
        description: "Panel with multiple switches controlling access.",
        puzzle: {
            type: "toggle",
            prompt: "Set the switches to the correct ON/OFF pattern:",
            switches: 4,
            answer: [true, false, true, true]
        }
    }
];
