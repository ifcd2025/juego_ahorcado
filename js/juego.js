/* debemos poner "./archivo.js" */
import {palabras, letras} from "./palabras.js"



let aciertos = 0;
let fallos = 0;
const FALLOS_MAXIMOS = 6; /* El número de imágenes */
let palabraGenerada; /* Aquí guardamos la palabra a adivinar para poder
                    comprobar si ganó el usuario */
const sonidoDerrota = new Audio("sonidos/derrota.mp3");
const sonidoFallo = new Audio("sonidos/fallo.wav");
const sonidoVictoria = new Audio("sonidos/victoria.wav");
const musica = new Audio("sonidos/musica.mp3");
musica.loop = true;
musica.volume = .5;


function generarPalabra() {
    const numero = Math.floor(Math.random() * palabras.length);
    // guardamos la palabra a adivinar en una variable global
    palabraGenerada = palabras[numero];
    const palabraAdivinar = document.getElementById("palabraAdivinar");
    // Borramos los guiones de anteriores partidas
    palabraAdivinar.textContent = "";
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
    // No podemos poner un sonido en marcha hasta que el usuario
    // interactúe con la página. No pasa nada si usamos play y ya está
    // en marcha
    musica.play();
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
                    sonidoVictoria.play();
                    confetti({
                        particleCount: 1000,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                    document.getElementById("reiniciar").style.display = "block";
                    // Desactivamos el listener de las teclas, para que no pueda
                    // seguir pulsándolas
                    // Para eliminar un listener hay que poner el mismo evento
                    // y función, con lo que no podríamos haber usado funciones
                    // anónimas ni arrow
                    document.getElementById("letras")
                        .removeEventListener("click", comprobarLetra);
                    break; // salimos del for
                }
            }
        }
        if(palabraGenerada.toLowerCase().includes(letraElegida.toLowerCase()) == false) {
            fallos++;
            sonidoFallo.play();
            const horca = document.getElementById("horca");
            horca.style.backgroundPositionX = -fallos * 261 + "px";
            if(fallos == FALLOS_MAXIMOS) {
                sonidoDerrota.play();
                document.getElementById("letras")
                        .removeEventListener("click", comprobarLetra);
                document.getElementById("reiniciar").style.display = "block";
                horca.classList.add("derrota");
                // Podríamos usar una clase como con horca, pero lo ponemos
                // así por hacerlo de otro modo
                // Hay que usar el truco de offsetWidth para que la segunda vez
                // vuelva a funcionar la animación
                document.getElementById("buitre")
                    .style.animation = ""
                document.getElementById("buitre").offsetWidth;
                document.getElementById("buitre")
                    .style.animation = "animacionBuitre 2s"
                // Ahora hacemos la animación con Web Animations API
                // offset va de 0 a 1 (0 es 0%, .5 es 50%, 1 es 100%, ...)
                const cuadros = [{backgroundColor: "red", offset: 1}];
                const animacion = {duration: 2000}; //, fill: "forwards"};
                document.body.animate(cuadros, animacion);
            }
        }
    }
}

function reiniciar() {
    generarPalabra();
    aciertos = 0;
    fallos = 0;
    document.getElementById("horca").style.backgroundPositionX = 0;
    // Podríamos eliminar todas las letras y volver a llamar a la función crearLetras
    for(let letra of document.getElementsByClassName("letra")) {
        letra.dataset.elegida = "false";
        letra.style.backgroundColor = "";
    }
    document.getElementById("letras")
        .addEventListener("click", comprobarLetra);
    document.getElementById("horca").classList.remove("derrota");
}



crearLetras();
generarPalabra();
document.getElementById("letras")
    .addEventListener("click", comprobarLetra);
document.getElementById("reiniciar").addEventListener("click", reiniciar);


