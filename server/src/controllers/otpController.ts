import crypto from 'crypto';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import poolPromise from '../database';

class OtpController {
    public async sendOtp(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, message: 'Email no válido' });
            return;
        }

        // Generar un código OTP de 6 dígitos
        const otpCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Configurar el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'appnotificaciones68@gmail.com',
                pass: 'nnev ftrj fjgr hgkt'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código OTP para verificación',
            text: `Tu código OTP es: ${otpCode}. \nEste código expirará en 60 segundos.`
        };

        try {
            await transporter.sendMail(mailOptions);

            const pool = await poolPromise;
            await pool.query(
                'INSERT INTO otp_codes (email, code_otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 MINUTE))',
                [email, otpCode]
            );

            res.status(200).json({ success: true, message: 'Código OTP enviado correctamente' });
        } catch (error) {
            console.error('Error al enviar el código OTP:', error);
            res.status(500).json({ success: false, message: 'Error al enviar el código OTP' });
        }
    }

    public async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, code_otp } = req.body;
    
            if (!email || !code_otp) {
                console.error("Faltan datos: Email o código OTP no proporcionados");
                res.status(400).json({ success: false, message: 'Email y código OTP son requeridos' });
                return;
            }
    
            const pool = await poolPromise;
            const result = await pool.query(
                'SELECT * FROM otp_codes WHERE email = ? AND code_otp = ? AND status = "Pendiente" AND expires_at > NOW()',
                [email, code_otp]
            );
    
            if (result.length > 0) {
                await pool.query(
                    'UPDATE otp_codes SET status = "Verificado" WHERE email = ? AND code_otp = ?',
                    [email, code_otp]
                );
    
                res.status(200).json({ success: true, message: 'Código OTP verificado correctamente' });
            } else {
                console.error("Código OTP inválido, expirado o ya verificado");
                res.status(400).json({ success: false, message: 'Código OTP inválido, expirado o ya verificado' });
            }
        } catch (error) {
            console.error("Error al verificar el código OTP:", error);
            res.status(500).json({ success: false, message: 'Error interno del servidor al verificar el código OTP' });
        }
    }
}

const otpController = new OtpController();
export default otpController;