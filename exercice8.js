document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");

    async function createColorableTables(containerId, data, fonts, storageKey) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Nettoie le conteneur avant d'afficher

        const savedColors = (await loadState(`${storageKey}_${studentName}`)) || {};

        const tableContainer = document.createElement("div");
        tableContainer.style.display = "flex";
        tableContainer.style.justifyContent = "space-around";
        tableContainer.style.gap = "20px";
        tableContainer.style.margin = "20px";

        data.forEach((rowData, tableIndex) => {
            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";

            // Applique la police spécifique
            table.style.fontFamily = fonts[tableIndex];
            table.style.margin = "10px";

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

                // Gestion du clic pour choisir une couleur
                cell.addEventListener("click", () => {
                    const color = prompt(
                        "Choisissez une couleur : 'bleu', 'vert' ou 'jaune'",
                        savedColors[cellKey] || ""
                    );

                    if (color === "bleu") {
                        cell.style.backgroundColor = "#d6eaff"; // Bleu très clair
                        savedColors[cellKey] = "#d6eaff";
                    } else if (color === "vert") {
                        cell.style.backgroundColor = "#d4edda"; // Vert clair
                        savedColors[cellKey] = "#d4edda";
                    } else if (color === "jaune") {
                        cell.style.backgroundColor = "#fffacc"; // Jaune clair
                        savedColors[cellKey] = "#fffacc";
                    } else if (color === "") {
                        cell.style.backgroundColor = "#fff"; // Efface la couleur
                        delete savedColors[cellKey];
                    }

                    saveState(`${storageKey}_${studentName}`, savedColors);
                });

                row.appendChild(cell);
            });

            table.appendChild(row);
            tableContainer.appendChild(table);
        });

        container.appendChild(tableContainer);
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
