import { Router } from 'express';
import tipoHabitacionController from '../controllers/tipoHabitacionesController';

class TipoHabitacionRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', tipoHabitacionController.list);
        this.router.get('/:id_tipo_habitacion', tipoHabitacionController.getOne);
        this.router.post('/', tipoHabitacionController.create);
        this.router.put('/:id_tipo_habitacion', tipoHabitacionController.update);
        this.router.delete('/:id_tipo_habitacion', tipoHabitacionController.delete);
    }
}

const tipoHabitacionRoutes = new TipoHabitacionRoutes();
export default tipoHabitacionRoutes.router;