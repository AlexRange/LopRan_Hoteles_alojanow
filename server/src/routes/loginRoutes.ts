import { Router } from "express";
import loginController from "../controllers/loginController";
import { auth } from "../middleware/auth";

class LoginRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.post('/', loginController.login);
        this.router.post('/logout', auth, loginController.logout);
        this.router.get('/validate-token', auth, loginController.validateToken);
    }
}

const loginRoutes = new LoginRoutes();
export default loginRoutes.router;