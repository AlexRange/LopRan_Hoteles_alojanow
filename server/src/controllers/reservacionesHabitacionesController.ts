import { Request, Response } from 'express';
import poolPromise from '../database';

class ReservacionesHabitacionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM reservaciones');
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las reservaciones' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_reservacion } = req.params;
        
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM reservaciones WHERE id_reservacion = ?', 
                [id_reservacion]
            );

            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: "Reservación no encontrada" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar la reservación' });
        }
    }

    public async getReservacionesByIdUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { id_usuario } = req.params;
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM reservaciones WHERE id_usuario = ? ORDER BY fecha_inicio DESC',
                [id_usuario]
            );
    
            if (result && result.length) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'No se encontraron reservaciones' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener reservaciones' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO reservaciones SET ?', [req.body]);
            res.json({ message: 'Reservación registrada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar la reservación' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_reservacion } = req.params;
        
        try {
            const pool = await poolPromise;
            await pool.query(
                'DELETE FROM reservaciones WHERE id_reservacion = ?', 
                [id_reservacion]
            );
            res.json({ message: 'Reservación eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la reservación' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_reservacion } = req.params;
        
        try {
            const pool = await poolPromise;
            await pool.query(
                'UPDATE reservaciones SET ? WHERE id_reservacion = ?', 
                [req.body, id_reservacion]
            );
            res.json({ message: 'Reservación actualizada con éxito' });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la reservación' });
        }
    }
}

const reservacionesHabitacionesController = new ReservacionesHabitacionesController();
export default reservacionesHabitacionesController;