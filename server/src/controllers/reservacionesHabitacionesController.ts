import { Request, Response } from 'express';
import poolPromise from '../database';

class ReservacionesHabitacionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const reservaciones = await pool.query('SELECT * FROM reservaciones');
            res.json(reservaciones);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving reservations' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id_reservacion } = req.params;
            const pool = await poolPromise;
            const reservaciones = await pool.query('SELECT * FROM reservaciones WHERE id_reservacion = ?', [id_reservacion]);
            
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
            await pool.query('INSERT INTO reservaciones SET ?', [req.body]);
            res.json({ message: 'Reservation Saved' });
        } catch (error) {
            res.status(500).json({ error: 'Error saving reservation' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_reservacion } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM reservaciones WHERE id_reservacion = ?', [id_reservacion]);
            res.json({ message: 'The reservation was deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting reservation' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_reservacion } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE reservaciones SET ? WHERE id_reservacion = ?', [req.body, id_reservacion]);
            res.json({ message: 'The reservation was updated' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating reservation' });
        }
    }
}

const reservacionesHabitacionesController = new ReservacionesHabitacionesController();
export default reservacionesHabitacionesController;