import { Router } from 'express';

import promocionesController from '../controllers/PromocionesController';

class PromocionesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', promocionesController.list);
        this.router.get('/:id',promocionesController.getOne);
        this.router.post('/',promocionesController.create);
        this.router.put('/:id',promocionesController.update);
        this.router.delete('/:id',promocionesController.delete);
    }
}

const promocionesRoutes = new PromocionesRoutes();
export default promocionesRoutes.router;