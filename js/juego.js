/* debemos poner "./archivo.js" */
import {palabras, letras} from "./palabras.js"

let aciertos = 0;
let fallos = 0;
const FALLOS_MAXIMOS = 6; /* El número de imágenes */
let palabraGenerada; /* Aquí guardamos la palabra a adivinar para poder
                    comprobar si ganó el usuario */


function generarPalabra() {
    const numero = Math.floor(Math.random() * palabras.length);
    // guardamos la palabra a adivinar en una variable global
    palabraGenerada = palabras[numero];
    const palabraAdivinar = document.getElementById("palabraAdivinar");
    for(let letra of palabraGenerada) {
        const span = document.createElement("span");
        palabraAdivinar.appendChild(span);
        span.textContent = "_";
        /* Guardamos la letra en cada span para que luego sea fácil comprobar
        los aciertos del usuario */
        span.dataset.letra = letra;
    }
}

function crearLetras() {
    const divLetras = document.getElementById("letras");
    for(let letra of letras) {
        const div = document.createElement("div");
        divLetras.appendChild(div);
        div.textContent = letra;
        // Para evitar posteriormente que pulse más de una vez la misma tecla
        // Podríamos poner false si comillas, pero dataset la convierte a cadena
        // igualmente
        div.dataset.elegida = "false";
        div.classList.add("letra");
        /* Aunque en este caso podríamos usar textContent para saber la
        letra que tiene el div, vamos a usar dataset */
        div.dataset.letra = letra;
    }

}

function comprobarLetra(evt){
    // Debemos saber si se hizo click en una letra o en su contenedor
    //if(evt.target.classList.contains("letra") &&
    //    evt.target.dataset.elegida == undefined) {
    //if(evt.target.parentNode == evt.currentTarget &&
    //    evt.target.dataset.elegida == undefined) {
    if(evt.target.dataset.letra != undefined &&
        evt.target.dataset.elegida == "false"
    ) {
        // Desactivamos esa letra, para que no se coja de nuevo
        evt.target.style.backgroundColor = "gray";
        evt.target.dataset.elegida = "true";

        const letraElegida = evt.target.dataset.letra;
        // Recorremos los span de los _ ya que tienen las letras de la palabra
        // a adivinir
        const spans = document.querySelectorAll("#palabraAdivinar span");
        for(let span of spans) {
            if(letraElegida.toLowerCase() == span.dataset.letra.toLowerCase()) {
                span.textContent = letraElegida;
                aciertos++;
                if(aciertos == palabraGenerada.length) {
                    alert("ganó");
                    break; // salimos del for
                }
            }
        }

    }
}



crearLetras();
generarPalabra();
document.getElementById("letras")
    .addEventListener("click", comprobarLetra);



