import { Pokedex } from "./pokedex.js";
import { crearBotonesFiltro } from "./filtroTipos.js";
import { crearBotonSubir } from "./volverBoton.js";
import { mostrarTarjetasBreves } from "./muestraTarjeta.js";
import { obtenerPokemones } from "./pokemonService.js";

// Verificar si estamos en la página principal
function esPaginaPrincipal() {
    return window.location.pathname.endsWith('index.html') || 
           window.location.pathname.endsWith('/') ||
           window.location.pathname.includes('index.html');
}

// Verificar si estamos en la página de Pokédex
function esPaginaPokedex() {
    return window.location.pathname.includes('pokedex.html');
}

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página actual:', window.location.pathname);

    try {
        // Botón para subir (en todas las páginas)
        crearBotonSubir();

        // Página principal (tarjetas breves)
        if (esPaginaPrincipal()) {
            console.log('Inicializando página principal...');
            await mostrarTarjetasBreves();
        }

        // Página Pokédex
        if (esPaginaPokedex()) {
            console.log('Inicializando Pokédex...');

            const poke = new Pokedex();
            const pokemones = await obtenerPokemones(150); // obtener los pokemon

            crearBotonesFiltro(poke, pokemones); // crear botones de filtro
            await poke.init(pokemones); // mostrar tarjetas 

            poke.agregarBuscadorPorNombre(); // Barra de búsqueda
        }

        console.log('Inicialización completada');
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
});
