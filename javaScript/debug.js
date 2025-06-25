// Archivo de depuración para verificar el estado del sistema

// Función para depurar el estado de IndexedDB
export function debugIndexedDB() {
    console.log('=== DEBUG INDEXEDDB ===');
    
   // Verifica si el navegador soporta IndexedDB
    if (!window.indexedDB) {
        console.error('IndexedDB no está disponible en este navegador');
        return;
    }
    
    console.log('IndexedDB está disponible');
    
    // Verificar las bases de datos existentes
    const request = indexedDB.databases();
    request.then(databases => { // Si la solicitud es exitosa, imprime las bases de datos
        console.log('Bases de datos existentes:', databases);
    }).catch(error => {  // Si ocurre un error, lo muestra en consola
        console.log('No se pueden listar las bases de datos:', error);
    });
}

// Función para depurar elementos del DOM importantes
export function debugDOM() {
    console.log('=== DEBUG DOM ===');
    // Lista de IDs de elementos que se desea verificar
    const elementos = [
        'acompanantes',
        'entrenadores',
        'pokedex',
        'muestraTarjeta'
    ];
    // Recorre cada ID y verifica si existe en el DOM
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        console.log(`Elemento #${id}:`, elemento ? 'ENCONTRADO' : 'NO ENCONTRADO');
        if (elemento) { // Si el elemento existe, muestra sus clases y si está visible
            console.log(`  - Clases: ${elemento.className}`);
            console.log(`  - Visible: ${elemento.offsetParent !== null}`);
        }
    });
}

// Función para mostrar información general de la página
export function debugPageInfo() {
    console.log('=== DEBUG PÁGINA ===');
    console.log('URL actual:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Título:', document.title);
    console.log('Elementos <script> cargados:', document.querySelectorAll('script').length);
}

// Función para ejecutar toda la depuración
export function runDebug() {
    console.log('Iniciando depuración...');
    debugPageInfo();
    debugDOM();
    debugIndexedDB();
    console.log('Depuración completada');
} 