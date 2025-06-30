import crypto from 'crypto';
import { Request, Response } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import poolPromise from '../database';
import bcrypt from 'bcrypt';
import { body, validationResult, param } from 'express-validator';
import validator from 'validator';
// Extender la interfaz Request para incluir la propiedad file
declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
        }
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/usuarios'); // Ruta dentro del server
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'user-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPEG, PNG, JPG)'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

// Middleware de validación para crear usuario
export const validateCreateUser = [
    body('email').isEmail().withMessage('Email inválido'),
    body('contrasena').isLength({ min: 6 }).withMessage('Contraseña muy corta'),
    body('nombre').isLength({ min: 1 }).withMessage('Nombre requerido'),
    // Agrega validaciones para otros campos según tu modelo
];

// Middleware de validación para actualizar usuario
export const validateUpdateUser = [
    param('id_usuario').isInt().withMessage('ID inválido'),
    body('nombre').optional().isLength({ min: 1 }).withMessage('Nombre requerido'),
    // Agrega validaciones para otros campos
];

class UsuariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM usuarios');
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);

            if (result && Array.isArray(result) && result.length) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar el usuario' });
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
            const countResult = await pool.query('SELECT COUNT(*) as total FROM usuarios');
            const count = Array.isArray(countResult) ? countResult[0].total : countResult[0].total;

            const userData = req.body;

            // Sanitizar campos
            userData.nombre = validator.escape(userData.nombre);
            userData.email = validator.normalizeEmail(userData.email);

            // Hash de contraseña
            userData.contrasena = await bcrypt.hash(userData.contrasena, 10);

            if (count === 0) {
                userData.tipo = 'admin';
            }

            await pool.query('INSERT INTO usuarios SET ?', [userData]);
            res.json({
                message: 'Usuario registrado exitosamente',
                ...(count === 0 && { notice: 'Primer usuario registrado como administrador' })
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { id_usuario } = req.params;
        try {
            const pool = await poolPromise;
            const updateData = req.body;

            // Sanitizar campos
            if (updateData.nombre) updateData.nombre = validator.escape(updateData.nombre);
            if (updateData.contrasena) {
                updateData.contrasena = await bcrypt.hash(updateData.contrasena, 10);
            }

            await pool.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [updateData, id_usuario]);
            res.json({ message: "Usuario actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    }

    public async sendCode(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        try {
            const verificationCode = crypto.randomBytes(3).toString('hex');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'appnotificaciones68@gmail.com',
                    pass: 'nnev ftrj fjgr hgkt'
                }
            });

            await transporter.sendMail({
                from: 'appnotificaciones68@gmail.com',
                to: email,
                subject: 'Código de Verificación',
                text: `Tu código de verificación es: ${verificationCode}`
            });

            const pool = await poolPromise;
            await pool.query('INSERT INTO verification_codes (email, code) VALUES (?, ?)', [email, verificationCode]);
            res.json({ message: 'Código enviado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al enviar el código' });
        }
    }

    public async verifyCode(req: Request, res: Response): Promise<void> {
        const { email, code } = req.body;
        try {
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM verification_codes WHERE email = ? AND code = ?', [email, code]);

            if (result && Array.isArray(result) && result.length) {
                await pool.query('UPDATE verification_codes SET estatus = ? WHERE email = ? AND code = ?', ['Verificado', email, code]);
                res.json({ success: true, message: 'Código verificado' });
            } else {
                res.status(400).json({ success: false, message: 'Código inválido' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar el código' });
        }
    }

    public async sendNewPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'El correo electrónico es requerido' });
            return;
        }
        try {
            const newPassword = crypto.randomBytes(4).toString('hex');
            const pool = await poolPromise;
            const [users]: any = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
            if (users.length === 0) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }
            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.query('UPDATE usuarios SET contrasena = ? WHERE email = ?', [hashedPassword, email]);
    
            // 3. Enviar el correo
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'appnotificaciones68@gmail.com',
                    pass: 'nnev ftrj fjgr hgkt'
                }
            });
    
            await transporter.sendMail({
                from: 'appnotificaciones68@gmail.com',
                to: email,
                subject: 'Nueva contraseña',
                text: `Tu nueva contraseña es: ${newPassword}`,
                html: `<p>Tu nueva contraseña es: <strong>${newPassword}</strong></p>
                <p>Por seguridad, te recomendamos cambiarla después de iniciar sesión.</p>`
            });
    
            res.json({ message: 'Nueva contraseña enviada correctamente' });
        } catch (error) {
            console.error('Error en sendNewPassword:', error);
            res.status(500).json({ message: 'Error al procesar la solicitud' });
        }
    }

    public async uploadImage(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No se ha subido ningún archivo' });
                return;
            }

            const filePath = req.file.filename;
            res.json({ 
                success: true, 
                filename: filePath,
                message: 'Imagen subida correctamente'
            });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            res.status(500).json({ 
                success: false, 
                message: 'Error al subir la imagen',
                error: errorMessage
            });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, contrasena } = req.body;
            const pool = await poolPromise;
            const result = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (result.length > 0) {
                const user = result[0];
                const match = await bcrypt.compare(contrasena, user.contrasena);
                if (!match) {
                    res.status(401).json({ success: false, message: "Credenciales incorrectas" });
                    return;
                }
                res.json({ success: true, message: "Inicio de sesión exitoso", user });
            } else {
                res.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }
}

    const usuariosController = new UsuariosController();
export { upload, usuariosController };

