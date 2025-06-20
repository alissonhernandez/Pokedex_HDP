//esta funcion crea la tarjeta html del pokemon
export function tarjetaPokemon(pokemon) {
    //creando el contenedor princpipal de la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-pokedex");//nombre de la clase

    //toma el primer tipo del pokemon para poder asignar el color
    const tipoPrincipal = pokemon.getTipos()[0];
    tarjeta.classList.add(`tipo-${tipoPrincipal}`);

    //nombre del pokemon
    const nombre = document.createElement("h3");
    nombre.textContent = letra(pokemon.getNombre());//usa la funcion llamada "letra" para que la primera letra sea mayuscula
    tarjeta.appendChild(nombre);

    const contenedorImg = document.createElement("div");
    contenedorImg.classList.add("contenedor-imagen");

    const circuloFondo = document.createElement("div");
    circuloFondo.classList.add("circulo-fondo");

    const imagen = document.createElement("img");
    imagen.src = pokemon.getSprite();

    contenedorImg.appendChild(circuloFondo);
    contenedorImg.appendChild(imagen);
    tarjeta.appendChild(contenedorImg);

    //muestra en texto todos los datos y usa la funcion letra
    const datos = [
        ["Especie", letra(pokemon.getEspecie())],
        ["Tipos", pokemon.getTipos().map(tipo => {
            const span = document.createElement("span");
            span.classList.add("texto-fondo-tipo", `tipo-${tipo}`);
            span.textContent = letra(tipo);
            return span;
        })]
    ]

//creando parrafos para mostrar los datos
    datos.forEach(([titulo, valor]) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${titulo}: `;
        p.appendChild(strong);

        if (Array.isArray(valor)) {
            valor.forEach(el => p.appendChild(el));
        } else {
            p.appendChild(document.createTextNode(valor));
        }

        tarjeta.appendChild(p);
    });

    const boton = document.createElement("button");
    boton.textContent = "Asignar Pokémon";
    boton.classList.add("boton-acompanante");
    tarjeta.appendChild(boton);
    return tarjeta;
}

//funcion para colocar en mayuscula la primera letra del texto
function letra(ltr) {
    return ltr.charAt(0).toUpperCase() + ltr.slice(1);
}




