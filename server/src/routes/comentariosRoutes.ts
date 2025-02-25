import { Router } from 'express';

import comentariosController from '../controllers/comentariosController';

class ComentariosRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', comentariosController.list);
        this.router.get('/:id',comentariosController.getOne);
        this.router.post('/',comentariosController.create);
        this.router.put('/:id',comentariosController.update);
        this.router.delete('/:id',comentariosController.delete);
    }

}

const comentariosRoutes = new ComentariosRoutes();
export default comentariosRoutes.router;