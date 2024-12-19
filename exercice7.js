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

    // Fonction pour créer l'exercice des images d'objets
    async function createImageExercise(containerId, images, storageKey) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Nettoie le conteneur avant d'afficher

        const savedStates = (await loadState(`${storageKey}_${studentName}`)) || {};
        const grid = document.createElement("div");
        grid.style.display = "flex";
        grid.style.flexWrap = "wrap";
        grid.style.gap = "40px";
        grid.style.justifyContent = "center";

        images.forEach((imageName, index) => {
            // Conteneur pour chaque image et sa case
            const item = document.createElement("div");
            item.style.textAlign = "center";

            // Création de l'image
            const img = document.createElement("img");
            img.src = `image/${imageName}`; // Chemin des images
            img.alt = `Objet ${index + 1}`;
            img.style.width = "300px";
            img.style.height = "300px";
            img.style.display = "block";
            img.style.margin = "0 auto 10px";

            // Case cliquable
            const box = document.createElement("div");
            box.style.width = "40px";
            box.style.height = "30px";
            box.style.border = "1px solid #ccc";
            box.style.margin = "0 auto";
            box.style.cursor = "pointer";
            box.style.backgroundColor = savedStates[index] ? "#d4edda" : "#fff";

            // Gestion du clic pour changer la couleur
            box.addEventListener("click", () => {
                if (savedStates[index]) {
                    box.style.backgroundColor = "#fff";
                    delete savedStates[index];
                } else {
                    box.style.backgroundColor = "#d4edda";
                    savedStates[index] = true;
                }
                saveState(`${storageKey}_${studentName}`, savedStates);
            });

            
            

            // Ajout de l'image et de la case au conteneur
            item.appendChild(img);
            item.appendChild(box);
            grid.appendChild(item);
        });

        container.appendChild(grid);
    }

    // Liste des images d'objets pour l'exercice 7
    const objects = ["objets1.jpeg", "objets2.jpeg", "objets3.jpeg", "objets4.jpeg", "objets5.jpeg"];

    // Appel de la fonction pour créer l'exercice 7
    createImageExercise("exercice7", objects, "exercice7");
});
