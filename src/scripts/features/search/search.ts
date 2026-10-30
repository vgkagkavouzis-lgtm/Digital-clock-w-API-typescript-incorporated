// Finds a zone by country, city or zone name and shows it in the main display.

import { getFilteredData, setSelectedZone } from '../../state/store';
import {
    city,
    country,
    formInput,
    mainDisplayVisual23hDiv,
    output,
    searchInput,
    selectZones,
    timeZone,
} from '../../dom/elements';
import { getTime } from '../clock/clock';
import { DivBuilder23hVisual } from '../visual-hours/visual-builder';

export function updateText(inp: string): void {
    const filteredData = getFilteredData();

    if (!filteredData) {
        if (output) output.textContent = 'Could not load data';
        return;
    }

    const search = inp.toLowerCase();
    const result = filteredData.find(
        (value) =>
            value.country.toLowerCase() === search ||
            value.cities.some((x) => x.toLowerCase() === search) ||
            value.timeZone.toLowerCase() === search,
    );

    if (!result) {
        if (output) output.textContent = 'No matching timezone found';
        return;
    }

    // Text update
    if (country) country.textContent = result.country;
    if (city) {
        city.textContent = result.cities.find((x) => x.toLowerCase() === search) ?? result.cities[0];
    }
    if (timeZone) timeZone.textContent = result.timeZone;
    if (searchInput) searchInput.value = '';

    setSelectedZone(result.timeZone);

    // Rebuild the 24h boxes for the new zone
    if (mainDisplayVisual23hDiv) {
        mainDisplayVisual23hDiv.replaceChildren(...DivBuilder23hVisual(result.timeZone, 'Main Display'));
    }

    // Keep the select in sync with what was searched
    if (selectZones) selectZones.value = result.timeZone;

    getTime();
}

export function initSearch(): void {
    // Local consts so the null checks still apply inside the callbacks
    const form = formInput;
    const input = searchInput;
    const select = selectZones;

    // Submit (Enter key in the search field)
    if (form && input) {
        form.addEventListener('submit', (e: SubmitEvent) => {
            e.preventDefault();
            updateText(input.value.trim());
            input.value = '';
        });
    }

    // Choosing a zone from the select
    if (select) {
        select.addEventListener('change', () => {
            updateText(select.value);
        });
    }
}