import { Request, Response } from 'express';
import poolPromise from '../database';

class ReservacionesServiciosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const reservaciones = await pool.query('SELECT * FROM reservaciones_servicios');
            res.json(reservaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving reservations' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id_reserva_servicio } = req.params;
            const pool = await poolPromise;
            const reservaciones = await pool.query('SELECT * FROM reservaciones_servicios WHERE  id_reserva_servicio = ?', [ id_reserva_servicio]);
            
            if (reservaciones.length > 0) {
                res.json(reservaciones[0]);
            } else {
                res.status(404).json({ text: "The reservation doesn't exist" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving reservation' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO reservaciones_servicios SET ?', [req.body]);
            res.json({ message: 'Reservation Saved' });
        } catch (error) {
            res.status(500).json({ error: 'Error Guardando reservacion de servicios' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_reserva_servicio } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM reservaciones_servicios WHERE  id_reserva_servicio = ?', [ id_reserva_servicio]);
            res.json({ message: 'The reservation was deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting reservation' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_reserva_servicio } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE reservaciones_servicios SET ? WHERE  id_reserva_servicio = ?', [req.body,  id_reserva_servicio]);
            res.json({ message: 'The reservation was updated' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating reservation' });
        }
    }
}

const reservacionesServiciosController = new ReservacionesServiciosController();
export default reservacionesServiciosController;