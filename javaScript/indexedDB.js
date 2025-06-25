// Configuración de IndexedDB
const DB_NAME = 'PokedexDB';
const DB_VERSION = 1;

// Object Stores
const ACCOMPANANTS_STORE = 'acompanantes';
const TRAINERS_STORE = 'entrenadores';

class IndexedDBManager { // Clase para manejar IndexedDB
    constructor() {
        this.db = null; // Base de datos
        this.initPromise = null; // Promesa de inicialización
    }

    async init() { // Inicializar IndexedDB
        // Evitar múltiples inicializaciones simultáneas
        if (this.initPromise) { // Si ya hay una promesa de inicialización en curso, esperar a que se resuelva
            return this.initPromise; // Esperar a que la promesa se resuelva
        }

        this.initPromise = new Promise((resolve, reject) => { // Crear una nueva promesa para la inicialización
            const request = indexedDB.open(DB_NAME, DB_VERSION); // Abrir la base de datos

            request.onerror = () => { // Manejar errores al abrir la base de datos
                console.error('Error al abrir IndexedDB:', request.error);
                reject('Error al abrir la base de datos');
            };

            request.onsuccess = (event) => { // Manejar éxito al abrir la base de datos
                this.db = event.target.result;
                console.log('IndexedDB inicializada correctamente');
                resolve();
            };

            request.onupgradeneeded = (event) => { // Manejar actualizaciones de la base de datos
                const db = event.target.result;
                console.log('Actualizando IndexedDB...');

                // Crear ObjectStore para acompañantes
                if (!db.objectStoreNames.contains(ACCOMPANANTS_STORE)) { // Verificar si el ObjectStore ya existe
                    const acompanantesStore = db.createObjectStore(ACCOMPANANTS_STORE, { keyPath: 'id' });
                    acompanantesStore.createIndex('nombre', 'nombre', { unique: false });
                    console.log('ObjectStore acompañantes creado');
                }

                // Crear ObjectStore para entrenadores
                if (!db.objectStoreNames.contains(TRAINERS_STORE)) { // Verificar si ObjectStore ya existe
                    const entrenadoresStore = db.createObjectStore(TRAINERS_STORE, { keyPath: 'id' });
                    entrenadoresStore.createIndex('nombre', 'nombre', { unique: false });
                    console.log('ObjectStore entrenadores creado');
                }
            };

            request.onblocked = () => { // Manejar el caso en que la base de datos está bloqueada
                console.warn('IndexedDB bloqueada, esperando...');
            };
        });

        return this.initPromise; // Retornar la promesa de inicialización
    }

    // Esperar a que la base de datos esté lista
    async waitForDB() { // Método para esperar a que la base de datos esté lista
        if (!this.db) { // Si la base de datos no está inicializada, llamar al método init
            await this.init(); // Esperar a que la base de datos se inicialice
        }
        return this.db; // Retornar la base de datos
    }

    // CRUD para Acompañantes
    async agregarAcompanante(pokemon) {
        const db = await this.waitForDB(); // Esperar a que la base de datos esté lista
        const transaction = db.transaction([ACCOMPANANTS_STORE], 'readwrite'); // Iniciar una transacción de escritura
        const store = transaction.objectStore(ACCOMPANANTS_STORE); // Obtener el ObjectStore de acompañantes

        const acompanante = { // Crear un objeto acompañante a partir del Pokémon
            id: pokemon.getId(),
            nombre: pokemon.getNombre(),
            especie: pokemon.getEspecie(),
            altura: pokemon.getAltura(),
            peso: pokemon.getPeso(),
            tipos: pokemon.getTipos(),
            habilidades: pokemon.getHabilidades(),
            debilidades: pokemon.getDebilidades(),
            sprite: pokemon.getSprite(),
            stats: pokemon.getStats(),
            movimientos: pokemon.getMovimientos(),
            fechaCaptura: new Date().toISOString()
        };

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.add(acompanante); // Agregar el acompañante al ObjectStore
            request.onsuccess = () => resolve(true); // Si la operación es exitosa, resolver la promesa
            request.onerror = () => reject('Error al agregar acompañante');
        });
    }

    async obtenerAcompanantes() { // Método para obtener todos los acompañantes
        const db = await this.waitForDB(); // Esperar a que la base de datos esté lista
        const transaction = db.transaction([ACCOMPANANTS_STORE], 'readonly'); // Iniciar una transacción de solo lectura
        const store = transaction.objectStore(ACCOMPANANTS_STORE); // Obtener el ObjectStore de acompañantes

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Error al obtener acompañantes');
        });
    }

    async eliminarAcompanante(id) { // Método para eliminar un acompañante por su ID
        const db = await this.waitForDB();
        const transaction = db.transaction([ACCOMPANANTS_STORE], 'readwrite');
        const store = transaction.objectStore(ACCOMPANANTS_STORE);

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject('Error al eliminar acompañante');
        });
    }

    async actualizarAcompanante(acompanante) {// Método para actualizar un acompañante
        const db = await this.waitForDB(); // Esperar a que la base de datos esté lista
        const transaction = db.transaction([ACCOMPANANTS_STORE], 'readwrite'); // Iniciar una transacción de escritura
        const store = transaction.objectStore(ACCOMPANANTS_STORE); // Obtener el ObjectStore de acompañantes

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.put(acompanante);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject('Error al actualizar acompañante');
        });
    }

    async verificarAcompanante(id) { // Método para verificar si un acompañante existe por su ID
        const db = await this.waitForDB();
        const transaction = db.transaction([ACCOMPANANTS_STORE], 'readonly');
        const store = transaction.objectStore(ACCOMPANANTS_STORE);

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject('Error al verificar acompañante');
        });
    }

    async contarAcompanantes() { // Método para contar el número de acompañantes
        const acompanantes = await this.obtenerAcompanantes(); // Obtener todos los acompañantes
        return acompanantes.length; // Retornar la cantidad de acompañantes
    }

    // CRUD para Entrenadores
    async obtenerEntrenadores() {
        const db = await this.waitForDB(); // Esperar a que la base de datos esté lista
        const transaction = db.transaction([TRAINERS_STORE], 'readonly'); // Iniciar una transacción de solo lectura
        const store = transaction.objectStore(TRAINERS_STORE); // Obtener el ObjectStore de entrenadores

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.getAll(); // Obtener todos los entrenadores
            request.onsuccess = () => {
                const entrenadores = request.result;
                // Si no hay entrenadores, crear los por defecto
                if (entrenadores.length === 0) { // Si no hay entrenadores, crear los por defecto
                    this.crearEntrenadoresPorDefecto().then(() => {// Esperar a que se creen los entrenadores por defecto
                        this.obtenerEntrenadores().then(resolve).catch(reject); // Volver a obtener los entrenadores después de crearlos
                    }).catch(reject);
                } else {
                    resolve(entrenadores);
                }
            };
            request.onerror = () => reject('Error al obtener entrenadores');
        });
    }

    async crearEntrenadoresPorDefecto() { // Método para crear entrenadores por defecto
        const db = await this.waitForDB(); 
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);
        
        return new Promise((resolve, reject) => {
            // Crear entrenadores por defecto si no existen
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
                const entrenadoresExistentes = getAllRequest.result; // Obtener todos los entrenadores existentes
                if (entrenadoresExistentes.length === 0) {
                    const entrenadoresPorDefecto = [
                        { // Crear entrenadores por defecto
                            id: 1,
                            nombre: "Isabel",
                            imagen: "https://avatars.githubusercontent.com/u/139247973?s=96&v=4",
                            pokemones: []
                        },
                        {
                            id: 2,
                            nombre: "Alisson",
                            imagen: "https://avatars.githubusercontent.com/u/94188688?s=96&v=4",
                            pokemones: []
                        },
                        {
                            id: 3,
                            nombre: "Diana",
                            imagen: "https://avatars.githubusercontent.com/u/131033714?s=400&u=dce8af828eac73b1c022f5f9c24b859b81af3c2b&v=4",
                            pokemones: []
                        },
                        {
                            id: 4,
                            nombre: "Osiris",
                            imagen: "https://avatars.githubusercontent.com/u/89263074?s=96&v=4",
                            pokemones: []
                        },
                        {
                            id: 5,
                            nombre: "Cesar",
                            imagen: "https://avatars.githubusercontent.com/u/144456953?s=96&v=4",
                            pokemones: []
                        }
                    ];

                    let completed = 0; // Contador de entrenadores creados
                    let hasError = false; // Bandera para manejar errores

                    entrenadoresPorDefecto.forEach(entrenador => { // Iterar sobre los entrenadores por defecto
                        const addRequest = store.add(entrenador); // Agregar cada entrenador al ObjectStore
                        addRequest.onsuccess = () => {
                            completed++;
                            if (completed === entrenadoresPorDefecto.length && !hasError) { // Si todos los entrenadores se han creado sin errores
                                console.log('Entrenadores por defecto creados');
                                resolve();
                            }
                        };
                        addRequest.onerror = () => {
                            if (!hasError) {
                                hasError = true;
                                reject('Error al crear entrenadores por defecto');
                            }
                        };
                    });
                } else {
                    // Verificar si los entrenadores existentes tienen las imágenes antiguas y actualizarlas automáticamente
                    const primerEntrenador = entrenadoresExistentes[0]; // Obtener el primer entrenador existente
                    if (primerEntrenador && primerEntrenador.imagen && primerEntrenador.imagen.includes('../img/Ash.png')) {
                        console.log('Detectadas imágenes antiguas, actualizando automáticamente...');
                        this.limpiarYRecrearEntrenadores() // Llamar a la función para limpiar y recrear entrenadores con las nuevas imágenes
                            .then(() => resolve())
                            .catch(error => reject(error));
                    } else {
                        resolve();
                    }
                }
            };
            getAllRequest.onerror = () => {
                reject('Error al verificar entrenadores existentes');
            };
        });
    }

    async agregarEntrenador(entrenador) { // Método para agregar un nuevo entrenador
        const db = await this.waitForDB();
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.add(entrenador);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject('Error al agregar entrenador');
        });
    }

    async eliminarEntrenador(id) { // Método para eliminar un entrenador por su ID
        const db = await this.waitForDB();
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.delete(id); // Eliminar el entrenador por su ID
            request.onsuccess = () => {
                console.log('Entrenador eliminado:', id);
                resolve(true);
            };
            request.onerror = () => reject('Error al eliminar entrenador');
        });
    }

    async actualizarEntrenador(entrenador) { // Método para actualizar un entrenador
        const db = await this.waitForDB();
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);

        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const request = store.put(entrenador);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject('Error al actualizar entrenador');
        });
    }

    // Nueva función: asignar pokémon a un entrenador
    async asignarPokemonAEntrenador(idEntrenador, idPokemon) { 
        const db = await this.waitForDB(); // Esperar a que la base de datos esté lista
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite'); // Iniciar una transacción de escritura
        const store = transaction.objectStore(TRAINERS_STORE); // Obtener el ObjectStore de entrenadores
        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const getRequest = store.get(idEntrenador); // Obtener el entrenador por su ID
            getRequest.onsuccess = () => {
                const entrenador = getRequest.result;
                if (!entrenador) return reject('Entrenador no encontrado');
                if (!entrenador.pokemones) entrenador.pokemones = []; // Inicializar el array de pokemones si no existe
                if (entrenador.pokemones.includes(idPokemon)) {
                    return reject('Este Pokémon ya está asignado a este entrenador');
                }
                if (entrenador.pokemones.length >= 6) { // Verificar si el entrenador ya tiene 6 Pokémon
                    return reject('Este entrenador ya tiene 6 Pokémon');
                }
                entrenador.pokemones.push(idPokemon); // Asignar el Pokémon al entrenador
                const updateRequest = store.put(entrenador); // Actualizar el entrenador en la base de datos
                updateRequest.onsuccess = () => resolve(true); // Si la operación es exitosa, resolver la promesa
                updateRequest.onerror = () => reject('Error al asignar Pokémon');
            };
            getRequest.onerror = () => reject('Error al buscar entrenador');
        });
    }

    // Nueva función: desasignar pokémon de un entrenador
    async desasignarPokemonDeEntrenador(idEntrenador, idPokemon) {
        const db = await this.waitForDB();
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);
        return new Promise((resolve, reject) => { // Retornar una promesa para manejar la operación asíncrona
            const getRequest = store.get(idEntrenador); // Obtener el entrenador por su ID
            getRequest.onsuccess = () => {
                const entrenador = getRequest.result;
                if (!entrenador) return reject('Entrenador no encontrado');
                if (!entrenador.pokemones) entrenador.pokemones = []; // Inicializar el array de pokemones si no existe
                entrenador.pokemones = entrenador.pokemones.filter(id => id !== idPokemon); // Desasignar el Pokémon del entrenador
                const updateRequest = store.put(entrenador); // Actualizar el entrenador en la base de datos
                updateRequest.onsuccess = () => resolve(true);
                updateRequest.onerror = () => reject('Error al desasignar Pokémon');
            };
            getRequest.onerror = () => reject('Error al buscar entrenador');
        });
    }

    // Nueva función: obtener entrenadores con sus pokemones
    async obtenerEntrenadoresConPokemones() {
        return this.obtenerEntrenadores();
    }

    // Función para limpiar y recrear entrenadores 
    async limpiarYRecrearEntrenadores() {
        const db = await this.waitForDB();
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);
        
        return new Promise((resolve, reject) => {
            // Limpiar todos los entrenadores existentes // Limpiar el ObjectStore de entrenadores
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => {
                // Crear entrenadores con las nuevas imágenes de GitHub
                const entrenadoresPorDefecto = [ // Lista de entrenadores por defecto con imágenes actualizadas
                    {
                        id: 1,
                        nombre: "Isabel",
                        imagen: "https://avatars.githubusercontent.com/u/123456789?size=200",
                        pokemones: []
                    },
                    {
                        id: 2,
                        nombre: "Alisson",
                        imagen: "https://avatars.githubusercontent.com/u/987654321?size=200",
                        pokemones: []
                    },
                    {
                        id: 3,
                        nombre: "Diana",
                        imagen: "https://avatars.githubusercontent.com/u/456789123?size=200",
                        pokemones: []
                    },
                    {
                        id: 4,
                        nombre: "Osiris",
                        imagen: "https://avatars.githubusercontent.com/u/789123456?size=200",
                        pokemones: []
                    },
                    {
                        id: 5,
                        nombre: "Cesar",
                        imagen: "https://avatars.githubusercontent.com/u/321654987?size=200",
                        pokemones: []
                    }
                ];

                let completed = 0;
                let hasError = false;

                entrenadoresPorDefecto.forEach(entrenador => { // Iterar sobre los entrenadores por defecto
                    const addRequest = store.add(entrenador); // Agregar cada entrenador al ObjectStore
                    addRequest.onsuccess = () => {
                        completed++;
                        if (completed === entrenadoresPorDefecto.length && !hasError) { // Si todos los entrenadores se han creado sin errores
                            console.log('Entrenadores recreados con imágenes de GitHub');
                            resolve();
                        }
                    };
                    addRequest.onerror = () => {
                        if (!hasError) {
                            hasError = true;
                            reject('Error al recrear entrenadores');
                        }
                    };
                });
            };
            clearRequest.onerror = () => {
                reject('Error al limpiar entrenadores');
            };
        });
    }

    // Función para crear un nuevo entrenador
    async crearNuevoEntrenador(nombre, imagenGitHub, rol = 'Entrenador Pokémon') {
        const db = await this.waitForDB();
        const transaction = db.transaction([TRAINERS_STORE], 'readwrite');
        const store = transaction.objectStore(TRAINERS_STORE);
        
        return new Promise((resolve, reject) => {
            // Primero obtener todos los entrenadores para calcular el siguiente ID
            const getAllRequest = store.getAll();
            getAllRequest.onsuccess = () => {
                const entrenadores = getAllRequest.result;
                const siguienteId = entrenadores.length > 0 ? Math.max(...entrenadores.map(e => e.id)) + 1 : 1;
                
                // Crear el nuevo entrenador
                const nuevoEntrenador = {
                    id: siguienteId,
                    nombre: nombre,
                    imagen: imagenGitHub,
                    pokemones: [],
                    rol: rol
                };
                
                // Agregar el nuevo entrenador
                const addRequest = store.add(nuevoEntrenador);
                addRequest.onsuccess = () => {
                    console.log('Nuevo entrenador creado:', nuevoEntrenador);
                    resolve(nuevoEntrenador);
                };
                addRequest.onerror = () => {
                    reject('Error al crear el entrenador');
                };
            };
            getAllRequest.onerror = () => {
                reject('Error al obtener entrenadores existentes');
            };
        });
    }
}

// Exportar una instancia única
export const dbManager = new IndexedDBManager(); 