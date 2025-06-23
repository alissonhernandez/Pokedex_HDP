import { tarjetaPokemon } from './html.js'; 
import { dbManager } from './indexedDB.js';

const STORAGE_KEY = "pokemonesAcompanantes";
let entrenadoresCache = [];

export function obtenerAcompanantes() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function guardarAcompanantes(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function mostrarPokebolaGif() {
  const gif = document.createElement("img");
  gif.src = "../gif/atrapar.gif"; 
  gif.classList.add("pokebola-gif");

  // Crear y reproducir el audio
  const audio = document.createElement("audio");
  audio.src = "../audio/atrapar.mp3"; 
  audio.volume = 0.8;
  audio.play();

  document.body.appendChild(gif);

  // Duración total: 2s de gif + 1s de animación de salida = 3s
  setTimeout(() => {
    gif.classList.add("desaparecer");

    // Después de animación de salida (1s)
    setTimeout(() => {
      gif.remove();

      // Detener y eliminar el audio
      audio.pause();
      audio.currentTime = 0;
      audio.remove();
    }, 1000);
  }, 2000);
}

export async function agregarAcompanante(pokemon) {
  try {
    // Verificar si ya existe
    const existente = await dbManager.verificarAcompanante(pokemon.getId());
    if (existente) {
    alert("Este Pokémon ya es un acompañante.");
    return false;
  }

    // Verificar límite de 6 acompañantes
    const cantidad = await dbManager.contarAcompanantes();
    if (cantidad >= 6) {
    alert("Solo puedes tener hasta 6 acompañantes.");
    return false;
  }

    // Agregar a IndexedDB
    await dbManager.agregarAcompanante(pokemon);
    alert(`${pokemon.getNombre()} fue atrapado como acompañante.`);
    mostrarPokebolaGif();
    
    // Actualizar la vista
    await mostrarAcompanantes();
  return true;
  } catch (error) {
    console.error('Error al agregar acompañante:', error);
    alert('Error al agregar acompañante');
    return false;
  }
}

export async function mostrarAcompanantes() {
  const contenedor = document.getElementById("acompanantes");
  if (!contenedor) {
    console.warn('Elemento #acompanantes no encontrado');
    return;
  }
  contenedor.innerHTML = "";

  try {
    const lista = await dbManager.obtenerAcompanantes();
    // Actualizar el cache de entrenadores para tener la información más reciente
    entrenadoresCache = await dbManager.obtenerEntrenadores();

    // Filtrar pokémon que NO están asignados a ningún entrenador
    const pokemonesNoAsignados = lista.filter(acompanante => {
      return !entrenadoresCache.some(entrenador => 
        entrenador.pokemones && entrenador.pokemones.includes(acompanante.id)
      );
    });

    if (pokemonesNoAsignados.length === 0) {
      contenedor.innerHTML = `
        <div class="mensaje-vacio">
          <h3>No tienes acompañantes disponibles</h3>
          <p>Todos tus pokémon han sido asignados a entrenadores o no tienes acompañantes atrapados.</p>
        </div>
      `;
      return;
    }

    // Crear contenedor principal
    const contenedorPrincipal = document.createElement("div");
    contenedorPrincipal.classList.add("contenedor-principal");

    // Título de la sección
    const titulo = document.createElement("h2");
    titulo.textContent = "Acompañantes Disponibles";
    titulo.classList.add("titulo-seccion");
    contenedorPrincipal.appendChild(titulo);

    // Contenedor de tarjetas
    const contenedorTarjetas = document.createElement("div");
    contenedorTarjetas.classList.add("contenedor-tarjetas");

    pokemonesNoAsignados.forEach(acompanante => {
      const tarjeta = crearTarjetaAcompanante(acompanante);
      contenedorTarjetas.appendChild(tarjeta);
    });

    contenedorPrincipal.appendChild(contenedorTarjetas);
    contenedor.appendChild(contenedorPrincipal);
  } catch (error) {
    console.error('Error al mostrar acompañantes:', error);
    contenedor.innerHTML = '<p>Error al cargar acompañantes</p>';
  }
}

function crearTarjetaAcompanante(acompanante) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-acompanante");

  // Aplicar clase de tipo para el color
  const tipoPrincipal = acompanante.tipos[0];
  tarjeta.classList.add(`tipo-${tipoPrincipal}`);

  // Contenido de la tarjeta
  tarjeta.innerHTML = `
    <div class="tarjeta-header">
      <h3>${letra(acompanante.nombre)}</h3>
      <span class="numero-id">#${String(acompanante.id).padStart(3, "0")}</span>
    </div>
    
    <div class="contenedor-imagen">
      <div class="circulo-fondo"></div>
      <img src="${acompanante.sprite}" alt="${acompanante.nombre}">
    </div>

    <div class="tarjeta-info">
      <p><strong>Especie:</strong> ${letra(acompanante.especie)}</p>
      <p><strong>Tipos:</strong> ${acompanante.tipos.map(tipo => 
        `<span class="texto-fondo-tipo tipo-${tipo}">${letra(tipo)}</span>`
      ).join(' ')}</p>
      <p><strong>Altura:</strong> ${acompanante.altura} m</p>
      <p><strong>Peso:</strong> ${acompanante.peso} kg</p>
      <p><strong>Fecha de captura:</strong> ${new Date(acompanante.fechaCaptura).toLocaleDateString()}</p>
    </div>
    <div class="tarjeta-acciones">
      <button class="boton-ver" onclick="verDetallesAcompanante(${acompanante.id})">
        Ver Detalles
      </button>
      <button class="boton-editar" onclick="editarAcompanante(${acompanante.id})">
        Editar
      </button>
      <button class="boton-eliminar" onclick="eliminarAcompanante(${acompanante.id})">
        Liberar
      </button>
      <button class="boton-asignar" data-id="${acompanante.id}">
        Asignar a entrenador
      </button>
    </div>
  `;

  // Botón para asignar a entrenador
  const botonAsignar = tarjeta.querySelector('.boton-asignar');
  botonAsignar.addEventListener('click', () => mostrarModalAsignarEntrenador(acompanante));

  return tarjeta;
}

function mostrarModalAsignarEntrenador(acompanante) {
  // Modal para elegir entrenador
  const modal = document.createElement('div');
  modal.classList.add('modal-fondo');

  const contenido = document.createElement('div');
  contenido.classList.add('modal-edicion');
  contenido.innerHTML = `
    <div class="modal-header">
      <h2>Asignar a entrenador</h2>
      <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
    </div>
    <div class="modal-body">
      <form id="form-asignar-entrenador">
        <div class="form-grupo">
          <label>Selecciona un entrenador:</label>
          <select id="select-entrenador" required>
            <option value="">-- Selecciona --</option>
            <option value="loading">Cargando entrenadores...</option>
          </select>
        </div>
        <div class="form-acciones">
          <button type="submit" class="boton-guardar">Asignar</button>
          <button type="button" class="boton-cancelar" onclick="this.closest('.modal-fondo').remove()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  modal.appendChild(contenido);
  document.body.appendChild(modal);

  // Cargar entrenadores actualizados
  cargarEntrenadoresEnSelect();

  // Manejar el formulario
  const form = modal.querySelector('#form-asignar-entrenador');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idEntrenador = parseInt(document.getElementById('select-entrenador').value);
    if (!idEntrenador || idEntrenador === 'loading') return;
    try {
      await dbManager.asignarPokemonAEntrenador(idEntrenador, acompanante.id);
      alert('Pokémon asignado correctamente');
      modal.remove();
      await mostrarAcompanantes();
      await mostrarEntrenadores(); // Actualizar entrenadores
    } catch (error) {
      alert(error);
    }
  });
}

// Función para cargar entrenadores en el select
async function cargarEntrenadoresEnSelect() {
  try {
    const entrenadores = await dbManager.obtenerEntrenadores();
    const select = document.getElementById('select-entrenador');
    
    if (select) {
      // Limpiar opciones existentes
      select.innerHTML = '<option value="">-- Selecciona --</option>';
      
      // Agregar entrenadores
      entrenadores.forEach(entrenador => {
        const cantidadPokemon = entrenador.pokemones ? entrenador.pokemones.length : 0;
        const option = document.createElement('option');
        option.value = entrenador.id;
        option.textContent = `${entrenador.nombre} (${cantidadPokemon}/6)`;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar entrenadores en select:', error);
    const select = document.getElementById('select-entrenador');
    if (select) {
      select.innerHTML = '<option value="">Error al cargar entrenadores</option>';
    }
  }
}

export async function mostrarEntrenadores() {
  const contenedor = document.getElementById("entrenadores");
  if (!contenedor) {
    console.warn('Elemento #entrenadores no encontrado');
    return;
  }

  contenedor.innerHTML = "";

  try {
    const lista = await dbManager.obtenerEntrenadores();
    // Actualizar el cache de entrenadores
    entrenadoresCache = lista;

    // Crear contenedor principal
    const contenedorPrincipal = document.createElement("div");
    contenedorPrincipal.classList.add("contenedor-principal");

    // Título de la sección con botón
    const tituloContainer = document.createElement("div");
    tituloContainer.classList.add("titulo-con-boton");
    
    const titulo = document.createElement("h2");
    titulo.textContent = "Entrenadores del Equipo";
    titulo.classList.add("titulo-seccion");
    
    const botonNuevo = document.createElement("button");
    botonNuevo.textContent = "➕ Nuevo Entrenador";
    botonNuevo.classList.add("boton-nuevo-entrenador");
    botonNuevo.onclick = mostrarModalNuevoEntrenador;
    
    tituloContainer.appendChild(titulo);
    tituloContainer.appendChild(botonNuevo);
    contenedorPrincipal.appendChild(tituloContainer);

    // Contenedor de tarjetas
    const contenedorTarjetas = document.createElement("div");
    contenedorTarjetas.classList.add("contenedor-tarjetas");

    lista.forEach(entrenador => {
      const tarjeta = crearTarjetaEntrenador(entrenador);
      contenedorTarjetas.appendChild(tarjeta);
    });

    contenedorPrincipal.appendChild(contenedorTarjetas);
    contenedor.appendChild(contenedorPrincipal);
  } catch (error) {
    console.error('Error al mostrar entrenadores:', error);
    contenedor.innerHTML = '<p>Error al cargar entrenadores</p>';
  }
}

function crearTarjetaEntrenador(entrenador) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-entrenador");

  const cantidadPokemon = entrenador.pokemones ? entrenador.pokemones.length : 0;
  const rol = entrenador.rol ? entrenador.rol : 'Entrenador Pokémon';

  tarjeta.innerHTML = `
    <div class="tarjeta-header">
      <h3>${entrenador.nombre}</h3>
      <span class="numero-id">#${String(entrenador.id).padStart(3, "0")}</span>
    </div>
    
    <div class="contenedor-imagen">
      <div class="circulo-fondo"></div>
      <img src="${entrenador.imagen}" alt="${entrenador.nombre}" onerror="this.src='../img/Ash.png'">
    </div>

    <div class="tarjeta-info">
      <p><strong>Rol:</strong> ${rol}</p>
      <p><strong>Equipo:</strong> Pokedex HDP</p>
      <p><strong>Acompañantes:</strong> ${cantidadPokemon}/6</p>
    </div>

    <div class="tarjeta-acciones">
      <button class="boton-ver" onclick="verPokemonesEntrenador(${entrenador.id})">
        Ver Acompañantes
      </button>
      <button class="boton-editar" onclick="editarEntrenador(${entrenador.id})">
        Editar
      </button>
      <button class="boton-eliminar" onclick="eliminarEntrenador(${entrenador.id})">
        Eliminar
      </button>
    </div>
  `;

  return tarjeta;
}

// Funciones globales para los botones
window.verDetallesAcompanante = async function(id) {
  try {
    const acompanante = await dbManager.verificarAcompanante(id);
    if (acompanante) {
      mostrarModalDetalles(acompanante, 'acompanante');
    }
  } catch (error) {
    console.error('Error al ver detalles:', error);
  }
};

window.editarAcompanante = async function(id) {
  try {
    const acompanante = await dbManager.verificarAcompanante(id);
    if (acompanante) {
      mostrarModalEdicion(acompanante, 'acompanante');
    }
  } catch (error) {
    console.error('Error al editar:', error);
  }
};

window.eliminarAcompanante = async function(id) {
  if (confirm('¿Estás seguro de que quieres liberar este Pokémon?')) {
    try {
      await dbManager.eliminarAcompanante(id);
      alert('Pokémon liberado exitosamente');
      await mostrarAcompanantes();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al liberar Pokémon');
    }
  }
};

window.verPokemonesEntrenador = async function(idEntrenador) {
  try {
    const entrenador = entrenadoresCache.find(e => e.id === idEntrenador);
    if (!entrenador) {
      alert('Entrenador no encontrado');
      return;
    }

    if (!entrenador.pokemones || entrenador.pokemones.length === 0) {
      alert(`${entrenador.nombre} no tiene pokémon acompañantes asignados.`);
      return;
    }

    // Obtener detalles de los pokémon asignados
    const pokemonesAsignados = [];
    for (const idPokemon of entrenador.pokemones) {
      try {
        const pokemon = await dbManager.verificarAcompanante(idPokemon);
        if (pokemon) {
          pokemonesAsignados.push(pokemon);
        }
      } catch (error) {
        console.error(`Error al obtener pokémon ${idPokemon}:`, error);
      }
    }

    mostrarModalPokemonesEntrenador(entrenador, pokemonesAsignados);
  } catch (error) {
    console.error('Error al ver pokémon del entrenador:', error);
    alert('Error al cargar los pokémon del entrenador');
  }
};

function mostrarModalPokemonesEntrenador(entrenador, pokemones) {
  const modal = document.createElement('div');
  modal.classList.add('modal-fondo');

  const contenido = document.createElement('div');
  contenido.classList.add('modal-detalles');
  contenido.innerHTML = `
    <div class="modal-header">
      <h2>Acompañantes de ${entrenador.nombre}</h2>
      <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
    </div>
    <div class="modal-body">
      <div class="pokemones-entrenador">
        ${pokemones.map(pokemon => `
          <div class="pokemon-item">
            <img src="${pokemon.sprite}" alt="${pokemon.nombre}" class="pokemon-mini" onerror="this.src='../img/Ash.png'">
            <div class="pokemon-info">
              <h4>${letra(pokemon.nombre)}</h4>
              <p>#${String(pokemon.id).padStart(3, "0")} - ${letra(pokemon.especie)}</p>
              <div class="tipos-pokemon">
                ${pokemon.tipos.map(tipo => 
                  `<span class="texto-fondo-tipo tipo-${tipo}">${letra(tipo)}</span>`
                ).join(' ')}
              </div>
            </div>
            <button class="boton-desasignar" onclick="desasignarPokemon(${entrenador.id}, ${pokemon.id})">
              Desasignar
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  modal.appendChild(contenido);
  document.body.appendChild(modal);
}

window.desasignarPokemon = async function(idEntrenador, idPokemon) {
  if (confirm('¿Estás seguro de que quieres desasignar este pokémon?')) {
    try {
      await dbManager.desasignarPokemonDeEntrenador(idEntrenador, idPokemon);
      alert('Pokémon desasignado correctamente');
      await mostrarAcompanantes();
      await mostrarEntrenadores();
      // Cerrar el modal actual
      const modal = document.querySelector('.modal-fondo');
      if (modal) modal.remove();
    } catch (error) {
      alert('Error al desasignar pokémon: ' + error);
    }
  }
};

function mostrarModalDetalles(item, tipo) {
  const modal = document.createElement("div");
  modal.classList.add("modal-fondo");
  
  const contenido = document.createElement("div");
  contenido.classList.add("modal-detalles");
  
  if (tipo === 'acompanante') {
    contenido.innerHTML = `
      <div class="modal-header">
        <h2>${letra(item.nombre)}</h2>
        <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
      </div>
      <div class="modal-body">
        <img src="${item.sprite}" alt="${item.nombre}" class="modal-imagen">
        <div class="detalles-info">
          <p><strong>Especie:</strong> ${letra(item.especie)}</p>
          <p><strong>Tipos:</strong> ${item.tipos.map(tipo => 
            `<span class="texto-fondo-tipo tipo-${tipo}">${letra(tipo)}</span>`
          ).join(' ')}</p>
          <p><strong>Habilidades:</strong> ${item.habilidades.map(letra).join(', ')}</p>
          <p><strong>Debilidades:</strong> ${item.debilidades.map(letra).join(', ')}</p>
          <p><strong>Altura:</strong> ${item.altura} m</p>
          <p><strong>Peso:</strong> ${item.peso} kg</p>
          <p><strong>Fecha de captura:</strong> ${new Date(item.fechaCaptura).toLocaleDateString()}</p>
        </div>
      </div>
    `;
  }
  
  modal.appendChild(contenido);
  document.body.appendChild(modal);
}

function mostrarModalEdicion(item, tipo) {
  const modal = document.createElement("div");
  modal.classList.add("modal-fondo");
  
  const contenido = document.createElement("div");
  contenido.classList.add("modal-edicion");
  
  if (tipo === 'acompanante') {
    contenido.innerHTML = `
      <div class="modal-header">
        <h2>Editar Acompañante</h2>
        <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
      </div>
      <div class="modal-body">
        <div class="preview-pokemon">
          <img src="${item.sprite}" alt="${item.nombre}" class="pokemon-preview">
          <div class="pokemon-info-preview">
            <h3>#${String(item.id).padStart(3, "0")}</h3>
            <div class="tipos-preview">
              ${item.tipos.map(tipo => 
                `<span class="texto-fondo-tipo tipo-${tipo}">${letra(tipo)}</span>`
              ).join(' ')}
            </div>
          </div>
        </div>
        <form id="form-edicion">
          <div class="form-grupo">
            <label>Nombre personalizado:</label>
            <input type="text" id="edit-nombre" value="${item.nombre}" placeholder="Ej: Mi Pikachu" required>
            <small class="form-help">Puedes darle un nombre personalizado a tu Pokémon</small>
          </div>
          <div class="form-grupo">
            <label>Especie:</label>
            <input type="text" id="edit-especie" value="${item.especie || ''}" placeholder="Ej: Ratón Eléctrico" required>
            <small class="form-help">La especie o tipo de Pokémon</small>
          </div>
          <div class="form-grupo">
            <label>Altura (metros):</label>
            <input type="number" id="edit-altura" value="${item.altura}" step="0.1" min="0.1" max="20" required>
            <small class="form-help">Altura en metros (0.1 - 20)</small>
          </div>
          <div class="form-grupo">
            <label>Peso (kg):</label>
            <input type="number" id="edit-peso" value="${item.peso}" step="0.1" min="0.1" max="1000" required>
            <small class="form-help">Peso en kilogramos (0.1 - 1000)</small>
          </div>
          <div class="form-grupo">
            <label>Fecha de captura:</label>
            <input type="date" id="edit-fecha" value="${new Date(item.fechaCaptura).toISOString().split('T')[0]}" required>
            <small class="form-help">Fecha cuando capturaste este Pokémon</small>
          </div>
          <div class="form-acciones">
            <button type="submit" class="boton-guardar">💾 Guardar Cambios</button>
            <button type="button" class="boton-cancelar" onclick="this.closest('.modal-fondo').remove()">❌ Cancelar</button>
          </div>
        </form>
      </div>
    `;
  } else {
    // Para entrenadores (mantener la implementación original)
    contenido.innerHTML = `
      <div class="modal-header">
        <h2>Editar Entrenador</h2>
        <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
      </div>
      <div class="modal-body">
        <form id="form-edicion">
          <div class="form-grupo">
            <label>Nombre:</label>
            <input type="text" id="edit-nombre" value="${item.nombre}" required>
          </div>
          <div class="form-grupo">
            <label>Especie:</label>
            <input type="text" id="edit-especie" value="${item.especie || ''}" ${tipo === 'acompanante' ? 'required' : ''}>
          </div>
          <div class="form-acciones">
            <button type="submit" class="boton-guardar">Guardar</button>
            <button type="button" class="boton-cancelar" onclick="this.closest('.modal-fondo').remove()">Cancelar</button>
          </div>
        </form>
      </div>
    `;
  }
  
  modal.appendChild(contenido);
  document.body.appendChild(modal);
  
  // Manejar el formulario
  const form = modal.querySelector('#form-edicion');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      if (tipo === 'acompanante') {
        // Obtener todos los valores del formulario
        const nombre = document.getElementById('edit-nombre').value.trim();
        const especie = document.getElementById('edit-especie').value.trim();
        const altura = parseFloat(document.getElementById('edit-altura').value);
        const peso = parseFloat(document.getElementById('edit-peso').value);
        const fecha = document.getElementById('edit-fecha').value;
        
        // Validaciones
        if (!nombre) {
          alert('Por favor, ingresa un nombre para tu Pokémon');
          return;
        }
        
        if (!especie) {
          alert('Por favor, ingresa la especie del Pokémon');
          return;
        }
        
        if (isNaN(altura) || altura < 0.1 || altura > 20) {
          alert('Por favor, ingresa una altura válida entre 0.1 y 20 metros');
          return;
        }
        
        if (isNaN(peso) || peso < 0.1 || peso > 1000) {
          alert('Por favor, ingresa un peso válido entre 0.1 y 1000 kg');
          return;
        }
        
        if (!fecha) {
          alert('Por favor, selecciona una fecha de captura');
          return;
        }
        
        // Actualizar el objeto del acompañante
        item.nombre = nombre;
        item.especie = especie;
        item.altura = altura;
        item.peso = peso;
        item.fechaCaptura = new Date(fecha).toISOString();
        
        // Guardar en IndexedDB
        await dbManager.actualizarAcompanante(item);
        
        alert('✅ ¡Acompañante actualizado exitosamente!');
        modal.remove();
        await mostrarAcompanantes();
      } else {
        // Para entrenadores (mantener la implementación original)
        const nombre = document.getElementById('edit-nombre').value;
        const especie = document.getElementById('edit-especie').value;
        
        item.nombre = nombre;
        item.especie = especie;
        await dbManager.actualizarEntrenador(item);
        
        alert('Cambios guardados exitosamente');
        modal.remove();
        await mostrarEntrenadores();
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('❌ Error al guardar cambios: ' + error.message);
    }
  });
}

// Función auxiliar para capitalizar
function letra(ltr) {
  return ltr.charAt(0).toUpperCase() + ltr.slice(1);
}

// Función para editar entrenador
window.editarEntrenador = async function(id) {
  try {
    const entrenador = entrenadoresCache.find(e => e.id === id);
    if (!entrenador) {
      alert('Entrenador no encontrado');
      return;
    }
    
    // Mostrar modal de edición para entrenador
    mostrarModalEdicionEntrenador(entrenador);
  } catch (error) {
    console.error('Error al editar entrenador:', error);
    alert('Error al cargar datos del entrenador');
  }
};

// Función específica para mostrar modal de edición de entrenador
function mostrarModalEdicionEntrenador(entrenador) {
  const modal = document.createElement('div');
  modal.classList.add('modal-fondo');
  
  const contenido = document.createElement('div');
  contenido.classList.add('modal-edicion');
  
  contenido.innerHTML = `
    <div class="modal-header">
      <h2>Editar Entrenador</h2>
      <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
    </div>
    <div class="modal-body">
      <div class="preview-entrenador">
        <img src="${entrenador.imagen}" alt="${entrenador.nombre}" class="entrenador-preview" onerror="this.src='../img/Ash.png'">
        <div class="entrenador-info-preview">
          <h3>#${String(entrenador.id).padStart(3, "0")}</h3>
          <p class="rol-entrenador">Entrenador Pokémon</p>
          <p class="equipo-entrenador">Equipo: Pokedex HDP</p>
        </div>
      </div>
      <form id="form-edicion-entrenador">
        <div class="form-grupo">
          <label>Nombre del Entrenador:</label>
          <input type="text" id="edit-nombre-entrenador" value="${entrenador.nombre}" placeholder="Ej: Juan Pérez" required>
          <small class="form-help">Nombre completo del entrenador</small>
        </div>
        <div class="form-grupo">
          <label>URL de Imagen:</label>
          <input type="url" id="edit-imagen-entrenador" value="${entrenador.imagen}" placeholder="https://ejemplo.com/imagen.jpg">
          <small class="form-help">
            💡 URL de la imagen del entrenador. Si no funciona, se usará la imagen de Ash por defecto.
          </small>
        </div>
        <div class="form-grupo">
          <label>Rol en el Equipo:</label>
          <input type="text" id="edit-rol-entrenador" value="Entrenador Pokémon" placeholder="Ej: Líder de Gimnasio" required>
          <small class="form-help">Rol o especialidad del entrenador</small>
        </div>
        <div class="form-acciones">
          <button type="submit" class="boton-guardar">💾 Guardar Cambios</button>
          <button type="button" class="boton-cancelar" onclick="this.closest('.modal-fondo').remove()">❌ Cancelar</button>
        </div>
      </form>
    </div>
  `;
  
  modal.appendChild(contenido);
  document.body.appendChild(modal);
  
  // Manejar el formulario
  const form = modal.querySelector('#form-edicion-entrenador');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      // Obtener valores del formulario
      const nombre = document.getElementById('edit-nombre-entrenador').value.trim();
      const imagenUrl = document.getElementById('edit-imagen-entrenador').value.trim();
      const rol = document.getElementById('edit-rol-entrenador').value.trim();
      
      // Validaciones
      if (!nombre) {
        alert('Por favor, ingresa el nombre del entrenador');
        return;
      }
      
      if (!rol) {
        alert('Por favor, ingresa el rol del entrenador');
        return;
      }
      
      // Actualizar el objeto del entrenador
      entrenador.nombre = nombre;
      entrenador.imagen = imagenUrl || '../img/Ash.png';
      entrenador.rol = rol;
      
      // Guardar en IndexedDB
      await dbManager.actualizarEntrenador(entrenador);
      
      alert('✅ ¡Entrenador actualizado exitosamente!');
      modal.remove();
      
      // Actualizar el cache y las vistas
      await mostrarEntrenadores();
      await mostrarAcompanantes(); // Para actualizar el cache de entrenadores
    } catch (error) {
      console.error('Error al guardar entrenador:', error);
      alert('❌ Error al guardar cambios: ' + error.message);
    }
  });
}

// Función para mostrar modal de nuevo entrenador
window.mostrarModalNuevoEntrenador = function() {
  const modal = document.createElement('div');
  modal.classList.add('modal-fondo');

  const contenido = document.createElement('div');
  contenido.classList.add('modal-edicion');
  contenido.innerHTML = `
    <div class="modal-header">
      <h2>Crear Nuevo Entrenador</h2>
      <span class="cerrar-modal" onclick="this.closest('.modal-fondo').remove()">&times;</span>
    </div>
    <div class="modal-body">
      <form id="form-nuevo-entrenador">
        <div class="form-grupo">
          <label>Nombre del Entrenador: <span class="requerido">*</span></label>
          <input type="text" id="nombre-entrenador" placeholder="Ej: Juan Pérez" required>
        </div>
        <div class="form-grupo">
          <label>URL de Imagen (opcional):</label>
          <input type="url" id="imagen-github" placeholder="https://ejemplo.com/imagen.jpg">
          <small class="form-help">
            💡 Puedes usar cualquier URL de imagen. Si no proporcionas una imagen o la URL no funciona, 
            se usará la imagen de Ash por defecto.
          </small>
        </div>
        <div class="form-acciones">
          <button type="submit" class="boton-guardar">Crear Entrenador</button>
          <button type="button" class="boton-cancelar" onclick="this.closest('.modal-fondo').remove()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  modal.appendChild(contenido);
  document.body.appendChild(modal);

  // Manejar el formulario
  const form = modal.querySelector('#form-nuevo-entrenador');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre-entrenador').value.trim();
    const imagenUrl = document.getElementById('imagen-github').value.trim();
    let rol = 'Entrenador Pokémon';
    // Si quieres permitir que el usuario elija el rol al crear, puedes agregar un input en el formulario y leerlo aquí

    if (!nombre) {
      alert('Por favor, ingresa el nombre del entrenador');
      return;
    }

    // Si no hay imagen, usar la de Ash por defecto
    const imagenFinal = imagenUrl || '../img/Ash.png';

    try {
      await dbManager.crearNuevoEntrenador(nombre, imagenFinal, rol);
      alert('¡Entrenador creado exitosamente!');
      modal.remove();
      // Actualizar el cache y las vistas
      await mostrarEntrenadores();
      await mostrarAcompanantes(); // Para actualizar el cache de entrenadores
    } catch (error) {
      console.error('Error al crear entrenador:', error);
      alert('Error al crear el entrenador: ' + error.message);
    }
  });
};

// Función para eliminar entrenador
window.eliminarEntrenador = async function(id) {
  try {
    const entrenador = entrenadoresCache.find(e => e.id === id);
    if (!entrenador) {
      alert('Entrenador no encontrado');
      return;
    }

    // Verificar si tiene pokémon asignados
    if (entrenador.pokemones && entrenador.pokemones.length > 0) {
      if (!confirm(`¿Estás seguro de que quieres eliminar a ${entrenador.nombre}? Tiene ${entrenador.pokemones.length} pokémon asignados que serán liberados.`)) {
        return;
      }
    } else {
      if (!confirm(`¿Estás seguro de que quieres eliminar a ${entrenador.nombre}?`)) {
        return;
      }
    }

    await dbManager.eliminarEntrenador(id);
    alert('Entrenador eliminado correctamente');
    // Actualizar el cache y las vistas
    await mostrarEntrenadores();
    await mostrarAcompanantes(); // Para actualizar el cache de entrenadores
  } catch (error) {
    console.error('Error al eliminar entrenador:', error);
    alert('Error al eliminar el entrenador: ' + error.message);
  }
};

