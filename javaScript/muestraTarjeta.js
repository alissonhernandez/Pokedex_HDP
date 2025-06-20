import { obtenerPokemones } from './pokemonService.js';
import { tarjetaBreve } from './html.js';

export async function mostrarTarjetasBreves(limit = 150) {
  const contenedor = document.getElementById("muestraTarjeta");
  contenedor.innerHTML = "";

  const pokemones = await obtenerPokemones(limit);

  const tiposUnicos = new Map(); // tipo pokemon

  pokemones.forEach(pokemon => {
    const tipo = pokemon.getTipos()[0]; // solo tomamos el primer tipo
    if (!tiposUnicos.has(tipo)) {
      tiposUnicos.set(tipo, pokemon);
    }
  });

  tiposUnicos.forEach(pokemon => {
    const card = tarjetaBreve(pokemon);
    contenedor.appendChild(card);
  });
}