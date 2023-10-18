objTypes["lens"] = {
	create: function (point1, point2, f) {
		const l1 = graphs.line(point1, point2);
		const normal = graphs.perpendicular_bisector(l1);
		const midpoint = graphs.midpoint(l1);

		return {
			type: "lens",
			l1: l1,
			f: f,
			fp1: graphs.addPointAlongSegment(midpoint, normal.p1, f),
			fp2: graphs.addPointAlongSegment(midpoint, normal.p2, f),
		};
	},

	// TODO: implement this
	selected: function (obj, mouse, dragginPart) {},

	draw: function (obj) {
		c.beginPath();

		c.strokeStyle = colors.objects;
		c.lineWidth = 3;

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		const sgnf = Math.sign(obj.f);
		const angle = Math.atan2(obj.l1.p1.y - obj.l1.p2.y, obj.l1.p1.x - obj.l1.p2.x);

		c.moveTo(
			obj.l1.p1.x - sgnf * 15 * Math.cos(angle - Math.PI / 6),
			obj.l1.p1.y - sgnf * 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(obj.l1.p1.x, obj.l1.p1.y);

		c.lineTo(
			obj.l1.p1.x - sgnf * 15 * Math.cos(angle + Math.PI / 6),
			obj.l1.p1.y - sgnf * 15 * Math.sin(angle + Math.PI / 6)
		);

		c.moveTo(
			obj.l1.p2.x + sgnf * 15 * Math.cos(angle - Math.PI / 6),
			obj.l1.p2.y + sgnf * 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.lineTo(
			obj.l1.p2.x + sgnf * 15 * Math.cos(angle + Math.PI / 6),
			obj.l1.p2.y + sgnf * 15 * Math.sin(angle + Math.PI / 6)
		);

		c.stroke();

		c.fillStyle = colors.text;
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.font = "20px Arial";
		c.fillText("f1", obj.fp1.x, obj.fp1.y);
		c.fillText("f2", obj.fp2.x, obj.fp2.y);
	},

	getCollision: function (obj, ray1) {
		const colPoint = graphs.intersection(ray1, obj.l1);
		const dist = graphs.length(ray1.p1, colPoint);
		//console.log(dist);

		if (
			graphs.intersection_is_on_segment(colPoint, obj.l1) &&
			graphs.intersection_is_on_ray(colPoint, ray1) &&
			dist > 1
		) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	},

	getNewRay: function (obj, ray1, colPoint) {
		const midpoint = graphs.midpoint(obj.l1);
		const parallelRay = graphs.parallel(ray1, midpoint);

		let focalPoint = obj.fp1;
		const i1 = graphs.get_angle(obj.l1.p1, obj.l1.p2, ray1.p1);
		const i2 = graphs.get_angle(obj.l1.p1, obj.l1.p2, focalPoint);
		if ((i1 * i2 > 0 && obj.f > 0) || (i1 * i2 < 0 && obj.f < 0)) {
			focalPoint = obj.fp2;
		}
		const focusPlane = graphs.parallel(obj.l1, focalPoint);

		// c.stroke();
		// c.beginPath();

		// c.moveTo(parallelRay.p1.x, parallelRay.p1.y);
		// c.lineTo(parallelRay.p2.x, parallelRay.p2.y);

		// c.moveTo(focusPlane.p1.x, focusPlane.p1.y);
		// c.lineTo(focusPlane.p2.x, focusPlane.p2.y);

		// c.stroke();
		// c.beginPath();

		const newRay = graphs.ray(colPoint, graphs.intersection(parallelRay, focusPlane));
		if (obj.f < 0) {
			newRay.p2 = graphs.rotate_point(newRay.p2, newRay.p1, Math.PI);
		}

		return newRay;
	},
};
