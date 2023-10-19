objTypes["planeMirror"] = {
	create: function (point1, point2, dashLength) {
		return { type: "planeMirror", l1: graphs.line(point1, point2), dashLength: dashLength };
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
		const distance = graphs.length_segment(obj.l1);
		const numDashes = Math.floor(distance / obj.dashLength);

		const dx = obj.l1.p2.x - obj.l1.p1.x;
		const dy = obj.l1.p2.y - obj.l1.p1.y;

		const lineAngle = Math.atan2(-dy, -dx);
		const dashAngle = lineAngle + Math.PI / 4;

		const dxStep = dx / numDashes;
		const dyStep = dy / numDashes;

		const dxDash = obj.dashLength * Math.cos(dashAngle);
		const dyDash = obj.dashLength * Math.sin(dashAngle);

		c.strokeStyle = colors.objects;
		c.lineWidth = 3;

		c.beginPath();

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.stroke();
		c.lineWidth = 2;
		c.beginPath();

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);

		for (let i = 1; i <= numDashes; i++) {
			c.moveTo(obj.l1.p1.x + i * dxStep, obj.l1.p1.y + i * dyStep);
			c.lineTo(obj.l1.p1.x + i * dxStep + dxDash, obj.l1.p1.y + i * dyStep + dyDash);
		}

		c.stroke();
	},

	getCollision: function (obj, ray1) {
		const colPoint = graphs.intersection(ray1, obj.l1);
		const dist = graphs.length(ray1.p1, colPoint);
		//console.log(dist);

		if (graphs.intersection_is_on_segment(colPoint, obj.l1)) {
			if (graphs.intersection_is_on_ray(colPoint, ray1) && dist > 1) {
				return { point: colPoint, dist: dist };
			}
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	},

	getNewRay: function (obj, ray1, colPoint) {
		const normal = graphs.parallel(graphs.perpendicular_bisector(obj.l1), colPoint);

		let i = graphs.get_angle(ray1.p1, colPoint, normal.p2);
		let p3 = normal.p2;

		// console.log(i * 180 / Math.PI);

		// c.stroke();
		// c.beginPath();
		// c.moveTo(colPoint.x, colPoint.y);
		// c.lineTo(p3.x, p3.y);
		// c.stroke();
		// c.beginPath();

		if (Math.abs(i) >= Math.PI / 2) {
			return { exist: false };
		}

		p4 = graphs.rotate_point(p3, colPoint, -i);
		const newRay = graphs.ray(colPoint, p4);

		return newRay;
	},
};
