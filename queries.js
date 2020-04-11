const Pool = require('pg').Pool;
const isProduction = process.env.NODE_ENV === 'production';
const bodyParser = require('body-parser');
const gm = require('./gradeMap.js');

require('dotenv').config();

const connectionStringForDevelopment =
    `pstgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionStringForDevelopment,
    ssl: isProduction,
});


function getCourseLevel(section) {
    let courseLevel;
    if (section === 'Violet') {
        courseLevel = 'AP';
    } else if (section === 'Red' || section === 'Blue' || section === 'Green') {
        courseLevel = 'Honors';
    } else if (section === 'Orange') {
        courseLevel = 'A_Level';
    } else {
        courseLevel = undefined;
    }
    return courseLevel
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
                pool.query('SELECT * FROM sections WHERE id = $1', [req.session.student.section_id], (err, result2) => {
                    if (error) {
                        throw error
                    }
                    if (result2.rows.length > 0) {
                        req.session.section = result2.rows[0];
                        req.session.courseLevel = getCourseLevel(result2.rows[0].name);
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

const unitMap = require(__dirname + '/public/unit_map');




load_grades = function(req, res, next) {
    let newGradeMap = new gm.GradeMap();

    if (req.session.student) {
        //    pool.query('SELECT * FROM students WHERE name = $1', [inputtedName], (error, result) => {
        pool.query('SELECT * FROM grades WHERE student_id = $1', [req.session.student.id], (error, result) => {
            if (error) {
                throw error
            }
            result.rows.forEach((score) => {
                newGradeMap.addScore(score.pod_uuid, score.score);
            });
            newGradeMap.calculateAllUnitLevels();
            // newGradeMap.calculateGrades(req.session.courseLevel);
            req.session.gradeMap = newGradeMap.map;
            req.session.overallLevel = newGradeMap.calculateOverallLevel();
            next();
        });
    } else {
        next();
    }
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
    if (req.session.courseLevel) {
        req.courseLevel = req.session.courseLevel;
    } else {
        req.courseLevel = undefined;
    }
    if (req.session.gradeMap && req.session.overallLevel) {
        req.gradeMap = req.session.gradeMap;
        req.overallLevel = req.session.overallLevel;
    } else {
        req.gradeMap = undefined;
        req.overallLevel = undefined;
    }

    next();
};

kick_out_if_not_logged_in = function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/login');
    }
    next();
};

submit_quiz = function(req, res, next) {
    const pod_uuid = req.query.uuid;
    const student_id = req.user.id;
    pool.query('INSERT INTO quiz_attempts (student_id,pod_uuid,tstz) VALUES ($1, $2, current_timestamp)',[student_id, pod_uuid],(error, results) => {
        if (error) {
            throw error
        }
        next();
    });
};


module.exports = {
    check_login,
    check_if_logged_in,
    load_grades,
    kick_out_if_not_logged_in,
    submit_quiz
};