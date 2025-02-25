import { Request, Response } from 'express';
import poolPromise from '../database';

class HabitacionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const habitaciones = await pool.query('SELECT * FROM habitaciones');
            res.json(habitaciones);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener habitaciones', error: err });
        }
    }

    public async getOne(req: Request, res: Response): Promise<Response> {
        const { id_habitacion } = req.params;
        try {
            const connection = await poolPromise;
            const Habitacion = await connection.query('SELECT * FROM habitaciones WHERE id_habitacion = ?', [id_habitacion]);
            if (Habitacion.length > 0) {
                return res.json(Habitacion[0]);
            }
            return res.status(404).json({ text: "La habitación no existe" });
        } catch (err) {
            return res.status(500).json({ message: 'Error al obtener la habitación', error: err });
        }
    }
    

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO habitaciones SET ?', [req.body]);
            res.json({ message: 'Habitación Guardada' });
        } catch (err) {
            res.status(500).json({ message: 'Error al guardar la habitación', error: err });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_habitacion } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM habitaciones WHERE id_habitacion = ?', [id_habitacion]);
            res.json({ message: "El registro de la habitación fue eliminado" });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar la habitación', error: err });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_habitacion } = req.params;
        const oldHotel = req.body;
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'UPDATE habitaciones SET ? WHERE id_habitacion = ?',
                [req.body, id_habitacion]
            );

            if (result.affectedRows > 0) {
                res.json({ message: "El registro de la habitación fue actualizado" });
            } else {
                res.status(404).json({ message: "Habitación no encontrada" });
            }
        } catch (error) {
            console.error('Error al actualizar la habitación:', error);
            res.status(500).json({ message: 'Error al actualizar la habitación' });
        }
    }
}

const habitacionesController = new HabitacionesController();
export default habitacionesController;
