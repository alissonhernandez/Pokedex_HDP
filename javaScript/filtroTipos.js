// Importa la funcion que obtiene todos los pokemones
import { obtenerPokemones } from "./pokemonService.js";

// Importa la funcion que devuelve los tipos unicos desde una lista de pokemones
import { obtenerTipos } from "./tipos.js";

// Funcion que crea botones para filtrar pokemones por tipo
export function crearBotonesFiltro(pokedexInstance, pokemones) {
    // Busca el contenedor donde se insertaran los botones
    const contenedor = document.getElementById("filtros-tipos");
    
    // Si no existe el contenedor, termina la funcion
    if (!contenedor) return;

    // Obtiene un Map de tipos unicos desde la lista de pokemones
    const tiposMap = obtenerTipos(pokemones); // usando los pokemones recibidos

    // Itera por cada tipo (clave del Map)
    tiposMap.forEach((_, tipo) => {
        // Crea un boton para ese tipo
        const boton = document.createElement("button");

        // Asigna el nombre del tipo en mayusculas como texto del boton
        boton.textContent = tipo.toUpperCase();

        // Agrega clases CSS: una generica y una especifica del tipo
        boton.classList.add("boton-tipo", tipo);

        // Evento para cuando se haga clic en este boton de tipo
        boton.addEventListener("click", () => {
            // Filtra los pokemones que incluyen el tipo correspondiente
            const filtrados = pokemones.filter(p => p.getTipos().includes(tipo));

            // Vuelve a dibujar la pokedex con los pokemones filtrados
            pokedexInstance.dibujarPokedex(filtrados);
        });

        // Agrega el boton al contenedor en el DOM
        contenedor.appendChild(boton);
    });

    // Crea un boton adicional para mostrar todos los pokemones
    const botonTodos = document.createElement("button");

    // Asigna el texto "TODOS" al botón
    botonTodos.textContent = "TODOS";

    // Agrega clases al boton de "todos"
    botonTodos.classList.add("boton-tipo", "todos");

    // Evento para mostrar todos los pokemones al hacer clic
    botonTodos.addEventListener("click", () => {
        pokedexInstance.dibujarPokedex(pokemones);
    });

    // Agrega el boton "TODOS" al contenedor
    contenedor.appendChild(botonTodos);
}
