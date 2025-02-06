document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice10_${studentName}`;

    // Images disponibles dans le tableau
    const images = [
        { id: "image1", src: "images2/im1.jpeg" },
        { id: "image2", src: "images2/im2.jpeg" },
        { id: "image3", src: "images2/im3.jpeg" },
        { id: "image4", src: "images2/im4.jpeg" },
        { id: "image5", src: "images2/im5.jpeg" },
        { id: "image6", src: "images2/im6.jpeg" },
        { id: "image7", src: "images2/im7.jpeg" },
        { id: "image8", src: "images2/im8.jpeg" },
        { id: "image9", src: "images2/im9.jpeg" },
        { id: "image10", src: "images2/im10.jpeg" },
        { id: "image11", src: "images2/im11.jpeg" },
        { id: "image12", src: "images2/im12.jpeg" }
    ];

    const container = document.getElementById("imageTable");
    const imageContainer = document.getElementById("imageContainer");
    const confirmButton = document.getElementById("confirmSelectionButton");

    // Bouton discret pour afficher le tableau
    const showTableButton = document.createElement("button");
    showTableButton.textContent = "Sélectionner des images";
    showTableButton.style.position = "fixed";
    showTableButton.style.top = "10px";
    showTableButton.style.right = "10px";
    showTableButton.style.backgroundColor = "#007bff";
    showTableButton.style.color = "white";
    showTableButton.style.border = "none";
    showTableButton.style.padding = "8px 12px";
    showTableButton.style.borderRadius = "5px";
    showTableButton.style.cursor = "pointer";
    document.body.appendChild(showTableButton);

    showTableButton.addEventListener("click", function () {
        container.style.display = "grid";
        confirmButton.style.display = "block";
    });

    // Charger les images préalablement sélectionnées
    const savedSelection = await loadState(storageKey);
    if (savedSelection && savedSelection.length) {
        displaySelectedImages(savedSelection);
    } else {
        container.style.display = "none";
        confirmButton.style.display = "none";
        displayImageTable(images);
    }

    // Affiche le tableau des images
    function displayImageTable(images) {
        images.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.id = image.id;
            imgElement.style.width = "100px";
            imgElement.style.height = "100px";
            imgElement.style.margin = "10px";
            imgElement.style.cursor = "pointer";
            imgElement.addEventListener("click", function () {
                imgElement.classList.toggle("selected");
            });
            container.appendChild(imgElement);
        });

        confirmButton.addEventListener("click", function () {
            const selectedImages = Array.from(document.querySelectorAll(".selected"))
                .map(img => ({ id: img.id, src: img.src }));

            saveState(storageKey, selectedImages);
            container.style.display = "none";
            confirmButton.style.display = "none";
            displaySelectedImages(selectedImages);
        });
    }

    // Affiche les images sélectionnées
    function displaySelectedImages(selectedImages) {
        selectedImages.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.style.width = "100px";
            imgElement.style.height = "100px";
            imgElement.style.margin = "10px";
            imgElement.style.objectFit = "contain";
            imageContainer.appendChild(imgElement);
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
