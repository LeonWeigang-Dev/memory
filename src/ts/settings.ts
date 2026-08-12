export function initSettings(): void {
    const form = document.getElementById("settings-form") as HTMLFormElement | null;
    const btn = document.getElementById("start-btn") as HTMLButtonElement | null;
    const previewImg = document.getElementById("theme-preview-img") as HTMLImageElement | null;

    // Wenn wir nicht auf der Settings-Seite sind, brechen wir hier ab
    if (!form || !btn || !previewImg) return;

    // Hört auf jede Änderung (Klick auf einen Radio-Button)
    form.addEventListener("change", () => {
        const formData = new FormData(form);

        // 1. Ausgewählte Werte auslesen
        const theme = formData.get("theme") as string | null;
        const player = formData.get("player") as string | null;
        const size = formData.get("boardSize") as string | null;

        // 2. Vorschau-Bild austauschen
        // WICHTIG: Dein zweites Bild muss im Ordner /public/imgs/ genau "preview-foods.png" heißen!
        if (theme) {
            previewImg.src = `/imgs/preview-${theme}.png`;
        }

        // 3. Texte im Footer updaten
        if (theme) updateSummaryText("theme", form);
        if (player) updateSummaryText("player", form);
        if (size) updateSummaryText("boardSize", form);

        // 4. Start-Button freischalten, wenn alle 3 Kategorien gewählt wurden
        if (theme && player && size) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    });

    // Start-Button Klick (Formular absenden)
    form.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        const formData = new FormData(form);
        const settings = Object.fromEntries(formData.entries());

        // Speichert die Einstellungen im Browser und wechselt die Seite
        localStorage.setItem("memoryGameSettings", JSON.stringify(settings));
        window.location.href = "./game.html";
    });
}

// Hilfsfunktion, um den Text des Labels in den Footer zu kopieren
function updateSummaryText(inputName: string, form: HTMLFormElement): void {
    const checkedInput = form.querySelector(`input[name="${inputName}"]:checked`) as HTMLInputElement | null;
    if (!checkedInput) return;

    const label = document.querySelector(`label[for="${checkedInput.id}"]`);
    // Die ID für BoardSize weicht leicht vom name-Attribut ab
    const summaryId = inputName === "boardSize" ? "summary-size" : `summary-${inputName}`;
    const summarySpan = document.getElementById(summaryId);

    if (label && summarySpan) {
        summarySpan.textContent = label.textContent;
    }
}