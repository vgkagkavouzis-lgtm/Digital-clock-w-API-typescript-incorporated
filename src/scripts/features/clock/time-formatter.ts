// Formats the current time in any time zone. Pure function: no DOM, no state.

import type { TimeDateFormatter } from '../../types/zones';

export function dateFormatter(zone: string, hour12or24: boolean): TimeDateFormatter {
    const now = new Date();

    const formatterZone = Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: hour12or24,
        hourCycle: 'h23',
        timeZone: zone,
        timeZoneName: 'shortOffset',
    }).formatToParts(now);

    const timeVl: string = formatterZone
        .filter(({ type }) => ['hour', 'minute', 'second'].includes(type))
        .map(({ value }) => value)
        .join(':'); // join always returns a string, so no ?? '' needed

    const periodVl: string = formatterZone.find(({ type }) => type === 'dayPeriod')?.value ?? '';

    const offsetVl: string =
        formatterZone.find(({ type }) => type === 'timeZoneName')?.value ?? '';

    return { timeVl, periodVl, offsetVl };
}