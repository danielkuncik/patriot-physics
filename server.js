const express = require('express');
const hbs = require('express-hbs');
const fs = require('fs');
const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');
// const db = require('./queries.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const db = require('./queries.js');
const disp = require('./display.js');

const port = process.env.PORT || 3000;

var app = express();

const maxCookieTime = 3600000; // one hour
app.use(cookieParser());
app.use(session({
    secret: "Shhhhhh!",
    //   name: cookie_name,
//    store: sessionStore,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

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
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.use(express.static(__dirname + '/public'));




var unitCluster, unit, pod;
// ROUTES
app.get('/', [db.check_if_logged_in, disp.display_home]);

app.get('/login', [db.check_if_logged_in, disp.display_login_page]);

app.post('/login',[db.check_login, db.check_if_logged_in, disp.display_home]);

app.get('/logout',[db.check_if_logged_in, disp.display_logout_page]);

app.post('/logout',(req, res) => {
    req.session.student = undefined;
    res.redirect('/');
});

// app.post('/login',[check_login_info, (req,res) => {
//     res.render('home.hbs', {
//         layout:'default',
//         // template:'home-template',
//         title: 'Home Page'
//     });
//     ]
// )

// app.get('/info',(req,res) => {
//     res.render('infoEntryPage.hbs', {
//         layout:'default',
//        // template:'about-template',
//         title:'Information'
//     });
// });
// app.get('/calendars', (req, res) => {
//     res.render('calendarsEntryPage.hbs', {
//         layout:'default',
//         title:'Calendars'
//     });
// });
app.get('/unitsEntryPage', [db.check_if_logged_in, disp.display_units_entry_page]);

// unit cluster home page
app.get('/unitcluster/:unitClusterKey', [db.check_if_logged_in, disp.display_unit_cluster_page]);

// unit home page
app.get('/unit/:unitClusterKey/:unitKey', [db.check_if_logged_in, disp.display_unit_page]);

// pod home page
app.get('/pod/:unitClusterKey/:unitKey/:podKey', [db.check_if_logged_in, disp.display_pod_page]);


// on the asset path, for some reason it does not work if i do not beign with a slash

/// accessing pod assets
app.get('/podAssets/:unitClusterKey/:unitKey/:assetName', (req, res) => {
    var filepath = __dirname + '/content/units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/pods/assets/' + req.params.assetName;
    res.sendFile(filepath);
});

app.get('/labs', [db.check_if_logged_in, disp.display_lab_list_page]);

app.get('/labs/:labKey', [db.check_if_logged_in, disp.display_lab_page]);

// app.get('/writing', (req, res) => {
//     res.render('writingEntryPage.hbs', {
//         layout:'default',
//         title:'Writing'
//     });
// });
// app.get('/computationEntry', (req, res) => {
//     res.render('computationEntryPage.hbs', {
//         layout:'default',
//         title:'Computational Physics'
//     });
// });
// app.get('/computation/:type/:name', (req, res) => {
//     if (req.params.type === 'entry') {
//         res.render('computationEntryPage.hbs', {
//             layout:'default',
//             title:'Computational Physics'
//         });
//     } else {
//         res.render(`computation/${req.params.type}/${req.params.name}.hbs`, {
//             layout:'computationLayout.hbs',
//             id: req.params.uid
//         });
//     }
// });
// app.get('/enrichment', (req, res) => {
//     res.render('enrichmentEntryPage.hbs', {
//         layout:'default',
//         title:'Enrichment'
//     });
// });
// app.get('/jokes', (req, res) => {
//     res.render('jokesEntryPage.hbs', {
//         layout:'default',
//         title:'Jokes'
//     });
// });
// // sending a joke image image
// app.get('/getJoke/:imageName', (req,res)=>{
//     res.sendFile(__dirname + '/content/jokes/memedPictures/' + req.params.imageName);
// });

// quiz entry page
app.get('/quizzes', [db.check_if_logged_in, disp.display_quiz_entry_page]);



// quiz page for unit
app.get('/quizzes/:unitClusterKey/:unitKey', [db.check_if_logged_in, disp.display_quiz_unit_page]);


check_quiz_password = function(req, res, next) {
    req.quiz_password = req.body.password;
    next();
};

// individual quiz page
app.get('/quizzes/:unitClusterKey/:unitKey/:podKey', [db.check_if_logged_in, check_quiz_password, disp.display_quiz]);
app.post('/quizzes/:unitClusterKey/:unitKey/:podKey', [db.check_if_logged_in, check_quiz_password, disp.display_quiz]);





app.listen(port, () => console.log(`app running on port ${port}`));
