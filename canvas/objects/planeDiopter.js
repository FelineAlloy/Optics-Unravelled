objTypes["planeDiopter"] = {
	create: function (p1, p2, n1, n2) {
		return { type: "planeDiopter", l1: graphs.line(p1, p2), n1: n1, n2: n2 };
	},

	// TODO: implement this
	selected: function (obj, mouse, dragginPart) {},

	// required member functions
	draw: function (obj) {
		c.beginPath();

		c.strokeStyle = colors.objects;
		c.lineWidth = 2;

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.stroke();

		const normal = graphs.perpendicular_bisector(obj.l1);
		const midpoint = graphs.midpoint(obj.l1);
		const p1 = graphs.addPointAlongSegment(midpoint, normal.p1, 20);
		const p2 = graphs.addPointAlongSegment(midpoint, normal.p2, 20);

		c.fillStyle = colors.text;
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.font = "20px Arial";
		c.fillText("n1", p1.x, p1.y);
		c.fillText("n2", p2.x, p2.y);
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

		let i = graphs.get_angle(ray1.p1, colPoint, normal.p1);
		let r = Math.asin((Math.sin(i) * obj.n1) / obj.n2);
		let p3 = normal.p2;

		//console.log(i * 180 / Math.PI);

		if (Math.abs(i) > Math.PI / 2) {
			p3 = normal.p1;
			i = graphs.get_angle(ray1.p1, colPoint, normal.p2);
			r = Math.asin((Math.sin(i) * obj.n2) / obj.n1);
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
	},
};
