document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name") || "invite";
    let selectedColor = null; 

    // Couleurs fixes pour chaque jour (référentiel)
    const dayColors = {
        "LUNDI": "#00BFFF",   // Bleu
        "MARDI": "#33ff5b",   // Vert
        "MERCREDI": "#FFFF00",// Jaune
        "JEUDI": "#FFA500",   // Orange
        "VENDREDI": "#ffcced",// Rose
        "SAMEDI": "#9f53ec",  // Violet
        "DIMANCHE": "#b87200" // Marron
    };

    const colors = Object.values(dayColors);

    function createPalette(container) {
        const paletteWrapper = document.createElement("div");
        paletteWrapper.style.backgroundColor = "white";
        paletteWrapper.style.border = "3px solid #00BFFF"; // Bordure bleue par exemple
        paletteWrapper.style.padding = "20px";
        paletteWrapper.style.borderRadius = "15px";
        paletteWrapper.style.marginBottom = "30px";
        paletteWrapper.style.textAlign = "center";
        paletteWrapper.style.border = "2px solid #ddd";

        const instruction = document.createElement("p");
        instruction.textContent = "Regarde le modèle, puis colorie les écritures pareilles !";
        instruction.style.margin = "0 0 15px 0";
        instruction.style.fontSize = "20px";
        instruction.style.fontWeight = "bold";
        paletteWrapper.appendChild(instruction);

        const colorContainer = document.createElement("div");
        colorContainer.style.display = "flex";
        colorContainer.style.gap = "15px";
        colorContainer.style.justifyContent = "center";
        colorContainer.style.flexWrap = "wrap";

        // Création des boutons à partir de dayColors
        Object.entries(dayColors).forEach(([dayName, hex]) => {
            const btn = document.createElement("div");
            btn.className = "color-tool";
            btn.style.width = "60px";
            btn.style.height = "60px";
            btn.style.borderRadius = "50%";
            btn.style.backgroundColor = hex;
            btn.style.cursor = "pointer";
            btn.style.border = "5px solid white";
            btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            btn.style.transition = "transform 0.2s";
            
            // On peut même ajouter le nom du jour en petit sous le bouton pour l'enseignant
            btn.title = dayName;

            btn.addEventListener("click", () => {
                container.querySelectorAll('.color-tool').forEach(b => {
                    b.style.borderColor = "white";
                    b.style.transform = "scale(1)";
                });
                btn.style.borderColor = "#333";
                btn.style.transform = "scale(1.15)";
                selectedColor = hex;
            });

            colorContainer.appendChild(btn);
        });

        // Gomme
        const eraser = document.createElement("div");
        eraser.className = "color-tool";
        eraser.textContent = "🧽";
        eraser.style.width = "60px";
        eraser.style.height = "60px";
        eraser.style.display = "flex";
        eraser.style.alignItems = "center";
        eraser.style.justifyContent = "center";
        eraser.style.fontSize = "30px";
        eraser.style.backgroundColor = "#fff";
        eraser.style.borderRadius = "50%";
        eraser.style.cursor = "pointer";
        eraser.style.border = "5px solid white";
        eraser.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";

        eraser.addEventListener("click", () => {
            container.querySelectorAll('.color-tool').forEach(b => {
                b.style.borderColor = "white";
                b.style.transform = "scale(1)";
            });
            eraser.style.borderColor = "#333";
            selectedColor = "#fff";
        });

        colorContainer.appendChild(eraser);
        paletteWrapper.appendChild(colorContainer);
        container.appendChild(paletteWrapper);
    }

    async function createColorableTables(containerId, data, fonts, storageKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ""; 
        createPalette(container);

        const savedColors = (await loadState(`${storageKey}_${studentName}`)) || {};

        const tablesWrapper = document.createElement("div");
        tablesWrapper.style.display = "flex";
        tablesWrapper.style.flexDirection = "column";
        tablesWrapper.style.gap = "30px";

        data.forEach((rowData, tableIndex) => {
            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.style.margin = "0 auto";
            table.style.fontFamily = fonts[tableIndex];
            table.style.fontSize = "28px";

            const row = document.createElement("tr");

            rowData.forEach((day, cellIndex) => {
                const cell = document.createElement("td");
                const cellKey = `${tableIndex}_${cellIndex}`;
                
                cell.style.width = "140px";
                cell.style.height = "80px";
                cell.style.border = "2px solid #444";
                cell.style.textAlign = "center";
                cell.style.userSelect = "none";
                cell.textContent = day;

                // --- LOGIQUE DE COULEUR PAR DÉFAUT ---
                // Si c'est le premier tableau (tableIndex === 0), on applique la couleur fixe
                if (tableIndex === 0) {
                    const colorForDay = dayColors[day.toUpperCase()];
                    cell.style.backgroundColor = colorForDay;
                    cell.style.cursor = "default"; // Pas besoin de cliquer sur le modèle
                    cell.style.fontWeight = "bold";
                } else {
                    // Pour les autres tableaux, on charge la sauvegarde ou blanc
                    cell.style.backgroundColor = savedColors[cellKey] || "#fff";
                    cell.style.cursor = "pointer";

                    cell.addEventListener("click", () => {
                        if (selectedColor) {
                            cell.style.backgroundColor = selectedColor;
                            if (selectedColor === "#fff") {
                                delete savedColors[cellKey];
                            } else {
                                savedColors[cellKey] = selectedColor;
                            }
                            saveState(`${storageKey}_${studentName}`, savedColors);
                        }
                    });
                }

                row.appendChild(cell);
            });

            table.appendChild(row);
            tablesWrapper.appendChild(table);
        });

        container.appendChild(tablesWrapper);
    }

    const days = [
        ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"], // Remis dans l'ordre pour le modèle
        ["lundi", "jeudi", "vendredi", "dimanche", "samedi", "mardi", "mercredi"],
        ["mardi", "vendredi", "lundi", "jeudi", "mercredi", "dimanche", "samedi"]
    ];

    const fonts = ["Arial, sans-serif", "'Script Ecole 2', sans-serif", "'Belle Allure GS', sans-serif"];

    createColorableTables("exercice8", days, fonts, "exercice8");
});
