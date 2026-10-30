// Builds the 24 colored hour boxes (with the "Now" marker) for one time zone.

import type { Destination, HoursType } from '../../types/zones';
import { dateFormatter } from '../clock/time-formatter';

// Not used anywhere yet. Exported so it's ready for the meeting-overlap feature.
export function checKifWorkingHours(zone: string): HoursType {
    const hour24 = Number(dateFormatter(zone, false).timeVl.split(':')[0]);

    if (hour24 >= 9 && hour24 <= 17) {
        return 'Working hours';
    } else if ((hour24 >= 7 && hour24 < 9) || (hour24 >= 18 && hour24 < 23)) {
        return 'Awake hours';
    } else {
        return 'Sleep hours'; // 23 and 0–6
    }
}

export function DivBuilder23hVisual(zone: string, destination: Destination): HTMLDivElement[] {
    const hour24 = Number(dateFormatter(zone, false).timeVl.split(':')[0]);

    let startingHourDiv = 0;
    if (hour24 >= 11 && hour24 <= 23) {
        startingHourDiv = hour24 - 11;
    } else if (hour24 >= 0 && hour24 < 11) {
        startingHourDiv = hour24 + 13;
    }

    const divs: HTMLDivElement[] = [];

    let n = 0; // the increasing label text, e.g. '00', '01'
    let wentOver23 = false; // once n passes 23 it wraps to 0
    for (let i = 0; i <= 23; i++) {
        if (startingHourDiv >= 0 && startingHourDiv < 12) {
            if (i === 12) {
                const now: HTMLDivElement = document.createElement('div');
                now.classList.add('now-marker');
                now.textContent = 'Now';
                if (destination === 'Main Display') {
                    now.classList.add('now-main-display');
                } else {
                    now.classList.add('now-saved-zones');
                }
                divs.push(now);

                const update = parentBoxAndLabelBuilder(startingHourDiv, n, i, wentOver23, destination);
                n = update.n;
                wentOver23 = update.wentOver23;
                divs.push(update.parentDiv);
            } else {
                const update = parentBoxAndLabelBuilder(startingHourDiv, n, i, wentOver23, destination);
                n = update.n;
                wentOver23 = update.wentOver23;
                divs.push(update.parentDiv);
            }
        } else if (startingHourDiv >= 12 && startingHourDiv < 24) {
            if (i === 12) {
                const now: HTMLDivElement = document.createElement('div');
                now.classList.add('now-marker');
                if (destination === 'Main Display') {
                    now.classList.add('now-main-display');
                } else {
                    now.classList.add('now-saved-zones');
                }
                now.textContent = 'Now';
                divs.push(now);

                const update = parentBoxAndLabelBuilder(startingHourDiv, n, i, wentOver23, destination);
                n = update.n;
                wentOver23 = update.wentOver23;
                divs.push(update.parentDiv);
            } else {
                const update = parentBoxAndLabelBuilder(startingHourDiv, n, i, wentOver23, destination);
                n = update.n;
                wentOver23 = update.wentOver23;
                divs.push(update.parentDiv);
            }
        }
    }
    return divs;
}

// Not exported: only DivBuilder23hVisual uses it.
function parentBoxAndLabelBuilder(
    startingHourDiv: number,
    n: number,
    i: number,
    wentOver23: boolean,
    destination: Destination,
): { wentOver23: boolean; n: number; parentDiv: HTMLDivElement } {
    const parentDiv: HTMLDivElement = document.createElement('div');
    const id: number | string =
        startingHourDiv >= 10 ? Number(startingHourDiv) : String(startingHourDiv).padStart(2, '0');

    if (wentOver23 === false) {
        n = Number(id) + i;
    }

    const boxClassId: string = n < 10 ? `hours-0${n}-div` : `hours-${n}-div`;
    parentDiv.classList.add('hour-div-plus-label-div', boxClassId);

    const boxDiv: HTMLDivElement = document.createElement('div');
    if ((i >= 0 && i < 5) || (i >= 19 && i < 24)) {
        if (destination === 'Main Display') {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-small');
        } else {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-small', 'saved-zones-23hVisual');
        }
    } else if ((i >= 5 && i < 9) || (i >= 15 && i < 19)) {
        if (destination === 'Main Display') {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-medium');
        } else {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-small', 'saved-zones-23hVisual');
        }
    } else if (i === 9 || i === 10 || i === 13 || i === 14) {
        if (destination === 'Main Display') {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-large');
        } else {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-small', 'saved-zones-23hVisual');
        }
    } else if (i === 12 || i === 11) {
        if (destination === 'Main Display') {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-middle');
        } else {
            boxDiv.classList.add('visual-box-24h', 'visual-box-24h-middle', 'saved-zones-23hVisual');
        }
    }

    const labelDiv: HTMLDivElement = document.createElement('div');
    labelDiv.classList.add('label-box-24h');

    if (destination === 'Main Display') {
        labelDiv.textContent = String(n).padStart(2, '0');
    }
    if (n >= 23) {
        n = 0;
        wentOver23 = true;
    } else {
        n++;
    }

    parentDiv.append(boxDiv, labelDiv);

    return { wentOver23, n, parentDiv };
}