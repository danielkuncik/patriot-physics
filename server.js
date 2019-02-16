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
        template:'home-template',
        title: 'Home Page'
    });
});



app.listen(3000);