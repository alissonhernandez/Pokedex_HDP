import { Pokedex } from "./pokedex.js";
import { crearBotonesFiltro } from "./filtroTipos.js";
import { crearBotonSubir } from "./volverBoton.js";
import { mostrarTarjetasBreves } from "./muestraTarjeta.js";
import { obtenerPokemones } from "./pokemonService.js"; // 🔹 Asegurate de importar esto

// Función para verificar si estamos en la página principal
function esPaginaPrincipal() {
    return window.location.pathname.endsWith('index.html') || 
           window.location.pathname.endsWith('/') ||
           window.location.pathname.includes('index.html');
}

// Función para verificar si estamos en la página de Pokédex
function esPaginaPokedex() {
    return window.location.pathname.includes('pokedex.html');
}

// Inicializar solo en las páginas correspondientes
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página actual:', window.location.pathname);
    
    try {
        // Crear botón subir en todas las páginas
        crearBotonSubir();
        
        // Solo mostrar tarjetas breves en la página principal
        if (esPaginaPrincipal()) {
            console.log('Inicializando página principal...');
            await mostrarTarjetasBreves();
        }
        
        // Solo inicializar Pokédex en la página de Pokédex
        if (esPaginaPokedex()) {
            console.log('Inicializando Pokédex...');
            const poke = new Pokedex();
            const pokemones = await obtenerPokemones(150); 

            crearBotonesFiltro(poke, pokemones);           
            poke.dibujarPokedex(pokemones);               
        }
        
        console.log('Inicialización completada');
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
});
