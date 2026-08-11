// @ts-ignore: side-effect import of SCSS file without type declarations
import './styles/main.scss';
import { initSettings } from './ts/settings';
import { initGame } from './ts/game';

init();
initSettings();
// Checke anhand der URL oder an vorhandenen IDs, wo wir uns befinden
if (document.getElementById("settings-form")) {
    initSettings();
} else if (document.getElementById("game-grid")) {
    initGame();
}

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