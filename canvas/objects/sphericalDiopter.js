objTypes["sphericalDiopter_real"] = {
	create: function (point1, point2, angle, n1, n2, uid) {
		return {
			type: "sphericalDiopter_real",
			c1: graphs.circle(point1, point2),
			angle: angle,
			n1: n1,
			n2: n2,
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
		c.lineWidth = 2;

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

		const p1 = graphs.addPointAlongSegment(r.p2, r.p1, -20);
		const p2 = graphs.addPointAlongSegment(r.p2, r.p1, 20);

		c.fillStyle = colors.text;
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.font = "20px Arial";
		c.fillText(obj.n1.toString(), p1.x, p1.y);
		c.fillText(obj.n2.toString(), p2.x, p2.y);

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
		const normal = graphs.line(obj.c1.c, colPoint);

		let i = graphs.get_angle(ray1.p1, colPoint, normal.p1);
		// console.log(i * 180 / Math.PI);
		let r = Math.asin((Math.sin(i) * obj.n2) / obj.n1);
		let p3 = graphs.rotate_point(normal.p1, normal.p2, Math.PI);

		if (Math.abs(i) >= Math.PI / 2) {
			i = -Math.sign(i) * (Math.PI - Math.abs(i));
			r = Math.asin((Math.sin(i) * obj.n1) / obj.n2);
			// console.log(
			// 	(i * 180) / Math.PI,
			// 	(r * 180) / Math.PI,
			// 	(Math.sin(i) * obj.n1) / obj.n2
			// );
			p3 = normal.p1;
		}

		p4 = graphs.rotate_point(p3, colPoint, r);
		const newRay = graphs.ray(colPoint, p4);

		return newRay;
	},
};

// objTypes["sphericalDiopter"] = {
// 	...objTypes["sphericalDiopter_real"],
// 	create: function (point1, point2, angle, n1, n2, uid) {
// 		return {
// 			type: "sphericalDiopter",
// 			c1: graphs.circle(point1, point2),
// 			angle: angle,
// 			n1: n1,
// 			n2: n2,
// 			uid: uid,
// 		};
// 	},

// 	getNewRay: function (obj, ray1, colPoint) {
// 		const p1 = graphs.intersection(obj.c1.r, graphs.line(ray1.p1, ray1.p2));
// 		const vert = graphs.parallel(graphs.perpendicular_bisector(obj.c1.r), obj.c1.r.p2);

// 		const v1 = graphs.point();

// 		let x1 =
// 			Math.sign(graphs.get_angle(vert.p1, obj.c1.r.p2, p1)) * graphs.length(p1, obj.c1.r.p2);
// 		if (isNaN(p1.y)) {
// 			x1 = Math.sign(graphs.get_angle(vert.p1, obj.c1.r.p2, ray1.p1)) * 1e9;
// 		}

// 		const r = graphs.length_segment(obj.c1.r);

// 		const x2 = (obj.n2 * x1 * r) / (x1 * (obj.n2 - obj.n1) + r * obj.n1);
// 		console.log(x1, x2);

// 		let p2 = graphs.addPointAlongSegment(obj.c1.r.p2, obj.c1.r.p1, -x2);
// 		if (Math.abs(graphs.get_angle(p2, colPoint, ray1.p1)) < Math.PI / 2) {
// 			p2 = graphs.rotate_point(p2, colPoint, Math.PI);
// 		}

// 		const newRay = graphs.ray(colPoint, p2);

// 		return newRay;
// 	},
// };

// e prea greu sa implementez asa ceva cum trebuie (trebuia sa modeleze dioptrul sferic in aproximatie gausiana)
