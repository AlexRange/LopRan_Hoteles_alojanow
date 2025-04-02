export default {
    database: {
        host: 'localhost',
        user: 'root',
        database: 'reservaciones_hoteles'
    }
}

// export default {
//     database: {
//         host: process.env.MYSQL_ADDON_HOST || 'bva3uonljeeexarutwta-mysql.services.clever-cloud.com',
//         user: process.env.MYSQL_ADDON_USER || 'uv4y0jdvnq6o6i25',
//         password: process.env.MYSQL_ADDON_PASSWORD || '4SmpVJk2TSd4gXOZMw8h',
//         database: process.env.MYSQL_ADDON_DB || 'bva3uonljeeexarutwta',
//         port: Number(process.env.MYSQL_ADDON_PORT) || 3306,
//         ssl: {
//             rejectUnauthorized: false // Obligatorio para Clever Cloud
//         },
//         waitForConnections: true,
//         connectionLimit: 10,
//         namedPlaceholders: true
//     }
// };