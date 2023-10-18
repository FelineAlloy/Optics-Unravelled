objTypes["screen"] = {
	create: function (point1, point2) {
		return { type: "screen", l1: graphs.line(point1, point2) };
	},

	// TODO: implement this
	selected: function (obj, mouse, dragginPart) {},

	draw: function (obj) {
		c.beginPath();

		c.strokeStyle = colors.objects;
		c.lineWidth = 4;

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);
		c.lineTo(obj.l1.p2.x, obj.l1.p2.y);

		c.stroke();
	},

	getCollision: function (obj, ray1) {
		const colPoint = graphs.intersection(ray1, obj.l1);
		const dist = graphs.length(ray1.p1, colPoint);
		//console.log(dist);

		if (graphs.intersection_is_on_ray(colPoint, ray1) && dist > 1) {
			return { point: colPoint, dist: dist };
		}

		colPoint.exist = false;
		return { point: colPoint, dist: dist };
	},

	getNewRay: function (obj, ray1, colPoint) {
		const newRay = graphs.ray(colPoint, colPoint);
		newRay.exist = false;
		return newRay;
	},
};
