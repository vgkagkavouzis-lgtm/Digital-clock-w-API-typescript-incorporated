// Fetches the time zone list, trims it, and fills every <select> with it.

import type { ApiZone, FilterApi } from '../types/zones';
import { setCountriesAndCities, setFilteredData } from '../state/store';
import { convertFromTimezone, convertToTimezone, mainAssistantDisplay, secondaryAssistantDisplay, selectZones } from '../dom/elements';
import { displayMessageColor } from '../ui/assistant-messages';

const TIMEZONES_URL = 'https://api.timezones.in/v1/timezones';

export async function loadZones(): Promise<FilterApi[] | undefined> {
    displayMessageColor(mainAssistantDisplay, 'Loading time-zones..', 'info');
    displayMessageColor(secondaryAssistantDisplay, '', 'info')


    try {
        const res = await fetch(TIMEZONES_URL);

        if (!res.ok) {
            console.log('Could not get data!');
            displayMessageColor(mainAssistantDisplay, 'Could not load data', 'error')
            return;
        }

        const zonesData: ApiZone[] = await res.json();
        
        displayMessageColor(mainAssistantDisplay, 'Search something..', 'neutral')
        displayMessageColor(secondaryAssistantDisplay, 'Type a city or country, or pick a time zone', 'info')

        return extractData(zonesData);
    } catch (er) {
        if (er instanceof Error) {
            console.log(`Fetch error: ${er.message}!`);
        } else {
            console.log('Unknown error:', er);
        }
        displayMessageColor(mainAssistantDisplay, 'Could not load data', 'error')
        displayMessageColor(secondaryAssistantDisplay, 'Check the internet connection', 'error')
    } 
}

// Not exported: only loadZones needs it.
function extractData(data: ApiZone[]): FilterApi[] {
    const filteredData: FilterApi[] = data.map((item) => ({
        country: item.countryName,
        cities: item.mainCities,
        timeZone: item.name,
    }));
    setFilteredData(filteredData);

    // Fill the main select and both selects in the converter
    for (const select of [selectZones, convertFromTimezone, convertToTimezone]) {
        if (select) {
            fillSelect(select, filteredData);
        }
    }

    // One flat list of countries + cities for the autocomplete
    const names = filteredData.reduce<string[]>((acc, item) => {
        acc.push(item.country, ...item.cities);
        return acc;
    }, []);
    setCountriesAndCities(names);

    return filteredData;
}

// Not exported: only extractData needs it.
function fillSelect(select: HTMLSelectElement, zones: FilterApi[]): void {
    zones.forEach((zone) => {
        const option = document.createElement('option');
        option.value = zone.timeZone;
        option.textContent = zone.timeZone;
        select.appendChild(option);
    });
}