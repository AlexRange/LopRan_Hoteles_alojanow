import { Request, Response } from 'express';
import poolPromise from '../database';

class ComentariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const comentarios = await pool.query('SELECT * FROM comentarios_calificaciones');
            res.json(comentarios);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener comentarios' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            const pool = await poolPromise;
            const comentario = await pool.query('SELECT * FROM comentarios_calificaciones WHERE id_comentario = ?', [id_comentario]);
            res.json(comentario);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener el comentario' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO comentarios_calificaciones SET ?', [req.body]);
            res.json({ message: 'Comentario Guardado' });
        } catch (err) {
            res.status(500).json({ error: 'Error al guardar el comentario' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM comentarios_calificaciones WHERE id_comentario = ?', [id_comentario]);
            res.json({ message: "El comentario fue eliminado" });
        } catch (err) {
            res.status(500).json({ error: 'Error al eliminar el comentario' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE comentarios_calificaciones SET ? WHERE id_comentario = ?', [req.body, id_comentario]);
            res.json({ message: "El comentario fue actualizado" });
        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar el comentario' });
        }
    }
}

const comentariosController = new ComentariosController();
export default comentariosController;