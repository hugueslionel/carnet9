document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice9_${studentName}`;

    // Charger les positions initiales ou sauvegardées
    const initialPositions = [
        { id: "img1", src: "images/objet1.png", row: 0, col: 0 },
        { id: "img2", src: "images/objet2.png", row: 1, col: 2 },
        { id: "img3", src: "images/objet3.png", row: 2, col: 4 }
    ];

    const savedPositions = await loadState(storageKey);
    const positions = savedPositions.length ? savedPositions : initialPositions;

    const tableContainer = document.getElementById("exercice9");

    // Crée un tableau de 5x5
    const rows = 5;
    const cols = 5;
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.margin = "20px auto";

    // Création des cellules
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            const td = document.createElement("td");
            td.style.width = "100px";
            td.style.height = "100px";
            td.style.border = "1px solid #ccc";
            td.style.position = "relative";
            td.dataset.row = i;
            td.dataset.col = j;

            // Permet de déposer des images
            td.addEventListener("dragover", (event) => event.preventDefault());
            td.addEventListener("drop", (event) => {
                event.preventDefault();
                const imgId = event.dataTransfer.getData("text");
                const img = document.getElementById(imgId);
                if (img) {
                    td.appendChild(img);
                    updatePositions(imgId, i, j);
                }
            });

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableContainer.appendChild(table);

    // Ajouter les images aux bonnes positions
    positions.forEach((pos) => {
        const img = document.createElement("img");
        img.id = pos.id;
        img.src = pos.src;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.cursor = "grab";
        img.draggable = true;

        // Gestion du drag
        img.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text", event.target.id);
        });

        const targetCell = table.querySelector(`[data-row='${pos.row}'][data-col='${pos.col}']`);
        if (targetCell) {
            targetCell.appendChild(img);
        }
    });

    // Mise à jour des positions et sauvegarde
    function updatePositions(imgId, row, col) {
        const index = positions.findIndex((pos) => pos.id === imgId);
        if (index !== -1) {
            positions[index].row = row;
            positions[index].col = col;
            saveState(storageKey, positions);
        }
    }

    // IndexedDB Helper Functions
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("exercicesDB", 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("exercices")) {
                    db.createObjectStore("exercices");
                }
            };
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject("Erreur d'ouverture de la base IndexedDB.");
        });
    }

    function saveState(key, data) {
        return openDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction("exercices", "readwrite");
                const store = transaction.objectStore("exercices");
                const request = store.put(data, key);

                request.onsuccess = resolve;
                request.onerror = reject;
            });
        });
    }

    function loadState(key) {
        return openDB().then((db) => {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction("exercices", "readonly");
                const store = transaction.objectStore("exercices");
                const request = store.get(key);

                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject([]);
            });
        });
    }
});
