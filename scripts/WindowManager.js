/**
 * WindowManager.js
 * 
 * A completely modular class that manages OS window instances, dragging, and taskbar buttons.
 * It is decoupled from specific apps, so you can easily plug in new app concepts!
 */

export class WindowManager {
  constructor(desktopId, taskbarAppsId) {
    // Links to HTML containers
    this.desktop = document.getElementById(desktopId);
    this.taskbarApps = document.getElementById(taskbarAppsId);
    
    // Store open windows: id => { winEl, taskBtn }
    this.windows = new Map(); 
    this.activeWindowId = null;
    this.zIndexCounter = 100;
  }

  /**
   * Main entry point to launch an application
   * @param {Object} appDef - The modular application definition (from apps.js)
   */
  openApp(appDef) {
    // 1. If window is already open, just bring it to front
    if (this.windows.has(appDef.id)) {
      this.focusWindow(appDef.id);
      return;
    }

    // 2. Handle authentication if the app requires a password
    if (appDef.requiresPassword) {
      this.promptPassword(appDef);
      return;
    }

    // 3. Otherwise, directly create the window
    this.createWindow(appDef);
  }

  /**
   * Prompts the user with a small security window for password locked files
   */
  promptPassword(appDef) {
    const promptId = 'password-prompt-' + appDef.id;
    
    // If prompt already open, focus it
    if (this.windows.has(promptId)) {
      this.focusWindow(promptId);
      return;
    }

    // Creating a special one-off prompt window definition
    this.createWindow({
      id: promptId,
      name: 'Security Alert - ' + appDef.name,
      width: 280,
      height: 130,
      icon: '🔐',
      renderContent: (container, closeThisWindow) => {
        container.innerHTML = `
          <div style="padding: 10px; display:flex; flex-direction:column; gap:10px;">
            <div style="font-size: 11px;">
              Please enter the password to access <b>${appDef.name}</b>:
            </div>
            <input type="password" id="pass-${promptId}" class="os-input" />
            <div style="display:flex; justify-content: flex-end; gap: 5px;">
              <button id="btn-ok-${promptId}" class="os-btn">OK</button>
              <button id="btn-cancel-${promptId}" class="os-btn">Cancel</button>
            </div>
          </div>
        `;

        const input = container.querySelector('#pass-' + promptId);
        const btnOk = container.querySelector('#btn-ok-' + promptId);
        const btnCancel = container.querySelector('#btn-cancel-' + promptId);

        // Autofocus the input automatically
        setTimeout(() => input.focus(), 50);

        // Function invoked when user tries to submit password
        const submit = () => {
          if (input.value === appDef.password) {
            closeThisWindow();
            // Bypass password on the next execution by cloning state
            const clonedDef = { ...appDef, requiresPassword: false };
            this.createWindow(clonedDef);
          } else {
            alert("Incorrect password!"); // Basic error handling
            input.value = '';
            input.focus();
          }
        };

        btnOk.addEventListener('click', submit);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
        btnCancel.addEventListener('click', closeThisWindow);
      }
    });
  }

  /**
   * Builds the actual DOM representation of a draggable application window.
   */
  createWindow(appDef) {
    const id = appDef.id;
    this.zIndexCounter++;

    // 1. Create Window Wrapper DOM
    const winEl = document.createElement('div');
    winEl.className = 'window active';
    winEl.style.width = (appDef.width || 300) + 'px';
    winEl.style.height = (appDef.height || 200) + 'px';
    winEl.style.zIndex = this.zIndexCounter;
    
    // Slight offset for multiple window instances so they don't cover each other entirely
    const offset = (this.windows.size * 25) % 150;
    winEl.style.top = (50 + offset) + 'px';
    winEl.style.left = (50 + offset) + 'px';

    // Top Title Bar Template + Window Structure
    winEl.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">
          <span style="font-size:12px">${appDef.icon || '🗔'}</span> <span style="margin-top:1px;">${appDef.name}</span>
        </div>
        <div class="title-bar-controls">
          <button class="minimize-btn">_</button>
          <button class="maximize-btn">□</button>
          <button class="close-btn">X</button>
        </div>
      </div>
      <div class="window-content"></div>
    `;

    const contentEl = winEl.querySelector('.window-content');
    const titleBar = winEl.querySelector('.title-bar');
    const closeBtn = winEl.querySelector('.close-btn');

    // 2. Enable Window Dragging
    this.makeDraggable(winEl, titleBar);

    // 3. Make App Focus on Click
    winEl.addEventListener('mousedown', () => this.focusWindow(id));

    // 4. Connect logic to physically close the window
    const closeThisWindow = () => this.closeWindow(id);
    closeBtn.addEventListener('click', closeThisWindow);

    this.desktop.appendChild(winEl);

    // 5. Delegate the inner HTML rendering to the module itself!
    // This makes components highly decoupled.
    if (appDef.renderContent) {
      appDef.renderContent(contentEl, closeThisWindow);
    } else if (appDef.linkedHtmlFile) {
      // If the user wants to link an HTML file, the engine automatically 
      // configures a seamless sandbox to render it while preserving its CSS!
      contentEl.innerHTML = `<iframe src="${appDef.linkedHtmlFile}" style="flex-grow:1; border:none; width:100%; height:100%; background: #ffffff;"></iframe>`;
    }

    // 6. Create Taskbar Button Entry
    const taskBtn = document.createElement('div');
    taskBtn.className = 'task-btn active';
    taskBtn.innerHTML = `<span>${appDef.icon || '🗔'}</span> <span>${appDef.name}</span>`;
    taskBtn.addEventListener('click', () => {
      this.focusWindow(id); // Taskbar clicks bring window to front
    });

    this.taskbarApps.appendChild(taskBtn);

    // 7. Save application context reference
    this.windows.set(id, { winEl, taskBtn });
    this.focusWindow(id); // Focus as soon as it's built
  }

  /** Bring window to highest z-index when focused */
  focusWindow(id) {
    if (!this.windows.has(id)) return;

    this.activeWindowId = id;
    this.zIndexCounter++;
    
    this.windows.forEach((winObj, winId) => {
      if (winId === id) {
        winObj.winEl.style.zIndex = this.zIndexCounter;
        winObj.winEl.classList.add('active');
        winObj.taskBtn.classList.add('active');
      } else {
        winObj.winEl.classList.remove('active');
        winObj.taskBtn.classList.remove('active');
      }
    });
  }

  /** Delete DOM components logically on close */
  closeWindow(id) {
    const winObj = this.windows.get(id);
    if (winObj) {
      winObj.winEl.remove();
      winObj.taskBtn.remove();
      this.windows.delete(id);
      
      // Focus another window if there are any left
      if (this.windows.size > 0 && this.activeWindowId === id) {
        const lastId = Array.from(this.windows.keys()).pop();
        this.focusWindow(lastId);
      } else if (this.windows.size === 0) {
        this.activeWindowId = null;
      }
    }
  }

  /** Utility drag-and-drop code logic bound to Titlebar */
  makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      // Record initial cursor start positions
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      // Calculate diff offsets
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Re-apply to window container
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // Reset variables on release click
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
