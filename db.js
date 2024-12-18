// Ouvre ou crée la base de données IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ExerciceDB", 1);

        // Création de la structure à la première ouverture
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("states")) {
                db.createObjectStore("states", { keyPath: "key" }); // Clé unique
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

// Sauvegarde d'un état dans la base de données
async function saveState(key, value) {
    const db = await openDB();
    const tx = db.transaction("states", "readwrite");
    const store = tx.objectStore("states");
    store.put({ key, value });
    return tx.complete;
}

// Chargement d'un état depuis la base de données
async function loadState(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction("states", "readonly");
        const store = tx.objectStore("states");
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result ? request.result.value : null);
        request.onerror = (event) => reject(event.target.error);
    });
}
