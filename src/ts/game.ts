/**
 * Interface für die gespeicherten Spieleinstellungen.
 */
export interface GameSettings {
    theme: string;
    player: string;
    boardSize: string;
}

/**
 * Initialisiert die Spiel-Seite, lädt Settings, setzt das Theme und baut das Grid auf.
 */
export function initGame(): void {
    const grid = document.getElementById("game-grid");
    if (!grid) return;

    const settings = loadSettings();
    if (!settings) return redirectToMenu();

    applyTheme(settings);
    buildGrid(grid, parseInt(settings.boardSize));
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
    window.location.href = "./settings.html";
}

/**
 * Wendet das ausgewählte Theme als CSS-Klasse auf den Body an.
 * @param settings - Die aktuellen Spieleinstellungen.
 */
function applyTheme(settings: GameSettings): void {
    const body = document.body;
    body.classList.remove("theme-code-vibes", "theme-foods");

    // Mappt den Wert aus dem Radio-Button auf die SCSS-Klasse
    const themeClass = settings.theme === "foods" ? "theme-foods" : "theme-code-vibes";
    body.classList.add(themeClass);
}

/**
 * Baut das Spielfeld auf Basis der gewählten Kartenzahl auf.
 * @param gridElement - Das HTML Container-Element für das Grid.
 * @param size - Die Anzahl der Karten (16, 24 oder 36).
 */
function buildGrid(gridElement: HTMLElement, size: number): void {
    gridElement.className = `game__grid game__grid--${size}`;
    gridElement.innerHTML = "";

    appendCardsToGrid(gridElement, size);
}

/**
 * Generiert die Karten-Elemente und fügt sie in das Grid ein.
 * @param gridElement - Das HTML Container-Element.
 * @param size - Die Anzahl der zu generierenden Karten.
 */
function appendCardsToGrid(gridElement: HTMLElement, size: number): void {
    for (let i = 0; i < size; i++) {
        const card = document.createElement("div");
        card.classList.add("game__card");
        gridElement.appendChild(card);
    }
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

    showBtn.addEventListener("click", () => openExitDialog(dialog));
    resumeBtn.addEventListener("click", () => closeExitDialog(dialog));
    exitBtn.addEventListener("click", () => redirectToSettings());
}

/**
 * Öffnet den Exit-Dialog als modales Fenster.
 * @param dialog - Das HTMLDialogElement.
 */
function openExitDialog(dialog: HTMLDialogElement): void {
    dialog.showModal();
}

/**
 * Schließt den Exit-Dialog, um zum Spiel zurückzukehren.
 * @param dialog - Das HTMLDialogElement.
 */
function closeExitDialog(dialog: HTMLDialogElement): void {
    dialog.close();
}

/**
 * Leitet den Benutzer zurück zur Settings-Seite ab.
 */
function redirectToSettings(): void {
    window.location.href = "./settings.html";
}