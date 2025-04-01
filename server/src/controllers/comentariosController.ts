import { Request, Response } from 'express';
import poolPromise from '../database';

class ComentariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM comentarios_calificaciones');
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener comentarios', error: err });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_comentario } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM comentarios_calificaciones WHERE id_comentario = ?', 
                [id_comentario]
            );
            
            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ text: "The comentary doesn't exist" });
            }
    
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving comentary' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query(
                'INSERT INTO comentarios_calificaciones SET ?', 
                [req.body]
            );
            res.json({ 
                message: 'Comentario Guardado'
            });
        } catch (err) {
            res.status(500).json({ message: 'Error al guardar el comentario', error: err });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            const pool = await poolPromise;
            await pool.query(
                'DELETE FROM comentarios_calificaciones WHERE id_comentario = ?', 
                [id_comentario]
            );
            res.json({ message: "El comentario fue eliminado" });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar el comentario', error: err });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            const pool = await poolPromise;
            await pool.query(
                'UPDATE comentarios_calificaciones SET ? WHERE id_comentario = ?', 
                [req.body, id_comentario]
            );
            res.json({ message: "El comentario fue actualizado" });
        } catch (err) {
            res.status(500).json({ message: 'Error al actualizar el comentario', error: err });
        }
    }
}

const comentariosController = new ComentariosController();
export default comentariosController;