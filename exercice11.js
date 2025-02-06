document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice11_${studentName}`;

    // Images disponibles dans le tableau
    const images = Array.from({ length: 12 }, (_, index) => ({
        id: `image${index + 1}`,
        src: `images2/im${index + 1}.jpeg`
    }));

    const container = document.getElementById("exercise11");
    const imageContainer = document.createElement("div");
    const confirmButton = document.createElement("button");

    // Configuration du bouton de confirmation
    confirmButton.textContent = "Confirmer la sélection";
    confirmButton.style.display = "none";
    confirmButton.style.marginTop = "10px";
    container.appendChild(confirmButton);

    // Bouton attaché à la section
    const showTableButton = document.createElement("button");
    showTableButton.textContent = "Sélectionner des images";
    showTableButton.style.display = "block";
    showTableButton.style.marginBottom = "10px";
    container.appendChild(showTableButton);

    showTableButton.addEventListener("click", function () {
        imageContainer.style.display = "grid";
        confirmButton.style.display = "block";
        loadImages(); // Charger les images dynamiquement
    });

    imageContainer.style.display = "none";
    imageContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    imageContainer.style.gap = "15px";
    container.appendChild(imageContainer);

    // Charger les images préalablement sélectionnées
    const savedSelection = await loadState(storageKey);
    if (savedSelection && savedSelection.length) {
        displaySelectedImages(savedSelection);
    }

    // Fonction pour charger et afficher les images
    function loadImages() {
        imageContainer.innerHTML = ""; // Nettoyer le conteneur
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

            imgElement.addEventListener("click", function () {
                imgElement.classList.toggle("selected");
                imgElement.style.border = imgElement.classList.contains("selected")
                    ? "2px solid #007bff"
                    : "2px solid transparent";
            });

            imageContainer.appendChild(imgElement);
        });
    }

    confirmButton.addEventListener("click", function () {
        const selectedImages = Array.from(document.querySelectorAll(".selected"))
            .map(img => ({ id: img.id, src: img.src }));

        saveState(storageKey, selectedImages);
        imageContainer.style.display = "none";
        confirmButton.style.display = "none";
        showTableButton.style.display = "none";
        displaySelectedImages(selectedImages);
    });

    // Affiche les images sélectionnées
    function displaySelectedImages(selectedImages) {
        container.innerHTML = "";
        selectedImages.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.style.width = "200px";
            imgElement.style.height = "200px";
            imgElement.style.margin = "10px";
            imgElement.style.objectFit = "contain";
            imgElement.style.border = "none";
            container.appendChild(imgElement);
        });
    }

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

