import { Router } from 'express';

import serviciosAdicionalesController from '../controllers/serviciosAdicionalesController';

class ServiciosAdicionalesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', serviciosAdicionalesController.list);
        this.router.get('/:id', serviciosAdicionalesController.getOne);
        this.router.post('/', serviciosAdicionalesController.create);
        this.router.put('/:id', serviciosAdicionalesController.update);
        this.router.delete('/:id', serviciosAdicionalesController.delete);
    }

}

const serviciosAdicionalesRoutes = new ServiciosAdicionalesRoutes();
export default serviciosAdicionalesRoutes.router;