import { Request, Response } from 'express';
import poolPromise from '../database';

class PromocionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM promociones');
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el listado de promociones' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_promocion } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM promociones WHERE id_promocion = ?', [id_promocion]);
            
            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: "Promoción no encontrada" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar la promoción' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO promociones SET ?', [req.body]);
            res.json({ message: 'Promoción registrada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar la promoción' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_promocion } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('DELETE FROM promociones WHERE id_promocion = ?', [id_promocion]);
            res.json({ message: "Promoción eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la promoción' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_promocion } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('UPDATE promociones SET ? WHERE id_promocion = ?', [req.body, id_promocion]);
            res.json({ message: "Promoción actualizada con éxito" });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la promoción' });
        }
    }
}

const promocionesController = new PromocionesController();
export default promocionesController;