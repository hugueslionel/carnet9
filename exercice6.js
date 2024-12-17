document.addEventListener("DOMContentLoaded", function () {
    const studentName = new URLSearchParams(window.location.search).get("name");

    // Fonction pour créer l'exercice des images de formes géométriques
    function createImageExercise(containerId, images, storageKey) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Nettoie le conteneur avant d'afficher

        let savedStates = JSON.parse(localStorage.getItem(`${storageKey}_${studentName}`)) || {};

        const grid = document.createElement("div");
        grid.style.display = "flex";
        grid.style.flexWrap = "wrap";
        grid.style.gap = "60px";
        grid.style.justifyContent = "center";

        images.forEach((imageName, index) => {
            // Conteneur pour chaque image et sa case
            const item = document.createElement("div");
            item.style.textAlign = "center";

            // Création de l'image
            const img = document.createElement("img");
            img.src = `image/${imageName}.jpeg`; // Chemin des images
            img.alt = imageName;
            img.style.width = "180px";
            img.style.height = "180px";
            img.style.display = "block";
            img.style.margin = "0 auto 10px";

            // Case cliquable
            const box = document.createElement("div");
            box.style.width = "50px";
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
                saveState();
            });

            function saveState() {
                localStorage.setItem(`${storageKey}_${studentName}`, JSON.stringify(savedStates));
            }

            // Ajout de l'image et de la case au conteneur
            item.appendChild(img);
            item.appendChild(box);
            grid.appendChild(item);
        });

        container.appendChild(grid);
    }

    // Liste des formes géométriques pour l'exercice 6
    const shapes = ["carre", "losange", "triangle", "rectangle", "ovale", "rond"];

    // Appel de la fonction pour créer l'exercice 6
    createImageExercise("exercice6", shapes, "exercice6");
});
