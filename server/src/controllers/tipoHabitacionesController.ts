import { Request, Response } from 'express';
import poolPromise from '../database';

class TipoHabitacionController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const tipos = await pool.query('SELECT * FROM tipo_habitacion');
            res.json(tipos);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener tipos de habitación' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id_tipo_habitacion } = req.params;
            const pool = await poolPromise;
            const tipo = await pool.query('SELECT * FROM tipo_habitacion WHERE id_tipo_habitacion = ?', [id_tipo_habitacion]);
            
            if (tipo.length > 0) {
                res.json(tipo[0]);
            } else {
                res.status(404).json({ message: 'Tipo de habitación no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener el tipo de habitación' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO tipo_habitacion SET ?', [req.body]);
            res.json({ message: 'Tipo de habitación guardado' });
        } catch (err) {
            res.status(500).json({ error: 'Error al guardar el tipo de habitación' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_tipo_habitacion } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM tipo_habitacion WHERE id_tipo_habitacion = ?', [id_tipo_habitacion]);
            res.json({ message: "El tipo de habitación fue eliminado" });
        } catch (err) {
            res.status(500).json({ error: 'Error al eliminar el tipo de habitación' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_tipo_habitacion } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE tipo_habitacion SET ? WHERE id_tipo_habitacion = ?', [req.body, id_tipo_habitacion]);
            res.json({ message: "El tipo de habitación fue actualizado" });
        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar el tipo de habitación' });
        }
    }
}

const tipoHabitacionController = new TipoHabitacionController();
export default tipoHabitacionController;