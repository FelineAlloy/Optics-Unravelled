function screen(point1, point2) {
	this.l1 = graphs.line(point1, point2);

	// selectable objects
	this.selectables = [this.l1.p1, this.l1.p2];

	// required member functions
	this.draw = function () {
		c.beginPath();

		c.strokeStyle = "black";
		c.lineWidth = 4;

		c.moveTo(this.l1.p1.x, this.l1.p1.y);
		c.lineTo(this.l1.p2.x, this.l1.p2.y);

		c.stroke();

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
		const newRay = graphs.ray(colPoint, colPoint);
		newRay.exist = false;
		return newRay;
	};
}
