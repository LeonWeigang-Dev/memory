/**
 * Initializes the event listeners for the settings form.
 */
export function initSettings(): void {
    const form = document.getElementById("settings-form") as HTMLFormElement | null;
    const btn = document.getElementById("start-btn") as HTMLButtonElement | null;
    const preview = document.getElementById("theme-preview-img") as HTMLImageElement | null;

    if (!form || !btn || !preview) return;

    form.addEventListener("change", () => handleFormChange(form, btn, preview));
    form.addEventListener("submit", (e: Event) => handleFormSubmit(e, form));

    setupThemeHover(form, preview);
    loadSavedSettings(form);
}

/**
 * Handles changes in the form and updates preview and button status.
 *
 * @param form - The settings form element.
 * @param btn - The start button.
 * @param preview - The preview image element for the theme.
 */
function handleFormChange(form: HTMLFormElement, btn: HTMLButtonElement, preview: HTMLImageElement): void {
    const data = new FormData(form);
    const [theme, player, size] = [data.get("theme"), data.get("player"), data.get("boardSize")];

    if (theme) preview.src = `../imgs/preview-${theme}.png`;
    if (theme) updateSummaryText("theme", form);
    if (player) updateSummaryText("player", form);
    if (size) updateSummaryText("boardSize", form);

    btn.disabled = !(theme && player && size);
}

/**
 * Saves the form data in LocalStorage and redirects to the game.
 *
 * @param e - The event on form submission.
 * @param form - The settings form element.
 */
function handleFormSubmit(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    const settings = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("memoryGameSettings", JSON.stringify(settings));
    window.location.href = "./game.html";
}

/**
 * Updates the summary text of a selected form field.
 *
 * @param inputName - Name of the form field (e.g., "theme", "player", "boardSize").
 * @param form - The settings form element.
 */
function updateSummaryText(inputName: string, form: HTMLFormElement): void {
    const input = form.querySelector(`input[name="${inputName}"]:checked`) as HTMLInputElement | null;
    if (!input) return;

    const label = document.querySelector(`label[for="${input.id}"]`);
    const summaryId = inputName === "boardSize" ? "summary-size" : `summary-${inputName}`;
    const summarySpan = document.getElementById(summaryId);

    if (label && summarySpan) summarySpan.textContent = label.textContent;
}

/**
 * Sets up the hover effects for the theme preview.
 *
 * @param form - The settings form element.
 * @param preview - The preview image element for the theme.
 */
function setupThemeHover(form: HTMLFormElement, preview: HTMLImageElement): void {
    const inputs = form.querySelectorAll('input[name="theme"]') as NodeListOf<HTMLInputElement>;

    inputs.forEach(input => {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (!label) return;

        label.addEventListener("mouseenter", () => preview.src = `../imgs/preview-${input.value}.png`);
        label.addEventListener("mouseleave", () => {
            const checked = form.querySelector('input[name="theme"]:checked') as HTMLInputElement;
            if (checked) preview.src = `../imgs/preview-${checked.value}.png`;
        });
    });
}

/**
 * Loads saved settings from local storage and pre-selects form values.
 * 
 * @param form - The settings HTML form element.
 */
function loadSavedSettings(form: HTMLFormElement): void {
    const saved = localStorage.getItem("memoryGameSettings");
    if (!saved) return;

    const settings = JSON.parse(saved);
    Object.entries(settings).forEach(([key, value]) => {
        const input = form.querySelector(`input[name="${key}"][value="${value}"]`);
        if (input) (input as HTMLInputElement).checked = true;
    });

    form.dispatchEvent(new Event("change"));
}