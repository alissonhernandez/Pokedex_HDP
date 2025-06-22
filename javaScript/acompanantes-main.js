import { mostrarAcompanantes, mostrarEntrenadores } from './acompanantes.js';
import { dbManager } from './indexedDB.js';
import { runDebug } from './debug.js';
import { crearBotonSubir } from './volverBoton.js';

// Función principal para inicializar la página de acompañantes
async function inicializarPaginaAcompanantes() {
    console.log('Iniciando página de acompañantes...');
    
    // Ejecutar depuración
    runDebug();
    
    try {
        // Crear botón subir (funcionalidad que estaba en main.js)
        crearBotonSubir();
        
        // Esperar a que IndexedDB esté listo
        console.log('Inicializando IndexedDB...');
        await dbManager.init();
        console.log('IndexedDB inicializada correctamente');
        
        // Mostrar acompañantes y entrenadores
        console.log('Cargando acompañantes...');
        await mostrarAcompanantes();
        console.log('Acompañantes cargados');
        
        console.log('Cargando entrenadores...');
        await mostrarEntrenadores();
        console.log('Entrenadores cargados');
        
        console.log('Página de acompañantes inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la página de acompañantes:', error);
        
        // Mostrar mensaje de error en la página
        const contenedor = document.getElementById("acompanantes");
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="mensaje-error">
                    <h3>Error al cargar los datos</h3>
                    <p>No se pudieron cargar los acompañantes. Por favor, recarga la página.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
        
        // También mostrar en la consola para depuración
        console.error('Detalles del error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarPaginaAcompanantes); 