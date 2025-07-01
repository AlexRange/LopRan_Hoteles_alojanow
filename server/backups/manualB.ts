import path from 'path';
import dotenv from 'dotenv';

// Carga dotenv con ruta explícita al .env en la raíz
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { performBackup } from './dbBackup';

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

performBackup();
