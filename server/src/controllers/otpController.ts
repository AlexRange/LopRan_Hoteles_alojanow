import crypto from 'crypto';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import poolPromise from '../database'; // Asegúrate de tener tu conexión a la base de datos

class OtpController {
    // Método para enviar un código OTP al correo electrónico
    public async sendOtp(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Email no válido' });
        }

        // Generar un código OTP de 6 dígitos
        const otpCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Configurar el transporte de nodemailer para enviar el correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'appnotificaciones68@gmail.com', // Usa variables de entorno
                pass: 'nnev ftrj fjgr hgkt' // Usa variables de entorno
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código OTP para verificación',
            text: `Tu código OTP es: ${otpCode}. \n
            Este código expirará en 60 segundos.`
        };

        try {
            // Enviar el correo electrónico
            await transporter.sendMail(mailOptions);

            // Guardar el código OTP en la base de datos
            const pool = await poolPromise;
            await pool.query(
                'INSERT INTO otp_codes (email, code_otp, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 MINUTE))',
                [email, otpCode]
            );

            return res.status(200).json({ success: true, message: 'Código OTP enviado correctamente' });
        } catch (error) {
            console.error('Error al enviar el código OTP:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar el código OTP' });
        }
    }

    public async verifyOtp(req: Request, res: Response): Promise<Response> {
        try {
            console.log("Datos recibidos:", req.body);
    
            const { email, code_otp } = req.body;
    
            // Validación de datos
            if (!email || !code_otp) {
                console.error("Faltan datos: Email o código OTP no proporcionados");
                return res.status(400).json({ success: false, message: 'Email y código OTP son requeridos' });
            }
    
            // Obtener conexión
            const pool = await poolPromise;
    
            // Consulta a la base de datos
            const result = await pool.query(
                'SELECT * FROM otp_codes WHERE email = ? AND code_otp = ? AND status = "Pendiente" AND expires_at > NOW()',
                [email, code_otp]
            );
    
            console.log("Resultado de la consulta:", result);
    
            if (result.length > 0) {
                // Marcar el código como verificado
                await pool.query(
                    'UPDATE otp_codes SET status = "Verificado" WHERE email = ? AND code_otp = ?',
                    [email, code_otp]
                );
    
                return res.status(200).json({ success: true, message: 'Código OTP verificado correctamente' });
            } else {
                console.error("Código OTP inválido, expirado o ya verificado");
                return res.status(400).json({ success: false, message: 'Código OTP inválido, expirado o ya verificado' });
            }
        } catch (error) {
            console.error("Error al verificar el código OTP:", error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor al verificar el código OTP' });
        }
    }
}

const otpController = new OtpController();
export default otpController;