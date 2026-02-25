
    /* ============================================================
       GET ALL REQUIRED HTML ELEMENTS
       ------------------------------------------------------------
       These MUST exist in your HTML:

       <div id="searchWrapper">
           <div id="tagContainer"></div>
           <input id="blogSearch">
           <div id="tagDropdown"></div>
       </div>

       And each blog post MUST look like:

       <li class="blog-post" id="post-id" data-tags="tag1, tag2">
           ...
       </li>
    ============================================================ */

    const searchInput = document.getElementById("blogSearch");
    const tagContainer = document.getElementById("tagContainer");
    const dropdown = document.getElementById("tagDropdown");
    const posts = document.querySelectorAll(".blog-post");

    // Stores all active tag bubbles
    let activeTags = [];

    /* ============================================================
       COLLECT ALL TAGS FROM POSTS
       ------------------------------------------------------------
       Reads every post's data-tags attribute and stores them
       so the dropdown can show all available tags.
    ============================================================ */
    const allTags = new Set();
    posts.forEach(post => {
        const tags = post.dataset.tags?.split(",") || [];
        tags.forEach(t => allTags.add(t.trim()));
    });

    /* ============================================================
       CREATE A TAG BUBBLE INSIDE THE SEARCH BAR
       ------------------------------------------------------------
       - Adds a bubble
       - Removes it when clicked
       - Triggers search update
    ============================================================ */
    function addTagBubble(tag) {
        tag = tag.trim();
        if (!tag || activeTags.includes(tag)) return;

        activeTags.push(tag);

        const bubble = document.createElement("div");
        bubble.className = "tag-bubble";
        bubble.innerHTML = `${tag} <span>x</span>`;

        // Clicking the "x" removes the bubble
        bubble.querySelector("span").onclick = () => {
            bubble.remove();
            activeTags = activeTags.filter(t => t !== tag);
            runSearch();
        };

        tagContainer.appendChild(bubble);
        searchInput.value = ""; // clear input
        runSearch();
    }

    /* ============================================================
       UPDATE DROPDOWN LIST
       ------------------------------------------------------------
       Shows all tags that match what the user typed.
       Clicking a tag adds a bubble.
    ============================================================ */
    function updateDropdown(filter = "") {
        dropdown.innerHTML = "";
        const filtered = [...allTags].filter(tag =>
            tag.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            dropdown.style.display = "none";
            return;
        }

        filtered.forEach(tag => {
            const div = document.createElement("div");
            div.className = "tag-option";
            div.textContent = tag;

            // Clicking a dropdown tag creates a bubble
            div.onclick = () => {
                addTagBubble(tag);
                dropdown.style.display = "none";
            };

            dropdown.appendChild(div);
        });

        dropdown.style.display = "block";
    }

    /* ============================================================
       ANIMATED HIDE (FADE + COLLAPSE)
       ------------------------------------------------------------
       - Adds .hiding → fades + shrinks
       - Then adds .hidden → removes from layout
    ============================================================ */
    function hidePost(post) {
        if (post.classList.contains("hidden") || post.classList.contains("hiding")) return;

        post.classList.add("hiding");
        setTimeout(() => {
            post.classList.add("hidden");
            post.classList.remove("hiding");
        }, 350); // must match CSS transition time
    }

    /* ============================================================
       ANIMATED SHOW (EXPAND + FADE IN)
       ------------------------------------------------------------
       - Removes .hidden → makes visible
       - Adds .hiding briefly → triggers animation
       - Removes .hiding → fades in
    ============================================================ */
    function showPost(post) {
        if (!post.classList.contains("hidden")) return;

        post.classList.remove("hidden");

        // Force reflow so animation triggers
        void post.offsetWidth;

        post.classList.add("hiding");
        requestAnimationFrame(() => {
            post.classList.remove("hiding");
        });
    }

    /* ============================================================
       MAIN SEARCH FUNCTION
       ------------------------------------------------------------
       A post is shown if:
       - its ID matches the text search
       - OR its tags match the text search
       - OR it contains any active tag bubble
       - OR nothing is being searched (show all)
    ============================================================ */
    function runSearch() {
        const textSearch = searchInput.value.toLowerCase();

        posts.forEach(post => {
            const id = (post.id || "").toLowerCase();
            const tags = (post.dataset.tags || "").toLowerCase();

            const matchesText = textSearch && (id.includes(textSearch) || tags.includes(textSearch));
            const matchesTags = activeTags.some(t => tags.includes(t));

            const show =
                matchesText ||
                matchesTags ||
                (!textSearch && activeTags.length === 0);

            if (show) {
                showPost(post);
            } else {
                hidePost(post);
            }
        });
    }

    /* ============================================================
       INPUT EVENTS
       ------------------------------------------------------------
       - Typing updates dropdown + search
       - Enter key creates a tag bubble
       - Focusing input opens dropdown
       - Clicking outside closes dropdown
    ============================================================ */

    searchInput.addEventListener("input", () => {
        updateDropdown(searchInput.value);
        runSearch();
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && searchInput.value.trim() !== "") {
            addTagBubble(searchInput.value.trim());
            dropdown.style.display = "none";
        }
    });

    searchInput.addEventListener("focus", () => {
        updateDropdown(searchInput.value);
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target)) dropdown.style.display = "none";
    });
