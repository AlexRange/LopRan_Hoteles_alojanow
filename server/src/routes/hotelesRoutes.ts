import { Router } from 'express';

import { hotelesController, hotelUpload } from '../controllers/hotelesController';

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
        this.router.post('/upload', hotelUpload.single('image'), hotelesController.uploadImage);
    }
}

const hotelesRoutes = new HotelesRoutes();
export default hotelesRoutes.router;