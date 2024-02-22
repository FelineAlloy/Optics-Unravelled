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
let overlayBuffer = [] // objects which don't interact with anything and are generated each frame
                       // also used for other objects which are not drawn but need to be stored and found (ex: point objects)

function uidGen() {
    return 'uid-' + Math.random().toString(36).substring(7);  
}
