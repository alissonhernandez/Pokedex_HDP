import { Pokemon } from './pokemon.js';

//obtencion de los primeros 150 pokemon
export async function obtenerPokemones(limit = 150) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const pokemones = await Promise.all(
    data.results.map(async p => {
      const detalles = await fetch(p.url).then(r => r.json());

      //obtencion de debilidades desde el primer tipo
      const tipoURL = detalles.types[0].type.url;
      const tipoDetalles = await fetch(tipoURL).then(r => r.json());

      return new Pokemon(detalles, tipoDetalles);
    })
  );

  return pokemones;
}