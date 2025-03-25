import { Request, Response } from 'express';
import poolPromise from '../database';

class ReservacionesHabitacionesController {
    public async list(req: Request, res: Response): Promise<Response> {
        try {
            const pool = await poolPromise;
            const [reservaciones] = await pool.query('SELECT * FROM reservaciones');
            return res.json(reservaciones);
        } catch (error) {
            console.error('Error retrieving reservations:', error);
            return res.status(500).json({ error: 'Error retrieving reservations' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<Response> {
        try {
            const { id_reservacion } = req.params;
            const pool = await poolPromise;
            const [reservaciones] = await pool.query('SELECT * FROM reservaciones WHERE id_reservacion = ?', [id_reservacion]);

            if (Array.isArray(reservaciones) && reservaciones.length > 0) {
                return res.json(reservaciones[0]);
            } else {
                return res.status(404).json({ text: "The reservation doesn't exist" });
            }
        } catch (error) {
            console.error('Error retrieving reservation:', error);
            return res.status(500).json({ error: 'Error retrieving reservation' });
        }
    }

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO reservaciones SET ?', [req.body]);
            return res.status(201).json({ message: 'Reservation Saved' });
        } catch (error: any) {
            console.error('Error saving reservation:', error);

            let errorMessage = 'Error saving reservation';
            if (error.code === 'ER_DUP_ENTRY') {
                errorMessage = 'Duplicate entry detected';
            } else if (error.code === 'ER_BAD_FIELD_ERROR') {
                errorMessage = 'Invalid field in request body';
            }

            return res.status(500).json({ error: errorMessage });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id_reservacion } = req.params;
            const pool = await poolPromise;
            const result = await pool.query('DELETE FROM reservaciones WHERE id_reservacion = ?', [id_reservacion]);

            if (result.affectedRows > 0) {
                return res.json({ message: 'The reservation was deleted' });
            } else {
                return res.status(404).json({ error: 'Reservation not found' });
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            return res.status(500).json({ error: 'Error deleting reservation' });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id_reservacion } = req.params;
            const pool = await poolPromise;
            const result = await pool.query('UPDATE reservaciones SET ? WHERE id_reservacion = ?', [req.body, id_reservacion]);

            if (result.affectedRows > 0) {
                return res.json({ message: 'The reservation was updated' });
            } else {
                return res.status(404).json({ error: 'Reservation not found' });
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
            return res.status(500).json({ error: 'Error updating reservation' });
        }
    }
}

const reservacionesHabitacionesController = new ReservacionesHabitacionesController();
export default reservacionesHabitacionesController;
