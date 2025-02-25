import { Router } from 'express';

import reservacionesServiciosController from '../controllers/ReservacionesServiciosController';

class ReservacionesServiciosRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', reservacionesServiciosController.list);
        this.router.get('/:id',reservacionesServiciosController.getOne);
        this.router.post('/',reservacionesServiciosController.create);
        this.router.put('/:id',reservacionesServiciosController.update);
        this.router.delete('/:id',reservacionesServiciosController.delete);
    }
}

const reservacionesServiciosRoutes = new ReservacionesServiciosRoutes();
export default reservacionesServiciosRoutes.router;