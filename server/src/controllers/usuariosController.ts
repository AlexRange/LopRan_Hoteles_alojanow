import crypto from 'crypto';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import poolPromise from '../database';

class UsuariosController {
    // Método para listar usuarios
    public async list(req: Request, res: Response): Promise<Response> {
        try {
            const pool = await poolPromise;
            const [usuarios] = await pool.query('SELECT * FROM usuarios');
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Error retrieving users' });
        }
    }

    // Método para obtener un usuario por ID
    public async getOne(req: Request, res: Response): Promise<Response> {
        const { id_usuario } = req.params;
        try {
            const pool = await poolPromise;
            const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            return res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            return res.status(500).json({ error: 'Error retrieving user' });
        }
    }

    // Método para crear un nuevo usuario
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            // Verificar el contenido de req.body
            console.log("Datos recibidos:", req.body);

            const pool = await poolPromise;

            // Asegúrate de que req.body tenga la estructura correcta según la base de datos
            const result = await pool.query('INSERT INTO usuarios SET ?', [req.body]);

            console.log("Resultado de la inserción:", result);

            // Si la inserción fue exitosa, enviar la respuesta
            return res.json({ message: 'Usuario guardado exitosamente' });
        } catch (error: unknown) {
            // Verificar si el error tiene la propiedad 'message' (type guard)
            if (error instanceof Error) {
                console.error("Error al crear el usuario:", error.message);
                return res.status(500).json({
                    error: 'Error creando el usuario',
                    details: error.message  // Mostrar detalles del error
                });
            } else {
                console.error("Error desconocido:", error);
                return res.status(500).json({
                    error: 'Error desconocido',
                    details: 'Ocurrió un error desconocido durante la creación del usuario.'
                });
            }
        }
    }

    // Método para eliminar un usuario por ID
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id_usuario } = req.params;
            const pool = await poolPromise;
            await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            return res.json({ message: "The user was deleted" });
        } catch (error) {
            return res.status(500).json({ error: 'Error deleting user' });
        }
    }

    // Método para actualizar un usuario por ID
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id_usuario } = req.params;
            const pool = await poolPromise;
            await pool.query('UPDATE usuarios set ? WHERE id_usuario = ?', [req.body, id_usuario]);
            return res.json({ message: "The user was updated" });
        } catch (error) {
            return res.status(500).json({ error: 'Error updating user' });
        }
    }

    // Método para enviar código de verificación
    public async sendCode(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no válido' });
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');

        // Configura el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'appnotificaciones68@gmail.com', // Utiliza variables de entorno
                pass: 'nnev ftrj fjgr hgkt'  // Utiliza variables de entorno
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de Verificación',
            text: `Tu código de verificación es: ${verificationCode}`
        };

        try {
            // Enviar el correo
            await transporter.sendMail(mailOptions);

            // Insertar el código de verificación en la base de datos
            const pool = await poolPromise;
            await pool.query('INSERT INTO verification_codes (email, code) VALUES (?, ?)', [email, verificationCode]);

            return res.json({ message: 'Código de verificación enviado' });
        } catch (error) {
            console.error('Error al enviar el correo o guardar en la base de datos:', error);
            return res.status(500).json({ message: 'Error al enviar el correo o guardar en la base de datos' });
        }
    }

    public async verifyCode(req: Request, res: Response): Promise<void> {
        try {

            const { email, code } = req.body;

            // Validación de datos
            if (!email || !code) {
                console.error("Faltan datos: Email o Código no proporcionados");
                res.status(400).json({ success: false, message: 'Email y código son requeridos' });
                return;
            }

            // Obtener conexión desde la promesa de pool
            const pool = await poolPromise;  // <- Espera que la conexión esté lista

            // Consulta a la base de datos
            const result = await pool.query('SELECT * FROM verification_codes WHERE email = ? AND code = ?', [email, code]);

            if (result.length > 0) {
                // Eliminar código después de la verificación exitosa
                await pool.query('UPDATE verification_codes SET estatus = ? WHERE email = ? AND code = ?', ['Verificado', email, code]);

                res.status(200).json({ success: true, message: 'Código verificado correctamente' });
            } else {
                console.error("Código inválido");
                res.status(400).json({ success: false, message: 'Código inválido o expirado' });
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    // Método para enviar nueva contraseña
    public async sendNewPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no válido' });
        }

        // Generar una nueva contraseña aleatoria
        const newPassword = crypto.randomBytes(4).toString('hex'); // Contraseña de 8 caracteres

        // Configura el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'appnotificaciones68@gmail.com', // Utiliza variables de entorno
                pass: 'nnev ftrj fjgr hgkt' // Utiliza variables de entorno
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Nueva contraseña generada',
            text: `Tu nueva contraseña es: ${newPassword}`
        };

        try {
            // Enviar el correo
            await transporter.sendMail(mailOptions);

            // Actualizar la contraseña en la base de datos
            const pool = await poolPromise;
            await pool.query('UPDATE usuarios SET password = ? WHERE email = ?', [newPassword, email]);

            return res.json({ message: 'Nueva contraseña enviada al correo' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ message: 'Error al enviar el correo' });
        }
    }
}

const usuariosController = new UsuariosController();
export default usuariosController;
