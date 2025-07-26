async function ladeFrage() {
    const frageElement = document.getElementById("Frage");
    const antwortButtons = document.querySelectorAll(".Antwort");

    if (!darfNeueFrageMitCountdown()) {
        antwortButtons.forEach(button => button.style.display = "none");
        return;
    }

    let response = await fetch("fragen.json");
    let quizFragen = await response.json();
    let zufallsIndex = Math.floor(Math.random() * quizFragen.length);
    let aktuelleFrage = quizFragen[zufallsIndex];

    frageElement.textContent = aktuelleFrage.frage;

    antwortButtons.forEach((button, index) => {
        button.textContent = aktuelleFrage.antworten[index];
        button.style.display = "inline-block";
        button.disabled = false;
        button.classList.remove("richtig", "falsch");

        button.onclick = function () {
            überprüfeAntwort(button.textContent, aktuelleFrage.lösung);
        };
    });

    prüfeAbzeichen();
}


function darfNeueFrageMitCountdown() {
    const frageElement = document.getElementById("Frage");
    const countdownElement = document.getElementById("countdown");
    const letzteFrageZeit = localStorage.getItem("letzteFrageZeit");

    const jetzt = new Date();

    if (!letzteFrageZeit) {
        localStorage.setItem("letzteFrageZeit", jetzt.toISOString());
        return true;
    }

    const letzteZeit = new Date(letzteFrageZeit);
    const differenzInMs = jetzt - letzteZeit;
    const zweiStundenInMs = 2 * 60 * 60 * 1000;

    if (differenzInMs >= zweiStundenInMs) {
        localStorage.setItem("letzteFrageZeit", jetzt.toISOString());
        return true;
    }

    const verbleibendeZeit = zweiStundenInMs - differenzInMs;
    let verbleibendeSekunden = Math.floor(verbleibendeZeit / 1000);

    // Countdown starten
    const timer = setInterval(() => {
        const minuten = Math.floor(verbleibendeSekunden / 60);
        const sekunden = verbleibendeSekunden % 60;

        countdownElement.textContent = `⏳ Noch ${minuten}m ${sekunden < 10 ? "0" : ""}${sekunden}s bis zur nächsten Frage`;

        if (verbleibendeSekunden <= 0) {
            clearInterval(timer);
            countdownElement.textContent = "Du hast eine Frage";
            ladeFrage(); // Automatisch neue Frage holen
        }

        verbleibendeSekunden--;
    }, 1000);

    frageElement.textContent = "Du hast schon eine Frage erhalten.";
    return false;
}


function überprüfeAntwort(gewählteAntwort, korrekteAntwort) {
    const antwortButtons = document.querySelectorAll(".Antwort");

    // Alle Buttons deaktivieren
    antwortButtons.forEach(button => {
        button.disabled = true;
    });

    let scoreElement = document.getElementById("score");
    const istRichtig = gewählteAntwort === korrekteAntwort;

    scoreElement.textContent = istRichtig 
        ? `✔ Richtig!` 
        : `❌ Falsch! Die richtige Antwort war: ${korrekteAntwort}`;

    // Den geklickten Button einfärben
    antwortButtons.forEach(button => {
        if (button.textContent === gewählteAntwort) {
            button.classList.add(istRichtig ? "richtig" : "falsch");
        }
    });

    // Streak zählen
    if (istRichtig) {
        let richtige = parseInt(localStorage.getItem("Richtige")) || 0;
        localStorage.setItem("Richtige", (richtige + 1).toString());

        let streak = parseInt(localStorage.getItem("Richtige-in-folge")) || 0;
        localStorage.setItem("Richtige-in-folge", (streak + 1).toString());
    } else {
      antwortButtons.forEach(button =>{
        if(button.textContent === korrekteAntwort){
          button.classList.add("richtig")
        }
      })
        localStorage.setItem("Richtige-in-folge", "0");
    }
}


ladeFrage();

function prüfeBesuch() {
  const heute = new Date().toISOString().split("T")[0];
  const letzterBesuch = localStorage.getItem("letzterBesuch");
  let streakdays = parseInt(localStorage.getItem("streak")) || 0;

  if (letzterBesuch) {
    const gestern = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString().split("T")[0];

    if (letzterBesuch === heute) {
      // Schon heute da gewesen → nichts tun
      return;
    } else if (letzterBesuch === gestern) {
      streakdays++;
    } else {
      streakdays = 1; // Unterbrechung → Reset
    }
  } else {
    streakdays = 1;
  }
  // Speichern
  localStorage.setItem("letzterBesuch", heute);
  localStorage.setItem("streak", streakdays.toString());
  prüfeAbzeichen();
}
prüfeBesuch();
//die Speicher Section von allen Abzeichen im localstorage, vielleicht bald mit Node im backend über eine Datenbank
function prüfeAbzeichen(){
  let streakdays = parseInt(localStorage.getItem("streak")) || 0;
  let streakrichtige = parseInt(localStorage.getItem("Richtige-in-folge")) || 0;
  let richtige = parseInt(localStorage.getItem("Richtige")) || 0;

  let abzeichen7D = localStorage.getItem("abzeichen7D") === "true";
  let abzeichen30D = localStorage.getItem("abzeichen30D") === "true";
  let abzeichen7R = localStorage.getItem("abzeichen7R") === "true";
  let abzeichen10R = localStorage.getItem("abzeichen10R") === "true";
  let abzeichen50R = localStorage.getItem("abzeichen50R") === "true";
  let abzeichen100R = localStorage.getItem("abzeichen100R") === "true";
  let abzeichen10I = localStorage.getItem("abzeichen10I") === "true";
  let abzeichen30I = localStorage.getItem("abzeichen30I") === "true";
  
  let card1 = document.getElementById("Abzeichen1");
  let card2 = document.getElementById("Abzeichen2");
  let card3 = document.getElementById("Abzeichen3");
  let card4 = document.getElementById("Abzeichen4");
  let card5 = document.getElementById("Abzeichen5");
  let card6 = document.getElementById("Abzeichen6");
  let card7 = document.getElementById("Abzeichen7");
  let card8 = document.getElementById("Abzeichen8");

 // Überprüfen ob schon freigeschaltet
  if(abzeichen7D){
    card1.classList.add("freigeschaltet");
  }
    if(abzeichen30D){
    card2.classList.add("freigeschaltet");
  }
    if(abzeichen7R){
    card3.classList.add("freigeschaltet");
  }
    if(abzeichen10R){
    card4.classList.add("freigeschaltet");
  }
    if(abzeichen50R){
    card5.classList.add("freigeschaltet");
  }
    if(abzeichen100R){
    card6.classList.add("freigeschaltet");
  }
    if(abzeichen10I){
    card7.classList.add("freigeschaltet");
  }
    if(abzeichen30I){
    card8.classList.add("freigeschaltet");
  }
  // Abzeichen prüfen
  if (streakdays >= 7 && !abzeichen7D) {
    abzeichen7D = true;
    card1.classList.add("freigeschaltet");
    alert("🎉 Du hast das 7-Tage-Abzeichen erhalten!");
  }
  if (streakdays >= 30 && !abzeichen30D) {
    abzeichen30D = true;
    card2.classList.add("freigeschaltet");
    alert("🏅 Wow! 30 Tage in Folge – Abzeichen freigeschaltet!");
  }
  if (richtige >= 7 && !abzeichen7R) {
    abzeichen7R = true;
    card3.classList.add("freigeschaltet");
    alert("🥳 Du hast 7 richtige Antworten!");
  }
  if (richtige >= 10 && !abzeichen10R) {
    abzeichen10R = true;
    card4.classList.add("freigeschaltet");
    alert("🥳 Du hast 10 richtige Antworten!");
  }
  if (richtige >= 50 && !abzeichen50R) {
    abzeichen50R = true;
    card5.classList.add("freigeschaltet");
    alert("🥳 Du hast 50 richtige Antworten!");
  }
  if (richtige >= 100 && !abzeichen100R) {
    abzeichen100R = true;
    card6.classList.add("freigeschaltet");
    alert("🥳 WOW! Du hast 100 richtige Antworten!");
  }
  if (streakrichtige >= 10 && !abzeichen10I) {
    abzeichen10I = true;
    card7.classList.add("freigeschaltet");
    alert("🥳 Du hast 10 Raetzel in Folge gelöst!");
  }
  if (streakrichtige >= 30 && !abzeichen30I) {
    abzeichen30I = true;
    card8.classList.add("freigeschaltet");
    alert("🥳 WOW! Du hast 30 Raetzel in Folge gelöst!");
  }

  localStorage.setItem("abzeichen7D", abzeichen7D.toString());
  localStorage.setItem("abzeichen30D", abzeichen30D.toString());

  localStorage.setItem("abzeichen7R", abzeichen7R.toString());
  localStorage.setItem("abzeichen10R", abzeichen10R.toString());
  localStorage.setItem("abzeichen50R", abzeichen50R.toString());
  localStorage.setItem("abzeichen100R", abzeichen100R.toString());

  localStorage.setItem("abzeichen10I", abzeichen10I.toString());
  localStorage.setItem("abzeichen30I", abzeichen30I.toString());
}
prüfeAbzeichen();