import { Pokedex } from "./pokedex.js";
import { crearBotonesFiltro } from "./filtroTipos.js";
import { crearBotonSubir } from "./volverBoton.js";
import { mostrarTarjetasBreves } from "./muestraTarjeta.js";

crearBotonSubir(); //crea el boton para volver al inicio
mostrarTarjetasBreves();
//crear la instancia
const poke = new Pokedex();
//inicia la pokedex
poke.init().then(() => {
  //cuando los datos estén listos crea los botones por tipo
  crearBotonesFiltro(poke); //pasa la instancia para que sepa que dibujar
});