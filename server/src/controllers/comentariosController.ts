import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import validator from 'validator';
import poolPromise from '../database';
import xss from 'xss';

function sanitizeObject(obj: any) {
    const sanitized: any = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitized[key] = xss(obj[key]);
        } else {
            sanitized[key] = obj[key];
        }
    }
    return sanitized;
}

class ComentariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const comentarios = await pool.query('SELECT * FROM comentarios_calificaciones');
            // Sanitizar datos antes de enviar
            const sanitizedComentarios = Array.isArray(comentarios)
                ? comentarios.map((c: any) => sanitizeObject(c))
                : comentarios;
            res.json(sanitizedComentarios);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener comentarios' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        try {
            const { id_comentario } = req.params;
            const pool = await poolPromise;
            const comentario = await pool.query('SELECT * FROM comentarios_calificaciones WHERE id_comentario = ?', [id_comentario]);

            if (Array.isArray(comentario) && comentario.length > 0) {
                res.json(sanitizeObject(comentario[0]));
            } else {
                res.status(404).json({ error: 'Comentario no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener el comentario' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const pool = await poolPromise;
            const safeComentario = validator.escape(req.body.comentario);
            await pool.query('INSERT INTO comentarios_calificaciones SET ?', [{ ...req.body, comentario: safeComentario }]);
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
            const sanitizedBody = sanitizeObject(req.body);
            await pool.query('UPDATE comentarios_calificaciones SET ? WHERE id_comentario = ?', [sanitizedBody, id_comentario]);
            res.json({ message: "El comentario fue actualizado" });
        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar el comentario' });
        }
    }
}

export const validateCreateComentario = [
    body('comentario').isLength({ min: 1, max: 500 }).withMessage('Comentario requerido'),
    // ...otros campos...
];

const comentariosController = new ComentariosController();
export default comentariosController;