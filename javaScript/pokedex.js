import { obtenerPokemones } from './pokemonService.js';
import { tarjetaPokemon } from './html.js';

export class Pokedex {
    #pokemones = [];//almacena la lista de pokemon
    
    //metodo publico encargado de dibujar la pokedex
    async dibujarPokedex(){
        const cantidad = 150;//cantidad de pokemons a mostrar

        //corregir error de id
        const contenedor = document.getElementById("pokedex");//contenedor del html donde se mostrara la pokedex
        contenedor.innerHTML = "<div class='spinner'></div>";
        this.#pokemones = await obtenerPokemones(cantidad);//llamando a funcion que obtiene la info de la api
        contenedor.innerHTML="";//limpia contenedor
        //se encarga de recorrer la lista de pokemon obtenidos
        this.#pokemones.forEach(pokemon => {
            const tarjeta = tarjetaPokemon(pokemon);//crea la tarjeta usando la funcion
            contenedor.appendChild(tarjeta);
        });
    }

}