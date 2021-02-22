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
                        req.flash('successFlash','Login Successful');
                        next();
                    } else {
                        next();
                    }
                });
            } else {
                req.flash('dangerFlash','Incorrect password');
                res.redirect(`/login?newPath=${req.newPath}`);
            }
        } else {
            req.flash('dangerFlash','Username does not exist');
            res.redirect(`/login?newPath=${req.newPath}`);
        }
    });
};

const unitMap = require(__dirname + '/public/unit_map');



const load_grades = function(req, res, next) {
    const courseLevel = !!req.session.courseLevel ? req.session.courseLevel : undefined;
    let newGradeMap = new gm.GradeMap(courseLevel);

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
            newGradeMap.calculateGrade();
            // newGradeMap.calculateGrades(req.session.courseLevel);
            req.session.gradeMap = newGradeMap;
            req.session.overallLevel = newGradeMap.calculateOverallLevel();

            next();
        });
    } else {
        next();
    }
};

const loadPracticeGrades = function(req, res, next) {
    if (req.session.student) {
        pool.query('SELECT * FROM practice_grades WHERE student_id = $1', [req.session.student.id], (error, result) => {
            if (error) {
                throw error
            }
            result.rows.forEach((score) => {
                req.session.gradeMap.addPracticeScore(score.pod_uuid, score.score, score.comment);
            });

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
        req.loggedIn = true;
    } else {
        req.user = undefined;
        req.loggedIn = false;
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
    const pod_uuid = req.uuid;
    const student_id = req.user.id;

    req.session.gradeMap.map[req.superUnitKey].units[req.unitKey].pods[req.podKey].pending = true;
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


        pool.query('INSERT INTO quiz_attempts (student_id,pod_uuid,image_url_1,image_url_2, image_url_3,tstz,version,answers) VALUES ($1, $2, $3,$4,$5,current_timestamp,$6,$7)',[student_id, pod_uuid, imageURL_1,imageURL_2,imageURL_3,req.version,req.answerText],(error, results) => {
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

const submit_practice = (req, res, next) => {
    const pod_uuid = req.pod_uuid;
    const student_id = req.user.id;
    req.session.gradeMap.map[req.superUnitKey].units[req.unitKey].pods[req.podKey].practicePending = true;

    if (req.files === undefined) {
        res.redirect('/');
        // need a flash!
    } else {
        let imageURL_1, imagePUBLIC_ID_1, imageURL_2, imagePUBLIC_ID_2, imageURL_3, imagePUBLIC_ID_3, imageURL_4, imagePUBLIC_ID_4, imageURL_5, imagePUBLIC_ID_5, imageURL_6, imagePUBLIC_ID_6;
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
        if (req.files[3]) {
            imageURL_4 = req.files[3].url;
            imagePUBLIC_ID_4 = req.files[3].public_id;
        } else {
            imageURL_4 = "";
            imagePUBLIC_ID_4 = "";
        }
        if (req.files[4]) {
            imageURL_5 = req.files[4].url;
            imagePUBLIC_ID_5 = req.files[4].public_id;
        } else {
            imageURL_5 = "";
            imagePUBLIC_ID_5 = "";
        }
        if (req.files[5]) {
            imageURL_6 = req.files[5].url;
            imagePUBLIC_ID_6 = req.files[5].public_id;
        } else {
            imageURL_6 = "";
            imagePUBLIC_ID_6 = "";
        }
        // const imageURL = req.file.url;
        // const imagePUBLIC_ID = req.file.public_id;

        pool.query('INSERT INTO practice_submissions (student_id,pod_uuid,image_url_1,image_url_2, image_url_3,image_url_4, image_url_5, image_url_6,tstz,comment) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,current_timestamp,$9)',[student_id, pod_uuid, imageURL_1,imageURL_2,imageURL_3,imageURL_4, imageURL_5, imageURL_6,'null'],(error, results) => {
            if (error) {
                throw error
            }
            //req.session.gradeMap.setQuizPending(pod_uuid); this line is not working
            // the functions not stored in the session object, need to think of a different way
            next();
        });
    }

};

const look_up_quiz_attempts = function(req, res, next) {
    if (req.user) {
        const pod_uuid = req.pod_uuid;
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

// draft of look up practice attempts
const look_up_practice_attempts = function(req, res, next) {
    if (req.user) {
        const pod_uuid = req.pod_uuid;
        const student_id = req.user.id;
        pool.query('SELECT comment,score,image_url_1,image_url_2,image_url_3,image_url_4,image_url_5,image_url_6,tstz FROM practice_submissions WHERE student_id = $1 AND pod_uuid = $2',[student_id, pod_uuid], (err, results) => {
            if (err) {
                throw err
            }
            req.previousPracticeAttempts = results.rows;
            if (results.rows.length > 0) {
                let lastAttempt = results.rows[results.rows.length - 1];
                if (lastAttempt.score === null) {
                    req.ungradedPractice = true;
                } else {
                    req.ungradedPractice = false;
                }
            } else {
                req.ungradedPractice = false;
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


const find_pending_quizzes = function(req, res, next) {
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

const find_pending_practice = function(req, res, next) {
    if (req.session.student) {
        const id = req.session.student.id;
        pool.query('SELECT pod_uuid FROM practice_submissions WHERE student_id = $1 AND score IS NULL', [req.session.student.id], (err, results) => {
            if (err) {
                throw  err
            }
            results.rows.forEach((result) => {
                const pod_uuid = result.pod_uuid;
                req.session.gradeMap.setPracticePending(pod_uuid);
            });
            next();
        });
    } else {
        next();
    }
};

const find_practice_comment = function(req, res, next) {
    if (req.session.student) {
        const id = req.session.student.id;
        pool.query('SELECT comment FROM practice_submissions WHERE student_id = $1 AND score < 2 AND pod_uuid = $2', [req.session.student.id, req.pod_uuid], (err, results) => {
            if (err) {
                throw err
            }
            let comments = undefined;
            if (results.rows.length === 1) {
                comments = `Comment: ${results.rows[0].comment}`;
            } else if (results.rows.length > 1) {
                let i;
                comments = 'Comments: ';
                comments = comments + results.rows[0].comment;
                for (i = 1; i < results.rows.length; i++) {
                    comments = comments + '; ' + results.rows[i].comment;
                }
            }
            req.practiceComments = comments;
            next();
        });
    } else {
        next();
    }
};

const look_up_password = (req, res, next) => {
    pool.query('SELECT passwords FROM quiz_passwords',[],(error, result) => {
        if (error) {
            throw error
        }
        req.correctPassword = result.rows[result.rows.length - 1].passwords;
        next();
    });

};


const check_quiz_password = (req, res, next) => {
    if (req.passwordAccessRequired) {
        const correctPassword = req.correctPassword;
        const enteredPassword = req.body.password;
        if (correctPassword === enteredPassword) {
            next();
        } else {
            req.flash('dangerFlash','Incorrect Password');
            res.redirect(`/quizAccess/${req.params.id}`);
        }
    } else {
        next();
    }
};

function convert_list_to_SQL(javascriptList) {
    let sql_string = '(';
    let i;
    for (i = 0; i < javascriptList.length - 1; i++) {
        sql_string = sql_string + "'"  + javascriptList[i] + "'";
        sql_string = sql_string + " , ";
    }
    sql_string = sql_string + "'"  + javascriptList[javascriptList.length - 1] + "')";
    return sql_string
}

const load_quiz_grades_on_list = (req, res, next) => {
    const pod_uuid_list = req.pod_uuid_list ? req.pod_uuid_list : [];
    if (!req.loggedIn || pod_uuid_list.length === 0) {
        next();
    } else {
        const student_id = req.user.id;
        let query_string = `SELECT pod_uuid, score FROM grades WHERE student_id = ${student_id} AND pod_uuid IN ${convert_list_to_SQL(pod_uuid_list)}`;
        pool.query(query_string, (err, results) => {
            if (err) {
                throw err
            }
            req.quizScoreList = results.rows;
            next();
        });
    }
};

const load_practice_grades_on_list = (req, res, next) => {
    const pod_uuid_list = req.pod_uuid_list ? req.pod_uuid_list : [];
    if (!req.loggedIn || pod_uuid_list.length === 0) {
        next();
    } else {
        const student_id = req.user.id;
        let query_string = `SELECT pod_uuid, score FROM practice_grades WHERE student_id = ${student_id} AND pod_uuid IN ${convert_list_to_SQL(pod_uuid_list)}`;
        pool.query(query_string, (err, results) => {
            if (err) {
                throw err
            }
            req.practiceScoreList = results.rows;
            next();
        });
    }
};

const find_pending_quizzes_list = (req, res, next) => {
    const pod_uuid_list = req.pod_uuid_list ? req.pod_uuid_list : [];
    if (!req.loggedIn || pod_uuid_list.length === 0) {
        next();
    } else {
        const student_id = req.user.id;
        let query_string = `SELECT pod_uuid FROM quiz_attempts WHERE student_id = ${student_id} AND pod_uuid IN ${convert_list_to_SQL(pod_uuid_list)} AND score IS NULL`;
        pool.query(query_string, (err, results) => {
            if (err) {
                throw err
            }
            req.pending_quiz_list = results.rows;
            next();
        });
    }
};

const find_pending_practice_list = (req, res, next) => {
    const pod_uuid_list = req.pod_uuid_list ? req.pod_uuid_list : [];
    if (!req.loggedIn || pod_uuid_list.length === 0) {
        next();
    } else {
        const student_id = req.user.id;
        let query_string = `SELECT pod_uuid FROM practice_submissions WHERE student_id = ${student_id} AND pod_uuid IN ${convert_list_to_SQL(pod_uuid_list)} AND score IS NULL`;
        pool.query(query_string, (err, results) => {
            if (err) {
                throw err
            }
            req.pending_practice_list = results.rows;
            next();
        });
    }
};


// next step => use these score lists in place of the old 'grade map'

// i need to also search for pending scores and practice !!!


// this would be much much simpler if quiz scores and practice scores were jsut on the same table!!!
// i should move in that direction !

const refineLists = (req, res, next) => {
    const quizScoreList = req.quizScoreList ? req.quizScoreList : [];
    const practiceScoreList = req.practiceScoreList ? req.practiceScoreList : [];
    const pendingQuizList = req.pending_quiz_list ? req.pending_quiz_list : [];
    const pendingPracticeList = req.pending_practice_list ? req.pending_practice_list : [];
    if (!req.loggedIn) {
        next();
    } else {
        let scoreObject = {}, quizScoreObject = {}, practiceScoreObject = {}, quizPendingList = [], practicePendingList = [];
        quizScoreList.forEach((quiz_score) => {
            quizScoreObject[quiz_score.pod_uuid.slice(0,6)] = quiz_score.score;
        });
        practiceScoreList.forEach((practiceScore) => {
            practiceScoreObject[practiceScore.pod_uuid.slice(0,6)] = practiceScore.score;
        });
        Object.keys(quizScoreObject).forEach((pod_id) => {
            scoreObject[pod_id] = {
                quizScore: quizScoreObject[pod_id],
                practiceScore: 0
            };
        });
        Object.keys(practiceScoreObject).forEach((pod_id) => {
            if (scoreObject[pod_id]) {
                scoreObject[pod_id].practiceScore = practiceScoreObject[pod_id];
            } else {
                scoreObject[pod_id] = {
                    quizScore: 0,
                    practiceScore: practiceScoreObject[pod_id]
                };
            }
        });
        pendingQuizList.forEach((pendingResult) => {
            let this_pod_id = pendingResult.pod_uuid.slice(0,6);
            if (scoreObject[this_pod_id]) {
                scoreObject[this_pod_id].quizPending = true;
            } else {
                scoreObject[this_pod_id] = {
                    quizScore: 0,
                    practiceScore: 0,
                    quizPending: true
                }
            }
        });
        pendingPracticeList.forEach((pendingResult) => {
            let this_pod_id = pendingResult.pod_uuid.slice(0,6);
            if (scoreObject[this_pod_id]) {
                scoreObject[this_pod_id].practicePending = true;
            } else {
                scoreObject[this_pod_id] = {
                    quizScore: 0,
                    practiceScore: 0,
                    practicePending: true
                }
            }
        });
        req.scoreObject = scoreObject;
        next();
    }

};

module.exports = {
    check_login,
    check_if_logged_in,
    load_grades,
    kick_out_if_not_logged_in,
    submit_quiz,
    submit_practice,
    look_up_quiz_attempts,
    look_up_quiz_attempts_2,
    count_all_attempts,
    find_pending_quizzes,
    look_up_password,
    loadPracticeGrades,
    check_quiz_password,
    find_pending_practice,
    find_practice_comment,
    load_quiz_grades_on_list,
    load_practice_grades_on_list,
    find_pending_quizzes_list,
    find_pending_practice_list,
    refineLists
};