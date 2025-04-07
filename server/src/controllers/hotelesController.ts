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

const hotelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/hoteles'); // Specific folder for hotels
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'hotel-' + uniqueSuffix + ext);
    }
});

const hotelFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (JPEG, PNG, JPG) are allowed'));
    }
};

const hotelUpload = multer({ 
    storage: hotelStorage,
    fileFilter: hotelFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

class HotelesController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const hoteles = await pool.query('SELECT * FROM hoteles');
            res.json(hoteles);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching hotels' });
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
            
            // Validar que req.body contiene los datos necesarios
            if (!req.body || Object.keys(req.body).length === 0) {
                res.status(400).json({ 
                    success: false,
                    message: 'No se recibieron datos para actualizar'
                });
                return;
            }
    
            // Verificar que la imagen se está recibiendo correctamente
            console.log('Datos recibidos para actualización:', req.body);
            console.log('Nombre de imagen recibido:', req.body.imagen_hotel);
    
            // Actualizar el hotel
            const result = await pool.query('UPDATE hoteles SET ? WHERE id_hotel = ?', [req.body, id_hotel]);
            
            // Verificar que se realizó la actualización
            if (result.affectedRows === 0) {
                res.status(404).json({ 
                    success: false,
                    message: 'Hotel no encontrado o ningún cambio realizado'
                });
                return;
            }
    
            res.json({ 
                success: true,
                message: 'The hotel was updated',
                updatedFields: req.body,
                affectedRows: result.affectedRows
            });
        } catch (error) {
            console.error('Error updating hotel:', error);
            res.status(500).json({ 
                success: false,
                message: 'Error updating hotel',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
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
                message: 'Hotel image uploaded successfully'
            });
        } catch (error) {
            console.error('Error uploading hotel image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ 
                success: false, 
                message: 'Error uploading hotel image',
                error: errorMessage
            });
        }
    }
}

const hotelesController = new HotelesController();
export { hotelesController, hotelUpload };

