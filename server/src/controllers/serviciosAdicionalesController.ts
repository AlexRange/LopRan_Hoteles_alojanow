import { Request, Response } from 'express';

import pool from '../database';

class ServiciosAdicionalesController{
    public async list(req: Request, res: Response): Promise<void> {
        const servivioA = await pool.query('SELECT * FROM servicios_adicionales');
        res.json(servivioA);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const servivioA = await pool.query('SELECT * FROM servicios_adicionales WHERE id = ?', [id]);
        console.log(servivioA.length);
        if (servivioA.length > 0) {
            return res.json(servivioA[0]);
        }
        res.status(404).json({ text: "El servivio Adicional no existe" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO servicios_adicionales set ?', [req.body]);
        res.json({ message: 'Servicio adicional Guardado' });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM servicios_adicionales WHERE id = ?', [id]);
        res.json({ message: "El servicio adicional fue eliminado" });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldservivioA = req.body;
        await pool.query('UPDATE servicios_adicionales set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "El registro del Servicio adicional fue actualizado" });
    }
}

const serviciosAdicionalesController = new ServiciosAdicionalesController();
export default serviciosAdicionalesController;