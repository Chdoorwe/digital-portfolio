# Retro OS Web Environment

This is a modular, "pseudo-computer" frontend application designed to mimic operating systems from the late 90s to early 2000s (e.g., Windows 95/98). 

## Structure & Modularity

The codebase is highly modular, separating out aesthetics, global logic, window management capabilities, and application definitions to make expanding very simple.

### Directory Layout
- **`index.html`** - The main HTML setup describing the Desktop and Taskbar.
- **`styles/os.css`** - Re-usable CSS styles and color tokens mimicking the classic Windows visual language.
- **`styles/window.css`** - CSS describing the popup draggable containers.
- **`scripts/main.js`** - Boots up the OS and sets the clock. 
- **`scripts/WindowManager.js`** - Handles spawning, closing, dragging and layering different windows dynamically. Completely decoupled from specific app logic.
- **`scripts/DesktopIcon.js`** - Component for creating selectable icons on the desktop.
- **`scripts/apps.js`** - The exact place where you define what your apps are! Check here to see varied examples.

## Features

- **Draggable Windows:** Grab the titlebar of an app and drag it across the screen. Look inside `WindowManager.js`.
- **Taskbar Tracking:** When an app opens, it registers down below.
- **Password Protection:** The OS can pause an app from opening until a password requirement is met. For example, the `Secret Files` app requires the password: `password123`.

## How to add a new app

All applications are defined inside `scripts/apps.js`. To add a new one, simply add an object to the `appDefinitions` list:

```javascript
{
  id: 'my-custom-app',
  name: 'My Custom App',
  icon: '⭐',
  width: 400,
  height: 300,
  requiresPassword: true, // Set to true to trigger password 
  password: 'my-password', 
  renderContent: (containerElement, closeWindowMethod) => {
     // Put all your app's HTML inside here
     containerElement.innerHTML = `<h1>Hello World!</h1><button class="os-btn">Click</button>`;
  }
}
```

## Running the Application

Because this project utilizes standard browser ES modules (`import`/`export`), modern browsers restrict running this directly from the `file:///` path due to CORS policies.

**To run this project correctly:**
1. Open the project folder in **Visual Studio Code**.
2. Install the **"Live Server"** extension.
3. Open `index.html`, right-click in the document, and select **"Open with Live Server"**.
This will host a small local web server, and the modules will link correctly!
