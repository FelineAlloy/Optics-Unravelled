objTypes["aop"] = {
	create: function (point1, point2) {
		return { type: "aop", l1: graphs.line(point1, point2) };
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
		c.lineWidth = 1;

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.stroke();
	},

	getCollision: function (obj, ray1) {
		return { point: { exist: false }, dist: null };
	},

	getNewRay: function (obj, ray1, colPoint) {
		return { exist: false };
	},
};
