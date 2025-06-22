import { tarjetaPokemon } from './html.js'; 

const STORAGE_KEY = "pokemonesAcompanantes";

export function obtenerAcompanantes() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function guardarAcompanantes(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export function agregarAcompanante(pokemon) {
  const lista = obtenerAcompanantes();

  if (lista.find(p => p.id === pokemon.id)) {
    alert("Este Pokémon ya es un acompañante.");
    return false;
  }

  if (lista.length >= 6) {
    alert("Solo puedes tener hasta 6 acompañantes.");
    return false;
  }

  lista.push({
    id: pokemon.id,
    nombre: pokemon.nombre,
    sprite: pokemon.sprite,
    tipos: pokemon.tipos,
  });
  guardarAcompanantes(lista);
  alert(`${pokemon.nombre} fue atrapado como acompañante.`);
  return true;
}

export function mostrarAcompanantes() {
  const contenedor = document.getElementById("acompanantes");
  contenedor.innerHTML = "";

  const lista = obtenerAcompanantes();

  if (lista.length === 0) {
    contenedor.textContent = "No tienes acompañantes atrapados aún.";
    return;
  }

  lista.forEach(pokemon => {
    const tarjeta = tarjetaPokemon({
      getId: () => pokemon.id,
      getNombre: () => pokemon.nombre,
      getSprite: () => pokemon.sprite,
      getTipos: () => pokemon.tipos,
      getEspecie: () => "", 
      getAltura: () => "",
      getPeso: () => "",
      getHabilidades: () => [],
      getDebilidades: () => [],
      getStats: () => [],
      getMovimientos: () => [],
      getGif: () => null,
    });
    contenedor.appendChild(tarjeta);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarAcompanantes();
});
