document.addEventListener("DOMContentLoaded", function () {
    const alphabetUpper = ["B", "A", "C", "D", "F", "E", "H", "G", "I", "J", "L", "K", "M", 
                           "O", "N", "Q", "P", "S", "R", "T", "U", "V", "W", "X", "Y", "Z"];
    const alphabetLower = ["b", "a", "c", "d", "f", "e", "h", "g", "i", "j", "l", "k", "m", 
                           "o", "n", "q", "p", "s", "r", "t", "u", "v", "w", "x", "y", "z"];
    const alphabetCursif = ["b", "a", "c", "d", "f", "e", "h", "g", "i", "j", "l", "k", "m", 
                           "o", "n", "q", "p", "s", "r", "t", "u", "v", "w", "x", "y", "z"];
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

    const lireNombres = ["2","5","8","11","14","17","20","3","6","9","12","15","18","1","4","7","10","13","16","19"]

    const studentName = new URLSearchParams(window.location.search).get("name");

    // Fonction pour créer les exercices
    function createExercise(containerId, data, storageKey, rows, cols, fontFamily = "Arial, sans-serif") {
        const tableContainer = document.getElementById(containerId);
        let savedStates = JSON.parse(localStorage.getItem(`${storageKey}_${studentName}`)) || {};

        function renderTable() {
            const table = document.createElement("table");
            table.style.borderCollapse = "collapse";
            table.style.margin = "auto";

            let index = 0;
            for (let row = 0; row < rows; row++) {
                const tr = document.createElement("tr");
                for (let col = 0; col < cols; col++) {
                    const td = document.createElement("td");
                    td.textContent = data[index++];
                    td.style.fontFamily = fontFamily;
                    td.style.fontSize = "26px";
                    td.style.padding = "12px";
                    td.style.textAlign = "center";
                    td.style.border = "2px solid #333";
                    td.style.cursor = "pointer";
                    td.style.backgroundColor = savedStates[`${row}-${col}`] ? "#d4edda" : "#fff";

                    td.addEventListener("click", () => {
                        toggleState(td, row, col);
                    });

                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            tableContainer.appendChild(table);
        }

        function toggleState(cell, row, col) {
            const key = `${row}-${col}`;
            if (savedStates[key]) {
                cell.style.backgroundColor = "#fff";
                delete savedStates[key];
            } else {
                cell.style.backgroundColor = "#d4edda";
                savedStates[key] = true;
            }
            saveState();
        }

        function saveState() {
            localStorage.setItem(`${storageKey}_${studentName}`, JSON.stringify(savedStates));
        }

        renderTable();
    }
  

  

    // Exercice 1 : Lettres majuscules
    createExercise("exercice1", alphabetUpper, "exercice1", 2, 13);

    // Exercice 2 : Lettres minuscules
    createExercise("exercice2", alphabetLower, "exercice2", 2, 13, "'Script Ecole 2', Arial, sans-serif");

    // Exercice 3 : Lettres cursives
    createExercise("exercice3", alphabetCursif, "exercice3", 2, 13, "'Belle Allure GS', Arial, sans-serif");

    // Exercice 4 : Nombres de 1 à 100 (20 colonnes x 5 lignes)
    createExercise("exercice4", numbers, "exercice4", 5, 20, "'Script Ecole 2', Arial, sans-serif");

    // Exercice 5 : lire les nombres (1 ligne)
    createExercise("exercice5", lireNombres, "exercice5", 1, 20, "'Script Ecole 2', Arial, sans-serif");
});
   
