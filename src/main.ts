
import { initSettings } from './ts/settings';
import { initGame } from './ts/game';

init();
initSettings();
if (document.getElementById("settings-form")) {
    initSettings();
} else if (document.getElementById("game-grid")) {
    initGame();
}

/**
 * Initializes the event listeners for the game.
 */
function init() {
    const fieldRef = document.getElementById("field");
    if (fieldRef) {
        fieldRef.addEventListener("click", e => {
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement
            if (card) {
                card.classList.toggle("is-flipped")
            }
        })
    }
};