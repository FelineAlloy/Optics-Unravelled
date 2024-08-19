objTypes["screen"] = {
	create: function (
		point1 = graphs.point(
			canvas.width / 2 - c.getTransform().e,
			canvas.height / 3 - c.getTransform().f
		),
		point2 = graphs.point(
			canvas.width / 2 - c.getTransform().e,
			(canvas.height * 2) / 3 - c.getTransform().f
		),
		uid = uidGen()
	) {
		return { type: "screen", l1: graphs.line(point1, point2), uid: uid };
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.l1.p1) &&
			graphs.length_squared(obj.l1.p1, mouse) <= graphs.length_squared(obj.l1.p2, mouse)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.l1.p2)) {
			selected.part = 2;
			return true;
		}
		if (mouseOnSegment(mouse, obj.l1)) {
			selected.part = 0;
			return true;
		}
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 0) {
			obj.l1.p1.x += dx;
			obj.l1.p1.y += dy;

			obj.l1.p2.x += dx;
			obj.l1.p2.y += dy;
		} else if (selected.part == 1) {
			obj.l1.p1.x += dx;
			obj.l1.p1.y += dy;
		} else if (selected.part == 2) {
			obj.l1.p2.x += dx;
			obj.l1.p2.y += dy;
		}
	},

	draw: function (obj) {
		c.beginPath();

		c.strokeStyle = colors.objects;
		c.lineWidth = 4;

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.stroke();
	},

	getCollision: function (obj, ray1) {
		const colPoint = graphs.intersection(ray1, obj.l1);
		const dist = graphs.length(ray1.p1, colPoint);
		//console.log(dist);

		if (
			graphs.intersection_is_on_ray(colPoint, ray1) &&
			graphs.intersection_is_on_segment(colPoint, obj.l1) &&
			dist > 1
		) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	},

	getNewRay: function (obj, ray1, colPoint) {
		const newRay = graphs.ray(colPoint, colPoint);
		newRay.exist = false;
		return newRay;
	},
};
