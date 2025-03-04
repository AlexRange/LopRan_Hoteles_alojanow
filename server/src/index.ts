import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';

import comentariosRoutes from './routes/comentariosRoutes';
import habitacionesRoutes from './routes/habitacionesRoutes';
import hotelesRoutes from './routes/hotelesRoutes';
import loginRoutes from './routes/loginRoutes';
import pagosRoutes from './routes/PagosRoutes';
import promocionesRoutes from './routes/promocionesRoutes';
import reservacionesHabitacionesRoutes from './routes/reservacionesHbitacionesRoutes'
import reservacionesServiciosRoutes from './routes/reservacionesServiciosRoutes';
import UsuariosRoutes from './routes/usuariosRoutes';
import serviciosAdicionalesRoutes from './routes/serviciosAdicionalesRoutes';

class Server {
    public app : Application

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config():void{
        this.app.set('port',process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    }

    routes(): void {
        this.app.use('/api/users', UsuariosRoutes);
        this.app.use('/api/login', loginRoutes);
        this.app.use('/api/reservaciones', reservacionesHabitacionesRoutes);
        this.app.use('/api/comentarios', comentariosRoutes);
        this.app.use('/api/habitaciones', habitacionesRoutes);
        this.app.use('/api/hoteles', hotelesRoutes);
        this.app.use('/api/pagos', pagosRoutes);
        this.app.use('/api/promociones', promocionesRoutes);
        this.app.use('/api/reservacionesSer', reservacionesServiciosRoutes);
        this.app.use('/api/serviciosAd', serviciosAdicionalesRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();