export function script(mode: 'light' | 'dark' | 'system') {
  if (typeof document === 'undefined') return;

  const documentElement = document.documentElement;
  if (!documentElement) return;

  let resolvedMode = mode;

  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolvedMode = prefersDark ? 'dark' : 'light';
  }

  documentElement.classList.remove('light', 'dark');
  documentElement.classList.add(resolvedMode);
  documentElement.style.colorScheme = resolvedMode;
}
