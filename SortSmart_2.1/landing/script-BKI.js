// Die URL deines Teachable Machine Modells
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;
let isRunning = false;
let lastPrediction = [];

// Lade das Modell und richte die Webcam ein
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    const startButton = document.getElementById("start-button");
    startButton.style.display = "none";
    startButton.innerText = ""; // Entfernt den Text "Starten"
    document.getElementById("loading").style.display = "block";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(320, 240, flip);
        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container").innerHTML = "";
        document.getElementById("webcam-container").appendChild(webcam.canvas);

        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = "";
        for (let i = 0; i < maxPredictions; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        isRunning = true;
        setTimeout(stopPrediction, 8000); // Nach 8 Sekunden stoppen
        runPredictionLoop();

    } catch (err) {
        console.error("Fehler beim Laden des Modells oder Webcam:", err);
        alert("Fehler: Konnte Modell oder Webcam nicht laden. Bitte überprüfe die Einstellungen.");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

async function runPredictionLoop() {    //Vorhersage starten
    while (isRunning) {
        webcam.update();
        await predict();
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

async function predict() {      //Vorhersage machen
    const prediction = await model.predict(webcam.canvas);
    lastPrediction = prediction;
    const sorted = prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            sorted[i].className + ": " + (sorted[i].probability * 100).toFixed(2) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
        labelContainer.childNodes[i].style.fontWeight = i === 0 ? "bold" : "normal";
        labelContainer.childNodes[i].style.color = i === 0 ? "green" : "black";
    }
}

function stopPrediction() {
    isRunning = false;
    webcam.pause();

    const canvas = webcam.canvas;
    const dataURL = canvas.toDataURL();
    const snapshot = new Image();
    snapshot.src = dataURL;
    snapshot.alt = "Aufgenommenes Bild";

    const container = document.getElementById("webcam-container");
    container.innerHTML = "";
    container.appendChild(snapshot);

    // Bild wird NICHT gespeichert – Funktion auskommentiert kommt vielleicht in der Zukunft
    // const topResult = lastPrediction[0];
    // if (topResult && topResult.probability > 0.8) {
    //     fetch("/save-image", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ image: dataURL, label: topResult.className })
    //     }).catch(err => console.error("Fehler beim Speichern:", err));
    // }

    // Zeige Neustart-Button
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "Neu";
    restartBtn.onclick = () => location.reload();
    document.getElementById("label-container").appendChild(restartBtn);
}
