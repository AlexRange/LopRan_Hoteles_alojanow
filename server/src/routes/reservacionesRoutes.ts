import { Router } from 'express';

import reservacionesController from '../controllers/reservaController';

class ReservacionesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', reservacionesController.list);
        this.router.get('/:id',reservacionesController.getOne);
        this.router.post('/',reservacionesController.create);
        this.router.put('/:id',reservacionesController.update);
        this.router.delete('/:id',reservacionesController.delete);
    }

}

const reservacionesRoutes = new ReservacionesRoutes();
export default reservacionesRoutes.router;