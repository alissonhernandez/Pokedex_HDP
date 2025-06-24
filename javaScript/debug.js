// Archivo de depuración para verificar el estado del sistema

export function debugIndexedDB() {
    console.log('=== DEBUG INDEXEDDB ===');
    
    // Verificar si IndexedDB está disponible
    if (!window.indexedDB) {
        console.error('IndexedDB no está disponible en este navegador');
        return;
    }
    
    console.log('IndexedDB está disponible');
    
    // Verificar las bases de datos existentes
    const request = indexedDB.databases();
    request.then(databases => {
        console.log('Bases de datos existentes:', databases);
    }).catch(error => {
        console.log('No se pueden listar las bases de datos:', error);
    });
}

export function debugDOM() {
    console.log('=== DEBUG DOM ===');
    
    const elementos = [
        'acompanantes',
        'entrenadores',
        'pokedex',
        'muestraTarjeta'
    ];
    
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        console.log(`Elemento #${id}:`, elemento ? 'ENCONTRADO' : 'NO ENCONTRADO');
        if (elemento) {
            console.log(`  - Clases: ${elemento.className}`);
            console.log(`  - Visible: ${elemento.offsetParent !== null}`);
        }
    });
}

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