import { Router } from 'express';

import habitacionesController from '../controllers/habitacionesController';

class HabitacionesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', habitacionesController.list);
        this.router.get('/:id', habitacionesController.getOne);
        this.router.post('/', habitacionesController.create);
        this.router.put('/:id', habitacionesController.update);
        this.router.delete('/:id', habitacionesController.delete);
    }

}

const habitacionesRoutes = new HabitacionesRoutes();
export default habitacionesRoutes.router;