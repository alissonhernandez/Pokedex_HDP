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

    tarjeta.addEventListener("click", () => {
        crearModalPokemon(pokemon);
    });

    tarjeta.appendChild(boton);
    return tarjeta;
}

//funcion para colocar en mayuscula la primera letra del texto
function letra(ltr) {
    return ltr.charAt(0).toUpperCase() + ltr.slice(1);
}

export function crearModalPokemon(pokemon) {
  const modalFondo = document.createElement("div");
  modalFondo.classList.add("modal-fondo");

  const modalContenido = document.createElement("div");
  modalContenido.classList.add("modal-pokemon", `tipo-${pokemon.getTipos()[0]}`);

  // header
  const header = document.createElement("div");
  header.classList.add("modal-header");

  const mediaLuna = document.createElement("div");
  mediaLuna.classList.add("media-luna-fondo");
  header.appendChild(mediaLuna);

  const botonCerrar = document.createElement("span");
  botonCerrar.classList.add("cerrar-modal");
  botonCerrar.innerHTML = "&times;";
  botonCerrar.addEventListener("click", () => document.body.removeChild(modalFondo));
  header.appendChild(botonCerrar);

  const nombre = document.createElement("h2");
  nombre.textContent = letra(pokemon.getNombre());
  header.appendChild(nombre);

  const numero = document.createElement("p");
  numero.classList.add("numero-id");
  numero.textContent = `#${String(pokemon.getId()).padStart(3, "0")}`;
  header.appendChild(numero);

  const imagen = document.createElement("img");
  imagen.classList.add("modal-img");
  imagen.src = pokemon.getGif ? pokemon.getGif() : pokemon.getSprite();
  header.appendChild(imagen);

  // body
  const body = document.createElement("div");
  body.classList.add("modal-body");

  // tabs
  const tabs = document.createElement("div");
  tabs.classList.add("modal-tabs");

  const tabNames = ["About", "Base Stats", "Moves"];
  const tabButtons = [];
  const tabSections = [];

  const contenido = document.createElement("div");
  contenido.classList.add("tab-contenido");

  tabNames.forEach((name, index) => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.classList.add("tab-btn");
    if (index === 0) btn.classList.add("active");
    tabs.appendChild(btn);
    tabButtons.push(btn);

    const section = document.createElement("div");
    section.classList.add("tab-seccion");
    if (index === 0) section.classList.add("active");

    if (name === "About") {
      const datos = [
        ["Species", letra(pokemon.getEspecie())],
        ["Height", `${pokemon.getAltura()} m`],
        ["Weight", `${pokemon.getPeso()} kg`],
        ["Types", pokemon.getTipos().map(letra).join(", ")],
        ["Abilities", pokemon.getHabilidades().map(letra).join(", ")],
        ["Weaknesses", pokemon.getDebilidades().map(letra).join(", ")],
      ];
      datos.forEach(([t, v]) => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${t}:</strong> ${v}`;
        section.appendChild(p);
      });
    } else if (name === "Base Stats") {
      pokemon.getStats().forEach(stat => {
        const statRow = document.createElement("div");
        statRow.classList.add("barra-stat");
        
        // Determinar el color segun el valor
        const valor = stat.valor;
        const porcentaje = valor / 2; 

        // Crear el div de la barra con clases de color según el valor
        const colorClase = valor < 50 ? "rojo" : "verde";
        
        statRow.innerHTML = `
        <label>${letra(stat.nombre)}</label>
        <div class="barra-externa">
        <div class="barra-interna ${colorClase}" style="width:${porcentaje}%;"></div>
        </div>
        <span>${valor}</span>
        `;
        
        section.appendChild(statRow);
    });

    } else if (name === "Moves") {
      const lista = document.createElement("ul");
      lista.classList.add("lista-movimientos");
      pokemon.getMovimientos().forEach((mov) => {
        const li = document.createElement("li");
        li.textContent = letra(mov);
        lista.appendChild(li);
      });
      section.appendChild(lista);
    }

    contenido.appendChild(section);
    tabSections.push(section);
  });

  tabButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabSections.forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      tabSections[i].classList.add("active");
    });
  });

  body.appendChild(tabs);
  body.appendChild(contenido);

  // Agregar header y body al modal
  modalContenido.appendChild(header);
  modalContenido.appendChild(body);

  modalFondo.appendChild(modalContenido);
  document.body.appendChild(modalFondo);
}

export function muestratarjeta(pokemon) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-breve");

    const tipoPrincipal = pokemon.getTipos()[0];
    tarjeta.classList.add(`tipo-${tipoPrincipal}`);

    const nombre = document.createElement("h3");
    nombre.textContent = letra(pokemon.getNombre());
    tarjeta.appendChild(nombre);

    const imagen = document.createElement("img");
    const gif = pokemon.getGif ? pokemon.getGif() : pokemon.getSprite();
    imagen.src = gif;
    imagen.alt = pokemon.getNombre();
    tarjeta.appendChild(imagen);

    return tarjeta;
}