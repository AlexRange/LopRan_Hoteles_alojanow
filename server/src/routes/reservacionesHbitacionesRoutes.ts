import { Router } from 'express';

import reservacionesHabitacionesController from '../controllers/reservacionesHabitacionesController';

class ReservacionesHabitacionesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', reservacionesHabitacionesController.list);
        this.router.get('/:id_reservacion',reservacionesHabitacionesController.getOne);
        this.router.get('/usuario/:id_usuario',reservacionesHabitacionesController.getReservacionesByIdUsuario);
        this.router.post('/',reservacionesHabitacionesController.create);
        this.router.put('/:id_reservacion',reservacionesHabitacionesController.update);
        this.router.delete('/:id_reservacion',reservacionesHabitacionesController.delete);
    }

}

const reservacionesHabitacionesRoutes = new ReservacionesHabitacionesRoutes();
export default reservacionesHabitacionesRoutes.router;