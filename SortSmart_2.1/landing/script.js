const startbutton = document.getElementById("cta-button");
const headline = document.getElementById("headline");


startbutton.addEventListener("click", () =>{
 headline.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); // <- Hier wird zur Sortierung gescrollt
});
document.getElementById("materialinput").addEventListener("input", showSuggestions); 

async function searchMüll() {
    const müllInput = document.getElementById("materialinput").value.trim();
    const output = document.getElementById("output");

    if (müllInput === "") {
        output.textContent = "Bitte eingeben was gesucht werden soll.";
        return;
    }

    try {
        const response = await fetch("muell.json");
        const data = await response.json();

        let foundContinent = null;
        let sideInfo = null;

        for (const continent in data) {
            const MüllObject = data[continent].find(müll => müll.name.toLowerCase() === müllInput.toLowerCase());
            if (MüllObject) {
                foundContinent = continent;
                sideInfo = MüllObject.info || null;
                break;
            }
        }

        if (foundContinent) {
            if(foundContinent==="Verpackungsfalle"){
                output.textContent = `"${müllInput}" ist etwas komplizierter.`
            } else{
            output.textContent = `"${müllInput}" gehört in den ${foundContinent}.`; }
            if (sideInfo) {
                output.textContent += ` ${sideInfo}`;
            }
        } else {
            output.textContent = "Lieder nicht gefunden.";
        }
    } catch (error) {
        output.textContent = "Fehler beim Laden der Daten.";
        console.error("Fehler:", error);
    }
}

async function showSuggestions() {
    const input = document.getElementById("materialinput").value.toLowerCase();
    const suggestionBox = document.getElementById("suggestions");  

    if (input === "") {
        suggestionBox.innerHTML = "<p>Hier stehen Vorschläge aus der Datenbank</p>";
        return;
    }

    try {
        const response = await fetch("muell.json"); 
        const data = await response.json();
        const allMaterials= Object.values(data).flat();  
        
        const matches = allMaterials
            .filter(muell => muell.name.toLowerCase().startsWith(input)); 

        suggestionBox.innerHTML = matches
            .map(muell => `<div onclick="selectM('${muell.name}')">${muell.name}</div>`) 
            .join("");
    } catch (error) {
        console.error("Fehler beim Laden der Vorschläge:", error);
    }
}

function selectM(muellName) {
    document.getElementById("materialinput").value = muellName;
    document.getElementById("suggestions").innerHTML = "<p>Hier stehen Vorschläge aus der Datenbank</p>";
    searchMüll();
}
//der Open Food Facts API 
async function fetchPackagingInfo() {
  const brand = document.getElementById("brand").value;
  const product = document.getElementById("product").value;
  const result = document.getElementById("result");

  result.textContent = "Suche läuft...";

  try {
    const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(product)}&brands=${encodeURIComponent(brand)}&search_simple=1&action=process&json=1`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.products.length === 0) {
      result.textContent = "Kein Produkt gefunden.";
      return;
    }

    const packagings = searchData.products[0].packaging_tags || [];
    const packagingText = searchData.products[0].packaging || "Keine Details";

    result.innerHTML = `
      <h3>Ergebnis:</h3>
      <p><strong>Verpackungstyp:</strong> ${packagingText}</p>
      <p><strong>Tags:</strong> ${packagings.join(", ")}</p>
    `;
  } catch (error) {
    result.textContent = "Fehler beim Abrufen der Daten.";
  }
}
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
  }
// Fürs mobile Format, das dann erst der Infotext gezeigt wird
const infotext = document.getElementById("infotext");
const infotext2 = document.getElementById("infotext2");
const infotext3 = document.getElementById("infotext3");
let ison = 0
let ison2 = 0
let ison3 = 0
function showinfo(){
    if(ison === 1){
        infotext.classList.remove("on");
        infotext.classList.add("off");
        ison = 0
        console.log("ist nicht mehr drin");
       
    } else{
    infotext.classList.add("on");
    infotext.classList.remove("off");
    ison = 1
    console.log("ist drin");
    }
}
function showinfo2(){
    if(ison2 === 1){
        infotext2.classList.remove("on");
        infotext2.classList.add("off");
        ison2 = 0
        console.log("ist nicht mehr drin");
       
    } else{
    infotext2.classList.add("on");
    infotext2.classList.remove("off");
    ison2 = 1
    console.log("ist drin");
    }
}
function showinfo3(){
    if(ison3 === 1){
        infotext3.classList.remove("on");
        infotext3.classList.add("off");
        ison3 = 0
        console.log("ist nicht mehr drin");
       
    } else{
    infotext3.classList.add("on");
    infotext3.classList.remove("off");
    ison3 = 1
    console.log("ist drin");
    }
}