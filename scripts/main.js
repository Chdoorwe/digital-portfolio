import { WindowManager } from './WindowManager.js';
import { DesktopIcon } from './DesktopIcon.js';
import { appDefinitions } from './apps.js';

/**
 * main.js
 * The main modular entry point for the retro OS.
 * 
 * This file handles global setup: 
 * 1. Initializing the Window Manager
 * 2. Rendering Desktop Icons
 * 3. Handling the global taskbar clock
 */

// 1. Initialize Window Manager
// We provide the IDs of our HTML layout blocks so it knows where to draw things.
const winManager = new WindowManager('desktop', 'taskbar-apps');

// Expose the WindowManager globally so inner apps can spawn their own windows!
window.winManager = winManager;

// 2. Set up clock interval
function updateClock() {
  const clockEl = document.getElementById('clock');
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// 3. Render Desktop Icons
const desktopEl = document.getElementById('desktop');

// This loops over our array of applications (defined in apps.js)
// and handles rendering an icon for each one.
appDefinitions.forEach(appDef => {
  const icon = new DesktopIcon({
    name: appDef.name,
    icon: appDef.icon,
    // Callback function: What happens when the icon is double clicked?
    onDoubleClick: () => {
      winManager.openApp(appDef);
    }
  });

  // Attach icon to the desktop DOM
  desktopEl.appendChild(icon.element);
});

// Finally, deselect icons when clicking empty space on the desktop
desktopEl.addEventListener('click', (e) => {
  if (e.target === desktopEl) {
    document.querySelectorAll('.desktop-icon').forEach(el => el.classList.remove('selected'));
  }
});

// --- HARDWARE BOOT / LOGIN LOGIC ---
const powerBtn = document.getElementById('power-btn');
const powerLed = document.getElementById('power-led');
const offScreen = document.getElementById('off-screen');
const loginScreen = document.getElementById('login-screen');
const osPassword = document.getElementById('os-password');
const osLoginBtn = document.getElementById('os-login-btn');

let isPoweredOn = false;

powerBtn.addEventListener('click', () => {
  if (!isPoweredOn) {
    // Turn ON
    isPoweredOn = true;
    powerLed.classList.remove('off');
    powerLed.classList.add('on');
    
    // Remove black screen, show OS login prompt
    offScreen.style.display = 'none';
    loginScreen.style.display = 'flex';
    osPassword.focus();
  } else {
    // Turn OFF (Hard shutdown simulation)
    isPoweredOn = false;
    powerLed.classList.remove('on');
    powerLed.classList.add('off');
    
    // Bring back black screen
    offScreen.style.display = 'block';
    loginScreen.style.display = 'none';
    osPassword.value = ''; // clear boot password
  }
});

const handleOsLogin = () => {
  // Master boot password check
  if (osPassword.value === 'SCRIBE 4-DELTA') {
    // Boot into OS!
    loginScreen.style.display = 'none';
  } else {
    alert("Incorrect boot password!");
    osPassword.value = '';
    osPassword.focus();
  }
};

osLoginBtn.addEventListener('click', handleOsLogin);
osPassword.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleOsLogin();
});

