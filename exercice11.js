document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice11_selectedImages_${studentName}`;

    // Images disponibles dans le tableau
    const images = Array.from({ length: 12 }, (_, index) => ({
        id: `image${index + 1}`,
        src: `images2/im${index + 1}.jpeg`
    }));

    const container = document.getElementById("exercise11");
    container.style.position = "relative"; // Position relative pour maintenir les éléments fixes dans la section

    // Bouton pour afficher le tableau d'images
    const showTableButton = document.createElement("button");
    showTableButton.textContent = "+";
    showTableButton.style.width = "30px";
    showTableButton.style.height = "30px";
    showTableButton.style.borderRadius = "50%";
    showTableButton.style.backgroundColor = "lightgray";
    showTableButton.style.border = "none";
    showTableButton.style.position = "absolute";
    showTableButton.style.top = "2px";
    showTableButton.style.left = "2px";
    showTableButton.style.cursor = "pointer";
    container.appendChild(showTableButton);

    const imageContainer = document.createElement("div");
    imageContainer.style.display = "none";
    imageContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    imageContainer.style.gap = "15px";
    imageContainer.style.marginTop = "10px";
    container.appendChild(imageContainer);

    // Charger les images sélectionnées
    const savedSelection = await loadState(storageKey);
    if (savedSelection && savedSelection.length) {
        displaySelectedImages(savedSelection);
    }

    showTableButton.addEventListener("click", function () {
        imageContainer.style.display = "grid";
        loadImages();
    });

    function loadImages() {
        imageContainer.innerHTML = ""; // Nettoyer le conteneur
        images.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.id = image.id;
            imgElement.style.width = "150px";
            imgElement.style.height = "150px";
            imgElement.style.margin = "5px";
            imgElement.style.cursor = "pointer";
            imgElement.style.objectFit = "contain";
            imgElement.style.border = "2px solid transparent";

            // Vérifier si l'image est déjà sélectionnée
            loadState(storageKey).then((currentSelection) => {
                const isSelected = currentSelection && currentSelection.some(img => img.src === image.src);
                if (isSelected) {
                    imgElement.classList.add("selected");
                    imgElement.style.border = "2px solid #007bff";
                }
            });

            imgElement.addEventListener("click", function () {
                imgElement.classList.toggle("selected");
                imgElement.style.border = imgElement.classList.contains("selected")
                    ? "2px solid #007bff"
                    : "2px solid transparent";

                if (imgElement.classList.contains("selected")) {
                    placeImageOnPage({ id: imgElement.id, src: imgElement.src });
                    saveImage({ id: imgElement.id, src: imgElement.src });
                } else {
                    removeImageFromPage(imgElement.src);
                    removeImageFromStorage(imgElement.src);
                }
            });

            imageContainer.appendChild(imgElement);
        });
    }

    function placeImageOnPage(image) {
        if (!document.querySelector(`div[data-image-src='${image.src}']`)) {
            // Créer un conteneur pour l'image et le bouton de suppression
            const imageWrapper = document.createElement("div");
            imageWrapper.style.position = "relative";
            imageWrapper.style.display = "inline-block";
            imageWrapper.style.margin = "20px";
            imageWrapper.setAttribute("data-image-src", image.src);

            const imgElement = document.createElement("img");
            imgElement.src = image.src;
            imgElement.style.width = "260px";
            imgElement.style.height = "auto";
            imgElement.style.objectFit = "contain";
            imgElement.style.border = "none";
            imgElement.style.display = "block";

            // Bouton de suppression
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "×";
            deleteButton.style.position = "absolute";
            deleteButton.style.top = "5px";
            deleteButton.style.right = "5px";
            deleteButton.style.width = "25px";
            deleteButton.style.height = "25px";
            deleteButton.style.borderRadius = "50%";
            deleteButton.style.backgroundColor = "red";
            deleteButton.style.color = "white";
            deleteButton.style.border = "none";
            deleteButton.style.cursor = "pointer";
            deleteButton.style.fontSize = "16px";
            deleteButton.style.fontWeight = "bold";
            deleteButton.style.zIndex = "10";

            deleteButton.addEventListener("click", function () {
                removeImageFromPage(image.src);
                removeImageFromStorage(image.src);
                updateImageSelection(image.src, false);
            });

            imageWrapper.appendChild(imgElement);
            imageWrapper.appendChild(deleteButton);
            container.appendChild(imageWrapper);
        }
    }

    function removeImageFromPage(imageSrc) {
        const imageWrapper = document.querySelector(`div[data-image-src='${imageSrc}']`);
        if (imageWrapper) {
            imageWrapper.remove();
        }
    }

    function removeImageFromStorage(imageSrc) {
        loadState(storageKey).then((currentSelection) => {
            const updatedSelection = currentSelection.filter(img => img.src !== imageSrc);
            saveState(storageKey, updatedSelection);
        });
    }

    function updateImageSelection(imageSrc, isSelected) {
        const imgElement = document.querySelector(`img[src='${imageSrc}']`);
        if (imgElement && imgElement.parentElement === imageContainer) {
            if (isSelected) {
                imgElement.classList.add("selected");
                imgElement.style.border = "2px solid #007bff";
            } else {
                imgElement.classList.remove("selected");
                imgElement.style.border = "2px solid transparent";
            }
        }
    }

    function saveImage(image) {
        loadState(storageKey).then((currentSelection) => {
            const updatedSelection = currentSelection || [];
            if (!updatedSelection.find(img => img.src === image.src)) {
                updatedSelection.push(image);
                saveState(storageKey, updatedSelection);
            }
        });
    }

    // Affiche les images sélectionnées au chargement
    function displaySelectedImages(selectedImages) {
        selectedImages.forEach(placeImageOnPage);
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
});
