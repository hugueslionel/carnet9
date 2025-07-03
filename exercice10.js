document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM chargé pour exercice10");
    
    try {
        // 1. Vérifier le container
        const container = document.getElementById("exercise10-container");
        console.log("Container trouvé:", container);
        
        if (!container) {
            console.error("Le container exercise10-container n'existe pas!");
            return;
        }

        // 2. Vérifier les fonctions db.js
        if (typeof loadState !== 'function') {
            console.error("La fonction loadState n'est pas disponible");
            return;
        }
        
        if (typeof saveState !== 'function') {
            console.error("La fonction saveState n'est pas disponible");
            return;
        }

        console.log("Fonctions db.js disponibles");

        // 3. Obtenir le nom de l'étudiant
        const studentName = new URLSearchParams(window.location.search).get("name");
        console.log("Nom de l'étudiant:", studentName);
        
        const storageKey = `exercice10_${studentName}`;
        console.log("Clé de stockage:", storageKey);

        const initialPositions = [
            { id: "seq1", src: "images6/seq1.jpeg", row: null, col: null },
            { id: "seq2", src: "images6/seq2.jpeg", row: null, col: null },
            { id: "seq3", src: "images6/seq3.jpeg", row: null, col: null },
            { id: "seq4", src: "images6/seq4.jpeg", row: null, col: null },
            { id: "seq5", src: "images6/seq5.jpeg", row: null, col: null },
            { id: "seq6", src: "images6/seq6.jpeg", row: null, col: null }
        ];

        console.log("Positions initiales:", initialPositions);

        // 4. Charger les positions sauvegardées
        let savedPositions = [];
        try {
            console.log("Tentative de chargement des données...");
            savedPositions = await loadState(storageKey);
            console.log("Données chargées:", savedPositions);
            
            if (!savedPositions) {
                console.log("Aucune donnée sauvegardée, utilisation des positions initiales");
                savedPositions = [];
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données:", error);
            savedPositions = [];
        }
        
        const positions = savedPositions.length ? savedPositions : initialPositions;
        console.log("Positions finales utilisées:", positions);

        // 5. Créer le bandeau des images
        console.log("Création du bandeau des images...");
        const imageBand = document.createElement("div");
        imageBand.id = "image-band";
        imageBand.style.display = "flex";
        imageBand.style.flexWrap = "wrap";
        imageBand.style.justifyContent = "center";
        imageBand.style.gap = "20px";
        imageBand.style.marginBottom = "40px";
        imageBand.style.backgroundColor = "#f0f0f0"; // Pour debug
        imageBand.style.minHeight = "100px"; // Pour debug

        // 6. Créer le tableau de rangement
        console.log("Création du tableau de rangement...");
        const table = document.createElement("table");
        table.id = "storage-table";
        table.style.borderCollapse = "collapse";
        table.style.margin = "auto";

        const tr = document.createElement("tr");
        for (let col = 0; col < 6; col++) {
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

        // 7. Ajouter les éléments au container
        console.log("Ajout des éléments au container...");
        container.appendChild(imageBand);
        container.appendChild(table);

        // 8. Créer et placer les images
        console.log("Création et placement des images...");
        positions.forEach((pos, index) => {
            console.log(`Traitement image ${index}:`, pos);
            
            const img = document.createElement("img");
            img.id = pos.id;
            img.src = pos.src;
            img.style.width = "80px";
            img.style.height = "80px";
            img.style.cursor = "grab";
            img.style.objectFit = "contain";
            img.draggable = true;

            // Gestion des erreurs de chargement d'images
            img.onerror = function() {
                console.error(`Erreur de chargement de l'image: ${pos.src}`);
                // Créer un placeholder en cas d'erreur
                img.style.backgroundColor = "#ff0000";
                img.alt = "Image non trouvée";
            };

            img.onload = function() {
                console.log(`Image chargée avec succès: ${pos.src}`);
            };

            // Ajout des événements de glisser-déposer
            img.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text", event.target.id);
            });

            // Placement dans le tableau ou le bandeau
            if (pos.row === null && pos.col === null) {
                console.log(`Placement de ${pos.id} dans le bandeau`);
                imageBand.appendChild(img);
            } else {
                console.log(`Placement de ${pos.id} dans le tableau [${pos.row}, ${pos.col}]`);
                const targetCell = table.querySelector(`[data-row='${pos.row}'][data-col='${pos.col}']`);
                if (targetCell) {
                    targetCell.appendChild(img);
                } else {
                    console.error(`Cellule cible non trouvée pour ${pos.id}`);
                    imageBand.appendChild(img);
                }
            }
        });

        // 9. Fonction de mise à jour des positions
        async function updatePositions(imgId, row, col) {
            console.log(`Mise à jour position: ${imgId} -> [${row}, ${col}]`);
            const index = positions.findIndex((pos) => pos.id === imgId);
            if (index !== -1) {
                positions[index].row = row;
                positions[index].col = col;
                try {
                    await saveState(storageKey, positions);
                    console.log("Sauvegarde réussie");
                } catch (error) {
                    console.error("Erreur lors de la sauvegarde:", error);
                }
            }
        }

        console.log("Exercice 10 initialisé avec succès!");

    } catch (error) {
        console.error("Erreur globale dans exercice10:", error);
    }
});

// Ajouter des styles CSS pour l'impression
const exercice10Style = document.createElement("style");
exercice10Style.textContent = `
    @media print {
        * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
       
        #storage-table {
            display: table !important;
            margin: 20px auto !important;
            page-break-before: avoid;
            border-collapse: collapse !important;
        }
    
        #storage-table tr {
            display: table-row !important;
        }
    
        #storage-table td {
            display: table-cell !important;
            width: 190px !important;
            height: 190px !important;
            border: 2px solid #000 !important;
            min-width: 190px !important;
            min-height: 190px !important;
        }
        
        #storage-table td img {
            width: 170px !important;
            height: 170px !important;
            max-width: 170px !important;
            max-height: 170px !important;
        }
    }
`;

document.head.appendChild(exercice10Style);
