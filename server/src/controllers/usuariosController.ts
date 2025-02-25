import { Request, Response } from 'express';
import poolPromise from '../database';

class UsuariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const [usuarios] = await pool.query('SELECT * FROM usuarios');
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving users' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const pool = await poolPromise;
            const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving user' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO usuarios set ?', [req.body]);
            res.json({ message: 'User Saved' });
        } catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
            res.json({ message: "The user was deleted" });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE usuarios set ? WHERE id = ?', [req.body, id]);
            res.json({ message: "The user was updated" });
        } catch (error) {
            res.status(500).json({ error: 'Error updating user' });
        }
    }
}

const usuariosController = new UsuariosController();
export default usuariosController;
