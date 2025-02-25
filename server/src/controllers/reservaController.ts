import { Request, Response } from 'express';

import pool from '../database';

class ReservacionesController{
    public async list(req: Request, res: Response): Promise<void> {
        const reseraciones = await pool.query('SELECT * FROM reservaciones');
        res.json(reseraciones);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const reseraciones = await pool.query('SELECT * FROM reservaciones WHERE id = ?', [id]);
        console.log(reseraciones.length);
        if (reseraciones.length > 0) {
            return res.json(reseraciones[0]);
        }
        res.status(404).json({ text: "The reservation doesn't exits" });
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO reservaciones set ?', [req.body]);
        res.json({ message: 'Reservation Saved' });
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM reservaciones WHERE id = ?', [id]);
        res.json({ message: "The reservation was deleted" });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldReservation = req.body;
        await pool.query('UPDATE reservaciones set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "The reservation was Updated" });
    }
}

const reservacionesController = new ReservacionesController();
export default reservacionesController;