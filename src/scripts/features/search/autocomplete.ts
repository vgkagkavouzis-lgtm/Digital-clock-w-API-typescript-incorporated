// Suggestion list under the search field: typing, arrow keys, mouse hover, click.

import { getCountriesAndCities } from '../../state/store';
import { output, searchInput as searchInputEl, suggestionsBox as suggestionsBoxEl } from '../../dom/elements';
import { updateText } from './search';

// Private to this file: which suggestion is highlighted (-1 = none).
let eventIndex = -1;

export function initAutocomplete(): void {
    // Copy into local consts: TypeScript remembers a null check on a local const
    // inside callbacks, but not on an imported binding.
    const searchInput = searchInputEl;
    const suggestionsBox = suggestionsBoxEl;
    if (!searchInput || !suggestionsBox) return;

    // Typing: rebuild the suggestion list
    searchInput.addEventListener('input', () => {
        suggestionsBox.replaceChildren();
        eventIndex = -1;

        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm === '') return;

        const countriesAndCities = getCountriesAndCities();
        if (countriesAndCities.length === 0) {
            if (output) output.textContent = 'No locations available yet.';
            return;
        }

        countriesAndCities.forEach((item) => {
            if (item.toLowerCase().includes(searchTerm)) {
                const div = document.createElement('div');
                div.classList.add('suggestions');
                div.textContent = item;
                suggestionsBox.appendChild(div);

                div.addEventListener('click', () => {
                    searchInput.value = item;
                    updateText(item);
                    suggestionsBox.replaceChildren();
                });
            }
        });
    });

    // Click anywhere else closes the list
    document.addEventListener('click', (e) => {
        if (!(e.target instanceof Element)) return;
        if (!e.target.closest('.suggestions')) {
            suggestionsBox.replaceChildren();
        }
    });

    // Arrow keys, Escape, Enter
    searchInput.addEventListener('keydown', (e) => {
        const divs = suggestionsBox.querySelectorAll<HTMLDivElement>('.suggestions');
        if (divs.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            eventIndex++;
            updateHighlights(divs, eventIndex, searchInput);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            eventIndex--;
            updateHighlights(divs, eventIndex, searchInput);
        } else if (e.key === 'Escape' || e.key === 'Enter') {
            suggestionsBox.replaceChildren();
            eventIndex = -1;
        }
    });

    // Mouse hover highlights the suggestion under the pointer
    suggestionsBox.addEventListener('mouseover', (e) => {
        const divs = suggestionsBox.querySelectorAll<HTMLDivElement>('.suggestions');
        if (divs.length === 0) return;

        divs.forEach((div, i) => {
            if (e.target instanceof HTMLElement && e.target.closest('.suggestions') === div) {
                eventIndex = i;
                updateHighlights(divs, eventIndex, searchInput);
            }
        });
    });

    suggestionsBox.addEventListener('mouseleave', () => {
        suggestionsBox
            .querySelectorAll<HTMLDivElement>('.suggestions')
            .forEach((div) => div.classList.remove('highlight'));
        eventIndex = -1;
    });
}

// Not exported: only the listeners above use it.
// Wraps around: past the last item goes to the first, before the first goes to the last.
function updateHighlights(divs: NodeListOf<HTMLDivElement>, idx: number, input: HTMLInputElement): void {
    divs.forEach((div) => div.classList.remove('highlight'));

    if (idx >= 0 && idx < divs.length) {
        divs[idx].classList.add('highlight');
        input.value = divs[idx].textContent ?? '';
    } else if (idx >= divs.length) {
        divs[0].classList.add('highlight');
        input.value = divs[0].textContent ?? '';
        eventIndex = 0;
    } else if (idx < 0) {
        divs[divs.length - 1].classList.add('highlight');
        input.value = divs[divs.length - 1].textContent ?? '';
        eventIndex = divs.length - 1;
    }
}