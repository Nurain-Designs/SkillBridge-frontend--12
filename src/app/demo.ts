/// <reference types="vite/client" />
/**
 * Demo mode (VITE_DEMO_MODE=true, used by build:pages) is for the public static demo.
 * No SkillBridge API is called and no file leaves the browser: analysis shows the
 * bundled sample results, and the UI labels them as sample data.
 */
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
/** Router basename for GitHub Pages (e.g. "/SkillBridge-frontend--12/"); "/" elsewhere. */
export const BASE = import.meta.env.VITE_PAGES_BASE ?? '/';
