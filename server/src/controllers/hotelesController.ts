import { Request, Response } from 'express';
import poolPromise from '../database';

class HotelesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const hoteles = await pool.query('SELECT * FROM hoteles');
            res.json(hoteles);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Database error:', error.message);
                res.status(500).json({
                    message: 'Error fetching hotels',
                    error: error.message
                });
            } else {
                console.error('Unknown error occurred');
                res.status(500).json({
                    message: 'Unknown error occurred'
                });
            }
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM hoteles WHERE id_hotel = ?', [id_hotel]);

            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ text: "The hotel doesn't exist" });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving hotel' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO hoteles SET ?', [req.body]);
            res.json({ message: 'Hotel Saved' });
        } catch (error) {
            res.status(500).json({ message: 'Error saving hotel' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('DELETE FROM hoteles WHERE id_hotel = ?', [id_hotel]);
            res.json({ message: 'The hotel was deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting hotel' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('UPDATE hoteles SET ? WHERE id_hotel = ?', [req.body, id_hotel]);
            res.json({ message: 'The hotel was updated' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating hotel' });
        }
    }
}

const hotelesController = new HotelesController();
export default hotelesController;