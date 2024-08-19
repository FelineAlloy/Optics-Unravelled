objTypes["line"] = {
	create: function (
		point1 = graphs.point(-c.getTransform().e, canvas.height / 2 - c.getTransform().f),
		point2 = graphs.point(
			canvas.width - c.getTransform().e,
			canvas.height / 2 - c.getTransform().f
		),
		spaceLength = 10,
		dashLength = 15,
		thickness = 1,
		color = colors.objects,
		uid = uidGen()
	) {
		return {
			type: "line",
			l1: graphs.line(point1, point2),
			spaceLength: spaceLength,
			dashLength: dashLength,
			thickness: thickness,
			color: color,
			uid: uid,
		};
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.l1.p1) &&
			graphs.length_squared(obj.l1.p1, mouse) <= graphs.length_squared(obj.l1.p2, mouse)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.l1.p2)) {
			selected.part = 2;
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
		} else if (selected.part == 1) {
			obj.l1.p1.x += dx;
			obj.l1.p1.y += dy;
		} else if (selected.part == 2) {
			obj.l1.p2.x += dx;
			obj.l1.p2.y += dy;
		}
	},

	draw: function (obj) {
		const distance = graphs.length_segment(obj.l1);
		const numDashes = Math.floor(distance / (obj.dashLength + obj.spaceLength));

		const dx = obj.l1.p2.x - obj.l1.p1.x;
		const dy = obj.l1.p2.y - obj.l1.p1.y;

		const lineAngle = Math.atan2(dy, dx);

		const dxDash = obj.dashLength * Math.cos(lineAngle);
		const dyDash = obj.dashLength * Math.sin(lineAngle);

		const dxSpace = obj.spaceLength * Math.cos(lineAngle);
		const dySpace = obj.spaceLength * Math.sin(lineAngle);

		c.strokeStyle = obj.color;
		c.lineWidth = obj.thickness;
		c.beginPath();

		c.moveTo(obj.l1.p1.x, obj.l1.p1.y);

		for (let i = 0; i < numDashes; i++) {
			c.moveTo(obj.l1.p1.x + i * (dxDash + dxSpace), obj.l1.p1.y + i * (dyDash + dySpace));
			c.lineTo(
				obj.l1.p1.x + i * (dxDash + dxSpace) + dxDash,
				obj.l1.p1.y + i * (dyDash + dySpace) + dyDash
			);
		}

		if (numDashes * (obj.dashLength + obj.spaceLength) < distance) {
			c.moveTo(
				obj.l1.p1.x + numDashes * (dxDash + dxSpace),
				obj.l1.p1.y + numDashes * (dyDash + dySpace)
			);

			if (distance - numDashes * (obj.dashLength + obj.spaceLength) <= obj.dashLength)
				c.lineTo(obj.l1.p2.x, obj.l1.p2.y);
			else
				c.lineTo(
					obj.l1.p1.x + numDashes * (dxDash + dxSpace) + dxDash,
					obj.l1.p1.y + numDashes * (dyDash + dySpace) + dyDash
				);
		}

		c.stroke();
	},

	getCollision: function (obj, ray1) {
		return { point: { exist: false }, dist: null };
	},

	getNewRay: function (obj, ray1, colPoint) {
		return { exist: false };
	},
};
