import {palabras, letras} from "./palabras.js" 
/* https://freesound.org/people/laft2k/sounds/435777/
https://freesound.org/people/Seth_Makes_Sounds/sounds/684500/
https://freesound.org/people/Reitanna/sounds/244744/
 */

let aciertos = 0;
let fallos = 0;
const FALLOSMAXIMOS = 6;
let palabraElegida;

const sonidoDerrota = new Audio("derrota.mp3");
const sonidoFallo = new Audio("fallo.wav");

const musica = new Audio("musica.wav");
musica.loop = true;
musica.volume = .5;



function letraPulsada(evt) {
    musica.play();

    if(evt.target.classList.contains("letra") && !evt.target.classList.contains("letraElegida")) {
        evt.target.classList.add("letraElegida");
        const aciertosAnteriores = aciertos;
        const letraElegida = evt.target.textContent;
        for(let letra of document.querySelectorAll("#palabraElegida span")) {
            if(letra.dataset.letra.toLowerCase() == letraElegida.toLowerCase()) {
                letra.textContent = letraElegida;
                letra.classList.add("letraAcertada");
                aciertos++;
            }
        }
        if(aciertos == palabraElegida.length) {
            alert("Ganó");
        } else if(aciertos == aciertosAnteriores) {
            fallos++;
            sonidoFallo.play();
            document.getElementById("horca").style.backgroundPositionX = -fallos * 261 + "px";
            if(fallos == FALLOSMAXIMOS) {
                musica.pause();
                document.getElementById("buitre").style.animation = "animacionBuitre 2s forwards";
                document.body.style.animation = "animacionSangre 4s";
                document.getElementById("letrasDisponibles").removeEventListener("click", letraPulsada );
                document.getElementById("horca").classList.add("derrota");
                sonidoDerrota.play();
                document.getElementById("reiniciar").style.display = "block";
            }
        }
    }
}

function iniciar() {
    document.getElementById("letrasDisponibles").addEventListener("click", letraPulsada );
    const numero = Math.floor(Math.random() * (palabras.length));
    palabraElegida = palabras[numero];
    const palabra = document.getElementById("palabraElegida");
    palabra.textContent = "";
    for(let letra of palabraElegida) {
        const span = document.createElement("span");
        span.textContent = "_";
        span.dataset.letra = letra;
        palabra.appendChild(span);
    }
}

function crearLetras() {
    const letrasDisponibles = document.getElementById("letrasDisponibles");
    for(let letra of letras) {
        const div = document.createElement("div");
        letrasDisponibles.appendChild(div);
        div.textContent = letra;
        div.classList.add("letra");
    }

}

function reiniciar() {
    aciertos = 0;
    fallos = 0;
    for(let letra of document.querySelectorAll("#letrasDisponibles div")) {
        letra.classList.remove("letraElegida");
    }
    document.getElementById("horca").style.backgroundPositionX = 0;
    document.getElementById("horca").classList.remove("derrota");
    document.getElementById("reiniciar").style.display = "none";
    iniciar();


}

crearLetras();
iniciar();

document.getElementById("reiniciar").addEventListener("click", reiniciar);
