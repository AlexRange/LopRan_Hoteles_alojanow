import { Router } from 'express';
import recaptchaController from '../controllers/recaptchaController';

class RecaptchaRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/', recaptchaController.verifyRecaptcha); // Ruta para verificar reCAPTCHA
    }
}

const recaptchaRoutes = new RecaptchaRoutes();
export default recaptchaRoutes.router;