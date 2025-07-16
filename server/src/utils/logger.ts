import fs from 'fs';
import path from 'path';

const suspiciousLogPath = path.join(__dirname, '../../../logs/suspicious.log');

export function logSuspiciousActivity(ip: string, reason: string) {
    const log = `[${new Date().toISOString()}] IP: ${ip} - ${reason}\n`;
    fs.appendFileSync(suspiciousLogPath, log);
    console.warn(log.trim());
}