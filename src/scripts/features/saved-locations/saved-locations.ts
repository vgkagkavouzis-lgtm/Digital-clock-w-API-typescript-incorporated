// The "Saved locations" list: add, remove, persist to localStorage, render.

import type { FilterApi } from '../../types/zones';
import { getFilteredData, getIs12hour, getSelectedZone } from '../../state/store';
import { addLocationBtn, output, savedLocationsUl } from '../../dom/elements';
import { dateFormatter } from '../clock/time-formatter';
import { DivBuilder23hVisual } from '../visual-hours/visual-builder';

// Private to this file: no other module reads the saved array.
// (clock.ts updates the times by reading the <li> elements, not this array.)
let savedLocations: FilterApi[] = [];

const STORAGE_KEY = 'savedLocations';

function saveLocations(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
}

// Runtime check that data from localStorage really has the FilterApi shape.
function isFilterApi(item: unknown): item is FilterApi {
    return (
        typeof item === 'object' &&
        item !== null &&
        'country' in item &&
        typeof item.country === 'string' &&
        'cities' in item &&
        Array.isArray(item.cities) &&
        item.cities.every((c) => typeof c === 'string') &&
        'timeZone' in item &&
        typeof item.timeZone === 'string'
    );
}

export function loadLocations(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return;

    try {
        const parsed: unknown = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.every(isFilterApi)) {
            savedLocations = parsed;
            if (output) output.textContent = 'Search Something.';
        } else {
            throw new Error('Invalid saved locations');
        }
    } catch (er) {
        if (output) {
            output.textContent = er instanceof Error ? er.message : 'Could not load saved locations';
        }
        localStorage.removeItem(STORAGE_KEY);
        savedLocations = [];
    }
}

export function renderSavedLocations(): void {
    const ul = savedLocationsUl; // local const so the null check holds inside forEach
    if (!ul) return;

    ul.replaceChildren();
    const is12hour = getIs12hour();

    savedLocations.forEach((loc) => {
        const formatted = dateFormatter(loc.timeZone, is12hour);

        const li = document.createElement('li');
        const div = document.createElement('div');
        const div23visual = document.createElement('div');
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        const spanCity = document.createElement('span');
        const spanTime = document.createElement('span');
        const spanPeriod = document.createElement('span');
        const spanOffset = document.createElement('span');
        const btnRemove = document.createElement('button');

        li.dataset.timezone = loc.timeZone;
        div.classList.add('div-saved-city-time-removeBtn');
        div23visual.classList.add('visual-23h-boxes-container-saved-zones');
        p1.classList.add('saved-city-offset');
        p2.classList.add('saved-time-period');

        spanCity.classList.add('saved-city');
        spanCity.textContent = `${loc.cities[0]} `;
        spanTime.classList.add('saved-time');
        spanTime.textContent = formatted.timeVl;
        spanPeriod.classList.add('saved-period');
        spanPeriod.textContent = formatted.periodVl;
        spanOffset.classList.add('saved-offset');
        spanOffset.textContent = formatted.offsetVl;

        btnRemove.classList.add('removeBtn', 'btn');
        btnRemove.textContent = 'x';

        div23visual.append(...DivBuilder23hVisual(loc.timeZone, 'Saved Zones'));

        p1.append(spanCity, spanOffset);
        p2.append(spanTime, spanPeriod);
        div.append(p1, p2, div23visual, btnRemove);
        li.append(div);
        ul.append(li);
    });
}

export function initSavedLocations(): void {
    // "+ add location"
    if (addLocationBtn) {
        addLocationBtn.addEventListener('click', () => {
            const selectedZone = getSelectedZone();
            const filteredData = getFilteredData();
            if (!selectedZone || !filteredData) return;

            const chosenLocation = filteredData.find(
                (item) => item.timeZone.toLowerCase() === selectedZone.toLowerCase(),
            );
            if (!chosenLocation) return;

            const alreadySaved = savedLocations.some((item) => item.timeZone === chosenLocation.timeZone);
            if (!alreadySaved) {
                savedLocations.push(chosenLocation);
                saveLocations();
                renderSavedLocations();
            }
        });
    }

    // "x" on a saved item (one listener on the <ul> handles every button)
    if (savedLocationsUl) {
        savedLocationsUl.addEventListener('click', (e) => {
            if (!(e.target instanceof Element)) return;
            if (!e.target.classList.contains('removeBtn')) return;

            const li = e.target.closest('li');
            if (!li) return;

            savedLocations = savedLocations.filter((item) => item.timeZone !== li.dataset.timezone);
            saveLocations();
            renderSavedLocations();
        });
    }
}