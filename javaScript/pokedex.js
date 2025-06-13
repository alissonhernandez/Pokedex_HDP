import { obtenerPokemones } from './pokemonService.js';
import { tarjetaPokemon } from './html.js';

export class Pokedex {
    #pokemones = [];//almacena la lista de pokemon

    //metodo publico encargado de dibujar la pokedex
    async dibujarPokedex(){
        const cantidad = 150;//cantidad de pokemons a mostrar
        const contenedor = document.getElementById("pokedex");//contenedor del html donde se mostrara la pokedex
        this.#pokemones = await obtenerPokemones(cantidad);//llamando a funcion que obtiene la info de la api
        contenedor.innerHTML="";//limpia contenedor
        //se encarga de recorrer la lista de pokemon obtenidos
        this.#pokemones.forEach(pokemon => {
            const tarjeta = tarjetaPokemon(pokemon);//crea la tarjeta usando la funcion
            contenedor.appendChild(tarjeta);
        });
    }
}