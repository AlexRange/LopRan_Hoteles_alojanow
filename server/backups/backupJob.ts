import cron from 'node-cron';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME!;
const DB_USER = process.env.DB_USER!;
const DB_PASS = process.env.DB_PASS || '';
const BACKUP_DIR = 'C:/backup';
const MYSQLDUMP_PATH = 'C:/xampp/mysql/bin/mysqldump.exe';

cron.schedule('0 6 * * *', () => {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${DB_NAME}-backup-${timestamp}.sql`;
    const backupPath = path.join(BACKUP_DIR, fileName);

    const cmd = DB_PASS.length > 0
        ? `"${MYSQLDUMP_PATH}" -u ${DB_USER} -p${DB_PASS} ${DB_NAME} > "${backupPath}"`
        : `"${MYSQLDUMP_PATH}" -u ${DB_USER} ${DB_NAME} > "${backupPath}"`;

    exec(cmd, (error) => {
        if (error) {
            console.error('Error en respaldo automático:', error.message);
        } else {
            console.log(`Respaldo diario completado: ${fileName}`);
        }
    });
});
