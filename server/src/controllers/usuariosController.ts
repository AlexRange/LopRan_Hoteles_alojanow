import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import poolPromise from '../database';
import xss from 'xss';

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

function sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized: any = {};
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        if (typeof value === 'string') {
            sanitized[key] = xss(value);
        } else if (typeof value === 'object' && value !== null) {
            // Sanitizar recursivamente objetos anidados
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

function sanitizeString(value: string): string {
    return xss(value);
}

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
        // Sanitizamos id_usuario que viene por parámetro (aunque generalmente es numérico)
        const id_usuario = sanitizeString(req.params.id_usuario);
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
        try {
            const pool = await poolPromise;
            const countResult = await pool.query('SELECT COUNT(*) as total FROM usuarios');
            const count = Array.isArray(countResult) ? countResult[0].total : 0;

            let userData = sanitizeObject(req.body);

            if (count === 0) {
                userData.tipo = 'admin';
            }

            if (userData.contrasena) {
                const saltRounds = 10;
                userData.contrasena = await bcrypt.hash(userData.contrasena, saltRounds);
            }

            await pool.query('INSERT INTO usuarios SET ?', [userData]);
            res.json({
                message: 'Usuario registrado exitosamente',
                ...(count === 0 && { notice: 'Primer usuario registrado como administrador' })
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const id_usuario = sanitizeString(req.params.id_usuario);
        try {
            const pool = await poolPromise;
            await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        const id_usuario = sanitizeString(req.params.id_usuario);
        try {
            let updatedData = sanitizeObject(req.body);

            if (updatedData.contrasena) {
                const saltRounds = 10;
                updatedData.contrasena = await bcrypt.hash(updatedData.contrasena, saltRounds);
            }

            const pool = await poolPromise;
            await pool.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [updatedData, id_usuario]);
            res.json({ message: "Usuario actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    }

    public async sendCode(req: Request, res: Response): Promise<void> {
        let { email } = sanitizeObject(req.body);

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
        let { email, code } = sanitizeObject(req.body);
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
        let { email } = sanitizeObject(req.body);

        if (!email) {
            res.status(400).json({ message: 'El correo electrónico es requerido' });
            return;
        }

        try {
            // Generar contraseña que cumpla los requisitos de validación
            function generateSecurePassword(length = 10): string {
                const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const lower = 'abcdefghijklmnopqrstuvwxyz';
                const numbers = '0123456789';
                const special = '!@#$%^&*(),.?":{}|<>';
                const allChars = upper + lower + numbers + special;

                let password = '';
                // Aseguramos al menos un caracter de cada tipo
                password += upper[Math.floor(Math.random() * upper.length)];
                password += lower[Math.floor(Math.random() * lower.length)];
                password += numbers[Math.floor(Math.random() * numbers.length)];
                password += special[Math.floor(Math.random() * special.length)];

                // Completar con caracteres aleatorios hasta alcanzar longitud deseada
                for (let i = 4; i < length; i++) {
                    password += allChars[Math.floor(Math.random() * allChars.length)];
                }

                // Mezclar la contraseña para no dejar en orden fijo
                password = password.split('').sort(() => 0.5 - Math.random()).join('');
                return password;
            }

            const newPasswordPlain = generateSecurePassword(10);

            // Encriptar la nueva contraseña antes de guardarla
            const saltRounds = 10;
            const newPasswordHashed = await bcrypt.hash(newPasswordPlain, saltRounds);

            const pool = await poolPromise;

            // Verificar si el usuario existe
            const [users]: any = await pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]);
            if (users.length === 0) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }

            // Actualizar la contraseña en la base de datos con la versión encriptada
            await pool.query('UPDATE usuarios SET contrasena = ? WHERE email = ?', [newPasswordHashed, email]);

            // Configurar y enviar el correo con la contraseña en texto plano
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
                text: `Tu nueva contraseña es: ${newPasswordPlain}`,
                html: `<p>Tu nueva contraseña es: <strong>${newPasswordPlain}</strong></p>
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
}

const usuariosController = new UsuariosController();
export { upload, usuariosController };
