import { obtenerPokemones } from './pokemonService.js';
import { tarjetaPokemon } from './html.js';

export class Pokedex {
    #pokemones = [];//almacena la lista de pokemon
    
    async dibujarPokedex(pokemones = null) {
        const contenedor = document.getElementById("pokedex");
        
        contenedor.innerHTML = "<div class='spinner'></div>";
        
        if (!pokemones) {
            const cantidad = 150;
            this.#pokemones = await obtenerPokemones(cantidad);
        } else {
            this.#pokemones = pokemones;
        }
        
        contenedor.innerHTML = "";
        
        this.#pokemones.forEach(pokemon => {
            const tarjeta = tarjetaPokemon(pokemon);
            contenedor.appendChild(tarjeta);
        });
}
}