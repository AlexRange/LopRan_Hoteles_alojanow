import { Request, Response } from 'express';
import poolPromise from '../database';

class ServiciosAdicionalesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const serviciosA = await pool.query('SELECT * FROM servicios_adicionales');
            res.json(serviciosA);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los servicios adicionales' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id_servicio } = req.params;
            const pool = await poolPromise;
            const serviciosA = await pool.query('SELECT * FROM servicios_adicionales WHERE id_servicio = ?', [id_servicio]);
            
            if (serviciosA.length > 0) {
                res.json(serviciosA[0]);
            } else {
                res.status(404).json({ message: 'El servicio adicional no existe' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el servicio adicional' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO servicios_adicionales SET ?', [req.body]);
            res.json({ message: 'Servicio adicional guardado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al guardar el servicio adicional' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_servicio } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM servicios_adicionales WHERE id_servicio = ?', [id_servicio]);
            res.json({ message: 'El servicio adicional fue eliminado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el servicio adicional' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_servicio } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE servicios_adicionales SET ? WHERE id_servicio = ?', [req.body, id_servicio]);
            res.json({ message: 'El registro del servicio adicional fue actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el servicio adicional' });
        }
    }
}

const serviciosAdicionalesController = new ServiciosAdicionalesController();
export default serviciosAdicionalesController;