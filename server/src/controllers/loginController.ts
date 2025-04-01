import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';
import config from '../config/config';
import poolPromise from '../database';

interface Usuarios extends RowDataPacket {
    id_usuario: number;
    nombre: string;
    email: string;
    telefono?: string;
    tipo: 'cliente' | 'admin';
    imagen_usuario: string;
    estatus: boolean;
}

class LoginController {
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, contrasena } = req.body;
            const pool = await poolPromise;

            const [rows] = await pool.query<Usuarios[]>(
                'SELECT id_usuario, nombre, email, telefono, tipo, imagen_usuario, estatus FROM usuarios WHERE email = ? AND contrasena = ?', 
                [email, contrasena]
            );
            
            if (rows && rows.length > 0) {
                const user = rows[0];
                
                if (user.estatus) {
                    const token = jwt.sign(
                        { 
                            id: user.id_usuario,
                            email: user.email,
                            nombre: user.nombre,
                            tipo: user.tipo
                        },
                        config.jwtSecret,
                        { 
                            expiresIn: config.jwtExpiration
                        } as jwt.SignOptions
                    );
                    
                    await pool.query('UPDATE usuarios SET token = ? WHERE id_usuario = ?', [token, user.id_usuario]);
                    
                    res.json({ 
                        success: true, 
                        message: "Inicio de sesión exitoso",
                        token,
                        usuario: {
                            id_usuario: user.id_usuario,
                            nombre: user.nombre,
                            email: user.email,
                            tipo: user.tipo,
                            imagen_usuario: user.imagen_usuario
                        }
                    });
                } else {
                    res.status(403).json({ success: false, message: "Cuenta deshabilitada" });
                }
            } else {
                res.status(401).json({ success: false, message: "Credenciales incorrectas" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Error en el servidor" });
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                res.status(401).json({ success: false, message: "No se proporcionó token" });
                return;
            }

            const pool = await poolPromise;
            await pool.query('UPDATE usuarios SET token = NULL WHERE token = ?', [token]);
            
            res.json({ success: true, message: "Sesión cerrada exitosamente" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Error en el servidor" });
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
                    res.status(401).json({ valid: false, message: "Token inválido" });
                    return;
                }
                res.json({ valid: true, usuario: decoded });
            });
        } catch (error) {
            res.status(500).json({ valid: false, message: "Error en el servidor" });
        }
    }
}

const loginController = new LoginController();
export default loginController;