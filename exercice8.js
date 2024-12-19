// Ouvre ou crée la base de données
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("exercicesDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("exercices")) {
                db.createObjectStore("exercices");
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Erreur d'ouverture de la base de données IndexedDB.");
        };
    });
}

// Sauvegarde des données dans IndexedDB
function saveState(key, data) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("exercices", "readwrite");
            const store = transaction.objectStore("exercices");
            const request = store.put(data, key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject("Erreur lors de l'enregistrement des données.");
        });
    });
}

// Chargement des données depuis IndexedDB
function loadState(key) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("exercices", "readonly");
            const store = transaction.objectStore("exercices");
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result || {});
            request.onerror = () => reject("Erreur lors du chargement des données.");
        });
    });
}

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

                // Gestion du clic : Affiche les pastilles de couleur
                cell.addEventListener("click", () => {
                    showColorPicker(cell, savedColors, cellKey, storageKey);
                });

                row.appendChild(cell);
            });

            table.appendChild(row);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
        });
    }

    function showColorPicker(cell, savedColors, cellKey, storageKey) {
        // Supprime un éventuel color picker existant
        const existingPicker = document.getElementById("colorPicker");
        if (existingPicker) existingPicker.remove();

        // Crée le conteneur des pastilles
        const picker = document.createElement("div");
        picker.id = "colorPicker";
        picker.style.position = "absolute";
        picker.style.top = `${cell.getBoundingClientRect().bottom + window.scrollY}px`;
        picker.style.left = `${cell.getBoundingClientRect().left + window.scrollX}px`;
        picker.style.display = "flex";
        picker.style.gap = "10px";
        picker.style.padding = "10px";
        picker.style.background = "#fff";
        picker.style.border = "1px solid #ccc";
        picker.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
        picker.style.zIndex = "1000";

        // Ajoute les trois pastilles de couleur
        const colors = { bleu: "#d6eaff", vert: "#d4edda", jaune: "#fffacc" };

        Object.keys(colors).forEach((colorName) => {
            const colorCircle = document.createElement("div");
            colorCircle.style.width = "30px";
            colorCircle.style.height = "30px";
            colorCircle.style.borderRadius = "50%";
            colorCircle.style.backgroundColor = colors[colorName];
            colorCircle.style.cursor = "pointer";

            // Applique la couleur au clic
            colorCircle.addEventListener("click", () => {
                cell.style.backgroundColor = colors[colorName];
                savedColors[cellKey] = colors[colorName];
                saveState(`${storageKey}_${studentName}`, savedColors);
                picker.remove();
            });

            picker.appendChild(colorCircle);
        });

        // Ajoute une option pour réinitialiser la couleur
        const resetButton = document.createElement("div");
        resetButton.textContent = "×";
        resetButton.style.width = "30px";
        resetButton.style.height = "30px";
        resetButton.style.display = "flex";
        resetButton.style.alignItems = "center";
        resetButton.style.justifyContent = "center";
        resetButton.style.border = "1px solid #ccc";
        resetButton.style.borderRadius = "50%";
        resetButton.style.cursor = "pointer";
        resetButton.style.fontSize = "20px";
        resetButton.style.color = "#000";

        resetButton.addEventListener("click", () => {
            cell.style.backgroundColor = "#fff";
            delete savedColors[cellKey];
            saveState(`${storageKey}_${studentName}`, savedColors);
            picker.remove();
        });

        picker.appendChild(resetButton);

        document.body.appendChild(picker);

        // Supprime le color picker au clic en dehors
        document.addEventListener(
            "click",
            function closePicker(event) {
                if (!picker.contains(event.target) && event.target !== cell) {
                    picker.remove();
                    document.removeEventListener("click", closePicker);
                }
            },
            { once: true }
        );
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
