const Pool = require('pg').Pool;
const isProduction = process.env.NODE_ENV === 'production';

require('dotenv').config();

const connectionStringForDevelopment =
    `pstgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionStringForDevelopment,
    ssl: isProduction,
});





// will later be replaced with a database program!
function findUser(name) {

    // temporary, to practice getting the login set up
    const users = [
        {
            "name": "daniel",
            "passcode": "12345",
            "color": 'red'
        },
        {
            "name": "marie",
            'passcode': 'cake',
            'color': 'diamond'
        },
        {
            "name": "diane",
            'passcode': 'eyes',
            'color': 'green'
        }
    ];


    let selectedUser = undefined;
    users.forEach((user) => {
        if (user.name === name) {
            selectedUser = user;
        }
    });
    return selectedUser
}

module.exports = {
    findUser
};