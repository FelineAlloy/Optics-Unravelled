const rect = canvas.getBoundingClientRect();

let mouseX, mouseY, prevX, prevY;

let selected = null;
let isDragging = false;

const mouse_down = function (event) {
	event.preventDefault();

	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	prevX = mouseX;
	prevY = mouseY;

	for (const obj of artist.objects)
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
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	ray.p2.x = mouseX;
	ray.p2.y = mouseY;

	updateSimulation();

	if (!isDragging) {
		return;
	}

	event.preventDefault();

	let dx = mouseX - prevX;
	let dy = mouseY - prevY;

	selected.x += dx;
	selected.y += dy;

	prevX = mouseX;
	prevY = mouseY;
};

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;

const ray = graphs.ray(graphs.point(canvas.width / 2, canvas.height / 2), graphs.point(0, 0));

const diopter = new planeDiopter(graphs.point(200, canvas.height), graphs.point(200, 0), 1, 1.5);

const diopter2 = new planeDiopter(graphs.point(400, canvas.height), graphs.point(400, 0), 1.5, 1);

const screen1 = new screen(graphs.point(100, canvas.height), graphs.point(100, 0));

const lens1 = new lens(graphs.point(800, canvas.height - 100), graphs.point(800, 100), 100);

const mirror = new planeMirror(graphs.point(1000, 0), graphs.point(1000, canvas.height), 10);

const diopter3 = new sphericalDiopter(
	graphs.point(1000, canvas.height / 2),
	graphs.point(600, canvas.height / 2),
	(30 * Math.PI) / 180,
	1,
	1.5
);

artist.objects.push(diopter);
artist.objects.push(diopter2);
artist.objects.push(screen1);
artist.objects.push(lens1);
artist.objects.push(mirror);
artist.objects.push(diopter3);
artist.rays.push(ray);

function updateSimulation() {
	artist.clear();
	artist.draw(100, selected);
}

updateSimulation();
