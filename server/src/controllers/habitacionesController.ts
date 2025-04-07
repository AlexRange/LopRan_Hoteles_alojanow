import { Request, Response } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import poolPromise from '../database';

// Extend the Request interface to include the file property
declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
        }
    }
}

const habitacionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/habitaciones'); // Specific folder for rooms
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'habitacion-' + uniqueSuffix + ext);
    }
});

const habitacionFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, PNG, JPG) are allowed'));
    }
};

const habitacionUpload = multer({ 
    storage: habitacionStorage,
    fileFilter: habitacionFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

class HabitacionesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM habitaciones');
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener habitaciones', error: err });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_habitacion } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM habitaciones WHERE id_habitacion = ?', 
                [id_habitacion]
            );
            
            if (result && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ text: "The habitacion doesn't exist" });
            }
    
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving habitacion' });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            await pool.query('INSERT INTO habitaciones SET ?', [req.body]);
            res.json({ message: 'Habitación Guardada' });
        } catch (err) {
            res.status(500).json({ message: 'Error al guardar la habitación', error: err });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id_habitacion } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM habitaciones WHERE id_habitacion = ?', [id_habitacion]);
            res.json({ message: "El registro de la habitación fue eliminado" });
        } catch (err) {
            res.status(500).json({ message: 'Error al eliminar la habitación', error: err });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id_habitacion } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query(
                'UPDATE habitaciones SET ? WHERE id_habitacion = ?',
                [req.body, id_habitacion]
            );
            res.json({ message: "El registro de la habitación fue actualizado" });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la habitación' });
        }
    }

    public async getByHotel(req: Request, res: Response): Promise<void> {
        const { id_hotel } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM habitaciones WHERE id_hotel = ?',
                [id_hotel]
            );
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: 'Error al obtener habitaciones del hotel', error: err });
        }
    }

    public async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const filePath = req.file.filename;
            res.json({ 
                success: true, 
                filename: filePath,
                message: 'Room image uploaded successfully'
            });
        } catch (error) {
            console.error('Error uploading room image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ 
                success: false, 
                message: 'Error uploading room image',
                error: errorMessage
            });
        }
    }
}

const habitacionesController = new HabitacionesController();
export { habitacionesController, habitacionUpload };
