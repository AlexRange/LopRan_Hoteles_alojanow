import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import poolPromise from '../database';
import xss from 'xss';

class LoginController {
    public async login(req: Request, res: Response): Promise<void> {
        try {
            // Sanitizar los datos recibidos para evitar XSS
            const email = xss(req.body.email);
            const contrasena = xss(req.body.contrasena);

            const pool = await poolPromise;

            const result: any = await pool.query(
                'SELECT id_usuario, nombre, email, telefono, tipo, imagen_usuario, estatus, contrasena FROM usuarios WHERE email = ?',
                [email]
            );

            if (Array.isArray(result) && result.length > 0) {
                const user = result[0];

                // No sanitizamos contrasena almacenada, sólo comparamos
                const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
                if (!passwordMatch) {
                    res.status(401).json({ success: false, message: "Credenciales incorrectas" });
                    return;
                }

                if (user.estatus === 1) {
                    const token = jwt.sign(
                        {
                            id: user.id_usuario,
                            email: user.email,
                            nombre: user.nombre,
                            tipo: user.tipo
                        },
                        config.jwtSecret,
                        { expiresIn: config.jwtExpiration } as jwt.SignOptions
                    );

                    // Actualizar tanto el token como la fecha de último login
                    await pool.query(
                        'UPDATE usuarios SET token = ?, ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = ?',
                        [token, user.id_usuario]
                    );

                    await pool.query('UPDATE usuarios SET token = ? WHERE id_usuario = ?', [token, user.id_usuario]);

                    // Sanitizar datos sensibles antes de enviarlos
                    res.json({
                        success: true,
                        message: "Inicio de sesión exitoso",
                        token,
                        usuario: {
                            id_usuario: user.id_usuario,
                            nombre: xss(user.nombre),
                            email: xss(user.email),
                            tipo: xss(user.tipo),
                            imagen_usuario: xss(user.imagen_usuario)
                        }
                    });
                } else {
                    res.status(403).json({ success: false, message: "Cuenta deshabilitada" });
                }
            } else {
                res.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }
        } catch (error) {
            console.error('Error en el login:', error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({ success: false, message: "Token no proporcionado" });
                return;
            }

            const pool = await poolPromise;
            await pool.query('UPDATE usuarios SET token = NULL WHERE token = ?', [token]);

            res.json({ success: true, message: "Sesión cerrada correctamente" });
        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    public async validateToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({ valid: false, message: "Token no proporcionado" });
                return;
            }

            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    res.status(401).json({ valid: false, message: "Token inválido o expirado" });
                    return;
                }
                res.json({ valid: true, user: decoded });
            });
        } catch (error) {
            console.error('Error validando token:', error);
            res.status(500).json({ valid: false, message: "Error interno del servidor" });
        }
    }
}

const loginController = new LoginController();
export default loginController;