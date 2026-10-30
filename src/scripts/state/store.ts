// Shared state: values that more than one module reads or writes.
// Other files can read an imported binding but never reassign it,
// so every change goes through a setter defined here.

import type { FilterApi } from '../types/zones';

let selectedZone: string | undefined; // the zone shown in the main display
let is12hour = true; // 12h or 24h format
let filteredData: FilterApi[] | undefined; // API data, trimmed (undefined until loaded)
let countriesAndCities: string[] = []; // flat list of names for autocomplete

export function getSelectedZone(): string | undefined {
    return selectedZone;
}
export function setSelectedZone(zone: string): void {
    selectedZone = zone;
}

export function getIs12hour(): boolean {
    return is12hour;
}
export function setIs12hour(value: boolean): void {
    is12hour = value;
}

export function getFilteredData(): FilterApi[] | undefined {
    return filteredData;
}
export function setFilteredData(data: FilterApi[]): void {
    filteredData = data;
}

export function getCountriesAndCities(): string[] {
    return countriesAndCities;
}
export function setCountriesAndCities(names: string[]): void {
    countriesAndCities = names;
}