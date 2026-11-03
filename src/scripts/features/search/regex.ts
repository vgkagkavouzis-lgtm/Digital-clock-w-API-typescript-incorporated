import { secondaryAssistantDisplay } from "../../dom/elements";
import { displayMessageColor } from "../../ui/assistant-messages";

export function checkInputIfOnlyLetters (element: HTMLInputElement): boolean {
    if (!(element instanceof HTMLInputElement)) return;

    const input = element.value.trim().toLowerCase();
    const regexSearch = /^[\p{L}\s'-]+$/u;
    const searchIsValid = regexSearch.test(input);
    const allowedTerms: string[] = ['sector 3', 'sector 6'];
    let checkTheIfIncludedInTheArray: boolean = false;
    function containsTheInput(input: string): boolean {
        allowedTerms.forEach(n => {
            if(n.includes(input)) {
                checkTheIfIncludedInTheArray = true;
            }
        }
    )
    return checkTheIfIncludedInTheArray;
    }

    if (searchIsValid || containsTheInput(input)) {
        element.style.color = '';
        const suggestionsNumber = document.querySelectorAll<HTMLDivElement>('.suggestions').length;
        if (suggestionsNumber > 0) {
            displayMessageColor(secondaryAssistantDisplay, `${suggestionsNumber} locations found`, 'info')
        } else if (suggestionsNumber === 0 && input === ''){
            displayMessageColor(secondaryAssistantDisplay, 'Type a city or country, or pick a time zone', 'info')
        }
        return true;
    } else {
        displayMessageColor(secondaryAssistantDisplay, "Use letters only. Spaces, hyphens, and apostrophes are fine.", 'warning');
        if (document.documentElement.classList.contains('dark-mode')) {
            element.style.color = '#EAC452';
        } else {
            element.style.color = '#8A5A00';
        }
        return false;
    }
}