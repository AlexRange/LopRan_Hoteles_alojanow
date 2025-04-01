import { Request, Response } from 'express';
import poolPromise from '../database';

class HabitacionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM habitaciones');
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener habitaciones', error: err });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_habitacion } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM habitaciones WHERE id_habitacion = ?', 
                [id_habitacion]
            );
            
            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ text: "The habitacion doesn't exist" });
            }
    
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving habitacion' });
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
        try {
            const pool = await poolPromise;
            await pool.query(
                'UPDATE habitaciones SET ? WHERE id_habitacion = ?',
                [req.body, id_habitacion]
            );
            res.json({ message: "El registro de la habitación fue actualizado" });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la habitación' });
        }
    }

    public async getByHotel(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM habitaciones WHERE id_hotel = ?',
                [id_hotel]
            );
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener habitaciones del hotel', error: err });
        }
    }
}

const habitacionesController = new HabitacionesController();
export default habitacionesController;