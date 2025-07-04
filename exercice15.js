document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const storageKey = `exercice15_selectedImages_${studentName}`;

    const images = Array.from({ length: 9 }, (_, index) => ({
        id: `image${index + 1}`,
        src: `images1/viv${index + 1}.jpeg`
    }));

    const container = document.getElementById("exercise15");
    container.style.position = "relative";

    const showTableButton = document.createElement("button");
    showTableButton.textContent = "+";
    Object.assign(showTableButton.style, {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "lightgray",
        border: "none",
        position: "absolute",
        top: "2px",
        left: "2px",
        cursor: "pointer"
    });
    container.appendChild(showTableButton);

    const imageContainer = document.createElement("div");
    Object.assign(imageContainer.style, {
        display: "none",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
        marginTop: "10px"
    });
    container.appendChild(imageContainer);

    const savedSelection = await loadState(storageKey);
    if (savedSelection?.length) {
        displaySelectedImages(savedSelection);
    }

    showTableButton.addEventListener("click", function () {
        imageContainer.style.display = "grid";
        loadImages();
    });

    function loadImages() {
        imageContainer.innerHTML = "";
        images.forEach((image) => {
            const imgElement = document.createElement("img");
            Object.assign(imgElement, { src: image.src, id: image.id });
            Object.assign(imgElement.style, {
                width: "150px",
                height: "150px",
                margin: "5px",
                cursor: "pointer",
                objectFit: "contain",
                border: "2px solid transparent"
            });

            loadState(storageKey).then((currentSelection) => {
                const isSelected = currentSelection?.some(img => img.src === image.src);
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
            const wrapper = document.createElement("div");
            wrapper.setAttribute("data-image-src", image.src);
            Object.assign(wrapper.style, {
                position: "relative",
                display: "inline-block",
                margin: "20px"
            });

            const img = document.createElement("img");
            Object.assign(img, { src: image.src });
            Object.assign(img.style, {
                width: "260px",
                height: "auto",
                objectFit: "contain",
                border: "none",
                display: "block"
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "×";
            Object.assign(deleteBtn.style, {
                position: "absolute",
                top: "5px",
                right: "5px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                zIndex: "10"
            });

            deleteBtn.addEventListener("click", function () {
                removeImageFromPage(image.src);
                removeImageFromStorage(image.src);
                updateImageSelection(image.src, false);
            });

            wrapper.appendChild(img);
            wrapper.appendChild(deleteBtn);
            container.appendChild(wrapper);
        }
    }

    function removeImageFromPage(imageSrc) {
        const wrapper = document.querySelector(`div[data-image-src='${imageSrc}']`);
        if (wrapper) wrapper.remove();
    }

    function removeImageFromStorage(imageSrc) {
        loadState(storageKey).then((selection) => {
            const updated = selection.filter(img => img.src !== imageSrc);
            saveState(storageKey, updated);
        });
    }

    function updateImageSelection(imageSrc, isSelected) {
        const img = document.querySelector(`img[src='${imageSrc}']`);
        if (img && img.parentElement === imageContainer) {
            if (isSelected) {
                img.classList.add("selected");
                img.style.border = "2px solid #007bff";
            } else {
                img.classList.remove("selected");
                img.style.border = "2px solid transparent";
            }
        }
    }

    function saveImage(image) {
        loadState(storageKey).then((selection) => {
            const updated = selection || [];
            if (!updated.find(img => img.src === image.src)) {
                updated.push(image);
                saveState(storageKey, updated);
            }
        });
    }

    function displaySelectedImages(images) {
        images.forEach(placeImageOnPage);
    }

    function saveState(key, data) {
        return openDB().then(db =>
            new Promise((resolve, reject) => {
                const tx = db.transaction("exercices", "readwrite");
                const store = tx.objectStore("exercices");
                const request = store.put(data, key);
                request.onsuccess = resolve;
                request.onerror = reject;
            })
        );
    }

    function loadState(key) {
        return openDB().then(db =>
            new Promise((resolve, reject) => {
                const tx = db.transaction("exercices", "readonly");
                const store = tx.objectStore("exercices");
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject([]);
            })
        );
    }

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("exercicesDB", 1);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("exercices")) {
                    db.createObjectStore("exercices");
                }
            };
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = () => reject("Erreur d'ouverture de la base IndexedDB.");
        });
    }
});
