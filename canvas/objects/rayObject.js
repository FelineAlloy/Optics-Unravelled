objTypes["rayObject"] = {
	create: function (p1, p2) {
		return { type: "rayObject", ray: graphs.ray(p1, p2) };
	},

	selected: function (obj, mouse, selected) {
		if (
			mouseOnPoint(mouse, obj.ray.p1) &&
			graphs.length_squared(mouse, obj.ray.p1) <= graphs.length_squared(mouse, obj.ray.p2)
		) {
			selected.part = 1;
			return true;
		}
		if (mouseOnPoint(mouse, obj.ray.p2)) {
			selected.part = 2;
			return true;
		}
	},

	c_mousemove: function (obj, dx, dy) {
		if (selected.part == 1) {
			obj.ray.p1.x += dx;
			obj.ray.p1.y += dy;
		} else if (selected.part == 2) {
			obj.ray.p2.x += dx;
			obj.ray.p2.y += dy;
		}
	},

	draw: function (obj) {
		const angle = Math.atan2(obj.ray.p2.y - obj.ray.p1.y, obj.ray.p2.x - obj.ray.p1.x);

		c.beginPath();
		c.strokeStyle = colors.objects;
		c.lineWidth = 3;

		c.moveTo(
			obj.ray.p2.x - 10 * Math.cos(angle - Math.PI / 6),
			obj.ray.p2.y - 10 * Math.sin(angle - Math.PI / 6)
		);

		c.lineTo(obj.ray.p2.x, obj.ray.p2.y);

		c.lineTo(
			obj.ray.p2.x - 10 * Math.cos(angle + Math.PI / 6),
			obj.ray.p2.y - 10 * Math.sin(angle + Math.PI / 6)
		);

		c.stroke();

		c.beginPath();
		c.arc(obj.ray.p1.x, obj.ray.p1.y, 5, 0, 2 * Math.PI);
		c.stroke();
		c.beginPath();
		c.fillStyle = colors.objects;
		c.arc(obj.ray.p1.x, obj.ray.p1.y, 2, 0, 2 * Math.PI);
		c.fill();
	},
};
