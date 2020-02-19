const Pool = require('pg').Pool;
const isProduction = process.env.NODE_ENV === 'production';
const bodyParser = require('body-parser');


require('dotenv').config();

const connectionStringForDevelopment =
    `pstgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionStringForDevelopment,
    ssl: isProduction,
});



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
                pool.query('SELECT * FROM sections WHERE id = $1', [req.session.student.section_id], (err, result2) => {
                    if (error) {
                        throw error
                    }
                    if (result2.rows.length > 0) {
                        req.session.section = result2.rows[0];
                        next();
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        } else {
            next();
        }
    });
};

check_if_logged_in = function(req, res, next) {
    if (req.session.student) {
        req.user = req.session.student;
    } else {
        req.user = undefined;
    }
    if (req.session.section) {
        req.section = req.session.section;
    } else {
        req.section = undefined;
    }
    next();
};


module.exports = {
    check_login,
    check_if_logged_in
};