import { Request, Response } from 'express';
import poolPromise from '../database';

class PagosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM pagos');
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pagos' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_pago } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM pagos WHERE id_pago = ?', [id_pago]);
            
            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: "No se encontró el pago" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar el pago' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO pagos SET ?', [req.body]);
            res.json({ message: 'Pago registrado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el pago' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_pago } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('DELETE FROM pagos WHERE id_pago = ?', [id_pago]);
            res.json({ message: "Pago eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el pago' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_pago } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('UPDATE pagos SET ? WHERE id_pago = ?', [req.body, id_pago]);
            res.json({ message: "Pago actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pago' });
        }
    }
}

const pagosController = new PagosController();
export default pagosController;