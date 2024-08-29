/* Add event listener for adding objects */
function addObject() {
	const type = this.id.slice(5);
	if (type === "rayObject" || type === "beam" || type === "pointSource") {
		rays.push(objTypes[type].create());
	} else {
		objects.push(objTypes[type].create());
	}
	updateSimulation();
}

let elements = document.querySelectorAll("[id^=_obj_]");
for (let elem of elements) {
	elem.addEventListener("click", addObject);
}

/* Add event listener for loading examples */
function loadExample() {
	const file = this.id.slice(4);
	importContent("./canvas/examples/" + file + ".json").then((data) => {
		rays = rays.concat(data["rays"]);
		objects = objects.concat(data["objects"]);
		updateSimulation();
	});
}

elements = document.querySelectorAll("[id^=_ex_]");
for (let elem of elements) {
	elem.addEventListener("click", loadExample);
}

/* Add event listener for loading from file */
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

/* Add event listener for other buttons */
document.getElementById("export").addEventListener("click", exportContent);

document.getElementById("reset").addEventListener("click", function () {
	rays = [];
	objects = [];

	document.getElementById("obj_bar").style.display = "none";
	selected.obj = null;
	selected.part = null;

	ray_alpha = 0.3;
	document.getElementById("rayAlpha").value = ray_alpha;

	const t = c.getTransform();
	c.setTransform(
		t.a,
		0,
		0,
		t.d,
		canvas.width / 2 - 483 * window.devicePixelRatio,
		canvas.height / 2 - 200 * window.devicePixelRatio
	);

	updateSimulation();
});

document.getElementById("delete").addEventListener("click", function () {
	for (let i = 0; i < objects.length; i++) {
		if (objects[i].uid == selected.obj.uid) {
			objects.splice(i, 1);
		}
	}
	for (let i = 0; i < rays.length; i++) {
		if (rays[i].uid == selected.obj.uid) {
			rays.splice(i, 1);
		}
	}

	document.getElementById("obj_bar").style.display = "none";
	selected.obj = null;
	selected.part = null;

	updateSimulation();
});

document.getElementById("unselect").addEventListener("click", function () {
	document.getElementById("obj_bar").style.display = "none";
	selected.obj = null;
	selected.part = null;

	updateSimulation();
});

/* Initialize and add event listener for ray options */
document.getElementById("rayAlpha").addEventListener("input", function (event) {
	ray_alpha = event.target.value;

	updateSimulation();
});

document.getElementById("rayAlphaPlus").addEventListener("click", function (event) {
	ray_alpha += 0.1;
	if (ray_alpha > 1) ray_alpha = 1;
	document.getElementById("rayAlpha").value = ray_alpha;

	updateSimulation();
});

document.getElementById("rayAlphaMinus").addEventListener("click", function (event) {
	ray_alpha -= 0.1;
	if (ray_alpha < 0) ray_alpha = 0;
	document.getElementById("rayAlpha").value = ray_alpha;

	updateSimulation();
});

/* Handle object bar operations */
var objBar = new ObjBar(document.getElementById("obj_bar_main"));

function load_objectBar(selected) {
	objBar.elem.innerHTML = "";

	if (selected.obj.type === "rayObject") {
		document.getElementById("obj_name").innerHTML = "Rază";

		objBar.createBoolean(
			"Calculează deflecție",
			selected.obj.track_deflection,
			function (obj, value) {
				obj.track_deflection = value;
			}
		);
		objBar.createBoolean(
			"Desenează raze virtuale",
			selected.obj.track_extended,
			function (obj, value) {
				obj.track_extended = value;
			}
		);
	}

	if (selected.obj.type === "pointSource") {
		document.getElementById("obj_name").innerHTML = "Fascicul divergent";

		objBar.createNumber(
			"Nr raze",
			2,
			10,
			1,
			selected.obj.rayNr,
			function (obj, value) {
				obj.rayNr = value;
			},
			false
		);
		objBar.createBoolean(
			"Desenează raze virtuale",
			selected.obj.track_extended,
			function (obj, value) {
				obj.track_extended = value;
			}
		);
	}

	if (selected.obj.type === "beam") {
		document.getElementById("obj_name").innerHTML = "Fascicul paralel";

		objBar.createNumber(
			"Nr raze",
			2,
			10,
			1,
			selected.obj.rayNr,
			function (obj, value) {
				obj.rayNr = value;
			},
			false
		);
		objBar.createBoolean(
			"Desenează raze virtuale",
			selected.obj.track_extended,
			function (obj, value) {
				obj.track_extended = value;
			}
		);
	}

	if (selected.obj.type === "sphericalMirror") {
		document.getElementById("obj_name").innerHTML = "Oglindă sferică";

		objBar.createBoolean("Convexă", selected.obj.convex, function (obj, value) {
			obj.convex = value;
		});
	}

	if (selected.obj.type === "sphericalDiopter_real") {
		document.getElementById("obj_name").innerHTML = "Dioptru sferic";

		objBar.createNumber(
			"n1",
			0.5,
			2.5,
			0.01,
			selected.obj.n1,
			function (obj, value) {
				obj.n1 = value;
			},
			false
		);
		objBar.createNumber(
			"n2",
			0.5,
			2.5,
			0.01,
			selected.obj.n2,
			function (obj, value) {
				obj.n2 = value;
			},
			false
		);
	}

	if (selected.obj.type === "planeDiopter") {
		document.getElementById("obj_name").innerHTML = "Dioptru plan";

		objBar.createNumber(
			"n1",
			0.5,
			2.5,
			0.01,
			selected.obj.n1,
			function (obj, value) {
				obj.n1 = value;
			},
			false
		);
		objBar.createNumber(
			"n2",
			0.5,
			2.5,
			0.01,
			selected.obj.n2,
			function (obj, value) {
				obj.n2 = value;
			},
			false
		);
	}

	if (selected.obj.type === "lens") {
		document.getElementById("obj_name").innerHTML = "Lentilă";

		objBar.createBoolean(
			"Divergentă / Convergentă",
			selected.obj.convergent,
			function (obj, value) {
				if (value) {
					obj.convergent = 1;
				} else {
					obj.convergent = -1;
				}

				obj.f = obj.convergent * Math.abs(obj.f);

				const midpoint = graphs.midpoint(obj.l1);
				const normal = graphs.perpendicular_bisector(obj.l1);

				obj.fp1 = graphs.addPointAlongSegment(midpoint, normal.p1, obj.f);
				obj.fp2 = graphs.addPointAlongSegment(midpoint, normal.p2, obj.f);
			}
		);
	}

	if (selected.obj.type === "line") {
		document.getElementById("obj_name").innerHTML = "Linie";

		objBar.createNumber(
			"Greutate",
			1,
			5,
			1,
			selected.obj.thickness,
			function (obj, value) {
				obj.thickness = value;
			},
			false
		);
	}

	if (selected.obj.type === "planeMirror") {
		document.getElementById("obj_name").innerHTML = "Oglindă plană";
	}
	if (selected.obj.type === "arrow") {
		document.getElementById("obj_name").innerHTML = "Săgeată";
	}
	if (selected.obj.type === "screen") {
		document.getElementById("obj_name").innerHTML = "Ecran";
	}

	document.getElementById("obj_bar").style.display = "block";
}
