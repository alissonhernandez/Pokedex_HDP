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
    agregarBuscadorPorNombre() {
  const inputBusqueda = document.getElementById('busqueda-pokemon');
  const botonBusqueda = document.getElementById('boton-buscar');

  if (!inputBusqueda) {
      console.warn('Input de búsqueda no encontrado');
      return;
  }

  const normalizar = (texto) =>
      texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtrarPokemones = () => {
    const texto = normalizar(inputBusqueda.value);

    const resultado = this.#pokemones.filter(pokemon =>
        normalizar(pokemon.getNombre()).includes(texto)
    );

    this.dibujarPokedex(resultado);
  };

  inputBusqueda.addEventListener('input', filtrarPokemones);

  if (botonBusqueda) {
    botonBusqueda.addEventListener('click', filtrarPokemones);
  }
}

  //metodo publico dibuja las tarjetas en el HTML recibe una lista filtrada por tipo y si no habia nada se usa completa
    async dibujarPokedex(lista = null) {
        const contenedor = document.getElementById("pokedex");
        
        // Verificar si el elemento existe antes de usarlo
        if (!contenedor) {
            console.warn('Elemento #pokedex no encontrado');
            return;
        }
        
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

