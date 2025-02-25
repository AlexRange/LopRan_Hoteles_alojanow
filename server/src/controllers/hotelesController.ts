import { Request, Response } from 'express';
import pool from '../database';

class HotelesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            // Usar await para obtener la consulta de la base de datos
            const hoteles = await pool.then(poolInstance => poolInstance.query('SELECT * FROM hoteles'));
            res.json(hoteles);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            res.status(500).json({ message: 'Error fetching hotels' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<Response> {
        const { id_hotel } = req.params;
        try {
            const hoteles = await pool.then(poolInstance => poolInstance.query('SELECT * FROM hoteles WHERE id_hotel = ?', [id_hotel]));
            if (hoteles.length > 0) {
                return res.json(hoteles[0]);
            }
            return res.status(404).json({ message: "The hotel doesn't exist" });
        } catch (error) {
            console.error('Error fetching hotel:', error);
            return res.status(500).json({ message: 'Error fetching hotel' });
        }
    }
    
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const result = await pool.then(poolInstance => poolInstance.query('INSERT INTO hoteles SET ?', [req.body]));
            res.json({ message: 'Hotel Saved', id: result.insertId });
        } catch (error) {
            console.error('Error saving hotel:', error);
            res.status(500).json({ message: 'Error saving hotel' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const result = await pool.then(poolInstance => poolInstance.query('DELETE FROM hoteles WHERE id_hotel = ?', [id_hotel]));
            if (result.affectedRows > 0) {
                res.json({ message: 'The hotel was deleted' });
            } else {
                res.status(404).json({ message: "Hotel not found" });
            }
        } catch (error) {
            console.error('Error deleting hotel:', error);
            res.status(500).json({ message: 'Error deleting hotel' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        const oldHotel = req.body;
        try {
            const result = await pool.then(poolInstance => poolInstance.query('UPDATE hoteles SET ? WHERE id_hotel = ?', [req.body, id_hotel]));
            if (result.affectedRows > 0) {
                res.json({ message: 'The hotel was updated' });
            } else {
                res.status(404).json({ message: "Hotel not found" });
            }
        } catch (error) {
            console.error('Error updating hotel:', error);
            res.status(500).json({ message: 'Error updating hotel' });
        }
    }
}

const hotelesController = new HotelesController();
export default hotelesController;
