import { obtenerPokemones } from './pokemonService.js';
import { tarjetaPokemon } from './html.js';

export class Pokedex {
    //almacena todos los pokemon
    #pokemones = [];
    //metodo para inicializar la pokedex
    async init() {
        //obtiene los primeros 150 pokemon desde la api
        this.#pokemones = await obtenerPokemones(150);
        //metodo para dibujar todas las tarjetas
        this.dibujarPokedex();
    }

  //metodo publico dibuja las tarjetas en el HTML recibe una lista filtrada por tipo y si no habia nada se usa completa
    async dibujarPokedex(lista = null) {
        const contenedor = document.getElementById("pokedex");
        contenedor.innerHTML = "<div class='spinner'></div>";
        await new Promise(res => setTimeout(res, 300));
        //esta es lista recibida sino existe la lista completa es almacenada
        const pokemones = lista ?? this.#pokemones;
        //limpia el contenido anterior del contenedor
        contenedor.innerHTML = "";

        //recorre cada Pokémon y crea una tarjeta para mostrar
        pokemones.forEach(pokemon => {
            const tarjeta = tarjetaPokemon(pokemon);//función que crea el HTML de la tarjeta
            contenedor.appendChild(tarjeta);
        });
    }
}