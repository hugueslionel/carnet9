document.addEventListener("DOMContentLoaded", async function () {
    const studentName = new URLSearchParams(window.location.search).get("name");
    const imageBand = document.getElementById("image-band");
    const imageTable = document.getElementById("image-table");
    const studentNameDisplay = document.getElementById("student-name");

    if (studentName) {
        studentName.textContent = studentName;
    }

    const studentKey = `student-${studentName}`;

    const initialPositions = [
        { id: "animal1", src: "images/animal1.png", row: null, col: null },
        { id: "animal2", src: "images/animal2.png", row: null, col: null },
        { id: "animal3", src: "images/animal3.png", row: null, col: null },
        { id: "animal4", src: "images/animal4.png", row: null, col: null }
    ];

    const savedPositions = await loadPositions(studentName);
    const positions = savedPositions.length ? savedPositions : initialPositions;

    positions.forEach(pos => {
        const img = document.createElement("img");
        img.id = pos.id;
        img.src = pos.src;
        img.draggable = true;
        img.classList.add("draggable-image");
        img.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text", pos.id);
        });

        if (pos.row === null && pos.col === null) {
            imageBand.appendChild(img);
        } else {
            const targetCell = document.querySelector(`#image-table td[data-row="${pos.row}"][data-col="${pos.col}"]`);
            if (targetCell) {
                targetCell.appendChild(img);
            }
        }
    });

    // Cacher le bandeau si aucune image n'est présente dedans
    function updateImageBandVisibility() {
        if (imageBand.childElementCount === 0) {
            imageBand.style.display = "none";
        } else {
            imageBand.style.display = "flex";
        }
    }

    function updatePositions(id, row, col) {
        const pos = positions.find(p => p.id === id);
        if (pos) {
            pos.row = row;
            pos.col = col;
            savePositions();
            updateImageBandVisibility();
        }
    }

    function loadInitialImages() {
        imageBand.innerHTML = ""; // Effacer les images précédentes si besoin
        positions.forEach((pos) => {
            const img = document.createElement("img");
            img.id = pos.id;
            img.src = pos.src;
            img.draggable = true;
            img.style.objectFit = "contain";
            img.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text", pos.id);
            });
            
            if (pos.row === null && pos.col === null) {
                imageBand.appendChild(img);
            } else {
                const targetCell = document.querySelector(`#image-table td[data-row="${pos.row}"][data-col="${pos.col}"]`);
                if (targetCell) {
                    targetCell.appendChild(img);
                }
            }
        });
        updateImageBandVisibility();
    }
    
    loadInitialImages();
});


