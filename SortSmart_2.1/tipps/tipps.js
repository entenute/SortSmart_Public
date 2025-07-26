async function ladeTipp() {
    let letztesTippDatum = localStorage.getItem("letztesTippDatum");
    let aktuellesDatum = new Date().toISOString().split("T")[0];

    if (letztesTippDatum === aktuellesDatum) {
        document.getElementById("tipp").textContent = localStorage.getItem("aktuellerTipp");
        return;
    }

    let response = await fetch("tipps.json");
    let tippsListe = await response.json();

    let zufallsIndex = Math.floor(Math.random() * tippsListe.length);
    let heutigerTipp = tippsListe[zufallsIndex].tipp;

    document.getElementById("tipp").textContent = heutigerTipp;

    localStorage.setItem("letztesTippDatum", aktuellesDatum);
    localStorage.setItem("aktuellerTipp", heutigerTipp);
}
//Funktion die täglich einen anderen Tipp läd
ladeTipp();