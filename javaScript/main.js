import { Pokedex } from "./pokedex.js";
import { crearBotonesFiltro } from "./filtroTipos.js";
//crear la instancia
const poke = new Pokedex();
poke.dibujarPokedex();
crearBotonesFiltro(poke);//agrega botones