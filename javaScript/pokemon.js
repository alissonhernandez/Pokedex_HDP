export class Pokemon {
  #id;
  #nombre;
  #especie;
  #altura;
  #peso;
  #tipos;
  #habilidades;
  #debilidades;
  #sprites;
  #stats;
  #movimientos;

  constructor(data, tipoDetalles) {
    this.#id = data.id;
    this.#nombre = data.name;
    this.#especie = data.species.name;
    this.#altura = data.height;
    this.#peso = data.weight;
    this.#tipos = data.types.map(t => t.type.name);
    this.#habilidades = data.abilities.map(a => a.ability.name);
    this.#sprites = data.sprites;
    this.#stats = data.stats;
    this.#movimientos = data.moves.slice(0, 5).map(m => m.move.name);

    //debilidades: obtenidas desde el primer tipo
    this.#debilidades = tipoDetalles.damage_relations.double_damage_from.map(t => t.name);
  }

  getId() {
    return this.#id;
  }

  getNombre() {
    return this.#nombre;
  }

  getEspecie() {
    return this.#especie;
  }

  getAltura() {
    return this.#altura;
  }

  getPeso() {
    return this.#peso;
  }

  getTipos() {
    return this.#tipos;
  }

  getHabilidades() {
    return this.#habilidades;
  }

  getDebilidades() {
    return this.#debilidades;
  }

  getSprite() {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.#id}.png`;
}


  getStats() {
    return this.#stats.map(s => ({
      nombre: s.stat.name,
      valor: s.base_stat
    }));
  }

  getMovimientos() {
    return this.#movimientos;
  }

  getGif() {
    return this.#sprites.versions["generation-v"]["black-white"].animated.front_default;
  }
}
