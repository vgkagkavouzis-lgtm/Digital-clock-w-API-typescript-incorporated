// The 1-second loop that updates the local time, the selected zone and every saved zone.

import { getIs12hour, getSelectedZone } from '../../state/store';
import {
    localOffset,
    localPeriod,
    localTime,
    localZoneDisplay,
    offset,
    period,
    savedLocationsUl,
    time,
} from '../../dom/elements';
import { dateFormatter } from './time-formatter';

// Private to this file: nobody else needs them.
const localZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
let timeoutId: number | undefined;

export function getTime(): void {
    clearTimeout(timeoutId); // stop the previous loop so only one is ever running
    const is12hour = getIs12hour();

    // Local time
    const localFormatter = dateFormatter(localZone, is12hour);
    if (localZoneDisplay) localZoneDisplay.textContent = localZone;
    if (localTime) localTime.textContent = localFormatter.timeVl;
    if (localPeriod) localPeriod.textContent = localFormatter.periodVl;
    if (localOffset) localOffset.textContent = localFormatter.offsetVl;

    // Selected zone
    const selectedZone = getSelectedZone();
    if (selectedZone) {
        const selectedFormatter = dateFormatter(selectedZone, is12hour);
        if (time) time.textContent = selectedFormatter.timeVl;
        if (period) period.textContent = selectedFormatter.periodVl;
        if (offset) offset.textContent = selectedFormatter.offsetVl;
    }

    updateSavedTimes(is12hour);

    timeoutId = window.setTimeout(getTime, 1000);
}

// Not exported: only getTime calls it.
function updateSavedTimes(is12hour: boolean): void {
    if (!savedLocationsUl) return;

    savedLocationsUl.querySelectorAll('li').forEach((li) => {
        const zone = li.dataset.timezone;
        if (!zone) return;

        const formatter = dateFormatter(zone, is12hour);
        const liTime = li.querySelector('.saved-time');
        const liPeriod = li.querySelector('.saved-period');
        const liOffset = li.querySelector('.saved-offset');

        if (liTime) liTime.textContent = formatter.timeVl;
        if (liPeriod) liPeriod.textContent = formatter.periodVl;
        if (liOffset) liOffset.textContent = formatter.offsetVl;
    });
}