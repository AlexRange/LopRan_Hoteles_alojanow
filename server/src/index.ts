import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';

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


class Server {
    public app : Application

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config():void{
        this.app.set('port',process.env.PORT || 4000);
        this.app.use(cors({
            origin: ['https://alojanow.web.app', 'https://alojanow.firebaseapp.com', 'http://localhost:4200'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false, limit: '10mb' }));
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
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();