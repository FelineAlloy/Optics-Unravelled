// ------- Mouse Event Hadling -------

let rect = canvas.getBoundingClientRect();
let mouse = graphs.point(0, 0);
let mouse_prev = graphs.point(0, 0);

const selected = { obj: undefined, part: undefined };
let isDragging = false;

function mouseOnPoint(mouse, point) {
	return graphs.length_squared(mouse, point) < clickExtent_point * clickExtent_point;
}

function mouseOnSegment(mouse, segment) {
	var d_per =
		Math.pow(
			(mouse.x - segment.p1.x) * (segment.p1.y - segment.p2.y) +
				(mouse.y - segment.p1.y) * (segment.p2.x - segment.p1.x),
			2
		) /
		((segment.p1.y - segment.p2.y) * (segment.p1.y - segment.p2.y) +
			(segment.p2.x - segment.p1.x) * (segment.p2.x - segment.p1.x)); //Similar to the distance between the mouse and the line
	var d_par =
		(segment.p2.x - segment.p1.x) * (mouse.x - segment.p1.x) +
		(segment.p2.y - segment.p1.y) * (mouse.y - segment.p1.y); //Similar to the projected point of the mouse on the line
	return (
		d_per < clickExtent_line * clickExtent_line &&
		d_par >= 0 &&
		d_par <= graphs.length_segment_squared(segment)
	);
}

function getMosuePositionOnCanvas(event) {
	const clientX = event.clientX || event.touches[0].clientX;
	const clientY = event.clientY || event.touches[0].clientY;
	rect = canvas.getBoundingClientRect();
	const canvasX = clientX - rect.left;
	const canvasY = clientY - rect.top;

	return { x: canvasX, y: canvasY };
}

function getSelectedObject(mouse) {
	for (const obj of rays) {
		if (objTypes[obj.type].selected(obj, mouse, selected)) {
			return obj;
		}
	}
	for (const obj of objects) {
		if (objTypes[obj.type].selected(obj, mouse, selected)) {
			return obj;
		}
	}

	return null;
}

const mouse_down = function (event) {
	event.preventDefault();

	mouse = getMosuePositionOnCanvas(event);

	mouse_prev = graphs.point(mouse.x, mouse.y);

	selected.obj = getSelectedObject(mouse);
	if (selected.obj != null) {
		isDragging = true;
	}

	updateSimulation();
};

const mouse_up = function (event) {
	if (!isDragging) {
		return;
	}

	event.preventDefault();
	isDragging = false;
	selected.obj = null;
	updateSimulation();
};

const mouse_out = function (event) {
	if (!isDragging) {
		return;
	}

	event.preventDefault();
	isDragging = false;
	selected.obj = null;
	updateSimulation();
};

const mouse_move = function (event) {
	event.preventDefault();

	mouse = getMosuePositionOnCanvas(event);

	updateSimulation();

	if (!isDragging) {
		return;
	}

	let dx = mouse.x - mouse_prev.x;
	let dy = mouse.y - mouse_prev.y;

	objTypes[selected.obj.type].c_mousemove(selected.obj, dx, dy);

	mouse_prev = graphs.point(mouse.x, mouse.y);
};

canvas.addEventListener("mousedown", mouse_down);
canvas.addEventListener("mousemove", mouse_move);
canvas.addEventListener("mouseup", mouse_up);
canvas.addEventListener("mouseout", mouse_out);

canvas.addEventListener("touchstart", mouse_down, { passive: false });
canvas.addEventListener("touchmove", mouse_move, { passive: false });
canvas.addEventListener("touchend", mouse_up, { passive: false });
canvas.addEventListener("touchcancel", mouse_out, { passive: false });

// ------- /Mouse Event Hadling -------

// ------- Simulation Init -------

const rayObj = objTypes["rayObject"].create(
	graphs.point(canvas.width / 2, canvas.height / 2),
	graphs.point(0, 0)
);

const diopter = objTypes["planeDiopter"].create(
	graphs.point(200, canvas.height),
	graphs.point(200, 0),
	1,
	1.5
);

const diopter2 = objTypes["planeDiopter"].create(
	graphs.point(400, canvas.height),
	graphs.point(400, 0),
	1.5,
	1
);

const screen1 = objTypes["screen"].create(graphs.point(100, canvas.height), graphs.point(100, 0));

const lens1 = objTypes["lens"].create(
	graphs.point(800, canvas.height - 100),
	graphs.point(800, 100),
	100
);

const mirror = objTypes["planeMirror"].create(
	graphs.point(1000, 0),
	graphs.point(1000, canvas.height),
	10
);

const diopter3 = objTypes["sphericalDiopter"].create(
	graphs.point(1000, canvas.height / 2),
	graphs.point(600, canvas.height / 2),
	(30 * Math.PI) / 180,
	1,
	1.5
);

objects.push(diopter);
objects.push(diopter2);
objects.push(screen1);
objects.push(lens1);
objects.push(mirror);
objects.push(diopter3);
rays.push(rayObj);

// importContent("./canvas/examples/" + canvas.id + ".json").then((data) => {
// 	console.log(data);
// 	rays = data["rays"];
// 	objects = data["objects"];
// 	updateSimulation();
// });

function updateSimulation() {
	artist.clear();
	artist.draw(100);
}

// ------- /Simulation Init -------
