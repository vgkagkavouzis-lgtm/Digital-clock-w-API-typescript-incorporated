// Time converter: date + time in one zone → the same moment in another zone.

import { Temporal } from '@js-temporal/polyfill';
import {
    convertForm,
    convertFromDate,
    convertFromTime,
    convertFromTimezone,
    convertToTimezone,
    convertedDate,
    convertedTime,
    convertedTimezone,
} from '../../dom/elements';

export function initConverter(): void {
    // Local consts so the null checks still apply inside the callback
    const form = convertForm;
    const dateInput = convertFromDate;
    const timeInput = convertFromTime;
    const fromZone = convertFromTimezone;
    const toZone = convertToTimezone;

    if (!form || !dateInput || !timeInput || !fromZone || !toZone) return;

    const inputs = [dateInput, timeInput, fromZone, toZone];

    // Convert automatically as soon as every field has a value
    form.addEventListener('input', () => {
        if (checkIfFilled(inputs)) {
            convertTime(dateInput, timeInput, fromZone, toZone);
        } else {
            clearResult();
        }
    });
}

// Not exported: only initConverter uses it.
function checkIfFilled(inputs: (HTMLInputElement | HTMLSelectElement)[]): boolean {
    return inputs.every((input) => input.value !== '' && input.value !== 'Timezone');
}

// Not exported: only initConverter uses it.
function convertTime(
    dateInput: HTMLInputElement,
    timeInput: HTMLInputElement,
    fromZone: HTMLSelectElement,
    toZone: HTMLSelectElement,
): void {
    const [year, month, day] = dateInput.value.split('-').map(Number);
    const [hour, minute] = timeInput.value.split(':').map(Number);

    const converted = Temporal.ZonedDateTime.from({
        year,
        month,
        day,
        hour,
        minute,
        timeZone: fromZone.value,
    }).withTimeZone(toZone.value);

    const pad = (num: number) => String(num).padStart(2, '0');

    if (convertedDate) {
        convertedDate.textContent = `${pad(converted.day)}-${pad(converted.month)}-${converted.year}`;
    }
    if (convertedTime) {
        convertedTime.textContent = `${pad(converted.hour)}:${pad(converted.minute)}:${pad(converted.second)}`;
    }
    if (convertedTimezone) {
        convertedTimezone.textContent = converted.timeZoneId;
    }
}

function clearResult(): void {
    for (const el of [convertedDate, convertedTime, convertedTimezone]) {
        if (el) el.textContent = '';
    }
}