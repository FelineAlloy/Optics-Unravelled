// ------- Dropdown Handling -------

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
	const t = c.getTransform();
	canvas.height = canvas.parentElement.clientHeight;
	canvas.width = canvas.parentElement.clientWidth;
	c.setTransform(t.a, t.b, t.c, t.d, t.e, t.f);
	updateSimulation();
});

// ------- Mouse Event Handling -------

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
	const canvasX = clientX - rect.left - c.getTransform().e;
	const canvasY = clientY - rect.top - c.getTransform().f;

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

// ------- /Mouse Event Handling -------

// ------- Simulation Init -------

if (canvas.id === "editor") {
	c.translate(canvas.width / 2 - 510, canvas.height / 2 - 200);
	updateSimulation();
} else {
	importContent("./canvas/examples/" + canvas.id + ".json").then((data) => {
		rays = data["rays"];
		objects = data["objects"];
		updateSimulation();
	});
}

function updateSimulation() {
	artist.clear();
	artist.draw(1000);
}

// ------- /Simulation Init -------
