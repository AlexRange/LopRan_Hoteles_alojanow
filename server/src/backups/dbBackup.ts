import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import mysql from 'promise-mysql';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const DB_NAME = process.env.DB_NAME!;
const DB_USER = process.env.DB_USER!;
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_TIMEZONE = process.env.DB_TIMEZONE || '-06:00';
const BACKUP_DIR = 'C:/backup';
const MYSQLDUMP_PATH = 'C:/xampp/mysql/bin/mysqldump.exe';

// Interfaces para los resultados
interface DeleteResult {
    affectedRows: number;
}

interface CountResult {
    count: number;
}

interface ServerTimeResult {
    now: string;
    db_timezone: string;
    system_time: string;
    formatted_date: string;
}

interface BackupResult {
    success: boolean;
    file?: string;
    error?: string;
}

interface CleanupResult {
    eliminados: number;
    errores: number;
}

// Tipos compatibles con promise-mysql
type QueryResult<T> = T & { [key: string]: any };

let pool: mysql.Pool;

// Inicialización del pool de conexiones
export async function initPool(): Promise<mysql.Pool> {
    if (!pool) {
        pool = await mysql.createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME,
            connectionLimit: 10,
            timezone: DB_TIMEZONE,
            dateStrings: true
        });
    }
    return pool;
}

// Función para verificar la configuración de tiempo del servidor
export async function verificarTiempoServidor(): Promise<ServerTimeResult> {
    await initPool();
    const conn = await pool.getConnection();
    try {
        const result = await conn.query<QueryResult<ServerTimeResult>[]>(`
            SELECT 
                NOW() as now,
                @@global.time_zone as db_timezone,
                TIMEDIFF(NOW(), UTC_TIMESTAMP()) as system_time,
                DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') as formatted_date
        `);
        return result[0];
    } finally {
        conn.release();
    }
}

// Función mejorada para eliminar usuarios inactivos
export async function eliminarUsuariosInactivos(): Promise<CleanupResult> {
    await initPool();
    const conn = await pool.getConnection();
    let eliminados = 0;
    let errores = 0;

    try {
        // 1. Verificar estructura de la tabla
        const estructuraTabla = await conn.query<QueryResult<any>[]>(`DESCRIBE usuarios`);
        console.log('Estructura de la tabla usuarios:', estructuraTabla);

        // 2. Verificar configuración de tiempo
        const tiempoServidor = await verificarTiempoServidor();
        console.log('Información del servidor:', tiempoServidor);

        // 3. Calcular fecha límite (1 año atrás)
        const fechaLimite = new Date(tiempoServidor.now);
        fechaLimite.setFullYear(fechaLimite.getFullYear() - 1);
        const fechaLimiteStr = fechaLimite.toISOString().slice(0, 19).replace('T', ' ');
        console.log(`Fecha límite para eliminación: ${fechaLimiteStr}`);

        // 4. Verificar datos existentes que cumplen el criterio
        const usuariosCumplen = await conn.query<QueryResult<any>[]>(
            `SELECT * FROM usuarios 
             WHERE ultimo_login IS NOT NULL 
             AND ultimo_login < ? 
             LIMIT 5`, // Limitar a 5 para muestra
            [fechaLimiteStr]
        );

        // 5. Iniciar transacción
        await conn.beginTransaction();

        try {
            // 6. Contar usuarios a eliminar
            const countResult = await conn.query<QueryResult<CountResult>[]>(
                `SELECT COUNT(*) as count FROM usuarios 
                 WHERE ultimo_login IS NOT NULL 
                 AND ultimo_login < ?`,
                [fechaLimiteStr]
            );
            console.log(`Total de usuarios que cumplen el criterio: ${countResult[0].count}`);

            // 7. Eliminar solo si hay registros
            if (countResult[0].count > 0) {
                const deleteResult = await conn.query<QueryResult<DeleteResult>>(
                    `DELETE FROM usuarios 
                     WHERE ultimo_login IS NOT NULL 
                     AND ultimo_login < ?`,
                    [fechaLimiteStr]
                );

                eliminados = deleteResult.affectedRows;
                console.log(`Usuarios eliminados: ${eliminados}`);

                // 8. Verificar eliminación
                const postDeleteCount = await conn.query<QueryResult<CountResult>[]>(
                    `SELECT COUNT(*) as count FROM usuarios 
                     WHERE ultimo_login IS NOT NULL 
                     AND ultimo_login < ?`,
                    [fechaLimiteStr]
                );
                console.log(`Usuarios restantes después de eliminación: ${postDeleteCount[0].count}`);

                await conn.commit();
            } else {
                await conn.commit();
            }
        } catch (error) {
            await conn.rollback();
            throw error;
        }
    } catch (error: any) {
        console.error('Error en el proceso completo:', error);
        errores = 1;
    } finally {
        conn.release();
    }

    return { eliminados, errores };
}

// Función para realizar backup
export async function realizarBackup(): Promise<BackupResult> {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${DB_NAME}-backup-${timestamp}.sql`;
        const backupPath = path.join(BACKUP_DIR, fileName);

        const cmd = DB_PASS.length > 0
            ? `"${MYSQLDUMP_PATH}" -u ${DB_USER} -p${DB_PASS} ${DB_NAME} > "${backupPath}"`
            : `"${MYSQLDUMP_PATH}" -u ${DB_USER} ${DB_NAME} > "${backupPath}"`;

        await new Promise<void>((resolve, reject) => {
            exec(cmd, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        console.log(`Backup completado: ${fileName}`);
        return { success: true, file: fileName };
    } catch (error: any) {
        console.error('Error en backup:', error.message);
        return { success: false, error: error.message };
    }
}

// Función para probar la conexión
export async function testDatabaseConnection(): Promise<boolean> {
    try {
        await initPool();
        const conn = await pool.getConnection();
        await conn.query('SELECT 1');
        conn.release();
        return true;
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        return false;
    }
}
