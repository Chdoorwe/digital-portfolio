/**
 * apps.js
 * 
 * This module defines the mock applications that appear on the OS desktop.
 * Making this separate keeps everything very DRY (Don't Repeat Yourself) 
 * and extremely modular.
 * 
 * HOW TO ADD A NEW APP:
 * 1. Add a new object to the `appDefinitions` array below.
 * 2. Required properties: `id`, `name`, `icon`.
 * 3. Add `requiresPassword: true` and `password: "your_password"` to restrict access.
 * 4. Implement `renderContent` to generate the HTML for your tool dynamically!
 */

// To use DesktopIcon inside an app, we can just import it!
import { DesktopIcon } from './DesktopIcon.js';

/**
 * A highly reusable helper function to generate a folder's inner file explorer!
 * You can plop this inside ANY app's renderContent to make it act like a folder.
 */
function renderFolderExplorer(container, address, fileDefs) {
  // 1. Draw the folder structure
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; height: 100%; background: #ffffff;">
      <div style="padding: 2px 4px; border-bottom: 1px solid #808080; background: #c0c0c0; display:flex; gap: 10px;">
        <span>File</span><span>Edit</span><span>View</span><span>Help</span>
      </div>
      <div style="padding: 2px; border-bottom: 2px groove #fff; background: #c0c0c0; display:flex; font-size: 10px;">
        <span>Address: ${address}</span>
      </div>
      <!-- Inner area for icons -->
      <div class="files-view" style="flex-grow: 1; padding: 10px; display: flex; gap: 15px; align-content: flex-start; flex-wrap: wrap;"></div>
    </div>
  `;

  const filesView = container.querySelector('.files-view');

  // 2. Loop through all files and turn them into double-clickable desktop icons
  fileDefs.forEach(fileDef => {
    const iconObj = new DesktopIcon({
      name: fileDef.name,
      icon: fileDef.icon,
      onDoubleClick: () => {
        // Spawn the file as a brand new draggable window!
        window.winManager.openApp(fileDef);
      }
    });

    // Make text black so it shows up on white background
    iconObj.element.style.color = "black";
    filesView.appendChild(iconObj.element);
  });

  // 3. Allow deselecting icons when clicking empty space
  filesView.addEventListener('click', (e) => {
    if (e.target === filesView) {
      filesView.querySelectorAll('.desktop-icon').forEach(el => el.classList.remove('selected'));
    }
  });
}

export const appDefinitions = [
  // ---------------------------------------------------------
  // HELPER FUNCTION: Create a Folder (File Explorer) View
  // You can use this to nest folders infinitely deep!
  // ---------------------------------------------------------
  // 2. Secret Locked Information App (Using the Password functionality)
  {
    id: 'top-secret',
    name: 'Files',
    icon: '🗂️',
    width: 380,
    height: 280,
    requiresPassword: false,
    renderContent: (container) => {

      // Step 1: Define what files are INSIDE this folder!
      const innerFiles = [
        {
          id: 'password',
          name: 'My password',
          icon: '📄',
          width: 450,
          height: 350,
          linkedHtmlFile: 'resorsis/lore/puzzle/password.html',
          documentStyle: 'wordpad'
        },
        {
          id: 'console',
          name: 'The Console',
          icon: '🔳',
          width: 450,
          height: 350,
          linkedHtmlFile: 'resorsis/the_console/the_console.html',
          documentStyle: 'wordpad'
        },

        // ✨ HERE IS A NESTED FOLDER ✨
        {
          id: 'nested-folder',
          name: 'Documents',
          icon: '📁',
          width: 350,
          height: 250,
          // You can lock this nested folder with a password too!
          requiresPassword: false,
          renderContent: (deepContainer) => {
            // Inside the nested folder, we define MORE files!
            const veryDeepFiles = [
              {
                id: 'Hope',
                name: 'Hope',
                icon: '📁',
                width: 350,
                height: 250,
                // You can lock this nested folder with a password too!
                requiresPassword: true,
                password: 'TheEnd',
                renderContent: (deepContainer) => {
                  // Inside the nested folder, we define MORE files!
                  const veryDeepFiles = [
                    {
                      id: 'lr-rc',
                      name: 'lr-rc',
                      icon: '📄',
                      width: 450,
                      height: 350,
                      requiresPassword: false,
                      linkedHtmlFile: 'resorsis/lore/tlach/lr-rcDoc2.html',
                      documentStyle: 'wordpad'
                    },
                    {
                      id: 'T-H',
                      name: 'T-H',
                      icon: '📄',
                      width: 450,
                      height: 350,
                      requiresPassword: false,
                      linkedHtmlFile: 'resorsis/lore/aregon/the_huntsman.html',
                      documentStyle: 'wordpad'
                    }
                  ];
                  // Render the inner folder using our reusable helper function
                  renderFolderExplorer(deepContainer, 'C:\\Classified\\Deep Secrets\\', veryDeepFiles);
                }
              }
            ];
            // Render the inner folder using our reusable helper function
            renderFolderExplorer(deepContainer, 'C:\\Classified\\Deep Secrets\\', veryDeepFiles);
          }
        },
      ];

      // Step 2: Render the folder
      renderFolderExplorer(container, 'C:\\Classified\\', innerFiles);
    }
  },

  // 3. Calculator App (Demonstrating logic tied to the DOM structure)
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    width: 200,
    height: 190,
    requiresPassword: false,
    renderContent: (container) => {
      // Render simple table-based aesthetic. No rigid JS logic injected here yet.
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:5px; padding: 5px; background: #c0c0c0; height: 100%; box-sizing: border-box;">
          <input type="text" id="calc-display" class="os-input" disabled style="background:#fff; color:#000; text-align:right; font-size:14px; font-family:'Courier New', monospace; padding: 5px; margin-bottom: 5px; border: 2px inset #fff; font-weight:bold;" value="0" />
          
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 3px; flex-grow: 1;">
            <button class="os-btn calc-btn">7</button><button class="os-btn calc-btn">8</button><button class="os-btn calc-btn">9</button><button class="os-btn calc-btn" style="color:red">/</button>
            <button class="os-btn calc-btn">4</button><button class="os-btn calc-btn">5</button><button class="os-btn calc-btn">6</button><button class="os-btn calc-btn" style="color:red">*</button>
            <button class="os-btn calc-btn">1</button><button class="os-btn calc-btn">2</button><button class="os-btn calc-btn">3</button><button class="os-btn calc-btn" style="color:red">-</button>
            <button class="os-btn calc-btn" style="color:blue">C</button><button class="os-btn calc-btn">0</button><button class="os-btn calc-btn" style="color:red">=</button><button class="os-btn calc-btn" style="color:red">+</button>
          </div>
        </div>
      `;

      // JS event bindings attached to generated elements strictly 
      const display = container.querySelector('#calc-display');
      const buttons = container.querySelectorAll('.calc-btn');
      let equation = '';

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.textContent;
          if (val === 'C') {
            equation = '';
            display.value = '0';
          } else if (val === '=') {
            try {
              // Note: Using new Function is safer than raw eval in module contexts 
              const result = new Function('return ' + equation)();
              display.value = result;
              equation = result.toString();
            } catch (e) {
              display.value = 'Error';
              equation = '';
            }
          } else {
            equation += val;
            display.value = equation;
          }
        });
      });
    }
  }
];
