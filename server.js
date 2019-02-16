const express = require('express');
const hbs = require('express-hbs');

var app = express();

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


// ROUTES
app.get('/',(req,res) => {
    res.render('home.hbs');
});



app.listen(3000);