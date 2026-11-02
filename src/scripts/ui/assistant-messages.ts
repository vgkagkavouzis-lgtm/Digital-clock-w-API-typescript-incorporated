import type { MessageType } from '../types/zones.ts'

export function displayMessageColor(element: HTMLParagraphElement, text: string, type: MessageType): void {
    if(checkIfDisplaysDoesNotExist(element)) return;
    element.textContent = text;
    element.dataset.messageType = type; 
}

export function checkIfDisplaysDoesNotExist (element: HTMLParagraphElement): boolean {
        if (!element) {
            console.log(`Output: ${element}, not found`);
            return true
        }
        return false
}