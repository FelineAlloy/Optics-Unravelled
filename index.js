const { readFile } = require('fs').promises;
const path = require('path');
const nunjucks = require('nunjucks');

const en = require('./static/locale/en');

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static'));

nunjucks.configure('.', {
    autoescape: true,
    express: app
});

// app.engine( 'html', nunjucks.render ) ;
// app.set( 'view engine', 'html' ) ;

app.get('/template.html', (req, res) => {

    var page = en.locales['en'][req.query.page].message;
    console.log(en.locales['en']);
    console.log(req.query.page);
    return res.render('./templates/template.html', {title: page});

});

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));