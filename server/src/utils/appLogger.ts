import { createLogger, transports, format } from 'winston';
import path from 'path';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, '../../../logs/app.log') }),
        new transports.Console()
    ]
});

export default logger;