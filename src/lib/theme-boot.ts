// Kept apart from theme.ts so the server layout can import it without pulling in client hooks.
export const THEME_STORAGE_KEY = 'stockify_theme';

// Dark is the default; only a saved choice of light changes it.
// Runs in <head> before the first paint, so a saved light theme never flashes dark.
export const THEME_BOOT_SCRIPT = `try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='light')document.documentElement.classList.remove('dark')}catch(e){}`;
