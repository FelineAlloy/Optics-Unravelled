const { readFile } = require('fs').promises;
const path = require('path');
const nunjucks = require('nunjucks');

const express = require('express');
const app = express();

const en = require('./static/locale/en');
const ro = require('./static/locale/ro');

app.use(express.static(__dirname + '/static'));

nunjucks.configure('.', {
    autoescape: true,
    express: app
});

app.get('/lesson', (req, res) => {

    var page = req.query.page;

    var title = page;
    try {
        title = ro.locales['ro'][page].message;
    } catch {}

    return res.render('./lessons/'+page+'.njk', {title: title});

});

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));