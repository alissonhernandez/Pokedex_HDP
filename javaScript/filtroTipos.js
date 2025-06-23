import { obtenerPokemones } from "./pokemonService.js";
import { obtenerTipos } from "./tipos.js";

export function crearBotonesFiltro(pokedexInstance, pokemones) {
    const contenedor = document.getElementById("filtros-tipos");
    if (!contenedor) return;

    const tiposMap = obtenerTipos(pokemones); // usando los pokemones recibidos

    tiposMap.forEach((_, tipo) => {
        const boton = document.createElement("button");
        boton.textContent = tipo.toUpperCase();
        boton.classList.add("boton-tipo", tipo);

        boton.addEventListener("click", () => {
            const filtrados = pokemones.filter(p => p.getTipos().includes(tipo));
            pokedexInstance.dibujarPokedex(filtrados);
        });

        contenedor.appendChild(boton);
    });

    const botonTodos = document.createElement("button");
    botonTodos.textContent = "TODOS";
    botonTodos.classList.add("boton-tipo", "todos");

    botonTodos.addEventListener("click", () => {
        pokedexInstance.dibujarPokedex(pokemones);
    });

    contenedor.appendChild(botonTodos);
}

