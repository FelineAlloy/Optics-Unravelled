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

app.engine( 'html', nunjucks.render ) ;
app.set( 'view engine', 'html' ) ;

app.get('/lesson', (req, res) => {

    //sconsole.log(req);

    var page = req.query.page;

    var title = page;
    try {
        title = en.locales['en'][page].message;
    } catch {}

    return res.render('./lessons/'+page, {title: title});

});

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));