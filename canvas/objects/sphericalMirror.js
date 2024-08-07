objTypes["sphericalMirror"] = {
	create: function (point1, point2, angle, convex, dashLength = 10, uid) {
		return {
			type: "sphericalMirror",
			c1: graphs.circle(point1, point2),
			angle: angle,
			convex: convex,
			dashLength: dashLength,
			uid: uid,
		};
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.c1.c) &&
			graphs.length_squared(mouse, obj.c1.c) <= graphs.length_squared(mouse, obj.c1.r.p2)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.c1.r.p2)) {
			selected.part = 2;
			return true;
		}
		const e1 = graphs.rotate_point(obj.c1.r.p2, obj.c1.c, obj.angle / 2);
		const e2 = graphs.rotate_point(obj.c1.r.p2, obj.c1.c, -obj.angle / 2);
		if (mouseOnPoint(mouse, e1)) {
			selected.part = 3;
			return true;
		}
		if (mouseOnPoint(mouse, e2)) {
			selected.part = 4;
			return true;
		}
		if (
			graphs.get_angle(obj.c1.r.p2, obj.c1.c, mouse) <= obj.angle &&
			Math.abs(graphs.length(mouse, obj.c1.c) - graphs.length(obj.c1.r.p1, obj.c1.r.p2)) <=
				clickExtent_line
		) {
			selected.part = 0;
			return true;
		}
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 0) {
			obj.c1.c.x += dx;
			obj.c1.c.y += dy;

			obj.c1.r.p1.x = obj.c1.c.x;
			obj.c1.r.p1.y = obj.c1.c.y;

			obj.c1.r.p2.x += dx;
			obj.c1.r.p2.y += dy;
		} else if (selected.part == 1) {
			obj.c1.c.x += dx;
			obj.c1.c.y += dy;

			obj.c1.r.p1.x = obj.c1.c.x;
			obj.c1.r.p1.y = obj.c1.c.y;
		} else if (selected.part == 2) {
			obj.c1.r.p2.x += dx;
			obj.c1.r.p2.y += dy;
		} else if (selected.part == 3 || selected.part == 4) {
			obj.angle = 2 * Math.abs(graphs.get_angle(mouse, obj.c1.c, obj.c1.r.p2));
		}
	},

	draw: function (obj) {
		c.beginPath();

		c.strokeStyle = colors.objects;
		c.lineWidth = 3;

		const centerX = obj.c1.c.x;
		const centerY = obj.c1.c.y;
		const r = obj.c1.r;
		const alpha = Math.atan2(r.p2.y - r.p1.y, r.p2.x - r.p1.x);
		c.arc(
			centerX,
			centerY,
			graphs.length_segment(r),
			alpha - obj.angle / 2,
			alpha + obj.angle / 2
		);

		c.stroke();
		c.lineWidth = 2;
		c.beginPath();

		const distance = graphs.length_segment(r) * obj.angle;
		const numDashes = Math.floor(distance / obj.dashLength);

		let p1 = obj.c1.r.p2;
		p1 = graphs.rotate_point(p1, obj.c1.c, -obj.angle / 2);

		for (let i = 1; i <= numDashes + 1; i++) {
			const dx = p1.x - obj.c1.c.x;
			const dy = p1.y - obj.c1.c.y;

			const lineAngle = Math.atan2(-dy, -dx);
			let dashAngle = lineAngle + Math.PI / 4;

			if (obj.convex != 1) dashAngle += Math.PI;

			const dxDash = obj.dashLength * Math.cos(dashAngle);
			const dyDash = obj.dashLength * Math.sin(dashAngle);

			c.moveTo(p1.x, p1.y);
			c.lineTo(p1.x + dxDash, p1.y + dyDash);

			p1 = graphs.rotate_point(p1, obj.c1.c, obj.angle / numDashes);
		}

		c.stroke();

		artist.draw_control_point("point", obj.c1.c.x, obj.c1.c.y);
	},

	getCollision: function (obj, ray1) {
		const colPoints = graphs.intersection(ray1, obj.c1);
		const dist1 = graphs.length(ray1.p1, colPoints[1]);
		const dist2 = graphs.length(ray1.p1, colPoints[2]);

		const alpha1 = graphs.get_angle(colPoints[1], obj.c1.r.p1, obj.c1.r.p2);
		const alpha2 = graphs.get_angle(colPoints[2], obj.c1.r.p1, obj.c1.r.p2);

		let colPoint = graphs.point(0, 0);
		colPoint.exist = false;
		let dist = 0;

		if (Math.abs(alpha1) <= obj.angle / 2 && Math.abs(alpha2) <= obj.angle / 2) {
			if (
				dist1 <= 1 ||
				!graphs.intersection_is_on_ray(colPoints[1], ray1) ||
				!colPoints[1].exist
			) {
				colPoint = colPoints[2];
				dist = dist2;
			} else if (
				dist2 <= 1 ||
				!graphs.intersection_is_on_ray(colPoints[2], ray1) ||
				!colPoints[2].exist
			) {
				colPoint = colPoints[1];
				dist = dist1;
			} else if (dist1 < dist2) {
				colPoint = colPoints[1];
				dist = dist1;
			} else {
				colPoint = colPoints[2];
				dist = dist2;
			}
		} else if (Math.abs(alpha1) <= obj.angle / 2) {
			colPoint = colPoints[1];
			dist = dist1;
		} else if (Math.abs(alpha2) <= obj.angle / 2) {
			colPoint = colPoints[2];
			dist = dist2;
		}

		if (colPoint.exist && graphs.intersection_is_on_ray(colPoint, ray1) && dist > 1) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	},

	getNewRay: function (obj, ray1, colPoint) {
		let i = graphs.get_angle(ray1.p1, colPoint, obj.c1.c);

		if (obj.convex == 1) {
			if (Math.abs(i) < Math.PI / 2) return { exist: false };

			i = i - Math.PI / 2;
		} else if (Math.abs(i) > Math.PI / 2) return { exist: false };

		const p3 = graphs.rotate_point(ray1.p1, colPoint, -i * 2);

		const newRay = graphs.ray(colPoint, p3);

		return newRay;
	},
};
