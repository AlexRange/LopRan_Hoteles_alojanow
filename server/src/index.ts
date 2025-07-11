import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import fs from 'fs';
import https from 'https';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
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

let authLimiter: RateLimitRequestHandler;

class Server {
    public app: Application;
    private httpsServer: https.Server = {} as https.Server;

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
        this.app.set('httpsPort', process.env.HTTPS_PORT || 443);

        // 1. Configuración básica de seguridad con helmet
        this.app.use(helmet());

        // 2. Configuración personalizada de CSP y otros headers
        this.app.use((req, res, next) => {
            // Configuración específica de Content Security Policy
            res.setHeader(
                'Content-Security-Policy',
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: blob:; " +
                "font-src 'self'; " +
                "connect-src 'self'; " +
                "form-action 'self'; " +
                "frame-ancestors 'none'"
            );

            // Headers adicionales
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

            next();
        });

        // 3. Configuración de Rate Limiting
        const generalLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 200,
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                success: false,
                message: "Demasiadas peticiones desde esta IP"
            },
            skip: (req) => req.path === '/api/health'
        });

        // Configuración para authLimiter (ahora asignando a la variable declarada)
        authLimiter = rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 20,
            message: {
                success: false,
                message: "Demasiados intentos de autenticación"
            }
        });

        // Middlewares
        this.app.use(morgan('dev'));
        this.app.use(cors({
            origin: ['https://localhost:4200'], // Ajusta según tu frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            exposedHeaders: ['Content-Security-Policy', 'X-Content-Type-Options']
        }));

        // Aplicar rate limiting general a todas las rutas
        this.app.use(generalLimiter);

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
        // Aplicar rate limiting específico a rutas sensibles
        this.app.use('/api/login', authLimiter, loginRoutes);
        this.app.use('/api/otp', authLimiter, otpRoutes);

        // Rutas normales con rate limiting general
        this.app.use('/api/usuarios', UsuariosRoutes);
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
        this.app.use('/api/tipos-habitacion', tipoHabitacionRoutes);

        // Health check endpoint (sin rate limiting)
        this.app.get('/api/health', (req, res) => {
            res.status(200).json({ status: 'OK', https: true });
        });
    }

    start() {
        // Configuración SSL
        const sslOptions = {
            key: fs.readFileSync(path.join(__dirname, '../key.pem')),
            cert: fs.readFileSync(path.join(__dirname, '../cert.pem')),
        };

        // Crear servidor HTTPS
        this.httpsServer = https.createServer(sslOptions, this.app);

        this.httpsServer.listen(this.app.get('port'), () => {
            console.log(`Servidor HTTPS corriendo en https://localhost:${this.app.get('port')}`);
        });
}
}

const server = new Server();
server.start();