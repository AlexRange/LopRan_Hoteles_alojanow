import path from 'path';
import dotenv from 'dotenv';
import { realizarBackup, eliminarUsuariosInactivos } from './dbBackup';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function ejecutarProcesoManual() {
    try {
        console.log('=== INICIANDO PROCESO MANUAL ===');
        
        // Ejecutar backup
        console.log('Realizando backup...');
        const backupResult = await realizarBackup();
        console.log('Backup resultado:', backupResult);
        
        // Ejecutar limpieza
        console.log('Eliminando usuarios inactivos...');
        const limpiezaResult = await eliminarUsuariosInactivos();
        
        
        console.log('=== PROCESO COMPLETADO ===');
    } catch (error) {
        console.error('Error en proceso manual:', error);
    }
}

ejecutarProcesoManual();