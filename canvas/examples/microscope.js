rays = [];
objects = [];

// declare variables

const y = canvas.height / 2 - 200;

const f1 = 100;
const f2 = 150;
const x1 = -180;
const x2 = (f1 * x1) / (f1 + x1);
const x2_ = x2 - canvas.width / 3;
const x3 = (f2 * x2_) / (f2 + x2_);
const h0 = 40;
const h2 = (h0 * x2) / x1;
const h3 = (h2 * x3) / x2_;

const p1 = graphs.point(x1);

function updateValues() {}

// create components

const aop = objTypes["aop"].create(
	graphs.point(0, canvas.height / 2),
	graphs.point(1020, canvas.height / 2)
);

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

const arrow1 = objTypes["arrow"].create(
	graphs.point(canvas.width / 3 + x1, canvas.height / 2 - h0 * 1.001),
	graphs.point(canvas.width / 3 + x1, canvas.height / 2)
);
const arrow2 = objTypes["arrow"].create(
	graphs.point(canvas.width / 3 + x2, canvas.height / 2 - h2 * 1.001),
	graphs.point(canvas.width / 3 + x2, canvas.height / 2)
);
const arrow3 = objTypes["arrow"].create(
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

objects.push(aop);
objects.push(arrow1);
objects.push(arrow2);
objects.push(arrow3);
objects.push(lens1);
objects.push(lens2);

rays.push(rayObj1);
rays.push(rayObj2);
rays.push(rayObj3);
rays.push(rayObj4);
