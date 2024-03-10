const canvas = document.getElementsByTagName("canvas")[0]; // due to how other parts are imlemented we only suport one canmvas per page
const c = canvas.getContext("2d");

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

const colors = {
	rays: "red",
	objects: "black",
	text: "black",
	selectables: "black",
	background: "white",
};
const clickExtent_point = 15;
const clickExtent_line = 5;

const objTypes = {};
let objects = []; // objects to be drawn
let rays = []; // the light sources
let overlayBuffer = []; // objects which don't interact with anything and are generated each frame
// also used for other objects which are not drawn but need to be stored and found (ex: point objects)

const handCursor_svg =
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V336c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V32z"/></svg>';
const handImg = new Image();
handImg.src = "data:image/svg+xml," + encodeURIComponent(handCursor_svg);

function uidGen() {
	return "uid-" + Math.random().toString(36).substring(7);
}
