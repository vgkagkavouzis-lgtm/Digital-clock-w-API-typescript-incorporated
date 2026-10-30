// Fetches the time zone list, trims it, and fills every <select> with it.

import type { ApiZone, FilterApi } from '../types/zones';
import { setCountriesAndCities, setFilteredData } from '../state/store';
import { convertFromTimezone, convertToTimezone, output, selectZones } from '../dom/elements';

const TIMEZONES_URL = 'https://api.timezones.in/v1/timezones';

export async function loadZones(): Promise<FilterApi[] | undefined> {
    if (!output) {
        console.log('Output paragraph not found');
        return;
    }

    output.textContent = 'Loading data..';

    try {
        const res = await fetch(TIMEZONES_URL);

        if (!res.ok) {
            console.log('Could not get data!');
            output.textContent = 'Could not load data';
            return;
        }

        const zonesData: ApiZone[] = await res.json();
        output.textContent = 'Search something..';
        return extractData(zonesData);
    } catch (er) {
        if (er instanceof Error) {
            console.log(`Fetch error: ${er.message}!`);
        } else {
            console.log('Unknown error:', er);
        }
        output.textContent = 'Could not load data';
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