import { Router } from 'express';

import hotelesController from '../controllers/hotelesController';

class HotelesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', hotelesController.list);
        this.router.get('/:id_hotel',hotelesController.getOne);
        this.router.post('/', hotelesController.create);
        this.router.put('/:id_hotel',hotelesController.update);
        this.router.delete('/:id_hotel',hotelesController.delete);
    }
}

const hotelesRoutes = new HotelesRoutes();
export default hotelesRoutes.router;