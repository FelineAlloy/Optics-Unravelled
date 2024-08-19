function addObject() {
	const type = this.id.slice(4);
	if (type === "rayObject" || type === "beam" || type === "pointSource") {
		rays.push(objTypes[type].create());
	} else {
		objects.push(objTypes[type].create());
	}
	updateSimulation();
}

let elements = document.querySelectorAll("[id^=obj_]");
for (let elem of elements) {
	elem.addEventListener("click", addObject);
}

function loadExample() {
	const file = this.id.slice(3);
	importContent("./canvas/examples/" + file + ".json").then((data) => {
		rays = rays.concat(data["rays"]);
		objects = objects.concat(data["objects"]);
		updateSimulation();
	});
}

elements = document.querySelectorAll("[id^=ex_]");
for (let elem of elements) {
	elem.addEventListener("click", loadExample);
}

document.getElementById("fromFile").addEventListener("click", function () {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".json, .txt";
	document.body.appendChild(input);

	input.addEventListener("change", function () {
		input.files[0]
			.text()
			.then((response) => {
				return JSON.parse(response);
			})
			.then((data) => {
				rays = rays.concat(data["rays"]);
				objects = objects.concat(data["objects"]);
				updateSimulation();
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});

	input.click();
	document.body.removeChild(input);
});

document.getElementById("export").addEventListener("click", exportContent);

document.getElementById("reset").addEventListener("click", function () {
	rays = [];
	objects = [];
	artist.clear();
});
