//esta funcion crea la tarjeta html del pokemon
export function tarjetaPokemon(pokemon) {
    //creando el contenedor princpipla de la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-pokedex");//nombre de la clase

    //toma el primer tipo del pokemon para poder asignar el color
    const tipoPrincipal = pokemon.getTipos()[0];
    tarjeta.classList.add(`tipo-${tipoPrincipal}`);

    //nombre del pokemon
    const nombre = document.createElement("h3");
    nombre.textContent = letra(pokemon.getNombre());//usa la funcion llamada "letra" para que la primera letra sea mayuscula
    tarjeta.appendChild(nombre);

    //crea la imagen
    const imagen = document.createElement("img");
    imagen.src = pokemon.getSprite();
    tarjeta.appendChild(imagen);

    //muestra en texto todos los datos y usa la funcion letra
    const datos = [
        ["Especie", letra(pokemon.getEspecie())],
        ["Altura", pokemon.getAltura()],
        ["Peso", pokemon.getPeso()],
        ["Tipos", pokemon.getTipos().map(letra).join(", ")],
        ["Habilidades", pokemon.getHabilidades().map(letra).join(", ")],
        ["Debilidades", pokemon.getDebilidades().map(letra).join(", ")],
        ["Movimientos", pokemon.getMovimientos().map(letra).join(", ")]
    ]

    //creando parrafos para mostrar los datos
    datos.forEach(([titulo, valor]) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${titulo}:`;
        p.appendChild(strong);
        p.appendChild(document.createTextNode(valor));
        tarjeta.appendChild(p);
    });

    //contenedor para las estadisticas
    const statsContenedor = document.createElement("div");
    statsContenedor.classList.add("stats");

    //crea el parrado y muestra la estadistica
    pokemon.getStats().forEach(st => {
        const parrafostat = document.createElement("p");
        parrafostat.textContent = letra(`${st.nombre}: ${st.valor}`);
        statsContenedor.appendChild(parrafostat);
    });

    tarjeta.appendChild(statsContenedor);

    return tarjeta;
}

//funcion para colocar en mayuscula la primera letra del texto
function letra(ltr) {
    return ltr.charAt(0).toUpperCase() + ltr.slice(1);
}