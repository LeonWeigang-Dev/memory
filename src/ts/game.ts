/**
 * Struktur für die Bild-Assets eines Themes (Vorder- und Rückseiten).
 */
interface ThemeAssets {
    backface: string;
    icons: string[];
}

/**
 * Sammlung aller verfügbaren Themes und ihrer zugehörigen Bild-Pfade.
 */
const themeAssets: Record<string, ThemeAssets> = {
    codeVibes: {
        backface: "/icons/code-vibes-theme/codeTheme-card-backface.png",
        icons: [
            "/icons/code-vibes-theme/card-1.png",
            "/icons/code-vibes-theme/card-2.png",
            "/icons/code-vibes-theme/card-3.png",
            "/icons/code-vibes-theme/card-4.png",
            "/icons/code-vibes-theme/card-5.png",
            "/icons/code-vibes-theme/card-6.png",
            "/icons/code-vibes-theme/card-7.png",
            "/icons/code-vibes-theme/card-8.png",
            "/icons/code-vibes-theme/card-9.png",
            "/icons/code-vibes-theme/card-10.png",
            "/icons/code-vibes-theme/card-11.png",
            "/icons/code-vibes-theme/card-12.png",
            "/icons/code-vibes-theme/card-13.png",
            "/icons/code-vibes-theme/card-14.png",
            "/icons/code-vibes-theme/card-15.png",
            "/icons/code-vibes-theme/card-16.png",
            "/icons/code-vibes-theme/card-17.png",
            "/icons/code-vibes-theme/card-18.png"
        ]
    },
    foods: {
        backface: "/icons/food-theme/food-theme-card.png",
        icons: [
            "/icons/food-theme/card-1.png",
            "/icons/food-theme/card-2.png",
            "/icons/food-theme/card-3.png",
            "/icons/food-theme/card-4.png",
            "/icons/food-theme/card-5.png",
            "/icons/food-theme/card-6.png",
            "/icons/food-theme/card-7.png",
            "/icons/food-theme/card-8.png",
            "/icons/food-theme/card-9.png",
            "/icons/food-theme/card-10.png",
            "/icons/food-theme/card-11.png",
            "/icons/food-theme/card-12.png",
            "/icons/food-theme/card-13.png",
            "/icons/food-theme/card-14.png",
            "/icons/food-theme/card-15.png",
            "/icons/food-theme/card-16.png",
            "/icons/food-theme/card-17.png",
            "/icons/food-theme/card-18.png"
        ]
    }
};

/**
 * Interface für die gespeicherten Spieleinstellungen.
 */
export interface GameSettings {
    theme: string;
    player: string;
    boardSize: string;
}

// Globaler State für das Spiel
let currentPlayer = 1;
let scores = { player1: 0, player2: 0 };
let flippedCards: HTMLElement[] = [];
let isChecking = false;
let matchedPairs = 0;
let totalPairsNeeded = 0;
let currentTheme = "code-vibes";

/**
 * Initialisiert die Spiel-Seite, lädt Settings, setzt Variablen und startet das Spiel.
 */
export function initGame(): void {
    const grid = document.getElementById("game-grid");
    if (!grid) return;

    const settings = loadSettings();
    if (!settings) return redirectToMenu();

    initGameVariables(settings);
    applyThemeAndIcons(settings);
    setupBoard(grid, parseInt(settings.boardSize));
    initExitDialog();
}

/**
 * Lädt die gespeicherten Einstellungen aus dem LocalStorage.
 * @returns Die Settings als Objekt oder null, falls keine gefunden wurden.
 */
function loadSettings(): GameSettings | null {
    const data = localStorage.getItem("memoryGameSettings");
    return data ? JSON.parse(data) : null;
}

/**
 * Leitet den Nutzer zur Settings-Seite zurück, falls keine Settings vorhanden sind.
 */
function redirectToMenu(): void {
    window.location.href = "../index.html";
}

/**
 * Initialisiert globale Variablen wie Startspieler und Ziel-Paare.
 * @param settings - Die aktuellen Spieleinstellungen.
 */
function initGameVariables(settings: GameSettings): void {
    const p = settings.player;
    currentPlayer = (p === "player2" || p === "orange" || p === "player-orange" || p === "2") ? 2 : 1;

    scores = { player1: 0, player2: 0 };
    matchedPairs = 0;
    totalPairsNeeded = parseInt(settings.boardSize) / 2;
    currentTheme = settings.theme;
}

/**
 * Setzt das Theme und injiziert die passenden Icons basierend auf den Settings.
 * @param settings - Die aktuellen Spieleinstellungen.
 */
function applyThemeAndIcons(settings: GameSettings): void {
    const body = document.body;
    body.classList.remove("theme-code-vibes", "theme-foods");

    const isFood = settings.theme === "foods";
    body.classList.add(isFood ? "theme-foods" : "theme-code-vibes");

    updateHeaderIcons(isFood);
}

/**
 * Aktualisiert die Bildquellen im Header je nach aktivem Theme.
 * @param isFood - True, falls das Food-Theme aktiv ist.
 */
function updateHeaderIcons(isFood: boolean): void {
    const p1Icon = document.getElementById("player-1-icon") as HTMLImageElement;
    const p2Icon = document.getElementById("player-2-icon") as HTMLImageElement;
    const exitIcon = document.getElementById("exit-icon") as HTMLImageElement;

    if (!p1Icon || !p2Icon || !exitIcon) return;

    p1Icon.src = isFood ? "/public/icons/food-theme/chess_player-label-blue.png" : "/public/icons/code-vibes-theme/player-label-blue.png";
    p2Icon.src = isFood ? "/public/icons/food-theme/chess_player-label-orange.png" : "/public/icons/code-vibes-theme/player-label-orange.png";
    exitIcon.src = isFood ? "/public/icons/food-theme/foodTheme-exit-btn.png" : "/public/icons/code-vibes-theme/codeTheme-exit-btn.png";
    updateCurrentPlayerUI();
}

/**
 * Aktualisiert das Icon des aktuell spielenden Spielers im Header.
 */
function updateCurrentPlayerUI(): void {
    const currIcon = document.getElementById("current-player-icon") as HTMLImageElement;
    if (!currIcon) return;

    const isFood = currentTheme === "foods";
    currIcon.src = currentPlayer === 1
        ? (isFood ? "/public/icons/food-theme/chess_player-label-blue.png" : "/public/icons/code-vibes-theme/player-label-blue.png")
        : (isFood ? "/public/icons/food-theme/chess_player-label-orange.png" : "/public/icons/code-vibes-theme/player-label-orange.png");
}

/**
 * Baut das Spielfeld auf Basis der gewählten Kartenzahl auf.
 * @param gridElement - Das HTML Container-Element für das Grid.
 * @param size - Die Anzahl der Karten (16, 24 oder 36).
 */
function setupBoard(gridElement: HTMLElement, size: number): void {
    gridElement.className = `game__grid game__grid--${size}`;
    gridElement.innerHTML = "";

    const icons = generateCardIcons(size);
    renderCards(gridElement, icons);
}

/**
 * Erstellt gemischte Kartenpaare aus den echten Theme-Assets.
 * @param size - Die Gesamtanzahl der Karten auf dem Feld.
 * @returns Gemischtes Array mit echten Bildpfaden.
 */
function generateCardIcons(size: number): string[] {
    const assets = getCurrentThemeAssets();
    // Nimm nur so viele einzigartige Icons, wie für die Board-Größe benötigt werden (Hälfte der Boardgröße)
    const baseIcons = assets.icons.slice(0, size / 2);
    // Paare bilden und mischen
    return [...baseIcons, ...baseIcons].sort(() => Math.random() - 0.5);
}

/**
 * Ermittelt basierend auf der aktiven Body-Klasse das aktuell verwendete Theme.
 * 
 * @returns Die Asset-Konfiguration für das aktive Theme.
 */
function getCurrentThemeAssets(): ThemeAssets {
    const isFoodTheme = document.body.classList.contains("theme-foods");
    return isFoodTheme ? themeAssets.foods : themeAssets.codeVibes;
}

/**
 * Rendert das Memory-Spielfeld dynamisch in das übergebene Grid-Element.
 * 
 * @param grid - Das HTML-Element, welches das Karten-Grid repräsentiert.
 * @param icons - Ein Array von Bildpfaden, die als Karten-Vorderseiten verwendet werden sollen.
 */
function renderCards(grid: HTMLElement, icons: string[]): void {
    grid.innerHTML = "";
    const assets = getCurrentThemeAssets();

    icons.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("game__card");
        card.dataset.icon = icon;

        card.innerHTML = `
            <div class="game__card__inner">
                <!-- Theme-abhängige Rückseite -->
                <div class="game__card__face game__card__face--back" style="background-image: url('${assets.backface}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>
                
                <!-- Theme-abhängige Vorderseite (Icon) -->
                <div class="game__card__face game__card__face--front">
                    <img src="${icon}" alt="Card Icon" class="game__card-img">
                </div>
            </div>
        `;

        card.addEventListener("click", () => handleCardClick(card));
        grid.appendChild(card);
    });
}

/**
 * Verarbeitet den Klick auf eine einzelne Karte.
 * @param card - Das angeklickte Karten-Element.
 */
function handleCardClick(card: HTMLElement): void {
    // Verhindere Klicks während der Prüfung oder auf bereits aufgedeckte/gelöste Karten
    if (isChecking || card.classList.contains("is-flipped") || card.classList.contains("matched")) return;

    flipCard(card);
    trackFlippedCard(card);
}

/**
 * Dreht eine Karte optisch um (fügt nur die Klasse hinzu).
 * @param card - Das umzudrehende Karten-Element.
 */
function flipCard(card: HTMLElement): void {
    card.classList.add("is-flipped");
    // innerHTML darf hier nicht angerührt werden, da sonst die Bilder gelöscht werden!
}

/**
 * Speichert die aufgedeckte Karte und prüft auf Paare, wenn 2 offen sind.
 * @param card - Das aktuell aufgedeckte Karten-Element.
 */
function trackFlippedCard(card: HTMLElement): void {
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        isChecking = true;
        checkForMatch();
    }
}

/**
 * Überprüft, ob die beiden aufgedeckten Karten übereinstimmen.
 */
function checkForMatch(): void {
    const [c1, c2] = flippedCards;
    if (c1.dataset.icon === c2.dataset.icon) handleSuccessfulMatch();
    else handleFailedMatch();
}

/**
 * Verarbeitet ein gefundenes Paar (Punkte & Siegprüfung).
 */
function handleSuccessfulMatch(): void {
    if (currentPlayer === 1) scores.player1++;
    else scores.player2++;

    updateScoreUI();
    markCardsAsMatched();
    resetTurnState();
    checkGameOver();
}

/**
 * Verarbeitet einen Fehlversuch (Dreht Karten nach kurzer Pause zurück).
 */
function handleFailedMatch(): void {
    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.remove("is-flipped");
        });
        switchPlayer();
        resetTurnState();
    }, 1000);
}

/**
 * Markiert Karten als festes Paar.
 */
function markCardsAsMatched(): void {
    flippedCards.forEach(card => card.classList.add("matched"));
}

/**
 * Setzt den Zug-Status zurück.
 */
function resetTurnState(): void {
    flippedCards = [];
    isChecking = false;
}

/**
 * Wechselt den aktiven Spieler.
 */
function switchPlayer(): void {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayerUI();
}

/**
 * Aktualisiert die Punktetabelle im UI.
 */
function updateScoreUI(): void {
    const p1 = document.getElementById("p1-points");
    const p2 = document.getElementById("p2-points");
    if (p1) p1.textContent = scores.player1.toString();
    if (p2) p2.textContent = scores.player2.toString();
}

/**
 * Prüft, ob das Spiel beendet ist (alle Paare gefunden).
 */
function checkGameOver(): void {
    matchedPairs++;
    if (matchedPairs === totalPairsNeeded) {
        setTimeout(startEndSequence, 500);
    }
}

/**
 * Startet Phase 1: Den Game Over Screen mit Fade-In
 */
function startEndSequence(): void {
    const el = (id: string) => document.getElementById(id) as any;
    if (!el("end-overlay")) return;

    el("final-score-p1").textContent = scores.player1.toString();
    el("final-score-p2").textContent = scores.player2.toString();
    el("end-overlay").classList.remove("hidden");

    setTimeout(() => el("end-overlay").classList.add("is-visible"), 50);
    setTimeout(showWinnerPhase, 4000);
}

/**
 * Wechselt nach 4 Sekunden zu Phase 2: Sieger oder Gleichstand
 */
function showWinnerPhase(): void {
    const el = (id: string) => document.getElementById(id) as any;
    const isFood = currentTheme === "foods", isDraw = scores.player1 === scores.player2, isP1 = scores.player1 > scores.player2;
    const icon = isDraw ? "draw-icon.png" : `${isFood ? "chess_" : ""}win-icon-${isP1 ? "blue" : "orange"}.png`;

    if (isFood) el("end-overlay").classList.add("phase-2-active");
    if (isDraw && !isFood) el("confetti-bg").style.display = "none";

    el("winner-subtitle").textContent = isDraw ? "It's a" : "The winner is";
    el("winner-title").textContent = isDraw ? "DRAW" : (isP1 ? "BLUE PLAYER" : "ORANGE PLAYER");
    el("winner-title").className = `winner-title ${isDraw ? "draw-title" : (isP1 ? "" : "orange-wins")}`;
    el("winner-icon").src = `/public/icons/${isFood ? "food-theme" : "code-vibes-theme"}/${icon}`;

    el("btn-home").onclick = () => window.location.href = "../index.html";
    el("end-phase-1").classList.add("hidden");
    el("end-phase-2").classList.remove("hidden");
}

/**
 * Initialisiert die Event-Listener für den Exit-Game-Dialog.
 */
export function initExitDialog(): void {
    const dialog = document.getElementById("exit-dialog") as HTMLDialogElement | null;
    const showBtn = document.getElementById("btn-show-exit");
    const resumeBtn = document.getElementById("btn-resume");
    const exitBtn = document.getElementById("btn-exit");

    if (!dialog || !showBtn || !resumeBtn || !exitBtn) return;

    showBtn.addEventListener("click", () => dialog.showModal());
    resumeBtn.addEventListener("click", () => dialog.close());
    exitBtn.addEventListener("click", () => redirectToMenu());
}

// Startet das Spiel
document.addEventListener("DOMContentLoaded", initGame);