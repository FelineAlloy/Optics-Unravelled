objTypes["sphericalDiopter"] = {
	create: function (point1, point2, angle, n1, n2) {
		return {
			type: "sphericalDiopter",
			c1: graphs.circle(point1, point2),
			angle: angle,
			n1: n1,
			n2: n2,
		};
	},

	// TODO: implement this
	selected: function (obj, mouse, dragginPart) {},

	// required member functions
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
		c.fillText("n1", p1.x, p1.y);
		c.fillText("n2", p2.x, p2.y);
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
			if (dist1 < dist2) {
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
