interface SecurityConfig {
    jwtSecret: string;
    jwtExpiration: string | number;
    securityHeaders: {
        csp: string;
        hsts: string;
        xssProtection: string;
        frameOptions: string;
        contentTypeOptions: string;
        referrerPolicy: string;
    };
}

const config: SecurityConfig = {
    jwtSecret: process.env.JWT_SECRET || '4be1995876d8026f0c1b7220ecee7460d8da8b6a76ac807b4c6e02296554a996',
    jwtExpiration: '2h',
    securityHeaders: {
        csp: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'",
        hsts: 'max-age=63072000; includeSubDomains; preload',
        xssProtection: '1; mode=block',
        frameOptions: 'DENY',
        contentTypeOptions: 'nosniff',
        referrerPolicy: 'strict-origin-when-cross-origin'
    }
};

export default config;