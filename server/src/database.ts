// import mysql from 'promise-mysql';
// import keys from './keys';

// const poolPromise = mysql.createPool(keys.database);

// poolPromise.then(pool => {
//     return pool.getConnection()
//         .then(connection => {
//             connection.release();
//             console.log('DB is Connected to Clever Cloud');
//         });
// }).catch(err => {
//     console.error('Error connecting to the database:', err);
// });

// export default poolPromise;

import mysql from 'mysql2/promise';
import keys from './keys';

const poolPromise = mysql.createPool(keys.database);

poolPromise.getConnection()
    .then(connection => {
        connection.release();
        console.log('DB is Connected to Clever Cloud');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

export default poolPromise;