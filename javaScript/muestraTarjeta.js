import { obtenerPokemones } from './pokemonService.js';
import { muestratarjeta } from './html.js';

export async function mostrarTarjetasBreves(limit = 150) {
  const contenedor = document.getElementById("muestraTarjeta");
  
  // Verificar si el elemento existe antes de usarlo
  if (!contenedor) {
    console.warn('Elemento #muestraTarjeta no encontrado');
    return;
  }
  
  contenedor.innerHTML = "";

  try {
    const pokemones = await obtenerPokemones(limit);

    const tiposUnicos = new Map(); // tipo pokemon

    pokemones.forEach(pokemon => {
      const tipo = pokemon.getTipos()[0]; // solo tomamos el primer tipo
      if (!tiposUnicos.has(tipo)) {
        tiposUnicos.set(tipo, pokemon);
      }
    });

    // Convertimos el Map a array y aplicamos índice centrado
    const pokes = Array.from(tiposUnicos.values());
    const middle = Math.floor(pokes.length / 2);

    pokes.forEach((pokemon, i) => {
      const offset = i - middle; // genera valores simétricos: -3, -2, ..., 0, ..., 2, 3
      const card = muestratarjeta(pokemon, offset);
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error('Error al mostrar tarjetas breves:', error);
    contenedor.innerHTML = '<p>Error al cargar las tarjetas</p>';
  }
}
