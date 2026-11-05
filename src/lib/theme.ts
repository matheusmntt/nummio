export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "nummio-theme";
export const DEFAULT_THEME: Theme = "dark";

/**
 * Runs synchronously in <head>, before first paint: applies a stored theme
 * without a flash of the default, and flags `nm-motion` when the visitor
 * accepts motion so the opening sequence can start from its first frame.
 */
export const themeInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("nm-motion")})()`;
