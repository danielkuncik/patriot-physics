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

const { idLibrary } = require(__dirname + '/idLibrary.js');

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
app.get('/', [db.check_if_logged_in, (req, res, next) => {
    if (req.courseLevel) {
        const dueDateObject = dueDates[req.courseLevel];
        let podIds = [];
        Object.keys(dueDateObject).forEach((dueDate) => {
            let thisSelection = dueDateObject[dueDate];
            Object.keys(thisSelection).forEach((podId) => {
                podIds.push(podId);
            });
        });
        let pod_uuid_list = [];
        podIds.forEach((id) => {
            pod_uuid_list.push(getPodUUID(id));
        });
        req.pod_uuid_list = pod_uuid_list;
        next();
    } else {
        next();
    }
}, db.load_relevant_grades, db.load_grades, db.loadPracticeGrades, db.find_pending_quizzes, db.find_pending_practice,f.niceFlash, disp.display_home]);


// login and logout
app.get('/login', [(request, response, next) => {
    let path;
    if (request.query.newPath) {
        path = request.query.newPath;
    } else {
        const host = request.headers.host;
        const referer = request.headers.referer;
        if (referer === undefined) {
            path = '/'
        } else {
            path = referer.replace(`http://${host}`,'');
            if (path === '/login') {
                path = '/';
            }
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
app.get('/superUnit/:id', [db.check_if_logged_in,(req, res, next) => {
    const idLibraryObject = idLibrary[req.params.id];
    if (!idLibraryObject || idLibraryObject.type !== 'superUnit') {
      req.flash('dangerFlash','ERROR: Topic Not Found');
      res.redirect('/');
    } else {
      req.superUnitKey = idLibraryObject.superUnitKey;
      next();
    }
}, disp.display_super_unit_page]);

// unit home page
app.get('/unit/:id', [db.check_if_logged_in,(req, res, next) => {

  const idLibraryObject = idLibrary[req.params.id];
  if (!idLibraryObject || idLibraryObject.type !== 'unit') {
    req.flash('dangerFlash','ERROR: Ladder Not Found');
    res.redirect('/');
  } else {
    req.superUnitKey = idLibraryObject.superUnitKey;
    req.unitKey = idLibraryObject.unitKey;
    next();
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

function getPodUUID(podId) {
    const podKeys = idLibrary[podId];
    const podObject = unitMap[podKeys.superUnitKey].units[podKeys.unitKey].pods[podKeys.podKey];
    return podObject.uuid
}

const checkQuizAccess = (req, res, next) => {
    const keys = idLibrary[req.params.id];
    req.superUnitKey = keys.superUnitKey;
    req.unitKey = keys.unitKey;
    req.podKey = keys.podKey;
    if (req.user && req.courseLevel) {
        const id = req.params.id;
        let dueDateObject = dueDates[req.courseLevel];
        let dueDateArray = Object.keys(dueDateObject);
        let i;
        req.quizRequirements = {"required": false};
        req.practiceObject = {"required": false};
        for (i = 0; i < dueDateArray.length; i++) {
            let dueDate = dueDateArray[i];
            if ((Object.keys(dueDateObject[dueDate])).includes(id)) {
                let thisDueDate = dueDate;
                let requirements = dueDateObject[dueDate][id];
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
app.get('/pod/:id',[ (req, res, next) => {
  const idLibraryObject = idLibrary[req.params.id];
  if (!idLibraryObject || idLibraryObject.type !== 'pod') {
    req.flash('dangerFlash','ERROR: Pod Not Found');
    res.redirect('/');
  } else {
    req.superUnitKey = idLibraryObject.superUnitKey;
    req.unitKey = idLibraryObject.unitKey;
    req.podKey = idLibraryObject.podKey;
    req.pod_uuid = getPodUUID(req.params.id);
    req.pod_uuid_list = [req.pod_uuid];
    next();
  }
}, db.check_if_logged_in, db.load_relevant_grades, look_up_requirements, look_up_current_scores, db.look_up_quiz_attempts, db.look_up_practice_attempts, db.find_practice_comment, checkQuizAccess,disp.display_pod_page]);


// on the asset path, for some reason it does not work if i do not beign with a slash

/// accessing pod assets
app.get('/podAssets/:unitClusterKey/:unitKey/:assetName', (req, res) => {
    let filepath = __dirname + '/content/unit/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/pods/assets/' + req.params.assetName;
    res.sendFile(filepath);
});






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

app.get('/sandbox',(request, response) => {
    response.render('sandbox.hbs', {
        layout: 'default'
    });
});

app.get('/sandbox2',(request, response) => {
    response.render('sandbox2.hbs', {
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

const lateCode = 'hdu7g2d';

app.get('/takeQuiz', [db.check_if_logged_in, db.load_quiz_in_progress, (req, res, next) => {
    // in this step, i need to check quiz access???
    // add later
    next();
}, (req, res,next) => {
    // next step is to display the quiz
    req.flash('successFlash','testComplete');
    next()
}, disp.display_quiz_new]);

/// THIS NEEDS TO BE EDITTED TO a) get info from the due dates page, not the unit map, and b) check if it is overdue
// fortunately, the function for that already exists, it shouldn't be a big change
app.get('/quizAccess/:id', [db.check_if_logged_in, (req, res, next) => {
    if (!req.loggedIn) {
        req.flash('warningFlash','You must be logged in to take the quiz');
        res.redirect(`/pod/${req.params.id}`);
    } else {
        next();
    }
}, checkQuizAccess, (req, res, next) => {
    if (!req.quizRequirements.required) {
        req.flash('warningFlash','Quiz not currently required for your class.');
        res.redirect(`/pod/${req.params.id}`)
    }
    if (req.quizRequirements.inClass || req.quizRequirements.overdue) {
        req.passwordAccessRequired = true;
    }
    // consider more options...such as overdue etc.
    next();
}, disp.display_quiz_entry_page]);

// rework this
app.post('/quizAccess/:id',[db.check_if_logged_in, (req, res, next) => {
    if (!req.loggedIn) {
        req.flash('warningFlash','You must be logged in to take the quiz');
        res.redirect(`/pod/${req.params.id}`);
    } else {
        next();
    }
},checkQuizAccess, (req, res, next) => {
    // here, check quiz access!
    // redirect if necessary
    if (req.quizRequirements.inClass || req.quizRequirements.overdue) {
        req.passwordAccessRequired = true;
    }

    next();
},db.look_up_password, db.check_quiz_password, disp.display_quiz]);


// ami even using this??? should i delete this
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
    req.version = availableContent[req.superUnitKey].units[req.unitKey].pods[req.podKey].numberOfVersions;

    // draft, see if this works later
    const answersAvailable = availableContent[req.superUnitKey].units[req.unitKey].pods[req.podKey].answersAvailable;
    if (answersAvailable) {
        const answerFile = require(__dirname + `/content/quizzes/${req.superUnitKey}/${req.unitKey}/${req.podKey}/answers.json`);
        req.answerText = JSON.stringify(answerFile[`v${req.version}`]);
        next();
    } else {
        next();
    }
}


// app.post('/submitMiniquiz', parser.single("image"),[db.check_if_logged_in,db.kick_out_if_not_logged_in,db.submit_quiz,(req, res) => {res.redirect('/');}]);
app.post('/quiz/:id', [uploadFileNew, db.check_if_logged_in,db.kick_out_if_not_logged_in,
    (req, res, next) => {
    const selectionObject = idLibrary[req.params.id];
    if (!selectionObject) {
        req.flash('dangerFlash','Error');
        res.redirect('/');
    } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        req.uuid = getPodUUID(req.params.id);
        next();
    }
    }, look_up_quiz_answers,db.submit_quiz,(req, res) => {
    req.flash('successFlash','Quiz Submitted Successfully');
    res.redirect('/');}]);


app.get('/submitPractice/:id', [db.check_if_logged_in, (req, res, next) => {
    const idLibraryObject = idLibrary[req.params.id];
    if (!idLibraryObject || idLibraryObject.type !== 'pod') {
        console.log('here');
        req.flash('dangerFlash','ERROR: Pod Not Found');
        res.redirect('/');
    } else {
        req.superUnitKey = idLibraryObject.superUnitKey;
        req.unitKey = idLibraryObject.unitKey;
        req.podKey = idLibraryObject.podKey;
        next();
    }
}, (req, res, next) => {

    // space to check if this is the correct practice to be submitted
    next()
}, disp.display_practice_submission_page]);


app.post('/submitPractice/:id', [(req, res, next) => {
    const selectionObject = idLibrary[req.params.id];
    if (!selectionObject) {
        req.flash('dangerFlash','Error: Pod not found');
        res.redirect('/');
    } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        req.pod_uuid = getPodUUID(req.params.id);
        next();
    }
    },uploadFileNew, db.check_if_logged_in,db.kick_out_if_not_logged_in, db.submit_practice, (req, res, next) => {
    // space for more
    next();
}, (req, res) => {
    req.flash('successFlash','Practice Page successfully submitted');
    res.redirect(`/pod/${req.params.id}`)}
]);



app.listen(port, () => console.log(`app running on port ${port}`));
