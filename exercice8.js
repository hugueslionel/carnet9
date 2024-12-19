document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");

    async function createColorableTables(containerId, data, fonts, storageKey) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Nettoie le conteneur avant d'afficher

        const savedColors = (await loadState(`${storageKey}_${studentName}`)) || {};

        data.forEach((rowData, tableIndex) => {
            const tableContainer = document.createElement("div");
            tableContainer.style.marginBottom = "20px"; // Espacement vertical entre les tableaux

            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.style.margin = "0 auto";
            table.style.fontFamily = fonts[tableIndex];

            const row = document.createElement("tr");

            rowData.forEach((day, cellIndex) => {
                const cell = document.createElement("td");
                const cellKey = `${tableIndex}_${cellIndex}`;

                // Style des cellules
                cell.style.width = "100px";
                cell.style.height = "50px";
                cell.style.border = "1px solid #ccc";
                cell.style.textAlign = "center";
                cell.style.verticalAlign = "middle";
                cell.style.cursor = "pointer";
                cell.textContent = day;
                cell.style.backgroundColor = savedColors[cellKey] || "#fff";

                // Gestion du clic : Afficher une palette de couleurs
                cell.addEventListener("click", () => {
                    const colorPicker = document.createElement("input");
                    colorPicker.type = "color";
                    colorPicker.style.position = "absolute";
                    colorPicker.style.opacity = "0"; // Invisible
                    document.body.appendChild(colorPicker);

                    // Quand une couleur est choisie
                    colorPicker.addEventListener("input", (event) => {
                        const color = event.target.value;
                        cell.style.backgroundColor = color;
                        savedColors[cellKey] = color;
                        saveState(`${storageKey}_${studentName}`, savedColors);
                        document.body.removeChild(colorPicker); // Supprime le color picker
                    });

                    // Simuler un clic pour ouvrir le sélecteur
                    colorPicker.click();
                });

                row.appendChild(cell);
            });

            table.appendChild(row);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
        });
    }

    // Données des tableaux
    const days = [
        ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"],
        ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
        ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
    ];

    // Polices des tableaux
    const fonts = ["Arial, sans-serif", "'Script Ecole 2', sans-serif", "'Belle Allure GS', sans-serif"];

    createColorableTables("exercice8", days, fonts, "exercice8");
});
