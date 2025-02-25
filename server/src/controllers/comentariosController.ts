import { Request, Response } from 'express';
import poolPromise from '../database';

class ComentariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const comentarios = await pool.query('SELECT * FROM comentarios_calificaciones');
            res.json(comentarios);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener comentarios', error: err });
        }
    }

    public async getOne(req: Request, res: Response): Promise<Response> {
        try {
            const { id_habitacion } = req.params;
            const pool = await poolPromise;
            const comentario = await pool.query('SELECT * FROM comentarios_calificaciones WHERE id_habitacion = ?', [id_habitacion]);
            if (comentario.length > 0) {
                return res.json(comentario[0]);
            }
            return res.status(404).json({ text: "El comentario no existe" });
        } catch (err) {
            return res.status(500).json({ message: 'Error al obtener el comentario', error: err });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO comentarios_calificaciones SET ?', [req.body]);
            res.json({ message: 'Comentario Guardado' });
        } catch (err) {
            res.status(500).json({ message: 'Error al guardar el comentario', error: err });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_habitacion } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM comentarios_calificaciones WHERE id_habitacion = ?', [id_habitacion]);
            res.json({ message: "El comentario fue eliminado" });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar el comentario', error: err });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_habitacion } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE comentarios_calificaciones SET ? WHERE id_habitacion = ?', [req.body, id_habitacion]);
            res.json({ message: "El comentario fue actualizado" });
        } catch (err) {
            res.status(500).json({ message: 'Error al actualizar el comentario', error: err });
        }
    }
}

const comentariosController = new ComentariosController();
export default comentariosController;
