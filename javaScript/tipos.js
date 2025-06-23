import { obtenerPokemones } from './pokemonService.js';

export function obtenerTipos(pokemones) {
    const tiposUnicos = new Map();
    pokemones.forEach(pokemon => {
    pokemon.getTipos().forEach(tipo => {
        if (!tiposUnicos.has(tipo)) {
            tiposUnicos.set(tipo, pokemon);
        }
    });
    })

    return tiposUnicos;
}
