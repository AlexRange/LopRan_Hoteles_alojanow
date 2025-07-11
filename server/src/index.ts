import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import fs from "fs";
import https from "https";
import morgan from 'morgan';
import path from 'path';

import comentariosRoutes from './routes/comentariosRoutes';
import habitacionesRoutes from './routes/habitacionesRoutes';
import hotelesRoutes from './routes/hotelesRoutes';
import hotelesServiciosRoutes from './routes/hotelServiciosRoutes';
import loginRoutes from './routes/loginRoutes';
import otpRoutes from './routes/optRoutes';
import pagosRoutes from './routes/PagosRoutes';
import promocionesRoutes from './routes/promocionesRoutes';
import recaptchaRoutes from './routes/recaptchaRoutes';
import reservacionesHabitacionesRoutes from './routes/reservacionesHbitacionesRoutes';
import reservacionesServiciosRoutes from './routes/reservacionesServiciosRoutes';
import serviciosAdicionalesRoutes from './routes/serviciosAdicionalesRoutes';
import UsuariosRoutes from './routes/usuariosRoutes';
import tipoHabitacionRoutes from './routes/tipoHabitacionesRoutes';


class Server {
    public app: Application

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'https://localhost:4200'); // URL de tu frontend
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false, limit: '10mb' }));
        // Serve static files from uploads directory
        this.app.use('/api/uploads/usuarios', express.static(path.join(__dirname, '../uploads/usuarios')));
        this.app.use('/api/uploads/hoteles', express.static(path.join(__dirname, '../uploads/hoteles')));
        this.app.use('/api/uploads/habitaciones', express.static(path.join(__dirname, '../uploads/habitaciones')));

        // Create upload directories if they don't exist
        const uploadsBaseDir = path.join(__dirname, '../uploads');
        const usuariosDir = path.join(uploadsBaseDir, 'usuarios');
        const hotelesDir = path.join(uploadsBaseDir, 'hoteles');
        const habitacionesDir = path.join(uploadsBaseDir, 'habitaciones');

        // Create directories recursively
        [uploadsBaseDir, usuariosDir, hotelesDir, habitacionesDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
        // Cors configuration
             this.app.use(cors({
        origin: 'https://localhost:4200', // URL exacta de tu frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true, // Si usas cookies/tokens
        optionsSuccessStatus: 200 // Para navegadores antiguos
    }));

    // Manejo explícito de preflight OPTIONS
    this.app.options('*', cors());
    }

    routes(): void {
        this.app.use('/api/usuarios', UsuariosRoutes);
        this.app.use('/api/login', loginRoutes);
        this.app.use('/api/reservaciones', reservacionesHabitacionesRoutes);
        this.app.use('/api/comentarios', comentariosRoutes);
        this.app.use('/api/habitaciones', habitacionesRoutes);
        this.app.use('/api/hoteles', hotelesRoutes);
        this.app.use('/api/pagos', pagosRoutes);
        this.app.use('/api/promociones', promocionesRoutes);
        this.app.use('/api/reservacionesSer', reservacionesServiciosRoutes);
        this.app.use('/api/serviciosAd', serviciosAdicionalesRoutes);
        this.app.use('/api/hoteles-servicios', hotelesServiciosRoutes);
        this.app.use('/api/recaptcha', recaptchaRoutes);
        this.app.use('/api/otp', otpRoutes);
        this.app.use('/api/tipos-habitacion', tipoHabitacionRoutes);
    }

    start() {
    const options = {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem')
    };

    https.createServer(options, this.app)
        .listen(this.app.get('port'), '0.0.0.0', () => {
            console.log(`Servidor HTTPS en https://api.localhost:${this.app.get('port')}`);
        });
}
}

const server = new Server();
server.start();