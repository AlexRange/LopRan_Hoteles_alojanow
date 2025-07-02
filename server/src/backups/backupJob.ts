import cron from 'node-cron';
import { eliminarUsuariosInactivos, realizarBackup } from './dbBackup';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Programar tarea diaria
cron.schedule('22 7 * * *', async () => {
    console.log('[CRON] Iniciando proceso automatizado...');
    
    try {
        // 1. Realizar backup primero (por seguridad)
        console.log('[CRON] Ejecutando respaldo de seguridad...');
        const backupResult = await realizarBackup();
        
        if (!backupResult.success) {
            throw new Error('Falló el backup: ' + backupResult.error);
        }

        // 2. Eliminar usuarios inactivos
        console.log('[CRON] Limpiando usuarios inactivos...');
        const { eliminados, errores } = await eliminarUsuariosInactivos();
        
        console.log(`[CRON] Proceso completado. Usuarios eliminados: ${eliminados}, Errores: ${errores}`);
    } catch (error) {
        console.error('[CRON ERROR]', error);
    }
});

console.log('Programador de tareas iniciado. Esperando ejecución programada...');