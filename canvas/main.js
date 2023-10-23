// ------- Mouse Event Hadling -------

respondToVisibility = function (element, callback) {
	var options = {
		root: document.documentElement,
	};

	var observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			callback(entry.intersectionRatio > 0);
		});
	}, options);

	observer.observe(element);
};

respondToVisibility(canvas, (visible) => {
	if (visible) {
		canvas.height = canvas.parentElement.clientHeight;
		canvas.width = canvas.parentElement.clientWidth;
		updateSimulation();
	}
});

window.addEventListener("resize", () => {
	canvas.height = canvas.parentElement.clientHeight;
	canvas.width = canvas.parentElement.clientWidth;
	updateSimulation();
});

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

if (canvas.id == "example") {
	// const p1 = graphs.point(canvas.width / 2, canvas.height / 6);
	// const p2 = graphs.point(canvas.width / 2 + 200, (canvas.height * 5) / 6);
	// const p3 = graphs.point(canvas.width / 2 - 200, (canvas.height * 5) / 6);

	const r = 300;
	const f1 = 100;
	const f2 = 150;
	const x1 = -180;
	const x2 = (f1 * x1) / (f1 + x1);
	const x2_ = x2 - canvas.width / 3;
	const x3 = (f2 * x2_) / (f2 + x2_);
	const h0 = 40;
	const h2 = (h0 * x2) / x1;
	const h3 = (h2 * x3) / x2_;

	console.log(x2, (x2 / x1) * h0);

	const rayObj1 = objTypes["rayObject"].create(
		graphs.point(canvas.width / 3 + x1, canvas.height / 2 - h0),
		graphs.point(canvas.width / 3 + x1 / 2, canvas.height / 2 - h0)
	);
	const rayObj2 = objTypes["rayObject"].create(
		graphs.point(canvas.width / 3 + x1, canvas.height / 2 - h0),
		graphs.point(canvas.width / 3, canvas.height / 2)
	);

	const rayObj3 = objTypes["rayObject"].create(
		graphs.point(canvas.width / 3 + x2, canvas.height / 2 - h2),
		graphs.point((canvas.width * 2) / 3 + x2_ / 2, canvas.height / 2 - h2)
	);
	const rayObj4 = objTypes["rayObject"].create(
		graphs.point(canvas.width / 3 + x2, canvas.height / 2 - h2),
		graphs.point((canvas.width * 2) / 3, canvas.height / 2)
	);

	// const diopter = objTypes["planeDiopter"].create(p1, p2, 1, 1.5);

	// const diopter2 = objTypes["planeDiopter"].create(p2, p3, 1, 1.5);

	// const diopter3 = objTypes["planeDiopter"].create(p3, p1, 1, 1.5);

	const screen1 = objTypes["screen"].create(
		graphs.point(canvas.width / 3 + x1, canvas.height / 2 - h0 * 1.001),
		graphs.point(canvas.width / 3 + x1, canvas.height / 2)
	);
	const screen2 = objTypes["screen"].create(
		graphs.point(canvas.width / 3 + x2, canvas.height / 2 - h2 * 1.001),
		graphs.point(canvas.width / 3 + x2, canvas.height / 2)
	);
	const screen3 = objTypes["screen"].create(
		graphs.point((canvas.width * 2) / 3 + x3, canvas.height / 2 - h3 * 1.001),
		graphs.point((canvas.width * 2) / 3 + x3, canvas.height / 2)
	);

	const lens1 = objTypes["lens"].create(
		graphs.point(canvas.width / 3, canvas.height / 2 - 125),
		graphs.point(canvas.width / 3, canvas.height / 2 + 125),
		f1
	);
	const lens2 = objTypes["lens"].create(
		graphs.point((canvas.width * 2) / 3, canvas.height / 2 - 125),
		graphs.point((canvas.width * 2) / 3, canvas.height / 2 + 125),
		f2
	);

	// const mirror = objTypes["planeMirror"].create(
	// 	graphs.point(1020, (2 * canvas.height) / 3),
	// 	graphs.point(0, (2 * canvas.height) / 3),
	// 	10
	// );

	// const diopter3 = objTypes["planeDiopter"].create(
	// 	graphs.point(canvas.width / 2, canvas.height / 2 + 100),
	// 	graphs.point(canvas.width / 2, canvas.height / 2 - 100),
	// 	1,
	// 	1.5
	// );

	// objects.push(diopter);
	// objects.push(diopter2);
	//objects.push(diopter3);
	objects.push(screen1);
	objects.push(screen2);
	objects.push(screen3);
	objects.push(lens1);
	objects.push(lens2);
	// objects.push(mirror);
	// objects.push(diopter3);
	rays.push(rayObj1);
	rays.push(rayObj2);
	rays.push(rayObj3);
	rays.push(rayObj4);
} else {
	importContent("./canvas/examples/" + canvas.id + ".json").then((data) => {
		rays = data["rays"];
		objects = data["objects"];
		updateSimulation();
	});
}

function updateSimulation() {
	artist.clear();
	artist.draw(100);
}

// ------- /Simulation Init -------
