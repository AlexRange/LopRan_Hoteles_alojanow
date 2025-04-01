import { Router } from 'express';
import hotelesServiciosController from './../controllers/hotelServiciosController';

class HotelServiciosRoutes {
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void {
        // Obtener servicios de un hotel
        this.router.get('/:id_hotel', hotelesServiciosController.getServiciosByHotel);
        
        // Agregar servicio a un hotel
        this.router.post('/:id_hotel/:id_servicio', hotelesServiciosController.addServicioToHotel);
        
        // Eliminar servicio de un hotel
        this.router.delete('/:id_hotel/:id_servicio', hotelesServiciosController.removeServicioFromHotel);
    }
}

const hotelesServiciosRoutes = new HotelServiciosRoutes();
export default hotelesServiciosRoutes.router;