/**
 * Show a toast notification.
 * @param {string} message - The message to display.
 * @param {'success'|'error'|'info'|'warning'} [type='info'] - The type/status of the message.
 * @param {number} [duration=3500] - Duration in ms before auto-hide.
 */
export function showToast(message, type = 'info', duration = 3500) {
  // Remove existing toast if present
  const existing = document.getElementById('hrc-toast');
  if (existing) existing.remove();

  // Theme detection
  const isDark = document.documentElement.classList.contains('dark');

  // Color classes
  const colorMap = {
    success: isDark ? 'bg-green-700 text-white' : 'bg-green-100 text-green-900',
    error: isDark ? 'bg-red-700 text-white' : 'bg-red-100 text-red-900',
    info: isDark ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900',
    warning: isDark ? 'bg-yellow-700 text-white' : 'bg-yellow-100 text-yellow-900',
  };

  // Icon
  const iconMap = {
    success: '✔️',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  // Toast element
  const toast = document.createElement('div');
  toast.id = 'hrc-toast';
  toast.className = `
    fixed top-6 left-1/2 z-50 px-6 py-3 rounded shadow-lg flex items-center gap-3
    transform -translate-x-1/2 opacity-0 pointer-events-none transition-all duration-300
    ${colorMap[type] || colorMap.info}
  `.replace(/\s+/g, ' ');

  toast.innerHTML = `
    <span class="text-xl">${iconMap[type] || iconMap.info}</span>
    <span class="font-medium">${message}</span>
  `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    toast.style.pointerEvents = 'auto';
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}