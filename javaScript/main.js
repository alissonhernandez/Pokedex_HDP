import { Pokedex } from "./pokedex.js";

// Crear la instancia
const poke = new Pokedex();
poke.dibujarPokedex();

// Tipos que usaremos para los botones
const tiposPokemon = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

async function obtenerPokemonPorTipo(tipo) {
  const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
  const data = await respuesta.json();

  const lista = data.pokemon.slice(0, 50).map(p => p.pokemon);

  // detalles de los pokemon
  const detalles = await Promise.all(
    lista.map(p => fetch(p.url).then(r => r.json()))
  );

  return detalles;
}

// obtener los pokemon 
async function obtenerTodosLosPokemon() {
  const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
  const data = await respuesta.json();

  const detalles = await Promise.all(
    data.results.map(p => fetch(p.url).then(r => r.json()))
  );

  return detalles;
}

// crear los botones
function crearBotonesFiltro() {
  const contenedor = document.getElementById("filtros-tipos");

  tiposPokemon.forEach(tipo => {
    const boton = document.createElement("button");
    boton.textContent = tipo.toUpperCase();
    boton.classList.add(tipo);

    boton.addEventListener("click", async () => {
      const pokemones = await obtenerPokemonPorTipo(tipo);
      console.log("Filtrando por tipo:", tipo, pokemones); // 💡 revisar en consola
      poke.dibujarPokedex(pokemones);
    });

    contenedor.appendChild(boton);
  });

  // todos los botones
  const botonTodos = document.createElement("button");
  botonTodos.textContent = "TODOS";
  botonTodos.classList.add("todos");

  botonTodos.addEventListener("click", async () => {
    const pokemones = await obtenerTodosLosPokemon();
    console.log("Mostrando todos:", pokemones);
    poke.dibujarPokedex(pokemones);
  });

  contenedor.appendChild(botonTodos);
}

// Llamar la funcion para botones
crearBotonesFiltro();
