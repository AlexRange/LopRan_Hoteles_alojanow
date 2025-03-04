import { Router } from 'express';

import serviciosAdicionalesController from '../controllers/serviciosAdicionalesController';

class ServiciosAdicionalesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', serviciosAdicionalesController.list);
        this.router.get('/:id_servicio', serviciosAdicionalesController.getOne);
        this.router.post('/', serviciosAdicionalesController.create);
        this.router.put('/:id_servicio', serviciosAdicionalesController.update);
        this.router.delete('/:id_servicio', serviciosAdicionalesController.delete);
    }

}

const serviciosAdicionalesRoutes = new ServiciosAdicionalesRoutes();
export default serviciosAdicionalesRoutes.router;