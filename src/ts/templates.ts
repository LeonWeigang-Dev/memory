/**
 * Generates the HTML template string for a single memory game card.
 * 
 * @param backface - The image URL for the back side of the card.
 * @param icon - The image URL for the front side of the card (the matching icon).
 * @returns The complete HTML string representing the inner structure of the card.
 */
export function getCardTemplate(backface: string, icon: string): string {
    return `
        <div class="game__card__inner">
            <!-- Theme-dependent back side -->
            <div class="game__card__face game__card__face--back" style="background-image: url('${backface}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
            
            <!-- Theme-dependent front side (icon) -->
            <div class="game__card__face game__card__face--front">
                <img src="${icon}" alt="Card Icon" class="game__card-img">
            </div>
        </div>
    `;
}