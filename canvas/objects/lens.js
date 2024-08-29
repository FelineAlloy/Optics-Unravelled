objTypes["lens"] = {
	create: function (
		point1 = graphs.point(...reverseTransform(dispalyWidth / 2, displayHeight / 3)),
		point2 = graphs.point(...reverseTransform(dispalyWidth / 2, (displayHeight * 2) / 3)),
		f = 200,
		uid = uidGen()
	) {
		const l1 = graphs.line(point1, point2);
		const normal = graphs.perpendicular_bisector(l1);
		const midpoint = graphs.midpoint(l1);

		return {
			type: "lens",
			l1: l1,
			f: f, // f is signed (f<0 means divergent lens and f>0 means convergent lens)
			fp1: graphs.addPointAlongSegment(midpoint, normal.p1, f),
			fp2: graphs.addPointAlongSegment(midpoint, normal.p2, f),
			convergent: Math.sign(f), // convergent only keeps track of the sign of f
			uid: uid,
		};
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.l1.p1) &&
			graphs.length_squared(obj.l1.p1, mouse) <= graphs.length_squared(obj.l1.p2, mouse) &&
			graphs.length_squared(obj.l1.p1, mouse) <= graphs.length_squared(obj.fp1, mouse) &&
			graphs.length_squared(obj.l1.p1, mouse) <= graphs.length_squared(obj.fp2, mouse)
		) {
			selected.part = 1;
			return true;
		}
		if (
			mouseOnPoint(mouse, obj.l1.p2) &&
			graphs.length_squared(obj.l1.p2, mouse) <= graphs.length_squared(obj.fp2, mouse) &&
			graphs.length_squared(obj.l1.p2, mouse) <= graphs.length_squared(obj.fp2, mouse)
		) {
			selected.part = 2;
			return true;
		}
		if (
			mouseOnPoint(mouse, obj.fp1) &&
			graphs.length_squared(obj.fp1, mouse) <= graphs.length_squared(obj.fp2, mouse)
		) {
			selected.part = 3;
			return true;
		}
		if (mouseOnPoint(mouse, obj.fp2)) {
			selected.part = 4;
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

			obj.fp1.x += dx;
			obj.fp1.y += dy;

			obj.fp2.x += dx;
			obj.fp2.y += dy;
		} else if (selected.part == 1) {
			const midpoint = graphs.midpoint(obj.l1);

			obj.l1.p1.x += dx;
			obj.l1.p1.y += dy;

			const len = graphs.length(midpoint, obj.l1.p1);
			obj.l1.p2 = graphs.addPointAlongSegment(midpoint, obj.l1.p1, -len);
			const normal = graphs.perpendicular_bisector(obj.l1);

			obj.fp1 = graphs.addPointAlongSegment(midpoint, normal.p1, obj.f);
			obj.fp2 = graphs.addPointAlongSegment(midpoint, normal.p2, obj.f);
		} else if (selected.part == 2) {
			const midpoint = graphs.midpoint(obj.l1);

			obj.l1.p2.x += dx;
			obj.l1.p2.y += dy;

			const len = graphs.length(midpoint, obj.l1.p2);
			obj.l1.p1 = graphs.addPointAlongSegment(midpoint, obj.l1.p2, -len);
			const normal = graphs.perpendicular_bisector(obj.l1);

			obj.fp1 = graphs.addPointAlongSegment(midpoint, normal.p1, obj.f);
			obj.fp2 = graphs.addPointAlongSegment(midpoint, normal.p2, obj.f);
		} else if (selected.part == 3) {
			const p0 = graphs.point(obj.fp1.x, obj.fp1.y);

			obj.fp1.x += dx;
			obj.fp1.y += dy;

			const midpoint = graphs.midpoint(obj.l1);
			const alpha = graphs.get_angle(obj.fp1, midpoint, p0);

			obj.f = graphs.length(midpoint, obj.fp1) * obj.convergent;
			obj.fp2 = graphs.addPointAlongSegment(midpoint, obj.fp1, -Math.abs(obj.f));

			obj.l1.p1 = graphs.rotate_point(obj.l1.p1, midpoint, alpha);
			obj.l1.p2 = graphs.rotate_point(obj.l1.p2, midpoint, alpha);
		} else if (selected.part == 4) {
			const p0 = graphs.point(obj.fp2.x, obj.fp2.y);

			obj.fp2.x += dx;
			obj.fp2.y += dy;

			const midpoint = graphs.midpoint(obj.l1);
			const alpha = graphs.get_angle(obj.fp2, midpoint, p0);

			obj.f = graphs.length(midpoint, obj.fp2) * obj.convergent;
			obj.fp1 = graphs.addPointAlongSegment(midpoint, obj.fp2, -Math.abs(obj.f));

			obj.l1.p1 = graphs.rotate_point(obj.l1.p1, midpoint, alpha);
			obj.l1.p2 = graphs.rotate_point(obj.l1.p2, midpoint, alpha);
		}
	},

	draw: function (obj) {
		c.beginPath();

		c.strokeStyle = colors.objects;
		c.lineWidth = 3;

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		const angle = Math.atan2(obj.l1.p1.y - obj.l1.p2.y, obj.l1.p1.x - obj.l1.p2.x);

		c.moveTo(
			obj.l1.p1.x - obj.convergent * 15 * Math.cos(angle - Math.PI / 6),
			obj.l1.p1.y - obj.convergent * 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(obj.l1.p1.x, obj.l1.p1.y);

		c.lineTo(
			obj.l1.p1.x - obj.convergent * 15 * Math.cos(angle + Math.PI / 6),
			obj.l1.p1.y - obj.convergent * 15 * Math.sin(angle + Math.PI / 6)
		);

		c.moveTo(
			obj.l1.p2.x + obj.convergent * 15 * Math.cos(angle - Math.PI / 6),
			obj.l1.p2.y + obj.convergent * 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.lineTo(
			obj.l1.p2.x + obj.convergent * 15 * Math.cos(angle + Math.PI / 6),
			obj.l1.p2.y + obj.convergent * 15 * Math.sin(angle + Math.PI / 6)
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
		if (obj.convergent < 0) {
			newRay.p2 = graphs.rotate_point(newRay.p2, newRay.p1, Math.PI);
		}

		return newRay;
	},
};
