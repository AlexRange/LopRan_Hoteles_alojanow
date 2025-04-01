import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface JwtPayload {
    id: number;
    email: string;
    nombre: string;
    tipo: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            res.status(401).json({ error: 'Por favor autentícate' });
            return;
        }

        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        (req as any).token = token;
        (req as any).user = decoded;
        
        next();
    } catch (err) {
        res.status(401).json({ error: 'Por favor autentícate' });
    }
};