const infotext = document.getElementById("infotext");
let ison = 0
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