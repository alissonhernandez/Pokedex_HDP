//función que para efecto parallax en algunos elementos
function moverParallax() {
    const scrollY = window.scrollY; //obtiene la cantidad de desplazamiento vertical

    //mueve el elemento con id "sol" hacia abajo a una velocidad reducida
    document.querySelector("#sol").style.top = scrollY * 0.5 + "px";

    // mueve el elemento con id "pokemon" con el mismo efecto
    document.querySelector("#pokemon").style.top = scrollY * 0.5 + "px";

    //mueve el elemento con id "bola" con el mismo efecto parallax
    document.querySelector("#bola").style.top = scrollY * 0.5 + "px";
}

//ejecuta la función moverParallax cada vez que el usuario hace scroll
window.addEventListener("scroll", moverParallax);

//también ejecuta la función moverParallax cuando se carga la página
//esto asegura que los elementos estén posicionados correctamente desde el inicio
window.addEventListener("load", moverParallax);

//agrega otro evento al hacer scroll para animar el texto de bienvenida
window.addEventListener("scroll", () => {
    const scrollY = window.scrollY; //obtiene el desplazamiento vertical
    const texto = document.querySelector(".texto-bienvenida"); //selecciona el elemento de texto de bienvenida

    if (texto) {
    //aplica una transformación para mover el texto ligeramente hacia abajo
    //mientras se hace scroll, simulando un efecto parallax más suave
        texto.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
});