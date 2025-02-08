document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice11_${studentName}`;
    const visibilityKey = `visibility_${studentName}`;

    // Images disponibles dans le tableau
    const images = Array.from({ length: 12 }, (_, index) => ({
        id: `image${index + 1}`,
        src: `images2/im${index + 1}.jpeg`
    }));

    const container = document.getElementById("exercise11");
    const imageContainer = document.createElement("div");

    // Création des boutons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginBottom = "15px";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirmer la sélection";

    const finishButton = document.createElement("button");
    finishButton.textContent = "Terminé";

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(finishButton);
    container.appendChild(buttonContainer);
    container.appendChild(imageContainer);

    imageContainer.style.display = "grid";
    imageContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    imageContainer.style.gap = "15px";

    // Charger les images préalablement sélectionnées
    const savedSelection = await loadState(storageKey);
    if (savedSelection && savedSelection.length) {
        displaySelectedImages(savedSelection);
    }

    // Charger et afficher les images disponibles
    loadImages();

    function loadImages() {
        imageContainer.innerHTML = ""; // Nettoyage du conteneur
        images.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.id = image.id;
            imgElement.style.width = "150px";
            imgElement.style.height = "150px";
            imgElement.style.margin = "10px";
            imgElement.style.cursor = "pointer";
            imgElement.style.objectFit = "contain";
            imgElement.style.border = "2px solid transparent";

            // Marquer les images déjà sélectionnées après rechargement
            if (savedSelection && savedSelection.some(img => img.src === image.src)) {
                imgElement.classList.add("selected");
                imgElement.style.border = "2px solid #007bff";
            }

            imgElement.addEventListener("click", function () {
                imgElement.classList.toggle("selected");
                imgElement.style.border = imgElement.classList.contains("selected")
                    ? "2px solid #007bff"
                    : "2px solid transparent";
            });

            imageContainer.appendChild(imgElement);
        });
    }

    // Confirmation de la sélection
    confirmButton.addEventListener("click", function () {
        const selectedImages = Array.from(document.querySelectorAll(".selected"))
            .map(img => ({ id: img.id, src: img.src }));

        appendSelectedImages(selectedImages);
        saveState(storageKey, selectedImages);
    });

    // Affiche les images sélectionnées sous les boutons
    function appendSelectedImages(selectedImages) {
        selectedImages.forEach((image) => {
            if (!document.querySelector(`img[src='${image.src}']`)) { // Éviter les doublons visuels
                const imgElement = document.createElement("img");
                imgElement.src = image.src;
                imgElement.style.width = "200px";
                imgElement.style.height = "200px";
                imgElement.style.margin = "10px";
                imgElement.style.objectFit = "contain";
                imgElement.style.border = "none";
                container.appendChild(imgElement);
            }
        });
    }

    // Terminer et masquer les boutons
    finishButton.addEventListener("click", function () {
        buttonContainer.style.display = "none";
        imageContainer.style.display = "none";
        saveVisibilityState(false); // Sauvegarde de l'état de visibilité
    });

    // Sauvegarde dans IndexedDB
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

    // Sauvegarder la visibilité de l'interface
    function saveVisibilityState(visible) {
        localStorage.setItem(visibilityKey, JSON.stringify(visible));
    }

    // Restaurer la visibilité de l'interface
    function restoreVisibilityState() {
        const visible = JSON.parse(localStorage.getItem(visibilityKey));
        if (visible === false) {
            buttonContainer.style.display = "none";
            imageContainer.style.display = "none";
        }
    }

    // Chargement depuis IndexedDB
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

    // Ouverture/création de la base IndexedDB
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

    // Restaurer la visibilité au chargement
    restoreVisibilityState();

    // Styles pour l'impression
    const style = document.createElement("style");
    style.textContent = `
        @media print {
            img {
                max-width: 100%;
                page-break-inside: avoid;
                object-fit: contain;
            }
        }
    `;
    document.head.appendChild(style);
});
