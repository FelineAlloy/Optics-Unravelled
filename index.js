// Acest cod este un cosmar. Nici eu nu mai stiu de ce functioneaza. Daca citesti acest mesaj, te implor nu folosi js pe server side decat daca sti ce faci. exista atatea alernative: python, golang pana si c++! Nu te tortura cu JavaScript!

const path = require("path");
const nunjucks = require("nunjucks");

const express = require("express");
const app = express();

const opener = require("opener");

const en = require("./static/locale/en");
const ro = require("./static/locale/ro");

app.use(express.static(path.join(__dirname, "/static"), { index: false }));
app.use("/canvas", express.static(path.join(__dirname, "/canvas"), { index: false }));

nunjucks.configure(__dirname, {
	autoescape: true,
	express: app,
});

app.get("/", (req, res) => {
	var lessons = [];
	var objKeys = Object.keys(locales["ro"]);

	objKeys.forEach((key) => {
		var elem = ro.locales["ro"][key];
		if (elem.tag == "lesson") lessons.push({ id: key, text: elem.message });
	});

	return res.render(path.join(__dirname, "/static/index.html"), { lessons: lessons });
});

app.get("/lesson", (req, res) => {
	var page = req.query.page;

	var title = page;
	try {
		title = ro.locales["ro"][page].message;
	} catch {}

	var lessons = [];
	var objKeys = Object.keys(locales["ro"]);

	objKeys.forEach((key) => {
		var elem = ro.locales["ro"][key];
		if (elem.tag == "lesson") lessons.push({ id: key, text: elem.message });
	});

	return res.render(path.join(__dirname, "/lessons/" + page + ".njk"), {
		title: title,
		id: req.query.page,
		lessons: lessons,
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log("App available on http://localhost:3000");
	opener("http://localhost:3000");
});
