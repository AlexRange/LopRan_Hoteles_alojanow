import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { logSuspiciousActivity } from '../utils/logger';

interface JwtPayload {
    id: number;
    email: string;
    nombre: string;
    tipo: string;
}

// Middleware de headers de seguridad (exportado)
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
    // Aplicar todos los headers de seguridad
    res.setHeader('Content-Security-Policy', config.securityHeaders.csp);
    res.setHeader('Strict-Transport-Security', config.securityHeaders.hsts);
    res.setHeader('X-XSS-Protection', config.securityHeaders.xssProtection);
    res.setHeader('X-Frame-Options', config.securityHeaders.frameOptions);
    res.setHeader('X-Content-Type-Options', config.securityHeaders.contentTypeOptions);
    res.setHeader('Referrer-Policy', config.securityHeaders.referrerPolicy);
    
    next();
};

// Middleware de autenticación (exportado)
export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        securityHeaders(req, res, () => {});
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            logSuspiciousActivity(req.ip ?? 'unknown', 'Token ausente');
            res.status(401).json({ error: 'Por favor autentícate' });
            return;
        }
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        (req as any).token = token;
        (req as any).user = decoded;
        next();
    } catch (err) {
        logSuspiciousActivity(req.ip ?? 'unknown', 'Token inválido');
        res.status(401).json({ error: 'Por favor autentícate' });
    }
};