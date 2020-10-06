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
    if (section === 'Violet' || section === 'Thursday1' || section === 'Friday1' || section === 'Tuesday3' || section === 'Wednesday3') {
        courseLevel = 'AP';
    } else if (section === 'Red' || section === 'Blue' || section === 'Green' || section === 'Tuesday1' || section === 'Wednesday1' || section === 'Thursday2' || section === 'Friday2' || section === 'Thursday3' || section === 'Friday3') {
        courseLevel = 'Honors';
    } else if (section === 'Orange') {
        courseLevel = 'A_Level';
    } else {
        courseLevel = undefined;
    }
    return courseLevel
}


const check_login = (req, res, next) => {
    let inputtedName = (req.body.name).trim();
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
                req.body.flashMessage = 'Incorrect password';
                next();
            }
        } else {
            req.body.flashMessage = 'Username does not exist';
            next();
        }
    });
};

const unitMap = require(__dirname + '/public/unit_map');




const load_grades = function(req, res, next) {
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
            req.session.gradeMap = newGradeMap;
            req.session.overallLevel = newGradeMap.calculateOverallLevel();

            next();
        });
    } else {
        next();
    }
};

const count_all_attempts = function(req, res, next) {
    if (req.session.student) {
        pool.query('SELECT * FROM quiz_attempts WHERE student_id = $1',[req.session.student.id], (error, result) => {
            req.session.totalAttempts = result.rows.length;
            next();
        });
    } else {
        next();
    }
};


const check_if_logged_in = function(req, res, next) {
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
    if (req.session.totalAttempts) {
        req.totalAttemps = req.session.totalAttempts;
    } else {
        req.totalAttemps = 0;
    }
    if (req.session.gradeMap && req.session.overallLevel !== undefined) {
        req.gradeMap = req.session.gradeMap.map;
        req.overallLevel = req.session.overallLevel;
    } else {
        req.gradeMap = undefined;
        req.overallLevel = undefined;
    }

    next();
};

const kick_out_if_not_logged_in = function(req, res, next) {
    if (req.user === undefined) {
        res.redirect('/login');
    }
    next();
};


const submit_quiz = function(req, res, next) {
    const pod_uuid = req.query.uuid;
    const student_id = req.user.id;

    if (req.files === undefined) {
        res.redirect('/');
        // need a flash!
    } else {
        let imageURL_1, imagePUBLIC_ID_1, imageURL_2, imagePUBLIC_ID_2, imageURL_3, imagePUBLIC_ID_3;
        if (req.files[0]) {
            imageURL_1 = req.files[0].url;
            imagePUBLIC_ID_1 = req.files[0].public_id;
        } else {
            imageURL_1 = "";
            imagePUBLIC_ID_1 = "";
        }
        if (req.files[1]) {
            imageURL_2 = req.files[1].url;
            imagePUBLIC_ID_2 = req.files[1].public_id;
        } else {
            imageURL_2 = "";
            imagePUBLIC_ID_2 = "";
        }
        if (req.files[2]) {
            imageURL_3 = req.files[2].url;
            imagePUBLIC_ID_3 = req.files[2].public_id;
        } else {
            imageURL_3 = "";
            imagePUBLIC_ID_3 = "";
        }
        // const imageURL = req.file.url;
        // const imagePUBLIC_ID = req.file.public_id;


        pool.query('INSERT INTO quiz_attempts (student_id,pod_uuid,image_url_1,image_url_2, image_url_3,tstz,version) VALUES ($1, $2, $3,$4,$5,current_timestamp,$6)',[student_id, pod_uuid, imageURL_1,imageURL_2,imageURL_3,req.version],(error, results) => {
            if (error) {
                throw error
            }
            req.session.totalAttempts += 1;
            //req.session.gradeMap.setQuizPending(pod_uuid); this line is not working
            // the functions not stored in the session object, need to think of a different way
            next();
        });
    }
};

const look_up_quiz_attempts = function(req, res, next) {
    if (req.user) {
        const pod_uuid = req.params.pod_uuid;
        const student_id = req.user.id;
        pool.query('SELECT comment,score,image_url_1,image_url_2,image_url_3,tstz FROM quiz_attempts WHERE student_id = $1 AND pod_uuid = $2',[student_id, pod_uuid], (err, results) => {
            if (err) {
                throw err
            }
            req.previousAttempts = results.rows;
            if (results.rows.length > 0) {
                let lastAttempt = results.rows[results.rows.length - 1];
                if (lastAttempt.score === null) {
                    req.ungradedQuizzes = true;
                } else {
                    req.ungradedQuizzes = false;
                }
            } else {
                req.ungradedQuizzes = false;
            }
            next();
        });
    } else {
        next();
    }
};


const look_up_quiz_attempts_2 = function(req, res, next) {
    if (req.user) {
        const pod_uuid = req.params.pod_uuid;
        const student_id = req.user.id;
        pool.query('SELECT comment,score,image_url_1,tstz FROM quiz_attempts WHERE student_id = $1 AND pod_uuid = $2',[student_id, pod_uuid], (err, results) => {
            if (err) {
                throw err
            }
            req.previousAttempts = results.rows;
            if (results.rows.length > 0) {
                let lastAttempt = results.rows[results.rows.length - 1];
                if (lastAttempt.score === null) {
                    req.ungradedQuizzes = true;
                } else {
                    req.ungradedQuizzes = false;
                }
            } else {
                req.ungradedQuizzes = false;
            }
            next();
        });
    } else {
        next();
    }
};


find_pending_quizzes = function(req, res, next) {
    if (req.session.student) {
        const id = req.session.student.id;
        pool.query('SELECT pod_uuid FROM quiz_attempts WHERE student_id = $1 AND score IS NULL', [req.session.student.id], (err, results) => {
            if (err) {
                throw  err
            }
            results.rows.forEach((result) => {
                const pod_uuid = result.pod_uuid;
                req.session.gradeMap.setQuizPending(pod_uuid);
            });
            next();
        });
    } else {
        next();
    }
};


module.exports = {
    check_login,
    check_if_logged_in,
    load_grades,
    kick_out_if_not_logged_in,
    submit_quiz,
    look_up_quiz_attempts,
    look_up_quiz_attempts_2,
    count_all_attempts,
    find_pending_quizzes
};