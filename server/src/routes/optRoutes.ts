import { Router } from 'express';
import otpController from '../controllers/otpController';

class OtpRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        // Ruta para enviar un código OTP
        this.router.post('/send-otp', otpController.sendOtp);

        // Ruta para verificar un código OTP
        this.router.post('/verify-otp', otpController.verifyOtp);
    }
}

const otpRoutes = new OtpRoutes();
export default otpRoutes.router;