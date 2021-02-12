const express = require('express');
const hbs = require('express-hbs');
const fs = require('fs');
const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');
// const db = require('./queries.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const f = require('./flashMessages.js');
const gradeMap = require('./gradeMap.js');

const db = require('./queries.js');
const disp = require('./display.js');

const port = process.env.PORT || 3000;

const { availableContent } = require('./findAvailableContent.js');

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const redis = require("redis");
const redisStore = require('connect-redis')(session);
const redisClient =redis.createClient(process.env.REDIS_URL);
redisClient.on("error",(error) => {
    console.log(error);
});


const dueDates = require(__dirname + '/dueDates.json');

const { unitMapBy_uuid } = require(__dirname + '/unitMapBy_uuid.js');

let app = express();

let sessionStore = new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 });

const helpers = require('./helpers.js');

const maxCookieTime = 3600000; // one hour
app.use(cookieParser());
app.use(session({
    secret: "Shhhhhh!",
    //name: cookie_name,
    store: sessionStore,
    proxy: true,
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());

let notImportant = 'notImportant';


/// configuration for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png","pdf","heic"],
    transformation: [{ width: 600, height: 800, crop: "limit" }]
});
const parser = multer({ storage: storage });

function uploadFile(req, res, next) {
    const upload = parser.single('image');
    // const upload2 = parser.single('image2');
    // const upload3 = parser.single('image3');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('multerError');
        } else if (err) {
            console.log('unknown error');
            console.log(err);
        }
        next();
    });
}

function uploadFileNew(req, res, next) {
    const upload = parser.array('image',6);
    // const upload2 = parser.single('image2');
    // const upload3 = parser.single('image3');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('multerError');
        } else if (err) {
            console.log('unknown error');
            console.log(err);
        }
        next();
    });
}


function uploadFile2(req, res, next) {
    const upload2 = parser.single('image2');

    upload2(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log('multerError');
        } else if (err) {
            console.log('unknown error');
            console.log(err);
        }
        next();
    });
}



app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());



app.set('view engine', 'hbs');
app.set('views', [__dirname + '/views',__dirname + '/content']);
app.engine('hbs', hbs.express4({
   // extname: 'hbs',
    defaultView: 'default.hbs',
    partialsDir: [__dirname + '/views/partials',__dirname + '/content/information/styleGuide',__dirname + '/content/unit/energy/conceptual_conservation_of_energy/pods/energyBooks'],
    layoutsDir: __dirname + '/views/layouts'
}));
app.use(express.static(__dirname + '/public'));



// ROUTES

// shows how the 'req.flash' function works with redirect!!!
app.get('/flashTest',(req, res) => {
    req.flash('welcome_message','hello world!');
    res.redirect('/');
});

// home
app.get('/', [db.check_if_logged_in, db.load_grades, db.loadPracticeGrades, db.find_pending_quizzes, db.find_pending_practice,f.niceFlash, disp.display_home]);


// login and logout
app.get('/login', [(request, response, next) => {
    const host = request.headers.host;
    const referer = request.headers.referer;
    let path ;
    if (referer === undefined) {
        path = '/'
    } else {
        path = referer.replace(`http://${host}`,'');
        if (path === '/login') {
            path = '/';
        }
    }
    request.newPath = path;
    next();
},db.check_if_logged_in, disp.display_login_page]);
app.post('/login',[(req, res, next) => {
    req.newPath = req.query.path;
    next();
    },
    db.check_login, db.load_grades, db.loadPracticeGrades, db.find_pending_quizzes, db.find_pending_practice, (req, res) => {
    res.redirect(req.newPath); // inefficient, may result in loading grades twice
    }]);
//db.check_if_logged_in, disp.display_home
app.get('/logout',[db.check_if_logged_in, disp.display_logout_page]);
app.post('/logout',(req, res) => {
    req.session.student = undefined;
    req.session.section = undefined;
    req.session.courseLevel = undefined;
    req.session.gradeMap = undefined;
    req.session.overallLevel = undefined;
    res.redirect('/');
});

//
// app.get('/styleGuide/:styleKey', (req, res) => {
//     const filepath = __dirname + '/content/information/styleGuide/' + req.params.styleKey;
//     res.sendFile(filepath);
// });

app.get('/unitsEntryPage', [db.check_if_logged_in, disp.display_units_entry_page]);


// change these to uuid based !

// unit cluster home page
app.get('/superUnit/:uuid', [db.check_if_logged_in,(req, res, next) => {
    Object.keys(unitMap).forEach((superUnitKey) => {
        if (unitMap[superUnitKey].uuid === req.params.uuid) {
            req.superUnitKey = superUnitKey;
        }
    });
    if (req.unitKey) {
        next();
    } else {
        // flash 'topic cluster not found'
        req.redirect('/');
    }
}, disp.display_super_unit_page]);

// unit home page
app.get('/unit/:uuid', [db.check_if_logged_in,(req, res, next) => {
    Object.keys(unitMap).forEach((superUnitKey) => {
        Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
            if (unitMap[superUnitKey].units[unitKey].uuid === req.params.uuid) {
                req.unitKey = unitKey;
                req.superUnitKey = superUnitKey;
            }
        });
    });
    if (req.unitKey && req.superUnitKey) {
        next();
    } else {
        // flash 'topic not found'
        res.redirect('/');
    }
}, disp.display_unit_page]);


const gm = require('./gradeMap');
/// redundant!!! find usages




const Months_Dictionary = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
};

function displayDateFromString(dateString) {
    let dateArray = dateString.split('-');
    const month = Months_Dictionary[dateArray[0]];
    const year = dateArray[2];
    const day = dateArray[1];
    return `${month} ${day}, ${year}`;
}

const look_up_requirements = function(req, res, next) {
    if (req.courseLevel && Object.keys(dueDates).includes(req.courseLevel)) {
        let dueObject;
        Object.keys(dueDates[req.courseLevel]).forEach((date) => {
            // check here if it is overdue
            if (Object.keys(dueDates[req.courseLevel][date]).includes(req.pod_uuid)) {
                let dueObject = dueDates[req.courseLevel][date][req.pod_uuid];
                dueObject["displayDate"] = displayDateFromString(date);

                let dueDateObject = new Date(date);
                let now = new Date();
                dueObject.overdue = dueDateObject - now < 0;
                req.dueObject = dueObject;

                if (req.gradeMap) {
                    req.specificGradeMap = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey];
                }
            }
        });
        next();
    } else {

        next();
    }
};

const look_up_current_scores = function(req, res, next) {
    if (req.gradeMap) {
        req.gradeObject = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey];
        next();
    } else {
        next();
    }
};
const checkQuizAccess2 = (req, res, next) => {
    let courseLevel;
    if (req.user && req.courseLevel) {
        const uuid = req.params.pod_uuid;
        let dueDateObject = dueDates[req.courseLevel];
        let dueDateArray = Object.keys(dueDateObject);
        let i;
        req.quizRequirements = {"required": false};
        req.practiceObject = {"required": false};
        for (i = 0; i < dueDateArray.length; i++) {
            let dueDate = dueDateArray[i];
            if ((Object.keys(dueDateObject[dueDate])).includes(uuid)) {
                let thisDueDate = dueDate;
                let requirements = dueDateObject[dueDate][uuid];
                req.quizRequirements["required"] = true;
                req.quizRequirements["dueDate"] = thisDueDate;
                if (requirements.noQuiz) {
                    req.quizRequirements["required"] = false;
                }
                let now = new Date();
                let quizDueDate = new Date(thisDueDate);
                req.quizRequirements.overdue = quizDueDate - now < -86400000 - 18000000 - 18000000;
                req.quizRequirements.inClass = requirements["inClass"];
                if (req.gradeMap) {
                    req.quizRequirements["pending"] = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].pending;
                    req.quizRequirements["currentTopScore"] = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].score;
                    if (requirements.practice) {
                        req.practiceObject["required"] = true;
                        req.practiceObject["practicePending"] = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].practicePending;
                        req.practiceObject["currentTopScore"] = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].practiceScore;
                        req.practiceObject["comment"] = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].practiceComment;
                        let practiceDueDate = requirements.practiceDueDate ? requirements.practiceDueDate : thisDueDate;
                        let practiceDueDateObject = new Date(practiceDueDate);
                        req.practiceObject.overdue = practiceDueDateObject - now < -86400000 - 18000000 - 18000000;
                        req.practiceObject.dueDate = practiceDueDate;
                    }
                }
            }
        }
    }
    next();
};

// load pod page
app.get('/pod/:pod_uuid',[ (req, res, next) => {
      req.pod_uuid = req.params.pod_uuid;
      if (req.query.flashMessage) {
          req.flashMessage = req.query.flashMessage;
      }
      const selectionObject = gm.getPodKeysByUUID(req.pod_uuid);
      if (!selectionObject) {
        res.redirect('/');
      } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        next();
      }
}, db.check_if_logged_in, look_up_requirements, look_up_current_scores, db.look_up_quiz_attempts, db.find_practice_comment, checkQuizAccess2,disp.display_pod_page]);


// on the asset path, for some reason it does not work if i do not beign with a slash

/// accessing pod assets
app.get('/podAssets/:unitClusterKey/:unitKey/:assetName', (req, res) => {
    let filepath = __dirname + '/content/unit/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/pods/assets/' + req.params.assetName;
    res.sendFile(filepath);
});


app.get('/practiceSubmission/:pod_uuid', [db.check_if_logged_in, (req, res, next) => {
    req.pod_uuid = req.params.pod_uuid;
    const selectionObject = gm.getPodKeysByUUID(req.pod_uuid);
    if (!selectionObject) {
        res.redirect('/');
    } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        next();
    }
}, (req, res, next) => {

    // space to check if this is the correct practice to be submitted
    next()
}, disp.display_practice_submission_page]);




app.get('/quizAssets/:unitClusterKey/:unitKey/:assetName', (req, res) => {
    let filepath = __dirname + '/content/quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/assets/' + req.params.assetName;
    res.sendFile(filepath);
});

app.get('/labs', [db.check_if_logged_in, disp.display_lab_list_page]);

app.get('/labs/:labKey', [db.check_if_logged_in, disp.display_lab_page]);
app.get('/info/:infoKey', [db.check_if_logged_in, disp.display_info_page]);
app.get('/gradeScale', [db.check_if_logged_in, disp.display_scale_page]);


app.get('/joke/:jokeName', (req, res) => {
    let filePath = __dirname + '/content/jokes/memedPictures/' + req.params.jokeName + '.jpg';
    res.sendFile(filePath);
});


app.get('/problemSets', [db.check_if_logged_in, disp.display_problemSet_list_page]);

app.get('/problemSets/:problemSetKey', [db.check_if_logged_in, disp.display_problemSet_page]);

app.get('/playground',(request, response) => {
    response.render('playgroundPage.hbs', {
        layout: 'default'
    });
});

// quiz entry page
//app.get('/quizzes', [db.check_if_logged_in, disp.display_quiz_entry_page]);



// quiz page for unit
// app.get('/quizzes/:unitClusterKey/:unitKey', [db.check_if_logged_in, disp.display_quiz_unit_page]);

//
// check_quiz_password = function(req, res, next) {
//     req.quiz_password = req.body.password;
//     next();
// };


const quizLock = false;



const checkQuizAccess = (req, res, next) => {
    req.keys = gradeMap.getPodKeysByUUID(req.params.uuid);
    const podObject = unitMap[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey];
    req.memorizationQuiz = podObject["memorization"];
    req.ApInClass = req.session.courseLevel === 'AP' && podObject["inClass_AP"];
    req.HonorsInClass = req.session.courseLevel === 'Honors' && podObject["inClass_honors"];
    req.A_level_InClass = req.session.courseLevel === 'A_level' && podObject["inClass_Alevel"];
    req.quizLock = quizLock;
    req.passwordAccessRequired = req.memorizationQuiz || req.ApInClass || req.HonorsInClass || req.A_level_InClass || req.quizLock;
    next();
};

const lateCode = 'hdu7g2d';

/// THIS NEEDS TO BE EDITTED TO a) get info from the due dates page, not the unit map, and b) check if it is overdue
// fortunately, the function for that already exists, it shouldn't be a big change
app.get('/quizAccess/:uuid', [db.check_if_logged_in, (req, res, next) => {
    if (!req.loggedIn) {
        // flash => you must be logged in to take a quiz
        res.redirect(`/pod/${req.params.uuid}`);
    } else {
        next();
    }
}, checkQuizAccess, disp.display_quiz_entry_page]);

app.post('/quiz/:uuid',[db.check_if_logged_in, (req, res, next) => {
    if (!req.loggedIn) {
        // flash => you must be logged in to take a quiz
        res.redirect(`/pod/${req.params.uuid}`);
    } else {
        next();
    }
},checkQuizAccess, db.look_up_password, db.check_quiz_password, disp.display_quiz]);

app.get('/quiz/:uuid',(req,res) => {
    const uuid = req.params.uuid;
    res.redirect(`/pod/${uuid}`);
});

// individual quiz page
app.get('/miniquiz/:unitClusterKey/:unitKey/:podKey', [db.check_if_logged_in, disp.display_quiz]);
//app.post('/quizzes/:unitClusterKey/:unitKey/:podKey', [db.check_if_logged_in, check_quiz_password, disp.display_quiz]);


// make these a single function??????
// function look_up_quiz_version(req, res, next) {
//     const keys = gradeMap.getPodKeysByUUID(req.query.uuid);
//     req.version = availableContent[keys.superUnitKey].units[keys.unitKey].pods[keys.podKey].numberOfVersions;
//     req.keys = keys;
//     next();
// }

function look_up_quiz_answers(req, res, next) {
    const keys = gradeMap.getPodKeysByUUID(req.query.uuid);
    req.version = availableContent[keys.superUnitKey].units[keys.unitKey].pods[keys.podKey].numberOfVersions;

    // draft, see if this works later
    const answersAvailable = availableContent[keys.superUnitKey].units[keys.unitKey].pods[keys.podKey].answersAvailable;
    if (answersAvailable) {
        const answerFile = require(__dirname + `/content/quizzes/${keys.superUnitKey}/${keys.unitKey}/${keys.podKey}/answers.json`);
        req.answerText = JSON.stringify(answerFile[`v${req.version}`]);
        next();
    } else {
        next();
    }
}


// app.post('/submitMiniquiz', parser.single("image"),[db.check_if_logged_in,db.kick_out_if_not_logged_in,db.submit_quiz,(req, res) => {res.redirect('/');}]);
app.post('/submitMiniquiz', [uploadFileNew, db.check_if_logged_in,db.kick_out_if_not_logged_in,
    (req, res, next) => {
    const selectionObject = gm.getPodKeysByUUID(req.query.uuid);
    if (!selectionObject) {
        res.redirect('/');
    } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        next();
    }
    }, look_up_quiz_answers,db.submit_quiz,(req, res) => {res.redirect('/');}]);

app.post('/submitPractice/:pod_uuid', [(req, res, next) => {
    req.pod_uuid = req.params.pod_uuid;
    const selectionObject = gm.getPodKeysByUUID(req.pod_uuid);
    if (!selectionObject) {
        res.redirect('/');
    } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        next();
    }
    },uploadFileNew, db.check_if_logged_in,db.kick_out_if_not_logged_in, db.submit_practice, (req, res, next) => {
    req.pod_uuid = req.params.pod_uuid;
    // space for more
    next()
}, (req, res) => {
    res.redirect(`/pod/${req.pod_uuid}`)}
]);



app.listen(port, () => console.log(`app running on port ${port}`));
