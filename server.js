const express = require('express');
const hbs = require('express-hbs');

var app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.engine('hbs', hbs.express4({
   // extname: 'hbs',
    defaultView: 'default.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));

// ROUTES
app.get('/',(req,res) => {
    res.render('home.hbs', {
        layout:'default',
       // template:'home-template',
        title: 'Home Page'
    });
});
app.get('/about',(req,res) => {
    res.render('about.hbs', {
        layout:'default',
       // template:'about-template',
        title:'About'
    })
});
app.get('/calendars', (req, res) => {
    res.render('calendars.hbs', {
        layout:'default',
        title:'Calendars'
    })
});
app.get('/units', (req, res) => {
    res.render('units.hbs', {
        layout:'default',
        title:'Units'
    })
});
app.get('/labs', (req, res) => {
    res.render('labs.hbs', {
        layout:'default',
        title:'Labs'
    })
});
app.get('/writing', (req, res) => {
    res.render('writing.hbs', {
        layout:'default',
        title:'Writing'
    })
});
app.get('/computation', (req, res) => {
    res.render('computation.hbs', {
        layout:'default',
        title:'Computational Physics'
    })
});
app.get('/enrichment', (req, res) => {
    res.render('enrichment.hbs', {
        layout:'default',
        title:'Enrichment'
    })
});
app.get('/jokes', (req, res) => {
    res.render('jokes.hbs', {
        layout:'default',
        title:'Jokes'
    })
});





app.listen(3000);