// Nav buttons: night mode and 12h/24h format.

import { getIs12hour, setIs12hour } from '../state/store';
import { btn12h, nightModeBtn } from '../dom/elements';
import { getTime } from '../features/clock/clock';

const STORAGE_KEY_12H = 'is12hour';

// Restore 12h/24h from localStorage (defaults to 12h)
export function load12hour(): void {
    const stored = localStorage.getItem(STORAGE_KEY_12H);

    if (stored !== null) {
        try {
            const parsed: unknown = JSON.parse(stored);
            if (typeof parsed === 'boolean') {
                setIs12hour(parsed);
            }
        } catch {
            console.log('Invalid saved hour format');
        }
    }

    updateBtn12hLabel();
}

export function initThemeToggles(): void {
    // 12h / 24h
    if (btn12h) {
        btn12h.addEventListener('click', () => {
            const is12hour = !getIs12hour();
            setIs12hour(is12hour);
            localStorage.setItem(STORAGE_KEY_12H, JSON.stringify(is12hour));
            updateBtn12hLabel();
            getTime(); // redraw immediately instead of waiting up to 1 s
        });
    }

    // Night mode
    if (nightModeBtn) {
        nightModeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
        });
    }
}

function updateBtn12hLabel(): void {
    if (btn12h) btn12h.textContent = getIs12hour() ? '12h' : '24h';
}