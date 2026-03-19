document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name") || "invite";
    let selectedColor = null; // Stocke la couleur active (mode pot de peinture)

    // Configuration des couleurs (adaptées aux standards de la maternelle)
    const colors = {
        "bleu": "#00BFFF",
        "vert": "#33ff5b",
        "jaune": "#FFFF00",
        "orange": "#FFA500",
        "rose": "#ffcced",
        "violet": "#9f53ec",
        "marron": "#b87200"
    };

    /**
     * CRÉATION DE LA PALETTE FIXE (EN HAUT)
     */
    function createPalette() {
        const header = document.createElement("div");
        header.style.position = "sticky";
        header.style.top = "0";
        header.style.backgroundColor = "#f8f9fa";
        header.style.padding = "15px";
        header.style.display = "flex";
        header.style.flexDirection = "column";
        header.style.alignItems = "center";
        header.style.gap = "10px";
        header.style.borderBottom = "2px solid #ccc";
        header.style.zIndex = "1000";
        header.style.marginBottom = "30px";

        const title = document.createElement("div");
        title.textContent = "Choisis une couleur, puis clique sur les jours :";
        title.style.fontWeight = "bold";
        title.style.fontSize = "18px";
        header.appendChild(title);

        const colorContainer = document.createElement("div");
        colorContainer.style.display = "flex";
        colorContainer.style.gap = "15px";
        colorContainer.style.flexWrap = "wrap";
        colorContainer.style.justifyContent = "center";

        // Création des boutons de couleur
        Object.entries(colors).forEach(([name, hex]) => {
            const btn = document.createElement("div");
            btn.style.width = "60px";
            btn.style.height = "60px";
            btn.style.borderRadius = "50%";
            btn.style.backgroundColor = hex;
            btn.style.cursor = "pointer";
            btn.style.border = "4px solid transparent";
            btn.style.transition = "transform 0.2s";
            btn.title = name;

            btn.addEventListener("click", () => {
                // Gestion de la sélection visuelle
                document.querySelectorAll('.palette-btn').forEach(b => b.style.borderColor = "transparent");
                btn.style.borderColor = "#333";
                btn.style.transform = "scale(1.1)";
                selectedColor = hex;
            });
            btn.classList.add('palette-btn');
            colorContainer.appendChild(btn);
        });

        // Bouton GOMME
        const eraser = document.createElement("div");
        eraser.textContent = "🧽"; // Emoji gomme plus parlant
        eraser.style.width = "60px";
        eraser.style.height = "60px";
        eraser.style.display = "flex";
        eraser.style.alignItems = "center";
        eraser.style.justifyContent = "center";
        eraser.style.fontSize = "30px";
        eraser.style.backgroundColor = "#fff";
        eraser.style.border = "2px dashed #ccc";
        eraser.style.borderRadius = "50%";
        eraser.style.cursor = "pointer";
        eraser.classList.add('palette-btn');
        
        eraser.addEventListener("click", () => {
            document.querySelectorAll('.palette-btn').forEach(b => b.style.borderColor = "transparent");
            eraser.style.borderColor = "#333";
            selectedColor = "#fff"; // La gomme peint en blanc
        });

        colorContainer.appendChild(eraser);
        header.appendChild(colorContainer);
        document.body.prepend(header);
    }

    /**
     * CRÉATION DES TABLEAUX
     */
    async function createColorableTables(containerId, data, fonts, storageKey) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; 

        const savedColors = (await loadState(`${storageKey}_${studentName}`)) || {};

        data.forEach((rowData, tableIndex) => {
            const tableContainer = document.createElement("div");
            tableContainer.style.marginBottom = "40px";

            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.style.margin = "0 auto";
            table.style.fontFamily = fonts[tableIndex];
            table.style.fontSize = "32px"; // Plus grand pour la lisibilité

            const row = document.createElement("tr");

            rowData.forEach((day, cellIndex) => {
                const cell = document.createElement("td");
                const cellKey = `${tableIndex}_${cellIndex}`;

                cell.style.width = "160px";
                cell.style.height = "90px";
                cell.style.border = "2px solid #000";
                cell.style.textAlign = "center";
                cell.style.cursor = "pointer";
                cell.style.userSelect = "none";
                cell.textContent = day;
                cell.style.backgroundColor = savedColors[cellKey] || "#fff";

                // Action de coloriage simplifié
                cell.addEventListener("click", () => {
                    if (selectedColor) {
                        cell.style.backgroundColor = selectedColor;
                        if (selectedColor === "#fff") {
                            delete savedColors[cellKey];
                        } else {
                            savedColors[cellKey] = selectedColor;
                        }
                        saveState(`${storageKey}_${studentName}`, savedColors);
                    } else {
                        alert("Choisis d'abord une couleur en haut !");
                    }
                });

                // Effet de survol pour aider l'enfant
                cell.addEventListener("mouseenter", () => {
                    cell.style.filter = "brightness(0.9)";
                });
                cell.addEventListener("mouseleave", () => {
                    cell.style.filter = "none";
                });

                row.appendChild(cell);
            });

            table.appendChild(row);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
        });
    }

    const days = [
        ["JEUDI", "LUNDI", "DIMANCHE", "MARDI", "MERCREDI", "SAMEDI", "VENDREDI"],
        ["lundi", "jeudi", "vendredi", "dimanche", "samedi", "mardi", "mercredi"],
        ["mardi", "vendredi", "lundi", "jeudi", "mercredi", "dimanche", "samedi"]
    ];

    const fonts = ["Arial, sans-serif", "'Script Ecole 2', sans-serif", "'Belle Allure GS', sans-serif"];

    createPalette();
    createColorableTables("exercice8", days, fonts, "exercice8");
});
