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
		canvas_resize();
		updateSimulation();
	}
});

window.addEventListener("resize", () => {
	dispalyWidth = canvas.parentElement.clientWidth;
	displayHeight = canvas.parentElement.clientHeight;
	canvas_resize();
	if (canvas.id === "editor") {
		const t = c.getTransform();
		c.setTransform(
			t.a,
			t.b,
			t.c,
			t.d,
			canvas.width / 2 - 483 * window.devicePixelRatio,
			canvas.height / 2 - 200 * window.devicePixelRatio
		);
	}
	updateSimulation();
});

// ------- Mouse Event Handling -------

let rect = canvas.getBoundingClientRect();
let mouse = graphs.point(0, 0); // these coordinates are in screen space (without cavas transforms applied)
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

// return mouse position relative to canvas without taking into account transforms (this is needed for move tool)
function getMousePositionOnCanvas(event) {
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

	mouse = getMousePositionOnCanvas(event);

	mouse_prev = graphs.point(mouse.x, mouse.y);

	const obj_prev = selected.obj;

	selected.obj = getSelectedObject(
		graphs.point(...reverseTransform(mouse.x, mouse.y)) // get the coresponding position inside canvas space
	);

	if (selected.obj != null) {
		isDragging = true;
	} else if (
		canvas.id === "editor" &&
		document.getElementById("move").getAttribute("aria-pressed") == "true"
	) {
		isDragging = true;
	}

	if (canvas.id === "editor") {
		if (selected.obj == null) {
			document.getElementById("obj_bar").style.display = "none";
		} else if (obj_prev == null) {
			load_objectBar(selected);
		} else {
			if (obj_prev.uid == null) obj_prev.uid = uidGen();
			if (selected.obj.uid == null) selected.obj.uid = uidGen();

			if (obj_prev.uid != selected.obj.uid) load_objectBar(selected);
		}
	}

	updateSimulation();
};

const mouse_up = function (event) {
	if (!isDragging) {
		return;
	}

	event.preventDefault();
	isDragging = false;
	updateSimulation();
};

const mouse_out = function (event) {
	if (!isDragging) {
		return;
	}

	event.preventDefault();
	isDragging = false;
	updateSimulation();
};

const mouse_move = function (event) {
	event.preventDefault();

	mouse = getMousePositionOnCanvas(event);

	updateSimulation();

	if (!isDragging) {
		return;
	}

	let dx = mouse.x - mouse_prev.x;
	let dy = mouse.y - mouse_prev.y;

	if (selected.obj != null) {
		objTypes[selected.obj.type].c_mousemove(selected.obj, dx, dy);
	} else if (
		canvas.id === "editor" &&
		document.getElementById("move").getAttribute("aria-pressed") == "true"
	) {
		c.translate(dx, dy);
	}

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
	const t = c.getTransform();
	c.setTransform(
		t.a,
		t.b,
		t.c,
		t.d,
		canvas.width / 2 - 483 * window.devicePixelRatio,
		canvas.height / 2 - 200 * window.devicePixelRatio
	);
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
