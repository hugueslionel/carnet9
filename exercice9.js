document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice9_${studentName}`;

    const initialPositions = [
        { id: "animal1", src: "images/animal1.jpeg", row: null, col: null },
        { id: "animal2", src: "images/animal2.jpeg", row: null, col: null },
        { id: "animal3", src: "images/animal3.jpeg", row: null, col: null },
        { id: "animal4", src: "images/animal4.jpeg", row: null, col: null },
        { id: "animal5", src: "images/animal5.jpeg", row: null, col: null }
    ];

    // Charger les positions sauvegardées ou utiliser les positions initiales
    const savedPositions = await loadState(storageKey);
    const positions = savedPositions.length ? savedPositions : initialPositions;

    const container = document.getElementById("exercise9-container");

    // Bandeau des images
    const imageBand = document.createElement("div");
    imageBand.style.display = "flex";
    imageBand.style.justifyContent = "center";
    imageBand.style.gap = "20px";
    imageBand.style.marginBottom = "40px";

    // Tableau de rangement
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.margin = "auto";

    const tr = document.createElement("tr");
    for (let col = 0; col < 5; col++) {
        const td = document.createElement("td");
        td.style.width = "100px";
        td.style.height = "100px";
        td.style.border = "1px solid #ccc";
        td.style.backgroundColor = "#f9f9f9";
        td.style.position = "relative";
        td.style.textAlign = "center";
        td.style.verticalAlign = "middle";
        td.dataset.row = 0;
        td.dataset.col = col;

        // Permet de déposer les images
        td.addEventListener("dragover", (event) => event.preventDefault());
        td.addEventListener("drop", (event) => {
            event.preventDefault();
            const imgId = event.dataTransfer.getData("text");
            const img = document.getElementById(imgId);
            if (img) {
                td.appendChild(img);
                updatePositions(imgId, 0, col);
            }
        });

        tr.appendChild(td);
    }
    table.appendChild(tr);

    // Ajout du bandeau et du tableau dans le conteneur
    container.appendChild(imageBand);
    container.appendChild(table);

    // Placement des images
    positions.forEach((pos) => {
        const img = document.createElement("img");
        img.id = pos.id;
        img.src = pos.src;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.cursor = "grab";
        img.style.objectFit = "contain";
        img.draggable = true;

        // Ajout des événements de glisser-déposer
        img.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text", event.target.id);
        });

        // Placement dans le tableau ou le bandeau
        if (pos.row === null && pos.col === null) {
            imageBand.appendChild(img); // Si non placé, reste dans le bandeau
        } else {
            const targetCell = table.querySelector(`[data-row='${pos.row}'][data-col='${pos.col}']`);
            if (targetCell) {
                targetCell.appendChild(img);
            }
        }
    });

    // Mise à jour des positions dans IndexedDB
    function updatePositions(imgId, row, col) {
        const index = positions.findIndex((pos) => pos.id === imgId);
        if (index !== -1) {
            positions[index].row = row;
            positions[index].col = col;
            saveState(storageKey, positions); // Sauvegarde immédiate
        }
    }

    // IndexedDB : Sauvegarder les données
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

    // IndexedDB : Charger les données
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

    // IndexedDB : Ouvrir ou créer la base
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
});
