import { Request, Response } from 'express';

class RecaptchaController {
    public async verifyRecaptcha(req: Request, res: Response): Promise<void> {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ success: false, message: "Token de reCAPTCHA no proporcionado" });
            return;
        }

        const RECAPTCHA_SECRET_KEY = '6LeHj9oqAAAAAFF6Ajb6UXG3Dy_BMxTWZzNSUgnE'; // Reemplaza con tu secret key

        try {
            const response = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
                { method: 'POST' }
            );

            const data = await response.json();

            if (data.success) {
                res.status(200).json({ success: true, message: "reCAPTCHA verificado correctamente" });
            } else {
                res.status(400).json({ success: false, message: "reCAPTCHA no válido", errors: data['error-codes'] });
            }
        } catch (error) {
            console.error("Error al verificar reCAPTCHA:", error);
            res.status(500).json({ success: false, message: "Error al verificar reCAPTCHA" });
        }
    }
}

const recaptchaController = new RecaptchaController();
export default recaptchaController;