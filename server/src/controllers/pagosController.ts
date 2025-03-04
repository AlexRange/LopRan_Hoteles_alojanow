import { Request, Response } from 'express';
import poolPromise from '../database';

class PagosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const connection = await poolPromise;
            const pagos = await connection.query('SELECT * FROM pagos');
            res.json(pagos);
        } catch (error) {
            res.status(500).json({ text: 'Error al obtener los pagos', error });
        }
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id_pago } = req.params;
        try {
            const connection = await poolPromise;
            const pago = await connection.query('SELECT * FROM pagos WHERE id = ?', [id_pago]);
            if (pago.length > 0) {
                return res.json(pago[0]);
            }
            res.status(404).json({ text: "El pago no existe" });
        } catch (error) {
            res.status(500).json({ text: 'Error al obtener el pago', error });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const connection = await poolPromise;
            await connection.query('INSERT INTO pagos set ?', [req.body]);
            res.json({ message: 'Pago Guardado' });
        } catch (error) {
            res.status(500).json({ text: 'Error al guardar el pago', error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_pago } = req.params;
        try {
            const connection = await poolPromise;
            await connection.query('DELETE FROM pagos WHERE id_pago = ?', [id_pago]);
            res.json({ message: "El pago fue eliminado" });
        } catch (error) {
            res.status(500).json({ text: 'Error al eliminar el pago', error });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_pago } = req.params;
        try {
            const connection = await poolPromise;
            await connection.query('UPDATE pagos set ? WHERE id_pago = ?', [req.body, id_pago]);
            res.json({ message: "El pago fue actualizado" });
        } catch (error) {
            res.status(500).json({ text: 'Error al actualizar el pago', error });
        }
    }
}

const pagosController = new PagosController();
export default pagosController;
