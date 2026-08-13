/**
 * Structure for the image assets of a theme (front and back sides).
 */
interface ThemeAssets {
    backface: string;
    icons: string[];
}

/**
 * Collection of all available themes and their associated image paths.
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
 * Interface for saved game settings.
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
 * Initializes the game page, loads settings, sets variables, and starts the game.
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
 * Loads the saved settings from LocalStorage.
 * @returns The settings as an object or null if none were found.
 */
function loadSettings(): GameSettings | null {
    const data = localStorage.getItem("memoryGameSettings");
    return data ? JSON.parse(data) : null;
}

/**
 * Redirects the user to the settings page if no settings are available.
 */
function redirectToMenu(): void {
    window.location.href = "../html/settings.html";
}

/**
 * Initializes global variables such as starting player and target pairs.
 * @param settings - The current game settings.
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
 * Sets the theme and injects the appropriate icons based on the settings.
 * @param settings - The current game settings.
 */
function applyThemeAndIcons(settings: GameSettings): void {
    const body = document.body;
    body.classList.remove("theme-code-vibes", "theme-foods");

    const isFood = settings.theme === "foods";
    body.classList.add(isFood ? "theme-foods" : "theme-code-vibes");

    updateHeaderIcons(isFood);
}

/**
 * Updates the image sources in the header depending on the active theme.
 * @param isFood - True if the Food theme is active.
 */
function updateHeaderIcons(isFood: boolean): void {
    const p1Icon = document.getElementById("player-1-icon") as HTMLImageElement;
    const p2Icon = document.getElementById("player-2-icon") as HTMLImageElement;
    const exitIcon = document.getElementById("exit-icon") as HTMLImageElement;

    if (!p1Icon || !p2Icon || !exitIcon) return;

    p1Icon.src = isFood ? "../icons/food-theme/chess_player-label-blue.png" : "../icons/code-vibes-theme/player-label-blue.png";
    p2Icon.src = isFood ? "../icons/food-theme/chess_player-label-orange.png" : "../icons/code-vibes-theme/player-label-orange.png";
    exitIcon.src = isFood ? "../icons/food-theme/foodTheme-exit-btn.png" : "../icons/code-vibes-theme/codeTheme-exit-btn.png";
    updateCurrentPlayerUI();
}

/**
 * Updates the icon of the currently playing player in the header.
 */
function updateCurrentPlayerUI(): void {
    const currIcon = document.getElementById("current-player-icon") as HTMLImageElement;
    if (!currIcon) return;

    const isFood = currentTheme === "foods";
    currIcon.src = currentPlayer === 1
        ? (isFood ? "../icons/food-theme/chess_player-label-blue.png" : "../icons/code-vibes-theme/player-label-blue.png")
        : (isFood ? "../icons/food-theme/chess_player-label-orange.png" : "../icons/code-vibes-theme/player-label-orange.png");
}

/**
 * Builds the game board based on the selected number of cards.
 * @param gridElement - The HTML container element for the grid.
 * @param size - The number of cards (16, 24, or 36).
 */
function setupBoard(gridElement: HTMLElement, size: number): void {
    gridElement.className = `game__grid game__grid--${size}`;
    gridElement.innerHTML = "";

    const icons = generateCardIcons(size);
    renderCards(gridElement, icons);
}

/**
 * Creates shuffled card pairs from the real theme assets.
 * @param size - The total number of cards on the board.
 * @returns Shuffled array with real image paths.
 */
function generateCardIcons(size: number): string[] {
    const assets = getCurrentThemeAssets();
    const baseIcons = assets.icons.slice(0, size / 2);
    return [...baseIcons, ...baseIcons].sort(() => Math.random() - 0.5);
}

/**
 * Determines the currently used theme based on the active body class.
 * 
 * @returns The asset configuration for the active theme.
 */
function getCurrentThemeAssets(): ThemeAssets {
    const isFoodTheme = document.body.classList.contains("theme-foods");
    return isFoodTheme ? themeAssets.foods : themeAssets.codeVibes;
}

import { getCardTemplate } from './templates';

/**
 * Dynamically renders the memory game board into the provided grid element.
 * 
 * @param grid - The HTML element that represents the card grid.
 * @param icons - An array of image paths to be used as card front sides.
 */
function renderCards(grid: HTMLElement, icons: string[]): void {
    grid.innerHTML = "";
    const assets = getCurrentThemeAssets();

    icons.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("game__card");
        card.dataset.icon = icon;

        card.innerHTML = getCardTemplate(assets.backface, icon);

        card.addEventListener("click", () => handleCardClick(card));
        grid.appendChild(card);
    });
}

/**
 * Handles the click on a single card.
 * @param card - The clicked card element.
 */
function handleCardClick(card: HTMLElement): void {
    if (isChecking || card.classList.contains("is-flipped") || card.classList.contains("matched")) return;

    flipCard(card);
    trackFlippedCard(card);
}

/**
 * Flips a card visually (only adds the class).
 * @param card - The card element to flip.
 */
function flipCard(card: HTMLElement): void {
    card.classList.add("is-flipped");
}

/**
 * Stores the revealed card and checks for pairs when 2 are open.
 * @param card - The currently revealed card element.
 */
function trackFlippedCard(card: HTMLElement): void {
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        isChecking = true;
        checkForMatch();
    }
}

/**
 * Checks if the two revealed cards match.
 */
function checkForMatch(): void {
    const [c1, c2] = flippedCards;
    if (c1.dataset.icon === c2.dataset.icon) handleSuccessfulMatch();
    else handleFailedMatch();
}

/**
 * Processes a found pair (points & win check).
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
 * Processes a failed attempt (flips cards back after a short pause).
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
 * Marks cards as a permanent pair.
 */
function markCardsAsMatched(): void {
    flippedCards.forEach(card => card.classList.add("matched"));
}

/**
 * Resets the turn state.
 */
function resetTurnState(): void {
    flippedCards = [];
    isChecking = false;
}

/**
 * Switches the active player.
 */
function switchPlayer(): void {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayerUI();
}

/**
 * Updates the score table in the UI.
 */
function updateScoreUI(): void {
    const p1 = document.getElementById("p1-points");
    const p2 = document.getElementById("p2-points");
    if (p1) p1.textContent = scores.player1.toString();
    if (p2) p2.textContent = scores.player2.toString();
}

/**
 * Checks if the game is over (all pairs found).
 */
function checkGameOver(): void {
    matchedPairs++;
    if (matchedPairs === totalPairsNeeded) {
        setTimeout(startEndSequence, 500);
    }
}

/**
 * Starts Phase 1: The game over screen with fade-in.
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
 * Switches to Phase 2 after 4 seconds: Winner or draw.
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
    el("winner-icon").src = `../icons/${isFood ? "food-theme" : "code-vibes-theme"}/${icon}`;

    el("btn-home").onclick = () => window.location.href = "../index.html";
    el("end-phase-1").classList.add("hidden");
    el("end-phase-2").classList.remove("hidden");
}

/**
 * Initializes the event listeners for the exit game dialog.
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

document.addEventListener("DOMContentLoaded", initGame);