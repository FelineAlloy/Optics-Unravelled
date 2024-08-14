objTypes["arrow"] = {
	create: function (point1, point2, thickness = 3, color = colors.objects, uid = uidGen()) {
		return {
			type: "arrow",
			l1: graphs.line(point1, point2),
			thickness: thickness,
			color: color,
			uid: uid,
		};
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
		c.strokeStyle = obj.color;
		c.lineWidth = obj.thickness;

		c.beginPath();

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		const angle = Math.atan2(obj.l1.p1.y - obj.l1.p2.y, obj.l1.p1.x - obj.l1.p2.x);

		c.moveTo(
			obj.l1.p1.x - 15 * Math.cos(angle - Math.PI / 6),
			obj.l1.p1.y - 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(obj.l1.p1.x, obj.l1.p1.y);

		c.lineTo(
			obj.l1.p1.x - 15 * Math.cos(angle + Math.PI / 6),
			obj.l1.p1.y - 15 * Math.sin(angle + Math.PI / 6)
		);

		c.stroke();
	},

	getCollision: function (obj, ray1) {
		const colPoint = graphs.intersection(ray1, obj.l1);
		const dist = graphs.length(ray1.p1, colPoint);

		if (
			graphs.intersection_is_on_ray(colPoint, ray1) &&
			graphs.intersection_is_on_segment(colPoint, obj.l1) &&
			graphs.length_squared(colPoint, obj.l1.p1) < 25 &&
			dist > 1
		) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	},

	getNewRay: function (obj, ray1, colPoint) {
		return { exist: false };
	},
};
