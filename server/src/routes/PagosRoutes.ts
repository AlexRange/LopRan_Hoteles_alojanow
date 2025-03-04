import { Router } from 'express';

import pagosController from '../controllers/pagosController';

class PagosRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', pagosController.list);
        this.router.get('/:id_pago',pagosController.getOne);
        this.router.post('/',pagosController.create);
        this.router.put('/:id_pago',pagosController.update);
        this.router.delete('/:id_pago',pagosController.delete);
    }
}

const pagosRoutes = new PagosRoutes();
export default pagosRoutes.router;