interface JWTConfig {
    jwtSecret: string;
    jwtExpiration: string | number;
}

const config: JWTConfig = {
    jwtSecret: process.env.JWT_SECRET || '4be1995876d8026f0c1b7220ecee7460d8da8b6a76ac807b4c6e02296554a996',
    jwtExpiration: '2h' // This can be string ('2h') or number (in seconds)
};

export default config;