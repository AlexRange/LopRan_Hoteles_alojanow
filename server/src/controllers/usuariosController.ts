import crypto from 'crypto';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import poolPromise from '../database';

class UsuariosController {
    public async list(req: Request, res: Response): Promise<void> {
        try {
            const pool = await poolPromise;
            const [result] = await pool.query('SELECT * FROM usuarios');
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
    }

    public async getOne(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;
        try {
            const pool = await poolPromise;
            const [result] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
            
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
            const [countResult]: any = await pool.query('SELECT COUNT(*) as total FROM usuarios');
            const count = countResult[0].total;
            
            const userData = req.body;

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
        const { id_usuario } = req.params;
        try {
            const pool = await poolPromise;
            await pool.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [req.body, id_usuario]);
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
            const [result] = await pool.query('SELECT * FROM verification_codes WHERE email = ? AND code = ?', [email, code]);

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
        try {
            const newPassword = crypto.randomBytes(4).toString('hex');
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
                text: `Tu nueva contraseña es: ${newPassword}`
            });

            const pool = await poolPromise;
            await pool.query('UPDATE usuarios SET password = ? WHERE email = ?', [newPassword, email]);
            res.json({ message: 'Nueva contraseña enviada' });
        } catch (error) {
            res.status(500).json({ message: 'Error al enviar la contraseña' });
        }
    }
}

const usuariosController = new UsuariosController();
export default usuariosController;