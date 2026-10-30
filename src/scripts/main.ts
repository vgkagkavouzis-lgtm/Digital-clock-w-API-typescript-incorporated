// Entry point: wires the app together. No logic of its own lives here.

import { loadZones } from './api/zones-api';
import { footerDate } from './dom/elements';
import { getTime } from './features/clock/clock';
import { initConverter } from './features/converter/converter';
import {
    initSavedLocations,
    loadLocations,
    renderSavedLocations,
} from './features/saved-locations/saved-locations';
import { initAutocomplete } from './features/search/autocomplete';
import { initSearch } from './features/search/search';
import { initThemeToggles, load12hour } from './ui/theme-toggle';

// 1. Restore what the user saved last time (must run before the first render)
loadLocations();
load12hour();

// 2. First render + start the 1-second clock loop
renderSavedLocations();
getTime();

// 3. Attach event listeners
initSearch();
initAutocomplete();
initSavedLocations();
initConverter();
initThemeToggles();

// 4. Footer year
if (footerDate) {
    footerDate.textContent = `${new Date().getFullYear()}`;
}

// 5. Fetch the time zone list once on page load
loadZones();