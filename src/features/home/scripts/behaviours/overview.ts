// Start each visit at the overview instead of restoring a previous scroll position.
export function initialiseOverview() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const showOverview = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  showOverview();
  window.addEventListener('pageshow', showOverview);
}
