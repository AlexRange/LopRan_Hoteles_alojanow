import { Router } from 'express';

import reservacionesServiciosController from '../controllers/reservacionesServiciosController';

class ReservacionesServiciosRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', reservacionesServiciosController.list);
        this.router.get('/:id_reserva_servicio',reservacionesServiciosController.getOne);
        this.router.post('/', reservacionesServiciosController.create);
        this.router.put('/:id_reservacion',reservacionesServiciosController.update);
        this.router.delete('/:id_reserva_servicio',reservacionesServiciosController.delete);
    }

}

const reservacionesServiciosRoutes = new ReservacionesServiciosRoutes();
export default reservacionesServiciosRoutes.router;