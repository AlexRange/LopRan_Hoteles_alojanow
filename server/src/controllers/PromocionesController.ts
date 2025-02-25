import { Request, Response } from 'express';
import poolPromise from '../database';

class PromocionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const connection = await poolPromise;
            const promociones = await connection.query('SELECT * FROM promociones');
            res.json(promociones);
        } catch (error) {
            res.status(500).json({ text: 'Error al obtener las promociones', error });
        }
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const connection = await poolPromise;
            const promocion = await connection.query('SELECT * FROM promociones WHERE id = ?', [id]);
            if (promocion.length > 0) {
                return res.json(promocion[0]);
            }
            res.status(404).json({ text: "La promoción no existe" });
        } catch (error) {
            res.status(500).json({ text: 'Error al obtener la promoción', error });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const connection = await poolPromise;
            await connection.query('INSERT INTO promociones set ?', [req.body]);
            res.json({ message: 'Promoción Guardada' });
        } catch (error) {
            res.status(500).json({ text: 'Error al guardar la promoción', error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const connection = await poolPromise;
            await connection.query('DELETE FROM promociones WHERE id = ?', [id]);
            res.json({ message: "La promoción fue eliminada" });
        } catch (error) {
            res.status(500).json({ text: 'Error al eliminar la promoción', error });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const connection = await poolPromise;
            await connection.query('UPDATE promociones set ? WHERE id = ?', [req.body, id]);
            res.json({ message: "La promoción fue actualizada" });
        } catch (error) {
            res.status(500).json({ text: 'Error al actualizar la promoción', error });
        }
    }
}

const promocionesController = new PromocionesController();
export default promocionesController;
