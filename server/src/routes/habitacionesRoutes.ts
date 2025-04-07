import { Router } from 'express';
import { habitacionesController, habitacionUpload } from '../controllers/habitacionesController';

class HabitacionesRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', habitacionesController.list);
        this.router.get('/:id_habitacion', habitacionesController.getOne);
        this.router.post('/', habitacionesController.create);
        this.router.put('/:id_habitacion', habitacionesController.update);
        this.router.delete('/:id_habitacion', habitacionesController.delete);
        this.router.get('/hotel/:id_hotel', habitacionesController.getByHotel);
        this.router.post('/upload', habitacionUpload.single('image'), habitacionesController.uploadImage);
    }
}

const habitacionesRoutes = new HabitacionesRoutes();
export default habitacionesRoutes.router;