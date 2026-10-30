// Every element the app reads from index.html, looked up once.
// querySelector<T> tells TypeScript which element type to expect.
// Each value can still be null, so callers must check before using it.

// ---- Search ----
export const formInput = document.querySelector<HTMLFormElement>('#main-input-form');
export const searchInput = document.querySelector<HTMLInputElement>('#searchBar');
export const suggestionsBox = document.querySelector<HTMLDivElement>('.suggestions-box');
export const selectZones = document.querySelector<HTMLSelectElement>('#timeZoneSelect');

// ---- Assistant message ----
export const output = document.querySelector<HTMLParagraphElement>('.assistant-display p');

// ---- Main display ----
export const country = document.querySelector<HTMLSpanElement>('#country');
export const city = document.querySelector<HTMLSpanElement>('#city');
export const timeZone = document.querySelector<HTMLParagraphElement>('#time-zone');
export const time = document.querySelector<HTMLParagraphElement>('#time');
export const period = document.querySelector<HTMLParagraphElement>('#period');
export const offset = document.querySelector<HTMLParagraphElement>('#offset');
export const mainDisplayVisual23hDiv = document.querySelector<HTMLDivElement>(
    '#main-display-visual-23h-boxes-container',
);

// ---- Local time (header) ----
export const localZoneDisplay = document.querySelector<HTMLSpanElement>('#localZoneDisplay');
export const localTime = document.querySelector<HTMLSpanElement>('#localTime');
export const localPeriod = document.querySelector<HTMLSpanElement>('#localPeriod');
export const localOffset = document.querySelector<HTMLSpanElement>('#localOffset');

// ---- Saved locations ----
export const addLocationBtn = document.querySelector<HTMLButtonElement>('#add-location-btn');
export const savedLocationsUl = document.querySelector<HTMLUListElement>('.saved-zones-container');

// ---- Nav toggles ----
export const btn12h = document.querySelector<HTMLButtonElement>('#toggle12hour button');
export const nightModeBtn = document.querySelector<HTMLButtonElement>('#day-night-toggle');

// ---- Time converter ----
export const convertForm = document.querySelector<HTMLFormElement>('#time-converter form');
export const convertFromTimezone = document.querySelector<HTMLSelectElement>('#convertFromTimezone');
export const convertToTimezone = document.querySelector<HTMLSelectElement>('#convertToTimezone');
export const convertFromDate = document.querySelector<HTMLInputElement>('#convertFromDate');
export const convertFromTime = document.querySelector<HTMLInputElement>('#convertFromTime');
export const convertedDate = document.querySelector<HTMLSpanElement>('.converted-date');
export const convertedTime = document.querySelector<HTMLSpanElement>('.converted-time');
export const convertedTimezone = document.querySelector<HTMLSpanElement>('.converted-timezone');

// ---- Footer ----
export const footerDate = document.querySelector<HTMLSpanElement>('#footerDate');