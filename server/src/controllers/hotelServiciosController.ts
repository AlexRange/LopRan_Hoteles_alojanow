import { Request, Response } from 'express';
import pool from '../database';

class HotelServiciosController {
    // Obtener todos los servicios de un hotel específico
    public async getServiciosByHotel(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const servicios = await pool.query(`
                SELECT s.*
                FROM servicios_adicionales s
                INNER JOIN hotel_servicios hs ON s.id_servicio = hs.id_servicio
                WHERE hs.id_hotel = ?
            `, [id_hotel]);

            if (servicios && servicios[0]) {
                res.json(servicios[0]);
            } else {
                res.status(404).json({ message: "No services found for this hotel" });
            }
        } catch (error) {
            console.error('Error fetching services for hotel:', error);
            res.status(500).json({ message: 'Error fetching services' });
        }
    }

    // Agregar un servicio a un hotel
    public async addServicioToHotel(req: Request, res: Response): Promise<void> {
        const { id_hotel, id_servicio } = req.params;
        try {
            await pool.query(
                'INSERT INTO hotel_servicios (id_hotel, id_servicio) VALUES (?, ?)', 
                [id_hotel, id_servicio]
            );
            res.json({ message: 'Service added to hotel' });
        } catch (error) {
            console.error('Error adding service to hotel:', error);
            res.status(500).json({ message: 'Error adding service to hotel' });
        }
    }

    // Eliminar un servicio de un hotel
    public async removeServicioFromHotel(req: Request, res: Response): Promise<void> {
        const { id_hotel, id_servicio } = req.params;
        try {
            await pool.query(
                'DELETE FROM hotel_servicios WHERE id_hotel = ? AND id_servicio = ?', 
                [id_hotel, id_servicio]
            );
            res.json({ message: 'Service removed from hotel' });
        } catch (error) {
            console.error('Error removing service from hotel:', error);
            res.status(500).json({ message: 'Error removing service from hotel' });
        }
    }
}

const hotelServiciosController = new HotelServiciosController();
export default hotelServiciosController;