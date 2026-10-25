import { Temporal } from "@js-temporal/polyfill";

const formInput = document.getElementById('main-input-form');
const suggestionsBox = document.querySelector<HTMLDivElement>('.suggestions-box');

const input = document.getElementById('searchBar');

// Displays
const output = document.querySelector<HTMLParagraphElement>('.assistant-display p')
const country = document.getElementById('country');
const city = document.getElementById('city');
const timeZone = document.getElementById('time-zone');

const time = document.getElementById('time'); // searched time
const period =document.getElementById('period'); // searched period
const offset = document.getElementById('offset');
const localZoneDisplay = document.getElementById('localZoneDisplay');
const localTime = document.getElementById('localTime');
const localPeriod = document.getElementById('localPeriod');
const localOffset = document.getElementById('localOffset');

//Select for the input
const selectZones = document.getElementById('timeZoneSelect');
// Select for the converter
 

// Buttons add / remove
const addLocationBtn = document.querySelector<HTMLButtonElement>('#add-location-btn');


let savedLocations: FilterApi[] = []; //array with obj

//===================API===================


let selectedZone: string; // assign every time a different zone / string
const localZone: string =  Intl.DateTimeFormat().resolvedOptions().timeZone; // find local timezone / string
let timeoutId: ReturnType<typeof window.setTimeout> | undefined; // for running and stopping the function


let is12hour: boolean;
const btn12h = document.querySelector<HTMLButtonElement>('#toggle12hour button');

let countriesAndCities: string[] = []; // array for autocomplete / only the names
let savedLocationsUl = document.querySelector<HTMLUListElement>('.saved-zones-container');

const timezones: string = 'https://api.timezones.in/v1/timezones';

type ApiZone = {
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
}
let zonesData: ApiZone[]; //All the api array w obj

type FilterApi ={
    country: string;
    cities: string[];
    timeZone: string;
}

let filteredData: FilterApi[];   //only the values I need / array w obj


async function loadZones (): Promise <FilterApi[] | undefined> {
    
    if(output) {
        output.textContent = 'Loading data..'  
        
        try {
            const res = await fetch(timezones);
            
            if (!res.ok) {
                console.log('Could not get data!');
                return
            } 
            
            zonesData = await res.json();
            if(zonesData) {
                output.textContent = 'Search something..'
                return extractData(zonesData);
            } else {
                output.textContent = 'Could not get data!'
            }
            
        } catch (er) {
            if(er instanceof Error) {
                console.log(`Fetch error: ${er.message}!`);
            } else {
                console.log('Unknown error:', er)
            }
        }
        
        output.textContent = zonesData ? '' : 'Could not load data';
    
    } else {
        console.log(`Output paragraph not found'`)
        return
    }  
}

function extractData (data: ApiZone[]): FilterApi[] {
    filteredData = data.map((item) => { 
        return {
            country: item.countryName,
            cities: item.mainCities,
            timeZone: item.name
        }
    }); 
    
    // ======'Select (all of them)'========
        // fill select input, and both the one in the convert area
        if (selectZones instanceof HTMLSelectElement) {
            fillSelect(selectZones)
        } 
        if (convertFromTimezone instanceof HTMLSelectElement) {
            fillSelect(convertFromTimezone)
        } 
        if (convertToTimezone instanceof HTMLSelectElement) {
            fillSelect(convertToTimezone)
        } 


    //create a big array for the autocomplete
    countriesAndCities = filteredData.reduce<string[]>((acc, item) => {
        acc.push(item.country, ...item.cities);
        return acc;
    }, [])

    return filteredData;    
}

function fillSelect (select: HTMLSelectElement): void {
        filteredData.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone.timeZone;
        option.textContent = zone.timeZone;
        
        // fill select input, and both the one in the convert area
        select.appendChild(option);
    })
}


// so far the page loaded and filteredData and zonesData are saved



// ===============Events==============

// submit event
if (formInput instanceof HTMLFormElement && input instanceof HTMLInputElement) {
    formInput.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();
        
        const userInput = input.value.trim();
        
        updateText(userInput);
        
        input.value = '';
    })
}
    
// select event
if (selectZones instanceof HTMLSelectElement) {
    selectZones.addEventListener('change', () => {
        clearTimeout(timeoutId);
        selectedZone = selectZones.value;
        updateText(selectedZone);
    })
}

// 'Add location' & 'remove' btn event
if (addLocationBtn instanceof HTMLButtonElement) {
    addLocationBtn.addEventListener('click', () => {
        
        if (!selectedZone) return;
        
        let chosenLocation = filteredData.find(item => item.timeZone.toLowerCase() === selectedZone.toLowerCase());
        
        if(!chosenLocation) return;
        
        let alreadySaved = savedLocations.some(item => 
            item.timeZone === chosenLocation.timeZone) 
            
            if(!alreadySaved) {
                savedLocations.push(chosenLocation);
                saveLocations();
                renderSavedLocations()
            }
            
    })

}
   
// remove list btn
if (savedLocationsUl instanceof HTMLUListElement) {
    savedLocationsUl.addEventListener('click', (e) => {
        if (!(e.target instanceof Element)) {
            return
        } else if (e.target.classList.contains('removeBtn')) {
            const li = e.target.closest('li');
            
            if (!li) return;
            
            savedLocations = savedLocations.filter(
                item => item.timeZone !== li.dataset.timezone);
                

                saveLocations()
                renderSavedLocations();
            }
        }
)}

// 12hour btn
if (btn12h instanceof HTMLButtonElement) {

    btn12h.addEventListener('click', () => {
        is12hour = !is12hour;
        
        localStorage.setItem('is12hour', JSON.stringify(is12hour))
        
        btn12h.textContent = is12hour ? '12h' : '24h';
        
        clearTimeout(timeoutId);
        getTime();
    })
}
    
// Night mode
const nightModeBtn = document.getElementById('day-night-toggle');

if (nightModeBtn instanceof HTMLButtonElement) {
    nightModeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
    })
}

// =========Local Storage==========

// save locations 
function saveLocations(): void {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
}

// load AM / Pm
function load12hour (): void {
    const stored = localStorage.getItem('is12hour');

    is12hour = true;

    if (stored !== null) {
        try {
            const load12: unknown = JSON.parse(stored);

            if (typeof load12 === 'boolean') {
                is12hour = load12;
            }
        } catch {
            console.log("Invalid saved hour format");
        }
        } 
    
    if (btn12h instanceof HTMLButtonElement) {
        btn12h.textContent = is12hour ? '12h' : '24h';
    }
}

//load locations when page loads
function loadLocations(): void {
    const stored = localStorage.getItem('savedLocations');

    if (stored !== null) {
        try {
            const parsed: unknown = JSON.parse(stored);
            
            if (Array.isArray(parsed)) {
                const valid = parsed.every((item: unknown): item is FilterApi => {
                    return (
                    typeof item === "object" && item !== null &&
                    'country' in item && typeof item.country === 'string' &&
                    'cities' in item && Array.isArray(item.cities) && item.cities.every(city => typeof city === 'string') &&
                    'timeZone' in item && typeof item.timeZone === 'string'
                    )
                })

                if (valid) {
                    savedLocations = parsed;
                    if(output) {
                        output.textContent = 'Search Something.'
                    }
                } else {
                    throw new Error('Invalid saved locations')
                }
            } else {
                throw new Error('Invalid saved locations')
            }
        } catch (er) {
            if (output) {
                output.textContent = er instanceof Error 
                                    ? er.message 
                                    : 'Could not load saved locations'

            }
            localStorage.removeItem("savedLocations");
            savedLocations = [];
        }
    }
}




// render the li for every 'add location' click
function renderSavedLocations(): void {
    if (savedLocationsUl instanceof HTMLUListElement) {

        savedLocationsUl.replaceChildren();
        
        savedLocations.forEach((loc) => {
            const li = document.createElement('li');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            const span1 = document.createElement('span');
            // const span2 = document.createElement('span');
            const span3 = document.createElement('span');
            const span4 = document.createElement('span');
            const span5 = document.createElement('span');
            const btnRemove = document.createElement('button');
            
            li.dataset.timezone = loc.timeZone;
            p1.classList.add('saved-city-offset');
            p2.classList.add('saved-time-period-btn')
            span1.classList.add('saved-city');
            span1.textContent = `${loc.cities[0]} `;
            // span2.classList.add('saved-timeZone');
            // span2.textContent = loc.timeZone;
            span3.classList.add('saved-time');
            span3.textContent = dateFormatter(loc.timeZone).timeVl;
            span4.classList.add('saved-period');
            span4.textContent = dateFormatter(loc.timeZone).periodVl;
            span5.classList.add('saved-offset');
            span5.textContent = dateFormatter(loc.timeZone).offsetVl;
            
            btnRemove.classList.add('removeBtn', 'btn')
            btnRemove.textContent = 'x';
            
            savedLocationsUl.append(li);
            li.append(p1, p2, btnRemove);
            p1.append(span1, span5);
            p2.append(span3, span4);
        }
    )
}
}



// ============Search============

function updateText (inp: string): void {
    
    if(!filteredData) {
        if(output) {
            output.textContent = 'Could not load data'
        }
        return
    } else {
        // check if input matches
        const result = filteredData.find(value => 
            value.country.toLowerCase() === inp.toLowerCase() ||
            value.cities.some(x => x.toLowerCase() === inp.toLowerCase()) || //some gets true or false
            value.timeZone.toLowerCase() === inp.toLowerCase()    // the timezone do not get altered, keep it mix letters
        )

        
        if (result) {
            //text update
            country.textContent = result.country;
            city.textContent = result.cities.find(x => x.toLowerCase() === inp.toLowerCase()) ?? result.cities[0];
            timeZone.textContent = result.timeZone;
            //update input value 
            if (input instanceof HTMLInputElement) {
                input.value = '';
            }
            //update the selectedZone variable
            selectedZone = result.timeZone; // assign to the result the selected zone
            //update the select
            if (selectZones instanceof HTMLSelectElement) {
                selectZones.value = selectedZone;
            }
            getTime();

        } else {
            if (output) {
                output.textContent = 'No matching timezone found';
            }
            return
        }
    }
}

type TimeDateFormatter = {
    timeVl: string;
    periodVl: string;
    offsetVl: string;
}

function dateFormatter (zone: string) {
    const now = new Date();
    
    const formatterZone = Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: is12hour,
        hourCycle: 'h23',
        timeZone: zone,
        timeZoneName: 'shortOffset'
    }).formatToParts(now);

    const timeVl: string = formatterZone.filter(({type}) => ['hour', 'minute', 'second'].includes(type))
    .map(({value}) => value)
    .join(':'); // No ?? '' because join always returns a string

    const periodVl: string = formatterZone.find(({type}) => type === 'dayPeriod')?.value ?? '';  // undefined or empty

    const offsetVl: string = formatterZone.filter(({type}) => type === 'timeZoneName').map(({value}) => value)[0] ?? '';

    return ({timeVl, periodVl, offsetVl})
}

//selected time zone display
function getTime (): void {
    clearTimeout(timeoutId);
    const localFormatter: TimeDateFormatter = dateFormatter(localZone);

    //get the local time
    if (localZoneDisplay instanceof HTMLSpanElement) {
        localZoneDisplay.textContent = localZone;
    }
    if (localTime instanceof HTMLSpanElement) {
        localTime.textContent = localFormatter.timeVl;
    }
    if (localPeriod instanceof HTMLSpanElement) {
        localPeriod.textContent = localFormatter.periodVl;
    }
    if (localOffset instanceof HTMLSpanElement) {
        localOffset.textContent = localFormatter.offsetVl;
    }

    if (selectedZone) {
        const selectedZoneFormatter: TimeDateFormatter = dateFormatter(selectedZone);
        //update the time
        if(time instanceof HTMLParagraphElement) {
            time.textContent = selectedZoneFormatter.timeVl;
        }
        if(period instanceof HTMLParagraphElement) {
            period.textContent = selectedZoneFormatter.periodVl;
        }
        if(offset instanceof HTMLParagraphElement) {
            offset.textContent = selectedZoneFormatter.offsetVl;
        }
    }

    //update all list/saved items
    updateSavedTimes();

    timeoutId = window.setTimeout(getTime, 1000);
}

function updateSavedTimes (): void {
    if (!(savedLocationsUl instanceof HTMLUListElement)) return

    const liItems = savedLocationsUl.querySelectorAll('li');

    liItems.forEach(li => {
            const zone = li.dataset.timezone;
            if (!zone) return
            const formatter: TimeDateFormatter = dateFormatter(zone);
            const liTime = li.querySelector('.saved-time');
            const liPeriod = li.querySelector('.saved-period');
            const liOffset = li.querySelector('.saved-offset');
            
            if (liTime) {
                liTime.textContent = formatter.timeVl;
            }
            if (liPeriod) {
                liPeriod.textContent = formatter.periodVl;
            }
            if (liOffset) {
                liOffset.textContent = formatter.offsetVl;
            }
    })
}

// ==========auto fill===========
let eventIndex: number = -1;

if (input instanceof HTMLInputElement) {
    input.addEventListener('input', () => {
        if (!suggestionsBox) return
        suggestionsBox.replaceChildren();
        eventIndex = -1;

        const searchTerm = input.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            return
        }
        
        if (countriesAndCities.length > 0) {
            countriesAndCities.forEach(item => {
                if(item.toLowerCase().includes(searchTerm)) {
                    const div = document.createElement('div');
                    div.classList.add('suggestions');
                    div.textContent = item;
                    suggestionsBox.appendChild(div);
                    
                    
                    // click event for select
                    div.addEventListener('click', () => {
                        input.value = item; // update searchBar (city or country)
                        updateText(item);
                        
                        suggestionsBox.replaceChildren();
                    })
                }
            })
        } else {
            if (output) {
                output.textContent = 'No locations available yet.'
            }
        }
    })
}

document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return

    if (suggestionsBox && !e.target.closest('.suggestions')) {
        suggestionsBox.replaceChildren();
    }
})

// input arrow down event

if (input instanceof HTMLInputElement) {
    input.addEventListener('keydown', (e) => {
        const divs = document.querySelectorAll<HTMLDivElement>('.suggestions');
        if (!(divs.length > 0)) return
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            eventIndex ++;
            updateHighlights (divs, eventIndex, input);
            
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            eventIndex --;
            updateHighlights (divs, eventIndex, input);
        } else if (e.key === 'Escape' && suggestionsBox) {
            eventIndex = -1;
            suggestionsBox.replaceChildren()    
            eventIndex = -1;           
        } else if (e.key === 'Enter' && suggestionsBox) {
            suggestionsBox.replaceChildren() 
            eventIndex = -1;           
        }
    })
}
    
function updateHighlights (divs: NodeListOf<HTMLDivElement>, idx: number, input: HTMLInputElement): void {
    divs.forEach(div => div.classList.remove('highlight'))
    
    if (idx >= 0 && idx < divs.length) {
        divs[idx].classList.add('highlight');
        input.value = divs[idx].textContent ?? '';
        
    } else if (idx >= divs.length && divs.length > 0) {
        divs[0].classList.add('highlight');
        input.value = divs[0].textContent ?? '';
        eventIndex = 0;
        
    } else if (idx < 0 && divs.length > 0) {
        divs[divs.length - 1].classList.add('highlight');
        input.value = divs[divs.length - 1].textContent ?? '';
        
        eventIndex = divs.length - 1;
    }
}

// mouse hover highlight events
if (suggestionsBox instanceof HTMLDivElement && input instanceof HTMLInputElement) {
    
    suggestionsBox.addEventListener('mouseover', (e) => {
        const divs = suggestionsBox.querySelectorAll<HTMLDivElement>('.suggestions');
        if (!(divs.length > 0)) return

        divs.forEach((div, i) => {
            if (e.target instanceof HTMLElement && e.target.closest('.suggestions') === div) {
                eventIndex = i;
                updateHighlights(divs, eventIndex, input);
            }
        });
    })

    suggestionsBox.addEventListener('mouseleave', () => {
        const divs = suggestionsBox.querySelectorAll<HTMLDivElement>('.suggestions');

        divs.forEach(div => div.classList.remove('highlight'))
        eventIndex = -1;
    });
}














// ============== Time Converter ==================
// The inputs
const convertFromTimezone = document.getElementById('convertFromTimezone');
const convertToTimezone = document.getElementById('convertToTimezone');
const convertFromTime = document.getElementById('convertFromTime');
const convertFromDate = document.getElementById('convertFromDate');
const convertForm = document.querySelector<HTMLFormElement>('#time-converter form');
const converterInputs = [convertFromDate, convertFromTime, convertFromTimezone, convertToTimezone];

// The displayed result
const convertedDate = document.querySelector<HTMLSpanElement>('.converted-date');
const convertedTime = document.querySelector<HTMLSpanElement>('.converted-time');
const convertedTimezone = document.querySelector<HTMLSpanElement>('.converted-timezone');
const result = [convertedDate, convertedTime, convertedTimezone]


// if all inputs are filled then do the conversion
if (convertForm instanceof HTMLFormElement) {
    convertForm.addEventListener('input', () => {
        
        if (
            converterInputs.every(
                input => input instanceof HTMLInputElement 
                        || input instanceof HTMLSelectElement
                    )
        ) {
            if (checkIfFilled(converterInputs)) {
                convertTime();
            } else {
                result.forEach(p => p.textContent = '');
            }
        }
    })
}

// Check if all are filled, then automatically display the result
function checkIfFilled (inputs: (HTMLInputElement | HTMLSelectElement)[]): boolean {
    let everythingFilled: boolean = true;
    inputs.forEach(input => {
        if (input.value === '' || input.value === 'Timezone') {
             everythingFilled = false;
        } 
    })
    return everythingFilled;
}

    

function convertTime (): void {
    if (convertFromTimezone instanceof HTMLSelectElement
        && convertToTimezone instanceof HTMLSelectElement 
        && convertFromDate instanceof HTMLInputElement 
        && convertFromTime instanceof HTMLInputElement 

    ) {

        let convertedDateTimeNZone = Temporal.ZonedDateTime.from({
            year: Number(convertFromDate.value.split('-')[0]),
            month: Number(convertFromDate.value.split('-')[1]),
            day: Number(convertFromDate.value.split('-')[2]),
            hour: Number(convertFromTime.value.split(':')[0]),
            minute: Number(convertFromTime.value.split(':')[1]),
            timeZone: convertFromTimezone.value
        }).withTimeZone(convertToTimezone.value);
        
        convertedDate.textContent =`${String(convertedDateTimeNZone.day).padStart(2, '0')}-${String(convertedDateTimeNZone.month).padStart(2, '0')}-${String(convertedDateTimeNZone.year).padStart(2, '0')}`;
        
        convertedTime.textContent = `${String(convertedDateTimeNZone.hour).padStart(2, '0')}:${String(convertedDateTimeNZone.minute).padStart(2, '0')}:${String(convertedDateTimeNZone.second).padStart(2, '0')}`;
        
        convertedTimezone.textContent = `${convertedDateTimeNZone.timeZoneId}`;
    }
}






// ======== Footer ========

const footerDate = document.getElementById('footerDate');
const footerYear: number =  new Date().getFullYear();
if (footerDate) {
    footerDate.textContent = `${footerYear}`;
}













loadLocations() // get saved locations from local storage
load12hour() // recover from local storage am / pm
renderSavedLocations()
getTime() // start local clock
loadZones(); // fetch once in the load page