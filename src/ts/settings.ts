/**
 * Initialisiert die Event-Listener für das Einstellungen-Formular.
 */
export function initSettings(): void {
    const form = document.getElementById("settings-form") as HTMLFormElement | null;
    const btn = document.getElementById("start-btn") as HTMLButtonElement | null;
    const preview = document.getElementById("theme-preview-img") as HTMLImageElement | null;

    if (!form || !btn || !preview) return;

    form.addEventListener("change", () => handleFormChange(form, btn, preview));
    form.addEventListener("submit", (e: Event) => handleFormSubmit(e, form));
}

/**
 * Verarbeitet Änderungen im Formular und aktualisiert Vorschau sowie Button-Status.
 *
 * @param form - Das Einstellungen-Formularelement.
 * @param btn - Der Start-Button.
 * @param preview - Das Vorschaubild-Element für das Theme.
 */
function handleFormChange(form: HTMLFormElement, btn: HTMLButtonElement, preview: HTMLImageElement): void {
    const data = new FormData(form);
    const [theme, player, size] = [data.get("theme"), data.get("player"), data.get("boardSize")];

    if (theme) preview.src = `/imgs/preview-${theme}.png`;
    if (theme) updateSummaryText("theme", form);
    if (player) updateSummaryText("player", form);
    if (size) updateSummaryText("boardSize", form);

    btn.disabled = !(theme && player && size);
}

/**
 * Speichert die Formulardaten im LocalStorage und leitet zum Spiel weiter.
 *
 * @param e - Das Event beim Absenden des Formulars.
 * @param form - Das Einstellungen-Formularelement.
 */
function handleFormSubmit(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    const settings = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("memoryGameSettings", JSON.stringify(settings));
    window.location.href = "./game.html";
}

/**
 * Aktualisiert den Übersichtstext eines ausgewählten Formularfelds.
 *
 * @param inputName - Name des Formularfelds (z. B. "theme", "player", "boardSize").
 * @param form - Das Einstellungen-Formularelement.
 */
function updateSummaryText(inputName: string, form: HTMLFormElement): void {
    const input = form.querySelector(`input[name="${inputName}"]:checked`) as HTMLInputElement | null;
    if (!input) return;

    const label = document.querySelector(`label[for="${input.id}"]`);
    const summaryId = inputName === "boardSize" ? "summary-size" : `summary-${inputName}`;
    const summarySpan = document.getElementById(summaryId);

    if (label && summarySpan) summarySpan.textContent = label.textContent;
}