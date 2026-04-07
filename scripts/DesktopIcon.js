/**
 * DesktopIcon.js
 * 
 * A UI module specifically for rendering desktop icons.
 * This is very easy to reuse and expand!
 * 
 * Usage Example:
 * const icon = new DesktopIcon({ name: 'Trash', icon: '🗑️', onDoubleClick: () => { ... } });
 * document.body.appendChild(icon.element);
 */
export class DesktopIcon {
  constructor(options) {
    this.element = document.createElement('div');
    this.element.className = 'desktop-icon';
    
    // Create the inner visual layout
    this.element.innerHTML = `
      <div style="font-size: 36px; line-height: 1.1; margin-bottom: 2px;">${options.icon}</div>
      <span>${options.name}</span>
    `;

    // Click handler for selection
    this.element.addEventListener('click', (e) => {
      // Unselect all other icons on screen
      document.querySelectorAll('.desktop-icon').forEach(el => el.classList.remove('selected'));
      // Select this specific one
      this.element.classList.add('selected');
      // Stop event from bubbling to parent (which clears selection)
      e.stopPropagation();
    });

    // Double click handler to open the app
    this.element.addEventListener('dblclick', () => {
      this.element.classList.remove('selected');
      if (options.onDoubleClick) {
        options.onDoubleClick();
      }
    });

    // Make icon focusable by keyboard tab
    this.element.tabIndex = 0; 
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && options.onDoubleClick) {
        options.onDoubleClick();
      }
    });
  }
}
