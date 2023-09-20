function planeDiopter(point1, point2, n1, n2) {
	this.l1 = graphs.line(point1, point2);
	this.n1 = n1;
	this.n2 = n2;

	// selectable objects
	this.selectables = [this.l1.p1, this.l1.p2];

	// required member functions
	this.draw = function () {
		c.beginPath();

		c.strokeStyle = "black";
		c.lineWidth = 2;

		c.moveTo(this.l1.p1.x, this.l1.p1.y);
		c.lineTo(this.l1.p2.x, this.l1.p2.y);

		c.stroke();

		const normal = graphs.perpendicular_bisector(this.l1);
		const midpoint = graphs.midpoint(this.l1);
		const p1 = graphs.addPointAlongSegment(midpoint, normal.p1, 20);
		const p2 = graphs.addPointAlongSegment(midpoint, normal.p2, 20);

		c.textAlign = "center";
		c.textBaseline = "middle";
		c.font = "20px Arial";
		c.fillText("n1", p1.x, p1.y);
		c.fillText("n2", p2.x, p2.y);

		//draw selectables
		c.beginPath();
		c.fillStyle = "black";
		for (const item of this.selectables) {
			c.arc(item.x, item.y, 2, 0, 2 * Math.PI);
		}
		c.fill();
	};

	this.getCollision = function (ray1) {
		const colPoint = graphs.intersection(ray1, this.l1);
		const dist = graphs.length(ray1.p1, colPoint);
		//console.log(dist);

		if (graphs.intersection_is_on_ray(colPoint, ray1) && dist > 1) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	};

	this.getNewRay = function (ray1, colPoint) {
		const normal = graphs.parallel(
			graphs.perpendicular_bisector(this.l1),
			colPoint
		);

		let i = graphs.get_angle(ray1.p1, colPoint, normal.p1);
		let r = Math.asin((Math.sin(i) * n1) / n2);
		let p3 = normal.p2;

		//console.log(i * 180 / Math.PI);

		if (Math.abs(i) > Math.PI / 2) {
			p3 = normal.p1;
			i = graphs.get_angle(ray1.p1, colPoint, normal.p2);
			r = Math.asin((Math.sin(i) * n2) / n1);
			//console.log(i * 180 / Math.PI, r * 180 / Math.PI);
		}

		// c.stroke();
		// c.beginPath();
		// c.moveTo(colPoint.x, colPoint.y);
		// c.lineTo(p3.x, p3.y);
		// c.stroke();
		// c.beginPath();

		p4 = graphs.rotate_point(p3, colPoint, r);
		const newRay = graphs.ray(colPoint, p4);

		return newRay;
	};
}
