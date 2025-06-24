import { agregarAcompanante } from './acompanantes.js'; 

export function tarjetaPokemon(pokemon) {
    // Contenedor externo con perspective
    const contenedor3D = document.createElement("div");
    contenedor3D.classList.add("tarjeta-3d-wrapper");

    // Tarjeta principal
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-pokedex");

    const primerTipo = pokemon.getTipos()[0];
    tarjeta.classList.add(`tipo-${primerTipo}`);

    // Nombre
    const nombre = document.createElement("h3");
    nombre.textContent = letra(pokemon.getNombre());
    tarjeta.appendChild(nombre);

    // ID
    const id = document.createElement("p");
    id.classList.add("id-pokemon");
    id.textContent = `#${pokemon.getId().toString().padStart(3, "0")}`;
    tarjeta.appendChild(id);

    // Imagen
    const contenedorImg = document.createElement("div");
    contenedorImg.classList.add("contenedor-imagen");

    const circuloFondo = document.createElement("div");
    circuloFondo.classList.add("circulo-fondo");

    const imagen = document.createElement("img");
    imagen.src = pokemon.getSprite();

    contenedorImg.appendChild(circuloFondo);
    contenedorImg.appendChild(imagen);
    tarjeta.appendChild(contenedorImg);

    // Tipos
    const datos = [
        ["", pokemon.getTipos().map(tipo => {
            const span = document.createElement("span");
            span.classList.add("texto-fondo-tipo", `tipo-${tipo}`);
            span.textContent = letra(tipo);
            return span;
        })]
    ];

    datos.forEach(([titulo, valor]) => {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${titulo} `;
        p.appendChild(strong);

        if (Array.isArray(valor)) {
            valor.forEach(el => p.appendChild(el));
        } else {
            p.appendChild(document.createTextNode(valor));
        }

        tarjeta.appendChild(p);
    });

    contenedor3D.appendChild(tarjeta);

    // Evento 3D — rotar tarjeta dentro del wrapper con perspectiva
    contenedor3D.addEventListener("mousemove", (e) => {
        const rect = contenedor3D.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = -(y - centerY) / 5;
        const rotateY = (x - centerX) / 5;
        tarjeta.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    contenedor3D.addEventListener("mouseleave", () => {
        tarjeta.style.transform = "rotateX(0deg) rotateY(0deg)";
    });

    // Click para abrir modal
    contenedor3D.addEventListener("click", () => {
        crearModalPokemon(pokemon);
    });

    return contenedor3D;
}

//funcion para colocar en mayuscula la primera letra del texto
function letra(ltr) {
    return ltr.charAt(0).toUpperCase() + ltr.slice(1);
}
const gifsTipos = {
  fire: "../gif/fire.gif",
  water: "../gif/water.gif",
  grass: "../gif/grass.gif",
  bug: "../gif/bug.gif",
  dragon: "../gif/dragon.gif",
  normal: "../gif/normal.gif",
  poison: "../gif/poison.gif",
  electric: "../gif/electric.gif",
  ground: "../gif/normal.gif",
  fairy: "../gif/fairy.gif",
  fighting: "../gif/fighting.gif",
  psychic: "../gif/normal.gif",
  rock: "../gif/normal.gif",
  ice: "../gif/ice.gif",
  ghost: "../gif/ghost.gif"
};

export function crearModalPokemon(pokemon) {
  const tipo = pokemon.getTipos()[0].toLowerCase(); // tipo principal
  const gifSrc = gifsTipos[tipo] || gifsTipos["default"];

  // Mostrar animación GIF antes del modal
  const gifAnimacion = document.createElement("img");
  gifAnimacion.src = gifSrc;
  gifAnimacion.classList.add("gif-animacion");
  document.body.appendChild(gifAnimacion);

  const audio = new Audio("../audio/pokemon.mp3");
    audio.currentTime = 1; 
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 5000);

  setTimeout(() => {
    document.body.removeChild(gifAnimacion);

    const modalFondo = document.createElement("div");
    modalFondo.classList.add("modal-fondo");

    const modalContenido = document.createElement("div");
    modalContenido.classList.add("modal-pokemon", `tipo-${tipo}`);

    // Header
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
    nombre.classList.add("modal-nombre");
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

    // Body
    const body = document.createElement("div");
    body.classList.add("modal-body");

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
          ["🦸‍♂️ Species", letra(pokemon.getEspecie())],
          ["📏 Height", `${pokemon.getAltura()} m`],
          ["⚖️ Weight", `${pokemon.getPeso()} kg`],
          ["🔮 Types", pokemon.getTipos().map(letra).join(", ")],
          ["✨ Abilities", pokemon.getHabilidades().map(letra).join(", ")],
          ["⚔️ Weaknesses", pokemon.getDebilidades().map(letra).join(", ")],
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

          const valor = stat.valor;
          const porcentaje = valor / 2;
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
        pokemon.getMovimientos().forEach(mov => {
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
        tabButtons.forEach(b => b.classList.remove("active"));
        tabSections.forEach(s => s.classList.remove("active"));
        btn.classList.add("active");
        tabSections[i].classList.add("active");
      });
    });

    body.appendChild(tabs);
    body.appendChild(contenido);

    modalContenido.appendChild(header);
    modalContenido.appendChild(body);
    
   // Boton atrapar
  const botonAtrapar = document.createElement("button"); 
  botonAtrapar.classList.add("boton-atrapar");
  botonAtrapar.textContent = "Atrapar";

  // Contenedor para centrar el boton
  const contenedorBoton = document.createElement("div");
  contenedorBoton.style.display = "flex";
  contenedorBoton.style.justifyContent = "center";
  contenedorBoton.style.margin = "1rem 0";

  // Evento para atrapar
  botonAtrapar.addEventListener("click", (event) => {
    event.stopPropagation(); // evitar que se abra modal si tienes ese evento
    const agregado = agregarAcompanante(pokemon);
    if (agregado) {
      botonAtrapar.textContent = "Atrapado";
      botonAtrapar.disabled = true;
    }
  });

  contenedorBoton.appendChild(botonAtrapar);
    modalContenido.appendChild(body);
    modalContenido.appendChild(contenedorBoton);
    modalFondo.appendChild(modalContenido);
    document.body.appendChild(modalFondo);
  }, 1000);
}

// FUNCION ACTUALIZADA: ahora acepta índice para efecto baraja
export function muestratarjeta(pokemon, index = 0) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-breve");

    // Aqui se aplica la variable CSS --i con valor simetrico (-X a +X)
    tarjeta.style.setProperty('--i', index);

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

