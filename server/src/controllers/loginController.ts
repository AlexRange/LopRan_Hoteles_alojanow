import { Request, Response } from 'express';
import poolPromise from '../database';

class LoginController {
    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, contrasena } = req.body;
    
            console.log("Datos recibidos desde el frontend:", req.body);
    
            // Verificar si los campos están presentes
            if (!email || !contrasena) {
                return res.status(400).json({ success: false, message: "Email y contraseña son requeridos" });
            }
    
            const pool = await poolPromise;
            const usuario = await pool.query('SELECT * FROM usuarios WHERE email = ? AND contrasena = ?', [email, contrasena]);
    
            if (usuario.length > 0) {
                console.log("Inicio de sesión exitoso. Datos del usuario:", usuario[0]); // Mostrar usuario en consola
                return res.json({ success: true, message: "Inicio de sesión exitoso", usuario: usuario[0] });
            } else {
                console.log("Inicio de sesión fallido. Usuario no encontrado.");
                return res.status(401).json({ success: false, message: "Email o contraseña incorrectos" });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error en el login:", error.message);
                return res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
            } else {
                console.error("Error desconocido:", error);
                return res.status(500).json({ success: false, message: "Error desconocido en el servidor" });
            }
        }
    }
}

const loginController = new LoginController();
export default loginController;