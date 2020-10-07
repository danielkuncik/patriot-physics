const express = require('express');
const hbs = require('express-hbs');
const fs = require('fs');
const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');
// const db = require('./queries.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const f = require('./flashMessages.js');
const gradeMap = require('./gradeMap.js');

const db = require('./queries.js');
const disp = require('./display.js');

const port = process.env.PORT || 3000;

const { availableContent } = require('./findAvailableContent.js');

const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");


let app = express();

let sessionStore = new session.MemoryStore();

const helpers = require('./helpers.js');

const maxCookieTime = 3600000; // one hour
app.use(cookieParser());
app.use(session({
    secret: "Shhhhhh!",
    //name: cookie_name,
    store: sessionStore,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


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
    const upload = parser.array('image',3);
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

// home
app.get('/', [db.check_if_logged_in, f.niceFlash, disp.display_home]);


// login and logout
app.get('/login', [(request, response, next) => {
    const host = request.headers.host;
    const referer = request.headers.referer;
    let path = referer.replace(`http://${host}`,'');
    if (path === '/login') {
        path = '/';
    }
    request.newPath = path;
    next();
},db.check_if_logged_in, disp.display_login_page]);
app.post('/login',[db.check_login, db.load_grades, db.find_pending_quizzes, db.count_all_attempts, db.check_if_logged_in, disp.display_home]);
// when I'm ready, add this!
//     (req,res) => {
//     const path = req.query.path;
//     res.redirect(path);
// }]);
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

// unit cluster home page
app.get('/superUnit/:superUnitKey', [db.check_if_logged_in, disp.display_super_unit_page]);

// unit home page
app.get('/unit/:unitClusterKey/:unitKey', [db.check_if_logged_in, disp.display_unit_page]);


const gm = require('./gradeMap');


// load pod page
app.get('/pod/:pod_uuid',[ (req, res, next) => {
      const selectionObject = gm.getPodKeysByUUID(req.params.pod_uuid);
      if (!selectionObject) {
        res.redirect('/');
      } else {
        req.superUnitKey = selectionObject.superUnitKey;
        req.unitKey = selectionObject.unitKey;
        req.podKey = selectionObject.podKey;
        next();
      }
  }, db.check_if_logged_in, db.look_up_quiz_attempts, disp.display_pod_page]);

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

app.get('/joke/:jokeName', (req, res) => {
    let filePath = __dirname + '/content/jokes/memedPictures/' + req.params.jokeName + '.jpg';
    res.sendFile(filePath);
});


app.get('/problemSets', [db.check_if_logged_in, disp.display_problemSet_list_page]);

app.get('/problemSets/:problemSetKey', [db.check_if_logged_in, disp.display_problemSet_page]);

// quiz entry page
//app.get('/quizzes', [db.check_if_logged_in, disp.display_quiz_entry_page]);



// quiz page for unit
// app.get('/quizzes/:unitClusterKey/:unitKey', [db.check_if_logged_in, disp.display_quiz_unit_page]);

//
// check_quiz_password = function(req, res, next) {
//     req.quiz_password = req.body.password;
//     next();
// };

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
app.post('/submitMiniquiz', [uploadFileNew, db.check_if_logged_in,db.kick_out_if_not_logged_in, look_up_quiz_answers,db.submit_quiz,(req, res) => {res.redirect('/');}]);



app.listen(port, () => console.log(`app running on port ${port}`));
