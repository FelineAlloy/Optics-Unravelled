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
const clickExtent_point = 10;
const clickExtent_line = 5;

const objTypes = {};
let objects = []; // objects to be drawn
let rays = []; // the light sources
