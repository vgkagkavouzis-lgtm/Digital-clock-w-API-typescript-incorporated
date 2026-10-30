// Shapes of the data the app works with.
// Other files import these with `import type`, so this file produces no JavaScript.

/** One entry exactly as the timezones.in API returns it. */
export type ApiZone = {
    name: string;
    alternativeName: string;
    abbreviation: string;
    countryCode: string;
    countryName: string;
    continentCode: string;
    mainCities: string[];
    rawOffsetInMinutes: number;
    currentTimeOffsetInMinutes: number;
    currentTimeFormat: string;
};

/** The trimmed-down version of ApiZone the app actually uses. */
export type FilterApi = {
    country: string;
    cities: string[];
    timeZone: string;
};

/** What dateFormatter returns. */
export type TimeDateFormatter = {
    timeVl: string;
    periodVl: string;
    offsetVl: string;
};

/** Where a 24-hour strip is being drawn. */
export type Destination = 'Main Display' | 'Saved Zones';

export type HoursType = 'Working hours' | 'Sleep hours' | 'Awake hours';