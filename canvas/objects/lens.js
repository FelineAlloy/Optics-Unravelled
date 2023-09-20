function lens(point1, point2, f) {
	this.l1 = graphs.line(point1, point2);
	this.f = f;

	const normal = graphs.perpendicular_bisector(this.l1);
	const midpoint = graphs.midpoint(this.l1);
	this.fp1 = graphs.addPointAlongSegment(midpoint, normal.p1, this.f);
	this.fp2 = graphs.addPointAlongSegment(midpoint, normal.p2, this.f);

	// selectable objects
	this.selectables = [this.fp1, this.fp2, this.l1.p1, this.l1.p2];

	// required member functions
	this.draw = function () {
		c.beginPath();

		c.strokeStyle = "black";
		c.lineWidth = 3;

		c.moveTo(this.l1.p1.x, this.l1.p1.y);
		c.lineTo(this.l1.p2.x, this.l1.p2.y);

		const sgnf = Math.sign(this.f);
		const angle = Math.atan2(
			this.l1.p1.y - this.l1.p2.y,
			this.l1.p1.x - this.l1.p2.x
		);

		c.moveTo(
			this.l1.p1.x - sgnf * 15 * Math.cos(angle - Math.PI / 6),
			this.l1.p1.y - sgnf * 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(this.l1.p1.x, this.l1.p1.y);

		c.lineTo(
			this.l1.p1.x - sgnf * 15 * Math.cos(angle + Math.PI / 6),
			this.l1.p1.y - sgnf * 15 * Math.sin(angle + Math.PI / 6)
		);

		c.moveTo(
			this.l1.p2.x + sgnf * 15 * Math.cos(angle - Math.PI / 6),
			this.l1.p2.y + sgnf * 15 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(this.l1.p2.x, this.l1.p2.y);

		c.lineTo(
			this.l1.p2.x + sgnf * 15 * Math.cos(angle + Math.PI / 6),
			this.l1.p2.y + sgnf * 15 * Math.sin(angle + Math.PI / 6)
		);

		c.stroke();

		c.textAlign = "center";
		c.textBaseline = "middle";
		c.font = "20px Arial";
		c.fillText("f1", this.fp1.x, this.fp1.y);
		c.fillText("f2", this.fp2.x, this.fp2.y);

		//draw selectables

		c.fillStyle = "black";
		for (const item of this.selectables) {
			c.beginPath();
			c.arc(item.x, item.y, 2, 0, 2 * Math.PI);
			c.fill();
		}
	};

	this.getCollision = function (ray1) {
		const colPoint = graphs.intersection(ray1, this.l1);
		const dist = graphs.length(ray1.p1, colPoint);
		//console.log(dist);

		if (
			graphs.intersection_is_on_segment(colPoint, this.l1) &&
			graphs.intersection_is_on_ray(colPoint, ray1) &&
			dist > 1
		) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	};

	this.getNewRay = function (ray1, colPoint) {
		const midpoint = graphs.midpoint(this.l1);
		const parallelRay = graphs.parallel(ray1, midpoint);

		let focalPoint = this.fp1;
		const i1 = graphs.get_angle(this.l1.p1, this.l1.p2, ray1.p1);
		const i2 = graphs.get_angle(this.l1.p1, this.l1.p2, focalPoint);
		if ((i1 * i2 > 0 && this.f > 0) || (i1 * i2 < 0 && this.f < 0)) {
			focalPoint = this.fp2;
		}
		const focusPlane = graphs.parallel(this.l1, focalPoint);

		// c.stroke();
		// c.beginPath();

		// c.moveTo(parallelRay.p1.x, parallelRay.p1.y);
		// c.lineTo(parallelRay.p2.x, parallelRay.p2.y);

		// c.moveTo(focusPlane.p1.x, focusPlane.p1.y);
		// c.lineTo(focusPlane.p2.x, focusPlane.p2.y);

		// c.stroke();
		// c.beginPath();

		const newRay = graphs.ray(
			colPoint,
			graphs.intersection(parallelRay, focusPlane)
		);
		if (this.f < 0) {
			newRay.p2 = graphs.rotate_point(newRay.p2, newRay.p1, Math.PI);
		}

		return newRay;
	};
}
