import { secondaryAssistantDisplay } from "../../dom/elements";
import { displayMessageColor } from "../../ui/assistant-messages";

export function checkInputIfOnlyLetters (input: string): boolean {
        //Input is already in lowercases
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
            displayMessageColor(secondaryAssistantDisplay, 'Type a city or country, or pick a time zone', 'info')
            return true;
        } else {
            displayMessageColor(secondaryAssistantDisplay, "Use letters only. Spaces, hyphens, and apostrophes are fine.", 'warning');
            return false;
        }
}