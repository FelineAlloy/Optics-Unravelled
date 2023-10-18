// ------- Mouse Event Hadling -------

let rect = canvas.getBoundingClientRect();
let mouseX, mouseY, prevX, prevY;

let selected = null;
let isDragging = false;

function getMosuePositionOnCanvas(event) {
	const clientX = event.clientX || event.touches[0].clientX;
	const clientY = event.clientY || event.touches[0].clientY;
	rect = canvas.getBoundingClientRect();
	const canvasX = clientX - rect.left;
	const canvasY = clientY - rect.top;

	return { x: canvasX, y: canvasY };
}

const mouse_down = function (event) {
	event.preventDefault();

	const mouse = getMosuePositionOnCanvas(event);
	mouseX = mouse.x;
	mouseY = mouse.y;

	prevX = mouseX;
	prevY = mouseY;

	for (const obj of rays)
		for (const selectable of obj.selectables)
			if (graphs.length(graphs.point(mouseX, mouseY), selectable) < selectableRadius * 2) {
				selected = selectable;
				isDragging = true;
				return;
			}

	for (const obj of objects)
		for (const selectable of obj.selectables)
			if (graphs.length(graphs.point(mouseX, mouseY), selectable) < selectableRadius * 2) {
				selected = selectable;
				isDragging = true;
				return;
			}

	updateSimulation();
};

const mouse_up = function (event) {
	if (!isDragging) {
		return;
	}

	event.preventDefault();
	isDragging = false;
	selected = null;
	updateSimulation();
};

const mouse_out = function (event) {
	if (!isDragging) {
		return;
	}

	event.preventDefault();
	isDragging = false;
	selected = null;
	updateSimulation();
};

const mouse_move = function (event) {
	event.preventDefault();

	const mouse = getMosuePositionOnCanvas(event);
	mouseX = mouse.x;
	mouseY = mouse.y;

	updateSimulation();

	if (!isDragging) {
		return;
	}

	let dx = mouseX - prevX;
	let dy = mouseY - prevY;

	selected.x += dx;
	selected.y += dy;

	prevX = mouseX;
	prevY = mouseY;
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

// objects.push(diopter);
// objects.push(diopter2);
// objects.push(screen1);
// objects.push(lens1);
// objects.push(mirror);
// objects.push(diopter3);
// rays.push(rayObj);

importContent("./canvas/examples/" + canvas.id + ".json").then((data) => {
	console.log(data);
	rays = data["rays"];
	objects = data["objects"];
	updateSimulation();
});

function updateSimulation() {
	artist.clear();
	artist.draw(100, selected);
}

// ------- /Simulation Init -------
