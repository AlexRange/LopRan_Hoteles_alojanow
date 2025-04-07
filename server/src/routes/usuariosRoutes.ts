import { Router } from "express";
import { upload, usuariosController } from "../controllers/usuariosController";

class UsuariosRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', usuariosController.list);
        this.router.get('/:id_usuario', usuariosController.getOne);
        this.router.post('/', usuariosController.create);
        this.router.put('/:id_usuario', usuariosController.update);
        this.router.delete('/:id_usuario', usuariosController.delete);
        this.router.post('/send-code', usuariosController.sendCode);
        this.router.post('/verify-code', usuariosController.verifyCode);
        this.router.post('/send-passwd', usuariosController.sendNewPassword);
        this.router.post('/upload', upload.single('image'), usuariosController.uploadImage);
    }
}

const usuariosRoutes = new UsuariosRoutes();
export default usuariosRoutes.router;