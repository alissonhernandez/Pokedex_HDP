import { obtenerPokemones } from "./pokemonService.js";
import { obtenerTipos } from "./tipos.js";

export async function crearBotonesFiltro(pokedexInstance) {
    const contenedor = document.getElementById("filtros-tipos");
    if (!contenedor) return;

    //obtiene pokemones y tipos únicos
    const pokemones = await obtenerPokemones(150);
    const tiposMap = obtenerTipos(pokemones); // Map con tipo - pokemon
    console.log("Tipos obtenidos:", tiposMap);
    //creando boton por cada tipo unico
    tiposMap.forEach((_, tipo) => {
        console.log("Creando botón para tipo:", tipo);
        const boton = document.createElement("button");
        boton.textContent = tipo.toUpperCase();
        boton.classList.add("boton-tipo", tipo);

        boton.addEventListener("click", () => {
            const filtrados = pokemones.filter(p => p.getTipos().includes(tipo));
            pokedexInstance.dibujarPokedex(filtrados);
        });

        contenedor.appendChild(boton);
    });

    //boton para mostrar todos
    const botonTodos = document.createElement("button");
    botonTodos.textContent = "TODOS";
    botonTodos.classList.add("boton-tipo", "todos");

    botonTodos.addEventListener("click", () => {
        pokedexInstance.dibujarPokedex(pokemones);
    });
    contenedor.appendChild(botonTodos);
}

