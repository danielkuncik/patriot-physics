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
            "section": 'red'
        },
        {
            "name": "marie",
            'passcode': '123456',
            'section': 'diamond'
        },
        {
            "name": "diane",
            'passcode': '987654',
            'section': 'green'
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

check_login = (req, res, next) => {
    let inputtedName = req.body.name;
    let inputtedPasscode = Number(req.body.passcode);

    pool.query('SELECT * FROM students WHERE name = $1', [inputtedName], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length > 0) {
            if (result.rows[0].passcode === inputtedPasscode) {
                req.session.student = result.rows[0];
            }
        }
        next();
    });
};

check_if_logged_in = function(req, res, next) {
    if (req.session.student) {
        req.user = req.session.student;
    } else {
        req.user = undefined;
    }
    next();
};

module.exports = {
    check_login,
    check_if_logged_in
};