import { Request, Response } from 'express';
import poolPromise from '../database';

class ReservacionesServiciosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const connection = await poolPromise;
            const reservaciones = await connection.query('SELECT * FROM reservaciones_servicios');
            res.json(reservaciones);
        } catch (error) {
            res.status(500).json({ text: 'Error al obtener las reservaciones de servicios', error });
        }
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const connection = await poolPromise;
            const reserva = await connection.query('SELECT * FROM reservaciones_servicios WHERE id = ?', [id]);
            if (reserva.length > 0) {
                return res.json(reserva[0]);
            }
            res.status(404).json({ text: "La reservación de servicio no existe" });
        } catch (error) {
            res.status(500).json({ text: 'Error al obtener la reservación', error });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const connection = await poolPromise;
            await connection.query('INSERT INTO reservaciones_servicios set ?', [req.body]);
            res.json({ message: 'Reservación de servicio guardada' });
        } catch (error) {
            res.status(500).json({ text: 'Error al guardar la reservación', error });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const connection = await poolPromise;
            await connection.query('DELETE FROM reservaciones_servicios WHERE id = ?', [id]);
            res.json({ message: "La reservación fue eliminada" });
        } catch (error) {
            res.status(500).json({ text: 'Error al eliminar la reservación', error });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const connection = await poolPromise;
            await connection.query('UPDATE reservaciones_servicios set ? WHERE id = ?', [req.body, id]);
            res.json({ message: "La reservación del servicio fue actualizada" });
        } catch (error) {
            res.status(500).json({ text: 'Error al actualizar la reservación', error });
        }
    }
}

const reservacionesServiciosController = new ReservacionesServiciosController();
export default reservacionesServiciosController;
