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

    // Création des boutons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";
    buttonContainer.style.marginBottom = "15px";

    const showTableButton = document.createElement("button");
    showTableButton.textContent = "Sélectionner des images";

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirmer la sélection";
    confirmButton.style.display = "none";

    const finishButton = document.createElement("button");
    finishButton.textContent = "Terminé";
    finishButton.style.display = "none";

    buttonContainer.appendChild(showTableButton);
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(finishButton);
    container.appendChild(buttonContainer);
    container.appendChild(imageContainer);

    imageContainer.style.display = "none";
    imageContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    imageContainer.style.gap = "15px";

    // Charger les images préalablement sélectionnées
    const savedSelection = await loadState(storageKey);
    if (savedSelection && savedSelection.length) {
        displaySelectedImages(savedSelection);
    }

    // Afficher le tableau d'images
    showTableButton.addEventListener("click", function () {
        imageContainer.style.display = "grid";
        confirmButton.style.display = "block";
        finishButton.style.display = "block";
        loadImages();
    });

    // Fonction pour charger et afficher les images
    function loadImages() {
        images.forEach((image) => {
            if (!document.getElementById(image.id)) { // Éviter les doublons
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
            }
        });
    }

    // Confirmation de la sélection
    confirmButton.addEventListener("click", function () {
        const selectedImages = Array.from(document.querySelectorAll(".selected"))
            .map(img => ({ id: img.id, src: img.src }));

        saveState(storageKey, selectedImages);
    });

    // Terminer et masquer les boutons
    finishButton.addEventListener("click", function () {
        buttonContainer.style.display = "none";
        imageContainer.style.display = "none";
    });

    // Affiche les images sélectionnées
    function displaySelectedImages(selectedImages) {
        selectedImages.forEach((image) => {
            if (!document.getElementById(image.id)) { // Éviter les doublons
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

