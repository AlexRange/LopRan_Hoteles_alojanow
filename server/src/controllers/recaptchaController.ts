import { Request, Response } from 'express';

class RecaptchaController {
    public async verifyRecaptcha(req: Request, res: Response): Promise<void> {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ success: false, message: "Token de reCAPTCHA no proporcionado" });
            return;
        }

        const RECAPTCHA_SECRET_KEY = '6LeHj9oqAAAAAFF6Ajb6UXG3Dy_BMxTWZzNSUgnE';

        try {
            const response = await fetch(
                `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
                { method: 'POST' }
            );

            const data = await response.json();

            if (data.success) {
                // Agregar información de tiempo de expiración
                const now = new Date();
                const expiryTime = new Date(now.getTime() + 2 * 60000); // 2 minutos de expiración
                
                res.status(200).json({ 
                    success: true, 
                    message: "reCAPTCHA verificado correctamente",
                    expiry: expiryTime.toISOString()
                });
            } else {
                res.status(400).json({ 
                    success: false, 
                    message: "reCAPTCHA no válido", 
                    errors: data['error-codes'] 
                });
            }
        } catch (error) {
            console.error("Error al verificar reCAPTCHA:", error);
            res.status(500).json({ 
                success: false, 
                message: "Error al verificar reCAPTCHA",
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}

const recaptchaController = new RecaptchaController();
export default recaptchaController;